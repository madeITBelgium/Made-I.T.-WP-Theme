<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Sliding-window rate limiter.
 * Stores counters in WordPress transients (MySQL fallback).
 * Upgrades to APCu automatically if available.
 */
class RateLimiter {

    // Endpoint category => [ requests, window_seconds ]
    private const DEFAULTS = [
        'frontend'    => [ 60,  60   ],
        'login'       => [ 15,  300  ],
        'search'      => [ 15,  60   ],
        'feed'        => [ 10,  60   ],
        'sitemap'     => [ 5,   3600 ],
        'ajax'        => [ 60,  60   ],
        'rest'        => [ 60,  60   ],
        'rest_unauth' => [ 30,  60   ],
        'woo_checkout'=> [ 5,   60   ],
        'xmlrpc'      => [ 3,   300   ],
        'cron'        => [ 1,   60   ],
    ];

    public static function init(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_rate_limit_enabled', true ) ) return;
        if ( defined( 'MADEIT_SECURITY_BLOCKING_DISABLED' ) && MADEIT_SECURITY_BLOCKING_DISABLED ) return;

        // Hook very early
        add_action( 'init', [ __CLASS__, 'check_request' ], 2 );
    }

    public static function check_request(): void {
        if ( defined( 'WP_CLI' ) && WP_CLI )       return;
        if ( defined( 'DOING_CRON' ) && DOING_CRON ) return;

        // Never rate-limit wp-admin paths (wp-login.php is handled by 'login' category)
        $raw_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/'; // phpcs:ignore WordPress.Security.NonceVerification.Missing
        $path    = strtok( $raw_uri, '?' );
        if ( str_starts_with( $path, '/wp-admin' ) ) return;

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();

        // Whitelisted IPs bypass rate limiting
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) return;
        $category = self::categorize_request();

        if ( ! $category ) return;

        $limits = self::get_limits( $category );
        if ( ! $limits ) return;

        [ $max_req, $window ] = $limits;

        if ( self::is_exceeded( $ip, $category, $max_req, $window ) ) {
            self::throttle_response( $category, $window );
        }
    }

    // ── Categorize the current request ────────────────────────────────────────
    // phpcs:disable WordPress.Security.NonceVerification, WordPress.Security.ValidatedSanitizedInput -- rate limiter reads raw request data; nonce is not applicable
    private static function categorize_request(): ?string {
        $uri    = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
        $path   = strtok( $uri, '?' );
        $method = strtoupper( $_SERVER['REQUEST_METHOD'] ?? 'GET' );

        if ( str_ends_with( $path, '/wp-login.php' ) )             return 'login';
        if ( str_ends_with( $path, '/wp-cron.php' ) )              return 'cron';
        if ( str_ends_with( $path, '/xmlrpc.php' ) )               return 'xmlrpc';
        if ( str_ends_with( $path, '/wp-admin/admin-ajax.php' ) )  return 'ajax';
        if ( str_contains( $path, '/wp-json/' ) )                  return is_user_logged_in() ? 'rest' : 'rest_unauth';
        if ( isset( $_GET['s'] ) )                                  return 'search';
        if ( str_contains( $path, '/feed' ) || isset( $_GET['feed'] ) ) return 'feed';
        if ( str_contains( $path, 'sitemap' ) )                    return 'sitemap';
        if ( str_contains( $path, '/checkout' ) )                  return 'woo_checkout';

        // Generic frontend (only GET, only non-admin)
        if ( $method === 'GET' && ! str_starts_with( $path, '/wp-admin' ) ) return 'frontend';

        return null;
    }
    // phpcs:enable

    // ── Sliding window counter ────────────────────────────────────────────────
    private static function is_exceeded( string $ip, string $cat, int $max, int $window ): bool {
        $key   = 'madeit_security_rl_' . hash( 'sha256', $ip . '|' . $cat );
        $now   = time();
        $floor = $now - $window;

        // APCu path (fastest — no DB)
        if ( function_exists( 'apcu_fetch' ) ) {
            $hits = apcu_fetch( $key ) ?: [];
            $hits = array_filter( $hits, fn( $t ) => $t > $floor );
            $hits[] = $now;
            apcu_store( $key, $hits, $window + 10 );
            return count( $hits ) > $max;
        }

        // WordPress object cache / transients
        $hits  = get_transient( $key ) ?: [];
        $hits  = array_values( array_filter( $hits, fn( $t ) => $t > $floor ) );
        $hits[] = $now;
        set_transient( $key, $hits, $window + 10 );
        return count( $hits ) > $max;
    }

    private static function throttle_response( string $category, int $window ): void {
        global $wpdb;

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();

        // Log event
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'rate_limited',
                'severity'    => 'medium',
                'ip'          => $ip,
                'user_id'     => get_current_user_id(),
                'url'         => home_url( isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/' ), // phpcs:ignore WordPress.Security.NonceVerification.Missing -- rate limiter runs on every request
                'method'      => strtoupper( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) ) ), // phpcs:ignore WordPress.Security.NonceVerification.Missing
                'rule_id'     => 'ratelimit_' . $category,
                'description' => "Rate limit exceeded: $category endpoint",
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s','%s','%s','%d','%s','%s','%s','%s','%s' ]
        );

        if ( headers_sent() ) return;

        http_response_code( 429 );
        header( 'Retry-After: ' . $window );
        header( 'Content-Type: application/json; charset=utf-8' );
        echo wp_json_encode( [
            'error'       => 'Too Many Requests',
            'message'     => 'You have exceeded the request rate limit. Please slow down.',
            'retry_after' => $window,
        ] );
        exit;
    }

    private static function get_limits( string $cat ): ?array {
        // Admin can override each category limit
        $custom_max    = \MadeIT\Security\Settings::int( "madeit_security_rate_{$cat}_max", 0 );
        $custom_window = \MadeIT\Security\Settings::int( "madeit_security_rate_{$cat}_window", 0 );

        if ( $custom_max > 0 && $custom_window > 0 ) {
            return [ $custom_max, $custom_window ];
        }

        $limits = self::DEFAULTS[ $cat ] ?? null;
        if ( ! $limits ) return null;

        // Webshops (WooCommerce) often hit wp-login.php for account auth/reset flows,
        // so allow a less aggressive login threshold by default.
        if ( $cat === 'login' && self::is_woocommerce_active() ) {
            $limits[0] = max( (int) $limits[0], 30 );
        }

        return $limits;
    }

    private static function is_woocommerce_active(): bool {
        return class_exists( 'WooCommerce' );
    }

    public static function get_defaults(): array { return self::DEFAULTS; }
}
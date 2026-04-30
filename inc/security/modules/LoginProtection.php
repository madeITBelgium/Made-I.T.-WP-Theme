<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

class LoginProtection {

    public static function init(): void {
        // Brute force tracking
        add_action( 'wp_login_failed', [ __CLASS__, 'on_login_failed' ] );
        add_filter( 'authenticate',    [ __CLASS__, 'check_lockout' ], 30, 3 );

        // Generic error messages (prevent username enumeration)
        add_filter( 'login_errors',    [ __CLASS__, 'generic_error' ] );
        add_filter( 'lost_password_errors', [ __CLASS__, 'generic_error' ] );

        // Author enumeration block
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_block_author_enum', true ) ) {
            add_action( 'template_redirect', [ __CLASS__, 'block_author_enum' ] );
        }

        // Hide WP version
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_hide_wp_version', true ) ) {
            remove_action( 'wp_head', 'wp_generator' );
            add_filter( 'the_generator', '__return_empty_string' );
            add_filter( 'script_loader_src', [ __CLASS__, 'remove_version_query' ], 15, 1 );
            add_filter( 'style_loader_src',  [ __CLASS__, 'remove_version_query' ], 15, 1 );
        }
    }

    public static function on_login_failed( string $username ): void {
        self::register_failed_attempt( $username, 'credentials' );
    }

    public static function register_failed_attempt( string $username, string $source = 'credentials' ): int {
        global $wpdb;
        $ip = \MadeIT\Security\RequestLogger::get_real_ip();

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache

        // Attempt atomic increment first to avoid TOCTOU race conditions
        $updated = $wpdb->query( $wpdb->prepare(
            "UPDATE {$wpdb->prefix}madeit_security_login_attempts
                SET attempt_count = attempt_count + 1, last_attempt = %s
            WHERE ip = %s",
            current_time( 'mysql' ),
            $ip
        ) );

        if ( $updated === false ) {
            // DB error — default to 1 to be safe
            $count = 1;
        } elseif ( $updated > 0 ) {
            $count = (int) $wpdb->get_var( $wpdb->prepare(
                "SELECT attempt_count FROM {$wpdb->prefix}madeit_security_login_attempts WHERE ip = %s LIMIT 1", $ip
            ) );
        } else {
            $wpdb->insert(
                $wpdb->prefix . 'madeit_security_login_attempts',
                [ 'ip' => $ip, 'attempt_count' => 1, 'last_attempt' => current_time( 'mysql' ) ],
                [ '%s','%d','%s' ]
            );
            $count = 1;
        }

        // Calculate lockout
        $max = \MadeIT\Security\Settings::int( 'madeit_security_login_max_attempts', 5 );
        $lock = 0;
        if ( $count >= $max ) {
            $durations = [
                $max           => \MadeIT\Security\Settings::int( 'madeit_security_login_lockout_1', 300 ),
                $max * 2       => \MadeIT\Security\Settings::int( 'madeit_security_login_lockout_2', 1800 ),
                $max * 4       => \MadeIT\Security\Settings::int( 'madeit_security_login_lockout_3', 86400 ),
            ];
            $lock = 300;
            foreach ( $durations as $threshold => $dur ) {
                if ( $count >= $threshold ) {
                    $lock = $dur;
                }
            }

            $until = wp_date( 'Y-m-d H:i:s', time() + $lock );
            $wpdb->update(
                $wpdb->prefix . 'madeit_security_login_attempts',
                [ 'locked_until' => $until ],
                [ 'ip' => $ip ],
                [ '%s' ], [ '%s' ]
            );

            // Proactive block list insertion once the lockout threshold is hit.
            if ( class_exists( '\\MadeIT\\Security\\modules\\IPManager' ) ) {
                $reason = sprintf( 'Too many failed login attempts (%d) via %s', $count, $source );
                \MadeIT\Security\modules\IPManager::block_ip( $ip, $reason, $lock, 'login_bruteforce', 0 );
            }
        }

        // Log security event
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'login_failed',
                'severity'    => $count >= $max ? 'high' : 'medium',
                'ip'          => $ip,
                'url'         => wp_login_url(),
                'method'      => 'POST',
                'description' => sprintf( 'Failed login attempt #%d (source: %s, user: %s)', $count, $source, esc_html( $username ) ),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s','%s','%s','%s','%s','%s','%s' ]
        );

        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        return $count;
    }

    public static function check_lockout( $user, $username, $password ) {
        if ( empty( $username ) ) return $user;

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();

        // Whitelisted IPs bypass lockout entirely
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) return $user;

        global $wpdb;
        $now = current_time( 'mysql' );
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $row = $wpdb->get_row( $wpdb->prepare(
            "SELECT locked_until FROM {$wpdb->prefix}madeit_security_login_attempts
            WHERE ip = %s AND locked_until IS NOT NULL AND locked_until > %s LIMIT 1",
            $ip,
            $now
        ) );
        if ( $row ) {
            $remaining = human_time_diff( time(), strtotime( $row->locked_until ) );
            return new \WP_Error( 'madeit_security_locked', sprintf(
                /* translators: %s: human-readable time remaining (e.g. "5 minutes") */
                __( 'Too many failed attempts. Try again in %s.', 'madeit' ),
                $remaining
            ) );
        }
        return $user;
    }

    public static function generic_error(): string {
        return __( 'Login failed. Please check your credentials and try again.', 'madeit' );
    }

    public static function block_author_enum(): void {
        if ( isset( $_GET['author'] ) && ! is_admin() ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- frontend enumeration block, no form context
            wp_safe_redirect( home_url( '/' ), 301 );
            exit;
        }
    }

    public static function remove_version_query( string $src ): string {
        if ( str_contains( $src, '?ver=' ) ) {
            $src = remove_query_arg( 'ver', $src );
        }
        return $src;
    }
}
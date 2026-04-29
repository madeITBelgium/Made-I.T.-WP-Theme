<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * REST API Micro-Policies.
 *
 * Per-namespace, per-route security rules for the WordPress REST API.
 * Provides granular control instead of all-or-nothing blocking:
 * authentication requirements, method restrictions, per-route rate
 * limiting, and IP whitelisting — all configurable per policy rule.
 */
class RestApiPolicy {

    /** Option keys. */
    private const OPT_ENABLED  = 'madeit_security_rest_policies_enabled';
    private const OPT_POLICIES = 'madeit_security_rest_policies';

    /** Transient prefix for rate-limit counters. */
    private const RL_PREFIX = 'madeit_security_rest_rl_';

    /** Rate-limit window in seconds (sliding). */
    private const RL_WINDOW = 60;

    // ── Bootstrap ─────────────────────────────────────────────────────────────

    public static function init(): void {
        // REST request interception.
        if ( \MadeIT\Security\Settings::bool( self::OPT_ENABLED, true ) ) {
            add_filter( 'rest_pre_dispatch', [ __CLASS__, 'enforce_policies' ], 10, 3 );
        }

        // AJAX handlers (admin only).
        add_action( 'wp_ajax_madeit_security_get_rest_policies',  [ __CLASS__, 'ajax_get_policies' ] );
        add_action( 'wp_ajax_madeit_security_save_rest_policies', [ __CLASS__, 'ajax_save_policies' ] );
        add_action( 'wp_ajax_madeit_security_get_rest_api_stats', [ __CLASS__, 'ajax_get_stats' ] );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. REQUEST INTERCEPTION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Hooked into `rest_pre_dispatch`.
     *
     * @param mixed            $result  Pre-dispatch result (null to continue).
     * @param \WP_REST_Server  $server  REST server instance.
     * @param \WP_REST_Request $request Current request object.
     * @return mixed WP_Error on block, otherwise the original $result.
     */
    public static function enforce_policies( $result, \WP_REST_Server $server, \WP_REST_Request $request ) {
        // If a previous filter already short-circuited, honour it.
        if ( null !== $result ) {
            return $result;
        }

        // Skip CLI and cron contexts.
        if ( ( defined( 'WP_CLI' ) && WP_CLI ) || ( defined( 'DOING_CRON' ) && DOING_CRON ) ) {
            return $result;
        }

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();

        // Whitelisted IPs bypass all REST policies.
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) {
            return $result;
        }

        $route     = $request->get_route();                    // e.g. "/wp/v2/users"
        $method    = strtoupper( $request->get_method() );     // GET, POST, etc.
        $logged_in = is_user_logged_in();

        $policies = self::get_policies();

        foreach ( $policies as $policy ) {
            // Skip disabled policies.
            if ( ! empty( $policy['disabled'] ) ) {
                continue;
            }

            // ── Namespace match ───────────────────────────────────────────────
            if ( ! empty( $policy['namespace'] ) ) {
                $ns_prefix = '/' . ltrim( $policy['namespace'], '/' );
                if ( ! str_starts_with( $route, $ns_prefix ) ) {
                    continue;
                }
            }

            // ── Route pattern match (regex) ───────────────────────────────────
            if ( ! empty( $policy['route_pattern'] ) ) {
                // Ensure the pattern has delimiters.
                $pattern = $policy['route_pattern'];
                if ( @preg_match( $pattern, '' ) === false ) {
                    // Invalid regex — skip this policy.
                    continue;
                }
                if ( ! preg_match( $pattern, $route ) ) {
                    continue;
                }
            }

            // ── IP whitelist (per-policy) ─────────────────────────────────────
            if ( ! empty( $policy['ip_whitelist'] ) && is_array( $policy['ip_whitelist'] ) ) {
                if ( in_array( $ip, $policy['ip_whitelist'], true ) ) {
                    // This policy explicitly allows this IP — skip enforcement.
                    continue;
                }
            }

            // ── Capability bypass ─────────────────────────────────────────────
            // A policy can opt out for authenticated users who hold a specific
            // capability — this is what lets the default "block writes" rule
            // refuse unauthenticated POST/PUT/DELETE to /wp/v2/* while still
            // allowing editors, authors, and other legitimate content creators
            // through. Without it, the Gutenberg editor breaks for everyone
            // who is not an administrator.
            if ( $logged_in && ! empty( $policy['bypass_cap'] ) ) {
                $cap = sanitize_key( $policy['bypass_cap'] );
                if ( $cap !== '' && current_user_can( $cap ) ) {
                    continue;
                }
            }

            // ── Method restriction ────────────────────────────────────────────
            if ( ! empty( $policy['methods'] ) && is_array( $policy['methods'] ) ) {
                $allowed_methods = array_map( 'strtoupper', $policy['methods'] );
                if ( ! in_array( $method, $allowed_methods, true ) ) {
                    self::log_block( $policy, $ip, $route, $method, 'Method not allowed' );
                    return new \WP_Error(
                        'rest_method_not_allowed',
                        sprintf(
                            /* translators: %s: HTTP method */
                            __( 'Method %s is not allowed for this endpoint.', 'madeit' ),
                            $method
                        ),
                        [ 'status' => 405 ]
                    );
                }
            }

            // ── Authentication requirement ────────────────────────────────────
            if ( ! empty( $policy['auth_required'] ) && ! $logged_in ) {
                self::log_block( $policy, $ip, $route, $method, 'Authentication required' );
                return new \WP_Error(
                    'rest_not_authenticated',
                    __( 'Authentication is required to access this endpoint.', 'madeit' ),
                    [ 'status' => 401 ]
                );
            }

            // ── Rate limiting ─────────────────────────────────────────────────
            $rate_limit = isset( $policy['rate_limit'] ) ? (int) $policy['rate_limit'] : 0;
            if ( $rate_limit > 0 ) {
                // Authenticated users with the manage_options capability skip rate limits.
                if ( $logged_in && current_user_can( 'manage_options' ) ) {
                    continue;
                }

                $route_hash = hash( 'sha256', $route );
                $ns_key     = sanitize_key( $policy['namespace'] ?? 'global' );
                $rl_key     = self::RL_PREFIX . hash( 'sha256', $ip . '|' . $ns_key . '|' . $route_hash );

                if ( self::is_rate_limited( $rl_key, $rate_limit ) ) {
                    self::log_block( $policy, $ip, $route, $method, 'Rate limit exceeded' );
                    return new \WP_Error(
                        'rest_rate_limit_exceeded',
                        __( 'Rate limit exceeded. Please slow down.', 'madeit' ),
                        [ 'status' => 429 ]
                    );
                }
            }
        }

        return $result;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. RATE LIMITING (sliding-window counter)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Returns true if the current request exceeds the per-minute limit.
     */
    private static function is_rate_limited( string $key, int $max_per_minute ): bool {
        $now   = time();
        $floor = $now - self::RL_WINDOW;

        // APCu (fastest — no DB hit).
        if ( function_exists( 'apcu_fetch' ) ) {
            $hits = apcu_fetch( $key ) ?: [];
            $hits = array_filter( $hits, fn( $t ) => $t > $floor );
            $hits[] = $now;
            apcu_store( $key, $hits, self::RL_WINDOW + 10 );
            return count( $hits ) > $max_per_minute;
        }

        // WordPress transients fallback.
        $hits  = get_transient( $key ) ?: [];
        $hits  = array_values( array_filter( $hits, fn( $t ) => $t > $floor ) );
        $hits[] = $now;
        set_transient( $key, $hits, self::RL_WINDOW + 10 );
        return count( $hits ) > $max_per_minute;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. NAMESPACE DISCOVERY
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all registered REST API namespaces.
     *
     * @return string[]
     */
    public static function get_available_namespaces(): array {
        $server = rest_get_server();

        return $server->get_namespaces();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. POLICY CRUD
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all stored policies. Falls back to defaults if the option is empty.
     *
     * @return array<int, array>
     */
    public static function get_policies(): array {
        $raw = \MadeIT\Security\Settings::string( self::OPT_POLICIES, '' );

        if ( is_string( $raw ) && $raw !== '' ) {
            $decoded = json_decode( $raw, true );
            if ( is_array( $decoded ) && ! empty( $decoded ) ) {
                return $decoded;
            }
        }

        if ( is_array( $raw ) && ! empty( $raw ) ) {
            return $raw;
        }

        return self::get_default_policies();
    }

    /**
     * Returns the default policy set that ships with the plugin.
     *
     * @return array<int, array>
     */
    public static function get_default_policies(): array {
        return [
            [
                'id'             => 'default_block_users_unauth',
                'namespace'      => 'wp/v2',
                'route_pattern'  => '#^/wp/v2/users#',
                'auth_required'  => true,
                'methods'        => [ 'GET', 'POST', 'PUT', 'DELETE' ],
                'rate_limit'     => 0,
                'ip_whitelist'   => [],
                'disabled'       => false,
                'description'    => 'Block unauthenticated access to /wp/v2/users',
            ],
            [
                'id'             => 'default_ratelimit_search',
                'namespace'      => 'wp/v2',
                'route_pattern'  => '#^/wp/v2/search#',
                'auth_required'  => false,
                'methods'        => [ 'GET', 'POST', 'PUT', 'DELETE' ],
                'rate_limit'     => 20,
                'ip_whitelist'   => [],
                'disabled'       => false,
                'description'    => 'Rate limit /wp/v2/search to 20 requests/min for unauthenticated users',
            ],
            [
                'id'             => 'default_ratelimit_posts',
                'namespace'      => 'wp/v2',
                'route_pattern'  => '#^/wp/v2/posts#',
                'auth_required'  => false,
                'methods'        => [ 'GET', 'POST', 'PUT', 'DELETE' ],
                'rate_limit'     => 60,
                'ip_whitelist'   => [],
                'disabled'       => false,
                'description'    => 'Rate limit /wp/v2/posts to 60 requests/min for unauthenticated users',
            ],
            [
                'id'             => 'default_block_write_unauth',
                'namespace'      => 'wp/v2',
                'route_pattern'  => '#^/wp/v2/#',
                'auth_required'  => false,
                'methods'        => [ 'GET' ],
                'rate_limit'     => 0,
                'ip_whitelist'   => [],
                'bypass_cap'     => 'edit_posts',
                'disabled'       => false,
                'description'    => 'Block unauthenticated POST/PUT/DELETE on all /wp/v2/* routes — authenticated users with edit_posts (editors/authors) are exempt so Gutenberg and the block editor keep working.',
            ],
            [
                'id'             => 'default_allow_authenticated',
                'namespace'      => '',
                'route_pattern'  => '',
                'auth_required'  => false,
                'methods'        => [],
                'rate_limit'     => 0,
                'ip_whitelist'   => [],
                'disabled'       => false,
                'description'    => 'Allow all authenticated requests (catch-all pass-through)',
            ],
        ];
    }

    /**
     * Validates and saves the full policy array.
     *
     * @param array $policies Raw policies array.
     * @return bool True on success.
     */
    public static function save_policies( array $policies ): bool {
        $sanitized = [];

        foreach ( $policies as $policy ) {
            $clean = self::sanitize_policy( $policy );
            if ( null !== $clean ) {
                $sanitized[] = $clean;
            }
        }

        return update_option( self::OPT_POLICIES, wp_json_encode( $sanitized ), false );
    }

    /**
     * Adds a single policy to the existing set.
     *
     * @param array $policy Policy rule data.
     * @return bool True on success.
     */
    public static function add_policy( array $policy ): bool {
        $clean = self::sanitize_policy( $policy );
        if ( null === $clean ) {
            return false;
        }

        $policies = self::get_policies();

        // Prevent duplicate IDs.
        foreach ( $policies as $existing ) {
            if ( $existing['id'] === $clean['id'] ) {
                return false;
            }
        }

        $policies[] = $clean;

        return self::save_policies( $policies );
    }

    /**
     * Removes a policy by its ID.
     *
     * @param string $id Policy ID to remove.
     * @return bool True on success.
     */
    public static function remove_policy( string $id ): bool {
        $policies = self::get_policies();
        $filtered = array_values( array_filter(
            $policies,
            fn( $p ) => ( $p['id'] ?? '' ) !== $id
        ) );

        if ( count( $filtered ) === count( $policies ) ) {
            return false; // ID not found.
        }

        return self::save_policies( $filtered );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. AJAX HANDLERS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * AJAX: Returns current policies + available namespaces.
     */
    public static function ajax_get_policies(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        $namespaces = [];
        if ( did_action( 'rest_api_init' ) ) {
            $namespaces = self::get_available_namespaces();
        } else {
            // REST server may not be initialised during a plain AJAX call.
            // Fire init so namespaces are registered, then query.
            do_action( 'rest_api_init', rest_get_server() ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- triggering WP core hook
            $namespaces = self::get_available_namespaces();
        }

        wp_send_json_success( [
            'enabled'    => \MadeIT\Security\Settings::bool( self::OPT_ENABLED, true ),
            'policies'   => self::get_policies(),
            'namespaces' => $namespaces,
        ] );
    }

    /**
     * AJAX: Saves the full policy array.
     */
    public static function ajax_save_policies(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        // Accept the enabled toggle.
        if ( isset( $_POST['enabled'] ) ) {
            $enabled = rest_sanitize_boolean( wp_unslash( $_POST['enabled'] ) );
            update_option( self::OPT_ENABLED, $enabled, false );
        }

        // Accept policies payload (JSON string or array).
        $raw = isset( $_POST['policies'] ) ? wp_unslash( $_POST['policies'] ) : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- JSON payload decoded and each field sanitized in save_policies()

        if ( null === $raw ) {
            wp_send_json_error( [ 'message' => 'No policies data provided.' ] );
        }

        if ( is_string( $raw ) ) {
            $raw = json_decode( $raw, true );
            if ( ! is_array( $raw ) ) {
                wp_send_json_error( [ 'message' => 'Invalid JSON in policies field.' ] );
            }
        }

        // Sanitize decoded values — individual fields are further validated in save_policies().
        $raw = self::sanitize_recursive( $raw );

        $ok = self::save_policies( $raw );

        // Audit log.
        self::audit( 'save_rest_policies', 'rest_policy', '', 'REST API policies updated' );

        wp_send_json_success( [
            'message'  => $ok ? 'Policies saved.' : 'No changes detected.',
            'policies' => self::get_policies(),
        ] );
    }

    /**
     * AJAX: Returns REST API usage stats from the visitor_log.
     */
    public static function ajax_get_stats(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        global $wpdb;

        $hours  = isset( $_GET['hours'] ) ? min( 168, max( 1, (int) $_GET['hours'] ) ) : 24;
        $cutoff = wp_date( 'Y-m-d H:i:s', time() - $hours * HOUR_IN_SECONDS );

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache

        // Total REST requests.
        $total = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_visitor_log
            WHERE url LIKE %s
                AND created_at >= %s",
            '%/wp-json/%',
            $cutoff
        ) );

        // Blocked REST requests.
        $blocked = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events
            WHERE event_type = 'rest_policy_block'
                AND created_at >= %s",
            $cutoff
        ) );

        // Top REST routes.
        $top_routes = $wpdb->get_results( $wpdb->prepare(
            "SELECT
                SUBSTRING_INDEX(SUBSTRING_INDEX(url, '/wp-json', -1), '?', 1) AS route,
                COUNT(*) AS hits,
                SUM( CASE WHEN user_id = 0 THEN 1 ELSE 0 END ) AS unauth_hits
            FROM {$wpdb->prefix}madeit_security_visitor_log
            WHERE url LIKE %s
                AND created_at >= %s
            GROUP BY route
            ORDER BY hits DESC
            LIMIT 15",
            '%/wp-json/%',
            $cutoff
        ) );

        // Top blocked policies.
        $top_blocked = $wpdb->get_results( $wpdb->prepare(
            "SELECT rule_id AS policy_id, COUNT(*) AS blocks, MAX(created_at) AS last_blocked
            FROM {$wpdb->prefix}madeit_security_events
            WHERE event_type = 'rest_policy_block'
                AND created_at >= %s
            GROUP BY rule_id
            ORDER BY blocks DESC
            LIMIT 10",
            $cutoff
        ) );

        // Hourly breakdown.
        $hourly = $wpdb->get_results( $wpdb->prepare(
            "SELECT DATE_FORMAT(created_at, '%%Y-%%m-%%d %%H:00:00') AS hour,
                    COUNT(*) AS total
            FROM {$wpdb->prefix}madeit_security_visitor_log
            WHERE url LIKE %s
                AND created_at >= %s
            GROUP BY hour
            ORDER BY hour ASC",
            '%/wp-json/%',
            $cutoff
        ) );

        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        wp_send_json_success( [
            'total'       => $total,
            'blocked'     => $blocked,
            'top_routes'  => $top_routes,
            'top_blocked' => $top_blocked,
            'hourly'      => $hourly,
            'hours'       => $hours,
            'timestamp'   => current_time( 'mysql' ),
        ] );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. LOGGING
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Logs a blocked REST request to the events table.
     */
    private static function log_block( array $policy, string $ip, string $route, string $method, string $reason ): void {
        global $wpdb;

        $policy_id   = $policy['id'] ?? 'unknown';
        $description = sprintf(
            'REST policy block [%s]: %s — Route: %s, Method: %s, IP: %s',
            $policy_id,
            $reason,
            $route,
            $method,
            $ip
        );

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'rest_policy_block',
                'severity'    => 'medium',
                'ip'          => $ip,
                'user_id'     => get_current_user_id(),
                'url'         => home_url( '/wp-json' . $route ),
                'method'      => $method,
                'rule_id'     => $policy_id,
                'description' => $description,
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s' ]
        );

        // Update visitor log row if available.
        if ( ! empty( $GLOBALS['madeit_security_current_log_id'] ) ) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
            $wpdb->update(
                $wpdb->prefix . 'madeit_security_visitor_log',
                [
                    'is_blocked'   => 1,
                    'block_reason' => 'REST Policy: ' . $policy_id,
                    'status_code'  => self::status_code_for_reason( $reason ),
                ],
                [ 'id' => $GLOBALS['madeit_security_current_log_id'] ],
                [ '%d', '%s', '%d' ],
                [ '%d' ]
            );
        }
    }

    /**
     * Maps a block reason to the appropriate HTTP status code.
     */
    private static function status_code_for_reason( string $reason ): int {
        if ( str_contains( $reason, 'Rate limit' ) ) {
            return 429;
        }
        if ( str_contains( $reason, 'Method' ) ) {
            return 405;
        }
        return 401;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Sanitizes and validates a single policy array.
     *
     * @param array $policy Raw policy data.
     * @return array|null Sanitized policy or null if invalid.
     */
    private static function sanitize_policy( array $policy ): ?array {
        // ID is required.
        $id = isset( $policy['id'] ) ? sanitize_key( $policy['id'] ) : '';
        if ( $id === '' ) {
            return null;
        }

        // Namespace.
        $namespace = isset( $policy['namespace'] )
            ? sanitize_text_field( wp_unslash( $policy['namespace'] ) )
            : '';

        // Route pattern (regex) — validate it.
        $route_pattern = isset( $policy['route_pattern'] )
            ? sanitize_text_field( wp_unslash( $policy['route_pattern'] ) )
            : '';
        if ( $route_pattern !== '' && @preg_match( $route_pattern, '' ) === false ) {
            // Invalid regex — clear it.
            $route_pattern = '';
        }

        // Auth required.
        $auth_required = ! empty( $policy['auth_required'] );

        // Methods.
        $methods = [];
        if ( ! empty( $policy['methods'] ) && is_array( $policy['methods'] ) ) {
            $allowed = [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD' ];
            foreach ( $policy['methods'] as $m ) {
                $m = strtoupper( sanitize_text_field( $m ) );
                if ( in_array( $m, $allowed, true ) ) {
                    $methods[] = $m;
                }
            }
        }

        // Rate limit (requests per minute, 0 = unlimited).
        $rate_limit = isset( $policy['rate_limit'] ) ? max( 0, (int) $policy['rate_limit'] ) : 0;

        // IP whitelist.
        $ip_whitelist = [];
        if ( ! empty( $policy['ip_whitelist'] ) && is_array( $policy['ip_whitelist'] ) ) {
            foreach ( $policy['ip_whitelist'] as $ip ) {
                $ip = sanitize_text_field( $ip );
                if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
                    $ip_whitelist[] = $ip;
                }
            }
        }

        // Disabled flag.
        $disabled = ! empty( $policy['disabled'] );

        // Optional capability bypass — when set, authenticated users with this
        // cap skip this policy entirely.
        $bypass_cap = '';
        if ( ! empty( $policy['bypass_cap'] ) ) {
            $bypass_cap = sanitize_key( wp_unslash( $policy['bypass_cap'] ) );
        }

        // Description (informational).
        $description = isset( $policy['description'] )
            ? sanitize_text_field( wp_unslash( $policy['description'] ) )
            : '';

        return [
            'id'            => $id,
            'namespace'     => $namespace,
            'route_pattern' => $route_pattern,
            'auth_required' => $auth_required,
            'methods'       => $methods,
            'rate_limit'    => $rate_limit,
            'ip_whitelist'  => $ip_whitelist,
            'bypass_cap'    => $bypass_cap,
            'disabled'      => $disabled,
            'description'   => $description,
        ];
    }

    /**
     * Writes to the audit log (mirrors the pattern used by IPManager).
     */
    private static function audit( string $action, string $obj_type, string $obj_id, string $desc ): void {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_audit_log',
            [
                'user_id'     => get_current_user_id(),
                'username'    => wp_get_current_user()->user_login,
                'action'      => $action,
                'object_type' => $obj_type,
                'object_id'   => $obj_id,
                'description' => $desc,
                'ip'          => \MadeIT\Security\RequestLogger::get_real_ip(),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
    }

    /**
     * Recursively sanitize decoded JSON values.
     *
     * @param mixed $data  Decoded JSON data.
     * @return mixed  Sanitized data.
     */
    private static function sanitize_recursive( $data ) {
        if ( is_array( $data ) ) {
            return array_map( [ __CLASS__, 'sanitize_recursive' ], $data );
        }
        if ( is_string( $data ) ) {
            return sanitize_text_field( $data );
        }
        return $data;
    }
}
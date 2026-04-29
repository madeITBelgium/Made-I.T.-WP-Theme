<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Session Security Enforcement
 * Cookie hardening, session binding, concurrent session limits,
 * idle timeout, and real-time hijacking detection.
 */
class SessionSecurity {

    /** User meta key for the session fingerprint map (verifier => fingerprint). */
    private const META_FINGERPRINTS = 'madeit_security_session_fingerprints';

    /** User meta key for per-session last-activity timestamps (verifier => unix time). */
    private const META_LAST_ACTIVITY = 'madeit_security_session_last_activity';

    /**
     * Derive the verifier (SHA-256 hash) for a raw session token.
     *
     * WordPress stores sessions in `session_tokens` user-meta keyed by
     * `hash('sha256', $raw_token)` — see WP_User_Meta_Session_Tokens::hash_token().
     * We key our fingerprint and activity maps by the SAME verifier so they
     * line up with the keys returned from `WP_Session_Tokens::get_all()`.
     *
     * Historically this module mixed raw-token keys (from wp_get_session_token())
     * with verifier keys (from get_all()), which meant the concurrent-session
     * limiter could never actually destroy old sessions. Standardising on the
     * verifier fixes both sides in one place.
     *
     * @param string $raw_token Raw session token as stored in the auth cookie.
     * @return string SHA-256 verifier used as the meta-array key.
     */
    private static function verifier( string $raw_token ): string {
        return hash( 'sha256', $raw_token );
    }

    /**
     * Remove a single session by its verifier hash.
     *
     * `WP_Session_Tokens::destroy()` expects the RAW token (it hashes internally)
     * — but `get_all()` returns already-hashed verifier keys. Passing a verifier
     * to destroy() double-hashes and silently does nothing. The sessions are
     * stored in the `session_tokens` user-meta, keyed by verifier, so we can
     * safely drop the entry directly.
     *
     * @param int    $user_id  User whose session we are removing.
     * @param string $verifier Hashed verifier as returned by get_all().
     * @return bool True if the session row was removed.
     */
    private static function destroy_session_by_verifier( int $user_id, string $verifier ): bool {
        $sessions = get_user_meta( $user_id, 'session_tokens', true );
        if ( ! is_array( $sessions ) || ! isset( $sessions[ $verifier ] ) ) {
            return false;
        }
        unset( $sessions[ $verifier ] );
        if ( empty( $sessions ) ) {
            return (bool) delete_user_meta( $user_id, 'session_tokens' );
        }
        return (bool) update_user_meta( $user_id, 'session_tokens', $sessions );
    }

    // ── Bootstrap ────────────────────────────────────────────────────────────

    public static function init(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_session_security_enabled', true ) ) {
            return;
        }

        // Cookie hardening
        add_action( 'set_auth_cookie',  [ __CLASS__, 'harden_auth_cookie' ], 10, 6 );
        add_action( 'send_headers',     [ __CLASS__, 'harden_php_session_cookie' ], 0 );

        // Session binding — store fingerprint on login
        add_action( 'wp_login', [ __CLASS__, 'on_login' ], 20, 2 );

        // Session binding — verify on every authenticated request
        add_action( 'init', [ __CLASS__, 'verify_session' ], 5 );

        // Concurrent session limit enforcement (runs on login)
        add_action( 'wp_login', [ __CLASS__, 'enforce_session_limit' ], 25, 2 );

        // Idle timeout & activity tracking
        add_action( 'init', [ __CLASS__, 'track_activity' ], 6 );

        // AJAX handlers
        add_action( 'wp_ajax_madeit_security_get_session_info',       [ __CLASS__, 'ajax_get_session_info' ] );
        add_action( 'wp_ajax_madeit_security_destroy_user_sessions',  [ __CLASS__, 'ajax_destroy_user_sessions' ] );
        add_action( 'wp_ajax_madeit_security_get_session_stats',      [ __CLASS__, 'ajax_get_session_stats' ] );
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 1. COOKIE HARDENING
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Re-send the auth cookie with hardened attributes.
     *
     * Hooked to `set_auth_cookie` which fires after WordPress sets its
     * logged_in and auth cookies. We overwrite the cookie with corrected
     * flags (HttpOnly, Secure, SameSite).
     *
     * @param string $auth_cookie  The cookie value.
     * @param int    $expire       Expiration timestamp.
     * @param int    $expiration   Cookie lifetime in seconds.
     * @param int    $user_id      User ID.
     * @param string $scheme       'auth' or 'logged_in'.
     * @param string $token        Session token.
     */
    public static function harden_auth_cookie( string $auth_cookie, int $expire, int $expiration, int $user_id, string $scheme, string $token ): void {
        if ( headers_sent() ) {
            return;
        }

        $secure   = self::should_force_secure();
        $httponly  = \MadeIT\Security\Settings::bool( 'madeit_security_session_httponly', true );
        $samesite = self::get_samesite_value();

        // Determine the correct cookie name and path
        if ( 'logged_in' === $scheme ) {
            $cookie_name = LOGGED_IN_COOKIE;
            $cookie_path = COOKIEPATH;
            $site_path   = SITECOOKIEPATH;
        } else {
            $cookie_name = ( $secure ) ? SECURE_AUTH_COOKIE : AUTH_COOKIE;
            $cookie_path = ( defined( 'ADMIN_COOKIE_PATH' ) ) ? ADMIN_COOKIE_PATH : SITECOOKIEPATH;
            $site_path   = SITECOOKIEPATH;
        }

        $domain = COOKIE_DOMAIN;

        // Use the modern `setcookie` options array (PHP 7.3+)
        $options = [
            'expires'  => $expire,
            'path'     => $cookie_path,
            'domain'   => $domain,
            'secure'   => $secure,
            'httponly'  => $httponly,
            'samesite' => $samesite,
        ];

        setcookie( $cookie_name, $auth_cookie, $options );

        // WordPress also sets cookies on SITECOOKIEPATH when it differs from COOKIEPATH
        if ( 'logged_in' === $scheme && COOKIEPATH !== SITECOOKIEPATH ) {
            $options['path'] = $site_path;
            setcookie( $cookie_name, $auth_cookie, $options );
        }
    }

    /**
     * Set hardened PHP session cookie parameters.
     *
     * Runs on `send_headers` so that any PHP session started afterwards
     * inherits secure defaults.
     */
    public static function harden_php_session_cookie(): void {
        if ( headers_sent() || PHP_SESSION_ACTIVE === session_status() ) {
            return;
        }

        $params = [
            'lifetime' => 0,
            'path'     => COOKIEPATH ?: '/',
            'domain'   => COOKIE_DOMAIN ?: '',
            'secure'   => self::should_force_secure(),
            'httponly'  => \MadeIT\Security\Settings::bool( 'madeit_security_session_httponly', true ),
            'samesite' => self::get_samesite_value(),
        ];

        session_set_cookie_params( $params );
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 2. SESSION BINDING
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * On successful login, store a session fingerprint.
     *
     * @param string   $user_login  Username.
     * @param \WP_User $user        User object.
     */
    public static function on_login( string $user_login, \WP_User $user ): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_session_binding', true ) ) {
            return;
        }

        $token = wp_get_session_token();
        if ( ! $token ) {
            return;
        }

        $verifier    = self::verifier( $token );
        $fingerprint = self::compute_fingerprint();

        // Store fingerprint keyed by verifier (matches WP_Session_Tokens storage)
        $fingerprints = (array) get_user_meta( $user->ID, self::META_FINGERPRINTS, true );
        $fingerprints[ $verifier ] = $fingerprint;
        update_user_meta( $user->ID, self::META_FINGERPRINTS, $fingerprints );

        // Initialize last activity for this session
        $activity = (array) get_user_meta( $user->ID, self::META_LAST_ACTIVITY, true );
        $activity[ $verifier ] = time();
        update_user_meta( $user->ID, self::META_LAST_ACTIVITY, $activity );
    }

    /**
     * Verify the current session's fingerprint on every authenticated request.
     */
    public static function verify_session(): void {
        if ( ! is_user_logged_in() ) {
            return;
        }
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_session_binding', true ) ) {
            return;
        }
        // Skip AJAX heartbeat to reduce overhead
        if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
            $action = isset( $_POST['action'] ) ? sanitize_key( $_POST['action'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- heartbeat check runs on every AJAX request
            if ( 'heartbeat' === $action ) {
                return;
            }
        }

        // Exempt admins — skip fingerprint binding entirely
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_session_exempt_admins', false ) && current_user_can( 'manage_options' ) ) {
            return;
        }

        $user_id = get_current_user_id();
        $token   = wp_get_session_token();
        if ( ! $token ) {
            return;
        }

        $verifier     = self::verifier( $token );
        $fingerprints = (array) get_user_meta( $user_id, self::META_FINGERPRINTS, true );

        // No fingerprint stored yet — could be a session created before the plugin was activated
        if ( ! isset( $fingerprints[ $verifier ] ) ) {
            // Store one now so subsequent requests are bound
            $fingerprints[ $verifier ] = self::compute_fingerprint();
            update_user_meta( $user_id, self::META_FINGERPRINTS, $fingerprints );
            return;
        }

        $expected = $fingerprints[ $verifier ];
        $current  = self::compute_fingerprint();

        if ( ! hash_equals( $expected, $current ) ) {
            self::handle_hijack_detected( $user_id, $token );
        }
    }

    /**
     * Build a session fingerprint hash from the client's IP and/or User-Agent.
     */
    private static function compute_fingerprint(): string {
        $parts = [];

        if ( \MadeIT\Security\Settings::bool( 'madeit_security_session_bind_ip', true ) ) {
            $parts[] = \MadeIT\Security\RequestLogger::get_real_ip();
        }

        if ( \MadeIT\Security\Settings::bool( 'madeit_security_session_bind_ua', true ) ) {
            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- UA already sanitized via sanitize_text_field
            $parts[] = isset( $_SERVER['HTTP_USER_AGENT'] )
                ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) )
                : '';
        }

        // Include a site-specific salt so fingerprints are not portable across installs
        $salt = defined( 'AUTH_SALT' ) ? AUTH_SALT : 'madeit-security-session-salt';

        return hash( 'sha256', implode( '|', $parts ) . '|' . $salt );
    }

    /**
     * Respond to a detected session hijack.
     */
    private static function handle_hijack_detected( int $user_id, string $token ): void {
        $ip   = \MadeIT\Security\RequestLogger::get_real_ip();
        $user = get_user_by( 'id', $user_id );

        // Audit log
        self::audit(
            $user_id,
            $user ? $user->user_login : '',
            'session_hijack_detected',
            sprintf(
                'Session fingerprint mismatch for user #%d (%s). IP: %s, UA: %s',
                $user_id,
                $user ? $user->user_login : 'unknown',
                $ip,
                // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- UA already sanitized via sanitize_text_field
                isset( $_SERVER['HTTP_USER_AGENT'] )
                    ? substr( sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ), 0, 200 )
                    : 'empty'
            )
        );

        // Destroy only the compromised session — $token is the RAW token; WP
        // hashes it internally to locate the verifier in session_tokens.
        $manager = \WP_Session_Tokens::get_instance( $user_id );
        $manager->destroy( $token );

        // Clean up stored fingerprint and activity data for this token, keyed by verifier.
        $verifier     = self::verifier( $token );
        $fingerprints = (array) get_user_meta( $user_id, self::META_FINGERPRINTS, true );
        unset( $fingerprints[ $verifier ] );
        update_user_meta( $user_id, self::META_FINGERPRINTS, $fingerprints );

        $activity = (array) get_user_meta( $user_id, self::META_LAST_ACTIVITY, true );
        unset( $activity[ $verifier ] );
        update_user_meta( $user_id, self::META_LAST_ACTIVITY, $activity );

        // Clear auth cookies
        wp_clear_auth_cookie();

        // Redirect to login with reason
        wp_safe_redirect( add_query_arg( 'reason', 'session_invalid', wp_login_url() ) );
        exit;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 3. CONCURRENT SESSION LIMITS
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Enforce the maximum number of concurrent sessions per user.
     *
     * @param string   $user_login  Username.
     * @param \WP_User $user        User object.
     */
    public static function enforce_session_limit( string $user_login, \WP_User $user ): void {
        $max = \MadeIT\Security\Settings::int( 'madeit_security_max_sessions', 3 );
        if ( $max <= 0 ) {
            return; // 0 = unlimited
        }

        // Admin exemption
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_session_exempt_admins', false ) && $user->has_cap( 'manage_options' ) ) {
            return;
        }

        $manager  = \WP_Session_Tokens::get_instance( $user->ID );
        $sessions = $manager->get_all();

        if ( count( $sessions ) <= $max ) {
            return;
        }

        $action_type = \MadeIT\Security\Settings::string( 'madeit_security_max_sessions_action', 'destroy_oldest' );

        if ( 'block_new' === $action_type ) {
            // Destroy the session that was just created (the newest one)
            $current_token = wp_get_session_token();
            if ( $current_token ) {
                $manager->destroy( $current_token );
            }
            wp_clear_auth_cookie();

            self::audit(
                $user->ID,
                $user_login,
                'session_limit_blocked',
                sprintf( 'Login blocked — user already has %d active session(s) (limit: %d).', count( $sessions ) - 1, $max )
            );

            wp_safe_redirect( add_query_arg( 'reason', 'session_limit', wp_login_url() ) );
            exit;
        }

        // Default: destroy_oldest
        // Sort sessions by login time (ascending) and remove the oldest ones
        uasort( $sessions, function ( $a, $b ) {
            return ( $a['login'] ?? 0 ) <=> ( $b['login'] ?? 0 );
        });

        // $sessions is keyed by VERIFIER — remove the oldest (count - max) entries.
        $verifiers_to_remove = array_slice( array_keys( $sessions ), 0, count( $sessions ) - $max );
        $fingerprints        = (array) get_user_meta( $user->ID, self::META_FINGERPRINTS, true );
        $activity_map        = (array) get_user_meta( $user->ID, self::META_LAST_ACTIVITY, true );

        foreach ( $verifiers_to_remove as $verifier ) {
            // Use direct session_tokens meta manipulation — $manager->destroy()
            // would double-hash the already-hashed verifier and silently do nothing.
            self::destroy_session_by_verifier( $user->ID, $verifier );
            unset( $fingerprints[ $verifier ], $activity_map[ $verifier ] );
        }

        update_user_meta( $user->ID, self::META_FINGERPRINTS, $fingerprints );
        update_user_meta( $user->ID, self::META_LAST_ACTIVITY, $activity_map );

        self::audit(
            $user->ID,
            $user_login,
            'session_limit_enforced',
            sprintf(
                'Destroyed %d oldest session(s) to stay within the limit of %d.',
                count( $verifiers_to_remove ),
                $max
            )
        );
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 4. SESSION ACTIVITY MONITORING & IDLE TIMEOUT
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Update the last-activity timestamp for the current session
     * and enforce idle timeout.
     */
    public static function track_activity(): void {
        if ( ! is_user_logged_in() ) {
            return;
        }

        $user_id = get_current_user_id();
        $token   = wp_get_session_token();
        if ( ! $token ) {
            return;
        }

        $verifier = self::verifier( $token );
        $activity = (array) get_user_meta( $user_id, self::META_LAST_ACTIVITY, true );
        $now      = time();

        // Exempt admins — skip idle timeout but still track activity
        $admin_exempt = \MadeIT\Security\Settings::bool( 'madeit_security_session_exempt_admins', false ) && current_user_can( 'manage_options' );

        // Idle timeout check (skip for exempt admins)
        $idle_timeout = \MadeIT\Security\Settings::int( 'madeit_security_session_idle_timeout', 1800 );
        if ( ! $admin_exempt && $idle_timeout > 0 && isset( $activity[ $verifier ] ) ) {
            $last = (int) $activity[ $verifier ];
            if ( ( $now - $last ) > $idle_timeout ) {
                self::audit(
                    $user_id,
                    wp_get_current_user()->user_login,
                    'session_idle_timeout',
                    sprintf(
                        'Session expired after %d seconds of inactivity (limit: %d).',
                        $now - $last,
                        $idle_timeout
                    )
                );

                // Destroy only this session — $token is raw; WP hashes it internally.
                $manager = \WP_Session_Tokens::get_instance( $user_id );
                $manager->destroy( $token );

                // Clean stored data for this token, keyed by verifier.
                unset( $activity[ $verifier ] );
                update_user_meta( $user_id, self::META_LAST_ACTIVITY, $activity );

                $fingerprints = (array) get_user_meta( $user_id, self::META_FINGERPRINTS, true );
                unset( $fingerprints[ $verifier ] );
                update_user_meta( $user_id, self::META_FINGERPRINTS, $fingerprints );

                wp_clear_auth_cookie();
                wp_safe_redirect( add_query_arg( 'reason', 'idle_timeout', wp_login_url() ) );
                exit;
            }
        }

        // Throttle activity updates — write at most once every 60 seconds
        if ( ! isset( $activity[ $verifier ] ) || ( $now - (int) $activity[ $verifier ] ) > 60 ) {
            $activity[ $verifier ] = $now;
            update_user_meta( $user_id, self::META_LAST_ACTIVITY, $activity );
        }
    }

    /**
     * Get all active sessions for a user with metadata.
     *
     * @param int $user_id  User ID.
     * @return array Array of session data with added fingerprint/activity info.
     */
    public static function get_active_sessions( int $user_id ): array {
        $manager  = \WP_Session_Tokens::get_instance( $user_id );
        $sessions = $manager->get_all();
        $activity = (array) get_user_meta( $user_id, self::META_LAST_ACTIVITY, true );

        // $sessions keys are already verifiers — match the same hash derived
        // from the current raw token instead of comparing raw-to-verifier.
        $current_raw_token = ( get_current_user_id() === $user_id ) ? wp_get_session_token() : '';
        $current_verifier  = $current_raw_token ? self::verifier( $current_raw_token ) : '';

        $result = [];
        foreach ( $sessions as $verifier => $session ) {
            $result[] = [
                'token_hash'    => substr( $verifier, 0, 12 ) . '...',
                'login'         => isset( $session['login'] ) ? wp_date( 'Y-m-d H:i:s', $session['login'] ) : '',
                'expiration'    => isset( $session['expiration'] ) ? wp_date( 'Y-m-d H:i:s', $session['expiration'] ) : '',
                'ip'            => $session['ip'] ?? '',
                'ua'            => $session['ua'] ?? '',
                'last_activity' => isset( $activity[ $verifier ] )
                    ? wp_date( 'Y-m-d H:i:s', (int) $activity[ $verifier ] )
                    : '',
                'is_current'    => ( $verifier === $current_verifier ),
            ];
        }

        return $result;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 5. AJAX HANDLERS
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * AJAX: Return the current user's sessions and security status.
     */
    public static function ajax_get_session_info(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! is_user_logged_in() ) {
            wp_send_json_error( [ 'message' => 'Not authenticated.' ], 403 );
        }

        $user_id  = get_current_user_id();
        $sessions = self::get_active_sessions( $user_id );

        wp_send_json_success( [
            'sessions' => $sessions,
            'security' => [
                'binding_enabled' => \MadeIT\Security\Settings::bool( 'madeit_security_session_binding', true ),
                'bind_ip'         => \MadeIT\Security\Settings::bool( 'madeit_security_session_bind_ip', true ),
                'bind_ua'         => \MadeIT\Security\Settings::bool( 'madeit_security_session_bind_ua', true ),
                'httponly'         => \MadeIT\Security\Settings::bool( 'madeit_security_session_httponly', true ),
                'secure'           => self::should_force_secure(),
                'samesite'         => self::get_samesite_value(),
                'max_sessions'     => \MadeIT\Security\Settings::int( 'madeit_security_max_sessions', 3 ),
                'idle_timeout'     => \MadeIT\Security\Settings::int( 'madeit_security_session_idle_timeout', 1800 ),
            ],
        ] );
    }

    /**
     * AJAX: Admin can destroy all sessions for a specific user.
     */
    public static function ajax_destroy_user_sessions(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized.' ], 403 );
        }

        $target_user_id = isset( $_POST['user_id'] ) ? absint( $_POST['user_id'] ) : 0;
        if ( ! $target_user_id || ! get_user_by( 'id', $target_user_id ) ) {
            wp_send_json_error( [ 'message' => 'Invalid user ID.' ] );
        }

        $count = self::destroy_user_sessions( $target_user_id );

        $target_user = get_user_by( 'id', $target_user_id );
        self::audit(
            get_current_user_id(),
            wp_get_current_user()->user_login,
            'admin_destroy_sessions',
            sprintf(
                'Admin destroyed %d session(s) for user #%d (%s).',
                $count,
                $target_user_id,
                $target_user ? $target_user->user_login : 'unknown'
            )
        );

        wp_send_json_success( [
            'message' => sprintf( '%d session(s) destroyed for user #%d.', $count, $target_user_id ),
        ] );
    }

    /**
     * AJAX: Return aggregate session statistics.
     */
    public static function ajax_get_session_stats(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized.' ], 403 );
        }

        global $wpdb;

        // Count total active sessions across all users
        $users = get_users( [ 'fields' => 'ID' ] );
        $total_sessions      = 0;
        $users_with_multiple = 0;

        foreach ( $users as $uid ) {
            $manager  = \WP_Session_Tokens::get_instance( (int) $uid );
            $sessions = $manager->get_all();
            $count    = count( $sessions );
            $total_sessions += $count;
            if ( $count > 1 ) {
                $users_with_multiple++;
            }
        }

        // Recent hijack attempts (last 7 days)
        $cutoff_7d = wp_date( 'Y-m-d H:i:s', time() - 7 * DAY_IN_SECONDS );
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $hijack_count = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_audit_log
            WHERE action = %s AND created_at >= %s",
            'session_hijack_detected',
            $cutoff_7d
        ) );

        // Recent idle timeouts (last 7 days)
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $idle_count = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_audit_log
            WHERE action = %s AND created_at >= %s",
            'session_idle_timeout',
            $cutoff_7d
        ) );

        wp_send_json_success( [
            'total_active_sessions'     => $total_sessions,
            'users_with_multiple'       => $users_with_multiple,
            'hijack_attempts_7d'        => $hijack_count,
            'idle_timeouts_7d'          => $idle_count,
            'max_sessions_setting'      => \MadeIT\Security\Settings::int( 'madeit_security_max_sessions', 3 ),
            'idle_timeout_setting'      => \MadeIT\Security\Settings::int( 'madeit_security_session_idle_timeout', 1800 ),
        ] );
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 6. ADMIN KILL SWITCH
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Destroy ALL sessions across all users except the current admin's session.
     * Intended for post-breach emergency response.
     *
     * @return int Number of sessions destroyed.
     */
    public static function destroy_all_sessions_except_current(): int {
        $current_user_id   = get_current_user_id();
        $current_raw_token = wp_get_session_token();
        $current_verifier  = $current_raw_token ? self::verifier( $current_raw_token ) : '';
        $destroyed         = 0;

        $users = get_users( [ 'fields' => 'ID' ] );
        foreach ( $users as $uid ) {
            $uid      = (int) $uid;
            $manager  = \WP_Session_Tokens::get_instance( $uid );
            $sessions = $manager->get_all();

            if ( empty( $sessions ) ) {
                continue;
            }

            if ( $uid === $current_user_id && '' !== $current_verifier ) {
                // Destroy every session on this user except the current one —
                // $sessions is keyed by verifier, so compare verifier-to-verifier.
                foreach ( array_keys( $sessions ) as $verifier ) {
                    if ( $verifier !== $current_verifier ) {
                        self::destroy_session_by_verifier( $uid, $verifier );
                        $destroyed++;
                    }
                }
            } else {
                $destroyed += count( $sessions );
                $manager->destroy_all();
            }

            // Clear associated meta
            delete_user_meta( $uid, self::META_FINGERPRINTS );
            delete_user_meta( $uid, self::META_LAST_ACTIVITY );
        }

        // Restore the current user's fingerprint and activity, keyed by verifier.
        if ( '' !== $current_verifier ) {
            update_user_meta( $current_user_id, self::META_FINGERPRINTS, [
                $current_verifier => self::compute_fingerprint(),
            ] );
            update_user_meta( $current_user_id, self::META_LAST_ACTIVITY, [
                $current_verifier => time(),
            ] );
        }

        self::audit(
            $current_user_id,
            wp_get_current_user()->user_login,
            'emergency_session_purge',
            sprintf( 'Destroyed %d session(s) across all users (kept current admin session).', $destroyed )
        );

        return $destroyed;
    }

    /**
     * Destroy all sessions for a specific user.
     *
     * @param int $user_id  User ID.
     * @return int Number of sessions destroyed.
     */
    public static function destroy_user_sessions( int $user_id ): int {
        $manager  = \WP_Session_Tokens::get_instance( $user_id );
        $sessions = $manager->get_all();
        $count    = count( $sessions );

        if ( $count > 0 ) {
            $manager->destroy_all();
        }

        // Clean associated meta
        delete_user_meta( $user_id, self::META_FINGERPRINTS );
        delete_user_meta( $user_id, self::META_LAST_ACTIVITY );

        return $count;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Determine whether the Secure flag should be forced on cookies.
     */
    private static function should_force_secure(): bool {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_session_secure', true ) ) {
            return false;
        }
        return is_ssl();
    }

    /**
     * Return the sanitized SameSite attribute value.
     */
    private static function get_samesite_value(): string {
        $value = \MadeIT\Security\Settings::string( 'madeit_security_session_samesite', 'Lax' );
        $allowed = [ 'Strict', 'Lax', 'None' ];
        return in_array( $value, $allowed, true ) ? $value : 'Lax';
    }

    /**
     * Write an entry to the audit log table.
     *
     * @param int    $user_id     Acting user ID.
     * @param string $username    Acting username.
     * @param string $action      Action identifier.
     * @param string $description Human-readable description.
     */
    private static function audit( int $user_id, string $username, string $action, string $description ): void {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_audit_log',
            [
                'user_id'     => $user_id,
                'username'    => $username,
                'action'      => $action,
                'object_type' => 'session',
                'description' => $description,
                'ip'          => \MadeIT\Security\RequestLogger::get_real_ip(),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%d', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
    }
}
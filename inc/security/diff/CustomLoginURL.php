<?php
namespace FortressWP\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Custom Login URL
 *
 * Moves wp-login.php to a secret slug (e.g. /go-login/).
 * - Direct access to /wp-login.php → 404 (never 403, never redirect)
 * - Direct access to /wp-admin/ when not logged in → 404
 * - The secret URL works exactly like wp-login.php
 * - Works with standard WP redirects, password-protected posts, etc.
 * - Zero effect on authenticated users (admin bar, etc.)
 * - Whitelisted IPs always get through regardless
 */
class CustomLoginURL {

    private static string $slug = '';

    public static function init(): void {
        if ( ! get_option( 'aswp_custom_login_enabled', false ) ) return;

        // Safe-mode kill switch — disable ALL blocking.
        if ( defined( 'ASWP_BLOCKING_DISABLED' ) && ASWP_BLOCKING_DISABLED ) return;

        self::$slug = self::get_slug();
        if ( ! self::$slug ) return;

        // Rewrite: intercept the secret URL → serve wp-login.php
        add_action( 'init',              [ __CLASS__, 'add_rewrite'         ], 1   );
        add_filter( 'query_vars',        [ __CLASS__, 'add_query_var'       ]      );
        add_action( 'template_redirect', [ __CLASS__, 'handle_request'      ], 1   );

        // Block direct access to the real wp-login.php and wp-admin
        add_action( 'login_init',        [ __CLASS__, 'block_real_login'    ]      );
        add_action( 'init',              [ __CLASS__, 'block_wpadmin_unauth' ], 1  );

        // Rewrite all login URLs throughout WP to use the custom slug
        add_filter( 'login_url',         [ __CLASS__, 'filter_login_url'    ], 10, 3 );
        add_filter( 'logout_url',        [ __CLASS__, 'filter_logout_url'   ], 10, 2 );
        add_filter( 'lostpassword_url',  [ __CLASS__, 'filter_lostpw_url'   ], 10, 2 );
        add_filter( 'register_url',      [ __CLASS__, 'filter_register_url' ]      );
        add_filter( 'network_site_url',  [ __CLASS__, 'filter_network_url'  ], 10, 3 );
        add_filter( 'site_url',          [ __CLASS__, 'filter_site_url'     ], 10, 4 );
        add_filter( 'wp_redirect',       [ __CLASS__, 'filter_redirect'     ], 10, 2 );
    }

    // ── Slug management ───────────────────────────────────────────────────────

    public static function get_slug(): string {
        $slug = get_option( 'aswp_custom_login_slug', '' );
        if ( ! $slug ) {
            $slug = self::generate_slug();
            update_option( 'aswp_custom_login_slug', $slug );
        }
        return sanitize_title( $slug );
    }

    public static function generate_slug(): string {
        $words = [ 'gate', 'enter', 'access', 'panel', 'portal', 'secure', 'admin', 'login', 'sign', 'auth' ];
        return $words[ array_rand( $words ) ] . '-' . wp_generate_password( 6, false );
    }

    public static function reset_slug(): string {
        $slug = self::generate_slug();
        update_option( 'aswp_custom_login_slug', $slug );
        self::flush_rewrite();
        return $slug;
    }

    // ── Rewrite rule ──────────────────────────────────────────────────────────

    public static function add_rewrite(): void {
        add_rewrite_rule(
            '^' . preg_quote( self::$slug, '/' ) . '/?$',
            'index.php?aswp_login=1',
            'top'
        );
    }

    public static function add_query_var( array $vars ): array {
        $vars[] = 'aswp_login';
        return $vars;
    }

    public static function handle_request(): void {
        if ( ! get_query_var( 'aswp_login' ) ) return;

        // Generate a one-time token so block_real_login() will allow this redirect through.
        $token = wp_generate_password( 32, false );
        set_transient( 'aswp_login_token_' . wp_hash( $token ), 1, 120 );

        // Preserve standard wp-login.php query args across the redirect.
        $args = [ 'aswp_token' => $token ];
        $passthrough = [ 'action', 'redirect_to', 'reauth', 'loggedout', 'checkemail', 'interim-login', 'wp_lang' ];
        foreach ( $passthrough as $key ) {
            if ( isset( $_GET[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- query param passthrough
                $args[ $key ] = sanitize_text_field( wp_unslash( $_GET[ $key ] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized via sanitize_text_field
            }
        }

        // Remove our own URL-rewriting filters to prevent redirect loop:
        // Without this, site_url('wp-login.php') gets swapped back to the custom
        // slug by filter_site_url(), and wp_redirect() gets swapped by filter_redirect(),
        // causing /custom-slug/?aswp_token=... → infinite loop.
        remove_filter( 'site_url',       [ __CLASS__, 'filter_site_url'    ], 10 );
        remove_filter( 'network_site_url', [ __CLASS__, 'filter_network_url' ], 10 );
        remove_filter( 'wp_redirect',    [ __CLASS__, 'filter_redirect'    ], 10 );

        wp_safe_redirect( add_query_arg( $args, site_url( 'wp-login.php' ) ) );
        exit;
    }

    // ── Block real wp-login.php ───────────────────────────────────────────────

    public static function block_real_login(): void {
        // Allow if this request was redirected from our custom slug with a valid one-time token.
        if ( ! empty( $_GET['aswp_token'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- one-time redirect token
            $token = sanitize_text_field( wp_unslash( $_GET['aswp_token'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $key   = 'aswp_login_token_' . wp_hash( $token );
            if ( get_transient( $key ) ) {
                delete_transient( $key ); // One-time use
                return;
            }
        }

        // Safety net: recovery token bypass (e.g. ?aswp_recovery=<token>)
        if ( self::has_valid_recovery_token() ) return;

        // Safety net: admin grace cookie — browser was used by an admin recently
        if ( self::has_admin_grace_cookie() ) return;

        // Whitelisted IPs always pass
        $ip = \FortressWP\RequestLogger::get_real_ip();
        if ( class_exists( 'FortressWP\\Whitelist' ) && \FortressWP\Whitelist::is_allowed( $ip ) ) return;

        // Everyone else gets a 404 — NOT a redirect (a redirect would reveal the secret URL)
        self::send_404();
    }

    public static function block_wpadmin_unauth(): void {
        if ( ! get_option( 'aswp_custom_login_block_wpadmin', true ) ) return;

        $uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if ( ! str_starts_with( ltrim( $uri, '/' ), 'wp-admin' ) ) return;

        // Already logged in — fine
        if ( is_user_logged_in() ) return;

        // Safety net: recovery token bypass
        if ( self::has_valid_recovery_token() ) return;

        // Whitelist bypass
        $ip = \FortressWP\RequestLogger::get_real_ip();
        if ( class_exists( 'FortressWP\\Whitelist' ) && \FortressWP\Whitelist::is_allowed( $ip ) ) return;

        // admin-ajax.php must stay accessible (plugins use it unauthenticated)
        if ( str_contains( $uri, 'admin-ajax.php' ) ) return;

        self::send_404();
    }

    private static function send_404(): void {
        global $wp_query;
        if ( $wp_query ) {
            $wp_query->set_404();
        }
        status_header( 404 );
        nocache_headers();

        // Try to load the theme's 404 template for a realistic 404
        $template = get_404_template();
        if ( $template ) {
            include $template;
        } else {
            echo '<!DOCTYPE html><html><head><title>404 Not Found</title></head>
<body><h1>Not Found</h1><p>The page you requested could not be found.</p></body></html>';
        }
        exit;
    }

    // ── URL filters — replace wp-login.php with our slug everywhere ───────────

    public static function filter_login_url( string $url, string $redirect, bool $force_reauth ): string {
        return self::swap( $url, $redirect ? [ 'redirect_to' => $redirect ] : [] );
    }

    public static function filter_logout_url( string $url, string $redirect ): string {
        return self::swap( $url );
    }

    public static function filter_lostpw_url( string $url, string $redirect ): string {
        return self::swap( $url );
    }

    public static function filter_register_url( string $url ): string {
        return self::swap( $url );
    }

    public static function filter_network_url( string $url, string $path, string $scheme ): string {
        if ( str_contains( $url, 'wp-login.php' ) ) return self::swap( $url );
        return $url;
    }

    public static function filter_site_url( string $url, string $path, ?string $scheme, ?int $blog_id ): string {
        if ( str_contains( $url, 'wp-login.php' ) ) return self::swap( $url );
        return $url;
    }

    public static function filter_redirect( string $location, int $status ): string {
        if ( str_contains( $location, 'wp-login.php' ) ) return self::swap( $location );
        return $location;
    }

    // Replace wp-login.php in a URL with the custom slug
    private static function swap( string $url, array $extra_args = [] ): string {
        if ( ! self::$slug ) return $url;

        // Parse and rebuild
        $parts = wp_parse_url( $url );
        $query = [];
        if ( ! empty( $parts['query'] ) ) {
            parse_str( $parts['query'], $query );
        }
        $query = array_merge( $query, $extra_args );

        $new_url = home_url( '/' . self::$slug . '/' );
        if ( $query ) {
            $new_url = add_query_arg( $query, $new_url );
        }

        // Preserve fragment
        if ( ! empty( $parts['fragment'] ) ) {
            $new_url .= '#' . $parts['fragment'];
        }

        return $new_url;
    }

    // ── Anti-lockout safety nets ─────────────────────────────────────────────

    /**
     * Recovery token: append ?aswp_recovery=<token> to wp-login.php to bypass
     * the custom login URL. Token is auto-generated when custom login is enabled.
     */
    private static function has_valid_recovery_token(): bool {
        $token = isset( $_GET['aswp_recovery'] ) ? sanitize_text_field( wp_unslash( $_GET['aswp_recovery'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- recovery token bypass (no nonce available)
        if ( ! $token ) return false;
        $stored = get_option( 'aswp_recovery_token', '' );
        return $stored && hash_equals( $stored, $token );
    }

    /**
     * Admin grace cookie: when an admin loads any admin page, we set a long-lived
     * httponly cookie whose value is an HMAC-signed triple of `user_id|expires|signature`.
     * If their session expires, the cookie proves this browser WAS recently authenticated
     * by a real admin — attackers can't forge it because they lack the WP auth salt.
     */
    private static function has_admin_grace_cookie(): bool {
        if ( empty( $_COOKIE['aswp_admin_grace'] ) ) return false;

        $raw   = sanitize_text_field( wp_unslash( $_COOKIE['aswp_admin_grace'] ) );
        $parts = explode( '|', $raw );
        if ( count( $parts ) !== 3 ) return false;

        [ $user_id, $expires, $sig ] = $parts;
        $user_id = (int) $user_id;
        $expires = (int) $expires;

        if ( $user_id <= 0 || $expires <= time() ) return false;

        $expected = hash_hmac( 'sha256', $user_id . '|' . $expires, self::grace_cookie_key() );
        if ( ! hash_equals( $expected, (string) $sig ) ) return false;

        // Confirm the user still exists and still has administrator capabilities.
        if ( ! function_exists( 'user_can' ) ) return false;
        return (bool) user_can( $user_id, 'manage_options' );
    }

    /**
     * Sets the admin grace cookie. Called from Plugin::boot() when an admin
     * is logged in and on an admin page. Refreshed on every admin page load.
     * The value is an HMAC-signed `user_id|expires|signature` triple bound to
     * wp_salt('auth'), so attackers cannot forge or reuse the cookie.
     */
    public static function set_admin_grace_cookie(): void {
        if ( headers_sent() ) return;
        if ( ! function_exists( 'get_current_user_id' ) ) return;

        $user_id = get_current_user_id();
        if ( $user_id <= 0 ) return;

        // 72-hour cookie — gives the admin 3 days to re-login after session expiry.
        $expires = time() + ( 72 * 3600 );
        $payload = $user_id . '|' . $expires;
        $sig     = hash_hmac( 'sha256', $payload, self::grace_cookie_key() );
        $value   = $payload . '|' . $sig;

        if ( PHP_VERSION_ID >= 70300 ) {
            setcookie( 'aswp_admin_grace', $value, [
                'expires'  => $expires,
                'path'     => COOKIEPATH ?: '/',
                'domain'   => COOKIE_DOMAIN ?: '',
                'secure'   => is_ssl(),
                'httponly' => true,
                'samesite' => 'Strict',
            ] );
        } else {
            setcookie( 'aswp_admin_grace', $value, $expires, COOKIEPATH ?: '/', COOKIE_DOMAIN ?: '', is_ssl(), true );
        }
    }

    /**
     * Secret key used to sign/verify the admin grace cookie. Derived from
     * wp_salt('auth') so it rotates automatically when keys are rotated.
     */
    private static function grace_cookie_key(): string {
        if ( function_exists( 'wp_salt' ) ) {
            return 'aswp-grace|' . wp_salt( 'auth' );
        }
        // Fallback — should never hit this path in a real WP runtime.
        return 'aswp-grace|' . ( defined( 'AUTH_SALT' ) ? AUTH_SALT : 'fallback-salt' );
    }

    /**
     * Ensures a recovery token exists. Called when the feature is enabled.
     */
    public static function ensure_recovery_token(): string {
        $token = get_option( 'aswp_recovery_token', '' );
        if ( ! $token ) {
            $token = wp_generate_password( 32, false );
            update_option( 'aswp_recovery_token', $token, false );
        }
        return $token;
    }

    /**
     * Returns the emergency recovery URL for display to the admin.
     */
    public static function recovery_url(): string {
        $token = self::ensure_recovery_token();
        return site_url( 'wp-login.php?aswp_recovery=' . $token );
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public static function flush_rewrite(): void {
        flush_rewrite_rules();
    }

    public static function current_login_url(): string {
        return home_url( '/' . self::get_slug() . '/' );
    }

    public static function ajax_save(): void {
        check_ajax_referer( 'aswp_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) wp_send_json_error( [], 403 );

        $enabled    = ! empty( $_POST['enabled'] ) && $_POST['enabled'] === '1'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- explicit string comparison
        $custom_slug = isset( $_POST['slug'] ) ? sanitize_title( wp_unslash( $_POST['slug'] ) ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized via sanitize_title
        $block_admin = ! empty( $_POST['block_wpadmin'] ) && $_POST['block_wpadmin'] === '1'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- explicit string comparison

        update_option( 'aswp_custom_login_enabled',      $enabled );
        update_option( 'aswp_custom_login_block_wpadmin', $block_admin );

        // Auto-generate recovery token when enabling custom login
        if ( $enabled ) {
            self::ensure_recovery_token();
        }

        if ( $custom_slug && $custom_slug !== get_option( 'aswp_custom_login_slug' ) ) {
            // Validate: no reserved words
            $reserved = [ 'wp-login', 'wp-admin', 'login', 'admin', 'dashboard', 'wp-signup', 'register' ];
            if ( in_array( $custom_slug, $reserved, true ) ) {
                wp_send_json_error( [ 'message' => "\"$custom_slug\" is too obvious — choose something more secret." ] );
            }
            update_option( 'aswp_custom_login_slug', $custom_slug );
        }

        // Flush rewrite rules so the new slug takes effect immediately
        self::flush_rewrite();
        // Also trigger a second flush on next load (WP sometimes needs two passes)
        update_option( 'aswp_flush_rewrite_pending', 1 );

        wp_send_json_success( [
            'message'      => 'Saved. Your login URL is now: ' . self::current_login_url(),
            'login_url'    => self::current_login_url(),
            'slug'         => get_option( 'aswp_custom_login_slug' ),
            'recovery_url' => self::recovery_url(),
        ] );
    }

    public static function ajax_regenerate(): void {
        check_ajax_referer( 'aswp_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) wp_send_json_error( [], 403 );

        $slug = self::reset_slug();
        wp_send_json_success( [
            'message'   => 'New login URL generated.',
            'login_url' => home_url( '/' . $slug . '/' ),
            'slug'      => $slug,
        ] );
    }
}

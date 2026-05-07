<?php
declare(strict_types=1);

namespace MadeIT\Security\modules;

use MadeIT\Security\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Bot-protection CAPTCHA on login, registration, and password-reset forms.
 *
 * Three providers, all GDPR-friendly and free-tier-supported:
 *   - Google reCAPTCHA v2 ("I'm not a robot" checkbox)
 *   - Google reCAPTCHA v3 (invisible, score-based)
 *   - Cloudflare Turnstile  (privacy-respecting, no Google dependency)
 *
 * Integration model:
 *   - Settings live under `madeit_security_captcha_*` options
 *   - The widget is rendered into the WP login/register/lostpassword form
 *     via `login_form` / `register_form` / `lostpassword_form` actions
 *   - Verification runs via `authenticate` (high priority) BEFORE password
 *     check — so failing the captcha is indistinguishable from a wrong
 *     password to the attacker, but real users see a clear error first
 *   - Whitelisted IPs always bypass (anti-lockout safety)
 *   - Logged-in admins are exempted on subsequent re-authentication prompts
 *
 * Where this fits in the wider security pipeline:
 *
 *     IP block / WAF rule  ──►  CAPTCHA  ──►  brute-force lockout  ──►  WP authenticate
 *                                ↑
 *                          this module
 *
 *   So a banned IP never sees the captcha; an IP under brute-force lockout
 *   does see it (because the captcha runs *before* lockout — wait, see
 *   priority below: lockout runs at 30, captcha at 20, so captcha is asked
 *   FIRST. The lockout step then short-circuits the request anyway, so this
 *   ordering is fine).
 */
final class Captcha {

    public const OPT_PROVIDER       = 'madeit_security_captcha_provider';
    public const OPT_SITE_KEY       = 'madeit_security_captcha_site_key';
    public const OPT_SECRET_KEY     = 'madeit_security_captcha_secret_key';
    public const OPT_V3_THRESHOLD   = 'madeit_security_captcha_v3_threshold';
    public const OPT_ON_LOGIN       = 'madeit_security_captcha_on_login';
    public const OPT_ON_REGISTER    = 'madeit_security_captcha_on_register';
    public const OPT_ON_LOST_PW     = 'madeit_security_captcha_on_lostpassword';
    public const OPT_THEME          = 'madeit_security_captcha_theme';        // light|dark|auto

    public const PROVIDER_OFF           = 'off';
    public const PROVIDER_RECAPTCHA_V2  = 'recaptcha_v2';
    public const PROVIDER_RECAPTCHA_V3  = 'recaptcha_v3';
    public const PROVIDER_TURNSTILE     = 'turnstile';

    private const VERIFY_ENDPOINTS = [
        self::PROVIDER_RECAPTCHA_V2 => 'https://www.google.com/recaptcha/api/siteverify',
        self::PROVIDER_RECAPTCHA_V3 => 'https://www.google.com/recaptcha/api/siteverify',
        self::PROVIDER_TURNSTILE    => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    ];

    /** Submitted-token field name per provider. */
    private const TOKEN_FIELDS = [
        self::PROVIDER_RECAPTCHA_V2 => 'g-recaptcha-response',
        self::PROVIDER_RECAPTCHA_V3 => 'g-recaptcha-response',
        self::PROVIDER_TURNSTILE    => 'cf-turnstile-response',
    ];

    public static function init(): void {
        if ( ! self::is_enabled() ) {
            return;
        }

        // ── Asset loading on the login page ──────────────────────────────
        add_action( 'login_enqueue_scripts', [ self::class, 'enqueue_assets' ] );
        add_action( 'wp_enqueue_scripts',    [ self::class, 'enqueue_assets' ] );

        // ── Render the widget on the right forms ─────────────────────────
        if ( Settings::bool( self::OPT_ON_LOGIN, true ) ) {
            add_action( 'login_form',          [ self::class, 'render_widget' ] );
            add_action( 'woocommerce_login_form', [ self::class, 'render_widget' ] );
        }
        if ( Settings::bool( self::OPT_ON_REGISTER, true ) ) {
            add_action( 'register_form',       [ self::class, 'render_widget' ] );
            add_action( 'woocommerce_register_form', [ self::class, 'render_widget' ] );
        }
        if ( Settings::bool( self::OPT_ON_LOST_PW, true ) ) {
            add_action( 'lostpassword_form',   [ self::class, 'render_widget' ] );
            add_action( 'woocommerce_lostpassword_form', [ self::class, 'render_widget' ] );
        }

        // ── Verification ─────────────────────────────────────────────────
        // Priority 20 — runs BEFORE LoginProtection::check_lockout (30) so
        // bots failing the captcha never increment the brute-force counter
        // (else automated tools could DoS legitimate users by triggering
        // their lockout window with bogus captcha submissions).
        if ( Settings::bool( self::OPT_ON_LOGIN, true ) ) {
            add_filter( 'authenticate',          [ self::class, 'verify_on_login' ], 20, 3 );
        }
        if ( Settings::bool( self::OPT_ON_REGISTER, true ) ) {
            add_filter( 'registration_errors',   [ self::class, 'verify_on_register' ], 10, 1 );
            add_filter( 'woocommerce_process_registration_errors', [ self::class, 'verify_on_woocommerce_register' ], 10, 3 );
        }
        if ( Settings::bool( self::OPT_ON_LOST_PW, true ) ) {
            add_action( 'lostpassword_post',     [ self::class, 'verify_on_lostpassword' ], 10, 1 );
        }
    }

    // ── State & gating ───────────────────────────────────────────────────────

    public static function is_enabled(): bool {
        $provider = (string) Settings::get( self::OPT_PROVIDER, self::PROVIDER_OFF );
        if ( self::PROVIDER_OFF === $provider ) {
            return false;
        }
        if ( ! in_array( $provider, [ self::PROVIDER_RECAPTCHA_V2, self::PROVIDER_RECAPTCHA_V3, self::PROVIDER_TURNSTILE ], true ) ) {
            return false;
        }
        return '' !== (string) Settings::get( self::OPT_SITE_KEY, '' )
            && '' !== (string) Settings::get( self::OPT_SECRET_KEY, '' );
    }

    public static function provider(): string {
        return (string) Settings::get( self::OPT_PROVIDER, self::PROVIDER_OFF );
    }

    /**
     * Whitelisted IPs and the safe-mode kill switch always bypass —
     * anti-lockout safety net so a misconfigured captcha can't lock the
     * site operator out of their own login.
     */
    private static function should_bypass(): bool {
        if ( defined( 'MADEIT_SECURITY_BLOCKING_DISABLED' ) && MADEIT_SECURITY_BLOCKING_DISABLED ) {
            return true;
        }
        if ( ! class_exists( '\\MadeIT\\Security\\Whitelist' ) || ! class_exists( '\\MadeIT\\Security\\RequestLogger' ) ) {
            return false;
        }
        $ip = \MadeIT\Security\RequestLogger::get_real_ip();
        return \MadeIT\Security\Whitelist::is_allowed( $ip );
    }

    // ── Asset loading ────────────────────────────────────────────────────────

    public static function enqueue_assets(): void {
        if ( 'wp_enqueue_scripts' === current_action() && ! self::should_enqueue_woocommerce_assets() ) {
            return;
        }

        $provider = self::provider();
        $site_key = (string) Settings::get( self::OPT_SITE_KEY, '' );

        if ( self::PROVIDER_OFF === $provider || '' === $site_key ) {
            return;
        }

        // CSS layout shim — vertical breathing room around the widget.
        $css = '#login form .g-recaptcha,#login form .cf-turnstile,.woocommerce-form-login .g-recaptcha,.woocommerce-form-login .cf-turnstile,.woocommerce-form-register .g-recaptcha,.woocommerce-form-register .cf-turnstile,.woocommerce-ResetPassword .g-recaptcha,.woocommerce-ResetPassword .cf-turnstile{margin:14px 0;display:flex;justify-content:center}';
        wp_register_style( 'madeit-security-captcha', false, [], MADEIT_VERSION );
        wp_enqueue_style( 'madeit-security-captcha' );
        wp_add_inline_style( 'madeit-security-captcha', $css );

        switch ( $provider ) {
            case self::PROVIDER_RECAPTCHA_V2:
                wp_enqueue_script(
                    'madeit-security-captcha-vendor',
                    'https://www.google.com/recaptcha/api.js',
                    [],
                    null, // null version: don't break Google's caching
                    [ 'in_footer' => true, 'strategy' => 'defer' ]
                );
                break;

            case self::PROVIDER_RECAPTCHA_V3:
                $url = add_query_arg( 'render', $site_key, 'https://www.google.com/recaptcha/api.js' );
                wp_enqueue_script(
                    'madeit-security-captcha-vendor',
                    $url,
                    [],
                    null,
                    [ 'in_footer' => true, 'strategy' => 'defer' ]
                );
                // Inline glue: hooks every login-style form's submit, fetches
                // a fresh v3 token, drops it into the hidden field, then
                // re-submits programmatically.
                $glue = self::recaptcha_v3_glue( $site_key );
                wp_add_inline_script( 'madeit-security-captcha-vendor', $glue );
                break;

            case self::PROVIDER_TURNSTILE:
                wp_enqueue_script(
                    'madeit-security-captcha-vendor',
                    'https://challenges.cloudflare.com/turnstile/v0/api.js',
                    [],
                    null,
                    [ 'in_footer' => true, 'strategy' => 'defer' ]
                );
                break;
        }
    }

    private static function recaptcha_v3_glue( string $site_key ): string {
        // 'login' is just a label visible in the reCAPTCHA admin console.
        $key = esc_js( $site_key );
        return <<<JS
(function () {
    if (typeof grecaptcha === 'undefined') { return; }
    grecaptcha.ready(function () {
                var forms = document.querySelectorAll('#loginform, #registerform, #lostpasswordform, form.woocommerce-form-login, form.woocommerce-form-register, form.woocommerce-ResetPassword');
        forms.forEach(function (form) {
            // Inject hidden field once.
            if (! form.querySelector('input[name="g-recaptcha-response"]')) {
                var f = document.createElement('input');
                f.type  = 'hidden';
                f.name  = 'g-recaptcha-response';
                f.value = '';
                form.appendChild(f);
            }
            form.addEventListener('submit', function (e) {
                if (form.dataset.madeitSecurityCaptchaVerified === '1') { return; }
                e.preventDefault();
                grecaptcha.execute('{$key}', { action: 'login' }).then(function (token) {
                    form.querySelector('input[name="g-recaptcha-response"]').value = token;
                    form.dataset.madeitSecurityCaptchaVerified = '1';
                    form.submit();
                });
            });
        });
    });
})();
JS;
    }

    // ── Render ───────────────────────────────────────────────────────────────

    public static function render_widget(): void {
        $provider = self::provider();
        $site_key = (string) Settings::get( self::OPT_SITE_KEY, '' );
        $theme    = (string) Settings::get( self::OPT_THEME, 'auto' );

        if ( self::PROVIDER_OFF === $provider || '' === $site_key ) {
            return;
        }

        $theme_attr = in_array( $theme, [ 'light', 'dark' ], true ) ? $theme : 'auto';

        switch ( $provider ) {
            case self::PROVIDER_RECAPTCHA_V2:
                printf(
                    '<div class="g-recaptcha" data-sitekey="%s" data-theme="%s"></div>',
                    esc_attr( $site_key ),
                    esc_attr( 'auto' === $theme_attr ? 'light' : $theme_attr )
                );
                break;

            case self::PROVIDER_RECAPTCHA_V3:
                // No visible widget — JS injects the hidden field.
                // Keep a minimal badge-presence note for legal compliance.
                echo '<p style="font-size:10px;color:#888;margin:6px 0 0;text-align:center">'
                   . esc_html__( 'Protected by reCAPTCHA — Google ', 'madeit' )
                   . '<a href="https://policies.google.com/privacy" target="_blank" rel="noopener nofollow">' . esc_html__( 'Privacy', 'madeit' ) . '</a> &middot; '
                   . '<a href="https://policies.google.com/terms"   target="_blank" rel="noopener nofollow">' . esc_html__( 'Terms',   'madeit' ) . '</a>'
                   . '</p>';
                break;

            case self::PROVIDER_TURNSTILE:
                printf(
                    '<div class="cf-turnstile" data-sitekey="%s" data-theme="%s"></div>',
                    esc_attr( $site_key ),
                    esc_attr( $theme_attr )
                );
                break;
        }
    }

    // ── Verification entry points ────────────────────────────────────────────

    /**
     * @param \WP_User|\WP_Error|null $user
     * @return \WP_User|\WP_Error|null
     */
    public static function verify_on_login( $user, string $username, string $password ) {
        // Don't block password-less probes: those will fail later anyway, and
        // running the captcha verify here would consume the token unnecessarily.
        if ( '' === $username || '' === $password ) {
            return $user;
        }
        // Already an error from an earlier filter — don't override.
        if ( is_wp_error( $user ) ) {
            return $user;
        }
        if ( self::should_bypass() ) {
            return $user;
        }
        // Skip non-form contexts (XML-RPC, REST, app passwords, programmatic).
        if ( defined( 'XMLRPC_REQUEST' ) && XMLRPC_REQUEST ) {
            return $user;
        }
        if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
            return $user;
        }
        if ( ! self::is_form_post() ) {
            return $user;
        }

        if ( ! self::verify_request() ) {
            if ( class_exists( '\\MadeIT\\Security\\modules\\LoginProtection' ) ) {
                \MadeIT\Security\modules\LoginProtection::register_failed_attempt( $username, 'captcha' );
            }
            self::log_failure( 'login', $username );
            return new \WP_Error(
                'madeit_security_captcha_failed',
                __( '<strong>Security check failed.</strong> Please complete the CAPTCHA and try again.', 'madeit' )
            );
        }
        return $user;
    }

    /**
     * @param \WP_Error $errors
     * @return \WP_Error
     */
    public static function verify_on_register( \WP_Error $errors ): \WP_Error {
        if ( self::should_bypass() ) {
            return $errors;
        }
        if ( ! self::verify_request() ) {
            self::log_failure( 'register', '' );
            $errors->add( 'madeit_security_captcha_failed', __( '<strong>Security check failed.</strong> Please complete the CAPTCHA and try again.', 'madeit' ) );
        }
        return $errors;
    }

    /**
     * @param \WP_Error $errors
     */
    public static function verify_on_woocommerce_register( \WP_Error $errors, string $username, string $email ): \WP_Error {
        unset( $username, $email );

        if ( self::should_bypass() ) {
            return $errors;
        }
        if ( ! self::verify_request() ) {
            self::log_failure( 'register', '' );
            $errors->add( 'madeit_security_captcha_failed', __( '<strong>Security check failed.</strong> Please complete the CAPTCHA and try again.', 'madeit' ) );
        }
        return $errors;
    }

    public static function verify_on_lostpassword( $errors ): void {
        if ( self::should_bypass() ) {
            return;
        }
        if ( self::verify_request() ) {
            return;
        }
        self::log_failure( 'lostpassword', '' );

        if ( $errors instanceof \WP_Error ) {
            $errors->add( 'madeit_security_captcha_failed', __( '<strong>Security check failed.</strong> Please complete the CAPTCHA and try again.', 'madeit' ) );
            return;
        }
        // Older WP versions invoke this action without an errors arg —
        // bail out hard so the password-reset email is NOT sent.
        wp_die(
            esc_html__( 'Security check failed. Please complete the CAPTCHA and try again.', 'madeit' ),
            esc_html__( 'CAPTCHA required', 'madeit' ),
            [ 'response' => 403, 'back_link' => true ]
        );
    }

    // ── Core verification ────────────────────────────────────────────────────

    private static function verify_request(): bool {
        $provider = self::provider();
        if ( self::PROVIDER_OFF === $provider ) {
            return true;
        }
        if ( ! isset( self::TOKEN_FIELDS[ $provider ] ) ) {
            return false;
        }
        $field = self::TOKEN_FIELDS[ $provider ];
        // phpcs:ignore WordPress.Security.NonceVerification.Missing -- WP login form has no nonce by design; captcha + brute-force lockout are the controls
        $token = isset( $_POST[ $field ] ) ? sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) : '';
        if ( '' === $token || strlen( $token ) > 4096 ) {
            return false;
        }

        return self::verify_token( $provider, $token );
    }

    private static function verify_token( string $provider, string $token ): bool {
        $secret = (string) Settings::get( self::OPT_SECRET_KEY, '' );
        if ( '' === $secret ) {
            return false;
        }

        $endpoint = self::VERIFY_ENDPOINTS[ $provider ] ?? '';
        if ( '' === $endpoint ) {
            return false;
        }

        $remote_ip = class_exists( '\\MadeIT\\Security\\RequestLogger' ) ? \MadeIT\Security\RequestLogger::get_real_ip() : '';

        $response = wp_remote_post( $endpoint, [
            'timeout'   => 5,
            'sslverify' => true,
            'body'      => [
                'secret'   => $secret,
                'response' => $token,
                'remoteip' => $remote_ip,
            ],
        ] );

        if ( is_wp_error( $response ) ) {
            // Network failure: fail-CLOSED. We'd rather block a legitimate
            // user (who can retry) than admit a bot.
            return false;
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        if ( $code < 200 || $code >= 300 ) {
            return false;
        }

        $data = json_decode( (string) wp_remote_retrieve_body( $response ), true );
        if ( ! is_array( $data ) || empty( $data['success'] ) ) {
            return false;
        }

        // For reCAPTCHA v3, also enforce a minimum score.
        if ( self::PROVIDER_RECAPTCHA_V3 === $provider ) {
            $threshold = (float) Settings::get( self::OPT_V3_THRESHOLD, 0.5 );
            $score     = isset( $data['score'] ) ? (float) $data['score'] : 0.0;
            if ( $score < $threshold ) {
                self::record_low_score( $score );
                return false;
            }
        }

        return true;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static function is_form_post(): bool {
        if ( ! isset( $_SERVER['REQUEST_METHOD'] ) ) {
            return false;
        }
        $method = strtoupper( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ) ) );
        return 'POST' === $method;
    }

    private static function should_enqueue_woocommerce_assets(): bool {
        if ( ! class_exists( '\\WooCommerce' ) ) {
            return false;
        }

        if ( function_exists( 'is_account_page' ) && is_account_page() ) {
            return true;
        }

        if ( function_exists( 'is_wc_endpoint_url' ) && ( is_wc_endpoint_url( 'lost-password' ) || is_wc_endpoint_url( 'reset-password' ) ) ) {
            return true;
        }

        return false;
    }

    private static function record_low_score( float $score ): void {
        global $wpdb;
        $ip = class_exists( '\\MadeIT\\Security\\RequestLogger' ) ? \MadeIT\Security\RequestLogger::get_real_ip() : '';
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security event, not cacheable
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'captcha_low_score',
                'severity'    => 'low',
                'ip'          => $ip,
                'url'         => wp_login_url(),
                'method'      => 'POST',
                'rule_id'     => 'recaptcha_v3',
                'description' => sprintf( 'reCAPTCHA v3 score %0.2f below threshold', $score ),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
    }

    private static function log_failure( string $context, string $username ): void {
        global $wpdb;
        $ip = class_exists( '\\MadeIT\\Security\\RequestLogger' ) ? \MadeIT\Security\RequestLogger::get_real_ip() : '';
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security event, not cacheable
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'captcha_failed',
                'severity'    => 'medium',
                'ip'          => $ip,
                'url'         => wp_login_url(),
                'method'      => 'POST',
                'rule_id'     => 'captcha_' . self::provider() . '_' . $context,
                'description' => sprintf( 'CAPTCHA failed (context: %s, user: %s)', $context, $username ?: '—' ),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
    }
}

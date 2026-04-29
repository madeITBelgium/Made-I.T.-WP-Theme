<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Two-Factor Authentication
    * Supports: TOTP (Google Authenticator), Email OTP, Recovery Codes
    */
class TwoFA {

    /** Guard flag to prevent wp_login hook from re-entering after 2FA completion. */
    private static bool $completing_2fa = false;

    public static function init(): void {
        // Intercept login after password verified
        add_action( 'wp_login',           [ __CLASS__, 'on_login' ], 10, 2 );
        add_filter( 'authenticate',       [ __CLASS__, 'block_if_pending_2fa' ], 50, 3 );
        add_action( 'login_form_madeitSecurity2fa', [ __CLASS__, 'handle_2fa_form' ] );

        // Force 2FA enrollment for users whose role requires it.
        add_action( 'admin_init',        [ __CLASS__, 'enforce_enrollment' ], 0 );
        add_action( 'admin_notices',     [ __CLASS__, 'enrollment_notice' ] );

        // User profile: setup 2FA
        add_action( 'show_user_profile',    [ __CLASS__, 'profile_section' ] );
        add_action( 'edit_user_profile',    [ __CLASS__, 'profile_section' ] );
        add_action( 'personal_options_update',  [ __CLASS__, 'save_profile' ] );
        add_action( 'edit_user_profile_update', [ __CLASS__, 'save_profile' ] );

        // Enqueue 2FA profile script on user profile pages
        add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_profile_script' ] );

        // AJAX
        add_action( 'wp_ajax_madeit_security_2fa_verify_totp',    [ __CLASS__, 'ajax_verify_totp'   ] );
        add_action( 'wp_ajax_madeit_security_2fa_generate_totp',   [ __CLASS__, 'ajax_generate_totp' ] );
        add_action( 'wp_ajax_madeit_security_2fa_send_email_otp',  [ __CLASS__, 'ajax_send_email_otp'] );
        add_action( 'wp_ajax_madeit_security_2fa_disable',         [ __CLASS__, 'ajax_disable_2fa'   ] );
        add_action( 'wp_ajax_madeit_security_2fa_enable_email',    [ __CLASS__, 'ajax_enable_email'  ] );
        add_action( 'wp_ajax_madeit_security_2fa_regen_codes',     [ __CLASS__, 'ajax_regen_codes'   ] );
        add_action( 'wp_ajax_nopriv_madeit_security_2fa_validate', [ __CLASS__, 'ajax_validate_2fa'  ] );
        add_action( 'wp_ajax_nopriv_madeit_security_2fa_resend',   [ __CLASS__, 'ajax_resend_otp'   ] );
    }

    // ── After password login — check if 2FA is required ───────────────────────
    public static function on_login( string $user_login, \WP_User $user ): void {
        // Prevent re-entry when do_action('wp_login') is called after 2FA completion
        if ( self::$completing_2fa ) return;

        // If the role requires 2FA but the user hasn't enrolled, flag the account —
        // the `enforce_enrollment()` hook below will confine them to profile.php
        // until they set up TOTP or Email OTP.
        if ( self::role_requires_2fa( $user ) && ! self::user_has_2fa( $user->ID ) ) {
            update_user_meta( $user->ID, 'madeit_security_2fa_enrollment_required', 1 );
            return;
        }

        if ( ! self::user_has_2fa( $user->ID ) ) return;
        if ( ! self::role_requires_2fa( $user ) ) return;

        // Destroy the newly-created session and force 2FA
        wp_destroy_current_session();
        wp_clear_auth_cookie();

        // Store a short-lived token to resume login after 2FA
        $token = wp_generate_password( 32, false );
        $nonce = wp_create_nonce( 'madeit_security_2fa_challenge_' . $token );
        set_transient( 'madeit_security_2fa_pending_' . $token, [
            'user_id'  => $user->ID,
            'login'    => $user_login,
            'ip'       => \MadeIT\Security\RequestLogger::get_real_ip(),
            'created'  => time(),
            'nonce'    => $nonce,
            'attempts' => 0,
            'resends'  => 0,
            'last_resend' => 0,
        ], 300 ); // 5 min TTL

        // Redirect to 2FA challenge page
        $redirect = add_query_arg( [
            'action' => 'madeitSecurity2fa',
            'token'  => $token,
        ], wp_login_url() );

        wp_safe_redirect( $redirect );
        exit;
    }

    // ── Handle the 2FA form display + submission ───────────────────────────────
    public static function handle_2fa_form(): void {
        $token = isset( $_GET['token'] ) ? sanitize_text_field( wp_unslash( $_GET['token'] ) ) : '';
        $data  = get_transient( 'madeit_security_2fa_pending_' . $token );

        if ( ! $data ) {
            wp_safe_redirect( wp_login_url() );
            exit;
        }

        $user   = get_user_by( 'id', $data['user_id'] );
        $method = get_user_meta( $data['user_id'], 'madeit_security_2fa_method', true ) ?: 'totp';

        // Auto-send email OTP if method is email (with cooldown to prevent flooding)
        if ( $method === 'email' && isset( $_GET['action'] ) ) {
            $otp_key = 'madeit_security_otp_cooldown_' . $data['user_id'];
            if ( ! get_transient( $otp_key ) ) {
                self::send_email_otp( $data['user_id'] );
                set_transient( $otp_key, 1, 60 );
            }
        }

        // Process submitted code
        if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'POST' ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated -- simple string comparison, no sanitization needed
            check_admin_referer( 'madeit_security_2fa_' . $token );
            $code = isset( $_POST['madeit_security_2fa_code'] ) ? sanitize_text_field( wp_unslash( $_POST['madeit_security_2fa_code'] ) ) : '';

            $valid = match ( $method ) {
                'totp'  => self::verify_totp( $data['user_id'], $code ),
                'email' => self::verify_email_otp( $data['user_id'], $code ),
                default => false,
            };

            // Check recovery codes if primary fails
            if ( ! $valid ) {
                $valid = self::verify_recovery_code( $data['user_id'], $code );
            }

            if ( $valid ) {
                delete_transient( 'madeit_security_2fa_pending_' . $token );

                // Fully log the user in — set guard to prevent on_login re-entry
                self::$completing_2fa = true;
                wp_set_current_user( $data['user_id'] );
                wp_set_auth_cookie( $data['user_id'], false );
                do_action( 'wp_login', $data['login'], $user ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- triggering WP core hook
                self::$completing_2fa = false;

                $redirect = admin_url();
                wp_safe_redirect( $redirect );
                exit;
            }

            // Rate limit: enforce max attempts on form POST path
            $attempts = (int) ( $data['attempts'] ?? 0 ) + 1;
            $data['attempts'] = $attempts;
            $remaining = 300 - ( time() - (int) ( $data['created'] ?? time() ) );
            if ( $remaining <= 0 || $attempts >= self::MAX_2FA_ATTEMPTS ) {
                delete_transient( 'madeit_security_2fa_pending_' . $token );
                if ( $attempts >= self::MAX_2FA_ATTEMPTS ) {
                    wp_safe_redirect( wp_login_url() );
                    exit;
                }
            } else {
                set_transient( 'madeit_security_2fa_pending_' . $token, $data, $remaining );
            }

            // Failed 2FA attempt
            self::show_2fa_page( $token, $method, $user, 'Invalid code. Please try again.' );
            exit;
        }

        self::show_2fa_page( $token, $method, $user );
        exit;
    }

    private static function show_2fa_page( string $token, string $method, \WP_User $user, string $error = '' ): void {
        $form_nonce    = wp_create_nonce( 'madeit_security_2fa_' . $token );
        $data          = get_transient( 'madeit_security_2fa_pending_' . $token );
        $challenge_nonce = isset( $data['nonce'] ) ? $data['nonce'] : '';
        $label   = $method === 'email' ? 'Email OTP' : 'Authenticator Code';
        $hint    = $method === 'email'
            ? 'Enter the 6-digit code sent to ' . obfuscate_email( $user->user_email )
            : 'Open your authenticator app and enter the 6-digit code.';

        // Enqueue 2FA styles and (optionally) resend script via WP login page hooks.
        wp_enqueue_style( 'madeit-security-2fa-page', MADEIT_SECURITY_URL . 'includes/assets/css/twofa-page.css', [], MADEIT_VERSION );

        if ( $method === 'email' ) {
            wp_enqueue_script( 'madeit-security-2fa-resend', MADEIT_SECURITY_URL . 'includes/assets/js/twofa-resend.js', [], MADEIT_VERSION, true );
            wp_localize_script( 'madeit-security-2fa-resend', 'madeitSecurity2faCfg', [
                'token'   => $token,
                'nonce'   => $challenge_nonce,
                'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            ] );
        }

        login_header( 'Two-Factor Authentication' );
        echo '<div class="madeit-security-2fa-wrap">';
        echo '<h1>Two-Factor Authentication</h1>';
        if ( $error ) echo '<div class="madeit-security-2fa-error">' . esc_html( $error ) . '</div>';
        echo '<p>' . esc_html( $hint ) . '</p>';
        echo '<form method="post">';
        echo '<input type="hidden" name="_wpnonce" value="' . esc_attr( $form_nonce ) . '">';
        echo '<input type="text" name="madeit_security_2fa_code" class="madeit-security-code-input" maxlength="8" autocomplete="one-time-code" autofocus placeholder="000000">';
        echo '<button type="submit" class="madeit-security-2fa-submit">Verify</button>';
        if ( $method === 'email' ) {
            echo '<button type="button" class="madeit-security-2fa-resend" id="madeit-security-resend-btn">Resend code</button>';
        }
        echo '<p style="margin-top:16px"><a href="' . esc_url( wp_login_url() ) . '" style="color:#999;font-size:.8rem">Back to login</a></p>';
        echo '</form></div>';
        login_footer();
    }

    public static function block_if_pending_2fa( $user, $username, $password ) { return $user; }

    // ── TOTP (RFC 6238) ────────────────────────────────────────────────────────
    public static function generate_totp_secret(): string {
        $chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $secret = '';
        for ( $i = 0; $i < 32; $i++ ) {
            $secret .= $chars[ random_int( 0, 31 ) ];
        }
        return $secret;
    }

    public static function verify_totp( int $user_id, string $code ): bool {
        $secret = get_user_meta( $user_id, 'madeit_security_totp_secret', true );
        if ( ! $secret ) return false;

        $code = preg_replace( '/\s/', '', $code );
        $time = (int) floor( time() / 30 );

        // Check ±1 window for clock drift
        for ( $drift = -1; $drift <= 1; $drift++ ) {
            if ( self::compute_totp( $secret, $time + $drift ) === $code ) {
                // Prevent replay: store last used time-step
                $last = (int) get_user_meta( $user_id, 'madeit_security_totp_last_used', true );
                if ( $last === ( $time + $drift ) ) return false;
                update_user_meta( $user_id, 'madeit_security_totp_last_used', $time + $drift );
                return true;
            }
        }
        return false;
    }

    private static function compute_totp( string $secret, int $time_step ): string {
        $key    = self::base32_decode( $secret );
        $msg    = pack( 'N*', 0, $time_step );
        $hash   = hash_hmac( 'sha1', $msg, $key, true );
        $offset = ord( $hash[19] ) & 0x0f;
        $code   = (
            ( ( ord( $hash[ $offset ]     ) & 0x7f ) << 24 ) |
            ( ( ord( $hash[ $offset + 1 ] ) & 0xff ) << 16 ) |
            ( ( ord( $hash[ $offset + 2 ] ) & 0xff ) << 8  ) |
            (   ord( $hash[ $offset + 3 ] ) & 0xff )
        ) % 1000000;
        return str_pad( (string) $code, 6, '0', STR_PAD_LEFT );
    }

    private static function base32_decode( string $input ): string {
        $map    = array_flip( str_split( 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' ) );
        $input  = strtoupper( rtrim( $input, '=' ) );
        $buf    = 0;
        $bits   = 0;
        $output = '';
        foreach ( str_split( $input ) as $ch ) {
            if ( ! isset( $map[ $ch ] ) ) continue;
            $buf  = ( $buf << 5 ) | $map[ $ch ];
            $bits += 5;
            if ( $bits >= 8 ) {
                $output .= chr( ( $buf >> ( $bits - 8 ) ) & 0xff );
                $bits   -= 8;
            }
        }
        return $output;
    }

    public static function get_totp_uri( int $user_id, string $secret ): string {
        $user  = get_user_by( 'id', $user_id );
        $label = rawurlencode( get_bloginfo( 'name' ) . ':' . $user->user_email );
        return 'otpauth://totp/' . $label
                . '?secret=' . $secret
                . '&issuer=' . rawurlencode( get_bloginfo( 'name' ) )
                . '&algorithm=SHA1&digits=6&period=30';
    }

    // ── Email OTP ──────────────────────────────────────────────────────────────
    public static function send_email_otp( int $user_id ): void {
        $user = get_user_by( 'id', $user_id );
        if ( ! $user ) return;

        $code = str_pad( (string) random_int( 0, 999999 ), 6, '0', STR_PAD_LEFT );
        set_transient( 'madeit_security_email_otp_' . $user_id, password_hash( $code, PASSWORD_BCRYPT ), 600 );

        wp_mail(
            $user->user_email,
            'Your login code for ' . get_bloginfo( 'name' ),
            "Your one-time login code is:\n\n  $code\n\nThis code expires in 10 minutes.\n\nIf you did not request this, someone may be attempting to access your account."
        );
    }

    public static function verify_email_otp( int $user_id, string $code ): bool {
        $hash = get_transient( 'madeit_security_email_otp_' . $user_id );
        if ( ! $hash ) return false;
        if ( password_verify( trim( $code ), $hash ) ) {
            delete_transient( 'madeit_security_email_otp_' . $user_id );
            return true;
        }
        return false;
    }

    // ── Recovery codes ─────────────────────────────────────────────────────────
    // Codes are generated and stored lowercase so case-insensitive entry
    // (the user typing upper or lower) works consistently on verification.
    public static function generate_recovery_codes( int $user_id ): array {
        $codes = [];
        for ( $i = 0; $i < 10; $i++ ) {
            $plain   = strtolower( implode( '-', str_split( wp_generate_password( 16, false ), 4 ) ) );
            $codes[] = $plain;
        }
        // Store hashed — always hash the lowercase form so verification matches.
        $hashed = array_map( fn( $c ) => password_hash( $c, PASSWORD_BCRYPT ), $codes );
        update_user_meta( $user_id, 'madeit_security_recovery_codes', $hashed );
        return $codes; // Return plain once for display
    }

    public static function verify_recovery_code( int $user_id, string $code ): bool {
        $hashes = (array) get_user_meta( $user_id, 'madeit_security_recovery_codes', true );
        // Codes are stored hashed from their lowercase form — normalize user input the same way.
        $code   = strtolower( preg_replace( '/\s/', '', $code ) );
        foreach ( $hashes as $i => $hash ) {
            if ( password_verify( $code, $hash ) ) {
                unset( $hashes[ $i ] );
                update_user_meta( $user_id, 'madeit_security_recovery_codes', array_values( $hashes ) );
                return true;
            }
        }
        return false;
    }

    // ── 2FA Enrollment enforcement ─────────────────────────────────────────────

    /**
     * Confines users whose role requires 2FA (but who have not yet enrolled)
        * to profile.php until they set up TOTP or Email OTP. Mirrors the
        * force-password-reset pattern used by PostBreach.
        */
    public static function enforce_enrollment(): void {
        if ( wp_doing_ajax() || ! is_user_logged_in() ) return;

        $user = wp_get_current_user();
        if ( ! $user instanceof \WP_User || $user->ID === 0 ) return;

        // Clear stale flag if user has now enrolled or their role no longer requires 2FA.
        if ( self::user_has_2fa( $user->ID ) || ! self::role_requires_2fa( $user ) ) {
            if ( get_user_meta( $user->ID, 'madeit_security_2fa_enrollment_required', true ) ) {
                delete_user_meta( $user->ID, 'madeit_security_2fa_enrollment_required' );
            }
            return;
        }

        // Role requires 2FA but user hasn't enrolled — (re-)flag and force enrollment.
        update_user_meta( $user->ID, 'madeit_security_2fa_enrollment_required', 1 );

        global $pagenow;
        if ( $pagenow === 'profile.php' ) return;
        // Allow logout so they can exit cleanly if they refuse to enroll.
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'logout' ) return; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- logout handled by WP core below

        wp_safe_redirect( add_query_arg( 'madeit_security_2fa_required', '1', admin_url( 'profile.php' ) ) . '#madeit-security-2fa-setup' );
        exit;
    }

    /**
     * Admin notice shown on profile.php when enrollment is pending.
        */
    public static function enrollment_notice(): void {
        if ( ! is_user_logged_in() ) return;
        if ( ! isset( $_GET['madeit_security_2fa_required'] ) ) return; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display-only notice
        $user = wp_get_current_user();
        if ( ! $user instanceof \WP_User || ! self::role_requires_2fa( $user ) ) return;
        if ( self::user_has_2fa( $user->ID ) ) return;

        echo '<div class="notice notice-error"><p><strong>Two-Factor Authentication required:</strong> '
            . 'Your role requires 2FA. Set it up below to continue — you cannot access other admin pages '
            . 'until 2FA is enabled on your account.</p></div>';
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    public static function user_has_2fa( int $user_id ): bool {
        return (bool) get_user_meta( $user_id, 'madeit_security_2fa_enabled', true );
    }

    public static function role_requires_2fa( \WP_User $user ): bool {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_twofa_enabled', false ) ) return false;
        $raw      = \MadeIT\Security\Settings::string( 'madeit_security_twofa_required_roles', 'administrator' );
        $required = is_array( $raw ) ? $raw : array_filter( array_map( 'trim', explode( ',', $raw ) ) );
        return (bool) array_intersect( $required, $user->roles );
    }

    // ── AJAX: generate TOTP secret ─────────────────────────────────────────────
    public static function ajax_generate_totp(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! is_user_logged_in() ) wp_send_json_error( [], 403 );

        $user_id = get_current_user_id();
        $secret  = self::generate_totp_secret();
        // Store temporarily until confirmed
        update_user_meta( $user_id, 'madeit_security_totp_secret_pending', $secret );

        $uri = self::get_totp_uri( $user_id, $secret );

        // Generate QR code SVG server-side (no external API dependency).
        $qr_svg = '';
        if ( class_exists( 'MadeIT\Security\\lib\\QRCode' ) || file_exists( MADEIT_SECURITY_DIR . 'includes/lib/QRCode.php' ) ) {
            require_once MADEIT_SECURITY_DIR . 'includes/lib/QRCode.php';
            $qr_svg = \MadeIT\Security\lib\QRCode::svg( $uri, 200 );
        }

        wp_send_json_success( [
            'secret' => $secret,
            'uri'    => $uri,
            'qr_svg' => $qr_svg,
        ] );
    }

    public static function ajax_verify_totp(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! is_user_logged_in() ) wp_send_json_error( [], 403 );

        $user_id = get_current_user_id();
        $code    = isset( $_POST['code'] ) ? sanitize_text_field( wp_unslash( $_POST['code'] ) ) : '';
        $secret  = get_user_meta( $user_id, 'madeit_security_totp_secret_pending', true );

        if ( ! $secret ) wp_send_json_error( [ 'message' => 'No pending secret. Generate one first.' ] );

        // Verify directly against the pending secret without swapping user_meta
        $code  = preg_replace( '/\s/', '', $code );
        $time  = (int) floor( time() / 30 );
        $valid = false;
        for ( $drift = -1; $drift <= 1; $drift++ ) {
            if ( self::compute_totp( $secret, $time + $drift ) === $code ) {
                $valid = true;
                break;
            }
        }

        if ( $valid ) {
            // Atomically promote pending secret to active
            update_user_meta( $user_id, 'madeit_security_totp_secret', $secret );
            delete_user_meta( $user_id, 'madeit_security_totp_secret_pending' );
            update_user_meta( $user_id, 'madeit_security_2fa_enabled', true );
            update_user_meta( $user_id, 'madeit_security_2fa_method',  'totp' );
            update_user_meta( $user_id, 'madeit_security_totp_last_used', $time );
            delete_user_meta( $user_id, 'madeit_security_2fa_enrollment_required' );
            $codes = self::generate_recovery_codes( $user_id );
            wp_send_json_success( [ 'message' => '2FA enabled!', 'recovery_codes' => $codes ] );
        } else {
            wp_send_json_error( [ 'message' => 'Code invalid. Check your clock and try again.' ] );
        }
    }

    public static function ajax_send_email_otp(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! is_user_logged_in() ) wp_send_json_error( [], 403 );

        $uid = get_current_user_id();
        $key = 'madeit_security_otp_cooldown_' . $uid;
        if ( get_transient( $key ) ) {
            wp_send_json_error( [ 'message' => 'Please wait before requesting another code.' ] );
        }
        set_transient( $key, 1, 60 ); // 60-second cooldown

        self::send_email_otp( $uid );
        wp_send_json_success( [ 'message' => 'Code sent.' ] );
    }

    /** Max attempts allowed per 2FA token before it is invalidated. */
    private const MAX_2FA_ATTEMPTS = 5;

    /** Minimum seconds between OTP resend requests. */
    private const RESEND_COOLDOWN = 60;

    /** Max OTP resends per token. */
    private const MAX_RESENDS = 5;

    public static function ajax_validate_2fa(): void {
        $token  = isset( $_POST['token'] )  ? sanitize_text_field( wp_unslash( $_POST['token'] ) )  : '';
        $code   = isset( $_POST['code'] )   ? sanitize_text_field( wp_unslash( $_POST['code'] ) )   : '';
        $nonce  = isset( $_POST['nonce'] )  ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) )  : '';

        $data = get_transient( 'madeit_security_2fa_pending_' . $token );
        if ( ! $data ) {
            wp_send_json_error( [ 'message' => 'Session expired.' ] );
        }

        // Verify the nonce that was embedded in the transient at creation
        if ( ! isset( $data['nonce'] ) || ! wp_verify_nonce( $nonce, 'madeit_security_2fa_challenge_' . $token ) ) {
            wp_send_json_error( [ 'message' => 'Invalid request.' ] );
        }

        // Rate limit: enforce max attempts per token
        $attempts = (int) ( $data['attempts'] ?? 0 );
        if ( $attempts >= self::MAX_2FA_ATTEMPTS ) {
            delete_transient( 'madeit_security_2fa_pending_' . $token );
            wp_send_json_error( [ 'message' => 'Too many attempts. Please log in again.' ] );
        }

        // Increment attempt counter — preserve original TTL deadline
        $data['attempts'] = $attempts + 1;
        $remaining = 300 - ( time() - (int) ( $data['created'] ?? time() ) );
        if ( $remaining <= 0 ) {
            delete_transient( 'madeit_security_2fa_pending_' . $token );
            wp_send_json_error( [ 'message' => 'Session expired.' ] );
        }
        set_transient( 'madeit_security_2fa_pending_' . $token, $data, $remaining );

        $method = get_user_meta( $data['user_id'], 'madeit_security_2fa_method', true ) ?: 'totp';
        $valid  = match ( $method ) {
            'email' => self::verify_email_otp( $data['user_id'], $code ),
            default => self::verify_totp( $data['user_id'], $code ),
        };
        if ( ! $valid ) {
            $valid = self::verify_recovery_code( $data['user_id'], $code );
        }

        if ( $valid ) {
            delete_transient( 'madeit_security_2fa_pending_' . $token );
            self::$completing_2fa = true;
            wp_set_current_user( $data['user_id'] );
            wp_set_auth_cookie( $data['user_id'], false );
            $user = get_user_by( 'id', $data['user_id'] );
            do_action( 'wp_login', $data['login'], $user ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- wp_login is a WordPress core hook
            self::$completing_2fa = false;
            wp_send_json_success( [ 'redirect' => admin_url() ] );
        }

        wp_send_json_error( [ 'message' => 'Invalid code. Please try again.' ] );
    }

    public static function ajax_resend_otp(): void {
        $token = isset( $_POST['token'] ) ? sanitize_text_field( wp_unslash( $_POST['token'] ) ) : '';
        $nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';

        $data = get_transient( 'madeit_security_2fa_pending_' . $token );
        if ( ! $data ) {
            wp_send_json_error( [ 'message' => 'Session expired.' ] );
        }

        // Verify nonce
        if ( ! isset( $data['nonce'] ) || ! wp_verify_nonce( $nonce, 'madeit_security_2fa_challenge_' . $token ) ) {
            wp_send_json_error( [ 'message' => 'Invalid request.' ] );
        }

        // Enforce resend cooldown
        $last_resend = (int) ( $data['last_resend'] ?? 0 );
        if ( ( time() - $last_resend ) < self::RESEND_COOLDOWN ) {
            wp_send_json_error( [ 'message' => 'Please wait before requesting another code.' ] );
        }

        // Enforce max resends
        $resends = (int) ( $data['resends'] ?? 0 );
        if ( $resends >= self::MAX_RESENDS ) {
            wp_send_json_error( [ 'message' => 'Maximum resend limit reached. Please log in again.' ] );
        }

        // Update counters — preserve original TTL deadline
        $data['resends']     = $resends + 1;
        $data['last_resend'] = time();
        $remaining = 300 - ( time() - (int) ( $data['created'] ?? time() ) );
        if ( $remaining <= 0 ) {
            delete_transient( 'madeit_security_2fa_pending_' . $token );
            wp_send_json_error( [ 'message' => 'Session expired.' ] );
        }
        set_transient( 'madeit_security_2fa_pending_' . $token, $data, $remaining );

        self::send_email_otp( $data['user_id'] );
        wp_send_json_success( [ 'message' => 'Code re-sent.' ] );
    }

    // ── Enqueue profile script ──────────────────────────────────────────────────
    public static function enqueue_profile_script( string $hook ): void {
        if ( ! in_array( $hook, [ 'profile.php', 'user-edit.php' ], true ) ) return;

        wp_enqueue_script(
            'madeit-security-2fa-profile',
            MADEIT_SECURITY_URL . 'admin/assets/js/2fa-profile.js',
            [ 'jquery' ],
            MADEIT_VERSION,
            true
        );

        wp_localize_script( 'madeit-security-2fa-profile', 'madeitSecurity2fa', [
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'nonce'    => wp_create_nonce( 'madeit_security_nonce' ),
        ] );
    }

    // ── AJAX: disable 2FA ───────────────────────────────────────────────────────
    public static function ajax_disable_2fa(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! is_user_logged_in() ) wp_send_json_error( [], 403 );

        $user_id = get_current_user_id();
        delete_user_meta( $user_id, 'madeit_security_2fa_enabled' );
        delete_user_meta( $user_id, 'madeit_security_totp_secret' );
        delete_user_meta( $user_id, 'madeit_security_totp_secret_pending' );
        delete_user_meta( $user_id, 'madeit_security_2fa_method' );
        delete_user_meta( $user_id, 'madeit_security_recovery_codes' );

        wp_send_json_success( [ 'message' => '2FA has been disabled.' ] );
    }

    // ── AJAX: enable Email OTP ──────────────────────────────────────────────────
    public static function ajax_enable_email(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! is_user_logged_in() ) wp_send_json_error( [], 403 );

        $user_id = get_current_user_id();
        $code    = isset( $_POST['code'] ) ? sanitize_text_field( wp_unslash( $_POST['code'] ) ) : '';

        if ( ! self::verify_email_otp( $user_id, $code ) ) {
            wp_send_json_error( [ 'message' => 'Invalid code. Request a new one and try again.' ] );
        }

        update_user_meta( $user_id, 'madeit_security_2fa_enabled', true );
        update_user_meta( $user_id, 'madeit_security_2fa_method',  'email' );
        delete_user_meta( $user_id, 'madeit_security_2fa_enrollment_required' );
        $codes = self::generate_recovery_codes( $user_id );

        wp_send_json_success( [ 'message' => '2FA enabled via Email OTP!', 'recovery_codes' => $codes ] );
    }

    // ── AJAX: regenerate recovery codes ─────────────────────────────────────────
    public static function ajax_regen_codes(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! is_user_logged_in() ) wp_send_json_error( [], 403 );

        $user_id = get_current_user_id();
        if ( ! self::user_has_2fa( $user_id ) ) {
            wp_send_json_error( [ 'message' => '2FA is not enabled.' ] );
        }

        $codes = self::generate_recovery_codes( $user_id );
        wp_send_json_success( [ 'recovery_codes' => $codes ] );
    }

    // ── User profile section ───────────────────────────────────────────────────
    public static function profile_section( \WP_User $user ): void {
        $enabled = self::user_has_2fa( $user->ID );
        $method  = get_user_meta( $user->ID, 'madeit_security_2fa_method', true ) ?: 'totp';
        $codes   = count( (array) get_user_meta( $user->ID, 'madeit_security_recovery_codes', true ) );
        ?>
        <h2>🛡️ Two-Factor Authentication</h2>
        <table class="form-table">
        <tr><th>Status</th><td>
            <?php if ( $enabled ): ?>
                <span style="color:#27ae60;font-weight:700">✓ Enabled (<?php echo esc_html( $method ); ?>)</span>
                &nbsp; <button type="button" class="button" id="madeit-security-disable-2fa">Disable 2FA</button>
                <p class="description">Recovery codes remaining: <?php echo (int) $codes; ?></p>
            <?php else: ?>
                <span style="color:#e67e22;font-weight:700">✗ Not enabled</span>
            <?php endif; ?>
        </td></tr>
        <?php if ( ! $enabled ): ?>
        <tr><th>Enable 2FA</th><td>
            <select id="madeit-security-2fa-method-select" class="regular-text">
                <option value="totp">Authenticator App (TOTP)</option>
                <option value="email">Email OTP</option>
            </select>
            <br><br>
            <div id="madeit-security-totp-setup" style="display:none">
                <p><strong>Step 1:</strong> Scan this QR code with Google Authenticator, Authy, or any TOTP app.</p>
                <div id="madeit-security-qr-container" style="margin:12px 0;">
                    <p class="description">Click "Generate" to get your QR code.</p>
                </div>
                <p><strong>Step 2:</strong> Enter the 6-digit code from your app to confirm setup.</p>
                <input type="text" id="madeit-security-totp-code" class="regular-text" placeholder="000000" maxlength="6" style="letter-spacing:.3em;font-size:1.2rem;width:140px">
                <button type="button" class="button button-primary" id="madeit-security-verify-totp">Verify &amp; Enable</button>
                <div id="madeit-security-totp-result"></div>
            </div>
            <div id="madeit-security-email-setup" style="display:none">
                <p>A one-time code will be emailed to <strong><?php echo esc_html( $user->user_email ); ?></strong> each time you log in.</p>
                <button type="button" class="button" id="madeit-security-send-test-otp">Send Test Code</button>
                <input type="text" id="madeit-security-email-otp-code" class="regular-text" placeholder="000000" maxlength="6" style="letter-spacing:.3em;font-size:1.2rem;width:140px;display:none">
                <button type="button" class="button button-primary" id="madeit-security-verify-email-otp" style="display:none">Verify &amp; Enable</button>
            </div>
            <button type="button" class="button" id="madeit-security-2fa-start-setup">Set Up 2FA</button>
        </td></tr>
        <?php endif; ?>
        <?php if ( $enabled ): ?>
        <tr><th>Recovery Codes</th><td>
            <button type="button" class="button" id="madeit-security-regen-codes">Regenerate Recovery Codes</button>
            <div id="madeit-security-recovery-codes-display" style="display:none;margin-top:12px"></div>
        </td></tr>
        <?php endif; ?>
        </table>
        <?php
    }
        
    public static function save_profile( int $user_id ): void {
        // phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce verified by WordPress core before firing personal_options_update / edit_user_profile_update
        if ( isset( $_POST['madeit_security_disable_2fa'] ) && current_user_can( 'edit_user', $user_id ) ) {
            delete_user_meta( $user_id, 'madeit_security_2fa_enabled' );
            delete_user_meta( $user_id, 'madeit_security_totp_secret' );
            delete_user_meta( $user_id, 'madeit_security_2fa_method' );
            delete_user_meta( $user_id, 'madeit_security_recovery_codes' );
        }
    }
}
        
if ( ! function_exists( 'obfuscate_email' ) ) {
    function obfuscate_email( string $email ): string {
        [ $local, $domain ] = explode( '@', $email, 2 );
        return substr( $local, 0, 2 ) . str_repeat( '*', max( 2, strlen( $local ) - 2 ) ) . '@' . $domain;
    }
}
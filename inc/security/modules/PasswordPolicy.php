<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Password Policy & Passphrase Generator
 *
 * Enforces configurable password complexity rules on:
 *   - Profile password changes
 *   - Password resets (wp-login.php)
 *   - New user registration
 *
 * Also provides a passphrase generator (AJAX + admin UI + profile page button).
 */
class PasswordPolicy {

    public static function init(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_password_policy_enabled', false ) ) {
            // Even when policy enforcement is off, register the passphrase AJAX
            // so the admin generator tool still works.
            add_action( 'wp_ajax_madeit_security_generate_passphrase', [ __CLASS__, 'ajax_generate_passphrase' ] );
            return;
        }

        // ── Password validation hooks ───────────────────────────────────────
        add_action( 'user_profile_update_errors', [ __CLASS__, 'validate_profile_password' ], 10, 3 );
        add_action( 'validate_password_reset',    [ __CLASS__, 'validate_reset_password' ], 10, 2 );
        add_filter( 'registration_errors',        [ __CLASS__, 'validate_registration_password' ], 10, 3 );

        // ── Passphrase AJAX ─────────────────────────────────────────────────
        add_action( 'wp_ajax_madeit_security_generate_passphrase', [ __CLASS__, 'ajax_generate_passphrase' ] );

        // ── Inject passphrase helper on user profile page ───────────────────
        add_action( 'show_user_profile', [ __CLASS__, 'inject_profile_helper' ], 99 );
        add_action( 'edit_user_profile', [ __CLASS__, 'inject_profile_helper' ], 99 );
    }

    // ════════════════════════════════════════════════════════════════════════
    // PASSWORD VALIDATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Validate password on profile update.
     */
    public static function validate_profile_password( \WP_Error $errors, bool $update, \stdClass $user ): void {
        if ( ! $update ) return;
        if ( empty( $_POST['pass1'] ) ) return; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce verified by WP core before this hook fires

        $password = wp_unslash( $_POST['pass1'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- passwords must not be sanitized
        $result   = self::check_password( $password );

        if ( ! $result['valid'] ) {
            foreach ( $result['errors'] as $err ) {
                $errors->add( 'madeit_security_password_policy', $err );
            }
        }
    }

    /**
     * Validate password on reset (wp-login.php "Set New Password").
     */
    public static function validate_reset_password( \WP_Error $errors, $user ): void {
        if ( empty( $_POST['pass1'] ) ) return; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce verified by WP core before this hook fires

        $password = wp_unslash( $_POST['pass1'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- passwords must not be sanitized
        $result   = self::check_password( $password );

        if ( ! $result['valid'] ) {
            foreach ( $result['errors'] as $err ) {
                $errors->add( 'madeit_security_password_policy', $err );
            }
        }
    }

    /**
     * Validate password on new user registration.
     */
    public static function validate_registration_password( \WP_Error $errors, string $sanitized_user_login, string $user_email ): \WP_Error {
        if ( empty( $_POST['pass1'] ) ) return $errors; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- nonce verified by WP core before this hook fires

        $password = wp_unslash( $_POST['pass1'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- passwords must not be sanitized
        $result   = self::check_password( $password );

        if ( ! $result['valid'] ) {
            foreach ( $result['errors'] as $err ) {
                $errors->add( 'madeit_security_password_policy', $err );
            }
        }

        return $errors;
    }

    /**
     * Core password strength checker.
     *
     * @param  string $password  The plaintext password to validate.
     * @return array{valid: bool, errors: string[]}
     */
    public static function check_password( string $password ): array {
        $errors = [];

        // ── Length ───────────────────────────────────────────────────────────
        $min = \MadeIT\Security\Settings::int( 'madeit_security_password_min_length', 12 );
        $min = max( 8, min( 128, $min ) ); // clamp
        if ( mb_strlen( $password ) < $min ) {
            $errors[] = sprintf(
                /* translators: %d: minimum password length (e.g. 12) */
                __( 'Password must be at least %d characters long.', 'madeit' ),
                $min
            );
        }

        // ── Uppercase ───────────────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_require_upper', true ) && ! preg_match( '/[A-Z]/', $password ) ) {
            $errors[] = __( 'Password must contain at least one uppercase letter (A-Z).', 'madeit' );
        }

        // ── Lowercase ───────────────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_require_lower', true ) && ! preg_match( '/[a-z]/', $password ) ) {
            $errors[] = __( 'Password must contain at least one lowercase letter (a-z).', 'madeit' );
        }

        // ── Number ──────────────────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_require_number', true ) && ! preg_match( '/[0-9]/', $password ) ) {
            $errors[] = __( 'Password must contain at least one number (0-9).', 'madeit' );
        }

        // ── Special character ───────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_require_special', false ) && ! preg_match( '/[^A-Za-z0-9]/', $password ) ) {
            $errors[] = __( 'Password must contain at least one special character (!@#$%^&* etc.).', 'madeit' );
        }

        // ── Breached password check ─────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_block_common', true ) && self::is_common_password( $password ) ) {
            $errors[] = __( 'This password appears in a list of commonly breached passwords. Please choose a different one.', 'madeit' );
        }

        return [
            'valid'  => empty( $errors ),
            'errors' => $errors,
        ];
    }

    /**
     * Check if password is in the top 10K breached passwords list.
     */
    private static function is_common_password( string $password ): bool {
        static $list = null;
        if ( $list === null ) {
            $file = MADEIT_SECURITY_DIR . 'includes/data/common-passwords.php';
            $list = file_exists( $file ) ? require $file : [];
        }
        return in_array( strtolower( $password ), $list, true );
    }

    // ════════════════════════════════════════════════════════════════════════
    // PASSPHRASE GENERATOR
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Generate a passphrase from the EFF-inspired word list.
     *
     * @param  int    $word_count  Number of words (3-8).
     * @param  string $separator   Word separator character.
     * @return array{passphrase: string, entropy: float, words: int}
     */
    public static function generate_passphrase( int $word_count = 4, string $separator = '-' ): array {
        $word_count = max( 3, min( 8, $word_count ) );

        $words = self::get_word_list();
        $total = count( $words );

        if ( $total === 0 ) {
            // Fallback: generate random alphanumeric string
            return [
                'passphrase' => wp_generate_password( 20, false ),
                'entropy'    => 20 * log( 36, 2 ),
                'words'      => 0,
            ];
        }

        $selected = [];
        for ( $i = 0; $i < $word_count; $i++ ) {
            $selected[] = $words[ random_int( 0, $total - 1 ) ];
        }

        // Entropy = words * log2(list_size)
        $entropy = $word_count * log( $total, 2 );

        return [
            'passphrase' => implode( $separator, $selected ),
            'entropy'    => round( $entropy, 1 ),
            'words'      => $word_count,
        ];
    }

    /**
     * Load the word list (cached in memory for the request).
     */
    private static function get_word_list(): array {
        static $words = null;
        if ( $words === null ) {
            $file  = MADEIT_SECURITY_DIR . 'includes/data/wordlist.php';
            $words = file_exists( $file ) ? require $file : [];
        }
        return $words;
    }

    // ════════════════════════════════════════════════════════════════════════
    // AJAX ENDPOINTS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * AJAX: Generate a passphrase.
     */
    public static function ajax_generate_passphrase(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! is_user_logged_in() ) {
            wp_send_json_error( [ 'message' => 'Not authenticated.' ], 403 );
        }

        $words     = isset( $_POST['words'] )     ? (int) $_POST['words']                                 : 4;
        $separator = isset( $_POST['separator'] )  ? sanitize_text_field( wp_unslash( $_POST['separator'] ) ) : '-';

        // Restrict separator to safe characters
        $allowed_seps = [ '-', '.', '_', ' ' ];
        if ( ! in_array( $separator, $allowed_seps, true ) ) {
            $separator = '-';
        }

        $result = self::generate_passphrase( $words, $separator );

        wp_send_json_success( $result );
    }

    // ════════════════════════════════════════════════════════════════════════
    // USER PROFILE INTEGRATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Inject passphrase helper and requirements checklist on the user profile page.
     * Enqueues an external JS file with config passed via wp_localize_script().
     */
    public static function inject_profile_helper( \WP_User $user ): void {
        wp_enqueue_script(
            'madeit-security-password-profile',
            MADEIT_SECURITY_URL . 'includes/assets/js/password-profile.js',
            [],
            MADEIT_VERSION,
            true
        );
        wp_localize_script( 'madeit-security-password-profile', 'madeitSecurityPasswordCfg', [
            'minLength'      => \MadeIT\Security\Settings::int( 'madeit_security_password_min_length', 12 ),
            'requireUpper'   => \MadeIT\Security\Settings::bool( 'madeit_security_password_require_upper', true ),
            'requireLower'   => \MadeIT\Security\Settings::bool( 'madeit_security_password_require_lower', true ),
            'requireNumber'  => \MadeIT\Security\Settings::bool( 'madeit_security_password_require_number', true ),
            'requireSpecial' => \MadeIT\Security\Settings::bool( 'madeit_security_password_require_special', false ),
            'blockCommon'    => \MadeIT\Security\Settings::bool( 'madeit_security_password_block_common', true ),
            'nonce'          => wp_create_nonce( 'madeit_security_nonce' ),
            'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
        ] );
    }

    // ════════════════════════════════════════════════════════════════════════
    // ADMIN HELPERS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Get current policy configuration for the admin view.
     */
    public static function get_policy_summary(): array {
        $enabled = \MadeIT\Security\Settings::bool( 'madeit_security_password_policy_enabled', false );
        $rules   = [];

        if ( $enabled ) {
            $rules[] = sprintf( 'Min %d characters', \MadeIT\Security\Settings::int( 'madeit_security_password_min_length', 12 ) );
            if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_require_upper', true ) )   $rules[] = 'Uppercase';
            if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_require_lower', true ) )   $rules[] = 'Lowercase';
            if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_require_number', true ) )  $rules[] = 'Number';
            if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_require_special', false ) ) $rules[] = 'Special char';
            if ( \MadeIT\Security\Settings::bool( 'madeit_security_password_block_common', true ) )    $rules[] = 'Breach check';
        }

        return [
            'enabled' => $enabled,
            'rules'   => $rules,
        ];
    }
}
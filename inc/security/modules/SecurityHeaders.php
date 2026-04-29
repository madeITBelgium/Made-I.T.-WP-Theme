<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Security Headers Manager
 * Sends all security headers — CSP, HSTS, X-Frame-Options, Permissions-Policy, etc.
 * Includes a CSP report-only mode for safe deployment.
 */
class SecurityHeaders {

    public static function init(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_headers_enabled', true ) ) return;
        add_action( 'send_headers', [ __CLASS__, 'send_all' ], 1 );
        // Admin pages too
        add_action( 'admin_init', function () {
            if ( ! headers_sent() ) self::send_all();
        }, 1 );
    }

    public static function send_all(): void {
        if ( headers_sent() ) return;

        // ── Strict Transport Security ─────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_hsts_enabled', true ) && is_ssl() ) {
            $max_age     = \MadeIT\Security\Settings::int( 'madeit_security_hsts_max_age', 31536000 );
            $subdomains  = \MadeIT\Security\Settings::bool( 'madeit_security_hsts_subdomains', true ) ? '; includeSubDomains' : '';
            $preload     = \MadeIT\Security\Settings::bool( 'madeit_security_hsts_preload', false ) ? '; preload' : '';
            header( "Strict-Transport-Security: max-age={$max_age}{$subdomains}{$preload}" );
        }

        // ── X-Frame-Options ───────────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_xframe_enabled', true ) ) {
            $val = self::sanitize_header_value( \MadeIT\Security\Settings::string( 'madeit_security_xframe_value', 'SAMEORIGIN' ) );
            header( 'X-Frame-Options: ' . $val );
        }

        // ── X-Content-Type-Options ────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_xcontent_enabled', true ) ) {
            header( 'X-Content-Type-Options: nosniff' );
        }

        // ── Referrer-Policy ───────────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_referrer_enabled', true ) ) {
            $val = self::sanitize_header_value( \MadeIT\Security\Settings::string( 'madeit_security_referrer_value', 'strict-origin-when-cross-origin' ) );
            header( 'Referrer-Policy: ' . $val );
        }

        // ── Permissions-Policy ────────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_permissions_enabled', true ) ) {
            header( 'Permissions-Policy: ' . self::sanitize_header_value( self::build_permissions_policy() ) );
        }

        // ── Content Security Policy ───────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_csp_enabled', false ) ) {
            $csp      = self::sanitize_header_value( self::build_csp() );
            $mode     = \MadeIT\Security\Settings::string( 'madeit_security_csp_mode', 'report-only' );
            $header   = $mode === 'enforce' ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';
            header( "$header: $csp" );
        }

        // ── Remove leaky headers ──────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_remove_powered_by', true ) ) {
            header_remove( 'X-Powered-By' );
            header( 'X-Powered-By: ' ); // empty override
        }
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_remove_server', false ) ) {
            header_remove( 'Server' );
        }

        // ── Cross-Origin headers ──────────────────────────────────────────────
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_corp_enabled', false ) ) {
            header( 'Cross-Origin-Resource-Policy: same-origin' );
        }
        if ( \MadeIT\Security\Settings::bool( 'madeit_security_coop_enabled', false ) ) {
            header( 'Cross-Origin-Opener-Policy: same-origin' );
        }
    }

    // ── CSP builder ───────────────────────────────────────────────────────────
    public static function build_csp(): string {
        // WordPress requires 'unsafe-inline' for most setups because
        // plugins and themes inject inline scripts/styles heavily.
        $directives = [
            'default-src' => \MadeIT\Security\Settings::string( 'madeit_security_csp_default_src', "'self'" ),
            'script-src'  => \MadeIT\Security\Settings::string( 'madeit_security_csp_script_src', "'self' 'unsafe-inline' 'unsafe-eval'" ),
            'style-src'   => \MadeIT\Security\Settings::string( 'madeit_security_csp_style_src', "'self' 'unsafe-inline'" ),
            'img-src'     => \MadeIT\Security\Settings::string( 'madeit_security_csp_img_src', "'self' data: https:" ),
            'font-src'    => \MadeIT\Security\Settings::string( 'madeit_security_csp_font_src', "'self' data: https://fonts.gstatic.com" ),
            'connect-src' => \MadeIT\Security\Settings::string( 'madeit_security_csp_connect_src', "'self'" ),
            'media-src'   => \MadeIT\Security\Settings::string( 'madeit_security_csp_media_src', "'self'" ),
            'object-src'  => \MadeIT\Security\Settings::string( 'madeit_security_csp_object_src', "'none'" ),
            'frame-src'   => \MadeIT\Security\Settings::string( 'madeit_security_csp_frame_src', "'self'" ),
            'frame-ancestors' => \MadeIT\Security\Settings::string( 'madeit_security_csp_frame_ancestors', "'self'" ),
            'base-uri'    => "'self'",
            'form-action' => "'self'",
        ];

        $report_uri = \MadeIT\Security\Settings::string( 'madeit_security_csp_report_uri', '' );
        if ( $report_uri ) {
            $directives['report-uri'] = $report_uri;
        }

        $parts = [];
        foreach ( $directives as $name => $value ) {
            if ( $value !== '' ) {
                $parts[] = "$name $value";
            }
        }
        return implode( '; ', $parts );
    }

    // ── Permissions-Policy builder ────────────────────────────────────────────
    public static function build_permissions_policy(): string {
        $perms = [
            'geolocation'       => \MadeIT\Security\Settings::string( 'madeit_security_permissions_geolocation', '()' ),
            'microphone'        => \MadeIT\Security\Settings::string( 'madeit_security_permissions_microphone', '()' ),
            'camera'            => \MadeIT\Security\Settings::string( 'madeit_security_permissions_camera', '()' ),
            'payment'           => \MadeIT\Security\Settings::string( 'madeit_security_permissions_payment', '()' ),
            'usb'               => \MadeIT\Security\Settings::string( 'madeit_security_permissions_usb', '()' ),
            'accelerometer'     => \MadeIT\Security\Settings::string( 'madeit_security_permissions_accelerometer', '()' ),
            'gyroscope'         => \MadeIT\Security\Settings::string( 'madeit_security_permissions_gyroscope', '()' ),
            'magnetometer'      => \MadeIT\Security\Settings::string( 'madeit_security_permissions_magnetometer', '()' ),
            'fullscreen'        => \MadeIT\Security\Settings::string( 'madeit_security_permissions_fullscreen', '(self)' ),
            'autoplay'          => \MadeIT\Security\Settings::string( 'madeit_security_permissions_autoplay', '(self)' ),
            'clipboard-write'   => \MadeIT\Security\Settings::string( 'madeit_security_permissions_clipboard_write', '(self)' ),
        ];
        $parts = [];
        foreach ( $perms as $feature => $value ) {
            if ( $value !== '' ) $parts[] = "$feature=$value";
        }
        return implode( ', ', $parts );
    }

    // ── What headers are currently active ─────────────────────────────────────
    public static function get_header_status(): array {
        return [
            [ 'name' => 'Strict-Transport-Security', 'enabled' => \MadeIT\Security\Settings::bool( 'madeit_security_hsts_enabled', true ),  'value' => is_ssl() ? 'max-age=' . \MadeIT\Security\Settings::int( 'madeit_security_hsts_max_age', 31536000 ) : 'N/A (no HTTPS detected)', 'grade' => is_ssl() && \MadeIT\Security\Settings::bool( 'madeit_security_hsts_enabled', true ) ? 'A' : 'F' ],
            [ 'name' => 'X-Frame-Options',           'enabled' => \MadeIT\Security\Settings::bool( 'madeit_security_xframe_enabled', true ), 'value' => \MadeIT\Security\Settings::string( 'madeit_security_xframe_value', 'SAMEORIGIN' ), 'grade' => \MadeIT\Security\Settings::bool( 'madeit_security_xframe_enabled', true ) ? 'A' : 'C' ],
            [ 'name' => 'X-Content-Type-Options',    'enabled' => \MadeIT\Security\Settings::bool( 'madeit_security_xcontent_enabled', true ), 'value' => 'nosniff', 'grade' => \MadeIT\Security\Settings::bool( 'madeit_security_xcontent_enabled', true ) ? 'A' : 'C' ],
            [ 'name' => 'Referrer-Policy',           'enabled' => \MadeIT\Security\Settings::bool( 'madeit_security_referrer_enabled', true ), 'value' => \MadeIT\Security\Settings::string( 'madeit_security_referrer_value', 'strict-origin-when-cross-origin' ), 'grade' => \MadeIT\Security\Settings::bool( 'madeit_security_referrer_enabled', true ) ? 'A' : 'C' ],
            [ 'name' => 'Permissions-Policy',        'enabled' => \MadeIT\Security\Settings::bool( 'madeit_security_permissions_enabled', true ), 'value' => self::build_permissions_policy(), 'grade' => \MadeIT\Security\Settings::bool( 'madeit_security_permissions_enabled', true ) ? 'A' : 'B' ],
            [ 'name' => 'Content-Security-Policy',   'enabled' => \MadeIT\Security\Settings::bool( 'madeit_security_csp_enabled', false ),  'value' => \MadeIT\Security\Settings::bool( 'madeit_security_csp_enabled', false ) ? '(' . \MadeIT\Security\Settings::string( 'madeit_security_csp_mode', 'report-only' ) . ' mode)' : 'Not set', 'grade' => \MadeIT\Security\Settings::bool( 'madeit_security_csp_enabled', false ) ? 'A' : 'D' ],
            [ 'name' => 'X-Powered-By (removed)',    'enabled' => \MadeIT\Security\Settings::bool( 'madeit_security_remove_powered_by', true ), 'value' => 'Removed', 'grade' => \MadeIT\Security\Settings::bool( 'madeit_security_remove_powered_by', true ) ? 'A' : 'C' ],
        ];
    }

    public static function compute_grade(): string {
        $statuses = self::get_header_status();
        $grades   = array_column( $statuses, 'grade' );
        if ( in_array( 'F', $grades, true ) ) return 'F';
        if ( in_array( 'D', $grades, true ) ) return 'D';
        if ( in_array( 'C', $grades, true ) ) return 'B';
        return 'A';
    }

    /** Strip CR/LF to prevent header injection from DB-sourced values. */
    private static function sanitize_header_value( string $value ): string {
        return str_replace( [ "\r", "\n", "\0" ], '', $value );
    }
}
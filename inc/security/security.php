<?php

defined( 'ABSPATH' ) || exit;

// ─── Safe Mode ───────────────────────────────────────────────────────────────
// Add  define( 'MADEIT_SECURITY_SAFE_MODE', true );  to wp-config.php to disable ALL
// blocking features (custom login URL, IP blocking, WAF, rate limiting, lockdown).
// This is the emergency override if you get locked out of your site.
if ( defined( 'MADEIT_SECURITY_SAFE_MODE' ) && MADEIT_SECURITY_SAFE_MODE ) {
    // Load just enough to render admin pages — but skip every blocking hook.
    define( 'MADEIT_SECURITY_BLOCKING_DISABLED', true );
}

// ─── Constants ────────────────────────────────────────────────────────────────
define( 'MADEIT_SECURITY_FILE',      __FILE__ );
define( 'MADEIT_SECURITY_DIR',       trailingslashit( get_template_directory() ) . 'inc/security/' );
define( 'MADEIT_SECURITY_URL',       trailingslashit( get_template_directory_uri() ) . 'inc/security/' );
define( 'MADEIT_SECURITY_DB_VERSION', 2 );

define( 'MADEIT_SECURITY_BRAND_NAME',    'Made I.T.' );
define( 'MADEIT_SECURITY_BRAND_URL',     'https://www.madeit.be/' );
define( 'MADEIT_SECURITY_BRAND_SUPPORT', 'https://www.madeit.be/contact/' );
define( 'MADEIT_SECURITY_BRAND_DOCS',    'https://www.madeit.be/' );
define( 'MADEIT_SECURITY_BRAND_LOGO',    MADEIT_SECURITY_URL . 'admin/assets/img/madeit-logo.png' );

/**
 * Brand helpers — pass the constants through filters so the Enterprise
 * white-label add-on (and any other extension) can re-skin the admin UI
 * without forking the plugin. Each helper falls back to the default constant
 * if no filter has been registered.
 */
if ( ! function_exists( 'madeit_security_brand_name' ) ) {
    function madeit_security_brand_name(): string {
        return (string) apply_filters( 'madeit_security_brand_name', MADEIT_SECURITY_BRAND_NAME );
    }
}
if ( ! function_exists( 'madeit_security_brand_logo_url' ) ) {
    function madeit_security_brand_logo_url(): string {
        return (string) apply_filters( 'madeit_security_brand_logo_url', MADEIT_SECURITY_BRAND_LOGO );
    }
}
if ( ! function_exists( 'madeit_security_brand_support_url' ) ) {
    function madeit_security_brand_support_url(): string {
        return (string) apply_filters( 'madeit_security_brand_support_url', MADEIT_SECURITY_BRAND_SUPPORT );
    }
}
if ( ! function_exists( 'madeit_security_brand_url' ) ) {
    function madeit_security_brand_url(): string {
        return (string) apply_filters( 'madeit_security_brand_url', MADEIT_SECURITY_BRAND_URL );
    }
}

// ─── Autoloader ──────────────────────────────────────────────────────────────
spl_autoload_register( function ( $class ) {
    $prefix = 'MadeIT\Security\\';
    if ( strpos( $class, $prefix ) !== 0 ) {
        return;
    }
    $relative = str_replace( '\\', DIRECTORY_SEPARATOR, substr( $class, strlen( $prefix ) ) );
    $file     = MADEIT_SECURITY_DIR . 'includes/' . $relative . '.php';
    if ( file_exists( $file ) ) {
        require_once $file;
    }
} );

if ( ! function_exists( 'madeit_security_setting' ) ) {
    function madeit_security_setting( string $option, $default = false ) {
        return \MadeIT\Security\Settings::get( $option, $default );
    }
}

if ( ! function_exists( 'madeit_security_enabled' ) ) {
    function madeit_security_enabled( string $option, bool $default = false ): bool {
        return \MadeIT\Security\Settings::bool( $option, $default );
    }
}

// ─── Theme lifecycle install / cleanup ───────────────────────────────────────
// This security module runs inside a theme, so plugin lifecycle hooks are not
// reliable here. Use theme switch hooks instead.
add_action( 'after_switch_theme', function () {
    require_once MADEIT_SECURITY_DIR . 'includes/Installer.php';
    MadeIT\Security\Installer::install();

    // Setup wizard is accessible via the sidebar — no forced redirect.
} );

add_action( 'switch_theme', function () {
    // CRITICAL: Disable custom login URL FIRST — prevents lockout if session
    // expires between theme switch and potential later re-activation.
    // The option is preserved in the DB so it re-enables automatically.
    update_option( 'madeit_security_custom_login_enabled', false );

    require_once MADEIT_SECURITY_DIR . 'includes/Installer.php';
    MadeIT\Security\Installer::deactivate();
} );

// ─── Ensure compound indexes exist (runs once, stores flag) ──────────────────
add_action( 'after_setup_theme', function () {
    if ( get_option( 'madeit_security_indexes_v3', false ) ) {
        return; // already added
    }
    global $wpdb;
    $tbl = $wpdb->prefix . 'madeit_security_visitor_log';

    // Check if table exists before altering
    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- plugin migration query
    $exists = $wpdb->get_var( $wpdb->prepare(
        "SELECT TABLE_NAME FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s LIMIT 1",
        $tbl
    ) );
    if ( ! $exists ) {
        return;
    }

    // Suppress errors: ALTER TABLE fails with "Duplicate key name" if indexes
    // already exist. Without suppression the SQL error text corrupts AJAX JSON.
    $suppress = $wpdb->suppress_errors( true );
    $wpdb->query( "ALTER TABLE `{$tbl}` ADD INDEX idx_created_ip (created_at, ip)" ); // phpcs:ignore
    $wpdb->query( "ALTER TABLE `{$tbl}` ADD INDEX idx_post_created (post_id, created_at)" ); // phpcs:ignore
    $wpdb->suppress_errors( $suppress );

    update_option( 'madeit_security_indexes_v3', true, true );
}, 0 );

// ─── Auto-upgrade: run install() when DB version changes ─────────────────────
add_action( 'after_setup_theme', function () {
    $stored = get_option( 'madeit_security_db_version', 0 );
    if ( $stored < MADEIT_SECURITY_DB_VERSION ) {
        require_once MADEIT_SECURITY_DIR . 'includes/Installer.php';
        MadeIT\Security\Installer::install();
    }
}, 0 );

// ─── Boot ─────────────────────────────────────────────────────────────────────
add_action( 'after_setup_theme', function () {
    require_once MADEIT_SECURITY_DIR . 'includes/Plugin.php';
    MadeIT\Security\Plugin::get_instance()->boot();
}, 1 );

// ─── Log the current request as early as possible ─────────────────────────────
// We log on init (priority 1) so we capture even failed auth attempts.
add_action( 'init', function () {
    require_once MADEIT_SECURITY_DIR . 'includes/RequestLogger.php';
    MadeIT\Security\RequestLogger::log_current_request();
}, 1 );
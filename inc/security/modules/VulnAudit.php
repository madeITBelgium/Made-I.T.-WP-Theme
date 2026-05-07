<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Vulnerability Audit
 *
 * Runs ~60 configuration / integrity / exposure checks synchronously.
 * Unlike the malware Scanner (batched file‑pattern scan), this module
 * audits the environment: PHP, DB, WP config, file permissions,
 * user hygiene, info‑disclosure, etc.
 *
 * Results are cached in madeit_security_vulnaudit_results for the admin view.
 */
class VulnAudit {

    /* ─── Hook registration ──────────────────────────────────────────────── */

    public static function init(): void {
            add_action( 'wp_ajax_madeit_security_run_vuln_audit',  [ __CLASS__, 'ajax_run' ] );
            add_action( 'wp_ajax_madeit_security_get_vuln_results', [ __CLASS__, 'ajax_results' ] );
    }

    /* ─── AJAX: run the full audit ───────────────────────────────────────── */

    public static function ajax_run(): void {
            check_ajax_referer( 'madeit_security_nonce', 'nonce' );
            if ( ! current_user_can( 'manage_options' ) ) {
                    wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
            }

            $results  = self::run_all();
            $summary  = self::summarize( $results );

            update_option( 'madeit_security_vulnaudit_results', $results, false );
            update_option( 'madeit_security_vulnaudit_summary', $summary, false );
            update_option( 'madeit_security_vulnaudit_last_run', current_time( 'mysql' ), false );

            wp_send_json_success( [
                    'summary' => $summary,
                    'results' => $results,
            ] );
    }

    /* ─── AJAX: fetch cached results ─────────────────────────────────────── */

    public static function ajax_results(): void {
            check_ajax_referer( 'madeit_security_nonce', 'nonce' );
            if ( ! current_user_can( 'manage_options' ) ) {
                    wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
            }
            wp_send_json_success( [
                    'summary'  => \MadeIT\Security\Settings::array( 'madeit_security_vulnaudit_summary', [] ),
                    'results'  => \MadeIT\Security\Settings::array( 'madeit_security_vulnaudit_results', [] ),
                    'last_run' => \MadeIT\Security\Settings::string( 'madeit_security_vulnaudit_last_run', '' ),
            ] );
    }

    /* ─── Summarize ──────────────────────────────────────────────────────── */

    public static function summarize( array $results ): array {
            $counts = [ 'critical' => 0, 'high' => 0, 'medium' => 0, 'low' => 0, 'info' => 0, 'pass' => 0, 'total' => 0 ];
            foreach ( $results as $r ) {
                    ++$counts['total'];
                    if ( $r['pass'] ) {
                            ++$counts['pass'];
                    } else {
                            $sev = $r['severity'] ?? 'medium';
                            if ( isset( $counts[ $sev ] ) ) {
                                    ++$counts[ $sev ];
                            }
                    }
            }
            $score = $counts['total'] > 0 ? round( ( $counts['pass'] / $counts['total'] ) * 100 ) : 0;
            $counts['score'] = $score;

            if ( $score >= 90 )      $counts['grade'] = 'A';
            elseif ( $score >= 75 )  $counts['grade'] = 'B';
            elseif ( $score >= 60 )  $counts['grade'] = 'C';
            elseif ( $score >= 40 )  $counts['grade'] = 'D';
            else                     $counts['grade'] = 'F';

            return $counts;
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Run all checks — each returns an array:
    [
        'id'       => string,
        'category' => string,
        'label'    => string,
        'pass'     => bool,
        'severity' => string (critical|high|medium|low|info),
        'detail'   => string,
        'fix'      => string,            // short remediation hint
        'option'   => string|null,        // madeit_security_ option to toggle (one-click fix)
    ]
    ═══════════════════════════════════════════════════════════════════════ */

    public static function run_all(): array {
            $results = [];

            /* 1. WordPress Core */
            $results = array_merge( $results, self::check_wp_version() );
            $results = array_merge( $results, self::check_debug_settings() );
            $results = array_merge( $results, self::check_security_keys() );
            //$results = array_merge( $results, self::check_table_prefix() );
            $results = array_merge( $results, self::check_wp_config_constants() );
            $results = array_merge( $results, self::check_auto_updates() );

            /* 2. PHP & Server */
            $results = array_merge( $results, self::check_php_version() );
            $results = array_merge( $results, self::check_db_version() );
            $results = array_merge( $results, self::check_php_config() );
            $results = array_merge( $results, self::check_dangerous_functions() );

            /* 3. File System */
            $results = array_merge( $results, self::check_file_permissions() );
            $results = array_merge( $results, self::check_php_in_uploads() );
            $results = array_merge( $results, self::check_config_backups() );
            $results = array_merge( $results, self::check_exposed_backups() );
            $results = array_merge( $results, self::check_debug_log() );
            //$results = array_merge( $results, self::check_info_files() );
            $results = array_merge( $results, self::check_htaccess() );
            $results = array_merge( $results, self::check_directory_index() );
            $results = array_merge( $results, self::check_drop_ins() );

            /* 4. User & Auth */
            $results = array_merge( $results, self::check_default_admin() );
            $results = array_merge( $results, self::check_admin_count() );
            $results = array_merge( $results, self::check_elevated_caps() );
            $results = array_merge( $results, self::check_dormant_admins() );
            $results = array_merge( $results, self::check_admin_email() );

            /* 5. Hardening (plugin-level) */
            $results = array_merge( $results, self::check_hardening_options() );

            /* 6. HTTP Security Headers (self-request) */
            $results = array_merge( $results, self::check_security_headers() );

            /* 7. Information Disclosure */
            $results = array_merge( $results, self::check_info_disclosure() );

            /* 8. Database content */
            $results = array_merge( $results, self::check_suspicious_crons() );
            $results = array_merge( $results, self::check_siteurl_mismatch() );
            $results = array_merge( $results, self::check_db_privileges() );

            /* 9. Plugin / Theme */
            $results = array_merge( $results, self::check_outdated_plugins() );
            $results = array_merge( $results, self::check_outdated_themes() );
            $results = array_merge( $results, self::check_core_integrity() );

            return $results;
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 1: WordPress Core
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_wp_version(): array {
            global $wp_version;
            $updates = get_site_transient( 'update_core' );
            $latest  = '';
            if ( is_object( $updates ) && ! empty( $updates->updates ) ) {
                    foreach ( $updates->updates as $u ) {
                            if ( 'upgrade' === ( $u->response ?? '' ) ) {
                                    $latest = $u->current ?? '';
                                    break;
                            }
                    }
            }
            $outdated = $latest && version_compare( $wp_version, $latest, '<' );
            return [ [
                    'id'       => 'wp_version',
                    'category' => 'WordPress Core',
                    'label'    => 'WordPress Version Up-to-Date',
                    'pass'     => ! $outdated,
                    'severity' => 'high',
                    'detail'   => $outdated
                            ? "Running {$wp_version}, latest is {$latest}."
                            : "Running {$wp_version} (current).",
                    'fix'      => 'Update WordPress to the latest version via Dashboard > Updates.',
                    'option'   => null,
            ] ];
    }

    private static function check_debug_settings(): array {
            $results = [];
            $debug_on   = defined( 'WP_DEBUG' ) && WP_DEBUG;
            $display_on = defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY;
            $log_on     = defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG;
            $save_q     = defined( 'SAVEQUERIES' ) && SAVEQUERIES;
            $php_display = filter_var( ini_get( 'display_errors' ), FILTER_VALIDATE_BOOLEAN );

            $results[] = [
                    'id'       => 'wp_debug',
                    'category' => 'WordPress Core',
                    'label'    => 'WP_DEBUG Disabled in Production',
                    'pass'     => ! $debug_on,
                    'severity' => 'high',
                    'detail'   => $debug_on ? 'WP_DEBUG is ON — errors may leak file paths and queries.' : 'WP_DEBUG is off.',
                    'fix'      => 'Set define(\'WP_DEBUG\', false); in wp-config.php.',
                    'option'   => null,
            ];
            $results[] = [
                    'id'       => 'wp_debug_display',
                    'category' => 'WordPress Core',
                    'label'    => 'Error Display Disabled',
                    'pass'     => ! $display_on && ! $php_display,
                    'severity' => 'high',
                    'detail'   => ( $display_on || $php_display ) ? 'PHP errors visible to visitors.' : 'Error display is off.',
                    'fix'      => 'Set WP_DEBUG_DISPLAY to false and display_errors to Off.',
                    'option'   => null,
            ];
            $results[] = [
                    'id'       => 'wp_debug_log',
                    'category' => 'WordPress Core',
                    'label'    => 'Debug Logging Disabled',
                    'pass'     => ! $log_on,
                    'severity' => 'medium',
                    'detail'   => $log_on ? 'WP_DEBUG_LOG is ON — debug.log may be publicly accessible.' : 'Debug logging is off.',
                    'fix'      => 'Set define(\'WP_DEBUG_LOG\', false); in wp-config.php.',
                    'option'   => null,
            ];
            $results[] = [
                    'id'       => 'savequeries',
                    'category' => 'WordPress Core',
                    'label'    => 'SAVEQUERIES Disabled',
                    'pass'     => ! $save_q,
                    'severity' => 'medium',
                    'detail'   => $save_q ? 'SAVEQUERIES is ON — memory exhaustion risk.' : 'SAVEQUERIES is off.',
                    'fix'      => 'Remove or set SAVEQUERIES to false in wp-config.php.',
                    'option'   => null,
            ];
            return $results;
    }

    private static function check_security_keys(): array {
            $key_names = [
                    'AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY',
                    'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT',
            ];
            $weak = [];
            foreach ( $key_names as $key ) {
                    if ( ! defined( $key ) ) {
                            $weak[] = "{$key} is undefined";
                    } elseif ( strlen( constant( $key ) ) < 32 ) {
                            $weak[] = "{$key} is too short";
                    } elseif ( constant( $key ) === 'put your unique phrase here' ) {
                            $weak[] = "{$key} is the default placeholder";
                    }
            }
            return [ [
                    'id'       => 'security_keys',
                    'category' => 'WordPress Core',
                    'label'    => 'Security Keys / Salts Configured',
                    'pass'     => empty( $weak ),
                    'severity' => 'critical',
                    'detail'   => empty( $weak )
                            ? 'All 8 security keys/salts are defined and strong.'
                            : 'Weak or missing: ' . implode( ', ', $weak ) . '.',
                    'fix'      => 'Generate new keys at https://api.wordpress.org/secret-key/1.1/salt/ and add to wp-config.php.',
                    'option'   => null,
            ] ];
    }

    private static function check_table_prefix(): array {
            global $wpdb;
            $default = ( 'wp_' === $wpdb->prefix );
            return [ [
                    'id'       => 'table_prefix',
                    'category' => 'WordPress Core',
                    'label'    => 'Custom Database Table Prefix',
                    'pass'     => ! $default,
                    'severity' => 'medium',
                    'detail'   => $default
                            ? 'Using default "wp_" prefix — easier for automated SQL injection.'
                            : "Using custom prefix \"{$wpdb->prefix}\".",
                    'fix'      => 'Use a custom table prefix (best set during installation).',
                    'option'   => null,
            ] ];
    }

    private static function check_wp_config_constants(): array {
            $results = [];

            $file_edit = defined( 'DISALLOW_FILE_EDIT' ) && DISALLOW_FILE_EDIT;
            $results[] = [
                    'id'       => 'disallow_file_edit',
                    'category' => 'WordPress Core',
                    'label'    => 'File Editor Disabled (DISALLOW_FILE_EDIT)',
                    'pass'     => $file_edit || \MadeIT\Security\Settings::bool( 'madeit_security_disable_file_editor', true ),
                    'severity' => 'high',
                    'detail'   => ( $file_edit || \MadeIT\Security\Settings::bool( 'madeit_security_disable_file_editor', true ) )
                            ? 'Theme/plugin file editor is disabled.'
                            : 'File editor is accessible — admin-to-RCE trivial.',
                    'fix'      => 'Enable via Made I.T. Security Hardening or add define(\'DISALLOW_FILE_EDIT\', true); to wp-config.php.',
                    'option'   => 'madeit_security_disable_file_editor',
            ];

            $ssl_admin = defined( 'FORCE_SSL_ADMIN' ) && FORCE_SSL_ADMIN;
            $results[] = [
                    'id'       => 'force_ssl_admin',
                    'category' => 'WordPress Core',
                    'label'    => 'HTTPS Forced for Admin Panel',
                    'pass'     => $ssl_admin || \MadeIT\Security\Settings::bool( 'madeit_security_force_ssl_admin', false ),
                    'severity' => 'high',
                    'detail'   => ( $ssl_admin || \MadeIT\Security\Settings::bool( 'madeit_security_force_ssl_admin', false ) )
                            ? 'Admin panel enforces HTTPS.'
                            : 'Admin panel does not require HTTPS — credentials could be intercepted.',
                    'fix'      => 'Enable in Made I.T. Security Hardening or add define(\'FORCE_SSL_ADMIN\', true); to wp-config.php.',
                    'option'   => 'madeit_security_force_ssl_admin',
            ];

            return $results;
    }

    private static function check_auto_updates(): array {
            $disabled = defined( 'AUTOMATIC_UPDATER_DISABLED' ) && AUTOMATIC_UPDATER_DISABLED;
            $core_off = defined( 'WP_AUTO_UPDATE_CORE' ) && false === WP_AUTO_UPDATE_CORE;
            $fail     = $disabled || $core_off;
            return [ [
                    'id'       => 'auto_updates',
                    'category' => 'WordPress Core',
                    'label'    => 'Automatic Security Updates Enabled',
                    'pass'     => ! $fail,
                    'severity' => 'high',
                    'detail'   => $fail
                            ? 'Automatic core updates are disabled — security patches will not auto-apply.'
                            : 'Automatic updates are enabled.',
                    'fix'      => 'Remove AUTOMATIC_UPDATER_DISABLED and WP_AUTO_UPDATE_CORE=false from wp-config.php.',
                    'option'   => null,
            ] ];
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 2: PHP & Server
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_php_version(): array {
            $v   = PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION;
            // phpcs:ignore Generic.CodeAnalysis.AssignmentInCondition.FoundInWhileCondition -- intentional inline map
            $eol = [
                    '5.6' => true, '7.0' => true, '7.1' => true, '7.2' => true,
                    '7.3' => true, '7.4' => true, '8.0' => true, '8.1' => true,
            ];
            $is_eol = isset( $eol[ $v ] ) || PHP_MAJOR_VERSION < 7;
            return [ [
                    'id'       => 'php_version',
                    'category' => 'PHP & Server',
                    'label'    => 'PHP Version Supported',
                    'pass'     => ! $is_eol,
                    'severity' => 'critical',
                    'detail'   => $is_eol
                            ? 'PHP ' . PHP_VERSION . ' is end-of-life — no security patches.'
                            : 'PHP ' . PHP_VERSION . ' is supported.',
                    'fix'      => 'Upgrade PHP to 8.3 or later via your hosting control panel.',
                    'option'   => null,
            ] ];
    }

    private static function check_db_version(): array {
            global $wpdb;
            $info      = $wpdb->db_server_info();
            $ver       = $wpdb->db_version();
            $maria     = stripos( $info, 'mariadb' ) !== false;
            $maria_eol = [ '5.5', '10.0', '10.1', '10.2', '10.3', '10.4', '10.5' ];
            $mysql_eol = [ '5.5', '5.6', '5.7' ];

            preg_match( '/(\d+\.\d+)/', $ver, $m );
            $mm     = $m[1] ?? '';
            $is_eol = $maria ? in_array( $mm, $maria_eol, true ) : in_array( $mm, $mysql_eol, true );
            $engine = $maria ? 'MariaDB' : 'MySQL';

            return [ [
                    'id'       => 'db_version',
                    'category' => 'PHP & Server',
                    'label'    => 'Database Server Supported',
                    'pass'     => ! $is_eol,
                    'severity' => 'high',
                    'detail'   => $is_eol
                            ? "{$engine} {$ver} is end-of-life."
                            : "{$engine} {$ver} is supported.",
                    'fix'      => "Upgrade {$engine} to a supported version via your host.",
                    'option'   => null,
            ] ];
    }

    private static function check_php_config(): array {
            $results = [];
            $checks  = [
                    [ 'allow_url_include', 'Off', 'critical', 'Allows remote code inclusion via include/require.' ],
                    [ 'allow_url_fopen',   'Off', 'medium',   'Allows opening remote files as local ones.' ],
                    [ 'expose_php',        'Off', 'low',      'Reveals PHP version in X-Powered-By header.' ],
            ];
            foreach ( $checks as [ $directive, $safe, $sev, $desc ] ) {
                    $raw  = ini_get( $directive );
                    $on   = filter_var( $raw, FILTER_VALIDATE_BOOLEAN );
                    $pass = ( $safe === 'Off' ) ? ! $on : $on;
                    $results[] = [
                            'id'       => 'php_' . $directive,
                            'category' => 'PHP & Server',
                            'label'    => "{$directive} is {$safe}",
                            'pass'     => $pass,
                            'severity' => $sev,
                            'detail'   => $pass ? "{$directive} = {$safe}." : "{$directive} is enabled. {$desc}",
                            'fix'      => "Set {$directive} = {$safe} in php.ini or via your host's PHP settings.",
                            'option'   => null,
                    ];
            }

            // open_basedir
            $ob   = ini_get( 'open_basedir' );
            $results[] = [
                    'id'       => 'php_open_basedir',
                    'category' => 'PHP & Server',
                    'label'    => 'open_basedir Restriction Set',
                    'pass'     => ! empty( $ob ),
                    'severity' => 'medium',
                    'detail'   => ! empty( $ob ) ? 'open_basedir is set.' : 'open_basedir is not set — PHP can access any file on the server.',
                    'fix'      => 'Set open_basedir to restrict PHP file access to the web root.',
                    'option'   => null,
            ];

            return $results;
    }

    private static function check_dangerous_functions(): array {
            $dangerous = [ 'exec', 'shell_exec', 'system', 'passthru', 'popen', 'proc_open', 'pcntl_exec' ];
            $disabled  = array_map( 'trim', explode( ',', ini_get( 'disable_functions' ) ) );
            $enabled   = [];
            foreach ( $dangerous as $fn ) {
                    if ( function_exists( $fn ) && ! in_array( $fn, $disabled, true ) ) {
                            $enabled[] = $fn;
                    }
            }
            return [ [
                    'id'       => 'dangerous_functions',
                    'category' => 'PHP & Server',
                    'label'    => 'Dangerous PHP Functions Disabled',
                    'pass'     => empty( $enabled ),
                    'severity' => 'high',
                    'detail'   => empty( $enabled )
                            ? 'All dangerous functions are disabled.'
                            : 'Enabled: ' . implode( ', ', $enabled ) . '.',
                    'fix'      => 'Add to disable_functions in php.ini: ' . implode( ', ', $dangerous ),
                    'option'   => null,
            ] ];
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 3: File System
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_file_permissions(): array {
            // Skip on Windows — file permissions not meaningful.
            if ( DIRECTORY_SEPARATOR === '\\' ) {
                    return [ [
                            'id'       => 'file_permissions',
                            'category' => 'File System',
                            'label'    => 'Critical File Permissions',
                            'pass'     => true,
                            'severity' => 'info',
                            'detail'   => 'File permission checks skipped on Windows.',
                            'fix'      => '',
                            'option'   => null,
                    ] ];
            }

            $results = [];
            $content_dir = wp_normalize_path( WP_CONTENT_DIR );
            $files   = [
                    [ ABSPATH . 'wp-config.php', 0440, 'critical' ],
                    [ ABSPATH . '.htaccess',     0644, 'high' ],
                    [ $content_dir,              0755, 'high' ],
            ];
            foreach ( $files as [ $path, $max, $sev ] ) {
                    if ( ! file_exists( $path ) ) continue;
                    $perms = fileperms( $path ) & 0777;
                    $world = (bool) ( $perms & 0002 ); // "other" write bit
                    $ok    = ! $world && $perms <= $max;
                    $name  = str_replace( ABSPATH, '', $path ) ?: basename( $path );
                    $results[] = [
                            'id'       => 'perm_' . sanitize_key( $name ),
                            'category' => 'File System',
                            'label'    => "{$name} Permissions",
                            'pass'     => $ok,
                            'severity' => $sev,
                            'detail'   => $ok
                                    ? "{$name} is " . decoct( $perms ) . " (ok)."
                                    : "{$name} is " . decoct( $perms ) . " — should be " . decoct( $max ) . " or stricter.",
                            'fix'      => "chmod " . decoct( $max ) . " {$name}",
                            'option'   => null,
                    ];
            }
            return $results;
    }

    private static function check_php_in_uploads(): array {
            $uploads = wp_upload_dir()['basedir'];
            if ( ! is_dir( $uploads ) ) {
                    return [];
            }
            $exts  = [ 'php', 'phtml', 'php5', 'php7', 'phar' ];
            $found = [];
            $iter  = new \RecursiveIteratorIterator(
                    new \RecursiveDirectoryIterator( $uploads, \FilesystemIterator::SKIP_DOTS ),
                    \RecursiveIteratorIterator::SELF_FIRST
            );
            $count = 0;
            foreach ( $iter as $file ) {
                    if ( $file->isDir() ) continue;
                    if ( ++$count > 10000 ) break; // safety limit
                    $ext = strtolower( $file->getExtension() );
                    if ( in_array( $ext, $exts, true ) ) {
                            $found[] = str_replace( ABSPATH, '', $file->getPathname() );
                            if ( count( $found ) >= 20 ) break;
                    }
            }
            return [ [
                    'id'       => 'php_in_uploads',
                    'category' => 'File System',
                    'label'    => 'No PHP Files in Uploads Directory',
                    'pass'     => empty( $found ),
                    'severity' => 'critical',
                    'detail'   => empty( $found )
                            ? 'No PHP files found in wp-content/uploads/.'
                            : count( $found ) . ' PHP file(s) found: ' . implode( ', ', array_slice( $found, 0, 5 ) ) . ( count( $found ) > 5 ? '…' : '' ),
                    'fix'      => 'Delete unauthorized PHP files from uploads and add execution restrictions via .htaccess.',
                    'option'   => null,
            ] ];
    }

    private static function check_config_backups(): array {
            $variants = [
                    'wp-config.php.bak', 'wp-config.php.old', 'wp-config.php.save',
                    'wp-config.php~', 'wp-config.php.orig', 'wp-config.txt',
                    'wp-config.php.swp', 'wp-config.bak', 'wp-config.old',
            ];
            $found = [];
            $dirs  = [ ABSPATH ];
            $parent = dirname( ABSPATH );
            if ( $parent !== ABSPATH ) {
                    $dirs[] = $parent;
            }
            foreach ( $dirs as $dir ) {
                    foreach ( $variants as $v ) {
                            if ( file_exists( $dir . '/' . $v ) ) {
                                    $found[] = $v;
                            }
                    }
            }
            return [ [
                    'id'       => 'config_backups',
                    'category' => 'File System',
                    'label'    => 'No wp-config.php Backup Copies Exposed',
                    'pass'     => empty( $found ),
                    'severity' => 'critical',
                    'detail'   => empty( $found )
                            ? 'No backup copies of wp-config.php found.'
                            : 'Found: ' . implode( ', ', $found ) . ' — may expose database credentials as plain text.',
                    'fix'      => 'Delete all wp-config backup files from the web root.',
                    'option'   => null,
            ] ];
    }

    private static function check_exposed_backups(): array {
            $exts  = [ '.sql', '.zip', '.tar', '.gz', '.tar.gz', '.tgz', '.rar', '.7z', '.bak' ];
            $found = [];
            $dirs  = [ ABSPATH, wp_normalize_path( WP_CONTENT_DIR ) ];
            foreach ( $dirs as $dir ) {
                    if ( ! is_dir( $dir ) ) continue;
                    $files = scandir( $dir );
                    if ( ! $files ) continue;
                    foreach ( $files as $f ) {
                            if ( $f === '.' || $f === '..' || is_dir( $dir . '/' . $f ) ) continue;
                            $lower = strtolower( $f );
                            foreach ( $exts as $ext ) {
                                    if ( str_ends_with( $lower, $ext ) ) {
                                            $found[] = str_replace( ABSPATH, '', $dir . '/' . $f );
                                            break;
                                    }
                            }
                    }
            }
            return [ [
                    'id'       => 'exposed_backups',
                    'category' => 'File System',
                    'label'    => 'No Backup/Archive Files in Web Root',
                    'pass'     => empty( $found ),
                    'severity' => 'critical',
                    'detail'   => empty( $found )
                            ? 'No backup or archive files found in web-accessible directories.'
                            : count( $found ) . ' backup file(s): ' . implode( ', ', array_slice( $found, 0, 5 ) ),
                    'fix'      => 'Move backup files outside the web root or delete them.',
                    'option'   => null,
            ] ];
    }

    private static function check_debug_log(): array {
            $wpc   = wp_normalize_path( WP_CONTENT_DIR );
            $paths = [
                    $wpc . '/debug.log',
                    ABSPATH . 'debug.log',
                    ABSPATH . 'error_log',
                    $wpc . '/error_log',
            ];
            $found = [];
            foreach ( $paths as $p ) {
                    if ( file_exists( $p ) && filesize( $p ) > 0 ) {
                            $found[] = str_replace( ABSPATH, '', $p ) . ' (' . size_format( filesize( $p ) ) . ')';
                    }
            }
            return [ [
                    'id'       => 'debug_log',
                    'category' => 'File System',
                    'label'    => 'No Debug/Error Logs Exposed',
                    'pass'     => empty( $found ),
                    'severity' => 'high',
                    'detail'   => empty( $found )
                            ? 'No exposed log files found.'
                            : 'Exposed: ' . implode( ', ', $found ),
                    'fix'      => 'Delete or move log files outside the web root. Add .htaccess rules to deny access to .log files.',
                    'option'   => null,
            ] ];
    }

    private static function check_info_files(): array {
            $files = [
                    'readme.html'  => 'Exposes WordPress version number.',
                    'license.txt'  => 'Confirms WordPress is used.',
            ];
            $found = [];
            foreach ( $files as $f => $desc ) {
                    if ( file_exists( ABSPATH . $f ) ) {
                            $found[] = $f;
                    }
            }
            return [ [
                    'id'       => 'info_files',
                    'category' => 'File System',
                    'label'    => 'readme.html / license.txt Removed',
                    'pass'     => empty( $found ),
                    'severity' => 'low',
                    'detail'   => empty( $found )
                            ? 'No information-leaking files in web root.'
                            : 'Found: ' . implode( ', ', $found ) . ' — reveals WordPress presence/version.',
                    'fix'      => 'Delete readme.html and license.txt from the WordPress root.',
                    'option'   => null,
            ] ];
    }

    private static function check_htaccess(): array {
            $htaccess = ABSPATH . '.htaccess';
            if ( ! file_exists( $htaccess ) ) {
                    return [];
            }
            $content     = file_get_contents( $htaccess ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local file read for security scanning
            $host        = preg_quote( wp_parse_url( home_url(), PHP_URL_HOST ) ?: 'localhost', '/' );
            $suspicious  = [];

            $patterns = [
                    '/auto_prepend_file/i'                                         => 'auto_prepend_file directive',
                    '/auto_append_file/i'                                          => 'auto_append_file directive',
                    '/RewriteRule.*https?:\/\/(?!' . $host . ')/i'                 => 'Redirect to external domain',
                    '/eval\s*\(/i'                                                 => 'eval() call',
                    '/base64_decode/i'                                             => 'base64_decode usage',
            ];
            foreach ( $patterns as $pat => $desc ) {
                    if ( preg_match( $pat, $content ) ) {
                            $suspicious[] = $desc;
                    }
            }
            return [ [
                    'id'       => 'htaccess_clean',
                    'category' => 'File System',
                    'label'    => '.htaccess Free of Suspicious Directives',
                    'pass'     => empty( $suspicious ),
                    'severity' => 'critical',
                    'detail'   => empty( $suspicious )
                            ? '.htaccess looks clean.'
                            : 'Suspicious: ' . implode( ', ', $suspicious ),
                    'fix'      => 'Review .htaccess for injected redirects or code-loading directives and remove them.',
                    'option'   => null,
            ] ];
    }

    private static function check_directory_index(): array {
            $dirs = [
                    wp_normalize_path( WP_PLUGIN_DIR )   => 'wp-content/plugins/',
                    wp_normalize_path( get_theme_root() ) => 'wp-content/themes/',
                    wp_upload_dir()['basedir']            => 'wp-content/uploads/',
            ];
            $missing = [];
            foreach ( $dirs as $path => $label ) {
                    if ( ! is_dir( $path ) ) continue;
                    if ( ! file_exists( $path . '/index.php' ) && ! file_exists( $path . '/index.html' ) ) {
                            $missing[] = $label;
                    }
            }
            return [ [
                    'id'       => 'directory_index',
                    'category' => 'File System',
                    'label'    => 'Directory Index Files Present',
                    'pass'     => empty( $missing ),
                    'severity' => 'medium',
                    'detail'   => empty( $missing )
                            ? 'All key directories have an index file.'
                            : 'Missing index file in: ' . implode( ', ', $missing ),
                    'fix'      => 'Add index.php containing <?php // Silence is golden. to listed directories.',
                    'option'   => null,
            ] ];
    }

    private static function check_drop_ins(): array {
            $wpc = wp_normalize_path( WP_CONTENT_DIR );
            $drop_ins = [
                    $wpc . '/db.php'            => 'db.php (database handler)',
                    $wpc . '/advanced-cache.php' => 'advanced-cache.php (cache)',
                    $wpc . '/object-cache.php'   => 'object-cache.php (object cache)',
            ];
            $suspicious = [];
            foreach ( $drop_ins as $path => $label ) {
                    if ( ! file_exists( $path ) ) continue;
                    $content = file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local security scan
                    if ( preg_match( '/eval\s*\(|base64_decode|shell_exec|system\s*\(|passthru/i', $content ) ) {
                            $suspicious[] = $label;
                    }
            }
            return [ [
                    'id'       => 'drop_ins',
                    'category' => 'File System',
                    'label'    => 'Drop-in Plugins Clean',
                    'pass'     => empty( $suspicious ),
                    'severity' => 'critical',
                    'detail'   => empty( $suspicious )
                            ? 'No suspicious code in drop-in plugins (or no drop-ins present).'
                            : 'Suspicious code in: ' . implode( ', ', $suspicious ),
                    'fix'      => 'Review flagged drop-in files and remove any injected code.',
                    'option'   => null,
            ] ];
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 4: User & Auth
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_default_admin(): array {
            $user = get_user_by( 'login', 'admin' );
            $fail = $user && in_array( 'administrator', (array) $user->roles, true );
            return [ [
                    'id'       => 'default_admin',
                    'category' => 'User & Auth',
                    'label'    => 'No "admin" Username',
                    'pass'     => ! $fail,
                    'severity' => 'high',
                    'detail'   => $fail
                            ? 'An administrator account uses the username "admin" — #1 brute-force target.'
                            : 'No administrator uses the "admin" username.',
                    'fix'      => 'Create a new admin with a unique username and delete the "admin" account.',
                    'option'   => null,
            ] ];
    }

    private static function check_admin_count(): array {
            $admins = get_users( [ 'role' => 'administrator', 'fields' => 'ID' ] );
            $count  = count( $admins );
            return [ [
                    'id'       => 'admin_count',
                    'category' => 'User & Auth',
                    'label'    => 'Reasonable Number of Administrators',
                    'pass'     => $count <= 3,
                    'severity' => 'medium',
                    'detail'   => "{$count} administrator account(s)." . ( $count > 3 ? ' Most sites need 1–2.' : '' ),
                    'fix'      => 'Demote unnecessary admins to Editor or a lower role.',
                    'option'   => null,
            ] ];
    }

    private static function check_elevated_caps(): array {
            $dangerous = [ 'edit_plugins', 'edit_themes', 'install_plugins', 'install_themes', 'unfiltered_upload' ];
            $problems  = [];
            $users     = get_users( [ 'role__not_in' => [ 'administrator' ] ] );
            foreach ( $users as $u ) {
                    $wp_user = new \WP_User( $u->ID );
                    if ( in_array( 'administrator', (array) $wp_user->roles, true ) ) continue;
                    foreach ( $dangerous as $cap ) {
                            if ( $wp_user->has_cap( $cap ) ) {
                                    $problems[] = $wp_user->user_login . " ({$cap})";
                                    break;
                            }
                    }
            }
            return [ [
                    'id'       => 'elevated_caps',
                    'category' => 'User & Auth',
                    'label'    => 'No Non-Admin Users with Dangerous Capabilities',
                    'pass'     => empty( $problems ),
                    'severity' => 'critical',
                    'detail'   => empty( $problems )
                            ? 'No privilege escalation detected.'
                            : 'Users with elevated caps: ' . implode( ', ', array_slice( $problems, 0, 5 ) ),
                    'fix'      => 'Remove dangerous capabilities from non-administrator roles.',
                    'option'   => null,
            ] ];
    }

    private static function check_dormant_admins(): array {
            $admins  = get_users( [ 'role' => 'administrator' ] );
            $dormant = [];
            $cutoff  = strtotime( '-90 days' );
            foreach ( $admins as $a ) {
                    $last = get_user_meta( $a->ID, 'madeit_security_last_login', true );
                    if ( ! $last ) {
                            $last = get_user_meta( $a->ID, 'last_login', true );
                    }
                    if ( empty( $last ) ) {
                            // Check registration date
                            if ( strtotime( $a->user_registered ) < $cutoff ) {
                                    $dormant[] = $a->user_login . ' (never logged in)';
                            }
                    } elseif ( strtotime( $last ) < $cutoff ) {
                            $days      = round( ( time() - strtotime( $last ) ) / DAY_IN_SECONDS );
                            $dormant[] = $a->user_login . " ({$days} days ago)";
                    }
            }
            return [ [
                    'id'       => 'dormant_admins',
                    'category' => 'User & Auth',
                    'label'    => 'No Dormant Administrator Accounts',
                    'pass'     => empty( $dormant ),
                    'severity' => 'medium',
                    'detail'   => empty( $dormant )
                            ? 'All administrators have recent activity.'
                            : 'Dormant admins (90+ days): ' . implode( ', ', array_slice( $dormant, 0, 5 ) ),
                    'fix'      => 'Review and disable or delete dormant admin accounts.',
                    'option'   => null,
            ] ];
    }

    private static function check_admin_email(): array {
            $disposable = [
                    'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
                    'yopmail.com', 'sharklasers.com', 'maildrop.cc', 'dispostable.com',
                    '10minutemail.com', 'trashmail.com', 'fakeinbox.com', 'temp-mail.org',
            ];
            $problems = [];
            $admins   = get_users( [ 'role' => 'administrator' ] );
            foreach ( $admins as $a ) {
                    $domain = strtolower( substr( strrchr( $a->user_email, '@' ), 1 ) );
                    if ( in_array( $domain, $disposable, true ) ) {
                            $problems[] = $a->user_login . " ({$domain})";
                    }
                    if ( empty( $a->user_email ) ) {
                            $problems[] = $a->user_login . ' (no email)';
                    }
            }
            return [ [
                    'id'       => 'admin_email',
                    'category' => 'User & Auth',
                    'label'    => 'Administrator Email Addresses Valid',
                    'pass'     => empty( $problems ),
                    'severity' => 'high',
                    'detail'   => empty( $problems )
                            ? 'All admin emails use legitimate domains.'
                            : 'Suspicious: ' . implode( ', ', $problems ),
                    'fix'      => 'Review admin accounts with disposable or missing email addresses.',
                    'option'   => null,
            ] ];
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 5: Hardening (Plugin Options)
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_hardening_options(): array {
            $results = [];
            $checks  = [
                    [ 'madeit_security_block_xmlrpc',      true,  'XML-RPC Disabled',                    'high',   'XML-RPC is a brute-force and DDoS amplification vector.' ],
                    [ 'madeit_security_hide_wp_version',    true,  'WordPress Version Hidden',            'medium', 'Meta generator tag reveals WP version.' ],
                    [ 'madeit_security_block_rest_users',   true,  'REST API User Enumeration Blocked',   'high',   '/wp-json/wp/v2/users exposes usernames.' ],
                    [ 'madeit_security_block_author_enum',  true,  'Author Enumeration Blocked',          'high',   '?author=N reveals usernames.' ],
                    [ 'madeit_security_block_php_uploads',  true,  'PHP Execution in Uploads Blocked',    'high',   'Prevents webshell execution in uploads directory.' ],
                    [ 'madeit_security_honeypot_enabled',   false, 'Honeypot Active',                     'medium', 'Catches automated bots.' ],
                    [ 'madeit_security_password_policy_enabled', false, 'Password Policy Enforced',       'medium', 'Enforces strong passwords for all users.' ],
            ];
            foreach ( $checks as [ $opt, $default, $label, $sev, $desc ] ) {
                    $val  = (bool) get_option( $opt, $default );
                    $results[] = [
                            'id'       => 'harden_' . str_replace( 'madeit_security_', '', $opt ),
                            'category' => 'Hardening',
                            'label'    => $label,
                            'pass'     => $val,
                            'severity' => $sev,
                            'detail'   => $val ? $label . ' is enabled.' : $desc,
                            'fix'      => "Enable in Security settings.",
                            'option'   => $opt,
                    ];
            }
            return $results;
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 6: HTTP Security Headers
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_security_headers(): array {
            // Self-request to check actual response headers.
            $response = wp_remote_get( home_url( '/' ), [
                    'sslverify'   => false,
                    'timeout'     => 10,
                    'redirection' => 0,
                    'cookies'     => [],
            ] );
            if ( is_wp_error( $response ) ) {
                    return [ [
                            'id'       => 'headers_check',
                            'category' => 'Security Headers',
                            'label'    => 'Security Headers Check',
                            'pass'     => true,
                            'severity' => 'info',
                            'detail'   => 'Could not perform self-request to verify headers.',
                            'fix'      => '',
                            'option'   => null,
                    ] ];
            }
            $headers = wp_remote_retrieve_headers( $response );
            $results = [];

            $header_checks = [
                    [ 'strict-transport-security', 'Strict-Transport-Security (HSTS)',    'high',   'madeit_security_hsts_enabled' ],
                    [ 'x-frame-options',           'X-Frame-Options',                      'medium', 'madeit_security_xframe_enabled' ],
                    [ 'x-content-type-options',    'X-Content-Type-Options',               'medium', 'madeit_security_xcontent_enabled' ],
                    [ 'content-security-policy',   'Content-Security-Policy',              'medium', 'madeit_security_csp_enabled' ],
                    [ 'referrer-policy',           'Referrer-Policy',                      'low',    'madeit_security_referrer_enabled' ],
                    [ 'permissions-policy',        'Permissions-Policy',                   'low',    'madeit_security_permissions_enabled' ],
            ];
            foreach ( $header_checks as [ $hdr, $label, $sev, $opt ] ) {
                    $present = isset( $headers[ $hdr ] ) && ! empty( $headers[ $hdr ] );
                    // Also check report-only variant for CSP.
                    if ( ! $present && $hdr === 'content-security-policy' ) {
                            $present = isset( $headers['content-security-policy-report-only'] );
                    }
                    $results[] = [
                            'id'       => 'hdr_' . str_replace( '-', '_', $hdr ),
                            'category' => 'Security Headers',
                            'label'    => "{$label} Present",
                            'pass'     => $present,
                            'severity' => $sev,
                            'detail'   => $present ? "{$label} header is set." : "{$label} header is missing.",
                            'fix'      => 'Enable in Security → Security Headers.',
                            'option'   => $opt,
                    ];
            }

            // Leaky headers
            $server = $headers['server'] ?? '';
            $xpow   = $headers['x-powered-by'] ?? '';
            $server_leaks = ! empty( $server ) && preg_match( '/apache|nginx|iis|litespeed/i', $server ) && preg_match( '/\d+\.\d+/', $server );
            $results[] = [
                    'id'       => 'hdr_server_leak',
                    'category' => 'Security Headers',
                    'label'    => 'Server Header Not Leaking Version',
                    'pass'     => ! $server_leaks,
                    'severity' => 'low',
                    'detail'   => $server_leaks
                            ? "Server header reveals: {$server}"
                            : 'Server header does not reveal version info.',
                    'fix'      => 'Configure your web server to remove or obfuscate the Server header.',
                    'option'   => 'madeit_security_remove_server',
            ];
            $results[] = [
                    'id'       => 'hdr_powered_by',
                    'category' => 'Security Headers',
                    'label'    => 'X-Powered-By Header Removed',
                    'pass'     => empty( $xpow ),
                    'severity' => 'low',
                    'detail'   => empty( $xpow )
                            ? 'X-Powered-By header is not present.'
                            : "X-Powered-By reveals: {$xpow}",
                    'fix'      => 'Set expose_php = Off in php.ini.',
                    'option'   => null,
            ];

            return $results;
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 7: Information Disclosure
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_info_disclosure(): array {
            $results = [];

            // WP generator meta tag
            $gen = has_action( 'wp_head', 'wp_generator' );
            $results[] = [
                    'id'       => 'wp_generator',
                    'category' => 'Info Disclosure',
                    'label'    => 'WordPress Generator Tag Removed',
                    'pass'     => ! $gen,
                    'severity' => 'medium',
                    'detail'   => $gen ? 'The <meta name="generator"> tag exposes the WordPress version.' : 'Generator tag is removed.',
                    'fix'      => 'Enable "Hide WP Version" in Made I.T. Security Hardening.',
                    'option'   => 'madeit_security_hide_wp_version',
            ];

            // HTTPS on siteurl / home
            $siteurl = get_option( 'siteurl' );
            $home    = get_option( 'home' );
            $https   = str_starts_with( $siteurl, 'https://' ) && str_starts_with( $home, 'https://' );
            $results[] = [
                    'id'       => 'https_urls',
                    'category' => 'Info Disclosure',
                    'label'    => 'Site URLs Use HTTPS',
                    'pass'     => $https,
                    'severity' => 'high',
                    'detail'   => $https ? 'Both siteurl and home use HTTPS.' : 'One or both URLs use HTTP — insecure.',
                    'fix'      => 'Update siteurl and home to https:// in Settings → General.',
                    'option'   => null,
            ];

            return $results;
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 8: Database Content
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_suspicious_crons(): array {
        $crons   = _get_cron_array();
        $suspect = [];
        $exclude = [
            'woocommerce_marketplace_cron_fetch_promotions',
        ];

        if ( is_array( $crons ) ) {
            foreach ( $crons as $ts => $hooks ) {
                if ( ! is_array( $hooks ) ) continue;
                foreach ( $hooks as $hook => $_ ) {
                    if ( in_array( $hook, $exclude, true ) ) {
                        continue;
                    }
                    if ( preg_match( '/wget|curl|eval|base64|download|fetch|remote/i', $hook ) ) {
                        $suspect[] = $hook;
                    }
                }
            }
        }

        return [ [
            'id'       => 'suspicious_crons',
            'category' => 'Database',
            'label'    => 'No Suspicious Cron Jobs',
            'pass'     => empty( $suspect ),
            'severity' => 'critical',
            'detail'   => empty( $suspect )
                    ? 'No suspicious cron hooks detected.'
                    : 'Suspicious hooks: ' . implode( ', ', array_slice( $suspect, 0, 5 ) ),
            'fix'      => 'Remove unrecognized cron hooks via WP-CLI or a cron management plugin.',
            'option'   => null,
        ] ];
    }

    private static function check_siteurl_mismatch(): array {
        $siteurl = get_option( 'siteurl' );
        $home    = get_option( 'home' );
        $s_host  = wp_parse_url( $siteurl, PHP_URL_HOST ) ?? '';
        $h_host  = wp_parse_url( $home, PHP_URL_HOST ) ?? '';
        $match   = ( $s_host === $h_host );
        return [ [
            'id'       => 'siteurl_match',
            'category' => 'Database',
            'label'    => 'Site URL and Home URL Domains Match',
            'pass'     => $match,
            'severity' => 'critical',
            'detail'   => $match
                    ? "Both point to {$s_host}."
                    : "siteurl={$s_host}, home={$h_host} — possible site hijack.",
            'fix'      => 'Verify siteurl and home in wp_options. If hijacked, restore from backup.',
            'option'   => null,
        ] ];
    }

    private static function check_db_privileges(): array {
        global $wpdb;
        $has_all = false;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- one-time security audit query
        $grants = $wpdb->get_results( 'SHOW GRANTS FOR CURRENT_USER()', ARRAY_N );
        if ( is_array( $grants ) ) {
            foreach ( $grants as $row ) {
                $line = $row[0] ?? '';
                if ( stripos( $line, 'ALL PRIVILEGES' ) !== false || stripos( $line, 'SUPER' ) !== false ) {
                    $has_all = true;
                    break;
                }
            }
        }
        return [ [
            'id'       => 'db_privileges',
            'category' => 'Database',
            'label'    => 'Database User Has Minimal Privileges',
            'pass'     => ! $has_all,
            'severity' => 'medium',
            'detail'   => $has_all
                    ? 'Database user has ALL PRIVILEGES or SUPER — excessive for WordPress.'
                    : 'Database user does not have ALL PRIVILEGES.',
            'fix'      => 'Restrict to: SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX.',
            'option'   => null,
        ] ];
    }

    /* ═══════════════════════════════════════════════════════════════════════
    Category 9: Plugin / Theme
    ═══════════════════════════════════════════════════════════════════════ */

    private static function check_outdated_plugins(): array {
            $updates = get_site_transient( 'update_plugins' );
            $count   = 0;
            $names   = [];
            if ( is_object( $updates ) && ! empty( $updates->response ) ) {
                    $all = get_plugins();
                    foreach ( $updates->response as $file => $info ) {
                            ++$count;
                            $names[] = $all[ $file ]['Name'] ?? $file;
                    }
            }
            return [ [
                    'id'       => 'outdated_plugins',
                    'category' => 'Plugins & Themes',
                    'label'    => 'All Plugins Up-to-Date',
                    'pass'     => 0 === $count,
                    'severity' => 'high',
                    'detail'   => 0 === $count
                            ? 'All plugins are up-to-date.'
                            : "{$count} plugin(s) need updates: " . implode( ', ', array_slice( $names, 0, 5 ) ) . ( $count > 5 ? '…' : '' ),
                    'fix'      => 'Update plugins via Dashboard → Updates.',
                    'option'   => null,
            ] ];
    }

    private static function check_outdated_themes(): array {
            $updates = get_site_transient( 'update_themes' );
            $count   = 0;
            $names   = [];
            if ( is_object( $updates ) && ! empty( $updates->response ) ) {
                    foreach ( $updates->response as $slug => $info ) {
                            ++$count;
                            $theme = wp_get_theme( $slug );
                            $names[] = $theme->exists() ? $theme->get( 'Name' ) : $slug;
                    }
            }
            return [ [
                    'id'       => 'outdated_themes',
                    'category' => 'Plugins & Themes',
                    'label'    => 'All Themes Up-to-Date',
                    'pass'     => 0 === $count,
                    'severity' => 'high',
                    'detail'   => 0 === $count
                            ? 'All themes are up-to-date.'
                            : "{$count} theme(s) need updates: " . implode( ', ', array_slice( $names, 0, 5 ) ),
                    'fix'      => 'Update themes via Dashboard → Updates.',
                    'option'   => null,
            ] ];
    }

    private static function check_core_integrity(): array {
        $checksums = get_core_checksums( get_bloginfo( 'version' ), get_locale() );
        $exclude_prefixes = [
            'wp-content/languages/plugins/',
        ];

        if ( ! is_array( $checksums ) || empty( $checksums ) ) {
            return [ [
                'id'       => 'core_integrity',
                'category' => 'Plugins & Themes',
                'label'    => 'WordPress Core File Integrity',
                'pass'     => true,
                'severity' => 'info',
                'detail'   => 'Could not retrieve core checksums from WordPress.org.',
                'fix'      => '',
                'option'   => null,
            ] ];
        }

        $modified = [];
        $checked  = 0;
        foreach ( $checksums as $file => $hash ) {
            $skip = false;
            foreach ( $exclude_prefixes as $prefix ) {
                if ( str_starts_with( wp_normalize_path( $file ), $prefix ) ) {
                    $skip = true;
                    break;
                }
            }
            if ( $skip ) continue;

            $full = ABSPATH . $file;
            if ( ! file_exists( $full ) ) continue;
            ++$checked;
            if ( md5_file( $full ) !== $hash ) { // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_md5_file -- comparing against WP.org official MD5 checksums
                $modified[] = $file;
                if ( count( $modified ) >= 20 ) break;
            }
        }
        return [ [
            'id'       => 'core_integrity',
            'category' => 'Plugins & Themes',
            'label'    => 'WordPress Core File Integrity',
            'pass'     => empty( $modified ),
            'severity' => 'critical',
            'detail'   => empty( $modified )
                    ? "Verified {$checked} core files — all match official checksums."
                    : count( $modified ) . ' modified file(s): ' . implode( ', ', array_slice( $modified, 0, 5 ) ) . ( count( $modified ) > 5 ? '…' : '' ),
            'fix'      => 'Reinstall WordPress core via Dashboard → Updates or use Post-Breach → Reinstall Core.',
            'option'   => null,
        ] ];
    }
}
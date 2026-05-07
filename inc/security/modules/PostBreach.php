<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Post-Breach Recovery
 * 12 emergency actions for responding to a compromise.
 * Every action is logged to the audit trail.
 */
class PostBreach {

    public static function init(): void {
        add_action( 'wp_ajax_madeit_security_breach_action', [ __CLASS__, 'dispatch' ] );
    }

    // ── Dispatcher ─────────────────────────────────────────────────────────────
    public static function dispatch(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) wp_send_json_error( [ 'message' => 'Unauthorized.' ], 403 );

        $action = isset( $_POST['breach_action'] ) ? sanitize_key( wp_unslash( $_POST['breach_action'] ) ) : '';
        $map = [
            'terminate_sessions'   => 'action_terminate_sessions',
            'force_password_reset' => 'action_force_password_reset',
            'rotate_secret_keys'   => 'action_rotate_secret_keys',
            'reinstall_core'       => 'action_reinstall_core',
            'reinstall_plugins'    => 'action_reinstall_plugins',
            'audit_admins'         => 'action_audit_admins',
            'revoke_app_passwords' => 'action_revoke_app_passwords',
            'clear_transients'     => 'action_clear_transients',
            'lockdown_site'        => 'action_lockdown_site',
            'unlock_site'          => 'action_unlock_site',
            'scan_database'        => 'action_scan_database',
            'disable_plugins'      => 'action_disable_plugins',
            'restore_plugins'      => 'action_restore_plugins',
            'generate_report'      => 'action_generate_report',
        ];

        if ( ! isset( $map[ $action ] ) ) {
            wp_send_json_error( [ 'message' => 'Unknown action.' ] );
        }

        $result = call_user_func( [ __CLASS__, $map[ $action ] ] );
        self::audit( $action, $result['message'] ?? 'Completed.' );
        $result['success'] ? wp_send_json_success( $result ) : wp_send_json_error( $result );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 1 — Terminate All Sessions
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_terminate_sessions(): array {
        $users = get_users( [ 'fields' => 'ID' ] );
        foreach ( $users as $uid ) {
            delete_user_meta( $uid, 'session_tokens' );
        }
        return [
            'success' => true,
            'message' => count( $users ) . ' user session(s) destroyed immediately. Everyone has been logged out.',
            'details' => [ 'users_affected' => count( $users ) ],
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 2 — Force Password Reset for All Users
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_force_password_reset(): array {
        $users = get_users( [ 'fields' => 'ID' ] );
        foreach ( $users as $uid ) {
            // Flag the account — WP will prompt password change on next login
            update_user_meta( $uid, 'madeit_security_require_password_reset', 1 );
            // Also destroy their sessions
            delete_user_meta( $uid, 'session_tokens' );
        }

        // Hook to enforce the reset on wp_login
        update_option( 'madeit_security_force_pw_reset_active', 1 );

        return [
            'success' => true,
            'message' => count( $users ) . ' account(s) flagged. Every user must set a new password before accessing the site.',
            'details' => [ 'users_affected' => count( $users ) ],
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 3 — Rotate WordPress Secret Keys & Salts
    // ══════════════════════════════════════════════════════════════════════════
    //
    // Rewrites the eight auth constants directly in `wp-config.php`. A
    // timestamped backup of the file is written next to it before any change
    // is applied. If wp-config.php cannot be located or is not writable, the
    // action falls back to surfacing a snippet for the admin to paste in
    // manually and flags the operation as partial.
    private static function action_rotate_secret_keys(): array {
        $key_names = [
            'AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY',
            'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT',
        ];

        // ── 1. Fetch fresh keys (WP.org API preferred, local fallback). ──
        $response = wp_remote_get( 'https://api.wordpress.org/secret-key/1.1/salt/', [ 'timeout' => 10 ] );
        $new_keys = [];
        $raw      = '';

        if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response ) ) {
            $raw = (string) wp_remote_retrieve_body( $response );
            if ( preg_match_all( "/define\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/", $raw, $m ) ) {
                foreach ( $m[1] as $i => $name ) {
                    $name = strtoupper( $name );
                    if ( in_array( $name, $key_names, true ) ) {
                        $new_keys[ $name ] = $m[2][ $i ];
                    }
                }
            }
        }
        // Local fallback — also used to fill in any missing key if the API
        // response was partial.
        foreach ( $key_names as $name ) {
            if ( empty( $new_keys[ $name ] ) ) {
                $new_keys[ $name ] = wp_generate_password( 64, true, true );
            }
        }

        // ── 2. Locate wp-config.php and attempt the rewrite. ──
        $config_path = self::locate_wp_config();
        $rewrite     = [ 'success' => false, 'message' => '', 'backup' => '' ];
        if ( $config_path !== '' ) {
            $rewrite = self::rewrite_wp_config_keys( $config_path, $new_keys );
        } else {
            $rewrite['message'] = 'wp-config.php could not be located automatically.';
        }

        // ── 3. Destroy every session — all cookies are now invalid. ──
        foreach ( get_users( [ 'fields' => 'ID' ] ) as $uid ) {
            delete_user_meta( $uid, 'session_tokens' );
        }

        update_option( 'madeit_security_keys_rotated_at', current_time( 'mysql' ) );

        // Build the paste-in snippet for display (always provided as a safety
        // net, regardless of whether we managed the rewrite ourselves).
        $snippet = '';
        foreach ( $key_names as $name ) {
            $snippet .= sprintf( "define( '%s', '%s' );\n", $name, addslashes( $new_keys[ $name ] ) );
        }
        set_transient( 'madeit_security_rotated_keys_snippet', $snippet, 600 );

        if ( $rewrite['success'] ) {
            return [
                'success' => true,
                'message' => '8 secret keys and salts rotated directly in wp-config.php. A timestamped backup was saved to ' . basename( $rewrite['backup'] ) . '. Every existing cookie and session is now invalid — log back in with your password.',
                'snippet' => $snippet,
                'backup'  => $rewrite['backup'],
            ];
        }

        return [
            'success' => true,
            'message' => '8 new secret keys generated, but wp-config.php could not be updated automatically (' . $rewrite['message'] . '). Copy the snippet below into wp-config.php manually to complete the rotation. Existing sessions were still destroyed.',
            'snippet' => $snippet,
        ];
    }

    /**
     * Locate the site's wp-config.php file.
     *
     * WordPress looks in ABSPATH and one level up (for installs where
     * wp-config is moved outside the web root); we mirror that search
     * and return an empty string if neither exists.
     */
    private static function locate_wp_config(): string {
        $candidates = [
            ABSPATH . 'wp-config.php',
            dirname( ABSPATH ) . DIRECTORY_SEPARATOR . 'wp-config.php',
        ];
        foreach ( $candidates as $path ) {
            if ( is_file( $path ) ) {
                return $path;
            }
        }
        return '';
    }

    /**
     * Rewrite the eight WP secret-key / salt defines in wp-config.php.
     *
     * Guarantees:
     *   - Makes a timestamped backup copy before editing.
     *   - Replaces an existing `define('KEY', ...)` line if one is found,
     *     otherwise inserts the new define immediately after `<?php`.
     *   - Returns a structured result instead of throwing.
     *
     * @param string                $path     Full path to wp-config.php.
     * @param array<string, string> $new_keys KEY_NAME => new_value map.
     * @return array{success: bool, message: string, backup: string}
     */
    private static function rewrite_wp_config_keys( string $path, array $new_keys ): array {
        if ( ! is_readable( $path ) ) {
            return [ 'success' => false, 'message' => 'wp-config.php is not readable.', 'backup' => '' ];
        }
        if ( ! is_writable( $path ) ) {
            return [ 'success' => false, 'message' => 'wp-config.php is not writable by the web server.', 'backup' => '' ];
        }

        $contents = file_get_contents( $path );
        if ( $contents === false ) {
            return [ 'success' => false, 'message' => 'Could not read wp-config.php.', 'backup' => '' ];
        }

        // Write a backup FIRST so a failed rewrite can be rolled back by the admin.
        $backup_path = $path . '.madeit-security-backup-' . gmdate( 'Ymd-His' );
        if ( file_put_contents( $backup_path, $contents ) === false ) {
            return [ 'success' => false, 'message' => 'Could not write backup file.', 'backup' => '' ];
        }
        @chmod( $backup_path, 0600 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- chmod may fail on some hosts

        $updated = $contents;
        foreach ( $new_keys as $name => $value ) {
            // Value must be single-quote-safe inside the define literal.
            $quoted = "'" . addslashes( $value ) . "'";

            // Match any existing define('NAME', '...') whether single/double
            // quoted, any whitespace, and any semicolon terminator.
            $pattern     = '/define\s*\(\s*([\'"])' . preg_quote( $name, '/' ) . '\1\s*,\s*([\'"])([^\'"]*)\2\s*\)\s*;/';
            $replacement = "define( '" . $name . "', " . $quoted . ' );';

            if ( preg_match( $pattern, $updated ) ) {
                $updated = preg_replace( $pattern, $replacement, $updated, 1 );
            } else {
                // No existing define found — inject immediately after the opening PHP tag.
                $inject  = "\n" . $replacement;
                $updated = preg_replace( '/<\?php/', "<?php" . $inject, $updated, 1 );
            }
        }

        if ( $updated === $contents ) {
            return [ 'success' => false, 'message' => 'No changes were applied to wp-config.php.', 'backup' => $backup_path ];
        }

        if ( file_put_contents( $path, $updated, LOCK_EX ) === false ) {
            return [ 'success' => false, 'message' => 'Could not write updated wp-config.php (filesystem permissions?).', 'backup' => $backup_path ];
        }

        return [ 'success' => true, 'message' => 'wp-config.php updated.', 'backup' => $backup_path ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 4 — Reinstall WordPress Core
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_reinstall_core(): array {
        global $wp_version;

        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/misc.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

        $upgrader = new \Core_Upgrader( new \Automatic_Upgrader_Skin() );
        $result   = $upgrader->upgrade( $wp_version, [ 'attempt_rollback' => false ] );

        if ( is_wp_error( $result ) ) {
            return [ 'success' => false, 'message' => 'Reinstall failed: ' . $result->get_error_message() ];
        }

        return [
            'success' => true,
            'message' => "WordPress $wp_version core files replaced with a fresh download from WordPress.org. wp-content/ was not touched.",
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 5 — Reinstall All Repository Plugins
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_reinstall_plugins(): array {
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

        $all_plugins = get_plugins();
        $reinstalled = $skipped = $failed = [];

        foreach ( $all_plugins as $plugin_file => $data ) {
            $slug = explode( '/', $plugin_file )[0];
            if ( ! str_contains( $plugin_file, '/' ) ) {
                $slug = basename( $plugin_file, '.php' );
            }

            $api = plugins_api( 'plugin_information', [ 'slug' => $slug, 'fields' => [ 'versions' => false ] ] );
            if ( is_wp_error( $api ) ) {
                $skipped[] = $data['Name'];
                continue;
            }

            $was_active = is_plugin_active( $plugin_file );
            $upgrader   = new \Plugin_Upgrader( new \Automatic_Upgrader_Skin() );
            $result     = $upgrader->install( $api->download_link, [ 'overwrite_package' => true ] );

            if ( is_wp_error( $result ) || false === $result ) {
                $failed[] = $data['Name'];
            } else {
                if ( $was_active ) activate_plugin( $plugin_file );
                $reinstalled[] = $data['Name'];
            }
        }

        return [
            'success' => true,
            'message' => sprintf( '%d plugin(s) reinstalled from WordPress.org. %d skipped (premium/not in repo). %d failed.',
                count( $reinstalled ), count( $skipped ), count( $failed ) ),
            'details' => compact( 'reinstalled', 'skipped', 'failed' ),
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 6 — Audit Administrator Accounts
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_audit_admins(): array {
        $admins  = get_users( [ 'role__in' => [ 'administrator' ] ] );
        $flags   = [];
        $cutoff  = strtotime( '-14 days' );

        $sus_patterns = [
            '/^[a-f0-9]{8,32}$/i'       => 'Hex-only username — common backdoor pattern',
            '/^wp_[a-z0-9]{6,}$/'       => 'wp_ prefixed auto-generated name',
            '/^admin\d+$/'              => '"admin" + numbers — spray-attack target',
            '/^[a-z]{2,4}\d{5,}$/'      => 'Short letters + many digits',
            '/^user_\d+$/'              => 'Generic "user_N" username',
        ];

        foreach ( $admins as $u ) {
            $user_flags = [];

            if ( strtotime( $u->user_registered ) > $cutoff ) {
                $user_flags[] = 'Account created ' . human_time_diff( strtotime( $u->user_registered ) ) . ' ago';
            }

            foreach ( $sus_patterns as $re => $label ) {
                if ( preg_match( $re, $u->user_login ) ) { $user_flags[] = $label; break; }
            }

            // No last-login recorded (never logged in)
            $last = get_user_meta( $u->ID, 'last_login', true );
            if ( ! $last ) $user_flags[] = 'No recorded login activity';

            if ( ! empty( $user_flags ) ) {
                $flags[] = [
                    'id'         => $u->ID,
                    'login'      => $u->user_login,
                    'email'      => $u->user_email,
                    'registered' => $u->user_registered,
                    'flags'      => $user_flags,
                    'edit_url'   => admin_url( 'user-edit.php?user_id=' . $u->ID ),
                ];
            }
        }

        update_option( 'madeit_security_admin_audit', [ 'results' => $flags, 'at' => current_time( 'mysql' ), 'total' => count( $admins ) ], false );

        $msg = count( $flags ) > 0
            ? count( $flags ) . ' suspicious admin account(s) flagged — review them in the details panel.'
            : 'All ' . count( $admins ) . ' admin account(s) checked — no suspicious patterns found.';

        return [ 'success' => true, 'message' => $msg, 'details' => [ 'flagged' => $flags, 'total' => count( $admins ) ] ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 7 — Revoke All Application Passwords
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_revoke_app_passwords(): array {
        if ( ! class_exists( 'WP_Application_Passwords' ) ) {
            return [ 'success' => true, 'message' => 'Application Passwords are not enabled on this install.' ];
        }
        $users = get_users( [ 'fields' => 'ID' ] );
        $total = 0;
        foreach ( $users as $uid ) {
            $passwords = \WP_Application_Passwords::get_user_application_passwords( $uid );
            $total += count( $passwords );
            \WP_Application_Passwords::delete_all_application_passwords( $uid );
        }
        return [
            'success' => true,
            'message' => "$total application password(s) revoked across all users. REST API and XML-RPC access via app passwords is now blocked until new passwords are created.",
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 8 — Clear All Transients & Object Cache
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_clear_transients(): array {
        global $wpdb;
        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $del_t  = $wpdb->query( $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            $wpdb->esc_like( '_transient_' ) . '%',
            $wpdb->esc_like( '_site_transient_' ) . '%'
        ) );
        $del_tm = $wpdb->query( $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            $wpdb->esc_like( '_transient_timeout_' ) . '%',
            $wpdb->esc_like( '_site_transient_timeout_' ) . '%'
        ) );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        // Flush external object cache if present
        wp_cache_flush();

        // Clear any known caching plugins
        if ( function_exists( 'wp_cache_clear_cache' ) )  wp_cache_clear_cache();   // WP Super Cache
        if ( function_exists( 'w3tc_flush_all' ) )         w3tc_flush_all();         // W3 Total Cache
        if ( function_exists( 'rocket_clean_domain' ) )    rocket_clean_domain();    // WP Rocket
        if ( function_exists( 'sg_cachepress_purge_cache' ) ) sg_cachepress_purge_cache(); // SiteGround Optimizer

        return [
            'success' => true,
            'message' => ( $del_t + $del_tm ) . ' transient(s) deleted. Object cache and all compatible caching plugins flushed. Poisoned cached content is now cleared.',
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 9 — Emergency Site Lockdown
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_lockdown_site(): array {
        update_option( 'madeit_security_lockdown_active', 1 );
        update_option( 'madeit_security_lockdown_at', current_time( 'mysql' ) );
        update_option( 'madeit_security_lockdown_message', \MadeIT\Security\Settings::string( 'madeit_security_lockdown_message',
            'This site is temporarily offline for emergency maintenance. Please check back soon.' ) );

        return [
            'success' => true,
            'message' => 'Site locked down. All public traffic now sees a maintenance page. Admins on the IP Whitelist can still access wp-admin.',
        ];
    }

    private static function action_unlock_site(): array {
        delete_option( 'madeit_security_lockdown_active' );
        return [ 'success' => true, 'message' => 'Lockdown lifted. The site is publicly accessible again.' ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 10 — Immediate Database Malware Scan
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_scan_database(): array {
        Scanner::run_db_scan();
        $results = \MadeIT\Security\Settings::array( 'madeit_security_scan_db_results', [] );
        $count   = count( $results );

        return [
            'success' => true,
            'message' => $count > 0
                ? "⚠️ $count suspicious item(s) found in the database. Go to the Scanner page for details."
                : '✅ Database scan complete — no malware patterns detected.',
            'details' => [ 'findings' => $count ],
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 11 — Deactivate All Non-Essential Plugins
    // ══════════════════════════════════════════════════════════════════════════
    public static function action_disable_plugins(): array {
        $active = get_option( 'active_plugins', [] );

        // Keep this plugin active, everything else off
        $keep    = [];
        $current = plugin_basename( MADEIT_SECURITY_FILE );
        foreach ( $active as $plugin ) {
            if ( $plugin === $current ) $keep[] = $plugin;
        }

        // Store the list so they can be re-enabled
        update_option( 'madeit_security_disabled_plugins_backup', $active, false );
        update_option( 'active_plugins', $keep );

        $disabled_count = count( $active ) - count( $keep );

        return [
            'success' => true,
            'message' => "$disabled_count plugin(s) deactivated. Only Security remains active. A backup of the active plugin list has been saved — restore it from the button below.",
            'details' => [ 'backup' => $active, 'kept' => $keep ],
        ];
    }

    public static function action_restore_plugins(): array {
        $backup = \MadeIT\Security\Settings::array( 'madeit_security_disabled_plugins_backup', [] );
        if ( empty( $backup ) ) {
            return [ 'success' => false, 'message' => 'No backup found. Plugins were not disabled by Security.' ];
        }
        update_option( 'active_plugins', $backup );
        delete_option( 'madeit_security_disabled_plugins_backup' );
        return [ 'success' => true, 'message' => count( $backup ) . ' plugin(s) re-enabled from backup.' ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ACTION 12 — Generate Breach Incident Report
    // ══════════════════════════════════════════════════════════════════════════
    private static function action_generate_report(): array {
        global $wpdb;

        $site         = get_bloginfo( 'name' );
        $url          = home_url();
        $generated    = current_time( 'mysql' );
        $wp_version   = get_bloginfo( 'version' );
        $php_version  = PHP_VERSION;
        $admin_email  = get_option( 'admin_email' );

        // Collect data points
        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $recent_events = $wpdb->get_results( $wpdb->prepare(
            "SELECT event_type, severity, ip, url, description, created_at FROM {$wpdb->prefix}madeit_security_events ORDER BY created_at DESC LIMIT %d", 50
        ) );
        $blocked_ips   = $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_blocked_ips" );
        $cutoff_7d     = wp_date( 'Y-m-d H:i:s', time() - 7 * DAY_IN_SECONDS );
        $waf_blocks    = $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events WHERE event_type = %s AND created_at >= %s", 'waf_block', $cutoff_7d
        ) );
        $login_fails   = $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events WHERE event_type = %s AND created_at >= %s", 'login_failed', $cutoff_7d
        ) );
        $scan_findings = \MadeIT\Security\Settings::array( 'madeit_security_scan_findings', [] );
        $db_findings   = \MadeIT\Security\Settings::array( 'madeit_security_scan_db_results', [] );
        $admin_audit   = \MadeIT\Security\Settings::array( 'madeit_security_admin_audit', [] );
        $keys_rotated  = \MadeIT\Security\Settings::string( 'madeit_security_keys_rotated_at', 'Never' );
        $lockdown      = \MadeIT\Security\Settings::bool( 'madeit_security_lockdown_active', false ) ? 'ACTIVE' : 'Inactive';
        $audit_log     = $wpdb->get_results( $wpdb->prepare(
            "SELECT user_id, username, action, description, ip, created_at FROM {$wpdb->prefix}madeit_security_audit_log ORDER BY created_at DESC LIMIT %d", 30
        ) );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        $report = [
            'meta' => [
                'report_type'  => 'Security Incident Report',
                'site_name'    => $site,
                'site_url'     => $url,
                'generated_at' => $generated,
                'generated_by' => wp_get_current_user()->user_login,
                'wp_version'   => $wp_version,
                'php_version'  => $php_version,
                'admin_email'  => $admin_email,
            ],
            'status_snapshot' => [
                'lockdown_status'       => $lockdown,
                'blocked_ips_total'     => (int) $blocked_ips,
                'waf_blocks_7d'         => (int) $waf_blocks,
                'login_failures_7d'     => (int) $login_fails,
                'file_scan_findings'    => count( $scan_findings ),
                'db_scan_findings'      => count( $db_findings ),
                'suspicious_admins'     => count( $admin_audit['results'] ?? [] ),
                'secret_keys_rotated'   => $keys_rotated,
            ],
            'recent_security_events' => $recent_events,
            'file_scan_findings'     => $scan_findings,
            'db_scan_findings'       => $db_findings,
            'admin_audit'            => $admin_audit,
            'admin_audit_log'        => $audit_log,
        ];

        $filename = 'madeit-security-incident-report-' . wp_date( 'Y-m-d-Hi' ) . '.json';
        update_option( 'madeit_security_last_report', [
            'data'      => $report,
            'filename'  => $filename,
            'generated' => $generated,
        ], false );

        return [
            'success'   => true,
            'message'   => 'Incident report compiled. Download it below — include this file when reporting to your host or security team.',
            'filename'  => $filename,
            'report'    => $report,
        ];
    }

    // ── Enforce password reset on login ───────────────────────────────────────
    public static function enforce_password_reset(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_force_pw_reset_active', false ) ) return;

        // Redirect on initial login
        add_action( 'wp_login', function ( $user_login, $user ) {
            if ( get_user_meta( $user->ID, 'madeit_security_require_password_reset', true ) ) {
                wp_safe_redirect( admin_url( 'profile.php?madeit_security_reset=1' ) );
                exit;
            }
        }, 10, 2 );

        // Block ALL admin pages except profile.php until password is changed
        add_action( 'admin_init', function () {
            if ( wp_doing_ajax() || ! is_user_logged_in() ) return;
            $user = wp_get_current_user();
            if ( ! get_user_meta( $user->ID, 'madeit_security_require_password_reset', true ) ) return;

            // Allow profile.php (where they change password)
            global $pagenow;
            if ( $pagenow === 'profile.php' ) return;

            wp_safe_redirect( admin_url( 'profile.php?madeit_security_reset=1' ) );
            exit;
        }, 0 );

        // Clear the flag once the user actually changes their password
        add_action( 'password_reset', function ( $user ) {
            delete_user_meta( $user->ID, 'madeit_security_require_password_reset' );
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key,WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- intentional: checking if any users still need password reset (small result set, runs only on password_reset)
            $remaining = get_users( [ 'meta_key' => 'madeit_security_require_password_reset', 'meta_value' => 1 ] );
            if ( empty( $remaining ) ) delete_option( 'madeit_security_force_pw_reset_active' );
        } );

        // Also clear via profile update (some configs use this instead of password_reset)
        add_action( 'profile_update', function ( $user_id ) {
            // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- password check in profile_update hook; nonce verified by WP core
            if ( isset( $_POST['pass1'] ) && ! empty( $_POST['pass1'] ) ) {
                delete_user_meta( $user_id, 'madeit_security_require_password_reset' );
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key,WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- intentional: checking if any users still need password reset (small result set, runs only on profile_update)
                $remaining = get_users( [ 'meta_key' => 'madeit_security_require_password_reset', 'meta_value' => 1 ] );
                if ( empty( $remaining ) ) delete_option( 'madeit_security_force_pw_reset_active' );
            }
        } );

        // Show banner on profile page
        add_action( 'admin_notices', function () {
            if ( ! isset( $_GET['madeit_security_reset'] ) ) return; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display-only admin notice
            echo '<div class="notice notice-error"><p><strong>Security Notice:</strong> You must change your password before continuing. Update your password below.</p></div>';
        } );
    }

    // ── Lockdown middleware ────────────────────────────────────────────────────
    public static function enforce_lockdown(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_lockdown_active', false ) ) return;
        if ( defined( 'MADEIT_SECURITY_BLOCKING_DISABLED' ) && MADEIT_SECURITY_BLOCKING_DISABLED ) return;

        // Frontend pages
        add_action( 'template_redirect', [ __CLASS__, 'lockdown_gate' ], 0 );

        // REST API
        add_filter( 'rest_authentication_errors', function ( $result ) {
            if ( self::is_lockdown_exempt() ) return $result;
            return new \WP_Error( 'madeit_security_lockdown', 'Site is in emergency lockdown.', [ 'status' => 503 ] );
        }, 0 );

        // XML-RPC
        add_filter( 'xmlrpc_enabled', function ( $enabled ) {
            if ( self::is_lockdown_exempt() ) return $enabled;
            return false;
        }, 0 );

        // Non-authenticated AJAX
        add_action( 'admin_init', function () {
            if ( ! wp_doing_ajax() ) return;
            if ( self::is_lockdown_exempt() ) return;
            wp_send_json_error( [ 'message' => 'Site is in emergency lockdown.' ], 503 );
        }, 0 );
    }

    private static function is_lockdown_exempt(): bool {
        if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) return true;
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( \MadeIT\Security\RequestLogger::get_real_ip() ) ) return true;
        return false;
    }

    public static function lockdown_gate(): void {
        if ( self::is_lockdown_exempt() ) return;

        $msg = \MadeIT\Security\Settings::string( 'madeit_security_lockdown_message', 'This site is temporarily offline for emergency maintenance.' );
        status_header( 503 );
        header( 'Retry-After: 3600' );
        wp_register_style( 'madeit-security-lockdown', MADEIT_SECURITY_URL . 'includes/assets/css/lockdown-page.css', [], MADEIT_VERSION );
        wp_enqueue_style( 'madeit-security-lockdown' );
        echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Site Offline</title>';
        wp_print_styles( 'madeit-security-lockdown' );
        echo '</head><body><div class="card"><div class="icon">🔒</div><h1>Site Temporarily Offline</h1><p>' . esc_html( $msg ) . '</p></div></body></html>';
        exit;
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    private static function audit( string $action, string $message ): void {
        global $wpdb;
        $user = wp_get_current_user();
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_audit_log',
            [
                'user_id'     => $user->ID,
                'username'    => $user->user_login,
                'action'      => 'breach_action:' . $action,
                'object_type' => 'breach',
                'description' => $message,
                'ip'          => \MadeIT\Security\RequestLogger::get_real_ip(),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%d', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
    }

    public static function get_action_definitions(): array {
        return [
            [
                'id'       => 'terminate_sessions',
                'icon'     => '⚡',
                'title'    => 'Terminate All Active Sessions',
                'desc'     => 'Immediately destroys every login session across all user accounts. Everyone is logged out right now — including you after this action completes.',
                'severity' => 'high',
                'confirm'  => 'This will log out EVERY user on the site, including you. You\'ll need to log back in. Continue?',
                'btn'      => 'Terminate All Sessions',
            ],
            [
                'id'       => 'force_password_reset',
                'icon'     => '🔑',
                'title'    => 'Require Password Reset for All Users',
                'desc'     => 'Every user account is flagged — they must set a new password on their next login attempt. All current sessions are ended immediately.',
                'severity' => 'high',
                'confirm'  => 'All users will be logged out and forced to reset their password. This includes you. Continue?',
                'btn'      => 'Force Reset for All Users',
            ],
            [
                'id'       => 'rotate_secret_keys',
                'icon'     => '🔐',
                'title'    => 'Rotate WordPress Secret Keys & Salts',
                'desc'     => 'Generates fresh authentication keys from WordPress.org and stores them. Every existing login cookie and session token becomes invalid instantly — the cryptographic equivalent of changing all your locks.',
                'severity' => 'high',
                'confirm'  => 'All cookies and sessions will be invalidated site-wide. You\'ll need to log in again. Continue?',
                'btn'      => 'Rotate All Keys',
            ],
            [
                'id'       => 'reinstall_core',
                'icon'     => '⬇️',
                'title'    => 'Reinstall WordPress Core',
                'desc'     => 'Downloads a clean copy of WordPress from WordPress.org and overwrites all core files (wp-admin/, wp-includes/, root PHP files). Your content, plugins, and themes in wp-content/ are untouched.',
                'severity' => 'medium',
                'confirm'  => 'WordPress core files will be overwritten with a fresh download. This may take a minute. Continue?',
                'btn'      => 'Reinstall Core Files',
            ],
            [
                'id'       => 'reinstall_plugins',
                'icon'     => '🔄',
                'title'    => 'Reinstall All Repository Plugins',
                'desc'     => 'Re-downloads and reinstalls every plugin hosted on WordPress.org, replacing their files entirely. Premium plugins not in the repository are skipped. Active plugins remain active.',
                'severity' => 'medium',
                'confirm'  => 'All free WordPress.org plugins will be reinstalled from scratch. This may take several minutes. Continue?',
                'btn'      => 'Reinstall Free Plugins',
            ],
            [
                'id'       => 'audit_admins',
                'icon'     => '👤',
                'title'    => 'Audit Administrator Accounts',
                'desc'     => 'Scans all administrator accounts for suspicious patterns: recently created accounts, hex-string usernames (a classic backdoor pattern), accounts that have never logged in, and other indicators of attacker-created accounts.',
                'severity' => 'low',
                'confirm'  => null,
                'btn'      => 'Run Admin Audit',
            ],
            [
                'id'       => 'revoke_app_passwords',
                'icon'     => '🚫',
                'title'    => 'Revoke All Application Passwords',
                'desc'     => 'Deletes every application password for all users. Application passwords allow external tools to authenticate via REST API or XML-RPC — revoking them cuts off any attacker using stolen app passwords.',
                'severity' => 'medium',
                'confirm'  => 'All application passwords for all users will be permanently deleted. Apps using them will lose access. Continue?',
                'btn'      => 'Revoke App Passwords',
            ],
            [
                'id'       => 'clear_transients',
                'icon'     => '🗑️',
                'title'    => 'Purge Transients & All Caches',
                'desc'     => 'Deletes all transients from the database, flushes the object cache, and clears compatible caching plugins (WP Rocket, W3 Total Cache, WP Super Cache, SiteGround Optimizer). Removes potentially poisoned cached responses.',
                'severity' => 'low',
                'confirm'  => null,
                'btn'      => 'Purge All Caches',
            ],
            [
                'id'       => 'lockdown_site',
                'icon'     => '🔒',
                'title'    => 'Emergency Site Lockdown',
                'desc'     => 'Immediately takes the site offline for all public visitors — they see a maintenance message instead of any content. Admins on the IP Whitelist can still access wp-admin normally. Use this while you clean up.',
                'severity' => 'critical',
                'confirm'  => 'The entire site will go offline for all public visitors. Whitelisted IPs can still access wp-admin. Continue?',
                'btn'      => 'Activate Lockdown',
            ],
            [
                'id'       => 'scan_database',
                'icon'     => '🔍',
                'title'    => 'Emergency Database Scan',
                'desc'     => 'Immediately scans wp_options, wp_posts, and wp_users for injected malware, hidden iframes, eval() payloads, suspicious base64, and rogue administrator accounts created by an attacker.',
                'severity' => 'low',
                'confirm'  => null,
                'btn'      => 'Scan Database Now',
            ],
            [
                'id'       => 'disable_plugins',
                'icon'     => '🛑',
                'title'    => 'Deactivate All Non-Essential Plugins',
                'desc'     => 'Deactivates every plugin except Security. A backup of your active plugin list is saved so you can restore them with one click once the site is clean. Useful for isolating which plugin was exploited.',
                'severity' => 'high',
                'confirm'  => 'All plugins except Security will be deactivated. Your active plugin list is backed up for easy restoration. Continue?',
                'btn'      => 'Deactivate All Plugins',
            ],
            [
                'id'       => 'generate_report',
                'icon'     => '📄',
                'title'    => 'Generate Incident Report',
                'desc'     => 'Compiles a full security incident report including recent events, WAF activity, scan findings, admin audit results, and actions taken — ready to share with your hosting provider or security team.',
                'severity' => 'low',
                'confirm'  => null,
                'btn'      => 'Generate Report',
            ],
        ];
    }
}
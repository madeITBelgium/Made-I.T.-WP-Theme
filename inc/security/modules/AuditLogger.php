<?php
namespace MadeIT\Security\modules;

use MadeIT\Security\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Audit Logger — tracks security-relevant WordPress admin actions.
 *
 * All writes are buffered in memory and flushed once at shutdown,
 * so hooking into save_post / plugin activation / etc. adds zero
 * latency to the actual operation.
 */
class AuditLogger {

    /** Buffered audit entries to write at shutdown. */
    private static array $buffer = [];

    /** Whether the shutdown hook is registered. */
    private static bool $shutdown_registered = false;

    /**
     * Snapshot of plugin versions captured before update starts.
     *
     * @var array<string,string>
     */
    private static array $pre_update_plugin_versions = [];

    public static function init(): void {
        if ( ! Settings::bool( 'madeit_security_audit_log_enabled', true ) ) {
            return;
        }

        // ── Plugin lifecycle ───────────────────────────────────────────────
        add_action( 'activated_plugin',   [ __CLASS__, 'on_plugin_activated' ], 10, 2 );
        add_action( 'deactivated_plugin', [ __CLASS__, 'on_plugin_deactivated' ] );
        add_action( 'deleted_plugin',     [ __CLASS__, 'on_plugin_deleted' ], 10, 2 );
        add_filter( 'upgrader_pre_install', [ __CLASS__, 'capture_pre_update_versions' ], 10, 2 );
        add_action( 'upgrader_process_complete', [ __CLASS__, 'on_upgrade_complete' ], 10, 2 );

        // ── Theme changes ──────────────────────────────────────────────────
        add_action( 'switch_theme', [ __CLASS__, 'on_theme_switch' ], 10, 3 );

        // ── User management ────────────────────────────────────────────────
        add_action( 'user_register',  [ __CLASS__, 'on_user_created' ] );
        add_action( 'delete_user',    [ __CLASS__, 'on_user_deleted' ], 10, 2 );
        add_action( 'set_user_role',  [ __CLASS__, 'on_role_changed' ], 10, 3 );

        // ── Content deletion (security-relevant, not edits) ────────────────
        add_action( 'wp_after_insert_post', [ __CLASS__, 'on_post_saved' ], 10, 4 );
        add_action( 'before_delete_post', [ __CLASS__, 'on_post_deleted' ], 10, 2 );

        // ── Authentication and admin activity ───────────────────────────────
        add_action( 'wp_login', [ __CLASS__, 'on_login_success' ], 10, 2 );
        add_action( 'wp_login_failed', [ __CLASS__, 'on_login_failed' ] );
        add_action( 'current_screen', [ __CLASS__, 'on_admin_page_visit' ] );

        // ── Settings changes ────────────────────────────────────────────────
        add_action( 'added_option', [ __CLASS__, 'on_option_added' ], 10, 2 );
        add_action( 'updated_option', [ __CLASS__, 'on_option_updated' ], 10, 3 );
        add_action( 'deleted_option', [ __CLASS__, 'on_option_deleted' ], 10, 1 );

        // ── Core option changes that affect security ───────────────────────
        add_action( 'update_option_users_can_register', [ __CLASS__, 'on_registration_toggle' ], 10, 2 );
        add_action( 'update_option_default_role',       [ __CLASS__, 'on_default_role_change' ], 10, 2 );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HOOK CALLBACKS
    // ═══════════════════════════════════════════════════════════════════════

    public static function on_plugin_activated( string $plugin, bool $network_wide ): void {
        $name = self::plugin_name( $plugin );
        self::queue( 'plugin_activated', 'plugin', $plugin, sprintf( 'Plugin activated: %s', $name ) );
    }

    public static function on_plugin_deactivated( string $plugin ): void {
        $name = self::plugin_name( $plugin );
        self::queue( 'plugin_deactivated', 'plugin', $plugin, sprintf( 'Plugin deactivated: %s', $name ) );
    }

    public static function on_plugin_deleted( string $plugin, bool $deleted ): void {
        if ( $deleted ) {
            self::queue( 'plugin_deleted', 'plugin', $plugin, sprintf( 'Plugin deleted: %s', $plugin ) );
        }
    }

    /**
     * @param \WP_Upgrader                                    $upgrader
     * @param array{action: string, type: string, plugins?: string[], themes?: string[]} $data
     */
    public static function on_upgrade_complete( $upgrader, array $data ): void {
        $action = $data['action'] ?? '';
        $type   = $data['type']   ?? '';

        if ( 'update' === $action && 'plugin' === $type && ! empty( $data['plugins'] ) ) {
            foreach ( $data['plugins'] as $plugin ) {
                $name = self::plugin_name( $plugin );
                $old_version = self::plugin_old_version( $plugin );
                $new_version = self::plugin_current_version( $plugin );
                self::queue(
                    'plugin_updated',
                    'plugin',
                    $plugin,
                    sprintf( 'Plugin updated: %s (v%s -> v%s)', $name, $old_version, $new_version )
                );
            }
        }

        if ( 'update' === $action && 'theme' === $type && ! empty( $data['themes'] ) ) {
            foreach ( $data['themes'] as $theme ) {
                self::queue( 'theme_updated', 'theme', $theme, sprintf( 'Theme updated: %s', $theme ) );
            }
        }

        if ( 'install' === $action && 'plugin' === $type ) {
            self::queue( 'plugin_installed', 'plugin', '', 'New plugin installed' );
        }

        if ( 'install' === $action && 'theme' === $type ) {
            self::queue( 'theme_installed', 'theme', '', 'New theme installed' );
        }
    }

    public static function on_theme_switch( string $new_name, \WP_Theme $new_theme, \WP_Theme $old_theme ): void {
        self::queue(
            'theme_switched',
            'theme',
            $new_theme->get_stylesheet(),
            sprintf( 'Theme switched from "%s" to "%s"', $old_theme->get( 'Name' ), $new_name )
        );
    }

    public static function on_user_created( int $user_id ): void {
        $user = get_userdata( $user_id );
        $name = $user ? $user->user_login : "ID:{$user_id}";
        $role = $user ? implode( ', ', $user->roles ) : '';
        self::queue( 'user_created', 'user', (string) $user_id, sprintf( 'User created: %s (role: %s)', $name, $role ) );
    }

    public static function on_user_deleted( int $user_id, ?int $reassign ): void {
        $user = get_userdata( $user_id );
        $name = $user ? $user->user_login : "ID:{$user_id}";
        self::queue( 'user_deleted', 'user', (string) $user_id, sprintf( 'User deleted: %s', $name ) );
    }

    public static function on_role_changed( int $user_id, string $new_role, array $old_roles ): void {
        $user     = get_userdata( $user_id );
        $name     = $user ? $user->user_login : "ID:{$user_id}";
        $old_role = implode( ', ', $old_roles );
        self::queue( 'user_role_changed', 'user', (string) $user_id, sprintf( 'User role changed: %s (%s → %s)', $name, $old_role, $new_role ) );
    }

    public static function on_post_deleted( int $post_id, \WP_Post $post ): void {
        // Only log meaningful content types, not revisions/nav_menu_items/etc.
        if ( in_array( $post->post_type, [ 'revision', 'nav_menu_item', 'customize_changeset', 'oembed_cache', 'wp_global_styles' ], true ) ) {
            return;
        }
        self::queue(
            'post_deleted',
            $post->post_type,
            (string) $post_id,
            sprintf( 'Post deleted: "%s" (%s)', $post->post_title, self::post_meta_text( $post ) )
        );
    }

    /**
     * @param int      $post_id
     * @param \WP_Post $post
     * @param bool     $update
    * @param \WP_Post|null $post_before
     */
    public static function on_post_saved( int $post_id, \WP_Post $post, bool $update, ?\WP_Post $post_before ): void {
        if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
            return;
        }

        if ( in_array( $post->post_type, [ 'revision', 'nav_menu_item', 'customize_changeset', 'oembed_cache', 'wp_global_styles' ], true ) ) {
            return;
        }

        if ( 'auto-draft' === $post->post_status ) {
            return;
        }

        if ( $update ) {
            self::queue(
                'post_edited',
                $post->post_type,
                (string) $post_id,
                sprintf( 'Post edited: "%s" (%s)', $post->post_title, self::post_meta_text( $post ) )
            );

            return;
        }

        self::queue(
            'post_created',
            $post->post_type,
            (string) $post_id,
            sprintf( 'Post created: "%s" (%s)', $post->post_title, self::post_meta_text( $post ) )
        );
    }

    public static function on_login_success( string $user_login, \WP_User $user ): void {
        self::queue(
            'login_success',
            'user',
            (string) $user->ID,
            sprintf( 'Login success: %s', $user_login )
        );
    }

    public static function on_login_failed( string $username ): void {
        if ( '' === trim( $username ) ) {
            $username = '(empty)';
        }

        self::queue(
            'login_failed',
            'auth',
            $username,
            sprintf( 'Login failed for username: %s', $username )
        );
    }

    public static function on_admin_page_visit( \WP_Screen $screen ): void {
        if ( ! is_admin() ) {
            return;
        }

        if ( ! Settings::bool( 'madeit_security_audit_log_admin_visits', false ) ) {
            return;
        }

        if ( ! is_user_logged_in() ) {
            return;
        }

        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        self::queue(
            'admin_page_visit',
            'admin_page',
            $screen->id,
            sprintf( 'Admin page visited: %s', $screen->id )
        );
    }

    /**
     * @param string $old_value
     * @param string $new_value
     */
    public static function on_registration_toggle( $old_value, $new_value ): void {
        $state = $new_value ? 'enabled' : 'disabled';
        self::queue( 'registration_toggled', 'option', 'users_can_register', sprintf( 'User registration %s', $state ) );
    }

    /**
     * @param string $old_value
     * @param string $new_value
     */
    public static function on_default_role_change( $old_value, $new_value ): void {
        self::queue( 'default_role_changed', 'option', 'default_role', sprintf( 'Default user role changed from "%s" to "%s"', $old_value, $new_value ) );
    }

    public static function on_option_added( string $option, $value ): void {
        if ( ! self::should_log_option_change( $option ) ) {
            return;
        }

        self::queue(
            'setting_added',
            'option',
            $option,
            sprintf( 'Setting added: %s = %s', $option, self::normalize_option_value( $value ) )
        );
    }

    public static function on_option_updated( string $option, $old_value, $value ): void {
        if ( ! self::should_log_option_change( $option ) ) {
            return;
        }

        if ( self::normalize_option_value( $old_value ) === self::normalize_option_value( $value ) ) {
            return;
        }

        self::queue(
            'setting_changed',
            'option',
            $option,
            sprintf( 'Setting changed: %s (%s → %s)', $option, self::normalize_option_value( $old_value ), self::normalize_option_value( $value ) )
        );
    }

    public static function on_option_deleted( string $option ): void {
        if ( ! self::should_log_option_change( $option ) ) {
            return;
        }

        self::queue( 'setting_deleted', 'option', $option, sprintf( 'Setting deleted: %s', $option ) );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // BUFFERED WRITE
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Add an entry to the in-memory buffer.
     */
    private static function queue( string $action, string $object_type, string $object_id, string $description ): void {
        $user = wp_get_current_user();

        self::$buffer[] = [
            'user_id'     => (int) $user->ID,
            'username'    => $user->user_login ?? '',
            'action'      => $action,
            'object_type' => $object_type,
            'object_id'   => $object_id,
            'description' => $description,
            'ip'          => \MadeIT\Security\RequestLogger::get_real_ip(),
            'created_at'  => current_time( 'mysql' ),
        ];

        if ( ! self::$shutdown_registered ) {
            self::$shutdown_registered = true;
            add_action( 'shutdown', [ __CLASS__, 'flush' ] );
        }
    }

    /**
     * Write all buffered entries to the database in one go.
     */
    public static function flush(): void {
        if ( empty( self::$buffer ) ) {
            return;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'madeit_security_audit_log';

        foreach ( self::$buffer as $entry ) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- audit log, not cacheable
            $wpdb->insert( $table, $entry, [ '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s' ] );
        }

        self::$buffer             = [];
        self::$shutdown_registered = false;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get a human-readable plugin name from its file path.
     */
    private static function plugin_name( string $plugin_file ): string {
        if ( ! function_exists( 'get_plugin_data' ) ) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $full_path = WP_PLUGIN_DIR . '/' . $plugin_file;
        if ( file_exists( $full_path ) ) {
            $data = get_plugin_data( $full_path, false, false );
            if ( ! empty( $data['Name'] ) ) {
                return $data['Name'];
            }
        }

        // Fallback: use the directory/file name.
        return $plugin_file;
    }

    /**
     * @param mixed               $response
     * @param array<string,mixed> $hook_extra
     * @return mixed
     */
    public static function capture_pre_update_versions( $response, array $hook_extra ) {
        if ( ( $hook_extra['action'] ?? '' ) !== 'update' || ( $hook_extra['type'] ?? '' ) !== 'plugin' ) {
            return $response;
        }

        $plugins = [];
        if ( ! empty( $hook_extra['plugins'] ) && is_array( $hook_extra['plugins'] ) ) {
            $plugins = array_values( array_filter( $hook_extra['plugins'], 'is_string' ) );
        } elseif ( ! empty( $hook_extra['plugin'] ) && is_string( $hook_extra['plugin'] ) ) {
            $plugins = [ $hook_extra['plugin'] ];
        }

        foreach ( $plugins as $plugin ) {
            self::$pre_update_plugin_versions[ $plugin ] = self::plugin_current_version( $plugin );
        }

        return $response;
    }

    private static function plugin_old_version( string $plugin_file ): string {
        if ( isset( self::$pre_update_plugin_versions[ $plugin_file ] ) ) {
            return self::$pre_update_plugin_versions[ $plugin_file ];
        }

        $updates = get_site_transient( 'update_plugins' );
        if ( is_object( $updates ) && isset( $updates->checked ) && is_array( $updates->checked ) && isset( $updates->checked[ $plugin_file ] ) ) {
            return (string) $updates->checked[ $plugin_file ];
        }

        return '?';
    }

    private static function plugin_current_version( string $plugin_file ): string {
        if ( ! function_exists( 'get_plugin_data' ) ) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $full_path = WP_PLUGIN_DIR . '/' . $plugin_file;
        if ( file_exists( $full_path ) ) {
            $data = get_plugin_data( $full_path, false, false );
            if ( is_array( $data ) && ! empty( $data['Version'] ) ) {
                return (string) $data['Version'];
            }
        }

        return '?';
    }

    private static function post_meta_text( \WP_Post $post ): string {
        $parts = [
            'post_type=' . $post->post_type,
            'id=' . (string) $post->ID,
        ];

        if ( ! empty( $post->post_name ) ) {
            $parts[] = 'slug=' . $post->post_name;
        }

        $url = get_permalink( $post );
        if ( is_string( $url ) && '' !== $url ) {
            $parts[] = 'url=' . $url;
        }

        return implode( ', ', $parts );
    }

    private static function should_log_option_change( string $option ): bool {
        if ( 0 !== strpos( $option, 'madeit_security_' ) ) {
            return false;
        }

        $excluded = [
            'madeit_security_scan_state',
            'madeit_security_last_scan_completed',
            'madeit_security_last_db_scan',
            'madeit_security_vulnaudit_results',
            'madeit_security_vulnaudit_summary',
            'madeit_security_vulnaudit_last_run',
            'madeit_security_indexes_v3',
            'madeit_security_db_version',
            'madeit_security_installed_at',
            'madeit_security_recovery_token',
            'madeit_security_flush_rewrite_pending',
        ];

        return ! in_array( $option, $excluded, true );
    }

    /**
     * Convert option values to compact log-safe strings.
     *
     * @param mixed $value
     */
    private static function normalize_option_value( $value ): string {
        if ( is_bool( $value ) ) {
            return $value ? 'true' : 'false';
        }

        if ( is_scalar( $value ) || null === $value ) {
            $text = (string) $value;

            return self::truncate_text( $text, 120 );
        }

        $json = wp_json_encode( $value );
        if ( ! is_string( $json ) || '' === $json ) {
            return '[complex value]';
        }

        return self::truncate_text( $json, 120 );
    }

    private static function truncate_text( string $text, int $max ): string {
        $text = trim( preg_replace( '/\s+/', ' ', $text ) ?? '' );
        if ( '' === $text ) {
            return '[empty]';
        }

        if ( strlen( $text ) <= $max ) {
            return $text;
        }

        return substr( $text, 0, $max - 3 ) . '...';
    }
}

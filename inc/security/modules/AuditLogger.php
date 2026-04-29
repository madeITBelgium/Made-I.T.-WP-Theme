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

    public static function init(): void {
        if ( ! Settings::bool( 'madeit_security_audit_log_enabled', true ) ) {
            return;
        }

        // ── Plugin lifecycle ───────────────────────────────────────────────
        add_action( 'activated_plugin',   [ __CLASS__, 'on_plugin_activated' ], 10, 2 );
        add_action( 'deactivated_plugin', [ __CLASS__, 'on_plugin_deactivated' ] );
        add_action( 'deleted_plugin',     [ __CLASS__, 'on_plugin_deleted' ], 10, 2 );
        add_action( 'upgrader_process_complete', [ __CLASS__, 'on_upgrade_complete' ], 10, 2 );

        // ── Theme changes ──────────────────────────────────────────────────
        add_action( 'switch_theme', [ __CLASS__, 'on_theme_switch' ], 10, 3 );

        // ── User management ────────────────────────────────────────────────
        add_action( 'user_register',  [ __CLASS__, 'on_user_created' ] );
        add_action( 'delete_user',    [ __CLASS__, 'on_user_deleted' ], 10, 2 );
        add_action( 'set_user_role',  [ __CLASS__, 'on_role_changed' ], 10, 3 );

        // ── Content deletion (security-relevant, not edits) ────────────────
        add_action( 'before_delete_post', [ __CLASS__, 'on_post_deleted' ], 10, 2 );

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
                self::queue( 'plugin_updated', 'plugin', $plugin, sprintf( 'Plugin updated: %s', $name ) );
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
        self::queue( 'post_deleted', $post->post_type, (string) $post_id, sprintf( '%s deleted: "%s"', ucfirst( $post->post_type ), $post->post_title ) );
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
}

<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * wp-cron Abuse Detection
    * Execution frequency monitoring, unauthorized cron job detection,
    * flood protection, and automatic system cron migration helper.
    */
class CronGuard {

    /** WordPress core cron hooks that are always considered safe. */
    private const CORE_HOOKS = [
        'wp_version_check',
        'wp_update_plugins',
        'wp_update_themes',
        'wp_scheduled_delete',
        'wp_scheduled_auto_draft_delete',
        'delete_expired_transients',
        'wp_privacy_delete_old_export_files',
        'recovery_mode_clean_expired_keys',
    ];

    /** Minimum recurrence interval (seconds) before a hook is flagged. */
    private const MIN_INTERVAL = 300; // 5 minutes

    public static function init(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_cron_guard_enabled', true ) ) {
            return;
        }

        // Cron health check on admin page loads
        add_action( 'wp_loaded', [ __CLASS__, 'maybe_check_cron_health' ] );

        // wp-cron.php flood protection — run very early
        add_action( 'init', [ __CLASS__, 'detect_cron_flood' ], 1 );

        // AJAX handlers
        add_action( 'wp_ajax_madeit_security_get_cron_status',    [ __CLASS__, 'ajax_get_cron_status' ] );
        add_action( 'wp_ajax_madeit_security_approve_cron_hook',   [ __CLASS__, 'ajax_approve_cron_hook' ] );
        add_action( 'wp_ajax_madeit_security_remove_cron_hook',    [ __CLASS__, 'ajax_remove_cron_hook' ] );
        add_action( 'wp_ajax_madeit_security_save_cron_settings',  [ __CLASS__, 'ajax_save_cron_settings' ] );
    }

    // ── 1. Cron Monitoring ────────────────────────────────────────────────────

    /**
     * On admin page loads, perform periodic cron health checks.
        * Runs at most once every 5 minutes via a transient guard.
        */
    public static function maybe_check_cron_health(): void {
        if ( ! is_admin() || wp_doing_ajax() ) {
            return;
        }

        // Throttle: only check once every 5 minutes
        if ( get_transient( 'madeit_security_cron_check_lock' ) ) {
            return;
        }
        set_transient( 'madeit_security_cron_check_lock', 1, 300 );

        // Initialize the known hooks snapshot on first run
        self::maybe_initialize_snapshot();

        // Check for suspicious crons and log them
        $suspicious = self::get_suspicious_crons();

        if ( ! empty( $suspicious ) ) {
            self::log_suspicious_crons( $suspicious );
        }
    }

    /**
     * Tracks cron execution frequency using a transient-based counter.
        *
        * @return int  Current execution count within the window.
        */
    public static function track_cron_execution(): int {
        $key   = 'madeit_security_cron_exec_count';
        $count = (int) get_transient( $key );
        $count++;
        set_transient( $key, $count, 300 ); // 5-minute window
        return $count;
    }

    // ── 2. Unauthorized Cron Job Detection ────────────────────────────────────

    /**
     * Returns all scheduled cron events from WordPress.
        *
        * @return array  The raw cron array from _get_cron_array().
        */
    public static function get_registered_crons(): array {
        $crons = _get_cron_array();
        return is_array( $crons ) ? $crons : [];
    }

    /**
     * Returns the list of known WordPress core cron hooks.
        *
        * @return string[]
        */
    public static function get_known_cron_hooks(): array {
        return self::CORE_HOOKS;
    }

    /**
     * Identifies cron hooks that may be suspicious.
        *
        * A hook is flagged if it:
        *  - Is not a WordPress core hook
        *  - Is not in the approved/known hooks list
        *  - Has an unusually high frequency (recurrence < 5 minutes)
        *  - Was recently added (not present in the stored snapshot)
        *
        * @return array<int, array{hook: string, reasons: string[], schedule: string, interval: int, next_run: int}>
        */
    public static function get_suspicious_crons(): array {
        $crons         = self::get_registered_crons();
        $known         = self::get_approved_hooks();
        $snapshot      = self::get_hooks_snapshot();
        $suspicious    = [];
        $seen_hooks    = [];
    
        foreach ( $crons as $timestamp => $hooks ) {
            foreach ( $hooks as $hook => $events ) {
                // Skip duplicates — we only need to flag once per hook
                if ( isset( $seen_hooks[ $hook ] ) ) {
                    continue;
                }
                $seen_hooks[ $hook ] = true;
    
                // Core hooks are always safe
                if ( in_array( $hook, self::CORE_HOOKS, true ) ) {
                    continue;
                }
    
                // Approved hooks are safe
                if ( in_array( $hook, $known, true ) ) {
                    continue;
                }
    
                $reasons = [];
    
                // Check each scheduled event for this hook
                foreach ( $events as $key => $event ) {
                    $schedule = $event['schedule'] ?? false;
                    $interval = $event['interval'] ?? 0;
    
                    // High frequency check
                    if ( $interval > 0 && $interval < self::MIN_INTERVAL ) {
                        $reasons[] = sprintf(
                            'High frequency: every %d seconds (minimum recommended: %d)',
                            $interval,
                            self::MIN_INTERVAL
                        );
                    }
    
                    // Not in snapshot — recently added
                    if ( ! empty( $snapshot ) && ! in_array( $hook, $snapshot, true ) ) {
                        $reasons[] = 'Recently added (not in baseline snapshot)';
                    }
    
                    // Unknown origin — not core, not approved
                    if ( empty( $reasons ) ) {
                        $reasons[] = 'Unknown cron hook (not core, not approved)';
                    }
    
                    $suspicious[] = [
                        'hook'     => $hook,
                        'reasons'  => array_unique( $reasons ),
                        'schedule' => $schedule ?: 'single',
                        'interval' => (int) $interval,
                        'next_run' => (int) $timestamp,
                    ];
    
                    // Only report the first event per hook
                    break;
                }
            }
        }
    
        return $suspicious;
    }
    
    /**
     * Initializes the cron hooks snapshot on first run.
        */
    private static function maybe_initialize_snapshot(): void {
        $existing = \MadeIT\Security\Settings::get( 'madeit_security_known_cron_hooks', false );
        if ( $existing !== false ) {
            return;
        }
    
        // Take a snapshot of all currently registered hooks
        $hooks = self::extract_all_hook_names();
        update_option( 'madeit_security_known_cron_hooks', $hooks, false );
    }
    
    /**
     * Extracts all unique hook names from the cron array.
        *
        * @return string[]
        */
    private static function extract_all_hook_names(): array {
        $crons = self::get_registered_crons();
        $hooks = [];
    
        foreach ( $crons as $timestamp => $hook_list ) {
            foreach ( $hook_list as $hook => $events ) {
                $hooks[] = $hook;
            }
        }
    
        return array_unique( $hooks );
    }
    
    /**
     * Returns the stored snapshot of known cron hooks.
        *
        * @return string[]
        */
    private static function get_hooks_snapshot(): array {
        $snapshot = \MadeIT\Security\Settings::array( 'madeit_security_known_cron_hooks', [] );
        return is_array( $snapshot ) ? $snapshot : [];
    }
    
    /**
     * Returns the list of admin-approved cron hooks
        * (core hooks + any hooks the admin has explicitly approved).
        *
        * @return string[]
        */
    private static function get_approved_hooks(): array {
        $snapshot  = self::get_hooks_snapshot();
        $approved  = array_merge( self::CORE_HOOKS, $snapshot );
        return array_unique( $approved );
    }
    
    /**
     * Adds a hook to the known/approved list.
        *
        * @param string $hook  The cron hook name to approve.
        * @return bool
        */
    public static function approve_cron_hook( string $hook ): bool {
        $hook = sanitize_text_field( $hook );
        if ( $hook === '' ) {
            return false;
        }
    
        $snapshot = self::get_hooks_snapshot();
        if ( in_array( $hook, $snapshot, true ) ) {
            return true; // Already approved
        }
    
        $snapshot[] = $hook;
        return update_option( 'madeit_security_known_cron_hooks', $snapshot, false );
    }
    
    /**
     * Unschedules all events for a given cron hook.
        *
        * @param string $hook  The cron hook name to remove.
        * @return int  Number of unscheduled events.
        */
    public static function remove_cron_hook( string $hook ): int {
        $hook = sanitize_text_field( $hook );
        if ( $hook === '' ) {
            return 0;
        }
    
        // Prevent removal of WordPress core hooks
        if ( in_array( $hook, self::CORE_HOOKS, true ) ) {
            return 0;
        }
    
        $count = wp_clear_scheduled_hook( $hook );
    
        // Also remove from snapshot if present
        $snapshot = self::get_hooks_snapshot();
        $snapshot = array_values( array_diff( $snapshot, [ $hook ] ) );
        update_option( 'madeit_security_known_cron_hooks', $snapshot, false );
    
        return is_int( $count ) ? $count : 0;
    }
    
    // ── 3. wp-cron.php Flood Protection ───────────────────────────────────────
    
    /**
     * Detects excessive wp-cron.php requests from a single IP.
        * Hooked on `init` at priority 1.
        */
    public static function detect_cron_flood(): void {
        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            return;
        }
    
        // phpcs:ignore WordPress.Security.NonceVerification.Missing -- cron flood detection runs on every request
        $raw_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/';
        $uri     = strtok( $raw_uri, '?' );
    
        if ( ! str_ends_with( $uri, '/wp-cron.php' ) ) {
            return;
        }
    
        // Track execution count
        self::track_cron_execution();
    
        $ip        = \MadeIT\Security\RequestLogger::get_real_ip();
        $limit     = \MadeIT\Security\Settings::int( 'madeit_security_cron_rate_limit', 60 );
        $window    = 60; // 1 minute
        $key       = 'madeit_security_cron_flood_' . hash( 'sha256', $ip );
        $now       = time();
        $floor     = $now - $window;
    
        // Sliding window counter
        $hits = get_transient( $key ) ?: [];
        $hits = array_values( array_filter( $hits, fn( $t ) => $t > $floor ) );
        $hits[] = $now;
        set_transient( $key, $hits, $window + 10 );
    
        if ( count( $hits ) > $limit ) {
            self::block_cron_flood( $ip, count( $hits ), $limit );
        }
    }
    
    /**
     * Blocks a wp-cron.php flood and logs the event.
        *
        * @param string $ip     The offending IP address.
        * @param int    $count  Number of requests in the window.
        * @param int    $limit  The configured limit.
        */
    private static function block_cron_flood( string $ip, int $count, int $limit ): void {
        global $wpdb;
    
        // Log to events table
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'cron_flood',
                'severity'    => 'high',
                'ip'          => $ip,
                'user_id'     => 0,
                'url'         => home_url( '/wp-cron.php' ),
                'method'      => strtoupper( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) ) ), // phpcs:ignore WordPress.Security.NonceVerification.Missing
                'rule_id'     => 'cron_flood_protection',
                'description' => sprintf(
                    'wp-cron.php flood detected: %d requests/min from %s (limit: %d)',
                    $count,
                    $ip,
                    $limit
                ),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s' ]
        );
    
        if ( headers_sent() ) {
            return;
        }
    
        http_response_code( 429 );
        header( 'Retry-After: 60' );
        header( 'Content-Type: text/plain; charset=utf-8' );
        echo 'Rate limit exceeded for wp-cron.php requests.';
        exit;
    }
    
    // ── 4. System Cron Migration Helper ───────────────────────────────────────
    
    /**
     * Checks whether DISABLE_WP_CRON is defined and true.
        *
        * @return bool
        */
    public static function get_system_cron_status(): bool {
        return defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON;
    }
    
    /**
     * Generates recommended system crontab entries.
        *
        * @return array{wget: string, wp_cli: string}
        */
    public static function get_system_cron_command(): array {
        $site_url = site_url();
        $abspath  = rtrim( ABSPATH, '/\\' );
    
        return [
            'wget'   => sprintf(
                '*/5 * * * * wget -q -O /dev/null %s/wp-cron.php?doing_wp_cron >/dev/null 2>&1',
                esc_url_raw( $site_url )
            ),
            'wp_cli' => sprintf(
                '*/5 * * * * cd %s && wp cron event run --due-now >/dev/null 2>&1',
                $abspath
            ),
        ];
    }
    
    /**
     * Returns comprehensive cron health information.
        *
        * @return array{
        *     disable_wp_cron: bool,
        *     total_events: int,
        *     next_event_time: int|null,
        *     next_event_hook: string|null,
        *     has_overdue: bool,
        *     overdue_count: int,
        *     cron_running: bool,
        *     last_run: int|null
        * }
        */
    public static function get_cron_health(): array {
        $crons      = self::get_registered_crons();
        $now        = time();
        $next_time  = null;
        $next_hook  = null;
        $overdue    = 0;
        $total      = 0;
    
        foreach ( $crons as $timestamp => $hooks ) {
            foreach ( $hooks as $hook => $events ) {
                foreach ( $events as $event ) {
                    $total++;
    
                    if ( $next_time === null || $timestamp < $next_time ) {
                        $next_time = (int) $timestamp;
                        $next_hook = $hook;
                    }
    
                    if ( (int) $timestamp < $now ) {
                        $overdue++;
                    }
                }
            }
        }
    
        // Check if cron is currently running
        $doing_cron = get_transient( 'doing_cron' );
        $last_run   = $doing_cron ? (int) $doing_cron : null;
    
        return [
            'disable_wp_cron' => self::get_system_cron_status(),
            'total_events'    => $total,
            'next_event_time' => $next_time,
            'next_event_hook' => $next_hook,
            'has_overdue'     => $overdue > 0,
            'overdue_count'   => $overdue,
            'cron_running'    => $doing_cron !== false,
            'last_run'        => $last_run,
        ];
    }
    
    // ── 5. Cron Analytics ─────────────────────────────────────────────────────
    
    /**
     * Returns a detailed cron summary for analytics.
        *
        * @return array{
        *     total_hooks: int,
        *     total_events: int,
        *     by_schedule: array<string, int>,
        *     by_plugin: array<string, string[]>,
        *     overdue: array<int, array{hook: string, scheduled: int, overdue_by: int}>,
        *     suspicious: array
        * }
        */
    public static function get_cron_summary(): array {
        $crons        = self::get_registered_crons();
        $now          = time();
        $hooks_seen   = [];
        $total_events = 0;
        $by_schedule  = [];
        $by_plugin    = [];
        $overdue      = [];
    
        foreach ( $crons as $timestamp => $hooks ) {
            foreach ( $hooks as $hook => $events ) {
                $hooks_seen[ $hook ] = true;
    
                foreach ( $events as $event ) {
                    $total_events++;
    
                    // Group by schedule
                    $schedule = $event['schedule'] ?? 'single';
                    if ( ! isset( $by_schedule[ $schedule ] ) ) {
                        $by_schedule[ $schedule ] = 0;
                    }
                    $by_schedule[ $schedule ]++;
    
                    // Group by plugin (detected from hook prefix)
                    $plugin = self::detect_plugin_from_hook( $hook );
                    if ( ! isset( $by_plugin[ $plugin ] ) ) {
                        $by_plugin[ $plugin ] = [];
                    }
                    if ( ! in_array( $hook, $by_plugin[ $plugin ], true ) ) {
                        $by_plugin[ $plugin ][] = $hook;
                    }
    
                    // Overdue check
                    if ( (int) $timestamp < $now ) {
                        $overdue[] = [
                            'hook'       => $hook,
                            'scheduled'  => (int) $timestamp,
                            'overdue_by' => $now - (int) $timestamp,
                        ];
                    }
                }
            }
        }
    
        return [
            'total_hooks'  => count( $hooks_seen ),
            'total_events' => $total_events,
            'by_schedule'  => $by_schedule,
            'by_plugin'    => $by_plugin,
            'overdue'      => $overdue,
            'suspicious'   => self::get_suspicious_crons(),
        ];
    }
    
    /**
     * Attempts to detect which plugin a cron hook belongs to based on its prefix.
        *
        * @param string $hook  The cron hook name.
        * @return string  Plugin name or 'wordpress' for core, 'unknown' otherwise.
        */
    private static function detect_plugin_from_hook( string $hook ): string {
        // WordPress core
        if ( in_array( $hook, self::CORE_HOOKS, true ) || str_starts_with( $hook, 'wp_' ) ) {
            return 'wordpress';
        }
    
        // Security
        if ( str_starts_with( $hook, 'madeit_security_' ) ) {
            return 'madeit';
        }
    
        // WooCommerce
        if ( str_starts_with( $hook, 'wc_' ) || str_starts_with( $hook, 'woocommerce_' ) ) {
            return 'woocommerce';
        }
    
        // Yoast SEO
        if ( str_starts_with( $hook, 'wpseo_' ) ) {
            return 'yoast-seo';
        }
    
        // Akismet
        if ( str_starts_with( $hook, 'akismet_' ) ) {
            return 'akismet';
        }
    
        // Jetpack
        if ( str_starts_with( $hook, 'jetpack_' ) ) {
            return 'jetpack';
        }
    
        // WP Rocket
        if ( str_starts_with( $hook, 'rocket_' ) ) {
            return 'wp-rocket';
        }
    
        // UpdraftPlus
        if ( str_starts_with( $hook, 'updraft_' ) || str_starts_with( $hook, 'updraftplus_' ) ) {
            return 'updraftplus';
        }
    
        // Try to extract a prefix before the first underscore
        $parts = explode( '_', $hook, 2 );
        if ( count( $parts ) === 2 && strlen( $parts[0] ) >= 2 ) {
            return $parts[0];
        }
    
        return 'unknown';
    }
    
    // ── 6. AJAX Handlers ──────────────────────────────────────────────────────
    
    /**
     * AJAX: Returns full cron health, registered events, and suspicious flags.
        */
    public static function ajax_get_cron_status(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
    
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }
    
        $health     = self::get_cron_health();
        $summary    = self::get_cron_summary();
        $suspicious = self::get_suspicious_crons();
        $commands   = self::get_system_cron_command();
    
        // Build a flat list of all registered events for the UI
        $events = [];
        $crons  = self::get_registered_crons();
        foreach ( $crons as $timestamp => $hooks ) {
            foreach ( $hooks as $hook => $hook_events ) {
                foreach ( $hook_events as $key => $event ) {
                    $events[] = [
                        'hook'      => $hook,
                        'next_run'  => (int) $timestamp,
                        'schedule'  => $event['schedule'] ?? 'single',
                        'interval'  => $event['interval'] ?? 0,
                        'args'      => $event['args'] ?? [],
                        'is_core'   => in_array( $hook, self::CORE_HOOKS, true ),
                        'plugin'    => self::detect_plugin_from_hook( $hook ),
                    ];
                }
            }
        }
    
        wp_send_json_success( [
            'health'              => $health,
            'summary'             => $summary,
            'events'              => $events,
            'suspicious'          => $suspicious,
            'system_cron_commands' => $commands,
            'settings'            => [
                'enabled'    => \MadeIT\Security\Settings::bool( 'madeit_security_cron_guard_enabled', true ),
                'rate_limit' => \MadeIT\Security\Settings::int( 'madeit_security_cron_rate_limit', 60 ),
            ],
        ] );
    }
    
    /**
     * AJAX: Adds a hook to the known/approved list.
        * POST: nonce, hook
        */
    public static function ajax_approve_cron_hook(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
    
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }
    
        $hook = isset( $_POST['hook'] ) ? sanitize_text_field( wp_unslash( $_POST['hook'] ) ) : '';
    
        if ( $hook === '' ) {
            wp_send_json_error( [ 'message' => 'Hook name is required.' ] );
        }
    
        $result = self::approve_cron_hook( $hook );
    
        // Audit log
        self::audit(
            'cron_hook_approved',
            'cron',
            $hook,
            sprintf( 'Cron hook approved: %s', $hook )
        );
    
        wp_send_json_success( [
            'message'    => sprintf( 'Cron hook "%s" has been approved.', $hook ),
            'hook'       => $hook,
            'suspicious' => self::get_suspicious_crons(),
        ] );
    }
    
    /**
     * AJAX: Unschedules a cron hook.
        * POST: nonce, hook, confirm (must be '1' or 'yes')
        */
    public static function ajax_remove_cron_hook(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
    
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }
    
        $hook    = isset( $_POST['hook'] )    ? sanitize_text_field( wp_unslash( $_POST['hook'] ) )    : '';
        $confirm = isset( $_POST['confirm'] ) ? sanitize_text_field( wp_unslash( $_POST['confirm'] ) ) : '';
    
        if ( $hook === '' ) {
            wp_send_json_error( [ 'message' => 'Hook name is required.' ] );
        }
    
        if ( ! in_array( $confirm, [ '1', 'yes' ], true ) ) {
            wp_send_json_error( [ 'message' => 'Confirmation is required to remove a cron hook.' ] );
        }
    
        if ( in_array( $hook, self::CORE_HOOKS, true ) ) {
            wp_send_json_error( [ 'message' => 'Cannot remove WordPress core cron hooks.' ] );
        }
    
        $removed = self::remove_cron_hook( $hook );
    
        // Audit log
        self::audit(
            'cron_hook_removed',
            'cron',
            $hook,
            sprintf( 'Cron hook unscheduled: %s (%d events removed)', $hook, $removed )
        );
    
        wp_send_json_success( [
            'message' => sprintf( 'Cron hook "%s" has been unscheduled (%d events removed).', $hook, $removed ),
            'hook'    => $hook,
            'removed' => $removed,
            'events'  => self::get_registered_crons(),
        ] );
    }
    
    /**
     * AJAX: Saves cron guard settings.
        * POST: nonce, enabled, rate_limit
        */
    public static function ajax_save_cron_settings(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
    
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }
    
        // Enabled toggle
        if ( isset( $_POST['enabled'] ) ) {
            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- boolean value handled with filter_var
            $enabled = filter_var( wp_unslash( $_POST['enabled'] ), FILTER_VALIDATE_BOOLEAN );
            update_option( 'madeit_security_cron_guard_enabled', $enabled );
        }
    
        // Rate limit
        if ( isset( $_POST['rate_limit'] ) ) {
            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- integer cast
            $rate_limit = (int) $_POST['rate_limit'];
            // Enforce sane bounds: 10–600
            $rate_limit = max( 10, min( 600, $rate_limit ) );
            update_option( 'madeit_security_cron_rate_limit', $rate_limit );
        }
    
        // Audit log
        self::audit(
            'cron_settings_updated',
            'settings',
            'cron_guard',
            sprintf(
                'Cron guard settings updated. Enabled: %s, Rate limit: %d/min',
                \MadeIT\Security\Settings::bool( 'madeit_security_cron_guard_enabled', true ) ? 'yes' : 'no',
                \MadeIT\Security\Settings::int( 'madeit_security_cron_rate_limit', 60 )
            )
        );
    
        wp_send_json_success( [
            'message'  => 'Cron guard settings saved.',
            'settings' => [
                'enabled'    => \MadeIT\Security\Settings::bool( 'madeit_security_cron_guard_enabled', true ),
                'rate_limit' => \MadeIT\Security\Settings::int( 'madeit_security_cron_rate_limit', 60 ),
            ],
        ] );
    }
    
    // ── 7. Notifications — Security Event Logging ─────────────────────────────
    
    /**
     * Logs suspicious cron hooks to the events table.
        *
        * @param array $suspicious  List of suspicious cron entries from get_suspicious_crons().
        */
    private static function log_suspicious_crons( array $suspicious ): void {
        global $wpdb;
    
        // Avoid duplicate alerts: check if we already logged these hooks recently
        $logged_key = 'madeit_security_cron_alert_logged';
        $logged     = get_transient( $logged_key ) ?: [];
    
        foreach ( $suspicious as $entry ) {
            $hook = $entry['hook'];
    
            // Skip if already logged within the last hour
            if ( in_array( $hook, $logged, true ) ) {
                continue;
            }
    
            $schedule    = $entry['schedule'];
            $reasons_str = implode( '; ', $entry['reasons'] );
    
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
            $wpdb->insert(
                $wpdb->prefix . 'madeit_security_events',
                [
                    'event_type'  => 'suspicious_cron',
                    'severity'    => 'medium',
                    'ip'          => '',
                    'user_id'     => 0,
                    'url'         => '',
                    'method'      => '',
                    'rule_id'     => 'cron_guard',
                    'description' => sprintf(
                        'Suspicious cron hook detected: %s (schedule: %s). Reasons: %s',
                        $hook,
                        $schedule,
                        $reasons_str
                    ),
                    'created_at'  => current_time( 'mysql' ),
                ],
                [ '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s' ]
            );
    
            $logged[] = $hook;
        }
    
        // Cache the logged hooks for 1 hour to prevent duplicate alerts
        set_transient( $logged_key, $logged, HOUR_IN_SECONDS );
    }
    
    // ── Private Helpers ───────────────────────────────────────────────────────
    
    /**
     * Generic audit log helper — mirrors the pattern used across all modules.
        *
        * @param string $action    Action identifier.
        * @param string $obj_type  Object type.
        * @param string $obj_id    Object identifier.
        * @param string $desc      Human-readable description.
        */
    private static function audit( string $action, string $obj_type, string $obj_id, string $desc ): void {
        global $wpdb;
    
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_audit_log',
            [
                'user_id'     => get_current_user_id(),
                'username'    => wp_get_current_user()->user_login,
                'action'      => $action,
                'object_type' => $obj_type,
                'object_id'   => $obj_id,
                'description' => $desc,
                'ip'          => \MadeIT\Security\RequestLogger::get_real_ip(),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
    }
}
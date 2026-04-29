<?php
namespace MadeIT\Security;

defined( 'ABSPATH' ) || exit;

/**
 * Handles plugin installation, upgrades, and uninstall.
 */
class Installer {

    // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
    public static function install(): void {
        global $wpdb;
        $charset = $wpdb->get_charset_collate();

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        // ── 1. Visitor / Request Log ──────────────────────────────────────────
        dbDelta( "CREATE TABLE {$wpdb->prefix}madeit_security_visitor_log (
            id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            ip          VARCHAR(45)     NOT NULL,
            ip_long     BIGINT          NOT NULL DEFAULT 0,
            country     VARCHAR(2)      NOT NULL DEFAULT '',
            city        VARCHAR(100)    NOT NULL DEFAULT '',
            method      VARCHAR(10)     NOT NULL DEFAULT 'GET',
            url         TEXT            NOT NULL,
            referer     TEXT            NOT NULL,
            user_agent  TEXT            NOT NULL,
            ua_family   VARCHAR(80)     NOT NULL DEFAULT '',
            os_family   VARCHAR(80)     NOT NULL DEFAULT '',
            user_id     BIGINT UNSIGNED NOT NULL DEFAULT 0,
            username    VARCHAR(60)     NOT NULL DEFAULT '',
            status_code SMALLINT        NOT NULL DEFAULT 200,
            is_bot      TINYINT(1)      NOT NULL DEFAULT 0,
            bot_score   TINYINT UNSIGNED NOT NULL DEFAULT 0,
            is_blocked  TINYINT(1)      NOT NULL DEFAULT 0,
            block_reason VARCHAR(120)   NOT NULL DEFAULT '',
            page_title  VARCHAR(255)    NOT NULL DEFAULT '',
            post_id     BIGINT UNSIGNED NOT NULL DEFAULT 0,
            created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY ip       (ip),
            KEY ip_long  (ip_long),
            KEY created_at (created_at),
            KEY idx_created_ip (created_at, ip),
            KEY idx_post_created (post_id, created_at),
            KEY is_bot   (is_bot),
            KEY is_blocked (is_blocked),
            KEY user_id  (user_id)
        ) $charset;" );

        // ── 2. Blocked IPs ────────────────────────────────────────────────────
        dbDelta( "CREATE TABLE {$wpdb->prefix}madeit_security_blocked_ips (
            id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            ip          VARCHAR(45)     NOT NULL,
            ip_range    VARCHAR(50)     NOT NULL DEFAULT '',
            reason      VARCHAR(255)    NOT NULL DEFAULT 'Manually blocked',
            rule_id     VARCHAR(40)     NOT NULL DEFAULT '',
            request_count INT UNSIGNED  NOT NULL DEFAULT 0,
            permanent   TINYINT(1)      NOT NULL DEFAULT 0,
            blocked_until DATETIME      NULL,
            created_by  BIGINT UNSIGNED NOT NULL DEFAULT 0,
            created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY ip (ip),
            KEY permanent (permanent),
            KEY blocked_until (blocked_until)
        ) $charset;" );

        // ── 3. Whitelist ──────────────────────────────────────────────────────
        dbDelta( "CREATE TABLE {$wpdb->prefix}madeit_security_whitelist (
            id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            type        VARCHAR(20)     NOT NULL DEFAULT 'ip',
            value       VARCHAR(255)    NOT NULL,
            label       VARCHAR(100)    NOT NULL DEFAULT '',
            created_by  BIGINT UNSIGNED NOT NULL DEFAULT 0,
            created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY type_value (type, value(50))
        ) $charset;" );

        // ── 4. Login Attempts ─────────────────────────────────────────────────
        dbDelta( "CREATE TABLE {$wpdb->prefix}madeit_security_login_attempts (
            id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            ip            VARCHAR(45)     NOT NULL,
            username_hash VARCHAR(64)     NOT NULL DEFAULT '',
            attempt_count INT UNSIGNED    NOT NULL DEFAULT 1,
            last_attempt  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            locked_until  DATETIME        NULL,
            PRIMARY KEY (id),
            UNIQUE KEY ip (ip),
            KEY locked_until (locked_until)
        ) $charset;" );

        // ── 5. Security Events ────────────────────────────────────────────────
        dbDelta( "CREATE TABLE {$wpdb->prefix}madeit_security_events (
            id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            event_type   VARCHAR(50)     NOT NULL,
            severity     VARCHAR(10)     NOT NULL DEFAULT 'medium',
            ip           VARCHAR(45)     NOT NULL DEFAULT '',
            user_id      BIGINT UNSIGNED NOT NULL DEFAULT 0,
            url          TEXT            NOT NULL,
            method       VARCHAR(10)     NOT NULL DEFAULT '',
            rule_id      VARCHAR(40)     NOT NULL DEFAULT '',
            description  TEXT            NOT NULL,
            country      VARCHAR(2)      NOT NULL DEFAULT '',
            created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY event_type (event_type),
            KEY severity   (severity),
            KEY ip         (ip),
            KEY created_at (created_at)
        ) $charset;" );

        // ── 6. Audit Log ──────────────────────────────────────────────────────
        dbDelta( "CREATE TABLE {$wpdb->prefix}madeit_security_audit_log (
            id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id     BIGINT UNSIGNED NOT NULL DEFAULT 0,
            username    VARCHAR(60)     NOT NULL DEFAULT '',
            action      VARCHAR(80)     NOT NULL,
            object_type VARCHAR(40)     NOT NULL DEFAULT '',
            object_id   VARCHAR(80)     NOT NULL DEFAULT '',
            description TEXT            NOT NULL,
            ip          VARCHAR(45)     NOT NULL DEFAULT '',
            created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id    (user_id),
            KEY action     (action),
            KEY created_at (created_at)
        ) $charset;" );

        // ── 7. Outbound Request Log ─────────────────────────────────────────
        dbDelta( "CREATE TABLE {$wpdb->prefix}madeit_security_outbound_log (
            id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            url           TEXT            NOT NULL,
            domain        VARCHAR(255)    NOT NULL DEFAULT '',
            method        VARCHAR(10)     NOT NULL DEFAULT 'GET',
            caller        VARCHAR(120)    NOT NULL DEFAULT '',
            status        VARCHAR(20)     NOT NULL DEFAULT 'allowed',
            blocked       TINYINT(1)      NOT NULL DEFAULT 0,
            response_code SMALLINT        NOT NULL DEFAULT 0,
            created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY domain     (domain(50)),
            KEY status     (status),
            KEY created_at (created_at)
        ) $charset;" );

        // Migrate old wp_options outbound log to table (one-time).
        $old_log = get_option( 'madeit_security_outbound_log' );
        if ( is_array( $old_log ) && ! empty( $old_log ) ) {
            foreach ( array_slice( $old_log, -100 ) as $entry ) {
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
                $wpdb->insert(
                    $wpdb->prefix . 'madeit_security_outbound_log',
                    [
                        'url'           => $entry['url'] ?? '',
                        'domain'        => $entry['domain'] ?? '',
                        'method'        => $entry['method'] ?? 'GET',
                        'caller'        => $entry['caller'] ?? '',
                        'status'        => $entry['status'] ?? 'allowed',
                        'blocked'       => ! empty( $entry['blocked'] ) ? 1 : 0,
                        'response_code' => (int) ( $entry['response_code'] ?? 0 ),
                        'created_at'    => $entry['timestamp'] ?? current_time( 'mysql' ),
                    ],
                    [ '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%s' ]
                );
            }
            delete_option( 'madeit_security_outbound_log' );
        }

        // Detect: is this a genuine first install or a reactivation/upgrade?
        $is_fresh = ( get_option( 'madeit_security_installed_at' ) === false );

        update_option( 'madeit_security_db_version', MADEIT_SECURITY_DB_VERSION );
        if ( $is_fresh ) {
            update_option( 'madeit_security_installed_at', current_time( 'mysql' ) );
        }

        // ── Safety: prevent admin lockout ────────────────────────────────
        // On fresh install: clear auto-blocks and set WAF to log mode.
        // On reactivation: only unblock the activating admin's own IP.
        if ( $is_fresh ) {
            $wpdb->query(
                "DELETE FROM {$wpdb->prefix}madeit_security_blocked_ips WHERE rule_id != 'manual'"
            );
            update_option( 'madeit_security_waf_mode', 'log' );
        }
        // Always unblock the activating admin's own IP (safety net).
        $activating_ip = \MadeIT\Security\RequestLogger::get_real_ip();
        if ( $activating_ip ) {
            $wpdb->delete(
                $wpdb->prefix . 'madeit_security_blocked_ips',
                [ 'ip' => $activating_ip ],
                [ '%s' ]
            );
        }

        // Schedule cron jobs
        if ( ! wp_next_scheduled( 'madeit_security_cleanup_logs' ) ) {
            wp_schedule_event( time(), 'hourly', 'madeit_security_cleanup_logs' );
        }
        if ( ! wp_next_scheduled( 'madeit_security_update_blocked_counts' ) ) {
            wp_schedule_event( time(), 'madeit_security_5min', 'madeit_security_update_blocked_counts' );
        }
        if ( ! wp_next_scheduled( 'madeit_security_refresh_cloudflare_ips' ) ) {
            wp_schedule_event( time(), 'weekly', 'madeit_security_refresh_cloudflare_ips' );
        }
        if ( ! wp_next_scheduled( 'madeit_security_refresh_google_ips' ) ) {
            wp_schedule_event( time(), 'weekly', 'madeit_security_refresh_google_ips' );
        }
        if ( ! wp_next_scheduled( 'madeit_security_refresh_microsoft_ips' ) ) {
            wp_schedule_event( time(), 'weekly', 'madeit_security_refresh_microsoft_ips' );
        }
        if ( ! wp_next_scheduled( 'madeit_security_update_geoip_db' ) ) {
            wp_schedule_event( time(), 'weekly', 'madeit_security_update_geoip_db' );
        }
        if ( ! wp_next_scheduled( 'madeit_security_weekly_scan' ) ) {
            wp_schedule_event( time(), 'weekly', 'madeit_security_weekly_scan' );
        }
    }
    // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

    public static function deactivate(): void {
        wp_clear_scheduled_hook( 'madeit_security_cleanup_logs' );
        wp_clear_scheduled_hook( 'madeit_security_update_blocked_counts' );
        wp_clear_scheduled_hook( 'madeit_security_refresh_cloudflare_ips' );
        wp_clear_scheduled_hook( 'madeit_security_refresh_google_ips' );
        wp_clear_scheduled_hook( 'madeit_security_refresh_microsoft_ips' );
        wp_clear_scheduled_hook( 'madeit_security_update_geoip_db' );
        wp_clear_scheduled_hook( 'madeit_security_weekly_scan' );
        wp_clear_scheduled_hook( 'madeit_security_run_scan_batch' );
        wp_clear_scheduled_hook( 'madeit_security_daily_digest' );
    }

    public static function default_settings(): array {
        return Settings::defaults();
    }

    /**
     * Made I.T. Security Recommended Settings — opinionated production-ready preset.
     *
     * These override the conservative defaults with more aggressive
     * security settings suitable for most WordPress sites.
     *
     * @return array<string, mixed>
     */
    public static function recommended_settings(): array {
        return [
            'madeit_security_waf_mode'                => 'tarpit',
            'madeit_security_honeypot_enabled'        => true,
            'madeit_security_password_policy_enabled' => true,
            'madeit_security_hsts_enabled'            => true,
            'madeit_security_csp_enabled'             => true,
            'madeit_security_remove_server'           => true,
            'madeit_security_session_idle_timeout'    => 0,
            'madeit_security_session_exempt_admins'   => true,
            'madeit_security_block_ai_crawlers'       => true,
        ];
    }

    /**
     * Per-crawler block rules for the recommended preset.
     *
     * @return array<string, string>
     */
    public static function recommended_crawler_rules(): array {
        return [
            'gptbot'            => 'block',
            'chatgpt_user'      => 'block',
            'google_extended'   => 'block',
            'claudebot'         => 'block',
            'claude_web'        => 'block',
            'anthropic'         => 'block',
            'perplexitybot'     => 'block',
            'amazonbot'         => 'block',
            'applebot_extended' => 'block',
        ];
    }

    /**
     * Apply the recommended settings preset.
     *
     * Sets all recommended options, configures AI crawler blocking rules,
     * and whitelists the current admin IP.
     *
     * @return string[] List of options/actions applied.
     */
    public static function apply_recommended(): array {
        $applied = [];

        // 1. Apply scalar settings.
        foreach ( self::recommended_settings() as $key => $value ) {
            update_option( $key, $value );
            $applied[] = $key;
        }

        // 2. Apply AI crawler per-crawler rules (merge with existing).
        $current_rules = \MadeIT\Security\modules\AICrawlers::get_crawler_rules();
        $recommended   = self::recommended_crawler_rules();
        $merged        = array_merge( $current_rules, $recommended );
        \MadeIT\Security\modules\AICrawlers::save_crawler_rules( $merged );
        $applied[] = 'madeit_security_ai_crawler_rules';

        // 3. Whitelist current admin IP.
        $ip    = \MadeIT\Security\RequestLogger::get_real_ip();
        $label = 'Recommended settings';
        \MadeIT\Security\Whitelist::add( $ip, $label );
        $applied[] = 'whitelist_ip';

        return $applied;
    }
}
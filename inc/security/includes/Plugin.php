<?php

namespace MadeIT\Security;

defined('ABSPATH') || exit;

/**
 * Core plugin class. Singleton.
 */
class Plugin
{
    private static ?self $instance = null;

    public static function get_instance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct()
    {
    }

    public function boot(): void
    {
        // Register custom cron interval
        add_filter('cron_schedules', [$this, 'add_cron_intervals']);

        // Flush rewrite rules if pending (after custom login URL slug change)
        add_action('init', function () {
            if (Settings::bool('madeit_security_flush_rewrite_pending', false)) {
                delete_option('madeit_security_flush_rewrite_pending');
                flush_rewrite_rules();
            }
        }, 20);

        // Boot modules
        $this->boot_modules();

        // Admin
        if (is_admin()) {
            require_once MADEIT_SECURITY_DIR.'admin/Admin.php';
            Admin\Admin::get_instance()->boot();

            // Anti-lockout: refresh admin grace cookie on every admin page load.
            // This cookie proves the browser was recently used by an admin —
            // if their session expires, CustomLoginURL lets them through to wp-login.php.
            add_action('admin_init', function () {
                if (current_user_can('manage_options')) {
                    modules\CustomLoginURL::set_admin_grace_cookie();
                }
            });
        }

        // Cron hooks
        add_action('madeit_security_cleanup_logs', [$this, 'cleanup_logs']);
        add_action('madeit_security_update_blocked_counts', [$this, 'update_blocked_counts']);
        // IP-range refreshes only run when the matching integration is enabled —
        // avoids unnecessary outbound requests to Cloudflare / Google / Microsoft
        // for sites that never turned the integrations on.
        add_action('madeit_security_refresh_cloudflare_ips', function () {
            if (Settings::bool('madeit_security_cloudflare_integration', false)) {
                Whitelist::refresh_cloudflare_ranges();
            }
        });
        add_action('madeit_security_refresh_google_ips', function () {
            if (Settings::bool('madeit_security_google_integration', false)) {
                Whitelist::refresh_google_ranges();
            }
        });
        add_action('madeit_security_refresh_microsoft_ips', function () {
            if (Settings::bool('madeit_security_microsoft_integration', false)) {
                Whitelist::refresh_microsoft_ranges();
            }
        });
        add_action('madeit_security_update_geoip_db', [GeoIP::class, 'cron_update']);
    }

    public function add_cron_intervals(array $schedules): array
    {
        $schedules['madeit_security_5min'] = [
            'interval' => 300,
            'display'  => 'Every 5 Minutes (Security)',
        ];
        // WordPress core does not ship a `weekly` interval — if another plugin
        // already registered it we keep theirs, otherwise install our own so
        // `wp_schedule_event( ..., 'weekly', ... )` actually fires.
        if (!isset($schedules['weekly'])) {
            $schedules['weekly'] = [
                'interval' => WEEK_IN_SECONDS,
                'display'  => 'Once Weekly',
            ];
        }

        return $schedules;
    }

    private function boot_modules(): void
    {
        require_once MADEIT_SECURITY_DIR.'modules/CustomLoginURL.php';
        require_once MADEIT_SECURITY_DIR.'includes/Whitelist.php';
        require_once MADEIT_SECURITY_DIR.'modules/LoginProtection.php';
        require_once MADEIT_SECURITY_DIR.'modules/Hardening.php';
        require_once MADEIT_SECURITY_DIR.'modules/IPManager.php';
        require_once MADEIT_SECURITY_DIR.'modules/WAF.php';
        require_once MADEIT_SECURITY_DIR.'modules/RateLimiter.php';
        require_once MADEIT_SECURITY_DIR.'modules/Notifications.php';
        require_once MADEIT_SECURITY_DIR.'modules/Scanner.php';
        require_once MADEIT_SECURITY_DIR.'modules/PostBreach.php';
        require_once MADEIT_SECURITY_DIR.'modules/SecurityHeaders.php';
        require_once MADEIT_SECURITY_DIR.'modules/Honeypot.php';
        require_once MADEIT_SECURITY_DIR.'modules/AICrawlers.php';
        require_once MADEIT_SECURITY_DIR.'modules/RestApiPolicy.php';
        require_once MADEIT_SECURITY_DIR.'modules/SessionSecurity.php';
        require_once MADEIT_SECURITY_DIR.'modules/OutboundMonitor.php';
        require_once MADEIT_SECURITY_DIR.'modules/CronGuard.php';
        require_once MADEIT_SECURITY_DIR.'modules/TwoFA.php';
        require_once MADEIT_SECURITY_DIR.'modules/PasswordPolicy.php';
        require_once MADEIT_SECURITY_DIR.'modules/VulnAudit.php';
        require_once MADEIT_SECURITY_DIR.'modules/AuditLogger.php';
        require_once MADEIT_SECURITY_DIR.'modules/Captcha.php';
        require_once MADEIT_SECURITY_DIR.'includes/lib/MaxMindReader.php';
        require_once MADEIT_SECURITY_DIR.'includes/GeoIP.php';

        modules\CustomLoginURL::init();
        modules\LoginProtection::init();
        modules\Hardening::init();
        modules\IPManager::init();
        modules\WAF::init();
        modules\RateLimiter::init();
        modules\Notifications::init();
        modules\Scanner::init();
        modules\PostBreach::init();
        modules\PostBreach::enforce_password_reset();
        modules\PostBreach::enforce_lockdown();
        modules\SecurityHeaders::init();
        modules\Honeypot::init();
        modules\AICrawlers::init();
        modules\RestApiPolicy::init();
        modules\SessionSecurity::init();
        modules\OutboundMonitor::init();
        modules\CronGuard::init();
        modules\TwoFA::init();
        modules\PasswordPolicy::init();
        modules\VulnAudit::init();
        modules\AuditLogger::init();
        modules\Captcha::init();

        // Whitelist AJAX
        add_action('wp_ajax_madeit_security_add_whitelist', [$this, 'ajax_add_whitelist']);
        add_action('wp_ajax_madeit_security_remove_whitelist', [$this, 'ajax_remove_whitelist']);
        add_action('wp_ajax_madeit_security_get_whitelist', [$this, 'ajax_get_whitelist']);
        add_action('wp_ajax_madeit_security_whitelist_my_ip', [$this, 'ajax_whitelist_my_ip']);
        add_action('wp_ajax_madeit_security_save_login_url', ['MadeIT\Security\\modules\\CustomLoginURL', 'ajax_save']);
        add_action('wp_ajax_madeit_security_regenerate_login_url', ['MadeIT\Security\\modules\\CustomLoginURL', 'ajax_regenerate']);

        // GeoIP AJAX
        add_action('wp_ajax_madeit_security_download_geoip', ['MadeIT\Security\\GeoIP', 'ajax_download']);
        add_action('wp_ajax_madeit_security_test_geoip', ['MadeIT\Security\\GeoIP', 'ajax_test_lookup']);

        // WAF AJAX
        add_action('wp_ajax_madeit_security_waf_toggle_rule', [$this, 'ajax_waf_toggle_rule']);
    }

    // ── Whitelist AJAX handlers ────────────────────────────────────────────────
    public function ajax_add_whitelist(): void
    {
        check_ajax_referer('madeit_security_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error([], 403);
        }

        $ip = isset($_POST['ip']) ? sanitize_text_field(wp_unslash($_POST['ip'])) : '';
        $label = isset($_POST['label']) ? sanitize_text_field(wp_unslash($_POST['label'])) : '';

        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            wp_send_json_error(['message' => 'Invalid IP address.']);
        }

        $ok = \MadeIT\Security\Whitelist::add($ip, $label);
        if ($ok) {
            wp_send_json_success([
                'message'   => "$ip added to whitelist.",
                'whitelist' => \MadeIT\Security\Whitelist::get_all(),
            ]);
        } else {
            wp_send_json_error(['message' => 'Could not add IP — it may already be whitelisted.']);
        }
    }

    public function ajax_remove_whitelist(): void
    {
        check_ajax_referer('madeit_security_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error([], 403);
        }

        $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
        if (!$id) {
            wp_send_json_error(['message' => 'Invalid ID.']);
        }

        $ok = \MadeIT\Security\Whitelist::remove($id);
        wp_send_json_success([
            'message'   => $ok ? 'Removed from whitelist.' : 'Entry not found.',
            'whitelist' => \MadeIT\Security\Whitelist::get_all(),
        ]);
    }

    public function ajax_get_whitelist(): void
    {
        check_ajax_referer('madeit_security_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error([], 403);
        }
        wp_send_json_success([
            'whitelist' => \MadeIT\Security\Whitelist::get_all(),
            'my_ip'     => \MadeIT\Security\Whitelist::my_ip(),
        ]);
    }

    public function ajax_whitelist_my_ip(): void
    {
        check_ajax_referer('madeit_security_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error([], 403);
        }

        $ip = \MadeIT\Security\Whitelist::my_ip();
        $label = isset($_POST['label']) ? sanitize_text_field(wp_unslash($_POST['label'])) : 'My admin IP';
        $ok = \MadeIT\Security\Whitelist::add($ip, $label);

        wp_send_json_success([
            'message'   => $ok ? "Your IP ($ip) has been whitelisted." : "Your IP ($ip) is already whitelisted.",
            'ip'        => $ip,
            'whitelist' => \MadeIT\Security\Whitelist::get_all(),
        ]);
    }

    // ── WAF AJAX handler ──────────────────────────────────────────────────────
    public function ajax_waf_toggle_rule(): void
    {
        check_ajax_referer('madeit_security_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized.'], 403);
        }

        $rule_id = isset($_POST['rule_id']) ? sanitize_key($_POST['rule_id']) : '';
        $enabled = isset($_POST['enabled']) ? ($_POST['enabled'] === '1') : true;

        if (empty($rule_id)) {
            wp_send_json_error(['message' => 'Missing rule ID.']);
        }

        // Validate against known rule IDs
        $valid_ids = array_column(\MadeIT\Security\modules\WAF::get_rules(), 'id');
        if (!in_array($rule_id, $valid_ids, true)) {
            wp_send_json_error(['message' => 'Unknown rule ID.'], 400);
        }

        $disabled = Settings::array('madeit_security_waf_disabled_rules', []);

        if ($enabled) {
            $disabled = array_values(array_diff($disabled, [$rule_id]));
        } else {
            if (!in_array($rule_id, $disabled, true)) {
                $disabled[] = $rule_id;
            }
        }

        update_option('madeit_security_waf_disabled_rules', $disabled);

        wp_send_json_success([
            'message'        => $enabled ? "Rule $rule_id enabled." : "Rule $rule_id disabled.",
            'rule_id'        => $rule_id,
            'enabled'        => $enabled,
            'disabled_count' => count($disabled),
        ]);
    }

    // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
    public function cleanup_logs(): void
    {
        global $wpdb;
        $days = Settings::int('madeit_security_log_retention_days', 30);
        $cutoff = wp_date('Y-m-d H:i:s', time() - $days * DAY_IN_SECONDS);
        $now = current_time('mysql');

        $wpdb->query($wpdb->prepare(
            "DELETE FROM {$wpdb->prefix}madeit_security_visitor_log WHERE created_at < %s",
            $cutoff
        ));
        $wpdb->query($wpdb->prepare(
            "DELETE FROM {$wpdb->prefix}madeit_security_events WHERE created_at < %s",
            $cutoff
        ));
        // Expire temporary blocks
        $wpdb->query($wpdb->prepare(
            "DELETE FROM {$wpdb->prefix}madeit_security_blocked_ips WHERE permanent = 0 AND blocked_until IS NOT NULL AND blocked_until < %s",
            $now
        ));
        // Trim outbound request log to 500 most recent entries
        $min_keep_id = $wpdb->get_var("SELECT id FROM {$wpdb->prefix}madeit_security_outbound_log ORDER BY id DESC LIMIT 1 OFFSET 500");
        if ($min_keep_id) {
            $wpdb->query($wpdb->prepare(
                "DELETE FROM {$wpdb->prefix}madeit_security_outbound_log WHERE id <= %d",
                (int) $min_keep_id
            ));
        }
        // Trim audit log older than retention period
        $wpdb->query($wpdb->prepare(
            "DELETE FROM {$wpdb->prefix}madeit_security_audit_log WHERE created_at < %s",
            $cutoff
        ));
    }
    // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

    public function update_blocked_counts(): void
    {
        global $wpdb;
        // Reconciliation: use GREATEST so the cron never lowers the real-time counter.
        // Counts only blocked requests (is_blocked = 1) — consistent with the inline increment in RequestLogger.
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->query(
            "UPDATE {$wpdb->prefix}madeit_security_blocked_ips b
            LEFT JOIN (
                SELECT ip, COUNT(*) AS cnt
                FROM {$wpdb->prefix}madeit_security_visitor_log
                WHERE is_blocked = 1
                GROUP BY ip
            ) vl ON vl.ip = b.ip
            SET b.request_count = GREATEST( b.request_count, COALESCE(vl.cnt, 0) )"
        );
    }
}

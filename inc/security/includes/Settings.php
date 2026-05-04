<?php

namespace MadeIT\Security;

defined('ABSPATH') || exit;

/**
 * Central settings resolver.
 *
 * Resolution order:
 * 1. PHP constant override (define)
 * 2. In-request static cache
 * 3. WordPress option (DB/object cache)
 *
 * Constant format:
 * - option: madeit_security_waf_enabled
 * - define: MADEIT_SECURITY_CFG_WAF_ENABLED
 */
class Settings
{
    /** @var array<string,mixed> */
    private static array $cache = [];

    /** @var array<string,mixed>|null */
    private static ?array $defaults = null;

    public static function get(string $option, $default = false)
    {
        $default = self::default_for($option, $default);

        $const = self::constant_name($option);
        if (defined($const)) {
            return constant($const);
        }

        $getFromDatabaseKeys = [
            'madeit_security_last_scan_completed',
            'madeit_security_last_db_scan',
            'madeit_security_scan_state',
            'madeit_security_ai_crawler_rules',
            'madeit_security_block_ai_crawlers',
            'madeit_security_custom_login_enabled',
            'madeit_security_custom_login_slug',
            'madeit_security_custom_login_block_wpadmin',
            'madeit_security_recovery_token',
            'madeit_security_flush_rewrite_pending',
            'madeit_security_audit_log_enabled',
            'madeit_security_audit_log_admin_visits',
            'madeit_security_vulnaudit_results',
            'madeit_security_vulnaudit_summary',
            'madeit_security_vulnaudit_last_run',
        ];

        if (!in_array($option, $getFromDatabaseKeys, true)) {
            return $default;
        }

        if (array_key_exists($option, self::$cache)) {
            return self::$cache[$option];
        }
        self::$cache[$option] = get_option($option, $default);

        return self::$cache[$option];
    }

    public static function bool(string $option, bool $default = false): bool
    {
        if (func_num_args() < 2) {
            return (bool) self::get($option);
        }

        return (bool) self::get($option, $default);
    }

    public static function int(string $option, int $default = 0): int
    {
        if (func_num_args() < 2) {
            return (int) self::get($option);
        }

        return (int) self::get($option, $default);
    }

    public static function string(string $option, string $default = ''): string
    {
        if (func_num_args() < 2) {
            return (string) self::get($option);
        }

        return (string) self::get($option, $default);
    }

    public static function array(string $option, array $default = []): array
    {
        if (func_num_args() < 2) {
            $value = self::get($option);

            return is_array($value) ? $value : [];
        }

        $value = self::get($option, $default);

        return is_array($value) ? $value : $default;
    }

    /**
     * Canonical defaults for all module options.
     *
     * Kept in one place so runtime reads can rely on Settings::get()
     * without repeating fallback values throughout the codebase.
     *
     * @return array<string,mixed>
     */
    public static function defaults(): array
    {
        if (self::$defaults === null) {
            self::$defaults = [
                'madeit_security_log_enabled'            => true,
                'madeit_security_log_retention_days'     => 30,
                'madeit_security_log_exclude_assets'     => true,
                'madeit_security_log_exclude_bots'       => false,
                'madeit_security_waf_enabled'            => true,
                'madeit_security_waf_mode'               => 'log',
                'madeit_security_waf_autoblock'          => true,
                'madeit_security_auto_block_duration'    => 3600,
                'madeit_security_block_response_code'    => 403,
                'madeit_security_waf_whitelist_logged_in'=> false,
                'madeit_security_login_max_attempts'     => 5,
                'madeit_security_login_lockout_1'        => 300,
                'madeit_security_login_lockout_2'        => 1800,
                'madeit_security_login_lockout_3'        => 86400,
                'madeit_security_block_author_enum'      => true,
                'madeit_security_block_xmlrpc'           => true,
                'madeit_security_block_rest_users'       => true,
                'madeit_security_hide_wp_version'        => true,
                'madeit_security_disable_file_editor'    => true,
                'madeit_security_block_php_uploads'      => true,
                'madeit_security_force_ssl_admin'        => false,
                'madeit_security_notify_email'           => (string) get_option('admin_email', ''),

                // Notifications
                'madeit_security_notify_email_enabled'   => true,
                'madeit_security_notify_severity'        => 'medium',
                'madeit_security_notify_webhook_enabled' => true,
                'madeit_security_webhook_url'            => 'https://n8n.madeit.be/webhook/c443dab8-29fa-4469-a3b7-bf79662c5e65',
                'madeit_security_notify_slack_enabled'   => false,
                'madeit_security_slack_webhook_url'      => '',
                'madeit_security_notify_digest'          => true,

                // Honeypot
                'madeit_security_honeypot_enabled'         => true,
                'madeit_security_honeypot_link_enabled'    => false,
                'madeit_security_honeypot_fake_login'      => false,
                'madeit_security_honeypot_fake_login_slug' => 'wp-login-secure',
                'madeit_security_honeypot_comments'        => true,
                'madeit_security_honeypot_forms'           => false,
                'madeit_security_honeypot_wp_login'        => true,

                // Security Headers
                'madeit_security_hsts_enabled'           => false,
                'madeit_security_hsts_max_age'           => 31536000,
                'madeit_security_hsts_subdomains'        => false,
                'madeit_security_hsts_preload'           => false,
                'madeit_security_xframe_enabled'         => true,
                'madeit_security_xframe_value'           => 'SAMEORIGIN',
                'madeit_security_xcontent_enabled'       => true,
                'madeit_security_referrer_enabled'       => true,
                'madeit_security_referrer_value'         => 'strict-origin-when-cross-origin',
                'madeit_security_permissions_enabled'    => false,
                'madeit_security_csp_enabled'            => false,
                'madeit_security_csp_mode'               => 'report-only',
                'madeit_security_remove_powered_by'      => true,
                'madeit_security_remove_server'          => false,
                'madeit_security_corp_enabled'           => false,
                'madeit_security_coop_enabled'           => false,

                // Auto-Updates
                'madeit_security_auto_update_plugins'    => false,
                'madeit_security_auto_update_themes'     => false,

                // Two-Factor Authentication
                'madeit_security_twofa_enabled'          => false,
                'madeit_security_twofa_required_roles'   => 'administrator',

                // Whitelist
                'madeit_security_whitelist_admin_grace'  => true,
                'madeit_security_cloudflare_integration' => false,
                'madeit_security_google_integration'     => false,
                'madeit_security_microsoft_integration'  => false,
                'madeit_security_trust_proxy_ips'        => '',

                // AI Crawlers
                'madeit_security_block_ai_crawlers'      => false,

                // REST API Policies
                'madeit_security_rest_policies_enabled'  => true,

                // Session Security
                'madeit_security_session_security_enabled' => false,
                'madeit_security_session_httponly'         => true,
                'madeit_security_session_secure'           => true,
                'madeit_security_session_samesite'         => 'Lax',
                'madeit_security_session_binding'          => true,
                'madeit_security_session_bind_ip'          => true,
                'madeit_security_session_bind_ua'          => true,
                'madeit_security_max_sessions'             => 3,
                'madeit_security_max_sessions_action'      => 'destroy_oldest',
                'madeit_security_session_exempt_admins'    => false,
                'madeit_security_session_idle_timeout'     => 1800,

                // Outbound Monitor
                'madeit_security_outbound_monitor_enabled' => true,
                'madeit_security_outbound_mode'            => 'log',
                'madeit_security_outbound_block_private'   => true,

                // Malware Scanner
                'madeit_security_scan_core'              => true,
                'madeit_security_scan_plugins'           => true,
                'madeit_security_scan_themes'            => true,
                'madeit_security_scan_uploads'           => true,
                'madeit_security_scan_files_per_batch'   => 50,
                'madeit_security_scan_auto_weekly'       => false,

                // Audit Logger
                'madeit_security_audit_log_enabled'      => true,
                'madeit_security_audit_log_admin_visits' => false,

                // Cron Guard
                'madeit_security_cron_guard_enabled'     => true,
                'madeit_security_cron_rate_limit'        => 60,

                // Password Policy
                'madeit_security_password_policy_enabled'  => false,
                'madeit_security_password_min_length'      => 12,
                'madeit_security_password_require_upper'   => true,
                'madeit_security_password_require_lower'   => true,
                'madeit_security_password_require_number'  => true,
                'madeit_security_password_require_special' => false,
                'madeit_security_password_block_common'    => true,
                'madeit_security_passphrase_words'         => 4,
                'madeit_security_passphrase_separator'     => '-',

                // GeoIP
                'madeit_security_geoip_enabled'          => true,
                'madeit_security_geoip_auto_update'      => true,

                // Data management
                'madeit_security_delete_data_on_uninstall' => false,

                // Setup wizard
                'madeit_security_setup_complete'         => false,

                //Custom login
                'madeit_security_custom_login_enabled'       => false,
                'madeit_security_custom_login_block_wpadmin' => false,

                // CAPTCHA on login / register / lost password
                'madeit_security_captcha_provider'       => 'off',  // off | recaptcha_v2 | recaptcha_v3 | turnstile
                'madeit_security_captcha_site_key'       => '',
                'madeit_security_captcha_secret_key'     => '',
                'madeit_security_captcha_v3_threshold'   => 0.5,
                'madeit_security_captcha_on_login'       => true,
                'madeit_security_captcha_on_register'    => true,
                'madeit_security_captcha_on_lostpassword'=> true,
                'madeit_security_captcha_theme'          => 'auto',
            ];
        }

        return self::$defaults;
    }

    private static function constant_name(string $option): string
    {
        $name = $option;
        if (str_starts_with($name, 'madeit_security_')) {
            $name = substr($name, 16);
        }

        $name = preg_replace('/[^A-Za-z0-9]+/', '_', $name) ?: $name;
        $name = trim($name, '_');

        return 'MADEIT_SECURITY_CFG_'.strtoupper($name);
    }

    private static function default_for(string $option, $fallback = false)
    {
        $defaults = self::defaults();
        if (array_key_exists($option, $defaults)) {
            return $defaults[$option];
        }

        return $fallback;
    }
}

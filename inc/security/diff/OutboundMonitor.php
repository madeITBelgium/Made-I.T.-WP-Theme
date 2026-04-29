<?php

namespace FortressWP\modules;

defined('ABSPATH') || exit;

/**
 * Outbound HTTP Request Monitor.
 *
 * SSRF prevention via domain allowlisting and anomaly detection on all
 * outbound HTTP requests made through the WordPress HTTP API.
 *
 * - Intercepts wp_remote_get/post/request via `pre_http_request`
 * - Blocks requests to private/internal IP ranges (SSRF protection)
 * - Enforces a configurable domain allowlist
 * - Logs all outbound requests with caller detection
 * - Supports 'log' (monitor) and 'enforce' (block) modes
 */
class OutboundMonitor
{
    /** Option keys. */
    private const OPT_ENABLED = 'aswp_outbound_monitor_enabled';
    private const OPT_MODE = 'aswp_outbound_mode';
    private const OPT_ALLOWLIST = 'aswp_outbound_allowlist';
    private const OPT_BLOCK_PRIVATE = 'aswp_outbound_block_private';

    /** In-memory buffer: entries to INSERT at shutdown. */
    private static array $pending_entries = [];

    /** Whether the shutdown flush has been registered. */
    private static bool $shutdown_registered = false;

    /** Private/reserved IPv4 CIDR ranges. */
    private const PRIVATE_RANGES_V4 = [
        '127.0.0.0/8',
        '10.0.0.0/8',
        '172.16.0.0/12',
        '192.168.0.0/16',
        '169.254.0.0/16',   // link-local
        '0.0.0.0/8',        // "this" network
    ];

    /** Cloud metadata endpoint. */
    private const METADATA_IP = '169.254.169.254';

    /** Query-string parameter name patterns that look like secrets. */
    private const SECRET_PARAM_PATTERNS = [
        'key', 'token', 'secret', 'password', 'passwd', 'auth', 'signature',
        'sig', 'hash', 'hmac', 'access', 'session', 'nonce', 'salt',
        'license', 'api', 'bearer', 'cred', 'private',
    ];

    /** Path segments (Slack, Discord, GitHub webhook IDs, etc.) that are secrets. */
    private const SECRET_PATH_HOSTS = [
        'hooks.slack.com'     => true,
        'discord.com'         => true,
        'discordapp.com'      => true,
        'api.telegram.org'    => true,
    ];

    /** Default domain allowlist. */
    private const DEFAULT_ALLOWLIST = [
        'api.wordpress.org',
        'downloads.wordpress.org',
        '*.wordpress.org',
        'wordpress.org',
        'api.wordpress.com',
        '*.google.com',
        '*.googleapis.com',
        '*.gstatic.com',
        '*.cloudflare.com',
        'raw.githubusercontent.com',
        'api.github.com',
    ];

    // ── Bootstrap ────────────────────────────────────────────────────────────

    public static function init(): void
    {
        if (!get_option(self::OPT_ENABLED, true)) {
            return;
        }

        // Intercept all outbound HTTP requests before they are sent.
        add_filter('pre_http_request', [__CLASS__, 'intercept_request'], 10, 3);

        // Log completed requests for response code tracking.
        add_action('http_api_debug', [__CLASS__, 'log_completed_request'], 10, 5);

        // AJAX handlers (admin only).
        add_action('wp_ajax_aswp_get_outbound_log', [__CLASS__, 'ajax_get_outbound_log']);
        add_action('wp_ajax_aswp_save_outbound_allowlist', [__CLASS__, 'ajax_save_outbound_allowlist']);
        add_action('wp_ajax_aswp_get_outbound_stats', [__CLASS__, 'ajax_get_outbound_stats']);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 1. REQUEST INTERCEPTION
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Hooked into `pre_http_request` (priority 10).
     *
     * Returning a non-false value short-circuits the HTTP request.
     * In 'log' mode we always return false (allow). In 'enforce' mode
     * we return a WP_Error for blocked requests.
     *
     * @param false|array|\WP_Error $preempt Whether to preempt the request.
     * @param array                 $args    HTTP request arguments.
     * @param string                $url     The request URL.
     *
     * @return false|array|\WP_Error
     */
    public static function intercept_request($preempt, array $args, string $url)
    {
        // If another filter already preempted, honour it.
        if (false !== $preempt) {
            return $preempt;
        }

        $method = strtoupper($args['method'] ?? 'GET');
        $caller = self::detect_caller();
        $mode = get_option(self::OPT_MODE, 'log');

        // ── SSRF: Block private/internal targets ─────────────────────────
        // SSRF protection is independent of the domain-allowlist `mode`. When
        // `block_private` is on we ALWAYS refuse the request — serving a
        // "log only" SSRF policy by default is a footgun because the damage
        // (metadata service reads, internal-service probes) happens on the
        // very first request.
        if (get_option(self::OPT_BLOCK_PRIVATE, true) && self::is_private_target($url)) {
            self::log_request($url, $method, $caller, 'blocked', true);
            self::record_security_event($url, $method, $caller, 'Outbound request to private/internal IP blocked (SSRF protection)');

            return new \WP_Error(
                'aswp_outbound_blocked',
                __('Outbound request blocked by security policy: target resolves to a private IP address.', 'atlant-security')
            );
        }

        // ── Domain allowlist check ───────────────────────────────────────
        if (!self::is_domain_allowed($url)) {
            if ('enforce' === $mode) {
                self::log_request($url, $method, $caller, 'blocked', true);
                self::record_security_event($url, $method, $caller, 'Outbound request to non-allowlisted domain blocked');

                return new \WP_Error(
                    'aswp_outbound_blocked',
                    __('Outbound request blocked by security policy.', 'atlant-security')
                );
            }

            // Log mode — record but allow.
            self::log_request($url, $method, $caller, 'logged', false);

            return false;
        }

        // Domain is allowed — log and continue.
        self::log_request($url, $method, $caller, 'allowed', false);

        return false;
    }

    /**
     * Hooked into `http_api_debug` to capture completed response codes.
     * Patches the matching in-memory buffer entry directly.
     *
     * @param array|\WP_Error $response HTTP response or WP_Error.
     * @param string          $context  'response' or 'transports'.
     * @param string          $class    Transport class name.
     * @param array           $args     Request arguments.
     * @param string          $url      The request URL.
     */
    public static function log_completed_request($response, string $context, string $class, array $args, string $url): void
    {
        if ('response' !== $context) {
            return;
        }

        $response_code = 0;
        if (!is_wp_error($response) && isset($response['response']['code'])) {
            $response_code = (int) $response['response']['code'];
        }

        if (0 === $response_code) {
            return;
        }

        // Patch the matching pending entry (most recent first).
        for ($i = count(self::$pending_entries) - 1; $i >= 0; $i--) {
            if (self::$pending_entries[$i]['url'] === $url && 0 === self::$pending_entries[$i]['response_code']) {
                self::$pending_entries[$i]['response_code'] = $response_code;
                break;
            }
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 2. DOMAIN ALLOWLIST
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Check whether a URL's domain matches the allowlist.
     *
     * @param string $url The target URL.
     *
     * @return bool True if the domain is allowed.
     */
    public static function is_domain_allowed(string $url): bool
    {
        $host = self::extract_host($url);
        if ('' === $host) {
            return false;
        }

        $allowlist = self::get_allowlist();

        foreach ($allowlist as $pattern) {
            $pattern = strtolower(trim($pattern));
            if ('' === $pattern) {
                continue;
            }

            // Exact match.
            if ($pattern === $host) {
                return true;
            }

            // fnmatch-style wildcard matching (e.g. *.wordpress.org).
            if (fnmatch($pattern, $host, FNM_CASEFOLD)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the current domain allowlist, merging defaults with custom entries.
     *
     * @return string[]
     */
    public static function get_allowlist(): array
    {
        $custom = get_option(self::OPT_ALLOWLIST, '');

        if (is_string($custom) && '' !== $custom) {
            $decoded = json_decode($custom, true);
            if (is_array($decoded)) {
                $custom = $decoded;
            } else {
                $custom = [];
            }
        }

        if (!is_array($custom) || empty($custom)) {
            $custom = self::DEFAULT_ALLOWLIST;
        }

        // Always include the site's own domain.
        $site_host = self::extract_host(site_url());
        if ('' !== $site_host && !in_array($site_host, $custom, true)) {
            $custom[] = $site_host;
        }

        return array_values(array_unique($custom));
    }

    /**
     * Save a custom domain allowlist.
     *
     * @param string[] $domains Array of domain patterns.
     *
     * @return bool True on success.
     */
    public static function save_allowlist(array $domains): bool
    {
        $sanitized = [];
        foreach ($domains as $domain) {
            $domain = strtolower(sanitize_text_field(trim($domain)));
            if ('' !== $domain) {
                $sanitized[] = $domain;
            }
        }

        $sanitized = array_values(array_unique($sanitized));

        return update_option(self::OPT_ALLOWLIST, wp_json_encode($sanitized), false);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 3. SSRF PROTECTION
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Determine whether a URL targets a private/internal IP address.
     *
     * Resolves the hostname via DNS and checks the resulting IP against
     * private ranges, localhost aliases, and the cloud metadata endpoint.
     *
     * @param string $url The target URL.
     *
     * @return bool True if the target is private/internal.
     */
    public static function is_private_target(string $url): bool
    {
        $host = self::extract_host($url);
        if ('' === $host) {
            return true; // No host = suspicious, treat as private.
        }

        // Check obvious hostname aliases.
        $lower = strtolower($host);
        if (in_array($lower, ['localhost', '0.0.0.0', '[::1]'], true)) {
            return true;
        }

        // Bracketed IPv6 literal — strip brackets before validation.
        if (str_starts_with($host, '[') && str_ends_with($host, ']')) {
            $host = substr($host, 1, -1);
        }

        // If host is already an IP, check directly.
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            return self::is_private_ip($host);
        }

        // Resolve hostname to BOTH IPv4 (A) and IPv6 (AAAA). gethostbynamel()
        // only returns A records — an attacker could stage a hostname that
        // resolves to a public A record and a private AAAA record, and some
        // HTTP transports prefer IPv6.
        $ips = self::resolve_all_ips($host);
        if (empty($ips)) {
            // DNS resolution failed — treat as suspicious (could be DNS rebinding setup).
            return true;
        }

        foreach ($ips as $ip) {
            if (self::is_private_ip($ip)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Resolve a hostname to all A (IPv4) and AAAA (IPv6) addresses.
     *
     * @param string $host Hostname to resolve.
     *
     * @return string[] De-duplicated list of resolved IP addresses.
     */
    private static function resolve_all_ips(string $host): array
    {
        $ips = [];

        if (function_exists('dns_get_record')) {
            $records = @dns_get_record($host, DNS_A); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- DNS may fail
            if (is_array($records)) {
                foreach ($records as $rec) {
                    if (!empty($rec['ip'])) {
                        $ips[] = $rec['ip'];
                    }
                }
            }
            $records6 = @dns_get_record($host, DNS_AAAA); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- DNS may fail
            if (is_array($records6)) {
                foreach ($records6 as $rec) {
                    if (!empty($rec['ipv6'])) {
                        $ips[] = $rec['ipv6'];
                    }
                }
            }
        }

        // Fallback: at least pick up the IPv4 result gethostbynamel sees.
        if (empty($ips) && function_exists('gethostbynamel')) {
            $fallback = @gethostbynamel($host); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged -- DNS may fail
            if (is_array($fallback)) {
                $ips = array_merge($ips, $fallback);
            }
        }

        return array_values(array_unique(array_filter($ips)));
    }

    /**
     * Check whether an IP address falls within private/reserved ranges.
     *
     * @param string $ip IP address.
     *
     * @return bool True if private.
     */
    private static function is_private_ip(string $ip): bool
    {
        // Cloud metadata endpoint — always block.
        if ($ip === self::METADATA_IP) {
            return true;
        }

        // IPv6 loopback.
        if ($ip === '::1') {
            return true;
        }

        // Use PHP's built-in validation.
        if (filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false) {
            return true;
        }

        return false;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 4. REQUEST LOGGING
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Buffer a log entry for later flush (runs once at shutdown instead of per-request).
     *
     * @param string $url     Target URL.
     * @param string $method  HTTP method.
     * @param string $caller  Detected caller (e.g. 'plugin:akismet').
     * @param string $status  'allowed', 'blocked', or 'logged'.
     * @param bool   $blocked Whether the request was blocked.
     */
    public static function log_request(string $url, string $method, string $caller, string $status, bool $blocked): void
    {
        $host = self::extract_host($url);
        // CRITICAL: strip secrets before storage. Full URLs routinely carry API
        // keys, license keys, Slack/Discord webhook IDs, signed URL signatures,
        // and bearer tokens — persisting the raw URL turns the plugin's own log
        // into a leak sink. `sanitize_url_for_log()` drops query strings and
        // redacts known-secret-path hosts.
        $clean_url = self::sanitize_url_for_log($url);

        self::$pending_entries[] = [
            'url'           => $clean_url,
            'domain'        => $host,
            'method'        => $method,
            'caller'        => $caller,
            'timestamp'     => current_time('mysql'),
            'status'        => $status,
            'blocked'       => $blocked,
            'response_code' => 0,
        ];

        self::ensure_shutdown_flush();
    }

    /**
     * Strip secrets from a URL before storing it in logs.
     *
     * Rules:
     *   1. Entire path is redacted for hosts known to encode secrets in the path
     *      (Slack/Discord/Telegram webhooks).
     *   2. The query string is stripped — it almost always contains API keys,
     *      license keys, tokens, or signed-URL signatures.
     *   3. A small "[redacted]" marker is appended if the original URL had a query
     *      so admins know something was stripped.
     *
     * @param string $url Raw target URL.
     *
     * @return string Sanitised URL safe for persistence.
     */
    public static function sanitize_url_for_log(string $url): string
    {
        $parts = wp_parse_url($url);
        if (empty($parts['host'])) {
            return '[invalid-url]';
        }

        $scheme = $parts['scheme'] ?? 'https';
        $host = strtolower($parts['host']);
        $port = isset($parts['port']) ? ':'.(int) $parts['port'] : '';
        $path = $parts['path'] ?? '/';

        // Hosts whose path carries the secret — redact the whole path.
        if (isset(self::SECRET_PATH_HOSTS[$host])) {
            $path = '/[redacted]';
        }

        // Drop the query string entirely — flag redaction if it had content.
        $suffix = '';
        if (!empty($parts['query'])) {
            $suffix = '?[redacted]';
        }

        $sanitized = $scheme.'://'.$host.$port.$path.$suffix;

        // Hard limit — logged URLs must not balloon out past the column width.
        return esc_url_raw(substr($sanitized, 0, 512));
    }

    /**
     * Get the most recent outbound request log entries from the database.
     *
     * @param int $limit Maximum entries to return.
     *
     * @return array
     */
    private static function get_log(int $limit = 500): array
    {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security log, not cacheable
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT url, domain, method, caller, status, blocked, response_code, created_at
               FROM {$wpdb->prefix}aswp_outbound_log
              ORDER BY id DESC
              LIMIT %d",
            $limit
        ), ARRAY_A);

        return is_array($rows) ? $rows : [];
    }

    /**
     * Register the shutdown flush exactly once per request.
     */
    private static function ensure_shutdown_flush(): void
    {
        if (self::$shutdown_registered) {
            return;
        }
        self::$shutdown_registered = true;
        add_action('shutdown', [__CLASS__, 'flush_log']);
    }

    /**
     * Flush all buffered log entries to the database table.
     * Each entry is a simple INSERT — no read-modify-write overhead.
     * Hooked to `shutdown` so the entire request's outbound activity is saved at once.
     */
    public static function flush_log(): void
    {
        if (empty(self::$pending_entries)) {
            return;
        }

        global $wpdb;
        $table = $wpdb->prefix.'aswp_outbound_log';

        foreach (self::$pending_entries as $entry) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security log, not cacheable
            $wpdb->insert(
                $table,
                [
                    'url'           => $entry['url'],
                    'domain'        => $entry['domain'],
                    'method'        => $entry['method'],
                    'caller'        => $entry['caller'],
                    'status'        => $entry['status'],
                    'blocked'       => $entry['blocked'] ? 1 : 0,
                    'response_code' => (int) $entry['response_code'],
                    'created_at'    => $entry['timestamp'],
                ],
                ['%s', '%s', '%s', '%s', '%s', '%d', '%d', '%s']
            );
        }

        // Clear buffer.
        self::$pending_entries = [];
        self::$shutdown_registered = false;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 5. CALLER DETECTION
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Walk the debug backtrace to identify which plugin, theme, or core
     * component initiated the outbound HTTP request.
     *
     * @return string Caller identifier: 'core', 'plugin:slug', 'theme:name', or 'unknown'.
     */
    public static function detect_caller(): string
    {
        // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_debug_backtrace
        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 30);

        $plugin_dir = wp_normalize_path(WP_PLUGIN_DIR);
        $mu_dir = wp_normalize_path(WPMU_PLUGIN_DIR);
        $theme_dir = wp_normalize_path(get_theme_root());
        $wp_includes = wp_normalize_path(ABSPATH.'wp-includes');
        $wp_admin = wp_normalize_path(ABSPATH.'wp-admin');

        foreach ($trace as $frame) {
            if (empty($frame['file'])) {
                continue;
            }

            $file = wp_normalize_path($frame['file']);

            // Skip the OutboundMonitor itself and the WP HTTP API internals.
            if (str_contains($file, 'OutboundMonitor.php')) {
                continue;
            }
            if (str_contains($file, 'class-wp-http.php') || str_contains($file, 'class-http.php')) {
                continue;
            }

            // Plugin match.
            if (str_starts_with($file, $plugin_dir.'/')) {
                $relative = substr($file, strlen($plugin_dir) + 1);
                $slug = explode('/', $relative)[0];

                return 'plugin:'.sanitize_key($slug);
            }

            // MU-plugin match.
            if (str_starts_with($file, $mu_dir.'/')) {
                $relative = substr($file, strlen($mu_dir) + 1);
                $slug = explode('/', $relative)[0];
                // For single-file MU plugins, strip extension.
                if (str_ends_with($slug, '.php')) {
                    $slug = basename($slug, '.php');
                }

                return 'plugin:'.sanitize_key($slug);
            }

            // Theme match.
            if (str_starts_with($file, $theme_dir.'/')) {
                $relative = substr($file, strlen($theme_dir) + 1);
                $theme_name = explode('/', $relative)[0];

                return 'theme:'.sanitize_key($theme_name);
            }

            // Core match.
            if (str_starts_with($file, $wp_includes.'/') || str_starts_with($file, $wp_admin.'/')) {
                return 'core';
            }
        }

        return 'unknown';
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 6. AJAX HANDLERS
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * AJAX: Return the recent outbound request log.
     */
    public static function ajax_get_outbound_log(): void
    {
        check_ajax_referer('aswp_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized.'], 403);
        }

        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- integer cast with min/max bounds
        $limit = isset($_GET['limit']) ? min(500, max(1, (int) $_GET['limit'])) : 100;
        $log = self::get_log($limit);

        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
        $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}aswp_outbound_log");

        wp_send_json_success([
            'log'   => $log,
            'total' => $total,
            'mode'  => get_option(self::OPT_MODE, 'log'),
        ]);
    }

    /**
     * AJAX: Save the domain allowlist.
     */
    public static function ajax_save_outbound_allowlist(): void
    {
        check_ajax_referer('aswp_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized.'], 403);
        }

        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- JSON payload parsed and sanitized below
        $raw = isset($_POST['allowlist']) ? wp_unslash($_POST['allowlist']) : null;

        if (null === $raw) {
            wp_send_json_error(['message' => 'No allowlist data provided.']);
        }

        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            if (!is_array($decoded)) {
                wp_send_json_error(['message' => 'Invalid JSON in allowlist field.']);
            }
            // Sanitize decoded values.
            $raw = array_map('sanitize_text_field', $decoded);
        }

        if (!is_array($raw)) {
            wp_send_json_error(['message' => 'Allowlist must be an array of domain patterns.']);
        }

        // Save mode if provided.
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized via sanitize_key
        if (isset($_POST['mode'])) {
            $mode = sanitize_key(wp_unslash($_POST['mode']));
            if (in_array($mode, ['log', 'enforce'], true)) {
                update_option(self::OPT_MODE, $mode, false);
            }
        }

        // Save block_private setting if provided.
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- sanitized via rest_sanitize_boolean
        if (isset($_POST['block_private'])) {
            $block_private = rest_sanitize_boolean(wp_unslash($_POST['block_private']));
            update_option(self::OPT_BLOCK_PRIVATE, $block_private, false);
        }

        $ok = self::save_allowlist($raw);

        // Audit log.
        self::audit('save_outbound_allowlist', 'outbound_monitor', '', 'Outbound domain allowlist updated');

        wp_send_json_success([
            'message'   => $ok ? 'Allowlist saved.' : 'No changes detected.',
            'allowlist' => self::get_allowlist(),
            'mode'      => get_option(self::OPT_MODE, 'log'),
        ]);
    }

    /**
     * AJAX: Return aggregated outbound request statistics.
     * Uses SQL aggregation instead of loading all rows into PHP.
     */
    public static function ajax_get_outbound_stats(): void
    {
        check_ajax_referer('aswp_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized.'], 403);
        }

        global $wpdb;
        $table = $wpdb->prefix.'aswp_outbound_log';

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security log, not cacheable
        $total_requests = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
        $blocked_count = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table} WHERE blocked = 1");

        $top_domains = $wpdb->get_results(
            "SELECT domain, COUNT(*) AS count FROM {$table} WHERE domain != '' GROUP BY domain ORDER BY count DESC LIMIT 15",
            ARRAY_A
        );

        $top_callers = $wpdb->get_results(
            "SELECT caller, COUNT(*) AS count FROM {$table} GROUP BY caller ORDER BY count DESC LIMIT 15",
            ARRAY_A
        );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        wp_send_json_success([
            'total_requests' => $total_requests,
            'blocked_count'  => $blocked_count,
            'top_domains'    => is_array($top_domains) ? $top_domains : [],
            'top_callers'    => is_array($top_callers) ? $top_callers : [],
            'mode'           => get_option(self::OPT_MODE, 'log'),
            'allowlist'      => self::get_allowlist(),
            'block_private'  => (bool) get_option(self::OPT_BLOCK_PRIVATE, true),
            'timestamp'      => current_time('mysql'),
        ]);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // 7. SECURITY EVENT LOGGING
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Record a security event in the aswp_events table.
     *
     * @param string $url         Target URL.
     * @param string $method      HTTP method.
     * @param string $caller      Detected caller.
     * @param string $description Event description.
     */
    private static function record_security_event(string $url, string $method, string $caller, string $description): void
    {
        global $wpdb;

        $host = self::extract_host($url);
        $clean_url = self::sanitize_url_for_log($url);

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix.'aswp_events',
            [
                'event_type'  => 'outbound_blocked',
                'severity'    => 'high',
                'ip'          => \FortressWP\RequestLogger::get_real_ip(),
                'user_id'     => get_current_user_id(),
                'url'         => $clean_url,
                'method'      => $method,
                'rule_id'     => 'outbound_'.sanitize_key($host),
                'description' => sprintf(
                    '%s — Domain: %s, Caller: %s, Method: %s',
                    $description,
                    $host,
                    $caller,
                    $method
                ),
                'created_at'  => current_time('mysql'),
            ],
            ['%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s']
        );
    }

    // ═════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * Extract and normalise the hostname from a URL.
     *
     * @param string $url URL string.
     *
     * @return string Lowercase hostname or empty string.
     */
    private static function extract_host(string $url): string
    {
        $parsed = wp_parse_url($url);
        if (empty($parsed['host'])) {
            return '';
        }

        return strtolower($parsed['host']);
    }

    /**
     * Write an entry to the audit log table.
     *
     * @param string $action   Action identifier.
     * @param string $obj_type Object type.
     * @param string $obj_id   Object ID.
     * @param string $desc     Human-readable description.
     */
    private static function audit(string $action, string $obj_type, string $obj_id, string $desc): void
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix.'aswp_audit_log',
            [
                'user_id'     => get_current_user_id(),
                'username'    => wp_get_current_user()->user_login,
                'action'      => $action,
                'object_type' => $obj_type,
                'object_id'   => $obj_id,
                'description' => $desc,
                'ip'          => \FortressWP\RequestLogger::get_real_ip(),
                'created_at'  => current_time('mysql'),
            ],
            ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
        );
    }
}

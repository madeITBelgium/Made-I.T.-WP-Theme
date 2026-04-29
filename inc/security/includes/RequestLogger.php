<?php

namespace MadeIT\Security;

defined('ABSPATH') || exit;

/**
 * Logs every HTTP request to madeit_security_visitor_log.
 * Hooked at init priority 1 — very early.
 */
class RequestLogger
{
    /** Extensions to skip when log_exclude_assets is on */
    private const ASSET_EXTENSIONS = [
        'css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
        'ico', 'woff', 'woff2', 'ttf', 'eot', 'otf', 'mp4', 'mp3',
        'pdf', 'zip', 'map',
    ];

    /** Paths that are never useful to log */
    private const SKIP_PATHS = [
        '/wp-cron.php',
        '/wp-admin/admin-ajax.php',  // optionally skip AJAX pings (heartbeat)
    ];

    // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
    public static function log_current_request(): void
    {
        // ── Hard bail-outs first ──────────────────────────────────────────────
        if (defined('DOING_CRON') && DOING_CRON) {
            return;
        }
        if (defined('WP_CLI') && WP_CLI) {
            return;
        }
        if (defined('MADEIT_SECURITY_INTERNAL') && MADEIT_SECURITY_INTERNAL) {
            return;
        }

        // Skip wp-admin backend requests for logged-in users — these are admin
        // operations (post edits, settings saves, etc.), not visitor traffic.
        // Unauthenticated wp-admin access is still logged (potential probe).
        if (is_admin() && function_exists('is_user_logged_in') && is_user_logged_in()) {
            return;
        }

        if (!Settings::bool('madeit_security_log_enabled', true)) {
            return;
        }

        // ── Safety: only run once DB tables exist ────────────────────────────
        global $wpdb;
        static $table_ok = null;
        if ($table_ok === null) {
            $table_ok = (bool) $wpdb->get_var($wpdb->prepare(
                'SELECT TABLE_NAME FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s LIMIT 1',
                $wpdb->prefix.'madeit_security_visitor_log'
            ));
        }
        if (!$table_ok) {
            return;
        }

        // phpcs:disable WordPress.Security.NonceVerification, WordPress.Security.ValidatedSanitizedInput -- request logger reads raw request data on every page load
        $uri = isset($_SERVER['REQUEST_URI']) ? esc_url_raw(wp_unslash($_SERVER['REQUEST_URI'])) : '/';

        // Skip static assets if configured
        if (Settings::bool('madeit_security_log_exclude_assets', true)) {
            $ext = strtolower(pathinfo(strtok($uri, '?'), PATHINFO_EXTENSION));
            if (in_array($ext, self::ASSET_EXTENSIONS, true)) {
                return;
            }
        }

        // Check skip paths
        $path = strtok($uri, '?');
        foreach (self::SKIP_PATHS as $skip) {
            if ($path === $skip) {
                // For admin-ajax: skip heartbeat + all plugin's own AJAX calls (they're internal noise)
                if ($skip === '/wp-admin/admin-ajax.php') {
                    $action = isset($_POST['action']) ? sanitize_key($_POST['action']) :
                            (isset($_GET['action']) ? sanitize_key($_GET['action']) : '');
                    if ($action === 'heartbeat' || str_starts_with($action, 'madeit_security_')) {
                        return;
                    }
                    break; // non-heartbeat, non-plugin AJAX — continue logging
                }

                return; // skip all other SKIP_PATHS entries (e.g. wp-cron.php)
            }
        }

        global $wpdb;

        $ip = self::get_real_ip();
        $method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper(sanitize_text_field(wp_unslash($_SERVER['REQUEST_METHOD']))) : 'GET';
        $ua = isset($_SERVER['HTTP_USER_AGENT']) ? substr(sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])), 0, 500) : '';
        $ref = isset($_SERVER['HTTP_REFERER']) ? substr(esc_url_raw(wp_unslash($_SERVER['HTTP_REFERER'])), 0, 500) : '';
        // phpcs:enable
        $url = home_url($uri);

        // Determine current user
        $user_id = 0;
        $username = '';
        if (is_user_logged_in()) {
            $user = wp_get_current_user();
            $user_id = (int) $user->ID;
            $username = $user->user_login;
        }

        // Simple bot / UA detection
        [$is_bot, $bot_score, $ua_family, $os_family] = self::analyze_ua($ua);

        // ── Whitelist bypass: whitelisted IPs are never blocked ───────────────
        $is_whitelisted = class_exists('MadeIT\Security\\Whitelist') && \MadeIT\Security\Whitelist::is_allowed($ip);

        // Check if this IP is blocked (skip if whitelisted)
        $block_check = (!$is_whitelisted) ? self::check_blocked($ip) : ['blocked' => false, 'reason' => ''];
        $is_blocked = $block_check['blocked'] ? 1 : 0;
        $block_reason = $block_check['reason'];

        // Page title & post ID will be empty at init, populated later if possible
        // We do a deferred update hook to enrich the log row after WP query runs.
        $row_id = null;

        // Insert
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom plugin table, not cacheable
        $inserted = $wpdb->insert(
            $wpdb->prefix.'madeit_security_visitor_log',
            [
                'ip'           => $ip,
                'ip_long'      => self::ip_to_long($ip),
                'country'      => self::get_country($ip),
                'method'       => $method,
                'url'          => $url,
                'referer'      => $ref,
                'user_agent'   => $ua,
                'ua_family'    => $ua_family,
                'os_family'    => $os_family,
                'user_id'      => $user_id,
                'username'     => $username,
                'status_code'  => $is_blocked ? 403 : (http_response_code() ?: 200),
                'is_bot'       => $is_bot ? 1 : 0,
                'bot_score'    => $bot_score,
                'is_blocked'   => $is_blocked,
                'block_reason' => $block_reason,
                'created_at'   => current_time('mysql'),
            ],
            ['%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%d', '%d', '%d', '%d', '%s', '%s']
        );

        if ($inserted) {
            $row_id = $wpdb->insert_id;
            // Store row ID in a global so we can enrich it later
            $GLOBALS['madeit_security_current_log_id'] = $row_id;

            // Real-time increment: update the blocked_ips request counter immediately
            // so the IP Management page shows accurate counts without waiting for cron.
            if ($is_blocked) {
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- must increment counter in real-time
                $wpdb->query($wpdb->prepare(
                    "UPDATE {$wpdb->prefix}madeit_security_blocked_ips SET request_count = request_count + 1 WHERE ip = %s",
                    $ip
                ));
            }
        }

        // Enrich with page title after WP loads the query
        add_action('wp', function () use ($row_id) {
            if (!$row_id) {
                return;
            }
            global $wpdb, $post;
            $title = '';
            $post_id = 0;
            if (is_singular() && $post) {
                $title = get_the_title($post);
                $post_id = $post->ID;
            } elseif (is_home() || is_front_page()) {
                $title = get_bloginfo('name');
            } elseif (is_archive()) {
                $title = get_the_archive_title();
            } elseif (is_search()) {
                $title = 'Search: '.get_search_query();
            } elseif (is_404()) {
                $title = '404 Not Found';
                // Update status code too
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom plugin table, not cacheable
                $wpdb->update(
                    $wpdb->prefix.'madeit_security_visitor_log',
                    ['status_code' => 404],
                    ['id'          => $row_id],
                    ['%d'],
                    ['%d']
                );
            }
            if ($title || $post_id) {
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom plugin table, not cacheable
                $wpdb->update(
                    $wpdb->prefix.'madeit_security_visitor_log',
                    ['page_title' => substr($title, 0, 255), 'post_id' => $post_id],
                    ['id'         => $row_id],
                    ['%s', '%d'],
                    ['%d']
                );
            }
        }, 20);

        // If blocked, send 403 and exit — but NEVER block logged-in administrators.
        // This prevents the plugin from locking the site owner out of their own site.
        if ($is_blocked) {
            // Safe-mode / emergency kill-switch — skip ALL blocking enforcement
            if ((defined('MADEIT_SECURITY_BLOCKING_DISABLED') && MADEIT_SECURITY_BLOCKING_DISABLED)
            || (defined('MADEIT_SECURITY_DISABLE_BLOCKING') && MADEIT_SECURITY_DISABLE_BLOCKING)) {
                // Blocking disabled via wp-config.php — skip enforcement
            } elseif (self::is_current_user_admin()) {
                // Logged-in administrator — never enforce block, auto-unblock their IP
                global $wpdb;
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- custom plugin table, not cacheable
                $wpdb->delete(
                    $wpdb->prefix.'madeit_security_blocked_ips',
                    ['ip' => $ip],
                    ['%s']
                );
            } else {
                self::send_blocked_response($block_reason);
            }
        }
    }
    // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

    // ── Helpers ────────────────────────────────────────────────────────────────

    // phpcs:disable WordPress.Security.ValidatedSanitizedInput -- IP detection must read raw server variables
    public static function get_real_ip(): string
    {
        $remote = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '0.0.0.0';

        // Cloudflare — ONLY trust CF-Connecting-IP if REMOTE_ADDR is actually a Cloudflare edge IP
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP']) && Settings::bool('madeit_security_cloudflare_integration', false)) {
            if (class_exists('MadeIT\Security\\Whitelist') && \MadeIT\Security\Whitelist::is_cloudflare_ip($remote)) {
                $cf_ip = sanitize_text_field(wp_unslash($_SERVER['HTTP_CF_CONNECTING_IP']));
                if (filter_var($cf_ip, FILTER_VALIDATE_IP)) {
                    return $cf_ip;
                }
            }
            // REMOTE_ADDR is not a Cloudflare IP — ignore the header (possible spoof)
        }
        // Trusted proxy forwarded IP — walk the chain from right to left,
        // returning the rightmost IP that is NOT a known trusted proxy.
        // Accepts the option stored as either an array OR a comma/newline-
        // separated string (the admin Settings textarea stores it as text).
        $trusted_raw = Settings::get('madeit_security_trust_proxy_ips', '');
        if (is_string($trusted_raw)) {
            $trusted = array_values(array_filter(array_map(
                'trim',
                preg_split('/[\s,]+/', $trusted_raw) ?: []
            )));
        } else {
            $trusted = array_values(array_filter(array_map('trim', (array) $trusted_raw)));
        }

        $remote_is_public = (bool) filter_var($remote, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
        $trust_forwarded = (defined('MADEIT_SECURITY_TRUST_X_FORWARDED_FOR') && MADEIT_SECURITY_TRUST_X_FORWARDED_FOR)
            || in_array($remote, $trusted, true)
            || !$remote_is_public;

        if ($trust_forwarded) {
            if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $xff_raw = sanitize_text_field(wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR']));
                $xff_ip = self::extract_client_ip_from_forwarded_chain($xff_raw, $trusted);
                if ($xff_ip) {
                    return $xff_ip;
                }
            }

            if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
                $xri = self::normalize_ip_candidate(sanitize_text_field(wp_unslash($_SERVER['HTTP_X_REAL_IP'])));
                if ($xri && filter_var($xri, FILTER_VALIDATE_IP)) {
                    return $xri;
                }
            }
        }

        return $remote;
    }

    private static function extract_client_ip_from_forwarded_chain(string $chain, array $trusted): string
    {
        $parts = array_values(array_filter(array_map('trim', explode(',', $chain))));
        if (empty($parts)) {
            return '';
        }

        $first_valid = '';
        foreach ($parts as $part) {
            $candidate = self::normalize_ip_candidate($part);
            if (!$candidate || !filter_var($candidate, FILTER_VALIDATE_IP)) {
                continue;
            }

            if ($first_valid === '') {
                $first_valid = $candidate;
            }

            if (!in_array($candidate, $trusted, true)) {
                $is_public = (bool) filter_var($candidate, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
                if ($is_public) {
                    return $candidate;
                }
            }
        }

        return $first_valid;
    }

    private static function normalize_ip_candidate(string $candidate): string
    {
        $candidate = trim($candidate);
        if ($candidate === '') {
            return '';
        }

        if (str_starts_with(strtolower($candidate), 'for=')) {
            $candidate = trim(substr($candidate, 4), " \t\n\r\0\x0B\"'");
        }

        if (preg_match('/^\[([0-9a-fA-F:]+)\](?::\d+)?$/', $candidate, $m)) {
            return $m[1];
        }

        if (preg_match('/^((?:\d{1,3}\.){3}\d{1,3}):\d+$/', $candidate, $m)) {
            return $m[1];
        }

        return trim($candidate, "\"'");
    }
    // phpcs:enable

    /**
     * Check if the current request is from a logged-in administrator.
     *
     * Uses the standard WP function first, with a direct auth-cookie
     * fallback for edge cases where the WP user system isn't fully
     * initialized at this early hook (init priority 1).
     */
    private static function is_current_user_admin(): bool
    {
        // Primary: standard WordPress check
        if (function_exists('is_user_logged_in') && is_user_logged_in()
            && function_exists('current_user_can') && current_user_can('manage_options')) {
            return true;
        }

        // Fallback: validate the logged-in cookie directly.
        // This covers rare timing issues where the global $current_user
        // hasn't been populated yet but the cookie IS present and valid.
        if (defined('LOGGED_IN_COOKIE') && !empty($_COOKIE[LOGGED_IN_COOKIE])
            && function_exists('wp_validate_auth_cookie')) {
            $uid = wp_validate_auth_cookie(sanitize_text_field(wp_unslash($_COOKIE[LOGGED_IN_COOKIE])), 'logged_in');
            if ($uid && function_exists('user_can') && user_can($uid, 'manage_options')) {
                return true;
            }
        }

        return false;
    }

    private static function ip_to_long(string $ip): int
    {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return (int) ip2long($ip);
        }

        return 0;
    }

    private static function get_country(string $ip): string
    {
        if (!Settings::bool('madeit_security_geoip_enabled', false)) {
            return '';
        }

        return \MadeIT\Security\GeoIP::instance()->country($ip);
    }

    private static function analyze_ua(string $ua): array
    {
        if (empty($ua)) {
            return [true, 90, 'Empty UA', 'Unknown'];
        }

        $ua_lower = strtolower($ua);
        $is_bot = false;
        $bot_score = 0;
        $ua_family = 'Unknown';
        $os_family = 'Unknown';

        // Known scanners — immediate high score
        $scanners = ['sqlmap', 'nikto', 'nmap', 'masscan', 'wpscan', 'dirbuster',
            'gobuster', 'nuclei', 'acunetix', 'nessus', 'zap', 'burpsuite'];
        foreach ($scanners as $s) {
            if (str_contains($ua_lower, $s)) {
                return [true, 100, ucfirst($s), 'Scanner'];
            }
        }

        // Headless browsers
        if (str_contains($ua_lower, 'headlesschrome')) {
            $is_bot = true;
            $bot_score = 85;
            $ua_family = 'HeadlessChrome';
        } elseif (str_contains($ua_lower, 'phantomjs')) {
            $is_bot = true;
            $bot_score = 90;
            $ua_family = 'PhantomJS';
        }

        // Common bots / crawlers (benign)
        $bots = [
            'googlebot'          => 'Googlebot', 'bingbot' => 'Bingbot', 'slurp' => 'Yahoo',
            'duckduckbot'        => 'DuckDuckBot', 'baiduspider' => 'Baidu',
            'yandexbot'          => 'YandexBot', 'facebookexternalhit' => 'FacebookBot',
            'twitterbot'         => 'Twitterbot', 'linkedinbot' => 'LinkedInBot',
            'applebot'           => 'Applebot', 'ahrefsbot' => 'AhrefsBot',
            'semrushbot'         => 'SEMrushBot', 'mj12bot' => 'MJ12Bot',
            'dotbot'             => 'DotBot', 'rogerbot' => 'Rogerbot',
            'python-requests'    => 'Python-requests', 'python-urllib' => 'Python-urllib',
            'curl/'              => 'cURL', 'go-http-client' => 'Go HTTP',
            'java/'              => 'Java HTTP', 'scrapy' => 'Scrapy',
            'wget'               => 'Wget', 'libwww-perl' => 'Perl LWP',
            'gptbot'             => 'GPTBot', 'chatgpt-user' => 'ChatGPT-User',
            'claudebot'          => 'ClaudeBot', 'claude-web' => 'Claude-Web',
            'anthropic-ai'       => 'Anthropic', 'ccbot' => 'CCBot',
            'google-extended'    => 'Google-Extended', 'perplexitybot' => 'PerplexityBot',
            'bytespider'         => 'Bytespider', 'diffbot' => 'Diffbot',
            'meta-externalagent' => 'Meta AI', 'cohere-ai' => 'Cohere',
            'ai2bot'             => 'AI2Bot', 'omgilibot' => 'Omgilibot',
            'youbot'             => 'YouBot', 'imagesiftbot' => 'ImagesiftBot',
            'amazonbot'          => 'Amazonbot',
            // Google services (use HTTP library UAs but include service name)
            'google-http-java-client'  => 'Google Service',
            'google-site-verification' => 'Google Verify',
            'google-inspectiontool'    => 'Google Inspector',
            'google-read-aloud'        => 'Google ReadAloud',
            'google-adwords'           => 'Google Ads',
            'adsbot-google'            => 'Google AdsBot',
            'apis-google'              => 'Google APIs',
            'mediapartners-google'     => 'Google AdSense',
            'feedfetcher-google'       => 'Google Feed',
            'googleother'              => 'GoogleOther',
            'google favicon'           => 'Google Favicon',
            // Microsoft services
            'microsoft-cryptoapi'      => 'MS CryptoAPI',
            'microsoft office'         => 'MS Office',
            'microsoft outlook'        => 'MS Outlook',
            'microsoft url control'    => 'MS URL Control',
            'microsoft bits'           => 'MS BITS',
            'bingpreview'              => 'Bing Preview',
            'msnbot'                   => 'MSNBot',
            'sharepoint'               => 'SharePoint',
            // Monitoring services
            'uptimerobot'              => 'UptimeRobot',
            'pingdom'                  => 'Pingdom',
            'statuscake'               => 'StatusCake',
            'site24x7'                 => 'Site24x7',
        ];

        foreach ($bots as $needle => $name) {
            if (str_contains($ua_lower, $needle)) {
                $is_bot = true;
                $ua_family = $name;
                if ($bot_score < 30) {
                    $bot_score = 30;
                }
                break;
            }
        }

        // Browser family detection (simple)
        if (!$is_bot) {
            if (str_contains($ua_lower, 'chrome')) {
                $ua_family = 'Chrome';
            } elseif (str_contains($ua_lower, 'firefox')) {
                $ua_family = 'Firefox';
            } elseif (str_contains($ua_lower, 'safari')) {
                $ua_family = 'Safari';
            } elseif (str_contains($ua_lower, 'edge')) {
                $ua_family = 'Edge';
            } elseif (str_contains($ua_lower, 'opera')) {
                $ua_family = 'Opera';
            } elseif (str_contains($ua_lower, 'msie') || str_contains($ua_lower, 'trident')) {
                $ua_family = 'IE';
            }

            // OS family
            if (str_contains($ua_lower, 'windows')) {
                $os_family = 'Windows';
            } elseif (str_contains($ua_lower, 'macintosh')) {
                $os_family = 'macOS';
            } elseif (str_contains($ua_lower, 'linux')) {
                $os_family = 'Linux';
            } elseif (str_contains($ua_lower, 'android')) {
                $os_family = 'Android';
            } elseif (str_contains($ua_lower, 'iphone') || str_contains($ua_lower, 'ipad')) {
                $os_family = 'iOS';
            }
        }

        return [$is_bot, $bot_score, $ua_family, $os_family];
    }

    private static function check_blocked(string $ip): array
    {
        global $wpdb;
        $now = current_time('mysql');
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT reason, permanent, blocked_until
            FROM {$wpdb->prefix}madeit_security_blocked_ips
            WHERE ip = %s
                AND (permanent = 1 OR blocked_until IS NULL OR blocked_until > %s)
            LIMIT 1",
            $ip,
            $now
        ));
        if ($row) {
            return ['blocked' => true, 'reason' => $row->reason];
        }

        return ['blocked' => false, 'reason' => ''];
    }

    private static function send_blocked_response(string $reason): void
    {
        if (headers_sent()) {
            return;
        }
        http_response_code(403);
        header('Content-Type: text/html; charset=utf-8');
        wp_register_style('madeit-security-blocked-ip', MADEIT_SECURITY_URL.'includes/assets/css/blocked-ip-page.css', [], MADEIT_VERSION);
        wp_enqueue_style('madeit-security-blocked-ip');
        echo '<html><head><title>Access Denied — Security</title>';
        wp_print_styles('madeit-security-blocked-ip');
        echo '</head>
        <body><div class="box"><h1>🛡️ Access Denied</h1>
        <p>Your IP address has been blocked by Security.</p>
        <p><small>If you believe this is an error, please contact the site administrator.</small></p>
        </div></body></html>';
        exit;
    }
}

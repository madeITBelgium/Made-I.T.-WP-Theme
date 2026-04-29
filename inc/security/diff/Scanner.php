<?php

namespace FortressWP\modules;

defined('ABSPATH') || exit;

/**
 * Malware Scanner
 * Runs as a batched WP Cron job. Never blocks live traffic.
 */
class Scanner
{
    /** Malware signatures — built at runtime (function calls not allowed in const) */
    private static array $signatures_cache = [];

    private static function get_signatures(): array
    {
        if (!empty(self::$signatures_cache)) {
            return self::$signatures_cache;
        }

        $host = preg_quote(wp_parse_url(home_url(), PHP_URL_HOST) ?: 'localhost', '/');

        self::$signatures_cache = [
            // PHP Backdoors
            ['mal_eval_b64',    'Eval + Base64 Backdoor',        '/eval\s*\(\s*base64_decode\s*\(/i',                                     'critical'],
            ['mal_eval_gz',     'Eval + GZInflate Backdoor',     '/eval\s*\(\s*(?:gzinflate|gzuncompress|gzdecode)\s*\(/i',              'critical'],
            ['mal_eval_rot',    'Eval + ROT13 Backdoor',         '/eval\s*\(\s*str_rot13\s*\(/i',                                         'critical'],
            ['mal_assert_b64',  'Assert + Base64',               '/assert\s*\(\s*(?:base64_decode|gzinflate|str_rot13)/i',               'critical'],
            ['mal_preg_e',      'preg_replace /e modifier',     '/preg_replace\s*\(\s*["\']\/.*\/e["\']/',                              'critical'],
            ['mal_create_func', 'create_function Backdoor',      '/create_function\s*\(\s*[\'"][^\']*[\'"]\s*,\s*(?:base64|gzip|eval)/i', 'critical'],
            ['mal_hex_exec',    'Hex-Encoded Execution',         '/(?:chr|hex2bin)\s*\(\s*(?:0x[0-9a-f]+|\d+)\s*\).*(?:eval|exec|system)/i', 'high'],
            ['mal_obfusc_var',  'Obfuscated Variable Execution', '/\$\{[\'"][a-z_]\w*[\'"]\}\s*(?:\(|=)/i',                               'high'],
            ['mal_webshell_b',  'b374k / WSO Webshell',         '/(?:b374k|wso shell|c99shell|r57shell|php shell|phpshell)/i',           'critical'],
            ['mal_china_chopr', 'China Chopper Webshell',       '/\$_(?:GET|POST|REQUEST|COOKIE)\s*\[\s*[\'"][^\'"]+[\'"]\s*\]\s*\(\s*\$_(?:GET|POST|REQUEST|COOKIE)/i', 'critical'],
            ['mal_crypto',      'Crypto Miner',                  '/(?:xmrig|stratum\+tcp|monero|coinhive|cryptoloot|webminepool)/i',      'critical'],
            ['mal_redirect',    'Malicious Redirect Injection',  '/header\s*\(\s*["\'\']location:\s*https?:\/\/(?!(?:[\w-]+\.)*'.$host.')/i', 'high'],
            ['mal_base64_long', 'Long Base64 String (>500 chars)', '/[A-Za-z0-9+\/=]{500,}/i',                                            'medium'],
            ['mal_php_upload',  'PHP in Uploads Directory',      '/\<\?php/i',                                                            'critical'],
            ['mal_skimmer',     'Credit Card Skimmer Pattern',   '/(?:cc_num|card_number|cvv|credit_card).*(?:btoa|atob|fetch|XMLHttpRequest)/i', 'critical'],
            ['mal_iframe',      'Hidden Iframe Injection',       '/<iframe[^>]+style\s*=\s*["\'\'][^"\']*(?:display\s*:\s*none|visibility\s*:\s*hidden|width\s*:\s*0)/i', 'high'],
        ];

        return self::$signatures_cache;
    }

    /** WordPress core files that should NEVER be modified */
    private const CRITICAL_FILES = [
        'wp-login.php', 'wp-config.php', 'wp-settings.php',
        'wp-includes/functions.php', 'wp-includes/class-wp.php',
        'wp-includes/wp-db.php', 'wp-admin/index.php',
    ];

    public static function init(): void
    {
        // Register cron schedule
        add_action('aswp_run_scan_batch', [__CLASS__, 'run_batch']);
        add_action('aswp_run_db_scan', [__CLASS__, 'run_db_scan']);

        add_action('wp_ajax_aswp_start_scan', [__CLASS__, 'ajax_start_scan']);
        add_action('wp_ajax_aswp_scan_status', [__CLASS__, 'ajax_scan_status']);
        add_action('wp_ajax_aswp_export_findings', [__CLASS__, 'ajax_export_findings']);
        add_action('wp_ajax_aswp_get_scan_results', [__CLASS__, 'ajax_scan_results']);
        add_action('wp_ajax_aswp_quarantine_file', [__CLASS__, 'ajax_quarantine']);

        // Watch for file writes in uploads
        add_action('add_attachment', [__CLASS__, 'check_uploaded_file']);
    }

    // ── Scan batch (called by cron OR by ajax_scan_status polling) ─────────────
    public static function run_batch(): void
    {
        $state = get_option('aswp_scan_state', []);
        if (($state['status'] ?? '') === 'complete') {
            return;
        }

        $batch_size = (int) get_option('aswp_scan_files_per_batch', 50);
        $offset = (int) ($state['offset'] ?? 0);
        $scan_id = $state['scan_id'] ?? self::new_scan_id();

        // Build file list if not yet gathered (cron path)
        $all_files = get_option('aswp_scan_files_list', []);
        if (empty($all_files) && $offset === 0) {
            $all_files = self::gather_files();
            update_option('aswp_scan_files_list', $all_files, false);
            $state['total'] = count($all_files);
            update_option('aswp_scan_state', $state, false);
        }

        $batch = array_slice($all_files, $offset, $batch_size);
        if (empty($batch) && $offset >= count($all_files)) {
            // Edge case: no files left but status wasn't set
            $state['status'] = 'complete';
            $state['completed'] = time();
            update_option('aswp_scan_state', $state, false);

            return;
        }

        $found = 0;
        foreach ($batch as $file) {
            $found += self::scan_file($file, $scan_id);
        }

        $new_offset = $offset + count($batch);
        $state = get_option('aswp_scan_state', []);
        $state['offset'] = $new_offset;
        $state['found'] = ($state['found'] ?? 0) + $found;

        if ($new_offset >= count($all_files)) {
            // File scan complete — run DB scan immediately
            $state['completed'] = time();
            $state['status'] = 'complete';
            update_option('aswp_last_scan_completed', current_time('mysql'));

            // Run database scan synchronously (fast)
            self::run_db_scan();

            // Notify if threats found
            if ($state['found'] > 0) {
                self::notify_threats($state['found'], $scan_id);
            }
        } else {
            $state['status'] = 'running';
        }

        update_option('aswp_scan_state', $state, false);
    }

    // ── Database scan ─────────────────────────────────────────────────────────
    public static function run_db_scan(): void
    {
        global $wpdb;
        $results = [];

        // Scan wp_options for PHP code / suspicious URLs
        // These REGEXP patterns are hardcoded constants (not user input), wrapped in prepare for best practice.
        // Exclude WP core transients that legitimately contain code-like strings.
        $exclude_options = ['cron', '_site_transient_'.'update_plugins', '_site_transient_'.'update_themes'];
        $placeholders = implode(', ', array_fill(0, count($exclude_options), '%s'));

        // phpcs:disable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter,WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- $placeholders is dynamically generated from array_fill(%s), total matches; security data must not be served from cache
        $dangerous_options = $wpdb->get_results($wpdb->prepare(
            "SELECT option_name, SUBSTRING(option_value, 1, 500) AS option_value
               FROM {$wpdb->options}
              WHERE option_value REGEXP %s
                AND option_name NOT IN ($placeholders)
              LIMIT %d",
            array_merge(
                ['(<\\?php|eval\\\\(|base64_decode|document\\.write|<iframe)'],
                $exclude_options,
                [50]
            )
        ));
        // phpcs:enable WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter,WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
        foreach ($dangerous_options as $row) {
            $results[] = [
                'type'     => 'db_option',
                'location' => 'wp_options: '.$row->option_name,
                'snippet'  => $row->option_value,
                'severity' => 'high',
            ];
        }

        // Scan wp_posts for injected iframes / scripts
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $dangerous_posts = $wpdb->get_results($wpdb->prepare(
            "SELECT ID, post_title, SUBSTRING(post_content, 1, 300) AS snippet
               FROM {$wpdb->posts}
              WHERE post_status NOT IN ('trash', 'auto-draft')
                AND post_content REGEXP %s
              LIMIT %d",
            '(<iframe|<script[^>]*src=|eval\\\\(|document\\.write)',
            30
        ));
        foreach ($dangerous_posts as $row) {
            $results[] = [
                'type'     => 'db_post',
                'location' => 'wp_posts ID='.$row->ID.' ('.$row->post_title.')',
                'snippet'  => $row->snippet,
                'severity' => 'high',
            ];
        }

        // Scan for rogue admin users created recently
        $admin_cutoff = wp_date('Y-m-d H:i:s', time() - 7 * DAY_IN_SECONDS);
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $rogue_admins = $wpdb->get_results($wpdb->prepare(
            "SELECT u.ID, u.user_login, u.user_email, u.user_registered
               FROM {$wpdb->users} u
               JOIN {$wpdb->usermeta} m ON u.ID = m.user_id
              WHERE m.meta_key = %s
                AND m.meta_value LIKE %s
                AND u.user_registered > %s
              ORDER BY u.user_registered DESC",
            $wpdb->prefix.'capabilities',
            '%administrator%',
            $admin_cutoff
        ));
        $known_admins = get_option('aswp_known_admin_ids', []);
        foreach ($rogue_admins as $admin) {
            if (!in_array($admin->ID, (array) $known_admins, true)) {
                $results[] = [
                    'type'     => 'db_user',
                    'location' => 'New admin: '.$admin->user_login.' ('.$admin->user_email.')',
                    'snippet'  => 'Registered: '.$admin->user_registered,
                    'severity' => 'critical',
                ];
            }
        }

        if (!empty($results)) {
            $existing = get_option('aswp_scan_db_results', []);
            update_option('aswp_scan_db_results', array_merge($existing, $results), false);
            self::notify_threats(count($results), 'db_scan', 'database');
        }

        update_option('aswp_last_db_scan', current_time('mysql'));
    }

    // ── Scan a single file ─────────────────────────────────────────────────────
    private static function scan_file(string $file, string $scan_id): int
    {
        if (!is_readable($file) || is_dir($file)) {
            return 0;
        }
        if (filesize($file) > 5 * 1024 * 1024) {
            return 0;
        } // skip >5MB

        $content = @file_get_contents($file);
        if ($content === false) {
            return 0;
        }

        $found = 0;
        $in_uploads = str_contains($file, 'wp-content/uploads') || str_contains($file, 'wp-content'.DIRECTORY_SEPARATOR.'uploads');

        // Only apply php_upload signature to uploads directory
        $sigs_to_check = self::get_signatures();
        if (!$in_uploads) {
            $sigs_to_check = array_filter($sigs_to_check, fn ($s) => $s[0] !== 'mal_php_upload');
        }

        foreach ($sigs_to_check as [$sig_id, $name, $pattern, $severity]) {
            if (preg_match($pattern, $content, $matches)) {
                self::log_finding(
                    $scan_id,
                    $file,
                    $sig_id,
                    $name,
                    $severity,
                    isset($matches[0]) ? substr($matches[0], 0, 200) : ''
                );
                $found++;
                break; // One finding per file per scan pass
            }
        }

        return $found;
    }

    private static function log_finding(string $scan_id, string $file, string $sig_id, string $name, string $severity, string $snippet): void
    {
        $findings = get_option('aswp_scan_findings', []);
        $findings[] = [
            'scan_id'   => $scan_id,
            'file'      => str_replace(ABSPATH, '', $file),
            'sig_id'    => $sig_id,
            'sig_name'  => $name,
            'severity'  => $severity,
            'snippet'   => $snippet,
            'found_at'  => current_time('mysql'),
            'status'    => 'open',
        ];
        // Keep last 200 findings
        if (count($findings) > 200) {
            $findings = array_slice($findings, -200);
        }
        update_option('aswp_scan_findings', $findings, false);

        // Also write to events table for dashboard
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix.'aswp_events',
            [
                'event_type'  => 'malware_found',
                'severity'    => $severity,
                'ip'          => '',
                'url'         => str_replace(ABSPATH, '/', $file),
                'rule_id'     => $sig_id,
                'description' => "Malware detected: $name in ".str_replace(ABSPATH, '', $file),
                'created_at'  => current_time('mysql'),
            ],
            ['%s', '%s', '%s', '%s', '%s', '%s', '%s']
        );
    }

    // ── File gathering ─────────────────────────────────────────────────────────
    private static function gather_files(): array
    {
        $files = [];
        $dirs = [];

        if (get_option('aswp_scan_core', true)) {
            $dirs[] = ABSPATH.'wp-admin/';
            $dirs[] = ABSPATH.'wp-includes/';
            // Root PHP files
            foreach (glob(ABSPATH.'*.php') ?: [] as $f) {
                $files[] = $f;
            }
        }
        if (get_option('aswp_scan_plugins', true)) {
            $dirs[] = wp_normalize_path(WP_PLUGIN_DIR).'/';
        }
        if (get_option('aswp_scan_themes', true)) {
            $dirs[] = wp_normalize_path(get_theme_root()).'/';
        }
        if (get_option('aswp_scan_uploads', true)) {
            $dirs[] = wp_upload_dir()['basedir'].'/';
        }
        $dirs[] = wp_normalize_path(WPMU_PLUGIN_DIR).'/';

        $content_dir = trailingslashit(wp_normalize_path(WP_CONTENT_DIR)); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- filesystem path for scan exclusion
        $exclude = [$content_dir.'cache/', $content_dir.'upgrade/'];

        foreach ($dirs as $dir) {
            if (!is_dir($dir)) {
                continue;
            }
            $iter = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS)
            );
            foreach ($iter as $file) {
                $path = $file->getPathname();
                // Skip excluded
                $skip = false;
                foreach ($exclude as $ex) {
                    if (str_starts_with($path, $ex)) {
                        $skip = true;
                        break;
                    }
                }
                if ($skip) {
                    continue;
                }
                // Only scan PHP files + uploads (all types)
                $ext = strtolower($file->getExtension());
                if ($ext === 'php' || str_contains($dir, 'uploads')) {
                    $files[] = $path;
                }
            }
        }

        return array_unique($files);
    }

    // ── New attachment upload — immediate check ────────────────────────────────
    public static function check_uploaded_file(int $attachment_id): void
    {
        $file = get_attached_file($attachment_id);
        if (!$file) {
            return;
        }
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

        // PHP files in uploads = immediate block + alert
        if ($ext === 'php') {
            global $wpdb;
            self::log_finding('upload_check', $file, 'mal_php_upload', 'PHP File Uploaded', 'critical', 'PHP file uploaded to media library');
            // Delete the attachment
            wp_delete_attachment($attachment_id, true);
            \FortressWP\modules\Notifications::send_alert(
                'PHP File Upload Blocked',
                "A PHP file was uploaded to the media library and has been removed.\nFile: $file",
                'critical'
            );
        }
    }

    // ── Quarantine a file ──────────────────────────────────────────────────────
    public static function ajax_quarantine(): void
    {
        check_ajax_referer('aswp_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error([], 403);
        }

        $file = isset($_POST['file']) ? sanitize_text_field(wp_unslash($_POST['file'])) : '';
        $full = ABSPATH.ltrim($file, '/');

        if (!file_exists($full)) {
            wp_send_json_error(['message' => 'File not found.']);
        }

        // Prevent path traversal — resolved path must stay within ABSPATH
        $real_path = realpath($full);
        $real_abspath = rtrim((string) realpath(ABSPATH), DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
        if (!$real_path || !$real_abspath || !str_starts_with($real_path.DIRECTORY_SEPARATOR, $real_abspath)) {
            wp_send_json_error(['message' => 'Invalid file path.']);
        }
        $full = $real_path;

        $quarantine_dir = wp_upload_dir()['basedir'].'/aswp-quarantine/';
        wp_mkdir_p($quarantine_dir);

        // Protect the quarantine dir from web access — use WP_Filesystem.
        require_once ABSPATH.'wp-admin/includes/file.php';
        global $wp_filesystem;
        if (!$wp_filesystem) {
            WP_Filesystem();
        }
        if ($wp_filesystem) {
            $wp_filesystem->put_contents($quarantine_dir.'.htaccess', 'Deny from all', FS_CHMOD_FILE);
            $wp_filesystem->put_contents($quarantine_dir.'index.php', '<?php // Silence', FS_CHMOD_FILE);
        }

        $dest = $quarantine_dir.basename($full).'_'.time().'.quarantine';
        if ($wp_filesystem && $wp_filesystem->move($full, $dest)) {
            // Mark finding as quarantined
            $findings = get_option('aswp_scan_findings', []);
            foreach ($findings as &$f) {
                if ($f['file'] === $file) {
                    $f['status'] = 'quarantined';
                }
            }
            update_option('aswp_scan_findings', $findings, false);
            wp_send_json_success(['message' => 'File quarantined successfully.']);
        } else {
            wp_send_json_error(['message' => 'Could not move file. Check permissions.']);
        }
    }

    // ── AJAX: Start a manual scan ──────────────────────────────────────────────
    public static function ajax_start_scan(): void
    {
        check_ajax_referer('aswp_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error([], 403);
        }

        $scan_id = self::new_scan_id();

        // Reset findings
        update_option('aswp_scan_findings', [], false);
        update_option('aswp_scan_db_results', [], false);

        // Gather files list upfront so we know the total immediately
        $files = self::gather_files();
        update_option('aswp_scan_files_list', $files, false);
        update_option('aswp_scan_state', [
            'scan_id' => $scan_id,
            'offset'  => 0,
            'total'   => count($files),
            'found'   => 0,
            'status'  => 'running',
            'started' => time(),
        ], false);

        // Run the first batch synchronously so progress starts immediately
        self::run_batch();

        $state = get_option('aswp_scan_state', []);
        wp_send_json_success([
            'message' => 'Scan started — '.count($files).' files to scan.',
            'state'   => $state,
        ]);
    }

    // ── AJAX: Scan status (also drives the scan forward) ─────────────────────
    public static function ajax_scan_status(): void
    {
        check_ajax_referer('aswp_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error([], 403);
        }

        $state = get_option('aswp_scan_state', []);

        // If the scan is still running, process the next batch now.
        // This makes scanning reliable regardless of wp-cron availability.
        if (($state['status'] ?? '') === 'running') {
            self::run_batch();
            $state = get_option('aswp_scan_state', []);
        }

        wp_send_json_success([
            'state'     => $state,
            'pct'       => ($state['total'] ?? 0) > 0
                            ? round(($state['offset'] ?? 0) / $state['total'] * 100)
                            : 0,
        ]);
    }

    // ── AJAX: Get findings ─────────────────────────────────────────────────────
    public static function ajax_scan_results(): void
    {
        check_ajax_referer('aswp_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error([], 403);
        }

        $findings = get_option('aswp_scan_findings', []);
        $db_findings = get_option('aswp_scan_db_results', []);

        wp_send_json_success([
            'file_findings'  => array_reverse($findings),
            'db_findings'    => array_reverse($db_findings),
            'last_scan'      => get_option('aswp_last_scan_completed', null),
            'last_db_scan'   => get_option('aswp_last_db_scan', null),
            'state'          => get_option('aswp_scan_state', []),
        ]);
    }

    private static function new_scan_id(): string
    {
        return 'scan_'.wp_date('Ymd_His').'_'.wp_generate_password(6, false);
    }

    private static function notify_threats(int $count, string $scan_id, string $area = 'filesystem'): void
    {
        Notifications::send_alert(
            "⚠️ Atlant Security: $count threat(s) detected",
            "The malware scanner found $count threat(s) in your $area.\n\nScan ID: $scan_id\n\nLog in to your WordPress admin to review and take action.",
            'critical'
        );
    }

    // ── CSV export of scan findings ────────────────────────────────────────
    //
    // The Findings tables in the admin UI intentionally truncate long fields
    // (file paths, matched content, SQL snippets) so the table stays readable.
    // That makes it hard to research a hit before quarantining it.
    //
    // This handler streams the FULL, untruncated findings as a CSV download
    // so admins can open the file in Excel/Numbers/Google Sheets, paste paths
    // into their editor, grep matched strings, or send the file to a security
    // consultant — all BEFORE committing to Quarantine.
    //
    // Two exports are supported via the `kind` query arg:
    //   - "file" → file_findings   (path, rule, matched snippet, severity, time)
    //   - "db"   → db_findings     (location, type, details, severity, time)
    //
    // Output is RFC 4180 CSV with a UTF-8 BOM so Excel opens non-ASCII paths
    // correctly on Windows.
    public static function ajax_export_findings(): void
    {
        check_ajax_referer('aswp_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('Unauthorized.', 'atlant-security'), '', ['response' => 403]);
        }

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- nonce verified immediately above
        $kind = isset($_GET['kind']) ? sanitize_key(wp_unslash($_GET['kind'])) : 'file';
        if (!in_array($kind, ['file', 'db'], true)) {
            $kind = 'file';
        }

        // Audit the export — it IS sensitive (full file paths + match text).
        self::audit_export($kind);

        // Prevent any caching layer from serving stale or partial downloads.
        nocache_headers();

        $host = (string) wp_parse_url(home_url(), PHP_URL_HOST);
        $date_str = wp_date('Y-m-d_His');
        $filename = sprintf('atlant-scan-%s-findings-%s-%s.csv', $kind, sanitize_file_name($host), $date_str);

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="'.$filename.'"');
        header('X-Content-Type-Options: nosniff');

        $out = fopen('php://output', 'wb');
        if (false === $out) {
            wp_die(esc_html__('Could not open output stream.', 'atlant-security'));
        }

        // UTF-8 BOM so Excel auto-detects the encoding.
        fwrite($out, "\xEF\xBB\xBF");

        if ('db' === $kind) {
            $rows = (array) get_option('aswp_scan_db_results', []);
            fputcsv($out, ['severity', 'type', 'location', 'details', 'found_at']);
            foreach (array_reverse($rows) as $row) {
                if (!is_array($row)) {
                    continue;
                }
                fputcsv($out, [
                    (string) ($row['severity'] ?? ''),
                    (string) ($row['type'] ?? ''),
                    (string) ($row['location'] ?? ''),
                    (string) ($row['snippet'] ?? $row['details'] ?? ''),
                    (string) ($row['found_at'] ?? ''),
                ]);
            }
        } else {
            $rows = (array) get_option('aswp_scan_findings', []);
            fputcsv($out, ['severity', 'file', 'signature_id', 'signature_name', 'matched_snippet', 'found_at', 'status', 'scan_id']);
            foreach (array_reverse($rows) as $row) {
                if (!is_array($row)) {
                    continue;
                }
                fputcsv($out, [
                    (string) ($row['severity'] ?? ''),
                    (string) ($row['file'] ?? ''),
                    (string) ($row['sig_id'] ?? ''),
                    (string) ($row['sig_name'] ?? ''),
                    (string) ($row['snippet'] ?? ''),
                    (string) ($row['found_at'] ?? ''),
                    (string) ($row['status'] ?? 'open'),
                    (string) ($row['scan_id'] ?? ''),
                ]);
            }
        }

        fclose($out);
        exit;
    }

    /**
     * Log CSV exports to the audit trail — file paths and matched strings
     * are sensitive enough that access should leave a breadcrumb.
     */
    private static function audit_export(string $kind): void
    {
        global $wpdb;
        $user = wp_get_current_user();
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- audit trail, not cacheable
        $wpdb->insert(
            $wpdb->prefix.'aswp_audit_log',
            [
                'user_id'     => (int) $user->ID,
                'username'    => (string) $user->user_login,
                'action'      => 'scan_export_csv',
                'object_type' => 'scan_findings',
                'object_id'   => $kind,
                'description' => sprintf('Exported %s scan findings to CSV.', 'db' === $kind ? 'database' : 'file'),
                'ip'          => class_exists('\\FortressWP\\RequestLogger') ? \FortressWP\RequestLogger::get_real_ip() : '',
                'created_at'  => current_time('mysql'),
            ],
            ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
        );
    }
}

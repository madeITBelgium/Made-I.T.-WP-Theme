<?php

namespace MadeIT\Security;

defined('ABSPATH') || exit;

/**
 * GeoIP country lookup using MaxMind GeoLite2-Country MMDB database.
 *
 * Handles lazy reader initialization, IP-to-country lookups,
 * database download/update, and AJAX endpoints for the admin UI.
 */
class GeoIP
{
    private static ?self $instance = null;
    private ?MaxMindReader $reader = null;
    private bool  $init_attempted = false;
    private bool  $available = false;

    /** Suppress repeated error logging — max once per hour. */
    private const ERROR_LOG_TRANSIENT = 'madeit_security_geoip_error_logged';

    public static function instance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct()
    {
    }

    // ── Primary Lookup ───────────────────────────────────────────────────

    /**
     * Resolve IP address to 2-letter ISO 3166-1 country code.
     *
     * @param string $ip IPv4 or IPv6 address.
     *
     * @return string 2-letter country code (e.g. 'US', 'DE') or '' if unknown.
     */
    public function country(string $ip): string
    {
        if (!$this->ensure_reader()) {
            return '';
        }

        try {
            $record = $this->reader->get($ip);
            if (is_array($record) && isset($record['country']['iso_code'])) {
                return strtoupper((string) $record['country']['iso_code']);
            }

            // Some IPs (like private ranges) have no country record
            return '';
        } catch (\Throwable $e) {
            $this->log_error_throttled('Lookup failed for '.$ip.': '.$e->getMessage());

            return '';
        }
    }

    // ── Reader Management ────────────────────────────────────────────────

    /**
     * Lazily initialize the MMDB reader. Returns true if available.
     */
    private function ensure_reader(): bool
    {
        if ($this->init_attempted) {
            return $this->available;
        }
        $this->init_attempted = true;

        $path = self::db_path();
        if (!is_file($path)) {
            return false;
        }

        try {
            $this->reader = new MaxMindReader($path);
            $this->available = true;

            return true;
        } catch (\Throwable $e) {
            $this->log_error_throttled('Cannot open MMDB: '.$e->getMessage());

            return false;
        }
    }

    // ── Database Path & Info ─────────────────────────────────────────────

    /**
     * Full filesystem path to the MMDB file.
     */
    public static function db_path(): string
    {
        $upload_dir = wp_upload_dir();

        return $upload_dir['basedir'].'/madeit-security-geoip/GeoLite2-Country.mmdb';
    }

    /**
     * Directory containing the MMDB file.
     */
    public static function db_dir(): string
    {
        $upload_dir = wp_upload_dir();

        return $upload_dir['basedir'].'/madeit-security-geoip';
    }

    /**
     * Check if the MMDB database file exists.
     */
    public static function db_exists(): bool
    {
        return is_file(self::db_path());
    }

    /**
     * Return info about the current database file.
     *
     * @return array{exists: bool, size: int, modified: string, build: string, type: string}
     */
    public static function db_info(): array
    {
        $path = self::db_path();
        $info = [
            'exists'   => false,
            'size'     => 0,
            'size_h'   => '',
            'modified' => '',
            'build'    => '',
            'type'     => '',
        ];

        if (!is_file($path)) {
            return $info;
        }

        $info['exists'] = true;
        $info['size'] = (int) filesize($path);
        $info['size_h'] = size_format($info['size'], 1);
        $info['modified'] = gmdate('Y-m-d H:i:s', filemtime($path));

        try {
            $reader = new MaxMindReader($path);
            $meta = $reader->metadata();
            $reader->close();

            $info['type'] = $meta['db_type'] ?? '';
            $info['build'] = $meta['build_epoch']
                ? gmdate('Y-m-d', $meta['build_epoch'])
                : '';
        } catch (\Throwable $e) {
            // DB file exists but is corrupt
            $info['type'] = 'error: '.$e->getMessage();
        }

        return $info;
    }

    // ── Download & Update ────────────────────────────────────────────────

    /**
     * Download GeoLite2-Country database from MaxMind.
     *
     * @return array{success: bool, message: string}
     */
    public static function download_db(): array
    {
        // Ensure target directory exists before streaming download
        $dir = self::db_dir();
        if (!is_dir($dir)) {
            wp_mkdir_p($dir);
            file_put_contents($dir.'/.htaccess', "Order Deny,Allow\nDeny from all\n");
        }

        // Build download URL
        $url = add_query_arg([
            'home_url' => home_url(),
        ], 'https://portal.madeit.be/api/downloads/maxmind/geolite2-country');

        // Download archive
        $response = wp_remote_get($url, [
            'timeout'   => 120,
            'sslverify' => true,
            'stream'    => true,
            'filename'  => self::temp_archive_path(),
        ]);

        if (is_wp_error($response)) {
            self::cleanup_temp();

            return ['success' => false, 'message' => 'Download failed: '.$response->get_error_message()];
        }

        $code = wp_remote_retrieve_response_code($response);
        if ($code === 401) {
            self::cleanup_temp();

            return ['success' => false, 'message' => 'Invalid license key (HTTP 401). Check your MaxMind account.'];
        }
        if ($code !== 200) {
            self::cleanup_temp();

            return ['success' => false, 'message' => "Download failed with HTTP $code."];
        }

        // Extract .mmdb from tar.gz archive
        $result = self::extract_mmdb();
        self::cleanup_temp();

        if ($result['success']) {
            update_option('madeit_security_geoip_last_updated', gmdate('Y-m-d H:i:s'));

            // Reset singleton reader so next lookup uses new file
            if (self::$instance) {
                if (self::$instance->reader) {
                    self::$instance->reader->close();
                    self::$instance->reader = null;
                }
                self::$instance->init_attempted = false;
                self::$instance->available = false;
            }
        }

        return $result;
    }

    /**
     * Extract the .mmdb file from the downloaded tar.gz archive.
     *
     * @return array{success: bool, message: string}
     */
    private static function extract_mmdb(): array
    {
        $archive = self::temp_archive_path();
        if (!is_file($archive)) {
            return ['success' => false, 'message' => 'Archive file not found.'];
        }

        // Ensure target directory exists
        $dir = self::db_dir();
        if (!is_dir($dir)) {
            wp_mkdir_p($dir);
            // Protect directory from web access
            file_put_contents($dir.'/.htaccess', "Order Deny,Allow\nDeny from all\n");
            file_put_contents($dir.'/index.php', '<?php // silence');
        }

        try {
            $phar = new \PharData($archive);
            $mmdb_found = false;

            foreach (new \RecursiveIteratorIterator($phar) as $file) {
                if (substr($file->getFilename(), -5) === '.mmdb') {
                    $contents = file_get_contents($file->getPathname());
                    if ($contents === false) {
                        return ['success' => false, 'message' => 'Cannot read .mmdb from archive.'];
                    }
                    $written = file_put_contents(self::db_path(), $contents);
                    if ($written === false) {
                        return ['success' => false, 'message' => 'Cannot write .mmdb to disk. Check permissions on wp-content/uploads/.'];
                    }
                    $mmdb_found = true;
                    break;
                }
            }

            if (!$mmdb_found) {
                return ['success' => false, 'message' => 'No .mmdb file found inside the archive.'];
            }

            // Validate the extracted file
            try {
                $reader = new MaxMindReader(self::db_path());
                $meta = $reader->metadata();
                $reader->close();

                return [
                    'success' => true,
                    'message' => sprintf(
                        'GeoLite2 %s database installed (%s, built %s).',
                        $meta['db_type'] ?? 'Country',
                        size_format(filesize(self::db_path()), 1),
                        $meta['build_epoch'] ? gmdate('Y-m-d', $meta['build_epoch']) : 'unknown'
                    ),
                ];
            } catch (\Throwable $e) {
                wp_delete_file(self::db_path());

                return ['success' => false, 'message' => 'Downloaded file is not a valid MMDB: '.$e->getMessage()];
            }
        } catch (\Throwable $e) {
            return ['success' => false, 'message' => 'Archive extraction failed: '.$e->getMessage()];
        }
    }

    private static function temp_archive_path(): string
    {
        return self::db_dir().'/geolite2-country.tar.gz';
    }

    private static function cleanup_temp(): void
    {
        $tmp = self::temp_archive_path();
        if (is_file($tmp)) {
            wp_delete_file($tmp);
        }
        // PharData may create a decompressed .tar
        $tar = self::db_dir().'/geolite2-country.tar';
        if (is_file($tar)) {
            wp_delete_file($tar);
        }
    }

    // ── Cron Auto-Update ─────────────────────────────────────────────────

    /**
     * Weekly cron callback to update the database.
     */
    public static function cron_update(): void
    {
        if (!get_option('madeit_security_geoip_auto_update', true)) {
            return;
        }
        $result = self::download_db();

        if (!$result['success'] && defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[MADEIT_SECURITY] GeoIP auto-update failed: '.$result['message']); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- guarded by WP_DEBUG
        }
    }

    // ── AJAX Endpoints ───────────────────────────────────────────────────

    /**
     * AJAX: Download/update GeoIP database.
     */
    public static function ajax_download(): void
    {
        check_ajax_referer('madeit_security_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized.'], 403);
        }

        $result = self::download_db();
        if ($result['success']) {
            wp_send_json_success([
                'message' => $result['message'],
                'db_info' => self::db_info(),
            ]);
        } else {
            wp_send_json_error(['message' => $result['message']]);
        }
    }

    /**
     * AJAX: Test IP lookup.
     */
    public static function ajax_test_lookup(): void
    {
        check_ajax_referer('madeit_security_nonce', 'nonce');
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized.'], 403);
        }

        $ip = isset($_POST['ip']) ? sanitize_text_field(wp_unslash($_POST['ip'])) : '';
        if (empty($ip) || !filter_var($ip, FILTER_VALIDATE_IP)) {
            wp_send_json_error(['message' => 'Invalid IP address.']);
        }

        if (!self::db_exists()) {
            wp_send_json_error(['message' => 'GeoIP database not installed. Download it first.']);
        }

        $geo = self::instance();
        $country = $geo->country($ip);

        wp_send_json_success([
            'ip'      => $ip,
            'country' => $country ?: '(not found)',
        ]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    /**
     * Log an error at most once per hour to avoid flooding.
     */
    private function log_error_throttled(string $message): void
    {
        if (get_transient(self::ERROR_LOG_TRANSIENT)) {
            return;
        }
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[MADEIT_SECURITY] GeoIP: '.$message); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log -- throttled + guarded by WP_DEBUG
        }
        set_transient(self::ERROR_LOG_TRANSIENT, 1, HOUR_IN_SECONDS);
    }
}

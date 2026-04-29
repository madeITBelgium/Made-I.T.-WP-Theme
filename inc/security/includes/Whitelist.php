<?php
namespace MadeIT\Security;

defined( 'ABSPATH' ) || exit;

/**
 * Central whitelist checker.
 * Cached per-request in a static array so we only hit the DB once per IP.
 * Called at the TOP of every security module before any blocking logic.
 */
class Whitelist {

    /** Per-request in-memory cache: ip => bool */
    private static array $cache = [];

    /** Grace period: always allow the currently logged-in admin's IP */
    private static ?bool $admin_grace = null;

    // ── Primary check ──────────────────────────────────────────────────────────
    /**
     * Returns true if this IP should bypass ALL security checks.
     */
    public static function is_allowed( string $ip ): bool {
        if ( isset( self::$cache[ $ip ] ) ) {
            return self::$cache[ $ip ];
        }

        // 1. Explicit whitelist table
        if ( self::in_whitelist_table( $ip ) ) {
            return self::$cache[ $ip ] = true;
        }

        // 2. Localhost / loopback — only auto-whitelisted when the site is
        //    actually running behind no proxy. On hosts where REMOTE_ADDR is
        //    always 127.0.0.1 because nginx/Apache/Cloudflare sits in front,
        //    auto-whitelisting loopback is a lockpick: every visitor looks
        //    like the server. Skip the auto-allow when ANY proxy config is
        //    configured (Cloudflare integration on, or trusted proxies set).
        if ( in_array( $ip, [ '127.0.0.1', '::1', 'localhost' ], true )
            && ! self::has_proxy_configured() ) {
            return self::$cache[ $ip ] = true;
        }

        // 3. Admin grace: if LOGGED-IN user is administrator, bypass IP blocks (not WAF)
        //    Configurable — can be disabled via madeit_security_whitelist_admin_grace option
        if ( get_option( 'madeit_security_whitelist_admin_grace', true ) && self::is_admin_ip() ) {
            return self::$cache[ $ip ] = true;
        }

        // 4. Trust Cloudflare IPs if integration enabled
        if ( get_option( 'madeit_security_cloudflare_integration', false ) && self::is_cloudflare_ip( $ip ) ) {
            return self::$cache[ $ip ] = true;
        }

        // 5. Trust Google IPs (Cloud, services, crawlers) if integration enabled
        if ( get_option( 'madeit_security_google_integration', false ) && self::is_google_ip( $ip ) ) {
            return self::$cache[ $ip ] = true;
        }

        // 6. Trust Microsoft IPs (Azure, Bing, Office) if integration enabled
        if ( get_option( 'madeit_security_microsoft_integration', false ) && self::is_microsoft_ip( $ip ) ) {
            return self::$cache[ $ip ] = true;
        }

        return self::$cache[ $ip ] = false;
    }

    // ── DB lookup ──────────────────────────────────────────────────────────────
    private static function in_whitelist_table( string $ip ): bool {
        global $wpdb;

        // Safety: table might not exist if activation hook failed
        static $table_exists = null;
        if ( $table_exists === null ) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
            $table_exists = (bool) $wpdb->get_var(
                $wpdb->prepare( "SHOW TABLES LIKE %s", $wpdb->prefix . 'madeit_security_whitelist' )
            );
        }
        if ( ! $table_exists ) return false;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        return (bool) $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}madeit_security_whitelist
            WHERE type = 'ip'
                AND value = %s
            LIMIT 1",
            $ip
        ) );
    }

    /**
     * True when the site is configured to sit behind a reverse proxy / CDN.
     * When this is true, REMOTE_ADDR frequently equals a loopback or private
     * address and must NOT be treated as trusted.
     */
    private static function has_proxy_configured(): bool {
        if ( get_option( 'madeit_security_cloudflare_integration', false ) ) return true;

        $trusted_raw = get_option( 'madeit_security_trust_proxy_ips', '' );
        if ( is_string( $trusted_raw ) ) {
            return trim( $trusted_raw ) !== '';
        }
        return is_array( $trusted_raw ) && ! empty( array_filter( $trusted_raw ) );
    }

    // ── Admin grace ────────────────────────────────────────────────────────────
    private static function is_admin_ip(): bool {
        if ( self::$admin_grace !== null ) return self::$admin_grace;

        // Only meaningful after WordPress auth runs
        if ( ! function_exists( 'is_user_logged_in' ) ) {
            return self::$admin_grace = false;
        }

        if ( is_user_logged_in() && current_user_can( 'manage_options' ) ) {
            return self::$admin_grace = true;
        }

        return self::$admin_grace = false;
    }

    // ── Cloudflare IP ranges ───────────────────────────────────────────────────

    /** Hardcoded fallback — used when remote fetch fails or hasn't run yet. */
    private const CF_IPV4_FALLBACK = [
        '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
        '104.16.0.0/13',   '104.24.0.0/14',   '108.162.192.0/18',
        '131.0.72.0/22',   '141.101.64.0/18',  '162.158.0.0/15',
        '172.64.0.0/13',   '173.245.48.0/20',  '188.114.96.0/20',
        '190.93.240.0/20', '197.234.240.0/22', '198.41.128.0/17',
    ];
    private const CF_IPV6_FALLBACK = [
        '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32',
        '2405:b500::/32', '2405:8100::/32', '2a06:98c0::/29',
        '2c0f:f248::/32',
    ];

    public static function is_cloudflare_ip( string $ip ): bool {
        $ranges = self::get_cloudflare_ranges();
        foreach ( $ranges as $range ) {
            if ( self::ip_in_cidr( $ip, $range ) ) return true;
        }
        return false;
    }

    /**
     * Returns cached Cloudflare IP ranges (IPv4 + IPv6).
     * Fetched weekly via cron; falls back to hardcoded list.
     */
    public static function get_cloudflare_ranges(): array {
        $cached = get_transient( 'madeit_security_cloudflare_ip_ranges' );
        if ( is_array( $cached ) && ! empty( $cached ) ) {
            return $cached;
        }
        return array_merge( self::CF_IPV4_FALLBACK, self::CF_IPV6_FALLBACK );
    }

    /**
     * Fetches current Cloudflare IP ranges from their official endpoints.
     * Called by weekly cron hook `madeit_security_refresh_cloudflare_ips`.
     */
    public static function refresh_cloudflare_ranges(): void {
        $ranges = [];

        foreach ( [
            'https://www.cloudflare.com/ips-v4',
            'https://www.cloudflare.com/ips-v6',
        ] as $url ) {
            $response = wp_remote_get( $url, [
                'timeout'   => 10,
                'sslverify' => true,
            ] );
            if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
                continue;
            }
            $body  = wp_remote_retrieve_body( $response );
            $lines = array_filter( array_map( 'trim', explode( "\n", $body ) ) );
            foreach ( $lines as $line ) {
                // Validate each line looks like a CIDR
                if ( preg_match( '#^[\da-f.:]+/\d{1,3}$#i', $line ) ) {
                    $ranges[] = $line;
                }
            }
        }

        if ( ! empty( $ranges ) ) {
            set_transient( 'madeit_security_cloudflare_ip_ranges', $ranges, WEEK_IN_SECONDS );
        }
    }

    // ── Google IP ranges ─────────────────────────────────────────────────────

    /**
     * Major Google-owned IPv4 ranges (fallback when goog.json fetch hasn't run).
     * Source: https://www.gstatic.com/ipranges/goog.json — snapshot 2026-03.
     * Covers Google Cloud, Googlebot, Search Console, Ads, and all Google services.
     */
    private const GOOGLE_IPV4_FALLBACK = [
        '8.8.4.0/24',        '8.8.8.0/24',        '8.34.208.0/20',
        '8.35.192.0/20',     '23.236.48.0/20',     '23.251.128.0/19',
        '34.0.0.0/15',       '34.2.0.0/16',        '34.3.0.0/23',
        '34.4.0.0/14',       '34.8.0.0/13',        '34.16.0.0/12',
        '34.32.0.0/11',      '34.64.0.0/10',       '34.128.0.0/10',
        '35.184.0.0/13',     '35.192.0.0/14',      '35.196.0.0/15',
        '35.198.0.0/16',     '35.199.0.0/17',      '35.199.128.0/18',
        '35.200.0.0/13',     '35.208.0.0/12',      '35.224.0.0/12',
        '35.240.0.0/13',     '64.233.160.0/19',     '66.102.0.0/20',
        '66.249.64.0/19',    '70.32.128.0/19',      '72.14.192.0/18',
        '74.125.0.0/16',     '104.154.0.0/15',      '104.196.0.0/14',
        '104.237.160.0/19',  '107.167.160.0/19',    '107.178.192.0/18',
        '108.59.80.0/20',    '108.170.192.0/18',    '108.177.0.0/17',
        '130.211.0.0/16',    '136.112.0.0/12',      '142.250.0.0/15',
        '146.148.0.0/17',    '162.216.148.0/22',    '162.222.176.0/21',
        '172.110.32.0/21',   '172.217.0.0/16',      '172.253.0.0/16',
        '173.194.0.0/16',    '173.255.112.0/20',    '192.158.28.0/22',
        '192.178.0.0/15',    '199.36.154.0/23',     '199.36.156.0/24',
        '199.192.112.0/22',  '199.223.232.0/21',    '207.223.160.0/20',
        '208.65.152.0/22',   '208.68.108.0/22',     '208.81.188.0/22',
        '208.117.224.0/19',  '209.85.128.0/17',     '216.58.192.0/19',
        '216.239.32.0/19',
    ];
    private const GOOGLE_IPV6_FALLBACK = [
        '2001:4860::/32',    '2404:6800::/32',     '2607:f8b0::/32',
        '2800:3f0::/32',     '2a00:1450::/32',     '2c0f:fb50::/32',
    ];

    public static function is_google_ip( string $ip ): bool {
        foreach ( self::get_google_ranges() as $range ) {
            if ( self::ip_in_cidr( $ip, $range ) ) return true;
        }
        return false;
    }

    public static function get_google_ranges(): array {
        $cached = get_transient( 'madeit_security_google_ip_ranges' );
        if ( is_array( $cached ) && ! empty( $cached ) ) {
            return $cached;
        }
        return array_merge( self::GOOGLE_IPV4_FALLBACK, self::GOOGLE_IPV6_FALLBACK );
    }

    /**
     * Fetches current Google IP ranges from their official endpoint.
     * Called by weekly cron hook `madeit_security_refresh_google_ips`.
     *
     * @see https://www.gstatic.com/ipranges/goog.json
     */
    public static function refresh_google_ranges(): void {
        $response = wp_remote_get( 'https://www.gstatic.com/ipranges/goog.json', [
            'timeout'   => 15,
            'sslverify' => true,
        ] );
        if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
            return;
        }

        $data = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( ! is_array( $data ) || empty( $data['prefixes'] ) ) {
            return;
        }

        $ranges = [];
        foreach ( $data['prefixes'] as $entry ) {
            $cidr = $entry['ipv4Prefix'] ?? $entry['ipv6Prefix'] ?? '';
            if ( $cidr && preg_match( '#^[\da-f.:]+/\d{1,3}$#i', $cidr ) ) {
                $ranges[] = $cidr;
            }
        }

        if ( ! empty( $ranges ) ) {
            set_transient( 'madeit_security_google_ip_ranges', $ranges, WEEK_IN_SECONDS );
        }
    }

    // ── Microsoft IP ranges ───────────────────────────────────────────────────

    /**
     * Major Microsoft/Azure IPv4 ranges (fallback).
     * Combines well-known Azure netblocks + BingBot ranges.
     * Updated periodically — auto-refresh supplements via bingbot.json.
     */
    private const MS_IPV4_FALLBACK = [
        // Bing crawlers (from bingbot.json snapshot 2026-03)
        '13.66.139.0/24',    '13.66.144.0/24',    '13.67.10.16/28',
        '13.69.66.160/27',   '13.71.172.128/28',  '13.71.173.0/24',
        '20.15.133.160/27',  '20.36.108.32/28',   '20.43.120.16/28',
        '20.79.107.240/28',  '20.113.0.0/18',     '20.185.79.48/28',
        '20.189.173.0/24',   '20.191.161.0/24',   '40.77.167.0/24',
        '40.77.188.0/22',    '52.167.144.0/24',   '52.175.198.0/24',
        '157.55.39.0/24',    '199.30.24.0/23',    '207.46.13.0/24',
        // Major Azure public ranges
        '13.64.0.0/11',      '20.0.0.0/11',       '20.32.0.0/11',
        '20.64.0.0/10',      '20.128.0.0/9',      '40.64.0.0/10',
        '51.104.0.0/15',     '52.96.0.0/12',      '52.112.0.0/14',
        '52.120.0.0/14',     '52.224.0.0/11',     '52.136.0.0/13',
        '52.148.0.0/14',     '52.152.0.0/13',     '52.160.0.0/11',
        '52.232.0.0/13',     '52.240.0.0/12',     '104.40.0.0/13',
        '104.208.0.0/13',    '131.253.12.0/22',   '131.253.18.0/24',
        '131.253.21.0/24',   '131.253.24.0/21',   '131.253.32.0/20',
        '134.170.0.0/16',    '137.116.0.0/15',    '137.135.0.0/16',
        '138.91.0.0/16',     '157.55.0.0/16',     '157.56.0.0/14',
        '168.61.0.0/16',     '168.62.0.0/15',     '191.232.0.0/13',
        '199.30.16.0/20',    '204.79.180.0/24',   '204.79.195.0/24',
        '207.46.0.0/16',
    ];
    private const MS_IPV6_FALLBACK = [
        '2603:1000::/24',    '2603:1010::/28',    '2603:1020::/28',
        '2603:1030::/28',    '2603:1040::/28',    '2603:1050::/28',
        '2620:1ec::/36',
    ];

    public static function is_microsoft_ip( string $ip ): bool {
        foreach ( self::get_microsoft_ranges() as $range ) {
            if ( self::ip_in_cidr( $ip, $range ) ) return true;
        }
        return false;
    }

    public static function get_microsoft_ranges(): array {
        $cached = get_transient( 'madeit_security_microsoft_ip_ranges' );
        if ( is_array( $cached ) && ! empty( $cached ) ) {
            return $cached;
        }
        return array_merge( self::MS_IPV4_FALLBACK, self::MS_IPV6_FALLBACK );
    }

    /**
     * Fetches BingBot IP ranges and merges with hardcoded Azure ranges.
     * Called by weekly cron hook `madeit_security_refresh_microsoft_ips`.
     *
     * Note: Microsoft has no single stable endpoint for all Azure IPs.
     * BingBot JSON is the only reliably fetchable list. Hardcoded Azure
     * ranges supplement it for broader coverage.
     *
     * @see https://www.bing.com/toolbox/bingbot.json
     */
    public static function refresh_microsoft_ranges(): void {
        // Start with hardcoded Azure ranges (always included)
        $ranges = array_merge( self::MS_IPV4_FALLBACK, self::MS_IPV6_FALLBACK );

        // Fetch fresh BingBot ranges and merge
        $response = wp_remote_get( 'https://www.bing.com/toolbox/bingbot.json', [
            'timeout'   => 15,
            'sslverify' => true,
        ] );
        if ( ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) === 200 ) {
            $data = json_decode( wp_remote_retrieve_body( $response ), true );
            if ( is_array( $data ) && ! empty( $data['prefixes'] ) ) {
                foreach ( $data['prefixes'] as $entry ) {
                    $cidr = $entry['ipv4Prefix'] ?? $entry['ipv6Prefix'] ?? '';
                    if ( $cidr && preg_match( '#^[\da-f.:]+/\d{1,3}$#i', $cidr ) ) {
                        $ranges[] = $cidr;
                    }
                }
            }
        }

        // Deduplicate and cache
        $ranges = array_values( array_unique( $ranges ) );
        if ( ! empty( $ranges ) ) {
            set_transient( 'madeit_security_microsoft_ip_ranges', $ranges, WEEK_IN_SECONDS );
        }
    }

    // ── CIDR helper (IPv4 + IPv6) ────────────────────────────────────────────
    public static function ip_in_cidr( string $ip, string $cidr ): bool {
        [ $subnet, $bits ] = array_pad( explode( '/', $cidr ), 2, null );
        if ( $bits === null ) return false;
        $bits = (int) $bits;

        $ip_bin     = @inet_pton( $ip );
        $subnet_bin = @inet_pton( $subnet );
        if ( $ip_bin === false || $subnet_bin === false ) return false;

        // Both addresses must be the same family (same byte length)
        if ( strlen( $ip_bin ) !== strlen( $subnet_bin ) ) return false;

        $max_bits = strlen( $ip_bin ) * 8; // 32 for IPv4, 128 for IPv6
        if ( $bits < 0 || $bits > $max_bits ) return false;

        // Build binary mask
        $mask = str_repeat( "\xff", (int) ( $bits / 8 ) );
        if ( $bits % 8 ) {
            $mask .= chr( 0xff << ( 8 - ( $bits % 8 ) ) & 0xff );
        }
        $mask = str_pad( $mask, strlen( $ip_bin ), "\x00" );

        return ( $ip_bin & $mask ) === ( $subnet_bin & $mask );
    }

    // ── Management API ─────────────────────────────────────────────────────────

    public static function add( string $ip, string $label = '', int $by_user = 0 ): bool {
        global $wpdb;
        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) return false;

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache

        // Clear from block list first
        $wpdb->delete( $wpdb->prefix . 'madeit_security_blocked_ips', [ 'ip' => $ip ], [ '%s' ] );

        $exists = $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}madeit_security_whitelist WHERE type='ip' AND value=%s", $ip
        ) );
        if ( $exists ) return true; // already whitelisted

        $ok = (bool) $wpdb->insert(
            $wpdb->prefix . 'madeit_security_whitelist',
            [
                'type'       => 'ip',
                'value'      => $ip,
                'label'      => $label ?: "Added " . current_time( 'mysql' ),
                'created_by' => $by_user ?: get_current_user_id(),
                'created_at' => current_time( 'mysql' ),
            ],
            [ '%s', '%s', '%s', '%d', '%s' ]
        );

        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        // Bust cache
        unset( self::$cache[ $ip ] );
        return $ok;
    }

    public static function remove( int $id ): bool {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $row = $wpdb->get_row( $wpdb->prepare(
            "SELECT value FROM {$wpdb->prefix}madeit_security_whitelist WHERE id=%d", $id
        ) );
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $ok  = (bool) $wpdb->delete( $wpdb->prefix . 'madeit_security_whitelist', [ 'id' => $id ], [ '%d' ] );
        if ( $ok && $row ) {
            unset( self::$cache[ $row->value ] );
        }
        return $ok;
    }

    public static function get_all(): array {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        return $wpdb->get_results( $wpdb->prepare(
            "SELECT id, type, value, label, created_by, created_at
            FROM {$wpdb->prefix}madeit_security_whitelist
            WHERE type = %s
            ORDER BY created_at DESC",
            'ip'
        ) );
    }

    public static function my_ip(): string {
        return RequestLogger::get_real_ip();
    }
}
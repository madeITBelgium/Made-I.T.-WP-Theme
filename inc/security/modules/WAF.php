<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Web Application Firewall
 * Inspects every request at WordPress boot time (priority 0 on init).
 * A lighter auto_prepend_file version is deployed separately on activation.
 */
class WAF {

    // ── Rule definitions ───────────────────────────────────────────────────────
    private static array $rules = [];

    public static function init(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_waf_enabled', true ) ) return;

        self::build_rules();

        // Hook as early as possible — before most plugins run
        add_action( 'init', [ __CLASS__, 'inspect_request' ], 0 );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Rule set
    // ─────────────────────────────────────────────────────────────────────────
    private static function build_rules(): void {
        self::$rules = [

            // ── SQL Injection ──────────────────────────────────────────────
            [ 'id' => 'sqli_union',    'cat' => 'sqli',    'sev' => 9, 'name' => 'SQL UNION SELECT',
            'pattern' => '/union(?:\s|\/\*[^*]*\*\/)+(?:all(?:\s|\/\*[^*]*\*\/)+)?select(?:\s|\/\*[^*]*\*\/)/i',
            'fields'  => [ 'get', 'post', 'cookie', 'path' ] ],

            [ 'id' => 'sqli_sleep',    'cat' => 'sqli',    'sev' => 9, 'name' => 'SQL Time-Based Blind',
            'pattern' => '/(?:sleep\s*\(|benchmark\s*\(|waitfor\s+delay|pg_sleep)/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'sqli_error',    'cat' => 'sqli',    'sev' => 8, 'name' => 'SQL Error-Based',
            'pattern' => '/(?:extractvalue\s*\(|updatexml\s*\(|exp\s*\(\s*~)/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'sqli_stacked',  'cat' => 'sqli',    'sev' => 9, 'name' => 'SQL Stacked Queries',
            'pattern' => '/;\s*(?:insert|update|delete|drop|create|alter|exec|execute)\s/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'sqli_auth',     'cat' => 'sqli',    'sev' => 8, 'name' => 'SQL Auth Bypass',
            'pattern' => "/['\"`]\s*(?:or|and)\s+['\"`]?[01]['\"`]?\s*=\s*['\"`]?[01]/i",
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'sqli_comment',  'cat' => 'sqli',    'sev' => 7, 'name' => 'SQL Comment Injection',
            'pattern' => '/(?:\/\*!?\d*\*\/|\/\*\*\/|--\s*$|#\s*$)/im',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'sqli_outband',  'cat' => 'sqli',    'sev' => 9, 'name' => 'SQL Out-of-Band',
            'pattern' => '/(?:load_file\s*\(|into\s+(?:out|dump)file\s)/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            // ── XSS ───────────────────────────────────────────────────────
            [ 'id' => 'xss_script',    'cat' => 'xss',     'sev' => 8, 'name' => 'XSS Script Tag',
            'pattern' => '/<\s*script[^>]*>/i',
            'fields'  => [ 'get', 'post', 'cookie', 'referer' ] ],

            [ 'id' => 'xss_event',     'cat' => 'xss',     'sev' => 8, 'name' => 'XSS Event Handler',
            'pattern' => '/\bon\w+\s*=\s*["\']?(?:javascript|eval|alert|prompt|confirm|document|window|location|fetch|setTimeout|setInterval|import|constructor|this)\b/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'xss_jsuri',     'cat' => 'xss',     'sev' => 8, 'name' => 'XSS JavaScript URI',
            'pattern' => '/(?:javascript|vbscript|data\s*:\s*text\/html)\s*:/i',
            'fields'  => [ 'get', 'post', 'cookie', 'referer' ] ],

            [ 'id' => 'xss_svg',       'cat' => 'xss',     'sev' => 7, 'name' => 'XSS SVG/Iframe',
            'pattern' => '/<\s*(?:svg|iframe|object|embed|frame|meta)\s[^>]*(?:on\w+|href\s*=\s*["\']?javascript)/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'xss_dom',       'cat' => 'xss',     'sev' => 7, 'name' => 'XSS DOM Manipulation',
            'pattern' => '/document\s*\.\s*(?:write|cookie|location|body)\s*(?:\[|=|\()/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'xss_encoded',   'cat' => 'xss',     'sev' => 7, 'name' => 'XSS Encoded Payload',
            'pattern' => '/(?:%3c\s*script|\\\\u003c\s*script|&lt;\s*script)/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'xss_tpl',       'cat' => 'xss',     'sev' => 8, 'name' => 'Template Injection',
            'pattern' => '/(?:\{\{[^}]*(?:constructor|__proto__|process|require|import|eval|alert|document|window)[^}]*\}\}|\$\{[^}]*(?:constructor|__proto__|process|require|import|eval|alert|document|window)[^}]*\}|<%[=\-][^%]+%>|#\{[^}]*(?:constructor|__proto__|process|require|import|eval|alert|document|window)[^}]*\})/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            // ── LFI / Path Traversal ──────────────────────────────────────
            [ 'id' => 'lfi_traversal', 'cat' => 'lfi',     'sev' => 8, 'name' => 'Path Traversal',
            'pattern' => '/(?:\.{2}[\/\\\\])+(?:etc|proc|windows|boot|var|usr|tmp|home|root)/i',
            'fields'  => [ 'get', 'post', 'cookie', 'path' ] ],

            [ 'id' => 'lfi_wrapper',   'cat' => 'lfi',     'sev' => 9, 'name' => 'PHP Stream Wrapper',
            'pattern' => '/(?:php|phar|data|zip|glob|expect|input|fd)\s*:\/\//i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'lfi_wpconfig',  'cat' => 'lfi',     'sev' => 10,'name' => 'wp-config Access Attempt',
            'pattern' => '/wp-config(?:\.php)?(?:\.bak|\.old|\.backup|\.txt|~)?$/i',
            'fields'  => [ 'get', 'path', 'referer' ] ],

            [ 'id' => 'lfi_nullbyte',  'cat' => 'lfi',     'sev' => 8, 'name' => 'Null Byte Injection',
            'pattern' => '/(?:%00|\\\\0|\\\\x00)/',
            'fields'  => [ 'get', 'post', 'cookie', 'path' ] ],

            // ── Remote Code Execution ─────────────────────────────────────
            [ 'id' => 'rce_shell',     'cat' => 'rce',     'sev' => 10,'name' => 'Shell Command Injection',
            'pattern' => '/(?:;|`|&&|\$\()\s*(?:ls|cat|id|whoami|wget|curl|nc|bash|sh|python|perl|ruby)\b/i',
            'fields'  => [ 'get', 'post' ] ],

            [ 'id' => 'rce_eval',      'cat' => 'rce',     'sev' => 10,'name' => 'PHP Code Execution',
            'pattern' => '/(?:eval|assert|preg_replace)\s*\(\s*(?:base64_decode|str_rot13|gzinflate|gzuncompress|gzdecode|rawurldecode)\s*\(/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'rce_phpfunc',   'cat' => 'rce',     'sev' => 9, 'name' => 'PHP Dangerous Functions',
            'pattern' => '/(?:system|passthru|shell_exec|proc_open|popen|exec)\s*\(/i',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            // ── Object Injection / Deserialization ────────────────────────
            [ 'id' => 'deser_obj',     'cat' => 'deser',   'sev' => 9, 'name' => 'PHP Object Injection',
            'pattern' => '/O:\d+:"[A-Za-z_\\\\][A-Za-z0-9_\\\\]*":\d+:\{/',
            'fields'  => [ 'get', 'post', 'cookie' ] ],

            [ 'id' => 'deser_payload', 'cat' => 'deser',   'sev' => 8, 'name' => 'Serialized Payload',
            'pattern' => '/(?:^|\s|=|;)(?:a|s|i|d|b|N|O|C):\d+(?::\d+)?\{/',
            'fields'  => [ 'get', 'post' ] ],

            // ── SSRF ──────────────────────────────────────────────────────
            [ 'id' => 'ssrf_internal', 'cat' => 'ssrf',    'sev' => 9, 'name' => 'SSRF Internal Network',
            'pattern' => '/(?:169\.254\.169\.254|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|127\.0\.0\.1|localhost|0\.0\.0\.0|::1)/i',
            'fields'  => [ 'get', 'post' ] ],

            // ── WordPress-Specific ────────────────────────────────────────
            [ 'id' => 'wp_debug_log',  'cat' => 'wp',      'sev' => 7, 'name' => 'Debug Log Access',
            'pattern' => '/debug\.log$/i',
            'fields'  => [ 'path' ] ],

            [ 'id' => 'wp_env',        'cat' => 'wp',      'sev' => 8, 'name' => '.env File Access',
            'pattern' => '/\.env(?:\.(?:local|prod|dev|staging))?$/i',
            'fields'  => [ 'path' ] ],

            [ 'id' => 'wp_git',        'cat' => 'wp',      'sev' => 8, 'name' => 'Git Repository Access',
            'pattern' => '/\.git(?:\/(?:config|HEAD|index|COMMIT_EDITMSG))?$/i',
            'fields'  => [ 'path' ] ],

            [ 'id' => 'wp_xmlrpc_mc',  'cat' => 'wp',      'sev' => 8, 'name' => 'XML-RPC Multicall Abuse',
            'pattern' => '/system\.multicall/i',
            'fields'  => [ 'body' ] ],

            [ 'id' => 'wp_backup',     'cat' => 'wp',      'sev' => 7, 'name' => 'Backup File Access',
            'pattern' => '/\.(sql|tar|tar\.gz|zip|bak|backup)\s*$/i',
            'fields'  => [ 'path' ] ],

            [ 'id' => 'wp_readme',     'cat' => 'wp',      'sev' => 5, 'name' => 'WP Readme Access',
            'pattern' => '/(?:readme\.html|license\.txt|readme\.txt|wp-config\.php\.bak)$/i',
            'fields'  => [ 'path' ] ],

            // ── Scanner Detection (UA-based) ────────────────────────────────
            // Named scanners — match known User-Agent signatures.
            // WPScan default: "WPScan v3.x.x (https://wpscan.com/...)"
            // WPScan w/ Typhoeus: header set by Ruby http library Typhoeus/Ethon
            [ 'id' => 'scanner_named', 'cat' => 'scanner', 'sev' => 10,'name' => 'Security Scanner Detected',
            'pattern' => '/(?:sqlmap|nikto|nmap|masscan|wpscan|wpvulndb|dirbuster|gobuster|nuclei|acunetix|nessus|burpsuite|zaproxy|havij|openvas|vega\/|wfuzz|ffuf|feroxbuster|httpx|subfinder|amass|katana|jaeles|xsstrike|dalfox|commix|tplmap)/i',
            'fields'  => [ 'ua' ] ],

            // Automated HTTP libraries — real browsers never expose these UAs.
            // Go-http-client = WPProbe default (before uarand randomisation).
            // python-requests/urllib = common WPScan wrappers & custom scripts.
            [ 'id' => 'scanner_tool_ua', 'cat' => 'scanner', 'sev' => 8,'name' => 'Automated Tool User-Agent',
            'pattern' => '/(?:^Go-http-client|^python-requests|^python-urllib|^python\/|^libwww-perl|^Faraday|^aiohttp|^node-fetch|^undici|^axios|^got\/\d|^Java\/|^Apache-HttpClient|^okhttp|^Ruby|^Typhoeus|^Mechanize|^PHPCrawl|^Scrapy|^colly|^PycURL|^Wget|^Curl\/|^lwp-trivial|^libcurl|^Jakarta|^Jersey|^Embarcadero|^Deno\/|^Bun\/)/i',
            'fields'  => [ 'ua' ] ],

            // ── Scanner Detection (Path-based) ─────────────────────────────
            // Direct access to plugin readme/changelog files. Both WPScan and
            // WPProbe probe these to extract version numbers. Normal visitors
            // never request them. WPProbe tries 3 case variants:
            // readme.txt, Readme.txt, README.txt.
            [ 'id' => 'scanner_readme_enum', 'cat' => 'scanner', 'sev' => 8, 'name' => 'Plugin Readme Enumeration',
            'pattern' => '/\/wp-content\/plugins\/[a-z0-9_-]+\/(?:readme|README|Readme)\.(?:txt|md)$/i',
            'fields'  => [ 'path' ] ],

            // WPScan probes plugin changelog/license files for version info.
            [ 'id' => 'scanner_changelog_enum', 'cat' => 'scanner', 'sev' => 7, 'name' => 'Plugin Changelog Probe',
            'pattern' => '/\/wp-content\/plugins\/[a-z0-9_-]+\/(?:changelog|CHANGELOG|CHANGES|license)\.(?:txt|md|html)$/i',
            'fields'  => [ 'path' ] ],

            // WPProbe checks for 403 vs 404 on bare plugin directories.
            // Normal traffic never requests a trailing-slash directory path.
            [ 'id' => 'scanner_plugin_dir', 'cat' => 'scanner', 'sev' => 7, 'name' => 'Plugin Directory Probe',
            'pattern' => '/\/wp-content\/plugins\/[a-z0-9_-]+\/$/i',
            'fields'  => [ 'path' ] ],

            // WPScan probes theme style.css / screenshot.png for detection.
            // Theme stylesheets load from enqueued handles (with ?ver= param).
            // A bare direct request without query params is enumeration.
            [ 'id' => 'scanner_theme_enum', 'cat' => 'scanner', 'sev' => 7, 'name' => 'Theme Enumeration Probe',
            'pattern' => '/\/wp-content\/themes\/[a-z0-9_-]+\/(?:style\.css|screenshot\.png)$/i',
            'fields'  => [ 'path' ] ],

            // WPProbe fetches /wp-content/uploads/ directory listing for plugin discovery.
            // Real visitors never request the uploads directory root.
            [ 'id' => 'scanner_uploads_dir', 'cat' => 'scanner', 'sev' => 8, 'name' => 'Uploads Directory Probe',
            'pattern' => '/\/wp-content\/(?:uploads|mu-plugins)\/$/i',
            'fields'  => [ 'path' ] ],

            // WPScan probes xmlrpc.php with POST to system.listMethods for fingerprinting.
            [ 'id' => 'scanner_xmlrpc_list', 'cat' => 'scanner', 'sev' => 8, 'name' => 'XML-RPC Method Enumeration',
            'pattern' => '/system\.listMethods/i',
            'fields'  => [ 'body' ] ],

            // Catch WPScan wp-login.php username enumeration via specific POST patterns.
            // WPScan sends login requests with incrementing usernames to see
            // "Invalid username" vs "incorrect password" error messages.
            [ 'id' => 'scanner_user_enum',   'cat' => 'scanner', 'sev' => 7, 'name' => 'Author/User Enumeration',
            'pattern' => '/\?author=\d+/i',
            'fields'  => [ 'get' ] ],
        ];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Main inspection
    // ─────────────────────────────────────────────────────────────────────────
    public static function inspect_request(): void {
        // Whitelisted IPs bypass the WAF entirely
        $ip = \MadeIT\Security\RequestLogger::get_real_ip();
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) return;

        // Logged-in administrators bypass the WAF entirely.
        // If an admin account is compromised the attacker already has full
        // WordPress access; the WAF cannot mitigate that scenario, and
        // false positives could lock the admin out of their own site.
        if ( self::is_current_user_admin() ) {
            return;
        }

        // Non-admin logged-in users: optionally skip WAF on AJAX requests
        if ( defined( 'DOING_AJAX' ) && DOING_AJAX && is_user_logged_in() ) {
            if ( \MadeIT\Security\Settings::bool( 'madeit_security_waf_whitelist_logged_in', false ) ) return;
        }

        // Skip CLI
        if ( defined( 'WP_CLI' ) && WP_CLI ) return;

        // Build request targets
        $targets = self::build_targets();

        $mode = \MadeIT\Security\Settings::string( 'madeit_security_waf_mode', 'log' );

        // ── Smart UA-scanning: only flag tool UAs on sensitive paths ──────
        // A `Java/1.8` request to /pricing/ is just browsing — not an attack.
        // Only flag automated tool UAs when they're probing WordPress internals
        // (login, admin, REST API, plugin/theme dirs, xmlrpc, etc.).
        // Also bypass entirely for known service UAs (Google, Microsoft, etc.)
        // or known search engine / cloud provider IP ranges.
        $ua_str          = $targets['ua'][0] ?? '';
        $is_known_svc    = self::is_known_service_ua( $ua_str );
        $path_str        = $targets['path'][0] ?? '';
        $skip_tool_ua    = $is_known_svc
                        || self::is_search_engine_ip( $ip )
                        || ! self::is_sensitive_path( $path_str );

        foreach ( self::$rules as $rule ) {
            if ( ! self::is_rule_enabled( $rule['id'] ) ) continue;

            // Skip scanner_tool_ua for known services or regular content paths
            if ( $skip_tool_ua && $rule['id'] === 'scanner_tool_ua' ) continue;

            foreach ( $rule['fields'] as $field ) {
                if ( empty( $targets[ $field ] ) ) continue;

                foreach ( (array) $targets[ $field ] as $value ) {
                    if ( ! is_string( $value ) || $value === '' ) continue;

                    // Decode before matching to catch encoded attacks
                    $decoded = self::multi_decode( $value );

                    if ( preg_match( $rule['pattern'], $decoded ) ) {
                        self::handle_match( $rule, $field, $value, $mode );
                        return; // Stop at first match
                    }
                }
            }
        }

        // ── Behavioral detection: scanner enumeration burst ─────────────
        // After regex rules pass, check if this IP is doing rapid plugin
        // enumeration (WPScan aggressive mode / WPProbe bruteforce mode).
        self::check_enumeration_burst( $targets, $mode );
    }

    /**
     * Detect rapid plugin/theme enumeration (behavioral, not regex).
     *
     * Both WPScan (aggressive) and WPProbe (bruteforce) hit hundreds of
     * /wp-content/plugins/{slug}/ or /wp-content/themes/{slug}/ paths
     * in seconds. Normal visitors hit zero.
     *
     * Uses a short-lived transient per IP that stores unique slug count.
     * Threshold: >15 unique slugs within 60 seconds = auto-block.
     */
    private static function check_enumeration_burst( array $targets, string $mode ): void {
        $path = $targets['path'][0] ?? '';
        if ( ! preg_match( '#/wp-content/(?:plugins|themes)/([a-z0-9_-]+)/#i', $path, $m ) ) {
            return;
        }
        $slug = strtolower( $m[1] );
        $ip   = \MadeIT\Security\RequestLogger::get_real_ip();
        $key  = 'madeit_security_enum_' . md5( $ip );

        $data = get_transient( $key );
        if ( ! is_array( $data ) ) {
            $data = [ 'slugs' => [], 'first' => time() ];
        }

        // Expire if older than 60 seconds (reset window)
        if ( ( time() - $data['first'] ) > 60 ) {
            $data = [ 'slugs' => [], 'first' => time() ];
        }

        $data['slugs'][ $slug ] = true;
        set_transient( $key, $data, 120 );

        $threshold = \MadeIT\Security\Settings::int( 'madeit_security_enum_threshold', 15 );
        if ( count( $data['slugs'] ) >= $threshold ) {
            $synth_rule = [
                'id'   => 'scanner_enum_burst',
                'cat'  => 'scanner',
                'sev'  => 10,
                'name' => 'Enumeration Burst Detected (' . count( $data['slugs'] ) . ' slugs in 60s)',
            ];
            delete_transient( $key );
            self::handle_match( $synth_rule, 'path', $path, $mode );
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Handle a rule match
    // ─────────────────────────────────────────────────────────────────────────
    // phpcs:disable WordPress.Security.NonceVerification, WordPress.Security.ValidatedSanitizedInput -- WAF inspects raw request data; nonce is not applicable
    private static function handle_match( array $rule, string $field, string $value, string $mode ): void {
        $ip     = \MadeIT\Security\RequestLogger::get_real_ip();
        $uri    = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/';
        $method = isset( $_SERVER['REQUEST_METHOD'] ) ? strtoupper( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ) ) ) : 'GET';

        // Log the event
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'waf_block',
                'severity'    => self::sev_label( $rule['sev'] ),
                'ip'          => $ip,
                'user_id'     => get_current_user_id(),
                'url'         => home_url( $uri ),
                'method'      => $method,
                'rule_id'     => $rule['id'],
                'description' => sprintf( 'WAF: %s matched in %s field. Payload: %s',
                    $rule['name'], $field, esc_html( substr( $value, 0, 200 ) ) ),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s','%s','%s','%d','%s','%s','%s','%s','%s' ]
        );

        // Update visitor log row if we have one
        if ( ! empty( $GLOBALS['madeit_security_current_log_id'] ) ) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
            $wpdb->update(
                $wpdb->prefix . 'madeit_security_visitor_log',
                [ 'is_blocked' => 1, 'block_reason' => 'WAF: ' . $rule['name'], 'status_code' => 403 ],
                [ 'id' => $GLOBALS['madeit_security_current_log_id'] ],
                [ '%d','%s','%d' ], [ '%d' ]
            );
        }

        // phpcs:enable WordPress.Security.NonceVerification, WordPress.Security.ValidatedSanitizedInput
        // Respond based on mode
        switch ( $mode ) {
            case 'detect':
            case 'log':
                // Log only — do NOT block or auto-ban in passive mode
                break;

            case 'tarpit':
                self::maybe_autoblock( $ip, $rule );
                if ( ! headers_sent() ) {
                    http_response_code( 200 );
                    // Respond slowly — capped at 10s to avoid exhausting PHP workers
                    set_time_limit( 15 ); // phpcs:ignore Generic.PHP.NoSilencedErrors.Discouraged, Squiz.PHP.DiscouragedFunctions.Discouraged -- intentional for WAF tarpit slow-drip response
                    ob_start();
                    for ( $i = 0; $i < 10; $i++ ) {
                        echo esc_html( str_repeat( ' ', 512 ) );
                        if ( connection_aborted() ) break;
                        @ob_flush(); flush(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- flushing whitespace padding
                        sleep( 1 );
                    }
                    ob_end_clean();
                    exit;
                }
                break;

            case 'challenge':
                // TODO: serve JS challenge — fall through to block for now
            case 'block':
            default:
                self::maybe_autoblock( $ip, $rule );
                self::send_block_response( $rule );
                break;
        }
    }

    private static function maybe_autoblock( string $ip, array $rule ): void {
        // Never auto-block a logged-in administrator — prevents self-lockout
        if ( self::is_current_user_admin() ) return;

        // Never auto-block IPs from major search engine / cloud providers.
        // A WAF rule may still block the CURRENT request, but we don't persist
        // the ban — otherwise one false-positive on a sensitive path bans the
        // crawler from all pages for the entire auto-block duration.
        if ( self::is_search_engine_ip( $ip ) ) return;

        if ( $rule['sev'] >= 8 && \MadeIT\Security\Settings::bool( 'madeit_security_waf_autoblock', true ) ) {
            \MadeIT\Security\modules\IPManager::block_ip(
                $ip,
                'Auto-blocked by WAF: ' . $rule['name'],
                \MadeIT\Security\Settings::int( 'madeit_security_auto_block_duration', 3600 ),
                $rule['id'],
                0
            );
        }
    }

    /**
     * Check if the IP belongs to a known search engine or major cloud provider.
     * Used to prevent auto-blocking crawlers that trigger false positives.
     *
     * This is separate from Whitelist::is_allowed() — whitelisting exempts the
     * IP from ALL security checks. This only prevents persistent auto-blocking;
     * the WAF still blocks individual malicious requests from these IPs.
     */
    private static function is_search_engine_ip( string $ip ): bool {
        if ( ! class_exists( 'MadeIT\Security\\Whitelist' ) ) return false;
        return \MadeIT\Security\Whitelist::is_google_ip( $ip )
            || \MadeIT\Security\Whitelist::is_microsoft_ip( $ip );
    }

    private static function send_block_response( array $rule ): void {
        if ( headers_sent() ) return;
        $code = \MadeIT\Security\Settings::int( 'madeit_security_block_response_code', 403 );
        http_response_code( $code );
        header( 'Content-Type: text/html; charset=utf-8' );
        // Do not add identifying headers — avoid fingerprinting the security plugin
        wp_register_style( 'madeit-security-block-page', MADEIT_SECURITY_URL . 'includes/assets/css/block-page.css', [], MADEIT_VERSION );
        wp_enqueue_style( 'madeit-security-block-page' );
        echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Access Denied</title>';
        wp_print_styles( 'madeit-security-block-page' );
        echo '</head>
<body><div class="card">
<div class="icon">🛡️</div>
<h1>Request Blocked</h1>
<p>This request has been blocked because it matches a known attack pattern.</p>
<p><small>Rule: ' . esc_html( $rule['name'] ) . ' &nbsp;|&nbsp; If you believe this is a mistake, contact the site administrator.</small></p>
</div></body></html>';
        exit;
    }

    /**
     * Check if the UA belongs to a known legitimate service that uses
     * HTTP library user-agents (Java/, Apache-HttpClient, okhttp, etc.)
     *
     * Google and Microsoft services often send requests with generic library
     * UAs but include their service name. Plain "Java/1.8" from an unknown
     * source is still caught — only UAs that also identify their service pass.
     */
    private static function is_known_service_ua( string $ua ): bool {
        if ( $ua === '' ) return false;
        $lower = strtolower( $ua );
        $patterns = [
            // Google services
            'google',                   // Google-HTTP-Java-Client, Google-Site-Verification, etc.
            'apis-google',              // Google APIs
            'feedfetcher-google',       // Google Feed Fetcher
            'adsbot',                   // AdsBot-Google
            'mediapartners',            // Mediapartners-Google (AdSense)
            // Microsoft services
            'microsoft',               // Microsoft Office, Microsoft Outlook, Microsoft-CryptoAPI, etc.
            'msn',                     // msnbot
            'bingpreview',             // Bing URL Preview
            'bingbot',                 // Bing crawler
            'outlook',                 // Outlook link prefetch
            'office',                  // Office link validation
            'azure',                   // Azure Traffic Manager / Azure DevOps
            'onedrive',                // OneDrive link checker
            'sharepoint',              // SharePoint crawler
            'teams',                   // Microsoft Teams link unfurl
            'skype',                   // Skype URI Preview
            // Apple services
            'apple',                   // Applebot, Apple-PubSub
            // Meta / social
            'facebookexternalhit',     // Facebook link previews
            'linkedinbot',             // LinkedIn link previews
            // Monitoring / uptime (common false positives)
            'uptimerobot',
            'pingdom',
            'statuscake',
            'site24x7',
            'datadog',
            'newrelic',
        ];
        foreach ( $patterns as $p ) {
            if ( str_contains( $lower, $p ) ) return true;
        }
        return false;
    }

    /**
     * Check if the request path targets WordPress internals (login, admin,
     * REST API, plugin/theme directories, xmlrpc, etc.).
     *
     * Regular content paths (/pricing/, /blog/, /about/, images, etc.) are
     * NOT sensitive — automated tools accessing them is just browsing, not
     * scanning. We only flag tool UAs when they probe sensitive endpoints.
     */
    private static function is_sensitive_path( string $path ): bool {
        $path = strtolower( $path );
        $sensitive = [
            '/wp-admin',
            '/wp-login.php',
            '/wp-json/',
            '/xmlrpc.php',
            '/wp-content/plugins/',
            '/wp-content/themes/',
            '/wp-content/uploads/',
            '/wp-content/mu-plugins/',
            '/wp-includes/',
            '/.git',
            '/.env',
            '/.htaccess',
            '/wp-config',
            '/readme.html',
            '/license.txt',
        ];
        foreach ( $sensitive as $prefix ) {
            if ( str_contains( $path, $prefix ) ) return true;
        }
        // Also check full URI for query string probing (author enum, etc.)
        // $path from build_targets is stripped at '?', so check raw URI.
        $uri = strtolower( isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '' ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if ( str_contains( $uri, '?author=' ) ) return true;
        return false;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────
    // phpcs:disable WordPress.Security.NonceVerification, WordPress.Security.ValidatedSanitizedInput -- WAF inspects raw request data for attack pattern detection; all values are sanitized via esc_html()/sanitize_text_field() before database storage in handle_match()
    private static function build_targets(): array {
        $path   = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( strtok( wp_unslash( $_SERVER['REQUEST_URI'] ), '?' ) ) : '';
        $ua     = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
        $ref    = isset( $_SERVER['HTTP_REFERER'] )    ? esc_url_raw( wp_unslash( $_SERVER['HTTP_REFERER'] ) )    : '';

        // Flatten nested arrays
        $get    = self::flatten( $_GET );
        $post   = self::flatten( $_POST );
        $cookie = self::flatten( $_COOKIE );

        // Raw body (for XML-RPC, JSON, etc)
        $body = '';
        $method_raw = strtoupper( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_METHOD'] ?? '' ) ) );
        if ( in_array( $method_raw, [ 'POST', 'PUT', 'PATCH' ], true ) ) {
            $body = file_get_contents( 'php://input' ) ?: '';
            $body = substr( $body, 0, 8192 ); // cap at 8KB

            // When $_POST is empty, the body came via a non-form Content-Type
            // (application/json, text/plain, application/xml, etc.). Merge body
            // values into 'post' targets so all existing rules inspect them.
            if ( $body !== '' && empty( $_POST ) ) {
                $ct = strtolower( sanitize_text_field( wp_unslash( $_SERVER['CONTENT_TYPE'] ?? '' ) ) );
                if ( str_contains( $ct, 'application/json' ) || str_contains( $ct, '+json' ) ) {
                    // Intentionally unsanitized: WAF must inspect raw decoded values
                    // to detect attack payloads (SQLi, XSS, etc.) in JSON request bodies.
                    // Values are only used for regex matching and are sanitized via
                    // esc_html() before any database storage in handle_match().
                    $json = json_decode( $body, true ); // phpcs:ignore -- WAF attack detection requires raw unsanitized values
                    if ( is_array( $json ) ) {
                        $post = array_merge( $post, self::flatten( $json ) );
                    }
                }
                // For all other content types (text/plain, application/xml, etc.),
                // add the raw body as a post target so rules still inspect it.
                $post[] = $body;
            }
        }

        return [
            'get'    => $get,
            'post'   => $post,
            'cookie' => $cookie,
            'path'   => [ $path ],
            'ua'     => [ $ua ],
            'referer'=> [ $ref ],
            'body'   => [ $body ],
        ];
    }
    // phpcs:enable WordPress.Security.NonceVerification, WordPress.Security.ValidatedSanitizedInput

    private static function flatten( array $arr, int $depth = 0 ): array {
        $result = [];
        foreach ( $arr as $val ) {
            if ( is_array( $val ) && $depth < 3 ) {
                foreach ( self::flatten( $val, $depth + 1 ) as $v ) {
                    $result[] = $v;
                }
            } else {
                $result[] = (string) $val;
            }
        }
        return $result;
    }

    private static function multi_decode( string $s ): string {
        // URL decode twice (catches double-encoding)
        $decoded = urldecode( urldecode( $s ) );
        // HTML entity decode
        $decoded = html_entity_decode( $decoded, ENT_QUOTES, 'UTF-8' );
        return $decoded;
    }

    private static function sev_label( int $sev ): string {
        if ( $sev >= 9 ) return 'critical';
        if ( $sev >= 7 ) return 'high';
        if ( $sev >= 5 ) return 'medium';
        return 'low';
    }

    /**
     * Check if the current request is from a logged-in administrator.
     *
     * Uses the standard WP user functions first, with a direct auth-cookie
     * fallback for edge cases where the WP user system isn't fully
     * initialized at this early hook (init priority 0).
     */
    private static function is_current_user_admin(): bool {
        if ( function_exists( 'is_user_logged_in' ) && is_user_logged_in()
            && function_exists( 'current_user_can' ) && current_user_can( 'manage_options' ) ) {
            return true;
        }
        if ( defined( 'LOGGED_IN_COOKIE' ) && ! empty( $_COOKIE[ LOGGED_IN_COOKIE ] )
            && function_exists( 'wp_validate_auth_cookie' ) ) {
            $uid = wp_validate_auth_cookie( sanitize_text_field( wp_unslash( $_COOKIE[ LOGGED_IN_COOKIE ] ) ), 'logged_in' );
            if ( $uid && function_exists( 'user_can' ) && user_can( $uid, 'manage_options' ) ) {
                return true;
            }
        }
        return false;
    }

    private static function is_rule_enabled( string $rule_id ): bool {
        // Allow disabling individual rules via option
        $disabled = \MadeIT\Security\Settings::array( 'madeit_security_waf_disabled_rules', [] );
        return ! in_array( $rule_id, (array) $disabled, true );
    }

    // ── Public helpers (used by admin) ─────────────────────────────────────────
    public static function get_rules(): array {
        if ( empty( self::$rules ) ) self::build_rules();
        return self::$rules;
    }

    public static function get_top_triggered_rules( int $limit = 10 ): array {
        global $wpdb;
        $cutoff = wp_date( 'Y-m-d H:i:s', time() - 7 * DAY_IN_SECONDS );
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        return $wpdb->get_results( $wpdb->prepare(
            "SELECT rule_id, COUNT(*) AS hits, MAX(created_at) AS last_hit
            FROM {$wpdb->prefix}madeit_security_events
            WHERE event_type = 'waf_block'
                AND created_at >= %s
            GROUP BY rule_id
            ORDER BY hits DESC
            LIMIT %d",
            $cutoff,
            $limit
        ) );
    }
}
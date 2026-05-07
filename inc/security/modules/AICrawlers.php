<?php
namespace MadeIT\Security\modules;

use MadeIT\Security\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * AI Crawler Management
 * Configurable blocking/allowing of LLM training crawlers with robots.txt management.
 * Detects known AI/LLM crawler user agents, blocks them with a 403 response,
 * and injects appropriate Disallow rules into robots.txt.
 */
class AICrawlers {

    public static function init(): void {
        // Request interception — run at init priority 1 (before most plugins)
        add_action( 'init', [ __CLASS__, 'intercept_request' ], 1 );

        // robots.txt injection
        add_filter( 'robots_txt', [ __CLASS__, 'filter_robots_txt' ], 100, 2 );

        // AJAX handlers
        add_action( 'wp_ajax_madeit_security_save_ai_crawler_rules', [ __CLASS__, 'ajax_save_rules' ] );
        add_action( 'wp_ajax_madeit_security_get_ai_crawler_stats',  [ __CLASS__, 'ajax_get_stats' ] );
    }

    // ── Crawler Definitions ─────────────────────────────────────────────────────

    /**
     * Returns the full list of known AI/LLM crawlers with metadata.
     *
     * @return array<int, array{id: string, name: string, ua_pattern: string, company: string, purpose: string, default_action: string}>
     */
    public static function get_crawler_definitions(): array {
        return [
            [
                'id'             => 'gptbot',
                'name'           => 'GPTBot',
                'ua_pattern'     => '/GPTBot/i',
                'company'        => 'OpenAI',
                'purpose'        => 'GPT training',
                'default_action' => 'block',
            ],
            [
                'id'             => 'chatgpt_user',
                'name'           => 'ChatGPT-User',
                'ua_pattern'     => '/ChatGPT-User/i',
                'company'        => 'OpenAI',
                'purpose'        => 'ChatGPT browsing',
                'default_action' => 'allow',
            ],
            [
                'id'             => 'google_extended',
                'name'           => 'Google-Extended',
                'ua_pattern'     => '/Google-Extended/i',
                'company'        => 'Google',
                'purpose'        => 'Gemini/Bard training',
                'default_action' => 'block',
            ],
            [
                'id'             => 'claudebot',
                'name'           => 'ClaudeBot',
                'ua_pattern'     => '/ClaudeBot/i',
                'company'        => 'Anthropic',
                'purpose'        => 'Claude training',
                'default_action' => 'block',
            ],
            [
                'id'             => 'claude_web',
                'name'           => 'Claude-Web',
                'ua_pattern'     => '/Claude-Web/i',
                'company'        => 'Anthropic',
                'purpose'        => 'Claude web access',
                'default_action' => 'allow',
            ],
            [
                'id'             => 'anthropic',
                'name'           => 'Anthropic',
                'ua_pattern'     => '/anthropic-ai/i',
                'company'        => 'Anthropic',
                'purpose'        => 'AI training',
                'default_action' => 'block',
            ],
            [
                'id'             => 'ccbot',
                'name'           => 'CCBot',
                'ua_pattern'     => '/CCBot/i',
                'company'        => 'Common Crawl',
                'purpose'        => 'Open dataset (used for AI training)',
                'default_action' => 'block',
            ],
            [
                'id'             => 'bytespider',
                'name'           => 'Bytespider',
                'ua_pattern'     => '/Bytespider/i',
                'company'        => 'ByteDance',
                'purpose'        => 'AI training',
                'default_action' => 'block',
            ],
            [
                'id'             => 'perplexitybot',
                'name'           => 'PerplexityBot',
                'ua_pattern'     => '/PerplexityBot/i',
                'company'        => 'Perplexity AI',
                'purpose'        => 'Search enhancement',
                'default_action' => 'block',
            ],
            [
                'id'             => 'amazonbot',
                'name'           => 'Amazonbot',
                'ua_pattern'     => '/Amazonbot/i',
                'company'        => 'Amazon',
                'purpose'        => 'Alexa / AI training',
                'default_action' => 'allow',
            ],
            [
                'id'             => 'facebookbot',
                'name'           => 'FacebookBot',
                'ua_pattern'     => '/facebookexternalhit/i',
                'company'        => 'Meta',
                'purpose'        => 'Content preview / AI training',
                'default_action' => 'allow',
            ],
            [
                'id'             => 'meta_external',
                'name'           => 'Meta-ExternalAgent',
                'ua_pattern'     => '/Meta-ExternalAgent/i',
                'company'        => 'Meta',
                'purpose'        => 'AI training',
                'default_action' => 'block',
            ],
            [
                'id'             => 'applebot_extended',
                'name'           => 'Applebot-Extended',
                'ua_pattern'     => '/Applebot-Extended/i',
                'company'        => 'Apple',
                'purpose'        => 'Apple Intelligence training',
                'default_action' => 'block',
            ],
            [
                'id'             => 'cohere_ai',
                'name'           => 'cohere-ai',
                'ua_pattern'     => '/cohere-ai/i',
                'company'        => 'Cohere',
                'purpose'        => 'AI training',
                'default_action' => 'block',
            ],
            [
                'id'             => 'ai2bot',
                'name'           => 'AI2Bot',
                'ua_pattern'     => '/AI2Bot/i',
                'company'        => 'Allen Institute for AI',
                'purpose'        => 'AI research',
                'default_action' => 'block',
            ],
            [
                'id'             => 'diffbot',
                'name'           => 'Diffbot',
                'ua_pattern'     => '/Diffbot/i',
                'company'        => 'Diffbot',
                'purpose'        => 'Web data extraction',
                'default_action' => 'block',
            ],
            [
                'id'             => 'omgilibot',
                'name'           => 'Omgilibot',
                'ua_pattern'     => '/Omgilibot/i',
                'company'        => 'Omgili',
                'purpose'        => 'Data mining',
                'default_action' => 'block',
            ],
            [
                'id'             => 'youbot',
                'name'           => 'YouBot',
                'ua_pattern'     => '/YouBot/i',
                'company'        => 'You.com',
                'purpose'        => 'AI search',
                'default_action' => 'block',
            ],
            [
                'id'             => 'imagesiftbot',
                'name'           => 'ImagesiftBot',
                'ua_pattern'     => '/ImagesiftBot/i',
                'company'        => 'Imagesift',
                'purpose'        => 'Image indexing for AI',
                'default_action' => 'block',
            ],
            [
                'id'             => 'scrapy',
                'name'           => 'Scrapy',
                'ua_pattern'     => '/Scrapy/i',
                'company'        => 'Open source',
                'purpose'        => 'Web scraping framework',
                'default_action' => 'block',
            ],
        ];
    }

    // ── Settings Methods ────────────────────────────────────────────────────────

    /**
     * Returns the current per-crawler rules from the options table.
     * Format: [ 'crawler_id' => 'allow'|'block', ... ]
     *
     * @return array<string, string>
     */
    public static function get_crawler_rules(): array {
        $rules = Settings::array( 'madeit_security_ai_crawler_rules', [] );

        if ( is_array( $rules ) ) {
            return $rules;
        }

        if ( is_string( $rules ) && $rules !== '' ) {
            $decoded = json_decode( $rules, true );
            if ( is_array( $decoded ) ) {
                return $decoded;
            }
        }

        return [];
    }

    /**
     * Saves per-crawler rules.
     *
     * @param array<string, string> $rules  [ 'crawler_id' => 'allow'|'block', ... ]
     * @return bool
     */
    public static function save_crawler_rules( array $rules ): bool {
        $valid_ids = array_column( self::get_crawler_definitions(), 'id' );
        $sanitized = [];

        foreach ( $rules as $id => $action ) {
            $id     = sanitize_key( $id );
            $action = in_array( $action, [ 'allow', 'block' ], true ) ? $action : 'allow';

            if ( in_array( $id, $valid_ids, true ) ) {
                $sanitized[ $id ] = $action;
            }
        }

        return update_option( 'madeit_security_ai_crawler_rules', $sanitized );
    }

    /**
     * Determines whether a given User-Agent string matches a blocked AI crawler.
     *
     * @param string $user_agent  The raw User-Agent header.
     * @return bool  True if the UA matches a blocked crawler.
     */
    public static function is_crawler_blocked( string $user_agent ): bool {
        if ( $user_agent === '' ) {
            return false;
        }

        $block_all   = Settings::bool( 'madeit_security_block_ai_crawlers', false );
        $rules       = self::get_crawler_rules();
        $definitions = self::get_crawler_definitions();

        foreach ( $definitions as $crawler ) {
            if ( preg_match( $crawler['ua_pattern'], $user_agent ) ) {
                // If per-crawler rule exists, use it
                if ( isset( $rules[ $crawler['id'] ] ) ) {
                    return $rules[ $crawler['id'] ] === 'block';
                }

                // If global block-all is on, block everything
                if ( $block_all ) {
                    return true;
                }

                // Fall back to the crawler's default action
                return $crawler['default_action'] === 'block';
            }
        }

        return false;
    }

    /**
     * Identifies which crawler definition matches a User-Agent string, if any.
     *
     * @param string $user_agent  The raw User-Agent header.
     * @return array|null  The crawler definition array, or null if no match.
     */
    public static function identify_crawler( string $user_agent ): ?array {
        if ( $user_agent === '' ) {
            return null;
        }

        foreach ( self::get_crawler_definitions() as $crawler ) {
            if ( preg_match( $crawler['ua_pattern'], $user_agent ) ) {
                return $crawler;
            }
        }

        return null;
    }

    // ── Request Interception ────────────────────────────────────────────────────

    /**
     * Hooked on `init` at priority 1.
     * Checks the User-Agent header against blocked crawler patterns and
     * sends a 403 response if the crawler is blocked.
     */
    public static function intercept_request(): void {
        // Skip CLI and cron contexts
        if ( defined( 'WP_CLI' ) && WP_CLI )         return;
        if ( defined( 'DOING_CRON' ) && DOING_CRON ) return;

        // phpcs:ignore WordPress.Security.NonceVerification.Missing -- AI crawler detection runs on every request
        $ua = isset( $_SERVER['HTTP_USER_AGENT'] )
            ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) )
            : '';

        if ( $ua === '' ) {
            return;
        }

        if ( ! self::is_crawler_blocked( $ua ) ) {
            return;
        }

        $crawler = self::identify_crawler( $ua );

        // Log to audit trail
        self::audit_block( $crawler, $ua );

        // Update visitor log row if available
        self::update_visitor_log_block( $crawler );

        // Send 403 and halt
        self::send_block_response();
    }

    // ── robots.txt Management ───────────────────────────────────────────────────

    /**
     * Filters the WordPress-generated robots.txt output to inject Disallow rules
     * for blocked AI crawlers.
     *
     * @param string $output   Existing robots.txt content.
     * @param bool   $public   Whether the site is public (blog_public option).
     * @return string  Modified robots.txt content.
     */
    public static function filter_robots_txt( string $output, bool $public ): string {
        $rules = self::get_robots_rules();

        if ( $rules === '' ) {
            return $output;
        }

        // Append a blank line separator and the AI crawler rules
        $output = rtrim( $output ) . "\n\n" . $rules . "\n";

        return $output;
    }

    /**
     * Generates the robots.txt additions for all blocked AI crawlers.
     * Each blocked crawler gets a User-agent + Disallow: / block.
     *
     * @return string  The robots.txt rules text, or empty string if none.
     */
    public static function get_robots_rules(): string {
        $block_all   = Settings::bool( 'madeit_security_block_ai_crawlers', false );
        $rules       = self::get_crawler_rules();
        $definitions = self::get_crawler_definitions();

        // Map crawler IDs to their robots.txt User-agent name
        $ua_names = self::get_robots_ua_names();

        $lines = [];
        $lines[] = '# AI Crawler Rules (managed by Made I.T. Security)';

        $has_rules = false;

        foreach ( $definitions as $crawler ) {
            $is_blocked = false;

            // Per-crawler rule takes precedence
            if ( isset( $rules[ $crawler['id'] ] ) ) {
                $is_blocked = $rules[ $crawler['id'] ] === 'block';
            } elseif ( $block_all ) {
                $is_blocked = true;
            } else {
                $is_blocked = $crawler['default_action'] === 'block';
            }

            if ( $is_blocked ) {
                $ua_name     = $ua_names[ $crawler['id'] ] ?? $crawler['name'];
                $lines[]     = '';
                $lines[]     = 'User-agent: ' . $ua_name;
                $lines[]     = 'Disallow: /';
                $has_rules   = true;
            }
        }

        if ( ! $has_rules ) {
            return '';
        }

        return implode( "\n", $lines );
    }

    /**
     * Maps crawler IDs to the User-agent token used in robots.txt.
     * Some crawlers use a different identifier in their UA string vs. robots.txt.
     *
     * @return array<string, string>
     */
    private static function get_robots_ua_names(): array {
        return [
            'gptbot'           => 'GPTBot',
            'chatgpt_user'     => 'ChatGPT-User',
            'google_extended'  => 'Google-Extended',
            'claudebot'        => 'ClaudeBot',
            'claude_web'       => 'Claude-Web',
            'anthropic'        => 'anthropic-ai',
            'ccbot'            => 'CCBot',
            'bytespider'       => 'Bytespider',
            'perplexitybot'    => 'PerplexityBot',
            'amazonbot'        => 'Amazonbot',
            'facebookbot'      => 'facebookexternalhit',
            'meta_external'    => 'Meta-ExternalAgent',
            'applebot_extended'=> 'Applebot-Extended',
            'cohere_ai'        => 'cohere-ai',
            'ai2bot'           => 'AI2Bot',
            'diffbot'          => 'Diffbot',
            'omgilibot'        => 'Omgilibot',
            'youbot'           => 'YouBot',
            'imagesiftbot'     => 'ImagesiftBot',
            'scrapy'           => 'Scrapy',
        ];
    }

    // ── Stats Method ────────────────────────────────────────────────────────────

    /**
     * Queries the visitor_log table for the last 30 days, groups by AI crawler
     * type, and returns the visit count per crawler.
     *
     * @return array<int, object{crawler_id: string, crawler_name: string, company: string, total_visits: int, last_seen: string}>
     */
    public static function get_crawler_stats(): array {
        global $wpdb;

        $table = $wpdb->prefix . 'madeit_security_visitor_log';

        // Build a CASE expression to classify visitor_log rows by crawler ID
        $definitions = self::get_crawler_definitions();
        $when_clauses = [];

        foreach ( $definitions as $crawler ) {
            // Convert the regex ua_pattern to a SQL LIKE-friendly needle.
            // Strip regex delimiters and flags, e.g. /GPTBot/i => GPTBot
            $needle = trim( $crawler['ua_pattern'], '/i' );
            $needle = $wpdb->esc_like( $needle );

            $when_clauses[] = $wpdb->prepare(
                "WHEN user_agent LIKE %s THEN %s",
                '%' . $needle . '%',
                $crawler['id']
            );
        }

        if ( empty( $when_clauses ) ) {
            return [];
        }

        $case_sql = 'CASE ' . implode( ' ', $when_clauses ) . " ELSE NULL END";
        $cutoff_30d = wp_date( 'Y-m-d H:i:s', time() - 30 * DAY_IN_SECONDS );

        // phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter,WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- $table is a safe table name, $case_sql built from hardcoded crawler patterns; security data must not be served from cache
        $results = $wpdb->get_results( $wpdb->prepare(
            "SELECT {$case_sql} AS crawler_id,
                    COUNT(*) AS total_visits,
                    MAX(created_at) AS last_seen
               FROM {$table}
              WHERE created_at >= %s
                AND ({$case_sql}) IS NOT NULL
              GROUP BY crawler_id
              ORDER BY total_visits DESC",
            $cutoff_30d
        ) );
        // phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter,WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        if ( ! $results ) {
            return [];
        }

        // Enrich with crawler metadata
        $defs_by_id = [];
        foreach ( $definitions as $def ) {
            $defs_by_id[ $def['id'] ] = $def;
        }

        foreach ( $results as $row ) {
            $def = $defs_by_id[ $row->crawler_id ] ?? null;
            $row->crawler_name = $def ? $def['name'] : $row->crawler_id;
            $row->company      = $def ? $def['company'] : 'Unknown';
        }

        return $results;
    }

    // ── AJAX Handlers ───────────────────────────────────────────────────────────

    /**
     * AJAX: Save per-crawler allow/block rules.
     * Expects POST with nonce and 'rules' as a JSON-encoded object.
     */
    public static function ajax_save_rules(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        // Accept both the per-crawler rules and the global toggle.
        // Rules arrive as a JSON string — sanitize individual fields after decoding.
        $raw_rules = isset( $_POST['rules'] ) ? wp_unslash( $_POST['rules'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- JSON string; individual values sanitized via sanitize_text_field() after json_decode below
        $block_all = isset( $_POST['block_all'] ) ? rest_sanitize_boolean( wp_unslash( $_POST['block_all'] ) ) : null;

        // Parse rules and sanitize decoded values.
        $rules = [];
        if ( is_string( $raw_rules ) && $raw_rules !== '' ) {
            $decoded = json_decode( $raw_rules, true );
            if ( is_array( $decoded ) ) {
                $rules = array_map( function ( $rule ) {
                    if ( is_array( $rule ) ) {
                        return array_map( 'sanitize_text_field', $rule );
                    }
                    return is_string( $rule ) ? sanitize_text_field( $rule ) : $rule;
                }, $decoded );
            }
        } elseif ( is_array( $raw_rules ) ) {
            $rules = array_map( function ( $rule ) {
                if ( is_array( $rule ) ) {
                    return array_map( 'sanitize_text_field', $rule );
                }
                return is_string( $rule ) ? sanitize_text_field( $rule ) : $rule;
            }, $raw_rules );
        }

        $saved = self::save_crawler_rules( $rules );

        // Update global toggle if provided
        if ( $block_all !== null ) {
            update_option( 'madeit_security_block_ai_crawlers', $block_all );
        }

        // Audit log
        self::audit(
            'ai_crawler_rules_updated',
            'settings',
            'ai_crawlers',
            'AI crawler rules updated. Block all: ' . ( $block_all ? 'yes' : 'no' )
                . '. Rules: ' . wp_json_encode( $rules )
        );

        wp_send_json_success( [
            'message'   => 'AI crawler rules saved successfully.',
            'rules'     => self::get_crawler_rules(),
            'block_all' => Settings::bool( 'madeit_security_block_ai_crawlers', false ),
        ] );
    }

    /**
     * AJAX: Get AI crawler visit stats for the last 30 days.
     */
    public static function ajax_get_stats(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        $stats       = self::get_crawler_stats();
        $definitions = self::get_crawler_definitions();
        $rules       = self::get_crawler_rules();
        $block_all   = Settings::bool( 'madeit_security_block_ai_crawlers', false );

        // Merge status into definitions for the front-end
        $crawlers = [];
        foreach ( $definitions as $def ) {
            $status = 'default';
            if ( isset( $rules[ $def['id'] ] ) ) {
                $status = $rules[ $def['id'] ];
            } elseif ( $block_all ) {
                $status = 'block';
            } else {
                $status = $def['default_action'];
            }
            $def['current_status'] = $status;
            $crawlers[] = $def;
        }

        wp_send_json_success( [
            'stats'     => $stats,
            'crawlers'  => $crawlers,
            'block_all' => $block_all,
            'rules'     => $rules,
        ] );
    }

    // ── Private Helpers ─────────────────────────────────────────────────────────

    /**
     * Logs a blocked AI crawler request to the audit log.
     */
    private static function audit_block( ?array $crawler, string $ua ): void {
        global $wpdb;

        $ip   = \MadeIT\Security\RequestLogger::get_real_ip();
        // phpcs:ignore WordPress.Security.NonceVerification.Missing -- audit logging during request interception
        $uri  = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/';
        $name = $crawler ? $crawler['name'] : 'Unknown AI Crawler';

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_audit_log',
            [
                'user_id'     => 0,
                'username'    => '',
                'action'      => 'ai_crawler_blocked',
                'object_type' => 'ai_crawler',
                'object_id'   => $crawler ? $crawler['id'] : 'unknown',
                'description' => sprintf(
                    'Blocked AI crawler: %s. IP: %s. URI: %s. UA: %s',
                    $name,
                    $ip,
                    $uri,
                    substr( $ua, 0, 200 )
                ),
                'ip'          => $ip,
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s' ]
        );
    }

    /**
     * Updates the current visitor_log row (if one exists) to mark it as blocked.
     */
    private static function update_visitor_log_block( ?array $crawler ): void {
        if ( empty( $GLOBALS['madeit_security_current_log_id'] ) ) {
            return;
        }

        global $wpdb;

        $name = $crawler ? $crawler['name'] : 'Unknown AI Crawler';

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->update(
            $wpdb->prefix . 'madeit_security_visitor_log',
            [
                'is_blocked'   => 1,
                'block_reason' => 'AI Crawler blocked: ' . $name,
                'status_code'  => 403,
            ],
            [ 'id' => $GLOBALS['madeit_security_current_log_id'] ],
            [ '%d', '%s', '%d' ],
            [ '%d' ]
        );
    }

    /**
     * Sends a 403 response for blocked AI crawlers and terminates execution.
     */
    private static function send_block_response(): void {
        if ( headers_sent() ) {
            return;
        }

        http_response_code( 403 );
        header( 'Content-Type: text/plain; charset=utf-8' );
        header( 'X-Robots-Tag: noai, noimageai' );
        echo 'This site does not permit AI training crawlers.';
        exit;
    }

    /**
     * Generic audit log helper — mirrors the pattern used in IPManager.
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

<?php
namespace MadeIT\Security\modules;

use MadeIT\Security\Settings;

defined( 'ABSPATH' ) || exit;

/**
 * Honeypot Protection
 * Invisible traps for bots:
 * 1. Hidden page link — any visit = instant ban
 * 2. Fake wp-login decoy — any access = instant ban
 * 3. Comment/form honeypot fields — catches spam bots
 * 4. Timing-based submission guard
 */
class Honeypot {

    /**
     * Known search engine / social / monitoring bots that legitimately crawl
     * page source and may follow hidden links. These must NEVER be banned by
     * the honeypot — they are good bots.
     *
     * We match on UA substrings (case-insensitive). The list is intentionally
     * conservative: only bots whose identity can be verified via reverse DNS
     * or whose presence is expected on every website.
     */
    private static array $safe_bot_patterns = [
        'googlebot',            // Google search
        'google-inspectiontool',// Google Search Console
        'googleother',          // Google misc
        'apis-google',          // Google APIs
        'mediapartners-google', // Google AdSense
        'adsbot-google',        // Google Ads
        'feedfetcher-google',   // Google Feed
        'bingbot',              // Bing search
        'msnbot',               // Bing (legacy)
        'bingpreview',          // Bing previews
        'slurp',                // Yahoo search
        'duckduckbot',          // DuckDuckGo search
        'baiduspider',          // Baidu search
        'yandexbot',            // Yandex search
        'yandexmobilebot',      // Yandex mobile
        'applebot',             // Apple search (not Extended — that's AI training)
        'facebookexternalhit',  // Facebook/Meta link previews
        'twitterbot',           // Twitter/X previews
        'linkedinbot',          // LinkedIn previews
        'pinterestbot',         // Pinterest
        'redditbot',            // Reddit previews
        'whatsapp',             // WhatsApp previews
        'telegrambot',          // Telegram previews
        'slackbot',             // Slack previews
        'discordbot',           // Discord previews
        'uptimerobot',          // Monitoring
        'jetmon',               // WordPress/Jetpack monitor
        'site24x7',             // Monitoring
        'pingdom',              // Monitoring
        'statuscake',           // Monitoring
    ];

    public static function init(): void {
        if ( ! Settings::bool( 'madeit_security_honeypot_enabled', true ) ) return;

        // ── Hidden link in footer (only bots follow undiscoverable links) ──────
        if ( Settings::bool( 'madeit_security_honeypot_link_enabled', true ) ) {
            add_action( 'wp_enqueue_scripts', [ __CLASS__, 'inject_honeypot_css' ] );
            add_action( 'wp_footer', [ __CLASS__, 'inject_hidden_link' ], 99 );
        }

        // ── Trap page handler ─────────────────────────────────────────────────
        add_action( 'init', [ __CLASS__, 'check_trap_url' ], 1 );

        // NOTE: Intentionally NOT adding honeypot slugs to robots.txt.
        // Doing so would reveal trap URLs to attackers who read robots.txt.

        // ── Fake login decoy ──────────────────────────────────────────────────
        if ( Settings::bool( 'madeit_security_honeypot_fake_login', true ) ) {
            add_action( 'init', [ __CLASS__, 'check_fake_login' ], 1 );
        }

        // ── Comment form honeypot ─────────────────────────────────────────────
        if ( Settings::bool( 'madeit_security_honeypot_comments', true ) ) {
            add_filter( 'comment_form_fields',  [ __CLASS__, 'inject_comment_honeypot' ] );
            add_filter( 'preprocess_comment',   [ __CLASS__, 'check_comment_honeypot'  ] );
        }

        // ── Contact Form 7 / WPForms honeypot ────────────────────────────────
        if ( Settings::bool( 'madeit_security_honeypot_forms', true ) ) {
            add_filter( 'wpcf7_validate', [ __CLASS__, 'check_cf7_honeypot' ], 20, 2 );
        }

        // ── WP login honeypot timer + hidden field ───────────────────────────
        if ( Settings::bool( 'madeit_security_honeypot_wp_login', true ) ) {
            add_action( 'login_form', [ __CLASS__, 'inject_wp_login_honeypot' ] );
            add_filter( 'authenticate', [ __CLASS__, 'check_wp_login_honeypot' ], 5, 3 );
        }

        // ── Scanner-specific traps ─────────────────────────────────────────
        // Fake plugin readme.txt: scanners probe /wp-content/plugins/{slug}/readme.txt
        // to fingerprint installed plugins. We inject a fake "honeypot plugin" slug
        // that only automated tools discover (via 403-based enumeration).
        if ( Settings::bool( 'madeit_security_honeypot_scanner_trap', true ) ) {
            add_action( 'init', [ __CLASS__, 'check_scanner_trap' ], 1 );
        }
    }

    /**
     * Check if the given User-Agent belongs to a known safe bot that should
     * NEVER be banned by the honeypot.
     *
     * Checks two sources:
     * 1. Built-in list of search engines, social previews, and monitoring bots
     * 2. AI crawlers that the user has explicitly ALLOWED in their AI Crawler settings
     */
    private static function is_safe_bot( string $ua ): bool {
        // Check IP ranges first — crawlers don't always identify themselves in the UA.
        // Microsoft/Google services often use generic library UAs (Java/, okhttp, etc.)
        // or even empty UAs while crawling from their known IP ranges.
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) ) {
            $ip = \MadeIT\Security\RequestLogger::get_real_ip();
            if ( \MadeIT\Security\Whitelist::is_google_ip( $ip ) || \MadeIT\Security\Whitelist::is_microsoft_ip( $ip ) ) {
                return true;
            }
        }

        if ( $ua === '' ) return false;

        $ua_lower = strtolower( $ua );

        // 1. Check against known search engine / social / monitoring bots
        foreach ( self::$safe_bot_patterns as $pattern ) {
            if ( str_contains( $ua_lower, $pattern ) ) {
                return true;
            }
        }

        // 2. Check against AI crawlers that the user has ALLOWED
        if ( class_exists( 'MadeIT\Security\\modules\\AICrawlers' ) ) {
            $definitions = AICrawlers::get_crawler_definitions();
            $rules       = AICrawlers::get_crawler_rules();
            $block_all   = Settings::bool( 'madeit_security_block_ai_crawlers', false );

            foreach ( $definitions as $crawler ) {
                if ( ! preg_match( $crawler['ua_pattern'], $ua ) ) {
                    continue;
                }

                // This UA matches a known AI crawler — check if it's allowed
                if ( isset( $rules[ $crawler['id'] ] ) ) {
                    // User has an explicit rule for this crawler
                    return $rules[ $crawler['id'] ] === 'allow';
                }

                // No explicit rule — fall back to global + default
                if ( $block_all ) {
                    return false; // block-all is on, this crawler has no exception
                }

                // Use the crawler's default action
                return ( $crawler['default_action'] ?? 'block' ) === 'allow';
            }
        }

        return false;
    }

    // ── Generate/get the trap slug ─────────────────────────────────────────────
    private static function trap_slug(): string {
        $slug = Settings::string( 'madeit_security_honeypot_slug', '' );
        if ( ! $slug ) {
            $slug = 'wp-' . wp_generate_password( 10, false );
            update_option( 'madeit_security_honeypot_slug', $slug );
        }
        return $slug;
    }

    // ── Inject invisible link into footer ──────────────────────────────────────
    public static function inject_hidden_link(): void {
        $slug = self::trap_slug();
        $url  = home_url( '/' . $slug );
        // Must use external stylesheet class — never inline style (smart bots detect inline)
        echo "\n";
        echo '<a href="' . esc_url( $url ) . '" class="madeit-security-hp-link" aria-hidden="true" tabindex="-1" rel="nofollow noopener"></a>' . "\n";
    }

    // ── Enqueue the CSS that hides the link ────────────────────────────────────
    public static function inject_honeypot_css(): void {
        wp_enqueue_style( 'madeit-security-honeypot-hidden', MADEIT_SECURITY_URL . 'includes/assets/css/honeypot-hidden.css', [], MADEIT_VERSION );
    }

    // ── Check if the trap URL was accessed ────────────────────────────────────
    public static function check_trap_url(): void {
        $slug = Settings::string( 'madeit_security_honeypot_slug', '' );
        if ( ! $slug ) return;

        $raw_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/'; // phpcs:ignore WordPress.Security.NonceVerification.Missing
        $path    = trim( strtok( $raw_uri, '?' ), '/' );

        if ( $path !== $slug ) return;

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();
        $ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing

        // Whitelisted IPs are never banned from the honeypot
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) {
            // Show a message to admins so they know the trap works
            http_response_code( 200 );
            echo '<!-- Security Honeypot trap active. Your IP is whitelisted so you are seeing this message. -->';
            exit;
        }

        // Safe bots (Googlebot, Bingbot, allowed AI crawlers, etc.) are
        // never banned by the honeypot. They follow links in page source
        // because that's their job — punishing them would hurt your SEO
        // and break allowed integrations.
        if ( self::is_safe_bot( $ua ) ) {
            // Serve a silent 404 — no block, no event logged
            status_header( 404 );
            nocache_headers();
            echo '<!DOCTYPE html><html><head><title>404</title></head><body><h1>Not Found</h1></body></html>';
            exit;
        }

        // Log the event
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'honeypot_triggered',
                'severity'    => 'high',
                'ip'          => $ip,
                'url'         => home_url( '/' . $slug ),
                'rule_id'     => 'honeypot_link',
                'description' => "Honeypot trap accessed — IP flagged as automated bot.",
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s','%s','%s','%s','%s','%s','%s' ]
        );

        // Auto-ban the IP
        IPManager::block_ip( $ip, 'Honeypot: accessed hidden trap URL', 0, 'honeypot', 0 );

        // Serve a realistic 404 — never acknowledge the trap
        status_header( 404 );
        nocache_headers();
        $template = get_404_template();
        if ( $template ) {
            include $template;
        } else {
            echo '<!DOCTYPE html><html><head><title>404</title></head><body><h1>Not Found</h1></body></html>';
        }
        exit;
    }

    // ── Fake wp-login decoy ────────────────────────────────────────────────────
    public static function check_fake_login(): void {
        $decoy = Settings::string( 'madeit_security_honeypot_fake_login_slug', 'wp-login-secure' );
        $raw_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/'; // phpcs:ignore WordPress.Security.NonceVerification.Missing
        $path    = trim( strtok( $raw_uri, '?' ), '/' );

        if ( $path !== $decoy ) return;

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();
        $ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing

        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) return;

        // Safe bots (search engines, allowed AI crawlers) get a 404 — not a ban
        if ( self::is_safe_bot( $ua ) ) {
            status_header( 404 );
            nocache_headers();
            echo '<!DOCTYPE html><html><head><title>404</title></head><body><h1>Not Found</h1></body></html>';
            exit;
        }

        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'honeypot_triggered',
                'severity'    => 'critical',
                'ip'          => $ip,
                'url'         => home_url( '/' . $decoy ),
                'rule_id'     => 'honeypot_fake_login',
                'description' => "Fake login decoy accessed — automatic IP ban applied.",
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s','%s','%s','%s','%s','%s','%s' ]
        );

        // Permanent ban — only bots try unknown login URLs
        IPManager::block_ip( $ip, 'Honeypot: accessed fake login decoy page', 0, 'honeypot_login', 0 );

        // Show a convincing fake login page to waste bot time, then 403
        http_response_code( 403 );
        wp_register_style( 'madeit-security-honeypot-login', MADEIT_SECURITY_URL . 'includes/assets/css/honeypot-fake-login.css', [], MADEIT_VERSION );
        wp_enqueue_style( 'madeit-security-honeypot-login' );
        echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Log In</title>';
        wp_print_styles( 'madeit-security-honeypot-login' );
        echo '</head><body><div class="lc">
<h1>Log In</h1>
<div class="err">ERROR: Invalid username or incorrect password.</div>
<form method="post">
<label>Username</label><input type="text" name="log" />
<label>Password</label><input type="password" name="pwd" />
<input class="btn" type="submit" value="Log In" />
</form></div></body></html>';
        exit;
    }

    // ── Comment honeypot injection ─────────────────────────────────────────────
    public static function inject_comment_honeypot( array $fields ): array {
        // The trap field has a plausible name. CSS hides it from humans, bots fill it.
        $honeypot_field = '<p class="comment-form-website" style="display:none!important;visibility:hidden!important;">
            <label for="madeit_security_website_url">Website</label>
            <input id="madeit_security_website_url" name="madeit_security_hp_website" type="text" value="" autocomplete="off" tabindex="-1" aria-hidden="true" />
        </p>';

        // Timing token: embed the current time to detect sub-3-second submissions
        $token = base64_encode( time() . '|' . wp_create_nonce( 'madeit_security_comment_time' ) );
        $honeypot_field .= '<input type="hidden" name="madeit_security_hp_time" value="' . esc_attr( $token ) . '" />';

        $fields['email'] = ( $fields['email'] ?? '' ) . $honeypot_field;
        return $fields;
    }

    public static function check_comment_honeypot( array $comment_data ): array {
        // 1. Filled honeypot field = bot
        if ( ! empty( $_POST['madeit_security_hp_website'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- comment nonce is verified by WordPress core and within the timing check below
            self::block_commenter( 'Honeypot field was filled' );
            wp_die( 'Spam detected.', 'Spam', [ 'response' => 403 ] );
        }

        // 2. Submission in under 3 seconds = bot
        if ( ! empty( $_POST['madeit_security_hp_time'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- comment nonce is verified by wp_verify_nonce() below
            $raw = base64_decode( sanitize_text_field( wp_unslash( $_POST['madeit_security_hp_time'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
            if ( $raw && str_contains( $raw, '|' ) ) {
                [ $ts, $nonce ] = explode( '|', $raw, 2 );
                $submitted_at = (int) $ts;

                // Verify the nonce to prevent forged timing tokens
                if ( ! wp_verify_nonce( $nonce, 'madeit_security_comment_time' ) ) {
                    self::block_commenter( 'Invalid honeypot timing token (forged or expired)' );
                    wp_die( 'Spam detected.', 'Spam', [ 'response' => 403 ] );
                }

                if ( ( time() - $submitted_at ) < 3 ) {
                    self::block_commenter( 'Comment submitted in under 3 seconds (bot timing)' );
                    wp_die( 'Please take more time to write your comment.', 'Too Fast', [ 'response' => 429 ] );
                }
            }
        }

        return $comment_data;
    }

    private static function block_commenter( string $reason ): void {
        $ip = \MadeIT\Security\RequestLogger::get_real_ip();
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) return;
        IPManager::block_ip( $ip, 'Honeypot comment: ' . $reason, 86400, 'honeypot_comment', 0 );
    }

    // ── CF7 honeypot check ─────────────────────────────────────────────────────
    public static function check_cf7_honeypot( $result, $tag ): mixed {
        if ( ! empty( $_POST['madeit_security_hp_website'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- CF7 handles its own nonce verification
            $result->invalidate( $tag, 'Spam detected.' );
        }
        return $result;
    }

    // ── WP login honeypot (hidden field + timing) ───────────────────────────
    public static function inject_wp_login_honeypot(): void {
        $token = base64_encode( time() . '|' . wp_create_nonce( 'madeit_security_login_time' ) );

        echo '<p style="display:none!important;visibility:hidden!important;">';
        echo '<label for="madeit_security_hp_login_website">Website</label>';
        echo '<input id="madeit_security_hp_login_website" name="madeit_security_hp_login_website" type="text" value="" autocomplete="off" tabindex="-1" aria-hidden="true" />';
        echo '</p>';
        echo '<input type="hidden" name="madeit_security_hp_login_time" value="' . esc_attr( $token ) . '" />';
    }

    public static function check_wp_login_honeypot( $user, $username, $password ) {
        $action = isset( $_REQUEST['action'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['action'] ) ) : 'login'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ( $action !== 'login' ) {
            return $user;
        }

        if ( $_SERVER['REQUEST_METHOD'] !== 'POST' ) {
            return $user;
        }

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();
        $ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing

        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) {
            return $user;
        }

        // Hidden field is filled: automated submission.
        if ( ! empty( $_POST['madeit_security_hp_login_website'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
            self::ban_login_honeypot_ip( $ip, $ua, 'Login honeypot field was filled', 'honeypot_login_field' );
            return new \WP_Error( 'madeit_security_honeypot', __( 'Invalid login request.', 'madeit-security' ) );
        }

        // Missing timing token: suspicious automated request.
        if ( empty( $_POST['madeit_security_hp_login_time'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
            self::ban_login_honeypot_ip( $ip, $ua, 'Login honeypot timing token missing', 'honeypot_login_missing_time' );
            return new \WP_Error( 'madeit_security_honeypot', __( 'Invalid login request.', 'madeit-security' ) );
        }

        $raw = base64_decode( sanitize_text_field( wp_unslash( $_POST['madeit_security_hp_login_time'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if ( ! $raw || ! str_contains( $raw, '|' ) ) {
            self::ban_login_honeypot_ip( $ip, $ua, 'Login honeypot timing token malformed', 'honeypot_login_bad_time' );
            return new \WP_Error( 'madeit_security_honeypot', __( 'Invalid login request.', 'madeit-security' ) );
        }

        [ $ts, $nonce ] = explode( '|', $raw, 2 );
        $submitted_at = (int) $ts;

        if ( ! wp_verify_nonce( $nonce, 'madeit_security_login_time' ) ) {
            self::ban_login_honeypot_ip( $ip, $ua, 'Login honeypot timing nonce invalid', 'honeypot_login_invalid_nonce' );
            return new \WP_Error( 'madeit_security_honeypot', __( 'Invalid login request.', 'madeit-security' ) );
        }

        if ( ( time() - $submitted_at ) < 2 ) {
            self::ban_login_honeypot_ip( $ip, $ua, 'Login submitted too fast for human interaction', 'honeypot_login_too_fast' );
            return new \WP_Error( 'madeit_security_honeypot', __( 'Invalid login request.', 'madeit-security' ) );
        }

        return $user;
    }

    private static function ban_login_honeypot_ip( string $ip, string $ua, string $description, string $rule_id ): void {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'honeypot_triggered',
                'severity'    => 'critical',
                'ip'          => $ip,
                'url'         => wp_login_url(),
                'rule_id'     => $rule_id,
                'description' => $description,
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s','%s','%s','%s','%s','%s','%s' ]
        );

        IPManager::block_ip( $ip, 'Honeypot login trigger: ' . $description, 0, 'honeypot_login', 0 );
    }

    // ── Scanner trap (fake plugin honeypot) ────────────────────────────────
    /**
     * Catches scanners that enumerate plugins via directory probing.
     *
     * Both WPScan and WPProbe check for the existence of plugins by requesting
     * /wp-content/plugins/{slug}/ and checking for 403 (exists) vs 404 (missing).
     * If the slug returns 403, they follow up with readme.txt for version info.
     *
     * We create a fake plugin slug that:
     * 1. Is NOT listed on WordPress.org (so it won't appear in public wordlists)
     * 2. Returns 403 on directory access (looks like a real plugin)
     * 3. Returns a fake readme.txt with a canary version string
     * 4. Any access = instant ban (only automated scanners would find it)
     *
     * The slug looks realistic: "developer-toolkit-pro" — a name that could
     * plausibly be a private/premium plugin not in the public repo.
     */
    public static function check_scanner_trap(): void {
        $raw_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/'; // phpcs:ignore WordPress.Security.NonceVerification.Missing
        $path    = rtrim( strtok( $raw_uri, '?' ), ' ' );

        // The fake plugin slug — looks like a plausible premium plugin.
        $fake_slug = Settings::string( 'madeit_security_honeypot_fake_plugin', 'developer-toolkit-pro' );
        $base      = '/wp-content/plugins/' . $fake_slug;

        // Match: /wp-content/plugins/{fake_slug}/ (directory probe)
        //   and: /wp-content/plugins/{fake_slug}/readme.txt (version extraction)
        //   and: /wp-content/plugins/{fake_slug}/readme.txt variants
        if ( ! str_starts_with( $path, $base ) ) {
            return;
        }

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();
        $ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing

        // Whitelisted IPs always pass
        if ( class_exists( 'MadeIT\Security\\Whitelist' ) && \MadeIT\Security\Whitelist::is_allowed( $ip ) ) {
            return;
        }

        // Safe bots get a normal 404
        if ( self::is_safe_bot( $ua ) ) {
            status_header( 404 );
            nocache_headers();
            echo '<!DOCTYPE html><html><head><title>404</title></head><body><h1>Not Found</h1></body></html>';
            exit;
        }

        // Log event
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_events',
            [
                'event_type'  => 'honeypot_triggered',
                'severity'    => 'critical',
                'ip'          => $ip,
                'url'         => home_url( $path ),
                'rule_id'     => 'honeypot_scanner_trap',
                'description' => 'Scanner trap: probed fake plugin "' . $fake_slug . '" — only automated scanners discover this.',
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%s','%s','%s','%s','%s','%s','%s' ]
        );

        // Permanent ban — no legitimate user would ever hit this path.
        IPManager::block_ip( $ip, 'Honeypot: scanner probed fake plugin "' . $fake_slug . '"', 0, 'honeypot_scanner', 0 );

        // For the directory request, return 403 (makes the scanner think
        // it found a real plugin and follow up with readme.txt — which also bans).
        // For readme.txt, return a fake readme body to waste scanner time.
        $relative = substr( $path, strlen( $base ) );
        if ( preg_match( '/readme\.txt/i', $relative ) ) {
            // Serve a fake readme.txt — the scanner will parse it thinking it succeeded.
            nocache_headers();
            header( 'Content-Type: text/plain; charset=utf-8' );
            echo "=== Developer Toolkit Pro ===\n";
            echo "Contributors: developer-team\n";
            echo "Tags: development, tools, admin\n";
            echo "Requires at least: 6.0\n";
            echo "Tested up to: 6.9\n";
            echo "Stable tag: 4.2.1\n";
            echo "License: GPLv2 or later\n\n";
            echo "== Description ==\n\n";
            echo "Premium developer toolkit for advanced WordPress administration.\n";
            exit;
        }

        // Directory probe: return 403 (scanner thinks plugin exists)
        status_header( 403 );
        nocache_headers();
        echo '<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body><h1>Forbidden</h1></body></html>';
        exit;
    }

    // ── Admin helpers ──────────────────────────────────────────────────────────
    public static function get_trap_url(): string {
        return home_url( '/' . self::trap_slug() );
    }

    public static function get_stats(): array {
        global $wpdb;
        $event_type = 'honeypot_triggered';
        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        return [
            'total'   => (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events WHERE event_type = %s", $event_type ) ),
            'today'   => (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events WHERE event_type = %s AND DATE(created_at) = %s", $event_type, wp_date( 'Y-m-d' ) ) ),
            'last_hit'=> $wpdb->get_var( $wpdb->prepare( "SELECT created_at FROM {$wpdb->prefix}madeit_security_events WHERE event_type = %s ORDER BY created_at DESC LIMIT 1", $event_type ) ),
            'top_ips' => $wpdb->get_results( $wpdb->prepare( "SELECT ip, COUNT(*) as hits FROM {$wpdb->prefix}madeit_security_events WHERE event_type = %s GROUP BY ip ORDER BY hits DESC LIMIT 5", $event_type ) ),
        ];
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
    }

    public static function regenerate_slug(): string {
        $slug = 'wp-' . wp_generate_password( 10, false );
        update_option( 'madeit_security_honeypot_slug', $slug );
        return $slug;
    }
}
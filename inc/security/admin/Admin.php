<?php
namespace MadeIT\Security\Admin;

defined( 'ABSPATH' ) || exit;

class Admin {

    private static ?self $instance = null;

    public static function get_instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function boot(): void {
        add_action( 'admin_menu',            [ $this, 'register_menus' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
        add_action( 'admin_notices',         [ $this, 'admin_notices'  ] );

        // Prevent caching on all plugin admin pages (must fire before headers are sent)
        add_action( 'admin_init', [ $this, 'nocache_plugin_pages' ], 0 );

        // Plugin list "Made by" links
        add_filter( 'plugin_row_meta', [ $this, 'plugin_row_meta' ], 10, 2 );

        // Deactivation dialog on plugins.php
        add_action( 'admin_footer-plugins.php', [ $this, 'deactivation_dialog' ] );
        add_action( 'wp_ajax_madeit_security_set_uninstall_pref', [ $this, 'ajax_set_uninstall_pref' ] );

        // AJAX for settings save
        add_action( 'wp_ajax_madeit_security_save_settings',        [ $this, 'ajax_save_settings' ] );
        add_action( 'wp_ajax_madeit_security_complete_setup',        [ $this, 'ajax_complete_setup' ] );
        add_action( 'wp_ajax_madeit_security_dismiss_setup_notice',  [ $this, 'ajax_dismiss_setup_notice' ] );
        add_action( 'wp_ajax_madeit_security_apply_recommended',     [ $this, 'ajax_apply_recommended' ] );

        // Setup wizard — accessible via sidebar, no forced redirect.
    }

    /**
     * Prevent ALL caching on Security admin pages and AJAX endpoints.
     *
     * - Sends Cache-Control / Pragma / Expires headers (browser-level).
     * - Defines DONOTCACHEPAGE, DONOTCACHEOBJECT, DONOTCACHEDB constants
     *   respected by WP Super Cache, W3 Total Cache, WP Rocket, LiteSpeed
     *   Cache, WP Fastest Cache, Hummingbird, and most other caching plugins.
     * - Also sets the LSCACHE_NO_CACHE constant for LiteSpeed specifically.
     *
     * Hooked at admin_init priority 0 — runs before anything else can output.
     */
    public function nocache_plugin_pages(): void {
        // Check if we're on a MadeIT Security admin page or handling a MadeIT Security AJAX request
        $is_plugin_page = isset( $_GET['page'] ) && strpos( sanitize_key( $_GET['page'] ), 'madeit-security' ) === 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- reading page slug to set cache headers, not processing form data
        $is_plugin_ajax = wp_doing_ajax() && isset( $_REQUEST['action'] ) && strpos( sanitize_key( $_REQUEST['action'] ), 'madeit_security_' ) === 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- reading AJAX action name to set cache headers, not processing form data

        if ( ! $is_plugin_page && ! $is_plugin_ajax ) {
            return;
        }

        // ── Page-caching interop constants ──────────────────────────────────
        // These are well-known WordPress ecosystem constants used by WP Super
        // Cache, W3 Total Cache, LiteSpeed Cache and most other caching plugins
        // to signal "do not cache this response". They are NOT our own constants;
        // we are merely setting external constants as consumers of those APIs.
        // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- external WordPress caching ecosystem constants
        if ( ! defined( 'DONOTCACHEPAGE' ) )   define( 'DONOTCACHEPAGE', true );
        if ( ! defined( 'DONOTCACHEOBJECT' ) ) define( 'DONOTCACHEOBJECT', true );
        if ( ! defined( 'DONOTCACHEDB' ) )     define( 'DONOTCACHEDB', true );
        if ( ! defined( 'LSCACHE_NO_CACHE' ) ) define( 'LSCACHE_NO_CACHE', true );
        // phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound

        // ── HTTP headers (browser + CDN / reverse-proxy) ────────────────────
        if ( ! headers_sent() ) {
            header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0, private' );
            header( 'Pragma: no-cache' );
            header( 'Expires: Wed, 11 Jan 1984 05:00:00 GMT' );
            // Tell Cloudflare / Varnish / Nginx micro-cache not to cache
            header( 'X-Accel-Expires: 0' );                    // Nginx
            header( 'Surrogate-Control: no-store' );            // Varnish / Fastly
        }
    }

    public function register_menus(): void {
        add_submenu_page( 'madeit-blocks', 'Security',        'Security',         'manage_options', 'madeit-security',                 [ $this, 'render_dashboard'      ] );



        // Alphabetical A–Z
        add_submenu_page( 'madeit-security', 'AI Crawlers',      'AI Crawlers',       'manage_options', 'madeit-security-ai-crawlers',     [ $this, 'render_ai_crawlers'    ] );
        add_submenu_page( 'madeit-security', 'Audit Log',        'Audit Log',         'manage_options', 'madeit-security-audit',           [ $this, 'render_audit_log'      ] );
        add_submenu_page( 'madeit-security', 'Cron Guard',       'Cron Guard',        'manage_options', 'madeit-security-cron',            [ $this, 'render_cron_guard'     ] );
        add_submenu_page( 'madeit-security', 'GeoIP Database',   'GeoIP Database',    'manage_options', 'madeit-security-geoip',           [ $this, 'render_geoip'          ] );
        add_submenu_page( 'madeit-security', 'Hardening Status', 'Hardening Status',  'manage_options', 'madeit-security-hardening',       [ $this, 'render_hardening'      ] );
        add_submenu_page( 'madeit-security', 'Honeypot',         'Honeypot',          'manage_options', 'madeit-security-honeypot',        [ $this, 'render_honeypot'       ] );
        add_submenu_page( 'madeit-security', 'IP Block List',    'IP Block List',     'manage_options', 'madeit-security-ip-mgmt',         [ $this, 'render_ip_mgmt'        ] );
        add_submenu_page( 'madeit-security', 'IP Whitelist',     'IP Whitelist',      'manage_options', 'madeit-security-whitelist',       [ $this, 'render_whitelist'      ] );
        add_submenu_page( 'madeit-security', 'Login Security',   'Login Security',    'manage_options', 'madeit-security-login',           [ $this, 'render_login_security' ] );
        add_submenu_page( 'madeit-security', 'Malware Scanner',  'Malware Scanner',   'manage_options', 'madeit-security-scanner',         [ $this, 'render_malware_scan'   ] );
        add_submenu_page( 'madeit-security', 'Notifications',    'Notifications',     'manage_options', 'madeit-security-notifications',   [ $this, 'render_notifications'  ] );
        add_submenu_page( 'madeit-security', 'Outbound Monitor', 'Outbound Monitor',  'manage_options', 'madeit-security-outbound',        [ $this, 'render_outbound'       ] );
        add_submenu_page( 'madeit-security', 'Password Policy',  'Password Policy',   'manage_options', 'madeit-security-password-policy', [ $this, 'render_password_policy'] );
        add_submenu_page( 'madeit-security', 'Post-Breach',      'Post-Breach',       'manage_options', 'madeit-security-post-breach',     [ $this, 'render_post_breach'    ] );
        add_submenu_page( 'madeit-security', 'REST API',         'REST API',          'manage_options', 'madeit-security-rest-api',        [ $this, 'render_rest_api'       ] );
        add_submenu_page( 'madeit-security', 'Security Headers', 'Security Headers',  'manage_options', 'madeit-security-headers',         [ $this, 'render_headers'        ] );
        add_submenu_page( 'madeit-security', 'Session Security', 'Session Security',  'manage_options', 'madeit-security-sessions',        [ $this, 'render_sessions'       ] );
        add_submenu_page( 'madeit-security', 'Two-Factor Auth',  'Two-Factor Auth',   'manage_options', 'madeit-security-2fa',             [ $this, 'render_2fa'            ] );
        add_submenu_page( 'madeit-security', 'Visitor Log',      'Visitor Log',       'manage_options', 'madeit-security-visitor-log',     [ $this, 'render_visitor_log'    ] );
        add_submenu_page( 'madeit-security', 'Vuln Audit',       'Vuln Audit',        'manage_options', 'madeit-security-vuln-audit',      [ $this, 'render_vuln_audit'     ] );
        add_submenu_page( 'madeit-security', 'WAF',              'WAF',               'manage_options', 'madeit-security-waf',             [ $this, 'render_waf'            ] );

        // Settings, About & Setup always last
        add_submenu_page( 'madeit-security', 'Settings',         'Settings',          'manage_options', 'madeit-security-settings',        [ $this, 'render_settings'       ] );
        add_submenu_page( 'madeit-security', 'About',            'About',             'manage_options', 'madeit-security-about',           [ $this, 'render_about'          ] );
        add_submenu_page( 'madeit-security', 'Setup Wizard',     'Setup Wizard',      'manage_options', 'madeit-security-setup',           [ $this, 'render_setup_wizard'   ] );

    }

    public function enqueue_assets( string $hook ): void {
        if ( strpos( $hook, 'madeit-security' ) === false ) return;

        wp_enqueue_style(
            'madeit-security-admin',
            MADEIT_SECURITY_URL . 'admin/assets/css/admin.css',
            [],
            MADEIT_VERSION
        );

        wp_enqueue_script(
            'chartjs',
            MADEIT_SECURITY_URL . 'admin/assets/js/chart.min.js',
            [],
            '4.4.1',
            true
        );

        wp_enqueue_script(
            'madeit-security-admin',
            MADEIT_SECURITY_URL . 'admin/assets/js/admin.js',
            [ 'jquery', 'chartjs' ],
            MADEIT_VERSION,
            true
        );

        wp_localize_script( 'madeit-security-admin', 'madeitSecurity', [
            'ajax_url'   => admin_url( 'admin-ajax.php' ),
            'nonce'      => wp_create_nonce( 'madeit_security_nonce' ),
            'version'    => MADEIT_VERSION,
            'site_url'   => site_url(),
            'admin_url'  => admin_url(),
            'my_ip'      => \MadeIT\Security\RequestLogger::get_real_ip(),
            'brand_url'  => MADEIT_SECURITY_BRAND_URL,
            'brand_name' => MADEIT_SECURITY_BRAND_NAME,
            'strings'    => [
                'confirm_block'   => __( 'Block this IP address?', 'madeit' ),
                'confirm_unblock' => __( 'Unblock this IP address?', 'madeit' ),
                'blocking'        => __( 'Blocking…', 'madeit' ),
                'unblocking'      => __( 'Unblocking…', 'madeit' ),
                'blocked'         => __( 'Blocked', 'madeit' ),
                'unblocked'       => __( 'Unblocked', 'madeit' ),
                'error'           => __( 'Error. Try again.', 'madeit' ),
                'live_label'      => __( 'Live — updating every 15s', 'madeit' ),
            ],
        ] );

        // Setup wizard script (standalone, no jQuery dependency).
        if ( strpos( $hook, 'madeit-security-setup' ) !== false ) {
            wp_enqueue_script(
                'madeit-security-wizard',
                MADEIT_SECURITY_URL . 'admin/assets/js/wizard.js',
                [],
                MADEIT_VERSION,
                true
            );
            wp_localize_script( 'madeit-security-wizard', 'madeitSecurityWizard', [
                'ajax_url'  => admin_url( 'admin-ajax.php' ),
                'nonce'     => wp_create_nonce( 'madeit_security_nonce' ),
                'admin_url' => admin_url(),
            ] );
        }
    }

    // ── footer — rendered inside .madeit-security-layout__main by page_close()
    private function admin_footer(): void {
        ?>
        <div class="madeit-security-admin-footer">
            <span class="madeit-security-admin-footer__text">
                <?php echo esc_html( MADEIT_SECURITY_BRAND_NAME ); ?> v<?php echo esc_html( MADEIT_VERSION ); ?> is made with ❤️ by
                <a href="<?php echo esc_url( MADEIT_SECURITY_BRAND_URL ); ?>" target="_blank" rel="noopener"><?php echo esc_html( MADEIT_SECURITY_BRAND_NAME ); ?></a>
            </span>
            <span class="madeit-security-admin-footer__links">
                <a href="<?php echo esc_url( MADEIT_SECURITY_BRAND_DOCS ); ?>" target="_blank" rel="noopener">📖 Docs</a>
                <span>·</span>
                <a href="<?php echo esc_url( MADEIT_SECURITY_BRAND_SUPPORT ); ?>" target="_blank" rel="noopener">💬 Support</a>
                <span>·</span>
                <a href="<?php echo esc_url( MADEIT_SECURITY_BRAND_URL ); ?>" target="_blank" rel="noopener"><?php echo esc_html( MADEIT_SECURITY_BRAND_NAME ); ?></a>
            </span>
        </div>
        <?php
    }

    // ── Extra links in the Plugins list ───────────────────────────────────────
    public function plugin_row_meta( array $links, string $file ): array {
        if ( plugin_basename( MADEIT_SECURITY_FILE ) !== $file ) return $links;
        $links[] = '<a href="' . esc_url( MADEIT_SECURITY_BRAND_DOCS ) . '" target="_blank">📖 Documentation</a>';
        $links[] = '<a href="' . esc_url( MADEIT_SECURITY_BRAND_SUPPORT ) . '" target="_blank">💬 Support</a>';
        $links[] = '<a href="' . esc_url( MADEIT_SECURITY_BRAND_URL ) . '" target="_blank" style="color:#0a3cff;font-weight:600">🔒 ' . esc_html( MADEIT_SECURITY_BRAND_NAME ) . '</a>';
        return $links;
    }

    public function admin_notices(): void {
        $screen = get_current_screen();
        if ( ! $screen || strpos( $screen->id, 'madeit-security' ) === false ) return;

        // Setup wizard prompt — only show if setup not complete AND user hasn't dismissed it.
        // The notice renders inside the dashboard page content (not as a WP admin notice)
        // so it doesn't float above the layout. See dashboard.php for the inline prompt.
    }

    // ── Inner sidebar layout wrapper ────────────────────────────────────────
    private function page_open( string $active_slug ): void {
        echo '<div class="madeit-security-wrap"><div class="madeit-security-layout">';
        require MADEIT_SECURITY_DIR . 'admin/views/_sidebar.php';
        echo '<div class="madeit-security-layout__main">';
    }

    private function page_close(): void {
        // Footer lives inside the layout (not in WP's #wpfooter)
        $this->admin_footer();
        echo '</div><!-- .madeit-security-layout__main -->';
        echo '</div><!-- .madeit-security-layout -->';
        echo '</div><!-- .madeit-security-wrap -->';
    }

    // ── Page Renderers (each wrapped with inner sidebar) ────────────────────
    public function render_dashboard(): void      { $this->page_open( 'madeit-security' );                 require_once MADEIT_SECURITY_DIR . 'admin/views/dashboard.php';        $this->page_close(); }
    public function render_visitor_log(): void    { $this->page_open( 'madeit-security-visitor-log' );     require_once MADEIT_SECURITY_DIR . 'admin/views/visitor-log.php';      $this->page_close(); }
    public function render_whitelist(): void      { $this->page_open( 'madeit-security-whitelist' );       require_once MADEIT_SECURITY_DIR . 'admin/views/whitelist.php';        $this->page_close(); }
    public function render_ip_mgmt(): void        { $this->page_open( 'madeit-security-ip-mgmt' );         require_once MADEIT_SECURITY_DIR . 'admin/views/ip-management.php';    $this->page_close(); }
    public function render_login_security(): void { $this->page_open( 'madeit-security-login' );           require_once MADEIT_SECURITY_DIR . 'admin/views/login-security.php';   $this->page_close(); }
    public function render_hardening(): void      { $this->page_open( 'madeit-security-hardening' );       require_once MADEIT_SECURITY_DIR . 'admin/views/hardening.php';        $this->page_close(); }
    public function render_audit_log(): void      { $this->page_open( 'madeit-security-audit' );           require_once MADEIT_SECURITY_DIR . 'admin/views/audit-log.php';        $this->page_close(); }
    public function render_ai_crawlers(): void    { $this->page_open( 'madeit-security-ai-crawlers' );     require_once MADEIT_SECURITY_DIR . 'admin/views/ai-crawlers.php';      $this->page_close(); }
    public function render_rest_api(): void      { $this->page_open( 'madeit-security-rest-api' );        require_once MADEIT_SECURITY_DIR . 'admin/views/rest-api.php';         $this->page_close(); }
    public function render_sessions(): void      { $this->page_open( 'madeit-security-sessions' );        require_once MADEIT_SECURITY_DIR . 'admin/views/session-security.php'; $this->page_close(); }
    public function render_outbound(): void      { $this->page_open( 'madeit-security-outbound' );        require_once MADEIT_SECURITY_DIR . 'admin/views/outbound-monitor.php'; $this->page_close(); }
    public function render_cron_guard(): void    { $this->page_open( 'madeit-security-cron' );            require_once MADEIT_SECURITY_DIR . 'admin/views/cron-guard.php';       $this->page_close(); }
    public function render_malware_scan(): void  { $this->page_open( 'madeit-security-scanner' );         require_once MADEIT_SECURITY_DIR . 'admin/views/malware-scan.php';     $this->page_close(); }
    public function render_settings(): void       { $this->page_open( 'madeit-security-settings' );        require_once MADEIT_SECURITY_DIR . 'admin/views/settings.php';         $this->page_close(); }
    public function render_about(): void          { $this->page_open( 'madeit-security-about' );           require_once MADEIT_SECURITY_DIR . 'admin/views/about.php';            $this->page_close(); }
    public function render_post_breach(): void    { $this->page_open( 'madeit-security-post-breach' );     require_once MADEIT_SECURITY_DIR . 'admin/views/post-breach.php';      $this->page_close(); }
    public function render_password_policy(): void { $this->page_open( 'madeit-security-password-policy' ); require_once MADEIT_SECURITY_DIR . 'admin/views/password-policy.php';  $this->page_close(); }
    public function render_honeypot(): void      { $this->page_open( 'madeit-security-honeypot' );        require_once MADEIT_SECURITY_DIR . 'admin/views/honeypot.php';         $this->page_close(); }
    public function render_headers(): void       { $this->page_open( 'madeit-security-headers' );         require_once MADEIT_SECURITY_DIR . 'admin/views/security-headers.php'; $this->page_close(); }
    public function render_2fa(): void           { $this->page_open( 'madeit-security-2fa' );             require_once MADEIT_SECURITY_DIR . 'admin/views/two-factor.php';       $this->page_close(); }
    public function render_notifications(): void { $this->page_open( 'madeit-security-notifications' );   require_once MADEIT_SECURITY_DIR . 'admin/views/notifications.php';    $this->page_close(); }
    public function render_geoip(): void         { $this->page_open( 'madeit-security-geoip' );           require_once MADEIT_SECURITY_DIR . 'admin/views/geoip-settings.php';   $this->page_close(); }
    public function render_waf(): void           { $this->page_open( 'madeit-security-waf' );             require_once MADEIT_SECURITY_DIR . 'admin/views/waf.php';              $this->page_close(); }
    public function render_vuln_audit(): void   { $this->page_open( 'madeit-security-vuln-audit' );     require_once MADEIT_SECURITY_DIR . 'admin/views/vuln-audit.php';       $this->page_close(); }

    // Setup wizard — no sidebar (standalone first-run experience)
    public function render_setup_wizard(): void  { require_once MADEIT_SECURITY_DIR . 'admin/views/setup-wizard.php'; }

    // ── Complete setup AJAX ────────────────────────────────────────────────────
    public function ajax_complete_setup(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }
        update_option( 'madeit_security_setup_complete', true );
        wp_send_json_success( [ 'message' => 'Setup complete!' ] );
    }

    // ── Apply recommended settings preset ────────────────────────────────────
    public function ajax_apply_recommended(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        $applied = \MadeIT\Security\Installer::apply_recommended();
        update_option( 'madeit_security_setup_complete', true );

        wp_send_json_success( [
            'message' => 'MadeIT Security Recommended Settings applied successfully.',
            'applied' => $applied,
            'count'   => count( $applied ),
        ] );
    }

    // ── Dismiss setup notice (per-user) ────────────────────────────────────────
    public function ajax_dismiss_setup_notice(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        update_user_meta( get_current_user_id(), 'madeit_security_dismiss_setup_notice', 1 );
        wp_send_json_success();
    }

    // ── Deactivation dialog on plugins.php ─────────────────────────────────────
    public function deactivation_dialog(): void {
        $plugin_file = plugin_basename( MADEIT_SECURITY_FILE );
        $nonce       = wp_create_nonce( 'madeit_security_nonce' );
        $ajax_url    = admin_url( 'admin-ajax.php' );
        ?>
        <div id="madeit-security-deactivate-modal" style="display:none;position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.6);align-items:center;justify-content:center;">
            <div style="background:#fff;border-radius:12px;padding:32px 36px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3);">
                <h2 style="margin:0 0 8px;font-size:1.25rem;color:#1a1a2e;">Deactivating Security</h2>
                <p style="color:#555;margin:0 0 24px;font-size:.925rem;line-height:1.5;">
                    Would you like to keep your security data (settings, visitor logs, blocked IPs) for when you reactivate?
                </p>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <button id="madeit-security-deact-keep" style="padding:12px 20px;border-radius:8px;border:2px solid #1847F0;background:#1847F0;color:#fff;font-size:.925rem;font-weight:600;cursor:pointer;">
                        ✓ Keep Data &amp; Deactivate
                    </button>
                    <button id="madeit-security-deact-wipe" style="padding:12px 20px;border-radius:8px;border:2px solid #c0392b;background:#fff;color:#c0392b;font-size:.925rem;font-weight:600;cursor:pointer;">
                        🗑 Remove All Data &amp; Deactivate
                    </button>
                    <button id="madeit-security-deact-cancel" style="padding:8px 20px;border:none;background:none;color:#666;font-size:.875rem;cursor:pointer;margin-top:4px;">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        <?php
        // Output deactivation dialog script via wp_print_inline_script_tag (WordPress 5.7+ API).
        wp_print_inline_script_tag(
            '(function(){' .
            'var pluginFile=' . wp_json_encode( $plugin_file ) . ';' .
            'var ajaxUrl=' . wp_json_encode( $ajax_url ) . ';' .
            'var nonce=' . wp_json_encode( $nonce ) . ';' .
            'var modal=document.getElementById("madeit-security-deactivate-modal");' .
            'var deactUrl="";' .
            'var row=document.querySelector(\'tr[data-plugin="\'+pluginFile+\'"]\');' .
            'if(!row)return;' .
            'var link=row.querySelector(".deactivate a");' .
            'if(!link)return;' .
            'link.addEventListener("click",function(e){e.preventDefault();deactUrl=this.href;modal.style.display="flex";});' .
            'document.getElementById("madeit-security-deact-keep").addEventListener("click",function(){this.textContent="Deactivating\u2026";savePref(false,function(){window.location.href=deactUrl;});});' .
            'document.getElementById("madeit-security-deact-wipe").addEventListener("click",function(){if(!confirm("Are you sure? This will permanently delete ALL security data (logs, blocked IPs, settings) when the plugin is deleted."))return;this.textContent="Deactivating\u2026";savePref(true,function(){window.location.href=deactUrl;});});' .
            'document.getElementById("madeit-security-deact-cancel").addEventListener("click",function(){modal.style.display="none";});' .
            'modal.addEventListener("click",function(e){if(e.target===modal)modal.style.display="none";});' .
            'function savePref(wipe,cb){var fd=new FormData();fd.append("action","madeit_security_set_uninstall_pref");fd.append("nonce",nonce);fd.append("delete_data",wipe?"1":"0");fetch(ajaxUrl,{method:"POST",body:fd,credentials:"same-origin"}).then(function(){cb();}).catch(function(){cb();});}' .
            '})();'
        );
    }

    public function ajax_set_uninstall_pref(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [], 403 );
        }
        $delete = isset( $_POST['delete_data'] ) && $_POST['delete_data'] === '1';
        update_option( 'madeit_security_delete_data_on_uninstall', $delete );
        wp_send_json_success();
    }

    // ── Settings AJAX ──────────────────────────────────────────────────────────
    public function ajax_save_settings(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        $settings = isset( $_POST['settings'] ) ? (array) wp_unslash( $_POST['settings'] ) : []; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- each value is sanitized individually in the loop below
        $saved    = [];
        $defaults = \MadeIT\Security\Settings::defaults();
        $allowed  = array_keys( $defaults );

        // Fields that legitimately contain multi-line input — must NOT be run
        // through sanitize_text_field() which collapses newlines.
        $multiline_fields = [ 'madeit_security_trust_proxy_ips' ];
        
        // Fields that are floats, not ints. Without this list `0.5` would be
        // truncated to 0 and any decimal score threshold becomes useless.
        $float_fields = [ 'madeit_security_captcha_v3_threshold' ];

        foreach ( $settings as $key => $value ) {
            $key = sanitize_key( $key );
            if ( ! in_array( $key, $allowed, true ) ) continue;
            // Reject array values — all settings are scalar
            if ( is_array( $value ) ) continue;

            // Multi-line fields must be handled BEFORE the bool/numeric coercions
            // because a one-line textarea containing "0" would otherwise be
            // flipped to boolean false. `$settings` was already wp_unslash()'d
            // above, so do not unslash again here.
            if ( in_array( $key, $multiline_fields, true ) ) {
                $lines = preg_split( '/\r\n|\r|\n/', (string) $value ) ?: [];
                $lines = array_map( 'sanitize_text_field', $lines );
                $value = trim( implode( "\n", $lines ) );
            } elseif ( in_array( $key, $float_fields, true ) ) {
                $value = is_numeric( $value ) ? max( 0.0, min( 1.0, (float) $value ) ) : 0.5;
            } elseif ( in_array( $value, [ 'true', 'false', '1', '0', true, false ], true ) ) {
                $value = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
            } elseif ( is_numeric( $value ) ) {
                $value = (int) $value;
            } else {
                $value = sanitize_text_field( (string) $value );
            }

            // Keep DB clean: store only values that differ from canonical defaults.
            if ( array_key_exists( $key, $defaults ) && $value == $defaults[ $key ] ) {
                delete_option( $key );
                $saved[] = $key;
                continue;
            }

            update_option( $key, $value );
            $saved[] = $key;
        }

        wp_send_json_success( [ 'saved' => $saved, 'count' => count( $saved ) ] );
    }
}

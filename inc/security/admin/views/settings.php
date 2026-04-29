<?php
defined( 'ABSPATH' ) || exit;

// Helper: render a toggle row
function madeit_security_toggle( string $opt, string $label, string $desc ): void {
    $val = \MadeIT\Security\Settings::bool( $opt, false );
    ?>
    <div class="madeit-security-form-row madeit-security-form-row--toggle">
        <div>
            <strong><?php echo esc_html( $label ); ?></strong>
            <p class="madeit-security-desc"><?php echo esc_html( $desc ); ?></p>
        </div>
        <label class="madeit-security-toggle">
            <input type="checkbox"
                   name="<?php echo esc_attr( $opt ); ?>"
                   class="madeit-security-setting-input"
                   value="1"
                   <?php checked( $val, true ); ?> />
            <span class="madeit-security-toggle__slider"></span>
        </label>
    </div>
    <?php
}

// Helper: render a number input row
function madeit_security_number( string $opt, string $label, string $desc, int $default, int $min = 1, int $max = 99999 ): void {
    ?>
    <div class="madeit-security-form-row">
        <label class="madeit-security-label"><?php echo esc_html( $label ); ?></label>
        <input type="number"
               name="<?php echo esc_attr( $opt ); ?>"
               value="<?php echo esc_attr( \MadeIT\Security\Settings::get( $opt, $default ) ); ?>"
               min="<?php echo esc_attr( $min ); ?>"
               max="<?php echo esc_attr( $max ); ?>"
               class="madeit-security-input madeit-security-input--sm madeit-security-setting-input" />
        <?php if ( $desc ) : ?>
            <p class="madeit-security-desc"><?php echo esc_html( $desc ); ?></p>
        <?php endif; ?>
    </div>
    <?php
}
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">&#x2699;&#xfe0f;</span>
            <div>
                <h1 class="madeit-security-page-title">Settings</h1>
                <p class="madeit-security-page-sub">Global configuration for Security</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content" style="max-width:720px">

    <div id="settings-saved-notice" class="madeit-security-notice madeit-security-notice--success" style="display:none;">Settings saved successfully.</div>

    <!-- ── WAF ────────────────────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Firewall (WAF)</h2></div>
        <div class="madeit-security-form-body">
            <?php madeit_security_toggle( 'madeit_security_waf_enabled', 'Enable WAF', 'Inspect incoming requests and block malicious patterns' ); ?>
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">WAF Mode</label>
                <select name="madeit_security_waf_mode" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input">
                    <option value="block" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_waf_mode', 'log' ), 'block' ); ?>>Block (actively reject threats)</option>
                    <option value="log"   <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_waf_mode', 'log' ), 'log' ); ?>>Log Only (monitor without blocking)</option>
                </select>
                <p class="madeit-security-desc">Use "Log Only" mode when first enabling to avoid false positives</p>
            </div>
        </div>
    </div>

    <!-- ── VISITOR LOGGING ────────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Visitor Logging</h2></div>
        <div class="madeit-security-form-body">
            <?php madeit_security_toggle( 'madeit_security_log_enabled', 'Enable Visitor Logging', 'Log all requests to your site' ); ?>
            <?php madeit_security_toggle( 'madeit_security_log_exclude_assets', 'Exclude Static Assets', 'Skip logging CSS, JS, image, and font requests' ); ?>
            <?php madeit_security_toggle( 'madeit_security_log_exclude_bots', 'Exclude Known Bots', 'Skip logging requests from known search engine bots' ); ?>
            <?php madeit_security_number( 'madeit_security_log_retention_days', 'Log Retention (days)', 'How many days to keep visitor log entries before automatic cleanup', 30, 1, 365 ); ?>
        </div>
    </div>

    <!-- ── LOGIN SECURITY ─────────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Login Security</h2></div>
        <div class="madeit-security-form-body">
            <?php madeit_security_number( 'madeit_security_login_max_attempts', 'Max Login Attempts', 'Number of failed attempts before lockout', 5, 1, 20 ); ?>
            <?php madeit_security_number( 'madeit_security_login_lockout_1', 'Lockout 1 Duration (seconds)', 'First lockout: applied after reaching max attempts', 300, 30, 86400 ); ?>
            <?php madeit_security_number( 'madeit_security_login_lockout_2', 'Lockout 2 Duration (seconds)', 'Second lockout: applied if the user fails again after the first lockout expires', 1800, 60, 604800 ); ?>
            <?php madeit_security_number( 'madeit_security_login_lockout_3', 'Lockout 3 Duration (seconds)', 'Third lockout: applied after repeated violations (escalated)', 86400, 300, 2592000 ); ?>
        </div>
    </div>

    <!-- ── WORDPRESS HARDENING ────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">WordPress Hardening</h2></div>
        <div class="madeit-security-form-body">
            <?php madeit_security_toggle( 'madeit_security_block_xmlrpc',       'Disable XML-RPC',               'Block all XML-RPC requests (used by brute-force attacks and DDoS amplification)' ); ?>
            <?php madeit_security_toggle( 'madeit_security_hide_wp_version',    'Hide WordPress Version',         'Remove version from meta tags, feeds, and scripts' ); ?>
            <?php madeit_security_toggle( 'madeit_security_block_rest_users',   'Block REST API User Endpoint',   'Prevent user enumeration via /wp-json/wp/v2/users' ); ?>
            <?php madeit_security_toggle( 'madeit_security_block_author_enum',  'Block Author Enumeration',       'Block ?author=N redirect scans that reveal usernames' ); ?>
            <?php madeit_security_toggle( 'madeit_security_disable_file_editor','Disable Theme & Plugin Editor',  'Prevent file editing from wp-admin (sets DISALLOW_FILE_EDIT)' ); ?>
            <?php madeit_security_toggle( 'madeit_security_block_php_uploads',  'Block PHP in Uploads',           'Prevent PHP execution inside wp-content/uploads' ); ?>
            <?php madeit_security_toggle( 'madeit_security_force_ssl_admin',    'Force SSL for Admin',            'Force HTTPS on all admin and login pages (sets FORCE_SSL_ADMIN)' ); ?>
        </div>
    </div>

    <!-- ── AUTO-UPDATES ──────────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Auto-Updates</h2></div>
        <div class="madeit-security-form-body">
            <?php madeit_security_toggle( 'madeit_security_auto_update_plugins', 'Auto-Update Plugins', 'Automatically install plugin updates when available — keeps security patches applied promptly' ); ?>
            <?php madeit_security_toggle( 'madeit_security_auto_update_themes',  'Auto-Update Themes',  'Automatically install theme updates when available — prevents known vulnerabilities from lingering' ); ?>
        </div>
    </div>

    <!-- ── TRUSTED CLOUD PROVIDERS ─────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Trusted Cloud Providers</h2></div>
        <div class="madeit-security-form-body">
            <p class="madeit-security-desc" style="margin:0 0 12px">Whitelists all IP ranges belonging to these cloud providers. Trusted IPs bypass the WAF, rate limiter, and IP block list. IP ranges are refreshed weekly via cron.</p>
            <?php madeit_security_toggle( 'madeit_security_cloudflare_integration', 'Trust Cloudflare IPs',        'Whitelist Cloudflare edge network IPs — enable if your site is behind Cloudflare' ); ?>
            <?php madeit_security_toggle( 'madeit_security_google_integration',     'Trust Google IPs',             'Whitelist Google Cloud, Googlebot, Ads, and all Google service IPs (auto-fetched from goog.json)' ); ?>
            <?php madeit_security_toggle( 'madeit_security_microsoft_integration',  'Trust Microsoft / Azure IPs',  'Whitelist Microsoft Azure, BingBot, Office 365, and Outlook service IPs' ); ?>
        </div>
    </div>

    <!-- ── REVERSE-PROXY HANDLING ────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Reverse-Proxy / Load-Balancer</h2></div>
        <div class="madeit-security-form-body">
            <p class="madeit-security-desc" style="margin:0 0 12px">
                If your site sits behind a reverse proxy (Nginx, HAProxy, AWS ALB, Varnish) that passes the real visitor IP via <code>X-Forwarded-For</code>, list every proxy IP address here — one per line or comma-separated. The plugin will walk the XFF header from right to left, skipping trusted proxies, and use the first non-proxy IP as the visitor address. <strong>Leave blank if you do NOT sit behind a proxy</strong> — spoofed <code>X-Forwarded-For</code> headers would otherwise be trusted. (Cloudflare users should leave this blank and enable the "Trust Cloudflare IPs" toggle above instead.)
            </p>
            <div class="madeit-security-form-row">
                <label class="madeit-security-label" for="madeit_security_trust_proxy_ips">Trusted Proxy IPs</label>
                <textarea id="madeit_security_trust_proxy_ips"
                          name="madeit_security_trust_proxy_ips"
                          class="madeit-security-input madeit-security-setting-input"
                          rows="4"
                          placeholder="10.0.0.1&#10;10.0.0.2"
                          style="width:100%;font-family:monospace;font-size:.85rem"><?php echo esc_textarea( (string) \MadeIT\Security\Settings::get( 'madeit_security_trust_proxy_ips', '' ) ); ?></textarea>
                <p class="madeit-security-desc">Newline or comma-separated. Empty = no proxy trust.</p>
            </div>
        </div>
    </div>

    <!-- ── NOTIFICATIONS ──────────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Notifications</h2></div>
        <div class="madeit-security-form-body">
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Alert Email</label>
                <input type="email"
                       name="madeit_security_notify_email"
                       value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_notify_email', \MadeIT\Security\Settings::get( 'admin_email' ) ) ); ?>"
                       class="madeit-security-input madeit-security-setting-input"
                       placeholder="admin@example.com" />
                <p class="madeit-security-desc">Security alerts and scan reports are sent to this address</p>
            </div>
        </div>
    </div>

    <!-- ── DATA MANAGEMENT ────────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Data Management</h2></div>
        <div class="madeit-security-form-body">
            <?php madeit_security_toggle( 'madeit_security_delete_data_on_uninstall', 'Delete Data on Uninstall', 'When enabled, deleting the plugin will permanently remove all settings, visitor logs, blocked IPs, and database tables. Keep this OFF if you update by deleting and reinstalling.' ); ?>
            <p class="madeit-security-desc" style="color:var(--c-red-text, #c0392b);margin-top:-8px;"><strong>Warning:</strong> Only enable this if you truly want to remove all plugin data when deleting.</p>
        </div>
    </div>

    <!-- ── SAVE ───────────────────────────────────────────────────────────── -->
    <div style="padding:4px 0 24px">
        <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-settings" style="width:100%;padding:12px 24px;font-size:.95rem">Save Settings</button>
    </div>

    </div><!-- /.madeit-security-page-content -->

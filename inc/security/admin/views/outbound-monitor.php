<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

use MadeIT\Security\modules\OutboundMonitor;

$allowlist = OutboundMonitor::get_allowlist();
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">📡</span>
            <div>
                <h1 class="madeit-security-page-title">Outbound HTTP Monitor</h1>
                <p class="madeit-security-page-sub">SSRF prevention and outbound request tracking</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">
    <div class="madeit-security-col-main">

    <!-- ══ MONITOR SETTINGS ════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Monitor Settings</h2>
            <span class="madeit-security-badge <?php echo \MadeIT\Security\Settings::get( 'madeit_security_outbound_monitor_enabled', true ) ? 'madeit-security-badge--green' : 'madeit-security-badge--gray'; ?>">
                <?php echo \MadeIT\Security\Settings::get( 'madeit_security_outbound_monitor_enabled', true ) ? 'Active' : 'Disabled'; ?>
            </span>
        </div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable Outbound Monitoring</strong>
                    <p class="madeit-security-desc">Intercepts all outbound HTTP requests made via the WordPress HTTP API and logs or blocks them based on your rules.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_outbound_monitor_enabled"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_outbound_monitor_enabled', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Mode</label>
                <select name="madeit_security_outbound_mode" class="madeit-security-input madeit-security-setting-input">
                    <option value="log" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_outbound_mode', 'log' ), 'log' ); ?>>Log Only</option>
                    <option value="enforce" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_outbound_mode', 'log' ), 'enforce' ); ?>>Enforce (Block unauthorized)</option>
                </select>
                <p class="madeit-security-desc"><strong>Log Only</strong> records all outbound requests without blocking. <strong>Enforce</strong> actively blocks requests to non-allowlisted domains.</p>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Block Private/Internal IPs</strong>
                    <p class="madeit-security-desc">Blocks outbound requests that resolve to private IP ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) and the cloud metadata endpoint (169.254.169.254).</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_outbound_block_private"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_outbound_block_private', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-notice madeit-security-notice--warn">
                <strong>Caution:</strong> Enforce mode may break plugins that make outbound requests to domains not on the allowlist. Enable in Log Only mode first to review all outbound traffic before switching to Enforce.
            </div>

        </div>
    </div>

    <!-- ══ DOMAIN ALLOWLIST ════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Domain Allowlist</h2>
            <span class="madeit-security-badge madeit-security-badge--blue"><?php echo count( $allowlist ); ?> domains</span>
        </div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Allowed Domains</label>
                <textarea id="outbound-allowlist"
                          class="madeit-security-input madeit-security-setting-input"
                          rows="12"
                          placeholder="api.wordpress.org&#10;*.example.com"
                          style="font-family:monospace; font-size:.85rem;"><?php echo esc_textarea( implode( "\n", $allowlist ) ); ?></textarea>
                <p class="madeit-security-desc">One domain per line. Domains use <code>fnmatch</code> patterns. Use <code>*.example.com</code> for wildcard subdomains. Your site domain is always allowed automatically.</p>
            </div>

            <div style="margin-top:8px;">
                <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-allowlist">Save Allowlist</button>
                <div id="allowlist-result" class="madeit-security-form-result" style="display:none; margin-top:10px;"></div>
            </div>

        </div>
    </div>

    <!-- ══ RECENT OUTBOUND REQUESTS ════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Recent Outbound Requests</h2>
        </div>
        <div class="madeit-security-table-wrapper">
            <table class="madeit-security-table" id="outbound-log-table">
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>URL</th>
                        <th>Method</th>
                        <th>Caller</th>
                        <th>Status</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" class="madeit-security-empty-cell">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="madeit-security-desc" style="padding:0 16px 16px;">Showing last 50 requests. Full log available via AJAX.</p>
    </div>

    </div><!-- /col-main -->

    <!-- SIDEBAR -->
    <div class="madeit-security-col-side">

        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">SSRF Protection</h2></div>
            <div class="madeit-security-form-body">
                <p class="madeit-security-desc" style="margin-bottom:10px;">
                    <strong>Server-Side Request Forgery (SSRF)</strong> is an attack where a malicious plugin or theme forces your server to make HTTP requests to internal or restricted endpoints.
                </p>
                <p class="madeit-security-desc" style="margin-bottom:8px;">The outbound monitor blocks requests to:</p>
                <ul style="margin:0 0 0 16px; padding:0; font-size:.82rem; color:#4a5568; line-height:1.6;">
                    <li>Private IP ranges (10.x, 172.16.x, 192.168.x)</li>
                    <li>Localhost and loopback (127.0.0.1, ::1)</li>
                    <li>Cloud metadata endpoints (169.254.169.254)</li>
                    <li>Link-local addresses (169.254.x.x)</li>
                    <li>Non-allowlisted external domains (in Enforce mode)</li>
                </ul>
            </div>
        </div>

        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Quick Stats</h2></div>
            <div style="padding:20px; display:flex; gap:16px; justify-content:space-around; text-align:center;">
                <div>
                    <div style="font-size:2rem; font-weight:800; color:#2d3748;" id="outbound-stat-total">--</div>
                    <div style="font-size:.72rem; color:#718096; text-transform:uppercase;">Total Requests</div>
                </div>
                <div>
                    <div style="font-size:2rem; font-weight:800; color:#c0392b;" id="outbound-stat-blocked">--</div>
                    <div style="font-size:.72rem; color:#718096; text-transform:uppercase;">Blocked</div>
                </div>
            </div>
        </div>

    </div>

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

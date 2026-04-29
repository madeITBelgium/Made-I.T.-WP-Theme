<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

use MadeIT\Security\modules\Honeypot;
use MadeIT\Security\Settings;

$enabled    = Settings::bool( 'madeit_security_honeypot_enabled', false );
$trap_url   = Honeypot::get_trap_url();
$stats      = Honeypot::get_stats();
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">&#x1f36f;</span>
            <div>
                <h1 class="madeit-security-page-title">Honeypot Traps</h1>
                <p class="madeit-security-page-sub">Deploy invisible traps that catch automated attacks and malicious bots</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">

        <!-- MAIN COLUMN -->
        <div class="madeit-security-col-main">

        <div id="settings-saved-notice" class="madeit-security-notice madeit-security-notice--success" style="display:none;">Settings saved.</div>

        <!-- ── MASTER TOGGLE ─────────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Honeypot Protection</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable Honeypot Module</strong>
                        <p class="madeit-security-desc">Activate all honeypot traps. Individual traps can be toggled below.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_honeypot_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( $enabled ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- ── HIDDEN LINK TRAP ──────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Hidden Link Trap</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Inject Hidden Link</strong>
                        <p class="madeit-security-desc">Adds an invisible link to your site footer. Only bots that crawl page source will follow it. Any visitor that does is immediately blocked.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_honeypot_link_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( Settings::bool( 'madeit_security_honeypot_link_enabled', true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <?php if ( $trap_url ) : ?>
                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Current Trap URL</label>
                    <code style="font-size:.82rem;color:#718096;word-break:break-all"><?php echo esc_html( $trap_url ); ?></code>
                </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- ── FAKE LOGIN DECOY ──────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Fake Login Page</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable Fake Login Decoy</strong>
                        <p class="madeit-security-desc">Creates a fake login page at a custom URL. Bots and attackers that attempt to log in are immediately blocked.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_honeypot_fake_login" class="madeit-security-setting-input" value="1"
                               <?php checked( Settings::bool( 'madeit_security_honeypot_fake_login', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Fake Login Slug</label>
                    <input type="text"
                           name="madeit_security_honeypot_fake_login_slug"
                              value="<?php echo esc_attr( Settings::string( 'madeit_security_honeypot_fake_login_slug', 'wp-login-secure' ) ); ?>"
                           class="madeit-security-input madeit-security-input--sm madeit-security-setting-input"
                           placeholder="wp-login-secure" />
                    <p class="madeit-security-desc">The fake login page will be accessible at <code><?php echo esc_html( site_url( '/' ) ); ?><strong>your-slug</strong></code></p>
                </div>
            </div>
        </div>

        <!-- ── FORM HONEYPOTS ────────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Form Honeypots</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Comment Form Honeypot</strong>
                        <p class="madeit-security-desc">Adds a hidden field to comment forms. Bots that fill it are blocked, and comments submitted in under 3 seconds are flagged.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_honeypot_comments" class="madeit-security-setting-input" value="1"
                               <?php checked( Settings::bool( 'madeit_security_honeypot_comments', true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Contact Form 7 Honeypot</strong>
                        <p class="madeit-security-desc">Inject a honeypot field into Contact Form 7 forms automatically</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_honeypot_forms" class="madeit-security-setting-input" value="1"
                               <?php checked( Settings::bool( 'madeit_security_honeypot_forms', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>WP Login Form Honeypot Timer</strong>
                        <p class="madeit-security-desc">Adds a hidden honeypot field and timing token to the real WordPress login form. Suspicious submissions are blocked and the IP is banned.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_honeypot_wp_login" class="madeit-security-setting-input" value="1"
                               <?php checked( Settings::bool( 'madeit_security_honeypot_wp_login', true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- ── SAVE ──────────────────────────────────────────────────────── -->
        <div style="padding:4px 0 24px">
            <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-settings" style="width:100%;padding:12px 24px;font-size:.95rem">Save Honeypot Settings</button>
        </div>

        </div><!-- /col-main -->

        <!-- SIDEBAR -->
        <div class="madeit-security-col-side">

            <!-- ── STATS ─────────────────────────────────────────────────── -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Trap Statistics</h2></div>
                <div class="madeit-security-form-body">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:center">
                        <div>
                            <div style="font-size:1.5rem;font-weight:700;color:var(--c-danger,#c0392b)"><?php echo esc_html( number_format( (int) ( $stats['total'] ?? 0 ) ) ); ?></div>
                            <div style="font-size:.75rem;color:var(--c-text-3)">Total Caught</div>
                        </div>
                        <div>
                            <div style="font-size:1.5rem;font-weight:700;color:var(--c-warning,#e67e22)"><?php echo esc_html( number_format( (int) ( $stats['today'] ?? 0 ) ) ); ?></div>
                            <div style="font-size:.75rem;color:var(--c-text-3)">Today</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── HOW IT WORKS ──────────────────────────────────────────── -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">How It Works</h2></div>
                <div class="madeit-security-form-body">
                    <ul class="madeit-security-desc" style="padding-left:18px;list-style:disc;margin:0">
                        <li>Honeypots are traps invisible to real users</li>
                        <li>Only automated bots interact with them</li>
                        <li>Any IP that triggers a trap is instantly blocked</li>
                        <li>Whitelisted IPs are never blocked</li>
                    </ul>
                    <div class="madeit-security-notice madeit-security-notice--info" style="margin-top:12px">
                        <strong>Safe bots are protected:</strong> Googlebot, Bingbot, DuckDuckBot, social media previews, uptime monitors, and AI crawlers you've marked as "allowed" in AI Crawler settings are automatically exempted. They see a 404 instead of getting banned.
                    </div>
                    <div class="madeit-security-notice madeit-security-notice--info" style="margin-top:8px">
                        The trap URL is also added to your <code>robots.txt</code> as <code>Disallow</code>, so well-behaved crawlers won't visit it at all.
                    </div>
                </div>
            </div>

        </div><!-- /col-side -->

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

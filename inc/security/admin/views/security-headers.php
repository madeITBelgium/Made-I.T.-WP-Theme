<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

use MadeIT\Security\modules\SecurityHeaders;

$grade  = SecurityHeaders::compute_grade();
$status = SecurityHeaders::get_header_status();
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">&#x1f6e1;&#xfe0f;</span>
            <div>
                <h1 class="madeit-security-page-title">Security Headers</h1>
                <p class="madeit-security-page-sub">Configure HTTP security headers to protect against XSS, clickjacking, and data leakage</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">

        <!-- MAIN COLUMN -->
        <div class="madeit-security-col-main">

        <div id="settings-saved-notice" class="madeit-security-notice madeit-security-notice--success" style="display:none;">Settings saved.</div>

        <!-- ── HSTS ──────────────────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">HTTP Strict Transport Security (HSTS)</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable HSTS</strong>
                        <p class="madeit-security-desc">Force browsers to use HTTPS for all future requests. Only works if your site already has SSL.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_hsts_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_hsts_enabled', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Max Age (seconds)</label>
                    <input type="number" name="madeit_security_hsts_max_age" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input"
                           value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_hsts_max_age', 31536000 ) ); ?>"
                           min="300" max="63072000" />
                    <p class="madeit-security-desc">31536000 = 1 year (recommended). Browsers remember HTTPS preference for this duration.</p>
                </div>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Include Subdomains</strong>
                        <p class="madeit-security-desc">Apply HSTS to all subdomains as well</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_hsts_subdomains" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_hsts_subdomains', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Preload</strong>
                        <p class="madeit-security-desc">Allow your domain to be added to browser HSTS preload lists. Requires includeSubDomains and max-age >= 1 year.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_hsts_preload" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_hsts_preload', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- ── X-FRAME-OPTIONS ───────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">X-Frame-Options</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable X-Frame-Options</strong>
                        <p class="madeit-security-desc">Prevents your site from being embedded in iframes on other domains (clickjacking protection)</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_xframe_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_xframe_enabled', true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Value</label>
                    <select name="madeit_security_xframe_value" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input">
                        <option value="DENY"       <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_xframe_value', 'SAMEORIGIN' ), 'DENY' ); ?>>DENY (block all framing)</option>
                        <option value="SAMEORIGIN" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_xframe_value', 'SAMEORIGIN' ), 'SAMEORIGIN' ); ?>>SAMEORIGIN (allow same domain)</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- ── CONTENT-TYPE & REFERRER ───────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Content Sniffing & Referrer Policy</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>X-Content-Type-Options: nosniff</strong>
                        <p class="madeit-security-desc">Prevents browsers from MIME-sniffing content types, reducing XSS risk from uploaded files</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_xcontent_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_xcontent_enabled', true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable Referrer-Policy</strong>
                        <p class="madeit-security-desc">Controls how much referrer information is included with requests</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_referrer_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_referrer_enabled', true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Referrer Policy Value</label>
                    <select name="madeit_security_referrer_value" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input">
                        <option value="no-referrer"                    <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_referrer_value', 'strict-origin-when-cross-origin' ), 'no-referrer' ); ?>>no-referrer</option>
                        <option value="no-referrer-when-downgrade"     <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_referrer_value', 'strict-origin-when-cross-origin' ), 'no-referrer-when-downgrade' ); ?>>no-referrer-when-downgrade</option>
                        <option value="same-origin"                    <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_referrer_value', 'strict-origin-when-cross-origin' ), 'same-origin' ); ?>>same-origin</option>
                        <option value="strict-origin"                  <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_referrer_value', 'strict-origin-when-cross-origin' ), 'strict-origin' ); ?>>strict-origin</option>
                        <option value="strict-origin-when-cross-origin" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_referrer_value', 'strict-origin-when-cross-origin' ), 'strict-origin-when-cross-origin' ); ?>>strict-origin-when-cross-origin (recommended)</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- ── PERMISSIONS POLICY ────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Permissions Policy</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable Permissions-Policy</strong>
                        <p class="madeit-security-desc">Restrict browser features like geolocation, camera, and microphone access on your site</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_permissions_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_permissions_enabled', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <p class="madeit-security-desc" style="margin-top:4px">When enabled, dangerous browser APIs are blocked by default. Fine-grained per-permission controls are available in the module code.</p>
            </div>
        </div>

        <!-- ── CSP ───────────────────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Content Security Policy (CSP)</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable CSP</strong>
                        <p class="madeit-security-desc">Restrict which resources (scripts, styles, images) can load on your site. Powerful XSS protection, but test in Report-Only mode first.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_csp_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_csp_enabled', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">CSP Mode</label>
                    <select name="madeit_security_csp_mode" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input">
                        <option value="report-only" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_csp_mode', 'report-only' ), 'report-only' ); ?>>Report-Only (safe testing)</option>
                        <option value="enforce"     <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_csp_mode', 'report-only' ), 'enforce' ); ?>>Enforce (block violations)</option>
                    </select>
                    <p class="madeit-security-desc">Start with Report-Only to find violations without breaking your site, then switch to Enforce</p>
                </div>
                <div class="madeit-security-notice madeit-security-notice--warn" style="margin-top:8px">
                    CSP can break plugins and themes that load external scripts. Always test in Report-Only mode first. Default directives allow common WordPress patterns.
                </div>
            </div>
        </div>

        <!-- ── HEADER REMOVAL & CROSS-ORIGIN ─────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Header Cleanup & Cross-Origin</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Remove X-Powered-By</strong>
                        <p class="madeit-security-desc">Hide the PHP version from response headers</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_remove_powered_by" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_remove_powered_by', true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Remove Server Header</strong>
                        <p class="madeit-security-desc">Hide the web server software name (Apache, Nginx). May not work on all hosting providers.</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_remove_server" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_remove_server', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Cross-Origin-Resource-Policy</strong>
                        <p class="madeit-security-desc">Prevent other sites from embedding your resources (images, scripts)</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_corp_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_corp_enabled', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Cross-Origin-Opener-Policy</strong>
                        <p class="madeit-security-desc">Isolate your site from cross-origin popups to prevent Spectre-type attacks</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_coop_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_coop_enabled', false ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- ── SAVE ──────────────────────────────────────────────────────── -->
        <div style="padding:4px 0 24px">
            <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-settings" style="width:100%;padding:12px 24px;font-size:.95rem">Save Security Headers</button>
        </div>

        </div><!-- /col-main -->

        <!-- SIDEBAR -->
        <div class="madeit-security-col-side">

            <!-- ── GRADE ─────────────────────────────────────────────────── -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Security Headers Grade</h2></div>
                <div class="madeit-security-form-body" style="text-align:center">
                    <?php
                    $grade_colors = [
                        'A+' => '#27ae60', 'A' => '#27ae60', 'B' => '#2ecc71',
                        'C'  => '#e67e22', 'D' => '#e74c3c', 'F' => '#c0392b',
                    ];
                    $color = $grade_colors[ $grade ] ?? '#718096';
                    ?>
                    <div style="font-size:3rem;font-weight:800;color:<?php echo esc_attr( $color ); ?>;line-height:1.1"><?php echo esc_html( $grade ); ?></div>
                    <p class="madeit-security-desc" style="margin-top:6px">Based on your currently enabled headers</p>
                </div>
            </div>

            <!-- ── HEADER STATUS ─────────────────────────────────────────── -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Header Status</h2></div>
                <ul class="madeit-security-whitelist-list">
                    <?php foreach ( $status as $header ) : ?>
                    <li class="madeit-security-whitelist-item" style="justify-content:space-between">
                        <span style="font-size:.82rem"><?php echo esc_html( $header['name'] ); ?></span>
                        <?php if ( $header['enabled'] ) : ?>
                            <span class="madeit-security-badge madeit-security-badge--green"><?php echo esc_html( $header['grade'] ); ?></span>
                        <?php else : ?>
                            <span class="madeit-security-badge madeit-security-badge--gray">Off</span>
                        <?php endif; ?>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- ── INFO ──────────────────────────────────────────────────── -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">About Headers</h2></div>
                <div class="madeit-security-form-body">
                    <p class="madeit-security-desc">Security headers instruct browsers to enforce security policies, protecting visitors from attacks like clickjacking, XSS, and data injection.</p>
                    <div class="madeit-security-notice madeit-security-notice--info" style="margin-top:8px">
                        Test your headers at <a href="https://securityheaders.com" target="_blank" rel="noopener">securityheaders.com</a> after saving changes.
                    </div>
                </div>
            </div>

        </div><!-- /col-side -->

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

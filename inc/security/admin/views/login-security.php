<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

$slug_enabled  = (bool) \MadeIT\Security\Settings::get( 'madeit_security_custom_login_enabled', false );
$current_slug  = \MadeIT\Security\Settings::get( 'madeit_security_custom_login_slug', '' );
if ( ! $current_slug ) {
    $current_slug = \MadeIT\Security\modules\CustomLoginURL::generate_slug();
    update_option( 'madeit_security_custom_login_slug', $current_slug );
}
$login_url     = home_url( '/' . $current_slug . '/' );
$block_wpadmin = (bool) \MadeIT\Security\Settings::get( 'madeit_security_custom_login_block_wpadmin', true );
global $wpdb;
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🔐</span>
            <div>
                <h1 class="madeit-security-page-title">Login Security</h1>
                <p class="madeit-security-page-sub">Custom login URL, brute-force protection, and attempt monitoring</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid">
    <div class="madeit-security-col-main">

    <!-- ══ CUSTOM LOGIN URL ══════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">🔗 Custom Login URL</h2>
            <span class="madeit-security-badge <?php echo $slug_enabled ? 'madeit-security-badge--green' : 'madeit-security-badge--gray'; ?>" id="clurl-status-badge">
                <?php echo $slug_enabled ? 'Active' : 'Disabled'; ?>
            </span>
        </div>
        <div class="madeit-security-form-body">

            <?php if ( $slug_enabled ) : ?>
            <div class="madeit-security-login-url-display">
                <div class="madeit-security-login-url-display__label">Your secret login URL</div>
                <div class="madeit-security-login-url-display__url">
                    <a href="<?php echo esc_url( $login_url ); ?>" target="_blank" id="clurl-link" class="madeit-security-login-url-link">
                        <?php echo esc_html( $login_url ); ?>
                    </a>
                    <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost" id="btn-copy-login-url">📋 Copy</button>
                </div>
                <p class="madeit-security-desc" style="margin-top:6px">
                    Bookmark this URL. Direct access to <code>/wp-login.php</code>
                    <?php echo $block_wpadmin ? 'and <code>/wp-admin/</code>' : ''; ?>
                    returns a 404 for anyone not on the <a href="<?php echo esc_url( admin_url('admin.php?page=madeit-security-whitelist') ); ?>">IP Whitelist</a>.
                </p>
            </div>
            <?php else : ?>
            <div class="madeit-security-notice madeit-security-notice--info">
                Custom login URL is <strong>disabled</strong>. Enable it to hide <code>/wp-login.php</code> from attackers — bots can't brute-force a URL they can't find.
            </div>
            <?php endif; ?>

            <div class="madeit-security-clurl-form">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable Custom Login URL</strong>
                        <p class="madeit-security-desc">Hides <code>/wp-login.php</code> — replaces it with your secret slug</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" id="clurl-enabled" <?php checked( $slug_enabled ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>

                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Block <code>/wp-admin/</code> for non-logged-in visitors</strong>
                        <p class="madeit-security-desc">Returns 404 instead of redirecting to login (prevents slug discovery via redirect)</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" id="clurl-block-wpadmin" <?php checked( $block_wpadmin ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>

                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Login Slug</label>
                    <div class="madeit-security-slug-input-wrap">
                        <span class="madeit-security-slug-prefix"><?php echo esc_html( trailingslashit( home_url() ) ); ?></span>
                        <input type="text" id="clurl-slug" class="madeit-security-input madeit-security-slug-input"
                               value="<?php echo esc_attr( $current_slug ); ?>"
                               placeholder="my-secret-login"
                               autocomplete="off" spellcheck="false" />
                        <span class="madeit-security-slug-suffix">/</span>
                    </div>
                    <p class="madeit-security-desc">Letters, numbers, and hyphens only. Avoid obvious words like "login" or "admin".</p>
                </div>

                <div class="madeit-security-clurl-actions">
                    <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-login-url">💾 Save</button>
                    <button class="madeit-security-btn madeit-security-btn--ghost" id="btn-regenerate-slug">🔀 Generate New Slug</button>
                </div>
                <div id="clurl-result" class="madeit-security-form-result" style="display:none;"></div>
            </div>

            <div class="madeit-security-clurl-safety">
                <strong>⚠️ Before enabling:</strong>
                <ol class="madeit-security-safety-list">
                    <li>Add your IP to the <a href="<?php echo esc_url( admin_url('admin.php?page=madeit-security-whitelist') ); ?>">IP Whitelist</a> — whitelisted IPs always reach <code>/wp-login.php</code> directly</li>
                    <li>Bookmark the URL shown above <em>before</em> saving</li>
                    <li>Store the slug in your password manager</li>
                    <li>If you get locked out: rename the <code>madeit-security</code> plugin folder via FTP to disable</li>
                </ol>
            </div>

        </div>
    </div>

 	<!-- ══ CAPTCHA / BOT PROTECTION ═══════════════════════════════════════════ -->
 	<?php
    $captcha_provider  = (string) \MadeIT\Security\Settings::get( 'madeit_security_captcha_provider', 'off' );
    $captcha_site_key  = (string) \MadeIT\Security\Settings::get( 'madeit_security_captcha_site_key', '' );
    $captcha_has_secret= '' !== (string) \MadeIT\Security\Settings::get( 'madeit_security_captcha_secret_key', '' );
    $captcha_threshold = (float)  \MadeIT\Security\Settings::get( 'madeit_security_captcha_v3_threshold', 0.5 );
    $captcha_on_login  = (bool)   \MadeIT\Security\Settings::get( 'madeit_security_captcha_on_login', true );
    $captcha_on_reg    = (bool)   \MadeIT\Security\Settings::get( 'madeit_security_captcha_on_register', true );
    $captcha_on_lostpw = (bool)   \MadeIT\Security\Settings::get( 'madeit_security_captcha_on_lostpassword', true );
    $captcha_theme     = (string) \MadeIT\Security\Settings::get( 'madeit_security_captcha_theme', 'auto' );
 	$captcha_active    = 'off' !== $captcha_provider && '' !== $captcha_site_key && $captcha_has_secret;
 	?>
 	<div class="madeit-security-panel">
 	    <div class="madeit-security-panel__header">
 	        <h2 class="madeit-security-panel__title">🤖 Bot Protection (CAPTCHA)</h2>
 	        <span class="madeit-security-badge <?php echo $captcha_active ? 'madeit-security-badge--green' : 'madeit-security-badge--gray'; ?>">
 	            <?php echo $captcha_active ? 'Active' : 'Off'; ?>
 	        </span>
 	    </div>
 	    <div class="madeit-security-form-body">
 	        <p class="madeit-security-desc" style="margin:0 0 14px">
 	            Adds a CAPTCHA challenge to <code>/wp-login.php</code>, the registration form, and the lost-password form. Defeats automated brute-force tools and credential-stuffing scripts before they ever reach your password check. Whitelisted IPs always bypass — you can't accidentally lock yourself out.
 	        </p>
 	        <!-- Provider picker -->
 	        <div class="madeit-security-form-row">
 	            <label class="madeit-security-label">Provider</label>
 	            <select name="madeit_security_captcha_provider" class="madeit-security-input madeit-security-setting-input" id="madeit-security-captcha-provider" style="max-width:320px">
 	                <option value="off"           <?php selected( $captcha_provider, 'off' ); ?>>Off — no CAPTCHA</option>
 	                <option value="recaptcha_v2"  <?php selected( $captcha_provider, 'recaptcha_v2' ); ?>>Google reCAPTCHA v2 ("I'm not a robot")</option>
 	                <option value="recaptcha_v3"  <?php selected( $captcha_provider, 'recaptcha_v3' ); ?>>Google reCAPTCHA v3 (invisible, score-based)</option>
 	                <option value="turnstile"     <?php selected( $captcha_provider, 'turnstile' ); ?>>Cloudflare Turnstile (privacy-friendly)</option>
 	            </select>
 	            <p class="madeit-security-desc" style="margin-top:6px">
 	                <strong>Cloudflare Turnstile</strong> is recommended for most sites — no Google dependency, no PII shipped to a third party, and a generous free tier.<br>
 	                <strong>reCAPTCHA v3</strong> is invisible (no user friction) but uses a score-threshold and ships a Google badge.<br>
 	                <strong>reCAPTCHA v2</strong> is the classic "I'm not a robot" checkbox — most familiar to users.
 	            </p>
 	        </div>
 	        <!-- Provider quick-start links -->
 	        <div class="madeit-security-notice madeit-security-notice--info" style="margin:0 0 14px">
 	            <strong>Where to get keys (free):</strong><br>
 	            • Google reCAPTCHA: <a href="https://www.google.com/recaptcha/admin/create" target="_blank" rel="noopener">google.com/recaptcha/admin/create</a><br>
 	            • Cloudflare Turnstile: <a href="https://dash.cloudflare.com/?to=/:account/turnstile" target="_blank" rel="noopener">dash.cloudflare.com/?to=/:account/turnstile</a>
 	        </div>
 	        <!-- Site key -->
 	        <div class="madeit-security-form-row">
 	            <label class="madeit-security-label" for="madeit_security_captcha_site_key">Site key</label>
 	            <input type="text"
 	                   id="madeit_security_captcha_site_key"
 	                   name="madeit_security_captcha_site_key"
 	                   value="<?php echo esc_attr( $captcha_site_key ); ?>"
 	                   class="madeit-security-input madeit-security-setting-input"
 	                   style="font-family:ui-monospace,Menlo,Consolas,monospace;width:480px;max-width:100%"
 	                   placeholder="6Lc... or 0x4A..." />
 	            <p class="madeit-security-desc">Public key — embedded in the page HTML. Safe to expose.</p>
 	        </div>
 	        <!-- Secret key -->
 	        <div class="madeit-security-form-row">
 	            <label class="madeit-security-label" for="madeit_security_captcha_secret_key">Secret key</label>
 	            <input type="password"
 	                   id="madeit_security_captcha_secret_key"
 	                   name="madeit_security_captcha_secret_key"
 	                   value=""
 	                   class="madeit-security-input madeit-security-setting-input"
 	                   autocomplete="new-password"
 	                   style="font-family:ui-monospace,Menlo,Consolas,monospace;width:480px;max-width:100%"
 	                   placeholder="<?php echo $captcha_has_secret ? '•••••••• (set — leave blank to keep)' : 'paste your provider secret'; ?>" />
 	            <p class="madeit-security-desc">Server-side secret — never sent to the browser. Used only to verify tokens with the provider.</p>
 	        </div>
 	        <!-- v3 threshold (only relevant for recaptcha_v3) -->
 	        <div class="madeit-security-form-row" id="madeit-security-captcha-v3-row" <?php echo 'recaptcha_v3' !== $captcha_provider ? 'style="display:none"' : ''; ?>>
 	            <label class="madeit-security-label" for="madeit_security_captcha_v3_threshold">v3 score threshold</label>
 	            <input type="number"
 	                   id="madeit_security_captcha_v3_threshold"
 	                   name="madeit_security_captcha_v3_threshold"
 	                   value="<?php echo esc_attr( (string) $captcha_threshold ); ?>"
 	                   step="0.05" min="0" max="1"
 	                   class="madeit-security-input madeit-security-input--sm madeit-security-setting-input" />
 	            <p class="madeit-security-desc">Range 0.0-1.0. Submissions scoring below this fail. Default 0.5; raise to 0.7 if you see bots slipping through.</p>
 	        </div>
 	        <!-- Theme -->
 	        <div class="madeit-security-form-row">
 	            <label class="madeit-security-label" for="madeit_security_captcha_theme">Widget theme</label>
 	            <select name="madeit_security_captcha_theme" id="madeit_security_captcha_theme" class="madeit-security-input madeit-security-setting-input" style="max-width:200px">
 	                <option value="auto"  <?php selected( $captcha_theme, 'auto' ); ?>>Auto (light)</option>
 	                <option value="light" <?php selected( $captcha_theme, 'light' ); ?>>Light</option>
 	                <option value="dark"  <?php selected( $captcha_theme, 'dark' ); ?>>Dark</option>
 	            </select>
 	        </div>
 	        <!-- Where to show -->
 	        <div class="madeit-security-form-row madeit-security-form-row--toggle">
 	            <div>
 	                <strong>Show on Login form</strong>
 	                <p class="madeit-security-desc">Verify CAPTCHA before checking the password. Recommended — biggest attack surface.</p>
 	            </div>
 	            <label class="madeit-security-toggle">
 	                <input type="checkbox" name="madeit_security_captcha_on_login" class="madeit-security-setting-input" <?php checked( $captcha_on_login ); ?> value="1" />
 	                <span class="madeit-security-toggle__slider"></span>
 	            </label>
 	        </div>
 	        <div class="madeit-security-form-row madeit-security-form-row--toggle">
 	            <div>
 	                <strong>Show on Registration form</strong>
 	                <p class="madeit-security-desc">Stops automated account creation. Only relevant if your site allows public registration.</p>
 	            </div>
 	            <label class="madeit-security-toggle">
 	                <input type="checkbox" name="madeit_security_captcha_on_register" class="madeit-security-setting-input" <?php checked( $captcha_on_reg ); ?> value="1" />
 	                <span class="madeit-security-toggle__slider"></span>
 	            </label>
 	        </div>
 	        <div class="madeit-security-form-row madeit-security-form-row--toggle">
 	            <div>
 	                <strong>Show on Lost Password form</strong>
 	                <p class="madeit-security-desc">Prevents bots from triggering bulk password-reset emails (used for username harvesting + email-flood DoS).</p>
 	            </div>
 	            <label class="madeit-security-toggle">
 	                <input type="checkbox" name="madeit_security_captcha_on_lostpassword" class="madeit-security-setting-input" <?php checked( $captcha_on_lostpw ); ?> value="1" />
 	                <span class="madeit-security-toggle__slider"></span>
 	            </label>
 	        </div>
 	        <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-settings" style="margin-top:6px">💾 Save CAPTCHA Settings</button>
 	        <p class="madeit-security-desc" style="margin-top:14px">
 	            <strong>Safety net:</strong> if a misconfigured CAPTCHA blocks you out, add your IP to the
 	            <a href="<?php echo esc_url( admin_url( 'admin.php?page=madeit-security-security-whitelist' ) ); ?>">IP Whitelist</a> via FTP/SSH (whitelisted IPs always bypass), or set <code>define( 'MADEIT_SECURITY_SAFE_MODE', true );</code> in <code>wp-config.php</code>.
 	        </p>
 	    </div>
 	</div>
 	<script>
 	// Show/hide v3 threshold row when provider changes.
 	(function () {
 	    var sel = document.getElementById('madeit-security-captcha-provider');
 	    var row = document.getElementById('madeit-security-captcha-v3-row');
 	    if (sel && row) {
 	        sel.addEventListener('change', function () {
 	            row.style.display = (this.value === 'recaptcha_v3') ? '' : 'none';
 	        });
 	    }
 	})();
 	</script>
    <!-- ══ BRUTE FORCE SETTINGS ═══════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">🛡️ Brute Force Settings</h2></div>
        <div class="madeit-security-form-body">
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Max attempts before lockout</label>
                <input type="number" name="madeit_security_login_max_attempts" value="<?php echo esc_attr( \MadeIT\Security\Settings::get('madeit_security_login_max_attempts',5) ); ?>" min="1" max="20" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input" />
            </div>
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Lockout 1 duration</label>
                <input type="number" name="madeit_security_login_lockout_1" value="<?php echo esc_attr( \MadeIT\Security\Settings::get('madeit_security_login_lockout_1',300) ); ?>" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input" />
                <span class="madeit-security-desc">seconds &mdash; after <?php echo esc_html( \MadeIT\Security\Settings::get( 'madeit_security_login_max_attempts', 5 ) ); ?> fails</span>
            </div>
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Lockout 2 duration</label>
                <input type="number" name="madeit_security_login_lockout_2" value="<?php echo esc_attr( \MadeIT\Security\Settings::get('madeit_security_login_lockout_2',1800) ); ?>" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input" />
                <span class="madeit-security-desc">seconds</span>
            </div>
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Lockout 3 duration</label>
                <input type="number" name="madeit_security_login_lockout_3" value="<?php echo esc_attr( \MadeIT\Security\Settings::get('madeit_security_login_lockout_3',86400) ); ?>" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input" />
                <span class="madeit-security-desc">seconds</span>
            </div>
            <button class="madeit-security-btn madeit-security-btn--primary" style="margin-top:8px" id="btn-save-settings">💾 Save Brute Force Settings</button>
            <div id="settings-saved-notice" class="madeit-security-form-result" style="display:none;"></div>
        </div>
    </div>

    <!-- ══ BRUTE FORCE ATTEMPTS ══════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Brute Force Attempt Monitor</h2>
            <span class="madeit-security-badge madeit-security-badge--gray">
                <?php // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache ?>
                <?php echo (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_login_attempts" ); ?> IPs tracked
            </span>
        </div>
        <?php
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $attempts = $wpdb->get_results(
            "SELECT ip, attempt_count, last_attempt, locked_until
               FROM {$wpdb->prefix}madeit_security_login_attempts
              ORDER BY attempt_count DESC, last_attempt DESC
              LIMIT 100"
        );
        ?>
        <div class="madeit-security-table-wrapper">
            <table class="madeit-security-table">
                <thead>
                    <tr><th>IP Address</th><th>Attempts</th><th>Last Attempt</th><th>Lockout Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    <?php if ( empty( $attempts ) ) : ?>
                        <tr><td colspan="5" class="madeit-security-empty-cell">No login attempts recorded yet. 🎉</td></tr>
                    <?php else : foreach ( $attempts as $a ) :
                        $is_locked = $a->locked_until && strtotime( $a->locked_until ) > time();
                        $sev       = $a->attempt_count >= 20 ? 'madeit-security-badge--red' : ( $a->attempt_count >= 5 ? 'madeit-security-badge--orange' : 'madeit-security-badge--gray' );
                    ?>
                        <tr class="<?php echo $is_locked ? 'madeit-security-row--blocked' : ''; ?>">
                            <td>
                                <code class="madeit-security-ip-code"><?php echo esc_html( $a->ip ); ?></code>
                                <button class="madeit-security-btn-link madeit-security-ip-detail-btn" data-ip="<?php echo esc_attr( $a->ip ); ?>">🔍</button>
                            </td>
                            <td><span class="madeit-security-badge <?php echo esc_attr( $sev ); ?>"><?php echo esc_html( $a->attempt_count ); ?></span></td>
                            <td class="madeit-security-date-text"><?php echo esc_html( wp_date( 'M j, H:i:s', strtotime( $a->last_attempt ) ) ); ?></td>
                            <td>
                                <?php if ( $is_locked ) : ?>
                                    <span class="madeit-security-badge madeit-security-badge--red">🔒 Until <?php echo esc_html( wp_date( 'H:i', strtotime( $a->locked_until ) ) ); ?></span>
                                <?php else : ?>
                                    <span class="madeit-security-badge madeit-security-badge--green">Free</span>
                                <?php endif; ?>
                            </td>
                            <td class="madeit-security-actions-cell">
                                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger madeit-security-block-ip-btn" data-ip="<?php echo esc_attr( $a->ip ); ?>">🚫 Block</button>
                                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-whitelist-ip-quick-btn" data-ip="<?php echo esc_attr( $a->ip ); ?>">✅ Whitelist</button>
                            </td>
                        </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    </div><!-- /col-main -->

    <!-- SIDEBAR -->
    <div class="madeit-security-col-side">
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Stats (24h)</h2></div>
            <div style="padding:20px;display:flex;gap:16px;justify-content:space-around;text-align:center;">
                <?php
                $now_wp = current_time( 'mysql' );
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
                $fails   = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events WHERE event_type='login_failed' AND created_at >= DATE_SUB(%s, INTERVAL 24 HOUR)", $now_wp ) );
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
                $locked  = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_login_attempts WHERE locked_until > %s", $now_wp ) );
                ?>
                <div><div style="font-size:2rem;font-weight:800;color:#c0392b"><?php echo esc_html( $fails ); ?></div><div style="font-size:.72rem;color:#718096;text-transform:uppercase">Failed Logins</div></div>
                <div><div style="font-size:2rem;font-weight:800;color:#e67e22"><?php echo esc_html( $locked ); ?></div><div style="font-size:.72rem;color:#718096;text-transform:uppercase">IPs Locked</div></div>
            </div>
        </div>
    </div>

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->
<?php require_once __DIR__ . '/_modals.php'; ?>


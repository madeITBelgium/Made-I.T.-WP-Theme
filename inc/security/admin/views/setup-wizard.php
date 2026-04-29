<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

$my_ip = \MadeIT\Security\RequestLogger::get_real_ip();
?>
<!-- Wizard styles loaded from admin.css -->

<div class="madeit-security-wizard-wrap" style="max-width:760px;margin:0 auto;background:#fff">

    <!-- ══ PROGRESS BAR ════════════════════════════════════════════════════════ -->
    <div class="madeit-security-wizard__progress">
        <div class="madeit-security-wizard__progress-bar">
            <div class="madeit-security-wizard__progress-fill" id="wizard-progress-fill"></div>
        </div>
        <div class="madeit-security-wizard__steps-indicator" style="display:flex;justify-content:space-between">
            <?php
            $steps = [ 'Welcome', 'Hardening', 'Login', 'Firewall', 'Sessions', 'Crawlers', 'Finish' ];
            foreach ( $steps as $i => $label ) :
                $num = $i + 1;
            ?>
            <div class="madeit-security-wizard__step-dot <?php echo $i === 0 ? 'madeit-security-wizard__step-dot--active' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static CSS class ?>" data-step="<?php echo esc_attr( $num ); ?>" style="display:flex;flex-direction:column;align-items:center;gap:4px">
                <span class="madeit-security-wizard__step-num"><?php echo esc_html( $num ); ?></span>
                <span class="madeit-security-wizard__step-label"><?php echo esc_html( $label ); ?></span>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- ══ STEP 1: WELCOME ═════════════════════════════════════════════════════ -->
    <div class="madeit-security-wizard__step madeit-security-wizard__step--active" data-wizard-step="1">
        <div class="madeit-security-wizard__hero">
            <div class="madeit-security-wizard__hero-icon">
                <img src="<?php echo esc_url( madeit_security_brand_logo_url() ); ?>" alt="<?php echo esc_attr( madeit_security_brand_name() ); ?>" class="madeit-security-wizard__logo" style="height:56px;width:auto;max-height:56px" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
                <span class="madeit-security-wizard__logo-fallback" style="display:none;font-size:3rem">🛡️</span>
            </div>
            <h1 class="madeit-security-wizard__hero-title">Welcome to Security</h1>
            <p class="madeit-security-wizard__hero-sub">Let's configure your site's security in under 2 minutes.</p>

            <div class="madeit-security-wizard__features">
                <div class="madeit-security-wizard__feature">
                    <span class="madeit-security-wizard__feature-icon">🔥</span>
                    <div>
                        <strong>Web Application Firewall</strong>
                        <p>Blocks SQL injection, XSS, and 28+ attack types</p>
                    </div>
                </div>
                <div class="madeit-security-wizard__feature">
                    <span class="madeit-security-wizard__feature-icon">🔐</span>
                    <div>
                        <strong>Brute Force Protection</strong>
                        <p>Progressive lockouts, hidden login URL, IP blocking</p>
                    </div>
                </div>
                <div class="madeit-security-wizard__feature">
                    <span class="madeit-security-wizard__feature-icon">👁️</span>
                    <div>
                        <strong>Real-Time Monitoring</strong>
                        <p>Live visitor log, bot detection, audit trail</p>
                    </div>
                </div>
                <div class="madeit-security-wizard__feature">
                    <span class="madeit-security-wizard__feature-icon">🛡️</span>
                    <div>
                        <strong>WordPress Hardening</strong>
                        <p>Hides version info, blocks XML-RPC, locks down the file editor</p>
                    </div>
                </div>
            </div>

            <p class="madeit-security-wizard__hero-note">
                Each step explains <strong>what the setting does</strong> and <strong>why you should enable it</strong>. You can change everything later in Settings.
            </p>

            <div class="madeit-security-wizard__recommended">
                <div class="madeit-security-wizard__recommended-divider">
                    <span>Quick Start</span>
                </div>
                <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--lg" id="wizard-apply-recommended"
                        style="width:100%;padding:16px 24px;font-size:1rem">
                    &#9889; Apply Made I.T. Security Recommended Settings
                </button>
                <p class="madeit-security-wizard__recommended-sub">
                    Enables WAF tarpit mode, honeypot traps, password policy, HSTS, CSP,
                    AI crawler blocking, and whitelists your IP &mdash; all in one click.
                </p>
                <div id="wizard-recommended-result" style="display:none;margin-top:12px;padding:12px 16px;border-radius:8px;font-size:.9rem;"></div>
            </div>
        </div>

        <div class="madeit-security-wizard__nav">
            <div></div>
            <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--lg madeit-security-wizard__next-btn" data-next="2">
                Or Customize Step by Step &rarr;
            </button>
        </div>
    </div>

    <!-- ══ STEP 2: WORDPRESS HARDENING ═════════════════════════════════════════ -->
    <div class="madeit-security-wizard__step" data-wizard-step="2" style="display:none">
        <div class="madeit-security-wizard__step-header">
            <span class="madeit-security-wizard__step-icon">🔒</span>
            <div>
                <h2 class="madeit-security-wizard__step-title">WordPress Hardening</h2>
                <p class="madeit-security-wizard__step-desc">These settings close the most commonly exploited WordPress attack surfaces. All are recommended.</p>
            </div>
        </div>

        <div class="madeit-security-wizard__settings">

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Disable XML-RPC</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_block_xmlrpc" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>XML-RPC is a legacy API that brute-force bots and DDoS amplification attacks love to abuse. Unless you use the <strong>WordPress mobile app</strong> or <strong>Jetpack</strong>, you don't need it. Disabling it eliminates an entire class of attacks.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Block REST API User Endpoint</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_block_rest_users" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>The REST API <code>/wp-json/wp/v2/users</code> endpoint exposes all your usernames to anyone who asks. Attackers use this to discover admin usernames for brute-force attacks. Blocking it hides your user list from unauthenticated visitors.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Hide WordPress Version</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_hide_wp_version" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>WordPress adds its version number to your HTML source and RSS feeds. Attackers scan for sites running older versions with known vulnerabilities. Hiding the version makes automated targeting harder.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Disable File Editor</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_disable_file_editor" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>WordPress includes a built-in code editor (Appearance &rarr; Theme Editor, Plugins &rarr; Plugin Editor). If an attacker gains admin access, they can inject malware directly through this editor. Disabling it forces code changes to go through FTP/SFTP, adding a critical security layer.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Block PHP in Uploads</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_block_php_uploads" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Attackers often upload PHP backdoor files disguised as images to the <code>/wp-content/uploads/</code> directory. This setting prevents any PHP file from executing inside uploads &mdash; one of the most common backdoor techniques in the wild.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Block Author Enumeration</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_block_author_enum" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Visiting <code>?author=1</code> on any WordPress site reveals the admin username via redirect. Bots routinely scan these URLs to build username lists. Blocking this returns a 404 instead of revealing your login name.</p>
                </div>
            </div>

        </div>

        <div class="madeit-security-wizard__nav">
            <button class="madeit-security-btn madeit-security-btn--ghost madeit-security-wizard__back-btn" data-prev="1">&larr; Back</button>
            <button class="madeit-security-btn madeit-security-btn--primary madeit-security-wizard__next-btn" data-next="3">Next: Login Protection &rarr;</button>
        </div>
    </div>

    <!-- ══ STEP 3: LOGIN PROTECTION ════════════════════════════════════════════ -->
    <div class="madeit-security-wizard__step" data-wizard-step="3" style="display:none">
        <div class="madeit-security-wizard__step-header">
            <span class="madeit-security-wizard__step-icon">🔐</span>
            <div>
                <h2 class="madeit-security-wizard__step-title">Login Protection</h2>
                <p class="madeit-security-wizard__step-desc">Configure brute-force protection to stop password-guessing attacks.</p>
            </div>
        </div>

        <div class="madeit-security-wizard__settings">

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Max Login Attempts Before Lockout</strong>
                    </div>
                    <input type="number" name="madeit_security_login_max_attempts" class="madeit-security-input madeit-security-input--sm madeit-security-wizard-input" value="5" min="1" max="20" style="width:80px" />
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>How many failed login attempts before the IP gets temporarily locked out. <strong>5 is good for most sites.</strong> If your site is high-profile or handles sensitive data, lower this to 3. If you have multiple editors who sometimes mistype passwords, 7-10 gives more breathing room.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>First Lockout Duration</strong>
                    </div>
                    <div class="madeit-security-wizard__input-with-unit">
                        <input type="number" name="madeit_security_login_lockout_1" class="madeit-security-input madeit-security-input--sm madeit-security-wizard-input" value="300" min="60" />
                        <span class="madeit-security-wizard__unit">seconds (5 minutes)</span>
                    </div>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>After the first lockout threshold, the attacker's IP is blocked for this long. <strong>5 minutes (300 seconds)</strong> is enough to stop casual bots without inconveniencing legitimate users who mistyped their password.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__info-card">
                <div class="madeit-security-wizard__info-icon">💡</div>
                <div>
                    <strong>Progressive Lockouts</strong>
                    <p>Made I.T. Security uses a 3-tier lockout system that gets progressively harsher:</p>
                    <ol>
                        <li><strong>1st lockout:</strong> 5 minutes (configured above)</li>
                        <li><strong>2nd lockout:</strong> 30 minutes &mdash; automated bots that retry after the first lockout get punished harder</li>
                        <li><strong>3rd lockout:</strong> 24 hours &mdash; persistent attackers are shut out for a full day</li>
                    </ol>
                    <p>This is automatic &mdash; you only need to configure the first tier. The escalation tiers are pre-set to optimal values.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__info-card madeit-security-wizard__info-card--tip">
                <div class="madeit-security-wizard__info-icon">🔗</div>
                <div>
                    <strong>Custom Login URL</strong>
                    <p>After the wizard, visit <strong>Login Security</strong> in the menu to set up a custom login URL. This hides <code>/wp-login.php</code> entirely &mdash; bots can't brute-force a URL they can't find. It's one of the most effective defenses available.</p>
                </div>
            </div>

        </div>

        <div class="madeit-security-wizard__nav">
            <button class="madeit-security-btn madeit-security-btn--ghost madeit-security-wizard__back-btn" data-prev="2">&larr; Back</button>
            <button class="madeit-security-btn madeit-security-btn--primary madeit-security-wizard__next-btn" data-next="4">Next: Firewall &rarr;</button>
        </div>
    </div>

    <!-- ══ STEP 4: FIREWALL & MONITORING ═══════════════════════════════════════ -->
    <div class="madeit-security-wizard__step" data-wizard-step="4" style="display:none">
        <div class="madeit-security-wizard__step-header">
            <span class="madeit-security-wizard__step-icon">🔥</span>
            <div>
                <h2 class="madeit-security-wizard__step-title">Firewall & Monitoring</h2>
                <p class="madeit-security-wizard__step-desc">The WAF is your first line of defense. Visitor logging enables threat detection.</p>
            </div>
        </div>

        <div class="madeit-security-wizard__settings">

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Enable Web Application Firewall</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_waf_enabled" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>The WAF inspects every incoming request and blocks SQL injection, cross-site scripting (XSS), remote code execution, directory traversal, and 28+ other attack types <strong>before they reach your WordPress code</strong>. This is the single most important security feature.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>WAF Mode</strong>
                    </div>
                    <select name="madeit_security_waf_mode" class="madeit-security-input madeit-security-input--sm madeit-security-wizard-input" style="width:140px">
                        <option value="block" selected>Block (Active)</option>
                        <option value="log">Log Only</option>
                    </select>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p><strong>Block mode</strong> stops attacks immediately and returns a 403 error. <strong>Log mode</strong> records attacks without blocking them &mdash; useful if you want to test for false positives first. We recommend starting with Block mode; you can switch to Log mode anytime if something breaks.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Enable Visitor Logging</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_log_enabled" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Visitor logging records all requests to your site &mdash; who visited, when, from where, and what they accessed. This powers the Dashboard's live visitor view, bot detection, traffic analytics, and is essential for forensic analysis if your site is ever compromised.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>REST API Policies</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_rest_policies_enabled" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Adds per-route rate limiting and authentication requirements to the REST API. This prevents abuse of public endpoints (like search and post listings) and blocks unauthenticated access to sensitive routes. Fine-tune individual policies on the REST API page after setup.</p>
                </div>
            </div>

        </div>

        <div class="madeit-security-wizard__nav">
            <button class="madeit-security-btn madeit-security-btn--ghost madeit-security-wizard__back-btn" data-prev="3">&larr; Back</button>
            <button class="madeit-security-btn madeit-security-btn--primary madeit-security-wizard__next-btn" data-next="5">Next: Sessions &rarr;</button>
        </div>
    </div>

    <!-- ══ STEP 5: SESSION & COOKIE SECURITY ═══════════════════════════════════ -->
    <div class="madeit-security-wizard__step" data-wizard-step="5" style="display:none">
        <div class="madeit-security-wizard__step-header">
            <span class="madeit-security-wizard__step-icon">🍪</span>
            <div>
                <h2 class="madeit-security-wizard__step-title">Session & Cookie Security</h2>
                <p class="madeit-security-wizard__step-desc">Harden authentication cookies and prevent session hijacking.</p>
            </div>
        </div>

        <div class="madeit-security-wizard__settings">

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Enable Session Security</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_session_security_enabled" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Hardens WordPress authentication cookies with HttpOnly, Secure, and SameSite flags. Also enables session binding (ties sessions to IP + browser) to detect cookie theft. If someone steals your auth cookie, they still can't use it from a different computer.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>SameSite Cookie Policy</strong>
                    </div>
                    <select name="madeit_security_session_samesite" class="madeit-security-input madeit-security-input--sm madeit-security-wizard-input" style="width:140px">
                        <option value="Lax" selected>Lax (Recommended)</option>
                        <option value="Strict">Strict</option>
                        <option value="None">None</option>
                    </select>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p><strong>Lax</strong> prevents cookies from being sent in cross-site POST requests, stopping most CSRF attacks while allowing normal link navigation. <strong>Strict</strong> blocks cookies on all cross-site requests for maximum security, but may break some SSO or external login flows. <strong>None</strong> offers no protection and is not recommended.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Max Concurrent Sessions Per User</strong>
                    </div>
                    <input type="number" name="madeit_security_max_sessions" class="madeit-security-input madeit-security-input--sm madeit-security-wizard-input" value="3" min="0" max="20" style="width:80px" />
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Limits how many devices can be logged in to the same account simultaneously. <strong>3 is ideal</strong> for most sites (desktop + phone + tablet). Set to <strong>0 for unlimited</strong>. If a user exceeds the limit, their oldest session is automatically terminated.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Idle Session Timeout</strong>
                    </div>
                    <div class="madeit-security-wizard__input-with-unit">
                        <input type="number" name="madeit_security_session_idle_timeout" class="madeit-security-input madeit-security-input--sm madeit-security-wizard-input" value="1800" min="0" style="width:100px" />
                        <span class="madeit-security-wizard__unit">seconds (30 min)</span>
                    </div>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Auto-logout users after this many seconds of inactivity. <strong>30 minutes (1800 seconds)</strong> balances security with convenience. Set to <strong>0 to disable</strong>. Shorter timeouts reduce the risk of someone accessing a forgotten logged-in session.</p>
                </div>
            </div>

        </div>

        <div class="madeit-security-wizard__nav">
            <button class="madeit-security-btn madeit-security-btn--ghost madeit-security-wizard__back-btn" data-prev="4">&larr; Back</button>
            <button class="madeit-security-btn madeit-security-btn--primary madeit-security-wizard__next-btn" data-next="6">Next: Crawlers & Alerts &rarr;</button>
        </div>
    </div>

    <!-- ══ STEP 6: AI CRAWLERS & NOTIFICATIONS ═════════════════════════════════ -->
    <div class="madeit-security-wizard__step" data-wizard-step="6" style="display:none">
        <div class="madeit-security-wizard__step-header">
            <span class="madeit-security-wizard__step-icon">🤖</span>
            <div>
                <h2 class="madeit-security-wizard__step-title">AI Crawlers & Notifications</h2>
                <p class="madeit-security-wizard__step-desc">Control AI training bots and set up security alerts.</p>
            </div>
        </div>

        <div class="madeit-security-wizard__settings">

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Block AI Crawlers</strong>
                        <span class="madeit-security-badge madeit-security-badge--gray">Your Choice</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_block_ai_crawlers" class="madeit-security-wizard-input" />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Blocks AI training bots like GPTBot (OpenAI), ClaudeBot (Anthropic), Google-Extended, and 17 others from scraping your content. <strong>This does not affect search engines</strong> like Google, Bing, or DuckDuckGo &mdash; only AI/LLM training crawlers. Enable this if you don't want your content used to train AI models. After setup, you can fine-tune which specific crawlers to block on the AI Crawlers page.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Security Alert Email</strong>
                    </div>
                    <input type="email" name="madeit_security_notify_email" class="madeit-security-input madeit-security-wizard-input" value="<?php echo esc_attr( get_option( 'admin_email', '' ) ); ?>" style="width:280px" />
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Where to send security alerts &mdash; brute-force lockout notifications, WAF block summaries, and suspicious activity warnings. Defaults to your WordPress admin email. You can add a dedicated security inbox if you prefer.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__setting">
                <div class="madeit-security-wizard__setting-row">
                    <div class="madeit-security-wizard__setting-info">
                        <strong>Enable Cron Guard</strong>
                        <span class="madeit-security-badge madeit-security-badge--green">Recommended: ON</span>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_cron_guard_enabled" class="madeit-security-wizard-input" checked />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <div class="madeit-security-wizard__advice">
                    <p>Monitors <code>wp-cron.php</code> for abuse and detects unauthorized scheduled tasks. Malware often registers hidden cron jobs to maintain persistence after cleanup. Cron Guard catches these and alerts you to new, unrecognized scheduled events.</p>
                </div>
            </div>

        </div>

        <div class="madeit-security-wizard__nav">
            <button class="madeit-security-btn madeit-security-btn--ghost madeit-security-wizard__back-btn" data-prev="5">&larr; Back</button>
            <button class="madeit-security-btn madeit-security-btn--primary madeit-security-wizard__next-btn" data-next="7">Next: Finish Setup &rarr;</button>
        </div>
    </div>

    <!-- ══ STEP 7: WHITELIST IP & FINISH ═══════════════════════════════════════ -->
    <div class="madeit-security-wizard__step" data-wizard-step="7" style="display:none">
        <div class="madeit-security-wizard__step-header">
            <span class="madeit-security-wizard__step-icon">✅</span>
            <div>
                <h2 class="madeit-security-wizard__step-title">Whitelist Your IP & Finish</h2>
                <p class="madeit-security-wizard__step-desc">One last step &mdash; make sure you never get locked out of your own site.</p>
            </div>
        </div>

        <div class="madeit-security-wizard__settings">

            <div class="madeit-security-wizard__ip-card">
                <div class="madeit-security-wizard__ip-label">Your Current IP Address</div>
                <div class="madeit-security-wizard__ip-value">
                    <code class="madeit-security-ip-code" style="font-size:1.25rem"><?php echo esc_html( $my_ip ); ?></code>
                </div>
                <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--lg" id="wizard-whitelist-btn">
                    ✅ Whitelist My IP
                </button>
                <div id="wizard-whitelist-result" class="madeit-security-wizard__whitelist-result" style="display:none;"></div>
            </div>

            <div class="madeit-security-wizard__advice">
                <p><strong>Why whitelist your IP?</strong> Whitelisting means you'll <strong>never</strong> be locked out by brute-force protection, rate limiting, or IP blocks &mdash; even if you mistype your password 50 times. Whitelisted IPs also bypass the custom login URL restriction, so you can always access <code>/wp-login.php</code> directly.</p>
            </div>

            <div class="madeit-security-wizard__info-card madeit-security-wizard__info-card--warning">
                <div class="madeit-security-wizard__info-icon">⚠️</div>
                <div>
                    <strong>Skipping this?</strong>
                    <p>If you skip whitelisting, aggressive security rules could lock you out of your own site. If that happens, rename the <code>madeit</code> plugin folder via FTP to disable the plugin and regain access.</p>
                </div>
            </div>

            <div class="madeit-security-wizard__info-card">
                <div class="madeit-security-wizard__info-icon">🎉</div>
                <div>
                    <strong>You're all set!</strong>
                    <p>Click "Complete Setup" to save all your choices and activate protection. You can fine-tune any setting later from the individual module pages or the Settings screen.</p>
                </div>
            </div>

        </div>

        <div class="madeit-security-wizard__nav">
            <button class="madeit-security-btn madeit-security-btn--ghost madeit-security-wizard__back-btn" data-prev="6">&larr; Back</button>
            <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--lg" id="wizard-complete-btn">
                🚀 Complete Setup
            </button>
        </div>

        <div id="wizard-save-result" class="madeit-security-wizard__save-result" style="display:none;"></div>
    </div>

</div>

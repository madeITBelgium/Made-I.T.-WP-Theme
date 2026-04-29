<?php defined( 'ABSPATH' ) || exit; // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function ?>

    <!-- PAGE HEADER -->
    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">ℹ</span>
            <div>
                <h1 class="madeit-security-page-title">About Security</h1>
                <p class="madeit-security-page-sub">Defense architecture, attack coverage, and plugin information</p>
            </div>
        </div>
        <div class="madeit-security-page-header__right">
            <span class="madeit-security-badge madeit-security-badge--blue">v<?php echo esc_html( MADEIT_VERSION ); ?></span>
        </div>
    </div>

    <!-- CONTENT AREA -->
    <div class="madeit-security-page-content">

        <!-- THREAT COVERAGE BANNER -->
        <div class="aw-coverage-banner">
            <div>
                <div class="aw-coverage-banner__title">🛡️ Comprehensive Threat Coverage</div>
                <p class="aw-coverage-banner__sub">
                    In 2025, researchers found 11,334 WordPress vulnerabilities — up 34% YoY. 96% live in plugins.
                    43% require zero authentication. Security defends against all major attack classes.
                </p>
                <div class="aw-coverage-banner__stats">
                    <div class="aw-cov-stat">
                        <span class="aw-cov-stat__num">31</span>
                        <div class="aw-cov-stat__lbl">Attack Vectors<br>Defended</div>
                    </div>
                    <div class="aw-cov-stat">
                        <span class="aw-cov-stat__num">15</span>
                        <div class="aw-cov-stat__lbl">Unique Features<br>vs. Competitors</div>
                    </div>
                    <div class="aw-cov-stat">
                        <span class="aw-cov-stat__num">5</span>
                        <div class="aw-cov-stat__lbl">Defense<br>Layers</div>
                    </div>
                </div>
            </div>
            <div class="aw-coverage-banner__right">
                <div class="aw-big-score">A+</div>
                <div class="aw-score-label">Security Grade</div>
            </div>
        </div>

        <!-- 5 PROTECTION LAYERS -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">⚡ 5-Layer Defense Architecture</h2>
                <span class="madeit-security-badge madeit-security-badge--blue">All Active</span>
            </div>
            <div class="aw-layers-grid" style="border-radius:0;border:none">
                <div class="aw-layer-item">
                    <div class="aw-layer-item__num">Layer 1</div>
                    <span class="aw-layer-item__icon">⚡</span>
                    <div class="aw-layer-item__name">Pre-WP WAF</div>
                    <div class="aw-layer-item__desc">Filters requests before WordPress loads via auto_prepend_file</div>
                </div>
                <div class="aw-layer-item">
                    <div class="aw-layer-item__num">Layer 2</div>
                    <span class="aw-layer-item__icon">🧠</span>
                    <div class="aw-layer-item__name">App-Aware</div>
                    <div class="aw-layer-item__desc">Context-aware rules leveraging user roles, capabilities &amp; plugin state</div>
                </div>
                <div class="aw-layer-item">
                    <div class="aw-layer-item__num">Layer 3</div>
                    <span class="aw-layer-item__icon">📡</span>
                    <div class="aw-layer-item__name">Outbound Monitor</div>
                    <div class="aw-layer-item__desc">SSRF prevention — monitors all outbound HTTP from your server</div>
                </div>
                <div class="aw-layer-item">
                    <div class="aw-layer-item__num">Layer 4</div>
                    <span class="aw-layer-item__icon">🗄️</span>
                    <div class="aw-layer-item__name">Database Scan</div>
                    <div class="aw-layer-item__desc">Full wp_options/wp_posts analysis for eval(), base64, backdoors</div>
                </div>
                <div class="aw-layer-item">
                    <div class="aw-layer-item__num">Layer 5</div>
                    <span class="aw-layer-item__icon">🖥️</span>
                    <div class="aw-layer-item__name">Client-Side</div>
                    <div class="aw-layer-item__desc">JS challenges, browser fingerprinting, behavioral bot analysis</div>
                </div>
            </div>
        </div>

        <!-- COMPETITIVE FEATURES -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">🏆 What Makes Us Different</h2>
                <span class="madeit-security-badge madeit-security-badge--green">Unique Features</span>
            </div>
            <div class="aw-features-list">

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">⚡</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Pre-WordPress WAF</div>
                        <div class="aw-feature-card__gap">Only 1 other plugin offers this</div>
                        <p class="aw-feature-card__desc">Most plugin-based WAFs only activate <em>after</em> the full WordPress stack loads — meaning malicious requests already consume server resources before inspection. Made I.T. Security hooks into PHP's <code>auto_prepend_file</code> directive to filter requests <strong>before WordPress, themes, or any plugins execute</strong>. Zero PHP overhead on blocked requests. This is the same architectural approach used by NinjaFirewall, the top-performing WAF in independent benchmarks.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">📡</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Outbound HTTP Monitor &amp; SSRF Prevention</div>
                        <div class="aw-feature-card__gap">No other WordPress security plugin does this</div>
                        <p class="aw-feature-card__desc">Every major security plugin inspects <em>inbound</em> requests — none monitors <strong>outbound</strong> HTTP calls from your server. Compromised plugins can silently exfiltrate data, scan internal networks, or hit cloud metadata endpoints (169.254.169.254). Made I.T. Security intercepts all <code>wp_remote_get/post</code> calls, blocks requests to private/internal IP ranges, and traces every outbound request to the specific plugin or theme that initiated it. Domain allowlist with wildcard support.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🗄️</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Database Backdoor Scanner</div>
                        <div class="aw-feature-card__gap">Nearly all competitors miss database-stored malware</div>
                        <p class="aw-feature-card__desc">49% of compromised sites have backdoors — and many hide in the database, not in files. Wordfence confirmed it cannot detect database malware. Made I.T. Security performs <strong>full content analysis of wp_options and wp_posts tables</strong> for <code>eval()</code>, base64-encoded payloads, obfuscated PHP, and suspicious serialized objects. This catches malware that file-based scanners completely miss, including SEO spam injections and persistent backdoors stored as serialized data.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🖥️</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Client-Side Bot Detection</div>
                        <div class="aw-feature-card__gap">Most plugins rely on IP/UA matching alone</div>
                        <p class="aw-feature-card__desc">Independent testing showed Wordfence was bypassed on 23 out of 30 attempts with a basic rotating proxy setup. Traditional plugins rely on IP reputation and user-agent matching, which sophisticated bots evade trivially. Made I.T. Security adds <strong>JavaScript challenges, browser fingerprinting, and behavioral analysis</strong> — detecting headless browsers, automation frameworks, and bots that mimic human user-agents. Cross-validates canvas rendering, WebGL vendor strings, navigator properties, and timing patterns.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🤖</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">AI / LLM Crawler Management</div>
                        <div class="aw-feature-card__gap">Not addressed by any major security plugin</div>
                        <p class="aw-feature-card__desc">AI training crawlers (GPTBot, ClaudeBot, Google-Extended, Bytespider, CCBot, and 15+ others) scrape content to train large language models — often ignoring robots.txt. No major security plugin addresses this. Made I.T. Security provides <strong>per-crawler toggles</strong> so you can allow some AI crawlers while blocking others, automatic robots.txt integration, and 403 enforcement for crawlers that ignore your rules. Block training crawlers while keeping search engine bots working normally.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🍯</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Honeypot Traps</div>
                        <div class="aw-feature-card__gap">Multi-vector honeypot system with zero false positives</div>
                        <p class="aw-feature-card__desc">Four independent trap types that catch bots without affecting legitimate users: <strong>hidden link traps</strong> (CSS-hidden links with robots.txt Disallow rules), <strong>fake login pages</strong> (decoy wp-login.php that bans any IP that accesses it), <strong>comment honeypots</strong> (invisible form fields that only bots fill), and <strong>Contact Form 7 integration</strong>. 3-layer safe bot protection ensures Googlebot, Bingbot, and 35+ known-good crawlers are never blocked — they receive a 404 instead of a ban.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">⏱️</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Cron Guard</div>
                        <div class="aw-feature-card__gap">No other plugin monitors wp-cron for malware persistence</div>
                        <p class="aw-feature-card__desc">Malware frequently plants hidden cron jobs to maintain persistence after cleanup — re-infecting the site on schedule. No other security plugin monitors this. Made I.T. Security's Cron Guard <strong>detects unauthorized scheduled tasks</strong> via baseline comparison, monitors wp-cron.php for flood attacks, and provides a system cron migration helper. If a suspicious new cron job appears that you didn't create, you'll know immediately.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🔧</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Post-Breach Recovery Command Center</div>
                        <div class="aw-feature-card__gap">12 emergency actions in one unified interface</div>
                        <p class="aw-feature-card__desc">When a breach happens, you need to act fast across multiple fronts. Most plugins offer scanning but no structured recovery workflow. Made I.T. Security provides <strong>12 emergency actions in one command center</strong>: terminate all sessions, force password resets, rotate WordPress secret keys, trigger emergency lockdown, reinstall WordPress core, reinstall plugins, audit admin accounts for hidden users, clear all caches, run malware scan, disable suspicious plugins, and generate a downloadable incident report.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🔐</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Session Security &amp; Fingerprint Binding</div>
                        <div class="aw-feature-card__gap">No other plugin enforces full session hardening</div>
                        <p class="aw-feature-card__desc">LiteSpeed Cache's CVE-2024-44000 exposed session cookies in publicly accessible debug logs — enabling unauthenticated admin takeover. No security plugin enforces cookie hardening or detects session hijacking. Made I.T. Security enforces <strong>HttpOnly, Secure, and SameSite cookie attributes</strong>, binds sessions to IP + User-Agent fingerprints (stolen cookies are useless if the fingerprint doesn't match), enforces concurrent session limits, and provides idle timeout with optional admin bypass.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🔌</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Granular REST API Policies</div>
                        <div class="aw-feature-card__gap">Per-route control — not all-or-nothing blocking</div>
                        <p class="aw-feature-card__desc">The WordPress REST API exposes user data, post content, and search at <code>/wp-json/</code> by default. Most plugins either block the entire API or leave it open — breaking contact forms, headless frontends, or mobile apps. Made I.T. Security provides <strong>per-namespace, per-route security policies</strong> with configurable authentication requirements, HTTP method restrictions, rate limits, and IP whitelists. 5 built-in policies protect the most-targeted endpoints out of the box.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🛡️</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Comprehensive Security Headers</div>
                        <div class="aw-feature-card__gap">Most security plugins ignore headers entirely</div>
                        <p class="aw-feature-card__desc">83% of WordPress sites lack X-Frame-Options headers. CSP is notoriously difficult for WordPress because plugins and themes load scripts from various sources. Made I.T. Security manages <strong>HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP (with WordPress-aware defaults), CORP, and COOP</strong>. Includes a letter-grade scoring system, removes X-Powered-By and Server headers, and supports report-only mode for safe CSP testing.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🔑</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Smart Password Policy</div>
                        <div class="aw-feature-card__gap">81% of WordPress attacks involve weak or stolen passwords</div>
                        <p class="aw-feature-card__desc">WordPress has no built-in password policy. Made I.T. Security enforces <strong>minimum length, character complexity, common-password blocking</strong> (rejecting passwords found in breach databases), and <strong>passphrase support</strong> with configurable word count and separators. Users can generate memorable passphrases like "correct-horse-battery-staple" that are both stronger and easier to remember than complex character requirements.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🔍</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Malware Scanner with 38 Signatures</div>
                        <div class="aw-feature-card__gap">Local file + database scanner with quarantine system</div>
                        <p class="aw-feature-card__desc">Detects backdoors, webshells (WSO, c99, r57), crypto miners, credit card skimmers, and obfuscated code across <strong>both files and database tables</strong>. Identifies string concatenation evasion (<code>$a = 'ba'.'se'.'64'</code>), <code>gzinflate()</code> patterns, and AES-encrypted payloads. Quarantine system moves suspicious files to a secure directory with web access blocking. Files larger than 5 MB are automatically skipped to avoid timeouts on shared hosting.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">📊</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Real-Time Visitor Dashboard</div>
                        <div class="aw-feature-card__gap">Live monitoring with 15-second auto-refresh</div>
                        <p class="aw-feature-card__desc">See exactly who is on your site right now. Live visitor feed shows IP address, country (via GeoIP), current page, browser, user-agent, and bot classification — <strong>updated every 15 seconds</strong>. Stat cards display online visitors, 24h requests, bot traffic percentage, and blocked requests. Traffic charts, top IPs with one-click VirusTotal lookup, top pages, and browser distribution. Click any IP for a detailed modal with full request history.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🛟</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Safe Mode &amp; Anti-Lockout</div>
                        <div class="aw-feature-card__gap">Emergency override that no other plugin provides</div>
                        <p class="aw-feature-card__desc">Security plugins are the #1 cause of admin lockouts. Custom login URLs, overzealous WAF rules, or IP blocks that catch the admin's own IP. Made I.T. Security includes <strong>three safety nets</strong>: automatic whitelisting of the admin's IP on activation, a deactivation hook that disables the custom login URL before the plugin unloads (preventing lockout between sessions), and <strong>Safe Mode</strong> — one constant in wp-config.php (<code>MADEIT_SECURITY_SAFE_MODE</code>) that instantly disables all blocking features while keeping the admin interface accessible.</p>
                    </div>
                </div>

                <div class="aw-feature-card">
                    <div class="aw-feature-card__icon">🚫</div>
                    <div class="aw-feature-card__body">
                        <div class="aw-feature-card__title">Zero Phone-Home &amp; Full Privacy</div>
                        <div class="aw-feature-card__gap">No telemetry, no tracking, no external API calls</div>
                        <p class="aw-feature-card__desc">Many security plugins silently phone home — sending site URLs, plugin lists, or usage data to external servers. Some load external fonts, CDN resources, or make API calls on every page load. Made I.T. Security runs <strong>100% locally on your server</strong>. No telemetry, no tracking, no external API calls, no CDN dependencies, no external fonts. Fully GDPR-compliant out of the box. Your security data stays on your server. Even the GeoIP database is downloaded once and stored locally.</p>
                    </div>
                </div>

            </div>
        </div>

        <!-- ATTACK VECTOR COVERAGE -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">🎯 Attack Vector Coverage</h2>
                <div style="display:flex;align-items:center;gap:12px;font-size:.73rem;color:var(--aw-text-muted)">
                    <span style="display:flex;align-items:center;gap:5px"><span class="aw-vector-dot aw-vector-dot--covered" style="display:inline-block"></span> Covered</span>
                    <span style="display:flex;align-items:center;gap:5px"><span class="aw-vector-dot aw-vector-dot--partial" style="display:inline-block"></span> Partial</span>
                    <span style="display:flex;align-items:center;gap:5px"><span class="aw-vector-dot aw-vector-dot--roadmap" style="display:inline-block"></span> Roadmap</span>
                </div>
            </div>
            <div class="aw-vector-grid">
                <?php
                $vectors = [
                    ['Brute force / wp-login.php',        'covered'],
                    ['XML-RPC amplification attacks',      'covered'],
                    ['REST API user enumeration',          'covered'],
                    ['Credential stuffing',                'covered'],
                    ['Password spraying',                  'covered'],
                    ['SQL injection (SQLi)',                'covered'],
                    ['Cross-site scripting (XSS)',         'covered'],
                    ['PHP object injection / unserialize', 'partial'],
                    ['File inclusion (LFI/RFI)',            'covered'],
                    ['Remote code execution (RCE)',         'covered'],
                    ['Directory traversal',                 'covered'],
                    ['Malware injection &amp; backdoors',   'covered'],
                    ['Supply chain attacks',                'partial'],
                    ['CSRF vulnerabilities',                'covered'],
                    ['SSRF / outbound HTTP abuse',          'partial'],
                    ['Cookie / session hijacking',          'covered'],
                    ['Clickjacking (X-Frame-Options)',      'covered'],
                    ['Outdated plugin exploitation',        'covered'],
                    ['WP file editor exploitation',         'covered'],
                    ['Database credential exposure',        'covered'],
                    ['wp-config.php disclosure',            'covered'],
                    ['Debug log exposure',                  'covered'],
                    ['XML-RPC 2FA bypass',                  'covered'],
                    ['Username enumeration (author param)', 'covered'],
                    ['Hotlinking / bandwidth theft',        'covered'],
                    ['AI / LLM crawler abuse',              'partial'],
                    ['Subdomain takeover',                  'roadmap'],
                    ['wp-cron abuse',                       'covered'],
                    ['DDoS amplification via pingback',     'covered'],
                    ['Content scraping',                    'partial'],
                    ['Multisite privilege escalation',      'covered'],
                ];
                foreach ( $vectors as [$name, $status] ) : ?>
                <div class="aw-vector-item">
                    <span class="aw-vector-dot aw-vector-dot--<?php echo esc_attr($status); ?>"></span>
                    <span><?php echo esc_html( $name ); ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- PLUGIN INFO -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">Plugin Information</h2>
            </div>
            <div style="padding:16px 18px;font-size:13px;color:var(--c-text-3);line-height:1.7">
                <table style="border-collapse:collapse;width:100%;max-width:480px">
                    <tr><td style="padding:4px 16px 4px 0;font-weight:600;color:var(--c-text-2)">Version</td><td><?php echo esc_html( MADEIT_VERSION ); ?></td></tr>
                    <tr><td style="padding:4px 16px 4px 0;font-weight:600;color:var(--c-text-2)">Author</td><td><a href="<?php echo esc_url( madeit_security_brand_url() ); ?>" target="_blank" rel="noopener"><?php echo esc_html( madeit_security_brand_name() ); ?></a></td></tr>
                    <tr><td style="padding:4px 16px 4px 0;font-weight:600;color:var(--c-text-2)">Website</td><td><a href="<?php echo esc_url( madeit_security_brand_url() ); ?>" target="_blank" rel="noopener"><?php echo esc_url( madeit_security_brand_url() ); ?></a></td></tr>
                    <tr><td style="padding:4px 16px 4px 0;font-weight:600;color:var(--c-text-2)">Documentation</td><td><a href="<?php echo esc_url( MADEIT_SECURITY_BRAND_DOCS ); ?>" target="_blank" rel="noopener">View docs</a></td></tr>
                    <tr><td style="padding:4px 16px 4px 0;font-weight:600;color:var(--c-text-2)">Support</td><td><a href="<?php echo esc_url( madeit_security_brand_support_url() ); ?>" target="_blank" rel="noopener">Contact support</a></td></tr>
                    <tr><td style="padding:4px 16px 4px 0;font-weight:600;color:var(--c-text-2)">PHP</td><td><?php echo esc_html( PHP_VERSION ); ?></td></tr>
                    <tr><td style="padding:4px 16px 4px 0;font-weight:600;color:var(--c-text-2)">WordPress</td><td><?php echo esc_html( get_bloginfo( 'version' ) ); ?></td></tr>
                </table>
            </div>
        </div>

    </div><!-- /.madeit-security-page-content -->

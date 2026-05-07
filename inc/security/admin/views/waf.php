<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

$waf_enabled  = (bool) \MadeIT\Security\Settings::get( 'madeit_security_waf_enabled', true );
$waf_mode     = \MadeIT\Security\Settings::get( 'madeit_security_waf_mode', 'log' );
$autoblock    = (bool) \MadeIT\Security\Settings::get( 'madeit_security_waf_autoblock', true );
$block_dur    = (int) \MadeIT\Security\Settings::get( 'madeit_security_auto_block_duration', 3600 );
$resp_code    = (int) \MadeIT\Security\Settings::get( 'madeit_security_block_response_code', 403 );
$wl_logged_in = (bool) \MadeIT\Security\Settings::get( 'madeit_security_waf_whitelist_logged_in', false );
$disabled     = (array) \MadeIT\Security\Settings::get( 'madeit_security_waf_disabled_rules', [] );

// Get all rules + recent stats
$rules = \MadeIT\Security\modules\WAF::get_rules();
$top   = \MadeIT\Security\modules\WAF::get_top_triggered_rules( 20 );

// Index top triggered by rule_id for easy lookup
$hits_by_rule = [];
foreach ( $top as $row ) {
    $hits_by_rule[ $row->rule_id ] = $row;
}

// Group rules by category
$cats = [
    'sqli'    => [ 'label' => 'SQL Injection',             'icon' => '💉', 'rules' => [] ],
    'xss'     => [ 'label' => 'Cross-Site Scripting (XSS)','icon' => '🔓', 'rules' => [] ],
    'lfi'     => [ 'label' => 'File Inclusion / Traversal', 'icon' => '📂', 'rules' => [] ],
    'rce'     => [ 'label' => 'Remote Code Execution',     'icon' => '💀', 'rules' => [] ],
    'deser'   => [ 'label' => 'Object Injection',          'icon' => '🧬', 'rules' => [] ],
    'ssrf'    => [ 'label' => 'SSRF',                      'icon' => '🌐', 'rules' => [] ],
    'wp'      => [ 'label' => 'WordPress-Specific',        'icon' => '🔧', 'rules' => [] ],
    'scanner' => [ 'label' => 'Scanner Detection',         'icon' => '🔍', 'rules' => [] ],
];
foreach ( $rules as $rule ) {
    $cat = $rule['cat'] ?? 'wp';
    if ( isset( $cats[ $cat ] ) ) {
        $cats[ $cat ]['rules'][] = $rule;
    }
}

// Count stats
$total_rules   = count( $rules );
$enabled_rules = $total_rules - count( $disabled );
$total_blocks  = 0;
foreach ( $top as $row ) {
    $total_blocks += (int) $row->hits;
}

// Severity helpers
if ( ! function_exists( 'madeit_security_sev_badge' ) ) {
    function madeit_security_sev_badge( int $sev ): string {
        if ( $sev >= 9 ) return '<span class="madeit-security-badge madeit-security-badge--red">CRITICAL</span>';
        if ( $sev >= 7 ) return '<span class="madeit-security-badge madeit-security-badge--orange">HIGH</span>';
        if ( $sev >= 5 ) return '<span class="madeit-security-badge madeit-security-badge--blue">MEDIUM</span>';
        return '<span class="madeit-security-badge madeit-security-badge--gray">LOW</span>';
    }
}
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🛡️</span>
            <div>
                <h1 class="madeit-security-page-title">Web Application Firewall</h1>
                <p class="madeit-security-page-sub">Inspect, filter, and block malicious requests before they reach WordPress</p>
            </div>
        </div>
        <div class="madeit-security-page-header__right">
            <?php if ( $waf_enabled ) : ?>
                <span class="madeit-security-badge madeit-security-badge--green" style="font-size:11px;padding:4px 12px">WAF Active</span>
            <?php else : ?>
                <span class="madeit-security-badge madeit-security-badge--gray" style="font-size:11px;padding:4px 12px">WAF Disabled</span>
            <?php endif; ?>
            <span class="madeit-security-badge madeit-security-badge--blue" style="font-size:11px;padding:4px 12px">
                Mode: <?php echo esc_html( ucfirst( $waf_mode ) ); ?>
            </span>
        </div>
    </div>

    <!-- ── STAT CARDS ─────────────────────────────────────────────────────── -->
    <div class="madeit-security-stat-cards">
        <div class="madeit-security-stat-card madeit-security-stat-card--blue">
            <div class="madeit-security-stat-card__icon">🛡️</div>
            <div class="madeit-security-stat-card__data">
                <div class="madeit-security-stat-card__number"><?php echo esc_html( $total_rules ); ?></div>
                <div class="madeit-security-stat-card__label">Total Rules</div>
                <div class="madeit-security-stat-card__sub">8 categories</div>
            </div>
        </div>
        <div class="madeit-security-stat-card madeit-security-stat-card--green">
            <div class="madeit-security-stat-card__icon">✅</div>
            <div class="madeit-security-stat-card__data">
                <div class="madeit-security-stat-card__number"><?php echo esc_html( $enabled_rules ); ?></div>
                <div class="madeit-security-stat-card__label">Enabled Rules</div>
                <div class="madeit-security-stat-card__sub"><?php echo $total_rules === $enabled_rules ? esc_html( 'all active' ) : esc_html( count( $disabled ) . ' disabled' ); ?></div>
            </div>
        </div>
        <div class="madeit-security-stat-card madeit-security-stat-card--red">
            <div class="madeit-security-stat-card__icon">🚫</div>
            <div class="madeit-security-stat-card__data">
                <div class="madeit-security-stat-card__number"><?php echo esc_html( $total_blocks ); ?></div>
                <div class="madeit-security-stat-card__label">Blocks (7 days)</div>
                <div class="madeit-security-stat-card__sub">matched rule triggers</div>
            </div>
        </div>
        <div class="madeit-security-stat-card madeit-security-stat-card--orange">
            <div class="madeit-security-stat-card__icon">⚡</div>
            <div class="madeit-security-stat-card__data">
                <div class="madeit-security-stat-card__number"><?php echo esc_html( ucfirst( $waf_mode ) ); ?></div>
                <div class="madeit-security-stat-card__label">Response Mode</div>
                <div class="madeit-security-stat-card__sub"><?php echo esc_html( $waf_mode === 'block' ? 'rejecting threats' : 'monitoring only' ); ?></div>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">
    <div class="madeit-security-col-main">

    <!-- ══ CONFIGURATION ════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Configuration</h2>
        </div>
        <div class="madeit-security-form-body">
            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable WAF</strong>
                    <p class="madeit-security-desc">Inspect incoming requests and match malicious patterns. Logged-in administrators always bypass WAF on admin pages. Runs at WordPress init with priority 0.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_waf_enabled"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( $waf_enabled ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Response Mode</label>
                <select name="madeit_security_waf_mode" class="madeit-security-input madeit-security-setting-input" style="max-width:360px">
                    <option value="block"  <?php selected( $waf_mode, 'block' ); ?>>Block — Immediately reject with HTTP error</option>
                    <option value="log"    <?php selected( $waf_mode, 'log' ); ?>>Log Only — Record matches without blocking</option>
                    <option value="tarpit" <?php selected( $waf_mode, 'tarpit' ); ?>>Tarpit — Slow response to waste attacker time</option>
                </select>
                <p class="madeit-security-desc">Use "Log Only" when first enabling the WAF to identify false positives before enforcing blocks.</p>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Block Response Code</label>
                <select name="madeit_security_block_response_code" class="madeit-security-input madeit-security-setting-input" style="max-width:360px">
                    <option value="403" <?php selected( $resp_code, 403 ); ?>>403 Forbidden (standard)</option>
                    <option value="406" <?php selected( $resp_code, 406 ); ?>>406 Not Acceptable</option>
                    <option value="444" <?php selected( $resp_code, 444 ); ?>>444 No Response (drop connection)</option>
                    <option value="503" <?php selected( $resp_code, 503 ); ?>>503 Service Unavailable</option>
                </select>
                <p class="madeit-security-desc">HTTP status code returned when a request is blocked. 403 is the standard choice.</p>
            </div>
        </div>
    </div>

    <!-- ══ AUTO-BLOCKING ════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Auto-Blocking</h2>
        </div>
        <div class="madeit-security-form-body">
            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Auto-Block Attackers</strong>
                    <p class="madeit-security-desc">Automatically block IP addresses that trigger high-severity rules (severity 8+). Blocked IPs are added to the block list.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_waf_autoblock"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( $autoblock ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Auto-Block Duration (seconds)</label>
                <input type="number"
                       name="madeit_security_auto_block_duration"
                       class="madeit-security-input madeit-security-setting-input"
                       value="<?php echo esc_attr( $block_dur ); ?>"
                       min="60"
                       max="2592000"
                       style="max-width:200px" />
                <p class="madeit-security-desc">
                    How long auto-blocked IPs stay banned.
                    Common values: 3600 (1h), 86400 (24h), 604800 (7d).
                    Current: <strong><?php
                    if ( $block_dur >= 86400 ) echo esc_html( round( $block_dur / 86400, 1 ) . ' day(s)' );
                    elseif ( $block_dur >= 3600 ) echo esc_html( round( $block_dur / 3600, 1 ) . ' hour(s)' );
                    else echo esc_html( $block_dur . ' seconds' );
                    ?></strong>
                </p>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Whitelist Logged-In Users</strong>
                    <p class="madeit-security-desc">Skip WAF inspection for all logged-in users during AJAX requests. Admin users on safe content-editing paths are always whitelisted.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_waf_whitelist_logged_in"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( $wl_logged_in ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>
        </div>
    </div>

    <!-- ══ RULE SET ═════════════════════════════════════════════════════ -->
    <div class="madeit-security-panel" id="waf-rules-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Rule Set — <?php echo esc_html( $total_rules ); ?> Rules</h2>
            <div class="madeit-security-panel__actions">
                <button type="button" class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost" id="btn-waf-expand-all">Expand All</button>
                <button type="button" class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost" id="btn-waf-collapse-all">Collapse All</button>
            </div>
        </div>
        <div style="padding:0">
            <?php foreach ( $cats as $cat_id => $cat ) :
                if ( empty( $cat['rules'] ) ) continue;
                $cat_count    = count( $cat['rules'] );
                $cat_disabled = 0;
                foreach ( $cat['rules'] as $r ) {
                    if ( in_array( $r['id'], $disabled, true ) ) $cat_disabled++;
                }
            ?>
            <div class="madeit-security-waf-category" data-cat="<?php echo esc_attr( $cat_id ); ?>">
                <button type="button" class="madeit-security-waf-category__header" aria-expanded="false">
                    <span class="madeit-security-waf-category__icon"><?php echo esc_html( $cat['icon'] ); ?></span>
                    <span class="madeit-security-waf-category__label"><?php echo esc_html( $cat['label'] ); ?></span>
                    <span class="madeit-security-badge madeit-security-badge--gray"><?php echo esc_html( $cat_count ); ?> rules</span>
                    <?php if ( $cat_disabled > 0 ) : ?>
                        <span class="madeit-security-badge madeit-security-badge--orange"><?php echo esc_html( $cat_disabled ); ?> disabled</span>
                    <?php endif; ?>
                    <span class="madeit-security-waf-category__chevron">&#8250;</span>
                </button>
                <div class="madeit-security-waf-category__body" style="display:none">
                    <table class="madeit-security-table madeit-security-waf-rules-table">
                        <thead>
                            <tr>
                                <th style="width:50px">On</th>
                                <th>Rule</th>
                                <th style="width:80px">Severity</th>
                                <th style="width:90px">Inspects</th>
                                <th style="width:100px">Hits (7d)</th>
                            </tr>
                        </thead>
                        <tbody>
                        <?php foreach ( $cat['rules'] as $rule ) :
                            $is_disabled = in_array( $rule['id'], $disabled, true );
                            $hit_info    = $hits_by_rule[ $rule['id'] ] ?? null;
                            $fields_str  = implode( ', ', $rule['fields'] );
                        ?>
                            <tr class="<?php echo esc_attr( $is_disabled ? 'madeit-security-waf-rule--disabled' : '' ); ?>">
                                <td>
                                    <label class="madeit-security-toggle" style="margin:0">
                                        <input type="checkbox"
                                               class="madeit-security-waf-rule-toggle"
                                               data-rule="<?php echo esc_attr( $rule['id'] ); ?>"
                                               <?php checked( ! $is_disabled ); ?> />
                                        <span class="madeit-security-toggle__slider"></span>
                                    </label>
                                </td>
                                <td>
                                    <div style="font-weight:600;color:var(--c-text);font-size:12.5px;margin-bottom:2px"><?php echo esc_html( $rule['name'] ); ?></div>
                                    <code style="font-size:10.5px;color:var(--c-text-4);font-family:var(--mono)"><?php echo esc_html( $rule['id'] ); ?></code>
                                </td>
                                <td><?php echo madeit_security_sev_badge( $rule['sev'] ); // phpcs:ignore WordPress.Security.EscapeOutput -- returns hardcoded HTML badges ?></td>
                                <td><span style="font-size:11px;color:var(--c-text-3);font-family:var(--mono)"><?php echo esc_html( $fields_str ); ?></span></td>
                                <td>
                                    <?php if ( $hit_info ) : ?>
                                        <span style="font-weight:600;color:var(--c-red-text);font-variant-numeric:tabular-nums"><?php echo esc_html( number_format( (int) $hit_info->hits ) ); ?></span>
                                        <br><span style="font-size:10px;color:var(--c-text-4)">last: <?php echo esc_html( human_time_diff( strtotime( $hit_info->last_hit ) ) ); ?> ago</span>
                                    <?php else : ?>
                                        <span style="color:var(--c-text-4)">0</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    </div><!-- /col-main -->

    <!-- SIDEBAR -->
    <div class="madeit-security-col-side">

        <!-- ══ SAVE SETTINGS ════════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Save Settings</h2></div>
            <div class="madeit-security-form-body">
                <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--full" id="btn-save-waf-settings">💾 Save WAF Settings</button>
                <div id="waf-settings-result" class="madeit-security-form-result" style="display:none;margin-top:10px"></div>
            </div>
        </div>

        <!-- ══ TOP TRIGGERED RULES ══════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">Top Triggered (7d)</h2>
            </div>
            <div style="padding:0">
                <?php if ( empty( $top ) ) : ?>
                    <div class="madeit-security-empty-panel">No WAF triggers in the last 7 days.</div>
                <?php else : ?>
                    <?php foreach ( array_slice( $top, 0, 8 ) as $row ) :
                        $rule_name = $row->rule_id;
                        foreach ( $rules as $r ) {
                            if ( $r['id'] === $row->rule_id ) { $rule_name = $r['name']; break; }
                        }
                    ?>
                    <div class="madeit-security-ip-list__item">
                        <div style="flex:1;min-width:0">
                            <div style="font-size:12px;font-weight:600;color:var(--c-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><?php echo esc_html( $rule_name ); ?></div>
                            <div style="font-size:10.5px;color:var(--c-text-4);font-family:var(--mono)"><?php echo esc_html( human_time_diff( strtotime( $row->last_hit ) ) ); ?> ago</div>
                        </div>
                        <span class="madeit-security-ip-list__count" style="color:var(--c-red-text);font-weight:700"><?php echo esc_html( number_format( (int) $row->hits ) ); ?></span>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

        <!-- ══ HOW IT WORKS ═════════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">How It Works</h2></div>
            <div class="madeit-security-form-body">
                <ul style="margin:0;padding-left:18px;font-size:.85rem;color:var(--c-text-3);line-height:1.65">
                    <li>WAF hooks into <code>init</code> at priority <strong>0</strong> — before most plugins</li>
                    <li>All request fields are <strong>double-decoded</strong> to catch encoding bypasses</li>
                    <li><strong>Logged-in admins</strong> bypass WAF on all admin pages — no self-lockout risk</li>
                    <li>Whitelisted IPs are automatically skipped</li>
                    <li>High-severity matches (8+) trigger <strong>auto-blocking</strong> when enabled</li>
                    <li>Starts in <strong>Log Only</strong> mode — switch to Block after reviewing for false positives</li>
                    <li>Individual rules can be toggled without affecting the rest</li>
                </ul>
            </div>
        </div>

        <!-- ══ INSPECTED FIELDS ═════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Inspected Fields</h2></div>
            <div class="madeit-security-form-body">
                <table style="width:100%;font-size:12px;border-collapse:collapse">
                    <tr style="border-bottom:1px solid var(--c-border)">
                        <td style="padding:6px 0;color:var(--c-text-3);width:70px"><code>get</code></td>
                        <td style="padding:6px 0">GET query parameters</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--c-border)">
                        <td style="padding:6px 0;color:var(--c-text-3)"><code>post</code></td>
                        <td style="padding:6px 0">POST form data + JSON body</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--c-border)">
                        <td style="padding:6px 0;color:var(--c-text-3)"><code>cookie</code></td>
                        <td style="padding:6px 0">All cookies</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--c-border)">
                        <td style="padding:6px 0;color:var(--c-text-3)"><code>path</code></td>
                        <td style="padding:6px 0">URL path (before query string)</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--c-border)">
                        <td style="padding:6px 0;color:var(--c-text-3)"><code>ua</code></td>
                        <td style="padding:6px 0">User-Agent header</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--c-border)">
                        <td style="padding:6px 0;color:var(--c-text-3)"><code>referer</code></td>
                        <td style="padding:6px 0">Referer header</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0;color:var(--c-text-3)"><code>body</code></td>
                        <td style="padding:6px 0">Raw request body (first 8KB)</td>
                    </tr>
                </table>
            </div>
        </div>

    </div>

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

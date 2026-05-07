<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;
$my_ip    = \MadeIT\Security\Whitelist::my_ip();
$wl_items = \MadeIT\Security\Whitelist::get_all();
$is_my_ip_whitelisted = false;
foreach ( $wl_items as $w ) {
    if ( $w->value === $my_ip ) { $is_my_ip_whitelisted = true; break; }
}
?>

    <!-- PAGE HEADER -->
    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">✅</span>
            <div>
                <h1 class="madeit-security-page-title">IP Whitelist</h1>
                <p class="madeit-security-page-sub">Whitelisted IPs bypass <strong>all</strong> security checks — WAF, rate limiting, brute-force lockouts, and IP blocks.</p>
            </div>
        </div>
    </div>

    <!-- CONTENT AREA -->
    <div class="madeit-security-page-content">

    <!-- MY IP BANNER -->
    <div class="madeit-security-my-ip-banner <?php echo $is_my_ip_whitelisted ? 'madeit-security-my-ip-banner--safe' : 'madeit-security-my-ip-banner--warn'; ?>">
        <div class="madeit-security-my-ip-banner__left">
            <span class="madeit-security-my-ip-banner__icon"><?php echo $is_my_ip_whitelisted ? '✅' : '⚠️'; ?></span>
            <div>
                <strong>Your current IP:</strong>
                <code class="madeit-security-ip-code"><?php echo esc_html( $my_ip ); ?></code>
                <?php if ( $is_my_ip_whitelisted ) : ?>
                    <span class="madeit-security-badge madeit-security-badge--green" style="margin-left:8px">Whitelisted — you will never be locked out</span>
                <?php else : ?>
                    <span class="madeit-security-badge madeit-security-badge--orange" style="margin-left:8px">Not whitelisted — you could be locked out by security rules</span>
                <?php endif; ?>
            </div>
        </div>
        <?php if ( ! $is_my_ip_whitelisted ) : ?>
            <button class="madeit-security-btn madeit-security-btn--primary" id="btn-whitelist-my-ip">
                ✅ Whitelist My IP Now
            </button>
        <?php else : ?>
            <span class="madeit-security-text-safe">🔒 You're protected from lockouts</span>
        <?php endif; ?>
    </div>

    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">

        <!-- WHITELIST TABLE -->
        <div class="madeit-security-col-main">
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">
                        Whitelisted IPs
                        <span class="madeit-security-badge madeit-security-badge--green" id="wl-count-badge"><?php echo count( $wl_items ); ?></span>
                    </h2>
                    <div class="madeit-security-panel__actions">
                        <input type="text" id="wl-search" class="madeit-security-search-input" placeholder="Filter by IP or label…" style="width:200px" />
                    </div>
                </div>

                <div class="madeit-security-table-wrapper">
                    <table class="madeit-security-table" id="whitelist-table">
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>Label / Note</th>
                                <th>Added</th>
                                <th>Added By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="whitelist-tbody">
                            <?php if ( empty( $wl_items ) ) : ?>
                                <tr id="wl-empty-row">
                                    <td colspan="5" class="madeit-security-empty-cell">
                                        No whitelisted IPs yet. Add your admin IP above to prevent lockouts.
                                    </td>
                                </tr>
                            <?php else : ?>
                                <?php foreach ( $wl_items as $w ) :
                                    $added_by = $w->created_by ? get_userdata( $w->created_by ) : null;
                                    $is_me    = ( $w->value === $my_ip );
                                ?>
                                    <tr class="wl-row" data-ip="<?php echo esc_attr( $w->value ); ?>" data-label="<?php echo esc_attr( strtolower( $w->label ) ); ?>">
                                        <td>
                                            <code class="madeit-security-ip-code"><?php echo esc_html( $w->value ); ?></code>
                                            <?php if ( $is_me ) : ?>
                                                <span class="madeit-security-badge madeit-security-badge--blue" style="margin-left:6px">You</span>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <span class="wl-label-text" data-id="<?php echo esc_attr( $w->id ); ?>">
                                                <?php echo $w->label ? esc_html( $w->label ) : '<em style="color:#aaa">No label</em>'; ?>
                                            </span>
                                        </td>
                                        <td class="madeit-security-date-text"><?php echo esc_html( wp_date( 'M j, Y H:i', strtotime( $w->created_at ) ) ); ?></td>
                                        <td><?php echo $added_by ? esc_html( $added_by->display_name ) : '<em style="color:#aaa">System</em>'; ?></td>
                                        <td>
                                            <?php if ( $is_me ) : ?>
                                                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-remove-wl-btn" data-id="<?php echo esc_attr( $w->id ); ?>" data-ip="<?php echo esc_attr( $w->value ); ?>" style="border-color:#c0392b;color:#c0392b">
                                                    ⚠ Remove (locks you out!)
                                                </button>
                                            <?php else : ?>
                                                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-remove-wl-btn" data-id="<?php echo esc_attr( $w->id ); ?>" data-ip="<?php echo esc_attr( $w->value ); ?>">
                                                    ✕ Remove
                                                </button>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <!-- What whitelist bypass means -->
                <div class="madeit-security-wl-info-bar">
                    <span class="madeit-security-wl-info-item">✅ Bypasses WAF rules</span>
                    <span class="madeit-security-wl-info-item">✅ Bypasses rate limiting</span>
                    <span class="madeit-security-wl-info-item">✅ Bypasses brute-force lockout</span>
                    <span class="madeit-security-wl-info-item">✅ Bypasses IP block list</span>
                    <span class="madeit-security-wl-info-item">✅ Bypasses bot detection</span>
                </div>
            </div>
        </div>

        <!-- SIDEBAR: Add IP Form -->
        <div class="madeit-security-col-side">

            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Add IP to Whitelist</h2>
                </div>
                <div class="madeit-security-form-body">

                    <!-- Quick: my IP -->
                    <div class="madeit-security-my-ip-quick">
                        <p class="madeit-security-label">Your IP</p>
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                            <code class="madeit-security-ip-code"><?php echo esc_html( $my_ip ); ?></code>
                            <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--primary" id="btn-quick-whitelist-my-ip"
                                <?php echo $is_my_ip_whitelisted ? 'disabled' : ''; ?>>
                                <?php echo $is_my_ip_whitelisted ? '✅ Already safe' : '+ Add mine'; ?>
                            </button>
                        </div>
                        <p class="madeit-security-desc">Always add your own IP first to prevent accidental lockouts.</p>
                    </div>

                    <hr class="madeit-security-divider" />

                    <!-- Manual add -->
                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">IP Address <span style="color:#c0392b">*</span></label>
                        <input type="text" id="wl-add-ip" class="madeit-security-input" placeholder="e.g. 203.0.113.42" autocomplete="off" />
                    </div>
                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">Label / Note</label>
                        <input type="text" id="wl-add-label" class="madeit-security-input" placeholder="e.g. Office IP, Monitoring server…" />
                    </div>

                    <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--full" id="btn-add-to-whitelist">
                        ✅ Add to Whitelist
                    </button>
                    <div id="wl-add-result" class="madeit-security-form-result" style="display:none;"></div>
                </div>
            </div>

            <!-- Common use cases -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">When to Whitelist</h2>
                </div>
                <div class="madeit-security-form-body" style="padding:12px 20px;">
                    <ul class="madeit-security-wl-tips">
                        <li>🏢 <strong>Your office IP</strong> — prevent admin lockouts</li>
                        <li>🔍 <strong>SEO crawlers</strong> — Screaming Frog, Ahrefs</li>
                        <li>📈 <strong>Uptime monitors</strong> — UptimeRobot, Pingdom</li>
                        <li>🚀 <strong>Deployment servers</strong> — CI/CD pipelines</li>
                        <li>💳 <strong>Payment gateways</strong> — IPs calling your webhooks</li>
                        <li>🔒 <strong>Security scanners</strong> — your own pen-test tool</li>
                    </ul>
                    <div class="madeit-security-notice madeit-security-notice--info" style="margin-top:12px;font-size:.8rem;">
                        ⚠️ Only whitelist IPs you fully trust. Whitelisted IPs have <strong>zero</strong> security restrictions.
                    </div>
                </div>
            </div>

        </div>
    </div>

    </div><!-- /.madeit-security-page-content -->

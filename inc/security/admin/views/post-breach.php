<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

use MadeIT\Security\modules\PostBreach;

$lockdown_active   = (bool) \MadeIT\Security\Settings::get( 'madeit_security_lockdown_active' );
$actions           = PostBreach::get_action_definitions();
$plugins_backed_up = (bool) \MadeIT\Security\Settings::get( 'madeit_security_disabled_plugins_backup' );
$keys_rotated_at   = \MadeIT\Security\Settings::get( 'madeit_security_keys_rotated_at', null );
$last_report       = \MadeIT\Security\Settings::get( 'madeit_security_last_report', [] );
$admin_count       = count( get_users( [ 'role' => 'administrator', 'fields' => 'ID' ] ) );

global $wpdb;
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
$waf_blocks  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_blocked_ips" );
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
$blocked_ips = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_blocked_ips WHERE permanent = 1 OR blocked_until IS NULL OR blocked_until > %s", current_time( 'mysql' ) ) );
?>

    <!-- ── THREAT STATUS STRIP ─────────────────────────────────────────── -->
    <div class="aw-breach-threat-strip <?php echo $lockdown_active ? 'aw-breach-threat-strip--critical' : 'aw-breach-threat-strip--clear'; ?>">
        <div class="aw-breach-threat-strip__left">
            <?php if ( $lockdown_active ) : ?>
                <span class="madeit-security-pulse" style="background:#fff"></span>
                <span>⚠ SITE LOCKDOWN ACTIVE — Visitor access blocked</span>
            <?php else : ?>
                <span class="madeit-security-pulse"></span>
                <span>System operational — No active lockdown</span>
            <?php endif; ?>
        </div>
        <div class="aw-breach-threat-strip__right">
            <div class="aw-breach-strip-stat">
                <span style="opacity:.7">Admins:</span>
                <strong><?php echo esc_html( $admin_count ); ?></strong>
            </div>
            <div class="aw-breach-strip-stat">
                <span style="opacity:.7">Blocked IPs:</span>
                <strong><?php echo esc_html( $blocked_ips ); ?></strong>
            </div>
            <?php if ( $keys_rotated_at ) : ?>
            <div class="aw-breach-strip-stat">
                <span style="opacity:.7">Keys Rotated:</span>
                <strong><?php echo esc_html( human_time_diff( $keys_rotated_at, time() ) . ' ago' ); ?></strong>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- ── HERO ───────────────────────────────────────────────────────── -->
    <div class="aw-breach-hero">
        <div class="aw-breach-hero__inner">
            <div>
                <h1 class="aw-breach-hero__title">Post-Breach Command Center</h1>
                <p class="aw-breach-hero__sub">
                    Structured incident response toolkit. Execute containment, cleanup, and recovery actions below.
                    Every action is logged to the audit trail.
                </p>
                <div class="aw-breach-hero__pills">
                    <span class="aw-breach-hero-pill aw-breach-hero-pill--blue">
                        <span>🛡️</span> <?php echo esc_html( $admin_count ); ?> Admin <?php echo $admin_count === 1 ? 'Account' : 'Accounts'; ?>
                    </span>
                    <span class="aw-breach-hero-pill aw-breach-hero-pill--<?php echo $blocked_ips > 0 ? 'red' : 'green'; ?>">
                        <span>🚫</span> <?php echo esc_html( $blocked_ips ); ?> Blocked IPs
                    </span>
                    <?php if ( $keys_rotated_at ) : ?>
                    <span class="aw-breach-hero-pill aw-breach-hero-pill--green">
                        <span>🔑</span> Keys Rotated
                    </span>
                    <?php else : ?>
                    <span class="aw-breach-hero-pill aw-breach-hero-pill--amber">
                        <span>🔑</span> Keys Not Rotated
                    </span>
                    <?php endif; ?>
                    <?php if ( $lockdown_active ) : ?>
                    <span class="aw-breach-hero-pill aw-breach-hero-pill--red">
                        <span class="madeit-security-pulse madeit-security-pulse--sm" style="background:var(--aw-red-l)"></span>
                        Lockdown Active
                    </span>
                    <?php endif; ?>
                </div>
            </div>

        </div>
    </div>

    <!-- ── CONTENT AREA ────────────────────────────────────────────────── -->
    <div class="madeit-security-page-content">

    <!-- ── RESPONSE ORDER GUIDE ────────────────────────────────────────── -->
    <div>
        <div class="madeit-security-breach-guide">
            <div class="madeit-security-breach-guide__title">📋 Recommended Response Order</div>
            <div class="madeit-security-breach-guide__steps">
                <?php
                $steps = [
                    'Audit Admins', 'Terminate Sessions', 'Rotate Keys', 'Lockdown Site',
                    'Scan Database', 'Reinstall Files', 'Force Password Reset', 'Generate Report'
                ];
                foreach ( $steps as $i => $step ) : ?>
                    <div class="madeit-security-breach-step" id="guide-step-<?php echo esc_attr( $i + 1 ); ?>">
                        <span class="madeit-security-breach-step__num"><?php echo esc_html( $i + 1 ); ?></span>
                        <span><?php echo esc_html( $step ); ?></span>
                    </div>
                    <?php if ( $i < count($steps)-1 ) : ?>
                        <span class="madeit-security-breach-step__arrow">›</span>
                    <?php endif;
                endforeach; ?>
            </div>
        </div>
    </div>

    <!-- ── GLOBAL RESULT BANNER ────────────────────────────────────────── -->
    <div id="breach-result-banner" class="madeit-security-breach-result" style="display:none; margin-top: 16px;"></div>

    <?php if ( $plugins_backed_up ) : ?>
    <div style="padding-top: 12px;">
        <div class="madeit-security-notice madeit-security-notice--warn">
            <span>📦</span>
            <div>
                <strong>Plugin deactivation backup found.</strong>
                Plugins were previously disabled by Security.
                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--amber madeit-security-breach-action-btn"
                        data-action="restore_plugins"
                        data-confirm="Re-enable all previously deactivated plugins?"
                        style="margin-left:12px">
                    Restore All Plugins
                </button>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- ── ACTION CARDS GRID ───────────────────────────────────────────── -->
    <?php
    // Group actions by severity
    $grouped = [ 'critical' => [], 'high' => [], 'medium' => [], 'low' => [] ];
    foreach ( $actions as $action ) {
        $is_lockdown = $action['id'] === 'lockdown_site';
        $is_unlock   = $action['id'] === 'unlock_site';
        if ( $is_lockdown && $lockdown_active )  continue;
        if ( $is_unlock  && ! $lockdown_active ) continue;
        $sev = $action['severity'] ?? 'low';
        if ( ! isset( $grouped[$sev] ) ) $sev = 'low';
        $grouped[$sev][] = $action;
    }

    $section_labels = [
        'critical' => [ 'label' => '⚠ Critical Actions', 'sub' => 'Execute these first' ],
        'high'     => [ 'label' => '🔶 High Priority',   'sub' => '' ],
        'medium'   => [ 'label' => '🔷 Medium Priority', 'sub' => '' ],
        'low'      => [ 'label' => '⬜ Standard Actions', 'sub' => '' ],
    ];
    foreach ( $grouped as $sev => $acts ) :
        if ( empty( $acts ) ) continue;
        $sinfo = $section_labels[$sev];
    ?>
    <div class="aw-grid-section">
        <h2><?php echo wp_kses( $sinfo['label'], [] ); ?><?php if($sinfo['sub']): ?> <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:.7rem;color:var(--aw-text-muted)"><?php echo esc_html($sinfo['sub']);?></span><?php endif; ?></h2>
    </div>
    <div class="madeit-security-breach-grid">
        <?php foreach ( $acts as $action ) :
            $btn_class = in_array( $action['severity'], ['critical','high'], true ) ? 'madeit-security-btn--danger' : 'madeit-security-btn--primary';
        ?>
        <div class="madeit-security-breach-card madeit-security-breach-card--<?php echo esc_attr($action['severity']); ?>"
             id="breach-card-<?php echo esc_attr($action['id']); ?>">
            <div class="madeit-security-breach-card__header">
                <div class="madeit-security-breach-card__icon"><?php echo esc_html( $action['icon'] ); ?></div>
                <div>
                    <h3 class="madeit-security-breach-card__title"><?php echo esc_html($action['title']); ?></h3>
                    <span class="madeit-security-badge madeit-security-badge--<?php echo esc_attr( match($action['severity']){ 'critical'=>'red','high'=>'orange','medium'=>'blue',default=>'gray' } ); ?>">
                        <?php echo esc_html( strtoupper($action['severity']) ); ?>
                    </span>
                </div>
            </div>
            <p class="madeit-security-breach-card__desc"><?php echo esc_html($action['desc']); ?></p>
            <div class="madeit-security-breach-card__footer">
                <button class="madeit-security-btn madeit-security-btn--sm <?php echo esc_attr( $btn_class ); ?> madeit-security-breach-action-btn"
                        data-action="<?php echo esc_attr($action['id']); ?>"
                        data-confirm="<?php echo esc_attr($action['confirm'] ?? ''); ?>">
                    <?php echo esc_html($action['btn']); ?>
                </button>
                <div class="madeit-security-breach-card__result"
                     id="result-<?php echo esc_attr($action['id']); ?>"
                     style="display:none"></div>
            </div>
        </div>
        <?php endforeach; ?>

        <?php if ( $sev === 'critical' ) : ?>
        <!-- Lockdown Status Widget — inside critical actions grid -->
        <div class="aw-lockdown-widget <?php echo $lockdown_active ? 'aw-lockdown-widget--active' : ''; ?>">
            <span class="aw-lockdown-widget__icon"><?php echo $lockdown_active ? '🔴' : '🟢'; ?></span>
            <div class="aw-lockdown-widget__status <?php echo $lockdown_active ? 'aw-lockdown-widget__status--active' : 'aw-lockdown-widget__status--inactive'; ?>">
                <?php echo $lockdown_active ? 'Lockdown Active' : 'Site Online'; ?>
            </div>
            <p class="aw-lockdown-widget__desc">
                <?php if ( $lockdown_active ) : ?>
                    All non-admin visitors are being blocked. Lift lockdown when cleanup is complete.
                <?php else : ?>
                    Site is publicly accessible. Enable lockdown to block all visitors during incident response.
                <?php endif; ?>
            </p>
            <?php if ( $lockdown_active ) : ?>
                <button class="madeit-security-btn madeit-security-btn--success aw-lockdown-widget__btn madeit-security-breach-action-btn"
                        data-action="unlock_site"
                        data-confirm="Lift lockdown and restore public access?">
                    ✓ Lift Lockdown
                </button>
            <?php else : ?>
                <button class="madeit-security-btn madeit-security-btn--danger aw-lockdown-widget__btn madeit-security-breach-action-btn"
                        data-action="lockdown_site"
                        data-confirm="Enable lockdown? Visitors will be blocked until you lift it.">
                    🔒 Enable Lockdown
                </button>
            <?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
    <?php endforeach; ?>

    <!-- ── RESULT PANELS (shown after actions run) ─────────────────────── -->
    <div id="breach-details-area" style="display:none;">
        <div class="aw-full-area">

            <!-- Admin audit -->
            <div class="aw-result-panel" id="admin-audit-panel" style="display:none">
                <div class="aw-result-panel__header">
                    <span>👤</span>
                    <h2 class="aw-result-panel__title">Admin Account Audit Results</h2>
                </div>
                <div class="aw-result-panel__body" id="admin-audit-body"></div>
            </div>

            <!-- DB Scan -->
            <div class="aw-result-panel" id="db-scan-panel" style="display:none">
                <div class="aw-result-panel__header">
                    <span>🔍</span>
                    <h2 class="aw-result-panel__title">Database Scan Results</h2>
                </div>
                <div class="aw-result-panel__body" id="db-scan-body"></div>
            </div>

            <!-- New keys -->
            <div class="aw-result-panel" id="keys-panel" style="display:none">
                <div class="aw-result-panel__header">
                    <span>🔑</span>
                    <h2 class="aw-result-panel__title">New Secret Keys — Add to wp-config.php</h2>
                </div>
                <div class="aw-result-panel__body">
                    <p class="madeit-security-desc">Replace the existing <code>define('AUTH_KEY', ...)</code> lines in your wp-config.php with these new values.</p>
                    <textarea id="keys-snippet" class="madeit-security-code-block" readonly rows="10"></textarea>
                    <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost aw-mt-8" id="btn-copy-keys">📋 Copy Keys</button>
                </div>
            </div>

            <!-- Plugin reinstall -->
            <div class="aw-result-panel" id="reinstall-panel" style="display:none">
                <div class="aw-result-panel__header">
                    <span>🔄</span>
                    <h2 class="aw-result-panel__title">Plugin Reinstall Results</h2>
                </div>
                <div class="aw-result-panel__body" id="reinstall-body"></div>
            </div>

            <!-- Incident report -->
            <div class="aw-result-panel" id="report-panel" style="display:none">
                <div class="aw-result-panel__header">
                    <span>📄</span>
                    <h2 class="aw-result-panel__title">Incident Report Ready</h2>
                </div>
                <div class="aw-result-panel__body">
                    <p class="madeit-security-desc">Your incident report has been compiled. Download it and share with your hosting provider or security team.</p>
                    <button class="madeit-security-btn madeit-security-btn--primary" id="btn-download-report">⬇ Download JSON Report</button>
                </div>
            </div>

        </div>
    </div>

    </div><!-- /.madeit-security-page-content -->

<!-- Block IP Modal (shared) -->
<div id="madeit-security-block-modal" style="display:none" class="madeit-security-modal-overlay">
    <div class="madeit-security-modal madeit-security-modal--sm">
        <div class="madeit-security-modal__header">
            <h2 class="madeit-security-modal__title">Block IP: <span id="block-modal-ip"></span></h2>
            <button class="madeit-security-modal__close madeit-security-block-modal-close">✕</button>
        </div>
        <div class="madeit-security-modal__body">
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Reason</label>
                <input type="text" id="block-reason-input" class="madeit-security-input" value="Manually blocked" />
            </div>
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Duration</label>
                <select id="block-duration-select" class="madeit-security-input">
                    <option value="0">Permanent</option>
                    <option value="3600">1 hour</option>
                    <option value="86400">24 hours</option>
                    <option value="604800">7 days</option>
                    <option value="2592000">30 days</option>
                </select>
            </div>
        </div>
        <div class="madeit-security-modal__footer">
            <button class="madeit-security-btn madeit-security-btn--danger" id="confirm-block-btn">🚫 Block IP</button>
            <button class="madeit-security-btn madeit-security-btn--ghost madeit-security-block-modal-close">Cancel</button>
        </div>
    </div>
</div>

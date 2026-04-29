<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

use MadeIT\Security\modules\CronGuard;

$health     = CronGuard::get_cron_health();
$summary    = CronGuard::get_cron_summary();
$suspicious = CronGuard::get_suspicious_crons();
$commands   = CronGuard::get_system_cron_command();
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">&#x23F0;</span>
            <div>
                <h1 class="madeit-security-page-title">Cron Guard</h1>
                <p class="madeit-security-page-sub">wp-cron monitoring, abuse detection, and system cron migration</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">
    <div class="madeit-security-col-main">

    <!-- ══ CRON HEALTH STATUS ══════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Cron Health Status</h2>
            <?php if ( $health['has_overdue'] ) : ?>
                <span class="madeit-security-badge madeit-security-badge--orange">Overdue events detected</span>
            <?php else : ?>
                <span class="madeit-security-badge madeit-security-badge--green">Healthy</span>
            <?php endif; ?>
        </div>
        <div class="madeit-security-form-body">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:16px; padding:4px 0;">

                <div style="text-align:center; padding:12px; background:#f7fafc; border-radius:8px;">
                    <div style="font-size:.72rem; color:#718096; text-transform:uppercase; margin-bottom:4px;">DISABLE_WP_CRON</div>
                    <?php if ( $health['disable_wp_cron'] ) : ?>
                        <span class="madeit-security-badge madeit-security-badge--green">Yes (defined)</span>
                    <?php else : ?>
                        <span class="madeit-security-badge madeit-security-badge--orange">No (not set)</span>
                    <?php endif; ?>
                </div>

                <div style="text-align:center; padding:12px; background:#f7fafc; border-radius:8px;">
                    <div style="font-size:.72rem; color:#718096; text-transform:uppercase; margin-bottom:4px;">Total Events</div>
                    <div style="font-size:1.5rem; font-weight:800; color:#2d3748;"><?php echo esc_html( $health['total_events'] ); ?></div>
                </div>

                <div style="text-align:center; padding:12px; background:#f7fafc; border-radius:8px;">
                    <div style="font-size:.72rem; color:#718096; text-transform:uppercase; margin-bottom:4px;">Next Event</div>
                    <div style="font-size:.9rem; font-weight:600; color:#2d3748;">
                        <?php if ( $health['next_event_time'] ) : ?>
                            <?php echo esc_html( wp_date( 'M j, H:i:s', $health['next_event_time'] ) ); ?>
                        <?php else : ?>
                            <span style="color:#a0aec0;">None</span>
                        <?php endif; ?>
                    </div>
                </div>

                <div style="text-align:center; padding:12px; background:<?php echo $health['overdue_count'] > 0 ? '#fff5f5' : '#f7fafc'; ?>; border-radius:8px;">
                    <div style="font-size:.72rem; color:#718096; text-transform:uppercase; margin-bottom:4px;">Overdue Events</div>
                    <?php if ( $health['overdue_count'] > 0 ) : ?>
                        <span class="madeit-security-badge madeit-security-badge--red"><?php echo esc_html( $health['overdue_count'] ); ?> overdue</span>
                    <?php else : ?>
                        <span class="madeit-security-badge madeit-security-badge--green">0</span>
                    <?php endif; ?>
                </div>

                <div style="text-align:center; padding:12px; background:#f7fafc; border-radius:8px;">
                    <div style="font-size:.72rem; color:#718096; text-transform:uppercase; margin-bottom:4px;">Cron Status</div>
                    <?php if ( $health['cron_running'] ) : ?>
                        <span class="madeit-security-badge madeit-security-badge--green">Running</span>
                    <?php else : ?>
                        <span class="madeit-security-badge madeit-security-badge--gray">Idle</span>
                    <?php endif; ?>
                </div>

            </div>
        </div>
    </div>

    <!-- ══ SCHEDULED EVENTS ════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Scheduled Events</h2>
            <span class="madeit-security-badge madeit-security-badge--blue"><?php echo esc_html( $summary['total_hooks'] ); ?> hooks / <?php echo esc_html( $summary['total_events'] ); ?> events</span>
        </div>
        <div class="madeit-security-table-wrapper">
            <table class="madeit-security-table" id="cron-events-table">
                <thead>
                    <tr>
                        <th>Hook Name</th>
                        <th>Schedule</th>
                        <th>Next Run</th>
                        <th>Plugin / Source</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $crons        = CronGuard::get_registered_crons();
                    $seen_hooks   = [];
                    $susp_hooks   = array_column( $suspicious, 'hook' );

                    foreach ( $crons as $timestamp => $hooks ) :
                        foreach ( $hooks as $hook => $events ) :
                            if ( isset( $seen_hooks[ $hook ] ) ) {
                                continue;
                            }
                            $seen_hooks[ $hook ] = true;

                            $event        = reset( $events );
                            $schedule     = $event['schedule'] ?? 'single';
                            $is_suspicious = in_array( $hook, $susp_hooks, true );
                            $core_hooks    = CronGuard::get_known_cron_hooks();
                            $is_core       = in_array( $hook, $core_hooks, true );

                            // Detect plugin source from hook prefix
                            $plugin = 'unknown';
                            if ( $is_core || str_starts_with( $hook, 'wp_' ) ) {
                                $plugin = 'wordpress';
                            } elseif ( str_starts_with( $hook, 'madeit_security_' ) ) {
                                $plugin = 'madeit';
                            } elseif ( str_starts_with( $hook, 'wc_' ) || str_starts_with( $hook, 'woocommerce_' ) ) {
                                $plugin = 'woocommerce';
                            } else {
                                $parts = explode( '_', $hook, 2 );
                                if ( count( $parts ) === 2 && strlen( $parts[0] ) >= 2 ) {
                                    $plugin = $parts[0];
                                }
                            }
                    ?>
                    <tr class="<?php echo $is_suspicious ? 'madeit-security-row--warning' : ''; ?>">
                        <td><code><?php echo esc_html( $hook ); ?></code></td>
                        <td><?php echo esc_html( $schedule ); ?></td>
                        <td class="madeit-security-date-text"><?php echo esc_html( wp_date( 'M j, H:i:s', $timestamp ) ); ?></td>
                        <td><?php echo esc_html( $plugin ); ?></td>
                        <td>
                            <?php if ( $is_suspicious ) : ?>
                                <span class="madeit-security-badge madeit-security-badge--orange">&#x26A0; Suspicious</span>
                                <div style="margin-top:6px;">
                                    <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--primary madeit-security-cron-approve-btn"
                                            data-hook="<?php echo esc_attr( $hook ); ?>">Approve</button>
                                    <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger madeit-security-cron-remove-btn"
                                            data-hook="<?php echo esc_attr( $hook ); ?>">Remove</button>
                                </div>
                            <?php elseif ( $is_core ) : ?>
                                <span class="madeit-security-badge madeit-security-badge--green">Core</span>
                            <?php else : ?>
                                <span class="madeit-security-badge madeit-security-badge--gray">Approved</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php
                        endforeach;
                    endforeach;

                    if ( empty( $seen_hooks ) ) : ?>
                        <tr><td colspan="5" class="madeit-security-empty-cell">No scheduled cron events found.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- ══ SUSPICIOUS ACTIVITY ═════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Suspicious Activity</h2>
            <?php if ( ! empty( $suspicious ) ) : ?>
                <span class="madeit-security-badge madeit-security-badge--red"><?php echo count( $suspicious ); ?> found</span>
            <?php endif; ?>
        </div>
        <div class="madeit-security-form-body">
            <?php if ( empty( $suspicious ) ) : ?>
                <div class="madeit-security-notice madeit-security-notice--success">
                    No suspicious cron jobs detected. All registered hooks are either WordPress core or previously approved.
                </div>
            <?php else : ?>
                <?php foreach ( $suspicious as $entry ) : ?>
                    <div class="madeit-security-notice madeit-security-notice--warn" style="margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                            <div>
                                <strong><code><?php echo esc_html( $entry['hook'] ); ?></code></strong>
                                <span class="madeit-security-badge madeit-security-badge--orange" style="margin-left:8px;"><?php echo esc_html( $entry['schedule'] ); ?></span>
                                <ul style="margin:6px 0 0 16px; padding:0; font-size:.82rem; color:#744210;">
                                    <?php foreach ( $entry['reasons'] as $reason ) : ?>
                                        <li><?php echo esc_html( $reason ); ?></li>
                                    <?php endforeach; ?>
                                </ul>
                                <?php if ( $entry['next_run'] ) : ?>
                                    <p class="madeit-security-desc" style="margin-top:4px;">Next run: <?php echo esc_html( wp_date( 'M j, Y H:i:s', $entry['next_run'] ) ); ?></p>
                                <?php endif; ?>
                            </div>
                            <div style="display:flex; gap:6px;">
                                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--primary madeit-security-cron-approve-btn"
                                        data-hook="<?php echo esc_attr( $entry['hook'] ); ?>">Approve</button>
                                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger madeit-security-cron-remove-btn"
                                        data-hook="<?php echo esc_attr( $entry['hook'] ); ?>">Remove</button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    </div><!-- /col-main -->

    <!-- SIDEBAR -->
    <div class="madeit-security-col-side">

        <!-- ── Settings ──────────────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Settings</h2></div>
            <div class="madeit-security-form-body">

                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable Cron Guard</strong>
                        <p class="madeit-security-desc">Monitors wp-cron for abuse and unauthorized jobs</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox"
                               name="madeit_security_cron_guard_enabled"
                               class="madeit-security-setting-input"
                               value="1"
                               <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_cron_guard_enabled', true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>

                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Rate Limit (requests/min)</label>
                    <input type="number"
                           name="madeit_security_cron_rate_limit"
                           class="madeit-security-input madeit-security-input--sm madeit-security-setting-input"
                           value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_cron_rate_limit', 60 ) ); ?>"
                           min="10" max="600" />
                    <p class="madeit-security-desc">Maximum wp-cron.php requests per minute before flood protection triggers a 429 response.</p>
                </div>

                <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--full" style="margin-top:8px;" id="btn-save-cron-settings">Save Settings</button>
                <div id="cron-settings-result" class="madeit-security-form-result" style="display:none; margin-top:10px;"></div>

            </div>
        </div>

        <!-- ── System Cron Migration ─────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">System Cron Migration</h2></div>
            <div class="madeit-security-form-body">

                <div style="margin-bottom:12px;">
                    <strong>DISABLE_WP_CRON:</strong>
                    <?php if ( $health['disable_wp_cron'] ) : ?>
                        <span class="madeit-security-badge madeit-security-badge--green">Defined (true)</span>
                    <?php else : ?>
                        <span class="madeit-security-badge madeit-security-badge--orange">Not set</span>
                    <?php endif; ?>
                </div>

                <?php if ( ! $health['disable_wp_cron'] ) : ?>
                    <div class="madeit-security-notice madeit-security-notice--info" style="margin-bottom:12px;">
                        <strong>Recommendation:</strong> Switch from WordPress virtual cron to a real system cron job for more reliable and performant scheduled task execution. Add <code>define('DISABLE_WP_CRON', true);</code> to your <code>wp-config.php</code> and set up one of the commands below.
                    </div>
                <?php endif; ?>

                <div style="margin-bottom:14px;">
                    <label class="madeit-security-label">wget command</label>
                    <div style="position:relative;">
                        <pre style="background:#1a202c; color:#e2e8f0; padding:12px; border-radius:6px; font-size:.78rem; overflow-x:auto; margin:0; white-space:pre-wrap; word-break:break-all;"><code id="cron-cmd-wget"><?php echo esc_html( $commands['wget'] ); ?></code></pre>
                        <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-copy-btn"
                                data-target="cron-cmd-wget"
                                style="position:absolute; top:6px; right:6px; font-size:.7rem;">Copy</button>
                    </div>
                </div>

                <div style="margin-bottom:14px;">
                    <label class="madeit-security-label">WP-CLI command</label>
                    <div style="position:relative;">
                        <pre style="background:#1a202c; color:#e2e8f0; padding:12px; border-radius:6px; font-size:.78rem; overflow-x:auto; margin:0; white-space:pre-wrap; word-break:break-all;"><code id="cron-cmd-wpcli"><?php echo esc_html( $commands['wp_cli'] ); ?></code></pre>
                        <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-copy-btn"
                                data-target="cron-cmd-wpcli"
                                style="position:absolute; top:6px; right:6px; font-size:.7rem;">Copy</button>
                    </div>
                </div>

                <div class="madeit-security-desc" style="line-height:1.6;">
                    <strong>How to add to system crontab:</strong>
                    <ol style="margin:6px 0 0 16px; padding:0;">
                        <li>SSH into your server</li>
                        <li>Run <code>crontab -e</code> to edit crontab</li>
                        <li>Paste one of the commands above</li>
                        <li>Save and exit the editor</li>
                        <li>Add <code>define('DISABLE_WP_CRON', true);</code> to <code>wp-config.php</code></li>
                    </ol>
                </div>

            </div>
        </div>

    </div>

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

$db_info    = \MadeIT\Security\GeoIP::db_info();
$enabled    = \MadeIT\Security\Settings::bool( 'madeit_security_geoip_enabled', false );
$auto       = \MadeIT\Security\Settings::bool( 'madeit_security_geoip_auto_update', true );
$last_up    = \MadeIT\Security\Settings::string( 'madeit_security_geoip_last_updated', '' );

?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🌍</span>
            <div>
                <h1 class="madeit-security-page-title">GeoIP Database</h1>
                <p class="madeit-security-page-sub">Resolve visitor IP addresses to country codes using a local database</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">
    <div class="madeit-security-col-main">

    <!-- ══ DATABASE STATUS ══════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Database Status</h2>
            <?php if ( $db_info['exists'] && $enabled ) : ?>
                <span class="madeit-security-badge madeit-security-badge--green">Active</span>
            <?php elseif ( $db_info['exists'] ) : ?>
                <span class="madeit-security-badge madeit-security-badge--yellow">Installed (disabled)</span>
            <?php else : ?>
                <span class="madeit-security-badge madeit-security-badge--gray">No Database</span>
            <?php endif; ?>
        </div>
        <div class="madeit-security-form-body">

            <?php if ( $db_info['exists'] ) : ?>
            <table class="madeit-security-info-table" style="width:100%;font-size:.9rem;margin-bottom:16px">
                <tr>
                    <td style="padding:6px 0;color:#64748b;width:140px">Database Type</td>
                    <td style="padding:6px 0;font-weight:600"><?php echo esc_html( $db_info['type'] ); ?></td>
                </tr>
                <tr>
                    <td style="padding:6px 0;color:#64748b">File Size</td>
                    <td style="padding:6px 0;font-weight:600"><?php echo esc_html( $db_info['size_h'] ); ?></td>
                </tr>
                <tr>
                    <td style="padding:6px 0;color:#64748b">Build Date</td>
                    <td style="padding:6px 0;font-weight:600"><?php echo esc_html( $db_info['build'] ?: 'Unknown' ); ?></td>
                </tr>
                <tr>
                    <td style="padding:6px 0;color:#64748b">Last Downloaded</td>
                    <td style="padding:6px 0;font-weight:600"><?php echo esc_html( $last_up ?: 'Never' ); ?></td>
                </tr>
                <tr>
                    <td style="padding:6px 0;color:#64748b">File Modified</td>
                    <td style="padding:6px 0;font-weight:600"><?php echo esc_html( $db_info['modified'] ); ?></td>
                </tr>
            </table>
            <?php else : ?>
            <div class="madeit-security-notice madeit-security-notice--warn" style="margin-bottom:16px">
                No GeoIP database installed. Click <strong>Download Database</strong> to get started.
            </div>
            <?php endif; ?>

            <div style="display:flex;gap:10px;flex-wrap:wrap">
                <button type="button" id="madeit-security-download-geoip" class="madeit-security-btn madeit-security-btn--primary">
                    <?php echo $db_info['exists'] ? '🔄 Update Database' : '⬇️ Download Database'; ?>
                </button>
            </div>
            <div id="madeit-security-geoip-download-result" class="madeit-security-form-result" style="display:none;margin-top:12px"></div>

        </div>
    </div>

    <!-- ══ CONFIGURATION ════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Configuration</h2>
        </div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable GeoIP Lookups</strong>
                    <p class="madeit-security-desc">When enabled, every visitor's IP is resolved to a country code using the local GeoIP database. Country flags appear in the Visitor Log and Dashboard.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_geoip_enabled"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( $enabled ); ?>
                           <?php echo $db_info['exists'] ? '' : 'disabled'; ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Auto-Update Weekly</strong>
                    <p class="madeit-security-desc">Automatically download the latest GeoIP database once per week via WordPress cron. The database is updated every Tuesday.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_geoip_auto_update"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( $auto ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>
        </div>
    </div>

    </div><!-- /col-main -->

    <!-- SIDEBAR -->
    <div class="madeit-security-col-side">

        <!-- ══ TEST LOOKUP ══════════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">Test Lookup</h2>
            </div>
            <div class="madeit-security-form-body">
                <p class="madeit-security-desc" style="margin-bottom:12px">Enter an IP address to test the GeoIP database lookup.</p>

                <div class="madeit-security-form-row">
                    <input type="text"
                           id="madeit-security-geoip-test-ip"
                           class="madeit-security-input"
                           placeholder="e.g. 8.8.8.8"
                           <?php echo $db_info['exists'] ? '' : 'disabled'; ?> />
                </div>

                <button type="button" id="madeit-security-geoip-test-btn" class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--full"
                        <?php echo $db_info['exists'] ? '' : 'disabled'; ?>>
                    🔍 Lookup
                </button>

                <div id="madeit-security-geoip-test-result" style="display:none;margin-top:12px;padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;text-align:center">
                    <span id="madeit-security-geoip-test-flag" style="font-size:2rem;display:block;margin-bottom:4px"></span>
                    <strong id="madeit-security-geoip-test-code" style="font-size:1.1rem"></strong>
                </div>
            </div>
        </div>

        <!-- ══ SAVE SETTINGS ════════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Save Settings</h2></div>
            <div class="madeit-security-form-body">
                <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--full" id="btn-save-geoip-settings">💾 Save GeoIP Settings</button>
                <div id="geoip-settings-result" class="madeit-security-form-result" style="display:none;margin-top:10px"></div>
            </div>
        </div>

        <!-- ══ HOW IT WORKS ═════════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">How It Works</h2></div>
            <div class="madeit-security-form-body">
                <ul style="margin:0;padding-left:18px;font-size:.85rem;color:#4a5568">
                    <li>Database is stored locally — <strong>no external API calls</strong> per request</li>
                    <li>Lookups run in microseconds via binary tree search</li>
                    <li>Reader is lazy-loaded: zero overhead if logging is disabled</li>
                    <li>Country flags appear automatically in the Visitor Log and Dashboard</li>
                    <li>Supports both IPv4 and IPv6 addresses</li>
                </ul>
            </div>
        </div>

    </div>

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

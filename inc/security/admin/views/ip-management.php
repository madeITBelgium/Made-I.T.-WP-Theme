<?php defined( 'ABSPATH' ) || exit; global $wpdb; // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function ?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🚫</span>
            <div>
                <h1 class="madeit-security-page-title">IP Management</h1>
                <p class="madeit-security-page-sub">Manage blocked IPs, IP ranges, and whitelist</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">

        <!-- BLOCKED IPs -->
        <div class="madeit-security-col-main">
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Blocked IP Addresses</h2>
                    <div class="madeit-security-panel__actions">
                        <input type="text" id="block-list-search" class="madeit-security-search-input" placeholder="Search blocked IPs…" />
                        <button class="madeit-security-btn madeit-security-btn--danger madeit-security-btn--sm" id="btn-open-block-form">+ Block IP</button>
                    </div>
                </div>
                <?php
                $now     = current_time( 'mysql' );
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
                $blocked = $wpdb->get_results( $wpdb->prepare(
                    "SELECT b.*, GREATEST( b.request_count, COALESCE(vl.cnt, 0) ) AS request_count
                       FROM {$wpdb->prefix}madeit_security_blocked_ips b
                       LEFT JOIN (
                           SELECT ip, COUNT(*) AS cnt
                             FROM {$wpdb->prefix}madeit_security_visitor_log
                            WHERE is_blocked = 1
                            GROUP BY ip
                       ) vl ON vl.ip = b.ip
                      WHERE b.permanent = 1 OR b.blocked_until IS NULL OR b.blocked_until > %s
                      ORDER BY b.created_at DESC
                      LIMIT 200",
                    $now
                ) );
                ?>
                <div class="madeit-security-table-wrapper">
                    <table class="madeit-security-table" id="blocked-ips-table">
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>Reason</th>
                                <th>Requests</th>
                                <th>Duration</th>
                                <th>Blocked At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if ( empty( $blocked ) ) : ?>
                                <tr><td colspan="6" class="madeit-security-empty-cell">No blocked IPs. 🎉</td></tr>
                            <?php else : ?>
                                <?php foreach ( $blocked as $row ) : ?>
                                    <tr class="blocked-ip-row" data-ip="<?php echo esc_attr( $row->ip ); ?>">
                                        <td>
                                            <code class="madeit-security-ip-code"><?php echo esc_html( $row->ip ); ?></code>
                                            <button class="madeit-security-btn-link madeit-security-ip-detail-btn" data-ip="<?php echo esc_attr( $row->ip ); ?>" title="View details">🔍</button>
                                        </td>
                                        <td><span class="madeit-security-reason-text"><?php echo esc_html( $row->reason ); ?></span></td>
                                        <td><span class="madeit-security-badge madeit-security-badge--gray"><?php echo esc_html( number_format( $row->request_count ) ); ?></span></td>
                                        <td>
                                            <?php if ( $row->permanent ) : ?>
                                                <span class="madeit-security-badge madeit-security-badge--red">Permanent</span>
                                            <?php else : ?>
                                                <span class="madeit-security-badge madeit-security-badge--orange">Until <?php echo esc_html( wp_date( 'M j, H:i', strtotime( $row->blocked_until ) ) ); ?></span>
                                            <?php endif; ?>
                                        </td>
                                        <td><span class="madeit-security-date-text"><?php echo esc_html( wp_date( 'M j, H:i', strtotime( $row->created_at ) ) ); ?></span></td>
                                        <td class="madeit-security-actions-cell">
                                            <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-unblock-btn" data-ip="<?php echo esc_attr( $row->ip ); ?>">Unblock</button>
                                            <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-whitelist-btn" data-ip="<?php echo esc_attr( $row->ip ); ?>">Whitelist</button>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- SIDEBAR: Add IP + Whitelist -->
        <div class="madeit-security-col-side">

            <!-- QUICK BLOCK FORM -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Block an IP</h2>
                </div>
                <div class="madeit-security-form-body">
                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">IP Address</label>
                        <input type="text" id="quick-block-ip" class="madeit-security-input" placeholder="e.g. 192.168.1.1" />
                    </div>
                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">Reason</label>
                        <input type="text" id="quick-block-reason" class="madeit-security-input" value="Manually blocked" />
                    </div>
                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">Duration</label>
                        <select id="quick-block-duration" class="madeit-security-input">
                            <option value="0">Permanent</option>
                            <option value="3600">1 Hour</option>
                            <option value="86400">24 Hours</option>
                            <option value="604800">7 Days</option>
                            <option value="2592000">30 Days</option>
                        </select>
                    </div>
                    <button class="madeit-security-btn madeit-security-btn--danger madeit-security-btn--full" id="quick-block-submit">🚫 Block IP</button>
                    <div id="quick-block-result" class="madeit-security-form-result" style="display:none;"></div>
                </div>
            </div>

            <!-- WHITELIST -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Whitelist</h2>
                </div>
                <?php
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
                $whitelist = $wpdb->get_results(
                    "SELECT * FROM {$wpdb->prefix}madeit_security_whitelist WHERE type='ip' ORDER BY created_at DESC LIMIT 50"
                );
                ?>
                <?php if ( empty( $whitelist ) ) : ?>
                    <p class="madeit-security-empty-panel">No whitelisted IPs.</p>
                <?php else : ?>
                    <ul class="madeit-security-whitelist-list">
                        <?php foreach ( $whitelist as $w ) : ?>
                            <li class="madeit-security-whitelist-item">
                                <code class="madeit-security-ip-code"><?php echo esc_html( $w->value ); ?></code>
                                <?php if ( $w->label ) : ?>
                                    <span class="madeit-security-wl-label"><?php echo esc_html( $w->label ); ?></span>
                                <?php endif; ?>
                                <button class="madeit-security-btn-link madeit-security-remove-whitelist-btn" data-id="<?php echo esc_attr( $w->id ); ?>">✕</button>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>

        </div>
    </div>
    </div><!-- /.madeit-security-page-content -->
<?php require_once __DIR__ . '/_modals.php'; ?>


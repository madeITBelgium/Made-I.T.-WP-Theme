<?php defined( 'ABSPATH' ) || exit; // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function ?>
    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">📜</span>
            <div><h1 class="madeit-security-page-title">Audit Log</h1><p class="madeit-security-page-sub">Admin actions and security events</p></div>
        </div>
    </div>
    <div class="madeit-security-page-content">
    <div class="madeit-security-panel madeit-security-panel--no-header">
        <div class="madeit-security-table-wrapper">
            <?php global $wpdb;
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
            $events = $wpdb->get_results(
                "SELECT * FROM {$wpdb->prefix}madeit_security_audit_log ORDER BY created_at DESC LIMIT 200"
            ); ?>
            <table class="madeit-security-table">
                <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Object</th><th>Description</th><th>IP</th></tr></thead>
                <tbody>
                    <?php if ( empty( $events ) ) : ?>
                        <tr><td colspan="6" class="madeit-security-empty-cell">No audit events yet.</td></tr>
                    <?php else : foreach ( $events as $e ) : ?>
                        <tr>
                            <td><?php echo esc_html( wp_date( 'M j H:i:s', strtotime( $e->created_at ) ) ); ?></td>
                            <td><?php echo $e->username ? esc_html( $e->username ) : '<em>System</em>'; ?></td>
                            <td><code><?php echo esc_html( $e->action ); ?></code></td>
                            <td><?php echo esc_html( $e->object_type . ' ' . $e->object_id ); ?></td>
                            <td><?php echo esc_html( $e->description ); ?></td>
                            <td><code class="madeit-security-ip-code"><?php echo esc_html( $e->ip ); ?></code></td>
                        </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
    </div>
    </div><!-- /.madeit-security-page-content -->
<?php require_once __DIR__ . '/_modals.php'; ?>


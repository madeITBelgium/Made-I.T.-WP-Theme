<?php defined( 'ABSPATH' ) || exit; // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function ?>
    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">📜</span>
            <div><h1 class="madeit-security-page-title">Audit Log</h1><p class="madeit-security-page-sub">Admin actions and security events</p></div>
        </div>
    </div>
    <div class="madeit-security-page-content">
    <div class="madeit-security-panel madeit-security-panel--no-header">
        <?php
        $action_filter = isset( $_GET['audit_action'] ) ? sanitize_key( wp_unslash( $_GET['audit_action'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only filter
        $search_query  = isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only filter

        $allowed_actions = [
            'post_created',
            'post_edited',
            'post_deleted',
            'plugin_updated',
            'login_success',
            'login_failed',
            'admin_page_visit',
            'setting_changed',
            'setting_added',
            'setting_deleted',
        ];
        if ( '' !== $action_filter && ! in_array( $action_filter, $allowed_actions, true ) ) {
            $action_filter = '';
        }
        ?>
        <form method="get" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:0 0 16px;">
            <input type="hidden" name="page" value="madeit-security-audit" />
            <select name="audit_action" class="madeit-security-input madeit-security-input--sm" style="min-width:220px;">
                <option value="">All actions</option>
                <?php foreach ( $allowed_actions as $action ) : ?>
                    <option value="<?php echo esc_attr( $action ); ?>" <?php selected( $action_filter, $action ); ?>><?php echo esc_html( $action ); ?></option>
                <?php endforeach; ?>
            </select>
            <input type="search" name="s" value="<?php echo esc_attr( $search_query ); ?>" placeholder="Search description, user, IP" class="madeit-security-input madeit-security-input--sm" style="min-width:280px;" />
            <button type="submit" class="madeit-security-btn">Filter</button>
        </form>
        <div class="madeit-security-table-wrapper">
            <?php global $wpdb;
            $table = $wpdb->prefix . 'madeit_security_audit_log';
            $where = [];
            $args  = [];

            if ( '' !== $action_filter ) {
                $where[] = 'action = %s';
                $args[]  = $action_filter;
            }

            if ( '' !== $search_query ) {
                $needle  = '%' . $wpdb->esc_like( $search_query ) . '%';
                $where[] = '(description LIKE %s OR username LIKE %s OR ip LIKE %s OR object_id LIKE %s)';
                $args[]  = $needle;
                $args[]  = $needle;
                $args[]  = $needle;
                $args[]  = $needle;
            }

            $sql = "SELECT * FROM {$table}";
            if ( ! empty( $where ) ) {
                $sql .= ' WHERE ' . implode( ' AND ', $where );
            }
            $sql .= ' ORDER BY created_at DESC LIMIT 200';

            if ( ! empty( $args ) ) {
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
                $events = $wpdb->get_results( $wpdb->prepare( $sql, $args ) );
            } else {
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
                $events = $wpdb->get_results( $sql );
            }
            ?>
            <table class="madeit-security-table">
                <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Object</th><th>Description</th><th>IP</th></tr></thead>
                <tbody>
                    <?php if ( empty( $events ) ) : ?>
                        <tr><td colspan="6" class="madeit-security-empty-cell">No audit events yet.</td></tr>
                    <?php else : foreach ( $events as $e ) : ?>
                        <tr>
                            <td><?php echo esc_html( wp_date( 'd/m/Y H:i:s', strtotime( $e->created_at ) ) ); ?></td>
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


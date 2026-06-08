<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

class IPManager {

    private const REMOTE_BLACKLIST_URL      = 'https://backend.bizhosting.be/api/2.0/firewall/txt';
    private const REMOTE_BLACKLIST_META      = 'madeit_security_remote_blacklist_meta';
    private const REMOTE_BLACKLIST_FILE_REL  = 'madeit-security/remote-blacklist.json';

    public static function init(): void {
        add_action( 'wp_ajax_madeit_security_block_ip',      [ __CLASS__, 'ajax_block_ip' ] );
        add_action( 'wp_ajax_madeit_security_unblock_ip',    [ __CLASS__, 'ajax_unblock_ip' ] );
        add_action( 'wp_ajax_madeit_security_whitelist_ip',  [ __CLASS__, 'ajax_whitelist_ip' ] );
        add_action( 'wp_ajax_madeit_security_get_ip_info',   [ __CLASS__, 'ajax_get_ip_info' ] );
        add_action( 'wp_ajax_madeit_security_live_visitors',  [ __CLASS__, 'ajax_live_visitors' ] );
        add_action( 'wp_ajax_madeit_security_visitor_log',    [ __CLASS__, 'ajax_visitor_log' ] );
        add_action( 'wp_ajax_madeit_security_visitor_stats',  [ __CLASS__, 'ajax_visitor_stats' ] );
        add_action( 'wp_ajax_nopriv_madeit_security_unblock_request', [ __CLASS__, 'ajax_unblock_request' ] );
        add_action( 'wp_ajax_madeit_security_unblock_request',        [ __CLASS__, 'ajax_unblock_request' ] );

        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            \WP_CLI::add_command( 'madeit-security refresh-blacklist', [ __CLASS__, 'cli_refresh_blacklist' ] );
            \WP_CLI::add_command( 'madeit-security list-blocked', [ __CLASS__, 'cli_list_blocked' ] );
            \WP_CLI::add_command( 'madeit-security block-ip', [ __CLASS__, 'cli_block_ip' ] );
            \WP_CLI::add_command( 'madeit-security unblock-ip', [ __CLASS__, 'cli_unblock_ip' ] );
            \WP_CLI::add_command( 'madeit-security whitelist-ip', [ __CLASS__, 'cli_whitelist_ip' ] );
        }
    }

    // ── Public API ─────────────────────────────────────────────────────────────

    public static function block_ip(
        string $ip,
        string $reason   = 'Manually blocked',
        int    $duration  = 0,   // 0 = permanent
        string $rule_id   = 'manual',
        int    $by_user   = 0
    ): bool {
        global $wpdb;

        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            return false;
        }

        // Never block the current admin's own IP — prevents self-lockout
        if ( is_user_logged_in() && current_user_can( 'manage_options' )
            && $ip === \MadeIT\Security\RequestLogger::get_real_ip() ) {
            return false;
        }

        $blocked_until = null;
        $permanent     = 1;
        if ( $duration > 0 ) {
            $blocked_until = wp_date( 'Y-m-d H:i:s', time() + $duration );
            $permanent     = 0;
        }

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $table = $wpdb->prefix . 'madeit_security_blocked_ips';
        $now   = current_time( 'mysql' );

        $sql = $wpdb->prepare(
            "INSERT INTO {$table}
                (ip, reason, rule_id, permanent, blocked_until, created_by, created_at, updated_at)
            VALUES
                (%s, %s, %s, %d, %s, %d, %s, %s)
            ON DUPLICATE KEY UPDATE
                reason = VALUES(reason),
                rule_id = VALUES(rule_id),
                permanent = VALUES(permanent),
                blocked_until = VALUES(blocked_until),
                updated_at = VALUES(updated_at)",
            $ip,
            $reason,
            $rule_id,
            $permanent,
            $blocked_until,
            $by_user ?: get_current_user_id(),
            $now,
            $now
        );

        return (bool) $wpdb->query( $sql );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
    }

    public static function unblock_ip( string $ip ): bool {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        return (bool) $wpdb->delete(
            $wpdb->prefix . 'madeit_security_blocked_ips',
            [ 'ip' => $ip ],
            [ '%s' ]
        );
    }

    public static function is_blocked( string $ip ): bool {
        global $wpdb;

        do_action( 'qm/start', 'madeit_security:ip_is_blocked_total' );

        if ( isset( self::get_remote_blacklist_set()[ $ip ] ) ) {
            do_action( 'qm/stop', 'madeit_security:ip_is_blocked_total' );
            return true;
        }

        do_action( 'qm/start', 'madeit_security:ip_is_blocked_db' );

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $blocked = (bool) $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}madeit_security_blocked_ips
            WHERE ip = %s
                AND (permanent = 1 OR blocked_until > %s)
            LIMIT 1",
            $ip,
            current_time( 'mysql' )
        ) );

        do_action( 'qm/stop', 'madeit_security:ip_is_blocked_db' );
        do_action( 'qm/stop', 'madeit_security:ip_is_blocked_total' );

        return $blocked;
    }

    // ── AJAX Handlers ──────────────────────────────────────────────────────────

    public static function ajax_block_ip(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        $ip       = isset( $_POST['ip'] )       ? sanitize_text_field( wp_unslash( $_POST['ip'] ) ) : '';
        $reason   = isset( $_POST['reason'] )   ? sanitize_text_field( wp_unslash( $_POST['reason'] ) ) : 'Manually blocked';
        $duration = isset( $_POST['duration'] ) ? (int) $_POST['duration'] : 0; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- integer cast

        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            wp_send_json_error( [ 'message' => 'Invalid IP address' ] );
        }

        // Don't block your own IP
        if ( $ip === \MadeIT\Security\RequestLogger::get_real_ip() ) {
            wp_send_json_error( [ 'message' => 'You cannot block your own IP address' ] );
        }

        $ok = self::block_ip( $ip, $reason, $duration );

        if ( $ok ) {
            self::audit( 'block_ip', 'ip', $ip, "Blocked IP: $ip. Reason: $reason" );
            wp_send_json_success( [
                'message'  => "IP $ip has been blocked.",
                'blocked'  => true,
                'duration' => $duration,
            ] );
        } else {
            wp_send_json_error( [ 'message' => "Could not block IP $ip." ] );
        }
    }

    public static function ajax_unblock_ip(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        $ip = isset( $_POST['ip'] ) ? sanitize_text_field( wp_unslash( $_POST['ip'] ) ) : '';
        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            wp_send_json_error( [ 'message' => 'Invalid IP address' ] );
        }

        $ok = self::unblock_ip( $ip );
        self::audit( 'unblock_ip', 'ip', $ip, "Unblocked IP: $ip" );

        wp_send_json_success( [ 'message' => "IP $ip has been unblocked.", 'unblocked' => $ok ] );
    }

    public static function ajax_whitelist_ip(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized' ], 403 );
        }

        global $wpdb;
        $ip    = isset( $_POST['ip'] )    ? sanitize_text_field( wp_unslash( $_POST['ip'] ) ) : '';
        $label = isset( $_POST['label'] ) ? sanitize_text_field( wp_unslash( $_POST['label'] ) ) : '';

        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            wp_send_json_error( [ 'message' => 'Invalid IP address' ] );
        }

        // Remove from block list
        self::unblock_ip( $ip );

        // Add to whitelist
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $exists = $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}madeit_security_whitelist WHERE type = 'ip' AND value = %s", $ip
        ) );
        if ( ! $exists ) {
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
            $wpdb->insert(
                $wpdb->prefix . 'madeit_security_whitelist',
                [ 'type' => 'ip', 'value' => $ip, 'label' => $label, 'created_by' => get_current_user_id(), 'created_at' => current_time( 'mysql' ) ],
                [ '%s','%s','%s','%d','%s' ]
            );
        }

        self::audit( 'whitelist_ip', 'ip', $ip, "Whitelisted IP: $ip" );
        wp_send_json_success( [ 'message' => "IP $ip added to whitelist." ] );
    }

    public static function ajax_unblock_request(): void {
        $nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
        if ( ! wp_verify_nonce( $nonce, 'madeit_security_unblock_request' ) ) {
            wp_send_json_error( [ 'message' => 'Invalid request.' ], 400 );
        }

        $email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
        $message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
        if ( ! $email || ! is_email( $email ) ) {
            wp_send_json_error( [ 'message' => 'Please enter a valid email address.' ], 422 );
        }

        $ip = \MadeIT\Security\RequestLogger::get_real_ip();
        $rate_key = 'madeit_security_unblock_req_' . md5( $ip . '|' . $email );
        if ( get_transient( $rate_key ) ) {
            wp_send_json_error( [ 'message' => 'Request already sent. Please wait before trying again.' ], 429 );
        }

        $reason = '';
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $row = $wpdb->get_row( $wpdb->prepare(
            "SELECT reason, permanent, blocked_until
            FROM {$wpdb->prefix}madeit_security_blocked_ips
            WHERE ip = %s
                AND (permanent = 1 OR blocked_until IS NULL OR blocked_until > %s)
            LIMIT 1",
            $ip,
            current_time( 'mysql' )
        ) );
        if ( $row ) {
            $reason = (string) $row->reason;
        }

        $admin_email = get_option( 'admin_email' );
        $site_name = wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES );
        $site_url = home_url( '/' );
        $ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';

        $subject = sprintf( 'Unblock request on %s (IP: %s)', $site_name, $ip );
        $body = "Unblock request received:\n\n";
        $body .= "Site: {$site_name}\n";
        $body .= "URL: {$site_url}\n";
        $body .= "IP: {$ip}\n";
        if ( $reason !== '' ) {
            $body .= "Block reason: {$reason}\n";
        }
        if ( $ua !== '' ) {
            $body .= "User-Agent: {$ua}\n";
        }
        $body .= "Requester email: {$email}\n";
        if ( $message !== '' ) {
            $body .= "Message:\n{$message}\n";
        }
        $body .= "\nUnblock in WP Admin: " . admin_url( 'admin.php?page=madeit-security-ip-mgmt' ) . "\n";

        $sent = wp_mail( $admin_email, $subject, $body );
        if ( ! $sent ) {
            wp_send_json_error( [ 'message' => 'Could not send request. Please try again later.' ], 500 );
        }

        set_transient( $rate_key, 1, 10 * MINUTE_IN_SECONDS );
        wp_send_json_success( [ 'message' => 'Your request has been sent to the site administrator.' ] );
    }

    public static function ajax_get_ip_info(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [], 403 );
        }

        ob_start();
        global $wpdb;
        $ip = isset( $_GET['ip'] ) ? sanitize_text_field( wp_unslash( $_GET['ip'] ) ) : '';

        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            wp_send_json_error( [ 'message' => 'Invalid IP' ] );
        }

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $total_requests = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_visitor_log WHERE ip = %s", $ip
        ) );
        $first_seen = $wpdb->get_var( $wpdb->prepare(
            "SELECT MIN(created_at) FROM {$wpdb->prefix}madeit_security_visitor_log WHERE ip = %s", $ip
        ) );
        $last_seen = $wpdb->get_var( $wpdb->prepare(
            "SELECT MAX(created_at) FROM {$wpdb->prefix}madeit_security_visitor_log WHERE ip = %s", $ip
        ) );
        $is_blocked   = self::is_blocked( $ip );
        $block_detail = $wpdb->get_row( $wpdb->prepare(
            "SELECT reason, permanent, blocked_until, created_at FROM {$wpdb->prefix}madeit_security_blocked_ips WHERE ip = %s", $ip
        ) );
        $is_whitelisted = (bool) $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}madeit_security_whitelist WHERE type='ip' AND value=%s", $ip
        ) );
        $pages = $wpdb->get_results( $wpdb->prepare(
            "SELECT url, page_title, created_at, method, status_code, ua_family, os_family, is_bot, block_reason, user_agent
            FROM {$wpdb->prefix}madeit_security_visitor_log
            WHERE ip = %s
            ORDER BY created_at DESC
            LIMIT 20",
            $ip
        ) );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        $stray = ob_get_clean();
        if ( $stray && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( 'MADEIT_SECURITY get_ip_info stray output: ' . substr( $stray, 0, 500 ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
        }

        wp_send_json_success( [
            'ip'              => $ip,
            'total_requests'  => $total_requests,
            'first_seen'      => $first_seen,
            'last_seen'       => $last_seen,
            'is_blocked'      => $is_blocked,
            'block_detail'    => $block_detail,
            'is_whitelisted'  => $is_whitelisted,
            'recent_pages'    => $pages,
        ] );
    }

    /**
     * AJAX: Get live / real-time visitors (last 5 min)
     */
    public static function ajax_live_visitors(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [], 403 );
        }

        ob_start();
        global $wpdb;
        $cutoff = wp_date( 'Y-m-d H:i:s', time() - 300 ); // 5 minutes ago, WP timezone

        // Fast: subquery finds latest row ID + count per IP, then join fetches the full row by PK.
        // Avoids GROUP_CONCAT + SUBSTRING_INDEX which sorts/concatenates ALL URLs per group.
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $rows = $wpdb->get_results( $wpdb->prepare(
            "SELECT vl.ip, vl.country, vl.ua_family, vl.os_family, vl.url, vl.page_title,
                    vl.user_id, vl.username, vl.is_bot, vl.bot_score, vl.is_blocked,
                    vl.created_at AS last_seen, g.request_count
            FROM {$wpdb->prefix}madeit_security_visitor_log vl
            INNER JOIN (
                SELECT ip, MAX(id) AS max_id, COUNT(*) AS request_count
                    FROM {$wpdb->prefix}madeit_security_visitor_log
                WHERE created_at >= %s
                GROUP BY ip
            ) g ON vl.id = g.max_id
            ORDER BY vl.created_at DESC
            LIMIT %d",
            $cutoff, 50
        ) );

        // Enrich with block status
        $blocked_ips = self::get_blocked_ips_set();
        $whitelisted = self::get_whitelisted_ips_set();
        foreach ( $rows as $row ) {
            $row->is_blocked_now   = isset( $blocked_ips[ $row->ip ] );
            $row->is_whitelisted   = isset( $whitelisted[ $row->ip ] );
        }

        $stray = ob_get_clean();
        if ( $stray && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( 'MADEIT_SECURITY live_visitors stray output: ' . substr( $stray, 0, 500 ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
        }

        wp_send_json_success( [
            'visitors'  => $rows,
            'count'     => count( $rows ),
            'timestamp' => current_time( 'mysql' ),
        ] );
    }

    /**
     * AJAX: Visitor log (last 24h, paginated, searchable)
     */
    public static function ajax_visitor_log(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'message' => 'Unauthorized (manage_options required)' ], 403 );
        }

        // Capture and discard any stray PHP output (notices, warnings, SQL errors)
        // that would corrupt the JSON response when WP_DEBUG_DISPLAY is on.
        ob_start();

        try {
            global $wpdb;

            // Verify the table exists before querying.
            $tbl = "{$wpdb->prefix}madeit_security_visitor_log";
            // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
            $tbl_exists = $wpdb->get_var( $wpdb->prepare(
                "SELECT TABLE_NAME FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s LIMIT 1",
                $tbl
            ) );
            if ( ! $tbl_exists ) {
                ob_get_clean();
                wp_send_json_error( [ 'message' => "Table {$tbl} does not exist. Please deactivate and reactivate the plugin." ] );
            }

            $page       = max( 1, (int) wp_unslash( $_GET['page'] ?? 1 ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- integer cast
            $per_page   = 50;
            $offset     = ( $page - 1 ) * $per_page;
            $search_ip          = isset( $_GET['ip'] )      ? sanitize_text_field( wp_unslash( $_GET['ip'] ) ) : '';
            $filter_bot         = isset( $_GET['bot'] )      ? (int) $_GET['bot'] : -1; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- integer cast
            $filter_blk         = isset( $_GET['blocked'] )  ? (int) $_GET['blocked'] : -1; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- integer cast
            $hours              = isset( $_GET['hours'] )    ? min( 168, max( 1, (int) $_GET['hours'] ) ) : 24; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- integer cast
            $search_url         = isset( $_GET['url'] )      ? sanitize_text_field( wp_unslash( $_GET['url'] ) ) : '';
            $exclude_logged_in  = ! empty( $_GET['exclude_logged_in'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- boolean check

            $log_cutoff = wp_date( 'Y-m-d H:i:s', time() - ( $hours * 3600 ) );
            if ( ! $log_cutoff ) {
                $log_cutoff = gmdate( 'Y-m-d H:i:s', time() - ( $hours * 3600 ) ); // fallback
            }
            $where  = [ $wpdb->prepare( "created_at >= %s", $log_cutoff ) ];

            if ( $search_ip ) {
                $where[] = $wpdb->prepare( "ip LIKE %s", '%' . $wpdb->esc_like( $search_ip ) . '%' );
            }
            if ( $search_url ) {
                $where[] = $wpdb->prepare( "url LIKE %s", '%' . $wpdb->esc_like( $search_url ) . '%' );
            }
            if ( $filter_bot >= 0 ) {
                $where[] = $wpdb->prepare( "is_bot = %d", $filter_bot );
            }
            if ( $filter_blk >= 0 ) {
                $where[] = $wpdb->prepare( "is_blocked = %d", $filter_blk );
            }
            if ( $exclude_logged_in ) {
                $where[] = "( user_id = 0 OR user_id IS NULL )";
            }

            $where_sql = 'WHERE ' . implode( ' AND ', $where );

            // Suppress $wpdb error display so SQL errors don't corrupt JSON output.
            $suppress = $wpdb->suppress_errors( true );

            // phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter -- $tbl is a safe table name, $where_sql built from prepare()
            $total = (int) $wpdb->get_var(
                "SELECT COUNT(*) FROM {$tbl} {$where_sql}"
            );
            // phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter

            if ( $wpdb->last_error && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'MADEIT_SECURITY visitor_log COUNT error: ' . $wpdb->last_error ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            }

            // Append LIMIT/OFFSET separately — avoids double-prepare that corrupts
            // %-characters in already-escaped LIKE patterns inside $where_sql.
            // phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter -- $tbl is a safe table name, $where_sql built from sanitized filter values
            $rows = $wpdb->get_results(
                "SELECT id, ip, country, method, url, page_title, referer,
                        ua_family, os_family, user_id, username, status_code,
                        is_bot, bot_score, is_blocked, block_reason, created_at
                FROM {$tbl}
                {$where_sql}
                ORDER BY created_at DESC
                LIMIT " . absint( $per_page ) . " OFFSET " . absint( $offset )
            );
            // phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared,PluginCheck.Security.DirectDB.UnescapedDBParameter
            // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

            if ( $wpdb->last_error && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'MADEIT_SECURITY visitor_log SELECT error: ' . $wpdb->last_error ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            }

            $wpdb->suppress_errors( $suppress );

            if ( ! is_array( $rows ) ) {
                $rows = [];
            }

            $blocked_ips = self::get_blocked_ips_set();
            $whitelisted = self::get_whitelisted_ips_set();
            foreach ( $rows as $row ) {
                $row->is_blocked_now = isset( $blocked_ips[ $row->ip ] );
                $row->is_whitelisted = isset( $whitelisted[ $row->ip ] );
            }

            // Discard any stray output (PHP notices/warnings/SQL errors) before sending JSON.
            $stray = ob_get_clean();
            if ( $stray && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'MADEIT_SECURITY visitor_log stray output: ' . substr( $stray, 0, 500 ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            }

            wp_send_json_success( [
                'rows'       => $rows,
                'total'      => $total,
                'page'       => $page,
                'per_page'   => $per_page,
                'pages'      => max( 1, (int) ceil( $total / $per_page ) ),
                'timestamp'  => current_time( 'mysql' ),
            ] );

        } catch ( \Throwable $e ) {
            ob_get_clean();
            if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'MADEIT_SECURITY visitor_log EXCEPTION: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            }
            wp_send_json_error( [ 'message' => 'Server error: ' . $e->getMessage() ] );
        }
    }

    /**
     * AJAX: Summary stats for the dashboard widgets
     */
    public static function ajax_visitor_stats(): void {
        check_ajax_referer( 'madeit_security_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [], 403 );
        }

        ob_start();
        global $wpdb;

        // Use wp_date() with WP timezone — matches current_time('mysql') used by RequestLogger
        $cutoff_24h = wp_date( 'Y-m-d H:i:s', time() - 86400 );
        $cutoff_5m  = wp_date( 'Y-m-d H:i:s', time() - 300 );

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache

        // Combined stat query — 1 query instead of 4 separate COUNT(*) scans
        $stats = $wpdb->get_row( $wpdb->prepare(
            "SELECT COUNT(*) AS total_24h,
                    COUNT(DISTINCT ip) AS unique_ips,
                    SUM(is_bot = 1) AS bots_24h,
                    SUM(is_blocked = 1) AS blocked_24h
            FROM {$wpdb->prefix}madeit_security_visitor_log
            WHERE created_at >= %s",
            $cutoff_24h
        ) );
        $total_24h   = (int) ( $stats->total_24h ?? 0 );
        $unique_ips  = (int) ( $stats->unique_ips ?? 0 );
        $bots_24h    = (int) ( $stats->bots_24h ?? 0 );
        $blocked_24h = (int) ( $stats->blocked_24h ?? 0 );

        $live_now      = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(DISTINCT ip) FROM {$wpdb->prefix}madeit_security_visitor_log WHERE created_at >= %s", $cutoff_5m ) );
        $total_blocked = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_blocked_ips WHERE permanent=1 OR blocked_until > %s",
            current_time( 'mysql' )
        ) );

        // Requests per hour for the last 24 hours (chart data)
        // Uses the created_at index for the range scan; GROUP BY on derived hour is unavoidable
        $hourly = $wpdb->get_results( $wpdb->prepare(
            "SELECT DATE_FORMAT(created_at, '%%Y-%%m-%%d %%H:00:00') AS hour,
                    COUNT(*) AS total,
                    SUM(is_bot) AS bots,
                    SUM(is_blocked) AS blocked
            FROM {$wpdb->prefix}madeit_security_visitor_log
            WHERE created_at >= %s
            GROUP BY hour
            ORDER BY hour ASC",
            $cutoff_24h
        ) );

        // Top IPs — uses compound index (created_at, ip)
        // Exclude whitelisted IPs (admin's own IP, trusted IPs) — not useful in this widget
        $top_ips = $wpdb->get_results( $wpdb->prepare(
            "SELECT ip, MAX(country) AS country, COUNT(*) AS hits,
                    MAX(is_bot) AS is_bot, MAX(is_blocked) AS is_blocked
            FROM {$wpdb->prefix}madeit_security_visitor_log
            WHERE created_at >= %s
                AND ip NOT IN (SELECT value FROM {$wpdb->prefix}madeit_security_whitelist WHERE type = 'ip')
            GROUP BY ip
            ORDER BY hits DESC
            LIMIT 10",
            $cutoff_24h
        ) );
        // Enrich with real-time block status
        $blocked_ips = self::get_blocked_ips_set();
        foreach ( $top_ips as $tip ) {
            $tip->is_blocked_now = isset( $blocked_ips[ $tip->ip ] );
        }

        // Top pages — GROUP BY post_id (integer, fast) instead of url (TEXT, forces disk temp table)
        $top_pages = $wpdb->get_results( $wpdb->prepare(
            "SELECT vl.page_title, vl.url, g.hits
            FROM {$wpdb->prefix}madeit_security_visitor_log vl
            INNER JOIN (
                SELECT post_id, MAX(id) AS max_id, COUNT(*) AS hits
                    FROM {$wpdb->prefix}madeit_security_visitor_log
                WHERE created_at >= %s AND post_id > 0
                GROUP BY post_id
            ) g ON vl.id = g.max_id
            ORDER BY g.hits DESC
            LIMIT 10",
            $cutoff_24h
        ) );

        // UA breakdown — ua_family is VARCHAR(80), grouping is fine
        $browsers = $wpdb->get_results( $wpdb->prepare(
            "SELECT ua_family, COUNT(*) AS cnt
            FROM {$wpdb->prefix}madeit_security_visitor_log
            WHERE created_at >= %s AND ua_family != ''
            GROUP BY ua_family
            ORDER BY cnt DESC
            LIMIT 8",
            $cutoff_24h
        ) );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        $stray = ob_get_clean();
        if ( $stray && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( 'MADEIT_SECURITY visitor_stats stray output: ' . substr( $stray, 0, 500 ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
        }

        wp_send_json_success( compact(
            'total_24h', 'unique_ips', 'bots_24h', 'blocked_24h',
            'live_now', 'total_blocked', 'hourly', 'top_ips', 'top_pages', 'browsers'
        ) );
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private static function get_blocked_ips_set(): array {
        global $wpdb;
        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $ips = $wpdb->get_col( $wpdb->prepare(
            "SELECT ip FROM {$wpdb->prefix}madeit_security_blocked_ips WHERE permanent=1 OR blocked_until > %s",
            current_time( 'mysql' )
        ) );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
        $set = array_flip( $ips );

        foreach ( self::get_remote_blacklist_set() as $remote_ip => $true ) {
            $set[ $remote_ip ] = $true;
        }

        return $set;
    }

    public static function refresh_remote_blacklist(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_remote_blacklist_enabled', true ) ) {
            return;
        }

        $response = wp_remote_get(
            self::REMOTE_BLACKLIST_URL,
            [
                'timeout'    => 15,
                'redirection'=> 3,
                'user-agent' => 'MadeIT-Security/' . ( defined( 'MADEIT_SECURITY_DB_VERSION' ) ? MADEIT_SECURITY_DB_VERSION : '1' ),
            ]
        );

        if ( is_wp_error( $response ) ) {
            self::set_remote_blacklist_meta( [
                'updated_at'  => current_time( 'mysql' ),
                'success'     => false,
                'count'       => (int) self::get_remote_blacklist_meta()['count'] ?? 0,
                'error'       => $response->get_error_message(),
            ] );
            return;
        }

        $code = (int) wp_remote_retrieve_response_code( $response );
        if ( $code < 200 || $code >= 300 ) {
            self::set_remote_blacklist_meta( [
                'updated_at'  => current_time( 'mysql' ),
                'success'     => false,
                'count'       => (int) self::get_remote_blacklist_meta()['count'] ?? 0,
                'error'       => 'HTTP ' . $code,
            ] );
            return;
        }

        $body = (string) wp_remote_retrieve_body( $response );
        $ips  = self::parse_remote_blacklist_body( $body );

        $stored = self::store_remote_blacklist_file( $ips );
        if ( ! $stored ) {
            self::set_remote_blacklist_meta( [
                'updated_at'  => current_time( 'mysql' ),
                'success'     => false,
                'count'       => (int) ( self::get_remote_blacklist_meta()['count'] ?? 0 ),
                'error'       => 'Could not write remote blacklist file',
            ] );
            return;
        }

        self::set_remote_blacklist_meta( [
            'updated_at'  => current_time( 'mysql' ),
            'success'     => true,
            'count'       => count( $ips ),
            'error'       => '',
        ] );
    }

    /**
     * WP-CLI: Manually refresh remote blacklist feed.
     *
     * Usage: wp madeit-security refresh-blacklist
     */
    public static function cli_refresh_blacklist(): void {
        self::refresh_remote_blacklist();

        $meta = self::get_remote_blacklist_meta();
        $count = isset( $meta['count'] ) ? (int) $meta['count'] : 0;

        if ( ! empty( $meta['success'] ) ) {
            \WP_CLI::success( sprintf( 'Remote blacklist refreshed. %d IPs loaded.', $count ) );
            if ( ! empty( $meta['updated_at'] ) ) {
                \WP_CLI::log( 'Updated at: ' . (string) $meta['updated_at'] );
            }
            return;
        }

        $error = ! empty( $meta['error'] ) ? (string) $meta['error'] : 'Unknown error';
        \WP_CLI::error( 'Remote blacklist refresh failed: ' . $error );
    }

    /**
     * WP-CLI: List blocked IPs (local and/or remote).
     *
     * ## OPTIONS
     *
     * [--source=<source>]
     * : local, remote, or all. Default: all
     *
     * [--format=<format>]
     * : table, csv, json, yaml. Default: table
     *
     * [--fields=<fields>]
     * : Comma-separated list of fields. Default: ip,source,reason,rule_id,permanent,blocked_until,created_at,updated_at,request_count
     *
     * ## EXAMPLES
     *
     * wp madeit-security list-blocked --source=local
     * wp madeit-security list-blocked --format=json
     */
    public static function cli_list_blocked( array $args, array $assoc_args ): void {
        $source = isset( $assoc_args['source'] ) ? strtolower( (string) $assoc_args['source'] ) : 'local';
        if ( ! in_array( $source, [ 'local', 'remote', 'all' ], true ) ) {
            \WP_CLI::error( 'Invalid --source. Use local, remote, or all.' );
        }

        $format = isset( $assoc_args['format'] ) ? (string) $assoc_args['format'] : 'table';
        $fields = isset( $assoc_args['fields'] )
            ? array_map( 'trim', explode( ',', (string) $assoc_args['fields'] ) )
            : [ 'ip', 'source', 'reason', 'rule_id', 'permanent', 'blocked_until', 'created_at', 'updated_at', 'request_count' ];

        $items = [];

        if ( $source === 'local' || $source === 'all' ) {
            global $wpdb;
            // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
            $rows = $wpdb->get_results( $wpdb->prepare(
                "SELECT ip, reason, rule_id, permanent, blocked_until, created_at, updated_at, request_count
                FROM {$wpdb->prefix}madeit_security_blocked_ips
                WHERE permanent = 1 OR blocked_until > %s
                ORDER BY updated_at DESC",
                current_time( 'mysql' )
            ), ARRAY_A );
            // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

            foreach ( $rows as $row ) {
                $items[] = [
                    'ip'            => (string) ( $row['ip'] ?? '' ),
                    'source'        => 'local',
                    'reason'        => (string) ( $row['reason'] ?? '' ),
                    'rule_id'       => (string) ( $row['rule_id'] ?? '' ),
                    'permanent'     => (int) ( $row['permanent'] ?? 0 ),
                    'blocked_until' => (string) ( $row['blocked_until'] ?? '' ),
                    'created_at'    => (string) ( $row['created_at'] ?? '' ),
                    'updated_at'    => (string) ( $row['updated_at'] ?? '' ),
                    'request_count' => (int) ( $row['request_count'] ?? 0 ),
                ];
            }
        }

        if ( $source === 'remote' || $source === 'all' ) {
            foreach ( self::get_remote_blacklist_set() as $ip => $true ) {
                $items[] = [
                    'ip'            => (string) $ip,
                    'source'        => 'remote',
                    'reason'        => 'Remote blacklist',
                    'rule_id'       => 'remote_blacklist',
                    'permanent'     => 1,
                    'blocked_until' => '',
                    'created_at'    => '',
                    'updated_at'    => '',
                    'request_count' => 0,
                ];
            }
        }

        if ( empty( $items ) ) {
            \WP_CLI::log( 'No blocked IPs found.' );
            return;
        }

        \WP_CLI\Utils\format_items( $format, $items, $fields );
    }

    /**
     * WP-CLI: Block an IP address.
     *
     * ## OPTIONS
     *
     * <ip>
     * : IP address to block.
     *
     * [--reason=<reason>]
     * : Optional reason. Default: Manually blocked
     *
     * [--duration=<seconds>]
     * : Duration in seconds (0 = permanent). Default: 0
     *
     * Usage: wp madeit-security block-ip <ip> [--reason="Manual block"] [--duration=3600]
     */
    public static function cli_block_ip( array $args, array $assoc_args ): void {
        $ip = isset( $args[0] ) ? (string) $args[0] : '';
        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            \WP_CLI::error( 'Invalid IP address.' );
        }

        $reason = isset( $assoc_args['reason'] ) ? (string) $assoc_args['reason'] : 'Manually blocked';
        $duration = isset( $assoc_args['duration'] ) ? (int) $assoc_args['duration'] : 0;
        if ( $duration < 0 ) {
            \WP_CLI::error( 'Invalid duration. Use 0 or a positive integer.' );
        }

        $ok = self::block_ip( $ip, $reason, $duration, 'manual' );
        if ( $ok ) {
            self::audit( 'block_ip', 'ip', $ip, "Blocked IP via WP-CLI: $ip. Reason: $reason" );
            \WP_CLI::success( "IP $ip added to block list." );
            return;
        }

        \WP_CLI::error( "Could not block IP $ip." );
    }

    /**
     * WP-CLI: Unblock an IP address (local block list only).
     *
     * Usage: wp madeit-security unblock-ip <ip>
     */
    public static function cli_unblock_ip( array $args, array $assoc_args ): void {
        $ip = isset( $args[0] ) ? (string) $args[0] : '';
        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            \WP_CLI::error( 'Invalid IP address.' );
        }

        $ok = self::unblock_ip( $ip );
        if ( $ok ) {
            self::audit( 'unblock_ip', 'ip', $ip, "Unblocked IP via WP-CLI: $ip" );
            \WP_CLI::success( "IP $ip removed from local block list." );
        } else {
            \WP_CLI::warning( "IP $ip was not found in the local block list." );
        }

        if ( isset( self::get_remote_blacklist_set()[ $ip ] ) ) {
            \WP_CLI::warning( 'This IP is present in the remote blacklist and may still be blocked.' );
        }
    }

    /**
     * WP-CLI: Whitelist an IP address.
     *
     * ## OPTIONS
     *
     * [--label=<label>]
     * : Optional label for the whitelist entry.
     *
     * Usage: wp madeit-security whitelist-ip <ip> [--label="Office IP"]
     */
    public static function cli_whitelist_ip( array $args, array $assoc_args ): void {
        $ip = isset( $args[0] ) ? (string) $args[0] : '';
        if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
            \WP_CLI::error( 'Invalid IP address.' );
        }

        $label = isset( $assoc_args['label'] ) ? (string) $assoc_args['label'] : 'WP-CLI whitelist';
        $ok = \MadeIT\Security\Whitelist::add( $ip, $label );

        if ( $ok ) {
            self::audit( 'whitelist_ip', 'ip', $ip, "Whitelisted IP via WP-CLI: $ip" );
            \WP_CLI::success( "IP $ip added to whitelist." );
            return;
        }

        \WP_CLI::error( "Could not whitelist IP $ip." );
    }

    private static function parse_remote_blacklist_body( string $body ): array {
        $ips = [];
        $lines = preg_split( '/\r\n|\r|\n/', $body ) ?: [];

        foreach ( $lines as $line ) {
            $line = trim( $line );
            if ( $line === '' || str_starts_with( $line, '#' ) ) {
                continue;
            }

            // We currently support single IP blocks only.
            // Accept /32 and /128 as single-host notations and normalize to raw IP.
            if ( str_contains( $line, '/' ) ) {
                [ $candidate, $prefix ] = array_pad( explode( '/', $line, 2 ), 2, '' );
                $candidate = trim( $candidate );
                $prefix    = trim( $prefix );

                if ( filter_var( $candidate, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) && $prefix === '32' ) {
                    $ips[] = $candidate;
                    continue;
                }
                if ( filter_var( $candidate, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6 ) && $prefix === '128' ) {
                    $ips[] = $candidate;
                    continue;
                }

                continue;
            }

            if ( filter_var( $line, FILTER_VALIDATE_IP ) ) {
                $ips[] = $line;
            }
        }

        return $ips;
    }

    private static function get_remote_blacklist_set(): array {
        static $request_cache = null;

        do_action( 'qm/start', 'madeit_security:remote_blacklist_lookup' );

        if ( is_array( $request_cache ) ) {
            do_action( 'qm/stop', 'madeit_security:remote_blacklist_lookup' );
            return $request_cache;
        }

        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_remote_blacklist_enabled', true ) ) {
            $request_cache = [];
            do_action( 'qm/stop', 'madeit_security:remote_blacklist_lookup' );
            return [];
        }

        $ips = self::read_remote_blacklist_file();
        if ( ! empty( $ips ) ) {
            $request_cache = array_fill_keys( $ips, true );
            do_action( 'qm/stop', 'madeit_security:remote_blacklist_lookup' );
            return $request_cache;
        }

        self::refresh_remote_blacklist();
        $ips = self::read_remote_blacklist_file();
        $request_cache = ! empty( $ips ) ? array_fill_keys( $ips, true ) : [];

        do_action( 'qm/stop', 'madeit_security:remote_blacklist_lookup' );

        return $request_cache;
    }

    private static function store_remote_blacklist_file( array $ips ): bool {
        $path = self::get_remote_blacklist_file_path();
        if ( ! $path ) {
            return false;
        }

        $dir = dirname( $path );
        if ( ! wp_mkdir_p( $dir ) ) {
            return false;
        }

        $payload = wp_json_encode(
            [
                'generated_at' => current_time( 'mysql' ),
                'ips'          => array_values( array_unique( $ips ) ),
            ]
        );

        if ( ! is_string( $payload ) ) {
            return false;
        }

        return file_put_contents( $path, $payload, LOCK_EX ) !== false;
    }

    private static function read_remote_blacklist_file(): array {
        $path = self::get_remote_blacklist_file_path();
        if ( ! $path || ! is_readable( $path ) ) {
            return [];
        }

        $raw = file_get_contents( $path );
        if ( ! is_string( $raw ) || $raw === '' ) {
            return [];
        }

        $decoded = json_decode( $raw, true );
        if ( ! is_array( $decoded ) || empty( $decoded['ips'] ) || ! is_array( $decoded['ips'] ) ) {
            return [];
        }

        $ips = array_filter( $decoded['ips'], static fn( $ip ) => is_string( $ip ) && filter_var( $ip, FILTER_VALIDATE_IP ) );
        return array_values( array_unique( $ips ) );
    }

    private static function get_remote_blacklist_file_path(): ?string {
        $uploads = wp_upload_dir();
        if ( empty( $uploads['basedir'] ) || ! is_string( $uploads['basedir'] ) ) {
            return null;
        }

        return trailingslashit( $uploads['basedir'] ) . self::REMOTE_BLACKLIST_FILE_REL;
    }

    private static function get_remote_blacklist_meta(): array {
        $meta = get_option( self::REMOTE_BLACKLIST_META, [] );
        return is_array( $meta ) ? $meta : [];
    }

    private static function set_remote_blacklist_meta( array $meta ): void {
        update_option( self::REMOTE_BLACKLIST_META, $meta, false );
    }

    private static function get_whitelisted_ips_set(): array {
        global $wpdb;
        // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- static query with no user input; security data must not be served from cache
        $ips = $wpdb->get_col(
            "SELECT value FROM {$wpdb->prefix}madeit_security_whitelist WHERE type='ip'"
        );
        // phpcs:enable WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
        return array_flip( $ips );
    }

    private static function audit( string $action, string $obj_type, string $obj_id, string $desc ): void {
        global $wpdb;
        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $wpdb->insert(
            $wpdb->prefix . 'madeit_security_audit_log',
            [
                'user_id'     => get_current_user_id(),
                'username'    => wp_get_current_user()->user_login,
                'action'      => $action,
                'object_type' => $obj_type,
                'object_id'   => $obj_id,
                'description' => $desc,
                'ip'          => \MadeIT\Security\RequestLogger::get_real_ip(),
                'created_at'  => current_time( 'mysql' ),
            ],
            [ '%d','%s','%s','%s','%s','%s','%s','%s' ]
        );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
    }
}
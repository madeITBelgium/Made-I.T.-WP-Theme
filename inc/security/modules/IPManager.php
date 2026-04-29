<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

class IPManager {

    public static function init(): void {
        add_action( 'wp_ajax_madeit_security_block_ip',      [ __CLASS__, 'ajax_block_ip' ] );
        add_action( 'wp_ajax_madeit_security_unblock_ip',    [ __CLASS__, 'ajax_unblock_ip' ] );
        add_action( 'wp_ajax_madeit_security_whitelist_ip',  [ __CLASS__, 'ajax_whitelist_ip' ] );
        add_action( 'wp_ajax_madeit_security_get_ip_info',   [ __CLASS__, 'ajax_get_ip_info' ] );
        add_action( 'wp_ajax_madeit_security_live_visitors',  [ __CLASS__, 'ajax_live_visitors' ] );
        add_action( 'wp_ajax_madeit_security_visitor_log',    [ __CLASS__, 'ajax_visitor_log' ] );
        add_action( 'wp_ajax_madeit_security_visitor_stats',  [ __CLASS__, 'ajax_visitor_stats' ] );
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
        $existing = $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}madeit_security_blocked_ips WHERE ip = %s", $ip
        ) );

        if ( $existing ) {
            return (bool) $wpdb->update(
                $wpdb->prefix . 'madeit_security_blocked_ips',
                [
                    'reason'        => $reason,
                    'rule_id'       => $rule_id,
                    'permanent'     => $permanent,
                    'blocked_until' => $blocked_until,
                    'updated_at'    => current_time( 'mysql' ),
                ],
                [ 'ip' => $ip ],
                [ '%s','%s','%d','%s','%s' ],
                [ '%s' ]
            );
        }

        return (bool) $wpdb->insert(
            $wpdb->prefix . 'madeit_security_blocked_ips',
            [
                'ip'            => $ip,
                'reason'        => $reason,
                'rule_id'       => $rule_id,
                'permanent'     => $permanent,
                'blocked_until' => $blocked_until,
                'created_by'    => $by_user ?: get_current_user_id(),
                'created_at'    => current_time( 'mysql' ),
                'updated_at'    => current_time( 'mysql' ),
            ],
            [ '%s','%s','%s','%d','%s','%d','%s','%s' ]
        );
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
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        return (bool) $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$wpdb->prefix}madeit_security_blocked_ips
            WHERE ip = %s
                AND (permanent = 1 OR blocked_until > %s)
            LIMIT 1",
            $ip,
            current_time( 'mysql' )
        ) );
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
        return array_flip( $ips );
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
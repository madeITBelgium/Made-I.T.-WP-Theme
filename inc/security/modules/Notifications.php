<?php
namespace MadeIT\Security\modules;

defined( 'ABSPATH' ) || exit;

/**
 * Handles email, webhook, and Slack notifications for security events.
 */
class Notifications {

    // Deduplication cache: track last notification time per event type
    private static array $sent = [];

    public static function init(): void {
        // Hook into security events
        add_action( 'madeit_security_security_event', [ __CLASS__, 'handle_event' ], 10, 3 );

        // Daily digest
        if ( ! wp_next_scheduled( 'madeit_security_daily_digest' ) ) {
            wp_schedule_event(
                strtotime( 'tomorrow 08:00:00' ),
                'daily',
                'madeit_security_daily_digest'
            );
        }
        add_action( 'madeit_security_daily_digest', [ __CLASS__, 'send_daily_digest' ] );
    }

    // ── Main entry point ───────────────────────────────────────────────────────
    public static function handle_event( string $type, string $message, string $severity = 'medium' ): void {
        // Dedup: same type within 5 minutes = skip
        $key = $type . '_' . wp_date( 'YmdHi' );
        if ( isset( self::$sent[ $key ] ) ) return;
        self::$sent[ $key ] = true;

        $threshold = \MadeIT\Security\Settings::string( 'madeit_security_notify_severity', 'high' );
        $levels    = [ 'low' => 0, 'medium' => 1, 'high' => 2, 'critical' => 3 ];
        if ( ( $levels[ $severity ] ?? 0 ) < ( $levels[ $threshold ] ?? 2 ) ) return;

        self::send_alert( ucwords( str_replace( '_', ' ', $type ) ), $message, $severity );
    }

    public static function send_alert( string $subject, string $body, string $severity = 'high' ): void {
        $email = \MadeIT\Security\Settings::string( 'madeit_security_notify_email', get_option( 'admin_email' ) );
        if ( $email && \MadeIT\Security\Settings::bool( 'madeit_security_notify_email_enabled', true ) ) {
            self::send_email( $email, $subject, $body, $severity );
        }

        $webhook = \MadeIT\Security\Settings::string( 'madeit_security_webhook_url', '' );
        if ( $webhook && \MadeIT\Security\Settings::bool( 'madeit_security_notify_webhook_enabled', false ) ) {
            self::send_webhook( $webhook, $subject, $body, $severity );
        }

        $slack = \MadeIT\Security\Settings::string( 'madeit_security_slack_webhook_url', '' );
        if ( $slack && \MadeIT\Security\Settings::bool( 'madeit_security_notify_slack_enabled', false ) ) {
            self::send_slack( $slack, $subject, $body, $severity );
        }
    }

    // ── Email ──────────────────────────────────────────────────────────────────
    private static function send_email( string $to, string $subject, string $body, string $severity ): void {
        $site  = esc_html( get_bloginfo( 'name' ) );
        $url   = esc_url( home_url() );
        $ip    = esc_html( \MadeIT\Security\RequestLogger::get_real_ip() );
        $time  = esc_html( current_time( 'mysql' ) );
        $subject = esc_html( $subject );
        $body    = esc_html( $body );
        $color = match ( $severity ) {
            'critical' => '#c0392b',
            'high'     => '#e67e22',
            'medium'   => '#2471a3',
            default    => '#27ae60',
        };
        $badge = strtoupper( $severity );

        $html = '<!DOCTYPE html>'
            . '<html><head><meta charset="utf-8"></head>'
            . '<body style="margin:0;padding:0;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;">'
            . '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 20px;">'
            . '<tr><td align="center">'
            . '<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1);">'
            . '<tr><td style="background:' . $color . ';padding:24px 32px;">'
            . '<p style="margin:0;color:#fff;font-size:0.8rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;">Security Alert</p>'
            . '<h1 style="margin:8px 0 0;color:#fff;font-size:1.4rem;">' . $subject . '</h1>'
            . '</td></tr>'
            . '<tr><td style="padding:28px 32px;">'
            . '<p style="margin:0 0 20px;color:#555;line-height:1.7;white-space:pre-line;">' . $body . '</p>'
            . '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-radius:8px;padding:16px;">'
            . '<tr><td style="padding:4px 12px;color:#888;font-size:.8rem;">Site</td>'
            . '<td style="padding:4px 12px;color:#333;font-size:.8rem;font-weight:600;">' . $site . '</td></tr>'
            . '<tr><td style="padding:4px 12px;color:#888;font-size:.8rem;">URL</td>'
            . '<td style="padding:4px 12px;color:#333;font-size:.8rem;">' . $url . '</td></tr>'
            . '<tr><td style="padding:4px 12px;color:#888;font-size:.8rem;">Time</td>'
            . '<td style="padding:4px 12px;color:#333;font-size:.8rem;">' . $time . '</td></tr>'
            . '<tr><td style="padding:4px 12px;color:#888;font-size:.8rem;">IP</td>'
            . '<td style="padding:4px 12px;color:#333;font-size:.8rem;font-family:monospace;">' . $ip . '</td></tr>'
            . '<tr><td style="padding:4px 12px;color:#888;font-size:.8rem;">Severity</td>'
            . '<td style="padding:4px 12px;">'
            . '<span style="background:' . $color . ';color:#fff;padding:2px 8px;border-radius:12px;font-size:.7rem;font-weight:700;">' . $badge . '</span>'
            . '</td></tr></table>'
            . '<p style="margin:20px 0 0;">'
            . '<a href="' . $url . '/wp-admin/admin.php?page=madeit-security" style="background:' . $color . ';color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:.85rem;">'
            . 'View Security Dashboard &rarr;</a></p>'
            . '</td></tr>'
            . '<tr><td style="background:#f8f9fa;padding:16px 32px;text-align:center;">'
            . '<p style="margin:0;color:#aaa;font-size:.72rem;">'
            . 'Security on ' . $site . ' | <a href="' . $url . '/wp-admin/admin.php?page=madeit-security-settings" style="color:#aaa;">Manage Alerts</a>'
            . '</p></td></tr>'
            . '</table></td></tr></table>'
            . '</body></html>';

        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: Security <' . get_option( 'admin_email' ) . '>',
        ];

        wp_mail( $to, "[{$badge}] {$subject} — {$site}", $html, $headers );
    }

    // ── Webhook (generic JSON) ─────────────────────────────────────────────────
    private static function send_webhook( string $url, string $subject, string $body, string $severity ): void {
        // SSRF protection: reject private/internal URLs
        if ( ! wp_http_validate_url( $url ) ) return;

        wp_remote_post( $url, [
            'body'    => wp_json_encode( [
                'source'    => 'madeit-security',
                'site'      => home_url(),
                'subject'   => $subject,
                'body'      => $body,
                'severity'  => $severity,
                'timestamp' => current_time( 'c' ),
                'ip'        => \MadeIT\Security\RequestLogger::get_real_ip(),
            ] ),
            'headers' => [ 'Content-Type' => 'application/json' ],
            'timeout' => 5,
            'blocking'=> false,
        ] );
    }

    // ── Slack ──────────────────────────────────────────────────────────────────
    private static function send_slack( string $url, string $subject, string $body, string $severity ): void {
        // SSRF protection: reject private/internal URLs
        if ( ! wp_http_validate_url( $url ) ) return;
        $color = match ( $severity ) {
            'critical' => '#c0392b',
            'high'     => '#e67e22',
            'medium'   => '#2471a3',
            default    => '#27ae60',
        };
        wp_remote_post( $url, [
            'body'    => wp_json_encode( [
                'text'        => "🛡️ *Security Alert* — " . home_url(),
                'attachments' => [ [
                    'color'   => $color,
                    'title'   => $subject,
                    'text'    => $body,
                    'fields'  => [
                        [ 'title' => 'Severity', 'value' => strtoupper( $severity ), 'short' => true ],
                        [ 'title' => 'Time',     'value' => current_time( 'mysql' ),  'short' => true ],
                        [ 'title' => 'IP',       'value' => \MadeIT\Security\RequestLogger::get_real_ip(), 'short' => true ],
                    ],
                    'footer'  => 'Security',
                    'ts'      => time(),
                ] ],
            ] ),
            'headers' => [ 'Content-Type' => 'application/json' ],
            'timeout' => 5,
            'blocking'=> false,
        ] );
    }

    // ── Daily digest ───────────────────────────────────────────────────────────
    public static function send_daily_digest(): void {
        if ( ! \MadeIT\Security\Settings::bool( 'madeit_security_notify_digest', true ) ) return;

        global $wpdb;
        $cutoff_24h = wp_date( 'Y-m-d H:i:s', time() - DAY_IN_SECONDS );
        // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
        $total   = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_visitor_log WHERE created_at >= %s", $cutoff_24h ) );
        $bots    = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_visitor_log WHERE is_bot=1 AND created_at >= %s", $cutoff_24h ) );
        $blocked = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events WHERE created_at >= %s", $cutoff_24h ) );
        $waf     = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events WHERE event_type = %s AND created_at >= %s", 'waf_block', $cutoff_24h ) );
        $logins  = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}madeit_security_events WHERE event_type = %s AND created_at >= %s", 'login_failed', $cutoff_24h ) );
        // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching

        $body = "📊 Security Daily Digest\n\n"
            . "Last 24 hours on " . home_url() . ":\n\n"
            . "• Total requests:      $total\n"
            . "• Bot requests:        $bots\n"
            . "• Security events:     $blocked\n"
            . "• WAF blocks:          $waf\n"
            . "• Failed logins:       $logins\n\n"
            . "View your full dashboard: " . admin_url( 'admin.php?page=madeit-security' );

        self::send_alert( 'Daily Security Digest', $body, 'low' );
    }
}
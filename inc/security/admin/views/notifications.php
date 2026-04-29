<?php
defined( 'ABSPATH' ) || exit;
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">&#x1f514;</span>
            <div>
                <h1 class="madeit-security-page-title">Notifications</h1>
                <p class="madeit-security-page-sub">Configure how and when you receive security alerts</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content" style="max-width:720px">

    <div id="settings-saved-notice" class="madeit-security-notice madeit-security-notice--success" style="display:none;">Settings saved.</div>

    <!-- ── EMAIL NOTIFICATIONS ──────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Email Notifications</h2></div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable Email Alerts</strong>
                    <p class="madeit-security-desc">Send email notifications when security events occur</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox" name="madeit_security_notify_email_enabled" class="madeit-security-setting-input" value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_notify_email_enabled', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Alert Email Address</label>
                <input type="email"
                       name="madeit_security_notify_email"
                       value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_notify_email', \MadeIT\Security\Settings::get( 'admin_email' ) ) ); ?>"
                       class="madeit-security-input madeit-security-setting-input"
                       placeholder="admin@example.com" />
                <p class="madeit-security-desc">Security alerts, lockout notifications, and scan reports are sent here</p>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Minimum Severity</label>
                <select name="madeit_security_notify_severity" class="madeit-security-input madeit-security-input--sm madeit-security-setting-input">
                    <option value="low"      <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_notify_severity', 'medium' ), 'low' ); ?>>Low (all events)</option>
                    <option value="medium"   <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_notify_severity', 'medium' ), 'medium' ); ?>>Medium (recommended)</option>
                    <option value="high"     <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_notify_severity', 'medium' ), 'high' ); ?>>High</option>
                    <option value="critical" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_notify_severity', 'medium' ), 'critical' ); ?>>Critical only</option>
                </select>
                <p class="madeit-security-desc">Only send alerts for events at or above this severity level</p>
            </div>

        </div>
    </div>

    <!-- ── DAILY DIGEST ─────────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Daily Digest</h2></div>
        <div class="madeit-security-form-body">
            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable Daily Digest</strong>
                    <p class="madeit-security-desc">Receive a daily summary of security activity at 8:00 AM (total requests, bots, blocked IPs, WAF events, failed logins)</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox" name="madeit_security_notify_digest" class="madeit-security-setting-input" value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_notify_digest', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>
        </div>
    </div>

    <!-- ── SLACK ─────────────────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Slack Integration</h2></div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable Slack Notifications</strong>
                    <p class="madeit-security-desc">Post security alerts to a Slack channel via incoming webhook</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox" name="madeit_security_notify_slack_enabled" class="madeit-security-setting-input" value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_notify_slack_enabled', false ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Slack Webhook URL</label>
                <input type="url"
                       name="madeit_security_slack_webhook_url"
                       value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_slack_webhook_url', '' ) ); ?>"
                       class="madeit-security-input madeit-security-setting-input"
                       placeholder="https://hooks.slack.com/services/..." />
                <p class="madeit-security-desc">Create an incoming webhook in your Slack workspace settings and paste the URL here</p>
            </div>

        </div>
    </div>

    <!-- ── GENERIC WEBHOOK ───────────────────────────────────────────────── -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Custom Webhook</h2></div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable Webhook</strong>
                    <p class="madeit-security-desc">Send JSON event payloads to a custom endpoint (for SIEM, Discord, Telegram bots, etc.)</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox" name="madeit_security_notify_webhook_enabled" class="madeit-security-setting-input" value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_notify_webhook_enabled', false ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Webhook URL</label>
                <input type="url"
                       name="madeit_security_webhook_url"
                       value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_webhook_url', '' ) ); ?>"
                       class="madeit-security-input madeit-security-setting-input"
                       placeholder="https://example.com/webhook" />
                <p class="madeit-security-desc">POST requests with JSON body: <code>{ event_type, severity, ip, description, timestamp }</code></p>
            </div>

        </div>
    </div>

    <!-- ── SAVE ──────────────────────────────────────────────────────────── -->
    <div style="padding:4px 0 24px">
        <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-settings" style="width:100%;padding:12px 24px;font-size:.95rem">Save Notification Settings</button>
    </div>

    </div><!-- /.madeit-security-page-content -->

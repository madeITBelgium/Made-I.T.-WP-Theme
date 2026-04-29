<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

$enabled        = (bool) \MadeIT\Security\Settings::get( 'madeit_security_twofa_enabled', false );
$required_roles = \MadeIT\Security\Settings::get( 'madeit_security_twofa_required_roles', 'administrator' );
if ( is_string( $required_roles ) ) {
    $required_roles = array_filter( array_map( 'trim', explode( ',', $required_roles ) ) );
}
$all_roles = wp_roles()->get_names();

// Count users with 2FA enabled
global $wpdb;
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
$users_with_2fa = (int) $wpdb->get_var(
    "SELECT COUNT(*) FROM {$wpdb->usermeta} WHERE meta_key = 'madeit_security_2fa_enabled' AND meta_value = '1'"
);
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- security data must not be served from cache
$total_admins = (int) $wpdb->get_var(
    $wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->usermeta} WHERE meta_key = %s AND meta_value LIKE %s",
        $wpdb->prefix . 'capabilities',
        '%administrator%'
    )
);
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">&#x1f510;</span>
            <div>
                <h1 class="madeit-security-page-title">Two-Factor Authentication</h1>
                <p class="madeit-security-page-sub">Require a second factor (TOTP or email code) to log in</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">

        <!-- MAIN COLUMN -->
        <div class="madeit-security-col-main">

        <div id="settings-saved-notice" class="madeit-security-notice madeit-security-notice--success" style="display:none;">Settings saved.</div>

        <!-- ── MASTER TOGGLE ─────────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Two-Factor Settings</h2></div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Enable Two-Factor Authentication</strong>
                        <p class="madeit-security-desc">When enabled, users in the required roles must verify a second factor after entering their password</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox" name="madeit_security_twofa_enabled" class="madeit-security-setting-input" value="1"
                               <?php checked( $enabled ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- ── REQUIRED ROLES ────────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Required Roles</h2></div>
            <div class="madeit-security-form-body">
                <p class="madeit-security-desc" style="margin-bottom:12px">Select which user roles are required to set up 2FA. Users in these roles won't be able to log in without configuring a second factor.</p>
                <?php foreach ( $all_roles as $role_slug => $role_name ) : ?>
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong><?php echo esc_html( $role_name ); ?></strong>
                        <p class="madeit-security-desc"><code><?php echo esc_html( $role_slug ); ?></code></p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox"
                               class="madeit-security-2fa-role-checkbox"
                               value="<?php echo esc_attr( $role_slug ); ?>"
                               <?php checked( in_array( $role_slug, $required_roles, true ) ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
                <?php endforeach; ?>
                <!-- Hidden input that collects checked roles -->
                <input type="hidden" name="madeit_security_twofa_required_roles" class="madeit-security-setting-input" id="madeit-security-2fa-roles-value"
                       value="<?php echo esc_attr( implode( ',', $required_roles ) ); ?>" />
            </div>
        </div>

        <!-- ── METHODS INFO ──────────────────────────────────────────────── -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Supported Methods</h2></div>
            <div class="madeit-security-form-body">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                    <div style="padding:14px;background:var(--c-surface-off);border-radius:var(--r-md)">
                        <strong style="font-size:.9rem">TOTP (Authenticator App)</strong>
                        <p class="madeit-security-desc" style="margin-top:6px">Time-based one-time passwords via Google Authenticator, Authy, 1Password, or any TOTP app. 30-second code rotation.</p>
                    </div>
                    <div style="padding:14px;background:var(--c-surface-off);border-radius:var(--r-md)">
                        <strong style="font-size:.9rem">Email OTP</strong>
                        <p class="madeit-security-desc" style="margin-top:6px">A 6-digit code is emailed to the user. Valid for 10 minutes. Simpler setup but requires reliable email delivery.</p>
                    </div>
                </div>
                <div class="madeit-security-notice madeit-security-notice--info" style="margin-top:14px">
                    Users configure their 2FA method in their WordPress profile page (Users &rarr; Profile). 10 recovery codes are generated during setup for emergency access.
                </div>
            </div>
        </div>

        <!-- ── SAVE ──────────────────────────────────────────────────────── -->
        <div style="padding:4px 0 24px">
            <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-settings" style="width:100%;padding:12px 24px;font-size:.95rem">Save 2FA Settings</button>
        </div>

        </div><!-- /col-main -->

        <!-- SIDEBAR -->
        <div class="madeit-security-col-side">

            <!-- ── STATS ─────────────────────────────────────────────────── -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">2FA Adoption</h2></div>
                <div class="madeit-security-form-body" style="text-align:center">
                    <div style="font-size:2rem;font-weight:700;color:var(--c-primary,#1847F0)"><?php echo esc_html( $users_with_2fa ); ?></div>
                    <p class="madeit-security-desc">Users with 2FA enabled</p>
                    <?php if ( $total_admins > 0 ) : ?>
                    <div style="margin-top:10px;font-size:.82rem;color:var(--c-text-3)">
                        <?php echo esc_html( $total_admins ); ?> administrator<?php echo $total_admins > 1 ? 's' : ''; ?> total
                    </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- ── SECURITY NOTE ─────────────────────────────────────────── -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Why 2FA?</h2></div>
                <div class="madeit-security-form-body">
                    <p class="madeit-security-desc">Even if an attacker discovers a password through brute force, phishing, or credential stuffing, they still need the second factor to log in.</p>
                    <ul class="madeit-security-desc" style="padding-left:18px;list-style:disc;margin-top:8px">
                        <li>Blocks 99.9% of automated account compromise</li>
                        <li>Required for compliance (PCI DSS, SOC 2)</li>
                        <li>Recovery codes prevent permanent lockout</li>
                    </ul>
                </div>
            </div>

        </div><!-- /col-side -->

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

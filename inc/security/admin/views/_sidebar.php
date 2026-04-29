<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
/**
 * Inner sidebar navigation (Nexus SEO style).
 * Rendered by Admin::page_open() — receives $active_slug.
 */
defined( 'ABSPATH' ) || exit;

$menu_items = [
    // Dashboard — pinned first
    [ 'madeit-security',                  'Dashboard',        '&#x25C6;' ],

    // Alphabetical A-Z
    [ 'madeit-security-ai-crawlers',      'AI Crawlers',      '&#x229B;' ],
    [ 'madeit-security-audit',            'Audit Log',        '&#x2630;' ],
    [ 'madeit-security-cron',             'Cron Guard',       '&#x23F1;' ],
    [ 'madeit-security-geoip',            'GeoIP Database',   '&#x2295;' ],
    [ 'madeit-security-hardening',        'Hardening',        '&#x25C8;' ],
    [ 'madeit-security-honeypot',         'Honeypot',         '&#x2B21;' ],
    [ 'madeit-security-ip-mgmt',          'IP Block List',    '&#x2298;' ],
    [ 'madeit-security-whitelist',        'IP Whitelist',     '&#x25CE;' ],
    [ 'madeit-security-login',            'Login Security',   '&#x26B7;' ],
    [ 'madeit-security-scanner',          'Malware Scanner',  '&#x2299;' ],
    [ 'madeit-security-notifications',    'Notifications',    '&#x25C9;' ],
    [ 'madeit-security-outbound',         'Outbound Monitor', '&#x21C4;' ],
    [ 'madeit-security-password-policy',  'Password Policy',  '&#x25A1;' ],
    [ 'madeit-security-post-breach',      'Post-Breach',      '&#x229E;' ],
    [ 'madeit-security-rest-api',         'REST API',         '&#x27E1;' ],
    [ 'madeit-security-headers',          'Security Headers', '&#x25E7;' ],
    [ 'madeit-security-sessions',         'Session Security', '&#x25D1;' ],
    [ 'madeit-security-2fa',              'Two-Factor Auth',  '&#x229F;' ],
    [ 'madeit-security-visitor-log',      'Visitor Log',      '&#x25EB;' ],
    [ 'madeit-security-vuln-audit',       'Vuln Audit',       '&#x2690;' ],
    [ 'madeit-security-waf',              'WAF',              '&#x25C6;' ],
];

$bottom_items = [
    [ 'madeit-security-settings',         'Settings',         '&#x2699;' ],
    [ 'madeit-security-about',            'About',            '&#x24D8;' ],
    [ 'madeit-security-setup',            'Setup Wizard',     '&#x2606;' ],
];
?>
<nav class="madeit-security-sidebar">

    <!-- Brand -->
    <div class="madeit-security-sidebar__brand">
        <img src="<?php echo esc_url( madeit_security_brand_logo_url() ); ?>"
             alt="<?php echo esc_attr( madeit_security_brand_name() ); ?>"
             class="madeit-security-sidebar__brand-logo" />
        <span class="madeit-security-sidebar__brand-name" style="display: none;"><?php echo esc_html( madeit_security_brand_name() ); ?></span>
    </div>

    <!-- Main nav -->
    <div class="madeit-security-sidebar__nav">
        <?php foreach ( $menu_items as [ $slug, $label, $icon ] ) : ?>
            <a href="<?php echo esc_url( admin_url( 'admin.php?page=' . $slug ) ); ?>"
               class="madeit-security-sidebar__item<?php echo $active_slug === $slug ? ' madeit-security-sidebar__item--active' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static CSS class ?>">
                <span class="madeit-security-sidebar__icon"><?php echo wp_kses( $icon, [] ); ?></span>
                <?php echo esc_html( $label ); ?>
            </a>
        <?php endforeach; ?>

        <div class="madeit-security-sidebar__sep"></div>

        <?php foreach ( $bottom_items as [ $slug, $label, $icon ] ) : ?>
            <a href="<?php echo esc_url( admin_url( 'admin.php?page=' . $slug ) ); ?>"
               class="madeit-security-sidebar__item<?php echo $active_slug === $slug ? ' madeit-security-sidebar__item--active' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static CSS class ?>">
                <span class="madeit-security-sidebar__icon"><?php echo wp_kses( $icon, [] ); ?></span>
                <?php echo esc_html( $label ); ?>
            </a>
        <?php endforeach; ?>
    </div>

    <!-- Footer -->
    <div class="madeit-security-sidebar__footer">
        v<?php echo esc_html( MADEIT_VERSION ); ?>
    </div>

</nav>

<?php defined( 'ABSPATH' ) || exit; // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function ?>
    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🔒</span>
            <div><h1 class="madeit-security-page-title">Hardening Status</h1><p class="madeit-security-page-sub">WordPress security hardening checklist</p></div>
        </div>
    </div>
    <div class="madeit-security-page-content">
    <?php
    $checks = [
        [ 'label' => 'WordPress File Editor Disabled',      'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_disable_file_editor', true ),            'opt' => 'madeit_security_disable_file_editor',   'desc' => 'Prevents editing theme/plugin files from wp-admin' ],
        [ 'label' => 'WordPress Debug Mode Off',             'ok' => ! ( defined( 'WP_DEBUG' ) && WP_DEBUG ),                         'opt' => null,                          'desc' => 'Debug mode off prevents error leakage' ],
        [ 'label' => 'XML-RPC Disabled',                     'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_block_xmlrpc', true ),                  'opt' => 'madeit_security_block_xmlrpc',          'desc' => 'XML-RPC is a common brute force and DDoS vector' ],
        [ 'label' => 'WordPress Version Hidden',             'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_hide_wp_version', true ),               'opt' => 'madeit_security_hide_wp_version',       'desc' => 'Hides version from meta tags and feeds' ],
        [ 'label' => 'REST API User Enumeration Blocked',    'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_block_rest_users', true ),              'opt' => 'madeit_security_block_rest_users',      'desc' => 'Blocks /wp-json/wp/v2/users for unauthenticated' ],
        [ 'label' => 'Author Enumeration Blocked',           'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_block_author_enum', true ),             'opt' => 'madeit_security_block_author_enum',     'desc' => 'Blocks ?author=N username discovery' ],
        [ 'label' => 'Visitor Logging Enabled',              'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_log_enabled', true ),                   'opt' => 'madeit_security_log_enabled',           'desc' => 'Logs all requests for threat monitoring' ],
        [ 'label' => 'HTTPS Forced for Admin',               'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_force_ssl_admin', false ),               'opt' => 'madeit_security_force_ssl_admin',       'desc' => 'Forces HTTPS on all admin and login pages' ],
        [ 'label' => 'PHP Uploads Directory Protected',      'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_block_php_uploads', true ),             'opt' => 'madeit_security_block_php_uploads',     'desc' => 'Blocks PHP execution in uploads directory' ],
        [ 'label' => 'Directory Listing Disabled',           'ok' => ! is_readable( ABSPATH . 'wp-content/uploads/index.html' ),      'opt' => null,                          'desc' => 'Ensure Options -Indexes is in .htaccess' ],
        [ 'label' => 'Auto-Update Plugins',                  'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_auto_update_plugins', false ),            'opt' => 'madeit_security_auto_update_plugins',   'desc' => 'Automatically install plugin updates to patch vulnerabilities' ],
        [ 'label' => 'Auto-Update Themes',                   'ok' => (bool) \MadeIT\Security\Settings::get( 'madeit_security_auto_update_themes', false ),             'opt' => 'madeit_security_auto_update_themes',    'desc' => 'Automatically install theme updates to patch vulnerabilities' ],
    ];
    $pass  = count( array_filter( $checks, fn($c) => $c['ok'] ) );
    $total = count( $checks );
    $pct   = round( ( $pass / $total ) * 100 );
    ?>
    <div class="madeit-security-score-bar-wrap">
        <div class="madeit-security-score-bar">
            <div class="madeit-security-score-bar__fill" style="width:<?php echo esc_attr( $pct ); ?>%; background: <?php echo esc_attr( $pct >= 80 ? '#1e8449' : ( $pct >= 50 ? '#e67e22' : '#c0392b' ) ); ?>;"></div>
        </div>
        <span class="madeit-security-score-label"><?php echo esc_html( $pass ); ?>/<?php echo esc_html( $total ); ?> checks passed (<?php echo esc_html( $pct ); ?>%)</span>
    </div>
    <div class="madeit-security-panel madeit-security-panel--no-header">
        <div class="madeit-security-table-wrapper">
            <table class="madeit-security-table">
                <thead><tr><th>Check</th><th>Status</th><th>Description</th><th>Action</th></tr></thead>
                <tbody>
                    <?php foreach ( $checks as $c ) : ?>
                        <tr class="<?php echo $c['ok'] ? '' : 'madeit-security-row--warning'; ?>">
                            <td><?php echo esc_html( $c['label'] ); ?></td>
                            <td>
                                <?php if ( $c['ok'] ) : ?>
                                    <span class="madeit-security-badge madeit-security-badge--green">✓ Secure</span>
                                <?php else : ?>
                                    <span class="madeit-security-badge madeit-security-badge--red">✗ At Risk</span>
                                <?php endif; ?>
                            </td>
                            <td><small><?php echo esc_html( $c['desc'] ); ?></small></td>
                            <td>
                                <?php if ( ! $c['ok'] && $c['opt'] ) : ?>
                                    <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--primary madeit-security-toggle-setting"
                                            data-option="<?php echo esc_attr( $c['opt'] ); ?>"
                                            data-value="1">Enable</button>
                                <?php elseif ( ! $c['ok'] ) : ?>
                                    <span class="madeit-security-text-muted">Manual fix required</span>
                                <?php else : ?>
                                    <span class="madeit-security-text-muted">—</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    </div><!-- /.madeit-security-page-content -->

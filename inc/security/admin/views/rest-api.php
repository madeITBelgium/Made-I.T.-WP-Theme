<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

$policies_enabled = (bool) \MadeIT\Security\Settings::get( 'madeit_security_rest_policies_enabled', true );
$policies         = \MadeIT\Security\modules\RestApiPolicy::get_policies();
$namespaces       = [];

// REST server may not be initialised during admin page load.
if ( did_action( 'rest_api_init' ) ) {
    $namespaces = \MadeIT\Security\modules\RestApiPolicy::get_available_namespaces();
} else {
    do_action( 'rest_api_init', rest_get_server() ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- triggering WP core hook
    $namespaces = \MadeIT\Security\modules\RestApiPolicy::get_available_namespaces();
}

// Quick stats.
$total_policies    = count( $policies );
$auth_policies     = count( array_filter( $policies, fn( $p ) => ! empty( $p['auth_required'] ) ) );
$rl_policies       = count( array_filter( $policies, fn( $p ) => ! empty( $p['rate_limit'] ) && (int) $p['rate_limit'] > 0 ) );
$disabled_policies = count( array_filter( $policies, fn( $p ) => ! empty( $p['disabled'] ) ) );
$active_policies   = $total_policies - $disabled_policies;

$all_methods = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH' ];
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">&#x1F50C;</span>
            <div>
                <h1 class="madeit-security-page-title">REST API Policies</h1>
                <p class="madeit-security-page-sub">Per-route security rules for the WordPress REST API</p>
            </div>
        </div>
        <div class="madeit-security-page-header__right">
            <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-rest-policies">Save Policies</button>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">

        <div class="madeit-security-col-main">

            <!-- ══ MASTER TOGGLE + INFO ══════════════════════════════════════════ -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Policy Engine</h2>
                    <span class="madeit-security-badge <?php echo $policies_enabled ? 'madeit-security-badge--green' : 'madeit-security-badge--gray'; ?>" id="rest-policies-status-badge">
                        <?php echo $policies_enabled ? 'Active' : 'Disabled'; ?>
                    </span>
                </div>
                <div class="madeit-security-form-body">
                    <div class="madeit-security-form-row madeit-security-form-row--toggle">
                        <div>
                            <strong>Enable REST API Policies</strong>
                            <p class="madeit-security-desc">When enabled, all incoming REST API requests are evaluated against your policy rules</p>
                        </div>
                        <label class="madeit-security-toggle">
                            <input type="checkbox" id="rest-policies-enabled" <?php checked( $policies_enabled ); ?> />
                            <span class="madeit-security-toggle__slider"></span>
                        </label>
                    </div>
                    <div class="madeit-security-notice madeit-security-notice--info">
                        Policies are evaluated in order. The first matching policy wins. Whitelisted IPs bypass all policies.
                    </div>
                </div>
            </div>

            <!-- ══ ACTIVE POLICIES TABLE ═════════════════════════════════════════ -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">
                        Active Policies
                        <span class="madeit-security-badge madeit-security-badge--blue"><?php echo esc_html( $total_policies ); ?></span>
                    </h2>
                </div>
                <div class="madeit-security-table-wrapper">
                    <table class="madeit-security-table" id="rest-policies-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Namespace</th>
                                <th>Route</th>
                                <th>Auth Required</th>
                                <th>Methods</th>
                                <th>Rate Limit</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if ( empty( $policies ) ) : ?>
                                <tr>
                                    <td colspan="8" class="madeit-security-empty-cell">No policies configured. Add your first policy below.</td>
                                </tr>
                            <?php else : ?>
                                <?php foreach ( $policies as $index => $policy ) :
                                    $is_disabled = ! empty( $policy['disabled'] );
                                    $policy_id   = isset( $policy['id'] ) ? $policy['id'] : '';
                                    $namespace   = isset( $policy['namespace'] ) ? $policy['namespace'] : '';
                                    $route       = isset( $policy['route_pattern'] ) ? $policy['route_pattern'] : '';
                                    $auth_req    = ! empty( $policy['auth_required'] );
                                    $methods     = isset( $policy['methods'] ) && is_array( $policy['methods'] ) ? $policy['methods'] : [];
                                    $rate_limit  = isset( $policy['rate_limit'] ) ? (int) $policy['rate_limit'] : 0;
                                    $description = isset( $policy['description'] ) ? $policy['description'] : '';
                                ?>
                                <tr class="<?php echo $is_disabled ? 'madeit-security-row--muted' : ''; ?>" data-policy-id="<?php echo esc_attr( $policy_id ); ?>">
                                    <td><strong><?php echo esc_html( $index + 1 ); ?></strong></td>
                                    <td><code><?php echo esc_html( $namespace ?: '*' ); ?></code></td>
                                    <td>
                                        <?php if ( $route ) : ?>
                                            <code><?php echo esc_html( $route ); ?></code>
                                        <?php else : ?>
                                            <em>All routes</em>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ( $auth_req ) : ?>
                                            <span class="madeit-security-badge madeit-security-badge--green">Yes</span>
                                        <?php else : ?>
                                            <span class="madeit-security-badge madeit-security-badge--gray">No</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ( ! empty( $methods ) ) : ?>
                                            <?php foreach ( $methods as $m ) : ?>
                                                <span class="madeit-security-badge madeit-security-badge--blue"><?php echo esc_html( strtoupper( $m ) ); ?></span>
                                            <?php endforeach; ?>
                                        <?php else : ?>
                                            <span class="madeit-security-badge madeit-security-badge--gray">Any</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ( $rate_limit > 0 ) : ?>
                                            <strong><?php echo esc_html( $rate_limit ); ?></strong>/min
                                        <?php else : ?>
                                            &infin;
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ( $is_disabled ) : ?>
                                            <span class="madeit-security-badge madeit-security-badge--red">Disabled</span>
                                        <?php else : ?>
                                            <span class="madeit-security-badge madeit-security-badge--green">Enabled</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="madeit-security-actions-cell">
                                        <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost madeit-security-edit-policy-btn"
                                                data-policy-id="<?php echo esc_attr( $policy_id ); ?>">Edit</button>
                                        <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--danger madeit-security-delete-policy-btn"
                                                data-policy-id="<?php echo esc_attr( $policy_id ); ?>">Delete</button>
                                    </td>
                                </tr>
                                <?php if ( $description ) : ?>
                                <tr class="madeit-security-row--description <?php echo $is_disabled ? 'madeit-security-row--muted' : ''; ?>">
                                    <td></td>
                                    <td colspan="7"><small class="madeit-security-desc"><?php echo esc_html( $description ); ?></small></td>
                                </tr>
                                <?php endif; ?>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ══ ADD NEW POLICY ════════════════════════════════════════════════ -->
            <div class="madeit-security-panel" id="add-policy-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Add New Policy</h2>
                </div>
                <div class="madeit-security-form-body">

                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">Namespace</label>
                        <select id="policy-namespace" class="madeit-security-input">
                            <option value="">All namespaces</option>
                            <?php foreach ( $namespaces as $ns ) : ?>
                                <option value="<?php echo esc_attr( $ns ); ?>"><?php echo esc_html( $ns ); ?></option>
                            <?php endforeach; ?>
                            <option value="__custom__">Custom (type below)</option>
                        </select>
                        <input type="text" id="policy-namespace-custom" class="madeit-security-input" placeholder="e.g. my-plugin/v1" style="display:none; margin-top:8px;" />
                    </div>

                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">Route Pattern</label>
                        <input type="text" id="policy-route" class="madeit-security-input" placeholder="e.g. #^/wp/v2/users# or .*" autocomplete="off" />
                        <p class="madeit-security-desc">Regex pattern to match against the route. Leave empty to match all routes in the namespace.</p>
                    </div>

                    <div class="madeit-security-form-row madeit-security-form-row--toggle">
                        <div>
                            <strong>Auth Required</strong>
                            <p class="madeit-security-desc">Block unauthenticated requests matching this policy</p>
                        </div>
                        <label class="madeit-security-toggle">
                            <input type="checkbox" id="policy-auth-required" />
                            <span class="madeit-security-toggle__slider"></span>
                        </label>
                    </div>

                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">Allowed Methods</label>
                        <div class="madeit-security-checkbox-group">
                            <?php foreach ( $all_methods as $method ) : ?>
                                <label class="madeit-security-checkbox-label">
                                    <input type="checkbox" class="policy-method-cb" value="<?php echo esc_attr( $method ); ?>" />
                                    <?php echo esc_html( $method ); ?>
                                </label>
                            <?php endforeach; ?>
                        </div>
                        <p class="madeit-security-desc">Leave all unchecked to allow any method.</p>
                    </div>

                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">Rate Limit (per minute)</label>
                        <input type="number" id="policy-rate-limit" class="madeit-security-input madeit-security-input--sm" min="0" placeholder="0 = unlimited" value="0" />
                        <p class="madeit-security-desc">Maximum requests per minute per IP. Set to 0 for unlimited.</p>
                    </div>

                    <div class="madeit-security-form-row">
                        <label class="madeit-security-label">Description</label>
                        <input type="text" id="policy-description" class="madeit-security-input" placeholder="Brief description of this policy rule" autocomplete="off" />
                    </div>

                    <button class="madeit-security-btn madeit-security-btn--primary" id="btn-add-policy">Add Policy</button>
                    <div id="add-policy-result" class="madeit-security-form-result" style="display:none;"></div>

                </div>
            </div>

        </div><!-- /.madeit-security-col-main -->

        <!-- ══ SIDEBAR ═══════════════════════════════════════════════════════ -->
        <div class="madeit-security-col-side">

            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Quick Stats</h2></div>
                <div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Total Policies</span>
                        <strong><?php echo esc_html( $total_policies ); ?></strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Active</span>
                        <span class="madeit-security-badge madeit-security-badge--green"><?php echo esc_html( $active_policies ); ?></span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Disabled</span>
                        <span class="madeit-security-badge madeit-security-badge--gray"><?php echo esc_html( $disabled_policies ); ?></span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Require Auth</span>
                        <span class="madeit-security-badge madeit-security-badge--orange"><?php echo esc_html( $auth_policies ); ?></span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Rate Limited</span>
                        <span class="madeit-security-badge madeit-security-badge--blue"><?php echo esc_html( $rl_policies ); ?></span>
                    </div>
                </div>
            </div>

            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">How Policies Work</h2></div>
                <div class="madeit-security-form-body" style="padding:12px 20px;">
                    <ul class="madeit-security-wl-tips">
                        <li><strong>Order matters</strong> &mdash; first matching rule wins</li>
                        <li><strong>Namespace</strong> &mdash; matches the REST API namespace prefix</li>
                        <li><strong>Route pattern</strong> &mdash; regex tested against the full route</li>
                        <li><strong>Auth required</strong> &mdash; blocks unauthenticated users</li>
                        <li><strong>Methods</strong> &mdash; restricts allowed HTTP methods</li>
                        <li><strong>Rate limit</strong> &mdash; sliding-window per IP per minute</li>
                    </ul>
                    <div class="madeit-security-notice madeit-security-notice--info" style="margin-top:12px; font-size:.8rem;">
                        Whitelisted IPs always bypass all REST API policies. Admins with <code>manage_options</code> bypass rate limits.
                    </div>
                </div>
            </div>

            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Detected Namespaces</h2></div>
                <div style="padding:16px 20px;">
                    <?php if ( empty( $namespaces ) ) : ?>
                        <p class="madeit-security-desc">No REST namespaces detected.</p>
                    <?php else : ?>
                        <?php foreach ( $namespaces as $ns ) : ?>
                            <div style="margin-bottom:4px;"><code><?php echo esc_html( $ns ); ?></code></div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>

        </div><!-- /.madeit-security-col-side -->

    </div><!-- /.madeit-security-main-grid -->
    </div><!-- /.madeit-security-page-content -->

<?php defined( 'ABSPATH' ) || exit; ?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🔐</span>
            <div>
                <h1 class="madeit-security-page-title">Session Security</h1>
                <p class="madeit-security-page-sub">Cookie hardening, session binding, and concurrent session management</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">
    <div class="madeit-security-col-main">

    <!-- ══ COOKIE HARDENING ════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Cookie Hardening</h2>
        </div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>HttpOnly Cookies</strong>
                    <p class="madeit-security-desc">Prevents JavaScript from accessing session cookies, mitigating XSS-based session theft.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_session_httponly"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_session_httponly', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Secure Cookies</strong>
                    <p class="madeit-security-desc">Ensures cookies are only sent over HTTPS connections, preventing interception on unencrypted channels.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_session_secure"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_session_secure', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">SameSite Attribute</label>
                <select name="madeit_security_session_samesite" class="madeit-security-input madeit-security-setting-input">
                    <option value="Strict" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_session_samesite', 'Lax' ), 'Strict' ); ?>>Strict</option>
                    <option value="Lax" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_session_samesite', 'Lax' ), 'Lax' ); ?>>Lax</option>
                    <option value="None" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_session_samesite', 'Lax' ), 'None' ); ?>>None</option>
                </select>
                <p class="madeit-security-desc">Controls when cookies are sent with cross-site requests. <strong>Strict</strong> blocks all cross-site cookie sending. <strong>Lax</strong> allows cookies on top-level navigations. <strong>None</strong> allows all cross-site cookies (requires Secure flag).</p>
            </div>

        </div>
    </div>

    <!-- ══ SESSION BINDING ═════════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Session Binding</h2>
        </div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable Session Binding</strong>
                    <p class="madeit-security-desc">Ties each session to the browser fingerprint that created it. If the fingerprint changes, the session is invalidated.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_session_binding"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_session_binding', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Bind to IP Address</strong>
                    <p class="madeit-security-desc">Invalidates the session if the client IP address changes. May cause issues for users on mobile networks or VPNs.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_session_bind_ip"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_session_bind_ip', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Bind to User-Agent</strong>
                    <p class="madeit-security-desc">Invalidates the session if the browser User-Agent string changes mid-session, indicating a possible hijack.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_session_bind_ua"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_session_bind_ua', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-notice madeit-security-notice--warn">
                Session binding detects hijacking by comparing the browser fingerprint on each request. If the IP or User-Agent changes unexpectedly, the session is destroyed to prevent unauthorized access.
            </div>

        </div>
    </div>

    <!-- ══ CONCURRENT SESSION LIMITS ═══════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Concurrent Session Limits</h2>
        </div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Max Sessions per User</label>
                <input type="number"
                       name="madeit_security_max_sessions"
                       class="madeit-security-input madeit-security-input--sm madeit-security-setting-input"
                       value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_max_sessions', 3 ) ); ?>"
                       min="0" max="50" />
                <p class="madeit-security-desc">Maximum number of simultaneous active sessions allowed per user account. Set to <strong>0</strong> for unlimited.</p>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Over-Limit Action</label>
                <select name="madeit_security_max_sessions_action" class="madeit-security-input madeit-security-setting-input">
                    <option value="destroy_oldest" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_max_sessions_action', 'destroy_oldest' ), 'destroy_oldest' ); ?>>Destroy oldest session</option>
                    <option value="block_new" <?php selected( \MadeIT\Security\Settings::get( 'madeit_security_max_sessions_action', 'destroy_oldest' ), 'block_new' ); ?>>Block new login</option>
                </select>
                <p class="madeit-security-desc">What happens when a user exceeds the session limit. <strong>Destroy oldest</strong> removes the earliest session. <strong>Block new</strong> prevents the new login entirely.</p>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Exempt Administrators</strong>
                    <p class="madeit-security-desc">Administrators bypass idle timeout, session binding, and concurrent session limits.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_session_exempt_admins"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_session_exempt_admins', false ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Idle Timeout (seconds)</label>
                <input type="number"
                       name="madeit_security_session_idle_timeout"
                       class="madeit-security-input madeit-security-input--sm madeit-security-setting-input"
                       value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_session_idle_timeout', 1800 ) ); ?>"
                       min="0" max="86400" />
                <p class="madeit-security-desc">Automatically destroy sessions that have been idle for this many seconds. Set to <strong>0</strong> to disable idle timeout. Default: 1800 (30 minutes).</p>
            </div>

        </div>
    </div>

    </div><!-- /col-main -->

    <!-- SIDEBAR -->
    <div class="madeit-security-col-side">

        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Current Session Status</h2></div>
            <div class="madeit-security-form-body">
                <p>Session security is <strong><?php echo esc_html( \MadeIT\Security\Settings::get( 'madeit_security_session_binding', true ) ? 'active' : 'inactive' ); ?></strong>.</p>
                <p class="madeit-security-desc">Cookie hardening and session binding work together to protect authenticated users from session hijacking, fixation, and replay attacks.</p>
                <ul style="margin:12px 0 0; padding-left:18px; font-size:.85rem; color:#4a5568;">
                    <li>HttpOnly: <?php echo esc_html( \MadeIT\Security\Settings::get( 'madeit_security_session_httponly', true ) ? 'Enabled' : 'Disabled' ); ?></li>
                    <li>Secure: <?php echo esc_html( \MadeIT\Security\Settings::get( 'madeit_security_session_secure', true ) ? 'Enabled' : 'Disabled' ); ?></li>
                    <li>SameSite: <?php echo esc_html( \MadeIT\Security\Settings::get( 'madeit_security_session_samesite', 'Lax' ) ); ?></li>
                    <li>Max sessions: <?php echo esc_html( \MadeIT\Security\Settings::get( 'madeit_security_max_sessions', 3 ) ); ?></li>
                    <li>Idle timeout: <?php echo esc_html( \MadeIT\Security\Settings::get( 'madeit_security_session_idle_timeout', 1800 ) ); ?>s</li>
                </ul>
            </div>
        </div>

        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Save Settings</h2></div>
            <div class="madeit-security-form-body">
                <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--full" id="btn-save-session-settings">Save Session Settings</button>
                <div id="session-settings-result" class="madeit-security-form-result" style="display:none; margin-top:10px;"></div>
            </div>
        </div>

    </div>

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

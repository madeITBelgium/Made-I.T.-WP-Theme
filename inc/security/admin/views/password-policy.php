<?php defined( 'ABSPATH' ) || exit; // phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function ?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🔑</span>
            <div>
                <h1 class="madeit-security-page-title">Password Policy</h1>
                <p class="madeit-security-page-sub">Enforce strong password requirements and generate secure passphrases for your users</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">
    <div class="madeit-security-col-main">

    <!-- ══ ENFORCEMENT TOGGLE ════════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Password Policy Enforcement</h2>
            <?php if ( \MadeIT\Security\Settings::get( 'madeit_security_password_policy_enabled', false ) ) : ?>
                <span class="madeit-security-badge madeit-security-badge--green">Active</span>
            <?php else : ?>
                <span class="madeit-security-badge madeit-security-badge--gray">Inactive</span>
            <?php endif; ?>
        </div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Enable Password Policy</strong>
                    <p class="madeit-security-desc">When enabled, password complexity rules are enforced on all password changes, resets, and new registrations across the site. A passphrase helper is also injected on user profile pages.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_password_policy_enabled"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_password_policy_enabled', false ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

        </div>
    </div>

    <!-- ══ PASSWORD REQUIREMENTS ═════════════════════════════════════════ -->
    <div class="madeit-security-panel">
        <div class="madeit-security-panel__header">
            <h2 class="madeit-security-panel__title">Password Requirements</h2>
        </div>
        <div class="madeit-security-form-body">

            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Minimum Password Length</label>
                <input type="number"
                       name="madeit_security_password_min_length"
                       class="madeit-security-input madeit-security-input--sm madeit-security-setting-input"
                       value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_password_min_length', 12 ) ); ?>"
                       min="8" max="128" />
                <p class="madeit-security-desc">Minimum number of characters required. NIST recommends at least 8; we default to 12 for stronger protection. Maximum: 128.</p>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Require Uppercase Letter (A-Z)</strong>
                    <p class="madeit-security-desc">Password must contain at least one uppercase letter.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_password_require_upper"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_password_require_upper', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Require Lowercase Letter (a-z)</strong>
                    <p class="madeit-security-desc">Password must contain at least one lowercase letter.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_password_require_lower"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_password_require_lower', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Require Number (0-9)</strong>
                    <p class="madeit-security-desc">Password must contain at least one digit.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_password_require_number"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_password_require_number', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Require Special Character</strong>
                    <p class="madeit-security-desc">Password must contain at least one special character (!@#$%^&amp;* etc.). Disabled by default per NIST 800-63B guidance, which favors length over complexity.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_password_require_special"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_password_require_special', false ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-form-row madeit-security-form-row--toggle">
                <div>
                    <strong>Block Commonly Breached Passwords</strong>
                    <p class="madeit-security-desc">Rejects passwords found in a built-in list of the 10,000 most commonly breached passwords (e.g. "password", "123456", "qwerty"). No external API calls are made.</p>
                </div>
                <label class="madeit-security-toggle">
                    <input type="checkbox"
                           name="madeit_security_password_block_common"
                           class="madeit-security-setting-input"
                           value="1"
                           <?php checked( \MadeIT\Security\Settings::get( 'madeit_security_password_block_common', true ) ); ?> />
                    <span class="madeit-security-toggle__slider"></span>
                </label>
            </div>

            <div class="madeit-security-notice madeit-security-notice--info">
                Password policy is enforced on: <strong>Profile edits</strong>, <strong>Password resets</strong> (wp-login.php), and <strong>New user registrations</strong>. When enabled, a live requirements checklist and passphrase generator button are shown on user profile pages.
            </div>

        </div>
    </div>

    </div><!-- /col-main -->

    <!-- SIDEBAR -->
    <div class="madeit-security-col-side">

        <!-- ══ PASSPHRASE GENERATOR ══════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">Passphrase Generator</h2>
            </div>
            <div class="madeit-security-form-body">
                <p class="madeit-security-desc" style="margin-bottom:12px">Generate a strong, memorable passphrase using random dictionary words. Passphrases are easier to remember than random character strings while providing equivalent or better entropy.</p>

                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Word Count</label>
                    <input type="number" id="madeit-security-pp-words" class="madeit-security-input madeit-security-input--sm" value="<?php echo esc_attr( \MadeIT\Security\Settings::get( 'madeit_security_passphrase_words', 4 ) ); ?>" min="3" max="8" />
                </div>

                <div class="madeit-security-form-row">
                    <label class="madeit-security-label">Separator</label>
                    <select id="madeit-security-pp-separator" class="madeit-security-input">
                        <?php $sep = \MadeIT\Security\Settings::get( 'madeit_security_passphrase_separator', '-' ); ?>
                        <option value="-" <?php selected( $sep, '-' ); ?>>Hyphen (-)</option>
                        <option value="." <?php selected( $sep, '.' ); ?>>Dot (.)</option>
                        <option value="_" <?php selected( $sep, '_' ); ?>>Underscore (_)</option>
                        <option value=" " <?php selected( $sep, ' ' ); ?>>Space</option>
                    </select>
                </div>

                <button type="button" id="madeit-security-generate-passphrase" class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--full" style="margin-top:8px">
                    🎲 Generate Passphrase
                </button>

                <div id="madeit-security-passphrase-output" style="display:none; margin-top:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <input type="text" id="madeit-security-passphrase-value" class="madeit-security-input" readonly style="font-family:monospace; font-size:14px; letter-spacing:.02em; flex:1;" />
                        <button type="button" id="madeit-security-copy-passphrase" class="madeit-security-btn madeit-security-btn--secondary" title="Copy to clipboard">📋</button>
                    </div>
                    <p id="madeit-security-passphrase-entropy" class="madeit-security-desc" style="margin-top:6px; font-size:.8rem;"></p>
                </div>
            </div>
        </div>

        <!-- ══ SAVE SETTINGS ═════════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Save Settings</h2></div>
            <div class="madeit-security-form-body">
                <button class="madeit-security-btn madeit-security-btn--primary madeit-security-btn--full" id="btn-save-settings">💾 Save Password Policy</button>
                <div id="settings-saved-notice" class="madeit-security-form-result" style="display:none; margin-top:10px;"></div>
            </div>
        </div>

        <!-- ══ CURRENT POLICY SUMMARY ════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header"><h2 class="madeit-security-panel__title">Active Policy</h2></div>
            <div class="madeit-security-form-body">
                <?php $summary = \MadeIT\Security\modules\PasswordPolicy::get_policy_summary(); ?>
                <?php if ( $summary['enabled'] ) : ?>
                    <p style="color:#00a32a; font-weight:600; margin-bottom:8px;">Policy is enforced</p>
                    <ul style="margin:0; padding-left:18px; font-size:.85rem; color:#4a5568;">
                        <?php foreach ( $summary['rules'] as $rule ) : ?>
                            <li><?php echo esc_html( $rule ); ?></li>
                        <?php endforeach; ?>
                    </ul>
                <?php else : ?>
                    <p style="color:#999;">Password policy is not currently enforced. Users can set any password.</p>
                <?php endif; ?>
            </div>
        </div>

    </div>

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

/**
 * Self-contained wizard controller — zero dependency on admin.js.
 * Handles: step navigation, progress bar, whitelist IP, save & complete.
 *
 * Expects madeitSecurityWizard global (localized via wp_localize_script):
 *   madeitSecurityWizard.ajax_url, madeitSecurityWizard.nonce, madeitSecurityWizard.admin_url
 */
(function() {
    'use strict';

    var TOTAL    = 7;
    var AJAX_URL = ( typeof madeitSecurityWizard !== 'undefined' ) ? madeitSecurityWizard.ajax_url : '';
    var NONCE    = ( typeof madeitSecurityWizard !== 'undefined' ) ? madeitSecurityWizard.nonce    : '';
    var ADMIN    = ( typeof madeitSecurityWizard !== 'undefined' ) ? madeitSecurityWizard.admin_url : '';

    /* ── Step navigation ─────────────────────────────────────────────── */
    function goTo(step) {
        if (step < 1 || step > TOTAL) return;
        var steps = document.querySelectorAll('.madeit-security-wizard__step');
        for (var i = 0; i < steps.length; i++) {
            steps[i].style.display = 'none';
            steps[i].classList.remove('madeit-security-wizard__step--active');
        }
        var target = document.querySelector('[data-wizard-step="' + step + '"]');
        if (target) {
            target.style.display = 'block';
            target.classList.add('madeit-security-wizard__step--active');
        }
        var dots = document.querySelectorAll('.madeit-security-wizard__step-dot');
        for (var j = 0; j < dots.length; j++) {
            var s = parseInt(dots[j].getAttribute('data-step'));
            dots[j].classList.remove('madeit-security-wizard__step-dot--active', 'madeit-security-wizard__step-dot--done');
            if (s < step) dots[j].classList.add('madeit-security-wizard__step-dot--done');
            else if (s === step) dots[j].classList.add('madeit-security-wizard__step-dot--active');
        }
        var fill = document.getElementById('wizard-progress-fill');
        if (fill) fill.style.width = (step / TOTAL * 100) + '%';
        var wrap = document.querySelector('.madeit-security-wizard-wrap');
        if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ── AJAX helper (vanilla, no jQuery) ────────────────────────────── */
    function post(action, extra) {
        var body = 'action=' + encodeURIComponent(action) + '&nonce=' + encodeURIComponent(NONCE);
        if (extra) body += '&' + extra;
        return fetch(AJAX_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: body,
            credentials: 'same-origin'
        }).then(function(r) { return r.json(); });
    }

    /* ── Event delegation ────────────────────────────────────────────── */
    document.addEventListener('click', function(e) {
        var btn;

        // Next / Back step buttons
        btn = e.target.closest('.madeit-security-wizard__next-btn');
        if (btn) { goTo(parseInt(btn.getAttribute('data-next'))); return; }
        btn = e.target.closest('.madeit-security-wizard__back-btn');
        if (btn) { goTo(parseInt(btn.getAttribute('data-prev'))); return; }

        // Whitelist My IP
        if (e.target.closest('#wizard-whitelist-btn')) {
            var wlBtn = document.getElementById('wizard-whitelist-btn');
            var wlRes = document.getElementById('wizard-whitelist-result');
            wlBtn.textContent = 'Whitelisting\u2026';
            wlBtn.disabled = true;
            post('madeit_security_whitelist_my_ip', 'label=Setup+wizard').then(function(res) {
                if (res.success) {
                    wlBtn.textContent = '\u2705 IP Whitelisted!';
                    wlBtn.className = 'madeit-security-btn madeit-security-btn--ghost madeit-security-btn--lg';
                    wlRes.textContent = '\u2705 ' + (res.data.message || 'Your IP has been whitelisted.');
                    wlRes.className = 'madeit-security-wizard__whitelist-result madeit-security-wizard__whitelist-result--success';
                    wlRes.style.display = 'block';
                } else {
                    wlBtn.textContent = '\u2705 Whitelist My IP';
                    wlBtn.disabled = false;
                    wlRes.textContent = (res.data && res.data.message) || 'Error whitelisting IP.';
                    wlRes.className = 'madeit-security-wizard__whitelist-result madeit-security-wizard__whitelist-result--error';
                    wlRes.style.display = 'block';
                }
            }).catch(function() {
                wlBtn.textContent = '\u2705 Whitelist My IP';
                wlBtn.disabled = false;
                wlRes.textContent = 'Request failed. Please try again.';
                wlRes.className = 'madeit-security-wizard__whitelist-result madeit-security-wizard__whitelist-result--error';
                wlRes.style.display = 'block';
            });
            return;
        }

        // Apply Recommended Settings
        if (e.target.closest('#wizard-apply-recommended')) {
            var recBtn = document.getElementById('wizard-apply-recommended');
            var recRes = document.getElementById('wizard-recommended-result');
            recBtn.textContent = '\u23F3 Applying\u2026';
            recBtn.disabled = true;

            post('madeit_security_apply_recommended').then(function(res) {
                if (res.success) {
                    recBtn.textContent = '\u2705 Recommended Settings Applied!';
                    recBtn.className = 'madeit-security-btn madeit-security-btn--ghost madeit-security-btn--lg';
                    recBtn.style.cssText = 'width:100%;padding:16px 24px;font-size:1rem';
                    recRes.textContent = '\uD83C\uDF89 ' + (res.data.message || 'Settings applied!') + ' Redirecting to dashboard\u2026';
                    recRes.style.display = 'block';
                    recRes.style.background = '#f0fdf4';
                    recRes.style.color = '#166534';
                    recRes.style.border = '1px solid #bbf7d0';
                    setTimeout(function() {
                        window.location.href = ADMIN + 'admin.php?page=madeit-security&setup=complete';
                    }, 1500);
                } else {
                    recBtn.textContent = '\u26A1 Apply MadeIT Security Recommended Settings';
                    recBtn.disabled = false;
                    recRes.textContent = (res.data && res.data.message) || 'Error applying settings.';
                    recRes.style.display = 'block';
                    recRes.style.background = '#fef2f2';
                    recRes.style.color = '#991b1b';
                    recRes.style.border = '1px solid #fecaca';
                }
            }).catch(function() {
                recBtn.textContent = '\u26A1 Apply MadeIT Security Recommended Settings';
                recBtn.disabled = false;
                recRes.textContent = 'Request failed. Please try again.';
                recRes.style.display = 'block';
                recRes.style.background = '#fef2f2';
                recRes.style.color = '#991b1b';
                recRes.style.border = '1px solid #fecaca';
            });
            return;
        }

        // Complete Setup
        if (e.target.closest('#wizard-complete-btn')) {
            var csBtn  = document.getElementById('wizard-complete-btn');
            var csRes  = document.getElementById('wizard-save-result');
            csBtn.textContent = '\u23F3 Saving\u2026';
            csBtn.disabled = true;

            // Collect all wizard inputs
            var pairs = [];
            var inputs = document.querySelectorAll('.madeit-security-wizard-input');
            for (var k = 0; k < inputs.length; k++) {
                var inp  = inputs[k];
                var name = inp.getAttribute('name');
                if (!name) continue;
                var val;
                if (inp.type === 'checkbox') {
                    val = inp.checked ? '1' : '0';
                } else {
                    val = inp.value;
                }
                pairs.push('settings[' + encodeURIComponent(name) + ']=' + encodeURIComponent(val));
            }

            // 1) Save settings
            post('madeit_security_save_settings', pairs.join('&')).then(function(res) {
                if (!res.success) {
                    csBtn.textContent = '\uD83D\uDE80 Complete Setup';
                    csBtn.disabled = false;
                    showResult(csRes, 'Error saving settings.', 'error');
                    return;
                }
                // 2) Mark setup complete
                return post('madeit_security_complete_setup');
            }).then(function(res) {
                if (!res) return;
                if (res.success) {
                    showResult(csRes, '\uD83C\uDF89 Setup complete! Redirecting to dashboard\u2026', 'success');
                    setTimeout(function() {
                        window.location.href = ADMIN + 'admin.php?page=madeit-security&setup=complete';
                    }, 1200);
                } else {
                    csBtn.textContent = '\uD83D\uDE80 Complete Setup';
                    csBtn.disabled = false;
                    showResult(csRes, 'Settings saved but could not mark setup complete.', 'error');
                }
            }).catch(function() {
                csBtn.textContent = '\uD83D\uDE80 Complete Setup';
                csBtn.disabled = false;
                showResult(csRes, 'Request failed. Please try again.', 'error');
            });
            return;
        }
    });

    function showResult(el, msg, type) {
        el.textContent = msg;
        el.className = 'madeit-security-wizard__save-result madeit-security-wizard__save-result--' + type;
        el.style.display = 'block';
    }

    // Init
    goTo(1);
})();

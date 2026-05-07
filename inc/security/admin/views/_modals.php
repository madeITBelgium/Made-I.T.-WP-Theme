<?php defined( 'ABSPATH' ) || exit; ?>

<!-- IP Detail Modal -->
<div class="madeit-security-modal-overlay" id="madeit-security-ip-modal" style="display:none;">
    <div class="madeit-security-modal madeit-security-modal--lg">
        <div class="madeit-security-modal__header">
            <h3 class="madeit-security-modal__title" id="modal-ip-title">IP Details</h3>
            <button class="madeit-security-modal__close" id="madeit-security-modal-close">✕</button>
        </div>
        <div class="madeit-security-modal__body" id="madeit-security-modal-body">
            <div class="madeit-security-spinner"></div>
        </div>
    </div>
</div>

<!-- Block IP Modal -->
<div class="madeit-security-modal-overlay" id="madeit-security-block-modal" style="display:none;">
    <div class="madeit-security-modal madeit-security-modal--sm">
        <div class="madeit-security-modal__header">
            <h3 class="madeit-security-modal__title">Block IP Address</h3>
            <button class="madeit-security-modal__close madeit-security-block-modal-close">✕</button>
        </div>
        <div class="madeit-security-modal__body">
            <p style="margin:0 0 14px;font-size:13px;color:var(--c-text-2)">Block: <strong id="block-modal-ip" style="font-family:var(--mono)"></strong></p>
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Reason</label>
                <input type="text" id="block-reason-input" class="madeit-security-input" value="Manually blocked" />
            </div>
            <div class="madeit-security-form-row">
                <label class="madeit-security-label">Duration</label>
                <select id="block-duration-select" class="madeit-security-input">
                    <option value="0">Permanent</option>
                    <option value="3600">1 Hour</option>
                    <option value="86400">24 Hours</option>
                    <option value="604800">7 Days</option>
                    <option value="2592000">30 Days</option>
                </select>
            </div>
        </div>
        <div class="madeit-security-modal__footer">
            <button class="madeit-security-btn madeit-security-btn--danger" id="confirm-block-btn">🚫 Block IP</button>
            <button class="madeit-security-btn madeit-security-btn--ghost madeit-security-block-modal-close">Cancel</button>
        </div>
    </div>
</div>

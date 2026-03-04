(function () {
    var activeModal = null;
    var activeBackdrop = null;

    function ensureBackdrop() {
        if (activeBackdrop) {
            return;
        }
        var backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
        activeBackdrop = backdrop;
    }

    function removeBackdrop() {
        if (!activeBackdrop) {
            return;
        }
        if (activeBackdrop.parentNode) {
            activeBackdrop.parentNode.removeChild(activeBackdrop);
        }
        activeBackdrop = null;
    }

    function showModalFallback(modal) {
        activeModal = modal;
        ensureBackdrop();

        document.body.classList.add('modal-open');
        modal.style.display = 'block';
        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');
        modal.classList.add('show');
    }

    function hideModalFallback() {
        if (!activeModal) {
            return;
        }

        activeModal.classList.remove('show');
        activeModal.style.display = 'none';
        activeModal.setAttribute('aria-hidden', 'true');
        activeModal.removeAttribute('aria-modal');
        activeModal = null;

        document.body.classList.remove('modal-open');
        removeBackdrop();
    }

    function openPopupModal(popupId) {
        var modal = document.getElementById('popup-' + popupId);
        if (!modal) {
            return false;
        }

        // Bootstrap 5
        if (window.bootstrap && window.bootstrap.Modal) {
            window.bootstrap.Modal.getOrCreateInstance(modal).show();
            return true;
        }

        // Bootstrap 4 (jQuery plugin)
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
            window.jQuery(modal).modal('show');
            return true;
        }

        // Fallback if Bootstrap JS isn't present
        showModalFallback(modal);
        return true;
    }

    document.addEventListener(
        'click',
        function (event) {
            var target = event.target;
            if (!target || !target.closest) {
                return;
            }

            var trigger = target.closest('[data-madeit-popup-id]');
            var popupId = trigger ? trigger.getAttribute('data-madeit-popup-id') : null;

            if (!popupId) {
                var link = target.closest('a');
                if (link) {
                    var bsTarget = link.getAttribute('data-bs-target') || link.getAttribute('data-target');
                    var href = link.getAttribute('href');
                    var candidate = bsTarget || href;
                    if (candidate && candidate.indexOf('#popup-') === 0) {
                        popupId = candidate.replace('#popup-', '');
                    }
                }
            }

            if (!popupId || popupId === '0') {
                return;
            }

            var opened = openPopupModal(popupId);
            if (opened) {
                event.preventDefault();
            }
        },
        true
    );

    document.addEventListener(
        'click',
        function (event) {
            if (!activeModal) {
                return;
            }

            var target = event.target;
            if (!target) {
                return;
            }

            // Close buttons (Bootstrap 4/5 conventions)
            if (
                target.closest('[data-bs-dismiss="modal"]') ||
                target.closest('[data-dismiss="modal"]')
            ) {
                hideModalFallback();
                return;
            }

            // Click on overlay closes
            if (target === activeModal) {
                hideModalFallback();
            }
        },
        true
    );

    document.addEventListener('keydown', function (event) {
        if (!activeModal) {
            return;
        }
        if (event.key === 'Escape') {
            hideModalFallback();
        }
    });
})();

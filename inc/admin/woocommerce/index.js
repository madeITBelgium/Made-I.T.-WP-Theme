
document.addEventListener('DOMContentLoaded', function () {
    const storagePrefix = 'shop-controls-admin';

    const toast = document.createElement('div');
    toast.className = 'MI_status-toast';
    document.body.appendChild(toast);

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('is-visible');
        window.clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 2200);
    };

    const readStorage = (key, fallback) => {
        try {
            const value = window.localStorage.getItem(storagePrefix + ':' + key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    };

    const writeStorage = (key, value) => {
        try {
            window.localStorage.setItem(storagePrefix + ':' + key, JSON.stringify(value));
        } catch (error) {
            // Ignore localStorage issues in private mode or locked browsers.
        }
    };

    const refreshDashboardState = () => {
        const ordersEl = document.querySelector('[data-metric="orders"]');
        const revenueEl = document.querySelector('[data-metric="revenue"]');
        const productsEl = document.querySelector('[data-metric="products"]');
        const conversionEl = document.querySelector('[data-metric="conversion"]');
        const updateEl = document.querySelector('[data-dashboard-updated]');

        if (!ordersEl || !revenueEl || !productsEl || !conversionEl) {
            return;
        }

        const refreshButton = document.querySelector('.MI_refresh-dashboard');
        if (refreshButton) {
            refreshButton.disabled = true;
            refreshButton.textContent = 'Vernieuw overzicht…';
        }

        const ajaxUrl = (window.shopControlsAdmin && window.shopControlsAdmin.ajaxUrl) || window.ajaxurl || '';

        fetch(ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: new URLSearchParams({
                action: 'shop_controls_get_dashboard_metrics'
            })
        })
            .then((response) => response.json())
            .then((payload) => {
                const metrics = payload && payload.data ? payload.data : null;
                if (!metrics) {
                    throw new Error('No dashboard metrics returned');
                }

                ordersEl.textContent = metrics.orders_today ?? 0;
                revenueEl.textContent = '€ ' + (new Intl.NumberFormat('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(metrics.revenue_last_7_days ?? 0)));
                productsEl.textContent = metrics.products_active ?? 0;
                conversionEl.textContent = (Number(metrics.conversion_rate ?? 0)).toFixed(1) + '%';

                const ordersPrevious = Number(metrics.orders_previous_7_days ?? 0);
                const ordersCurrent = Number(metrics.orders_last_7_days ?? 0);
                const revenuePrevious = Number(metrics.revenue_previous_7_days ?? 0);
                const revenueCurrent = Number(metrics.revenue_last_7_days ?? 0);

                const ordersDelta = ordersPrevious > 0 ? ((ordersCurrent - ordersPrevious) / ordersPrevious) * 100 : 0;
                const revenueDelta = revenuePrevious > 0 ? ((revenueCurrent - revenuePrevious) / revenuePrevious) * 100 : 0;

                const ordersDeltaText = document.querySelector('[data-metric-change="orders"]');
                const revenueDeltaText = document.querySelector('[data-metric-change="revenue"]');
                const productDeltaText = document.querySelector('[data-metric-change="products"]');
                const conversionDeltaText = document.querySelector('[data-metric-change="conversion"]');

                if (ordersDeltaText) {
                    ordersDeltaText.textContent = (ordersDelta >= 0 ? '+' : '') + (Math.round(ordersDelta * 10) / 10) + '% tegenover vorige week';
                }
                if (revenueDeltaText) {
                    revenueDeltaText.textContent = (revenueDelta >= 0 ? '+' : '') + (Math.round(revenueDelta * 10) / 10) + '% in de laatste 7 dagen';
                }
                if (productDeltaText) {
                    productDeltaText.textContent = (metrics.products_added_last_7_days ?? 0) + ' nieuwe toevoegingen';
                }
                if (conversionDeltaText) {
                    conversionDeltaText.textContent = 'Laatste 30 dagen';
                }

                if (updateEl) {
                    updateEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                const statusEl = document.querySelector('[data-dashboard-status]');
                if (statusEl) {
                    statusEl.textContent = metrics.cart_status || 'Live';
                }
            })
            .catch(() => {
                const fallback = [
                    document.querySelector('[data-metric-change="orders"]'),
                    document.querySelector('[data-metric-change="revenue"]'),
                    document.querySelector('[data-metric-change="products"]'),
                    document.querySelector('[data-metric-change="conversion"]')
                ];

                fallback.forEach((element) => {
                    if (element) {
                        element.textContent = 'Geen data beschikbaar';
                    }
                });

                const statusEl = document.querySelector('[data-dashboard-status]');
                if (statusEl) {
                    statusEl.textContent = 'Offline';
                }
            })
            .finally(() => {
                if (refreshButton) {
                    refreshButton.disabled = false;
                    refreshButton.textContent = 'Vernieuw overzicht';
                }
            });
    };

    document.querySelector('.MI_refresh-dashboard')?.addEventListener('click', () => {
        refreshDashboardState();
        showToast('Dashboard ververst');
    });

    const selectedTemplate = document.querySelector('[data-selected-template]');
    const templateCards = document.querySelectorAll('.MI_template-card');
    const savedTemplate = readStorage('selected-template', 'Classic cart');
    const updatePreviewTitle = (templateName) => {
        const previewTitle = document.querySelector('.MI_cart-preview-title');
        if (previewTitle) {
            previewTitle.textContent = 'Preview: ' + templateName;
        }
    };

    templateCards.forEach((card) => {
        const templateName = card.dataset.templateName;
        const previewButton = card.querySelector('.MI_preview-template');

        if (templateName === savedTemplate) {
            card.classList.add('is-selected');
        }

        previewButton?.addEventListener('click', () => {
            templateCards.forEach((item) => item.classList.remove('is-selected'));
            card.classList.add('is-selected');
            writeStorage('selected-template', templateName);
            if (selectedTemplate) {
                selectedTemplate.textContent = templateName;
            }
            updatePreviewTitle(templateName);
            showToast('Preview: ' + templateName);
        });
    });

    if (selectedTemplate) {
        selectedTemplate.textContent = savedTemplate;
    }
    updatePreviewTitle(savedTemplate);

    document.querySelector('.MI_apply-template')?.addEventListener('click', () => {
        const activeTemplate = document.querySelector('.MI_template-card.is-selected')?.dataset.templateName || savedTemplate;
        writeStorage('selected-template', activeTemplate);
        if (selectedTemplate) {
            selectedTemplate.textContent = activeTemplate;
        }
        updatePreviewTitle(activeTemplate);
        showToast('Template toegepast: ' + activeTemplate);
    });

    const automationCards = document.querySelectorAll('.MI_automation-card');
    automationCards.forEach((card) => {
        const automationName = card.dataset.automation;
        const toggle = card.querySelector('input[type="checkbox"]');
        const badge = card.querySelector('.MI_badge');
        const small = card.querySelector('small');

        const savedAutomationState = readStorage('automation:' + automationName, toggle?.checked ?? false);
        if (toggle) {
            toggle.checked = Boolean(savedAutomationState);
        }

        const setAutomationState = () => {
            const enabled = toggle ? toggle.checked : false;
            card.dataset.enabled = String(enabled);
            if (badge) {
                if (enabled) {
                    badge.textContent = 'Actief';
                    badge.className = 'MI_badge ' + (automationName === 'abandoned-cart' ? 'MI_badge-warning' : 'MI_badge-success');
                } else {
                    badge.textContent = 'Uit';
                    badge.className = 'MI_badge MI_badge-neutral';
                }
            }
            writeStorage('automation:' + automationName, enabled);
        };

        toggle?.addEventListener('change', setAutomationState);
        setAutomationState();

        const runButton = card.querySelector('.MI_run-automation');
        runButton?.addEventListener('click', () => {
            const now = new Date();
            const timeText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (small) {
                small.textContent = 'Laatste run: ' + timeText;
            }
            showToast('Automation uitgevoerd: ' + (card.querySelector('h3')?.textContent || 'workflow'));
        });
    });

    // PREVIEW
    const preview = document.getElementById('preview');
    const MI_header = document.querySelector('.MI_header');
    window.addEventListener('scroll', () => {
        if (preview) {
            const headerHeight = MI_header ? MI_header.offsetHeight : 88;
            const scrollOffset = window.scrollY;
            preview.style.height = `calc(100vh - ${Math.max(headerHeight - scrollOffset, 0)}px)`;
            preview.style.top = `${Math.max(headerHeight - scrollOffset, 0)}px`;
        }
    });

    const navigation = document.querySelector('.MI_navigation');
    const navigationLinks = navigation ? navigation.querySelectorAll('a') : [];
    const sections = document.querySelectorAll('[id^="MI_"]');

    function showTab(path) {
        const tabName = path.replace(/^\/+|\/+$/g, '');
        const targetId = 'MI_' + tabName;

        sections.forEach(section => {
            section.style.display = 'none';
        });

        navigationLinks.forEach(link => {
            link.classList.remove('MI_navigation_active');
        });

        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.style.display = 'block';
        }

        navigationLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#') {
                return;
            }

            const url = new URL(href, window.location.origin);
            const linkPath = url.searchParams.get('path');

            if (linkPath === '/' + tabName) {
                link.classList.add('MI_navigation_active');
            }
        });
    }

    const currentUrl = new URL(window.location.href);
    const currentPath = currentUrl.searchParams.get('path');

    if (currentPath) {
        showTab(currentPath);
    } else {
        showTab('/dashboard');
    }

    var cartCheck = document.querySelector('#cart_enabled');
    var cartCheckInput = document.getElementsByClassName('MI-disable-cart-info');

    if (cartCheck && cartCheckInput.length > 0) {
        function updateCartInfo() {
            for (var i = 0; i < cartCheckInput.length; i++) {
                cartCheckInput[i].style.display = cartCheck.classList.contains('is-checked') ? 'block' : 'none';
            }
        }

        updateCartInfo();
        cartCheck.addEventListener('click', updateCartInfo);
    }

    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        const span = tooltip.querySelector('span');
        if (span) {
            span.style.display = 'none';
        }
    });
    tooltips.forEach(tooltip => {
        const span = tooltip.querySelector('span');
        tooltip.addEventListener('mouseenter', () => {
            if (span) {
                span.style.display = 'inline-block';
            }
        });
        tooltip.addEventListener('mouseleave', () => {
            if (span) {
                span.style.display = 'none';
            }
        });
    });

    document.querySelectorAll('.components-form-toggle').forEach(function (toggle) {
        const input = toggle.querySelector('input[type="checkbox"]');

        if (!input) return;

        toggle.classList.toggle('is-checked', input.checked);
        input.addEventListener('change', function () {
            toggle.classList.toggle('is-checked', input.checked);
        });
    });

    var couponCheck = document.getElementById('coupon_enabled');
    const couponPreview = document.querySelector('.MI_cart-coupon-area');

    if (couponCheck && couponPreview) {
        function updateCouponPreview() {
            if (couponCheck.classList.contains('is-checked')) {
                couponPreview.style.display = 'block';
            } else {
                couponPreview.style.display = 'none';
            }
        }

        updateCouponPreview();
        const couponInput = couponCheck.querySelector('input[type="checkbox"]');

        couponInput.addEventListener('change', function () {
            couponCheck.classList.toggle('is-checked', couponInput.checked);
            updateCouponPreview();
        });

        const couponHead = document.querySelector('.MI_cart-coupon-head');
        const couponBody = document.querySelector('.MI_cart-coupon-body');
        const previewCouponArrowUp = document.querySelector('.MI_cart-coupon-head .MI_cart-coupon-icon .MI_cart-arrow-up-icon');
        const previewCouponArrowDown = document.querySelector('.MI_cart-coupon-head .MI_cart-coupon-icon .MI_cart-arrow-down-icon');

        if (couponHead && couponBody) {
            couponHead.addEventListener('click', () => {
                const isOpen = couponBody.style.display !== 'none';

                if (isOpen) {
                    couponBody.style.display = 'none';
                    previewCouponArrowUp?.classList.add('MI_cart-hide');
                    previewCouponArrowDown?.classList.remove('MI_cart-hide');
                } else {
                    couponBody.style.display = '';
                    previewCouponArrowUp?.classList.remove('MI_cart-hide');
                    previewCouponArrowDown?.classList.add('MI_cart-hide');
                }
            });
        }
    }

    var couponCollapsed = document.querySelector('input#coupon_display_collapsed');
    var couponOpen = document.querySelector('input#coupon_display_open');
    const couponCardBody = document.querySelector('.MI_cart-coupon-body');
    const displayCouponArrowUp = document.querySelector('.MI_cart-coupon-head .MI_cart-coupon-icon .MI_cart-arrow-up-icon');
    const displayCouponArrowDown = document.querySelector('.MI_cart-coupon-head .MI_cart-coupon-icon .MI_cart-arrow-down-icon');

    if (couponCollapsed && couponOpen && couponCardBody) {
        couponCollapsed.checked = true;
        couponOpen.checked = false;

        if (couponCollapsed.checked) {
            couponCardBody.style.display = 'none';
        } else if (couponOpen.checked) {
            couponCardBody.style.display = '';
        }

        couponCollapsed.addEventListener('change', function () {
            if (couponCollapsed.checked) {
                couponCardBody.style.display = 'none';
                displayCouponArrowUp?.classList.add('MI_cart-hide');
                displayCouponArrowDown?.classList.remove('MI_cart-hide');
            }
        });

        couponOpen.addEventListener('change', function () {
            if (couponOpen.checked) {
                couponCardBody.style.display = '';
                displayCouponArrowUp?.classList.remove('MI_cart-hide');
                displayCouponArrowDown?.classList.add('MI_cart-hide');
            }
        });
    }

    // Koptekst van het couponvak
    var couponHeadText = document.querySelector('input[name="shop_controls_options[coupon_title]"');
    var couponHeaderTitle = document.querySelector('.MI_cart-coupon-title font');

    if (couponHeadText && couponHeaderTitle) {
        couponHeadText.addEventListener('input', function () {
            couponHeaderTitle.textContent = couponHeadText.value;
        });

        couponHeaderTitle.textContent = couponHeadText.value;
    }

    // Kortingsvakje (plaatsvervangende tekst)
    var couponPlaceholderText = document.querySelector('input[name="shop_controls_options[coupon_placeholder]"');
    var couponInputField = document.querySelector('#MI_cart-coupon__input');

    if (couponPlaceholderText && couponInputField) {
        couponPlaceholderText.addEventListener('input', function () {
            couponInputField.setAttribute('placeholder', couponPlaceholderText.value);
        });

        couponInputField.setAttribute('placeholder', couponPlaceholderText.value);
    }

    // Tekst op de knop 'Kortingsvak'
    var couponButtonText = document.querySelector('input[name="shop_controls_options[coupon_button]"');
    var couponButton = document.querySelector('.MI_cart-coupon-button');

    if (couponButtonText && couponButton) {
        couponButtonText.addEventListener('input', function () {
            couponButton.textContent = couponButtonText.value;
        });

        couponButton.textContent = couponButtonText.value;
    }

    refreshDashboardState();
});

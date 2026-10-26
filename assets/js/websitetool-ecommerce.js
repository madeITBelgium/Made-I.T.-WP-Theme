(function () {
    'use strict';

    var config = window.madeitWtEcommerce;
    if (!config) {
        return;
    }

    var pending = [];
    var seen = Object.create(null);
    var timer = null;
    var attempts = 0;
    var cartRequest = false;
    var cartAgain = false;

    function hasConsent() {
        return window.CookieConsent && window.CookieConsent.acceptedService('WebsiteTool', 'analytics');
    }

    function purchaseStorage(key) {
        var stores = ['localStorage', 'sessionStorage'];
        for (var index = 0; index < stores.length; index++) {
            try {
                var storage = window[stores[index]];
                if (storage.getItem(key)) {
                    return null;
                }
                storage.setItem(key, '1');
                return storage;
            } catch (error) {
                continue;
            }
        }
        return null;
    }

    function flush() {
        window.clearTimeout(timer);
        timer = null;
        if (!hasConsent() || !pending.length) {
            return;
        }

        pending = pending.filter(function (event) {
            if (window.wtinit !== true || typeof window[event.method] !== 'function') {
                return true;
            }

            var key;
            var storage;
            if (event.purchaseId) {
                key = 'madeit-wt-purchase:' + config.siteId + ':' + event.purchaseId;
                storage = purchaseStorage(key);
                if (!storage) {
                    return false;
                }
            }

            try {
                window[event.method](event.data);
            } catch (error) {
                if (storage) {
                    storage.removeItem(key);
                }
                return true;
            }
            return false;
        });

        if (pending.length && attempts++ < 240) {
            timer = window.setTimeout(flush, 250);
        }
    }

    function enqueue(events) {
        events.forEach(function (event) {
            if (['wtTrackProductView', 'wtTrackAddToCart', 'wtTrackCheckout', 'wtTrackPurchase'].indexOf(event.method) === -1) {
                return;
            }
            if (event.id && seen[event.id]) {
                return;
            }
            if (event.id) {
                seen[event.id] = true;
            }
            pending.push(event);
        });
        attempts = 0;
        flush();
    }

    function fetchCartEvents() {
        if (cartRequest) {
            cartAgain = true;
            return;
        }
        cartRequest = true;
        window.fetch(config.cartUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'nonce=' + encodeURIComponent(config.nonce)
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            if (response.success && Array.isArray(response.data) && hasConsent()) {
                enqueue(response.data);
            }
        }).catch(function () {
            return;
        }).then(function () {
            cartRequest = false;
            if (cartAgain) {
                cartAgain = false;
                fetchCartEvents();
            }
        });
    }

    function consentChanged() {
        if (!hasConsent()) {
            pending = [];
        }
        attempts = 0;
        flush();
    }

    function start() {
        var data = document.getElementById('madeit-wt-page-events');
        if (data) {
            enqueue(JSON.parse(data.textContent));
        }
        if (window.jQuery) {
            window.jQuery(document.body).on('added_to_cart', fetchCartEvents);
            window.jQuery(document).on('ajaxSuccess', function (event, xhr, settings, response) {
                var action = typeof settings.data === 'string'
                    ? new URLSearchParams(settings.data).get('action')
                    : settings.data && settings.data.action;
                if (action === 'woocommerce_ajax_add_to_cart' && response && response.fragments && !response.error && response.success !== false) {
                    fetchCartEvents();
                }
            });
        }
    }

    document.addEventListener('wc-blocks_added_to_cart', fetchCartEvents);
    window.addEventListener('cc:onConsent', flush);
    window.addEventListener('cc:onChange', consentChanged);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/js/websitetool-ecommerce.js'), 'utf8');

function browser(events, options = {}) {
    const listeners = {};
    const calls = [];
    const timers = new Map();
    const stored = options.stored || new Map();
    let consent = options.consent !== false;
    let timerId = 0;
    const jqueryHandlers = {};
    let fetches = 0;
    const storage = {
        getItem: key => stored.get(key),
        setItem: (key, value) => stored.set(key, value),
        removeItem: key => stored.delete(key)
    };
    const window = {
        madeitWtEcommerce: { cartUrl: '/cart-events', nonce: 'nonce', siteId: 1 },
        CookieConsent: { acceptedService: (service, category) => consent && service === 'WebsiteTool' && category === 'analytics' },
        wtinit: options.ready !== false,
        localStorage: storage,
        sessionStorage: storage,
        setTimeout: callback => { timers.set(++timerId, callback); return timerId; },
        clearTimeout: identifier => timers.delete(identifier),
        addEventListener: (name, callback) => { listeners[name] = callback; },
        jQuery: () => ({ on: (name, callback) => { jqueryHandlers[name] = callback; } }),
        fetch: async () => {
            fetches++;
            return { json: async () => ({ success: true, data: options.cartEvents || [] }) };
        }
    };
    ['wtTrackProductView', 'wtTrackAddToCart', 'wtTrackCheckout', 'wtTrackPurchase', 'wtTrackRegistration'].forEach(method => {
        window[method] = data => calls.push({ method, data });
    });
    if (options.blockStorage) {
        storage.getItem = () => { throw new Error('Storage blocked'); };
    }
    const document = {
        body: {},
        readyState: 'complete',
        getElementById: () => ({ textContent: JSON.stringify(events) }),
        addEventListener: (name, callback) => { listeners[name] = callback; }
    };
    vm.runInNewContext(source, { window, document, URLSearchParams });
    return {
        window, calls, listeners, stored,
        cart: () => jqueryHandlers.added_to_cart(),
        customCart: (settings, response) => jqueryHandlers.ajaxSuccess({}, {}, settings, response),
        fetches: () => fetches,
        consent: value => { consent = value; },
        tick: () => {
            const callbacks = [...timers.values()];
            timers.clear();
            callbacks.forEach(callback => callback());
        }
    };
}

async function test() {
    const product = { method: 'wtTrackProductView', data: { id: '42', price: 59.95 } };
    const checkout = { method: 'wtTrackCheckout', data: 119.9 };
    const purchase = { method: 'wtTrackPurchase', purchaseId: '1001', data: { order_id: 'ORD-1001', total_value: 119.9 } };
    const registration = { id: 'registration-7', method: 'wtTrackRegistration', data: { value: 0, currency: 'EUR', status: 'completed' } };
    const registered = browser([registration, registration], { ready: false, consent: false });
    assert.equal(registered.calls.length, 0);
    registered.window.wtinit = true;
    registered.consent(true);
    registered.listeners['cc:onConsent']();
    assert.equal(registered.calls.length, 1);
    assert.equal(registered.calls[0].method, 'wtTrackRegistration');
    assert.equal(JSON.stringify(registered.calls[0].data), JSON.stringify(registration.data));
    registered.listeners['cc:onConsent']();
    assert.equal(registered.calls.length, 1);

    const revokedRegistration = browser([registration], { ready: false });
    revokedRegistration.consent(false);
    revokedRegistration.listeners['cc:onChange']();
    revokedRegistration.window.wtinit = true;
    revokedRegistration.consent(true);
    revokedRegistration.listeners['cc:onConsent']();
    assert.equal(revokedRegistration.calls.length, 0);

    const delayed = browser([product, checkout], { ready: false });
    assert.equal(delayed.calls.length, 0);
    delayed.tick();
    assert.equal(delayed.calls.length, 0);
    delayed.window.wtinit = true;
    delayed.tick();
    assert.deepEqual(delayed.calls.map(call => call.method), ['wtTrackProductView', 'wtTrackCheckout']);
    delayed.tick();
    assert.equal(delayed.calls.length, 2);

    const denied = browser([product, purchase], { consent: false });
    assert.equal(denied.calls.length, 0);
    assert.equal(denied.stored.size, 0);
    denied.consent(true);
    denied.listeners['cc:onConsent']();
    assert.equal(denied.calls.length, 2);

    const revoked = browser([product], { ready: false });
    revoked.consent(false);
    revoked.listeners['cc:onChange']();
    revoked.window.wtinit = true;
    revoked.consent(true);
    revoked.listeners['cc:onConsent']();
    assert.equal(revoked.calls.length, 0);

    const first = browser([purchase, purchase]);
    assert.equal(first.calls.length, 1);
    const refreshed = browser([purchase], { stored: first.stored });
    assert.equal(refreshed.calls.length, 0);
    assert.equal(browser([purchase], { blockStorage: true }).calls.length, 0);

    const added = { id: 'unique-add', method: 'wtTrackAddToCart', data: { id: '42', quantity: 2 } };
    const cart = browser([], { cartEvents: [added] });
    cart.cart();
    cart.listeners['wc-blocks_added_to_cart']();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(cart.fetches(), 2);
    assert.equal(cart.calls.length, 1);
    assert.equal(cart.calls[0].data.quantity, 2);

    const deniedCart = browser([], { consent: false, cartEvents: [added] });
    deniedCart.cart();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(deniedCart.calls.length, 0);

    const custom = browser([], { cartEvents: [added] });
    const settings = { data: 'action=woocommerce_ajax_add_to_cart&product_id=42' };
    custom.customCart(settings, { success: false });
    custom.customCart({ data: 'action=unrelated' }, { fragments: {} });
    assert.equal(custom.fetches(), 0);
    custom.customCart(settings, { fragments: {}, cart_hash: 'hash' });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(custom.calls.length, 1);

    const missingMethod = browser([product], { ready: false });
    delete missingMethod.window.wtTrackProductView;
    missingMethod.window.wtinit = true;
    missingMethod.tick();
    assert.equal(missingMethod.calls.length, 0);
    missingMethod.window.wtTrackProductView = data => missingMethod.calls.push(data);
    missingMethod.tick();
    assert.equal(missingMethod.calls.length, 1);

    console.log('WebsiteTool browser tests passed: consent, async loading, revocation, AJAX/Blocks, deduplication, blocked storage, registrations.');
}

test().catch(error => { console.error(error); process.exitCode = 1; });
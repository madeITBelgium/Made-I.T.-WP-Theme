document.addEventListener('DOMContentLoaded', function () {

    const body = document.body;

    /**
     * Open de winkelwagen.
     */
    function openCart() {

        const component = document.getElementById('MI_cart_component');

        if (!component) return;

        body.classList.add('MI_cart_open');

        const icon = document.getElementById('MI_cart_icon');

        if (icon) {
            icon.setAttribute('aria-expanded', 'true');
        }
    }


    /**
     * Sluit de winkelwagen.
     */
    function closeCart() {

        body.classList.remove('MI_cart_open');

        const icon = document.getElementById('MI_cart_icon');

        if (icon) {
            icon.setAttribute('aria-expanded', 'false');
        }
    }


    /**
     * Openen en sluiten via event delegation.
     */
    document.addEventListener('click', function (event) {

        const openButton = event.target.closest('[data-open-cart]');
        const closeButton = event.target.closest('[data-close-cart]');

        if (openButton) {
            event.preventDefault();
            openCart();
        }

        if (closeButton) {
            event.preventDefault();
            closeCart();
        }

    });


    /**
     * Sluiten met Escape.
     */
    document.addEventListener('keydown', function (event) {

        if (event.key === 'Escape') {
            closeCart();
        }

    });


    /**
     * AJAX-aanvraag naar WordPress.
     */
    async function cartRequest(action, data = {}) {

        const formData = new FormData();

        formData.append('action', 'shop_controls_cart_action');
        formData.append('nonce', shopControlsCart.nonce);
        formData.append('cart_action', action);

        Object.keys(data).forEach(function (key) {
            formData.append(key, data[key]);
        });

        try {

            const response = await fetch(shopControlsCart.ajaxUrl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.data?.message || shopControlsCart.texts.error
                );
            }

            updateCartFragments(result.data.fragments);

            return result.data;

        } catch (error) {

            console.error('Shop Controls:', error);

            showCartMessage(
                error.message || shopControlsCart.texts.error,
                'error'
            );

            throw error;
        }
    }


    /**
     * Vervang de HTML-fragments.
     */
    function updateCartFragments(fragments) {

        if (!fragments) return;

        Object.keys(fragments).forEach(function (selector) {

            const currentElement = document.querySelector(selector);
            const html = fragments[selector];

            if (currentElement) {

                if (!html) {
                    currentElement.remove();
                    return;
                }

                const template = document.createElement('template');
                template.innerHTML = html.trim();

                const newElement = template.content.firstElementChild;

                if (newElement) {
                    currentElement.replaceWith(newElement);
                }

            } else if (html) {

                // Een pictogram dat eerder verborgen was, kan nu verschijnen.
                const template = document.createElement('template');
                template.innerHTML = html.trim();

                const newElement = template.content.firstElementChild;

                if (newElement && selector === '#MI_cart_icon') {
                    document.body.appendChild(newElement);
                }
            }

        });
    }


    /**
     * Toon een melding in de winkelwagen.
     */
    function showCartMessage(message, type = 'success') {

        const component = document.getElementById('MI_cart_component');

        if (!component) return;

        let messageElement = component.querySelector('.MI_cart-message');

        if (!messageElement) {

            messageElement = document.createElement('div');
            messageElement.className = 'MI_cart-message';

            const panel = component.querySelector('.MI_cart-panel');

            if (panel) {
                panel.prepend(messageElement);
            }
        }

        messageElement.textContent = message;
        messageElement.className = 'MI_cart-message MI_cart-message--' + type;
    }


    /**
     * Product verwijderen.
     */
    document.addEventListener('click', async function (event) {

        const removeButton = event.target.closest('[data-cart-action="remove"]');

        if (!removeButton) return;

        event.preventDefault();

        const itemKey = removeButton.dataset.cartItem;

        removeButton.disabled = true;

        try {

            await cartRequest('remove', {
                cart_item: itemKey
            });

        } catch (error) {

            removeButton.disabled = false;
        }

    });


    /**
     * Aantal verhogen of verlagen.
     */
    document.addEventListener('click', function (event) {

        const quantityButton = event.target.closest('[data-quantity-change]');

        if (!quantityButton) return;

        const product = quantityButton.closest('.MI_cart-product');

        if (!product) return;

        const input = product.querySelector('[data-cart-quantity]');

        if (!input) return;

        const change = parseInt(quantityButton.dataset.quantityChange, 10);
        const current = parseInt(input.value, 10) || 0;

        input.value = Math.max(0, current + change);

        input.dispatchEvent(new Event('change', {
            bubbles: true
        }));

    });


    /**
     * Aantal wijzigen.
     */
    document.addEventListener('change', async function (event) {

        const input = event.target.closest('[data-cart-quantity]');

        if (!input) return;

        const itemKey = input.dataset.cartItem;
        const quantity = Math.max(0, parseInt(input.value, 10) || 0);

        input.disabled = true;

        try {

            await cartRequest('quantity', {
                cart_item: itemKey,
                quantity: quantity
            });

        } catch (error) {

            input.disabled = false;
        }

    });


    /**
     * Kortingscode toepassen.
     */
    document.addEventListener('submit', async function (event) {

        const couponForm = event.target.closest('[data-cart-form="coupon"]');

        if (!couponForm) return;

        event.preventDefault();

        const input = couponForm.querySelector('[name="coupon_code"]');
        const button = couponForm.querySelector('button');

        if (!input || !input.value.trim()) return;

        button.disabled = true;

        try {

            const result = await cartRequest('coupon', {
                coupon_code: input.value.trim()
            });

            if (result.message) {
                showCartMessage(result.message, 'success');
            }

        } catch (error) {

            button.disabled = false;
        }

    });

    /**
     * Kortingscode verwijderen.
     */
    document.addEventListener('click', async function (event) {

        const removeButton = event.target.closest('[data-remove-coupon]');

        if (!removeButton) return;

        event.preventDefault();

        const couponCode = removeButton.dataset.removeCoupon;

        removeButton.disabled = true;

        try {

            const result = await cartRequest('remove_coupon', {
                coupon_code: couponCode
            });

            if (result.message) {
                showCartMessage(result.message, 'success');
            }

        } catch (error) {

            removeButton.disabled = false;

        }

    });


    /**
     * Luister naar de bestaande WooCommerce AJAX add-to-cart.
     *
     * Dit laat inc/add-to-cart-ajax.php ongemoeid.
     */
    if (window.jQuery) {

    /**
     * Product toegevoegd.
     */
    jQuery(document.body).on('added_to_cart', function () {

        refreshWooCart().then(function () {
            openCart();
        });

    });


    /**
     * Product verwijderd.
     */
    jQuery(document.body).on('removed_from_cart', function () {

            refreshWooCart();

        });

    }


    /**
     * Vernieuw de WooCommerce winkelwagenfragmenten.
     */
    async function refreshWooCart() {

        try {

            const response = await fetch(
                wc_cart_fragments_params.wc_ajax_url
                    .toString()
                    .replace('%%endpoint%%', 'get_refreshed_fragments'),
                {
                    method: 'POST',
                    credentials: 'same-origin'
                }
            );

            const result = await response.json();

            if (!result || !result.fragments) {
                return;
            }

            updateCartFragments(result.fragments);

        } catch (error) {

            console.error('Winkelwagen vernieuwen mislukt:', error);

        }

    }


    // /**
    //  * Voorkom dat de oude Bootstrap add-to-cart popup opent.
    //  */
    // document.addEventListener('show.bs.modal', function (event) {

    //     if (event.target && event.target.id === 'addToCartPopup') {

    //         // Voorkom dat Bootstrap de modal opent.
    //         event.preventDefault();

    //     }

    // }, true);


    // /**
    //  * Extra beveiliging:
    //  * Verwijder de popup als een ander script ze toch zichtbaar maakt.
    //  */
    // const oldCartPopup = document.getElementById('addToCartPopup');

    // if (oldCartPopup) {

    //     const observer = new MutationObserver(function () {

    //         if (
    //             oldCartPopup.classList.contains('show') ||
    //             oldCartPopup.style.display === 'block'
    //         ) {

    //             oldCartPopup.classList.remove('show');
    //             oldCartPopup.style.display = 'none';

    //             oldCartPopup.setAttribute('aria-hidden', 'true');
    //             oldCartPopup.removeAttribute('aria-modal');
    //             oldCartPopup.removeAttribute('role');

    //             document.body.classList.remove('modal-open');

    //             document.querySelectorAll('.modal-backdrop').forEach(function (backdrop) {
    //                 backdrop.remove();
    //             });

    //         }

    //     });

    //     observer.observe(oldCartPopup, {
    //         attributes: true,
    //         attributeFilter: ['class', 'style', 'aria-modal']
    //     });

    // }

});
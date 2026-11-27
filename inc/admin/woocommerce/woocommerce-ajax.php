<?php
/**
 * Shop Controls - Frontend WooCommerce Cart
 *
 * Dit bestand beheert:
 * - Het nieuwe winkelwagenpictogram
 * - De popup/sidebar
 * - De inhoud van de winkelwagen
 * - Producten verwijderen en aantallen aanpassen
 * - Kortingscodes toepassen
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Controleer of Shop Controls actief is.
 */
function shop_controls_frontend_enabled() {
    if (!function_exists('shop_controls_get_options')) {
        return false;
    }

    $options = shop_controls_get_options();

    return isset($options['cart_enabled']) && $options['cart_enabled'] === '1';
}


/**
 * Haal de instellingen op.
 */
function shop_controls_frontend_options() {
    if (!function_exists('shop_controls_get_options')) {
        return [];
    }

    return shop_controls_get_options();
}


/**
 * Bepaal of het winkelwagenpictogram op deze pagina zichtbaar mag zijn.
 *
 * all         = op alle pagina's
 * woocommerce = enkel op WooCommerce-pagina's
 * none        = nergens
 */
function shop_controls_frontend_icon_visible() {

    if (!shop_controls_frontend_enabled()) {
        return false;
    }

    $options = shop_controls_frontend_options();

    $visibility = $options['icon_visibility'] ?? 'none';

    if ($visibility === 'none') {
        return false;
    }

    if ($visibility === 'all') {
        return true;
    }

    if ($visibility === 'woocommerce') {

        if (!function_exists('is_woocommerce')) {
            return false;
        }

        return (
            is_woocommerce() ||
            is_cart() ||
            is_checkout() ||
            is_account_page()
        );
    }

    return false;
}


/**
 * Controleer of de winkelwagen leeg is en eventueel verborgen moet worden.
 */
function shop_controls_frontend_hide_empty() {

    $options = shop_controls_frontend_options();

    if (($options['hide_empty_cart'] ?? '0') !== '1') {
        return false;
    }

    return WC()->cart && WC()->cart->is_empty();
}


/**
 * SVG winkelwagenicoon.
 */
function shop_controls_cart_svg() {
    return '
        <svg xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
    ';
}


/**
 * Bouw het zwevende winkelwagenpictogram.
 */
function shop_controls_render_cart_icon() {
    if (!shop_controls_frontend_enabled()) {
        return '';
    }

    if (!shop_controls_frontend_icon_visible()) {
        return '';
    }

    $options = shop_controls_frontend_options();

    $position = $options['icon_position'] ?? 'right';
    $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;

    $hidden = shop_controls_frontend_hide_empty();

    ob_start();
    ?>

    <button
        type="button"
        id="MI_cart_icon"
        class="MI_cart-icon MI_cart-icon--<?php echo esc_attr($position); ?>"
        aria-label="<?php esc_attr_e('Open winkelwagen', 'madeit'); ?>"
        aria-expanded="false"
        data-open-cart
        <?php echo $hidden ? 'hidden' : ''; ?>
    >
        <?php echo shop_controls_cart_svg(); ?>

        <span class="MI_cart-icon-count">
            <?php echo esc_html($count); ?>
        </span>
    </button>

    <?php
    return ob_get_clean();
}


/**
 * Bouw het winkelwagenpictogram voor het navigatiemenu.
 */
function shop_controls_render_menu_cart() {
    if (!shop_controls_frontend_enabled()) {
        return '';
    }

    $options = shop_controls_frontend_options();

    if (empty($options['add_to_menu']) || $options['add_to_menu'] !== '1') {
        return '';
    }

    $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;

    ob_start();
    ?>

    <a
        href="<?php echo esc_url(wc_get_cart_url()); ?>"
        id="MI_menu_cart"
        class="wc-menu-cart nav-link"
        data-open-cart
        aria-label="<?php esc_attr_e('Open winkelwagen', 'madeit'); ?>"
    >
        <?php echo shop_controls_cart_svg(); ?>

        <span class="MI_cart-icon-count">
            <?php echo esc_html($count); ?>
        </span>
    </a>

    <?php
    return ob_get_clean();
}


/**
 * Vervang het bestaande winkelwagenpictogram in het menu.
 *
 * We verwijderen enkel de bestaande filter.
 * De oorspronkelijke functie in functions.php blijft bestaan,
 * maar wordt niet meer automatisch uitgevoerd.
 */
function shop_controls_replace_old_cart_menu() {

    if (function_exists('madeit_woocommerce_shopping_cart_in_menu')) {

        remove_filter(
            'wp_nav_menu_items',
            'madeit_woocommerce_shopping_cart_in_menu',
            10
        );
    }

    add_filter(
        'wp_nav_menu_items',
        'shop_controls_add_cart_to_menu',
        10,
        2
    );
}
add_action('init', 'shop_controls_replace_old_cart_menu', 99);


/**
 * Voeg het nieuwe winkelwagenpictogram aan het menu toe.
 */
function shop_controls_add_cart_to_menu($menu, $args) {

    if (!shop_controls_frontend_enabled()) {
        return $menu;
    }

    $options = shop_controls_frontend_options();

    if (($options['add_to_menu'] ?? '0') !== '1') {
        return $menu;
    }

    // Behoud de bestaande locatie van het winkelwagenmenu.
    if (!isset($args->theme_location) || $args->theme_location !== 'top') {
        return $menu;
    }

    $cart_link = shop_controls_render_menu_cart();

    if (!$cart_link) {
        return $menu;
    }

    return $menu . '<li class="menu-item nav-item shopping-menu-item MI_menu-cart-item">' . $cart_link . '</li>';
}


/**
 * Render de winkelwageninhoud.
 */
function shop_controls_render_cart_contents() {

    if (!WC()->cart) {
        return '';
    }

    $cart = WC()->cart;

    ob_start();
    ?>

    <div class="MI_cart-content">

        <?php if ($cart->is_empty()) : ?>

            <div class="MI_cart-empty">
                <div class="MI_cart-empty-icon">
                    <?php echo shop_controls_cart_svg(); ?>
                </div>

                <h3>Je winkelwagen is leeg</h3>

                <p>Voeg producten toe om ze hier te bekijken.</p>

                <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="MI_cart-button MI_cart-button--secondary">
                    Verder winkelen
                </a>
            </div>

        <?php else : ?>

            <div class="MI_cart-products">

                <?php foreach ($cart->get_cart() as $cart_item_key => $cart_item) :

                    $product = $cart_item['data'];

                    if (!$product || !$product->exists() || $cart_item['quantity'] <= 0) {
                        continue;
                    }

                    $product_permalink = $product->is_visible()
                        ? $product->get_permalink($cart_item)
                        : '';

                    $thumbnail = $product->get_image('woocommerce_thumbnail');

                    ?>

                    <div class="MI_cart-product" data-cart-item="<?php echo esc_attr($cart_item_key); ?>">

                        <div class="MI_cart-product-image">
                            <?php
                            if ($product_permalink) {
                                echo '<a href="' . esc_url($product_permalink) . '">' . $thumbnail . '</a>';
                            } else {
                                echo $thumbnail;
                            }
                            ?>
                        </div>

                        <div class="MI_cart-product-info">

                            <div class="MI_cart-product-heading">

                                <div class="MI_cart-product-name">
                                    <?php
                                    if ($product_permalink) {
                                        echo '<a href="' . esc_url($product_permalink) . '">' . esc_html($product->get_name()) . '</a>';
                                    } else {
                                        echo esc_html($product->get_name());
                                    }
                                    ?>
                                </div>

                                <button
                                    type="button"
                                    class="MI_cart-remove"
                                    data-cart-action="remove"
                                    data-cart-item="<?php echo esc_attr($cart_item_key); ?>"
                                    aria-label="Verwijder <?php echo esc_attr($product->get_name()); ?>"
                                >
                                    &times;
                                </button>

                            </div>

                            <?php
                            echo wc_get_formatted_cart_item_data($cart_item);
                            ?>

                            <div class="MI_cart-product-bottom">

                                <div class="MI_cart-quantity">

                                    <button
                                        type="button"
                                        data-quantity-change="-1"
                                        aria-label="Aantal verminderen"
                                    >
                                        −
                                    </button>

                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value="<?php echo esc_attr($cart_item['quantity']); ?>"
                                        data-cart-quantity
                                        data-cart-item="<?php echo esc_attr($cart_item_key); ?>"
                                        aria-label="Aantal"
                                    >

                                    <button
                                        type="button"
                                        data-quantity-change="1"
                                        aria-label="Aantal verhogen"
                                    >
                                        +
                                    </button>

                                </div>

                                <div class="MI_cart-product-price">
                                    <?php
                                    // if promotional price exists, display the original price alongside the promotional price
                                    if ($product->is_on_sale()) :
                                        echo '<div class="d-flex">';
                                        echo '<span class="MI_cart-product-original-price">' . wc_price($product->get_regular_price()) . '</span>';
                                        echo '<span class="MI_cart-product-sale-price">' . wc_price($product->get_sale_price()) . '</span>';
                                        echo '</div>';
                                        ?>
                                        <div class="MI_cart-discounted-price">
                                            Bespaar <?php echo wc_price($product->get_regular_price() - $product->get_sale_price()); ?>
                                        </div>
                                        <?php
                                    else :
                                        echo wp_kses_post(
                                        WC()->cart->get_product_subtotal(
                                            $product,
                                            $cart_item['quantity']
                                        )
                                    );
                                    endif;
                                    ?>
                                </div>

                            </div>

                        </div>

                    </div>

                <?php endforeach; ?>

            </div>


            <?php
            $options = shop_controls_frontend_options();

            if (($options['coupon_enabled'] ?? '0') === '1') :

                $coupon_display = $options['coupon_display'] ?? 'collapsed';
                $coupon_title = $options['coupon_title'] ?? 'Heb je een kortingscode?';
                $coupon_placeholder = $options['coupon_placeholder'] ?? 'Coupon Code';
                $coupon_button = $options['coupon_button'] ?? 'Toepassen';
                ?>

                <div class="MI_cart-coupon-area">

                    <details
                        class="MI_cart-coupon"
                        <?php echo $coupon_display === 'open' ? 'open' : ''; ?>
                    >

                        <summary>
                            <span><?php echo esc_html($coupon_title); ?></span>
                            <span class="MI_cart-coupon-arrow">+</span>
                        </summary>

                        <form class="MI_cart-coupon-form" data-cart-form="coupon">

                            <input
                                type="text"
                                name="coupon_code"
                                placeholder="<?php echo esc_attr($coupon_placeholder); ?>"
                                autocomplete="off"
                                required
                            >

                            <button type="submit">
                                <?php echo esc_html($coupon_button); ?>
                            </button>

                        </form>

                    </details>

                </div>

            <?php endif; ?>


            <div class="MI_cart-summary">

                <div class="MI_cart-subtotal">
                    <span>Subtotaal</span>
                    <strong><?php echo wp_kses_post($cart->get_cart_subtotal()); ?></strong>
                </div>

                <?php
                $applied_coupons = $cart->get_applied_coupons();

                if (!empty($applied_coupons)) :
                ?>

                    <div class="MI_cart-coupon-applied">

                        <?php foreach ($applied_coupons as $coupon_code) : ?>

                            <div class="MI_cart-summary-text MI_cart-coupon-text">

                                <span>Coupon</span>

                                <div class="MI_cart-coupon-code MI_cart-coupon-code-wrapper">

                                    <span>
                                        <?php echo esc_html($coupon_code); ?>
                                    </span>

                                    <button
                                        type="button"
                                        class="MI_cart-remove-coupon"
                                        data-remove-coupon="<?php echo esc_attr($coupon_code); ?>"
                                        aria-label="<?php echo esc_attr('Verwijder kortingscode ' . $coupon_code); ?>"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            width="8"
                                            height="8"
                                            viewBox="0 0 8 8"
                                            fill="none">
                                            <path
                                                d="M4.61012 4.00617L7.206 1.41022C7.37493 1.24137 7.37493 0.968349 7.206 0.799493C7.03714 0.630638 6.76412 0.630638 6.59527 0.799493L3.99932 3.39544L1.40345 0.799493C1.23451 0.630638 0.961573 0.630638 0.792717 0.799493C0.623782 0.968349 0.623782 1.24137 0.792717 1.41022L3.38859 4.00617L0.792717 6.60212C0.623782 6.77097 0.623782 7.04399 0.792717 7.21285C0.876868 7.29708 0.987514 7.33939 1.09808 7.33939C1.20865 7.33939 1.31921 7.29708 1.40345 7.21285L3.99932 4.6169L6.59527 7.21285C6.6795 7.29708 6.79006 7.33939 6.90063 7.33939C7.0112 7.33939 7.12177 7.29708 7.206 7.21285C7.37493 7.04399 7.37493 6.77097 7.206 6.60212L4.61012 4.00617Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </button>

                                </div>

                            </div>

                            <div class="MI_cart-coupon-amount">
                                <?php
                                echo wp_kses_post(
                                    '-' . wc_price(
                                        $cart->get_coupon_discount_amount($coupon_code)
                                    )
                                );
                                ?>
                            </div>

                        <?php endforeach; ?>

                    </div>

                <?php endif; ?>

               

                <?php if (wc_tax_enabled() && $cart->display_prices_including_tax()) : ?>

                    <div class="MI_cart-tax-note">
                        Inclusief btw
                    </div>

                <?php else : ?>

                    <div class="MI_cart-tax-note">
                        Exclusief eventuele verzendkosten en btw
                    </div>

                <?php endif; ?>

                <div class="MI_cart-actions">

                    <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="MI_cart-button MI_cart-button--secondary">
                        Bekijk winkelwagen
                    </a>

                    <a href="<?php echo esc_url(wc_get_checkout_url()); ?>" class="MI_cart-button MI_cart-button--primary">
                        Afrekenen
                    </a>

                </div>

            </div>

        <?php endif; ?>

    </div>

    <?php
    return ob_get_clean();
}


/**
 * Render de volledige popup/sidebar.
 */
function shop_controls_render_cart_component() {

    if (!shop_controls_frontend_enabled()) {
        return '';
    }

    $options = shop_controls_frontend_options();

    $display = $options['cart_display'] ?? 'sidebar';

    $display_class = $display === 'popup'
        ? 'MI_cart--popup'
        : 'MI_cart--sidebar';

    ob_start();
    ?>

    <div id="MI_cart_component" class="MI_cart <?php echo esc_attr($display_class); ?>">

        <div class="MI_cart-overlay" data-close-cart></div>

        <div
            class="MI_cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Winkelwagen"
        >

            <div class="MI_cart-header">

                <div class="MI_cart-header-title">
                    <h2>Winkelwagen</h2>

                    <span class="MI_cart-header-count">
                        <?php echo esc_html(WC()->cart ? WC()->cart->get_cart_contents_count() : 0); ?>
                    </span>
                </div>

                <button
                    type="button"
                    class="MI_cart-close"
                    data-close-cart
                    aria-label="Winkelwagen sluiten"
                >
                    &times;
                </button>

            </div>

            <?php echo shop_controls_render_cart_contents(); ?>

        </div>

    </div>

    <?php
    return ob_get_clean();
}


/**
 * Toon de winkelwagencomponent en het zwevende pictogram.
 */
function shop_controls_output_cart_component() {

    if (!shop_controls_frontend_enabled()) {
        return;
    }

    if (!function_exists('WC') || !WC()->cart) {
        return;
    }

    echo shop_controls_render_cart_component();

    echo shop_controls_render_cart_icon();
}
add_action('wp_footer', 'shop_controls_output_cart_component', 20);


/**
 * Voeg onze winkelwagencomponent toe aan de WooCommerce fragments.
 *
 * Hierdoor wordt de inhoud ook vernieuwd na een bestaande
 * AJAX add-to-cart actie.
 */
function shop_controls_cart_fragments($fragments) {

    if (!shop_controls_frontend_enabled() || !WC()->cart) {
        return $fragments;
    }

    $fragments['#MI_cart_component'] = shop_controls_render_cart_component();

    $fragments['#MI_cart_icon'] = shop_controls_render_cart_icon();

    $menu_cart = shop_controls_render_menu_cart();

    if ($menu_cart) {
        $fragments['#MI_menu_cart'] = $menu_cart;
    }

    return $fragments;
}
add_filter('woocommerce_add_to_cart_fragments', 'shop_controls_cart_fragments');


/**
 * AJAX: winkelwagenacties.
 *
 * Ondersteunde acties:
 * - refresh
 * - remove
 * - quantity
 * - coupon
 */
function shop_controls_cart_ajax() {

    check_ajax_referer('shop_controls_cart', 'nonce');

    if (!function_exists('WC') || !WC()->cart) {
        wp_send_json_error([
            'message' => 'De winkelwagen kon niet worden geladen.'
        ]);
    }

    $action_type = isset($_POST['cart_action'])
        ? sanitize_key(wp_unslash($_POST['cart_action']))
        : '';

    $message = '';

    switch ($action_type) {

        case 'remove':

            $cart_item_key = isset($_POST['cart_item'])
                ? wc_clean(wp_unslash($_POST['cart_item']))
                : '';

            if ($cart_item_key && WC()->cart->remove_cart_item($cart_item_key)) {
                $message = 'Product verwijderd.';
            }

            break;


        case 'quantity':

            $cart_item_key = isset($_POST['cart_item'])
                ? wc_clean(wp_unslash($_POST['cart_item']))
                : '';

            $quantity = isset($_POST['quantity'])
                ? absint($_POST['quantity'])
                : 0;

            if ($cart_item_key && WC()->cart->get_cart_item($cart_item_key)) {

                WC()->cart->set_quantity(
                    $cart_item_key,
                    $quantity,
                    true
                );

                $message = 'Winkelwagen bijgewerkt.';
            }

            break;


        case 'coupon':

            $coupon_code = isset($_POST['coupon_code'])
                ? wc_format_coupon_code(wp_unslash($_POST['coupon_code']))
                : '';

            if (!$coupon_code) {
                wp_send_json_error([
                    'message' => 'Vul een kortingscode in.'
                ]);
            }

            if (WC()->cart->apply_coupon($coupon_code)) {
                $message = 'Kortingscode toegepast.';
            } else {
                $message = 'Deze kortingscode kon niet worden toegepast.';
            }

            break;


        case 'refresh':

            $message = '';

            break;


        case 'remove_coupon':

        $coupon_code = isset($_POST['coupon_code'])
            ? wc_format_coupon_code(wp_unslash($_POST['coupon_code']))
            : '';

        if ($coupon_code) {

            WC()->cart->remove_coupon($coupon_code);

            $message = 'Kortingscode verwijderd.';

        }

        break;


        default:

            wp_send_json_error([
                'message' => 'Ongeldige winkelwagenactie.'
            ]);
    }

    WC()->cart->calculate_totals();

    $fragments = [];

    $fragments['#MI_cart_component'] = shop_controls_render_cart_component();
    $fragments['#MI_cart_icon'] = shop_controls_render_cart_icon();

    $menu_cart = shop_controls_render_menu_cart();

    if ($menu_cart) {
        $fragments['#MI_menu_cart'] = $menu_cart;
    }

    wp_send_json_success([
        'message'   => $message,
        'fragments' => $fragments,
        'cart_hash' => WC()->cart->get_cart_hash()
    ]);
}

add_action('wp_ajax_shop_controls_cart_action', 'shop_controls_cart_ajax');
add_action('wp_ajax_nopriv_shop_controls_cart_action', 'shop_controls_cart_ajax');

/**
 * Dashboard metrics ophalen voor de admin pagina.
 */
function shop_controls_dashboard_ajax() {
    if (!function_exists('shop_controls_get_dashboard_metrics')) {
        wp_send_json_error(['message' => 'Dashboard metrics unavailable.']);
    }

    wp_send_json_success(shop_controls_get_dashboard_metrics());
}
add_action('wp_ajax_shop_controls_get_dashboard_metrics', 'shop_controls_dashboard_ajax');


/**
 * Laad de frontend assets.
 */
function shop_controls_enqueue_frontend_assets() {

    if (!shop_controls_frontend_enabled()) {
        return;
    }

    if (!function_exists('WC')) {
        return;
    }

    wp_enqueue_style(
        'shop-controls-cart',
        get_template_directory_uri() . '/inc/admin/woocommerce/assets/cart.css',
        [],
        '1.0.0'
    );

    wp_enqueue_script(
        'shop-controls-cart',
        get_template_directory_uri() . '/inc/admin/woocommerce/assets/cart.js',
        ['jquery'],
        '1.0.0',
        true
    );

    wp_localize_script('shop-controls-cart', 'shopControlsCart', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('shop_controls_cart'),
        'texts'   => [
            'error'   => 'Er ging iets mis. Probeer het opnieuw.',
            'loading' => 'Even geduld...'
        ]
    ]);
}
add_action('wp_enqueue_scripts', 'shop_controls_enqueue_frontend_assets');
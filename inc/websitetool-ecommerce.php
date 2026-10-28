<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_wt_product($product, $quantity = 1)
{
    $category_product_id = $product->get_parent_id() ?: $product->get_id();
    $categories = get_the_terms($category_product_id, 'product_cat');
    $category = !is_wp_error($categories) && !empty($categories) ? reset($categories) : null;

    return [
        'id'          => (string) $product->get_id(),
        'name'        => $product->get_name(),
        'price'       => (float) wc_get_price_to_display($product),
        'category_id' => $category ? (string) $category->term_id : '',
        'category'    => $category ? $category->name : '',
        'sku'         => $product->get_sku(),
        'quantity'    => (float) $quantity,
    ];
}

function madeit_wt_added_to_cart($cart_item_key, $product_id, $quantity, $variation_id)
{
    if (!WC()->session) {
        return;
    }

    $product = wc_get_product($variation_id ?: $product_id);
    if (!$product) {
        return;
    }

    $events = WC()->session->get('madeit_wt_cart_events', []);
    $events[] = [
        'id'     => wp_generate_uuid4(),
        'method' => 'wtTrackAddToCart',
        'data'   => madeit_wt_product($product, $quantity),
    ];
    WC()->session->set('madeit_wt_cart_events', array_slice($events, -50));
}
add_action('woocommerce_add_to_cart', 'madeit_wt_added_to_cart', 10, 4);

function madeit_wt_take_cart_events()
{
    if (!WC()->session) {
        return [];
    }

    $events = WC()->session->get('madeit_wt_cart_events', []);
    WC()->session->__unset('madeit_wt_cart_events');

    return $events;
}

function madeit_wt_cart_events()
{
    check_ajax_referer('madeit_wt_cart_events', 'nonce');
    wp_send_json_success(madeit_wt_take_cart_events());
}
add_action('wc_ajax_madeit_wt_cart_events', 'madeit_wt_cart_events');

function madeit_wt_customer_registered($customer_id)
{
    if ((is_admin() && !wp_doing_ajax()) || wp_doing_cron() || !WC()->session) {
        return;
    }

    update_user_meta($customer_id, '_madeit_wt_registration_event', [
        'id'     => wp_generate_uuid4(),
        'method' => 'wtTrackRegistration',
        'data'   => [
            'value'    => 0,
            'currency' => get_woocommerce_currency(),
            'status'   => 'completed',
        ],
    ]);
}
add_action('woocommerce_created_customer', 'madeit_wt_customer_registered');

function madeit_wt_enqueue_ecommerce()
{
    if (is_admin()) {
        return;
    }

    wp_enqueue_script('madeit-websitetool-ecommerce', get_parent_theme_file_uri('/assets/js/websitetool-ecommerce.js'), [], MADEIT_VERSION, true);
    wp_localize_script('madeit-websitetool-ecommerce', 'madeitWtEcommerce', [
        'cartUrl' => WC_AJAX::get_endpoint('madeit_wt_cart_events'),
        'nonce'   => wp_create_nonce('madeit_wt_cart_events'),
        'siteId'  => get_current_blog_id(),
    ]);
}
add_action('wp_enqueue_scripts', 'madeit_wt_enqueue_ecommerce');

function madeit_wt_page_events()
{
    $events = madeit_wt_take_cart_events();

    $customer_id = get_current_user_id();
    $registration = $customer_id ? get_user_meta($customer_id, '_madeit_wt_registration_event', true) : '';
    if ($registration && delete_user_meta($customer_id, '_madeit_wt_registration_event', $registration)) {
        $events[] = $registration;
    }

    if (is_product()) {
        $product = wc_get_product(get_queried_object_id());
        if ($product) {
            $events[] = ['method' => 'wtTrackProductView', 'data' => madeit_wt_product($product)];
        }
    }

    if (is_checkout() && !is_wc_endpoint_url() && WC()->cart && !WC()->cart->is_empty()) {
        $events[] = ['method' => 'wtTrackCheckout', 'data' => (float) WC()->cart->get_total('edit')];
    }

    if (is_order_received_page()) {
        $order = wc_get_order(absint(get_query_var('order-received')));
        $key = isset($_GET['key']) && is_string($_GET['key']) ? wc_clean(wp_unslash($_GET['key'])) : '';
        $can_view = $order && (($key !== '' && hash_equals($order->get_order_key(), $key))
            || (get_current_user_id() && (int) $order->get_customer_id() === get_current_user_id()));

        if ($can_view && $order->has_status(['processing', 'completed', 'on-hold'])) {
            $products = [];
            foreach ($order->get_items() as $item) {
                $quantity = (float) $item->get_quantity();
                $product = $item->get_product();
                $data = $product ? madeit_wt_product($product, $quantity) : [
                    'id'          => (string) ($item->get_variation_id() ?: $item->get_product_id()),
                    'category_id' => '',
                    'category'    => '',
                    'sku'         => '',
                    'quantity'    => $quantity,
                ];
                $data['name'] = $item->get_name();
                $data['price'] = $quantity > 0 ? (float) $item->get_total() / $quantity : 0;
                $products[] = $data;
            }
            $events[] = [
                'method' => 'wtTrackPurchase',
                'data'   => [
                    'order_id'    => (string) $order->get_order_number(),
                    'total_value' => (float) $order->get_total(),
                    'user_email'  => $order->get_billing_email(),
                    'products'    => $products,
                ],
                'purchaseId' => (string) $order->get_id(),
            ];
        }
    }

    if ($events) {
        echo '<script type="application/json" id="madeit-wt-page-events">'.wp_json_encode($events, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT).'</script>';
    }
}
add_action('wp_footer', 'madeit_wt_page_events', 5);

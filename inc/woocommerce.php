<?php

if (!function_exists('madeit_loop_columns')) {
    function madeit_loop_columns()
    {
        return 3; // 3 products per row
    }
    add_filter('loop_shop_columns', 'madeit_loop_columns', 999);
}

add_action('init', 'get_custom_coupon_code_to_session');
function get_custom_coupon_code_to_session()
{
    if (isset($_GET['coupon_code'])) {
        // Ensure that customer session is started
        if (isset(WC()->session) && !WC()->session->has_session()) {
            WC()->session->set_customer_session_cookie(true);
        }

        // Check and register coupon code in a custom session variable
        $coupon_code = WC()->session->get('coupon_code');
        if (empty($coupon_code)) {
            $coupon_code = esc_attr($_GET['coupon_code']);
            WC()->session->set('coupon_code', $coupon_code); // Set the coupon code in session
        }
    }
}

add_action('woocommerce_before_checkout_form', 'add_discout_to_checkout', 10, 0);
add_action('woocommerce_review_order_before_cart_contents', 'add_discout_to_checkout', 10, 0);
function add_discout_to_checkout()
{
    // Set coupon code
    $coupon_code = WC()->session->get('coupon_code');
    if (!empty($coupon_code) && !WC()->cart->has_discount($coupon_code)) {
        WC()->cart->add_discount($coupon_code); // apply the coupon discount
        WC()->session->__unset('coupon_code'); // remove coupon code from session
    }
}

function madeit_update_berocket_aapf_listener_br_options($options)
{
    $options['products_holder_id'] = 'div.row.columns-3';
    $options['woocommerce_result_count_class'] = '.woocommerce-result-count';
    $options['woocommerce_ordering_class'] = 'form.woocommerce-ordering';
    $options['woocommerce_pagination_class'] = 'nav.woocommerce-pagination';

    return $options;
}
add_filter('berocket_aapf_listener_br_options', 'madeit_update_berocket_aapf_listener_br_options');
add_filter('brfr_get_option_ajax_filters', 'madeit_update_berocket_aapf_listener_br_options');

function madeit_woocommerce_before_cart_table()
{
    echo '<div class="card"><div class="card-body"><div class="table-responsive">';
}
add_filter('woocommerce_before_cart_table', 'madeit_woocommerce_before_cart_table');

function madeit_woocommerce_after_cart_table()
{
    echo '</div></div></div>';
}
add_filter('woocommerce_after_cart_table', 'madeit_woocommerce_after_cart_table');

function madeit_woocommerce_before_checkout_billing_form()
{
    echo '<div class="card mb-3"><div class="card-body">';
}
add_filter('woocommerce_before_checkout_billing_form', 'madeit_woocommerce_before_checkout_billing_form', 1);
add_filter('woocommerce_before_checkout_shipping_form', 'madeit_woocommerce_before_checkout_billing_form', 1);
add_filter('woocommerce_before_order_notes', 'madeit_woocommerce_before_checkout_billing_form', 1);

function madeit_woocommerce_after_checkout_billing_form()
{
    echo '</div></div>';
}
add_filter('woocommerce_after_checkout_billing_form', 'madeit_woocommerce_after_checkout_billing_form', 99);
add_filter('woocommerce_after_checkout_shipping_form', 'madeit_woocommerce_after_checkout_billing_form', 99);
add_filter('woocommerce_after_order_notes', 'madeit_woocommerce_after_checkout_billing_form', 99);

remove_action('woocommerce_cart_is_empty', 'wc_empty_cart_message', 10);
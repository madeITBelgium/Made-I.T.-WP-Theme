<?php

if (!function_exists('madeit_loop_columns')) {
    function madeit_loop_columns()
    {
        return 3; // 3 products per row
    }
    add_filter('loop_shop_columns', 'madeit_loop_columns', 999);
}


add_action('init', 'get_custom_coupon_code_to_session');
function get_custom_coupon_code_to_session(){
    if( isset($_GET['coupon_code']) ){
        // Ensure that customer session is started
        if( isset(WC()->session) && ! WC()->session->has_session() )
            WC()->session->set_customer_session_cookie(true);
            
        // Check and register coupon code in a custom session variable
        $coupon_code = WC()->session->get('coupon_code');
        if(empty($coupon_code)){
            $coupon_code = esc_attr( $_GET['coupon_code'] );
            WC()->session->set( 'coupon_code', $coupon_code ); // Set the coupon code in session
        }
    }
}

add_action( 'woocommerce_before_checkout_form', 'add_discout_to_checkout', 10, 0 );
add_action('woocommerce_review_order_before_cart_contents', 'add_discout_to_checkout', 10, 0);
function add_discout_to_checkout( ) {
    // Set coupon code
    $coupon_code = WC()->session->get('coupon_code');
    if ( ! empty( $coupon_code ) && ! WC()->cart->has_discount( $coupon_code ) ){
        WC()->cart->add_discount( $coupon_code ); // apply the coupon discount
        WC()->session->__unset('coupon_code'); // remove coupon code from session
    }
}

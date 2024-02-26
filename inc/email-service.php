<?php

function madeit_emailservice_woo_checkbox_field( ) {
    global $_POST;
    woocommerce_form_field('subscribed', [
        'type' => 'checkbox',
        'class' => array('form-row-wide'),
        'label' => __('Subscribe to our newsletter?', 'madeit'),
    ], isset($_POST['subscribed']) ? $_POST['subscribed'] : 0);
}
add_action( 'woocommerce_checkout_after_terms_and_conditions', 'madeit_emailservice_woo_checkbox_field' );

function madeit_emailservice_woo_save_subscription_input( $order_id ) {
    if( !empty( $_POST['subscribed'] ) && $_POST['subscribed'] == 1 ) {
        update_post_meta( $order_id, 'subscribed', 'Yes' );

        if(defined('MADEIT_EMAILSERVICE_NEWSLETTER_LIST') && MADEIT_EMAILSERVICE_NEWSLETTER_LIST !== false) {
            $mergeFields = apply_filters('madeit_woo_emailservice_newsletter', [
                'email'      => get_post_meta( $order_id, '_billing_email', true ),
                'first_name' => get_post_meta( $order_id, '_billing_first_name', true ),
                'last_name'  => get_post_meta( $order_id, '_billing_last_name', true ),
            ], $data, $actionInfo);
    
            try {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, 'https://www.email-service.be/api/1.0/subscribe/'.MADEIT_EMAILSERVICE_NEWSLETTER_LIST);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($mergeFields));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $server_output = curl_exec($ch);
                curl_close($ch);
            } catch(Exception $e) {
                error_log('Error while subscribing to newsletter: '.$e->getMessage());
            }
        }
    } else {
        update_post_meta( $order_id, 'subscribed', 'No' );
    }
}
add_action('woocommerce_checkout_update_order_meta', 'madeit_emailservice_woo_save_subscription_input');
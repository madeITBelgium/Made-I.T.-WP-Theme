<?php
/**
 * My Addresses.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @author  Made I.T.
 *
 * @version 2.6.0
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

$customer_id = get_current_user_id();

if (!wc_ship_to_billing_address_only() && wc_shipping_enabled()) {
    $get_addresses = apply_filters('woocommerce_my_account_get_addresses', [
        'billing'  => __('Billing address', 'woocommerce'),
        'shipping' => __('Shipping address', 'woocommerce'),
    ], $customer_id);
} else {
    $get_addresses = apply_filters('woocommerce_my_account_get_addresses', [
        'billing' => __('Billing address', 'woocommerce'),
    ], $customer_id);
}
?>

<p>
	<?php echo apply_filters('woocommerce_my_account_my_address_description', __('The following addresses will be used on the checkout page by default.', 'woocommerce')); ?>
</p>

<div class="row woocommerce-Addresses col2-set addresses">
    <?php foreach ($get_addresses as $name => $title) : ?>

        <div class="col-sm-3 woocommerce-Address">
            <header class="woocommerce-Address-title title">
                <h3><?php echo $title; ?></h3>
                <a href="<?php echo esc_url(wc_get_endpoint_url('edit-address', $name)); ?>" class="edit"><?php _e('Edit', 'woocommerce'); ?></a>
            </header>
            <address><?php
                $address = wc_get_account_formatted_address($name);
                echo $address ? wp_kses_post($address) : esc_html_e('You have not set up this type of address yet.', 'woocommerce');
            ?></address>
        </div>

    <?php endforeach; ?>
</div>

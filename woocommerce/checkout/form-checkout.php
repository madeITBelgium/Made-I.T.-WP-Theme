<?php
/**
 * Checkout Form.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/form-checkout.php.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author 		Made I.T.
 *
 * @version     3.5.0
 */
if (!defined('ABSPATH')) {
    exit;
}

do_action('woocommerce_before_checkout_form', $checkout);

// If checkout registration is disabled and not logged in, the user cannot checkout.
if (!$checkout->is_registration_enabled() && $checkout->is_registration_required() && !is_user_logged_in()) {
    echo esc_html(apply_filters('woocommerce_checkout_must_be_logged_in_message', __('You must be logged in to checkout.', 'woocommerce')));

    return;
}

?>

<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url(wc_get_checkout_url()); ?>" enctype="multipart/form-data">

    <div class="row" id="customer_details">
        <?php if ($checkout->get_checkout_fields()) { ?>
            <div class="col-12 col-md-6 mb-4">
                <?php do_action('woocommerce_checkout_before_customer_details'); ?>

                <?php do_action('woocommerce_checkout_billing'); ?>
                
                <?php do_action('woocommerce_checkout_shipping'); ?>

                <?php do_action('woocommerce_checkout_after_customer_details'); ?>
            </div>
        <?php } ?>
        <div class="col-12 col-md-6 mb-4">
            <h3 id="order_review_heading"><?php esc_html_e('Your order', 'woocommerce'); ?></h3>

            <?php do_action('woocommerce_checkout_before_order_review'); ?>

            <div id="order_review" class="woocommerce-checkout-review-order">
                <div class="row">
                    <?php do_action('woocommerce_checkout_order_review'); ?>
                </div>
            </div>

            <?php do_action('woocommerce_checkout_after_order_review'); ?>
        </div>
    </div>
</form>

<?php do_action('woocommerce_after_checkout_form', $checkout); ?>

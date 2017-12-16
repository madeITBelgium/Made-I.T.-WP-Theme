<?php
/**
 * External product add to cart.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author 		Made I.T.
 *
 * @version     2.1.0
 */
if (!defined('ABSPATH')) {
    exit;
}

do_action('woocommerce_before_add_to_cart_button'); ?>

<p class="cart">
	<a href="<?php echo esc_url($product_url); ?>" rel="nofollow" class="single_add_to_cart_button alt btn btn-success"><?php echo esc_html($button_text); ?></a>
</p>

<?php do_action('woocommerce_after_add_to_cart_button'); ?>

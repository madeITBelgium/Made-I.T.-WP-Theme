<?php
/**
 * Proceed to checkout button.
 *
 * Contains the markup for the proceed to checkout button on the cart.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @author  Made I.T.
 *
 * @version 7.0.1
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}
?>

<a href="<?php echo esc_url(wc_get_checkout_url()); ?>" class="checkout-button btn btn-success alt wc-forward<?php echo esc_attr(wc_wp_theme_get_element_class_name('button') ? ' '.wc_wp_theme_get_element_class_name('button') : ''); ?>">
	<?php esc_html_e('Proceed to checkout', 'woocommerce'); ?>
</a>

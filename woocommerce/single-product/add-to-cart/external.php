<?php
/**
 * External product add to cart.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author 		Made I.T.
 *
 * @version 7.0.1
 */
defined('ABSPATH') || exit;
do_action('woocommerce_before_add_to_cart_form'); ?>

<form class="cart" action="<?php echo esc_url($product_url); ?>" method="get">
	<?php do_action('woocommerce_before_add_to_cart_button'); ?>
    <?php $wooButtonClass = apply_filters('madeit_woo_btn_class', ['btn', 'btn-success']); ?>
	<button type="submit" class="single_add_to_cart_button <?php echo is_array($wooButtonClass) ? implode(' ', $wooButtonClass) : $wooButtonClass; ?><?php echo esc_attr(wc_wp_theme_get_element_class_name('button') ? ' '.wc_wp_theme_get_element_class_name('button') : ''); ?>"><?php echo esc_html($button_text); ?></button>

	<?php wc_query_string_form_fields($product_url); ?>

	<?php do_action('woocommerce_after_add_to_cart_button'); ?>
</form>

<?php do_action('woocommerce_after_add_to_cart_form'); ?>
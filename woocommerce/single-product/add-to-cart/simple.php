<?php
/**
 * Simple product add to cart.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author 		Made I.T.
 *
 * @version 10.2.0
 */
defined('ABSPATH') || exit;
global $product;
if (!$product->is_purchasable()) {
    return;
}
echo wc_get_stock_html($product); // WPCS: XSS ok.
if ($product->is_in_stock()) { ?>

	<?php do_action('woocommerce_before_add_to_cart_form'); ?>

	<form class="cart" action="<?php echo esc_url(apply_filters('woocommerce_add_to_cart_form_action', $product->get_permalink())); ?>" method="post" enctype='multipart/form-data'>
		<?php do_action('woocommerce_before_add_to_cart_button'); ?>

		<?php
        do_action('woocommerce_before_add_to_cart_quantity');
        woocommerce_quantity_input([
            'min_value'   => $product->get_min_purchase_quantity(),
            'max_value'   => $product->get_max_purchase_quantity(),
            'input_value' => isset($_POST['quantity']) ? wc_stock_amount(wp_unslash($_POST['quantity'])) : $product->get_min_purchase_quantity(), // WPCS: CSRF ok, input var ok.
        ]);
        do_action('woocommerce_after_add_to_cart_quantity');

        $wooButtonClass = apply_filters('madeit_woo_btn_class', ['btn', 'btn-success', 'single_add_to_cart_button']);
        ?>

		<button type="submit" name="add-to-cart" value="<?php echo esc_attr($product->get_id()); ?>" class="single_add_to_cart_button <?php echo is_array($wooButtonClass) ? implode(' ', $wooButtonClass) : $wooButtonClass; ?><?php echo esc_attr(wc_wp_theme_get_element_class_name('button') ? ' '.wc_wp_theme_get_element_class_name('button') : ''); ?>"><?php echo esc_html($product->single_add_to_cart_text()); ?></button>

		<?php do_action('woocommerce_after_add_to_cart_button'); ?>
	</form>

	<?php do_action('woocommerce_after_add_to_cart_form'); ?>

<?php } ?>
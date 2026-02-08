<?php
/**
 * Single variation cart button.
 *
 * @see 	https://docs.woocommerce.com/document/template-structure/
 *
 * @author  WooThemes
 *
 * @version 10.5.0
 */
defined('ABSPATH') || exit;
global $product;
?>
<div class="woocommerce-variation-add-to-cart variations_button">
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

	<button type="submit" class="single_add_to_cart_button <?php echo is_array($wooButtonClass) ? implode(' ', $wooButtonClass) : $wooButtonClass; ?><?php echo esc_attr(wc_wp_theme_get_element_class_name('button') ? ' '.wc_wp_theme_get_element_class_name('button') : ''); ?>" disabled><?php echo esc_html($product->single_add_to_cart_text()); ?></button>

	<?php do_action('woocommerce_after_add_to_cart_button'); ?>

	<input type="hidden" name="add-to-cart" value="<?php echo absint($product->get_id()); ?>" />
	<input type="hidden" name="product_id" value="<?php echo absint($product->get_id()); ?>" />
	<input type="hidden" name="variation_id" class="variation_id" value="0" />
</div>
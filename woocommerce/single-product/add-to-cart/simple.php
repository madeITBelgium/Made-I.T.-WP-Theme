<?php
/**
 * Simple product add to cart.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author 		Made I.T.
 *
 * @version     3.0.0
 */
if (!defined('ABSPATH')) {
    exit;
}

global $product;

if (!$product->is_purchasable()) {
    return;
}

echo wc_get_stock_html($product);

if ($product->is_in_stock()) : ?>

	<?php do_action('woocommerce_before_add_to_cart_form'); ?>

	<form class="cart" method="post" enctype='multipart/form-data'>
		<?php
            /**
             * @since 2.1.0.
             */
            do_action('woocommerce_before_add_to_cart_button');

            /*
             * @since 3.0.0.
             */
            do_action('woocommerce_before_add_to_cart_quantity');

            woocommerce_quantity_input([
                'min_value'   => apply_filters('woocommerce_quantity_input_min', $product->get_min_purchase_quantity(), $product),
                'max_value'   => apply_filters('woocommerce_quantity_input_max', $product->get_max_purchase_quantity(), $product),
                'input_value' => isset($_POST['quantity']) ? wc_stock_amount($_POST['quantity']) : $product->get_min_purchase_quantity(),
            ]);

            /*
             * @since 3.0.0.
             */
            do_action('woocommerce_after_add_to_cart_quantity');
        ?>

		<button type="submit" name="add-to-cart" value="<?php echo esc_attr($product->get_id()); ?>" class="single_add_to_cart_button alt btn btn-success"><?php echo esc_html($product->single_add_to_cart_text()); ?></button>

		<?php
            /**
             * @since 2.1.0.
             */
            do_action('woocommerce_after_add_to_cart_button');
        ?>
	</form>

	<?php do_action('woocommerce_after_add_to_cart_form'); ?>

<?php endif; ?>

<?php
/**
 * Empty cart page.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/cart-empty.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author  WooThemes
 *
 * @version 7.0.1
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/*
 * @hooked wc_empty_cart_message - 10
 */
do_action('woocommerce_cart_is_empty');
?>

<h2 class="text-center empty-shopping-cart-message"><?php echo apply_filters( 'wc_empty_cart_message', __( 'Your cart is currently empty.', 'woocommerce' ) ); ?></h2>


<?php
if (wc_get_page_id('shop') > 0) { ?>
	<p class="return-to-shop">
		<a class="button wc-backward<?php echo esc_attr(wc_wp_theme_get_element_class_name('button') ? ' '.wc_wp_theme_get_element_class_name('button') : ''); ?>" href="<?php echo esc_url(apply_filters('woocommerce_return_to_shop_redirect', wc_get_page_permalink('shop'))); ?>">
			<?php _e('Return to shop', 'woocommerce') ?>
		</a>
	</p>
<?php } ?>

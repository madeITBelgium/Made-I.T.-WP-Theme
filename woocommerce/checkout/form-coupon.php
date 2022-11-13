<?php
/**
 * Checkout coupon form.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/form-coupon.php.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @author  Made I.T.
 *
 * @version 7.0.1
 */
defined('ABSPATH') || exit;

if (!wc_coupons_enabled()) { // @codingStandardsIgnoreLine.
    return;
}
?>

<div class="woocommerce-form-coupon-toggle">
	<?php wc_print_notice(apply_filters('woocommerce_checkout_coupon_message', __('Have a coupon?', 'woocommerce').' <a href="#" class="showcoupon">'.__('Click here to enter your code', 'woocommerce').'</a>'), 'notice'); ?>
</div>
 <form class="checkout_coupon woocommerce-form-coupon card" method="post" style="display:none">
 	<div class="card-body">
		<p><?php esc_html_e('If you have a coupon code, please apply it below.', 'woocommerce'); ?></p>

		<p class="form-row form-row-first">
			<input type="text" name="coupon_code" class="input-text form-control" placeholder="<?php esc_attr_e('Coupon code', 'woocommerce'); ?>" id="coupon_code" value="" />
		</p>

		<p class="form-row form-row-last">
			<button type="submit" class="btn btn-primary<?php echo esc_attr(wc_wp_theme_get_element_class_name('button') ? ' '.wc_wp_theme_get_element_class_name('button') : ''); ?>" name="apply_coupon" value="<?php esc_attr_e('Apply coupon', 'woocommerce'); ?>"><?php esc_attr_e('Apply coupon', 'woocommerce'); ?></button>
		</p>

		<div class="clear"></div>
	</div>
</form>

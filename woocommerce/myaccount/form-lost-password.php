<?php
/**
 * Lost password form.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @author  Made I.T.
 *
 * @version 9.2.0
 */
defined('ABSPATH') || exit;
do_action('woocommerce_before_lost_password_form');
?>

<form method="post" class="woocommerce-ResetPassword lost_reset_password">

	<p><?php echo apply_filters('woocommerce_lost_password_message', esc_html__('Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.', 'woocommerce')); ?></p><?php // @codingStandardsIgnoreLine?>

	<p class="woocommerce-form-row woocommerce-form-row--first form-row form-row-first">
        <label for="user_login"><?php esc_html_e( 'Username or email', 'woocommerce' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span><span class="screen-reader-text"><?php esc_html_e( 'Required', 'woocommerce' ); ?></span></label>
        <input class="woocommerce-Input woocommerce-Input--text input-text" type="text" name="user_login" id="user_login" autocomplete="username" required aria-required="true" />
	</p>

	<div class="clear"></div>

	<?php do_action('woocommerce_lostpassword_form'); ?>

	<p class="woocommerce-form-row form-row">
		<input type="hidden" name="wc_reset_password" value="true" />
		<button type="submit" class="woocommerce-Button button<?php echo esc_attr(wc_wp_theme_get_element_class_name('button') ? ' '.wc_wp_theme_get_element_class_name('button') : ''); ?>" value="<?php esc_attr_e('Reset password', 'woocommerce'); ?>"><?php esc_html_e('Reset password', 'woocommerce'); ?></button>
	</p>

	<?php wp_nonce_field('lost_password', 'woocommerce-lost-password-nonce'); ?>

</form>
<?php
do_action('woocommerce_after_lost_password_form');

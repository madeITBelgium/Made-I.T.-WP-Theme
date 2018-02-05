<?php
/**
 * Lost password reset form.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @author  Made I.T.
 *
 * @version 3.0.0
 */
if (!defined('ABSPATH')) {
    exit;
}

wc_print_notices(); ?>

<form method="post" class="woocommerce-ResetPassword lost_reset_password">

	<p><?php echo apply_filters('woocommerce_reset_password_message', __('Enter a new password below.', 'woocommerce')); ?></p>

	<p class="woocommerce-form-row woocommerce-form-row--first form-row form-row-first">
		<label for="password_1"><?php _e('New password', 'woocommerce'); ?> <span class="required">*</span></label>
		<input type="password" class="woocommerce-Input woocommerce-Input--text input-text form-control" name="password_1" id="password_1" />
	</p>
	<p class="woocommerce-form-row woocommerce-form-row--last form-row form-row-last">
		<label for="password_2"><?php _e('Re-enter new password', 'woocommerce'); ?> <span class="required">*</span></label>
		<input type="password" class="woocommerce-Input woocommerce-Input--text input-text form-control" name="password_2" id="password_2" />
	</p>

	<input type="hidden" name="reset_key" value="<?php echo esc_attr($args['key']); ?>" />
	<input type="hidden" name="reset_login" value="<?php echo esc_attr($args['login']); ?>" />

	<div class="clear"></div>

	<?php do_action('woocommerce_resetpassword_form'); ?>

	<p class="woocommerce-form-row form-row">
		<input type="hidden" name="wc_reset_password" value="true" />
		<input type="submit" class="woocommerce-Button btn btn-primary" value="<?php esc_attr_e('Save', 'woocommerce'); ?>" />
	</p>

	<?php wp_nonce_field('reset_password'); ?>

</form>
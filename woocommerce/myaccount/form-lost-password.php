<?php
/**
 * Lost password form.
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

	<p><?php echo apply_filters('woocommerce_lost_password_message', __('Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.', 'woocommerce')); ?></p>

	<p class="woocommerce-form-row woocommerce-form-row--first form-row form-row-first">
		<label for="user_login"><?php _e('Username or email', 'woocommerce'); ?></label>
		<input class="woocommerce-Input woocommerce-Input--text input-text form-control" type="text" name="user_login" id="user_login" />
	</p>

	<div class="clear"></div>

	<?php do_action('woocommerce_lostpassword_form'); ?>

	<p class="woocommerce-form-row form-row">
		<input type="hidden" name="wc_reset_password" value="true" />
		<input type="submit" class="woocommerce-Button btn btn-primary" value="<?php esc_attr_e('Reset password', 'woocommerce'); ?>" />
	</p>

	<?php wp_nonce_field('lost_password'); ?>

</form>

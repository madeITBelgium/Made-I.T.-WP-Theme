<?php
/**
 * Product quantity inputs.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author 		Made I.T.
 *
 * @version     3.2.0
 */
if (!defined('ABSPATH')) {
    exit;
}

if ($max_value && $min_value === $max_value) {
    ?>
	<div class="quantity hidden">
		<input type="hidden" id="<?php echo esc_attr($input_id); ?>" class="qty" name="<?php echo esc_attr($input_name); ?>" value="<?php echo esc_attr($min_value); ?>" />
	</div>
	<?php
} else {
        ?>
	<div class="quantity">
		<label class="screen-reader-text" for="<?php echo esc_attr($input_id); ?>"><?php esc_html_e('Quantity', 'woocommerce'); ?></label>
		<input type="number" id="<?php echo esc_attr($input_id); ?>" class="input-text form-control qty text" step="<?php echo esc_attr($step); ?>" min="<?php echo esc_attr($min_value); ?>" max="<?php echo esc_attr(0 < $max_value ? $max_value : ''); ?>" name="<?php echo esc_attr($input_name); ?>" value="<?php echo esc_attr($input_value); ?>" title="<?php echo esc_attr_x('Qty', 'Product quantity input tooltip', 'woocommerce') ?>" size="4" pattern="<?php echo esc_attr($pattern); ?>" inputmode="<?php echo esc_attr($inputmode); ?>" />
	</div>
	<?php
    }

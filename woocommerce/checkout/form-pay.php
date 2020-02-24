<?php
/**
 * Pay for order form.
 *
 * @see      https://docs.woocommerce.com/document/template-structure/
 *
 * @author   Made I.T.
 *
 * @version  3.4.0
 */
defined('ABSPATH') || exit;

$totals = $order->get_order_item_totals();
?>
<form id="order_review" method="post">

	<table class="shop_table">
		<thead>
			<tr>
				<th class="product-name"><?php esc_html_e('Product', 'woocommerce'); ?></th>
				<th class="product-quantity"><?php esc_html_e('Qty', 'woocommerce'); ?></th>
				<th class="product-total"><?php esc_html_e('Totals', 'woocommerce'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php if (count($order->get_items()) > 0) { ?>
				<?php foreach ($order->get_items() as $item_id => $item) { ?>
					<?php
                    if (!apply_filters('woocommerce_order_item_visible', true, $item)) {
                        continue;
                    }
                    ?>
					<tr class="<?php echo esc_attr(apply_filters('woocommerce_order_item_class', 'order_item', $item, $order)); ?>">
						<td class="product-name">
							<?php
                                echo apply_filters('woocommerce_order_item_name', esc_html($item->get_name()), $item, false);

                                do_action('woocommerce_order_item_meta_start', $item_id, $item, $order, false);

                                wc_display_item_meta($item);

                                do_action('woocommerce_order_item_meta_end', $item_id, $item, $order, false);
                            ?>
						</td>
						<td class="product-quantity"><?php echo apply_filters('woocommerce_order_item_quantity_html', ' <strong class="product-quantity">'.sprintf('&times; %s', esc_html($item->get_quantity())).'</strong>', $item); ?></td>
						<td class="product-subtotal"><?php echo $order->get_formatted_line_subtotal($item); ?></td>
					</tr>
				<?php } ?>
			<?php } ?>
		</tbody>
		<tfoot>
			<?php if ($totals) { ?>
				<?php foreach ($totals as $total) { ?>
					<tr>
						<th scope="row" colspan="2"><?php echo $total['label']; ?></th>
						<td class="product-total"><?php echo $total['value']; ?></td>
					</tr>
				<?php } ?>
			<?php } ?>
		</tfoot>
	</table>

	<div id="payment">
		<?php if ($order->needs_payment()) { ?>
			<ul class="wc_payment_methods payment_methods methods">
				<?php
                if (!empty($available_gateways)) {
                    foreach ($available_gateways as $gateway) {
                        wc_get_template('checkout/payment-method.php', ['gateway' => $gateway]);
                    }
                } else {
                    echo '<li class="woocommerce-notice woocommerce-notice--info woocommerce-info">'.apply_filters('woocommerce_no_available_payment_methods_message', __('Sorry, it seems that there are no available payment methods for your location. Please contact us if you require assistance or wish to make alternate arrangements.', 'woocommerce')).'</li>'; // @codingStandardsIgnoreLine
                }
                ?>
			</ul>
		<?php } ?>
		<div class="form-row">
			<input type="hidden" name="woocommerce_pay" value="1" />

			<?php wc_get_template('checkout/terms.php'); ?>

			<?php do_action('woocommerce_pay_order_before_submit'); ?>

			<?php echo apply_filters('woocommerce_pay_order_button_html', '<button type="submit" class="button alt" id="place_order" value="'.esc_attr($order_button_text).'" data-value="'.esc_attr($order_button_text).'">'.esc_html($order_button_text).'</button>'); // @codingStandardsIgnoreLine?>

			<?php do_action('woocommerce_pay_order_after_submit'); ?>

			<?php wp_nonce_field('woocommerce-pay', 'woocommerce-pay-nonce'); ?>
		</div>
	</div>
</form>

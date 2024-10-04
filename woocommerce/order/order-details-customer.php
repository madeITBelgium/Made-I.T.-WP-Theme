<?php
/**
 * Order Customer Details
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/order/order-details-customer.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 8.7.0
 */

defined( 'ABSPATH' ) || exit;

$show_shipping = !wc_ship_to_billing_address_only() && $order->needs_shipping_address();
?>
<section class="woocommerce-customer-details row">
    <div class="col-12 col-md-6">
        <div class="woocommerce-column woocommerce-column--billing-address">
            <h2 class="woocommerce-column__title"><?php esc_html_e('Billing address', 'woocommerce'); ?></h2>
            <div class="card">
                <div class="card-body">
                    <address class="border-0">
                        <?php echo wp_kses_post($order->get_formatted_billing_address(esc_html__('N/A', 'woocommerce'))); ?>

                        <?php if ($order->get_billing_phone()) { ?>
                            <p class="woocommerce-customer-details--phone"><?php echo esc_html($order->get_billing_phone()); ?></p>
                        <?php } ?>

                        <?php if ($order->get_billing_email()) { ?>
                            <p class="woocommerce-customer-details--email"><?php echo esc_html($order->get_billing_email()); ?></p>
                        <?php } ?>

                        <?php
                            /**
                             * Action hook fired after an address in the order customer details.
                             *
                             * @since 8.7.0
                             * @param string $address_type Type of address (billing or shipping).
                             * @param WC_Order $order Order object.
                             */
                            do_action( 'woocommerce_order_details_after_customer_address', 'billing', $order );
                        ?>
                    </address>
                </div>
            </div>
        </div>
    </div>

    <?php if ($show_shipping) { ?>
        <div class="col-12 col-md-6">
            <div class="woocommerce-column woocommerce-column--shipping-address">
                <h2 class="woocommerce-column__title"><?php esc_html_e('Shipping address', 'woocommerce'); ?></h2>
                <div class="card">
                    <div class="card-body">
                        <address class="border-0">
                            <?php echo wp_kses_post($order->get_formatted_shipping_address(esc_html__('N/A', 'woocommerce'))); ?>

                            <?php if ($order->get_shipping_phone()) { ?>
                                <p class="woocommerce-customer-details--phone"><?php echo esc_html($order->get_shipping_phone()); ?></p>
                            <?php } ?>

                            <?php
                                /**
                                 * Action hook fired after an address in the order customer details.
                                 *
                                 * @since 8.7.0
                                 * @param string $address_type Type of address (billing or shipping).
                                 * @param WC_Order $order Order object.
                                 */
                                do_action( 'woocommerce_order_details_after_customer_address', 'shipping', $order );
                            ?>
                        </address>
                    </div>
                </div>
            </div>
        </div>

    <?php } ?>

    <?php do_action('woocommerce_order_details_after_customer_details', $order); ?>

</section>
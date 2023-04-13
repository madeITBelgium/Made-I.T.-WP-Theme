<?php

if (!function_exists('madeit_woocommerce_ajax_add_to_cart_js')) {
    function madeit_woocommerce_ajax_add_to_cart_js()
    {
        if (function_exists('is_product') && MADEIT_BOOTSTRAP_VERSION == 5) {
            wp_enqueue_script('woocommerce-ajax-add-to-cart', get_template_directory_uri().'/assets/bootstrap-5/ajax-add-to-cart.js', ['jquery'], '', true);
        } elseif (function_exists('is_product')) {
            wp_enqueue_script('woocommerce-ajax-add-to-cart', get_template_directory_uri().'/assets/bootstrap-46/ajax-add-to-cart.js', ['jquery'], '', true);
        }
    }
    add_action('wp_enqueue_scripts', 'madeit_woocommerce_ajax_add_to_cart_js', 99);
}

function madeit_woocommerce_ajax_add_to_cart()
{
    $product_id = apply_filters('woocommerce_add_to_cart_product_id', absint($_POST['product_id']));
    $quantity = empty($_POST['quantity']) ? 1 : wc_stock_amount($_POST['quantity']);
    $variation_id = absint($_POST['variation_id']);
    $passed_validation = apply_filters('woocommerce_add_to_cart_validation', true, $product_id, $quantity);
    $product_status = get_post_status($product_id);

    $attributes = null;
    if(isset($_POST['attributes']) && is_array($_POST['attributes'])) {
        foreach($_POST['attributes'] as $key => $value) {
            $attributes[$value['name']] = $value['value'];
        }
    }

    if ($passed_validation && WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $attributes) && 'publish' === $product_status) {
        do_action('woocommerce_ajax_added_to_cart', $product_id);

        if ('yes' === get_option('woocommerce_cart_redirect_after_add')) {
            wc_add_to_cart_message([$product_id => $quantity], true);
        }

        WC_AJAX::get_refreshed_fragments();
    } else {
        $data = [
            'success'     => false,
            'product_url' => apply_filters('woocommerce_cart_redirect_after_error', get_permalink($product_id), $product_id),
        ];

        echo wp_send_json($data);
    }

    wp_die();
}
add_action('wp_ajax_woocommerce_ajax_add_to_cart', 'madeit_woocommerce_ajax_add_to_cart');
add_action('wp_ajax_nopriv_woocommerce_ajax_add_to_cart', 'madeit_woocommerce_ajax_add_to_cart');

if (!function_exists('madeit_woocommerce_ajax_add_to_cart_popup')) {
    function madeit_woocommerce_ajax_add_to_cart_popup()
    {
        if (MADEIT_BOOTSTRAP_VERSION === 5) {
            ?>
            <!-- Modal -->
            <div class="modal fade" id="addToCartPopup" tabindex="-1" aria-labelledby="popupModalLabelAddToCart" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="popupModalLabelAddToCart"><?php echo __('Product toegevoegd aan winkelwagen', 'madeit'); ?></h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex justify-content-center align-items-center">
                                <a href="<?php echo wc_get_cart_url(); ?>" class="btn btn-primary m-3"><?php echo __('Bekijk winkelwagen', 'madeit'); ?></a>
                                <button type="button" class="btn btn-secondary m-3" data-bs-dismiss="modal"><?php _e('Verder winkelen', 'madeit'); ?></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php
        } else {
            ?>
            <!-- Modal -->
            <div class="modal fade" id="addToCartPopup" tabindex="-1" aria-labelledby="popupModalLabelAddToCart" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="popupModalLabelAddToCart"><?php echo __('Product toegevoegd aan winkelwagen', 'madeit'); ?></h1>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex justify-content-center align-items-center">
                                <a href="<?php echo wc_get_cart_url(); ?>" class="btn btn-primary m-3"><?php echo __('Bekijk winkelwagen', 'madeit'); ?></a>
                                <button type="button" class="btn btn-secondary m-3" data-dismiss="modal"><?php _e('Verder winkelen', 'madeit'); ?></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php
        }
    }
    add_action('wp_footer', 'madeit_woocommerce_ajax_add_to_cart_popup', 99);
}

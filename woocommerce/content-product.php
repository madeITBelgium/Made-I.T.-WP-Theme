<?php
/**
 * The template for displaying product content within loops.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @author  Made I.T.
 *
 * @version 3.6.0
 */
defined('ABSPATH') || exit;

global $product;

// Ensure visibility.
if (empty($product) || !$product->is_visible()) {
    return;
}
$productImageContainer = apply_filters('madeit_woo_category_product_image_container_class', ['d-block', 'mt-auto', 'mb-auto']);
$productContentContainer = apply_filters('madeit_woo_category_product_content_container_class', ['card-body', 'text-center', 'd-flex', 'justify-content-between', 'flex-column']);
$productInnerContainer = apply_filters('madeit_woo_product_inner_container_class', ['card', 'h-100', 'p-4', 'border-0', 'd-flex', 'justify-content-between']);
?>
<div <?php wc_product_class('mb-4 h-100 pb-4', $product); ?>>
    <div class="<?php echo implode(' ', $productInnerContainer); ?>">
        <a href="<?php echo get_the_permalink(); ?>" class="<?php echo implode(' ', $productImageContainer); ?>">
            <?php
            /**
             * Hook: woocommerce_before_shop_loop_item.
             *
             * @hooked woocommerce_show_product_loop_sale_flash - 10
             * @hooked woocommerce_template_loop_product_thumbnail - 10
             */
            do_action('woocommerce_before_shop_loop_item_title');
            ?>
        </a>
        <div class="<?php echo implode(' ', $productContentContainer); ?>" style="flex: initial; -ms-flex: initial;">
            <?php do_action('madeit_woo_before_product_title'); ?>
            <h4 class="card-title">
                <a href="<?php echo get_the_permalink(); ?>"><?php echo get_the_title(); ?></a>
            </h4>
            <?php do_action('madeit_woo_before_price'); ?>
            <div class="h5"><?php wc_get_template('loop/price.php'); ?></div>
            <?php do_action('madeit_woo_before_button'); ?>
            <?php
            $wooButtonClass = apply_filters('madeit_woo_btn_class', ['btn', 'btn-success', 'add_to_cart_button']);
            woocommerce_template_loop_add_to_cart(['class' => is_array($wooButtonClass) ? implode(' ', $wooButtonClass) : $wooButtonClass]);
            ?>
            <?php do_action('madeit_woo_after_button'); ?>
        </div>
        <div class="card-footer d-none">
            <?php wc_get_template('loop/rating.php'); ?>
            <?php /* <small class="text-muted">★ ★ ★ ★ ☆</small> */ ?>
        </div>
    </div>
</div>

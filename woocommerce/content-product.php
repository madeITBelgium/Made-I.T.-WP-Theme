<?php
/**
 * The template for displaying product content within loops
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 9.4.0
 */

defined( 'ABSPATH' ) || exit;

global $product;

// Check if the product is a valid WooCommerce product and ensure its visibility before proceeding.
if ( ! is_a( $product, WC_Product::class ) || ! $product->is_visible() ) {
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
            $isProductVariable = $product->is_type('variable');
            $wooButtonClass = apply_filters('madeit_woo_btn_class', !$isProductVariable ? ['btn', 'btn-success', 'add_to_cart_button'] : ['btn', 'btn-success']);
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

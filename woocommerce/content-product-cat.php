<?php
/**
 * The template for displaying product category thumbnails within loops.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-product-cat.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @version 4.7.0
 */
if (!defined('ABSPATH')) {
    exit;
}

$classes = apply_filters('madeit_woo_category_column_class', ['col-12', 'col-md-6', 'col-lg-4']);
$productImageContainer = apply_filters('madeit_woo_category_product_image_container_class', ['mt-auto', 'mb-auto']);
?>
<div class="<?php echo implode(' ', $classes); ?>">
    <div <?php wc_product_cat_class('mb-4 h-100 pb-4', $category); ?>>
        <div class="card h-100 p-4 border-0 d-flex justify-content-between">
            <div class="<?php echo implode(' ', $productImageContainer); ?>">
                <?php

                /**
                 * The woocommerce_before_subcategory_title hook.
                 *
                 * @hooked woocommerce_subcategory_thumbnail - 10
                 */
                do_action('woocommerce_before_subcategory_title', $category);
                ?>
            </div>
            <div class="card-body text-center" style="flex: initial; -ms-flex: initial;">
                <a href="<?php echo esc_url(get_term_link($category, 'product_cat')); ?>" class="stretched-link">
                <?php
                /**
                 * The woocommerce_before_subcategory hook.
                 *
                 * @hooked woocommerce_template_loop_category_link_open - 10
                 */
                //do_action('woocommerce_before_subcategory', $category);

                /**
                 * The woocommerce_shop_loop_subcategory_title hook.
                 *
                 * @hooked woocommerce_template_loop_category_title - 10
                 */
                do_action('woocommerce_shop_loop_subcategory_title', $category);

                /**
                 * The woocommerce_after_subcategory_title hook.
                 */
                do_action('woocommerce_after_subcategory_title', $category);

                /**
                 * The woocommerce_after_subcategory hook.
                 *
                 * @hooked woocommerce_template_loop_category_link_close - 10
                 */
                //do_action( 'woocommerce_after_subcategory', $category );
                ?>
                </a>
            </div>
        </div>
    </div>
</div>
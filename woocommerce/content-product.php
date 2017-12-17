<?php
/**
 * The template for displaying product content within loops.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @author  Made I.T.
 *
 * @version 3.0.0
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

global $product;

// Ensure visibility
if (empty($product) || !$product->is_visible()) {
    return;
}
?>
<div <?php post_class('col-lg-4 col-md-6 mb-4'); ?>>
    <div class="card h-100">
        <a href="<?php echo get_the_permalink(); ?>">
            <?php
            /**
             * woocommerce_before_shop_loop_item_title hook.
             *
             * @hooked woocommerce_show_product_loop_sale_flash - 10
             * @hooked woocommerce_template_loop_product_thumbnail - 10
             */
            do_action('woocommerce_before_shop_loop_item_title');
            ?>
        </a>
        <div class="card-body">
            <h4 class="card-title">
                <a href="<?php echo get_the_permalink(); ?>"><?php echo get_the_title(); ?></a>
            </h4>
            <div class="h5"><?php wc_get_template('loop/price.php'); ?></div>
            <?php woocommerce_template_loop_add_to_cart(['class' => 'btn btn-success']); ?>
        </div>
        <div class="card-footer">
            <?php wc_get_template('loop/rating.php'); ?>
            <small class="text-muted">★ ★ ★ ★ ☆</small>
        </div>
    </div>
</div>
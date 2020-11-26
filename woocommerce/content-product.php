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
?>
<div <?php wc_product_class('mb-4 h-100 pb-4', $product); ?>>
    <div class="card h-100">
        <a href="<?php echo get_the_permalink(); ?>">
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
        <div class="card-body text-center  d-flex justify-content-between flex-column">
            <h4 class="card-title">
                <a href="<?php echo get_the_permalink(); ?>"><?php echo get_the_title(); ?></a>
            </h4>
            <div class="h5"><?php wc_get_template('loop/price.php'); ?></div>
            <?php
            $wooButtonClass = apply_filters('madeit_woo_btn_class', ['btn', 'btn-success']);
            woocommerce_template_loop_add_to_cart(['class' => is_array($wooButtonClass) ? implode(' ', $wooButtonClass) : $wooButtonClass]);
            ?>
        </div>
        <div class="card-footer d-none">
            <?php wc_get_template('loop/rating.php'); ?>
            <?php /* <small class="text-muted">★ ★ ★ ★ ☆</small> */ ?>
        </div>
    </div>
</div>

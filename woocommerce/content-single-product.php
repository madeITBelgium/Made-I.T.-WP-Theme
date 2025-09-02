<?php
/**
 * The template for displaying product content in the single-product.php template.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author 		Made I.T.
 *
 * @version     3.6.0
 */
defined('ABSPATH') || exit;

global $product;

?>

<?php
/**
 * woocommerce_before_single_product hook.
 *
 * @hooked wc_print_notices - 10
 */
do_action('woocommerce_before_single_product');

if (post_password_required()) {
    echo get_the_password_form();

    return;
}

$col1 = apply_filters('madeit_woo_single_product_col_1_class', ['col-md', 'order-last', 'order-md-first', 'position-relative']);
$col2 = apply_filters('madeit_woo_single_product_col_2_class', ['col-md']);
?>

<div id="product-<?php the_ID(); ?>" <?php wc_product_class('', $product); ?>>
    <div class="row">
        <div class="<?php echo implode(' ', $col1); ?>">
            <?php
                /**
                 * woocommerce_before_single_product_summary hook.
                 *
                 * @hooked woocommerce_show_product_sale_flash - 10
                 * @hooked woocommerce_show_product_images - 20
                 */
                do_action('woocommerce_before_single_product_summary');
            ?>
        </div>
        <div class="<?php echo implode(' ', $col2); ?>">

            <?php
                /**
                 * woocommerce_single_product_summary hook.
                 *
                 * @hooked woocommerce_template_single_title - 5
                 * @hooked woocommerce_template_single_rating - 10
                 * @hooked woocommerce_template_single_price - 10
                 * @hooked woocommerce_template_single_excerpt - 20
                 * @hooked woocommerce_template_single_add_to_cart - 30
                 * @hooked woocommerce_template_single_meta - 40
                 * @hooked woocommerce_template_single_sharing - 50
                 * @hooked WC_Structured_Data::generate_product_data() - 60
                 */
                do_action('woocommerce_single_product_summary');
            ?>

        </div><!-- .summary -->
    </div>
    <?php do_action('woocommerce_single_product_between'); ?>
    <div class="row">
        <div class="col">
            <?php
                /**
                 * woocommerce_after_single_product_summary hook.
                 *
                 * @hooked woocommerce_output_product_data_tabs - 10
                 * @hooked woocommerce_upsell_display - 15
                 * @hooked woocommerce_output_related_products - 20
                 */
                do_action('woocommerce_after_single_product_summary');
            ?>
        </div>
    </div>
</div><!-- #product-<?php the_ID(); ?> -->
<?php do_action('woocommerce_after_single_product'); ?>

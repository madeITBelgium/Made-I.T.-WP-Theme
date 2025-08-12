<?php
/**
 * Related Products
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/related.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see         https://woocommerce.com/document/template-structure/
 * @package     WooCommerce\Templates
 * @version     9.6.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ($related_products) { ?>

    <section class="related products mt-5 pt-5">

        <?php
        $heading = apply_filters('woocommerce_product_related_products_heading', __('Related products', 'woocommerce'));

        if ($heading) {
            ?>
            <h2><?php echo esc_html($heading); ?></h2>
        <?php
        } ?>

        <?php woocommerce_product_loop_start(); ?>
        
            <?php
            $relatedProductColClass = 'col-md-6';
            if (count($related_products) >= 4) {
                $relatedProductColClass .= ' col-lg-3';
            } elseif (count($related_products) >= 3) {
                $relatedProductColClass .= ' col-lg-4';
            } elseif (count($related_products) >= 1) {
                $relatedProductColClass .= ' col-lg-4';
            }
            foreach ($related_products as $related_product) {
                ?>
                <div class="col-12 <?php echo $relatedProductColClass; ?>">

                    <?php
                    $post_object = get_post( $related_product->get_id() );

                    setup_postdata( $GLOBALS['post'] = $post_object ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited, Squiz.PHP.DisallowMultipleAssignments.Found

                    wc_get_template_part( 'content', 'product' );
                    ?>
                </div>

            <?php
            } ?>

        <?php woocommerce_product_loop_end(); ?>

    </section>
    <?php
}

wp_reset_postdata();

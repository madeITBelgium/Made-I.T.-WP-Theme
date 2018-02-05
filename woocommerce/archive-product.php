<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive.
 *
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 *
 * @author      Made I.T.
 *
 * @version     2.0.0
 */
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

get_header('shop'); ?>

<?php
    /**
     * woocommerce_before_main_content hook.
     *
     * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
     * @hooked woocommerce_breadcrumb - 20
     * @hooked WC_Structured_Data::generate_website_data() - 30
     */
    do_action('woocommerce_before_main_content');
?>
<div class="row">
    <div class="col">
        <header class="woocommerce-products-header">
            <?php if (apply_filters('woocommerce_show_page_title', true)) : ?>
                <h1 class="woocommerce-products-header__title page-title"><?php woocommerce_page_title(); ?></h1>
            <?php endif; ?>
            <?php
                /**
                 * woocommerce_archive_description hook.
                 *
                 * @hooked woocommerce_taxonomy_archive_description - 10
                 * @hooked woocommerce_product_archive_description - 10
                 */
                do_action('woocommerce_archive_description');
            ?>
        </header>
        <?php 
        if (have_posts()) :
            ?>
            <div class="row">
                <?php
                /**
                 * woocommerce_before_shop_loop hook.
                 *
                 * @hooked wc_print_notices - 10
                 * @hooked woocommerce_result_count - 20
                 * @hooked woocommerce_catalog_ordering - 30
                 */
                do_action('woocommerce_before_shop_loop');
                ?>
            </div>
            <?php
            woocommerce_product_loop_start();

            woocommerce_product_subcategories();
            while (have_posts()) : the_post();
                /*
                 * woocommerce_shop_loop hook.
                 *
                 * @hooked WC_Structured_Data::generate_product_data() - 10
                 */
                do_action('woocommerce_shop_loop');

                wc_get_template_part('content', 'product');

            endwhile; // end of the loop.

            woocommerce_product_loop_end();
            /*
             * woocommerce_after_shop_loop hook.
             *
             * @hooked woocommerce_pagination - 10
             */
            do_action('woocommerce_after_shop_loop');
        elseif (!woocommerce_product_subcategories(['before' => woocommerce_product_loop_start(false), 'after' => woocommerce_product_loop_end(false)])) :
            /*
             * woocommerce_no_products_found hook.
             *
             * @hooked wc_no_products_found - 10
             */
            do_action('woocommerce_no_products_found');
         endif; ?>
    </div>
    <?php
        /**
         * woocommerce_sidebar hook.
         *
         * @hooked woocommerce_get_sidebar - 10
         */
        do_action('woocommerce_sidebar');
    ?>
</div>
<?php
    /**
     * woocommerce_after_main_content hook.
     *
     * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
     */
    do_action('woocommerce_after_main_content');
?>
<?php get_footer('shop'); ?>
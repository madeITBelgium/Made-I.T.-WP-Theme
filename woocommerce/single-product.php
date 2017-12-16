<?php
/**
 * The Template for displaying all single products
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		Made I.T.
 * @package 	madeit
 * @version     1.6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

get_header( 'shop' );

/**
 * woocommerce_before_main_content hook.
 *
 * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
 * @hooked woocommerce_breadcrumb - 20
 */
do_action( 'woocommerce_before_main_content' );
?>
    <div class="row">
        <div class="col">
            <?php
            while ( have_posts() ) : the_post();
                wc_get_template_part( 'content', 'single-product' );
            endwhile; // end of the loop.
            ?>
        </div>
        <?php
        if(false) {
            /**
             * woocommerce_sidebar hook.
             *
             * @hooked woocommerce_get_sidebar - 10
             */
            do_action( 'woocommerce_sidebar' );
        }
        ?>
    </div>
<?php
/**
 * woocommerce_after_main_content hook.
 *
 * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
 */
do_action( 'woocommerce_after_main_content' );

get_footer( 'shop' );

/* Omit closing PHP tag at the end of PHP files to avoid "headers already sent" issues. */

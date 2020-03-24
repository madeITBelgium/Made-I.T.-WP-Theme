<?php
/**
 * The template for displaying product search form.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/product-searchform.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 *
 * @author  WooThemes
 *
 * @version 3.3.0
 */
if (!defined('ABSPATH')) {
    exit;
}

?>
<form role="search" method="get" class="woocommerce-product-search" action="<?php echo esc_url(home_url('/')); ?>">
    <div class="form-group">
        <div class="input-group">
	        <input type="search" id="woocommerce-product-search-field-<?php echo isset($index) ? absint($index) : 0; ?>" class="form-control search-field" placeholder="<?php echo esc_attr__('Search products&hellip;', 'woocommerce'); ?>" value="<?php echo get_search_query(); ?>" name="s" />
            <div class="input-group-append">
	            <button type="submit" value="<?php echo esc_attr_x('Search', 'submit button', 'woocommerce'); ?>" class="btn btn-primary"><?php echo esc_html_x('Search', 'submit button', 'woocommerce'); ?></button>
            </div>
        </div>
    </div>
    <input type="hidden" name="post_type" value="product" />
</form>

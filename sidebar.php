<?php
/**
 * The sidebar containing the main widget area.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since 1.0
 *
 * @version 1.0
 */
if (!is_active_sidebar('sidebar-1')) {
    return;
}
?>

<div id="secondary" class="col-12 col-lg-3 col-md-4" role="complementary" aria-label="<?php esc_attr_e('Blog Sidebar', 'madeit'); ?>">
	<?php dynamic_sidebar('sidebar-1'); ?>
</div>

<?php
/**
 * The sidebar containing the main widget area.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since 1.0
 *
 * @version 1.0
 */
if (!is_active_sidebar('sidebar-left')) {
    return;
}
?>

<div id="secondary" class="col-lg-4" role="complementary" aria-label="<?php esc_attr_e('Left Sidebar', 'madeit'); ?>">
	<?php dynamic_sidebar('sidebar-left'); ?>
</div>

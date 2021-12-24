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
$sidebarClass = apply_filters('madeit_sidebar_class', ['col-12', 'col-lg-3', 'col-md-4']);
?>

<div id="secondary" class="<?php echo is_array($sidebarClass) ? implode(' ', $sidebarClass) : $sidebarClass; ?>" role="complementary" aria-label="<?php esc_attr_e('Blog Sidebar', 'madeit'); ?>">
	<?php dynamic_sidebar('sidebar-1'); ?>
</div>

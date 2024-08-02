<?php
/**
 * Displays top navigation.
 *
 * @since 1.0
 */

$classes = ['navbar', 'navbar-expand-md', 'bg-white', 'fixed-top', 'd-block'];
if (version_compare(MADEIT_VERSION, '2.9.0', '>=')) {
    $classes = ['navbar', 'navbar-expand-lg', 'bg-white', 'fixed-top', 'd-block'];
}
$navBarClass = apply_filters('madeit_navbar_class', $classes);
?>
<nav class="<?php echo is_array($navBarClass) ? implode(' ', $navBarClass) : $navBarClass; ?>">
    <div class="container text-center">
        <?php get_template_part('template-parts/header/site', 'branding'); ?>
    </div>
</nav>

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
$containerClass = apply_filters('madeit_navbar_container_class', ['container']);
$menuContainerClass = apply_filters('madeit_navbar_menu_container_class', ['collapse', 'navbar-collapse', 'main-navigation']);
$menuClass = apply_filters('madeit_navbar_menu_class', ['menu', 'nav', 'navbar-nav', 'ml-auto', 'ms-auto', 'align-items-md-center']);
?>
<nav class="<?php echo is_array($navBarClass) ? implode(' ', $navBarClass) : $navBarClass; ?>">
    
    <?php
    if (HEADER_UPPER_TOP) {
        get_template_part('template-parts/navigation/navigation', 'upper-top');
    }
    ?>
    <div class="<?php echo is_array($containerClass) ? implode(' ', $containerClass) : $containerClass; ?>">
        <?php get_template_part('template-parts/header/site', 'branding'); ?>

        <?php do_action('madeit_before_navbar_toggler'); ?>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#site-navigation" data-bs-toggle="collapse" data-bs-target="#site-navigation" aria-expanded="false" aria-label="<?php _e('Menu', 'madeit'); ?>">
            <span class="sr-only"><?php _e('Menu', 'madeit'); ?></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>


        <?php do_action('madeit_after_navbar_toggler'); ?>
        
        <?php
        wp_nav_menu(apply_filters('madeit_top_nav_menu_options', [
            'theme_location'    => 'top',
            'menu_id'           => 'top-menu',
            'depth'             => 3,
            'container'         => 'nav',
            'container_id'      => 'site-navigation',
            'container_class'   => is_array($menuContainerClass) ? implode(' ', $menuContainerClass) : $menuContainerClass,
            'menu_class'        => is_array($menuClass) ? implode(' ', $menuClass) : $menuClass,
            'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
            'walker'            => new wp_bootstrap_navwalker(),
        ])); ?>

        <?php do_action('madeit_after_navbar_menu'); ?>
    </div>
        <?php
        if (HEADER_UPPER_BOTTOM === 'sticky') {
            ?>
            <div class="row">
                <div class="col p-0">
                <?php get_template_part('template-parts/navigation/navigation', 'upper-bottom'); ?>
                </div>
            </div>
            <?php
        }
        ?>
</nav>

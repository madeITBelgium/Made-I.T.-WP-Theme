<?php
/**
 * Displays top navigation.
 *
 * @since 1.0
 */
$navBarClass = apply_filters('madeit_navbar_class', ['navbar', 'navbar-expand-md', 'bg-white', 'fixed-top', 'd-block']);
$containerClass = apply_filters('madeit_navbar_container_class', ['container']);
$menuClass = apply_filters('madeit_navbar_menu_class', ['menu', 'nav', 'navbar-nav', 'ml-auto']);
?>
<nav class="<?php echo is_array($navBarClass) ? implode(' ', $navBarClass) : $navBarClass; ?>">
    
    <?php
    if (HEADER_UPPER_TOP) {
        get_template_part('template-parts/navigation/navigation', 'upper-top');
    }
    ?>
    <div class="<?php echo is_array($containerClass) ? implode(' ', $containerClass) : $containerClass; ?>">
        <?php get_template_part('template-parts/header/site', 'branding'); ?>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#site-navigation" aria-expanded="false" aria-label="<?php _e('Menu', 'madeit'); ?>">
            <span class="sr-only"><?php _e('Menu', 'madeit'); ?></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        
        <?php
        wp_nav_menu([
            'theme_location'    => 'top',
            'menu_id'           => 'top-menu',
            'depth'             => 2,
            'container'         => 'nav',
            'container_id'      => 'site-navigation',
            'container_class'   => 'collapse navbar-collapse main-navigation',
            'menu_class'        => is_array($menuClass) ? implode(' ', $menuClass) : $menuClass,
            'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
            'walker'            => new wp_bootstrap_navwalker(),
        ]); ?>
    </div>
</nav>

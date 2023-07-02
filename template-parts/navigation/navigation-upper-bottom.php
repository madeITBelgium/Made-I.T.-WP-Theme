<?php
/**
 * Displays top navigation.
 *
 * @since 1.0
 */
$navBarClass = apply_filters('madeit_upper_bottom_navbar_class', ['container-fluid', 'd-none', 'd-lg-block', 'pb-1', 'font-weight-light', 'upper-bottom-navbar', ' navbar', 'navbar-expand', 'border-bottom', 'border-dark']);
$containerClass = apply_filters('madeit_upper_bottom_navbar_container_class', ['container', 'p-0']);
?>

<div class="<?php echo is_array($navBarClass) ? implode(' ', $navBarClass) : $navBarClass; ?>" id="secondary-bottom-navigation-container">
    <?php if (!in_array('container', $navBarClass)) { ?>
    <div class="row vw-100">
        <div class="col">
            <?php do_action('madeit_upper_bottom_navbar_col_start'); ?>
            <div class="<?php echo is_array($containerClass) ? implode(' ', $containerClass) : $containerClass; ?>">
                <?php } ?>
                <div class="row w-100 no-gutters justify-content-center">
                    <div class="col-auto">
                        <?php
                        wp_nav_menu([
                            'theme_location'    => 'upper-bottom',
                            'menu_id'           => 'upper-bottom-menu',
                            'depth'             => 3,
                            'container'         => 'nav',
                            'container_id'      => 'secondary-bottom-navigation',
                            'container_class'   => 'secondary-bottom-navigation',
                            'menu_class'        => 'menu nav navbar-nav',
                            'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
                            'walker'            => new wp_bootstrap_navwalker(),
                        ]); ?>
                    </div>
                </div>
    <?php if (!in_array('container', $navBarClass)) { ?>
            </div>
        </div>
    </div>
    <?php } ?>
</div>

<?php
/**
 * Displays top navigation.
 *
 * @since 1.0
 */
$navBarClass = apply_filters('madeit_upper_navbar_class', ['container-fluid', 'd-none', 'd-lg-block', 'mb-2', 'pb-1', 'font-weight-light', 'upper-top-navbar']);
$containerClass = apply_filters('madeit_upper_navbar_container_class', ['container']);
?>

<div class="<?php echo is_array($navBarClass) ? implode(' ', $navBarClass) : $navBarClass; ?>">
    <?php if (!in_array('container', $navBarClass)) { ?>
    <div class="row">
        <div class="col">
            <div class="<?php echo is_array($containerClass) ? implode(' ', $containerClass) : $containerClass; ?>">
                <?php } ?>
                <div class="row w-100 no-gutters">
                    <div class="col">
                        <?php
                        wp_nav_menu([
                            'theme_location'    => 'upper-top',
                            'menu_id'           => 'upper-top-menu',
                            'depth'             => 2,
                            'container'         => 'nav',
                            'container_id'      => 'secondary-navigation',
                            'container_class'   => 'secondary-navigation',
                            'menu_class'        => 'menu nav navbar-nav',
                            'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
                            'walker'            => new wp_bootstrap_navwalker(),
                        ]); ?>
                    </div>
                    <div class="col text-right social-menu">
                        <nav class="social-upper-navigation" role="navigation" aria-label="<?php esc_attr_e('Social Links Menu', 'madeit'); ?>">
                            <?php
                                wp_nav_menu([
                                    'theme_location' => 'social',
                                    'menu_class'     => 'social-upper-links-menu',
                                    'depth'          => 1,
                                    'link_before'    => '<span class="screen-reader-text">',
                                    'link_after'     => '</span>'.madeit_get_svg(['icon' => 'chain']),
                                ]);
                            ?>
                        </nav><!-- .social-navigation -->
                    </div>
                </div>
    <?php if (!in_array('container', $navBarClass)) { ?>
            </div>
        </div>
    </div>
    <?php } ?>
</div>

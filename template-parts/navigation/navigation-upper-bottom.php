<?php
/**
 * Displays top navigation.
 *
 * @since 1.0
 */
$options = get_option( 'madeit_navbar_options', [] );
$background = function_exists( 'madeit_nav_background_attributes' )
    ? madeit_nav_background_attributes( $options['background_color_bottom'] ?? '' )
    : [ 'class' => '', 'style' => '' ];

$nav_style_attr = '';
if ( ! empty( $background['style'] ) ) {
    $nav_style_attr = ' style="' . esc_attr( $background['style'] ) . '"';
}

$navBarClass = apply_filters(
    'madeit_upper_bottom_navbar_class',
    array_filter( [ 'container-fluid', 'd-none', 'd-lg-block', 'pb-1', 'font-weight-light', 'upper-bottom-navbar', ' navbar', 'navbar-expand', 'border-bottom', 'border-dark', $background['class'] ] )
);
$containerClass = apply_filters('madeit_upper_bottom_navbar_container_class', ['container', 'p-0']);
$rowClass = apply_filters('madeit_upper_bottom_navbar_row_class', ['row', 'vw-100']);
?>

<div class="<?php echo is_array($navBarClass) ? implode(' ', $navBarClass) : $navBarClass; ?>" id="secondary-bottom-navigation-container"<?php echo $nav_style_attr; ?>>
    <?php if ( ! ( is_array( $navBarClass ) && in_array( 'container', $navBarClass, true ) ) ) { ?>
    <div class="<?php echo is_array($rowClass) ? implode(' ', $rowClass) : $rowClass; ?>">
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
                            'depth'             => 4,
                            'container'         => 'nav',
                            'container_id'      => 'secondary-bottom-navigation',
                            'container_class'   => 'secondary-bottom-navigation',
                            'menu_class'        => 'menu nav navbar-nav',
                            'fallback_cb'       => 'wp_bootstrap_navwalker::empty',
                            'walker'            => new wp_bootstrap_navwalker(),
                        ]); ?>
                    </div>
                </div>
    <?php if ( ! ( is_array( $navBarClass ) && in_array( 'container', $navBarClass, true ) ) ) { ?>
            </div>
        </div>
    </div>
    <?php } ?>
</div>

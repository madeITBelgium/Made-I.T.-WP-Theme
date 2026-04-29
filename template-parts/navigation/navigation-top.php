<?php
/**
 * Displays top navigation.
 *
 * @since 1.0
 */

$options = get_option('madeit_navbar_options', []);

$mobile_breakpoint = ! empty( $options['mobile_menu_breakpoint'] ) ? $options['mobile_menu_breakpoint'] : 'md';
$show_mobile_search = ! empty( $options['mobile_menu_search'] );
$show_mobile_cta    = ! empty( $options['mobile_menu_cta'] );

$background_choice = $options['background_color'] ?? '#ffffff';

$is_custom_background = false;

// Backwards compatibility: older versions stored an array with `colors`, `gradient`, `custom`.
if ( is_array( $background_choice ) ) {
    if ( ! empty( $background_choice['custom'] ) ) {
        $background_choice = $background_choice['custom'];
        $is_custom_background = true;
    } elseif ( ! empty( $background_choice['gradient'] ) ) {
        $background_choice = $background_choice['gradient'];
    } elseif ( ! empty( $background_choice['colors'] ) ) {
        $background_choice = $background_choice['colors'];
    } else {
        $background_choice = '#ffffff';
    }
}

$background_choice = is_string( $background_choice ) ? trim( $background_choice ) : '#ffffff';

$palette_support = get_theme_support( 'editor-color-palette' );
$palette        = ( is_array( $palette_support ) && isset( $palette_support[0] ) && is_array( $palette_support[0] ) ) ? $palette_support[0] : [];
$palette_map    = [];
foreach ( (array) $palette as $color ) {
    if ( ! is_array( $color ) || empty( $color['slug'] ) || empty( $color['color'] ) ) {
        continue;
    }
    $palette_map[ (string) $color['slug'] ] = (string) $color['color'];
}

$gradients_support = get_theme_support( 'editor-gradient-presets' );
$gradients         = ( is_array( $gradients_support ) && isset( $gradients_support[0] ) && is_array( $gradients_support[0] ) ) ? $gradients_support[0] : [];
if ( empty( $gradients ) && function_exists( 'madeit_generate_gradients_colors' ) ) {
    $gradients = madeit_generate_gradients_colors();
}

$gradient_map = [];
foreach ( (array) $gradients as $gradient ) {
    if ( ! is_array( $gradient ) || empty( $gradient['slug'] ) || empty( $gradient['gradient'] ) ) {
        continue;
    }
    $gradient_map[ (string) $gradient['slug'] ] = (string) $gradient['gradient'];
}

$background_class   = '';
$nav_style_parts    = [];
$background_choice_hex = sanitize_hex_color( $background_choice );

// Treat raw hex or raw gradient strings as "custom" -> inline styles.
if ( $background_choice_hex ) {
    $is_custom_background = true;
} elseif ( is_string( $background_choice ) && preg_match( '/gradient\(/i', $background_choice ) ) {
    $is_custom_background = true;
}

if ( $is_custom_background ) {
    if ( $background_choice_hex ) {
        $nav_style_parts[] = 'background-color: ' . $background_choice_hex . ';';
    } elseif ( is_string( $background_choice ) && preg_match( '/gradient\(/i', $background_choice ) ) {
        $nav_style_parts[] = 'background-image: ' . $background_choice . ';';
    }
} else {
    // Preset slugs -> classes only.
    if ( isset( $gradient_map[ $background_choice ] ) ) {
        $background_class = 'has-' . sanitize_html_class( $background_choice ) . '-gradient-background';
    } elseif ( isset( $palette_map[ $background_choice ] ) ) {
        $background_class = 'has-' . sanitize_html_class( $background_choice ) . '-background-color';
    }
}

// $classes = ['navbar', 'navbar-expand-md', 'bg-white', 'fixed-top', 'd-block'];
// if (version_compare(MADEIT_VERSION, '2.9.0', '>=')) {
//     $classes = ['navbar', 'navbar-expand-lg', 'bg-white', 'fixed-top', 'd-block'];
// }

$expand_class = 'navbar-expand-md';

switch ( $mobile_breakpoint ) {
    case 'none':
        $expand_class = '';
        break;

    case 'sm':
    case 'md':
    case 'lg':
    case 'xl':
    case 'xxl':
        $expand_class = 'navbar-expand-' . $mobile_breakpoint;
        break;

    case 'custom':
        $expand_class = 'navbar-expand-md';
        break;
}

$classes = array_filter([
    'navbar',
    $expand_class,
    $background_class,
    'fixed-top',
    'd-block'
]);

$navBarClass = apply_filters('madeit_navbar_class', $classes);
$containerClass = apply_filters('madeit_navbar_container_class', ['container']);
$menuContainerClass = apply_filters('madeit_navbar_menu_container_class', ['collapse', 'navbar-collapse', 'main-navigation']);
$menuClass = apply_filters('madeit_navbar_menu_class', ['menu', 'nav', 'navbar-nav', 'ml-auto', 'ms-auto', 'align-items-md-center']);

// Only custom values should output inline styles.
$nav_style_attr = '';
if ( ! empty( $nav_style_parts ) ) {
    $nav_style_attr = ' style="' . esc_attr( implode( ' ', $nav_style_parts ) ) . '"';
}
?>


<nav class="<?php echo is_array($navBarClass) ? implode(' ', $navBarClass) : $navBarClass; ?>"<?php echo $nav_style_attr; ?>>
    
    <?php
    if (HEADER_UPPER_TOP) {
        get_template_part('template-parts/navigation/navigation', 'upper-top');
    }
    ?>
    <div class="<?php echo is_array($containerClass) ? implode(' ', $containerClass) : $containerClass; ?>">
        <?php do_action('madeit_before_navbar_logo'); ?>

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
            'depth'             => 4,
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
            <div class="container-fluid d-block">
                <div class="row">
                    <div class="col p-0">
                    <?php get_template_part('template-parts/navigation/navigation', 'upper-bottom'); ?>
                    </div>
                </div>
            </div>
            <?php
        }
        ?>
</nav>

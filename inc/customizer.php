<?php
/**
 * Made I.T.: Customizer.
 *
 * @since 1.0
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function madeit_customize_register($wp_customize)
{
    $wp_customize->get_setting('blogname')->transport = 'postMessage';
    $wp_customize->get_setting('blogdescription')->transport = 'postMessage';
    $wp_customize->remove_control('header_textcolor');

    $wp_customize->selective_refresh->add_partial('blogname', [
        'selector'        => 'a.navbar-brand, .site-branding-text .site-title',
        'render_callback' => 'madeit_customize_partial_blogname',
    ]);
    $wp_customize->selective_refresh->add_partial('blogdescription', [
        'selector'        => '.site-description',
        'render_callback' => 'madeit_customize_partial_blogdescription',
    ]);

    /*
     * Custom colors.
     */
    $wp_customize->add_setting('colorscheme', [
        'default'           => 'light',
        'transport'         => 'postMessage',
        'sanitize_callback' => 'madeit_sanitize_colorscheme',
    ]);

    $wp_customize->add_control('colorscheme', [
        'type'     => 'radio',
        'label'    => __('Color Scheme', 'madeit'),
        'choices'  => [
            'light'  => __('Light', 'madeit'),
            'dark'   => __('Dark', 'madeit'),
            'custom' => __('Custom', 'madeit'),
        ],
        'section'  => 'colors',
        'priority' => 5,
    ]);

    $wp_customize->add_setting('text_color_rgb', [
        'default'           => '#212529',
        'transport'         => 'refresh',
        'sanitize_callback' => 'madeit_check_rgb',
    ]);
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'text_color_rgb', [
        'mode'       => 'rgb',
        'label'      => __('Text Color', 'madeit'),
        'section'    => 'colors',
        'settings'   => 'text_color_rgb',
    ]));

    $wp_customize->add_setting('background_color_rgb', [
        'default'           => '#ffffff',
        'transport'         => 'refresh',
        'sanitize_callback' => 'madeit_check_rgb',
    ]);
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'background_color_rgb', [
        'mode'       => 'rgb',
        'label'      => __('Background Color', 'madeit'),
        'section'    => 'colors',
        'settings'   => 'background_color_rgb',
    ]));

    $wp_customize->add_setting('primary_color_rgb', [
        'default'           => '#007bff',
        'transport'         => 'refresh',
        'sanitize_callback' => 'madeit_check_rgb',
    ]);
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'primary_color_rgb', [
        'mode'       => 'rgb',
        'label'      => __('Primary Color', 'madeit'),
        'section'    => 'colors',
        'settings'   => 'primary_color_rgb',
    ]));

    $wp_customize->add_setting('secondary_color_rgb', [
        'default'           => '#868e96',
        'transport'         => 'refresh',
        'sanitize_callback' => 'madeit_check_rgb',
    ]);
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'secondary_color_rgb', [
        'mode'       => 'rgb',
        'label'      => __('Secondary Color', 'madeit'),
        'section'    => 'colors',
        'settings'   => 'secondary_color_rgb',
        'default'    => '#868e96',
    ]));

    $wp_customize->add_setting('success_color_rgb', [
        'default'           => '#28a745',
        'transport'         => 'refresh',
        'sanitize_callback' => 'madeit_check_rgb',
    ]);
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'success_color_rgb', [
        'mode'       => 'rgb',
        'label'      => __('Success Color', 'madeit'),
        'section'    => 'colors',
        'settings'   => 'success_color_rgb',
    ]));

    $wp_customize->add_setting('info_color_rgb', [
        'default'           => '#17a2b8',
        'transport'         => 'refresh',
        'sanitize_callback' => 'madeit_check_rgb',
    ]);
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'info_color_rgb', [
        'mode'       => 'rgb',
        'label'      => __('Info Color', 'madeit'),
        'section'    => 'colors',
        'settings'   => 'info_color_rgb',
    ]));

    $wp_customize->add_setting('warning_color_rgb', [
        'default'           => '#ffc107',
        'transport'         => 'refresh',
        'sanitize_callback' => 'madeit_check_rgb',
    ]);
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'warning_color_rgb', [
        'mode'       => 'rgb',
        'label'      => __('Warning Color', 'madeit'),
        'section'    => 'colors',
        'settings'   => 'warning_color_rgb',
    ]));

    $wp_customize->add_setting('danger_color_rgb', [
        'default'           => '#dc3545',
        'transport'         => 'refresh',
        'sanitize_callback' => 'madeit_check_rgb',
    ]);
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'danger_color_rgb', [
        'mode'       => 'rgb',
        'label'      => __('Danger Color', 'madeit'),
        'section'    => 'colors',
        'settings'   => 'danger_color_rgb',
    ]));

    /*
     * Theme options.
     */
    $wp_customize->add_section('theme_options', [
        'title'    => __('Theme Options', 'madeit'),
        'priority' => 130, // Before Additional CSS.
    ]);

    $wp_customize->add_setting('page_layout', [
        'default'           => 'two-column',
        'sanitize_callback' => 'madeit_sanitize_page_layout',
        'transport'         => 'postMessage',
    ]);

    $wp_customize->add_control('page_layout', [
        'label'       => __('Page Layout', 'madeit'),
        'section'     => 'theme_options',
        'type'        => 'radio',
        'description' => __('When the two-column layout is assigned, the page title is in one column and content is in the other.', 'madeit'),
        'choices'     => [
            'one-column' => __('One Column', 'madeit'),
            'two-column' => __('Two Column', 'madeit'),
        ],
        'active_callback' => 'madeit_is_view_with_layout_option',
    ]);

    /*
     * container vs container-fluid
     */
    $wp_customize->add_setting('container_type', [
        'default'           => 'container',
        'sanitize_callback' => 'madeit_sanitize_container_type',
        'transport'         => 'postMessage',
    ]);

    $wp_customize->add_control('container_type', [
        'label'       => __('Page Width', 'madeit'),
        'section'     => 'theme_options',
        'type'        => 'radio',
        'description' => __('Choise the screen width of you content.', 'madeit'),
        'choices'     => [
            'container'       => __('Normal screen width', 'madeit'),
            'container-fluid' => __('Full screen width', 'madeit'),
        ],
        'active_callback' => 'madeit_is_view_with_container_type',
    ]);

    /*
     * enable home page header image on other pages if no featured image is selected
     */
    $wp_customize->add_setting('show_header_on_sub_pages', [
        'default'           => true,
        //'sanitize_callback' => 'madeit_sanitize_header_image_on_other_pages',
        'transport'         => 'postMessage',
    ]);

    $wp_customize->add_control('show_header_on_sub_pages', [
        'label'       => __('Show header image', 'madeit'),
        'section'     => 'header_image',
        'type'        => 'checkbox',
        'description' => __('Show the homepage header image on sub pages when there is no post featured image.', 'madeit'),
        //'active_callback' => 'madeit_is_view_with_container_type',
    ]);

    /**
     * Filter number of front page sections in Made I.T..
     *
     * @since Made I.T. 1.0
     *
     * @param int $num_sections Number of front page sections.
     */
    $num_sections = apply_filters('madeit_front_page_sections', 4);

    // Create a setting and control for each of the sections available in the theme.
    for ($i = 1; $i < (1 + $num_sections); $i++) {
        $wp_customize->add_setting('panel_'.$i, [
            'default'           => false,
            'sanitize_callback' => 'absint',
            'transport'         => 'postMessage',
        ]);

        $wp_customize->add_control('panel_'.$i, [
            /* translators: %d is the front page section number */
            'label'           => sprintf(__('Front Page Section %d Content', 'madeit'), $i),
            'description'     => (1 !== $i ? '' : __('Select pages to feature in each area from the dropdowns. Add an image to a section by setting a featured image in the page editor. Empty sections will not be displayed.', 'madeit')),
            'section'         => 'theme_options',
            'type'            => 'dropdown-pages',
            'allow_addition'  => true,
            'active_callback' => 'madeit_is_static_front_page',
        ]);

        $wp_customize->selective_refresh->add_partial('panel_'.$i, [
            'selector'            => '#panel'.$i,
            'render_callback'     => 'madeit_front_page_section',
            'container_inclusive' => true,
        ]);
    }
}
add_action('customize_register', 'madeit_customize_register');

/**
 * Sanitize the page layout options.
 *
 * @param string $input Page layout.
 */
function madeit_sanitize_page_layout($input)
{
    $valid = [
        'one-column' => __('One Column', 'madeit'),
        'two-column' => __('Two Column', 'madeit'),
    ];

    if (array_key_exists($input, $valid)) {
        return $input;
    }

    return '';
}

/**
 * Sanitize the container type options.
 *
 * @param string $input container type.
 */
function madeit_sanitize_container_type($input)
{
    $valid = [
        'container'       => __('Normal screen width', 'madeit'),
        'container-fluid' => __('Full screen width', 'madeit'),
    ];

    if (array_key_exists($input, $valid)) {
        return $input;
    }

    return '';
}

/**
 * Sanitize the colorscheme.
 *
 * @param string $input Color scheme.
 */
function madeit_sanitize_colorscheme($input)
{
    $valid = ['light', 'dark', 'custom'];

    if (in_array($input, $valid, true)) {
        return $input;
    }

    return 'light';
}

function madeit_check_rgb($hex)
{
    // Complete patterns like #ffffff or #fff
    if (preg_match('/^#([0-9a-fA-F]{6})$/', $hex) || preg_match('/^#([0-9a-fA-F]{3})$/', $hex)) {
        // Remove #
        $hex = substr($hex, 1);
    }

    // Complete patterns without # like ffffff or 000000
    if (preg_match('/^([0-9a-fA-F]{6})$/', $hex)) {
        return '#'.$hex;
    }

    // Short patterns without # like fff or 000
    if (preg_match('/^([0-9a-f]{3})$/', $hex)) {
        // Spread to 6 digits
        return '#'.substr($hex, 0, 1).substr($hex, 0, 1).substr($hex, 1, 1).substr($hex, 1, 1).substr($hex, 2, 1).substr($hex, 2, 1);
    }

    return false;
}

/**
 * Render the site title for the selective refresh partial.
 *
 * @since Made I.T. 1.0
 * @see madeit_customize_register()
 *
 * @return void
 */
function madeit_customize_partial_blogname()
{
    bloginfo('name');
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @since Made I.T. 1.0
 * @see madeit_customize_register()
 *
 * @return void
 */
function madeit_customize_partial_blogdescription()
{
    bloginfo('description');
}

/**
 * Return whether we're previewing the front page and it's a static page.
 */
function madeit_is_static_front_page()
{
    return  is_front_page() && !is_home();
}

/**
 * Return whether we're on a view that supports a one or two column layout.
 */
function madeit_is_view_with_layout_option()
{
    // This option is available on all pages. It's also available on archives when there isn't a sidebar.
    return  is_page() || (is_archive() && !is_active_sidebar('sidebar-1'));
}

/**
 * Return whether we're on a view that supports a one or two column layout.
 */
function madeit_is_view_with_container_type()
{
    // This option is available on all pages. It's also available on archives when there isn't a sidebar.
    return  is_page() || is_archive();
}

/**
 * Bind JS handlers to instantly live-preview changes.
 */
function madeit_customize_preview_js()
{
    wp_enqueue_script('madeit-customize-preview', get_theme_file_uri('/assets/js/customize-preview.js'), ['customize-preview'], '1.0', true);
}
add_action('customize_preview_init', 'madeit_customize_preview_js');

/**
 * Load dynamic logic for the customizer controls area.
 */
function madeit_panels_js()
{
    wp_enqueue_script('madeit-customize-controls', get_theme_file_uri('/assets/js/customize-controls.js'), [], '1.0', true);
}
add_action('customize_controls_enqueue_scripts', 'madeit_panels_js');

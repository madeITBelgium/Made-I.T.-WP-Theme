<?php
/**
 * Made I.T. functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 * @since 1.0
 */

/**
 * Made I.T. Theme only works in WordPress 4.7 or later.
 */
if (!defined('MADEIT_VERSION')) {
    define('MADEIT_VERSION', '2.10.0');
}
/* Default colors */
if (!defined('MADEIT_CUSTOM_COLOR')) {
    define('MADEIT_CUSTOM_COLOR', false);
}
if (!defined('MADEIT_ADVANCED_BLOCKS')) {
    define('MADEIT_ADVANCED_BLOCKS', false);
}
if (!defined('MADEIT_TEXT_COLOR')) {
    define('MADEIT_TEXT_COLOR', '#212529');
}
if (!defined('MADEIT_BACKGROUND_COLOR')) {
    define('MADEIT_BACKGROUND_COLOR', '#ffffff');
}
if (!defined('MADEIT_PRIMARY_COLOR')) {
    define('MADEIT_PRIMARY_COLOR', '#0051A8');
}
if (!defined('MADEIT_SECONDARY_COLOR')) {
    define('MADEIT_SECONDARY_COLOR', '#868e96');
}
if (!defined('MADEIT_SUCCESS_COLOR')) {
    define('MADEIT_SUCCESS_COLOR', '#28a745');
}
if (!defined('MADEIT_INFO_COLOR')) {
    define('MADEIT_INFO_COLOR', '#17a2b8');
}
if (!defined('MADEIT_WARNING_COLOR')) {
    define('MADEIT_WARNING_COLOR', '#ffc107');
}
if (!defined('MADEIT_DANGER_COLOR')) {
    define('MADEIT_DANGER_COLOR', '#dc3545');
}
if (!defined('SHOW_LOGIN_IN_FOOTER')) {
    define('SHOW_LOGIN_IN_FOOTER', false);
}
if (!defined('SHOW_MADEIT_IN_FOOTER')) {
    define('SHOW_MADEIT_IN_FOOTER', true);
}
if (!defined('HEADER_UPPER_TOP')) {
    define('HEADER_UPPER_TOP', false);
}
if (!defined('HEADER_UPPER_BOTTOM')) {
    define('HEADER_UPPER_BOTTOM', false);
}
if (!defined('POST_AUTHOR')) {
    define('POST_AUTHOR', false);
}
if (!defined('POST_EDIT_TIME')) {
    define('POST_EDIT_TIME', false);
}
if (!defined('POST_TIME_FORMAT')) {
    define('POST_TIME_FORMAT', 'long');
}

if (!defined('WOO_SHOPING_CART_MENU_STYLE')) {
    define('WOO_SHOPING_CART_MENU_STYLE', 2);
}

if (!defined('SHOW_SINGLE_SIDEBAR')) {
    define('SHOW_SINGLE_SIDEBAR', true);
}

if (!defined('DISABLE_VER_URL')) {
    define('DISABLE_VER_URL', true);
}

if (!defined('WWW_REDIRECT')) {
    define('WWW_REDIRECT', false);
}

if (!defined('MADEIT_REVIEWS')) {
    define('MADEIT_REVIEWS', false);
}
if (MADEIT_REVIEWS && !defined('MADEIT_FONTAWESOME')) {
    define('MADEIT_FONTAWESOME', 5);
}
if (!defined('MADEIT_FONTAWESOME')) {
    define('MADEIT_FONTAWESOME', 4.7);
}

if (!defined('MADEIT_BOOTSTRAP_VERSION')) {
    define('MADEIT_BOOTSTRAP_VERSION', 4);
}

if (!defined('MADEIT_ADD_DATEPICKER')) {
    define('MADEIT_ADD_DATEPICKER', false);
}
if (!defined('MADEIT_BOOTSTRAP_POPPER')) {
    define('MADEIT_BOOTSTRAP_POPPER', false);
}

if (!defined('MADEIT_POPUPS')) {
    define('MADEIT_POPUPS', true);
}

if (!defined('MADEIT_INFINITE_SCROLL')) {
    define('MADEIT_INFINITE_SCROLL', true);
}

if (!defined('MADEIT_RECEIVE_REVIEWS')) {
    define('MADEIT_RECEIVE_REVIEWS', false);
}


if(!defined('MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX')) {
    define('MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX', true);
}

if(!defined('MADEIT_EMAILSERVICE_NEWSLETTER_LIST')) {
    define('MADEIT_EMAILSERVICE_NEWSLETTER_LIST', false);
}

if(!defined('MADEIT_WOO_B2B')) {
    define('MADEIT_WOO_B2B', false);
}
if(!defined('MADEIT_WOO_B2B_ONLY')) {
    define('MADEIT_WOO_B2B_ONLY', false);
}

if (version_compare($GLOBALS['wp_version'], '4.7-alpha', '<')) {
    require get_template_directory().'/inc/back-compat.php';

    return;
}

if (file_exists(dirname(__FILE__).'/inc/MadeIT_Github_Updater.php')) {
    require_once dirname(__FILE__).'/inc/MadeIT_Github_Updater.php';
    if (class_exists('MadeIT_Github_Updater')) {
        new MadeIT_Github_Updater(__FILE__, 'madeITBelgium', 'Made-I.T.-WP-Theme', null, false);
    }
}

if (!function_exists('madeit_setup')) {
    function madeit_setup()
    {
        load_theme_textdomain('madeit', get_template_directory().'/languages');
        add_theme_support('automatic-feed-links');
        add_theme_support('title-tag');
        add_theme_support('woocommerce');

        add_theme_support('post-thumbnails');

        add_image_size('madeit-featured-image', 2000, 1200, true);
        add_image_size('madeit-featured-blog-image', 1200, 630, true);
        add_image_size('madeit-thumbnail-avatar', 100, 100, true);

        $catalog = [
            'width' 	=> '300',	// px
            'height'	=> '160',	// px
            'crop'		 => 1, 		// true
        ];
        $single = [
            'width' 	=> '1200',	// px
            'height'	=> '630',	// px
            'crop'		 => 1, 		// true
        ];
        $thumbnail = [
            'width' 	=> '300',	// px
            'height'	=> '160',	// px
            'crop'		 => 0, 		// false
        ];
        // Image sizes
        update_option('shop_catalog_image_size', $catalog); 		// Product category thumbs
        update_option('shop_single_image_size', $single); 		// Single product image
        update_option('shop_thumbnail_image_size', $thumbnail); 	// Image gallery thumbs

        $GLOBALS['content_width'] = 740;

        register_nav_menus([
            'top'          => __('Main Menu', 'madeit'),
            'upper-top'    => __('Top of main menu', 'madeit'),
            'upper-bottom' => __('Bottom of main menu', 'madeit'),
            'social'       => __('Social Links Menu', 'madeit'),
        ]);

        add_theme_support('html5', [
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        ]);

        /*
         * Enable support for Post Formats.
         *
         * See: https://codex.wordpress.org/Post_Formats
         */
        add_theme_support('post-formats', [
            'aside',
            'image',
            'video',
            'quote',
            'link',
            'gallery',
            'audio',
        ]);

        // Add theme support for Custom Logo.
        add_theme_support('custom-logo', [
            'width'       => 260,
            'height'      => 89,
            'flex-height' => true,
            'flex-width'  => true,
        ]);

        // Add theme support for selective refresh for widgets.
        add_theme_support('customize-selective-refresh-widgets');

        /*
         * This theme styles the visual editor to resemble the theme style,
         * specifically font, colors, and column width.
         */
        //add_editor_style(['assets/css/editor-style.css', madeit_fonts_url()]);

        // Define and register starter content to showcase the theme on new sites.
        $starter_content = [
            'widgets' => [
                // Place three core-defined widgets in the sidebar area.
                'sidebar-1' => [
                    'text_business_info',
                    'search',
                    'text_about',
                ],

                // Add the core-defined business info widget to the footer 1 area.
                'sidebar-2' => [
                    'text_business_info',
                ],

                // Put two core-defined widgets in the footer 2 area.
                'sidebar-3' => [
                    'text_about',
                    'search',
                ],
            ],

            // Specify the core-defined pages to create and add custom thumbnails to some of them.
            'posts' => [
                'home',
                'about' => [
                    'thumbnail' => '{{image-inside}}',
                ],
                'contact' => [
                    'thumbnail' => '{{image-price-table}}',
                ],
                'blog' => [
                    'thumbnail' => '{{image-koffie-machien}}',
                ],
                'homepage-section' => [
                    'thumbnail' => '{{image-outside}}',
                ],
            ],

            // Create the custom image attachments used as post thumbnails for pages.
            'attachments' => [
                'image-koffie-machien' => [
                    'post_title' => _x('Koffie Machien', 'Theme starter content', 'madeit'),
                    'file'       => 'assets/images/pexels-photo-296888.jpeg', // URL relative to the template directory.
                ],
                'image-outside' => [
                    'post_title' => _x('Outside', 'Theme starter content', 'madeit'),
                    'file'       => 'assets/images/pexels-photo-429247.jpeg',
                ],
                'image-inside' => [
                    'post_title' => _x('Inside', 'Theme starter content', 'madeit'),
                    'file'       => 'assets/images/pexels-photo-704982.jpeg',
                ],
                'image-price-table' => [
                    'post_title' => _x('Price table', 'Theme starter content', 'madeit'),
                    'file'       => 'assets/images/pexels-photo-705676.jpeg',
                ],
            ],

            // Default to a static front page and assign the front and posts pages.
            'options' => [
                'show_on_front'  => 'page',
                'page_on_front'  => '{{home}}',
                'page_for_posts' => '{{blog}}',
            ],

            // Set the front page section theme mods to the IDs of the core-registered pages.
            'theme_mods' => [
                //'panel_1' => '{{homepage-section}}',
                'panel_1' => '{{about}}',
                'panel_2' => '{{blog}}',
                'panel_3' => '{{contact}}',
            ],

            // Set up nav menus for each of the two areas registered in the theme.
            'nav_menus' => [
                // Assign a menu to the "top" location.
                'top' => [
                    'name'  => __('Top Menu', 'madeit'),
                    'items' => [
                        'link_home', // Note that the core "home" page is actually a link in case a static front page is not used.
                        'page_about',
                        'page_blog',
                        'page_contact',
                    ],
                ],

                // Assign a menu to the "social" location.
                'social' => [
                    'name'  => __('Social Links Menu', 'madeit'),
                    'items' => [
                        'link_facebook',
                        'link_twitter',
                        'link_instagram',
                        'link_email',
                    ],
                ],
            ],
        ];

        $starter_content = apply_filters('madeit_starter_content', $starter_content);
        add_theme_support('starter-content', $starter_content);

        madeit_gutenberg_support();
    }
    add_action('after_setup_theme', 'madeit_setup');
}

function madeit_get_theme_color($type, $default)
{
    if (MADEIT_CUSTOM_COLOR) {
        return $default;
    }

    return get_theme_mod($type, $default);
}

if (!function_exists('madeit_gutenberg_support')) {
    function madeit_gutenberg_support()
    {
        //Gutenberg
        add_theme_support('align-wide');
        add_theme_support('responsive-embeds');

        if (MADEIT_CUSTOM_COLOR || 'custom' === get_theme_mod('colorscheme')) {
            add_theme_support('editor-color-palette', apply_filters('madeit_colorscheme', [
                [
                    'name'  => __('White Color', 'madeit'),
                    'slug'  => 'white',
                    'color' => '#FFFFFF',
                ],
                [
                    'name'  => __('Black Color', 'madeit'),
                    'slug'  => 'black',
                    'color' => '#000000',
                ],
                [
                    'name'  => __('Text Color', 'madeit'),
                    'slug'  => 'default-text',
                    'color' => madeit_get_theme_color('text_color_rgb', MADEIT_TEXT_COLOR),
                ],
                [
                    'name'  => __('Background Color', 'madeit'),
                    'slug'  => 'default-bg',
                    'color' => madeit_get_theme_color('background_color_rgb', MADEIT_BACKGROUND_COLOR),
                ],
                [
                    'name'  => __('Primary Color', 'madeit'),
                    'slug'  => 'primary',
                    'color' => madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR),
                ],
                [
                    'name'  => __('Secondary Color', 'madeit'),
                    'slug'  => 'secondary',
                    'color' => madeit_get_theme_color('secondary_color_rgb', MADEIT_SECONDARY_COLOR),
                ],
                [
                    'name'  => __('Success Color', 'madeit'),
                    'slug'  => 'success',
                    'color' => madeit_get_theme_color('success_color_rgb', MADEIT_SUCCESS_COLOR),
                ],
                [
                    'name'  => __('Info Color', 'madeit'),
                    'slug'  => 'info',
                    'color' => madeit_get_theme_color('info_color_rgb', MADEIT_INFO_COLOR),
                ],
                [
                    'name'  => __('Warning Color', 'madeit'),
                    'slug'  => 'warning',
                    'color' => madeit_get_theme_color('warning_color_rgb', MADEIT_WARNING_COLOR),
                ],
                [
                    'name'  => __('Danger Color', 'madeit'),
                    'slug'  => 'danger',
                    'color' => madeit_get_theme_color('danger_color_rgb', MADEIT_DANGER_COLOR),
                ],
            ]));

            add_theme_support('editor-gradient-presets', madeit_generate_gradients_colors());
        }
    }
}

/*
 * Enqueue block editor style
 */
if (!function_exists('madeit_block_editor_styles')) {
    function madeit_block_editor_styles()
    {
        wp_enqueue_style('madeit-block-editor-styles', get_template_directory_uri().'/style-editor.css', false, MADEIT_VERSION, 'all');
        wp_enqueue_script('madeit-gutenberg-toolbar', get_template_directory_uri().'/assets/js/gutenberg-toolbar.js', [], MADEIT_VERSION, true);
    }

    add_action('enqueue_block_editor_assets', 'madeit_block_editor_styles');
}

/*
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
if (!function_exists('madeit_content_width')) {
    function madeit_content_width()
    {
        $content_width = $GLOBALS['content_width'];

        // Get layout.
        $page_layout = get_theme_mod('page_layout');

        // Check if layout is one column.
        if ('one-column' === $page_layout) {
            if (madeit_is_frontpage()) {
                $content_width = 740;
            } elseif (is_page()) {
                $content_width = 740;
            }
        }

        // Check if is single post and there is no sidebar.
        if (is_single() && !is_active_sidebar('sidebar-1') && !is_active_sidebar('sidebar-left')) {
            $content_width = 740;
        }

        $GLOBALS['content_width'] = apply_filters('madeit_content_width', $content_width);
    }
    add_action('template_redirect', 'madeit_content_width', 0);
}

/*
 * Register custom fonts.
 */
if (!function_exists('madeit_fonts_url')) {
    function madeit_fonts_url()
    {
        $fonts_url = '';
        /*
         * Translators: If there are characters in your language that are not
         * supported by Libre Franklin, translate this to 'off'. Do not translate
         * into your own language.
         */
        $libre_franklin = _x('on', 'Libre Franklin font: on or off', 'madeit');

        if ('off' !== $libre_franklin) {
            $font_families = [];

            $font_families[] = 'Libre Franklin:300,300i,400,400i,600,600i,800,800i';

            $query_args = [
                'family' => urlencode(implode('|', $font_families)),
                'subset' => urlencode('latin,latin-ext'),
            ];

            $fonts_url = add_query_arg($query_args, 'https://fonts.googleapis.com/css');
        }

        return esc_url_raw($fonts_url);
    }
}

/*
 * Add preconnect for Google Fonts.
 *
 * @since Made I.T. 1.0
 *
 * @param array  $urls          URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed.
 *
 * @return array $urls           URLs to print for resource hints.
 */
if (!function_exists('madeit_resource_hints')) {
    function madeit_resource_hints($urls, $relation_type)
    {
        if (wp_style_is('madeit-fonts', 'queue') && 'preconnect' === $relation_type) {
            $urls[] = [
                'href' => 'https://fonts.gstatic.com',
                'crossorigin',
            ];
        }

        return $urls;
    }
    add_filter('wp_resource_hints', 'madeit_resource_hints', 10, 2);
}

/*
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
if (!function_exists('madeit_widgets_init')) {
    function madeit_widgets_init()
    {
        register_sidebar([
            'name'          => __('Right Sidebar', 'madeit'),
            'id'            => 'sidebar-1',
            'description'   => __('Add widgets here to appear in your sidebar on blog posts and archive pages.', 'madeit'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ]);

        register_sidebar([
            'name'          => __('Left Sidebar', 'madeit'),
            'id'            => 'sidebar-left',
            'description'   => __('Add widgets here to appear in your left sidebar.', 'madeit'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ]);

        register_sidebar([
            'name'          => __('Footer 1', 'madeit'),
            'id'            => 'sidebar-2',
            'description'   => __('Add widgets here to appear in your footer.', 'madeit'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
        ]);

        register_sidebar([
            'name'          => __('Footer 2', 'madeit'),
            'id'            => 'sidebar-3',
            'description'   => __('Add widgets here to appear in your footer.', 'madeit'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
        ]);

        register_sidebar([
            'name'          => __('Footer 3', 'madeit'),
            'id'            => 'sidebar-4',
            'description'   => __('Add widgets here to appear in your footer.', 'madeit'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
        ]);

        register_sidebar([
            'name'          => __('Footer 4', 'madeit'),
            'id'            => 'sidebar-5',
            'description'   => __('Add widgets here to appear in your footer.', 'madeit'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
        ]);

        register_sidebar([
            'name'          => __('Below index blog', 'madeit'),
            'id'            => 'below-index-1',
            'description'   => __('Add widgets here to appear below your blog/news list.', 'madeit'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        ]);
    }
    add_action('widgets_init', 'madeit_widgets_init');
}

/*
 * Replaces "[...]" (appended to automatically generated excerpts) with ... and
 * a 'Continue reading' link.
 *
 * @since Made I.T. 1.0
 *
 * @param string $link Link to single post/page.
 *
 * @return string 'Continue reading' link prepended with an ellipsis.
 */
if (!function_exists('madeit_excerpt_more')) {
    function madeit_excerpt_more($link)
    {
        if (is_admin()) {
            return $link;
        }

        $link = sprintf(
            '<p class="link-more"><a href="%1$s" class="more-link">%2$s</a></p>',
            esc_url(get_permalink(get_the_ID())),
            /* translators: %s: Name of current post */
            sprintf(__('Continue reading<span class="screen-reader-text"> "%s"</span>', 'madeit'), get_the_title(get_the_ID()))
        );

        return ' &hellip; '.$link;
    }
    add_filter('excerpt_more', 'madeit_excerpt_more');
}

/*
 * Handles JavaScript detection.
 *
 * Adds a `js` class to the root `<html>` element when JavaScript is detected.
 *
 * @since Made I.T. 1.0
 */
if (!function_exists('madeit_javascript_detection')) {
    function madeit_javascript_detection()
    {
        echo "<script>(function(html){html.className = html.className.replace(/\bno-js\b/,'js')})(document.documentElement);</script>\n";
    }
    add_action('wp_head', 'madeit_javascript_detection', 0);
}

/*
 * Add a pingback url auto-discovery header for singularly identifiable articles.
 */
if (!function_exists('madeit_pingback_header')) {
    function madeit_pingback_header()
    {
        if (is_singular() && pings_open()) {
            printf('<link rel="pingback" href="%s">'."\n", get_bloginfo('pingback_url'));
        }
    }
    add_action('wp_head', 'madeit_pingback_header');
}

/*
 * Display custom color CSS.
 */
if (!function_exists('madeit_colors_css_wrap')) {
    function madeit_colors_css_wrap()
    {
        if (!MADEIT_CUSTOM_COLOR && 'custom' !== get_theme_mod('colorscheme')) {
            return;
        }

        if (is_admin()) {
            return;
        }

        if (!madeit_css_cacheExists()) {
            require_once get_parent_theme_file_path('/inc/color-patterns.php'); ?>
            <style type="text/css" id="custom-theme-colors">
                <?php echo madeit_custom_colors_css(); ?>
            </style>
            <?php
        }
    }
    add_action('wp_head', 'madeit_colors_css_wrap');
}

/*
 * Display custom color CSS.
 */
if (!function_exists('madeit_blocks_colors_inline')) {
    function madeit_blocks_colors_inline()
    {
        if (!MADEIT_CUSTOM_COLOR && 'custom' !== get_theme_mod('colorscheme')) {
            return;
        }

        if (!madeit_css_cacheExists()) {
            require_once get_parent_theme_file_path('/inc/color-patterns.php');
            wp_enqueue_style('madeit-color-gutenberg', get_theme_file_uri().'style.css');
            wp_add_inline_style('madeit-color-gutenberg', madeit_custom_colors_css());
        }
    }
    add_action('enqueue_block_editor_assets', 'madeit_colors_css_wrap');
}

/*
 * Enqueue scripts and styles.
 */
if (!function_exists('madeit_scripts')) {
    function madeit_scripts()
    {
        // Add custom fonts, used in the main stylesheet.
        //wp_enqueue_style('madeit-fonts', madeit_fonts_url(), [], null);

        if (MADEIT_BOOTSTRAP_VERSION === 5) {
            wp_enqueue_style('madeit-bootstrap-style', get_theme_file_uri('/assets/bootstrap-5/style.css'), [], wp_get_theme()->get('Version'));
        } else {
            wp_enqueue_style('madeit-bootstrap-style', get_theme_file_uri('/assets/bootstrap-46/style.css'), [], wp_get_theme()->get('Version'));
        }

        wp_enqueue_style('madeit-style', get_stylesheet_uri(), ['madeit-bootstrap-style'], wp_get_theme()->get('Version'));

        // Theme stylesheet.
        if (MADEIT_REVIEWS) {
            wp_enqueue_style('madeit-reviews-css', get_theme_file_uri('/assets/css/reviews.css'), [], wp_get_theme()->get('Version'));
        }
        wp_enqueue_style('madeit-gutenberg-style', get_theme_file_uri('/assets/css/gutenfront.css'), ['madeit-style', 'wp-editor'], wp_get_theme()->get('Version'));
        wp_enqueue_style('madeit-aos-style', get_theme_file_uri('/assets/css/aos.css'), ['madeit-style'], wp_get_theme()->get('Version'));

        // Load the dark colorscheme.
        if ('dark' === get_theme_mod('colorscheme', 'light') || is_customize_preview()) {
            wp_enqueue_style('madeit-colors-dark', get_theme_file_uri('/assets/css/colors-dark.css'), ['madeit-style'], MADEIT_VERSION);
        }

        if (!madeit_css_cacheExists() || !madeit_css_isCacheUpToDate()) {
            madeit_css_generateCache();
        }
        if (madeit_css_cacheExists()) {
            wp_enqueue_style('madeit-custom-css', madeit_css_cacheUrl(), ['madeit-style'], wp_get_theme()->get('Version'));
        }

        wp_enqueue_script('script-fix-jquery', get_theme_file_uri('/assets/js/script-fix-jquery.js'), ['jquery'], MADEIT_VERSION, true);

        if (MADEIT_BOOTSTRAP_VERSION === 5) {
            wp_enqueue_script('bootstrap', get_theme_file_uri('/assets/bootstrap-5/script.js'), [], MADEIT_VERSION, true);
            //wp_enqueue_script('popper', get_theme_file_uri('/assets/bootstrap-5/popper.js'), ['bootstrap'], MADEIT_VERSION, true);

            if (MADEIT_POPUPS) {
                wp_enqueue_script('popup', get_theme_file_uri('/assets/bootstrap-5/popup.js'), ['bootstrap'], MADEIT_VERSION, true);
            }
        } else {
            wp_enqueue_script('popper', get_theme_file_uri('/assets/bootstrap-46/popper.min.js'), ['jquery'], MADEIT_VERSION, true);
            wp_enqueue_script('bootstrap', get_theme_file_uri('/assets/bootstrap-46/script.js'), ['jquery', 'popper'], MADEIT_VERSION, true);

            if (MADEIT_POPUPS) {
                wp_enqueue_script('popup', get_theme_file_uri('/assets/bootstrap-46/popup.js'), ['bootstrap'], MADEIT_VERSION, true);
            }
        }

        wp_enqueue_script('script', get_template_directory_uri().'/assets/js/script.js', ['bootstrap'], MADEIT_VERSION, true);
        wp_enqueue_script('madeit-aos', get_template_directory_uri().'/assets/js/aos.js', [], MADEIT_VERSION, true);

        if (defined('MADEIT_INFINITE_SCROLL') && MADEIT_INFINITE_SCROLL) {
            wp_enqueue_script('madeit-infinitescroll', get_template_directory_uri().'/assets/js/infinitescroll.js', ['jquery'], MADEIT_VERSION, true);
            madeit_infinite_options_to_script();
        }

        if (MADEIT_ADD_DATEPICKER) {
            wp_enqueue_script('bootstrap-datepicker', get_theme_file_uri('/assets/js/bootstrap-datepicker.min.js'), ['jquery'], MADEIT_VERSION, true);
        }

        //wp_enqueue_script('jquery-scrollto', get_theme_file_uri('/assets/js/jquery.scrollTo.js'), ['jquery'], '2.1.2', true);

        if (is_singular() && comments_open() && get_option('thread_comments')) {
            wp_enqueue_script('comment-reply');
        }
    }
    add_action('wp_enqueue_scripts', 'madeit_scripts');
}

if (!function_exists('madeit_infinite_options_to_script')) {
    function madeit_infinite_options_to_script()
    {
        $nav_selector = apply_filters('madeit_infinite_navselector', '.woocommerce-pagination, .pagination');
        $next_selector = apply_filters('madeit_infinite_nextselector', 'ul.page-numbers a.next, .pagination .next');
        $item_selector = apply_filters('madeit_infinite_itemselector', 'div.row.columns-3 .col, div.row.columns-3 .col-12, #primary .card-columns .card, .content-wrapper > div');
        $content_selector = apply_filters('madeit_infinite_contentselector', 'div.row.columns-3, #primary .card-columns, .content-wrapper');

        wp_localize_script('madeit-infinitescroll', 'madeit_infinite', [
            'navSelector'     => $nav_selector,
            'nextSelector'    => $next_selector,
            'itemSelector'    => $item_selector,
            'contentSelector' => $content_selector,
            'shop'            => function_exists('WC') && (is_shop() || is_product_category() || is_product_tag()),
        ]);
    }
}

if (!function_exists('remove_jquery_migrate_and_move_jquery_to_footer')) {
    function remove_jquery_migrate_and_move_jquery_to_footer(&$scripts)
    {
        if (!is_admin()) {
            $scripts->add_data('jquery', 'group', 1);
            $scripts->add_data('jquery-core', 'group', 1);
            $scripts->add_data('jquery-migrate', 'group', 1);

            //$scripts->remove( 'jquery');
            //$scripts->add( 'jquery', false, array( 'jquery-core' ), '1.12.4' );
        }
    }
    add_filter('wp_default_scripts', 'remove_jquery_migrate_and_move_jquery_to_footer');
}

if (!function_exists('prefix_add_footer_styles')) {
    function prefix_add_footer_styles()
    {
        if (MADEIT_FONTAWESOME === 4.7) {
            wp_enqueue_style('font-awesome', get_theme_file_uri('/assets/css/font-awesome.min.css'), [], '4.7.0');
        } elseif (MADEIT_FONTAWESOME === 5) {
            wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css', [], '5.15.4');
        }

        if (MADEIT_ADD_DATEPICKER) {
            wp_enqueue_style('bootstrap-datepicker', get_theme_file_uri('/assets/css/bootstrap-datepicker.min.css'), [], MADEIT_VERSION);
        }
    }
    add_action('get_footer', 'prefix_add_footer_styles');
}

if (!function_exists('madeit_admin_style')) {
    function madeit_admin_style()
    {
        wp_enqueue_style('madeit-fonts', madeit_fonts_url(), [], null);
        wp_enqueue_style('madeit-gutenberg-editor', get_template_directory_uri().'/assets/css/gutenberg.css');
    }
    add_action('admin_enqueue_scripts', 'madeit_admin_style');
}

if (!function_exists('remove_css_js_ver') && DISABLE_VER_URL) {
    function remove_css_js_ver($src)
    {
        if (!is_admin()) {
            if (strpos($src, '?ver=')) {
                $src = remove_query_arg('ver', $src);
            }
        }

        return $src;
    }
    add_filter('style_loader_src', 'remove_css_js_ver', 10, 2);
    add_filter('script_loader_src', 'remove_css_js_ver', 10, 2);
}

/*
 * Add custom image sizes attribute to enhance responsive image functionality
 * for content images.
 *
 * @since Made I.T. 1.0
 *
 * @param string $sizes A source size value for use in a 'sizes' attribute.
 * @param array  $size  Image size. Accepts an array of width and height
 *                      values in pixels (in that order).
 *
 * @return string A source size value for use in a content image 'sizes' attribute.
 */
if (!function_exists('madeit_content_image_sizes_attr')) {
    function madeit_content_image_sizes_attr($sizes, $size)
    {
        $width = $size[0];

        if (740 <= $width) {
            $sizes = '(max-width: 706px) 89vw, (max-width: 767px) 82vw, 740px';
        }

        if (is_active_sidebar('sidebar-1') || is_archive() || is_search() || is_home() || is_page()) {
            if (!(is_page() && 'one-column' === get_theme_mod('page_options')) && 767 <= $width) {
                $sizes = '(max-width: 767px) 89vw, (max-width: 1000px) 54vw, (max-width: 1071px) 543px, 580px';
            }
        }

        return $sizes;
    }
    add_filter('wp_calculate_image_sizes', 'madeit_content_image_sizes_attr', 10, 2);
}

/*
 * Filter the `sizes` value in the header image markup.
 *
 * @since Made I.T. 1.0
 *
 * @param string $html   The HTML image tag markup being filtered.
 * @param object $header The custom header object returned by 'get_custom_header()'.
 * @param array  $attr   Array of the attributes for the image tag.
 *
 * @return string The filtered header image HTML.
 */
if (!function_exists('madeit_header_image_tag')) {
    function madeit_header_image_tag($html, $header, $attr)
    {
        if (isset($attr['sizes'])) {
            $html = str_replace($attr['sizes'], '100vw', $html);
        }

        return $html;
    }
    add_filter('get_header_image_tag', 'madeit_header_image_tag', 10, 3);
}

/*
 * Add custom image sizes attribute to enhance responsive image functionality
 * for post thumbnails.
 *
 * @since Made I.T. 1.0
 *
 * @param array $attr       Attributes for the image markup.
 * @param int   $attachment Image attachment ID.
 * @param array $size       Registered image size or flat array of height and width dimensions.
 *
 * @return array The filtered attributes for the image markup.
 */
if (!function_exists('madeit_post_thumbnail_sizes_attr')) {
    function madeit_post_thumbnail_sizes_attr($attr, $attachment, $size)
    {
        if (is_archive() || is_search() || is_home()) {
            $attr['sizes'] = '(max-width: 767px) 89vw, (max-width: 1000px) 54vw, (max-width: 1071px) 543px, 580px';
        } else {
            $attr['sizes'] = '100vw';
        }

        return $attr;
    }
    add_filter('wp_get_attachment_image_attributes', 'madeit_post_thumbnail_sizes_attr', 10, 3);
}

/*
 * Use front-page.php when Front page displays is set to a static page.
 *
 * @since Made I.T. 1.0
 *
 * @param string $template front-page.php.
 *
 * @return string The template to be used: blank if is_home() is true (defaults to index.php), else $template.
 */
if (!function_exists('madeit_front_page_template')) {
    function madeit_front_page_template($template)
    {
        return is_home() ? '' : $template;
    }
    add_filter('frontpage_template', 'madeit_front_page_template');
}

/*
 * Modifies tag cloud widget arguments to display all tags in the same font size
 * and use list format for better accessibility.
 *
 * @since Made I.T. 1.0
 *
 * @param array $args Arguments for tag cloud widget.
 *
 * @return array The filtered arguments for tag cloud widget.
 */
if (!function_exists('madeit_widget_tag_cloud_args')) {
    function madeit_widget_tag_cloud_args($args)
    {
        $args['largest'] = 1;
        $args['smallest'] = 1;
        $args['unit'] = 'em';
        $args['format'] = 'list';

        return $args;
    }
    add_filter('widget_tag_cloud_args', 'madeit_widget_tag_cloud_args');
}

/*
 * Fix bootstrap menu when admin bar is enabled
 */
if (!function_exists('madeit_wp_bootstrap_head')) {
    function madeit_wp_bootstrap_head()
    {
        if (is_admin_bar_showing()) {
            ?>
            <style>
            body.logged-in .navbar.fixed-top{ top: 46px !important; }
            @media only screen and (min-width: 783px) {
                body{ padding-top: 0px !important; }
                body.logged-in .navbar.fixed-top{ top: 28px !important; }
            }
            @media screen and (max-width: 600px) {
                #wpadminbar {
                    position: fixed;
                }
            }
            </style>
            <?php
        }
    }
    add_action('wp_head', 'madeit_wp_bootstrap_head');
}

/* Style read more button */
if (!function_exists('modify_read_more_link')) {
    function modify_read_more_link($text)
    {
        return '<a class="more-link btn btn-block btn-warning" href="'.get_permalink().'">'.__('Continue reading', 'madeit').'</a>';
    }
    add_filter('the_content_more_link', 'modify_read_more_link');
}

/**
 * Include the TGM_Plugin_Activation class.
 */
require_once get_parent_theme_file_path('/inc/class-tgm-plugin-activation.php');

if (!function_exists('madeit_register_required_plugins')) {
    function madeit_register_required_plugins()
    {
        /*
         * Array of plugin arrays. Required keys are name and slug.
         * If the source is NOT from the .org repo, then source is also required.
         */
        $plugins = [
            [
                'name'     => 'Smush Image Compression and Optimization',
                'slug'     => 'wp-smushit',
                'required' => true,
            ],
            [
                'name'        => 'WordPress SEO by Yoast',
                'slug'        => 'wordpress-seo',
                'is_callable' => 'wpseo_init',
                'required'    => true,
            ],
            [
                'name'     => 'Forms',
                'slug'     => 'forms-by-made-it',
                'required' => true,
            ],
            [
                'name'     => 'Wordfence Security',
                'slug'     => 'wordfence',
                'required' => false,
            ],
            [
                'name'     => 'WooCommerce',
                'slug'     => 'woocommerce',
                'required' => false,
            ],
            [
                'name'     => 'MainWP Child',
                'slug'     => 'mainwp-child',
                'required' => false,
            ],
            [
                'name'     => 'GDPR Cookie Consent (CCPA Ready)',
                'slug'     => 'cookie-law-info',
                'required' => true,
            ],
            [
                'name'     => 'Safe SVG',
                'slug'     => 'safe-svg',
                'required' => true,
            ],
            [
                'name'     => 'Redirection',
                'slug'     => 'redirection',
                'required' => false,
            ],
            [
                'name'     => 'Duplicator',
                'slug'     => 'duplicator',
                'required' => false,
            ],
            [
                'name'     => 'Antispam Bee',
                'slug'     => 'antispam-bee',
                'required' => false,
            ],
            [
                'name'     => 'Advanced Custom Fields',
                'slug'     => 'advanced-custom-fields',
                'required' => false,
            ],
            [
                'name'     => 'Custom Post Type UI',
                'slug'     => 'custom-post-type-ui',
                'required' => false,
            ],
            [
                'name'     => 'Back In Stock Notifier for WooCommerce | WooCommerce Waitlist Pro',
                'slug'     => 'back-in-stock-notifier-for-woocommerce',
                'required' => false,
            ],
            [
                'name'     => 'Mollie-betalingen voor WooCommerce',
                'slug'     => 'mollie-payments-for-woocommerce',
                'required' => false,
            ],
            [
                'name'     => 'Sequential Order Numbers for WooCommerce',
                'slug'     => 'wt-woocommerce-sequential-order-numbers',
                'required' => false,
            ],
            [
                'name'     => 'WooCommerce AJAX Products Filter',
                'slug'     => 'woocommerce-ajax-filters',
                'required' => false,
            ],
            [
                'name'     => 'WooCommerce PDF Invoices & Packing Slips',
                'slug'     => 'woocommerce-pdf-invoices-packing-slips',
                'required' => false,
            ],
        ];

        $config = [
            'id'           => 'madeit',                 // Unique ID for hashing notices for multiple instances of TGMPA.
            'default_path' => '',                      // Default absolute path to bundled plugins.
            'menu'         => 'tgmpa-install-plugins', // Menu slug.
            'has_notices'  => false,                    // Show admin notices or not.
            'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
            'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
            'is_automatic' => true,                   // Automatically activate plugins after installation or not.
            'message'      => '',                      // Message to output right before the plugins table.
        ];

        tgmpa($plugins, $config);
    }
    add_action('tgmpa_register', 'madeit_register_required_plugins');
}

if (!function_exists('madeit_add_image_popup_class')) {
    function madeit_add_image_popup_class($content)
    {
        $content = mb_encode_numericentity($content, array(0x80, 0xFFFF, 0, 0xFFFF), 'UTF-8');

        if (strlen($content) > 0) {
            $document = new DOMDocument();
            libxml_use_internal_errors(true);
            // Laad de HTML direct zonder extra encoding
            $document->loadHTML('<?xml encoding="utf-8" ?>' . $content);

            $imgs = $document->getElementsByTagName('img');
            foreach ($imgs as $img) {
                $existing_class = $img->getAttribute('class');
                if (strpos($existing_class, 'do-lightbox') !== false && strpos($existing_class, 'wp-block-cover__image-background') === false) {
                    $img->setAttribute('class', "lightbox $existing_class");
                }
            }
            $html = $document->saveHTML();

            // Verwijder onnodige tags
            $html = preg_replace('/(<!DOCTYPE.*>)|<html>|<body>|<\/body>|<\/html>/', '', $html);

            return $html;
        }
    }
    add_filter('the_content', 'madeit_add_image_popup_class');
}

/*
 * WooCommerce form fields.
 */
if (!function_exists('madeit_woocommerce_form_field_args')) {
    function madeit_woocommerce_form_field_args($args, $key, $value)
    {
        switch ($args['type']) {
            case 'select':  /* Targets all select input type elements, except the country and state select input types */
                $args['class'][] = 'form-group'; // Add a class to the field's html element wrapper - woocommerce input types (fields) are often wrapped within a <p></p> tag
                $args['input_class'] = ['form-control', 'input-lg']; // Add a class to the form input itself
                //$args['custom_attributes']['data-plugin'] = 'select2';
                $args['label_class'] = ['control-label'];
                $args['custom_attributes'] = ['data-plugin' => 'select2', 'data-allow-clear' => 'true', 'aria-hidden' => 'true']; // Add custom data attributes to the form input itself
            break;

            case 'country': /* By default WooCommerce will populate a select with the country names - $args defined for this specific input type targets only the country select element */
                $args['class'][] = 'form-group single-country';
                $args['label_class'] = ['control-label'];
            break;

            case 'state': /* By default WooCommerce will populate a select with state names - $args defined for this specific input type targets only the country select element */
                $args['class'][] = 'form-group'; // Add class to the field's html element wrapper
                $args['input_class'] = ['form-control', 'input-lg']; // add class to the form input itself
                //$args['custom_attributes']['data-plugin'] = 'select2';
                $args['label_class'] = ['control-label'];
                $args['custom_attributes'] = ['data-plugin' => 'select2', 'data-allow-clear' => 'true', 'aria-hidden' => 'true'];
            break;

            case 'password':
            case 'text':
            case 'email':
            case 'tel':
            case 'number':
                $args['class'][] = 'form-group';
                //$args['input_class'][] = 'form-control input-lg'; // will return an array of classes, the same as bellow
                $args['input_class'] = ['form-control', 'input-lg'];
                $args['label_class'] = ['control-label'];
            break;

            case 'textarea':
                $args['input_class'] = ['form-control', 'input-lg'];
                $args['label_class'] = ['control-label'];
            break;

            case 'checkbox':
            break;

            case 'radio':
            break;

            default:
                $args['class'][] = 'form-group';
                $args['input_class'] = ['form-control', 'input-lg'];
                $args['label_class'] = ['control-label'];
            break;
        }

        return $args;
    }
    if (!is_page('checkout')) {
        add_filter('woocommerce_form_field_args', 'madeit_woocommerce_form_field_args', 10, 3);
    } else {
        remove_filter('woocommerce_form_field_args', 'madeit_woocommerce_form_field_args', 10, 3);
    }
}

/*
 * Custom form field function
 */
if (!function_exists('madeit_woocommerce_form_field')) {
    function madeit_woocommerce_form_field($key, $args, $value = null)
    {
        $defaults = [
            'type'              => 'text',
            'label'             => '',
            'placeholder'       => '',
            'maxlength'         => false,
            'required'          => false,
            'class'             => [],
            'label_class'       => [],
            'input_class'       => [],
            'return'            => false,
            'options'           => [],
            'custom_attributes' => [],
            'validate'          => [],
            'default'           => '',
        ];

        $args = wp_parse_args($args, $defaults);

        if ((!empty($args['clear']))) {
            $after = '<div class="clear"></div>';
        } else {
            $after = '';
        }

        if ($args['required']) {
            $args['class'][] = 'validate-required';
            $required = ' <abbr class="required" title="'.esc_attr__('required', 'woocommerce').'">*</abbr>';
        } else {
            $required = '';
        }

        $args['maxlength'] = ($args['maxlength']) ? 'maxlength="'.absint($args['maxlength']).'"' : '';

        if (is_string($args['label_class'])) {
            $args['label_class'] = [$args['label_class']];
        }

        if (is_null($value)) {
            $value = $args['default'];
        }

        // Custom attribute handling
        $custom_attributes = [];

        if (!empty($args['custom_attributes']) && is_array($args['custom_attributes'])) {
            foreach ($args['custom_attributes'] as $attribute => $attribute_value) {
                $custom_attributes[] = esc_attr($attribute).'="'.esc_attr($attribute_value).'"';
            }
        }

        if (!empty($args['validate'])) {
            foreach ($args['validate'] as $validate) {
                $args['class'][] = 'validate-'.$validate;
            }
        }

        switch ($args['type']) {
        case 'country':

            $countries = $key == 'shipping_country' ? WC()->countries->get_shipping_countries() : WC()->countries->get_allowed_countries();

            if (count($countries) == 1) {
                $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">';

                if ($args['label']) {
                    $field .= '<label class="'.implode(' ', $args['label_class']).'">'.$args['label'].'</label>';
                }

                $field .= '<strong>'.current(array_values($countries)).'</strong>';

                $field .= '<input type="hidden" name="'.esc_attr($key).'" id="'.esc_attr($key).'" value="'.current(array_keys($countries)).'" '.implode(' ', $custom_attributes).' class="country_to_state" />';

                $field .= '</div>'.$after;
            } else {
                $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">'
                        .'<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>'
                        .'<select name="'.esc_attr($key).'" id="'.esc_attr($key).'" class="country_to_state form-control country_select" '.implode(' ', $custom_attributes).'>'
                        .'<option value="">'.__('Select a country&hellip;', 'woocommerce').'</option>';

                foreach ($countries as $ckey => $cvalue) {
                    $field .= '<option value="'.esc_attr($ckey).'" '.selected($value, $ckey, false).'>'.__($cvalue, 'woocommerce').'</option>';
                }

                $field .= '</select>';

                $field .= '<noscript><input type="submit" name="woocommerce_checkout_update_totals" value="'.__('Update country', 'woocommerce').'" /></noscript>';

                $field .= '</div>'.$after;
            }

            break;
        case 'state':

            /* Get Country */
            $country_key = $key == 'billing_state' ? 'billing_country' : 'shipping_country';

            if (isset($_POST[$country_key])) {
                $current_cc = wc_clean($_POST[$country_key]);
            } elseif (is_user_logged_in()) {
                $current_cc = get_user_meta(get_current_user_id(), $country_key, true);
                if (!$current_cc) {
                    $current_cc = apply_filters('default_checkout_country', (WC()->customer->get_billing_country()) ? WC()->customer->get_billing_country() : WC()->countries->get_base_country());
                }
            } elseif ($country_key == 'billing_country') {
                $current_cc = apply_filters('default_checkout_country', (WC()->customer->get_billing_country()) ? WC()->customer->get_billing_country() : WC()->countries->get_base_country());
            } else {
                $current_cc = apply_filters('default_checkout_country', (WC()->customer->get_shipping_country()) ? WC()->customer->get_shipping_country() : WC()->countries->get_base_country());
            }

            $states = WC()->countries->get_states($current_cc);

            if (is_array($states) && empty($states)) {
                $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field" style="display: none">';

                if ($args['label']) {
                    $field .= '<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>';
                }
                $field .= '<input type="hidden" class="hidden" name="'.esc_attr($key).'" id="'.esc_attr($key).'" value="" '.implode(' ', $custom_attributes).' placeholder="'.esc_attr($args['placeholder']).'" />';
                $field .= '</div>'.$after;
            } elseif (is_array($states)) {
                $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">';

                if ($args['label']) {
                    $field .= '<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>';
                }
                $field .= '<select name="'.esc_attr($key).'" id="'.esc_attr($key).'" class="state_select form-control " '.implode(' ', $custom_attributes).' placeholder="'.esc_attr($args['placeholder']).'">
                    <option value="">'.__('Select a state&hellip;', 'woocommerce').'</option>';

                foreach ($states as $ckey => $cvalue) {
                    $field .= '<option value="'.esc_attr($ckey).'" '.selected($value, $ckey, false).'>'.__($cvalue, 'woocommerce').'</option>';
                }

                $field .= '</select>';
                $field .= '</div>'.$after;
            } else {
                $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">';

                if ($args['label']) {
                    $field .= '<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>';
                }
                $field .= '<input type="text" class="form-control input-text '.implode(' ', $args['input_class']).'" value="'.esc_attr($value).'"  placeholder="'.esc_attr($args['placeholder']).'" name="'.esc_attr($key).'" id="'.esc_attr($key).'" '.implode(' ', $custom_attributes).' />';
                $field .= '</div>'.$after;
            }

            break;
        case 'textarea':

            $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">';

            if ($args['label']) {
                $field .= '<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>';
            }

            $field .= '<textarea name="'.esc_attr($key).'" class="form-control input-text '.implode(' ', $args['input_class']).'" id="'.esc_attr($key).'" placeholder="'.esc_attr($args['placeholder']).'"'.(empty($args['custom_attributes']['rows']) ? ' rows="2"' : '').(empty($args['custom_attributes']['cols']) ? ' cols="5"' : '').implode(' ', $custom_attributes).'>'.esc_textarea($value).'</textarea>
                </div>'.$after;

            break;
        case 'checkbox':

            $field = '<div class="checkbox form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">
                    <label for="'.esc_attr($key).'" class="checkbox '.implode(' ', $args['label_class']).'" '.implode(' ', $custom_attributes).'>
                        <input type="'.esc_attr($args['type']).'" class="input-checkbox" name="'.esc_attr($key).'" id="'.esc_attr($key).'" value="1" '.checked($value, 1, false).' />'
                        .$args['label'].$required.'</label>
                </div>'.$after;

            break;
        case 'password':

            $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">';

            if ($args['label']) {
                $field .= '<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>';
            }

            $field .= '<input type="password" class="form-control input-text '.implode(' ', $args['input_class']).'" name="'.esc_attr($key).'" id="'.esc_attr($key).'" placeholder="'.esc_attr($args['placeholder']).'" value="'.esc_attr($value).'" '.implode(' ', $custom_attributes).' />
                </div>'.$after;

            break;
        case 'text':
        case 'email':
        case 'tel':

            $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">';

            if ($args['label']) {
                $field .= '<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>';
            }

            $field .= '<input type="'.$args['type'].'" class="form-control input-text '.implode(' ', $args['input_class']).'" name="'.esc_attr($key).'" id="'.esc_attr($key).'" placeholder="'.esc_attr($args['placeholder']).'" '.$args['maxlength'].' value="'.esc_attr($value).'" '.implode(' ', $custom_attributes).' />
                </div>'.$after;

            break;
        case 'date':

                $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">';

                if ($args['label']) {
                    $field .= '<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>';
                }

                $field .= '<div class="input-group flex-nowrap date" data-provide="datepicker">';
                    $field .= '<input type="'.$args['type'].'" class="form-control input-text '.implode(' ', $args['input_class']).'" name="'.esc_attr($key).'" id="'.esc_attr($key).'" placeholder="'.esc_attr($args['placeholder']).'" '.$args['maxlength'].' value="'.esc_attr($value).'" '.implode(' ', $custom_attributes).' />';
                    if (MADEIT_ADD_DATEPICKER) {
                        $field .= '<div class="input-group-prepend">
                            <span class="input-group-text" id="addon-wrapping"><i class="fas fa-calendar"></i></span>
                        </div>';
                    }
                $field .= '</div>'.($args['after'] ?? '').'</div>'.$after;

                break;
        case 'select':

            $options = '';

            if (!empty($args['options'])) {
                foreach ($args['options'] as $option_key => $option_text) {
                    $options .= '<option value="'.esc_attr($option_key).'" '.selected($value, $option_key, false).'>'.esc_attr($option_text).'</option>';
                }
            }

                $field = '<div class="form-group form-row '.esc_attr(implode(' ', $args['class'])).'" id="'.esc_attr($key).'_field">';

                if ($args['label']) {
                    $field .= '<label for="'.esc_attr($key).'" class="'.implode(' ', $args['label_class']).'">'.$args['label'].$required.'</label>';
                }

                $field .= '<select name="'.esc_attr($key).'" id="'.esc_attr($key).'" class="select form-control" '.implode(' ', $custom_attributes).'>
                        '.$options.'
                    </select>
                </div>'.$after;

            break;
        default:
            $field = apply_filters('woocommerce_form_field_'.$args['type'], '', $key, $args, $value);

            break;
        }

        if ($args['return']) {
            return $field;
        } else {
            echo $field;
        }
    }
}

/*
 * Fix WooCommerce active class.
 */
if (!function_exists('madeit_woocommerce_account_menu_item_classes')) {
    function madeit_woocommerce_account_menu_item_classes($classes, $endpoint)
    {
        $classes = str_replace('is-active', 'active', $classes);

        return $classes;
    }
    add_filter('woocommerce_account_menu_item_classes', 'madeit_woocommerce_account_menu_item_classes', 10, 2);
}

/*
 * Add cart icon to menu.
 */
if (!function_exists('madeit_woocommerce_shopping_cart_in_menu')) {
    function madeit_woocommerce_shopping_cart_in_menu($menu, $args)
    {

        // Check if WooCommerce is active and add a new item to a menu assigned to Primary Navigation Menu location
        if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins'))) || 'top' !== $args->theme_location) {
            return $menu;
        }

        global $woocommerce;
        ob_start();
        $cart_contents_count = $woocommerce->cart->cart_contents_count;

        if (WOO_SHOPING_CART_MENU_STYLE == 1) {
            if ($cart_contents_count == 0) {
                ?>
                <li class="menu-item nav-item shopping-menu-item"><a class="wc-menu-cart nav-link" href="<?php echo get_permalink(wc_get_page_id('shop')); ?>" title="<?php echo  __('Start shopping', 'madeit'); ?>">
                <?php
            } else {
                ?>
                <li class="menu-item nav-item shopping-menu-item"><a class="wc-menu-cart nav-link" href="<?php echo wc_get_cart_url(); ?>" title="<?php __('View your shopping cart', 'madeit'); ?>">
                <?php
            } ?>
            <i class="fa fa-shopping-cart"></i>
            <?php echo sprintf(_n('%d item', '%d items', $cart_contents_count, 'madeit'), $cart_contents_count).' - '.$woocommerce->cart->get_cart_total(); ?>
            </a></li>
            <?php
        } elseif (WOO_SHOPING_CART_MENU_STYLE == 2) {
            if ($cart_contents_count == 0) {
                ?>
                <li class="menu-item nav-item shopping-menu-item"><a class="wc-menu-cart nav-link d-flex" href="<?php echo get_permalink(wc_get_page_id('shop')); ?>" title="<?php echo  __('Start shopping', 'madeit'); ?>">
                <?php
            } else {
                ?>
                <li class="menu-item nav-item shopping-menu-item"><a class="wc-menu-cart nav-link d-flex" href="<?php echo wc_get_cart_url(); ?>" title="<?php __('View your shopping cart', 'madeit'); ?>">
                <?php
            } ?>
                <span class="shopping-cart-count"><?php echo $cart_contents_count; ?></span>
                <svg xmlns="http://www.w3.org/2000/svg" style="display: block; height: 12px; align-self: center; margin-left: 5px;" viewBox="0 0 576 512"><path d="M175.1 416c-26.51 0-47.1 21.49-47.1 48S149.5 512 175.1 512s47.1-21.49 47.1-48S202.5 416 175.1 416zM463.1 416c-26.51 0-47.1 21.49-47.1 48s21.49 48 47.1 48s47.1-21.49 47.1-48S490.5 416 463.1 416zM569.5 44.73c-6.109-8.094-15.42-12.73-25.56-12.73H121.1L119.6 19.51C117.4 8.189 107.5 0 96 0H23.1C10.75 0 0 10.74 0 23.1C0 37.25 10.75 48 23.1 48h52.14l60.28 316.5C138.6 375.8 148.5 384 160 384H488c13.25 0 24-10.75 24-23.1C512 346.7 501.3 336 488 336H179.9L170.7 288h318.4c14.28 0 26.84-9.479 30.77-23.21l54.86-191.1C577.5 63.05 575.6 52.83 569.5 44.73zM477 240H161.6l-30.47-160h391.7L477 240z"/></svg>
            </a></li>
            <?php
        } elseif (WOO_SHOPING_CART_MENU_STYLE == 3 && $cart_contents_count > 0) {
            ?>
            <li class="menu-item nav-item shopping-menu-item">
                <a class="wc-menu-cart nav-link d-flex" href="<?php echo wc_get_cart_url(); ?>" title="<?php __('View your shopping cart', 'madeit'); ?>">
                    <span class="shopping-cart-count"><?php echo $cart_contents_count; ?></span>
                    <svg xmlns="http://www.w3.org/2000/svg" style="display: block; height: 12px; align-self: center; margin-left: 5px;" viewBox="0 0 576 512"><path d="M175.1 416c-26.51 0-47.1 21.49-47.1 48S149.5 512 175.1 512s47.1-21.49 47.1-48S202.5 416 175.1 416zM463.1 416c-26.51 0-47.1 21.49-47.1 48s21.49 48 47.1 48s47.1-21.49 47.1-48S490.5 416 463.1 416zM569.5 44.73c-6.109-8.094-15.42-12.73-25.56-12.73H121.1L119.6 19.51C117.4 8.189 107.5 0 96 0H23.1C10.75 0 0 10.74 0 23.1C0 37.25 10.75 48 23.1 48h52.14l60.28 316.5C138.6 375.8 148.5 384 160 384H488c13.25 0 24-10.75 24-23.1C512 346.7 501.3 336 488 336H179.9L170.7 288h318.4c14.28 0 26.84-9.479 30.77-23.21l54.86-191.1C577.5 63.05 575.6 52.83 569.5 44.73zM477 240H161.6l-30.47-160h391.7L477 240z"/></svg>
                </a>
            </li>
            <?php
        } elseif (WOO_SHOPING_CART_MENU_STYLE == 4) {
            if ($cart_contents_count == 0) {
                ?>
                <li class="menu-item nav-item shopping-menu-item"><a class="wc-menu-cart nav-link d-flex" href="<?php echo get_permalink(wc_get_page_id('shop')); ?>" title="<?php echo  __('Start shopping', 'madeit'); ?>">
                <?php
            } else {
                ?>
                <li class="menu-item nav-item shopping-menu-item"><a class="wc-menu-cart nav-link d-flex" href="<?php echo wc_get_cart_url(); ?>" title="<?php __('View your shopping cart', 'madeit'); ?>">
                <?php
            } ?>
                <span class="shopping-cart-count"><?php echo $cart_contents_count; ?></span>
                <svg xmlns="http://www.w3.org/2000/svg" style="display: block; height: 12px; align-self: center; margin-left: 5px;" viewBox="0 0 576 512"><path d="M552 192l-136.5-.0046l-56.65-175.4c-4.062-12.59-17.58-19.53-30.22-15.47c-12.61 4.078-19.53 17.59-15.47 30.22l51.81 160.6H211L262.8 31.38c4.062-12.62-2.859-26.14-15.47-30.22C234.8-2.885 221.2 4.036 217.2 16.63L160.5 191.1L24 192c-13.25 0-24 10.75-24 23.1c0 13.25 10.75 23.1 24 23.1h18.85l45.6 214.9C95.47 488 125.1 512 158.9 512h258.2c33.8 0 63.42-23.1 70.44-57.06l45.6-214.9H552c13.25 0 24-10.75 24-23.1C576 202.8 565.3 192 552 192zM440.6 444.1c-2.328 11.03-12.2 19.03-23.47 19.03H158.9c-11.27 0-21.14-7.1-23.47-19.03L91.94 240h53.16l-7.943 24.62C133.1 277.3 140 290.8 152.6 294.8C155.1 295.6 157.6 296 160 296c10.14 0 19.56-6.469 22.84-16.62l12.7-39.37h184.9l12.7 39.37C396.4 289.5 405.9 296 416 296c2.438 0 4.922-.375 7.375-1.156c12.61-4.078 19.53-17.59 15.47-30.22l-7.943-24.62h53.16L440.6 444.1zM224 319.1v87.1c0 8.844-7.156 15.1-16 15.1S192 416.8 192 407.1V319.1c0-8.844 7.156-15.1 16-15.1S224 311.2 224 319.1zM304 319.1v87.1c0 8.844-7.156 15.1-16 15.1s-16-7.156-16-15.1V319.1c0-8.844 7.156-15.1 16-15.1S304 311.2 304 319.1zM384 319.1v87.1c0 8.844-7.156 15.1-16 15.1S352 416.8 352 407.1V319.1c0-8.844 7.156-15.1 16-15.1S384 311.2 384 319.1z"/></svg>
            </a></li>
            <?php
        }
        $social = ob_get_clean();

        return $menu.$social;
    }
    add_filter('wp_nav_menu_items', 'madeit_woocommerce_shopping_cart_in_menu', 10, 2);
}

if (!function_exists('madeit_cookie_notice')) {
    function madeit_cookie_notice()
    {
        include_once ABSPATH.'wp-admin/includes/plugin.php';
        if (is_plugin_active('cookie-law-info/cookie-law-info.php')) {
            return;
        }
        $cookieUrl = '';
        if (function_exists('get_privacy_policy_url')) {
            $cookieUrl = get_privacy_policy_url();
        }

        if ($cookieUrl == '' || $cookieUrl == '#') {
            $cookieUrl = get_permalink(get_theme_mod('cookie_url'));
        }
        $text = sprintf(__('By using our website you are consenting to our use of cookies in accordance with our <a href="%s">cookie & privacy policy</a>.', 'madeit'), $cookieUrl);

        $text = apply_filters('madeit-cookie-notice', $text);

        $class = !is_customize_preview() ? 'd-none' : '';
        if (get_theme_mod('cookie_position') == 'top') {
            $class = 'fixed-top';
        } elseif (get_theme_mod('cookie_position') == 'bottom') {
            $class = 'fixed-bottom';
        }

        if (get_theme_mod('cookie_position') != 'none' && get_theme_mod('cookie_position') != 'popup') {
            ?>
            <div class="alert container alert-warning <?php echo $class; ?>" style="<?php if (!is_customize_preview()) {
                echo 'display: none';
            } ?>" id="cookie_directive_container">
                <div class="" id="cookie_accept">
                    <a href="#" class="btn btn-default pull-right"><?php _e('Close', 'madeit'); ?></a>
                    <p class="text-muted credit">
                        <?php echo $text; ?>
                    </p>
                </div>
            </div>
        <?php
        } elseif (get_theme_mod('cookie_position') == 'popup') {
            ?>
            <div class="modal fade <?php if (!is_customize_preview()) {
                echo 'show';
            } ?>" style="<?php if (!is_customize_preview()) {
                echo 'display: none';
            } ?>" id="cookie_directive_container">
                <div class="modal-dialog" role="document">
                    <div class="modal-content alert alert-warning">
                        <div class="modal-body">
                            <div class="" id="cookie_accept">
                                <a href="#" class="btn btn-default pull-right"><?php _e('Close', 'madeit'); ?></a>
                                <p class="text-muted credit">
                                    <?php echo $text; ?>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php
        }
    }
    add_action('wp_footer', 'madeit_cookie_notice');
}

if (!function_exists('madeit_extend_gutenberg')) {
    function madeit_extend_gutenberg()
    {
        wp_enqueue_script('madeit-guten-script', get_theme_file_uri('/assets/js/gutenberg.js'), ['wp-blocks']);
    }
    add_action('enqueue_block_editor_assets', 'madeit_extend_gutenberg');
}

if (false && !function_exists('madeit_extend_gutenberg_css')) {
    function madeit_extend_gutenberg_css()
    {
        wp_enqueue_style('madeit-guten-style', get_theme_file_uri('/assets/css/gutenfront.css'));
    }
    add_action('enqueue_block_assets', 'madeit_extend_gutenberg_css');
}

if (!function_exists('madeit_powered_by_text')) {
    function madeit_powered_by_text($data)
    {
        global $wp;
        $currentPage = str_replace(home_url(), '', home_url(add_query_arg([$_GET], $wp->request)));
        if ($currentPage == '/' || empty($currentPage)) {
            return 'Webdesign door Made I.T.';
        }

        return 'Website door Made I.T. Geel';
    }
    add_filter('madeit_powered_by_text', 'madeit_powered_by_text');
}

/* Cookie law default settings */
if (!function_exists('madeit_cookie_law_default_settings')) {
    function madeit_cookie_law_default_settings($settings)
    {
        $settings['background'] = '#FFF';
        $settings['border'] = '#b1a6a6c2';
        $settings['border_on'] = true;
        $settings['bar_style'] = [];
        $settings['button_1_text'] = __('Accept', 'madeit');
        $settings['button_1_link_colour'] = '#fff';
        $settings['button_1_button_colour'] = madeit_get_theme_color('success_color_rgb', MADEIT_SUCCESS_COLOR);
        $settings['button_2_text'] = __('Read More', 'madeit');
        $settings['button_2_url'] = get_site_url();
        $settings['button_2_link_colour'] = '#444';
        $settings['button_2_button_colour'] = '#333';
        $settings['button_3_text'] = __('Reject', 'madeit');
        $settings['button_3_link_colour'] = '#fff';
        $settings['button_3_button_colour'] = '#3566bb';
        $settings['button_4_text'] = __('Cookie settings', 'madeit');
        $settings['button_4_link_colour'] = '#333333';
        $settings['button_4_button_colour'] = '#000';
        $settings['notify_message'] = addslashes('<div class="cli-bar-container cli-style-v2"><div class="cli-bar-message">'.__('We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept”, you consent to the use of ALL the cookies.', 'madeit').'</div><div class="cli-bar-btn_container">[cookie_settings margin="0px 10px 0px 5px"][cookie_button]</div></div>');
        $settings['showagain_background'] = '#fff';
        $settings['showagain_border'] = '#000';
        $settings['showagain_text'] = addslashes(__('Privacy & Cookies Policy', 'madeit'));
        $settings['text'] = '#333333';
        $settings['showagain_tab'] = false;

        return apply_filters('madeit_cookie_law_default_settings', $settings);
    }
    add_filter('wt_cli_plugin_settings', 'madeit_cookie_law_default_settings');
}

if (!function_exists('madeit_wt_cli_enable_ckyes_branding')) {
    function madeit_wt_cli_enable_ckyes_branding($value)
    {
        return false;
    }
    add_filter('wt_cli_enable_ckyes_branding', 'madeit_wt_cli_enable_ckyes_branding', 99, 1);
}

/*

*/
if (!function_exists('madeit_add_mobile_menu_items_to_main_menu') && function_exists('get_field')) {
    function madeit_add_mobile_menu_items_to_main_menu($items, $menu, $args)
    {
        if (is_admin()) {
            return $items;
        }

        $theme_locations = get_nav_menu_locations();
        if ($menu->term_id === $theme_locations['top'] && isset($theme_locations['upper-bottom'])) {
            if (get_field('add_to_main_menu', 'menu_'.$theme_locations['upper-bottom'])) {
                $position = get_field('start_positie_op_mobiel', 'menu_'.$theme_locations['upper-bottom']);

                $newItems = [];
                $i = 1;
                foreach ($items as $j => $item) {
                    $item->menu_order = $i++;
                    $newItems[] = $item;

                    if ($j == $position) {
                        $extraItems = wp_get_nav_menu_items($theme_locations['upper-bottom']);
                        foreach ($extraItems as $extraItem) {
                            $extraItem->menu_order = $i++;
                            $extraItem->classes[] = 'd-md-none';
                            $newItems[] = $extraItem;
                        }
                    }
                }
                $items = $newItems;
                //$position;
            }
        }

        return $items;
    }

    add_filter('wp_get_nav_menu_items', 'madeit_add_mobile_menu_items_to_main_menu', 10, 3);

    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group([
            'key'    => 'group_60a6d8f6b4d3e',
            'title'  => 'Mobile menu',
            'fields' => [
                [
                    'key'               => 'field_60a6dae70f948',
                    'label'             => 'Toevoegen aan mobiel hoofd menu',
                    'name'              => 'add_to_main_menu',
                    'type'              => 'true_false',
                    'instructions'      => '',
                    'required'          => 0,
                    'conditional_logic' => 0,
                    'wrapper'           => [
                        'width' => '',
                        'class' => '',
                        'id'    => '',
                    ],
                    'message'       => '',
                    'default_value' => 0,
                    'ui'            => 0,
                    'ui_on_text'    => '',
                    'ui_off_text'   => '',
                ],
                [
                    'key'               => 'field_60a6db1d0f949',
                    'label'             => 'Start positie op mobiel',
                    'name'              => 'start_positie_op_mobiel',
                    'type'              => 'number',
                    'instructions'      => '',
                    'required'          => 0,
                    'conditional_logic' => [
                        [
                            [
                                'field'    => 'field_60a6dae70f948',
                                'operator' => '==',
                                'value'    => '1',
                            ],
                        ],
                    ],
                    'wrapper' => [
                        'width' => '',
                        'class' => '',
                        'id'    => '',
                    ],
                    'default_value' => '',
                    'placeholder'   => '',
                    'prepend'       => '',
                    'append'        => '',
                    'min'           => '',
                    'max'           => '',
                    'step'          => '',
                ],
            ],
            'location' => [
                [
                    [
                        'param'    => 'nav_menu',
                        'operator' => '==',
                        'value'    => 'location/upper-bottom',
                    ],
                ],
            ],
            'menu_order'            => 0,
            'position'              => 'normal',
            'style'                 => 'default',
            'label_placement'       => 'top',
            'instruction_placement' => 'label',
            'hide_on_screen'        => '',
            'active'                => true,
            'description'           => '',
        ]);
    }
}

/** Made I.T. Forms **/
if (!function_exists('theme_madeit_forms_module_class')) {
    function theme_madeit_forms_module_class($class, $type)
    {
        if (in_array($type, ['checkbox', 'radio', 'range'])) {
        } elseif ($type === 'submit') {
            if (strpos($class, 'btn-') === false) {
                $class .= ' btn-success';
            }
        } elseif ($type === 'select') {
            $class .= ' form-select';
        } elseif (strpos($class, 'form-control') === false) {
            $class .= ' form-control';
        }

        return $class;
    }
    add_filter('madeit_forms_module_class', 'theme_madeit_forms_module_class', 10, 2);
}

/*
Wp Rocket settings
*/
if (!function_exists('madeit_wprocket_pre_get_rocket_option_delay_js_exclusions')) {
    function madeit_wprocket_pre_get_rocket_option_delay_js_exclusions($optie, $default)
    {
        return ['aos.js'] + $default;
    }
    add_filter('pre_get_rocket_option_delay_js_exclusions', 'madeit_wprocket_pre_get_rocket_option_delay_js_exclusions', 10, 2);
}

if (!function_exists('madeit_user_analytics')) {
    function madeit_user_analytics()
    {
        if (defined('MADEIT_ANALYTICS_GA') && MADEIT_ANALYTICS_GA) {
            $tags = apply_filters('madeit_analtyics_ga', explode(',', MADEIT_ANALYTICS_GA)); ?>
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $tags[0]; ?>"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            <?php foreach ($tags as $tag) { ?>
            gtag('config', '<?php echo $tag; ?>');
            <?php } ?>
            </script>
            <?php
        }

        if (defined('MADEIT_ANALYTICS_TM')) {
            ?>
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','<?php echo MADEIT_ANALYTICS_TM; ?>');</script>
            <?php
        }

        if (defined('MADEIT_ANALYTICS_FB')) {
            ?>
            <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '<?php echo MADEIT_ANALYTICS_FB; ?>');
            fbq('track', 'PageView');
            </script>
            <?php
        }

        if(defined('MADEIT_ANALYTICS_LINKEDIN')) {
            ?>
            <script type="text/javascript">
            _linkedin_partner_id = "<?php echo MADEIT_ANALYTICS_LINKEDIN; ?>";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            </script><script type="text/javascript">
            (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
            </script>
            <?php
        }
        if(defined('MADEIT_ANALYTICS_TIKTOK')) {
            ?>
            <script>
            !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

            ttq.load('<?php echo MADEIT_ANALYTICS_TIKTOK; ?>');
            ttq.page();
            }(window, document, 'ttq');
            </script>
            <?php
        }
        ?>
        <script>
            (function() {
            var script = document.createElement('script');
                script.src = 'https://www.websitetool.be/script.js';
                script.async = true;
                document.head.appendChild(script);
            })();

            window.wtping = function () {
                (window.wtdataLayer = window.wtdataLayer || []).push(arguments);
            };
        </script>
        <?php
    }
    add_action('wp_head', 'madeit_user_analytics', 10);
}

/*
 * Display custom color CSS.
 */
if (!function_exists('madeit_rgb_colors_inline')) {
    function madeit_rgb_colors_inline()
    {
        wp_register_style('madeit-color-rgb', false);
        wp_enqueue_style('madeit-color-rgb');

        $css = "body {\n";

        foreach (get_theme_support('editor-color-palette')[0] as $color) {
            list($r, $g, $b) = sscanf($color['color'], '#%02x%02x%02x');

            $css .= '--wp--preset--color--'.$color['slug'].'-rgb: '.$r.','.$g.','.$b.";\n";
        }
        $css .= '}';
        wp_add_inline_style('madeit-color-rgb', $css);
    }
    add_action('wp_enqueue_scripts', 'madeit_rgb_colors_inline');
}

/**
 * CSS Cache mechanisme.
 */
require get_parent_theme_file_path('/inc/cache-theme-style.php');

/**
 * Implement the Custom Header feature.
 */
require get_parent_theme_file_path('/inc/custom-header.php');

/**
 * Custom template tags for this theme.
 */
require get_parent_theme_file_path('/inc/template-tags.php');

/**
 * Custom template widgets for this theme.
 */
require get_parent_theme_file_path('/inc/template-widgets.php');

/**
 * Additional features to allow styling of the templates.
 */
require get_parent_theme_file_path('/inc/template-functions.php');

/**
 * Customizer additions.
 */
require get_parent_theme_file_path('/inc/customizer.php');

/**
 * SVG icons functions and filters.
 */
require get_parent_theme_file_path('/inc/icon-functions.php');

/**
 * Bootstrap navigation menu.
 */
require get_parent_theme_file_path('/inc/bootstrap-navwalker.php');

/**
 * WP-Members.
 */
require get_parent_theme_file_path('/inc/wp-members.php');

/**
 * Gutenberg blocks.
 */
require get_parent_theme_file_path('/gutenberg/gutenberg.php');
require get_parent_theme_file_path('/gutenberg-v2/gutenberg.php');

/**
 * WooCommerce.
 */
$activePlugins = apply_filters('active_plugins', get_option('active_plugins'));
if (in_array('woocommerce/woocommerce.php', $activePlugins)) {
    require get_parent_theme_file_path('/inc/woocommerce.php');

    if(defined('MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX') && MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX) {
        require get_parent_theme_file_path('/inc/add-to-cart-ajax.php');
    }
}

if (in_array('woocommerce/woocommerce.php', $activePlugins) && in_array('sfwd-lms/sfwd_lms.php', $activePlugins)) {
    require get_parent_theme_file_path('/inc/sfwd-lms.php');
}

/**
 * Admin Menu Editor.
 */
require get_parent_theme_file_path('/inc/admin-menu-editor.php');

/**
 * Made I.T. Support.
 */
require get_parent_theme_file_path('/inc/madeit-support.php');

/**
 * Generate Theme Json file.
 */
require get_parent_theme_file_path('/inc/generate-theme-json.php');

/**
 * MADE I.T Reviews.
 */
if (defined('MADEIT_REVIEWS') && MADEIT_REVIEWS && class_exists('ACF')) {
    require get_parent_theme_file_path('/inc/reviews.php');
}

if (defined('MADEIT_POPUPS') && MADEIT_POPUPS && class_exists('ACF')) {
    require get_parent_theme_file_path('/inc/popup.php');
}

if (defined('MADEIT_RECEIVE_REVIEWS') && MADEIT_RECEIVE_REVIEWS && defined('MADEIT_REVIEWS') && MADEIT_REVIEWS && class_exists('ACF')) {
    require get_parent_theme_file_path('/inc/review-form.php');
}

require get_parent_theme_file_path('/inc/call.php');

require get_parent_theme_file_path('/inc/lock-content.php');

if (in_array('woocommerce/woocommerce.php', $activePlugins)) {
    require get_parent_theme_file_path('/inc/email-service.php');

    if(defined('MADEIT_SHOPPING_MANAGER') && MADEIT_SHOPPING_MANAGER !== false) {
        require get_parent_theme_file_path('/inc/shopping-manager.php');
    }

    if(defined('MADEIT_WOO_B2B') && MADEIT_WOO_B2B) {
        require get_parent_theme_file_path('/inc/woo-b2b.php');
    }
}
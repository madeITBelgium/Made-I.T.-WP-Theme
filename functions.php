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
if (version_compare($GLOBALS['wp_version'], '4.7-alpha', '<')) {
    require get_template_directory().'/inc/back-compat.php';

    return;
}

function madeit_setup()
{
    load_theme_textdomain('madeit');
    add_theme_support('automatic-feed-links');
    add_theme_support('title-tag');

    add_theme_support('post-thumbnails');

    add_image_size('madeit-featured-image', 2000, 1200, true);

    add_image_size('madeit-thumbnail-avatar', 100, 100, true);

    $GLOBALS['content_width'] = 525;

    register_nav_menus([
        'top'    => __('Top Menu', 'madeit'),
        'social' => __('Social Links Menu', 'madeit'),
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
        'width'       => 200,
        'height'      => 40,
        'flex-width'  => true,
    ]);

    // Add theme support for selective refresh for widgets.
    add_theme_support('customize-selective-refresh-widgets');

    /*
     * This theme styles the visual editor to resemble the theme style,
     * specifically font, colors, and column width.
     */
    add_editor_style(['assets/css/editor-style.css', madeit_fonts_url()]);

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
                'thumbnail' => '{{image-sandwich}}',
            ],
            'contact' => [
                'thumbnail' => '{{image-espresso}}',
            ],
            'blog' => [
                'thumbnail' => '{{image-coffee}}',
            ],
            'homepage-section' => [
                'thumbnail' => '{{image-espresso}}',
            ],
        ],

        // Create the custom image attachments used as post thumbnails for pages.
        'attachments' => [
            'image-espresso' => [
                'post_title' => _x('Espresso', 'Theme starter content', 'madeit'),
                'file'       => 'assets/images/espresso.jpg', // URL relative to the template directory.
            ],
            'image-sandwich' => [
                'post_title' => _x('Sandwich', 'Theme starter content', 'madeit'),
                'file'       => 'assets/images/sandwich.jpg',
            ],
            'image-coffee' => [
                'post_title' => _x('Coffee', 'Theme starter content', 'madeit'),
                'file'       => 'assets/images/coffee.jpg',
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
            'panel_1' => '{{homepage-section}}',
            'panel_2' => '{{about}}',
            'panel_3' => '{{blog}}',
            'panel_4' => '{{contact}}',
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
}
add_action('after_setup_theme', 'madeit_setup');

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function madeit_content_width()
{
    $content_width = $GLOBALS['content_width'];

    // Get layout.
    $page_layout = get_theme_mod('page_layout');

    // Check if layout is one column.
    if ('one-column' === $page_layout) {
        if (madeit_is_frontpage()) {
            $content_width = 644;
        } elseif (is_page()) {
            $content_width = 740;
        }
    }

    // Check if is single post and there is no sidebar.
    if (is_single() && !is_active_sidebar('sidebar-1')) {
        $content_width = 740;
    }

    $GLOBALS['content_width'] = apply_filters('madeit_content_width', $content_width);
}
add_action('template_redirect', 'madeit_content_width', 0);

/**
 * Register custom fonts.
 */
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

/**
 * Add preconnect for Google Fonts.
 *
 * @since Made I.T. 1.0
 *
 * @param array  $urls          URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed.
 *
 * @return array $urls           URLs to print for resource hints.
 */
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

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function madeit_widgets_init()
{
    register_sidebar([
        'name'          => __('Blog Sidebar', 'madeit'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here to appear in your sidebar on blog posts and archive pages.', 'madeit'),
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
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ]);

    register_sidebar([
        'name'          => __('Footer 2', 'madeit'),
        'id'            => 'sidebar-3',
        'description'   => __('Add widgets here to appear in your footer.', 'madeit'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ]);
}
add_action('widgets_init', 'madeit_widgets_init');

/**
 * Replaces "[...]" (appended to automatically generated excerpts) with ... and
 * a 'Continue reading' link.
 *
 * @since Made I.T. 1.0
 *
 * @param string $link Link to single post/page.
 *
 * @return string 'Continue reading' link prepended with an ellipsis.
 */
function madeit_excerpt_more($link)
{
    if (is_admin()) {
        return $link;
    }

    $link = sprintf('<p class="link-more"><a href="%1$s" class="more-link">%2$s</a></p>',
        esc_url(get_permalink(get_the_ID())),
        /* translators: %s: Name of current post */
        sprintf(__('Continue reading<span class="screen-reader-text"> "%s"</span>', 'madeit'), get_the_title(get_the_ID()))
    );

    return ' &hellip; '.$link;
}
add_filter('excerpt_more', 'madeit_excerpt_more');

/**
 * Handles JavaScript detection.
 *
 * Adds a `js` class to the root `<html>` element when JavaScript is detected.
 *
 * @since Made I.T. 1.0
 */
function madeit_javascript_detection()
{
    echo "<script>(function(html){html.className = html.className.replace(/\bno-js\b/,'js')})(document.documentElement);</script>\n";
}
add_action('wp_head', 'madeit_javascript_detection', 0);

/**
 * Add a pingback url auto-discovery header for singularly identifiable articles.
 */
function madeit_pingback_header()
{
    if (is_singular() && pings_open()) {
        printf('<link rel="pingback" href="%s">'."\n", get_bloginfo('pingback_url'));
    }
}
add_action('wp_head', 'madeit_pingback_header');

/**
 * Display custom color CSS.
 */
function madeit_colors_css_wrap()
{
    if ('custom' !== get_theme_mod('colorscheme') && !is_customize_preview()) {
        return;
    }

    require_once get_parent_theme_file_path('/inc/color-patterns.php');
    $hue = absint(get_theme_mod('colorscheme_hue', 250)); ?>
	<style type="text/css" id="custom-theme-colors" <?php if (is_customize_preview()) {
        echo 'data-hue="'.$hue.'"';
    } ?>>
		<?php echo madeit_custom_colors_css(); ?>
	</style>
<?php
}
add_action('wp_head', 'madeit_colors_css_wrap');

/**
 * Enqueue scripts and styles.
 */
function madeit_scripts()
{
    // Add custom fonts, used in the main stylesheet.
    wp_enqueue_style('madeit-fonts', madeit_fonts_url(), [], null);

    // Theme stylesheet.
    wp_enqueue_style('madeit-style', get_stylesheet_uri());

    wp_enqueue_style('font-awesome', get_theme_file_uri('/assets/css/font-awesome.min.css'), ['madeit-style'], '4.7.0');

    // Load the dark colorscheme.
    if ('dark' === get_theme_mod('colorscheme', 'light') || is_customize_preview()) {
        wp_enqueue_style('madeit-colors-dark', get_theme_file_uri('/assets/css/colors-dark.css'), ['madeit-style'], '1.0');
    }

    // Load the Internet Explorer 9 specific stylesheet, to fix display issues in the Customizer.
    if (is_customize_preview()) {
        wp_enqueue_style('madeit-ie9', get_theme_file_uri('/assets/css/ie9.css'), ['madeit-style'], '1.0');
        wp_style_add_data('madeit-ie9', 'conditional', 'IE 9');
    }

    // Load the Internet Explorer 8 specific stylesheet.
    wp_enqueue_style('madeit-ie8', get_theme_file_uri('/assets/css/ie8.css'), ['madeit-style'], '1.0');
    wp_style_add_data('madeit-ie8', 'conditional', 'lt IE 9');

    // Load the html5 shiv.
    wp_enqueue_script('html5', get_theme_file_uri('/assets/js/html5.js'), [], '3.7.3');
    wp_script_add_data('html5', 'conditional', 'lt IE 9');

    wp_enqueue_script('madeit-skip-link-focus-fix', get_theme_file_uri('/assets/js/skip-link-focus-fix.js'), [], '1.0', true);

    $madeit_l10n = [
        'quote'          => madeit_get_svg(['icon' => 'quote-right']),
    ];

    //TODO Delete
    if (has_nav_menu('top')) {
        wp_enqueue_script('madeit-navigation', get_theme_file_uri('/assets/js/navigation.js'), ['jquery'], '1.0', true);
        $madeit_l10n['expand'] = __('Expand child menu', 'madeit');
        $madeit_l10n['collapse'] = __('Collapse child menu', 'madeit');
        $madeit_l10n['icon'] = madeit_get_svg(['icon' => 'angle-down', 'fallback' => true]);
    }

    wp_enqueue_script('popper', get_theme_file_uri('/assets/js/popper.min.js'), ['jquery'], '1.0.0', true);
    wp_enqueue_script('bootstrap', get_theme_file_uri('/assets/js/bootstrap.js'), ['jquery', 'popper'], '4.0.0', true);

    wp_enqueue_script('madeit-global', get_theme_file_uri('/assets/js/global.js'), ['jquery'], '1.0', true);

    wp_enqueue_script('jquery-scrollto', get_theme_file_uri('/assets/js/jquery.scrollTo.js'), ['jquery'], '2.1.2', true);

    wp_localize_script('madeit-skip-link-focus-fix', 'madeitScreenReaderText', $madeit_l10n);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'madeit_scripts');

/**
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

/**
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
function madeit_header_image_tag($html, $header, $attr)
{
    if (isset($attr['sizes'])) {
        $html = str_replace($attr['sizes'], '100vw', $html);
    }

    return $html;
}
add_filter('get_header_image_tag', 'madeit_header_image_tag', 10, 3);

/**
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

/**
 * Use front-page.php when Front page displays is set to a static page.
 *
 * @since Made I.T. 1.0
 *
 * @param string $template front-page.php.
 *
 * @return string The template to be used: blank if is_home() is true (defaults to index.php), else $template.
 */
function madeit_front_page_template($template)
{
    return is_home() ? '' : $template;
}
add_filter('frontpage_template', 'madeit_front_page_template');

/**
 * Modifies tag cloud widget arguments to display all tags in the same font size
 * and use list format for better accessibility.
 *
 * @since Made I.T. 1.0
 *
 * @param array $args Arguments for tag cloud widget.
 *
 * @return array The filtered arguments for tag cloud widget.
 */
function madeit_widget_tag_cloud_args($args)
{
    $args['largest'] = 1;
    $args['smallest'] = 1;
    $args['unit'] = 'em';
    $args['format'] = 'list';

    return $args;
}
add_filter('widget_tag_cloud_args', 'madeit_widget_tag_cloud_args');

/*
 * Fix bootstrap menu when admin bar is enabled
 */
function madeit_wp_bootstrap_head()
{
    if (is_admin_bar_showing()) {
        ?>
		<style>
		body{ padding-top: 52px !important; }
		body.logged-in .navbar.fixed-top{ top: 46px !important; }
		@media only screen and (min-width: 783px) {
			body{ padding-top: 52px !important; }
			body.logged-in .navbar.fixed-top{ top: 28px !important; }
		}
		</style>
		<?php
    }
}
add_action('wp_head', 'madeit_wp_bootstrap_head');

/**
 * Implement the Custom Header feature.
 */
require get_parent_theme_file_path('/inc/custom-header.php');

/**
 * Custom template tags for this theme.
 */
require get_parent_theme_file_path('/inc/template-tags.php');

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

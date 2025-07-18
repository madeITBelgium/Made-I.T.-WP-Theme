# Ontwikkeling en Extensies

Deze sectie beschrijft hoe het Made I.T. thema kan worden uitgebreid en aangepast voor ontwikkelaars.

## Child Theme Ontwikkeling

### Basis Child Theme Setup
```php
<?php
// child-theme/style.css
/*
Theme Name: Made I.T. Child
Description: Child theme van Made I.T.
Template: madeit
Version: 1.0.0
*/

@import url("../madeit/style.css");

/* Custom styles hier */
```

```php
<?php
// child-theme/functions.php
<?php

// Laad parent theme styles
function child_theme_enqueue_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style', 
        get_stylesheet_directory_uri() . '/style.css',
        ['parent-style'], 
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'child_theme_enqueue_styles');

// Theme configuratie
define('MADEIT_BOOTSTRAP_VERSION', 5);
define('MADEIT_CUSTOM_COLOR', true);
define('MADEIT_PRIMARY_COLOR', '#FF6B35');
```

### Advanced Child Theme Features
```php
// Custom post types
function child_theme_register_post_types() {
    register_post_type('portfolio', [
        'label'               => __('Portfolio', 'child-theme'),
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'query_var'           => true,
        'rewrite'             => ['slug' => 'portfolio'],
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 20,
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt'],
        'show_in_rest'        => true,
    ]);
}
add_action('init', 'child_theme_register_post_types');

// Custom taxonomies
function child_theme_register_taxonomies() {
    register_taxonomy('portfolio_category', 'portfolio', [
        'hierarchical'      => true,
        'labels'            => [
            'name'          => __('Portfolio Categories', 'child-theme'),
            'singular_name' => __('Portfolio Category', 'child-theme'),
        ],
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => ['slug' => 'portfolio-category'],
        'show_in_rest'      => true,
    ]);
}
add_action('init', 'child_theme_register_taxonomies');
```

## Custom Template Development

### Template Hierarchy
```php
// child-theme/template-hierarchy.php
// Custom template loader
function child_theme_template_include($template) {
    if (is_post_type_archive('portfolio')) {
        $new_template = locate_template(['archive-portfolio.php']);
        if ($new_template) {
            return $new_template;
        }
    }
    
    if (is_singular('portfolio')) {
        $new_template = locate_template(['single-portfolio.php']);
        if ($new_template) {
            return $new_template;
        }
    }
    
    return $template;
}
add_filter('template_include', 'child_theme_template_include');
```

### Custom Page Templates
```php
<?php
// child-theme/page-templates/landing-page.php
/*
Template Name: Landing Page
*/

get_header('landing'); ?>

<div class="landing-page">
    <section class="hero-section bg-primary text-white py-5">
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">
                        <?php echo get_field('hero_title') ?: get_the_title(); ?>
                    </h1>
                    <p class="lead mb-4">
                        <?php echo get_field('hero_subtitle'); ?>
                    </p>
                    <a href="<?php echo get_field('hero_cta_url'); ?>" class="btn btn-light btn-lg">
                        <?php echo get_field('hero_cta_text') ?: __('Get Started', 'child-theme'); ?>
                    </a>
                </div>
                <div class="col-lg-6">
                    <?php if ($hero_image = get_field('hero_image')): ?>
                        <img src="<?php echo $hero_image['url']; ?>" 
                             alt="<?php echo $hero_image['alt']; ?>" 
                             class="img-fluid">
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
    
    <?php if (have_posts()): while (have_posts()): the_post(); ?>
        <section class="content-section py-5">
            <div class="container">
                <?php the_content(); ?>
            </div>
        </section>
    <?php endwhile; endif; ?>
</div>

<?php get_footer('landing'); ?>
```

## Custom Gutenberg Blocks

### Block Registration
```php
// child-theme/blocks/testimonial/testimonial.php
function child_theme_register_blocks() {
    if (function_exists('acf_register_block_type')) {
        acf_register_block_type([
            'name'              => 'testimonial',
            'title'             => __('Testimonial', 'child-theme'),
            'description'       => __('A custom testimonial block.', 'child-theme'),
            'render_template'   => get_stylesheet_directory() . '/blocks/testimonial/testimonial.php',
            'category'          => 'formatting',
            'icon'              => 'admin-comments',
            'keywords'          => ['testimonial', 'quote', 'review'],
            'supports'          => [
                'align' => ['wide', 'full'],
                'mode'  => false,
            ],
        ]);
    }
}
add_action('acf/init', 'child_theme_register_blocks');
```

### Block Template
```php
<?php
// child-theme/blocks/testimonial/testimonial.php
$testimonial_text = get_field('testimonial_text');
$author_name = get_field('author_name');
$author_position = get_field('author_position');
$author_photo = get_field('author_photo');
$background_color = get_field('background_color') ?: 'light';

$classes = ['testimonial-block', 'py-5'];
if ($background_color !== 'transparent') {
    $classes[] = 'bg-' . $background_color;
}
?>

<div class="<?php echo implode(' ', $classes); ?>">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
                <?php if ($testimonial_text): ?>
                    <blockquote class="blockquote">
                        <p class="mb-4 fs-4">
                            <i class="fas fa-quote-left text-primary me-2"></i>
                            <?php echo $testimonial_text; ?>
                            <i class="fas fa-quote-right text-primary ms-2"></i>
                        </p>
                    </blockquote>
                <?php endif; ?>
                
                <div class="testimonial-author d-flex align-items-center justify-content-center">
                    <?php if ($author_photo): ?>
                        <img src="<?php echo $author_photo['sizes']['thumbnail']; ?>" 
                             alt="<?php echo $author_name; ?>"
                             class="rounded-circle me-3"
                             width="60" height="60">
                    <?php endif; ?>
                    
                    <div class="author-info text-start">
                        <?php if ($author_name): ?>
                            <h6 class="mb-0 fw-bold"><?php echo $author_name; ?></h6>
                        <?php endif; ?>
                        <?php if ($author_position): ?>
                            <small class="text-muted"><?php echo $author_position; ?></small>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

## Custom Shortcodes

### Basis Shortcode Development
```php
// Button shortcode
function child_theme_button_shortcode($atts, $content = null) {
    $atts = shortcode_atts([
        'type'   => 'primary',
        'size'   => 'medium',
        'url'    => '#',
        'target' => '_self',
        'class'  => '',
    ], $atts);
    
    $classes = ['btn', 'btn-' . $atts['type']];
    
    if ($atts['size'] !== 'medium') {
        $classes[] = 'btn-' . $atts['size'];
    }
    
    if ($atts['class']) {
        $classes[] = $atts['class'];
    }
    
    return sprintf(
        '<a href="%s" target="%s" class="%s">%s</a>',
        esc_url($atts['url']),
        esc_attr($atts['target']),
        esc_attr(implode(' ', $classes)),
        do_shortcode($content)
    );
}
add_shortcode('madeit_button', 'child_theme_button_shortcode');

// Grid shortcode
function child_theme_grid_shortcode($atts, $content = null) {
    $atts = shortcode_atts([
        'columns' => '3',
        'gap'     => '4',
        'class'   => '',
    ], $atts);
    
    $classes = ['row'];
    if ($atts['gap']) {
        $classes[] = 'g-' . $atts['gap'];
    }
    if ($atts['class']) {
        $classes[] = $atts['class'];
    }
    
    // Process nested column shortcodes
    $content = do_shortcode($content);
    
    return sprintf(
        '<div class="%s" data-columns="%s">%s</div>',
        esc_attr(implode(' ', $classes)),
        esc_attr($atts['columns']),
        $content
    );
}
add_shortcode('madeit_grid', 'child_theme_grid_shortcode');

function child_theme_column_shortcode($atts, $content = null) {
    $atts = shortcode_atts([
        'width' => 'auto',
        'class' => '',
    ], $atts);
    
    // Get parent grid columns
    global $madeit_grid_columns;
    $columns = $madeit_grid_columns ?: 3;
    
    $classes = ['col'];
    if ($atts['width'] === 'auto') {
        $classes[] = 'col-md-' . (12 / $columns);
    } else {
        $classes[] = 'col-md-' . $atts['width'];
    }
    
    if ($atts['class']) {
        $classes[] = $atts['class'];
    }
    
    return sprintf(
        '<div class="%s">%s</div>',
        esc_attr(implode(' ', $classes)),
        do_shortcode($content)
    );
}
add_shortcode('madeit_column', 'child_theme_column_shortcode');
```

### Advanced Shortcodes
```php
// Gallery shortcode met Lightbox
function child_theme_gallery_shortcode($atts) {
    $atts = shortcode_atts([
        'ids'     => '',
        'columns' => '3',
        'size'    => 'medium',
        'lightbox' => 'true',
    ], $atts);
    
    if (empty($atts['ids'])) {
        return '';
    }
    
    $ids = explode(',', $atts['ids']);
    $output = '<div class="madeit-gallery row g-3">';
    
    foreach ($ids as $id) {
        $image = wp_get_attachment_image_src($id, $atts['size']);
        $full_image = wp_get_attachment_image_src($id, 'full');
        $alt = get_post_meta($id, '_wp_attachment_image_alt', true);
        
        $col_class = 'col-md-' . (12 / intval($atts['columns']));
        
        $output .= '<div class="' . $col_class . '">';
        
        if ($atts['lightbox'] === 'true') {
            $output .= '<a href="' . $full_image[0] . '" class="lightbox d-block">';
        }
        
        $output .= '<img src="' . $image[0] . '" alt="' . $alt . '" class="img-fluid rounded">';
        
        if ($atts['lightbox'] === 'true') {
            $output .= '</a>';
        }
        
        $output .= '</div>';
    }
    
    $output .= '</div>';
    
    return $output;
}
add_shortcode('madeit_gallery', 'child_theme_gallery_shortcode');
```

## Custom Widgets

### Widget Class Development
```php
class Child_Theme_Social_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct(
            'child_theme_social',
            __('Social Media Links', 'child-theme'),
            ['description' => __('Display social media links', 'child-theme')]
        );
    }
    
    public function widget($args, $instance) {
        $title = apply_filters('widget_title', $instance['title']);
        
        echo $args['before_widget'];
        
        if (!empty($title)) {
            echo $args['before_title'] . $title . $args['after_title'];
        }
        
        echo '<div class="social-links">';
        
        $social_networks = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
        
        foreach ($social_networks as $network) {
            if (!empty($instance[$network])) {
                printf(
                    '<a href="%s" target="_blank" rel="noopener" class="social-link social-link-%s">
                        <i class="fab fa-%s"></i>
                        <span class="sr-only">%s</span>
                    </a>',
                    esc_url($instance[$network]),
                    esc_attr($network),
                    esc_attr($network),
                    esc_html(ucfirst($network))
                );
            }
        }
        
        echo '</div>';
        echo $args['after_widget'];
    }
    
    public function form($instance) {
        $title = isset($instance['title']) ? $instance['title'] : '';
        $social_networks = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">
                <?php _e('Title:', 'child-theme'); ?>
            </label>
            <input class="widefat" 
                   id="<?php echo $this->get_field_id('title'); ?>" 
                   name="<?php echo $this->get_field_name('title'); ?>" 
                   type="text" 
                   value="<?php echo esc_attr($title); ?>">
        </p>
        
        <?php foreach ($social_networks as $network): ?>
            <p>
                <label for="<?php echo $this->get_field_id($network); ?>">
                    <?php printf(__('%s URL:', 'child-theme'), ucfirst($network)); ?>
                </label>
                <input class="widefat" 
                       id="<?php echo $this->get_field_id($network); ?>" 
                       name="<?php echo $this->get_field_name($network); ?>" 
                       type="url" 
                       value="<?php echo esc_attr(isset($instance[$network]) ? $instance[$network] : ''); ?>">
            </p>
        <?php endforeach; ?>
        <?php
    }
    
    public function update($new_instance, $old_instance) {
        $instance = [];
        $instance['title'] = !empty($new_instance['title']) ? sanitize_text_field($new_instance['title']) : '';
        
        $social_networks = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];
        foreach ($social_networks as $network) {
            $instance[$network] = !empty($new_instance[$network]) ? esc_url_raw($new_instance[$network]) : '';
        }
        
        return $instance;
    }
}

// Register widget
function child_theme_register_widgets() {
    register_widget('Child_Theme_Social_Widget');
}
add_action('widgets_init', 'child_theme_register_widgets');
```

## AJAX Functionaliteit

### AJAX Handler Setup
```php
// AJAX load more posts
function child_theme_load_more_posts() {
    check_ajax_referer('load_more_posts', 'nonce');
    
    $page = intval($_POST['page']);
    $posts_per_page = intval($_POST['posts_per_page']) ?: 6;
    
    $query = new WP_Query([
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => $posts_per_page,
        'paged'          => $page,
    ]);
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            get_template_part('template-parts/content', 'card');
        }
    }
    
    wp_reset_postdata();
    wp_die();
}
add_action('wp_ajax_load_more_posts', 'child_theme_load_more_posts');
add_action('wp_ajax_nopriv_load_more_posts', 'child_theme_load_more_posts');

// Enqueue AJAX script
function child_theme_ajax_scripts() {
    wp_enqueue_script('child-theme-ajax', 
        get_stylesheet_directory_uri() . '/js/ajax.js', 
        ['jquery'], 
        '1.0.0', 
        true);
    
    wp_localize_script('child-theme-ajax', 'ajax_object', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('load_more_posts'),
    ]);
}
add_action('wp_enqueue_scripts', 'child_theme_ajax_scripts');
```

### JavaScript AJAX Implementation
```javascript
// child-theme/js/ajax.js
(function($) {
    'use strict';
    
    let page = 2;
    let loading = false;
    
    $('.load-more-btn').on('click', function(e) {
        e.preventDefault();
        
        if (loading) return;
        
        loading = true;
        $(this).text('Loading...').prop('disabled', true);
        
        $.ajax({
            url: ajax_object.ajax_url,
            type: 'POST',
            data: {
                action: 'load_more_posts',
                page: page,
                posts_per_page: 6,
                nonce: ajax_object.nonce
            },
            success: function(response) {
                if (response.trim() !== '') {
                    $('.posts-grid').append(response);
                    page++;
                } else {
                    $('.load-more-btn').hide();
                }
            },
            error: function() {
                console.error('AJAX error occurred');
            },
            complete: function() {
                loading = false;
                $('.load-more-btn').text('Load More').prop('disabled', false);
            }
        });
    });
    
    // Infinite scroll variant
    $(window).scroll(function() {
        if (loading) return;
        
        let scrollPosition = $(window).scrollTop() + $(window).height();
        let documentHeight = $(document).height();
        
        if (scrollPosition >= documentHeight - 100) {
            $('.load-more-btn').trigger('click');
        }
    });
    
})(jQuery);
```

## Performance Optimizations

### Custom Caching
```php
// Custom query caching
function child_theme_get_cached_posts($query_args, $cache_key, $expiration = 3600) {
    $cached_posts = get_transient($cache_key);
    
    if (false === $cached_posts) {
        $query = new WP_Query($query_args);
        $cached_posts = $query->posts;
        set_transient($cache_key, $cached_posts, $expiration);
    }
    
    return $cached_posts;
}

// Clear cache on post update
function child_theme_clear_post_cache($post_id) {
    delete_transient('recent_posts_cache');
    delete_transient('featured_posts_cache');
    delete_transient('popular_posts_cache');
}
add_action('save_post', 'child_theme_clear_post_cache');
add_action('delete_post', 'child_theme_clear_post_cache');
```

### Image Optimization
```php
// Custom image sizes
function child_theme_custom_image_sizes() {
    add_image_size('hero-image', 1920, 1080, true);
    add_image_size('card-image', 400, 300, true);
    add_image_size('gallery-thumb', 300, 300, true);
}
add_action('after_setup_theme', 'child_theme_custom_image_sizes');

// Lazy loading for custom images
function child_theme_lazy_load_images($content) {
    if (is_admin() || is_feed()) {
        return $content;
    }
    
    $content = preg_replace(
        '/<img([^>]+?)src=/i',
        '<img$1loading="lazy" src=',
        $content
    );
    
    return $content;
}
add_filter('the_content', 'child_theme_lazy_load_images');
```

## Security Enhancements

### Custom Security Functions
```php
// Rate limiting voor AJAX requests
function child_theme_rate_limit_ajax() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = 'ajax_rate_limit_' . md5($ip);
    $count = get_transient($key);
    
    if (false === $count) {
        set_transient($key, 1, 60); // 1 minute window
    } else {
        if ($count >= 60) { // Max 60 requests per minute
            wp_die('Rate limit exceeded', 'Rate Limit', ['response' => 429]);
        }
        set_transient($key, $count + 1, 60);
    }
}

// Apply to AJAX actions
add_action('wp_ajax_load_more_posts', 'child_theme_rate_limit_ajax', 1);
add_action('wp_ajax_nopriv_load_more_posts', 'child_theme_rate_limit_ajax', 1);
```

### Input Sanitization
```php
// Custom sanitization functions
function child_theme_sanitize_html($input) {
    return wp_kses($input, [
        'p'      => [],
        'br'     => [],
        'strong' => [],
        'em'     => [],
        'a'      => ['href' => [], 'title' => []],
    ]);
}

function child_theme_sanitize_css_class($class) {
    return preg_replace('/[^a-zA-Z0-9\-_\s]/', '', $class);
}
```

## API Development

### Custom REST API Endpoints
```php
// Register custom API endpoint
function child_theme_register_api_endpoints() {
    register_rest_route('child-theme/v1', '/posts', [
        'methods'  => 'GET',
        'callback' => 'child_theme_api_get_posts',
        'permission_callback' => '__return_true',
    ]);
}
add_action('rest_api_init', 'child_theme_register_api_endpoints');

function child_theme_api_get_posts($request) {
    $posts = get_posts([
        'numberposts' => $request->get_param('per_page') ?: 10,
        'post_status' => 'publish',
    ]);
    
    $data = [];
    foreach ($posts as $post) {
        $data[] = [
            'id'      => $post->ID,
            'title'   => $post->post_title,
            'excerpt' => $post->post_excerpt,
            'link'    => get_permalink($post->ID),
            'image'   => get_the_post_thumbnail_url($post->ID, 'medium'),
        ];
    }
    
    return rest_ensure_response($data);
}
```

## Testing en Debugging

### Unit Testing Setup
```php
// child-theme/tests/test-functions.php
class Child_Theme_Functions_Test extends WP_UnitTestCase {
    
    public function test_custom_function() {
        $result = child_theme_custom_function('test');
        $this->assertEquals('expected_result', $result);
    }
    
    public function test_shortcode_output() {
        $output = do_shortcode('[madeit_button url="#" type="primary"]Click me[/madeit_button]');
        $this->assertStringContainsString('btn-primary', $output);
    }
}
```

### Debug Tools
```php
// Debug helper functions
function child_theme_debug_log($message, $data = null) {
    if (WP_DEBUG && WP_DEBUG_LOG) {
        $log_message = '[CHILD THEME] ' . $message;
        if ($data) {
            $log_message .= ' | Data: ' . print_r($data, true);
        }
        error_log($log_message);
    }
}

function child_theme_debug_query($query) {
    if (WP_DEBUG) {
        echo '<pre>Query: ' . print_r($query->request, true) . '</pre>';
    }
}
```

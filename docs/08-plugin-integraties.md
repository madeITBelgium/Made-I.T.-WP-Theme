# Plugin Integraties

Het Made I.T. thema heeft uitgebreide integraties met populaire WordPress plugins voor functionaliteit en prestaties.

## Aanbevolen Plugins (TGM Plugin Activation)

### madeit_register_required_plugins()
Het thema registreert aanbevolen en vereiste plugins via TGM Plugin Activation:

```php
function madeit_register_required_plugins() {
    $plugins = [
        // Vereiste plugins
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
            'name'     => 'Forms by Made I.T.',
            'slug'     => 'forms-by-made-it',
            'required' => true,
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
        
        // Optionele plugins
        [
            'name'     => 'WooCommerce',
            'slug'     => 'woocommerce',
            'required' => false,
        ],
        [
            'name'     => 'Wordfence Security',
            'slug'     => 'wordfence',
            'required' => false,
        ],
        // ... meer plugins
    ];
}
```

## Cookie Law Plugin Integratie

### GDPR Cookie Consent
Het thema heeft specifieke integratie met de Cookie Law Info plugin.

#### Default Settings
```php
function madeit_cookie_law_default_settings($settings) {
    $settings['show_again'] = true;
    $settings['show_again_tab'] = true;
    $settings['show_again_div_id'] = '#cookie-law-info-again';
    $settings['accept_all_button_popup'] = true;
    $settings['button_1_text'] = __('Accept All', 'madeit');
    $settings['button_2_text'] = __('Cookie Settings', 'madeit');
    $settings['button_1_style'] = 'background-color:#0051A8;color:#ffffff;';
    $settings['popup_background_color'] = '#ffffff';
    $settings['popup_text_color'] = '#212529';
    
    return $settings;
}
add_filter('wt_cli_plugin_settings', 'madeit_cookie_law_default_settings');
```

#### Branding Removal
```php
function madeit_wt_cli_enable_ckyes_branding($enable) {
    return false; // Verwijder CookieYes branding
}
add_filter('wt_cli_enable_ckyes_branding', 'madeit_wt_cli_enable_ckyes_branding', 99, 1);
```

#### Custom Cookie Notice
```php
function madeit_cookie_notice() {
    if (!function_exists('wt_cli_cookyes_lite_get_option')) {
        return;
    }
    
    $show_notice = wt_cli_cookyes_lite_get_option('show_cookie_notice', true);
    
    if ($show_notice) {
        ?>
        <div id="madeit-cookie-notice" class="cookie-notice-wrapper">
            <div class="container">
                <div class="cookie-notice-content">
                    <p><?php echo esc_html__('We use cookies to ensure you get the best experience on our website.', 'madeit'); ?></p>
                    <div class="cookie-notice-buttons">
                        <button class="btn btn-primary accept-cookies">
                            <?php echo esc_html__('Accept', 'madeit'); ?>
                        </button>
                        <button class="btn btn-link learn-more">
                            <?php echo esc_html__('Learn More', 'madeit'); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
}
add_action('wp_footer', 'madeit_cookie_notice');
```

## Forms by Made I.T. Integratie

### Module Class Filtering
```php
function theme_madeit_forms_module_class($class, $module_type) {
    switch ($module_type) {
        case 'contact':
            return 'madeit-contact-form card';
        case 'newsletter':
            return 'madeit-newsletter-form bg-primary text-white p-4';
        case 'feedback':
            return 'madeit-feedback-form border rounded p-3';
        default:
            return $class;
    }
}
add_filter('madeit_forms_module_class', 'theme_madeit_forms_module_class', 10, 2);
```

### Form Styling
```css
/* Forms by Made I.T. styling */
.madeit-contact-form {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    padding: 2rem;
    margin-bottom: 2rem;
}

.madeit-contact-form .form-group {
    margin-bottom: 1.5rem;
}

.madeit-contact-form .form-control {
    border-radius: 0.375rem;
    border: 1px solid #ced4da;
    padding: 0.75rem;
}

.madeit-contact-form .form-control:focus {
    border-color: var(--madeit-primary-color);
    box-shadow: 0 0 0 0.2rem rgba(0, 81, 168, 0.25);
}

.madeit-newsletter-form input[type="email"] {
    border: none;
    background: rgba(255,255,255,0.9);
}

.madeit-newsletter-form .btn {
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.5);
    color: white;
}
```

## WP Rocket Integratie

### JavaScript Delay Exclusions
```php
function madeit_wprocket_pre_get_rocket_option_delay_js_exclusions($exclusions, $option) {
    if ($option === 'delay_js_exclusions') {
        $madeit_exclusions = [
            'jquery',
            'bootstrap',
            'madeit-script',
            'woocommerce',
            'gtag',
            'analytics',
        ];
        
        return array_merge($exclusions, $madeit_exclusions);
    }
    
    return $exclusions;
}
add_filter('pre_get_rocket_option_delay_js_exclusions', 'madeit_wprocket_pre_get_rocket_option_delay_js_exclusions', 10, 2);
```

### Critical CSS Integration
```php
// WP Rocket critical CSS paths
add_filter('rocket_critical_css_contents', function($css, $url) {
    // Add theme-specific critical CSS
    $theme_critical = get_template_directory() . '/assets/css/critical.css';
    if (file_exists($theme_critical)) {
        $css .= file_get_contents($theme_critical);
    }
    
    return $css;
}, 10, 2);
```

## Yoast SEO Integratie

### Schema.org Integration
```php
// Add theme-specific schema data
add_filter('wpseo_schema_organization', function($data) {
    $data['logo'] = [
        '@type' => 'ImageObject',
        'url'   => get_theme_mod('custom_logo') ? wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full') : '',
    ];
    
    return $data;
});

// Breadcrumb styling
add_filter('wpseo_breadcrumb_output', function($output) {
    return str_replace(
        '<span prefix="v: http://rdf.data-vocabulary.org/#">',
        '<nav aria-label="breadcrumb"><ol class="breadcrumb">',
        $output
    );
});
```

### OpenGraph Enhancements
```php
add_action('wp_head', function() {
    if (is_front_page()) {
        $featured_image = get_theme_mod('header_image');
        if ($featured_image) {
            echo '<meta property="og:image" content="' . esc_url($featured_image) . '">';
        }
    }
}, 5); // Voor Yoast
```

## Advanced Custom Fields (ACF) Integratie

### Theme Options Page
```php
if (function_exists('acf_add_options_page')) {
    acf_add_options_page([
        'page_title' => 'Made I.T. Theme Options',
        'menu_title' => 'Theme Options',
        'menu_slug'  => 'madeit-theme-options',
        'capability' => 'edit_theme_options',
        'position'   => 60,
    ]);
}
```

### Custom Fields Integration
```php
// Get ACF field met fallback
function madeit_get_field($field_name, $post_id = null, $default = '') {
    if (function_exists('get_field')) {
        $value = get_field($field_name, $post_id);
        return $value ?: $default;
    }
    
    return $default;
}

// Template gebruik
$hero_title = madeit_get_field('hero_title', get_the_ID(), get_the_title());
$hero_subtitle = madeit_get_field('hero_subtitle', get_the_ID());
```

## Wordfence Security Integratie

### Security Headers
```php
// Add security headers when Wordfence is active
if (class_exists('wordfence')) {
    add_action('wp_head', function() {
        echo '<meta http-equiv="X-Content-Type-Options" content="nosniff">';
        echo '<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">';
        echo '<meta http-equiv="X-XSS-Protection" content="1; mode=block">';
    }, 1);
}
```

### Login Security
```php
// Custom login URL when Wordfence is active
add_filter('login_url', function($login_url, $redirect, $force_reauth) {
    if (class_exists('wordfence') && !is_admin()) {
        $wf_options = get_option('wordfenceOptions');
        if (isset($wf_options['loginSec_disableAuthorScan'])) {
            // Use custom login URL
            return home_url('/secure-login/');
        }
    }
    
    return $login_url;
}, 10, 3);
```

## Antispam Bee Integratie

### Comment Form Integration
```php
if (class_exists('Antispam_Bee')) {
    add_filter('comment_form_default_fields', function($fields) {
        // Add honeypot field
        $fields['antispam'] = '<p style="display:none;"><label for="antispam">Leave this field empty</label><input type="text" name="antispam" id="antispam" /></p>';
        
        return $fields;
    });
}
```

## Redirection Plugin Integratie

### Custom Redirect Rules
```php
// Add theme-specific redirects
add_action('init', function() {
    if (class_exists('Red_Item')) {
        // Add redirect for old theme URLs
        $redirects = [
            '/old-contact/' => '/contact/',
            '/old-about/'   => '/about/',
        ];
        
        foreach ($redirects as $source => $target) {
            Red_Item::create([
                'url'    => $source,
                'action_data' => $target,
                'action_type' => 'url',
                'match_type'  => 'url',
                'group_id'    => 1,
            ]);
        }
    }
});
```

## Duplicator Integratie

### Backup Exclusions
```php
// Exclude cache files from Duplicator backups
add_filter('duplicator_scan_dirs', function($dirs) {
    $exclude_dirs = [
        get_template_directory() . '/cache/',
        get_stylesheet_directory() . '/cache/',
        WP_CONTENT_DIR . '/cache/',
    ];
    
    return array_diff($dirs, $exclude_dirs);
});
```

## MainWP Child Integratie

### Custom Reports
```php
if (class_exists('MainWP_Child')) {
    // Add theme-specific data to MainWP reports
    add_filter('mainwp_child_extra_execution', function($information, $data) {
        if (isset($data['madeit_theme_info'])) {
            $information['madeit_version'] = MADEIT_VERSION;
            $information['madeit_bootstrap'] = MADEIT_BOOTSTRAP_VERSION;
            $information['madeit_custom_color'] = MADEIT_CUSTOM_COLOR;
        }
        
        return $information;
    }, 10, 2);
}
```

## Performance Monitoring

### Plugin Performance Tracking
```php
// Monitor plugin loading times
add_action('plugins_loaded', function() {
    if (WP_DEBUG) {
        $start_time = microtime(true);
        
        add_action('wp_footer', function() use ($start_time) {
            $end_time = microtime(true);
            $load_time = $end_time - $start_time;
            
            echo '<!-- Plugins loaded in: ' . $load_time . ' seconds -->';
        });
    }
});
```

### Asset Optimization
```php
// Conditional plugin asset loading
add_action('wp_enqueue_scripts', function() {
    // Only load Contact Form 7 assets on contact pages
    if (!is_page_template('page-contact.php') && !is_page('contact')) {
        wp_dequeue_style('contact-form-7');
        wp_dequeue_script('contact-form-7');
    }
    
    // Only load Yoast SEO assets in admin
    if (!is_admin()) {
        wp_dequeue_style('yoast-seo-adminbar');
    }
});
```

## Plugin Compatibility Checks

### Version Compatibility
```php
function madeit_check_plugin_compatibility() {
    $plugins = [
        'woocommerce' => '6.0.0',
        'yoast-seo'   => '19.0.0',
        'wordfence'   => '7.5.0',
    ];
    
    foreach ($plugins as $plugin => $min_version) {
        if (is_plugin_active($plugin . '/' . $plugin . '.php')) {
            $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin . '/' . $plugin . '.php');
            
            if (version_compare($plugin_data['Version'], $min_version, '<')) {
                add_action('admin_notices', function() use ($plugin, $min_version) {
                    echo '<div class="notice notice-warning"><p>';
                    printf(__('Plugin %s version %s or higher is recommended for optimal compatibility with Made I.T. theme.', 'madeit'), $plugin, $min_version);
                    echo '</p></div>';
                });
            }
        }
    }
}
add_action('admin_init', 'madeit_check_plugin_compatibility');
```

### Feature Detection
```php
// Detect plugin features
function madeit_has_plugin_feature($feature) {
    switch ($feature) {
        case 'woocommerce_blocks':
            return class_exists('Automattic\WooCommerce\Blocks\Package');
            
        case 'yoast_schema':
            return class_exists('WPSEO_Schema_Context');
            
        case 'acf_blocks':
            return function_exists('acf_register_block_type');
            
        default:
            return false;
    }
}
```

## Troubleshooting Plugin Conflicts

### Common Conflicts
```php
// Fix jQuery conflicts
add_action('wp_enqueue_scripts', function() {
    if (wp_script_is('jquery', 'enqueued')) {
        // Ensure jQuery is in footer for compatibility
        global $wp_scripts;
        $wp_scripts->add_data('jquery', 'group', 1);
    }
});

// Fix CSS conflicts
add_action('wp_enqueue_scripts', function() {
    // Higher specificity for theme styles
    wp_add_inline_style('madeit-style', '
        .madeit-override {
            /* Force theme styles over plugin styles */
            background-color: var(--madeit-background-color) !important;
            color: var(--madeit-text-color) !important;
        }
    ');
}, 20);
```

### Debug Plugin Issues
```php
// Plugin debug mode
if (WP_DEBUG && isset($_GET['debug_plugins'])) {
    add_action('wp_footer', function() {
        $active_plugins = get_option('active_plugins');
        echo '<script>console.log("Active Plugins:", ' . json_encode($active_plugins) . ');</script>';
        
        // Show loaded scripts and styles
        global $wp_scripts, $wp_styles;
        echo '<script>console.log("Loaded Scripts:", ' . json_encode($wp_scripts->queue) . ');</script>';
        echo '<script>console.log("Loaded Styles:", ' . json_encode($wp_styles->queue) . ');</script>';
    });
}
```

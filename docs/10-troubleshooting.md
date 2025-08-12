# Troubleshooting

Deze sectie behandelt veelvoorkomende problemen en hun oplossingen bij het gebruik van het Made I.T. WordPress thema.

## Algemene Problemen

### 1. Thema Activeert Niet

**Symptomen:**
- Error bij activeren van thema
- "The theme is missing the style.css stylesheet" melding
- Thema verschijnt niet in lijst

**Oorzaken en Oplossingen:**

```php
// Controleer of style.css bestaat en correct header heeft
/*
Theme Name: Made I.T.
Description: Professional WordPress theme
Author: Made I.T.
Version: 2.10.0
*/
```

**Stappen:**
1. Controleer bestandsstructuur:
   ```
   madeit/
   ├── style.css (met correcte theme header)
   ├── index.php
   ├── functions.php
   └── screenshot.png
   ```

2. Verificeer bestandspermissies:
   ```bash
   # Correcte permissies instellen
   find /path/to/theme/ -type d -exec chmod 755 {} \;
   find /path/to/theme/ -type f -exec chmod 644 {} \;
   ```

3. Controleer PHP errors:
   ```php
   // In wp-config.php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```

### 2. Bootstrap Styling Werkt Niet

**Symptomen:**
- Layout ziet er kapot uit
- Grid systeem werkt niet
- Components worden niet correct weergegeven

**Diagnose:**
```php
// Controleer welke Bootstrap versie wordt geladen
function debug_bootstrap_version() {
    if (WP_DEBUG) {
        echo '<!-- Bootstrap Version: ' . MADEIT_BOOTSTRAP_VERSION . ' -->';
    }
}
add_action('wp_head', 'debug_bootstrap_version');
```

**Oplossingen:**

1. **Verkeerde Bootstrap versie:**
   ```php
   // In wp-config.php of child theme functions.php
   define('MADEIT_BOOTSTRAP_VERSION', 5); // of 4
   ```

2. **CSS conflicten:**
   ```css
   /* Forceer Bootstrap styles */
   .container {
       width: 100% !important;
       padding-right: 15px !important;
       padding-left: 15px !important;
       margin-right: auto !important;
       margin-left: auto !important;
   }
   ```

3. **JavaScript conflicten:**
   ```php
   // Zorg dat jQuery in footer wordt geladen
   function fix_jquery_loading() {
       if (!is_admin()) {
           wp_scripts()->add_data('jquery', 'group', 1);
           wp_scripts()->add_data('jquery-core', 'group', 1);
       }
   }
   add_action('wp_enqueue_scripts', 'fix_jquery_loading');
   ```

### 3. Custom Kleuren Werken Niet

**Symptomen:**
- Kleuren in customizer hebben geen effect
- CSS variabelen worden niet toegepast
- Standaard kleuren blijven zichtbaar

**Diagnose:**
```php
// Check color system status
function debug_color_system() {
    if (WP_DEBUG && current_user_can('manage_options')) {
        echo '<script>';
        echo 'console.log("MADEIT_CUSTOM_COLOR:", ' . (MADEIT_CUSTOM_COLOR ? 'true' : 'false') . ');';
        echo 'console.log("Color scheme:", "' . get_theme_mod('colorscheme', 'light') . '");';
        echo 'console.log("Primary color:", "' . madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR) . '");';
        echo '</script>';
    }
}
add_action('wp_footer', 'debug_color_system');
```

**Oplossingen:**

1. **MADEIT_CUSTOM_COLOR niet ingesteld:**
   ```php
   define('MADEIT_CUSTOM_COLOR', true);
   ```

2. **Colorscheme niet op 'custom':**
   - Ga naar Appearance > Customize > Colors
   - Selecteer "Custom" colorscheme

3. **CSS cache probleem:**
   ```php
   // Force cache regeneration
   function force_css_cache_regeneration() {
       if (isset($_GET['clear_css_cache'])) {
           $cache_dir = get_stylesheet_directory() . '/cache/';
           if (file_exists($cache_dir . 'custom-colors.css')) {
               unlink($cache_dir . 'custom-colors.css');
           }
           madeit_css_generateCache();
       }
   }
   add_action('init', 'force_css_cache_regeneration');
   ```

## WooCommerce Problemen

### 1. Winkelwagen Niet Zichtbaar in Menu

**Diagnose:**
```php
// Check WooCommerce status
function debug_woocommerce_status() {
    if (WP_DEBUG) {
        echo '<!-- WooCommerce Active: ' . (class_exists('WooCommerce') ? 'Yes' : 'No') . ' -->';
        echo '<!-- Cart Style: ' . WOO_SHOPING_CART_MENU_STYLE . ' -->';
    }
}
add_action('wp_head', 'debug_woocommerce_status');
```

**Oplossingen:**

1. **WooCommerce niet actief:**
   - Installeer en activeer WooCommerce plugin

2. **Menu locatie incorrect:**
   ```php
   // Controleer menu locatie in filter
   add_filter('wp_nav_menu_items', 'debug_menu_location', 10, 2);
   function debug_menu_location($items, $args) {
       if (WP_DEBUG) {
           error_log('Menu location: ' . $args->theme_location);
       }
       return $items;
   }
   ```

3. **Cart style configuratie:**
   ```php
   define('WOO_SHOPING_CART_MENU_STYLE', 2);
   ```

### 2. Product Pagina's Styling Problemen

**Oplossingen:**

1. **Template override:**
   ```php
   // Copy WooCommerce templates naar theme
   // woocommerce/single-product.php
   // woocommerce/archive-product.php
   ```

2. **CSS fixes:**
   ```css
   /* WooCommerce styling fixes */
   .woocommerce .product .summary {
       margin-bottom: 2rem;
   }
   
   .woocommerce .woocommerce-tabs {
       margin-top: 2rem;
   }
   
   .woocommerce .related.products {
       margin-top: 3rem;
   }
   ```

### 3. Checkout Formulieren

**Probleem:** Bootstrap classes worden niet toegepast

**Oplossing:**
```php
// Zorg dat form field filter actief is
if (!is_page('checkout')) {
    add_filter('woocommerce_form_field_args', 'madeit_woocommerce_form_field_args', 10, 3);
} else {
    // Checkout specific styling
    add_action('wp_head', function() {
        echo '<style>
        .woocommerce-checkout .form-row {
            margin-bottom: 1rem;
        }
        .woocommerce-checkout .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ced4da;
            border-radius: 0.375rem;
        }
        </style>';
    });
}
```

## Gutenberg/Block Editor Problemen

### 1. Custom Blocks Laden Niet

**Diagnose:**
```php
// Check block registration
function debug_custom_blocks() {
    if (WP_DEBUG && is_admin()) {
        $registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
        $madeit_blocks = array_filter($registered_blocks, function($key) {
            return strpos($key, 'madeit/') === 0;
        }, ARRAY_FILTER_USE_KEY);
        
        error_log('Registered Made I.T. blocks: ' . print_r(array_keys($madeit_blocks), true));
    }
}
add_action('admin_init', 'debug_custom_blocks');
```

**Oplossingen:**

1. **MADEIT_ADVANCED_BLOCKS niet ingesteld:**
   ```php
   define('MADEIT_ADVANCED_BLOCKS', true);
   ```

2. **JavaScript errors:**
   - Controleer browser console
   - Verificeer bestandspaden

3. **Dependencies missing:**
   ```php
   // Ensure dependencies are loaded
   function fix_block_dependencies() {
       wp_enqueue_script('wp-blocks');
       wp_enqueue_script('wp-element');
       wp_enqueue_script('wp-components');
   }
   add_action('enqueue_block_editor_assets', 'fix_block_dependencies', 5);
   ```

### 2. Editor Styling Verschilt van Frontend

**Oplossing:**
```php
// Sync editor styles met frontend
function sync_editor_styles() {
    // Laad theme styles in editor
    wp_enqueue_style('madeit-editor-sync', 
        get_template_directory_uri() . '/style.css');
    
    // Add editor-specific overrides
    wp_add_inline_style('madeit-editor-sync', '
        .editor-styles-wrapper {
            font-family: var(--madeit-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto);
            font-size: 16px;
            line-height: 1.5;
        }
        .editor-styles-wrapper .wp-block {
            max-width: none;
        }
    ');
}
add_action('enqueue_block_editor_assets', 'sync_editor_styles');
```

## Performance Problemen

### 1. Langzame Laadtijden

**Diagnose:**
```php
// Performance monitoring
function performance_debug() {
    if (WP_DEBUG && isset($_GET['performance_debug'])) {
        $start_time = microtime(true);
        
        add_action('wp_footer', function() use ($start_time) {
            $end_time = microtime(true);
            $load_time = $end_time - $start_time;
            
            echo '<!-- Page generated in: ' . $load_time . ' seconds -->';
            echo '<!-- Queries: ' . get_num_queries() . ' -->';
            echo '<!-- Memory: ' . size_format(memory_get_peak_usage()) . ' -->';
        });
    }
}
add_action('init', 'performance_debug');
```

**Oplossingen:**

1. **Optimaliseer assets:**
   ```php
   // Conditionally load assets
   function optimize_asset_loading() {
       // Only load WooCommerce styles on shop pages
       if (!is_woocommerce() && !is_cart() && !is_checkout() && !is_account_page()) {
           wp_dequeue_style('woocommerce-general');
           wp_dequeue_style('woocommerce-layout');
           wp_dequeue_style('woocommerce-smallscreen');
       }
       
       // Only load contact form styles on contact pages
       if (!is_page_template('page-contact.php')) {
           wp_dequeue_style('contact-form-7');
           wp_dequeue_script('contact-form-7');
       }
   }
   add_action('wp_enqueue_scripts', 'optimize_asset_loading', 100);
   ```

2. **Database query optimalisatie:**
   ```php
   // Cache expensive queries
   function cache_expensive_queries() {
       // Cache widget queries
       add_filter('widget_posts_args', function($args) {
           $args['no_found_rows'] = true;
           $args['update_post_meta_cache'] = false;
           $args['update_post_term_cache'] = false;
           return $args;
       });
   }
   add_action('init', 'cache_expensive_queries');
   ```

### 2. CSS/JS Niet Geladen

**Diagnose:**
```php
// Debug asset loading
function debug_assets() {
    if (WP_DEBUG && isset($_GET['debug_assets'])) {
        add_action('wp_footer', function() {
            global $wp_scripts, $wp_styles;
            
            echo '<script>';
            echo 'console.log("Loaded Scripts:", ' . json_encode($wp_scripts->done) . ');';
            echo 'console.log("Loaded Styles:", ' . json_encode($wp_styles->done) . ');';
            echo '</script>';
        });
    }
}
add_action('wp_enqueue_scripts', 'debug_assets');
```

**Oplossingen:**

1. **Cache problemen:**
   ```php
   // Clear all caches
   function clear_all_caches() {
       if (isset($_GET['clear_cache']) && current_user_can('manage_options')) {
           // WordPress cache
           wp_cache_flush();
           
           // Theme cache
           $cache_dir = get_stylesheet_directory() . '/cache/';
           if (is_dir($cache_dir)) {
               $files = glob($cache_dir . '*');
               foreach ($files as $file) {
                   if (is_file($file)) {
                       unlink($file);
                   }
               }
           }
           
           wp_redirect(remove_query_arg('clear_cache'));
           exit;
       }
   }
   add_action('init', 'clear_all_caches');
   ```

2. **Bestandspad problemen:**
   ```php
   // Fix asset paths
   function fix_asset_paths() {
       // Use correct theme directory
       $theme_dir = get_template_directory_uri();
       
       // Ensure HTTPS if site uses SSL
       if (is_ssl()) {
           $theme_dir = str_replace('http://', 'https://', $theme_dir);
       }
       
       return $theme_dir;
   }
   ```

## Plugin Conflicten

### 1. JavaScript Conflicten

**Diagnose:**
```javascript
// In browser console
console.log('jQuery version:', jQuery.fn.jquery);
console.log('Bootstrap loaded:', typeof bootstrap !== 'undefined');
```

**Oplossingen:**

1. **jQuery multiple versions:**
   ```php
   // Force single jQuery version
   function fix_jquery_conflicts() {
       if (!is_admin()) {
           wp_deregister_script('jquery');
           wp_register_script('jquery', 
               'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js', 
               [], '3.6.0', true);
           wp_enqueue_script('jquery');
       }
   }
   add_action('wp_enqueue_scripts', 'fix_jquery_conflicts', 5);
   ```

2. **noConflict mode:**
   ```javascript
   // Wrap theme JavaScript
   (function($) {
       'use strict';
       
       $(document).ready(function() {
           // Theme JavaScript here
       });
       
   })(jQuery);
   ```

### 2. CSS Conflicten

**Oplossingen:**

1. **Specificity verhogen:**
   ```css
   /* More specific selectors */
   .madeit-theme .btn {
       /* Theme button styles */
   }
   
   .madeit-theme .container {
       /* Theme container styles */
   }
   ```

2. **CSS load order:**
   ```php
   // Ensure theme styles load last
   function theme_styles_last() {
       wp_enqueue_style('madeit-style-override', 
           get_template_directory_uri() . '/assets/css/override.css', 
           [], MADEIT_VERSION);
   }
   add_action('wp_enqueue_scripts', 'theme_styles_last', 100);
   ```

## Database Problemen

### 1. Customizer Settings Verdwenen

**Oplossing:**
```php
// Restore default customizer settings
function restore_default_customizer_settings() {
    if (isset($_GET['restore_defaults']) && current_user_can('manage_options')) {
        $defaults = [
            'colorscheme' => 'light',
            'page_layout' => 'two-column',
            'primary_color_rgb' => MADEIT_PRIMARY_COLOR,
            'secondary_color_rgb' => MADEIT_SECONDARY_COLOR,
        ];
        
        foreach ($defaults as $setting => $value) {
            set_theme_mod($setting, $value);
        }
        
        wp_redirect(admin_url('customize.php'));
        exit;
    }
}
add_action('admin_init', 'restore_default_customizer_settings');
```

### 2. Database Corruptie

**Diagnose:**
```php
// Check database integrity
function check_database_integrity() {
    if (WP_DEBUG && current_user_can('manage_options')) {
        global $wpdb;
        
        // Check theme mods
        $theme_mods = get_option('theme_mods_' . get_option('stylesheet'));
        if (!$theme_mods) {
            error_log('Theme mods not found for: ' . get_option('stylesheet'));
        }
        
        // Check options table
        $result = $wpdb->get_results("CHECK TABLE {$wpdb->options}");
        error_log('Options table check: ' . print_r($result, true));
    }
}
```

## Debug Tools

### 1. Comprehensive Debug Function

```php
function madeit_debug_info() {
    if (!WP_DEBUG || !current_user_can('manage_options')) {
        return;
    }
    
    $debug_info = [
        'Theme Version' => MADEIT_VERSION,
        'WordPress Version' => get_bloginfo('version'),
        'PHP Version' => PHP_VERSION,
        'Bootstrap Version' => MADEIT_BOOTSTRAP_VERSION,
        'Custom Colors' => MADEIT_CUSTOM_COLOR ? 'Enabled' : 'Disabled',
        'Color Scheme' => get_theme_mod('colorscheme', 'light'),
        'Active Plugins' => array_keys(get_option('active_plugins', [])),
        'Memory Limit' => ini_get('memory_limit'),
        'Max Execution Time' => ini_get('max_execution_time'),
    ];
    
    echo '<div style="position: fixed; bottom: 0; right: 0; background: #000; color: #fff; padding: 10px; z-index: 9999; max-width: 300px; font-size: 12px;">';
    echo '<h4>Debug Info</h4>';
    foreach ($debug_info as $key => $value) {
        echo '<strong>' . $key . ':</strong> ';
        echo is_array($value) ? implode(', ', array_slice($value, 0, 3)) . (count($value) > 3 ? '...' : '') : $value;
        echo '<br>';
    }
    echo '</div>';
}

// Alleen tonen met ?debug=1
if (isset($_GET['debug']) && $_GET['debug'] == '1') {
    add_action('wp_footer', 'madeit_debug_info');
}
```

### 2. Error Logging

```php
// Enhanced error logging
function madeit_log_error($message, $context = []) {
    if (WP_DEBUG_LOG) {
        $log_entry = '[' . date('Y-m-d H:i:s') . '] MADEIT THEME: ' . $message;
        
        if (!empty($context)) {
            $log_entry .= ' | Context: ' . json_encode($context);
        }
        
        error_log($log_entry);
    }
}

// Usage examples
madeit_log_error('Custom color system activated', [
    'colorscheme' => get_theme_mod('colorscheme'),
    'primary_color' => MADEIT_PRIMARY_COLOR
]);
```

## Support en Hulp

### Contact Informatie
- **Email Support**: support@madeit.be
- **Documentatie**: Deze documentatie
- **Website**: https://madeit.be

### Voor Support Aanvragen
Verstrek altijd de volgende informatie:

1. **Thema versie**: Controleer `MADEIT_VERSION`
2. **WordPress versie**: Ga naar Dashboard > Updates
3. **PHP versie**: Controleer in Site Health
4. **Active plugins**: Lijst van geactiveerde plugins
5. **Error logs**: Controleer error_log bestanden
6. **Browser console**: JavaScript errors
7. **Steps to reproduce**: Exacte stappen om probleem te reproduceren

### Debug Mode Activeren
```php
// In wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);

// Thema specific debug
define('MADEIT_DEBUG', true);
```

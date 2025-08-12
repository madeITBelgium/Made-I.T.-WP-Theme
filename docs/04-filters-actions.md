# Filters en Actions

Het Made I.T. thema gebruikt een uitgebreid systeem van WordPress hooks (actions en filters) voor aanpassingen en uitbreidingen.

## WordPress Actions

### Theme Setup Actions

#### after_setup_theme
```php
add_action('after_setup_theme', 'madeit_setup');
```
**Functie**: `madeit_setup()`  
**Prioriteit**: 10 (standaard)  
**Beschrijving**: Initialiseert thema ondersteuning en features

#### widgets_init
```php
add_action('widgets_init', 'madeit_widgets_init');
```
**Functie**: `madeit_widgets_init()`  
**Beschrijving**: Registreert alle widget areas en sidebars

### Asset Loading Actions

#### wp_enqueue_scripts
```php
add_action('wp_enqueue_scripts', 'madeit_scripts');
add_action('wp_enqueue_scripts', 'madeit_rgb_colors_inline');
```
**Functies**: 
- `madeit_scripts()`: Laadt CSS en JavaScript bestanden
- `madeit_rgb_colors_inline()`: Voegt inline color CSS toe

#### admin_enqueue_scripts
```php
add_action('admin_enqueue_scripts', 'madeit_admin_style');
```
**Functie**: `madeit_admin_style()`  
**Beschrijving**: Laadt admin-specifieke styles (Gutenberg editor)

#### enqueue_block_editor_assets
```php
add_action('enqueue_block_editor_assets', 'madeit_block_editor_styles');
add_action('enqueue_block_editor_assets', 'madeit_colors_css_wrap');
add_action('enqueue_block_editor_assets', 'madeit_extend_gutenberg');
```
**Functies**:
- `madeit_block_editor_styles()`: Block editor specifieke styles
- `madeit_colors_css_wrap()`: Custom kleuren voor editor
- `madeit_extend_gutenberg()`: Uitgebreide Gutenberg functionaliteit

#### enqueue_block_assets
```php
add_action('enqueue_block_assets', 'madeit_extend_gutenberg_css');
```
**Functie**: `madeit_extend_gutenberg_css()`  
**Beschrijving**: CSS voor custom blocks (frontend en backend)

#### get_footer
```php
add_action('get_footer', 'prefix_add_footer_styles');
```
**Functie**: `prefix_add_footer_styles()`  
**Beschrijving**: Laadt CSS bestanden in footer voor betere performance

### Header Actions

#### wp_head
```php
add_action('wp_head', 'madeit_javascript_detection', 0);
add_action('wp_head', 'madeit_pingback_header');
add_action('wp_head', 'madeit_colors_css_wrap');
add_action('wp_head', 'madeit_wp_bootstrap_head');
add_action('wp_head', 'madeit_user_analytics', 10);
```
**Functies**:
- `madeit_javascript_detection()`: JavaScript detectie script
- `madeit_pingback_header()`: Pingback meta tag
- `madeit_colors_css_wrap()`: Inline custom kleuren CSS
- `madeit_wp_bootstrap_head()`: Bootstrap/admin bar fixes
- `madeit_user_analytics()`: Analytics tracking code

#### wp_footer
```php
add_action('wp_footer', 'madeit_cookie_notice');
```
**Functie**: `madeit_cookie_notice()`  
**Beschrijving**: Cookie notice HTML output

### Template Actions

#### template_redirect
```php
add_action('template_redirect', 'madeit_content_width', 0);
```
**Functie**: `madeit_content_width()`  
**Prioriteit**: 0 (zeer hoog)  
**Beschrijving**: Bepaalt content breedte gebaseerd op layout

### Plugin Integration Actions

#### tgmpa_register
```php
add_action('tgmpa_register', 'madeit_register_required_plugins');
```
**Functie**: `madeit_register_required_plugins()`  
**Beschrijving**: Registreert aanbevolen/vereiste plugins

#### init
```php
add_action('init', 'madeit_fix_bs_5');
```
**Functie**: `madeit_fix_bs_5()`  
**Beschrijving**: Bootstrap 5 compatibility fixes

## WordPress Filters

### Asset Filters

#### wp_default_scripts
```php
add_filter('wp_default_scripts', 'remove_jquery_migrate_and_move_jquery_to_footer');
```
**Functie**: `remove_jquery_migrate_and_move_jquery_to_footer()`  
**Beschrijving**: Optimalisaties voor jQuery loading

#### style_loader_src & script_loader_src
```php
add_filter('style_loader_src', 'remove_css_js_ver', 10, 2);
add_filter('script_loader_src', 'remove_css_js_ver', 10, 2);
```
**Functie**: `remove_css_js_ver()`  
**Beschrijving**: Verwijdert version parameters uit asset URLs

#### wp_resource_hints
```php
add_filter('wp_resource_hints', 'madeit_resource_hints', 10, 2);
```
**Functie**: `madeit_resource_hints()`  
**Beschrijving**: Voegt preconnect hints toe voor Google Fonts

### Content Filters

#### excerpt_more
```php
add_filter('excerpt_more', 'madeit_excerpt_more');
```
**Functie**: `madeit_excerpt_more()`  
**Beschrijving**: Custom "read more" link voor excerpts

#### the_content
```php
add_filter('the_content', 'madeit_add_image_popup_class');
```
**Functie**: `madeit_add_image_popup_class()`  
**Beschrijving**: Voegt lightbox classes toe aan afbeeldingen

#### the_content_more_link
```php
add_filter('the_content_more_link', 'modify_read_more_link');
```
**Functie**: `modify_read_more_link()`  
**Beschrijving**: Stijlt "read more" links

### Image Filters

#### wp_calculate_image_sizes
```php
add_filter('wp_calculate_image_sizes', 'madeit_content_image_sizes_attr', 10, 2);
```
**Functie**: `madeit_content_image_sizes_attr()`  
**Beschrijving**: Verbetert responsive image sizes

#### wp_get_attachment_image_attributes
```php
add_filter('wp_get_attachment_image_attributes', 'madeit_post_thumbnail_sizes_attr', 10, 3);
```
**Functie**: `madeit_post_thumbnail_sizes_attr()`  
**Beschrijving**: Custom attributes voor post thumbnails

#### get_header_image_tag
```php
add_filter('get_header_image_tag', 'madeit_header_image_tag', 10, 3);
```
**Functie**: `madeit_header_image_tag()`  
**Beschrijving**: Aanpassingen voor header image tags

### Template Filters

#### frontpage_template
```php
add_filter('frontpage_template', 'madeit_front_page_template');
```
**Functie**: `madeit_front_page_template()`  
**Beschrijving**: Controleert front page template gebruik

#### widget_tag_cloud_args
```php
add_filter('widget_tag_cloud_args', 'madeit_widget_tag_cloud_args');
```
**Functie**: `madeit_widget_tag_cloud_args()`  
**Beschrijving**: Standaardiseert tag cloud widget argumenten

### Navigation Filters

#### wp_nav_menu_items
```php
add_filter('wp_nav_menu_items', 'madeit_woocommerce_shopping_cart_in_menu', 10, 2);
add_filter('wp_get_nav_menu_items', 'madeit_add_mobile_menu_items_to_main_menu', 10, 3);
```
**Functies**:
- `madeit_woocommerce_shopping_cart_in_menu()`: Voegt winkelwagen toe aan menu
- `madeit_add_mobile_menu_items_to_main_menu()`: Mobile menu items

### WooCommerce Filters

#### woocommerce_form_field_args
```php
add_filter('woocommerce_form_field_args', 'madeit_woocommerce_form_field_args', 10, 3);
```
**Functie**: `madeit_woocommerce_form_field_args()`  
**Beschrijving**: Bootstrap classes voor WooCommerce formulieren

#### woocommerce_account_menu_item_classes
```php
add_filter('woocommerce_account_menu_item_classes', 'madeit_woocommerce_account_menu_item_classes', 10, 2);
```
**Functie**: `madeit_woocommerce_account_menu_item_classes()`  
**Beschrijving**: Corrigeert active class voor account menu

### Plugin Integration Filters

#### madeit_powered_by_text
```php
add_filter('madeit_powered_by_text', 'madeit_powered_by_text');
```
**Functie**: `madeit_powered_by_text()`  
**Beschrijving**: Custom "powered by" tekst

#### wt_cli_plugin_settings
```php
add_filter('wt_cli_plugin_settings', 'madeit_cookie_law_default_settings');
```
**Functie**: `madeit_cookie_law_default_settings()`  
**Beschrijving**: Standaard instellingen voor cookie plugin

#### wt_cli_enable_ckyes_branding
```php
add_filter('wt_cli_enable_ckyes_branding', 'madeit_wt_cli_enable_ckyes_branding', 99, 1);
```
**Functie**: `madeit_wt_cli_enable_ckyes_branding()`  
**Beschrijving**: Schakelt cookie plugin branding uit

#### madeit_forms_module_class
```php
add_filter('madeit_forms_module_class', 'theme_madeit_forms_module_class', 10, 2);
```
**Functie**: `theme_madeit_forms_module_class()`  
**Beschrijving**: Custom classes voor formulier modules

#### pre_get_rocket_option_delay_js_exclusions
```php
add_filter('pre_get_rocket_option_delay_js_exclusions', 'madeit_wprocket_pre_get_rocket_option_delay_js_exclusions', 10, 2);
```
**Functie**: `madeit_wprocket_pre_get_rocket_option_delay_js_exclusions()`  
**Beschrijving**: WP Rocket JavaScript delay exclusions

## Custom Filters

Het thema definieert ook eigen filters voor uitbreiding:

### madeit_content_width
```php
$GLOBALS['content_width'] = apply_filters('madeit_content_width', $content_width);
```
**Gebruik**: Pas content breedte aan
**Parameters**: `$content_width` (integer)

**Voorbeeld:**
```php
add_filter('madeit_content_width', function($width) {
    if (is_page_template('wide-page.php')) {
        return 1200;
    }
    return $width;
});
```

### madeit_colorscheme
```php
$colors = apply_filters('madeit_colorscheme', $default_colors);
```
**Gebruik**: Pas kleurenschema aan
**Parameters**: `$colors` (array)

**Voorbeeld:**
```php
add_filter('madeit_colorscheme', function($colors) {
    $colors[] = [
        'name'  => __('Custom Color', 'madeit'),
        'slug'  => 'custom',
        'color' => '#custom-color',
    ];
    return $colors;
});
```

### madeit_starter_content
```php
$starter_content = apply_filters('madeit_starter_content', $starter_content);
```
**Gebruik**: Pas starter content aan
**Parameters**: `$starter_content` (array)

### madeit_infinite_* filters
Voor infinite scroll configuratie:

```php
// Custom selectors voor infinite scroll
add_filter('madeit_infinite_navselector', function($selector) {
    return '.custom-pagination';
});

add_filter('madeit_infinite_itemselector', function($selector) {
    return '.custom-item';
});
```

## Hook Prioriteiten

### Kritische Hooks (Prioriteit 0-5)
- `madeit_javascript_detection`: 0
- `madeit_content_width`: 0

### Normale Hooks (Prioriteit 10)
- Meeste filters en actions gebruiken standaard prioriteit 10

### Late Hooks (Prioriteit 99+)
- `madeit_wt_cli_enable_ckyes_branding`: 99

## Praktische Voorbeelden

### Custom CSS toevoegen
```php
add_action('wp_head', function() {
    if (is_front_page()) {
        echo '<style>body { background: #custom; }</style>';
    }
}, 20); // Na madeit_colors_css_wrap
```

### Menu items aanpassen
```php
add_filter('wp_nav_menu_items', function($items, $args) {
    if ($args->theme_location === 'top') {
        $items .= '<li><a href="/custom">Custom Link</a></li>';
    }
    return $items;
}, 15, 2); // Na shopping cart maar voor mobile items
```

### Custom widget area
```php
add_action('widgets_init', function() {
    register_sidebar([
        'name'          => 'Custom Area',
        'id'            => 'custom-area',
        'before_widget' => '<div class="custom-widget">',
        'after_widget'  => '</div>',
    ]);
}, 15); // Na madeit_widgets_init
```

### Performance optimalisatie
```php
add_filter('madeit_content_width', function($width) {
    // Bredere content voor specifieke paginas
    if (is_page_template('landing-page.php')) {
        return 1140;
    }
    return $width;
});
```

## Debugging Hooks

Voor development en debugging:

```php
// Log alle gebruikte hooks
add_action('all', function($hook) {
    if (strpos($hook, 'madeit_') === 0) {
        error_log("Hook called: $hook");
    }
});

// Monitor filter usage
add_filter('all', function($value) {
    $filter = current_filter();
    if (strpos($filter, 'madeit_') === 0) {
        error_log("Filter applied: $filter");
    }
    return $value;
});
```

## Best Practices

### 1. Gebruik Child Themes
```php
// In child theme functions.php
add_action('after_setup_theme', function() {
    // Custom setup na parent theme
}, 15);
```

### 2. Respecteer Prioriteiten
```php
// Pas kleuren aan NA thema setup
add_action('wp_head', 'custom_colors', 25);
```

### 3. Conditionele Hooks
```php
if (defined('MADEIT_CUSTOM_COLOR') && MADEIT_CUSTOM_COLOR) {
    add_filter('madeit_colorscheme', 'custom_colors');
}
```

### 4. Performance Overwegingen
```php
// Alleen laden wanneer nodig
if (is_woocommerce() || is_cart() || is_checkout()) {
    add_action('wp_enqueue_scripts', 'custom_woo_scripts');
}
```

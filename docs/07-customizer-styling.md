# Customizer en Styling

Het Made I.T. thema biedt uitgebreide customization mogelijkheden via de WordPress Customizer en een geavanceerd color/styling systeem.

## WordPress Customizer Integratie

### Customizer Setup
Het thema registreert verschillende customizer secties en controls:

```php
function madeit_customize_register($wp_customize) {
    // Theme options section
    $wp_customize->add_section('madeit_theme_options', [
        'title'    => __('Made I.T. Theme Options', 'madeit'),
        'priority' => 30,
    ]);
    
    // Color scheme section  
    $wp_customize->add_section('madeit_colors', [
        'title'    => __('Colors', 'madeit'),
        'priority' => 40,
    ]);
    
    // Layout options section
    $wp_customize->add_section('madeit_layout', [
        'title'    => __('Layout Options', 'madeit'),
        'priority' => 50,
    ]);
}
add_action('customize_register', 'madeit_customize_register');
```

### Color Scheme Configuratie

#### Kleurenschema Selectie
```php
$wp_customize->add_setting('colorscheme', [
    'default'           => 'light',
    'sanitize_callback' => 'madeit_sanitize_colorscheme',
    'transport'         => 'postMessage',
]);

$wp_customize->add_control('colorscheme', [
    'type'     => 'radio',
    'label'    => __('Color Scheme', 'madeit'),
    'section'  => 'madeit_colors',
    'choices'  => [
        'light'  => __('Light', 'madeit'),
        'dark'   => __('Dark', 'madeit'),
        'custom' => __('Custom', 'madeit'),
    ],
]);
```

#### Custom Kleuren
Wanneer 'custom' kleurenschema is geselecteerd:

```php
// Primary color
$wp_customize->add_setting('primary_color_rgb', [
    'default'           => MADEIT_PRIMARY_COLOR,
    'sanitize_callback' => 'sanitize_hex_color',
    'transport'         => 'postMessage',
]);

$wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'primary_color_rgb', [
    'label'           => __('Primary Color', 'madeit'),
    'section'         => 'madeit_colors',
    'active_callback' => function() {
        return get_theme_mod('colorscheme') === 'custom';
    },
]));

// Alle andere kleuren (secondary, success, info, warning, danger, text, background)
```

### Layout Opties

#### Page Layout
```php
$wp_customize->add_setting('page_layout', [
    'default'           => 'two-column',
    'sanitize_callback' => 'madeit_sanitize_page_layout',
]);

$wp_customize->add_control('page_layout', [
    'type'    => 'radio',
    'label'   => __('Page Layout', 'madeit'),
    'section' => 'madeit_layout',
    'choices' => [
        'one-column'  => __('One Column', 'madeit'),
        'two-column'  => __('Two Column', 'madeit'),
    ],
]);
```

#### Header Opties
```php
// Logo size
$wp_customize->add_setting('header_logo_size', [
    'default'           => 'medium',
    'sanitize_callback' => 'madeit_sanitize_select',
]);

$wp_customize->add_control('header_logo_size', [
    'type'    => 'select',
    'label'   => __('Logo Size', 'madeit'),
    'section' => 'madeit_layout',
    'choices' => [
        'small'  => __('Small', 'madeit'),
        'medium' => __('Medium', 'madeit'),
        'large'  => __('Large', 'madeit'),
    ],
]);

// Fixed header
$wp_customize->add_setting('header_fixed', [
    'default'           => false,
    'sanitize_callback' => 'wp_validate_boolean',
]);

$wp_customize->add_control('header_fixed', [
    'type'    => 'checkbox',
    'label'   => __('Fixed Header', 'madeit'),
    'section' => 'madeit_layout',
]);
```

### Typography Opties

#### Font Family
```php
$wp_customize->add_setting('font_family', [
    'default'           => 'Libre Franklin',
    'sanitize_callback' => 'sanitize_text_field',
]);

$wp_customize->add_control('font_family', [
    'type'    => 'select',
    'label'   => __('Font Family', 'madeit'),
    'section' => 'madeit_typography',
    'choices' => [
        'Libre Franklin' => 'Libre Franklin',
        'Open Sans'      => 'Open Sans',
        'Roboto'         => 'Roboto',
        'Lato'           => 'Lato',
        'Montserrat'     => 'Montserrat',
    ],
]);
```

## Color System

### madeit_get_theme_color()
Centrale functie voor het ophalen van thema kleuren:

```php
function madeit_get_theme_color($type, $default) {
    if (MADEIT_CUSTOM_COLOR) {
        return $default;
    }
    return get_theme_mod($type, $default);
}
```

### Custom Colors CSS Generatie

#### madeit_colors_css_wrap()
Genereert inline CSS voor custom kleuren:

```php
function madeit_colors_css_wrap() {
    if (!MADEIT_CUSTOM_COLOR && 'custom' !== get_theme_mod('colorscheme')) {
        return;
    }
    
    if (is_admin()) {
        return;
    }
    
    if (!madeit_css_cacheExists()) {
        require_once get_parent_theme_file_path('/inc/color-patterns.php');
        ?>
        <style type="text/css" id="custom-theme-colors">
            <?php echo madeit_custom_colors_css(); ?>
        </style>
        <?php
    }
}
```

#### CSS Variabelen Systeem
```css
:root {
    --madeit-primary-color: <?php echo madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR); ?>;
    --madeit-secondary-color: <?php echo madeit_get_theme_color('secondary_color_rgb', MADEIT_SECONDARY_COLOR); ?>;
    --madeit-success-color: <?php echo madeit_get_theme_color('success_color_rgb', MADEIT_SUCCESS_COLOR); ?>;
    --madeit-info-color: <?php echo madeit_get_theme_color('info_color_rgb', MADEIT_INFO_COLOR); ?>;
    --madeit-warning-color: <?php echo madeit_get_theme_color('warning_color_rgb', MADEIT_WARNING_COLOR); ?>;
    --madeit-danger-color: <?php echo madeit_get_theme_color('danger_color_rgb', MADEIT_DANGER_COLOR); ?>;
    --madeit-text-color: <?php echo madeit_get_theme_color('text_color_rgb', MADEIT_TEXT_COLOR); ?>;
    --madeit-background-color: <?php echo madeit_get_theme_color('background_color_rgb', MADEIT_BACKGROUND_COLOR); ?>;
}
```

### Bootstrap Color Integration
```css
/* Bootstrap utilities met custom kleuren */
.bg-primary { background-color: var(--madeit-primary-color) !important; }
.bg-secondary { background-color: var(--madeit-secondary-color) !important; }
.bg-success { background-color: var(--madeit-success-color) !important; }
.bg-info { background-color: var(--madeit-info-color) !important; }
.bg-warning { background-color: var(--madeit-warning-color) !important; }
.bg-danger { background-color: var(--madeit-danger-color) !important; }

.text-primary { color: var(--madeit-primary-color) !important; }
.text-secondary { color: var(--madeit-secondary-color) !important; }
.text-success { color: var(--madeit-success-color) !important; }
.text-info { color: var(--madeit-info-color) !important; }
.text-warning { color: var(--madeit-warning-color) !important; }
.text-danger { color: var(--madeit-danger-color) !important; }

.btn-primary {
    background-color: var(--madeit-primary-color);
    border-color: var(--madeit-primary-color);
}

.btn-primary:hover {
    background-color: var(--madeit-primary-color);
    border-color: var(--madeit-primary-color);
    opacity: 0.85;
}
```

## CSS Caching Systeem

### Cache Management
```php
function madeit_css_cacheExists() {
    $cache_file = get_stylesheet_directory() . '/cache/custom-colors.css';
    return file_exists($cache_file);
}

function madeit_css_isCacheUpToDate() {
    $cache_file = get_stylesheet_directory() . '/cache/custom-colors.css';
    $cache_time = filemtime($cache_file);
    $theme_mod_time = get_option('theme_mods_' . get_option('stylesheet'));
    
    return $cache_time > strtotime($theme_mod_time);
}

function madeit_css_generateCache() {
    $cache_dir = get_stylesheet_directory() . '/cache/';
    if (!file_exists($cache_dir)) {
        wp_mkdir_p($cache_dir);
    }
    
    require_once get_parent_theme_file_path('/inc/color-patterns.php');
    $css = madeit_custom_colors_css();
    
    file_put_contents($cache_dir . 'custom-colors.css', $css);
}

function madeit_css_cacheUrl() {
    return get_stylesheet_directory_uri() . '/cache/custom-colors.css';
}
```

### Automatische Cache Regeneratie
```php
// Cache regeneration bij customizer save
add_action('customize_save_after', function() {
    if (MADEIT_CUSTOM_COLOR || 'custom' === get_theme_mod('colorscheme')) {
        madeit_css_generateCache();
    }
});
```

## Gradient System

### madeit_generate_gradients_colors()
Genereert gradient presets gebaseerd op thema kleuren:

```php
function madeit_generate_gradients_colors() {
    $primary = madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR);
    $secondary = madeit_get_theme_color('secondary_color_rgb', MADEIT_SECONDARY_COLOR);
    
    return [
        [
            'name'     => __('Primary to Secondary', 'madeit'),
            'gradient' => "linear-gradient(135deg, {$primary} 0%, {$secondary} 100%)",
            'slug'     => 'primary-to-secondary',
        ],
        [
            'name'     => __('Primary to Transparent', 'madeit'),
            'gradient' => "linear-gradient(135deg, {$primary} 0%, transparent 100%)",
            'slug'     => 'primary-to-transparent',
        ],
        [
            'name'     => __('Diagonal Primary', 'madeit'),
            'gradient' => "linear-gradient(45deg, {$primary} 0%, " . madeit_adjust_color_brightness($primary, -20) . " 100%)",
            'slug'     => 'diagonal-primary',
        ],
    ];
}
```

### Color Manipulation Utilities
```php
function madeit_adjust_color_brightness($hex, $steps) {
    // Converteer hex naar RGB
    $hex = str_replace('#', '', $hex);
    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));
    
    // Pas brightness aan
    $r = max(0, min(255, $r + $steps));
    $g = max(0, min(255, $g + $steps));
    $b = max(0, min(255, $b + $steps));
    
    return '#' . dechex($r) . dechex($g) . dechex($b);
}

function madeit_hex_to_rgba($hex, $alpha = 1) {
    $hex = str_replace('#', '', $hex);
    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));
    
    return "rgba({$r}, {$g}, {$b}, {$alpha})";
}
```

## Dark Mode Support

### Dark Color Scheme
```css
/* Dark mode kleuren */
[data-theme="dark"] {
    --madeit-background-color: #1a1a1a;
    --madeit-text-color: #ffffff;
    --madeit-primary-color: #4da6ff;
    --madeit-secondary-color: #6c757d;
}

body[data-theme="dark"] {
    background-color: var(--madeit-background-color);
    color: var(--madeit-text-color);
}

[data-theme="dark"] .bg-light {
    background-color: #343a40 !important;
}

[data-theme="dark"] .text-dark {
    color: #ffffff !important;
}
```

### Dark Mode Toggle
```javascript
function madeit_toggle_dark_mode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('madeit-theme', newTheme);
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('madeit-theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
});
```

## Responsive Styling

### Breakpoint Variabelen
```css
:root {
    --breakpoint-xs: 0;
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
    --breakpoint-xxl: 1400px;
}
```

### Container Queries (moderne browsers)
```css
@container (min-width: 768px) {
    .madeit-container {
        padding: 2rem;
    }
}

@container (max-width: 767px) {
    .madeit-container {
        padding: 1rem;
    }
}
```

## Custom CSS Classes

### Utility Classes
```css
/* Spacing utilities */
.spacing-none { margin: 0 !important; padding: 0 !important; }
.spacing-xs { margin: 0.25rem !important; }
.spacing-sm { margin: 0.5rem !important; }
.spacing-md { margin: 1rem !important; }
.spacing-lg { margin: 1.5rem !important; }
.spacing-xl { margin: 3rem !important; }

/* Animation utilities */
.fade-in {
    opacity: 0;
    animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeIn {
    to { opacity: 1; }
}

.slide-up {
    transform: translateY(20px);
    opacity: 0;
    animation: slideUp 0.5s ease-out forwards;
}

@keyframes slideUp {
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
```

### Component Classes
```css
/* Card component */
.madeit-card {
    background: var(--madeit-background-color);
    border: 1px solid rgba(0,0,0,0.125);
    border-radius: 0.375rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
    transition: box-shadow 0.15s ease-in-out;
}

.madeit-card:hover {
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
}

/* Button variants */
.btn-outline-primary {
    color: var(--madeit-primary-color);
    border-color: var(--madeit-primary-color);
}

.btn-outline-primary:hover {
    background-color: var(--madeit-primary-color);
    border-color: var(--madeit-primary-color);
    color: white;
}
```

## Sanitization Functions

### Color Sanitization
```php
function madeit_sanitize_hex_color($color) {
    if ('' === $color) {
        return '';
    }
    
    // 3 of 6 hex digits, of leeg om default te gebruiken
    if (preg_match('|^#([A-Fa-f0-9]{3}){1,2}$|', $color)) {
        return $color;
    }
    
    return null;
}
```

### Select Option Sanitization
```php
function madeit_sanitize_select($input, $setting) {
    $input = sanitize_key($input);
    $choices = $setting->manager->get_control($setting->id)->choices;
    
    return array_key_exists($input, $choices) ? $input : $setting->default;
}
```

### Page Layout Sanitization
```php
function madeit_sanitize_page_layout($layout) {
    $valid_layouts = ['one-column', 'two-column'];
    return in_array($layout, $valid_layouts) ? $layout : 'two-column';
}
```

## Performance Optimizations

### Critical CSS
```php
function madeit_critical_css() {
    // Inline critical CSS voor above-the-fold content
    $critical_css = '
        body { font-family: var(--madeit-font-family); }
        .navbar { background-color: var(--madeit-background-color); }
        .navbar-brand { color: var(--madeit-primary-color); }
        h1, h2, h3 { color: var(--madeit-text-color); }
    ';
    
    echo '<style id="madeit-critical-css">' . $critical_css . '</style>';
}
add_action('wp_head', 'madeit_critical_css', 1);
```

### CSS Minification
```php
function madeit_minify_css($css) {
    // Verwijder comments
    $css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
    
    // Verwijder tabs, spaties, newlines
    $css = str_replace(["\r\n", "\r", "\n", "\t", '  ', '    ', '    '], '', $css);
    
    return $css;
}
```

## Troubleshooting

### Veelvoorkomende Problemen

1. **Kleuren worden niet toegepast**
   - Controleer of `MADEIT_CUSTOM_COLOR` correct is ingesteld
   - Verificeer colorscheme setting in customizer
   - Controleer CSS cache

2. **Customizer changes niet zichtbaar**
   - Clear cache bestanden
   - Controleer browser cache
   - Verificeer preview mode

3. **Dark mode werkt niet**
   - Controleer JavaScript console
   - Verificeer localStorage support
   - Controleer CSS selector specificity

### Debug Tools
```php
// Customizer debug informatie
add_action('wp_footer', function() {
    if (WP_DEBUG && current_user_can('manage_options')) {
        echo '<script>';
        echo 'console.log("Color Scheme:", "' . get_theme_mod('colorscheme', 'light') . '");';
        echo 'console.log("Custom Colors:", ' . (MADEIT_CUSTOM_COLOR ? 'true' : 'false') . ');';
        echo 'console.log("Primary Color:", "' . madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR) . '");';
        echo '</script>';
    }
});
```

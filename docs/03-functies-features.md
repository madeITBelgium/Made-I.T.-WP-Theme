# Functies en Features

Het Made I.T. thema bevat een uitgebreide set van functies en features die de functionaliteit van WordPress uitbreiden en verbeteren.

## Thema Setup Functies

### madeit_setup()
Hoofdfunctie die het thema initialiseert en WordPress features configureert.

**Features die worden geactiveerd:**
- `automatic-feed-links`: Automatische RSS feed links
- `title-tag`: WordPress title tag ondersteuning  
- `woocommerce`: WooCommerce ondersteuning
- `post-thumbnails`: Featured images
- `html5`: HTML5 markup voor forms en galerijen
- `post-formats`: Ondersteuning voor verschillende post formaten
- `custom-logo`: Custom logo ondersteuning
- `customize-selective-refresh-widgets`: Selective refresh voor widgets

**Geregistreerde image sizes:**
```php
add_image_size('madeit-featured-image', 2000, 1200, true);
add_image_size('madeit-featured-blog-image', 1200, 630, true);
add_image_size('madeit-thumbnail-avatar', 100, 100, true);
```

**Geregistreerde menu locaties:**
- `top`: Hoofdmenu
- `upper-top`: Menu boven hoofdmenu
- `upper-bottom`: Menu onder hoofdmenu  
- `social`: Social media links menu

### madeit_gutenberg_support()
Configureert Gutenberg/Block Editor ondersteuning.

**Features:**
- `align-wide`: Brede en full-width alignment
- `responsive-embeds`: Responsive embeds
- `editor-color-palette`: Custom kleurenpalette
- `editor-gradient-presets`: Gradient presets

## Content en Layout Functies

### madeit_content_width()
Bepaalt de content breedte gebaseerd op layout en sidebar configuratie.

**Standaard breedtes:**
- Met sidebar: 580px
- Zonder sidebar: 740px
- Front page: 740px

**Voorbeeld:**
```php
function madeit_content_width() {
    $content_width = $GLOBALS['content_width'];
    
    // Controleer layout
    $page_layout = get_theme_mod('page_layout');
    
    if ('one-column' === $page_layout) {
        $content_width = 740;
    }
    
    // Controleer sidebar aanwezigheid
    if (is_single() && !is_active_sidebar('sidebar-1')) {
        $content_width = 740;
    }
    
    $GLOBALS['content_width'] = apply_filters('madeit_content_width', $content_width);
}
```

### madeit_excerpt_more()
Customized "read more" link voor excerpts.

**Functionaliteit:**
- Vervangt standaard "[...]" met styled link
- Gebruikt Bootstrap button classes
- Bevat accessibility tekst

## Widget Areas

### madeit_widgets_init()
Registreert alle widget areas/sidebars.

**Geregistreerde sidebars:**
1. **Right Sidebar** (`sidebar-1`): Hoofdsidebar voor blog en archief paginas
2. **Left Sidebar** (`sidebar-left`): Linker sidebar voor speciale layouts
3. **Footer 1-4** (`sidebar-2` t/m `sidebar-5`): Footer widget areas
4. **Below Index Blog** (`below-index-1`): Widget area onder blog lijst

**Voorbeeld configuratie:**
```php
register_sidebar([
    'name'          => __('Right Sidebar', 'madeit'),
    'id'            => 'sidebar-1',
    'description'   => __('Add widgets here to appear in your sidebar.', 'madeit'),
    'before_widget' => '<section id="%1$s" class="widget %2$s">',
    'after_widget'  => '</section>',
    'before_title'  => '<h2 class="widget-title">',
    'after_title'   => '</h2>',
]);
```

## Asset Management

### madeit_scripts()
Hoofdfunctie voor het laden van CSS en JavaScript bestanden.

**Geladen assets:**
- Bootstrap CSS/JS (versie gebaseerd op `MADEIT_BOOTSTRAP_VERSION`)
- Thema stylesheet
- AOS (Animate on Scroll) library
- Custom JavaScript bestanden
- Conditionele assets (datepicker, infinite scroll)

**Bootstrap 4 vs 5 Detectie:**
```php
if (MADEIT_BOOTSTRAP_VERSION === 5) {
    wp_enqueue_style('madeit-bootstrap-style', 
        get_theme_file_uri('/assets/bootstrap-5/style.css'));
    wp_enqueue_script('bootstrap', 
        get_theme_file_uri('/assets/bootstrap-5/script.js'));
} else {
    wp_enqueue_style('madeit-bootstrap-style', 
        get_theme_file_uri('/assets/bootstrap-46/style.css'));
    wp_enqueue_script('bootstrap', 
        get_theme_file_uri('/assets/bootstrap-46/script.js'));
}
```

### prefix_add_footer_styles()
Laadt CSS bestanden in de footer voor betere performance.

**Footer geladen assets:**
- FontAwesome (versie 4.7 of 5)
- Bootstrap Datepicker CSS (indien ingeschakeld)

## Image Handling

### madeit_content_image_sizes_attr()
Verbetert responsive image functionaliteit voor content afbeeldingen.

**Functionaliteit:**
- Automatische `sizes` attribute voor afbeeldingen
- Responsive breakpoints gebaseerd op layout
- Optimalisatie voor verschillende schermgroottes

### madeit_post_thumbnail_sizes_attr()
Specifieke responsive image handling voor post thumbnails.

**Size configuratie:**
```php
if (is_archive() || is_search() || is_home()) {
    $attr['sizes'] = '(max-width: 767px) 89vw, (max-width: 1000px) 54vw, 580px';
} else {
    $attr['sizes'] = '100vw';
}
```

## Color System

### madeit_get_theme_color()
Hulpfunctie voor het ophalen van thema kleuren.

```php
function madeit_get_theme_color($type, $default) {
    if (MADEIT_CUSTOM_COLOR) {
        return $default;
    }
    return get_theme_mod($type, $default);
}
```

### madeit_colors_css_wrap()
Genereert inline CSS voor custom kleuren.

**Functionaliteit:**
- Alleen geladen als `MADEIT_CUSTOM_COLOR` actief is
- Gebruikt caching systeem voor performance
- Bevat alle thema kleuren als CSS variabelen

## Performance Features

### remove_css_js_ver()
Verwijdert version parameters uit CSS/JS URLs (indien `DISABLE_VER_URL` actief).

**Voordelen:**
- Betere caching door proxies/CDNs
- Schonere URLs
- Verbeterde performance

### remove_jquery_migrate_and_move_jquery_to_footer()
Optimalisaties voor jQuery loading.

**Functionaliteit:**
- Verplaatst jQuery naar footer
- Behoudt core functionaliteit
- Verbetert page load speed

## Infinite Scroll

### madeit_infinite_options_to_script()
Configureert infinite scroll functionaliteit voor blog en shop.

**Configureerbare selectors:**
```php
$nav_selector = '.woocommerce-pagination, .pagination';
$next_selector = 'ul.page-numbers a.next, .pagination .next';
$item_selector = 'div.row.columns-3 .col, #primary .card-columns .card';
$content_selector = 'div.row.columns-3, #primary .card-columns';
```

**JavaScript configuratie:**
```php
wp_localize_script('madeit-infinitescroll', 'madeit_infinite', [
    'navSelector'     => $nav_selector,
    'nextSelector'    => $next_selector,
    'itemSelector'    => $item_selector,
    'contentSelector' => $content_selector,
    'shop'            => is_shop() || is_product_category(),
]);
```

## Font Management

### madeit_fonts_url()
Genereert Google Fonts URL.

**Standaard font:**
- Libre Franklin (300, 400, 600, 800 weights)
- Inclusief italic variants
- Latin en Latin Extended character sets

**Voorbeeld:**
```php
function madeit_fonts_url() {
    $libre_franklin = _x('on', 'Libre Franklin font: on or off', 'madeit');
    
    if ('off' !== $libre_franklin) {
        $font_families[] = 'Libre Franklin:300,300i,400,400i,600,600i,800,800i';
        
        $query_args = [
            'family' => urlencode(implode('|', $font_families)),
            'subset' => urlencode('latin,latin-ext'),
        ];
        
        return add_query_arg($query_args, 'https://fonts.googleapis.com/css');
    }
    
    return '';
}
```

## JavaScript Detection

### madeit_javascript_detection()
Detecteert JavaScript ondersteuning en past HTML class aan.

**Functionaliteit:**
- Vervangt `no-js` class met `js` class
- Uitgevoerd in `<head>` voor immediate effect
- Gebruikt voor progressive enhancement

```javascript
(function(html){
    html.className = html.className.replace(/\bno-js\b/,'js')
})(document.documentElement);
```

## Bootstrap Integration

### madeit_wp_bootstrap_head()
Lost admin bar conflicts op met fixed navbar.

**CSS aanpassingen:**
```css
body.logged-in .navbar.fixed-top { 
    top: 46px !important; 
}

@media only screen and (min-width: 783px) {
    body.logged-in .navbar.fixed-top { 
        top: 28px !important; 
    }
}
```

## Template Functions

### madeit_front_page_template()
Controleert front page template gebruik.

### madeit_widget_tag_cloud_args()
Standaardiseert tag cloud widget weergave.

**Configuratie:**
```php
$args['largest'] = 1;
$args['smallest'] = 1;
$args['unit'] = 'em';
$args['format'] = 'list';
```

## Image Popup System

### madeit_add_image_popup_class()
Voegt lightbox functionaliteit toe aan afbeeldingen met `do-lightbox` class.

**Functionaliteit:**
- DOM parsing voor afbeelding detectie
- Automatische class toevoeging
- UTF-8 encoding preservation

## Debugging en Development

### Development Mode Detection
```php
if (wp_get_environment_type() === 'development') {
    // Development specific features
    define('WP_DEBUG', true);
    define('MADEIT_FEEDBACK', true);
}
```

### Performance Monitoring
Het thema bevat hooks voor performance monitoring en debugging:

```php
// Content width filter
$content_width = apply_filters('madeit_content_width', $content_width);

// Color system filter
$colors = apply_filters('madeit_colorscheme', $default_colors);
```

## Security Features

### Input Sanitization
Alle user input wordt gesanitized volgens WordPress standards:

```php
// Voorbeeld van input sanitization
$user_input = sanitize_text_field($_POST['field']);
$html_input = wp_kses_post($_POST['content']);
```

### Nonce Verification
Voor alle forms en AJAX calls:

```php
if (!wp_verify_nonce($_POST['nonce'], 'madeit_action')) {
    wp_die('Security check failed');
}
```

# Configuratie Constanten

Het Made I.T. thema gebruikt een uitgebreid systeem van PHP constanten voor configuratie. Deze constanten kunnen worden gedefinieerd in `wp-config.php` of in de `functions.php` van een child theme.

## Basis Configuratie

### MADEIT_VERSION
- **Type**: String
- **Standaard**: '2.10.0'
- **Beschrijving**: Versienummer van het thema
- **Gebruik**: Voor cache busting en version checking

```php
define('MADEIT_VERSION', '2.10.0');
```

## Kleur Configuratie

### MADEIT_CUSTOM_COLOR
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Schakelt aangepaste kleurensysteem in/uit
- **Gebruik**: Wanneer `true`, worden kleuren uit customizer gebruikt

```php
define('MADEIT_CUSTOM_COLOR', true);
```

### Kleur Constanten

#### MADEIT_TEXT_COLOR
- **Type**: String (Hex color)
- **Standaard**: '#212529'
- **Beschrijving**: Hoofdtekstkleur van het thema

#### MADEIT_BACKGROUND_COLOR
- **Type**: String (Hex color)
- **Standaard**: '#ffffff'
- **Beschrijving**: Achtergrondkleur van het thema

#### MADEIT_PRIMARY_COLOR
- **Type**: String (Hex color)
- **Standaard**: '#0051A8'
- **Beschrijving**: Primaire merkkleur (knoppen, links, etc.)

#### MADEIT_SECONDARY_COLOR
- **Type**: String (Hex color)
- **Standaard**: '#868e96'
- **Beschrijving**: Secundaire kleur voor minder belangrijke elementen

#### MADEIT_SUCCESS_COLOR
- **Type**: String (Hex color)
- **Standaard**: '#28a745'
- **Beschrijving**: Kleur voor succes berichten en positive actions

#### MADEIT_INFO_COLOR
- **Type**: String (Hex color)
- **Standaard**: '#17a2b8'
- **Beschrijving**: Kleur voor informatieve berichten

#### MADEIT_WARNING_COLOR
- **Type**: String (Hex color)
- **Standaard**: '#ffc107'
- **Beschrijving**: Kleur voor waarschuwingen

#### MADEIT_DANGER_COLOR
- **Type**: String (Hex color)
- **Standaard**: '#dc3545'
- **Beschrijving**: Kleur voor foutmeldingen en gevaarlijke acties

### Voorbeeld Kleur Configuratie
```php
// Brand colors instellen
define('MADEIT_CUSTOM_COLOR', true);
define('MADEIT_PRIMARY_COLOR', '#FF6B35');
define('MADEIT_SECONDARY_COLOR', '#004E89');
define('MADEIT_TEXT_COLOR', '#2C3E50');
define('MADEIT_BACKGROUND_COLOR', '#FAFAFA');
```

## Framework Configuratie

### MADEIT_BOOTSTRAP_VERSION
- **Type**: Integer
- **Standaard**: `4`
- **Opties**: `4` (Bootstrap 4.6) of `5` (Bootstrap 5.x)
- **Beschrijving**: Bepaalt welke Bootstrap versie wordt geladen

```php
define('MADEIT_BOOTSTRAP_VERSION', 5);
```

### MADEIT_BOOTSTRAP_POPPER
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Bepaalt of Popper.js wordt geladen (voor Bootstrap dropdowns/tooltips)

```php
define('MADEIT_BOOTSTRAP_POPPER', true);
```

## UI/UX Features

### MADEIT_FONTAWESOME
- **Type**: Float
- **Standaard**: `4.7` (of `5` als MADEIT_REVIEWS = true)
- **Opties**: `4.7` of `5`
- **Beschrijving**: FontAwesome versie voor iconen

```php
define('MADEIT_FONTAWESOME', 5);
```

### MADEIT_ADD_DATEPICKER
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Voegt Bootstrap datepicker toe

```php
define('MADEIT_ADD_DATEPICKER', true);
```

### MADEIT_POPUPS
- **Type**: Boolean
- **Standaard**: `true`
- **Beschrijving**: Schakelt popup functionaliteit in/uit

```php
define('MADEIT_POPUPS', false);
```

### MADEIT_INFINITE_SCROLL
- **Type**: Boolean
- **Standaard**: `true`
- **Beschrijving**: Schakelt infinite scroll in voor blog en shop

```php
define('MADEIT_INFINITE_SCROLL', false);
```

## Header en Footer Configuratie

### HEADER_UPPER_TOP
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Toont extra menu boven hoofdmenu

### HEADER_UPPER_BOTTOM
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Toont extra menu onder hoofdmenu

### SHOW_LOGIN_IN_FOOTER
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Toont login link in footer

### SHOW_MADEIT_IN_FOOTER
- **Type**: Boolean
- **Standaard**: `true`
- **Beschrijving**: Toont "Powered by Made I.T." in footer

```php
// Header configuratie
define('HEADER_UPPER_TOP', true);
define('HEADER_UPPER_BOTTOM', false);

// Footer configuratie
define('SHOW_LOGIN_IN_FOOTER', true);
define('SHOW_MADEIT_IN_FOOTER', false);
```

## Content Configuratie

### POST_AUTHOR
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Toont auteur informatie bij posts

### POST_EDIT_TIME
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Toont laatste bewerktijd van posts

### POST_TIME_FORMAT
- **Type**: String
- **Standaard**: 'long'
- **Opties**: 'long', 'short', 'relative'
- **Beschrijving**: Format voor post datum/tijd

### SHOW_SINGLE_SIDEBAR
- **Type**: Boolean
- **Standaard**: `true`
- **Beschrijving**: Toont sidebar op enkele post paginas

```php
// Content configuratie
define('POST_AUTHOR', true);
define('POST_EDIT_TIME', true);
define('POST_TIME_FORMAT', 'relative');
define('SHOW_SINGLE_SIDEBAR', false);
```

## Performance Configuratie

### DISABLE_VER_URL
- **Type**: Boolean
- **Standaard**: `true`
- **Beschrijving**: Verwijdert version parameters uit CSS/JS URLs

### WWW_REDIRECT
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Forceert www redirect

```php
// Performance optimalisatie
define('DISABLE_VER_URL', true);
define('WWW_REDIRECT', true);
```

## WooCommerce Configuratie

### WOO_SHOPING_CART_MENU_STYLE
- **Type**: Integer
- **Standaard**: `2`
- **Opties**: `1` (simpel) of `2` (uitgebreid)
- **Beschrijving**: Stijl van winkelwagen in menu

### MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX
- **Type**: Boolean
- **Standaard**: `true`
- **Beschrijving**: AJAX toevoegen aan winkelwagen

### MADEIT_WOO_B2B
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Schakelt B2B functionaliteiten in

### MADEIT_WOO_B2B_ONLY
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Maakt shop alleen toegankelijk voor B2B klanten

```php
// WooCommerce configuratie
define('WOO_SHOPING_CART_MENU_STYLE', 1);
define('MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX', true);
define('MADEIT_WOO_B2B', true);
define('MADEIT_WOO_B2B_ONLY', false);
```

## Geavanceerde Features

### MADEIT_ADVANCED_BLOCKS
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Schakelt geavanceerde Gutenberg blocks in

### MADEIT_REVIEWS
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Schakelt review systeem in

### MADEIT_RECEIVE_REVIEWS
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Staat het ontvangen van reviews toe

### MADEIT_FEEDBACK
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Schakelt feedback systeem in (toegevoegd in v2.11.0)

### MADEIT_EMAILSERVICE_NEWSLETTER_LIST
- **Type**: Boolean
- **Standaard**: `false`
- **Beschrijving**: Schakelt nieuwsbrief integratie in

```php
// Geavanceerde features
define('MADEIT_ADVANCED_BLOCKS', true);
define('MADEIT_REVIEWS', true);
define('MADEIT_RECEIVE_REVIEWS', true);
define('MADEIT_FEEDBACK', true);
define('MADEIT_EMAILSERVICE_NEWSLETTER_LIST', true);
```

## Configuratie Best Practices

### 1. Child Theme Gebruik
Plaats configuratie altijd in een child theme:

```php
// In child-theme/functions.php
<?php
// Basis configuratie
define('MADEIT_BOOTSTRAP_VERSION', 5);
define('MADEIT_CUSTOM_COLOR', true);
define('MADEIT_PRIMARY_COLOR', '#your-brand-color');

// Laad parent theme
add_action('wp_enqueue_scripts', 'child_theme_enqueue_styles');
function child_theme_enqueue_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
}
```

### 2. Environment Specifieke Configuratie
```php
// Verschillende configuratie per omgeving
if (wp_get_environment_type() === 'development') {
    define('MADEIT_FEEDBACK', true);
    define('DISABLE_VER_URL', false);
} else {
    define('MADEIT_FEEDBACK', false);
    define('DISABLE_VER_URL', true);
}
```

### 3. Conditionele Feature Activatie
```php
// Alleen WooCommerce features als plugin actief is
if (class_exists('WooCommerce')) {
    define('MADEIT_WOO_B2B', true);
    define('WOO_SHOPING_CART_MENU_STYLE', 2);
}
```

## Deprecated Constanten

Sommige constanten zijn verouderd maar blijven ondersteund voor backwards compatibility:

- **MADEIT_OLD_GUTENBERG**: Vervangen door MADEIT_ADVANCED_BLOCKS
- **SHOW_AUTHOR_INFO**: Vervangen door POST_AUTHOR

## Troubleshooting

### Veelvoorkomende Problemen

1. **Kleuren werken niet**: Controleer of `MADEIT_CUSTOM_COLOR` is ingesteld op `true`
2. **Bootstrap conflicten**: Zorg dat `MADEIT_BOOTSTRAP_VERSION` correct is ingesteld
3. **Features werken niet**: Controleer of alle afhankelijke constanten zijn ingesteld

### Debug Mode
```php
// Voor debugging
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

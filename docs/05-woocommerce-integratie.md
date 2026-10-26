# WooCommerce Integratie

Het Made I.T. thema biedt uitgebreide ondersteuning voor WooCommerce met custom styling, aangepaste functionaliteiten en B2B features.

## WebsiteTool Webshoptracking

De bestaande WebsiteTool-integratie wordt automatisch uitgebreid wanneer WooCommerce actief is. Er is geen tweede installatiecode nodig. Registreer het exacte webshopdomein in WebsiteTool en zorg dat de bestaande cookiebanner actief is.

| Actie | Moment | Gegevens |
| --- | --- | --- |
| `wtTrackProductView` | Productdetailpagina | Product-ID, naam, numerieke prijs, eerste categorie, SKU en aantal |
| `wtTrackAddToCart` | Na een bevestigde toevoeging door WooCommerce | Het daadwerkelijk toegevoegde product of de variatie en het toegevoegde aantal |
| `wtTrackCheckout` | Openen van de checkout, niet de betaal- of bevestigingsendpoint | Actueel numeriek winkelwagentotaal |
| `wtTrackPurchase` | Bevestigingspagina van een order met status `processing`, `completed` of `on-hold` | Bestelnummer, ordertotaal, facturatie-e-mailadres en bestelde producten |

De integratie ondersteunt gewone paginaverzoeken, de eigen AJAX-winkelwagen van het thema, de klassieke WooCommerce-AJAX-events en het WooCommerce Blocks-signaal `wc-blocks_added_to_cart`. Mislukte toevoegingen leveren geen event op. Een productvariatie gebruikt zijn eigen ID en SKU en de categorie van het hoofdproduct.

Productweergaven en winkelwagentoevoegingen gebruiken de actuele weergaveprijs van WooCommerce. Aankopen gebruiken de opgeslagen productnaam en de regelprijs na korting, exclusief belasting, gedeeld door het aantal. Het aankoopbedrag is altijd het volledige ordertotaal, inclusief eventuele belastingen en verzendkosten; het wordt niet uit de producten berekend.

### Toestemming en initialisatie

Er wordt alleen verzonden wanneer CookieConsent de service `WebsiteTool` binnen `analytics` toestaat, de relevante trackingfunctie beschikbaar is en `window.wtinit === true`. Het script wacht maximaal ongeveer een minuut op de asynchrone tracker en respecteert ingetrokken toestemming. Zonder cookietoestemmingsmodule wordt niets verstuurd. Het bestaande tracking script blijft verantwoordelijk voor paginaweergaven en wordt niet opnieuw geladen.

Het facturatie-e-mailadres is een persoonsgegeven en wordt uitsluitend in de aankoopaanroep meegestuurd na toestemming. Controleer of deze verwerking past bij de privacyverklaring en rechtsgrond van de webshop. Er worden geen betaalgegevens meegestuurd.

### Aankopen en dubbele metingen

Ordergegevens worden alleen beschikbaar gemaakt op de bevestigingspagina met een geldige ordersleutel of voor de ingelogde eigenaar van de bestelling. Orders met status `pending`, `failed`, `cancelled` of `refunded` worden niet als aankoop verstuurd. `on-hold` telt wel mee voor bevestigde bestellingen met bijvoorbeeld een offline betaalmethode.

Een aankoopmarkering per interne order-ID wordt opgeslagen in `localStorage`, met `sessionStorage` als alternatief. Hierdoor veroorzaakt verversen in dezelfde browser geen tweede aankoopaanroep. Als beide opslagvormen geblokkeerd zijn, wordt de aankoop overgeslagen om dubbele metingen te voorkomen. De markering bevat geen e-mailadres. Dit is geen serverbrede deduplicatie: een andere browser of gewiste opslag kan opnieuw meten. De WebsiteTool-aanroep geeft geen ontvangstbevestiging; aflevering bij netwerkproblemen kan daarom niet worden gegarandeerd.

Bestellingen die pas later buiten de bevestigingspagina een toegestane status krijgen, vereisen een nieuw bezoek aan die pagina. Deze browserintegratie verstuurt geen achtergrondconversies of terugbetalingen. Sluit winkelwagen, checkout en orderbevestigingen uit van paginacaching en vernieuw de paginacache tijdig, zodat de AJAX-nonce op gecachte productpagina's geldig blijft.

### Controleren

Voer de zelfstandige regressietests uit vanuit de themamap:

```sh
php bin/test-websitetool-ecommerce.php
node bin/test-websitetool-ecommerce.js
```

Test daarnaast met toestemming op het geregistreerde domein een productweergave, een succesvolle winkelwagentoevoeging, checkout en een testbestelling. Controleer in het netwerkpaneel de aanvragen naar `app.websitetool.be/ping/event`, met `e: "ecommerce"` en de verwachte actie in `a`. Ververs de bevestigingspagina: er mag geen tweede aankoop worden verstuurd. Herhaal zonder analytics-toestemming: er mogen geen WebsiteTool-metingen vertrekken.

Eigen doelen en promotie-events blijven optioneel handwerk via `wtTrackGoal` en `wtTrackContent`. Roep ze alleen na een geslaagde actie en met passende toestemming aan; automatische WebsiteTool-doelen hoeven niet opnieuw geregistreerd te worden.

## Basis WooCommerce Setup

### Theme Support
Het thema activeert WooCommerce ondersteuning in `madeit_setup()`:

```php
add_theme_support('woocommerce');
```

### Custom Image Sizes
Specifieke afbeeldingsformaten voor producten:

```php
// Product catalog thumbnails
$catalog = [
    'width'  => '300',
    'height' => '160', 
    'crop'   => 1,
];

// Single product images  
$single = [
    'width'  => '1200',
    'height' => '630',
    'crop'   => 1,
];

// Gallery thumbnails
$thumbnail = [
    'width'  => '300',
    'height' => '160', 
    'crop'   => 0,
];

update_option('shop_catalog_image_size', $catalog);
update_option('shop_single_image_size', $single); 
update_option('shop_thumbnail_image_size', $thumbnail);
```

## Configuratie Constanten

### WOO_SHOPING_CART_MENU_STYLE
Bepaalt de stijl van de winkelwagen in het menu.

**Opties:**
- `1`: Eenvoudige weergave (alleen icoon + aantal)
- `2`: Uitgebreide weergave (icoon + aantal + totaalbedrag)

```php
define('WOO_SHOPING_CART_MENU_STYLE', 2);
```

### MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX
Schakelt AJAX functionaliteit in voor "toevoegen aan winkelwagen".

```php
define('MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX', true);
```

### MADEIT_WOO_B2B
Activeert B2B (Business-to-Business) functionaliteiten.

```php
define('MADEIT_WOO_B2B', true);
```

### MADEIT_WOO_B2B_ONLY
Maakt de webshop exclusief toegankelijk voor B2B klanten.

```php
define('MADEIT_WOO_B2B_ONLY', true);
```

## Formulier Styling

### madeit_woocommerce_form_field_args()
Past WooCommerce formulieren aan voor Bootstrap compatibiliteit.

**Ondersteunde veld types:**
- `text`, `email`, `tel`, `number`: Basis tekstvelden
- `password`: Wachtwoordvelden
- `textarea`: Tekstgebieden
- `select`: Dropdown menu's
- `country`: Landen selectie
- `state`: Provincie/staat selectie
- `checkbox`: Checkboxes
- `radio`: Radio buttons
- `date`: Datumvelden (met datepicker ondersteuning)

**Bootstrap classes:**
```php
$args['class'][] = 'form-group';
$args['input_class'] = ['form-control', 'input-lg'];
$args['label_class'] = ['control-label'];
```

**Voorbeeld voor select velden:**
```php
case 'select':
    $args['class'][] = 'form-group';
    $args['input_class'] = ['form-control', 'input-lg'];
    $args['label_class'] = ['control-label'];
    $args['custom_attributes'] = [
        'data-plugin' => 'select2',
        'data-allow-clear' => 'true',
        'aria-hidden' => 'true'
    ];
break;
```

### Custom Form Field Function
Aangepaste implementatie van WooCommerce form fields:

```php
function madeit_woocommerce_form_field($key, $args, $value = null)
```

**Features:**
- Bootstrap 4/5 compatibiliteit
- Custom datepicker integratie
- Select2 dropdown styling
- Responsive form layouts
- Accessibility verbeteringen

## Account Menu Styling

### madeit_woocommerce_account_menu_item_classes()
Corrigeert active states voor account menu items.

```php
function madeit_woocommerce_account_menu_item_classes($classes, $endpoint) {
    $classes = str_replace('is-active', 'active', $classes);
    return $classes;
}
```

## Shopping Cart in Menu

### madeit_woocommerce_shopping_cart_in_menu()
Voegt winkelwagen toe aan hoofdnavigatie.

**Implementatie voor stijl 1 (eenvoudig):**
```php
if (WOO_SHOPING_CART_MENU_STYLE == 1) {
    ?>
    <li class="nav-item cart-menu-item">
        <a class="nav-link" href="<?php echo wc_get_cart_url(); ?>">
            <i class="fa fa-shopping-cart"></i>
            <span class="cart-count"><?php echo $cart_contents_count; ?></span>
        </a>
    </li>
    <?php
}
```

**Implementatie voor stijl 2 (uitgebreid):**
```php
if (WOO_SHOPING_CART_MENU_STYLE == 2) {
    ?>
    <li class="nav-item dropdown cart-menu-item">
        <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">
            <i class="fa fa-shopping-cart"></i>
            <span class="cart-count"><?php echo $cart_contents_count; ?></span>
            <span class="cart-total"><?php echo WC()->cart->get_cart_total(); ?></span>
        </a>
        <div class="dropdown-menu cart-dropdown">
            <!-- Mini cart content -->
        </div>
    </li>
    <?php
}
```

## Infinite Scroll voor Shop

### Shop Detection
```php
wp_localize_script('madeit-infinitescroll', 'madeit_infinite', [
    'navSelector'     => '.woocommerce-pagination, .pagination',
    'nextSelector'    => 'ul.page-numbers a.next, .pagination .next',
    'itemSelector'    => 'div.row.columns-3 .col',
    'contentSelector' => 'div.row.columns-3',
    'shop'            => function_exists('WC') && (is_shop() || is_product_category() || is_product_tag()),
]);
```

## B2B Functionaliteiten

### B2B Only Mode
Wanneer `MADEIT_WOO_B2B_ONLY` actief is:

1. **Toegangscontrole**: Alleen ingelogde B2B gebruikers kunnen de shop bezoeken
2. **Prijs verberging**: Prijzen worden verborgen voor niet-geautoriseerde gebruikers
3. **Custom redirects**: Niet-geautoriseerde gebruikers worden doorgestuurd naar login
4. **Role-based content**: Content wordt gefilterd op gebruikersrol

### B2B Features
Wanneer `MADEIT_WOO_B2B` actief is:

1. **Aangepaste prijzen**: B2B specifieke prijzen
2. **Minimale bestelhoeveelheden**: Per product of categorie
3. **Custom checkout**: Aangepaste checkout voor B2B klanten
4. **Factuuradres verplicht**: Altijd factuuradres vereist voor B2B

```php
if (MADEIT_WOO_B2B) {
    // B2B specific functionality
    add_action('woocommerce_before_shop_loop', 'madeit_b2b_shop_notice');
    add_filter('woocommerce_get_price_html', 'madeit_b2b_price_html', 10, 2);
}
```

## AJAX Add to Cart

### JavaScript Implementation
```javascript
jQuery(document).on('click', '.ajax_add_to_cart', function(e) {
    e.preventDefault();
    
    var $button = jQuery(this);
    var product_id = $button.data('product_id');
    
    $button.addClass('loading');
    
    jQuery.ajax({
        type: 'POST',
        url: wc_add_to_cart_params.ajax_url,
        data: {
            action: 'woocommerce_add_to_cart',
            product_id: product_id,
            security: wc_add_to_cart_params.wc_ajax_add_to_cart_nonce
        },
        success: function(response) {
            // Update cart count
            jQuery('.cart-count').text(response.cart_count);
            $button.removeClass('loading').addClass('added');
        }
    });
});
```

## Custom WooCommerce Templates

Het thema bevat aangepaste WooCommerce templates in de `/woocommerce/` map:

### Belangrijkste Templates
- `archive-product.php`: Shop pagina layout
- `single-product.php`: Enkele product pagina
- `cart/cart.php`: Winkelwagen pagina
- `checkout/form-checkout.php`: Checkout formulier
- `myaccount/`: Account pagina templates

### Template Overrides
```php
// In child theme
function child_theme_woocommerce_template($template, $template_name, $template_path) {
    $child_template = get_stylesheet_directory() . '/woocommerce/' . $template_name;
    
    if (file_exists($child_template)) {
        return $child_template;
    }
    
    return $template;
}
add_filter('woocommerce_locate_template', 'child_theme_woocommerce_template', 10, 3);
```

## Custom Product Fields

### Meta Fields
```php
// Product custom fields
add_action('woocommerce_product_options_general_product_data', function() {
    woocommerce_wp_text_input([
        'id'          => '_custom_field',
        'label'       => __('Custom Field', 'madeit'),
        'placeholder' => __('Enter value', 'madeit'),
        'desc_tip'    => true,
        'description' => __('Custom field description', 'madeit'),
    ]);
});

// Save custom fields
add_action('woocommerce_process_product_meta', function($post_id) {
    $custom_field = sanitize_text_field($_POST['_custom_field']);
    update_post_meta($post_id, '_custom_field', $custom_field);
});
```

## Checkout Customizations

### Custom Checkout Fields
```php
// Add custom checkout field
add_filter('woocommerce_checkout_fields', function($fields) {
    $fields['billing']['billing_custom_field'] = [
        'label'       => __('Custom Field', 'madeit'),
        'placeholder' => __('Enter value', 'madeit'),
        'required'    => false,
        'class'       => ['form-row-wide'],
        'clear'       => true,
    ];
    
    return $fields;
});

// Save custom checkout field
add_action('woocommerce_checkout_update_order_meta', function($order_id) {
    if (!empty($_POST['billing_custom_field'])) {
        update_post_meta($order_id, 'billing_custom_field', 
                        sanitize_text_field($_POST['billing_custom_field']));
    }
});
```

## Email Customizations

### Custom Email Templates
```php
// Custom email template path
add_filter('woocommerce_locate_template', function($template, $template_name, $template_path) {
    if (strpos($template_name, 'emails/') !== false) {
        $custom_template = get_stylesheet_directory() . '/woocommerce/' . $template_name;
        if (file_exists($custom_template)) {
            return $custom_template;
        }
    }
    return $template;
}, 10, 3);
```

## Payment Gateway Integration

### Custom Payment Methods
Het thema bevat ondersteuning voor aangepaste betaalmethoden:

```php
// Custom payment gateway class
class WC_Gateway_Pay_Invoice extends WC_Payment_Gateway {
    public function __construct() {
        $this->id = 'pay_invoice';
        $this->title = __('Pay by Invoice', 'madeit');
        $this->description = __('Pay by invoice after delivery', 'madeit');
        
        // Additional gateway configuration
    }
}

// Register payment gateway
add_filter('woocommerce_payment_gateways', function($gateways) {
    $gateways[] = 'WC_Gateway_Pay_Invoice';
    return $gateways;
});
```

## Performance Optimizations

### WooCommerce Specific Optimizations
```php
// Disable WooCommerce scripts on non-shop pages
add_action('wp_enqueue_scripts', function() {
    if (!is_woocommerce() && !is_cart() && !is_checkout() && !is_account_page()) {
        wp_dequeue_style('woocommerce-general');
        wp_dequeue_style('woocommerce-layout');
        wp_dequeue_style('woocommerce-smallscreen');
        wp_dequeue_script('wc-cart-fragments');
    }
});

// Optimize cart fragments
add_filter('woocommerce_add_to_cart_fragments', function($fragments) {
    $fragments['.cart-count'] = '<span class="cart-count">' . WC()->cart->get_cart_contents_count() . '</span>';
    return $fragments;
});
```

## Troubleshooting

### Veelvoorkomende Problemen

1. **Cart niet zichtbaar in menu**
   - Controleer of WooCommerce geactiveerd is
   - Verificeer `WOO_SHOPING_CART_MENU_STYLE` setting

2. **Formulier styling werkt niet**
   - Controleer Bootstrap versie compatibiliteit
   - Verificeer CSS class conflicts

3. **B2B features werken niet**
   - Controleer of `MADEIT_WOO_B2B` is gedefinieerd
   - Verificeer gebruikersrollen en capabilities

4. **AJAX add to cart werkt niet**
   - Controleer JavaScript console voor errors
   - Verificeer nonce security checks

### Debug Mode
```php
// WooCommerce debug mode
define('WC_DEBUG', true);

// Log WooCommerce errors
add_action('woocommerce_init', function() {
    if (WP_DEBUG) {
        ini_set('log_errors', 1);
        ini_set('error_log', WP_CONTENT_DIR . '/woocommerce-debug.log');
    }
});
```

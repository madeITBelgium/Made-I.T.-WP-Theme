# Made I.T. WordPress Thema - Volledige Hooks Overzicht

Dit document bevat een volledig overzicht van alle filters, actions en custom hooks die gebruikt worden in het Made I.T. WordPress thema.

## Inhoudsopgave

1. [WordPress Core Filters](#wordpress-core-filters)
2. [WordPress Core Actions](#wordpress-core-actions)
3. [WooCommerce Filters](#woocommerce-filters)
4. [WooCommerce Actions](#woocommerce-actions)
5. [Custom Made I.T. Filters](#custom-made-it-filters)
6. [Custom Made I.T. Actions](#custom-made-it-actions)
7. [Plugin Integratie Hooks](#plugin-integratie-hooks)
8. [Verwijderde Hooks](#verwijderde-hooks)
9. [AJAX Endpoints](#ajax-endpoints)
10. [B2B Module Hooks](#b2b-module-hooks)

---

## WordPress Core Filters

### Content en SEO Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `wp_resource_hints` | `madeit_resource_hints` | functions.php | 526 | Optimalisatie van resource hints |
| `excerpt_more` | `madeit_excerpt_more` | functions.php | 636 | Custom "lees meer" tekst |
| `the_content` | `madeit_add_image_popup_class` | functions.php | 1164 | Voegt popup klassen toe aan afbeeldingen |
| `the_content` | `madeit_replace_data_toggle` | functions.php | 2104 | Bootstrap 5 compatibiliteit |
| `the_content_more_link` | `modify_read_more_link` | functions.php | 1012 | Bootstrap styling voor lees meer link |
| `frontpage_template` | `madeit_front_page_template` | functions.php | 954 | Custom frontpage template |

### Script en Style Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `wp_default_scripts` | `remove_jquery_migrate_and_move_jquery_to_footer` | functions.php | 816 | jQuery optimalisatie |
| `style_loader_src` | `remove_css_js_ver` | functions.php | 855 | Verwijdert versienummers |
| `script_loader_src` | `remove_css_js_ver` | functions.php | 856 | Verwijdert versienummers |

### Afbeelding Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `wp_calculate_image_sizes` | `madeit_content_image_sizes_attr` | functions.php | 888 | Responsive afbeeldingen |
| `get_header_image_tag` | `madeit_header_image_tag` | functions.php | 911 | Header afbeelding optimalisatie |
| `wp_get_attachment_image_attributes` | `madeit_post_thumbnail_sizes_attr` | functions.php | 937 | Thumbnail optimalisatie |

### Navigatie en Menu Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `wp_nav_menu_items` | `madeit_woocommerce_shopping_cart_in_menu` | functions.php | 1570 | Winkelwagen in menu |
| `wp_get_nav_menu_items` | `madeit_add_mobile_menu_items_to_main_menu` | functions.php | 1755 | Mobiele menu items |
| `widget_tag_cloud_args` | `madeit_widget_tag_cloud_args` | functions.php | 977 | Tag cloud styling |

### Body Class Filter
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `body_class` | `madeit_body_classes` | inc/template-functions.php | 76 | Custom body klassen |

---

## WordPress Core Actions

### Theme Setup Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `after_setup_theme` | `madeit_setup` | functions.php | 348 | Theme configuratie |
| `after_setup_theme` | `madeit_custom_header_setup` | inc/custom-header.php | 51 | Custom header setup |
| `template_redirect` | `madeit_content_width` | functions.php | 470 | Content breedte instelling |

### Widget Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `widgets_init` | `madeit_widgets_init` | functions.php | 607 | Widget areas registratie |
| `widgets_init` | `madeit_register_widgets` | inc/template-widgets.php | 76 | Custom widgets registratie |

### Script en Style Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `wp_enqueue_scripts` | `madeit_scripts` | functions.php | 783 | Frontend scripts |
| `wp_enqueue_scripts` | `madeit_rgb_colors_inline` | functions.php | 1974 | RGB kleuren inline CSS |
| `admin_enqueue_scripts` | `madeit_admin_style` | functions.php | 841 | Admin styling |
| `get_footer` | `prefix_add_footer_styles` | functions.php | 832 | Footer styles laden |

### Gutenberg Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `enqueue_block_editor_assets` | `madeit_block_editor_styles` | functions.php | 436 | Block editor styling |
| `enqueue_block_editor_assets` | `madeit_colors_css_wrap` | functions.php | 708 | Kleuren in block editor |
| `enqueue_block_editor_assets` | `madeit_extend_gutenberg` | functions.php | 1643 | Gutenberg uitbreidingen |
| `enqueue_block_assets` | `madeit_extend_gutenberg_css` | functions.php | 1651 | Block assets CSS |

### Head en Footer Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `wp_head` | `madeit_javascript_detection` | functions.php | 651 | JavaScript detectie |
| `wp_head` | `madeit_pingback_header` | functions.php | 664 | Pingback header |
| `wp_head` | `madeit_colors_css_wrap` | functions.php | 689 | Kleuren CSS |
| `wp_head` | `madeit_wp_bootstrap_head` | functions.php | 1003 | Bootstrap meta tags |
| `wp_head` | `madeit_user_analytics` | functions.php | 1952 | Analytics tracking |
| `wp_footer` | `madeit_cookie_notice` | functions.php | 1635 | Cookie melding |
| `wp_footer` | `madeit_add_popup` | inc/popup.php | 279 | Popup systeem |
| `wp_footer` | `madeit_include_svg_icons` | inc/icon-functions.php | 23 | SVG iconen |

### Plugin en Support Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `tgmpa_register` | `madeit_register_required_plugins` | functions.php | 1134 | Required plugins |
| `admin_init` | `madeit_support_init` | inc/madeit-support.php | 15 | Support systeem |
| `admin_footer` | `madeit_support_popup` | inc/madeit-support.php | 85 | Support popup |

### Initialization Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `init` | `madeit_fix_bs_5` | functions.php | 2108 | Bootstrap 5 fixes |
| `init` | `madeit_generate_json_file` | inc/generate-theme-json.php | 104 | Theme JSON generatie |
| `init` | `get_custom_coupon_code_to_session` | inc/woocommerce.php | 11 | Coupon code sessie |
| `init` | `cptui_register_my_cpts_review` | inc/reviews.php | 142 | Review post type |
| `init` | `cptui_register_my_cpts_popup` | inc/popup.php | 73 | Popup post type |

### Cache en Optimalisatie Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `edit_category` | `madeit_category_transient_flusher` | inc/template-tags.php | 218 | Cache clearing |
| `save_post` | `madeit_category_transient_flusher` | inc/template-tags.php | 219 | Cache clearing |
| `save_post` | `madeit_pagetitle_meta_box_save` | inc/template-functions.php | 269 | Meta box opslaan |

---

## WooCommerce Filters

### Product Display Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `loop_shop_columns` | `madeit_loop_columns` | inc/woocommerce.php | 8 | Kolommen in shop |
| `woocommerce_sale_flash` | `madeit_custom_sale_flash` | inc/woocommerce.php | 158 | Custom sale badge |
| `woocommerce_loop_add_to_cart_link` | `quantity_for_woocommerce_loop` | inc/woocommerce.php | 175 | Quantity in loop |

### Form en Checkout Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `woocommerce_form_field_args` | `madeit_woocommerce_form_field_args` | functions.php | 1227 | Bootstrap form styling |
| `woocommerce_account_menu_item_classes` | `madeit_woocommerce_account_menu_item_classes` | functions.php | 1495 | Account menu styling |

### Webhook en API Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `woocommerce_webhook_payload` | `madeit_woocommerce_webhook_payload` | inc/woocommerce.php | 92 | Webhook data |

### BeRocket Plugin Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `berocket_aapf_listener_br_options` | `madeit_update_berocket_aapf_listener_br_options` | inc/woocommerce.php | 50 | AJAX filters |
| `brfr_get_option_ajax_filters` | `madeit_update_berocket_aapf_listener_br_options` | inc/woocommerce.php | 51 | AJAX filters |

### Cart en Checkout Hook Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `woocommerce_before_cart_table` | `madeit_woocommerce_before_cart_table` | inc/woocommerce.php | 57 | Voor cart tabel |
| `woocommerce_after_cart_table` | `madeit_woocommerce_after_cart_table` | inc/woocommerce.php | 63 | Na cart tabel |
| `woocommerce_before_checkout_billing_form` | `madeit_woocommerce_before_checkout_billing_form` | inc/woocommerce.php | 69 | Voor billing form |
| `woocommerce_after_checkout_billing_form` | `madeit_woocommerce_after_checkout_billing_form` | inc/woocommerce.php | 77 | Na billing form |

---

## WooCommerce Actions

### Checkout Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `woocommerce_before_checkout_form` | `add_discout_to_checkout` | inc/woocommerce.php | 29 | Korting toevoegen |
| `woocommerce_review_order_before_cart_contents` | `add_discout_to_checkout` | inc/woocommerce.php | 30 | Korting toevoegen |
| `woocommerce_checkout_after_terms_and_conditions` | `madeit_emailservice_woo_checkbox_field` | inc/email-service.php | 12 | Email service checkbox |
| `woocommerce_checkout_update_order_meta` | `madeit_emailservice_woo_save_subscription_input` | inc/email-service.php | 43 | Email service opslaan |

---

## Custom Made I.T. Filters

### Thema Configuratie Filters
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_content_width` | Content breedte aanpassen | Bepaalt de maximale breedte van content |
| `madeit_colorscheme` | Kleurschema aanpassen | Array met thema kleuren |
| `madeit_starter_content` | Starter content wijzigen | Default content bij theme activatie |

### Infinite Scroll Filters
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_infinite_navselector` | Navigatie selector | CSS selector voor paginering navigatie |
| `madeit_infinite_nextselector` | Volgende selector | CSS selector voor volgende knop |
| `madeit_infinite_itemselector` | Item selector | CSS selector voor content items |
| `madeit_infinite_contentselector` | Container selector | CSS selector voor content container |

### Layout en Styling Filters
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_sidebar_class` | Sidebar CSS klassen | Bootstrap klassen voor sidebar |
| `madeit_woo_product_column_class` | Product kolom klassen | CSS klassen voor WooCommerce producten |
| `madeit_woo_category_product_image_container_class` | Product afbeelding container | CSS klassen voor product afbeeldingen |
| `madeit_woo_category_product_content_container_class` | Product content container | CSS klassen voor product content |
| `madeit_woo_product_inner_container_class` | Product inner container | CSS klassen voor product binnencontainer |
| `madeit_woo_btn_class` | WooCommerce button klassen | CSS klassen voor WooCommerce knoppen |

### Text en Content Filters
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_powered_by_text` | Footer tekst | "Powered by" tekst in footer |
| `madeit-cookie-notice` | Cookie melding tekst | Tekst voor cookie notice |

### Mobile Menu Filters
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_mobile_menu_extra_breakpoint_class` | Mobile menu breakpoint | CSS klasse voor mobile menu breakpoint |

### Forms Module Filter
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_forms_module_class` | Forms module klassen | CSS klassen voor formulier modules |

### Analytics Filters
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_analtyics_ga` | Google Analytics tags | Array met GA tracking codes |

### Cookie Law Filters
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_cookie_law_default_settings` | Cookie law instellingen | Default instellingen voor cookie law plugin |

### WP Rocket Filters
| Filter | Toepassing | Beschrijving |
|--------|------------|--------------|
| `pre_get_rocket_option_delay_js_exclusions` | JS delay exclusions | Scripts die niet uitgesteld moeten worden |

---

## Custom Made I.T. Actions

### Page Layout Actions
| Action | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_before_index_page` | Voor index pagina | Hook voor content vóór index |
| `madeit_between_index_page` | Tussen index content | Hook tussen index content |

### Review Systeem Actions
| Action | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_review_before_title` | Voor review titel | Hook vóór review titel |
| `madeit_review_after_title` | Na review titel | Hook na review titel |
| `madeit_review_after_message` | Na review bericht | Hook na review bericht |
| `madeit_review_after_name` | Na review naam | Hook na review naam |
| `madeit_review_after_rating` | Na review rating | Hook na review rating |
| `madeit_load_google_reviews` | Google reviews laden | Hook voor Google reviews |

### B2B Systeem Actions
| Action | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_b2b_favorite_added` | Favoriet toegevoegd | Hook wanneer product aan favorieten wordt toegevoegd |
| `madeit_b2b_favorite_removed` | Favoriet verwijderd | Hook wanneer product uit favorieten wordt verwijderd |

### Cron Actions
| Action | Toepassing | Beschrijving |
|--------|------------|--------------|
| `madeit_cron_daily` | Dagelijkse cron | Hook voor dagelijkse taken |

---

## Plugin Integratie Hooks

### Cookie Law Info Plugin
| Type | Hook | Functie | Beschrijving |
|------|------|---------|--------------|
| Filter | `wt_cli_plugin_settings` | `madeit_cookie_law_default_settings` | Default cookie instellingen |
| Filter | `wt_cli_enable_ckyes_branding` | `madeit_wt_cli_enable_ckyes_branding` | Branding uitschakelen |

### WP Rocket Plugin
| Type | Hook | Functie | Beschrijving |
|------|------|---------|--------------|
| Filter | `pre_get_rocket_option_delay_js_exclusions` | `madeit_wprocket_pre_get_rocket_option_delay_js_exclusions` | JS delay exclusions |

### Gutenberg Blocks
| Type | Hook | Functie | Beschrijving |
|------|------|---------|--------------|
| Filter | `block_categories_all` | `madeit_filter_block_categories_when_post_provided` | Custom block categorieën |

### LearnDash LMS
| Type | Hook | Functie | Beschrijving |
|------|------|---------|--------------|
| Action | `init` | `my_custom_endpoints` | Custom endpoints |
| Action | `after_switch_theme` | `my_custom_flush_rewrite_rules` | Rewrite rules |
| Filter | `query_vars` | `my_custom_query_vars` | Custom query vars |
| Filter | `woocommerce_account_menu_items` | `my_custom_my_account_menu_items` | Account menu items |
| Action | `woocommerce_account_courses_endpoint` | `my_custom_endpoint_content` | Endpoint content |

### Customizer
| Type | Hook | Functie | Beschrijving |
|------|------|---------|--------------|
| Action | `customize_register` | `madeit_customize_register` | Customizer opties |
| Action | `customize_preview_init` | `madeit_customize_preview_js` | Preview JavaScript |
| Action | `customize_controls_enqueue_scripts` | `madeit_panels_js` | Control panel JavaScript |

---

## Verwijderde Hooks

### Verwijderde Filters
| Filter | Functie | Bestand | Lijn | Reden |
|--------|---------|---------|------|-------|
| `woocommerce_form_field_args` | `madeit_woocommerce_form_field_args` | functions.php | 1229 | Conditional removal |

### Verwijderde Actions
| Action | Functie | Bestand | Lijn | Reden |
|--------|---------|---------|------|-------|
| `woocommerce_cart_is_empty` | `wc_empty_cart_message` | inc/woocommerce.php | 81 | Custom empty cart message |
| `save_post` | `madeit_pagetitle_meta_box_save` | inc/template-functions.php | 259 | Prevent recursive save |
| `register_new_user` | `wp_send_new_user_notifications` | inc/call.php | 113 | Custom user notifications |

---

## AJAX Endpoints

### WooCommerce AJAX
| Endpoint | Functie | Bestand | Lijn | Beschrijving |
|----------|---------|---------|------|--------------|
| `madeit_search_products` | `madeit_search_products` | inc/woocommerce.php | 142-143 | Product zoeken |

### Review Systeem AJAX
| Endpoint | Functie | Bestand | Lijn | Beschrijving |
|----------|---------|---------|------|--------------|
| `madeit_submit_review` | `madeit_review_save_ajax` | inc/review-form.php | 179-180 | Review opslaan |

### B2B Systeem AJAX
| Endpoint | Functie | Bestand | Lijn | Beschrijving |
|----------|---------|---------|------|--------------|
| `b2b_madeit_favorite` | `madeit_b2b_toggle_favorite` | inc/woo-b2b.php | 251-252 | Favoriet toggle |

### Content Lock AJAX
| Endpoint | Functie | Bestand | Lijn | Beschrijving |
|----------|---------|---------|------|--------------|
| `madeit_unlock_content` | `madeit_unlock_ajax` | inc/lock-content.php | 103-104 | Content unlocken |

### Support Systeem AJAX
| Endpoint | Functie | Bestand | Lijn | Beschrijving |
|----------|---------|---------|------|--------------|
| `madeit_support_ticket` | `madeit_support_ticket_store` | inc/madeit-support.php | 93 | Support ticket |

---

## B2B Module Hooks

### B2B Filters
| Filter | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `woocommerce_is_purchasable` | `madeit_b2b_is_purchasable` | inc/woo-b2b.php | 21 | Product koopbaarheid |
| `woocommerce_get_price_html` | `madeit_b2b_woocommerce_get_price_html` | inc/woo-b2b.php | 67 | Prijs weergave |
| `woocommerce_product_get_price` | `madeit_b2b_woocommerce_get_price` | inc/woo-b2b.php | 87 | Product prijs |
| `woocommerce_product_get_sale_price` | `madeit_b2b_woocommerce_get_price` | inc/woo-b2b.php | 89 | Sale prijs |
| `woocommerce_structured_data_product_offer` | `madeit_remove_partial_product_structured_data` | inc/woo-b2b.php | 104 | Structured data |
| `woocommerce_cart_product_price` | `ran_woocommerce_cart_product_price` | inc/woo-b2b.php | 116 | Cart product prijs |
| `woocommerce_account_menu_items` | `madeit_b2b_my_account_menu_items` | inc/woo-b2b.php | 269 | Account menu |
| `woocommerce_payment_gateways` | `madeit_b2b_wcpl_add_gateway` | inc/woo-b2b.php | 403 | Payment gateway |

### B2B Actions
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `woocommerce_single_product_summary` | `madeit_b2b_woocommerce_single_product_summary` | inc/woo-b2b.php | 49 | Product summary |
| `woocommerce_after_shop_loop_item` | `madeit_b2b_favorite_btn` | inc/woo-b2b.php | 165 | Favoriet knop |
| `woocommerce_single_product_summary` | `madeit_b2b_favorite_btn` | inc/woo-b2b.php | 166 | Favoriet knop |
| `wp_enqueue_scripts` | `madeit_b2b_enqueue_scripts` | inc/woo-b2b.php | 173 | B2B scripts |
| `init` | `madeit_b2b_my_account_menu_item_endpoint` | inc/woo-b2b.php | 275 | Account endpoint |
| `woocommerce_account_b2b-favorites_endpoint` | `madeit_b2b_my_account_menu_item_content` | inc/woo-b2b.php | 337 | Endpoint content |
| `woocommerce_register_form_start` | `madeit_b2b_wooc_extra_register_fields` | inc/woo-b2b.php | 356 | Registratie velden |
| `woocommerce_register_post` | `madeit_b2b_wc_validate_reg_form_fields` | inc/woo-b2b.php | 370 | Validatie |
| `woocommerce_created_customer` | `madeit_b2b_wooc_save_extra_register_fields` | inc/woo-b2b.php | 381 | Velden opslaan |

### B2B ACF Integration
| Action | Functie | Bestand | Lijn | Beschrijving |
|--------|---------|---------|------|--------------|
| `acf/include_fields` | Anonymous function | inc/woo-b2b.php | 407 | ACF velden definitie |
| `acf/include_fields` | Anonymous function | inc/megamenu.php | 72 | Megamenu ACF velden |

---

## Gebruik Voorbeelden

### Custom Filter Toevoegen
```php
// Pas content breedte aan
add_filter('madeit_content_width', function($width) {
    return 1200; // Verhoog naar 1200px
});

// Pas kleurschema aan
add_filter('madeit_colorscheme', function($colors) {
    $colors[] = [
        'name' => 'Custom Blauw',
        'slug' => 'custom-blue',
        'color' => '#007cba',
    ];
    return $colors;
});
```

### Custom Action Hook Gebruiken
```php
// Voeg content toe voor index pagina
add_action('madeit_before_index_page', function() {
    echo '<div class="custom-banner">Welkom op onze website!</div>';
});

// Hook into B2B favoriet systeem
add_action('madeit_b2b_favorite_added', function($product_id, $user_id) {
    // Log favoriet toevoeging
    error_log("User {$user_id} added product {$product_id} to favorites");
});
```

### WooCommerce Styling Aanpassen
```php
// Pas product kolom klassen aan
add_filter('madeit_woo_product_column_class', function($classes) {
    return ['col-12', 'col-sm-6', 'col-md-4', 'col-xl-3']; // 4 kolommen op xl
});

// Pas button klassen aan
add_filter('madeit_woo_btn_class', function($classes) {
    $classes[] = 'custom-btn-class';
    return $classes;
});
```

---

## Debugging Hooks

Voor debugging van hooks kun je de volgende functies gebruiken:

```php
// Debug alle hooks
add_action('all', function($hook) {
    if (strpos($hook, 'madeit') !== false) {
        error_log('Made I.T. Hook: ' . $hook);
    }
});

// Debug filter waarden
add_filter('madeit_colorscheme', function($colors) {
    error_log('Color scheme: ' . print_r($colors, true));
    return $colors;
});
```

---

## Conclusie

Dit overzicht toont de uitgebreide hook-architectuur van het Made I.T. thema. Met meer dan 100 verschillende hooks biedt het thema uitgebreide mogelijkheden voor maatwerk en uitbreidingen zonder de core bestanden te wijzigen.

De hooks zijn georganiseerd in logische groepen en bieden toegangspunten voor:
- Content manipulatie
- Styling aanpassingen  
- E-commerce functionaliteit
- SEO optimalisatie
- Performance verbetering
- Plugin integraties
- Custom functionaliteit

Voor ontwikkelaars is het aan te raden om altijd gebruik te maken van de beschikbare hooks in plaats van core bestanden te wijzigen, om compatibiliteit met toekomstige updates te waarborgen.

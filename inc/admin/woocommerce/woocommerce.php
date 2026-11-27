<?php
/**
 * Shop Controls: standaardinstellingen
 */
function shop_controls_get_defaults() {
    return [
        'cart_enabled'       => '1',
        'icon_visibility'    => 'none',
        'icon_position'      => 'left',
        'add_to_menu'        => '1',
        'hide_empty_cart'    => '0',
        'cart_display'       => 'popup',

        'coupon_enabled'     => '1',
        'coupon_display'     => 'collapsed',
        'coupon_title'       => 'Heb je een kortingscode?',
        'coupon_placeholder' => 'Coupon Code',
        'coupon_button'      => 'Toepassen',
    ];
}

/**
 * Shop Controls: instellingen ophalen
 */
function shop_controls_get_options() {
    return wp_parse_args(
        get_option('shop_controls_options', []),
        shop_controls_get_defaults()
    );
}

/**
 * Shop Controls: dashboard metrics uit WooCommerce ophalen.
 */
function shop_controls_normalize_order_status($status) {
    if (!is_string($status)) {
        return '';
    }

    return strtolower(str_replace('wc-', '', trim($status)));
}

function shop_controls_get_dashboard_metrics() {
    $defaults = [
        'orders_today' => 0,
        'orders_last_7_days' => 0,
        'orders_previous_7_days' => 0,
        'revenue_last_7_days' => 0,
        'revenue_previous_7_days' => 0,
        'products_active' => 0,
        'products_added_last_7_days' => 0,
        'conversion_rate' => 0,
        'cart_status' => 'Live',
        'updated' => current_time('H:i'),
    ];

    if (!class_exists('WooCommerce') || !function_exists('wc_get_orders')) {
        return $defaults;
    }

    $now = current_time('timestamp');
    $today_start = strtotime('today', $now);
    $seven_days_ago = strtotime('-6 days', $today_start);
    $previous_start = strtotime('-13 days', $today_start);
    $previous_end = strtotime('-7 days', $today_start);
    $tracked_statuses = ['wc-completed', 'wc-processing', 'wc-on-hold', 'wc-pending', 'completed', 'processing', 'on-hold', 'pending'];

    $orders = wc_get_orders([
        'limit' => -1,
        'status' => $tracked_statuses,
        'return' => 'ids',
    ]);

    $orders_today = 0;
    $orders_last_7_days = 0;
    $orders_previous_7_days = 0;
    $revenue_last_7_days = 0;
    $revenue_previous_7_days = 0;

    foreach ($orders as $order_id) {
        $order = wc_get_order($order_id);
        if (!$order || !method_exists($order, 'get_date_created')) {
            continue;
        }

        $created = $order->get_date_created();
        if (!$created) {
            continue;
        }

        $order_timestamp = $created->getTimestamp();
        $order_total = floatval($order->get_total());

        if ($order_timestamp >= $today_start) {
            $orders_today++;
        }

        if ($order_timestamp >= $seven_days_ago) {
            $orders_last_7_days++;
            $revenue_last_7_days += $order_total;
        }

        if ($order_timestamp >= $previous_start && $order_timestamp < $previous_end) {
            $orders_previous_7_days++;
            $revenue_previous_7_days += $order_total;
        }
    }

    $products_active = (int) wp_count_posts('product')->publish;

    $recent_products = get_posts([
        'post_type' => 'product',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'date_query' => [
            [
                'after' => '7 days ago',
                'inclusive' => true,
            ],
        ],
        'fields' => 'ids',
    ]);

    $products_added_last_7_days = is_array($recent_products) ? count($recent_products) : 0;

    $completed_orders_last_30_days = 0;
    foreach ($orders as $order_id) {
        $order = wc_get_order($order_id);
        if (!$order || !method_exists($order, 'get_date_created')) {
            continue;
        }

        $created = $order->get_date_created();
        if (!$created) {
            continue;
        }

        $order_timestamp = $created->getTimestamp();
        $order_status = shop_controls_normalize_order_status($order->get_status());
        if (in_array($order_status, ['completed', 'processing', 'on-hold', 'pending'], true) && $order_timestamp >= strtotime('-30 days', $now)) {
            $completed_orders_last_30_days++;
        }
    }

    $conversion_rate = 0;
    if ($products_active > 0) {
        $conversion_rate = min(100, round(($completed_orders_last_30_days / max(1, $products_active)) * 100, 1));
    }

    return [
        'orders_today' => $orders_today,
        'orders_last_7_days' => $orders_last_7_days,
        'orders_previous_7_days' => $orders_previous_7_days,
        'revenue_last_7_days' => round($revenue_last_7_days, 2),
        'revenue_previous_7_days' => round($revenue_previous_7_days, 2),
        'products_active' => $products_active,
        'products_added_last_7_days' => $products_added_last_7_days,
        'conversion_rate' => $conversion_rate,
        'cart_status' => 'Live',
        'updated' => current_time('H:i'),
    ];
}

/**
 * Shop Controls: instellingen registreren
 */
function shop_controls_register_settings() {

    register_setting(
        'shop_controls_options_group',
        'shop_controls_options',
        [
            'type'              => 'array',
            'sanitize_callback' => 'shop_controls_sanitize_options',
            'default'           => shop_controls_get_defaults(),
        ]
    );

}
add_action('admin_init', 'shop_controls_register_settings');


/**
 * Shop Controls: instellingen beveiligen en opschonen
 */
function shop_controls_sanitize_options($input) {

    $defaults = shop_controls_get_defaults();

    $input = is_array($input) ? $input : [];

    $options = [];

    // Checkboxen
    $checkboxes = [
        'cart_enabled',
        'add_to_menu',
        'hide_empty_cart',
        'coupon_enabled',
    ];

    foreach ($checkboxes as $key) {
        $options[$key] = isset($input[$key]) ? '1' : '0';
    }

    // Toegestane waarden
    $allowed = [
        'icon_visibility' => ['all', 'woocommerce', 'none'],
        'icon_position'   => ['left', 'right'],
        'cart_display'    => ['popup', 'sidebar'],
        'coupon_display'  => ['collapsed', 'open'],
    ];

    foreach ($allowed as $key => $values) {
        $value = isset($input[$key])
            ? sanitize_text_field($input[$key])
            : $defaults[$key];

        $options[$key] = in_array($value, $values, true)
            ? $value
            : $defaults[$key];
    }

    // Tekstvelden
    $text_fields = [
        'coupon_title',
        'coupon_placeholder',
        'coupon_button',
    ];

    foreach ($text_fields as $key) {
        $options[$key] = isset($input[$key])
            ? sanitize_text_field($input[$key])
            : $defaults[$key];
    }

    return $options;
}


/**
 * ==========================================
 * SHOP CONTROLS - ADMIN ASSETS
 * ==========================================
 */
function shop_controls_enqueue_assets($hook) {

    if ($hook !== 'woocommerce_page_shop-controls') {
        return;
    }

    wp_enqueue_media();

    wp_enqueue_style(
        'shop-controls-admin',
        get_template_directory_uri() . '/inc/admin/woocommerce/style.css',
        [],
        '1.0.0'
    );

    wp_enqueue_script(
        'shop-controls-admin',
        get_template_directory_uri() . '/inc/admin/woocommerce/index.js',
        ['jquery'],
        '1.0.0',
        true
    );

    wp_localize_script('shop-controls-admin', 'shopControlsAdmin', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
    ]);

}
add_action('admin_enqueue_scripts', 'shop_controls_enqueue_assets');


/**
 * ==========================================
 * SHOP CONTROLS - ADMIN MENU
 * ==========================================
 */
function shop_controls_menu() {
    add_submenu_page(
        'woocommerce',
        'Shop Controls',
        '<span><i class="dashicons dashicons-admin-settings"></i> Shop Controls</span>',
        'manage_options',
        'shop-controls',
        'shop_controls_page',
        999
    );
}
add_action('admin_menu', 'shop_controls_menu', 999);


/**
 * ==========================================
 * SHOP CONTROLS - TOGGLE COMPONENT
 * ==========================================
 */
function shop_controls_toggle($key, $options) {

    $checked = isset($options[$key]) && $options[$key] === '1';

    ?>
    <span id="<?php echo esc_attr($key); ?>" class="components-form-toggle <?php echo $checked ? 'is-checked' : ''; ?>">
        <input
            type="checkbox"
            name="shop_controls_options[<?php echo esc_attr($key); ?>]"
            value="1"
            <?php checked($checked); ?>
        >
    </span>
    <?php
}


/**
 * ==========================================
 * SHOP CONTROLS - ADMIN PAGE
 * ==========================================
 */
function shop_controls_page() {

    if (!current_user_can('manage_options')) {
        return;
    }

    $options = shop_controls_get_options();
    $dashboard = shop_controls_get_dashboard_metrics();

    ?>

    <!-- Navigation Menu -->
    <div class="MI_header">

        <div class="MI_header_l">

            <div>
                <a href="<?php echo esc_url(admin_url('admin.php?page=shop-controls&path=/dashboard')); ?>" style="text-decoration:none;">
                    <h1>Shop Controls</h1>
                </a>
            </div>

            <div class="MI_navigation">

                <span>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=shop-controls&path=/dashboard')); ?>">
                        Dashboard
                    </a>
                </span>

                <span>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=shop-controls&path=/storecheckout')); ?>">
                        Store Checkout
                    </a>
                </span>

                <span>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=shop-controls&path=/templates')); ?>">
                        Templates
                    </a>
                </span>

                <span>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=shop-controls&path=/automations')); ?>">
                        Automations
                    </a>
                </span>

                <span>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=shop-controls&path=/cart')); ?>">
                        Cart
                    </a>
                </span>

            </div>

        </div>

    </div>
    
    
    <!-- SETTINGS FORM -->
    <div class="container d-flex" style="display:flex; margin-top:50px;">
        
        <form method="post" action="options.php" style="width:calc(100% - 20px);">
            
            <?php settings_fields('shop_controls_options_group'); ?>
            
            <!-- ==================================
            DASHBOARD
            =================================== -->
            <div id="MI_dashboard">
                <div class="heading">
                    <h1>Dashboard</h1>
                    <button type="button" class="button button-primary MI_refresh-dashboard">Vernieuw overzicht</button>
                </div>
        
                <p>Een snel overzicht van de belangrijkste winkelacties en de status van je storefront.</p>
        
                <div class="MI_dashboard-grid">
                    <div class="MI_stat-card MI_stat-card-primary">
                        <span class="MI_stat-label">Orders vandaag</span>
                        <strong data-metric="orders"><?php echo esc_html((int) $dashboard['orders_today']); ?></strong>
                        <small data-metric-change="orders">
                            <?php
                            $orders_delta = 0;
                            if ($dashboard['orders_previous_7_days'] > 0) {
                                $orders_delta = round((($dashboard['orders_last_7_days'] - $dashboard['orders_previous_7_days']) / max(1, $dashboard['orders_previous_7_days'])) * 100, 1);
                            }
                            echo esc_html(($orders_delta >= 0 ? '+' : '') . $orders_delta . '% tegenover vorige week');
                            ?>
                        </small>
                    </div>
        
                    <div class="MI_stat-card">
                        <span class="MI_stat-label">Omzet</span>
                        <strong data-metric="revenue">€ <?php echo esc_html(number_format_i18n($dashboard['revenue_last_7_days'], 2)); ?></strong>
                        <small data-metric-change="revenue">
                            <?php
                            $revenue_delta = 0;
                            if ($dashboard['revenue_previous_7_days'] > 0) {
                                $revenue_delta = round((($dashboard['revenue_last_7_days'] - $dashboard['revenue_previous_7_days']) / max(1, $dashboard['revenue_previous_7_days'])) * 100, 1);
                            }
                            echo esc_html(($revenue_delta >= 0 ? '+' : '') . $revenue_delta . '% in de laatste 7 dagen');
                            ?>
                        </small>
                    </div>
        
                    <div class="MI_stat-card">
                        <span class="MI_stat-label">Actieve producten</span>
                        <strong data-metric="products"><?php echo esc_html((int) $dashboard['products_active']); ?></strong>
                        <small data-metric-change="products"><?php echo esc_html((int) $dashboard['products_added_last_7_days'] . ' nieuwe toevoegingen'); ?></small>
                    </div>
        
                    <div class="MI_stat-card">
                        <span class="MI_stat-label">Conversie</span>
                        <strong data-metric="conversion"><?php echo esc_html(number_format_i18n((float) $dashboard['conversion_rate'], 1) . '%'); ?></strong>
                        <small data-metric-change="conversion">Laatste 30 dagen</small>
                    </div>
                </div>
        
                <div class="MI_content-panel MI_dashboard-summary">
                    <h2>Live status</h2>
                    <div class="MI_summary-row">
                        <span>Cart status</span>
                        <strong data-dashboard-status><?php echo esc_html($dashboard['cart_status']); ?></strong>
                    </div>
                    <div class="MI_summary-row">
                        <span>Laatste refresh</span>
                        <strong data-dashboard-updated><?php echo esc_html($dashboard['updated']); ?></strong>
                    </div>
                    <div class="MI_summary-row">
                        <span>Volgende actie</span>
                        <strong>
                            <?php
                            $next_action = 'Bestelling controleren';
                            if ((int) $dashboard['orders_today'] === 0) {
                                $next_action = 'Geen bestellingen vandaag';
                            }
                            echo esc_html($next_action);
                            ?>
                        </strong>
                    </div>
                </div>
        
                <div class="MI_content-panel">
                    <h2>Laatste updates</h2>
                    <ul class="MI_news-list">
                        <li>Nieuwe cart-variatie is live en goedgekeurd.</li>
                        <li>Template voor de checkout is klaar voor preview.</li>
                        <li>Automation voor follow-up e-mails is actief.</li>
                    </ul>
                </div>
            </div>


            <!-- ==================================
            STORE CHECKOUT SETTINGS
            =================================== -->
            <div id="MI_storecheckout">
                <div class="heading">

                    <h1>Store checkout</h1>

                </div>

                <!-- Uiterlijk van de store checkout -->
                <p>Configure the appearance and settings of the store checkout page here.</p>
                
                <div class="storecheckout-settings">
                    <!-- Add your store checkout settings fields here -->
                    <!-- Zorg hier voor templates van verschillende uiterlijken van de store checkout pagina -->

                    <?php
                    // impport the store checkout templates from templates/storecheckout/
                    $storecheckout_templates = glob(get_template_directory() . '/inc/admin/woocommerce/templates/storecheckout/*.php');
                    foreach ($storecheckout_templates as $template) {
                        echo '<div class="storecheckout-template" style="max-width: 100%;">';
                        include $template;
                        echo '</div>';
                    }
                    ?>
                </div>

            </div>

             <!-- ==================================
            TEMPLATES
            =================================== -->
             <div id="MI_templates">
                <div class="heading">
                    <h1>Templates</h1>
                </div>

                <p>Beheer en preview de beschikbare storefront-templates voor winkelwagen, checkout en marketing. Klik op een preview om het voorbeeld in de rechterzijbalk te bekijken; met “Gebruik template” zet je dezelfde stijl actief voor de winkel.</p>

                <div class="MI_template-toolbar">
                    <span class="MI_template-selection">Geselecteerd: <strong data-selected-template>Classic cart</strong></span>
                    <button type="button" class="button button-primary MI_apply-template">Gebruik template</button>
                </div>

                <div class="MI_template-grid">
                    <div class="MI_template-card is-selected" data-template-name="Classic cart" data-template-type="Cart">
                        <div class="MI_template-topline">
                            <span class="MI_badge MI_badge-success">Actief</span>
                            <span class="MI_template-tag">Cart</span>
                        </div>
                        <h3>Classic cart</h3>
                        <p>Minimalistische winkelwagen met snelle checkout en compact overzicht.</p>
                        <div class="MI_template-preview-copy">Preview toont de cart-variant in de rechterpaneelweergave.</div>
                        <button type="button" class="button button-secondary MI_preview-template">Preview</button>
                    </div>

                    <div class="MI_template-card" data-template-name="Premium checkout" data-template-type="Checkout">
                        <div class="MI_template-topline">
                            <span class="MI_badge MI_badge-info">Voorbeeld</span>
                            <span class="MI_template-tag">Checkout</span>
                        </div>
                        <h3>Premium checkout</h3>
                        <p>Meer detail, duidelijke call-to-action en premium typografie.</p>
                        <div class="MI_template-preview-copy">Preview toont een premium checkout flow met klantgegevens en samenvatting.</div>
                        <button type="button" class="button button-secondary MI_preview-template">Preview</button>
                    </div>

                    <div class="MI_template-card" data-template-name="Campaign offers" data-template-type="Landing">
                        <div class="MI_template-topline">
                            <span class="MI_badge MI_badge-warning">Nieuw</span>
                            <span class="MI_template-tag">Landing</span>
                        </div>
                        <h3>Campaign offers</h3>
                        <p>Ideaal voor promoties, bundles en tijdgevoelige acties.</p>
                        <div class="MI_template-preview-copy">Preview toont een marketing-landing layout voor bijzondere acties.</div>
                        <button type="button" class="button button-secondary MI_preview-template">Preview</button>
                    </div>
                </div>
            </div>

            <!-- ==================================
            AUTOMATIONS SETTINGS
            =================================== -->
            <div id="MI_automations">
                <div class="heading">
                    <h1>Automations</h1>
                </div>

                <p>Automatiseer terugkerende winkelstappen zonder handmatig werk. Hieronder zie je wat er precies wordt verstuurd: een e-mail of herinnering met de bijbehorende trigger en doelgroep.</p>

                <div class="MI_automation-grid">
                    <div class="MI_automation-card" data-automation="follow-up-email">
                        <div class="MI_automation-row">
                            <h3>Follow-up e-mail</h3>
                            <span class="MI_badge MI_badge-success">Actief</span>
                        </div>
                        <p>Verstuurt een e-mail 24 uur na aankoop met upsell-, productaanbevelingen en loyaliteitsinformatie.</p>
                        <small>Trigger: bestelling afgerond • Doelgroep: klanten met een afgeronde bestelling</small>
                        <div class="MI_automation-actions">
                            <label class="MI_toggle-switch">
                                <input type="checkbox" checked>
                                <span class="MI_toggle-slider"></span>
                            </label>
                            <button type="button" class="button button-secondary MI_run-automation">Run nu</button>
                        </div>
                    </div>

                    <div class="MI_automation-card" data-automation="abandoned-cart">
                        <div class="MI_automation-row">
                            <h3>Abandoned cart</h3>
                            <span class="MI_badge MI_badge-warning">In test</span>
                        </div>
                        <p>Stuurt een herinnering naar klanten die na 1 uur of 24 uur nog steeds een incomplete winkelwagen hebben.</p>
                        <small>Trigger: winkelwagen verlaten • Doelgroep: klanten met een actieve cart zonder checkout</small>
                        <div class="MI_automation-actions">
                            <label class="MI_toggle-switch">
                                <input type="checkbox" checked>
                                <span class="MI_toggle-slider"></span>
                            </label>
                            <button type="button" class="button button-secondary MI_run-automation">Run nu</button>
                        </div>
                    </div>

                    <div class="MI_automation-card" data-automation="order-status">
                        <div class="MI_automation-row">
                            <h3>Bestelstatus update</h3>
                            <span class="MI_badge MI_badge-neutral">Uit</span>
                        </div>
                        <p>Verstuurt statusupdates bij verzending, levering of annulering om klanten op de hoogte te houden.</p>
                        <small>Trigger: statuswijziging bestelling • Doelgroep: alle klanten met actieve bestelling</small>
                        <div class="MI_automation-actions">
                            <label class="MI_toggle-switch">
                                <input type="checkbox">
                                <span class="MI_toggle-slider"></span>
                            </label>
                            <button type="button" class="button button-secondary MI_run-automation">Run nu</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==================================
            CART SETTINGS
            =================================== -->
            <div id="MI_cart">

                <div class="heading">

                    <h1>Winkelwagen</h1>

                    <div style="display:flex; align-items:center;">

                        <label style="padding-right:10px;">
                            Winkelwagen inschakelen
                        </label>

                        <?php shop_controls_toggle('cart_enabled', $options); ?>

                    </div>

                </div>


                <!-- DISABLED INFO -->

                <div class="MI-disable-cart-info" style="display: none;">
                    <span class="MI-cart-info-text">
                        De winkelwagen is momenteel uitgeschakeld.
                        Gebruik de optie <strong>'Winkelwagen inschakelen'</strong>
                        om de winkelwagen in uw winkel te activeren.
                    </span>
                </div>


                <br><br>


                <!-- BASIC SETTINGS -->

                <div class="settings">

                    <h2>Basis instellingen</h2>
                    <hr>
                    <br>

                    <div class="row">

                        <div class="col-4">

                            <p class="mb-4">
                                Pictogramzichtbaarheid
                                <span class="tooltip dashicons dashicons-editor-help">
                                    <span>Selecteer wanneer het pictogram zichtbaar moet zijn.</span>
                                </span>
                            </p>

                            <p class="mb-4">Pictogrampositie</p>

                            <p class="mb-4">
                                Toevoegen aan menu
                            </p>

                            <p class="mb-4">
                                Winkelwagenpictogram verbergen
                                <span class="tooltip dashicons dashicons-editor-help">
                                    <span>Het pictogram blijft verborgen tot de gebruiker het eerste artikel aan zijn winkelwagen heeft toegevoegd.</span>
                                </span>
                            </p>

                            <p class="mb-4">
                                Weergave toevoegen artikel
                            </p>

                        </div>


                        <div class="col-8 d-flex flex-direction-column">


                            <!-- ICON VISIBILITY -->

                            <div class="mb-4 d-flex" style="gap:30px;">

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[icon_visibility]"
                                        value="all"
                                        id="icon_visibility_all"
                                        <?php checked($options['icon_visibility'], 'all'); ?>
                                    >
                                    <label for="icon_visibility_all">Volledige website</label>
                                </div>

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[icon_visibility]"
                                        value="woocommerce"
                                        id="icon_visibility_woocommerce"
                                        <?php checked($options['icon_visibility'], 'woocommerce'); ?>
                                    >
                                    <label for="icon_visibility_woocommerce">WooCommerce pagina's</label>
                                </div>

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[icon_visibility]"
                                        value="none"
                                        id="icon_visibility_none"
                                        <?php checked($options['icon_visibility'], 'none'); ?>
                                    >
                                    <label for="icon_visibility_none">Geen</label>
                                </div>

                            </div>


                            <!-- ICON POSITION -->

                            <div class="mb-4 d-flex" style="gap:30px;">

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[icon_position]"
                                        value="left"
                                        id="icon_position_left"
                                        <?php checked($options['icon_position'], 'left'); ?>
                                    >
                                    <label for="icon_position_left">Linksonder</label>
                                </div>

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[icon_position]"
                                        value="right"
                                        id="icon_position_right"
                                        <?php checked($options['icon_position'], 'right'); ?>
                                    >
                                    <label for="icon_position_right">Rechtsonder</label>
                                </div>

                            </div>


                            <!-- ADD TO MENU -->

                            <div class="mb-4">
                                <?php shop_controls_toggle('add_to_menu', $options); ?>
                            </div>


                            <!-- HIDE EMPTY CART -->

                            <div class="mb-4">
                                <?php shop_controls_toggle('hide_empty_cart', $options); ?>
                            </div>


                            <!-- CART DISPLAY -->

                            <div class="mb-4 d-flex" style="gap:30px;">

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[cart_display]"
                                        value="popup"
                                        id="cart_display_popup"
                                        <?php checked($options['cart_display'], 'popup'); ?>
                                    >
                                    <label for="cart_display_popup">Pop-up weergave</label>
                                </div>

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[cart_display]"
                                        value="sidebar"
                                        id="cart_display_sidebar"
                                        <?php checked($options['cart_display'], 'sidebar'); ?>
                                    >
                                    <label for="cart_display_sidebar">Zijbalk weergave</label>
                                </div>

                            </div>
                            
                        </div>

                    </div>
                    
                    
                    <br><br>
                    
                    
                    <!-- ==================================
                         COUPON SETTINGS
                         =================================== -->
                         
                         <h2>Couponvelden</h2>
                         <hr>
                    <br>


                    <div class="row">

                        <div class="col-4">

                            <p class="mb-4">
                                Couponvelden inschakelen
                                <span class="tooltip dashicons dashicons-editor-help">
                                    <span>Toon het kortingsveld in het winkelmandje.</span>
                                </span>
                            </p>

                            <p class="mb-4">Weergave</p>

                            <p class="mb-4">Koptekst van het couponvak</p>

                            <p class="mb-4">Kortingsvakje (plaatsvervangende tekst)</p>

                            <p class="mb-4">Tekst op de knop 'Kortingsvak'</p>

                        </div>


                        <div class="col-8 d-flex flex-direction-column">


                            <!-- COUPON ENABLED -->

                            <div class="mb-4">
                                <?php shop_controls_toggle('coupon_enabled', $options); ?>
                            </div>


                            <!-- COUPON DISPLAY -->

                            <div class="mb-4 d-flex" style="gap:30px;">

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[coupon_display]"
                                        value="collapsed"
                                        id="coupon_display_collapsed"
                                        <?php checked($options['coupon_display'], 'collapsed'); ?>
                                    >
                                    <label for="coupon_display_collapsed">Dichtgeklapt</label>
                                </div>

                                <div class="group">
                                    <input
                                        type="radio"
                                        name="shop_controls_options[coupon_display]"
                                        value="open"
                                        id="coupon_display_open"
                                        <?php checked($options['coupon_display'], 'open'); ?>
                                    >
                                    <label for="coupon_display_open">Open</label>
                                </div>

                            </div>


                            <!-- COUPON TITLE -->

                            <div class="mb-4">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="shop_controls_options[coupon_title]"
                                    value="<?php echo esc_attr($options['coupon_title']); ?>"
                                    placeholder="Koptekst van het couponvak"
                                >
                            </div>


                            <!-- COUPON PLACEHOLDER -->

                            <div class="mb-4">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="shop_controls_options[coupon_placeholder]"
                                    value="<?php echo esc_attr($options['coupon_placeholder']); ?>"
                                    placeholder="Kortingsvakje (plaatsvervangende tekst)"
                                >
                            </div>


                            <!-- COUPON BUTTON -->

                            <div class="mb-4">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="shop_controls_options[coupon_button]"
                                    value="<?php echo esc_attr($options['coupon_button']); ?>"
                                    placeholder="Tekst op de knop"
                                >
                            </div>

                        </div>

                    </div>


                    <!-- SAVE BUTTON -->

                    <div class="MI_settings-footer">
                        <?php submit_button('Instellingen opslaan', 'primary', 'submit', false); ?>
                    </div>

                </div>

            </div>

           



                <!-- TODO: Opkuisen van code, zodat het ook bruikbaar wordt voor de frontend -->
                <div id="preview"> <!-- Voorbeeld van de winkelwagen -->
                    <div class="MI_cart-preview-ui" data-anim="400">

                        <!-- Header -->
                        <div class="MI_cart-preview-header">
                            <div class="MI_cart-preview-heading MI_cart-panel">
                                <div class="MI_cart-preview-title">
                                    <font dir="auto" style="vertical-align: inherit;">
                                        <font dir="auto" style="vertical-align: inherit;">Controleer uw winkelwagen (2)</font>
                                    </font>
                                </div>

                                <div class="MI_cart-modal-close">
                                    <svg width="20" height="20" viewBox="0 0 24 24" class="MI_cart-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.1518 4.31359L4.22676 4.22676C4.50161 3.9519 4.93172 3.92691 5.2348 4.1518L5.32163 4.22676L12 10.9048L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0952 12L19.7732 18.6784C20.0481 18.9532 20.0731 19.3833 19.8482 19.6864L19.7732 19.7732C19.4984 20.0481 19.0683 20.0731 18.7652 19.8482L18.6784 19.7732L12 13.0952L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9048 12L4.22676 5.32163C3.9519 5.04678 3.92691 4.61667 4.1518 4.31359L4.22676 4.22676L4.1518 4.31359Z" fill="currentColor"></path>
                                    </svg>
                                </div>

                            </div>
                        </div>

                        
                        <!-- Products -->
                        <div class="MI_cart-product-wrap">

                            <!-- Body -->
                            <div class="MI_cart-product-body">

                                <!-- START: Cart Items -->
                                <div class="MI_cart-item-wrap pt-16">

                                    <!-- Cart Item -->
                                    <div class="MI_cart--item MI_cart-panel MI_cart-preview MI_cart_save_class_active" data-key="3">
                                        <!-- Thumbnail product -->
                                        <div class="MI_cart-thumb-wrap">
                                            <a href="#" class="MI_cart-image-wrapper">
                                                <img width="150" height="150" src="https://www.sannekesatelier.be/wp-content/plugins/cart-for-woocommerce/admin/assets/img/dummy/2.png" class="MI_cart-image">
                                            </a>        
                                            <div class="MI_cart-remove-item" data-key="3">
                                                <span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" class="MI_cart-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.1518 4.31359L4.22676 4.22676C4.50161 3.9519 4.93172 3.92691 5.2348 4.1518L5.32163 4.22676L12 10.9048L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0952 12L19.7732 18.6784C20.0481 18.9532 20.0731 19.3833 19.8482 19.6864L19.7732 19.7732C19.4984 20.0481 19.0683 20.0731 18.7652 19.8482L18.6784 19.7732L12 13.0952L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9048 12L4.22676 5.32163C3.9519 5.04678 3.92691 4.61667 4.1518 4.31359L4.22676 4.22676L4.1518 4.31359Z" fill="currentColor"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Product info -->
                                        <div class="MI_cart-item-info MI_cart-item-wrap-start">
                                            <div class="MI_cart-item-meta">

                                                <div class="MI_cart-item-title-price">
                                                    <a href="#" class="MI_cart-item-title">
                                                        <font dir="auto" style="vertical-align: inherit;">
                                                            <font dir="auto" style="vertical-align: inherit;">Rubberen schoenen</font>
                                                        </font>
                                                    </a>
                                                    <div class="MI_cart-item-meta-content">
                                                        <span class="MI_cart-attr-wrap">
                                                            <span class="MI_cart-attr-key">
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;">Kleur</font>
                                                                </font>
                                                            </span>
                                                            <font dir="auto" style="vertical-align: inherit;">
                                                                <font dir="auto" style="vertical-align: inherit;">:</font>
                                                            </font>
                                                            <span class="MI_cart-attr-value">
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;">Groente</font>
                                                                </font>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="MI_cart-qty-wrap">
                                                    <div class="MI_cart-quantity-selector">
                                                        <div class="MI_cart-quantity-button MI_cart-quantity-down" data-action="down">
                                                            <svg aria-hidden="true" focusable="false" role="presentation" class="MI_cart-icon" viewBox="0 0 20 20">
                                                                <path fill="currentColor" d="M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z"></path>
                                                            </svg>                    
                                                        </div>

                                                        <input class="MI_cart-quantity__input" name="MI_cart-quantity__input" type="text" inputmode="numeric" aria-label="Hoeveelheid" step="1" min="1" max="10" data-key="3" pattern="[0-9]*" value="1">
                                                        
                                                        <div class="MI_cart-quantity-button MI_cart-quantity-up" data-action="up">
                                                            <svg aria-hidden="true" focusable="false" role="presentation" class="MI_cart-icon" viewBox="0 0 20 20">
                                                                <path fill="currentColor" d="M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z"></path>
                                                            </svg>                    
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="MI_cart-item-misc">
                                                <div class="MI_cart-item-price">
                                                    <div class="d-flex">

                                                        <del aria-hidden="true" class="">
                                                            <span class="woocommerce-Price-amount amount">
                                                                <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                                    <font dir="auto" style="vertical-align: inherit;">
                                                                        <font dir="auto" style="vertical-align: inherit;">€</font>
                                                                    </font>
                                                                </span>
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;"> 40,00</font>
                                                                </font>
                                                            </span>
                                                        </del>

                                                        <span class="woocommerce-Price-amount amount d-flex">
                                                            <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;">€</font>
                                                                </font>
                                                            </span>
                                                            <font dir="auto" style="vertical-align: inherit;">
                                                                <font dir="auto" style="vertical-align: inherit;"> 36,00</font>
                                                            </font>
                                                        </span>				                    
                                                        
                                                    </div>
                                                    <div class="MI_cart-discounted-price">
                                                        <div class="MI_cart-discounted-text" data-percent="10.00" data-saving="4.00">
                                                            <font dir="auto" style="vertical-align: inherit;">
                                                                <font dir="auto" style="vertical-align: inherit;">Bespaar 10,00%</font>
                                                            </font>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <!-- Cart Item -->
                                    <div class="MI_cart--item MI_cart-panel MI_cart-preview MI_cart_save_class_active" data-key="4">
                                        <!-- Thumbnail product -->
                                        <div class="MI_cart-thumb-wrap">
                                            <a href="#" class="MI_cart-image-wrapper">
                                                <img width="150" height="150" src="https://www.sannekesatelier.be/wp-content/plugins/cart-for-woocommerce/admin/assets/img/dummy/1.png" class="MI_cart-image">
                                            </a>        
                                            <div class="MI_cart-remove-item" data-key="3">
                                                <span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" class="MI_cart-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.1518 4.31359L4.22676 4.22676C4.50161 3.9519 4.93172 3.92691 5.2348 4.1518L5.32163 4.22676L12 10.9048L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0952 12L19.7732 18.6784C20.0481 18.9532 20.0731 19.3833 19.8482 19.6864L19.7732 19.7732C19.4984 20.0481 19.0683 20.0731 18.7652 19.8482L18.6784 19.7732L12 13.0952L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9048 12L4.22676 5.32163C3.9519 5.04678 3.92691 4.61667 4.1518 4.31359L4.22676 4.22676L4.1518 4.31359Z" fill="currentColor"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Product info -->
                                        <div class="MI_cart-item-info MI_cart-item-wrap-start">
                                            <div class="MI_cart-item-meta">

                                                <div class="MI_cart-item-title-price">
                                                    <a href="#" class="MI_cart-item-title">
                                                        <font dir="auto" style="vertical-align: inherit;">
                                                            <font dir="auto" style="vertical-align: inherit;">Zijden hoed</font>
                                                        </font>
                                                    </a>
                                                    <div class="MI_cart-item-meta-content">
                                                        <span class="MI_cart-attr-wrap">
                                                            <span class="MI_cart-attr-key">
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;">Kleur</font>
                                                                </font>
                                                            </span>
                                                            <font dir="auto" style="vertical-align: inherit;">
                                                                <font dir="auto" style="vertical-align: inherit;">:</font>
                                                            </font>
                                                            <span class="MI_cart-attr-value">
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;">Groente</font>
                                                                </font>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="MI_cart-qty-wrap">
                                                    <div class="MI_cart-quantity-selector">
                                                        <div class="MI_cart-quantity-button MI_cart-quantity-down" data-action="down">
                                                            <svg aria-hidden="true" focusable="false" role="presentation" class="MI_cart-icon" viewBox="0 0 20 20">
                                                                <path fill="currentColor" d="M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z"></path>
                                                            </svg>                    
                                                        </div>

                                                        <input class="MI_cart-quantity__input" name="MI_cart-quantity__input" type="text" inputmode="numeric" aria-label="Hoeveelheid" step="1" min="1" max="10" data-key="3" pattern="[0-9]*" value="1">
                                                        
                                                        <div class="MI_cart-quantity-button MI_cart-quantity-up" data-action="up">
                                                            <svg aria-hidden="true" focusable="false" role="presentation" class="MI_cart-icon" viewBox="0 0 20 20">
                                                                <path fill="currentColor" d="M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z"></path>
                                                            </svg>                    
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="MI_cart-item-misc">
                                                <div class="MI_cart-item-price">
                                                    <span class="woocommerce-Price-amount amount">
                                                        <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                            <font dir="auto" style="vertical-align: inherit;">
                                                                <font dir="auto" style="vertical-align: inherit;">€</font>
                                                            </font>
                                                        </span>
                                                        <font dir="auto" style="vertical-align: inherit;">
                                                            <font dir="auto" style="vertical-align: inherit;"> 120,00</font>
                                                        </font>
                                                    </span>				            
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>


                        <!-- Slider Footer -->
                        <div class="MI_cart-slider-footer MI_cart-pb-16">

                            <div class="MI_cart-coupon-area">
                                <div class="MI_cart-coupon-head MI_cart-panel">
                                    <div class="MI_cart-coupon-title"> 
                                        <font dir="auto" style="vertical-align: inherit;">Heb je een kortingscode?</font>
                                    </div>
                                <div class="MI_cart-coupon-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" class="MI_cart-arrow-down-icon" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);">
                                        <path d="M2.21967 7.21967C2.51256 6.92678 2.98744 6.92678 3.28033 7.21967L12 15.9393L20.7197 7.21967C21.0126 6.92678 21.4874 6.92678 21.7803 7.21967C22.0732 7.51256 22.0732 7.98744 21.7803 8.28033L12.5303 17.5303C12.2374 17.8232 11.7626 17.8232 11.4697 17.5303L2.21967 8.28033C1.92678 7.98744 1.92678 7.51256 2.21967 7.21967Z" fill="currentColor"></path>
                                    </svg>			
                                    <svg width="16" height="16" viewBox="0 0 24 24" class="MI_cart-arrow-up-icon MI_cart-hide" fill="none" xmlns="http://www.w3.org/2000/svg" style="">
                                        <path d="M2.21967 7.21967C2.51256 6.92678 2.98744 6.92678 3.28033 7.21967L12 15.9393L20.7197 7.21967C21.0126 6.92678 21.4874 6.92678 21.7803 7.21967C22.0732 7.51256 22.0732 7.98744 21.7803 8.28033L12.5303 17.5303C12.2374 17.8232 11.7626 17.8232 11.4697 17.5303L2.21967 8.28033C1.92678 7.98744 1.92678 7.51256 2.21967 7.21967Z" fill="currentColor"></path>
                                    </svg>        
                                </div>
                            </div>

                            <div class="MI_cart-coupon-body MI_cart-panel" style="display: none;">
                                <div class="MI_cart-coupon-input-wrap">
                                    <input type="text" aria-label="Kortingscode" id="MI_cart-coupon__input" placeholder="Coupon Code">
                                    <div class="MI_cart-primary-button MI_cart-coupon-button">
                                        <font dir="auto" style="vertical-align: inherit;">
                                            <font dir="auto" style="vertical-align: inherit;">Toepassen</font>
                                        </font>
                                    </div>
                                </div>
                                <div class="MI_cart-input-error MI_cart-hide" data-content="Invalid coupon code"></div>
                            </div>

                        </div>
                            
                        <div class="MI_cart-summary_cta">
                            <!-- START: Order Summary -->
                            <div class="MI_cart-order-summary MI_cart-panel ">
                                <div class="MI_cart-order-summary-container">
                                    <div class="MI_cart-summary-line-item MI_cart-subtotal-wrap">
                                        <div class="MI_cart-summary-text">
                                            <strong>
                                                <font dir="auto" style="vertical-align: inherit;">
                                                    <font dir="auto" style="vertical-align: inherit;">Subtotaal</font>
                                                </font>
                                            </strong>
                                        </div>

                                        <div class="MI_cart-summary-amount">
                                            <strong>
                                                <span class="woocommerce-Price-amount amount">
                                                    <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                        <font dir="auto" style="vertical-align: inherit;">
                                                            <font dir="auto" style="vertical-align: inherit;">€</font>
                                                        </font>
                                                    </span>
                                                    <font dir="auto" style="vertical-align: inherit;">
                                                        <font dir="auto" style="vertical-align: inherit;"> &nbsp;156,00</font>
                                                    </font>
                                                </span>
                                            </strong>
                                        </div>
                                    </div>

                                    <div class="MI_cart-summary-line-item MI_cart-coupon-applied">
                                        <div class="MI_cart-summary-text MI_cart-coupon-text">
                                            <div class="MI_cart-coupon-label">
                                                <font dir="auto" style="vertical-align: inherit;">
                                                    <font dir="auto" style="vertical-align: inherit;">Coupon</font>
                                                </font>
                                            </div>

                                            <div class="MI_cart-coupon-code MI_cart-coupon-code-wrapper">
                                                <span>
                                                    <font dir="auto" style="vertical-align: inherit;">
                                                        <font dir="auto" style="vertical-align: inherit;">gratis20</font>
                                                    </font>
                                                </span>
                                                
                                                <span class="MI_cart-remove-coupon" data-coupon="free20">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                        <g clip-path="url(#clip0_1877_3336)">
                                                            <path d="M4.61012 4.00617L7.206 1.41022C7.37493 1.24137 7.37493 0.968349 7.206 0.799493C7.03714 0.630638 6.76412 0.630638 6.59527 0.799493L3.99932 3.39544L1.40345 0.799493C1.23451 0.630638 0.961573 0.630638 0.792717 0.799493C0.623782 0.968349 0.623782 1.24137 0.792717 1.41022L3.38859 4.00617L0.792717 6.60212C0.623782 6.77097 0.623782 7.04399 0.792717 7.21285C0.876868 7.29708 0.987514 7.33939 1.09808 7.33939C1.20865 7.33939 1.31921 7.29708 1.40345 7.21285L3.99932 4.6169L6.59527 7.21285C6.6795 7.29708 6.79006 7.33939 6.90063 7.33939C7.0112 7.33939 7.12177 7.29708 7.206 7.21285C7.37493 7.04399 7.37493 6.77097 7.206 6.60212L4.61012 4.00617Z" fill="white"></path>
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_1877_3336">
                                                                <rect width="6.66667" height="6.66667" fill="white" transform="translate(0.666016 0.664062)"></rect>
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="MI_cart-summary-amount">
                                            <font dir="auto" style="vertical-align: inherit;">
                                                <font dir="auto" style="vertical-align: inherit;">-</font>
                                            </font>
                                            <span class="woocommerce-Price-amount amount">
                                                <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                    <font dir="auto" style="vertical-align: inherit;">
                                                        <font dir="auto" style="vertical-align: inherit;">€</font>
                                                    </font>
                                                </span>
                                                <font dir="auto" style="vertical-align: inherit;">
                                                    <font dir="auto" style="vertical-align: inherit;"> 20,00</font>
                                                </font>
                                            </span>
                                        </div>
                                    </div>
                                
                                    <div class="MI_cart-summary-line-item">
                                        <div class="MI_cart-summary-text MI_cart-shipping-tax-calculation-text">
                                            <font dir="auto" style="vertical-align: inherit;">
                                                <font dir="auto" style="vertical-align: inherit;">Verzendkosten en belastingen kunnen bij het afrekenen opnieuw worden berekend.</font>
                                            </font>
                                        </div>
                                    </div>
                    
                                    <div class="MI_cart-text-light"></div>
                            </div>
                        </div>
                                    
                        <div class="MI_cart-checkout-wrap MI_cart-panel">
                            <div class="MI_cart-checkout-info">
                                <a href="#" id="MI_cart-checkout-button">
                                    <div class="MI_cart-checkout--icon">
                                        <svg data-icon="icon-checkout" width="20" height="20" viewBox="0 0 24 24" class="MI_cart-icon-checkout" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 2.71411C2 2.31972 2.31972 2 2.71411 2H3.34019C4.37842 2 4.97454 2.67566 5.31984 3.34917C5.55645 3.8107 5.72685 4.37375 5.86764 4.86133H20.5709C21.5186 4.86133 22.2035 5.7674 21.945 6.67914L19.809 14.2123C19.4606 15.4413 18.3384 16.2896 17.0609 16.2896H9.80665C8.51866 16.2896 7.39 15.4276 7.05095 14.185L6.13344 10.8225C6.12779 10.8073 6.12262 10.7917 6.11795 10.7758L4.64782 5.78023C4.59738 5.61449 4.55096 5.45386 4.50614 5.29878C4.36354 4.80529 4.23716 4.36794 4.04891 4.00075C3.82131 3.55681 3.61232 3.42822 3.34019 3.42822H2.71411C2.31972 3.42822 2 3.1085 2 2.71411ZM7.49529 10.3874L8.4288 13.8091C8.59832 14.4304 9.16266 14.8613 9.80665 14.8613H17.0609C17.6997 14.8613 18.2608 14.4372 18.435 13.8227L20.5709 6.28955H6.28975L7.49529 10.3874ZM12.0017 19.8577C12.0017 21.0408 11.0426 22 9.85941 22C8.67623 22 7.71708 21.0408 7.71708 19.8577C7.71708 18.6745 8.67623 17.7153 9.85941 17.7153C11.0426 17.7153 12.0017 18.6745 12.0017 19.8577ZM10.5735 19.8577C10.5735 19.4633 10.2538 19.1436 9.85941 19.1436C9.46502 19.1436 9.1453 19.4633 9.1453 19.8577C9.1453 20.2521 9.46502 20.5718 9.85941 20.5718C10.2538 20.5718 10.5735 20.2521 10.5735 19.8577ZM19.1429 19.8577C19.1429 21.0408 18.1837 22 17.0005 22C15.8173 22 14.8582 21.0408 14.8582 19.8577C14.8582 18.6745 15.8173 17.7153 17.0005 17.7153C18.1837 17.7153 19.1429 18.6745 19.1429 19.8577ZM17.7146 19.8577C17.7146 19.4633 17.3949 19.1436 17.0005 19.1436C16.6061 19.1436 16.2864 19.4633 16.2864 19.8577C16.2864 20.2521 16.6061 20.5718 17.0005 20.5718C17.3949 20.5718 17.7146 20.2521 17.7146 19.8577Z" fill="currentColor"></path>
                                        </svg>                
                                    </div>
                                    <div class="MI_cart-checkout--text">
                                        <font dir="auto" style="vertical-align: inherit;">
                                            <font dir="auto" style="vertical-align: inherit;">Afrekenen</font>
                                        </font>
                                    </div>
                                    <div class="MI_cart-checkout--price MI_cart-hide">
                                        <div class="MI_cart-checkout--price-discounted">
                                            <span class="woocommerce-Price-amount amount">
                                                <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                    <font dir="auto" style="vertical-align: inherit;">
                                                        <font dir="auto" style="vertical-align: inherit;">€</font>
                                                    </font>
                                                </span>
                                                <font dir="auto" style="vertical-align: inherit;">
                                                    <font dir="auto" style="vertical-align: inherit;"> 136,00</font>
                                                </font>
                                            </span>
                                        </div>
                                        <div class="MI_cart-checkout--price-normal MI_cart-hide">
                                            <span class="woocommerce-Price-amount amount">
                                                <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                    <font dir="auto" style="vertical-align: inherit;">
                                                        <font dir="auto" style="vertical-align: inherit;">€</font>
                                                    </font>
                                                </span>
                                                <font dir="auto" style="vertical-align: inherit;">
                                                    <font dir="auto" style="vertical-align: inherit;"> 156,00</font>
                                                </font>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            
                            <a href="#" class="MI_cart-shopping-link MI_cart-modal-close MI_cart-hide">
                                <font dir="auto" style="vertical-align: inherit;">
                                    <font dir="auto" style="vertical-align: inherit;">Verder winkelen</font>
                                </font>
                            </a>
                        </div>

                            <!-- START: Upsell Style -->
                            <div class="MI_cart-below-checkout-upsell">
                        </div>

                        <div id="MI_cart-popup" class="MI_cart-popup">
                            <div class="MI_cart-popup-content">
                                <div class="MI_cart-title-wrap">
                                    <span class="MI_cart-close">
                                        <svg width="20" height="20" viewBox="0 0 24 24" class="MI_cart-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.1518 4.31359L4.22676 4.22676C4.50161 3.9519 4.93172 3.92691 5.2348 4.1518L5.32163 4.22676L12 10.9048L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0952 12L19.7732 18.6784C20.0481 18.9532 20.0731 19.3833 19.8482 19.6864L19.7732 19.7732C19.4984 20.0481 19.0683 20.0731 18.7652 19.8482L18.6784 19.7732L12 13.0952L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9048 12L4.22676 5.32163C3.9519 5.04678 3.92691 4.61667 4.1518 4.31359L4.22676 4.22676L4.1518 4.31359Z" fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </div>

                                <div class="MI_cart-item-meta-content"></div>
                            </div>
                        </div>
                    </div>
                </div>

            
            </form>
        </div>
    </div>
    <?php
}

function shop_controls_forced_by_setup_wizard(): bool {
    if (!defined('MADEIT_SETUP_WIZARD') || !MADEIT_SETUP_WIZARD) {
        return false;
    }

    if (!function_exists('madeit_setup_requires_child_theme')) {
        return false;
    }

    // If a child theme is still required, setup is not complete yet.
    return madeit_setup_requires_child_theme();
}

function shop_controls_is_allowed_crawler(): bool {
    $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? (string) $_SERVER['HTTP_USER_AGENT'] : '';
    if ($user_agent === '') {
        return false;
    }

    $allowed_crawlers = [
        'googlebot',
        'bingbot',
        'Google-InspectionTool',
        'duckduckbot',
        'slurp',
        'applebot',
        'petalbot',
    ];

    $allowed_crawlers = apply_filters('shop_controls_allowed_crawlers', $allowed_crawlers);

    foreach ((array) $allowed_crawlers as $crawler_signature) {
        if (!is_string($crawler_signature) || $crawler_signature === '') {
            continue;
        }

        if (stripos($user_agent, $crawler_signature) !== false) {
            return true;
        }
    }

    return false;
}

// Redirect users to the under construction page if the mode is on
// function shop_controls_template_redirect() {
//     if (is_admin()) return; // voorkom in admin

//     $mode = get_option('shop_controls_mode', 'off');
//     $forced_mode = shop_controls_forced_by_setup_wizard();
//     if ($mode !== 'on' && !$forced_mode) return;

//     if (!$forced_mode) {
//         // Check eindtijd
//         $end_time = get_option('shop_controls_end_time');
//         if (!empty($end_time) && strtotime($end_time) < time()) {
//             update_option('shop_controls_mode', 'off');
//             return;
//         }

//         // Check of gebruiker mag kijken
//         $allowed_roles = get_option('shop_controls_user_roles', array('administrator'));
//         $user = wp_get_current_user();
//         foreach ($user->roles as $role) {
//             if (in_array($role, $allowed_roles, true)) return;
//         }

//         // Optionally allow known search engine crawlers to bypass maintenance mode.
//         if (get_option('shop_controls_allow_crawlers', '0') === '1' && shop_controls_is_allowed_crawler()) {
//             return;
//         }
//     }

//     // Laad gekozen template
//     $chosen_template = get_option('shop_controls_template', 'templ-1');
//     $relative_template = 'inc/admin/underConstruction/templates/' . $chosen_template . '.php';
//     // locate_template zoekt eerst in child theme, daarna parent theme
//     $template_path = locate_template([$relative_template]);

//     if (!empty($template_path) && file_exists($template_path)) {
//         // Onderhoudspagina: geef een correcte statuscode en disable caching
//         status_header(503);
//         nocache_headers();
//         include($template_path);
//         exit;
//     } else {
//         // fallback
//         wp_die('Under Construction - template niet gevonden.');
//     }
// }
// add_action('template_redirect', 'shop_controls_template_redirect');

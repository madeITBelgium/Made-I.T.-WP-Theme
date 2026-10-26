<?php
// Save the settings
function shop_controls_register_settings() {
    register_setting('shop_controls_options_group', 'shop_controls_mode');
    register_setting(
        'shop_controls_options_group',
        'shop_controls_allow_crawlers',
        [
            'type' => 'string',
            'sanitize_callback' => function($value) {
                return $value === '1' ? '1' : '0';
            },
            'default' => '0',
        ]
    );
    register_setting(
        'shop_controls_options_group',
        'shop_controls_user_roles',
        [
            'type' => 'array',
            'sanitize_callback' => function($input) {
                if (!is_array($input)) return [];
                return array_map('sanitize_text_field', $input);
            },
            'default' => ['administrator'],
        ]
    );

    // Register additional settings
    register_setting('shop_controls_options_group', 'shop_controls_end_time', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '',
    ]);
    
}
add_action('admin_init', 'shop_controls_register_settings');

// Enqueue scripts and styles for the admin page
function shop_controls_enqueue_media_uploader($hook) {
    if ($hook !== 'woocommerce_page_shop-controls') return;

    wp_enqueue_media();
    wp_enqueue_script('shop-controls-media', get_template_directory_uri() . '/inc/admin/woocommerce/index.js', ['jquery'], null, true);
}
add_action('admin_enqueue_scripts', 'shop_controls_enqueue_media_uploader');


// create a item in the admin menu under the woocommerce menu
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

// create the page for the shop controls settings
function shop_controls_page() {
    ?>
    <!-- import the style and js -->
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/inc/admin/woocommerce/style.css">
    <script src="<?php echo get_template_directory_uri(); ?>/inc/admin/woocommerce/index.js"></script>

    <div class="MI_header">
        <div class="MI_header_l">
            <div>
                <a href="/wp-admin/admin.php?page=shop-controls&path=/dashboard" style="text-decoration: none;">
                    <h1>Shop Controls</h1>
                </a>
            </div>
            <div class="MI_navigation">
                <span><a href="/wp-admin/admin.php?page=shop-controls&path=/dashboard" class="">Dashboard</a></span>
                <span><a href="#" class="">Store Checkout</a></span>
                <span><a href="" class="">Templates <span class="MI_navigation_badge">Coming Soon</span></a></span>
                <span><a href="" class="">Automations <span class="MI_navigation_badge">Coming Soon</span></a></span>
                <span><a href="/wp-admin/admin.php?page=shop-controls&path=/cart" class="">Cart</a></span>
            </div>
        </div>
        <div class="MI_header_r">
            <span class="MI-tooltip-wrap" style="height: 24px; width: 24px;    margin-bottom: 0.5rem;">
                <a href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17.7617C12.5393 17.7617 12.9766 17.3245 12.9766 16.7852C12.9766 16.2458 12.5393 15.8086 12 15.8086C11.4607 15.8086 11.0234 16.2458 11.0234 16.7852C11.0234 17.3245 11.4607 17.7617 12 17.7617Z" fill="#353030"></path>
                        <path d="M12 2C6.47328 4 4 6.47254 4 12C2 17.5267 6.47254 22 12 22C17.5267 22 22 17.5275 22 12C22 6.47328 17.5275 4 12 2ZM12 20.4375C7.33684 20.4375 3.5625 16.6638 3.5625 12C3.5625 7.33684 7.33621 3.5625 12 3.5625C16.6632 3.5625 20.4375 7.33621 20.4375 12C20.4375 16.6632 16.6638 20.4375 12 20.4375Z" fill="#353030"></path>
                        <path d="M12 7.01953C10.2769 7.01953 8.875 8.42141 8.875 10.1445C8.875 10.576 9.22477 10.9258 9.65625 10.9258C10.0877 10.9258 10.4375 10.576 10.4375 10.1445C10.4375 9.28297 11.1384 8.58203 12 8.58203C12.8616 8.58203 13.5625 9.28297 13.5625 10.1445C13.5625 11.0061 12.8616 11.707 12 11.707C11.5685 11.707 11.2188 12.0568 11.2188 12.4883V14.4414C11.2188 14.8729 11.5685 15.2227 12 15.2227C12.4315 15.2227 12.7812 14.8729 12.7812 14.4414V13.1707C14.1276 12.8229 15.125 11.598 15.125 10.1445C15.125 8.42141 13.7231 7.01953 12 7.01953Z" fill="#353030"></path>
                    </svg>
                </a>
            </span>
        </div>
    </div>

    <div class="container d-flex" style="display: flex; margin-top: 50px;"> 
            <form method="post" action="options.php" style="width: calc(100% - 20px);">

                <!-- CART PAGE -->
                <div id="MI_cart">
                    <div class="heading">
                        <H1>Winkelwagen</H1>
                        <div class="" style="--wp-components-flex-align: center; --wp-components-flex-direction: row; --wp-components-flex-wrap: nowrap; --wp-components-flex-gap: calc(4px * 4); --wp-components-flex-justify: flex-start;">
                            <label for="inspector-toggle-control-0" class="" style="--wp-components-flex-item-display: block;">
                                <font dir="auto" style="vertical-align: inherit;">
                                    <font dir="auto" style="vertical-align: inherit;">Winkelwagen inschakelen</font>
                                </font>
                            </label>

                            <span id="cartCheck" class="components-form-toggle" onclick="this.classList.toggle('is-checked')">
                                <input class="components-form-toggle__input" id="inspector-toggle-control-0" type="checkbox">
                                <span class="components-form-toggle__track"></span>
                                <span class="components-form-toggle__thumb"></span>
                            </span>
                            
                        </div>
                    </div>

                    <div class="MI-disable-cart-info">
                        <span class="MI-cart-info-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.0016 2C17.5253 4 22.0031 6.47785 22.0031 12.0016C22.0031 17.5253 17.5253 22.0031 12.0016 22.0031C6.47785 22.0031 4 17.5253 4 12.0016C2 6.47785 6.47785 4 12.0016 2ZM12.0016 3.5C7.30627 3.5 3.5 7.30627 3.5 12.0016C3.5 16.6968 7.30627 20.5031 12.0016 20.5031C16.6968 20.5031 20.5031 16.6968 20.5031 12.0016C20.5031 7.30627 16.6968 3.5 12.0016 3.5ZM11.9979 10.5006C12.3776 10.5003 12.6916 10.7823 12.7415 11.1483L12.7484 11.2501L12.752 16.7517C12.7523 17.1659 12.4167 17.5019 12.0025 17.5022C11.6228 17.5024 11.3088 17.2205 11.2589 16.8544L11.252 16.7527L11.2484 11.2511C11.2481 10.8369 11.5837 10.5009 11.9979 10.5006ZM12.002 7.00282C12.5535 7.00282 13.0007 7.44993 13.0007 8.00148C13.0007 8.55303 12.5535 9.00014 12.002 9.00014C11.4505 9.00014 11.0033 8.55303 11.0033 8.00148C11.0033 7.44993 11.4505 7.00282 12.002 7.00282Z" fill="#353030"></path>
                            </svg>
                        </span>
                        <span class="MI-cart-info-text">De winkelwagen is momenteel uitgeschakeld. Gebruik de optie <strong>'Winkelwagen inschakelen'</strong> om de winkelwagen in uw winkel te activeren.</span>
                    </div>

                    <br><br>

                    <div class="settings">
                        <h2>Basis instellingen</h2>
                        <hr>
                        <br>

                        <div class="row">
                            <div class="col-4">
                                <p class="mb-4">Pictogramzichtbaarheid <span class="tooltip dashicons dashicons-editor-help"><span>Selecteer wanneer het pictogram zichtbaar moet zijn</span></span></p>
                                <p class="mb-4">Pictogrampositie</p>
                                <p class="mb-4">Winkelwagenpictogram verbergen <span class="tooltip dashicons dashicons-editor-help"><span>Het pictogram blijft verborgen totad de gerbuiker het eerste artikel aan zijn winkelwagen heeft toegevoegd.</span></span></p>
                                <p class="mb-4">Automatisch te openen zijbalk <span class="tooltip dashicons dashicons-editor-help"><span>De zijbalk wordt automatisch geopend wanneer een artikel aan de winkelwagen wordt toegevoegd.</span></span></p>
                            </div>

                            <div class="col-8 d-flex flex-direction-column">
                                <div class="mb-4 d-flex" style="gap: 30px;">
                                    <div class="group">
                                        <input type="radio" name="icon_visibility" value="visible" id="icon_visibility_visible">
                                        <label for="icon_visibility_visible">Volledige website</label>
                                    </div>
                                    <div class="group">
                                        <input type="radio" name="icon_visibility" value="hidden" id="icon_visibility_hidden">
                                        <label for="icon_visibility_hidden">Woocommerce pagina's</label>
                                    </div>
                                    <div class="group">
                                        <input type="radio" name="icon_visibility" value="hidden" id="icon_visibility_hidden_2" checked>
                                        <label for="icon_visibility_hidden_2">Geen <span class="tooltip dashicons dashicons-editor-help"><span>Kies 'Geen' om het pictogram volledig te verbergen op de pagina's. Deze zal dan enkel in de header te zien zijn.</span></span></label>
                                    </div>
                                </div>

                                <div class="mb-4 d-flex" style="gap: 30px;">
                                    <div class="group">
                                        <input type="radio" name="icon_position" value="left" id="icon_position_left" checked>
                                        <label for="icon_position_left">Linksonder</label>
                                    </div>
                                    <div class="group">
                                        <input type="radio" name="icon_position" value="right" id="icon_position_right">
                                        <label for="icon_position_right">Rechtsonder</label>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <span class="components-form-toggle" onclick="this.classList.toggle('is-checked')">
                                        <input class="components-form-toggle__input" id="inspector-toggle-control-34" type="checkbox">
                                        <span class="components-form-toggle__track"></span>
                                        <span class="components-form-toggle__thumb"></span>
                                    </span>
                                </div>

                                <div class="mb-4">
                                    <span class="components-form-toggle is-checked" onclick="this.classList.toggle('is-checked')">
                                        <input class="components-form-toggle__input" id="inspector-toggle-control-34" type="checkbox">
                                        <span class="components-form-toggle__track"></span>
                                        <span class="components-form-toggle__thumb"></span>
                                    </span>
                                </div>
    
                            </div>
                        </div>

                        <br><br>
                    
                        <h2>Couponvelden</h2>
                        <hr>
                        <br>

                        <div class="row">
                            <div class="col-4">
                                <p class="mb-4">Couponvelden inschakelen <span class="tooltip dashicons dashicons-editor-help"><span>Toon het kortingsveld in het winkelmandje</span></span></p>
                                <p class="mb-4">Weergave</p>
                                <p class="mb-4">Koptekst van het couponvak</p>
                                <p class="mb-4">Kortingsvakje (plaatsvervangende tekst)</p>
                                <p class="mb-4">Tekst op de knop 'Kortingsvak'</p>
                            </div>

                            <div class="col-8 d-flex flex-direction-column">
                                <div class="mb-4">
                                    <span class="components-form-toggle" onclick="this.classList.toggle('is-checked')">
                                        <input class="components-form-toggle__input" id="inspector-toggle-control-34" type="checkbox">
                                        <span class="components-form-toggle__track"></span>
                                        <span class="components-form-toggle__thumb"></span>
                                    </span>
                                </div>

                                <div class="mb-4 d-flex" style="gap: 30px;">
                                    <div class="group">
                                        <input type="radio" name="icon_position" value="left" id="coupon_collapsed" checked>
                                        <label for="coupon_collapsed">Dichtgeklapt</label>
                                    </div>
                                    <div class="group">
                                        <input type="radio" name="icon_position" value="right" id="coupon_open">
                                        <label for="coupon_open">Open</label>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <input type="text" class="form-control" placeholder="Koptekst van het couponvak" value="Heb je een kortingscode?">
                                </div>

                                <div class="mb-4">
                                    <input type="text" class="form-control" placeholder="Kortingsvakje (plaatsvervangende tekst)" value="Coupon Code">
                                </div>

                                <div class="mb-4">
                                    <input type="text" class="form-control" placeholder="Tekst op de knop 'Kortingsvak'" value="Toepassen">
                                </div>
    
                            </div>
                        </div>



                    </div>
                    
                </div>

                <!-- TODO: Opkuisen van code, zodat het ook bruikbaar wordt voor de frontend -->
                <div id="preview"> <!-- Voorbeeld van de winkelwagen -->
                    <div class="fkcart-preview-ui " data-anim="400">
                        <!-- Header -->
                        <div class="fkcart-slider-header">
                            <div class="fkcart-slider-heading fkcart-panel">
                                <div class="fkcart-title">
                                    <font dir="auto" style="vertical-align: inherit;">
                                        <font dir="auto" style="vertical-align: inherit;">Controleer uw winkelwagen (2)</font>
                                    </font>
                                </div>

                                <div class="fkcart-modal-close">
                                    <svg width="20" height="20" viewBox="0 0 24 24" class="fkcart-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.1518 4.31359L4.22676 4.22676C4.50161 3.9519 4.93172 3.92691 5.2348 4.1518L5.32163 4.22676L12 10.9048L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0952 12L19.7732 18.6784C20.0481 18.9532 20.0731 19.3833 19.8482 19.6864L19.7732 19.7732C19.4984 20.0481 19.0683 20.0731 18.7652 19.8482L18.6784 19.7732L12 13.0952L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9048 12L4.22676 5.32163C3.9519 5.04678 3.92691 4.61667 4.1518 4.31359L4.22676 4.22676L4.1518 4.31359Z" fill="currentColor"></path>
                                    </svg>
                                </div>

                            </div>
                        </div>

                        
                        <!-- Products -->
                        <div class="fkcart-reward-product-wrap fkcart-animation-active">

                            <!-- Body -->
                            <div class="fkcart-slider-body">

                                <!-- START: Cart Items -->
                                <div class="fkcart-item-wrap fkcart-pt-16">
                                    <div class="fkcart--item fkcart-panel fkcart-preview fkcart_save_class_active" data-key="3">

                                        <div class="fkcart-thumb-wrap">
                                            <a href="#" class="fkcart-image-wrapper">
                                                <img width="150" height="150" src="https://www.sannekesatelier.be/wp-content/plugins/cart-for-woocommerce/admin/assets/img/dummy/2.png" class="fkcart-image">
                                            </a>        
                                            <div class="fkcart-remove-item" data-key="3">
                                                <span>    
                                                    <svg width="14" height="14" viewBox="0 0 24 24" class="fkcart-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.1518 4.31359L4.22676 4.22676C4.50161 3.9519 4.93172 3.92691 5.2348 4.1518L5.32163 4.22676L12 10.9048L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0952 12L19.7732 18.6784C20.0481 18.9532 20.0731 19.3833 19.8482 19.6864L19.7732 19.7732C19.4984 20.0481 19.0683 20.0731 18.7652 19.8482L18.6784 19.7732L12 13.0952L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9048 12L4.22676 5.32163C3.9519 5.04678 3.92691 4.61667 4.1518 4.31359L4.22676 4.22676L4.1518 4.31359Z" fill="currentColor"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="fkcart-item-info fkcart-item-wrap-start">
                                            <div class="fkcart-item-meta">

                                                <div class="fkcart-item-title-price">
                                                    <a href="#" class="fkcart-item-title">
                                                        <font dir="auto" style="vertical-align: inherit;">
                                                            <font dir="auto" style="vertical-align: inherit;">Rubberen schoenen</font>
                                                        </font>
                                                    </a>                
                                                    <div class="fkcart-item-meta-content">
                                                        <span class="fkcart-attr-wrap">
                                                            <span class="fkcart-attr-key">
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;">Kleur</font>
                                                                </font>
                                                            </span>
                                                            <font dir="auto" style="vertical-align: inherit;">
                                                                <font dir="auto" style="vertical-align: inherit;">:</font>
                                                            </font>
                                                            <span class="fkcart-attr-value">
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;">Groente</font>
                                                                </font>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="fkcart-qty-wrap">
                                                    <div class=" fkcart-quantity-selector">
                                                        <div class="fkcart-quantity-button fkcart-quantity-down" data-action="down">
                                                            <svg aria-hidden="true" focusable="false" role="presentation" class="fkcart-icon" viewBox="0 0 20 20">
                                                                <path fill="currentColor" d="M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z"></path>
                                                            </svg>                    
                                                        </div>

                                                        <input class="fkcart-quantity__input" name="fkcart-quantity__input" type="text" inputmode="numeric" aria-label="Hoeveelheid" step="1" min="1" max="10" data-key="3" pattern="[0-9]*" value="1">
                                                        
                                                        <div class="fkcart-quantity-button fkcart-quantity-up" data-action="up">
                                                            <svg aria-hidden="true" focusable="false" role="presentation" class="fkcart-icon" viewBox="0 0 20 20">
                                                                <path fill="currentColor" d="M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z"></path>
                                                            </svg>                    
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="fkcart-item-misc">
                                                <div class="fkcart-item-price">
                                                    <div class="d-flex">

                                                        <del aria-hidden="true" class="">
                                                            <span class="woocommerce-Price-amount amount">
                                                                <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                                    <font dir="auto" style="vertical-align: inherit;">
                                                                        <font dir="auto" style="vertical-align: inherit;">€</font>
                                                                    </font>
                                                                </span>
                                                                <font dir="auto" style="vertical-align: inherit;">
                                                                    <font dir="auto" style="vertical-align: inherit;"> &nbsp;40,00</font>
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
                                                                <font dir="auto" style="vertical-align: inherit;"> &nbsp;36,00</font>
                                                            </font>
                                                        </span>				                    
                                                        
                                                    </div>
                                                    <div class="fkcart-discounted-price">
                                                        <div class="fkcart-discounted-text" data-percent="10.00" data-saving="4.00">
                                                            <font dir="auto" style="vertical-align: inherit;">
                                                                <font dir="auto" style="vertical-align: inherit;">Bespaar 10,00%</font>
                                                            </font>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="fkcart--item fkcart-panel fkcart-preview " data-key="4">
                                        <div class="fkcart-thumb-wrap">
                                            <a href="#" class="fkcart-image-wrapper"><img width="150" height="150" src="https://www.sannekesatelier.be/wp-content/plugins/cart-for-woocommerce/admin/assets/img/dummy/1.png" class="fkcart-image"></a>        <div class="fkcart-remove-item" data-key="4">
                                                <span>    <svg width="14" height="14" viewBox="0 0 24 24" class="fkcart-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.1518 4.31359L4.22676 4.22676C4.50161 3.9519 4.93172 3.92691 5.2348 4.1518L5.32163 4.22676L12 10.9048L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0952 12L19.7732 18.6784C20.0481 18.9532 20.0731 19.3833 19.8482 19.6864L19.7732 19.7732C19.4984 20.0481 19.0683 20.0731 18.7652 19.8482L18.6784 19.7732L12 13.0952L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9048 12L4.22676 5.32163C3.9519 5.04678 3.92691 4.61667 4.1518 4.31359L4.22676 4.22676L4.1518 4.31359Z" fill="currentColor"></path>
                                        </svg>
                                        </span>
                                            </div>
                                        </div>
                                        <div class="fkcart-item-info fkcart-item-wrap-start">
                                            <div class="fkcart-item-meta">
                                                <div class="fkcart-item-title-price">
                                                    <a href="#" class="fkcart-item-title">
                                                        <font dir="auto" style="vertical-align: inherit;">
                                                            <font dir="auto" style="vertical-align: inherit;">Zijden hoed</font>
                                                        </font>
                                                    </a>                
                                                    <div class="fkcart-item-meta-content"></div>
                                                </div>

                                                <div class="fkcart-qty-wrap">
                                                    <div class=" fkcart-quantity-selector">
                                                        <div class="fkcart-quantity-button fkcart-quantity-down" data-action="down">
                                                            <svg aria-hidden="true" focusable="false" role="presentation" class="fkcart-icon" viewBox="0 0 20 20">
                                                                <path fill="currentColor" d="M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z"></path>
                                                            </svg>                    
                                                        </div>
                                                        <input class="fkcart-quantity__input" name="fkcart-quantity__input" type="text" inputmode="numeric" aria-label="Hoeveelheid" step="1" min="1" max="10" data-key="4" pattern="[0-9]*" value="1">
                                                        <div class="fkcart-quantity-button fkcart-quantity-up" data-action="up">
                                                            <svg aria-hidden="true" focusable="false" role="presentation" class="fkcart-icon" viewBox="0 0 20 20">
                                                                <path fill="currentColor" d="M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z"></path>
                                                            </svg>                    
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fkcart-item-misc">
                                                <div class="fkcart-item-price">
                                                    <span class="woocommerce-Price-amount amount">
                                                        <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                            <font dir="auto" style="vertical-align: inherit;">
                                                                <font dir="auto" style="vertical-align: inherit;">€</font>
                                                            </font>
                                                        </span>
                                                        <font dir="auto" style="vertical-align: inherit;">
                                                            <font dir="auto" style="vertical-align: inherit;"> &nbsp;120,00</font>
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
                        <div class="fkcart-slider-footer fkcart-pb-16">

                            <div class="fkcart-coupon-area">
                                <div class="fkcart-coupon-head fkcart-panel">
                                    <div class="fkcart-coupon-title">   <font dir="auto" style="vertical-align: inherit;">
                                        <font dir="auto" style="vertical-align: inherit;">Heb je een kortingscode?</font>
                                    </font>
                                </div>
                                <div class="fkcart-coupon-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" class="fkcart-arrow-down-icon" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);">
                                        <path d="M2.21967 7.21967C2.51256 6.92678 2.98744 6.92678 3.28033 7.21967L12 15.9393L20.7197 7.21967C21.0126 6.92678 21.4874 6.92678 21.7803 7.21967C22.0732 7.51256 22.0732 7.98744 21.7803 8.28033L12.5303 17.5303C12.2374 17.8232 11.7626 17.8232 11.4697 17.5303L2.21967 8.28033C1.92678 7.98744 1.92678 7.51256 2.21967 7.21967Z" fill="currentColor"></path>
                                    </svg>			
                                    <svg width="16" height="16" viewBox="0 0 24 24" class="fkcart-arrow-up-icon fkcart-hide" fill="none" xmlns="http://www.w3.org/2000/svg" style="">
                                        <path d="M2.21967 7.21967C2.51256 6.92678 2.98744 6.92678 3.28033 7.21967L12 15.9393L20.7197 7.21967C21.0126 6.92678 21.4874 6.92678 21.7803 7.21967C22.0732 7.51256 22.0732 7.98744 21.7803 8.28033L12.5303 17.5303C12.2374 17.8232 11.7626 17.8232 11.4697 17.5303L2.21967 8.28033C1.92678 7.98744 1.92678 7.51256 2.21967 7.21967Z" fill="currentColor"></path>
                                    </svg>        
                                </div>
                            </div>

                            <div class="fkcart-coupon-body fkcart-panel" style="display: none;">
                                <div class="fkcart-coupon-input-wrap">
                                    <input type="text" aria-label="Kortingscode" id="fkcart-coupon__input" placeholder="Coupon Code" required="">
                                    <div class="fkcart-primary-button fkcart-coupon-button">
                                        <font dir="auto" style="vertical-align: inherit;">
                                            <font dir="auto" style="vertical-align: inherit;">Toepassen</font>
                                        </font>
                                    </div>
                                </div>
                                <div class="fkcart-input-error fkcart-hide" data-content="Invalid coupon code"></div>
                            </div>

                        </div>
                            
                        <div class="fkcart_summary_cta">
                            <!-- START: Order Summary -->
                            <div class="fkcart-order-summary fkcart-panel ">
                                <div class="fkcart-order-summary-container">
                                    <div class="fkcart-summary-line-item fkcart-subtotal-wrap">
                                        <div class="fkcart-summary-text">
                                            <strong>
                                                <font dir="auto" style="vertical-align: inherit;">
                                                    <font dir="auto" style="vertical-align: inherit;">Subtotaal</font>
                                                </font>
                                            </strong>
                                        </div>
                                        <div class="fkcart-summary-amount">
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

                                    <div class="fkcart-summary-line-item fkcart-coupon-applied">
                                        <div class="fkcart-summary-text fkcart-coupon-text">
                                            <div class="fkcart-coupon-label">
                                                <font dir="auto" style="vertical-align: inherit;">
                                                    <font dir="auto" style="vertical-align: inherit;">Coupon</font>
                                                </font>
                                            </div>

                                            <div class="fkcart-coupon-code fkcart-coupon-code-wrapper">
                                                <span>
                                                    <font dir="auto" style="vertical-align: inherit;">
                                                        <font dir="auto" style="vertical-align: inherit;">gratis20</font>
                                                    </font>
                                                </span>
                                                
                                                <span class="fkcart-remove-coupon" data-coupon="free20">
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
                                    <div class="fkcart-summary-amount">
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
                                                <font dir="auto" style="vertical-align: inherit;"> &nbsp;20,00</font>
                                            </font>
                                        </span>
                                    </div>

                                </div>
                                
                                <div class="fkcart-summary-line-item">
                                    <div class="fkcart-summary-text fkcart-shipping-tax-calculation-text">
                                        <font dir="auto" style="vertical-align: inherit;">
                                            <font dir="auto" style="vertical-align: inherit;">Verzendkosten en belastingen kunnen bij het afrekenen opnieuw worden berekend.</font>
                                        </font>
                                    </div>
                                </div>
                    
                                <div class="fkcart-text-light"></div>
                            </div>
                        </div>
                                    
                        <div class="fkcart-checkout-wrap fkcart-panel">
                            <div class="fkcart-checkout-info">
                                <a href="#" id="fkcart-checkout-button">
                                    <div class="fkcart-checkout--icon">
                                        <svg data-icon="icon-checkout" width="20" height="20" viewBox="0 0 24 24" class="fkcart-icon-checkout" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 2.71411C2 2.31972 2.31972 2 2.71411 2H3.34019C4.37842 2 4.97454 2.67566 5.31984 3.34917C5.55645 3.8107 5.72685 4.37375 5.86764 4.86133H20.5709C21.5186 4.86133 22.2035 5.7674 21.945 6.67914L19.809 14.2123C19.4606 15.4413 18.3384 16.2896 17.0609 16.2896H9.80665C8.51866 16.2896 7.39 15.4276 7.05095 14.185L6.13344 10.8225C6.12779 10.8073 6.12262 10.7917 6.11795 10.7758L4.64782 5.78023C4.59738 5.61449 4.55096 5.45386 4.50614 5.29878C4.36354 4.80529 4.23716 4.36794 4.04891 4.00075C3.82131 3.55681 3.61232 3.42822 3.34019 3.42822H2.71411C2.31972 3.42822 2 3.1085 2 2.71411ZM7.49529 10.3874L8.4288 13.8091C8.59832 14.4304 9.16266 14.8613 9.80665 14.8613H17.0609C17.6997 14.8613 18.2608 14.4372 18.435 13.8227L20.5709 6.28955H6.28975L7.49529 10.3874ZM12.0017 19.8577C12.0017 21.0408 11.0426 22 9.85941 22C8.67623 22 7.71708 21.0408 7.71708 19.8577C7.71708 18.6745 8.67623 17.7153 9.85941 17.7153C11.0426 17.7153 12.0017 18.6745 12.0017 19.8577ZM10.5735 19.8577C10.5735 19.4633 10.2538 19.1436 9.85941 19.1436C9.46502 19.1436 9.1453 19.4633 9.1453 19.8577C9.1453 20.2521 9.46502 20.5718 9.85941 20.5718C10.2538 20.5718 10.5735 20.2521 10.5735 19.8577ZM19.1429 19.8577C19.1429 21.0408 18.1837 22 17.0005 22C15.8173 22 14.8582 21.0408 14.8582 19.8577C14.8582 18.6745 15.8173 17.7153 17.0005 17.7153C18.1837 17.7153 19.1429 18.6745 19.1429 19.8577ZM17.7146 19.8577C17.7146 19.4633 17.3949 19.1436 17.0005 19.1436C16.6061 19.1436 16.2864 19.4633 16.2864 19.8577C16.2864 20.2521 16.6061 20.5718 17.0005 20.5718C17.3949 20.5718 17.7146 20.2521 17.7146 19.8577Z" fill="currentColor"></path>
                                        </svg>                
                                    </div>
                                    <div class="fkcart-checkout--text">
                                        <font dir="auto" style="vertical-align: inherit;">
                                            <font dir="auto" style="vertical-align: inherit;">Afrekenen</font>
                                        </font>
                                    </div>
                                    <div class="fkcart-checkout--price fkcart-hide">
                                        <div class="fkcart-checkout--price-discounted">
                                            <span class="woocommerce-Price-amount amount">
                                                <span class="woocommerce-Price-currencySymbol" dir="auto">
                                                    <font dir="auto" style="vertical-align: inherit;">
                                                        <font dir="auto" style="vertical-align: inherit;">€</font>
                                                    </font>
                                                </span>
                                                <font dir="auto" style="vertical-align: inherit;">
                                                    <font dir="auto" style="vertical-align: inherit;"> &nbsp;136,00</font>
                                                </font>
                                            </span>
                                        </div>
                                        <div class="fkcart-checkout--price-normal fkcart-hide">
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
                                        </div>
                                    </div>
                                </a>
                            </div>
                            
                            <a href="#" class="fkcart-shopping-link fkcart-modal-close fkcart-hide">
                                <font dir="auto" style="vertical-align: inherit;">
                                    <font dir="auto" style="vertical-align: inherit;">Verder winkelen</font>
                                </font>
                            </a>
                        </div>

                            <!-- START: Upsell Style -->
                            <div class="fkcart-below-checkout-upsell">
                        </div>

                        <div id="fkcart-popup" class="fkcart-popup">
                            <div class="fkcart-popup-content">
                                <div class="fkcart-title-wrap">
                                    <span class="fkcart-close">
                                        <svg width="20" height="20" viewBox="0 0 24 24" class="fkcart-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.1518 4.31359L4.22676 4.22676C4.50161 3.9519 4.93172 3.92691 5.2348 4.1518L5.32163 4.22676L12 10.9048L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0952 12L19.7732 18.6784C20.0481 18.9532 20.0731 19.3833 19.8482 19.6864L19.7732 19.7732C19.4984 20.0481 19.0683 20.0731 18.7652 19.8482L18.6784 19.7732L12 13.0952L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9048 12L4.22676 5.32163C3.9519 5.04678 3.92691 4.61667 4.1518 4.31359L4.22676 4.22676L4.1518 4.31359Z" fill="currentColor"></path>
                                        </svg>
                                    </span>
                                </div>

                                <div class="fkcart-item-meta-content"></div>
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
function shop_controls_template_redirect() {
    if (is_admin()) return; // voorkom in admin

    $mode = get_option('shop_controls_mode', 'off');
    $forced_mode = shop_controls_forced_by_setup_wizard();
    if ($mode !== 'on' && !$forced_mode) return;

    if (!$forced_mode) {
        // Check eindtijd
        $end_time = get_option('shop_controls_end_time');
        if (!empty($end_time) && strtotime($end_time) < time()) {
            update_option('shop_controls_mode', 'off');
            return;
        }

        // Check of gebruiker mag kijken
        $allowed_roles = get_option('shop_controls_user_roles', array('administrator'));
        $user = wp_get_current_user();
        foreach ($user->roles as $role) {
            if (in_array($role, $allowed_roles, true)) return;
        }

        // Optionally allow known search engine crawlers to bypass maintenance mode.
        if (get_option('shop_controls_allow_crawlers', '0') === '1' && shop_controls_is_allowed_crawler()) {
            return;
        }
    }

    // Laad gekozen template
    $chosen_template = get_option('shop_controls_template', 'templ-1');
    $relative_template = 'inc/admin/underConstruction/templates/' . $chosen_template . '.php';
    // locate_template zoekt eerst in child theme, daarna parent theme
    $template_path = locate_template([$relative_template]);

    if (!empty($template_path) && file_exists($template_path)) {
        // Onderhoudspagina: geef een correcte statuscode en disable caching
        status_header(503);
        nocache_headers();
        include($template_path);
        exit;
    } else {
        // fallback
        wp_die('Under Construction - template niet gevonden.');
    }
}
add_action('template_redirect', 'shop_controls_template_redirect');

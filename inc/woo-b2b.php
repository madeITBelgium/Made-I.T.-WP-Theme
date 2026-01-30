<?php

if(defined('MADEIT_WOO_B2B_ONLY') && MADEIT_WOO_B2B_ONLY) {
    //Only registered and approved accounts are valid.
    function madeit_b2b_is_purchasable($isPurchasable, $product) {
        //check if user is logged in
        $user = wp_get_current_user();
        if($user->ID == 0) {
            return false;
        }

        //check if user is approved
        $is_approved = get_user_meta($user->ID, 'active_b2b_user', true);
        if(!$is_approved) {
            return false;
        }

        //check if user is a customer
        return $isPurchasable;
    }
    add_filter('woocommerce_is_purchasable', 'madeit_b2b_is_purchasable', 10, 2);


    function madeit_b2b_woocommerce_single_product_summary()
    {
        global $product;
        if ($product->is_purchasable()) {
            return;
        }

        $user = wp_get_current_user();
        $is_approved = get_user_meta($user->ID, 'active_b2b_user', true);
        if($user->ID == 0) {
            ?>
            <p class="alert alert-info"><?php _e('Maak nu een account aan om prijzen te zien en bestellingen te plaatsen.', 'madeit'); ?></p>
            <a href="<?php echo get_permalink(get_option('woocommerce_myaccount_page_id')); ?>" class="btn btn-success mb-3"><?php _e('Account aanmaken', 'madeit'); ?></a>
            <?php
        } else if(!$is_approved) {
            ?>
            <p class="alert alert-info"><?php _e('Uw account is nog niet goedgekeurd. U kunt nog geen bestellingen plaatsen.', 'madeit'); ?></p>
            <?php
        }

        if(get_field('webshop_offerte', $product->get_id()) == 0) {
            return;
        }
        echo '<a href="#" class="btn btn-outline-success request-product-offer" data-product-id="' . $product->get_id() . '" data-product-name="' . $product->get_name() . '">Offerte aanvragen</a>';
    }
    add_filter('woocommerce_single_product_summary', 'madeit_b2b_woocommerce_single_product_summary', 30);

    function madeit_b2b_woocommerce_get_price_html($price, $product)
    {
        if(!madeit_b2b_is_purchasable($product->is_purchasable(), $product)) {
            return '';
        }
        

        if ( ! $product->get_sale_price() || ! $product->get_regular_price() || $product->get_sale_price() >= $product->get_regular_price() ) {
            return $price;
        }

        //Check if sales date is current
        $sale_from = $product->get_date_on_sale_from();
        $sale_to = $product->get_date_on_sale_to();
        if ($sale_from && $sale_from->getTimestamp() > time()) {
            return $price; // Sale not started yet
        }

        // Sale end date is valid until 23:59:59 (end of day)
        if ($sale_to) {
            $sale_to_end_of_day = clone $sale_to;
            $sale_to_end_of_day->setTime(23, 59, 59);
            if ($sale_to_end_of_day->getTimestamp() < time()) {
                return $price; // Sale ended
            }
        }

        return wc_format_sale_price(
                wc_get_price_to_display( $product, array( 'price' => $product->get_regular_price() ) ),
                wc_get_price_to_display( $product, array( 'price' => $product->get_sale_price() ) )
            ) . $product->get_price_suffix();
    }
    add_filter('woocommerce_get_price_html', 'madeit_b2b_woocommerce_get_price_html', 10, 2);

    function madeit_b2b_woocommerce_get_price( $price, $product ) {
        if(empty($price)) {
            $price = $product->get_regular_price();
        }

        $user = wp_get_current_user();
        $is_approved = get_user_meta($user->ID, 'active_b2b_user', true);
        if($is_approved) {
            $discount = get_user_meta($user->ID, 'b2b_discount', true);
            if($discount) {
                $price = $price - ($price * $discount / 100);
            }
        }

        $price = apply_filters('madeit_b2b_woocommerce_get_price', $price, $product);

        return $price;
    }
    add_filter('woocommerce_product_get_price', 'madeit_b2b_woocommerce_get_price', 99, 2 );
    //add_filter('woocommerce_product_get_regular_price', 'madeit_b2b_woocommerce_get_price', 99, 2 );
    add_filter('woocommerce_product_get_sale_price', 'madeit_b2b_woocommerce_get_price', 99, 2 );

    function madeit_remove_partial_product_structured_data( $markup_offer, $product ) {
        $markup_offer = array(
            'availability'  => 'https://schema.org/' . ( $product->is_in_stock() ? 'InStock' : 'OutOfStock' ),
            'url'           => get_permalink( $product->get_id() ),
            'seller'        => array(
                '@type' => 'Organization',
                'name'  => get_bloginfo( 'name' ),
                'url'   => home_url(),
            ),
        );
    
        return $markup_offer;
    }
    add_filter( 'woocommerce_structured_data_product_offer', 'madeit_remove_partial_product_structured_data', 10, 2 );

    function ran_woocommerce_cart_product_price( $price_html, $product ) {
        if ( ! $product->get_sale_price() || ! $product->get_regular_price() || $product->get_sale_price() >= $product->get_regular_price() ) {
            return $price_html;
        }

        //Check if sales date is current
        $sale_from = $product->get_date_on_sale_from();
        $sale_to = $product->get_date_on_sale_to();
        if ($sale_from && $sale_from->getTimestamp() > time()) {
            return $price_html; // Sale not started yet
        }
        
        // Sale end date is valid until 23:59:59 (end of day)
        if ($sale_to) {
            $sale_to_end_of_day = clone $sale_to;
            $sale_to_end_of_day->setTime(23, 59, 59);
            if ($sale_to_end_of_day->getTimestamp() < time()) {
                return $price_html; // Sale ended
            }
        }

        return wc_format_sale_price(
                wc_get_price_to_display( $product, array( 'price' => $product->get_regular_price() ) ),
                wc_get_price_to_display( $product, array( 'price' => $product->get_sale_price() ) )
            ) . $product->get_price_suffix();
    }
    add_filter( 'woocommerce_cart_product_price', 'ran_woocommerce_cart_product_price', 20, 2 );
}


//Add button to product to add the product as a favorite
function madeit_b2b_get_user_favorite_products($addFilter = false)
{
    //If user is loggedin use the b2b_products ACF repeater with product item. If not loggedin use the cookie
    $user = wp_get_current_user();
    if($user->ID == 0) {
        $favorites = json_decode(stripslashes($_COOKIE['b2b_favorites'] ?? '{}'), true);
    } else {
        $data = get_field('b2b_products', 'user_' . $user->ID);
        $favorites = [];
        if(!is_array($data)) {
            $data = [];
        }
        foreach($data ?? [] as $item) {
            if(is_array($item['product'])) {
                foreach($item['product'] as $product) {
                    if($product === 0) {
                        continue;
                    }
                    $favorites[] = $product;
                }
            }
        }
    }

    if($addFilter) {
        $favorites = apply_filters('madeit_b2b_get_user_favorite_products', $favorites);
    }

    return $favorites;
}

function madeit_b2b_favorite_btn()
{
    global $product;
    
    $favoritesButtonColor = apply_filters('madeit_b2b_favorite_button_color', 'danger');

    $favorites = madeit_b2b_get_user_favorite_products();
    if(is_array($favorites) && in_array($product->get_id(), $favorites)) {
        echo '<div class="d-block mb-2"><a href="#" class="btn btn-sm btn-outline-' . esc_attr($favoritesButtonColor) . ' b2b-madeit-remove-favorite" data-product-id="' . $product->get_id() . '"><i class="fas fa-heart"></i> <span class="txt">' . __('Verwijderen uit favorieten', 'madeit') . '</span></a></div>';
    } else {
        echo '<div class="d-block mb-2"><a href="#" class="btn btn-sm btn-outline-' . esc_attr($favoritesButtonColor) . ' b2b-madeit-add-favorite" data-product-id="' . $product->get_id() . '"><i class="far fa-heart"></i> <span class="txt">' . __('Toevoegen aan favorieten', 'madeit') . '</span></a></div>';
    }
}
add_action('woocommerce_after_shop_loop_item', 'madeit_b2b_favorite_btn', 10);
add_action('woocommerce_single_product_summary', 'madeit_b2b_favorite_btn', 30);

//add javascript
function madeit_b2b_enqueue_scripts()
{
    wp_enqueue_script('madeit-b2b-js', get_theme_file_uri('/assets/js/b2b.js'), ['wp-i18n'], wp_get_theme()->get('Version'), true);
    wp_set_script_translations( 'madeit-b2b-js', 'madeit', get_template_directory() . '/languages' );
}
add_action('wp_enqueue_scripts', 'madeit_b2b_enqueue_scripts');

//add ajax action to add product to favorites
function madeit_b2b_add_favorite()
{
    $product_id = intval($_POST['product_id']);

    $favorites = madeit_b2b_get_user_favorite_products();
    $favorites[] = $product_id;

    $user = wp_get_current_user();
    if($user->ID == 0) {
        setcookie('b2b_favorites', json_encode($favorites), time() + 3600 * 24 * 30, COOKIEPATH, COOKIE_DOMAIN);
    } else {
        $data = get_field('b2b_products', 'user_' . $user->ID);
        $data[] = [
            'product' => [
                $product_id
            ],
            'discount' => 0,
        ];

        update_field('b2b_products', $data, 'user_' . $user->ID);

        do_action('madeit_b2b_favorite_added', $product_id, $user->ID);
    }

    wp_send_json_success();
}

function madeit_b2b_remove_favorite()
{
    $product_id = intval($_POST['product_id']);

    $favorites = madeit_b2b_get_user_favorite_products();
    $key = array_search($product_id, $favorites);
    if($key !== false) {
        unset($favorites[$key]);
    }

    $user = wp_get_current_user();
    if($user->ID == 0) {
        setcookie('b2b_favorites', json_encode($favorites), time() + 3600 * 24 * 30, COOKIEPATH, COOKIE_DOMAIN);
    } else {
        $data = get_field('b2b_products', 'user_' . $user->ID);
        $new_data = [];
        foreach($data as $item) {
            if(!is_array($item['product'])) {
                error_log('No product array' . print_r($item, true));
                continue;
            }
            if(!in_array($product_id, $item['product']) && count($item['product']) === 1) {
                $new_data[] = $item;
            } else if(!in_array($product_id, $item['product'])) {
                $d = $item;
                $d['product'] = array_values(array_diff($item['product'], [$product_id]));
                $new_data[] = $d;
            }
        }
        update_field('b2b_products', $new_data, 'user_' . $user->ID);

        do_action('madeit_b2b_favorite_removed', $product_id, $user->ID);
    }
    wp_send_json_success();
}

function madeit_b2b_toggle_favorite()
{
    $product_id = intval($_POST['product_id']);
    $favorites = madeit_b2b_get_user_favorite_products();
    $key = array_search($product_id, $favorites);

    if($key !== false) {
        return madeit_b2b_remove_favorite();
    } 
    return madeit_b2b_add_favorite();
}

add_action('wp_ajax_b2b_madeit_favorite', 'madeit_b2b_toggle_favorite');
add_action('wp_ajax_nopriv_b2b_madeit_favorite', 'madeit_b2b_toggle_favorite');


//Add extra page to my account with favorite products
function madeit_b2b_my_account_menu_items($items)
{
    //add after dashboard
    $new_items = [];
    foreach($items as $key => $item) {
        $new_items[$key] = $item;
        if($key === 'dashboard') {
            $new_items['b2b-favorites'] = __('Favorieten', 'madeit');
        }
    }

    return $new_items;
}
add_filter('woocommerce_account_menu_items', 'madeit_b2b_my_account_menu_items');

function madeit_b2b_my_account_menu_item_endpoint()
{
    add_rewrite_endpoint('b2b-favorites', EP_PAGES);
}
add_action('init', 'madeit_b2b_my_account_menu_item_endpoint');

function madeit_b2b_my_account_menu_item_content()
{
    $favorites = madeit_b2b_get_user_favorite_products(true);
    if(count($favorites) === 0) {
        echo '<p>' . __('U heeft nog geen favorieten.', 'madeit') . '</p>';
        return;
    }

    $productList = [];
    foreach($favorites as $product_id) {
        if($product_id === 0) {
            continue;
        }

        $product = wc_get_product($product_id);
        if($product === false) {
            continue;
        }

        $productList[] = $product;
    }

    //order by name
    usort($productList, function($a, $b) {
        return strcmp($a->get_name(), $b->get_name());
    });
    $favoritesButtonColor = apply_filters('madeit_b2b_favorite_button_color', 'danger');

    echo '<ul class="list-group">';

    foreach($productList as $product) {
        $product_id = $product->get_id();
        ?>
        <li class="list-group-item">
            <div class="row align-items-center">
                <div class="col-12 col-md-8">
                    <h3><a href="<?php echo get_permalink($product_id); ?>"><?php echo $product->get_name(); ?></a></h3>
                    <?php echo $product->get_price_html(); ?>
                </div>
                <div class="col-6 order-md-first col-md-2">
                    <?php echo $product->get_image('thumbnail'); ?>
                </div>
                <div class="col-6 col-md-2">
                    <form action="<?php esc_url( $product->add_to_cart_url() ); ?>" class="cart d-flex form-add-to-cart" method="post" enctype="multipart/form-data" data-product_id="<?php echo esc_attr( $product->get_id() ); ?>" data-product_sku="<?php echo esc_attr( $product->get_sku() ); ?>">
                        <?php
                        echo woocommerce_quantity_input( array(), $product, false );
                        $isProductVariable = $product->is_type( 'variable' );
                        $wooButtonClass = apply_filters('madeit_woo_btn_class', !$isProductVariable ? ['btn', 'btn-success', 'form_add_to_cart_button', 'w-100'] : ['btn', 'btn-success', 'w-100']);
                        ?>
                        <button type="submit" class="<?php echo implode(" ", $wooButtonClass); ?>"><i class="fas fa-cart-plus"></i></button>
                    </form>

                    <a href="#" class="ms-auto btn btn-sm btn-outline-<?php echo esc_attr($favoritesButtonColor); ?> b2b-madeit-remove-favorite mt-3" data-product-id="<?php echo $product_id; ?>"><i class="fas fa-heart"></i></a>
                </div>
            </div>
        </li>
        <?php
    }
    echo '</ul>';
}
add_action('woocommerce_account_b2b-favorites_endpoint', 'madeit_b2b_my_account_menu_item_content');

/* Add extra fields to registration form */
// Custom function with all extra field data arrays
function madeit_b2b_extra_register_fields() {
    $text_domain  = 'woocommerce';
    return apply_filters('madeit_b2b_extra_register_fields', array(
        'first_name' => array('type' => 'text',    'class' => ['form-row-first'], 'required' => 1, 'label' => __('First name', 'madeit') ),
        'last_name'  => array('type' => 'text',    'class' => ['form-row-last'],  'required' => 1, 'label' => __('Last name', 'madeit') ),
        'phone'      => array('type' => 'tel',     'class' => ['form-row-wide'],  'required' => 1, 'label' => __( 'Phone', 'madeit' ) ),
        'company'    => array('type' => 'text',    'class' => ['form-row-wide'],  'required' => 1, 'label' => __( 'Company', 'madeit' ) ),
        'address_1'  => array('type' => 'text',    'class' => ['form-row-wide'],  'required' => 1, 'label' => __( 'Address', 'madeit' ) ),
        'postcode'   => array('type' => 'text',    'class' => ['form-row-first'], 'required' => 1, 'label' => __( 'Postcode', 'madeit' ) ),
        'city'       => array('type' => 'text',    'class' => ['form-row-wide'],  'required' => 1, 'label' => __( 'City', 'madeit' ) ),
        'country'    => array('type' => 'country', 'class' => ['form-row-wide'],  'required' => 1, 'label' => __( 'Country', 'madeit' ) ),
    ));
}

// Add extra register fields
add_action( 'woocommerce_register_form_start', 'madeit_b2b_wooc_extra_register_fields' );
function madeit_b2b_wooc_extra_register_fields() {
    foreach ( madeit_b2b_extra_register_fields() as $fkey => $values ) {
        if( $fkey === 'phone' ) $values['clear'] = 1;
        if( $fkey === 'state' ) $values['validate'] = ['state'];

        $value = isset($_POST['billing_'.$fkey]) ? esc_attr($_POST['billing_'.$fkey]) : '';

        woocommerce_form_field( 'billing_'.$fkey, $values, $value );
    }
    wp_enqueue_script('wc-country-select', get_site_url().'/wp-content/plugins/woocommerce/assets/js/frontend/country-select.min.js', array('jquery'), true);
}

// Extra register fields validation
add_action( 'woocommerce_register_post', 'madeit_b2b_wc_validate_reg_form_fields', 10, 3 );
function madeit_b2b_wc_validate_reg_form_fields( $username, $email, $validation_errors ) {
    foreach ( madeit_b2b_extra_register_fields() as $fkey => $values ) {
        if (isset($_POST['billing_'.$fkey]) && empty($_POST['billing_'.$fkey]) && $values['required'] ) {
            $validation_errors->add( 'extra_fields', sprintf('%s is a required field', $values['label']) );
        }
    }
    return $validation_errors;
}

// Save extra register fields values
add_action( 'woocommerce_created_customer', 'madeit_b2b_wooc_save_extra_register_fields' );
function madeit_b2b_wooc_save_extra_register_fields( $customer_id ) {
    foreach( madeit_b2b_extra_register_fields() as $fkey => $values ) {
        if ( isset($_POST['billing_'.$fkey]) ) {
            $value = in_array($fkey, ['country', 'state']) ? sanitize_text_field($_POST['billing_'.$fkey]) : esc_attr($_POST['billing_'.$fkey]);

            update_user_meta( $customer_id, 'billing_'.$fkey, $value );

            if ( in_array($fkey, ['first_name', 'last_name']) )
                update_user_meta( $customer_id, $fkey, $value );
        }
    }
}


/* Betaal per factuur */
function madeit_b2b_wcpl_add_gateway( $methods )
{
    include_once __DIR__ . '/class-wc-gateway-pay-invoice.php';
    $methods[] = 'WC_Gateway_Pay_Invoice';
	return $methods;
}
add_filter( 'woocommerce_payment_gateways', 'madeit_b2b_wcpl_add_gateway' );


/* ACF Fields */
add_action( 'acf/include_fields', function() {
    if ( ! function_exists( 'acf_add_local_field_group' ) ) {
        return;
    }

	acf_add_local_field_group( array(
        'key' => 'group_6638dac59ba21',
        'title' => 'B2B User',
        'fields' => array(
            array(
                'key' => 'field_6638dac63bd21',
                'label' => 'Active B2B User',
                'name' => 'active_b2b_user',
                'aria-label' => '',
                'type' => 'true_false',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'message' => '',
                'default_value' => 0,
                'ui' => 0,
                'ui_on_text' => '',
                'ui_off_text' => '',
            ),
            array(
                'key' => 'field_6638db4f3bd22',
                'label' => 'B2B Discount',
                'name' => 'b2b_discount',
                'aria-label' => '',
                'type' => 'number',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => 0,
                'min' => 0,
                'max' => 100,
                'placeholder' => 'Kortingspercentage op hele catalogus',
                'step' => '0.1',
                'prepend' => '',
                'append' => '%',
            ),
            array(
                'key' => 'field_6655dd50d603e',
                'label' => 'Factuur betalingen',
                'name' => 'invoice_payments',
                'aria-label' => '',
                'type' => 'true_false',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'message' => 'Betalen op factuur toestaan?',
                'default_value' => 0,
                'ui' => 0,
                'ui_on_text' => '',
                'ui_off_text' => '',
            ),
            array(
                'key' => 'field_6638ded852518',
                'label' => 'Producten',
                'name' => 'b2b_products',
                'aria-label' => '',
                'type' => 'repeater',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'layout' => 'row',
                'pagination' => 0,
                'min' => 0,
                'max' => 0,
                'collapsed' => '',
                'button_label' => 'Nieuwe regel',
                'rows_per_page' => 20,
                'sub_fields' => array(
                    array(
                        'key' => 'field_6638def052519',
                        'label' => 'Product',
                        'name' => 'product',
                        'aria-label' => '',
                        'type' => 'relationship',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'post_type' => array(
                            0 => 'product',
                        ),
                        'post_status' => '',
                        'taxonomy' => '',
                        'filters' => array(
                            0 => 'search',
                        ),
                        'return_format' => 'id',
                        'min' => '',
                        'max' => '',
                        'elements' => '',
                        'bidirectional' => 0,
                        'bidirectional_target' => array(
                        ),
                        'parent_repeater' => 'field_6638ded852518',
                    ),
                    array(
                        'key' => 'field_6638df215251a',
                        'label' => 'Discount',
                        'name' => 'discount',
                        'aria-label' => '',
                        'type' => 'number',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => 0,
                        'min' => 0,
                        'max' => 100,
                        'placeholder' => '',
                        'step' => '0.1',
                        'prepend' => '',
                        'append' => '%',
                        'parent_repeater' => 'field_6638ded852518',
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'user_form',
                    'operator' => '==',
                    'value' => 'all',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => '',
        'show_in_rest' => 0,
    ) );
} );


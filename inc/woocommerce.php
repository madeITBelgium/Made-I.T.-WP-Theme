<?php

if (!function_exists('madeit_loop_columns')) {
    function madeit_loop_columns()
    {
        return 3; // 3 products per row
    }
    add_filter('loop_shop_columns', 'madeit_loop_columns', 999);
}

add_action('init', 'get_custom_coupon_code_to_session');
function get_custom_coupon_code_to_session()
{
    if (isset($_GET['coupon_code'])) {
        // Ensure that customer session is started
        if (isset(WC()->session) && !WC()->session->has_session()) {
            WC()->session->set_customer_session_cookie(true);
        }

        // Check and register coupon code in a custom session variable
        $coupon_code = WC()->session->get('coupon_code');
        if (empty($coupon_code)) {
            $coupon_code = esc_attr($_GET['coupon_code']);
            WC()->session->set('coupon_code', $coupon_code); // Set the coupon code in session
        }
    }
}

add_action('woocommerce_before_checkout_form', 'add_discout_to_checkout', 10, 0);
add_action('woocommerce_review_order_before_cart_contents', 'add_discout_to_checkout', 10, 0);
function add_discout_to_checkout()
{
    // Set coupon code
    $coupon_code = WC()->session->get('coupon_code');
    if (!empty($coupon_code) && !WC()->cart->has_discount($coupon_code)) {
        WC()->cart->add_discount($coupon_code); // apply the coupon discount
        WC()->session->__unset('coupon_code'); // remove coupon code from session
    }
}

function madeit_update_berocket_aapf_listener_br_options($options)
{
    $options['products_holder_id'] = 'div.row.columns-3';
    $options['woocommerce_result_count_class'] = '.woocommerce-result-count';
    $options['woocommerce_ordering_class'] = 'form.woocommerce-ordering';
    $options['woocommerce_pagination_class'] = 'nav.woocommerce-pagination';

    return $options;
}
add_filter('berocket_aapf_listener_br_options', 'madeit_update_berocket_aapf_listener_br_options');
add_filter('brfr_get_option_ajax_filters', 'madeit_update_berocket_aapf_listener_br_options');

function madeit_woocommerce_before_cart_table()
{
    echo '<div class="card"><div class="card-body"><div class="table-responsive">';
}
add_filter('woocommerce_before_cart_table', 'madeit_woocommerce_before_cart_table');

function madeit_woocommerce_after_cart_table()
{
    echo '</div></div></div>';
}
add_filter('woocommerce_after_cart_table', 'madeit_woocommerce_after_cart_table');

function madeit_woocommerce_before_checkout_billing_form()
{
    echo '<div class="card mb-3"><div class="card-body">';
}
add_filter('woocommerce_before_checkout_billing_form', 'madeit_woocommerce_before_checkout_billing_form', 1);
add_filter('woocommerce_before_checkout_shipping_form', 'madeit_woocommerce_before_checkout_billing_form', 1);
add_filter('woocommerce_before_order_notes', 'madeit_woocommerce_before_checkout_billing_form', 1);

function madeit_woocommerce_after_checkout_billing_form()
{
    echo '</div></div>';
}
add_filter('woocommerce_after_checkout_billing_form', 'madeit_woocommerce_after_checkout_billing_form', 99);
add_filter('woocommerce_after_checkout_shipping_form', 'madeit_woocommerce_after_checkout_billing_form', 99);
add_filter('woocommerce_after_order_notes', 'madeit_woocommerce_after_checkout_billing_form', 99);

function madeit_woocommerce_webhook_payload($payload, $resource, $resource_id, $id)
{
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (strpos($user_agent, 'ShoppingManager') !== false) {
        $payload['edit_source'] = 'ShoppingManager';
    }

    return $payload;
}
add_filter('woocommerce_webhook_payload', 'madeit_woocommerce_webhook_payload', 10, 4);

function madeit_search_products()
{
    $search = $_POST['search'] ?? null;

    //search wooCommerce products with name or description
    $args = [
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => 10,
        's'              => $search,
    ];
    $products = new WP_Query($args);

    $data = [];
    if ($products->have_posts()) {
        while ($products->have_posts()) {
            $products->the_post();
            $product = wc_get_product(get_the_ID());
            $price = $product->get_price();

            if (function_exists('madeit_b2b_is_purchasable')) {
                if (madeit_b2b_is_purchasable($product->is_purchasable(), $product)) {
                    $price = $product->get_price_html();
                } else {
                    $price = false;
                }
            }

            if (!$product->is_visible()) {
                continue;
            }

            $data[] = [
                'id'          => get_the_ID(),
                'name'        => get_the_title(),
                'description' => get_the_excerpt(),
                'price'       => $price,
                'url'         => get_permalink(),
                'image'       => get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'),
            ];
        }
    }

    wp_send_json([
        'success' => true,
        'data'    => $data,
    ]);
}
add_action('wp_ajax_nopriv_madeit_search_products', 'madeit_search_products');
add_action('wp_ajax_madeit_search_products', 'madeit_search_products');

function madeit_custom_sale_flash($text)
{
    global $product;

    $shop_label = get_post_meta($product->get_id(), 'shop_label', true);

    if ($shop_label) {
        return '<div class="product-onsale"><span>'.$shop_label.'</span></div>';
        //return '<span class="onsale">'.$shop_label.'</span>';
    }

    return $text;
}
add_filter('woocommerce_sale_flash', 'madeit_custom_sale_flash');

//add quantity field to product loop
if (defined('MADEIT_WOO_QUANTITY_LOOP') && MADEIT_WOO_QUANTITY_LOOP) {
    function quantity_for_woocommerce_loop($html, $product)
    {
        if ($product && $product->is_type('simple') && $product->is_purchasable() && $product->is_in_stock() && !$product->is_sold_individually()) {
            $html = '<form action="'.esc_url($product->add_to_cart_url()).'" class="cart d-flex form-add-to-cart" method="post" enctype="multipart/form-data" data-product_id="'.esc_attr($product->get_id()).'" data-product_sku="'.esc_attr($product->get_sku()).'">';
            $html .= woocommerce_quantity_input([], $product, false);
            $isProductVariable = $product->is_type('variable');
            $wooButtonClass = apply_filters('madeit_woo_btn_class', !$isProductVariable ? ['btn', 'btn-success', 'form_add_to_cart_button', 'w-100'] : ['btn', 'btn-success', 'w-100']);
            $html .= '<button type="submit" class="'.implode(' ', $wooButtonClass).'">'.esc_html($product->add_to_cart_text()).'</button>';
            $html .= '</form>';
        }

        return $html;
    }
    add_filter('woocommerce_loop_add_to_cart_link', 'quantity_for_woocommerce_loop', 10, 2);
}

/* Add tracking to email and My Account area */
add_action('acf/include_fields', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key'    => 'group_6891c4507a4fb',
        'title'  => 'Track en Trace',
        'fields' => [
            [
                'key'               => 'field_6891c452d0964',
                'label'             => 'Track & Trace URL',
                'name'              => 'tracking_url',
                'aria-label'        => '',
                'type'              => 'text',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'relevanssi_exclude'  => 1,
                'wpml_cf_preferences' => 2,
                'default_value'       => '',
                'maxlength'           => '',
                'allow_in_bindings'   => 0,
                'placeholder'         => '',
                'prepend'             => '',
                'append'              => '',
            ],
        ],
        'location' => [
            [
                [
                    'param'    => 'post_type',
                    'operator' => '==',
                    'value'    => 'shop_order',
                ],
            ],
        ],
        'menu_order'             => 0,
        'position'               => 'normal',
        'style'                  => 'default',
        'label_placement'        => 'top',
        'instruction_placement'  => 'label',
        'hide_on_screen'         => '',
        'active'                 => true,
        'description'            => '',
        'show_in_rest'           => 0,
        'acfml_field_group_mode' => 'translation',
    ]);
});

// Examine the tracking url and return a provider name.
function madeit_get_tracking_info_to_order_completed_email($url)
{
    if (strpos($url, 'postnl') !== false) {
        return 'Post NL';
    }
    if (strpos($url, 'bpost') !== false) {
        return 'Bpost';
    }

    // Unknown provider.
    return null;
}

add_action('woocommerce_email_order_details', 'madeit_add_tracking_info_to_order_completed_email', 5, 4);
function madeit_add_tracking_info_to_order_completed_email($order, $sent_to_admin, $plain_text, $email)
{
    if ('customer_completed_order' == $email->id) {
        $order_id = $order->get_id();
        $tracking_url = get_post_meta($order_id, 'tracking_url', true);

        if (empty($tracking_url)) {
            return;
        }

        $tracking_provider = madeit_get_tracking_info_to_order_completed_email($tracking_url);

        if ($plain_text) {
            if (!empty($tracking_provider)) {
                printf("\n".__('Uw order is verzonden met %s. Je kan uw order volgen via %s.', 'madeit')."\n", $tracking_provider, esc_url($tracking_url, ['http', 'https']));
            } else {
                printf("\n".__('Uw order is verzonden. Je kan uw order volgen via %s.', 'madeit')."\n", esc_url($tracking_url, ['http', 'https']));
            }
        } else {
            if (!empty($tracking_provider)) {
                printf('<p>'.__('Uw order is verzonden met <strong>%s</strong>. Je kan uw order volgen via <strong><a href="%s">%s</a></strong>.</p>', 'madeit').'</p>', $tracking_provider, esc_url($tracking_url, ['http', 'https']), esc_url($tracking_url, ['http', 'https']));
            } else {
                printf('<p>'.__('Uw order is verzonden. Je kan uw order volgen via <strong><a href="%s">%s</a></strong>.</p>', 'madeit').'</p>', esc_url($tracking_url, ['http', 'https']), esc_url($tracking_url, ['http', 'https']));
            }
        }
    }
}

// Display tracking information in My Account area.
add_action('woocommerce_view_order', 'madeit_add_tracking_info_to_view_order_page', 5);
function madeit_add_tracking_info_to_view_order_page($order_id)
{
    $tracking_url = get_post_meta($order_id, 'tracking_url', true);

    // Quit if either tracking field is empty.
    if (empty($tracking_url)) {
        // Debugging code.
        echo '<p>'.__('Sorry, er is momenteel nog geen tracking informatie beschikbaar.', 'madeit').'</p>';

        return;
    }

    $tracking_provider = madeit_get_tracking_info_to_order_completed_email($tracking_url);
    if (!empty($tracking_provider)) {
        printf('<p>'.__('Uw order is verzonden met <strong>%s</strong>. Je kan uw order volgen via <strong><a href="%s">%s</a></strong>.</p>', 'madeit').'</p>', $tracking_provider, esc_url($tracking_url, ['http', 'https']), esc_url($tracking_url, ['http', 'https']));
    } else {
        printf('<p>'.__('Uw order is verzonden. Je kan uw order volgen via <strong><a href="%s">%s</a></strong>.</p>', 'madeit').'</p>', esc_url($tracking_url, ['http', 'https']), esc_url($tracking_url, ['http', 'https']));
    }
}

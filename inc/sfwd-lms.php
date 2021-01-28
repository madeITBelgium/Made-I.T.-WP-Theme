<?php

/**
 * Register new endpoint to use inside My Account page.
 *
 * @see https://developer.wordpress.org/reference/functions/add_rewrite_endpoint/
 */
function my_custom_endpoints() {
	add_rewrite_endpoint( 'courses', EP_ROOT | EP_PAGES );
}

add_action( 'init', 'my_custom_endpoints' );

/**
 * Add new query var.
 *
 * @param array $vars
 * @return array
 */
function my_custom_query_vars( $vars ) {
	$vars[] = 'courses';

	return $vars;
}

add_filter( 'query_vars', 'my_custom_query_vars', 0 );

/**
 * Flush rewrite rules on theme activation.
 */
function my_custom_flush_rewrite_rules() {
	add_rewrite_endpoint( 'courses', EP_ROOT | EP_PAGES );
	flush_rewrite_rules();
}

add_action( 'after_switch_theme', 'my_custom_flush_rewrite_rules' );


/**
 * Custom help to add new items into an array after a selected item.
 *
 * @param array $items
 * @param array $new_items
 * @param string $after
 * @return array
 */
function my_custom_insert_after_helper( $items, $new_items, $after ) {
	// Search for the item position and +1 since is after the selected item key.
	$position = array_search( $after, array_keys( $items ) ) + 1;

	// Insert the new item.
	$array = array_slice( $items, 0, $position, true );
	$array += $new_items;
	$array += array_slice( $items, $position, count( $items ) - $position, true );

    return $array;
}

/**
 * Insert the new endpoint into the My Account menu.
 *
 * @param array $items
 * @return array
 */
function my_custom_my_account_menu_items( $items ) {
	$new_items = array();
	$new_items['courses'] = __( 'Courses', 'madeit' );

	// Add the new item after `orders`.
	return my_custom_insert_after_helper( $items, $new_items, 'dashboard' );
}

add_filter( 'woocommerce_account_menu_items', 'my_custom_my_account_menu_items' );

/**
 * Endpoint HTML content.
 */
function my_custom_endpoint_content() {
	echo do_shortcode('[ld_profile orderby="title" order="ASC"]');
}

add_action( 'woocommerce_account_courses_endpoint', 'my_custom_endpoint_content' );

/*
 * Change endpoint title.
 *
 * @param string $title
 * @return string
 */
function my_custom_endpoint_title( $title ) {
	global $wp_query;

	$is_endpoint = isset( $wp_query->query_vars['courses'] );

	if ( $is_endpoint && ! is_admin() && is_main_query() && in_the_loop() && is_account_page() ) {
		// New page title.
		$title = __( 'Courses', 'madeit' );

		remove_filter( 'the_title', 'my_custom_endpoint_title' );
	}

	return $title;
}
add_filter( 'the_title', 'my_custom_endpoint_title' );


function learndash_link_woocommerce_product($post_button, $payment_params) {
    if(strpos($post_button, 'id="btn-join"') !== false) {
        $course = $payment_params['post'];
        $wooProducts = get_posts([
            'post_type' => 'product',
            'meta_query' => [
                [
                    'key' => '_related_course', //meta key name here
                    'value' => $course->ID, 
                    'compare' => 'LIKE',
                ]
            ]
        ]);
        if(isset($wooProducts[0])) {
            $wooProduct = $wooProducts[0];
            $post_button = str_replace(esc_url( $payment_params['custom_button_url']), wc_get_page_permalink( 'pay' ) . '?add-to-cart=' . $wooProduct->ID, $post_button);
        }
    }
    return $post_button;
}
add_filter( 'learndash_payment_closed_button', 'learndash_link_woocommerce_product', 2, 100);
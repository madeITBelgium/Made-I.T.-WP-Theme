<?php
if (!defined('ABSPATH')) exit;

function mp_register_post_type() {
    // own menu-icon
$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<path d="M5 8v7h14V8zm13 6H6V9h12zm-7-8H5V5h6zm7-1h1v1h-1zm-6 17.207L15.207 18H20.5a1.502 1.502 0 0 0 1.5-1.5v-13A1.502 1.502 0 0 0 20.5 2h-17A1.502 1.502 0 0 0 2 3.5v13A1.502 1.502 0 0 0 3.5 18h5.293zm9-5.707a.5.5 0 0 1-.5.5h-5.788L12 20.558 9.288 17H3.5a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5h17a.5.5 0 0 1 .5.5z"/>
</svg>';

    $menu_icon = 'data:image/svg+xml;base64,' . base64_encode($svg);

    $labels = [
        'name' => __('Popup', 'madeit'),
        'singular_name' => __('popup', 'madeit'),
        'add_new' => __('Voeg nieuwe toe', 'madeit'),
        'edit_item' => __('Wijzig Popup', 'madeit'),
        'all_items' => __('Alle Popups', 'madeit'),
    ];

    $args = [
        'label' => __('popup', 'madeit'),
        'labels' => $labels,
        'public' => false,
        'show_ui' => true,
        // 'menu_icon' => $menu_icon,
        'menu_icon' => 'dashicons-megaphone',
        'supports' => ['title', 'editor', 'revisions'],
        'show_in_rest' => true,
    ];

    register_post_type('popup', $args);
}
add_action('init', 'mp_register_post_type');

// Admin status kolom
add_filter('manage_popup_posts_columns', function($columns){
    $columns['popup_status'] = __('Status', 'madeit');
    return $columns;
});

add_action('manage_popup_posts_custom_column', function($column, $post_id){
    if ($column !== 'popup_status') return;

    $status = mp_get_popup_status($post_id);
    echo $status['label'];
}, 10, 2);


add_filter('manage_popup_posts_columns', function($columns){
    $columns['popup_active_time'] = __('Actief tijd', 'madeit');
    return $columns;
});

add_action('manage_popup_posts_custom_column', function($column, $post_id){
    if ($column === 'popup_active_time') {
        $time = mp_get_popup_active_time($post_id);
        echo $time['label'];
    }
}, 10, 2);


register_post_type('popup_template', [
    'label' => 'Popup Templates',
    'public' => false,
    'show_ui' => true,
    'show_in_menu' => 'edit.php?post_type=popup', // sub menu!
    'supports' => ['title'],
    'menu_icon' => 'dashicons-layout',
]);

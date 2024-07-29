<?php

// Add admin menu only for admin and shop manager
if (current_user_can('manage_woocommerce')) {
    add_action('admin_menu', 'madeit_shopmanager_admin_menu');
}

function madeit_shopmanager_admin_menu()
{
    add_menu_page('Made IT Shopping Manager', 'Shopping Manager', 'manage_woocommerce', 'madeit_shoppingmanager', 'madeit_shoppingmanager_page', 'dashicons-cart', 56);
}

function madeit_shoppingmanager_page()
{
    wp_redirect(MADEIT_SHOPPING_MANAGER.'/login-wp?user='.wp_get_current_user()->user_email);
    exit;
}

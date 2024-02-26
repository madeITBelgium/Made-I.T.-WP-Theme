<?php

// Create wordpress daily cronjob
add_action('madeit_cron_daily', 'madeit_cron_daily');
function madeit_cron_daily()
{
    global $wpdb;
    // Do something

    $plugins = get_option('active_plugins');

    //get name and version of plugins
    $plugins = get_option('active_plugins');
    $plugins_data = [];
    foreach ($plugins as $plugin) {
        $plugin_data = get_plugin_data(WP_PLUGIN_DIR.'/'.$plugin);
        $plugins_data[$plugin] = [
            'name'       => $plugin_data['Name'],
            'version'    => $plugin_data['Version'],
            'latest'     => get_site_transient('update_plugins')->checked[$plugin],
            'has_update' => get_site_transient('update_plugins')->checked[$plugin] != $plugin_data['Version'],
        ];
    }

    //Do post call to url
    $url = 'https://portal.madeit.be/api/theme/madeit';
    $args = [
        'method' => 'POST',
        'body'   => [
            'url'                 => home_url(),
            'email'               => get_option('admin_email'),
            'name'                => get_bloginfo('name'),
            'version'             => get_bloginfo('version'),
            'theme'               => get_option('template'),
            'theme_version'       => wp_get_theme()->get('Version'),
            'plugins'             => implode(',', get_option('active_plugins')),
            'plugins_info'        => $plugins_data,
            'language'            => get_locale(),
            'charset'             => get_bloginfo('charset'),
            'timezone'            => get_option('timezone_string'),
            'debug'               => WP_DEBUG,
            'multisite'           => is_multisite(),
            'ssl'                 => is_ssl(),
            'php_version'         => phpversion(),
            'mysql_version'       => $wpdb->db_version(),
            'wp_memory_limit'     => WP_MEMORY_LIMIT,
            'wp_max_memory_limit' => WP_MAX_MEMORY_LIMIT,
            'wp_debug'            => WP_DEBUG,
            'wp_cache'            => WP_CACHE,
            'options'             => [
                'MADEIT_VERSION'                      => defined('MADEIT_VERSION') ? MADEIT_VERSION : null,
                'MADEIT_CUSTOM_COLOR'                 => defined('MADEIT_CUSTOM_COLOR') ? MADEIT_CUSTOM_COLOR : null,
                'MADEIT_ADVANCED_BLOCKS'              => defined('MADEIT_ADVANCED_BLOCKS') ? MADEIT_ADVANCED_BLOCKS : null,
                'MADEIT_TEXT_COLOR'                   => defined('MADEIT_TEXT_COLOR') ? MADEIT_TEXT_COLOR : null,
                'MADEIT_BACKGROUND_COLOR'             => defined('MADEIT_BACKGROUND_COLOR') ? MADEIT_BACKGROUND_COLOR : null,
                'MADEIT_PRIMARY_COLOR'                => defined('MADEIT_PRIMARY_COLOR') ? MADEIT_PRIMARY_COLOR : null,
                'MADEIT_SECONDARY_COLOR'              => defined('MADEIT_SECONDARY_COLOR') ? MADEIT_SECONDARY_COLOR : null,
                'MADEIT_SUCCESS_COLOR'                => defined('MADEIT_SUCCESS_COLOR') ? MADEIT_SUCCESS_COLOR : null,
                'MADEIT_INFO_COLOR'                   => defined('MADEIT_INFO_COLOR') ? MADEIT_INFO_COLOR : null,
                'MADEIT_WARNING_COLOR'                => defined('MADEIT_WARNING_COLOR') ? MADEIT_WARNING_COLOR : null,
                'MADEIT_DANGER_COLOR'                 => defined('MADEIT_DANGER_COLOR') ? MADEIT_DANGER_COLOR : null,
                'SHOW_LOGIN_IN_FOOTER'                => defined('SHOW_LOGIN_IN_FOOTER') ? SHOW_LOGIN_IN_FOOTER : null,
                'SHOW_MADEIT_IN_FOOTER'               => defined('SHOW_MADEIT_IN_FOOTER') ? SHOW_MADEIT_IN_FOOTER : null,
                'HEADER_UPPER_TOP'                    => defined('HEADER_UPPER_TOP') ? HEADER_UPPER_TOP : null,
                'HEADER_UPPER_BOTTOM'                 => defined('HEADER_UPPER_BOTTOM') ? HEADER_UPPER_BOTTOM : null,
                'POST_AUTHOR'                         => defined('POST_AUTHOR') ? POST_AUTHOR : null,
                'POST_EDIT_TIME'                      => defined('POST_EDIT_TIME') ? POST_EDIT_TIME : null,
                'POST_TIME_FORMAT'                    => defined('POST_TIME_FORMAT') ? POST_TIME_FORMAT : null,
                'WOO_SHOPING_CART_MENU_STYLE'         => defined('WOO_SHOPING_CART_MENU_STYLE') ? WOO_SHOPING_CART_MENU_STYLE : null,
                'SHOW_SINGLE_SIDEBAR'                 => defined('SHOW_SINGLE_SIDEBAR') ? SHOW_SINGLE_SIDEBAR : null,
                'DISABLE_VER_URL'                     => defined('DISABLE_VER_URL') ? DISABLE_VER_URL : null,
                'WWW_REDIRECT'                        => defined('WWW_REDIRECT') ? WWW_REDIRECT : null,
                'MADEIT_REVIEWS'                      => defined('MADEIT_REVIEWS') ? MADEIT_REVIEWS : null,
                'MADEIT_FONTAWESOME'                  => defined('MADEIT_FONTAWESOME') ? MADEIT_FONTAWESOME : null,
                'MADEIT_BOOTSTRAP_VERSION'            => defined('MADEIT_BOOTSTRAP_VERSION') ? MADEIT_BOOTSTRAP_VERSION : null,
                'MADEIT_ADD_DATEPICKER'               => defined('MADEIT_ADD_DATEPICKER') ? MADEIT_ADD_DATEPICKER : null,
                'MADEIT_BOOTSTRAP_POPPER'             => defined('MADEIT_BOOTSTRAP_POPPER') ? MADEIT_BOOTSTRAP_POPPER : null,
                'MADEIT_POPUPS'                       => defined('MADEIT_POPUPS') ? MADEIT_POPUPS : null,
                'MADEIT_INFINITE_SCROLL'              => defined('MADEIT_INFINITE_SCROLL') ? MADEIT_INFINITE_SCROLL : null,
                'MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX' => defined('MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX') ? MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX : null,
                'MADEIT_ANALYTICS_GA'                 => defined('MADEIT_ANALYTICS_GA') ? MADEIT_ANALYTICS_GA : null,
                'MADEIT_ANALYTICS_TM'                 => defined('MADEIT_ANALYTICS_TM') ? MADEIT_ANALYTICS_TM : null,
                'MADEIT_ANALYTICS_FB'                 => defined('MADEIT_ANALYTICS_FB') ? MADEIT_ANALYTICS_FB : null,
                'MADEIT_REVIEWS_GOOGLE_ID'            => defined('MADEIT_REVIEWS_GOOGLE_ID') ? MADEIT_REVIEWS_GOOGLE_ID : null,
                'MADEIT_REVIEWS_GOOGLE_API'           => defined('MADEIT_REVIEWS_GOOGLE_API') ? MADEIT_REVIEWS_GOOGLE_API : null,
                'MADEIT_RECEIVE_REVIEWS'              => defined('MADEIT_RECEIVE_REVIEWS') ? MADEIT_RECEIVE_REVIEWS : null,
            ],
        ],
    ];

    $response = wp_remote_post($url, $args);
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
    }

    //get response in json
    $response = json_decode(wp_remote_retrieve_body($response), true);
}

//wp cli command
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('madeit_cron_daily', 'madeit_cron_daily');
}

// schedule an daily cronjob
add_action('init', function () {
    if (!wp_next_scheduled('madeit_cron_daily')) {
        wp_schedule_event(time(), 'daily', 'madeit_cron_daily');
    }
});

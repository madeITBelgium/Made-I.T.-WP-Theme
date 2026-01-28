<?php
if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('madeit_tracking_register_post_type')) {
    function madeit_tracking_register_post_type()
    {
        register_post_type('madeit_tracking', [
            'labels' => [
                'name' => __('Tracking', 'madeit'),
                'singular_name' => __('Tracking', 'madeit'),
            ],
            'public' => false,
            'show_ui' => false,
            'show_in_menu' => false,
            'supports' => ['title'],
            'has_archive' => false,
            'rewrite' => false,
        ]);
    }
}
add_action('init', 'madeit_tracking_register_post_type');

if (!function_exists('madeit_tracking_enqueue_scripts')) {
    function madeit_tracking_enqueue_scripts()
    {
        wp_enqueue_script('madeit-tracking-ids', get_theme_file_uri('/assets/js/tracking-ids.js'), [], wp_get_theme()->get('Version'), true);
        wp_localize_script('madeit-tracking-ids', 'madeit_tracking', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'cookie_name' => apply_filters('madeit_tracking_cookie_name', 'madeit_tracking_id'),
            'cookie_gclid' => apply_filters('madeit_tracking_cookie_gclid', 'madeit_gclid'),
            'cookie_fbclid' => apply_filters('madeit_tracking_cookie_fbclid', 'madeit_fbclid'),
            'cookie_days' => apply_filters('madeit_tracking_cookie_days', 90),
        ]);
    }
}
add_action('wp_enqueue_scripts', 'madeit_tracking_enqueue_scripts');

if (!function_exists('madeit_tracking_get_post_id_by_tracking_id')) {
    function madeit_tracking_get_post_id_by_tracking_id($tracking_id)
    {
        if (empty($tracking_id)) {
            return 0;
        }

        $posts = get_posts([
            'post_type' => 'madeit_tracking',
            'post_status' => 'publish',
            'posts_per_page' => 1,
            'fields' => 'ids',
            'meta_key' => 'madeit_tracking_id',
            'meta_value' => $tracking_id,
        ]);

        if (is_array($posts) && count($posts) > 0) {
            return (int) $posts[0];
        }

        return 0;
    }
}

if (!function_exists('madeit_tracking_get_cookie_value')) {
    function madeit_tracking_get_cookie_value($cookie_name)
    {
        if (empty($cookie_name)) {
            return '';
        }

        return isset($_COOKIE[$cookie_name]) ? sanitize_text_field(wp_unslash($_COOKIE[$cookie_name])) : '';
    }
}

if (!function_exists('madeit_tracking_get_tracking_ids_from_cookies')) {
    function madeit_tracking_get_tracking_ids_from_cookies()
    {
        $cookie_name = apply_filters('madeit_tracking_cookie_name', 'madeit_tracking_id');
        $cookie_gclid = apply_filters('madeit_tracking_cookie_gclid', 'madeit_gclid');
        $cookie_fbclid = apply_filters('madeit_tracking_cookie_fbclid', 'madeit_fbclid');

        return [
            'tracking_id' => madeit_tracking_get_cookie_value($cookie_name),
            'gclid' => madeit_tracking_get_cookie_value($cookie_gclid),
            'fbclid' => madeit_tracking_get_cookie_value($cookie_fbclid),
        ];
    }
}

if (!function_exists('madeit_tracking_get_or_create_tracking_post')) {
    function madeit_tracking_get_or_create_tracking_post($tracking_id, $gclid = '', $fbclid = '', $context = [])
    {
        $tracking_id = !empty($tracking_id) ? sanitize_text_field($tracking_id) : '';
        $gclid = !empty($gclid) ? sanitize_text_field($gclid) : '';
        $fbclid = !empty($fbclid) ? sanitize_text_field($fbclid) : '';

        if (empty($tracking_id) && (empty($gclid) && empty($fbclid))) {
            return [0, ''];
        }

        $post_id = 0;
        if (!empty($tracking_id)) {
            $post_id = madeit_tracking_get_post_id_by_tracking_id($tracking_id);
        }

        if (!$post_id) {
            if (empty($tracking_id)) {
                $tracking_id = wp_generate_uuid4();
            }

            $post_id = wp_insert_post([
                'post_type' => 'madeit_tracking',
                'post_status' => 'publish',
                'post_title' => 'Tracking ' . $tracking_id,
            ]);

            if (is_wp_error($post_id) || !$post_id) {
                return [0, ''];
            }

            update_post_meta($post_id, 'madeit_tracking_id', $tracking_id);
            update_post_meta($post_id, 'madeit_tracking_first_seen', current_time('mysql'));
            do_action('madeit_tracking_registered', (int) $post_id, $tracking_id, $context);
        }

        if (!empty($gclid)) {
            update_post_meta($post_id, 'madeit_tracking_gclid', $gclid);
        }
        if (!empty($fbclid)) {
            update_post_meta($post_id, 'madeit_tracking_fbclid', $fbclid);
        }

        update_post_meta($post_id, 'madeit_tracking_last_seen', current_time('mysql'));

        return [(int) $post_id, $tracking_id];
    }
}

if (!function_exists('madeit_tracking_log_action')) {
    function madeit_tracking_log_action($tracking_post_id, $action_type, $action_value = null, $context = [])
    {
        $tracking_post_id = (int) $tracking_post_id;
        if ($tracking_post_id <= 0) {
            return;
        }

        $action_type = sanitize_key($action_type);
        if (empty($action_type)) {
            return;
        }

        $entry = [
            'type' => $action_type,
            'value' => $action_value,
            'time' => current_time('mysql'),
            'context' => is_array($context) ? $context : [],
        ];

        $actions = get_post_meta($tracking_post_id, 'madeit_tracking_actions', true);
        if (!is_array($actions)) {
            $actions = [];
        }
        $actions[] = $entry;

        update_post_meta($tracking_post_id, 'madeit_tracking_actions', $actions);
        update_post_meta($tracking_post_id, 'madeit_tracking_last_action_type', $action_type);
        update_post_meta($tracking_post_id, 'madeit_tracking_last_action_time', $entry['time']);
        update_post_meta($tracking_post_id, 'madeit_tracking_action_' . $action_type, 1);

        do_action('madeit_tracking_action_logged', $tracking_post_id, $entry);
    }
}

if (!function_exists('madeit_tracking_meta_is_enabled')) {
    function madeit_tracking_meta_is_enabled()
    {
        return defined('MADEIT_META_ACCESS_TOKEN') && !empty(MADEIT_META_ACCESS_TOKEN)
            && (defined('MADEIT_ANALYTICS_FB') && !empty(MADEIT_ANALYTICS_FB));
    }
}

if (!function_exists('madeit_tracking_meta_hash')) {
    function madeit_tracking_meta_hash($value)
    {
        $value = is_string($value) ? trim(strtolower($value)) : '';
        if (empty($value)) {
            return '';
        }

        return hash('sha256', $value);
    }
}

if (!function_exists('madeit_tracking_meta_get_cookie')) {
    function madeit_tracking_meta_get_cookie($name)
    {
        if (empty($name)) {
            return '';
        }

        return isset($_COOKIE[$name]) ? sanitize_text_field(wp_unslash($_COOKIE[$name])) : '';
    }
}

if (!function_exists('madeit_tracking_meta_map_event_name')) {
    function madeit_tracking_meta_map_event_name($action_type)
    {
        $action_type = sanitize_key($action_type);
        $map = apply_filters('madeit_tracking_meta_event_map', [
            'lead' => 'Lead',
            'purchase' => 'Purchase',
            'register' => 'CompleteRegistration',
        ]);

        return isset($map[$action_type]) ? $map[$action_type] : '';
    }
}

if (!function_exists('madeit_tracking_meta_send_event')) {
    function madeit_tracking_meta_send_event($tracking_post_id, $entry)
    {
        if (!madeit_tracking_meta_is_enabled()) {
            return;
        }

        $tracking_post_id = (int) $tracking_post_id;
        if ($tracking_post_id <= 0 || !is_array($entry)) {
            return;
        }

        $event_name = madeit_tracking_meta_map_event_name(isset($entry['type']) ? $entry['type'] : '');
        if (empty($event_name)) {
            return;
        }

        $tracking_id = (string) get_post_meta($tracking_post_id, 'madeit_tracking_id', true);
        $email = (string) get_post_meta($tracking_post_id, 'madeit_tracking_email', true);
        $ip_address = (string) get_post_meta($tracking_post_id, 'madeit_tracking_ip', true);
        $user_agent = (string) get_post_meta($tracking_post_id, 'madeit_tracking_user_agent', true);

        $fbp = madeit_tracking_meta_get_cookie('_fbp');
        $fbc = madeit_tracking_meta_get_cookie('_fbc');

        // If fbc is missing but fbclid exists, build a best-effort fbc.
        if (empty($fbc)) {
            $fbclid = (string) get_post_meta($tracking_post_id, 'madeit_tracking_fbclid', true);
            if (!empty($fbclid)) {
                $fbc = 'fb.1.' . time() . '.' . $fbclid;
            }
        }

        $event_time = time();
        if (!empty($entry['time'])) {
            $ts = strtotime($entry['time']);
            if (!empty($ts)) {
                $event_time = (int) $ts;
            }
        }

        $context = isset($entry['context']) && is_array($entry['context']) ? $entry['context'] : [];
        $event_source_url = '';
        if (!empty($context['source']) && $context['source'] === 'form') {
            $event_source_url = wp_get_referer();
        }
        if (empty($event_source_url) && !empty($_SERVER['HTTP_REFERER'])) {
            $event_source_url = esc_url_raw(wp_unslash($_SERVER['HTTP_REFERER']));
        }

        $user_data = [];
        $hashed_email = madeit_tracking_meta_hash($email);
        if (!empty($hashed_email)) {
            $user_data['em'] = [$hashed_email];
        }
        if (!empty($ip_address)) {
            $user_data['client_ip_address'] = $ip_address;
        }
        if (!empty($user_agent)) {
            $user_data['client_user_agent'] = $user_agent;
        }
        if (!empty($fbp)) {
            $user_data['fbp'] = $fbp;
        }
        if (!empty($fbc)) {
            $user_data['fbc'] = $fbc;
        }

        $custom_data = [];
        $action_value = isset($entry['value']) ? $entry['value'] : null;
        if ($event_name === 'Purchase') {
            if (is_array($action_value)) {
                if (isset($action_value['total'])) {
                    $custom_data['value'] = (float) $action_value['total'];
                }
                if (!empty($action_value['currency'])) {
                    $custom_data['currency'] = (string) $action_value['currency'];
                }
                if (!empty($action_value['order_id'])) {
                    $custom_data['order_id'] = (string) $action_value['order_id'];
                }
            }
        }

        $event_id = apply_filters(
            'madeit_tracking_meta_event_id',
            substr(hash('sha256', $tracking_id . '|' . $event_name . '|' . $event_time . '|' . wp_json_encode($action_value)), 0, 32),
            $tracking_post_id,
            $entry
        );

        $payload = [
            'data' => [
                [
                    'event_name' => $event_name,
                    'event_time' => $event_time,
                    'event_id' => $event_id,
                    'action_source' => 'website',
                    'event_source_url' => $event_source_url,
                    'user_data' => $user_data,
                    'custom_data' => $custom_data,
                ],
            ],
        ];

        if (defined('MADEIT_META_TEST_EVENT_CODE') && !empty(MADEIT_META_TEST_EVENT_CODE)) {
            $payload['test_event_code'] = MADEIT_META_TEST_EVENT_CODE;
        }

        $pixel_ids = array_filter(array_map('trim', explode(',', MADEIT_ANALYTICS_FB)));
        $api_version = defined('MADEIT_META_API_VERSION') && !empty(MADEIT_META_API_VERSION) ? MADEIT_META_API_VERSION : 'v24.0';
        $responses = [];
        foreach ($pixel_ids as $pixel_id) {
            if (empty($pixel_id)) continue;
            $endpoint = 'https://graph.facebook.com/' . rawurlencode($api_version) . '/' . rawurlencode($pixel_id) . '/events';
            $endpoint = apply_filters('madeit_tracking_meta_endpoint', $endpoint, $payload, $tracking_post_id, $entry);
            $response = wp_remote_post($endpoint, [
                'timeout' => 5,
                'headers' => [
                    'Content-Type' => 'application/json; charset=utf-8',
                ],
                'body' => wp_json_encode(array_merge($payload, [
                    'access_token' => MADEIT_META_ACCESS_TOKEN,
                ])),
            ]);
            $responses[$pixel_id] = $response;
        }
        do_action('madeit_tracking_meta_event_sent', $tracking_post_id, $entry, $payload, $responses);
    }
}
add_action('madeit_tracking_action_logged', 'madeit_tracking_meta_send_event', 10, 2);

if (!function_exists('madeit_tracking_store_ajax')) {
    function madeit_tracking_store_ajax()
    {
        $gclid = isset($_POST['gclid']) ? sanitize_text_field(wp_unslash($_POST['gclid'])) : '';
        $fbclid = isset($_POST['fbclid']) ? sanitize_text_field(wp_unslash($_POST['fbclid'])) : '';
        $visitor_id = isset($_POST['visitor_id']) ? sanitize_text_field(wp_unslash($_POST['visitor_id'])) : '';
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
        $ip_address = '';
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $forwarded_for = sanitize_text_field(wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR']));
            $forwarded_parts = array_map('trim', explode(',', $forwarded_for));
            $ip_address = isset($forwarded_parts[0]) ? $forwarded_parts[0] : '';
        }
        if (empty($ip_address)) {
            $ip_address = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';
        }

        if (empty($gclid) && empty($fbclid)) {
            wp_send_json_error(['message' => 'missing_tracking_ids'], 400);
        }

        $context = [
            'source' => 'ajax',
        ];

        [$post_id, $visitor_id] = madeit_tracking_get_or_create_tracking_post($visitor_id, $gclid, $fbclid, $context);
        if (!$post_id) {
            wp_send_json_error(['message' => 'tracking_create_failed'], 500);
        }

        if (!empty($user_agent)) {
            update_post_meta($post_id, 'madeit_tracking_user_agent', $user_agent);
        }

        if (!empty($ip_address)) {
            update_post_meta($post_id, 'madeit_tracking_ip', $ip_address);
        }

        update_post_meta($post_id, 'madeit_tracking_last_seen', current_time('mysql'));

        wp_send_json_success([
            'visitor_id' => $visitor_id,
            'tracking_post_id' => (int) $post_id,
        ]);
    }
}
add_action('wp_ajax_madeit_store_tracking_ids', 'madeit_tracking_store_ajax');
add_action('wp_ajax_nopriv_madeit_store_tracking_ids', 'madeit_tracking_store_ajax');

if (!function_exists('madeit_tracking_forms_post_data')) {
    function madeit_tracking_forms_post_data($postData, $form_id, $input_id)
    {
        $input_id = (int) $input_id;
        if ($input_id <= 0) {
            return $postData;
        }

        $ids = madeit_tracking_get_tracking_ids_from_cookies();
        $tracking_id = $ids['tracking_id'];
        $gclid = $ids['gclid'];
        $fbclid = $ids['fbclid'];

        if (!empty($gclid)) {
            update_post_meta($input_id, '_madeit_gclid', $gclid);
        }
        if (!empty($fbclid)) {
            update_post_meta($input_id, '_madeit_fbclid', $fbclid);
        }
        if (!empty($tracking_id)) {
            update_post_meta($input_id, '_madeit_tracking_id', $tracking_id);
        }

        [$tracking_post_id, $tracking_id_final] = madeit_tracking_get_or_create_tracking_post(
            $tracking_id,
            $gclid,
            $fbclid,
            [
                'source' => 'form',
                'form_id' => (int) $form_id,
                'input_id' => $input_id,
            ]
        );

        if ($tracking_post_id) {
            update_post_meta($input_id, '_madeit_tracking_post_id', (int) $tracking_post_id);
            madeit_tracking_log_action($tracking_post_id, 'lead', 1, [
                'source' => 'form',
                'form_id' => (int) $form_id,
                'input_id' => $input_id,
            ]);
        }

        if (is_array($postData)) {
            if (!empty($gclid)) {
                $postData['gclid'] = $gclid;
            }
            if (!empty($fbclid)) {
                $postData['fbclid'] = $fbclid;
            }
            if (!empty($tracking_id_final)) {
                $postData['tracking_id'] = $tracking_id_final;
            }
        }

        return $postData;
    }
}
add_filter('madeit_forms_post_data', 'madeit_tracking_forms_post_data', 10, 3);

if (!function_exists('madeit_tracking_schedule_cleanup')) {
    function madeit_tracking_schedule_cleanup()
    {
        if (!wp_next_scheduled('madeit_tracking_cleanup')) {
            wp_schedule_event(time(), 'daily', 'madeit_tracking_cleanup');
        }
    }
}
add_action('init', 'madeit_tracking_schedule_cleanup');

if (!function_exists('madeit_tracking_cleanup_old_entries')) {
    function madeit_tracking_cleanup_old_entries()
    {
        $days = apply_filters('madeit_tracking_retention_days', 90);
        $cutoff = gmdate('Y-m-d H:i:s', time() - ((int) $days * DAY_IN_SECONDS));

        $posts = get_posts([
            'post_type' => 'madeit_tracking',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
            'meta_query' => [
                'relation' => 'OR',
                [
                    'key' => 'madeit_tracking_last_seen',
                    'value' => $cutoff,
                    'compare' => '<=',
                    'type' => 'DATETIME',
                ],
                [
                    'relation' => 'AND',
                    [
                        'key' => 'madeit_tracking_last_seen',
                        'compare' => 'NOT EXISTS',
                    ],
                    [
                        'key' => 'madeit_tracking_first_seen',
                        'value' => $cutoff,
                        'compare' => '<=',
                        'type' => 'DATETIME',
                    ],
                ],
            ],
        ]);

        if (is_array($posts) && count($posts) > 0) {
            foreach ($posts as $post_id) {
                wp_delete_post($post_id, true);
            }
        }
    }
}
add_action('madeit_tracking_cleanup', 'madeit_tracking_cleanup_old_entries');

if (!function_exists('madeit_tracking_export_admin_menu')) {
    function madeit_tracking_export_admin_menu()
    {
        add_management_page(
            __('Tracking export', 'madeit'),
            __('Tracking export', 'madeit'),
            'manage_options',
            'madeit-tracking-export',
            'madeit_tracking_export_page'
        );
    }
}
add_action('admin_menu', 'madeit_tracking_export_admin_menu');

if (!function_exists('madeit_tracking_export_page')) {
    function madeit_tracking_export_page()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $export_url = wp_nonce_url(
            admin_url('admin-post.php?action=madeit_tracking_export_csv'),
            'madeit_tracking_export_csv'
        );

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Tracking export', 'madeit') . '</h1>';
        echo '<p><a class="button button-primary" href="' . esc_url($export_url) . '">' . esc_html__('Download CSV', 'madeit') . '</a></p>';
        echo '</div>';
    }
}

if (!function_exists('madeit_tracking_export_csv')) {
    function madeit_tracking_export_csv()
    {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to export.', 'madeit'));
        }

        check_admin_referer('madeit_tracking_export_csv');

        $ids = get_posts([
            'post_type' => 'madeit_tracking',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
        ]);

        $filename = 'tracking-export-' . gmdate('Y-m-d') . '.csv';

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $filename);
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');
        fputcsv($output, [
            'tracking_id',
            'gclid',
            'fbclid',
            'email',
            'user_agent',
            'ip',
            'first_seen',
            'last_seen',
        ], ';');

        if (is_array($ids) && count($ids) > 0) {
            foreach ($ids as $post_id) {
                fputcsv($output, [
                    get_post_meta($post_id, 'madeit_tracking_id', true),
                    get_post_meta($post_id, 'madeit_tracking_gclid', true),
                    get_post_meta($post_id, 'madeit_tracking_fbclid', true),
                    get_post_meta($post_id, 'madeit_tracking_email', true),
                    get_post_meta($post_id, 'madeit_tracking_user_agent', true),
                    get_post_meta($post_id, 'madeit_tracking_ip', true),
                    get_post_meta($post_id, 'madeit_tracking_first_seen', true),
                    get_post_meta($post_id, 'madeit_tracking_last_seen', true),
                ], ';');
            }
        }

        fclose($output);
        exit;
    }
}
add_action('admin_post_madeit_tracking_export_csv', 'madeit_tracking_export_csv');

if (!function_exists('madeit_tracking_extract_email_from_array')) {
    function madeit_tracking_extract_email_from_array($data)
    {
        if (!is_array($data)) {
            $email = sanitize_email($data);
            return !empty($email) ? $email : '';
        }

        foreach ($data as $value) {
            $email = madeit_tracking_extract_email_from_array($value);
            if (!empty($email)) {
                return $email;
            }
        }

        return '';
    }
}

if (!function_exists('madeit_tracking_store_email_for_visitor')) {
    function madeit_tracking_store_email_for_visitor($email)
    {
        $email = sanitize_email($email);
        if (empty($email)) {
            return;
        }

        $cookie_name = apply_filters('madeit_tracking_cookie_name', 'madeit_tracking_id');
        $tracking_id = isset($_COOKIE[$cookie_name]) ? sanitize_text_field(wp_unslash($_COOKIE[$cookie_name])) : '';

        if (empty($tracking_id)) {
            return;
        }

        $post_id = madeit_tracking_get_post_id_by_tracking_id($tracking_id);
        if (!$post_id) {
            $post_id = wp_insert_post([
                'post_type' => 'madeit_tracking',
                'post_status' => 'publish',
                'post_title' => 'Tracking ' . $tracking_id,
            ]);

            if (is_wp_error($post_id) || !$post_id) {
                return;
            }

            update_post_meta($post_id, 'madeit_tracking_id', $tracking_id);
            update_post_meta($post_id, 'madeit_tracking_first_seen', current_time('mysql'));
        }

        update_post_meta($post_id, 'madeit_tracking_email', $email);
        update_post_meta($post_id, 'madeit_tracking_last_seen', current_time('mysql'));
    }
}

if (!function_exists('madeit_tracking_capture_post_email')) {
    function madeit_tracking_capture_post_email()
    {
        if (empty($_POST)) {
            return;
        }

        if (is_admin() && !wp_doing_ajax()) {
            return;
        }

        $enabled = apply_filters('madeit_tracking_capture_post_email', true);
        if (!$enabled) {
            return;
        }

        $email = madeit_tracking_extract_email_from_array(wp_unslash($_POST));
        if (!empty($email)) {
            madeit_tracking_store_email_for_visitor($email);
        }
    }
}
add_action('init', 'madeit_tracking_capture_post_email', 1);

if (!function_exists('madeit_tracking_attach_to_order')) {
    function madeit_tracking_attach_to_order($order_id)
    {
        $cookie_name = apply_filters('madeit_tracking_cookie_name', 'madeit_tracking_id');
        $cookie_gclid = apply_filters('madeit_tracking_cookie_gclid', 'madeit_gclid');
        $cookie_fbclid = apply_filters('madeit_tracking_cookie_fbclid', 'madeit_fbclid');

        $tracking_id = isset($_COOKIE[$cookie_name]) ? sanitize_text_field(wp_unslash($_COOKIE[$cookie_name])) : '';
        $gclid = isset($_COOKIE[$cookie_gclid]) ? sanitize_text_field(wp_unslash($_COOKIE[$cookie_gclid])) : '';
        $fbclid = isset($_COOKIE[$cookie_fbclid]) ? sanitize_text_field(wp_unslash($_COOKIE[$cookie_fbclid])) : '';

        if (empty($tracking_id) && empty($gclid) && empty($fbclid)) {
            return;
        }

        [$tracking_post_id, $tracking_id] = madeit_tracking_get_or_create_tracking_post(
            $tracking_id,
            $gclid,
            $fbclid,
            [
                'source' => 'woocommerce',
                'order_id' => (int) $order_id,
            ]
        );

        if (!empty($tracking_id)) {
            update_post_meta($order_id, '_madeit_tracking_id', $tracking_id);
        }
        if (!empty($tracking_post_id) && !is_wp_error($tracking_post_id)) {
            update_post_meta($order_id, '_madeit_tracking_post_id', (int) $tracking_post_id);
        }
        if (!empty($gclid)) {
            update_post_meta($order_id, '_madeit_gclid', $gclid);
        }
        if (!empty($fbclid)) {
            update_post_meta($order_id, '_madeit_fbclid', $fbclid);
        }

        $order = function_exists('wc_get_order') ? wc_get_order($order_id) : null;
        if ($order) {
            $email = $order->get_billing_email();
            if (!empty($email)) {
                update_post_meta($order_id, '_madeit_email', $email);
                madeit_tracking_store_email_for_visitor($email);
            }

            if (!empty($tracking_post_id) && !is_wp_error($tracking_post_id)) {
                $total = $order->get_total();
                $currency = method_exists($order, 'get_currency') ? $order->get_currency() : '';
                madeit_tracking_log_action((int) $tracking_post_id, 'purchase', [
                    'order_id' => (int) $order_id,
                    'total' => $total,
                    'currency' => $currency,
                ], [
                    'source' => 'woocommerce',
                    'order_id' => (int) $order_id,
                ]);
            }
        }
    }
}

if (class_exists('WooCommerce')) {
    add_action('woocommerce_checkout_update_order_meta', 'madeit_tracking_attach_to_order', 10, 1);
}

if (!function_exists('madeit_tracking_user_register')) {
    function madeit_tracking_user_register($user_id)
    {
        $user_id = (int) $user_id;
        if ($user_id <= 0) {
            return;
        }

        $ids = madeit_tracking_get_tracking_ids_from_cookies();
        $tracking_id = $ids['tracking_id'];
        $gclid = $ids['gclid'];
        $fbclid = $ids['fbclid'];

        if (empty($tracking_id) && empty($gclid) && empty($fbclid)) {
            return;
        }

        [$tracking_post_id, $tracking_id] = madeit_tracking_get_or_create_tracking_post(
            $tracking_id,
            $gclid,
            $fbclid,
            [
                'source' => 'user_register',
                'user_id' => $user_id,
            ]
        );

        if (!$tracking_post_id) {
            return;
        }

        update_user_meta($user_id, '_madeit_tracking_id', $tracking_id);
        update_user_meta($user_id, '_madeit_tracking_post_id', (int) $tracking_post_id);
        if (!empty($gclid)) {
            update_user_meta($user_id, '_madeit_gclid', $gclid);
        }
        if (!empty($fbclid)) {
            update_user_meta($user_id, '_madeit_fbclid', $fbclid);
        }

        $user = get_userdata($user_id);
        if ($user && !empty($user->user_email)) {
            madeit_tracking_store_email_for_visitor($user->user_email);
        }

        madeit_tracking_log_action((int) $tracking_post_id, 'register', [
            'user_id' => $user_id,
        ], [
            'source' => 'user_register',
            'user_id' => $user_id,
        ]);
    }
}
add_action('user_register', 'madeit_tracking_user_register', 10, 1);


if (!function_exists('madeit_tracking_google_ads_export_is_enabled')) {
    function madeit_tracking_google_ads_export_is_enabled()
    {
        return defined('MADEIT_TRACKING_EXPORT_KEY') && is_string(MADEIT_TRACKING_EXPORT_KEY) && MADEIT_TRACKING_EXPORT_KEY !== '';
    }
}

if (!function_exists('madeit_tracking_google_ads_export_check_key')) {
    function madeit_tracking_google_ads_export_check_key($provided)
    {
        if (!madeit_tracking_google_ads_export_is_enabled()) {
            return false;
        }

        $provided = is_string($provided) ? $provided : '';
        $provided = trim($provided);
        if ($provided === '') {
            return false;
        }

        $expected = (string) MADEIT_TRACKING_EXPORT_KEY;
        return function_exists('hash_equals') ? hash_equals($expected, $provided) : $expected === $provided;
    }
}

if (!function_exists('madeit_tracking_google_ads_export_get_timezone')) {
    function madeit_tracking_google_ads_export_get_timezone()
    {
        $tz = defined('MADEIT_GOOGLE_ADS_TIMEZONE') && !empty(MADEIT_GOOGLE_ADS_TIMEZONE) ? (string) MADEIT_GOOGLE_ADS_TIMEZONE : 'UTC';
        $tz = trim($tz);
        if ($tz === '') {
            $tz = 'UTC';
        }

        return apply_filters('madeit_tracking_google_ads_timezone', $tz);
    }
}

if (!function_exists('madeit_tracking_google_ads_export_map_conversion_name')) {
    function madeit_tracking_google_ads_export_map_conversion_name($action_type)
    {
        $action_type = sanitize_key($action_type);
        $map = apply_filters('madeit_tracking_google_ads_conversion_name_map', [
            'lead' => 'Lead',
            'purchase' => 'Purchase',
            'register' => 'CompleteRegistration',
        ]);

        return (is_array($map) && isset($map[$action_type])) ? (string) $map[$action_type] : '';
    }
}

if (!function_exists('madeit_tracking_google_ads_export_parse_date_param')) {
    function madeit_tracking_google_ads_export_parse_date_param($value)
    {
        $value = is_string($value) ? trim($value) : '';
        if ($value === '') {
            return 0;
        }

        // Accept YYYY-MM-DD or any strtotime compatible string.
        $ts = strtotime($value);
        return $ts ? (int) $ts : 0;
    }
}

if (!function_exists('madeit_tracking_google_ads_export_output_csv')) {
    function madeit_tracking_google_ads_export_output_csv()
    {
        $timezone = madeit_tracking_google_ads_export_get_timezone();

        $filename = 'google-ads-conversions-' . gmdate('Y-m-d') . '.csv';

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $filename);
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');
        if (!$output) {
            status_header(500);
            exit;
        }

        // Google Ads offline conversion import template header.
        fputcsv($output, [
            'Parameters:TimeZone=' . $timezone,
        ]);
        fputcsv($output, [
            'Google Click ID',
            'Conversion Name',
            'Conversion Time',
            'Conversion Value',
            'Conversion Currency',
            'Ad User Data',
            'Ad Personalization',
        ]);

        $from_ts = isset($_GET['from']) ? madeit_tracking_google_ads_export_parse_date_param(wp_unslash($_GET['from'])) : 0;
        $to_ts = isset($_GET['to']) ? madeit_tracking_google_ads_export_parse_date_param(wp_unslash($_GET['to'])) : 0;
        $only_type = isset($_GET['type']) ? sanitize_key(wp_unslash($_GET['type'])) : '';

        $ids = get_posts([
            'post_type' => 'madeit_tracking',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
        ]);

        if (!is_array($ids) || count($ids) === 0) {
            fclose($output);
            exit;
        }

        foreach ($ids as $post_id) {
            $post_id = (int) $post_id;
            if ($post_id <= 0) {
                continue;
            }

            $gclid = (string) get_post_meta($post_id, 'madeit_tracking_gclid', true);
            $gclid = trim($gclid);
            if ($gclid === '') {
                continue;
            }

            $actions = get_post_meta($post_id, 'madeit_tracking_actions', true);
            if (!is_array($actions) || count($actions) === 0) {
                continue;
            }

            foreach ($actions as $entry) {
                if (!is_array($entry)) {
                    continue;
                }

                $action_type = isset($entry['type']) ? sanitize_key($entry['type']) : '';
                if ($action_type === '') {
                    continue;
                }
                if ($only_type !== '' && $only_type !== $action_type) {
                    continue;
                }

                $conversion_name = madeit_tracking_google_ads_export_map_conversion_name($action_type);
                if ($conversion_name === '') {
                    continue;
                }

                $entry_time = isset($entry['time']) ? (string) $entry['time'] : '';
                $event_ts = $entry_time !== '' ? (int) strtotime($entry_time) : 0;
                if ($event_ts <= 0) {
                    continue;
                }
                if ($from_ts > 0 && $event_ts < $from_ts) {
                    continue;
                }
                if ($to_ts > 0 && $event_ts > $to_ts) {
                    continue;
                }

                // Time should match the TimeZone specified in the parameters row.
                $conversion_time = gmdate('Y-m-d H:i:s', $event_ts);

                $value = '';
                $currency = '';
                $action_value = isset($entry['value']) ? $entry['value'] : null;

                if ($action_type === 'purchase' && is_array($action_value)) {
                    if (isset($action_value['total'])) {
                        $value = (string) (float) $action_value['total'];
                    }
                    if (!empty($action_value['currency'])) {
                        $currency = (string) $action_value['currency'];
                    }
                } else {
                    // For non-purchase conversions, keep value/currency empty by default.
                    $value = apply_filters('madeit_tracking_google_ads_default_value', '', $action_type, $post_id, $entry);
                    $currency = apply_filters('madeit_tracking_google_ads_default_currency', '', $action_type, $post_id, $entry);
                }

                $ad_user_data = apply_filters('madeit_tracking_google_ads_ad_user_data', '', $post_id, $entry);
                $ad_personalization = apply_filters('madeit_tracking_google_ads_ad_personalization', '', $post_id, $entry);

                fputcsv($output, [
                    $gclid,
                    $conversion_name,
                    $conversion_time,
                    $value,
                    $currency,
                    $ad_user_data,
                    $ad_personalization,
                ]);
            }
        }

        fclose($output);
        exit;
    }
}

if (!function_exists('madeit_tracking_google_ads_export_endpoint')) {
    function madeit_tracking_google_ads_export_endpoint()
    {
        if (is_admin() || wp_doing_ajax()) {
            return;
        }

        // Secret URL endpoint:
        //   https://example.com/?madeit_tracking_google_ads_csv=1&key=YOUR_KEY
        if (!isset($_GET['madeit_tracking_google_ads_csv'])) {
            return;
        }

        $key = isset($_GET['key']) ? (string) wp_unslash($_GET['key']) : '';
        if (!madeit_tracking_google_ads_export_check_key($key)) {
            // Do not reveal whether this endpoint exists/enabled.
            return;
        }

        madeit_tracking_google_ads_export_output_csv();
    }
}
add_action('template_redirect', 'madeit_tracking_google_ads_export_endpoint', 0);


/*
### INSTRUCTIONS ###,,,,
# IMPORTANT: Remember to set the TimeZone value in the ""parameters"" row and/or in your Conversion Time column,,,,
# For instructions on how to set your timezones visit http://goo.gl/T1C5Ov,,,,
,,,,
### TEMPLATE ###,,,,
Parameters:TimeZone=UTC,,,,
Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Ad User Data,Ad Personalization
*/
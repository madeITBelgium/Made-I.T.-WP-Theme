<?php

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('madeit_tracking_register_post_type')) {
    function madeit_tracking_register_post_type()
    {
        register_post_type('madeit_tracking', [
            'labels' => [
                'name'          => __('Tracking', 'madeit'),
                'singular_name' => __('Tracking', 'madeit'),
            ],
            'public'       => false,
            'show_ui'      => false,
            'show_in_menu' => false,
            'supports'     => ['title'],
            'has_archive'  => false,
            'rewrite'      => false,
        ]);
    }
}
add_action('init', 'madeit_tracking_register_post_type');

if (!function_exists('madeit_tracking_enqueue_scripts')) {
    function madeit_tracking_enqueue_scripts()
    {
        wp_enqueue_script('madeit-tracking-ids', get_theme_file_uri('/assets/js/tracking-ids.js'), [], wp_get_theme()->get('Version'), true);
        wp_localize_script('madeit-tracking-ids', 'madeit_tracking', [
            'ajax_url'      => admin_url('admin-ajax.php'),
            'cookie_name'   => apply_filters('madeit_tracking_cookie_name', 'madeit_tracking_id'),
            'cookie_gclid'  => apply_filters('madeit_tracking_cookie_gclid', 'madeit_gclid'),
            'cookie_fbclid' => apply_filters('madeit_tracking_cookie_fbclid', 'madeit_fbclid'),
            'cookie_days'   => apply_filters('madeit_tracking_cookie_days', 90),
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
            'post_type'      => 'madeit_tracking',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_key'       => 'madeit_tracking_id',
            'meta_value'     => $tracking_id,
        ]);

        if (is_array($posts) && count($posts) > 0) {
            return (int) $posts[0];
        }

        return 0;
    }
}

if (!function_exists('madeit_tracking_store_ajax')) {
    function madeit_tracking_store_ajax()
    {
        $gclid = isset($_POST['gclid']) ? sanitize_text_field(wp_unslash($_POST['gclid'])) : '';
        $fbclid = isset($_POST['fbclid']) ? sanitize_text_field(wp_unslash($_POST['fbclid'])) : '';
        $visitor_id = isset($_POST['visitor_id']) ? sanitize_text_field(wp_unslash($_POST['visitor_id'])) : '';
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'])) : '';
        $ip_address = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '';

        if (empty($gclid) && empty($fbclid)) {
            wp_send_json_error(['message' => 'missing_tracking_ids'], 400);
        }

        $post_id = 0;
        if (!empty($visitor_id)) {
            $post_id = madeit_tracking_get_post_id_by_tracking_id($visitor_id);
        }

        if (!$post_id) {
            $visitor_id = wp_generate_uuid4();
            $post_id = wp_insert_post([
                'post_type'   => 'madeit_tracking',
                'post_status' => 'publish',
                'post_title'  => 'Tracking '.$visitor_id,
            ]);

            if (is_wp_error($post_id) || !$post_id) {
                wp_send_json_error(['message' => 'tracking_create_failed'], 500);
            }

            update_post_meta($post_id, 'madeit_tracking_id', $visitor_id);
            update_post_meta($post_id, 'madeit_tracking_first_seen', current_time('mysql'));
        }

        if (!empty($gclid)) {
            update_post_meta($post_id, 'madeit_tracking_gclid', $gclid);
        }

        if (!empty($fbclid)) {
            update_post_meta($post_id, 'madeit_tracking_fbclid', $fbclid);
        }

        if (!empty($user_agent)) {
            update_post_meta($post_id, 'madeit_tracking_user_agent', $user_agent);
        }

        if (!empty($ip_address)) {
            update_post_meta($post_id, 'madeit_tracking_ip', $ip_address);
        }

        update_post_meta($post_id, 'madeit_tracking_last_seen', current_time('mysql'));

        wp_send_json_success([
            'visitor_id'       => $visitor_id,
            'tracking_post_id' => (int) $post_id,
        ]);
    }
}
add_action('wp_ajax_madeit_store_tracking_ids', 'madeit_tracking_store_ajax');
add_action('wp_ajax_nopriv_madeit_store_tracking_ids', 'madeit_tracking_store_ajax');

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
        $days = apply_filters('madeit_tracking_retention_days', 30);
        $cutoff = gmdate('Y-m-d H:i:s', time() - ((int) $days * DAY_IN_SECONDS));

        $posts = get_posts([
            'post_type'      => 'madeit_tracking',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
            'meta_query'     => [
                'relation' => 'OR',
                [
                    'key'     => 'madeit_tracking_last_seen',
                    'value'   => $cutoff,
                    'compare' => '<=',
                    'type'    => 'DATETIME',
                ],
                [
                    'relation' => 'AND',
                    [
                        'key'     => 'madeit_tracking_last_seen',
                        'compare' => 'NOT EXISTS',
                    ],
                    [
                        'key'     => 'madeit_tracking_first_seen',
                        'value'   => $cutoff,
                        'compare' => '<=',
                        'type'    => 'DATETIME',
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
        echo '<h1>'.esc_html__('Tracking export', 'madeit').'</h1>';
        echo '<p><a class="button button-primary" href="'.esc_url($export_url).'">'.esc_html__('Download CSV', 'madeit').'</a></p>';
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
            'post_type'      => 'madeit_tracking',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ]);

        $filename = 'tracking-export-'.gmdate('Y-m-d').'.csv';

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename='.$filename);
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
                'post_type'   => 'madeit_tracking',
                'post_status' => 'publish',
                'post_title'  => 'Tracking '.$tracking_id,
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

        $tracking_post_id = 0;
        if (!empty($tracking_id)) {
            $tracking_post_id = madeit_tracking_get_post_id_by_tracking_id($tracking_id);
        }

        if (!$tracking_post_id && (!empty($gclid) || !empty($fbclid))) {
            $tracking_id = !empty($tracking_id) ? $tracking_id : wp_generate_uuid4();
            $tracking_post_id = wp_insert_post([
                'post_type'   => 'madeit_tracking',
                'post_status' => 'publish',
                'post_title'  => 'Tracking '.$tracking_id,
            ]);

            if (!is_wp_error($tracking_post_id) && $tracking_post_id) {
                update_post_meta($tracking_post_id, 'madeit_tracking_id', $tracking_id);
                update_post_meta($tracking_post_id, 'madeit_tracking_first_seen', current_time('mysql'));
            }
        }

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
        }
    }
}

if (class_exists('WooCommerce')) {
    add_action('woocommerce_checkout_update_order_meta', 'madeit_tracking_attach_to_order', 10, 1);
}

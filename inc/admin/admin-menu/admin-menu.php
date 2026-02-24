<?php

/**
 * Admin menu ordering (code-only).
 *
 * Pas de volgorde aan in madeit_get_default_admin_menu_order().
 *
 * Separators:
 * - core: 'separator1', 'separator2', 'separator-last'
 * - custom: 'madeit-separator-<naam>' (wordt automatisch toegevoegd)
 */

function madeit_is_custom_separator_slug($slug)
{
    return is_string($slug) && strpos($slug, 'madeit-separator-') === 0;
}

function madeit_is_separator_slug($slug)
{
    $slug = (string) $slug;
    return ($slug !== '' && strpos($slug, 'separator') === 0) || madeit_is_custom_separator_slug($slug);
}

function madeit_get_default_admin_menu_order()
{
    /**
     * Pas hier de volgorde aan.
     *
     * Gebruik menu-slugs zoals:
     * - 'index.php', 'edit.php', 'upload.php'
     * - 'edit.php?post_type=page'
     * - 'admin.php?page=madeit_blocks'
     * - 'woocommerce'
     *
     * Separators:
     * - core: 'separator1', 'separator2', 'separator-last'
     * - custom: 'madeit-separator-<naam>' (wordt automatisch toegevoegd)
     */
    $order = [
        // Intentionally very different order to make changes obvious.
        'madeit-separator-dashboard', // Custom separator with title "Dashboard"
        'index.php', // Dashboard
        'upload.php', // Media
        
        // Content
        'edit.php?post_type=page', // Pages
        'edit.php', // Posts
        'edit-comments.php', // Comments
        
        // Made it blocks
        'madeit-separator-functies', // Custom separator with title "Made I.T. Blocks"
        'admin.php?page=madeit-blocks', // Made I.T. Blocks
        'edit.php?post_type=ma_forms', // Made I.T. Forms
        'edit.php?post_type=popup', // Made I.T. Popups
        'edit.php?post_type=acf-field-group', // ACF Field Groups

        // Woocomerce & shop manager
        'woocommerce', // WooCommerce
        'madeit_shoppingmanager', // Made I.T. Shopping Manager


        // Users & settings
        'madeit-separator-overige', // Custom separator with title "Other"
        'themes.php', // Appearance
        'plugins.php', // Plugins
        'users.php', // Users
        'options-general.php', // Settings
        'tools.php', // Tools
        'admin.php?page=perfopsone-dashboard', // PerfOps One
    ];

    // Add WooCommerce separator only if WooCommerce is active
    if (class_exists('WooCommerce')) {
        array_splice($order, 12, 0, ['madeit-separator-shop']);
    }

    return $order;
}

function madeit_get_admin_menu_order()
{
    $order = madeit_get_default_admin_menu_order();
    return apply_filters('madeit_admin_menu_order', $order);
}

function madeit_add_custom_separators_to_menu($order)
{
    global $menu;

    if (!is_array($menu) || !is_array($order)) {
        return;
    }

    $existing_slugs = [];
    foreach ($menu as $item) {
        if (isset($item[2])) {
            $existing_slugs[(string) $item[2]] = true;
        }
    }

    foreach ($order as $slug) {
        $slug = (string) $slug;

        // Allow both WP core separators (separator1/2/last) and custom separators.
        if (!madeit_is_separator_slug($slug)) {
            continue;
        }
        if (isset($existing_slugs[$slug])) {
            continue;
        }
        // add the name of the separator as title attribute for better accessibility
        $title = str_replace('madeit-separator-', '', $slug);
        $title = str_replace('-', ' ', $title);
        $title = ucwords($title);

        // Note: WP core only outputs class/id/aria-hidden for separator <li> elements.
        // Extra array fields won't become HTML attributes. We set a stable id (via item[5])
        // and later add `data-title` with JS in admin_head.
        $menu[] = [
            '',
            'read',
            $slug,
            '',
            'wp-menu-separator madeit-menu-separator',
            $slug,
            'none',
        ];
        $existing_slugs[$slug] = true;
    }
}

function madeit_apply_admin_menu_order()
{
    if (!is_admin()) {
        return;
    }

    global $menu;

    if (!is_array($menu)) {
        return;
    }

    $order = madeit_get_admin_menu_order();

    if (!is_array($order) || empty($order)) {
        $order = madeit_get_default_admin_menu_order();
    }

    madeit_add_custom_separators_to_menu($order);

    // Build slug => menu item map (first occurrence wins).
    $map = [];
    foreach ($menu as $item) {
        if (!isset($item[2])) {
            continue;
        }
        $slug = (string) $item[2];
        if (!isset($map[$slug])) {
            $map[$slug] = $item;
        }
    }

    $new_menu = [];
    $used = [];

    foreach ($order as $slug) {
        $slug = (string) $slug;
        if (isset($used[$slug])) {
            continue;
        }
        if (isset($map[$slug])) {
            $new_menu[] = $map[$slug];
            $used[$slug] = true;
        }
    }

    // Append remaining items in existing order.
    foreach ($menu as $item) {
        if (!isset($item[2])) {
            $new_menu[] = $item;
            continue;
        }
        $slug = (string) $item[2];
        if (!isset($used[$slug])) {
            $new_menu[] = $item;
            $used[$slug] = true;
        }
    }

    $menu = $new_menu;
}
add_action('admin_menu', 'madeit_apply_admin_menu_order', 9999);


// Add custom styling for separators
function madeit_add_admin_menu_separator_styles()
{
    if (!is_admin()) {
        return;
    }

    // Build a map of DOM id => label for custom separators.
    // The DOM id for menu items is derived from $item[5] and sanitized by WP core.
    $order = madeit_get_admin_menu_order();
    $separator_titles = [];
    if (is_array($order)) {
        foreach ($order as $slug) {
            $slug = (string) $slug;
            if (!madeit_is_custom_separator_slug($slug)) {
                continue;
            }

            $title = str_replace('madeit-separator-', '', $slug);
            $title = str_replace('-', ' ', $title);
            $title = ucwords($title);

            // Mirror WP core's sanitization for the id attribute.
            $id = preg_replace('|[^a-zA-Z0-9_:.]|', '-', $slug);
            $separator_titles[$id] = $title;
        }
    }
    ?>
    <style>
        #adminmenu li.wp-menu-separator {
            margin: 8px 0;
            background: linear-gradient(to right, transparent, #cccccc75, transparent);
            height: 1px;
            position: relative;
        }
        #adminmenu li.wp-menu-separator::before {
            content: attr(data-title);
            display: block;
            font-size: 12px;
            color: #666;
            font-weight: 600;
            position: relative;
            top: -8px;
            background: #1D2226;
            margin: 0 auto;
            padding: 0 8px;
            width: fit-content;
        }
    </style>
    <script>
        (function () {
            var titles = <?php echo wp_json_encode($separator_titles); ?>;
            if (!titles || typeof titles !== 'object') {
                return;
            }

            function applyTitles() {
                for (var id in titles) {
                    if (!Object.prototype.hasOwnProperty.call(titles, id)) {
                        continue;
                    }

                    var el = document.getElementById(id);
                    if (!el) {
                        continue;
                    }
                    el.setAttribute('data-title', titles[id]);
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', applyTitles);
            } else {
                applyTitles();
            }
        })();
    </script>
    <?php
}
add_action('admin_head', 'madeit_add_admin_menu_separator_styles');
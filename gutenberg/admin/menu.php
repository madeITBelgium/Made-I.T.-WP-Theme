<?php

add_action('admin_menu', function () {
    add_menu_page(
        'Made I.T. Blocks',
        'Made I.T. Blocks',
        'manage_options',
        'madeit-blocks',
        'madeit_blocks_overview_page',
        'dashicons-screenoptions',
        90
    );

    add_submenu_page(
        'madeit-blocks',
        'Blokken',
        'Blokken',
        'manage_options',
        'madeit-blocks',
        'madeit_blocks_overview_page'
    );

    add_submenu_page(
        'madeit-blocks',
        'Updates',
        'Updates',
        'manage_options',
        'madeit-blocks-updates',
        'madeit_blocks_updates_page'
    );

    add_submenu_page(
        'madeit-blocks',
        'Support',
        'Support',
        'manage_options',
        'madeit-blocks-support',
        'madeit_blocks_support_page'
    );
});

if (!function_exists('my_submenu_icon_css')) {
    add_action('admin_head', 'my_submenu_icon_css');
    function my_submenu_icon_css()
    {
        echo '<style>
            #toplevel_page_madeit-blocks a[href="admin.php?page=madeit-blocks-support"]::before {
                content: "\f111";
                font-family: dashicons;
                margin-right: 5px;
                vertical-align: bottom;
            }
            #adminmenu li.wp-menu-separator {
                padding: 0;
                margin: 16px 0 10px;
                background: #3c4146;
                height: 1px;
                cursor: inherit;
                position: relative;
            }
            #adminmenu li.wp-menu-separator.woocommerce::before {
                content: "Woocommerce";
                display: block;
                color: #999;
                font-size: 11px;
                text-transform: uppercase;
                top: -8px;
                position: absolute;
                width: max-content;
                margin: auto;
                left: 0;
                right: 0;
                padding-left: 10px;
                padding-right: 10px;
                background: #1d2327;
            }
        </style>';
    }
}

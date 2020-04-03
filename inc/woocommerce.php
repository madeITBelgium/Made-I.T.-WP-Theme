    <?php

    if (!function_exists('madeit_loop_columns')) {
        function madeit_loop_columns()
        {
            return 3; // 3 products per row
        }
        add_filter('loop_shop_columns', 'madeit_loop_columns', 999);
    }

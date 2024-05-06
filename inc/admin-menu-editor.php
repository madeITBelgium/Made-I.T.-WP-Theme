<?php
function madeit_adminmenu()
{
    global $user_ID;
    $hideMenus = get_user_meta($user_ID, 'madeit_hide_admin_menu', true);
    if (!metadata_exists('user', $user_ID, 'madeit_hide_admin_menu')) {
        update_user_meta($user_ID, 'madeit_hide_admin_menu', true);
        $hideMenus = true;
    } ?>
    <li style="padding: 5px; color: #a7aaad; margin-top: 20px;" class="wp-menu-name">
        <div class="components-base-control components-toggle-control">
            <div class="components-base-control__field">
                <span class="components-form-toggle <?php echo $hideMenus ? 'is-checked' : ''; ?>" id="toggle-hide-admin-menu-parent">
                    <input class="components-form-toggle__input" id="toggle-hide-admin-menu" type="checkbox" <?php echo $hideMenus ? 'checked' : ''; ?> aria-describedby="inspector-toggle-control-0__help">
                    <span class="components-form-toggle__track"></span>
                    <span class="components-form-toggle__thumb"></span>
                </span>
                <label for="inspector-toggle-control-0" class="components-toggle-control__label"><?php _e('Verberg items'); ?></label>
            </div>
        </div>
    </li>
    <?php
}
add_action('adminmenu', 'madeit_adminmenu');

function madeit_adminmenu_footer()
{
    ?>
    <script>
        const checkbox = document.getElementById('toggle-hide-admin-menu');
        const checkboxParent = document.getElementById('toggle-hide-admin-menu-parent');
        checkbox.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                checkboxParent.className = checkboxParent.className + ' ' + 'is-checked';
            } else {
                checkboxParent.className = checkboxParent.className.replace(new RegExp('(?:^|\\s)'+ 'is-checked' + '(?:\\s|$)'), ' ');
            }
            var data = {
                'action': 'save_adminmenu',
                'hide': event.currentTarget.checked
            };
            jQuery.post(ajaxurl, data, function(response) {
                location.reload();
            });
        });
    </script>
    <style>
        .wp-menu-name .components-form-toggle {
            position: relative;
            display: inline-block;
        }
        .wp-menu-name .components-form-toggle .components-form-toggle__track {
            content: "";
            display: inline-block;
            box-sizing: border-box;
            vertical-align: top;
            background-color: white;
            border: 1px solid #1e1e1e;
            width: 36px;
            height: 18px;
            border-radius: 9px;
            transition: 0.2s background ease;
        }
        .wp-menu-name .components-form-toggle .components-form-toggle__thumb {
            display: block;
            position: absolute;
            box-sizing: border-box;
            top: 3px;
            left: 3px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            transition: 0.1s transform ease;
            background-color: #1e1e1e;
            border: 5px solid #1e1e1e;
        }
        .wp-menu-name .components-form-toggle.is-checked .components-form-toggle__track {
            background-color: #007cba;
            border: 1px solid #007cba;
            border: 9px solid transparent;
        }
        .wp-menu-name .components-form-toggle .components-form-toggle__input:focus + .components-form-toggle__track {
            box-shadow: 0 0 0 2px white, 0 0 0 6px #007cba;
            outline: 2px solid transparent;
            outline-offset: 2px;
        }
        .wp-menu-name .components-form-toggle.is-checked .components-form-toggle__thumb {
            background-color: white;
            border-width: 0;
            transform: translateX(18px);
        }
        .wp-menu-name .components-form-toggle.is-disabled, .wp-menu-name .components-disabled .components-form-toggle {
            opacity: 0.3;
        }
        .wp-menu-name .components-form-toggle input.components-form-toggle__input[type=checkbox] {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            margin: 0;
            padding: 0;
            z-index: z-index(".components-form-toggle__input");
            border: none;
        }
        .wp-menu-name .components-form-toggle input.components-form-toggle__input[type=checkbox]:checked {
            background: none;
        }
        .wp-menu-name .components-form-toggle input.components-form-toggle__input[type=checkbox]::before {
            content: "";
        }
    </style>
<?php
}
add_action('admin_footer', 'madeit_adminmenu_footer');

function madeit_adminmenu_footer_save()
{
    global $user_ID;
    update_user_meta($user_ID, 'madeit_hide_admin_menu', $_POST['hide'] === 'true' || $_POST['hide'] === true);
    echo json_encode($_POST);
    wp_die();
}
add_action('wp_ajax_save_adminmenu', 'madeit_adminmenu_footer_save');

function madeit_remove_menu_pages()
{
    global $user_ID, $submenu, $menu;

    $hideMenus = get_user_meta($user_ID, 'madeit_hide_admin_menu', true);
    if (!metadata_exists('user', $user_ID, 'madeit_hide_admin_menu')) {
        update_user_meta($user_ID, 'madeit_hide_admin_menu', true);
        $hideMenus = true;
    }

    $items = ['index.php', 'edit.php', 'upload.php', 'edit.php?post_type=page', 'edit-comments.php', 'madeit_forms', 'users.php', 'woocommerce', 'madeit_shoppingmanager'];
    if (defined('MADEIT_HIDE_MENU_ITEMS')) {
        $items = array_merge($items, MADEIT_HIDE_MENU_ITEMS);
    }

    if ($hideMenus && is_array($menu)) {
        foreach ($menu as $m) {
            if (!in_array($m[2], $items) && strpos($m[2], 'edit.php') === false) {
                remove_menu_page($m[2]);
            }
        }
    }
}
add_action('admin_init', 'madeit_remove_menu_pages', 99, 0);

function madeit_admin_theme_style()
{
    global $user_ID;

    if ($user_ID !== 1) {
        echo '<style>.update-nag, .updated, .error, .is-dismissible { display: none; }</style>';
    }
}
add_action('admin_enqueue_scripts', 'madeit_admin_theme_style');
add_action('login_enqueue_scripts', 'madeit_admin_theme_style');

<?php
/**
 * MadeIt Setup Wizard
 *
 * @package MadeIt
 */

opcache_reset();



require_once __DIR__ . '/class-setup-steps.php';

class MadeIt_Setup_Wizard {

    private $steps = [];
    private $current_step = '';

    public function __construct() {

        $this->steps = MadeIt_Setup_Steps::get_steps();

        $this->current_step = isset($_GET['step'])
            ? sanitize_key($_GET['step'])
            : 'welcome';

        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function enqueue_assets($hook) {

        $is_setup_wizard_page = (
            $hook === 'appearance_page_madeit-setup-wizard'
            || $hook === 'admin_page_madeit-setup-wizard'
            || (isset($_GET['page']) && sanitize_key($_GET['page']) === 'madeit-setup-wizard')
        );

        if ( ! $is_setup_wizard_page ) {
            return;
        }

        $css_rel_path = '/inc/admin/setup-wizard/assets/css/setup-wizard.css';
        $css_file_path = get_parent_theme_file_path($css_rel_path);
        $css_ver = file_exists($css_file_path) ? (string) filemtime($css_file_path) : '1.0';

        $css_step_rel_path = '/inc/admin/setup-wizard/assets/css/madeit-setup-wizard-step.css';
        $css_step_file_path = get_parent_theme_file_path($css_step_rel_path);
        $css_step_ver = file_exists($css_step_file_path) ? (string) filemtime($css_step_file_path) : '1.0';

        $js_rel_path = '/inc/admin/setup-wizard/assets/js/setup-wizard.js';
        $js_file_path = get_parent_theme_file_path($js_rel_path);
        $js_ver = file_exists($js_file_path) ? (string) filemtime($js_file_path) : '1.0';

        wp_enqueue_script(
            'madeit-setup-wizard',
            get_template_directory_uri() . $js_rel_path,
            ['jquery'],
            $js_ver,
            true
        );
        wp_localize_script('madeit-setup-wizard', 'madeitSetupWizard', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('madeit_setup_wizard_save_step'),
            'finalizeNonce' => wp_create_nonce('madeit_setup_wizard_finalize'),
            'generatePagesNonce' => wp_create_nonce('madeit_setup_wizard_generate_pages'),
            'currentStep' => $this->current_step,
        ]);
        wp_enqueue_style(
            'madeit-setup-wizard',
            get_template_directory_uri() . $css_rel_path,
            [],
            $css_ver
        );
        wp_enqueue_style(
            'madeit-setup-wizard-step',
            get_template_directory_uri() . $css_step_rel_path,
            [],
            $css_step_ver
        );
    }

    public function render() {
    ?>
        <div class="madeit-setup-wrapper">

            <ul id="progressbar">
                <?php foreach ($this->steps as $step => $label) {
                    $active = ($step === $this->current_step) ? 'active' : '';
                    echo "<li class='$active'><strong>$label</strong></li>";
                } ?>
            </ul>
            
            <div class="madeit-setup-container">
            

                <div class="madeit-setup-content">
                    <?php $this->render_step(); ?>
                </div>

            </div>

        </div>
        <?php
    }
    

    private function render_progress() {

        echo '<ul class="madeit-steps">';

        foreach ($this->steps as $step => $label) {

            $active = ($step === $this->current_step) ? 'active' : '';

            echo "<li class='$active'>$label</li>";
        }

        echo '</ul>';
    }

    private function render_step() {

        $file = get_template_directory()
            . '/inc/admin/setup-wizard/steps/step-'
            . $this->current_step
            . '.php';

        if ( file_exists($file) ) {
            include $file;
        } else {
            echo '<p>Stap niet gevonden.</p>';
        }
    }
}

function madeit_is_setup_wizard_page_request(): bool {
    return isset($_GET['page']) && sanitize_key($_GET['page']) === 'madeit-setup-wizard';
}

function madeit_setup_requires_child_theme(): bool {
    $theme = wp_get_theme();
    $template = sanitize_key((string) $theme->get_template());

    if ($template !== 'madeit') {
        return false;
    }

    return !is_child_theme();
}

function madeit_should_skip_setup_redirect(): bool {
    if (!is_admin()) {
        return true;
    }

    if (!current_user_can('manage_options')) {
        return true;
    }

    if (wp_doing_ajax() || wp_doing_cron()) {
        return true;
    }

    if (defined('REST_REQUEST') && REST_REQUEST) {
        return true;
    }

    if (defined('WP_CLI') && WP_CLI) {
        return true;
    }

    if (isset($_GET['skip_setup']) && sanitize_text_field(wp_unslash($_GET['skip_setup'])) === '1') {
        return true;
    }

    if (madeit_is_setup_wizard_page_request()) {
        return true;
    }

    return false;
}

function madeit_setup_wizard_admin_body_class($classes) {
    if (madeit_is_setup_wizard_page_request()) {
        $classes .= ' madeit-setup-wizard-fullscreen';
    }

    return $classes;
}
add_filter('admin_body_class', 'madeit_setup_wizard_admin_body_class');

/**
 * Ensure the wizard is instantiated early enough so its enqueue hook runs.
 */
function madeit_get_setup_wizard_instance() {
    static $instance = null;
    if (null === $instance) {
        $instance = new MadeIt_Setup_Wizard();
    }
    return $instance;
}

add_action( 'admin_init', 'madeit_setup_wizard_bootstrap' );
function madeit_setup_wizard_bootstrap() {
    if ( ! is_admin() ) {
        return;
    }

    if (!madeit_is_setup_wizard_page_request()) {
        return;
    }

    madeit_get_setup_wizard_instance();
}

add_action( 'after_switch_theme', 'madeit_redirect_after_activation' );
function madeit_redirect_after_activation() {
    $theme = wp_get_theme();
    $template = sanitize_key((string) $theme->get_template());

    // Only start the wizard after activating the parent MadeIt theme.
    if ($template === 'madeit' && !is_child_theme()) {
        add_option('madeit_do_setup_redirect', true);
        return;
    }

    delete_option('madeit_do_setup_redirect');
}

add_action( 'admin_init', 'madeit_setup_redirect' );
function madeit_setup_redirect() {
    if (madeit_should_skip_setup_redirect()) {
        return;
    }

    $theme = wp_get_theme();
    $template = sanitize_key((string) $theme->get_template());

    // Never redirect to setup when a MadeIt child theme is already active.
    if ($template === 'madeit' && is_child_theme()) {
        delete_option('madeit_do_setup_redirect');
        return;
    }

    $should_redirect_after_activation = (bool) get_option('madeit_do_setup_redirect', false);
    $should_redirect_for_child_theme = madeit_setup_requires_child_theme();

    if ($should_redirect_after_activation || $should_redirect_for_child_theme) {
        delete_option('madeit_do_setup_redirect');
        wp_safe_redirect(admin_url('themes.php?page=madeit-setup-wizard'));
        exit;
    }
}




add_action( 'admin_menu', 'madeit_setup_wizard_menu' );
function madeit_setup_wizard_menu() {
    add_theme_page(
        'Setup Wizard',
        'Setup Wizard',
        'manage_options',
        'madeit-setup-wizard',
        'madeit_setup_wizard_page'
    );
}



function madeit_setup_wizard_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    $wizard = madeit_get_setup_wizard_instance();
    $wizard->render();
}

function madeit_setup_wizard_sanitize_posted_data($value) {
    if (is_array($value)) {
        $sanitized = [];
        foreach ($value as $key => $item) {
            $sanitized_key = is_string($key) ? sanitize_key($key) : $key;
            $sanitized[$sanitized_key] = madeit_setup_wizard_sanitize_posted_data($item);
        }

        return $sanitized;
    }

    if (!is_scalar($value)) {
        return '';
    }

    return sanitize_text_field(wp_unslash((string) $value));
}

function madeit_setup_wizard_ajax_save_step(): void {
    check_ajax_referer('madeit_setup_wizard_save_step', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => 'Unauthorized'], 403);
    }

    $step = isset($_POST['step']) ? sanitize_key(wp_unslash($_POST['step'])) : '';
    $raw_data = isset($_POST['data']) ? $_POST['data'] : [];

    if ($step === '') {
        wp_send_json_error(['message' => 'Missing step'], 400);
    }

    if (!is_array($raw_data)) {
        wp_send_json_error(['message' => 'Invalid payload'], 400);
    }

    $sanitized_data = madeit_setup_wizard_sanitize_posted_data($raw_data);

    $all_steps_data = get_option('madeit_setup_wizard_data', []);
    if (!is_array($all_steps_data)) {
        $all_steps_data = [];
    }

    $all_steps_data[$step] = $sanitized_data;
    update_option('madeit_setup_wizard_data', $all_steps_data);

    wp_send_json_success([
        'step' => $step,
        'savedKeys' => array_keys($sanitized_data),
    ]);
}
add_action('wp_ajax_madeit_setup_wizard_save_step', 'madeit_setup_wizard_ajax_save_step');

function madeit_setup_wizard_get_plugins_step_data(): array {
    $default_data = [
        'plugins' => [
            [
                'slug' => 'madeit-forms',
                'name' => 'Made I.T. Forms',
            ],
            [
                'slug' => 'advanced-custom-fields',
                'name' => 'Advanced Custom Fields',
            ],
            [
                'slug' => 'wordfence',
                'name' => 'Wordfence Security',
            ],
        ],
        'features' => [
            [
                'slug' => 'webshop',
                'name' => 'Webshop',
                'plugins' => [
                    [
                        'slug' => 'woocommerce',
                        'name' => 'WooCommerce',
                    ],
                    [
                        'slug' => 'mollie-payments-for-woocommerce',
                        'name' => 'Mollie Payments for WooCommerce',
                    ],
                ],
            ],
        ],
    ];

    $step_data = apply_filters('madeit_setup_wizard_plugins_step_data', $default_data);
    if (!is_array($step_data)) {
        return $default_data;
    }

    $step_data['plugins'] = isset($step_data['plugins']) && is_array($step_data['plugins'])
        ? apply_filters('madeit_setup_wizard_plugin_suggestions', $step_data['plugins'], $step_data)
        : [];
    $step_data['features'] = isset($step_data['features']) && is_array($step_data['features'])
        ? apply_filters('madeit_setup_wizard_feature_suggestions', $step_data['features'], $step_data)
        : [];

    return $step_data;
}

function madeit_setup_wizard_find_plugin_file_by_slug(string $slug): string {
    if ($slug === '') {
        return '';
    }

    if (!function_exists('get_plugins')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }

    $installed_plugins = get_plugins();
    foreach ($installed_plugins as $plugin_file => $plugin_data) {
        $dir_name = dirname($plugin_file);
        $base_name = basename($plugin_file, '.php');

        if ($dir_name === $slug || $base_name === $slug) {
            return $plugin_file;
        }
    }

    return '';
}

function madeit_setup_wizard_install_and_activate_plugin(string $slug): array {
    $slug = sanitize_key($slug);
    if ($slug === '') {
        return [
            'slug' => $slug,
            'status' => 'skipped',
            'message' => 'Invalid slug',
        ];
    }

    if (!current_user_can('install_plugins') || !current_user_can('activate_plugins')) {
        return [
            'slug' => $slug,
            'status' => 'error',
            'message' => 'Missing capability',
        ];
    }

    if (!function_exists('activate_plugin')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    if (!class_exists('Plugin_Upgrader')) {
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
    }

    $plugin_file = madeit_setup_wizard_find_plugin_file_by_slug($slug);
    if ($plugin_file === '') {
        $upgrader = new Plugin_Upgrader(new Automatic_Upgrader_Skin());
        $result = $upgrader->install('https://downloads.wordpress.org/plugin/' . $slug . '.latest-stable.zip');

        if (is_wp_error($result)) {
            return [
                'slug' => $slug,
                'status' => 'error',
                'message' => $result->get_error_message(),
            ];
        }

        if ($result === false) {
            return [
                'slug' => $slug,
                'status' => 'error',
                'message' => 'Install failed',
            ];
        }

        $plugin_file = $upgrader->plugin_info();
        if (!is_string($plugin_file) || $plugin_file === '') {
            $plugin_file = madeit_setup_wizard_find_plugin_file_by_slug($slug);
        }
    }

    if (!is_string($plugin_file) || $plugin_file === '') {
        return [
            'slug' => $slug,
            'status' => 'error',
            'message' => 'Installed, but plugin file not found',
        ];
    }

    if (!is_plugin_active($plugin_file)) {
        $activated = activate_plugin($plugin_file);
        if (is_wp_error($activated)) {
            return [
                'slug' => $slug,
                'status' => 'error',
                'message' => $activated->get_error_message(),
            ];
        }
    }

    return [
        'slug' => $slug,
        'status' => 'ok',
        'pluginFile' => $plugin_file,
    ];
}

function madeit_setup_wizard_get_selected_plugin_slugs(array $all_steps_data): array {
    $selected_slugs = [];
    $plugin_state = isset($all_steps_data['plugins']) && is_array($all_steps_data['plugins'])
        ? $all_steps_data['plugins']
        : [];

    foreach ($plugin_state as $key => $value) {
        if (!is_string($key) || (string) $value !== '1') {
            continue;
        }

        if (strpos($key, 'plugin_selection__') === 0) {
            $slug = sanitize_key(substr($key, strlen('plugin_selection__')));
            if ($slug !== '') {
                $selected_slugs[] = $slug;
            }
        }
    }

    $feature_slugs = [];
    foreach ($plugin_state as $key => $value) {
        if (!is_string($key) || (string) $value !== '1') {
            continue;
        }

        if (strpos($key, 'feature_selection__') === 0) {
            $feature_slug = sanitize_key(substr($key, strlen('feature_selection__')));
            if ($feature_slug !== '') {
                $feature_slugs[] = $feature_slug;
            }
        }
    }

    if (!empty($feature_slugs)) {
        $plugins_step_data = madeit_setup_wizard_get_plugins_step_data();
        $features = isset($plugins_step_data['features']) && is_array($plugins_step_data['features'])
            ? $plugins_step_data['features']
            : [];

        foreach ($features as $feature) {
            if (!is_array($feature) || empty($feature['slug'])) {
                continue;
            }

            $feature_slug = sanitize_key((string) $feature['slug']);
            if (!in_array($feature_slug, $feature_slugs, true)) {
                continue;
            }

            $feature_plugins = isset($feature['plugins']) && is_array($feature['plugins'])
                ? $feature['plugins']
                : [];

            foreach ($feature_plugins as $feature_plugin) {
                if (!is_array($feature_plugin) || empty($feature_plugin['slug'])) {
                    continue;
                }

                $slug = sanitize_key((string) $feature_plugin['slug']);
                if ($slug !== '') {
                    $selected_slugs[] = $slug;
                }
            }
        }
    }

    $selected_slugs = array_values(array_unique(array_filter($selected_slugs)));

    return $selected_slugs;
}

function madeit_setup_wizard_find_page_id_by_slug_candidates(array $slug_candidates): int {
    foreach ($slug_candidates as $candidate) {
        $slug = sanitize_title((string) $candidate);
        if ($slug === '') {
            continue;
        }

        $page = get_page_by_path($slug, OBJECT, 'page');
        if ($page instanceof WP_Post) {
            return (int) $page->ID;
        }
    }

    return 0;
}

function madeit_setup_wizard_create_page_if_missing(string $title, string $slug): int {
    $slug = sanitize_title($slug);
    if ($slug !== '') {
        $existing = get_page_by_path($slug, OBJECT, 'page');
        if ($existing instanceof WP_Post) {
            return (int) $existing->ID;
        }
    }

    $post_id = wp_insert_post([
        'post_title' => sanitize_text_field($title),
        'post_name' => $slug,
        'post_content' => '',
        'post_status' => 'publish',
        'post_type' => 'page',
    ], true);

    if (is_wp_error($post_id)) {
        return 0;
    }

    return (int) $post_id;
}

function madeit_setup_wizard_get_preferred_menu_location(): string {
    $locations = get_registered_nav_menus();
    if (!is_array($locations) || empty($locations)) {
        return '';
    }

    foreach (['top', 'primary', 'main'] as $preferred_location) {
        if (isset($locations[$preferred_location])) {
            return $preferred_location;
        }
    }

    return (string) array_key_first($locations);
}

function madeit_setup_wizard_ensure_menu_for_location(string $location, string $menu_name = 'Hoofdmenu'): int {
    if ($location === '') {
        return 0;
    }

    $nav_locations = get_theme_mod('nav_menu_locations', []);
    if (!is_array($nav_locations)) {
        $nav_locations = [];
    }

    $menu_id = isset($nav_locations[$location]) ? (int) $nav_locations[$location] : 0;
    if ($menu_id > 0) {
        $menu_obj = wp_get_nav_menu_object($menu_id);
        if ($menu_obj) {
            return $menu_id;
        }
    }

    $menu_obj = wp_get_nav_menu_object($menu_name);
    if ($menu_obj && !is_wp_error($menu_obj)) {
        $menu_id = (int) $menu_obj->term_id;
    } else {
        $created_menu_id = wp_create_nav_menu($menu_name);
        if (is_wp_error($created_menu_id)) {
            return 0;
        }
        $menu_id = (int) $created_menu_id;
    }

    $nav_locations[$location] = $menu_id;
    set_theme_mod('nav_menu_locations', $nav_locations);

    return $menu_id;
}

function madeit_setup_wizard_add_pages_to_menu(int $menu_id, array $page_ids): void {
    if ($menu_id <= 0 || empty($page_ids)) {
        return;
    }

    $existing_object_ids = [];
    $existing_items = wp_get_nav_menu_items($menu_id);
    if (is_array($existing_items)) {
        foreach ($existing_items as $item) {
            if (!empty($item->object_id)) {
                $existing_object_ids[] = (int) $item->object_id;
            }
        }
    }

    $existing_object_ids = array_values(array_unique($existing_object_ids));

    foreach ($page_ids as $page_id) {
        $page_id = (int) $page_id;
        if ($page_id <= 0 || in_array($page_id, $existing_object_ids, true)) {
            continue;
        }

        wp_update_nav_menu_item($menu_id, 0, [
            'menu-item-object-id' => $page_id,
            'menu-item-object' => 'page',
            'menu-item-type' => 'post_type',
            'menu-item-status' => 'publish',
        ]);

        $existing_object_ids[] = $page_id;
    }
}

function madeit_setup_wizard_ajax_finalize(): void {
    check_ajax_referer('madeit_setup_wizard_finalize', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => 'Unauthorized'], 403);
    }

    $all_steps_data = get_option('madeit_setup_wizard_data', []);
    if (!is_array($all_steps_data)) {
        $all_steps_data = [];
    }

    /* Stap 1: Activeer de child theme (indien gekozen) */
    $child_theme = isset($all_steps_data['child-theme']['selected_child_theme']) ? sanitize_key((string) $all_steps_data['child-theme']['selected_child_theme']) : '';
    if ($child_theme !== '') {
        switch_theme($child_theme);
    }

    /* Stap 2: Zet de kleur informatie in het child theme (indien gekozen) */
    if ($child_theme !== '') {
        $path = get_theme_root() . '/' . $child_theme . '/';
        $settingsFile = $path .'/settings.php';

        /* Build settings file */
        $settingsContent = "<?php\n";
        $settingsContent .= "// This file is generated by the MadeIt Setup Wizard. Do not edit this file directly.\n\n";
        $settingsContent .= "define('MADEIT_CUSTOM_COLOR', true);\n";
        $settingsContent .= "define('MADEIT_TEXT_COLOR', '" . (isset($all_steps_data['branding']['text_color']) ? sanitize_hex_color((string) $all_steps_data['branding']['text_color']) : '#000000') . "');\n";
        $settingsContent .= "define('MADEIT_BACKGROUND_COLOR', '" . (isset($all_steps_data['branding']['background_color']) ? sanitize_hex_color((string) $all_steps_data['branding']['background_color']) : '#f5f7f9') . "');\n";
        $settingsContent .= "define('MADEIT_PRIMARY_COLOR', '" . (isset($all_steps_data['branding']['primary_color']) ? sanitize_hex_color((string) $all_steps_data['branding']['primary_color']) : '#6d904d') . "');\n";
        $settingsContent .= "define('MADEIT_SECONDARY_COLOR', '" . (isset($all_steps_data['branding']['secondary_color']) ? sanitize_hex_color((string) $all_steps_data['branding']['secondary_color']) : '#cc9a1b') . "');\n";
        $settingsContent .= "define('MADEIT_SUCCESS_COLOR', '" . (isset($all_steps_data['branding']['success_color']) ? sanitize_hex_color((string) $all_steps_data['branding']['success_color']) : '#F3B94D') . "');\n";
        $settingsContent .= "define('MADEIT_INFO_COLOR', '" . (isset($all_steps_data['branding']['info_color']) ? sanitize_hex_color((string) $all_steps_data['branding']['info_color']) : '#d9edf7') . "');\n";
        $settingsContent .= "define('MADEIT_WARNING_COLOR', '" . (isset($all_steps_data['branding']['warning_color']) ? sanitize_hex_color((string) $all_steps_data['branding']['warning_color']) : '#f2bb77') . "');\n";
        $settingsContent .= "define('MADEIT_DANGER_COLOR', '" . (isset($all_steps_data['branding']['danger_color']) ? sanitize_hex_color((string) $all_steps_data['branding']['danger_color']) : '#de4949') . "');\n";

        file_put_contents($settingsFile, $settingsContent);
    }

    /* Stap 3: Plaats alle pagina's die nu op de website staan, naar de prullemand. We gaan er van uit dat de gebruiker deze pagina's niet meer nodig heeft, en dat het beter is om ze te verwijderen dan om ze te laten staan en voor verwarring te zorgen. */
    $default_pages = get_pages([
        'post_status' => ['publish', 'draft', 'pending', 'private'],
    ]);
    foreach ($default_pages as $page) {
        wp_trash_post($page->ID);
    }

    /* Stap 4: Maak nu de pagina's die de gebruiker heeft gekozen aan. */
    $pages_to_create = isset($all_steps_data['pages']['enabled_pages']) && is_array($all_steps_data['pages']['enabled_pages'])
        ? $all_steps_data['pages']['enabled_pages']
        : [];

    $created_page_ids = [];
    foreach ($pages_to_create as $page) {
        $slug = isset($page['slug']) ? sanitize_title((string) $page['slug']) : '';
        $title = isset($page['title']) ? sanitize_text_field((string) $page['title']) : '';

        if ($title === '' && $slug !== '') {
            $title = ucwords(str_replace(['-', '_'], ' ', $slug));
        }
        if ($title === '') {
            $title = 'Untitled';
        }

        $content = isset($page['description']) ? sanitize_textarea_field((string) $page['description']) : '';

        $postarr = [
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'publish',
            'post_type' => 'page',
        ];
        if ($slug !== '') {
            $postarr['post_name'] = $slug;
        }

        $new_page_id = wp_insert_post($postarr, true);
        if (!is_wp_error($new_page_id) && (int) $new_page_id > 0) {
            $created_page_ids[] = (int) $new_page_id;
        }
    }

    /* Stap 5, stel de homepagina en blog/nieuws pagina expliciet in. */
    $home_page_id = madeit_setup_wizard_find_page_id_by_slug_candidates(['home', 'start', 'homepage']);
    if ($home_page_id === 0) {
        $home_page_id = madeit_setup_wizard_create_page_if_missing('Home', 'home');
    }

    $blog_page_id = madeit_setup_wizard_find_page_id_by_slug_candidates(['blog', 'nieuws', 'news']);
    if ($blog_page_id === 0) {
        $blog_page_id = madeit_setup_wizard_create_page_if_missing('Nieuws', 'nieuws');
    }

    if ($blog_page_id === $home_page_id) {
        $blog_page_id = madeit_setup_wizard_create_page_if_missing('Nieuws', 'nieuws');
    }

    if ($home_page_id) {
        update_option('page_on_front', $home_page_id);
        update_option('show_on_front', 'page');
    }

    if ($blog_page_id) {
        update_option('page_for_posts', $blog_page_id);
    }

    /* Stap 6, menu */
    if ($home_page_id) {
        array_unshift($created_page_ids, (int) $home_page_id);
    }
    if ($blog_page_id) {
        $created_page_ids[] = (int) $blog_page_id;
    }

    $created_page_ids = array_values(array_unique(array_filter(array_map('intval', $created_page_ids))));

    $menu_location = madeit_setup_wizard_get_preferred_menu_location();
    $menu_id = madeit_setup_wizard_ensure_menu_for_location($menu_location, 'Hoofdmenu');
    madeit_setup_wizard_add_pages_to_menu($menu_id, $created_page_ids);


    /* Stap 7: Installeer/activeer de geselecteerde plugins en feature-dependencies. */
    $selected_plugin_slugs = madeit_setup_wizard_get_selected_plugin_slugs($all_steps_data);
    $plugin_results = [];
    foreach ($selected_plugin_slugs as $plugin_slug) {
        $plugin_results[] = madeit_setup_wizard_install_and_activate_plugin($plugin_slug);
    }


    update_option('madeit_setup_wizard_finalized_at', time());

    wp_send_json_success([
        'message' => 'Setup afgerond.',
        'finalizedAt' => (int) get_option('madeit_setup_wizard_finalized_at', 0),
        'selectedPlugins' => $selected_plugin_slugs,
        'pluginResults' => $plugin_results,
    ]);
}
add_action('wp_ajax_madeit_setup_wizard_finalize', 'madeit_setup_wizard_ajax_finalize');

function madeit_setup_wizard_decode_json_from_text(string $text): array {
    $decoded = json_decode($text, true);
    if (is_array($decoded)) {
        return $decoded;
    }

    $trimmed = trim($text);
    $trimmed = preg_replace('/^```(?:json)?\s*/i', '', $trimmed);
    $trimmed = preg_replace('/\s*```$/', '', (string) $trimmed);

    $decoded = json_decode((string) $trimmed, true);
    if (is_array($decoded)) {
        return $decoded;
    }

    return [];
}

function madeit_setup_wizard_normalize_page_key(string $value): string {
    return sanitize_title($value);
}

function madeit_setup_wizard_ajax_generate_pages(): void {
    check_ajax_referer('madeit_setup_wizard_generate_pages', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => 'Unauthorized'], 403);
    }

    if (!function_exists('madeit_ai_chat_completion')) {
        wp_send_json_error(['message' => 'AI helper is not available'], 500);
    }

    $all_steps_data = get_option('madeit_setup_wizard_data', []);
    if (!is_array($all_steps_data)) {
        $all_steps_data = [];
    }

    $existing_pages_raw = isset($_POST['existing_pages']) ? wp_unslash((string) $_POST['existing_pages']) : '[]';
    $existing_pages = json_decode($existing_pages_raw, true);
    if (!is_array($existing_pages)) {
        $existing_pages = [];
    }

    $saved_enabled_pages = isset($all_steps_data['pages']['enabled_pages']) && is_array($all_steps_data['pages']['enabled_pages'])
        ? $all_steps_data['pages']['enabled_pages']
        : [];

    $existing_page_index = [];
    foreach (array_merge($saved_enabled_pages, $existing_pages) as $page) {
        if (!is_array($page)) {
            continue;
        }

        $slug = isset($page['slug']) ? madeit_setup_wizard_normalize_page_key((string) $page['slug']) : '';
        $title = isset($page['title']) ? sanitize_text_field((string) $page['title']) : '';
        $title_key = $title !== '' ? madeit_setup_wizard_normalize_page_key($title) : '';

        if ($slug !== '') {
            $existing_page_index[$slug] = true;
        }
        if ($title_key !== '') {
            $existing_page_index[$title_key] = true;
        }
    }

    $basic_settings = isset($all_steps_data['basic-settings']) && is_array($all_steps_data['basic-settings'])
        ? $all_steps_data['basic-settings']
        : [];

    $business_name = isset($basic_settings['business_name']) ? sanitize_text_field((string) $basic_settings['business_name']) : get_bloginfo('name');
    $business_description = isset($basic_settings['business_description']) ? sanitize_text_field((string) $basic_settings['business_description']) : '';
    $business_topic = isset($basic_settings['business_topic']) ? sanitize_text_field((string) $basic_settings['business_topic']) : '';
    $target_audience = isset($basic_settings['target_audience']) ? sanitize_text_field((string) $basic_settings['target_audience']) : '';

    $messages = [
        [
            'role' => 'system',
            'content' => 'Je bent een assistant die pagina-suggesties geeft voor een WordPress website. Antwoord ALTIJD met geldige JSON zonder extra tekst. JSON formaat: {"pages":[{"title":"...","description":"..."}]}. Geef 3 tot 10 pagina\'s. Beschrijving max 160 tekens.',
        ],
        [
            'role' => 'user',
            'content' => wp_json_encode([
                'business_name' => $business_name,
                'business_description' => $business_description,
                'business_topic' => $business_topic,
                'target_audience' => $target_audience,
                'locale' => get_locale(),
                'already_selected_pages' => array_values(array_map(static function ($page) {
                    return is_array($page) ? [
                        'slug' => isset($page['slug']) ? sanitize_text_field((string) $page['slug']) : '',
                        'title' => isset($page['title']) ? sanitize_text_field((string) $page['title']) : '',
                    ] : [];
                }, array_merge($saved_enabled_pages, $existing_pages))),
                'instruction' => 'Geef geen pagina\'s die al bestaan in already_selected_pages. Vermijd duplicaten zoals Contact/contact-2 of Blog/Nieuws dubbel.',
            ]),
        ],
    ];

    $ai_response = madeit_ai_chat_completion($messages, [
        'model' => 'gpt-5.2-chat',
        'temperature' => 1,
        'max_tokens' => 1000,
        'timeout' => 40,
    ]);

    if (is_wp_error($ai_response)) {
        wp_send_json_error(['message' => $ai_response->get_error_message()], 500);
    }

    $content = $ai_response['choices'][0]['message']['content'] ?? '';
    if (!is_string($content) || trim($content) === '') {
        wp_send_json_error(['message' => 'Empty AI response', 'response' => $ai_response], 500);
    }

    $decoded = madeit_setup_wizard_decode_json_from_text($content);
    $pages = isset($decoded['pages']) && is_array($decoded['pages']) ? $decoded['pages'] : [];

    $sanitized_pages = [];
    foreach ($pages as $page) {
        if (!is_array($page)) {
            continue;
        }

        $title = isset($page['title']) ? sanitize_text_field((string) $page['title']) : '';
        $description = isset($page['description']) ? sanitize_text_field((string) $page['description']) : '';
        $slug = $title !== ''
            ? madeit_setup_wizard_normalize_page_key($title)
            : (isset($page['slug']) ? madeit_setup_wizard_normalize_page_key((string) $page['slug']) : '');

        if ($title === '' || $slug === '') {
            continue;
        }

        if (isset($existing_page_index[$slug])) {
            continue;
        }

        $existing_page_index[$slug] = true;

        $sanitized_pages[] = [
            'slug' => $slug,
            'title' => $title,
            'description' => $description,
        ];
    }

    if (empty($sanitized_pages)) {
        wp_send_json_error(['message' => 'No valid pages found in AI response'], 500);
    }

    wp_send_json_success([
        'pages' => $sanitized_pages,
    ]);
}
add_action('wp_ajax_madeit_setup_wizard_generate_pages', 'madeit_setup_wizard_ajax_generate_pages');
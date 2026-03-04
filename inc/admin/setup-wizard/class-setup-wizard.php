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
    add_option( 'madeit_do_setup_redirect', true );
}

add_action( 'admin_init', 'madeit_setup_redirect' );
function madeit_setup_redirect() {
    if (madeit_should_skip_setup_redirect()) {
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
<?php
/**
 * MadeIt Setup Wizard
 *
 * @package MadeIt
 */





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

    if ( ! isset($_GET['page']) || sanitize_key($_GET['page']) !== 'madeit-setup-wizard' ) {
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
    if ( get_option( 'madeit_do_setup_redirect', false ) ) {
        delete_option( 'madeit_do_setup_redirect' );
        wp_redirect( admin_url( 'themes.php?page=madeit-setup-wizard' ) );
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
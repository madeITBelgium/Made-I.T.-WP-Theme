<?php
/**
 * MadeIt Setup Wizard - Step: Finish
 * In deze laatste stap van de setup wizard feliciteren we de gebruiker met het voltooien
 * 
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

$all_steps_data = get_option('madeit_setup_wizard_data', []);
if (!is_array($all_steps_data)) {
    $all_steps_data = [];
}

$debug_options_json = wp_json_encode($all_steps_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if (!is_string($debug_options_json)) {
    $debug_options_json = print_r($all_steps_data, true);
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-finish">

    <div id="madeit-setup-finalize-loading" class="madeit-setup-finalize-loading">
        <h1>Even geduld...</h1>
        <p class="small">We zijn je website-instellingen aan het voorbereiden.</p>
    </div>

    <div id="madeit-setup-finalize-error" class="madeit-setup-finalize-error" style="display:none;"></div>

    <!-- Tijdelijke debug-output: alle data die in eerdere stappen is opgeslagen. -->
    <div class="madeit-setup-finalize-debug" style="text-align: left; margin: 20px 0;">
        <h3 style="margin-bottom: 8px;">Debug - opgeslagen setup data</h3>
        <pre style="max-height: 240px; overflow: auto; background: #f8f9fb; border: 1px solid #e5e7eb; padding: 12px;"><?php echo esc_html($debug_options_json); ?></pre>
    </div>

    <div id="madeit-setup-finalize-content" style="display:none;">

        <video
            class="madeit-setup-success-animation"
            autoplay
            muted
            playsinline
            preload="auto"
            style="max-width: 200px; margin-bottom: 20px; margin-inline: auto; display: block;"
            aria-label="Congrats"
        >
            <source src="<?php echo esc_url( get_template_directory_uri() . '/inc/admin/setup-wizard/assets/images/success-animation.webm' ); ?>" type="video/webm">
            <img src="<?php echo esc_url( get_template_directory_uri() . '/inc/admin/setup-wizard/assets/images/success-animation.gif' ); ?>" alt="Congrats" style="max-width: 200px; margin-bottom: 20px; margin-inline: auto; display: block;">
        </video>
        <style>
            .madeit-setup-wizard-step-finish .madeit-setup-success-animation {
                height: auto;
            }
        </style>
        <h1>Gefeliciteerd!</h1>

        <p>Je hebt de setup wizard succesvol voltooid. Je nieuwe WordPress website met het <?php echo MADEIT_NAME; ?> thema is klaar voor gebruik! We raden aan om nu je website te bekijken en aanpassingen te maken waar nodig.</p>

        <div class="group button-primaryGroup">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="button button-primary">Bekijk Website</a>
            <a href="<?php echo esc_url(admin_url()); ?>" class="">Ga naar het dashboard</a>

        </div>
    </div>

</div>
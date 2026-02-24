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

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-finish">

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

    <p>Je hebt de setup wizard succesvol voltooid. Je nieuwe WordPress website met het Made I.T. thema is klaar voor gebruik! We raden aan om nu je website te bekijken en aanpassingen te maken waar nodig.</p>

    <div class="group button-primaryGroup">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="button button-primary">Bekijk Website</a>
        <a href="<?php echo esc_url(admin_url()); ?>" class="">Ga naar het dashboard</a>

    </div>
</div>
<?php
/**
 * MadeIt Setup Wizard - Step: Welcome
 * 
 * Dit is de eerste stap van de setup wizard, waar gebruikers worden verwelkomd en een overzicht krijgen van wat ze kunnen verwachten.
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-welcome">

    <h1>Welkom bij Made I.T.</h1>

    <p>Deze wizard helpt je bij het configureren van je nieuwe WordPress website met het Made I.T. thema. 
        We zullen je begeleiden bij het installeren van aanbevolen plugins, het importeren van demo-inhoud en het aanpassen van je site-instellingen.</p>

    <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=child-theme')); ?>" class="button button-primary">Begin Setup</a>
</div>

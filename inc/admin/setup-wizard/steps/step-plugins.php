<?php
/**
 * MadeIt Setup Wizard - Step: plugins
 * Install and activate all required and recommended plugins.
 * 
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-plugins">

    <h1>Plugins Installeren</h1>

    <p class="small">In deze stap installeren we de aanbevolen plugins die nodig zijn voor de volledige functionaliteit van het Made I.T. thema.</p>

    <?php
    // Hier zou je de code kunnen toevoegen om de plugins te installeren en activeren.
    // De plugins worden ingeladen via de class-plugin-installer.php.

    // Een voorbeeld van we de plugins gaan weergeven:
    ?>
    <div class="pluginList">
        <div class="pluginItem">
            <div class="pluginImage">
                Plugin image
            </div>
            <div class="pluginContent">
                <h3>Plugin naam</h3>
                <p class="small">Plugin description</p>
            </div>
        </div>
        <div class="pluginItem">
            <div class="pluginImage">
                Plugin image
            </div>
            <div class="pluginContent">
                <h3>Plugin naam</h3>
                <p class="small">Plugin description</p>
            </div>
        </div>
        <div class="pluginItem">
            <div class="pluginImage">
                Plugin image
            </div>
            <div class="pluginContent">
                <h3>Plugin naam</h3>
                <p class="small">Plugin description</p>
            </div>
        </div>
    </div>

    <div class="buttons">
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=pages')); ?>">Overslaan</a>
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=pages')); ?>">Alle Plugins Installeren</a>
    </div>
</div>
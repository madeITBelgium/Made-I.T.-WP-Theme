<?php
/**
 * MadeIt Setup Wizard - Step: Basis Instellingen
 * In deze stap van de setup wizard kunnen gebruikers de basisinstellingen van hun website configureren.
 * 
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-basic-settings">

    <h1>Basis Instellingen</h1>

    <p class="small">In deze stap kunnen gebruikers de basisinstellingen van hun website configureren, zoals de site titel, tagline, en andere belangrijke instellingen.</p>


    <?php
    // Hier zou je de code kunnen toevoegen om de basisinstellingen te configureren en op te slaan. 
    // Je kunt bijvoorbeeld een formulier maken waarin gebruikers de site titel, tagline, en andere instellingen kunnen invoeren. 
    // Wanneer het formulier wordt ingediend, kun je de instellingen opslaan in de WordPress database en doorgaan naar de volgende stap van de setup wizard.
    ?>
    <div class="settingsForm">
        <label for="name">Naam</label>
        <input type="text" id="name" name="name" value="<?php echo get_bloginfo('name'); ?>">

        <label for="bedrijfsnaam">Bedrijfsnaam</label>
        <input type="text" id="bedrijfsnaam" name="bedrijfsnaam" value="">

        <label for="adres">Adres</label>
        <input type="text" id="adres" name="adres" value="">
        <label for="number">Nummer</label>
        <input type="text" id="number" name="number" value="">
        <label for="postcode">Postcode</label>
        <input type="text" id="postcode" name="postcode" value="">
        <label for="plaats">Plaats</label>
        <input type="text" id="plaats" name="plaats" value="">

        <label for="who">Wie</label>
        <input type="text" id="who" name="who" value="">

        <label for="what">Wat</label>
        <input type="text" id="what" name="what" value="">

    </div>


    <div class="buttons">
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=branding')); ?>">Overslaan</a>
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=branding&save_settings=true')); ?>">Instellingen Opslaan</a>
    </div>
</div>
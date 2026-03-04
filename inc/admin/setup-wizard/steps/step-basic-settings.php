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

    <p class="small">Vul hier de belangrijkste bedrijfs- en websitegegevens in. Deze gegevens kunnen later gebruikt worden voor je website-inhoud, contactinformatie en structured data (schema).</p>


    <?php
    // Hier zou je de code kunnen toevoegen om de basisinstellingen te configureren en op te slaan. 
    // Je kunt bijvoorbeeld een formulier maken waarin gebruikers de site titel, tagline, en andere instellingen kunnen invoeren. 
    // Wanneer het formulier wordt ingediend, kun je de instellingen opslaan in de WordPress database en doorgaan naar de volgende stap van de setup wizard.
    ?>
    <div class="settingsForm">
        <label for="business_name">Bedrijfsnaam</label>
        <input type="text" id="business_name" name="business_name" value="<?php echo esc_attr(get_bloginfo('name')); ?>">

        <label for="website_url">Website URL</label>
        <input type="url" id="website_url" name="website_url" value="<?php echo esc_attr(home_url('/')); ?>">

        <label for="business_phone">Telefoonnummer</label>
        <input type="text" id="business_phone" name="business_phone" value="">

        <label for="business_email">E-mailadres</label>
        <input type="email" id="business_email" name="business_email" value="">

        <label for="business_description">Korte beschrijving</label>
        <textarea id="business_description" name="business_description" rows="3" placeholder="Bijv. Made I.T., jouw digitale partner"></textarea>

        <label for="business_topic">Wat doet je bedrijf? Of wat is het onderwerp van je website?</label>
        <textarea id="business_topic" name="business_topic" rows="3" placeholder="Bijv. Webdesign, online marketing en websites voor kmo's"></textarea>

        <label for="target_audience">Wat is de doelgroep?</label>
        <textarea id="target_audience" name="target_audience" rows="3" placeholder="Bijv. Lokale ondernemers, zelfstandigen en groeibedrijven"></textarea>

        <label for="street_address">Straat + nummer</label>
        <input type="text" id="street_address" name="street_address" value="">

        <label for="postal_code">Postcode</label>
        <input type="text" id="postal_code" name="postal_code" value="">

        <label for="city">Gemeente / Stad</label>
        <input type="text" id="city" name="city" value="">

        <label for="region">Provincie / Regio</label>
        <input type="text" id="region" name="region" value="">

        <label for="country">Landcode</label>
        <input type="text" id="country" name="country" value="BE">

        <label for="facebook_url">Facebook URL</label>
        <input type="url" id="facebook_url" name="facebook_url" value="">

        <label for="instagram_url">Instagram URL</label>
        <input type="url" id="instagram_url" name="instagram_url" value="">

        <label for="maps_review_url">Review/Maps URL</label>
        <input type="url" id="maps_review_url" name="maps_review_url" value="">
    </div>


    <div class="buttons">
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=branding')); ?>">Overslaan</a>
        <a data-save="1" href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=branding&save_settings=true')); ?>">Instellingen Opslaan</a>
    </div>
</div>
<?php
/**
 * MadeIt Setup Wizard - Step: Pages
 * Dit is de stap van de setup wizard waar gebruikers pagina's kunnen aanmaken en configureren, zoals de homepage, blogpagina, contactpagina, etc.
 * 
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-pages">

    <h1>Pagina's</h1>

    <p class="small">In deze stap kan je pagina's aanmaken en configureren, zoals de homepage, blogpagina, contactpagina, etc.</p>


    <?php
    // Hier zou je de code kunnen toevoegen om de pagina's aan te maken en te configureren.
    // Je kunt bijvoorbeeld een formulier maken waarin gebruikers de titel en inhoud van de pagina's kunnen invoeren. 
    // Wanneer het formulier wordt ingediend, kun je de pagina's opslaan in de WordPress database en doorgaan naar de volgende stap van de setup wizard.
    ?>
    <div class="settingsForm">
        <p>Welke pagina's moeten worden aangemaakt?</p>

        <div id="pageCheckboxes">
            <label><input type="checkbox" name="create_home" value="1" checked> Home</label>
            <label><input type="checkbox" name="create_blog" value="1"> Blog</label>
            <label><input type="checkbox" name="create_contact" value="1"> Contact</label>
        </div>

        <input id="newPage" type="text" name="new_page" placeholder="Titel van nieuwe pagina">
        

    </div>


    <div class="buttons">
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=finish')); ?>">Overslaan</a>
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=finish&save_settings=true')); ?>">Instellingen Opslaan</a>
    </div>
</div>

<!-- script for add new pages -->
<script>
    document.getElementById('newPage').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const pageTitle = this.value.trim();
            if (pageTitle) {
                const newPage = document.createElement('label');
                newPage.innerHTML = `<input type="checkbox" name="create_${pageTitle.toLowerCase().replace(/\s+/g, '_')}" value="1" checked> ${pageTitle}`;
                document.getElementById('pageCheckboxes').appendChild(newPage);
                this.value = '';
            }
        }
    });
</script>
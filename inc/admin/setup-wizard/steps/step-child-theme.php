<?php
/**
 * MadeIt Setup Wizard - Step: Child theme
 * In deze stap van de setup wizard kunnen gebruikers ervoor kiezen om een child theme te maken. Een child theme is een subthema dat de functionaliteit en styling van het hoofdthema (parent theme) overneemt, maar waarmee je aanpassingen kunt maken zonder dat deze verloren gaan bij een update van het hoofdthema.
 * 
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-child-theme">

    <h1>Child Theme Aanmaken</h1>

    <p class="small">Een child theme is een subthema dat de functionaliteit en styling van het hoofdthema (parent theme) overneemt, maar waarmee je aanpassingen kunt maken zonder dat deze verloren gaan bij een update van het hoofdthema. We raden aan om een child theme te gebruiken als je van plan bent om aanpassingen te maken aan de code of styling van je website.</p>
    <a style="color: grey; opacity: 0.7;" href="https://developer.wordpress.org/themes/advanced-topics/child-themes/" target="_blank" rel="noopener noreferrer">Leer meer over child themes</a>



    <!-- Choose child thema -->
     <div class="settingsForm" style="margin-top: 50px;">

        <div class="group groupChildTheme" style="display: flex; gap: 20px;">
            <label>
                <input type="radio" name="create_child1" checked hidden>
                <span class="childImage">
                    <img src="" alt="">
                </span>
                <span class="childContent">
                    <h3>Child thema - madeit</h3>
                    <a class="extraSettings" style="position: relative; z-index: 99;" href="">Extra instellingen</a>
                </span>
            </label>

            <label>
                <input type="radio" name="create_child2" hidden>
                <span class="childImage">
                    <img src="" alt="">
                </span>
                <span class="childContent">
                    <h3>Child thema - grog</h3>
                    <a class="extraSettings" style="position: relative; z-index: 99;" href="">Extra instellingen</a>
                </span>
            </label>
        </div>
    </div>


    <div class="buttons">
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=basic-settings')); ?>">Overslaan</a>
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=basic-settings&create_child=true')); ?>">Child Theme Aanmaken</a>
    </div>
</div>


<!-- script, just one radio fiels can be selected. -->
<script>
    const childThemeRadios = document.querySelectorAll('input[type="radio"][name^="create_child"]');
    childThemeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            childThemeRadios.forEach(r => {
                if (r !== this) {
                    r.checked = false;
                }
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        const extraSettingsLinks = document.querySelectorAll('.extraSettings');
        extraSettingsLinks.forEach(function(link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                
                // open modal with extra settings for the child theme.
                const modal = document.createElement('div');

                modal.classList.add('child-theme-extra-settings-modal');
                modal.innerHTML = `
                    <div class="modal-content">
                        <h2>Extra instellingen voor ${this.closest('label').querySelector('h3').innerText}</h2>
                        <p>Hier kunnen extra instellingen worden toegevoegd voor het child theme, zoals het kiezen van een andere naam, het selecteren van specifieke functies of het aanpassen van de styling.</p>
                        <button class="close-modal">x</button>
                    </div>
                `;
                document.body.appendChild(modal);

                const closeModalButton = modal.querySelector('.close-modal');
                closeModalButton.addEventListener('click', function () {
                    document.body.removeChild(modal);
                });
            });
        });
    });
</script>
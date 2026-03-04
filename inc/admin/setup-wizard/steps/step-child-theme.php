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

$themes = wp_get_themes();
$child_themes = [];

foreach ($themes as $stylesheet => $theme) {
    $template = sanitize_key((string) $theme->get_template());
    if ($template !== 'madeit') {
        continue;
    }

    if ($stylesheet === $template) {
        continue;
    }

    $child_themes[$stylesheet] = $theme;
}

$active_stylesheet = get_stylesheet();
$default_child = '';

if ($active_stylesheet && isset($child_themes[$active_stylesheet])) {
    $default_child = $active_stylesheet;
} elseif (!empty($child_themes)) {
    $default_child = array_key_first($child_themes);
}

$next_step_base_url = admin_url('themes.php?page=madeit-setup-wizard&step=basic-settings&create_child=true');
$skip_url = admin_url('themes.php?page=madeit-setup-wizard&step=basic-settings');

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-child-theme">

    <h1>Kies je website-stijl</h1>

    <p class="small">Zie dit als een veilige basis voor de look &amp; feel van je website. Je kiest een variant waarop je later kleuren, lettertypes en layout kunt aanpassen, zonder dat updates je instellingen stuk maken. Twijfel je? Kies gewoon de standaardoptie.</p>
    <a style="color: grey; opacity: 0.7;" href="https://developer.wordpress.org/themes/advanced-topics/child-themes/" target="_blank" rel="noopener noreferrer">Meer uitleg (voor wie toch de technische achtergrond wil)</a>



    <!-- Choose child thema -->
     <div class="settingsForm" style="margin-top: 50px;">

        <?php if (!empty($child_themes)) : ?>
            <div class="group groupChildTheme" style="display: flex; gap: 20px; flex-wrap: wrap;">
                <?php foreach ($child_themes as $stylesheet => $theme) :
                    $is_checked = ($stylesheet === $default_child);
                    $screenshot = $theme->get_screenshot();
                    ?>
                    <label>
                        <input
                            type="radio"
                            name="selected_child_theme"
                            value="<?php echo esc_attr($stylesheet); ?>"
                            <?php checked($is_checked); ?>
                        >
                        <span class="childImage">
                            <?php if (!empty($screenshot)) : ?>
                                <img src="<?php echo esc_url($screenshot); ?>" alt="<?php echo esc_attr($theme->get('Name')); ?>">
                            <?php endif; ?>
                        </span>
                        <span class="childContent">
                            <h3><?php echo esc_html($theme->get('Name')); ?></h3>
                            <?php if (!empty($theme->get('Description'))) : ?>
                                <p class="small" style="margin: 0;"><?php echo esc_html(wp_trim_words($theme->get('Description'), 16)); ?></p>
                            <?php endif; ?>
                        </span>
                    </label>
                <?php endforeach; ?>
            </div>
        <?php else : ?>
            <p class="small" style="margin-top: 10px; color: #b42318;">
                Er werden geen child themes gevonden voor Made I.T. Je kan doorgaan met de setup en later een child theme toevoegen.
            </p>
        <?php endif; ?>
    </div>


    <div class="buttons">
        <a href="<?php echo esc_url($skip_url); ?>">Overslaan</a>
        <a
            id="madeit-child-theme-next"
            href="<?php echo esc_url($next_step_base_url . (!empty($default_child) ? '&child_theme=' . rawurlencode($default_child) : '')); ?>"
        >Verder</a>
    </div>
</div>


<!-- script: houd gekozen child theme in de volgende stap-URL -->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const nextButton = document.getElementById('madeit-child-theme-next');
        const radios = document.querySelectorAll('input[name="selected_child_theme"]');

        if (!nextButton) {
            return;
        }

        const setNextLink = function () {
            const selected = document.querySelector('input[name="selected_child_theme"]:checked');
            const url = new URL(nextButton.href, window.location.origin);

            if (selected && selected.value) {
                url.searchParams.set('child_theme', selected.value);
            } else {
                url.searchParams.delete('child_theme');
            }

            nextButton.href = url.toString();
        };

        setNextLink();

        radios.forEach(function (radio) {
            radio.addEventListener('change', setNextLink);
        });
            });
</script>
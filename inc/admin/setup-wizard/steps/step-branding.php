<?php
/**
 * MadeIt Setup Wizard - Step: Branding
 * In deze stap van de setup wizard kunnen gebruikers de branding van hun website aanpassen, zoals het logo, de kleuren en de typografie.
 * 
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-branding">

    <h1>Branding Aanpassen</h1>

    <p class="small">In deze stap van de setup wizard kunnen gebruikers de branding van hun website aanpassen, zoals het logo, de kleuren en de typografie.</p>

    <?php
    // Hier zou je de code kunnen toevoegen om de branding instellingen te configureren en op te slaan. 
    // Je kunt bijvoorbeeld een formulier maken waarin gebruikers hun logo kunnen uploaden, kleuren kunnen kiezen
    // en typografie kunnen aanpassen. Wanneer het formulier wordt ingediend, kun je de instellingen opslaan in de WordPress database en doorgaan naar de volgende stap van de setup wizard.
    ?>
    <div class="settingsForm">
        <label for="logo">Logo</label>
        <input type="file" id="logo" name="logo">
        <span id="logo-preview"></span>

        <label for="favicon">Favicon</label>
        <input type="file" id="favicon" name="favicon">
        <span id="favicon-preview">
            <svg id="fav_icon_preview" data-name="fav_icon_preview" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 361.86 47.95">
                <path class="cls-1" d="M140.64,120V80.55a7.51,7.51,0,0,1,7.5-7.5H494a7.51,7.51,0,0,1,7.5,7.5V120H140.64Z" transform="translate(-140.14 -72.55)"/>
                <path class="cls-2" d="M494,73.55a7,7,0,0,1,7,7V119.5H141.14V80.55a7,7,0,0,1,7-7H494m0-1H148.14a8,8,0,0,0-8,8v39.9a0.05,0.05,0,0,0,.05.05H501.93a0.07,0.07,0,0,0,.07-0.07V80.55a8,8,0,0,0-8-8h0Z" transform="translate(-140.14 -72.55)"/>
                <path class="cls-3" d="M140.65,119.95l0.1-27.36,4.13-11.05A5,5,0,0,1,149.27,79h90.31a5.41,5.41,0,0,1,4.66,2.67L247.63,93H501.5v27Z" transform="translate(-140.14 -72.55)"/>
                <path class="cls-2" d="M239.58,79.5a4.91,4.91,0,0,1,4.2,2.37L247,92.79l0.21,0.71H501v26l-359.85-.05,0.1-26.77,4.08-10.9a4.55,4.55,0,0,1,3.95-2.28h90.31m0-1H149.27a5.55,5.55,0,0,0-4.85,2.86L140.25,92.5l-0.11,27.95L502,120.5v-28H248l-3.3-11a5.9,5.9,0,0,0-5.12-3h0Z" transform="translate(-140.14 -72.55)"/>
                <rect class="cls-3" x="60.44" y="26.49" width="294.88" height="15.06" rx="1.5" ry="1.5"/>
                <path class="cls-2" d="M494,99.54a1,1,0,0,1,1,1V112.6a1,1,0,0,1-1,1H202.08a1,1,0,0,1-1-1V100.54a1,1,0,0,1,1-1H494m0-1H202.08a2,2,0,0,0-2,2V112.6a2,2,0,0,0,2,2H494a2,2,0,0,0,2-2V100.54a2,2,0,0,0-2-2h0Z" transform="translate(-140.14 -72.55)"/>
                <line class="cls-4" x1="355.11" y1="8.8" x2="351.11" y2="12.8"/>
                <path class="cls-2" d="M491.25,85.85A0.5,0.5,0,0,1,490.9,85l4-4a0.5,0.5,0,0,1,.71.71l-4,4A0.5,0.5,0,0,1,491.25,85.85Z" transform="translate(-140.14 -72.55)"/>
                <line class="cls-4" x1="355.11" y1="12.8" x2="351.11" y2="8.8"/>
                <path class="cls-2" d="M495.25,85.85a0.5,0.5,0,0,1-.35-0.15l-4-4A0.5,0.5,0,0,1,491.6,81l4,4A0.5,0.5,0,0,1,495.25,85.85Z" transform="translate(-140.14 -72.55)"/>
                <line class="cls-4" x1="99.11" y1="11.8" x2="95.11" y2="15.8"/>
                <path class="cls-2" d="M235.25,88.85A0.5,0.5,0,0,1,234.9,88l4-4a0.5,0.5,0,0,1,.71.71l-4,4A0.5,0.5,0,0,1,235.25,88.85Z" transform="translate(-140.14 -72.55)"/>
                <line class="cls-4" x1="99.11" y1="15.8" x2="95.11" y2="11.8"/>
                <path class="cls-2" d="M239.25,88.85a0.5,0.5,0,0,1-.35-0.15l-4-4A0.5,0.5,0,0,1,235.6,84l4,4A0.5,0.5,0,0,1,239.25,88.85Z" transform="translate(-140.14 -72.55)"/>
                <path class="cls-2" d="M483.58,81.88v3h-3v-3h3m0-1h-3a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1v-3a1,1,0,0,0-1-1h0Z" transform="translate(-140.14 -72.55)"/>
                <line class="cls-5" x1="328.37" y1="12.79" x2="332.37" y2="12.79"/>
                <path class="cls-2" d="M211.12,109.66l-1.35-2,0.08-.07a2.84,2.84,0,1,0-.92.62l1.35,2A0.5,0.5,0,1,0,211.12,109.66Zm-2-2.82a1.86,1.86,0,1,1,.54-1.31A1.84,1.84,0,0,1,209.15,106.83Z" transform="translate(-140.14 -72.55)"/>
                <text class="cls-6" transform="translate(25.92 16.64)">
                    <tspan><?php echo get_bloginfo('name'); ?></tspan>
                </text>
                <text class="cls-7" transform="translate(78.36 36.95)">
                    <tspan><?php echo get_bloginfo('url'); ?></tspan>
                </text>
                <path class="cls-2" d="M188.89,104.68a4,4,0,1,0,1,3.83h-1a3,3,0,1,1-2.82-4,3,3,0,0,1,2.11.89L186.56,107h3.5v-3.5Z" transform="translate(-140.14 -72.55)"/>
                <path class="cls-2" d="M161.06,107H155l2.8-2.8-0.71-.7-4,4,4,4,0.7-.7L155,108h6.09v-1Z" transform="translate(-140.14 -72.55)"/>
                <path class="cls-2" d="M171.56,103.5l-0.7.7,2.79,2.8h-6.09v1h6.09l-2.79,2.8,0.7,0.7,4-4Z" transform="translate(-140.14 -72.55)"/>
                <image width="32" height="32" transform="translate(12.86 9.89) scale(0.25)" xlink:href=""/>
                </svg>
        </span>

        <p style="margin-bottom: 0;">Kleuren</p>
        <div class="group" style="display: flex; margin-top: 20px; flex-wrap: wrap;">
            <div class="swatch swatchBackground">
                <input type="color" id="colorBackground" name="colorBackground" value="#ffffff">
                <div class="info">
                    <h3>Background</h3>
                    <p class="small" style="margin: 0 !important;"><span class="hex-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="rgb-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="cmyk-value"></span></p>
                </div>
            </div>

            <div class="swatch swatchText">
                <input type="color" id="colorText" name="colorText" value="#000000">
                <div class="info">
                    <h3>Text</h3>
                    <p class="small" style="margin: 0 !important;"><span class="hex-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="rgb-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="cmyk-value"></span></p>
                </div>
            </div>

            <div class="swatch swatchPrimary">
                <input type="color" id="colorPrimary" name="colorPrimary" value="#007bff">
                <div class="info">
                    <h3>Primary</h3>
                    <p class="small" style="margin: 0 !important;"><span class="hex-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="rgb-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="cmyk-value"></span></p>
                </div>
            </div>

            <div class="swatch swatchSecondary">
                <input type="color" id="colorSecondary" name="colorSecondary" value="#6c757d">
                <div class="info">
                    <h3>Secondary</h3>
                    <p class="small" style="margin: 0 !important;"><span class="hex-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="rgb-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="cmyk-value"></span></p>
                </div>
            </div>

            <div class="swatch swatchSuccess">
                <input type="color" id="colorSuccess" name="colorSuccess" value="#28a745">
                <div class="info">
                    <h3>Success</h3>
                    <p class="small" style="margin: 0 !important;"><span class="hex-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="rgb-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="cmyk-value"></span></p>
                </div>
            </div>

            <div class="swatch swatchDanger">
                <input type="color" id="colorDanger" name="colorDanger" value="#dc3545">
                <div class="info">
                    <h3>Danger</h3>
                    <p class="small" style="margin: 0 !important;"><span class="hex-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="rgb-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="cmyk-value"></span></p>
                </div>
            </div>

            <div class="swatch swatchWarning">
                <input type="color" id="colorWarning" name="colorWarning" value="#ffc107">
                <div class="info">
                    <h3>Warning</h3>
                    <p class="small" style="margin: 0 !important;"><span class="hex-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="rgb-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="cmyk-value"></span></p>
                </div>
            </div>

            <div class="swatch swatchInfo">
                <input type="color" id="colorInfo" name="colorInfo" value="#17a2b8">
                <div class="info">
                    <h3>Info</h3>
                    <p class="small" style="margin: 0 !important;"><span class="hex-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="rgb-value"></span></p>
                    <p class="small" style="margin: 0 !important;"><span class="cmyk-value"></span></p>
                </div>
            </div>

            <div class="extra" style="order: 999;">
                <a id="extraClr" class="button button-secondary" href="">Extra kleur(en) toevoegen?</a>
            </div>
        </div>

        <label for="typography">Typografie</label>
        <label for="">Kopteksten</label>
        <select id="typography" name="typography">
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
        </select>

        <label for="">Body</label>
        <select id="typography" name="typography">
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
        </select>
    </div>
    <div class="buttons">
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=plugins')); ?>">Overslaan</a>
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=plugins&save_settings=true')); ?>">Instellingen Opslaan</a>
    </div>

</div>

<!-- // Hier zou je JavaScript kunnen toevoegen om een live preview van het logo en de favicon te tonen wanneer gebruikers een bestand selecteren. -->
<script>
    document.getElementById('logo').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px';
                document.getElementById('logo-preview').innerHTML = '';
                document.getElementById('logo-preview').appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('favicon').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const svgImage = document.querySelector('#fav_icon_preview image');
                if (svgImage) {
                    svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', e.target.result);
                }
            }
            reader.readAsDataURL(file);
        }
    });

    // Hier zou je ook JavaScript kunnen toevoegen om de kleurwaarden (HEX, RGB, CMYK) bij te werken wanneer gebruikers een kleur selecteren.
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        // Set default values on page load
        updateColorValues(input);
        
        input.addEventListener('input', function() {
            updateColorValues(this);
        });
    });

    // Handle dynamically added color inputs
    document.addEventListener('change', function(event) {
        if (event.target.type === 'color' && !Array.from(colorInputs).includes(event.target)) {
            updateColorValues(event.target);
        }
    });

    document.addEventListener('input', function(event) {
        if (event.target.type === 'color' && !Array.from(colorInputs).includes(event.target)) {
            updateColorValues(event.target);
        }
    });

    function updateColorValues(input) {
        const hexValue = input.value;
        const rgbValue = hexToRgb(hexValue);
        const cmykValue = rgbToCmyk(rgbValue);
        
        const infoDiv = input.nextElementSibling;
        infoDiv.querySelector('.hex-value').textContent = hexValue;
        infoDiv.querySelector('.rgb-value').textContent = `rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`;
        infoDiv.querySelector('.cmyk-value').textContent = `cmyk(${cmykValue.c}%, ${cmykValue.m}%, ${cmykValue.y}%, ${cmykValue.k}%)`;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    function rgbToCmyk({ r, g, b }) {
        const c = 1 - (r / 255);
        const m = 1 - (g / 255);
        const y = 1 - (b / 255);
        const k = Math.min(c, m, y);
        return {
            c: Math.round((c - k) / (1 - k) * 100),
            m: Math.round((m - k) / (1 - k) * 100),
            y: Math.round((y - k) / (1 - k) * 100),
            k: Math.round(k * 100)
        };
    }
</script>
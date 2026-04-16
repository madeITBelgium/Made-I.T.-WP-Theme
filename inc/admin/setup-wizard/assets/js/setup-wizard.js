// #pregressbar
jQuery(document).ready(function($) {
    $('html.wp-toolbar').css('padding-top', '0');

    $('#progressbar li').click(function() {
        var index = $(this).index();
        $('#progressbar li').removeClass('active');
        $('#progressbar li').each(function(i) {
            if (i <= index) {
                $(this).addClass('active');
            }
        });
    });

    // Mark completed items on page load
    var $items = $('#progressbar li');
    var activeIndex = $items.index($items.filter('.active'));
    $items.each(function(i) {
        if (i <= activeIndex) {
            $(this).addClass('completed');
        }
    });
});


// Save current step data via AJAX before continuing to next step.
jQuery(document).ready(function($) {
    const config = window.madeitSetupWizard || null;
    if (!config || !config.ajaxUrl || !config.nonce || !config.currentStep) {
        return;
    }

    const collectStepFields = function() {
        const result = {};
        const $container = $('.madeit-setup-wizard-step');

        if (!$container.length) {
            return result;
        }

        const parseFieldName = function(name) {
            const path = [];
            const regex = /([^\[\]]+)|\[([^\[\]]*)\]/g;
            let match;

            while ((match = regex.exec(name)) !== null) {
                const segment = match[1] || match[2];
                if (segment !== '') {
                    path.push(segment);
                }
            }

            return path.length ? path : [name];
        };

        const assignByPath = function(target, path, value) {
            let cursor = target;

            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (typeof cursor[key] !== 'object' || cursor[key] === null || Array.isArray(cursor[key])) {
                    cursor[key] = {};
                }
                cursor = cursor[key];
            }

            cursor[path[path.length - 1]] = value;
        };

        $container.find('input, select, textarea').each(function() {
            const field = this;
            const name = field.name;

            if (!name || field.disabled || field.dataset.setupIgnore === '1') {
                return;
            }

            if (field.type === 'button' || field.type === 'submit' || field.type === 'reset' || field.type === 'file') {
                return;
            }

            const path = parseFieldName(name);

            if (field.type === 'checkbox') {
                assignByPath(result, path, field.checked ? '1' : '0');
                return;
            }

            if (field.type === 'radio') {
                if (field.checked) {
                    assignByPath(result, path, field.value);
                }
                return;
            }

            assignByPath(result, path, field.value);
        });

        if (config.currentStep === 'pages') {
            const enabledPages = [];
            const pages = result.pages && typeof result.pages === 'object' ? result.pages : {};

            Object.keys(pages).forEach(function(slug) {
                const pageConfig = pages[slug];
                if (pageConfig && pageConfig.enabled === '1') {
                    enabledPages.push({
                        slug: slug,
                        title: typeof pageConfig.title === 'string' ? pageConfig.title : '',
                        description: typeof pageConfig.description === 'string' ? pageConfig.description : '',
                    });
                }
            });

            return {
                enabled_pages: enabledPages,
            };
        }

        return result;
    };

    $(document).on('click', '.madeit-setup-wrapper .buttons a[data-save="1"]', function(e) {
        e.preventDefault();

        const href = $(this).attr('href');
        if (!href) {
            return;
        }

        const payload = {
            action: 'madeit_setup_wizard_save_step',
            nonce: config.nonce,
            step: config.currentStep,
            data: collectStepFields(),
        };

        $.post(config.ajaxUrl, payload)
            .always(function() {
                window.location.href = href;
            });
    });

    if (config.currentStep === 'finish') {
        const $loading = $('#madeit-setup-finalize-loading');
        const $error = $('#madeit-setup-finalize-error');
        const $content = $('#madeit-setup-finalize-content');

        if (!$loading.length || !$content.length || !config.finalizeNonce) {
            return;
        }

        $loading.show();
        $error.hide();
        $content.hide();

        $.post(config.ajaxUrl, {
            action: 'madeit_setup_wizard_finalize',
            nonce: config.finalizeNonce,
        })
            .done(function(response) {
                if (response && response.success) {
                    $loading.hide();
                    $content.show();
                    return;
                }

                $loading.hide();
                $error.text('Er liep iets mis tijdens het afronden van de setup.').show();
            })
            .fail(function() {
                $loading.hide();
                $error.text('Er liep iets mis tijdens het afronden van de setup.').show();
            });
    }
});




// extraClr toevoegen, zelf naam kiezen en kleur kiezen, deze opslaan in de database en toepassen op de preview
jQuery(document).ready(function($) {
    $('#extraClr').click(function(e) {
        e.preventDefault();
        var colorName = prompt('Voer de naam van de extra kleur in:');
        if (colorName) {
            var colorValue = prompt('Voer de hex-waarde van de kleur in (bijv. #ff0000):');
            var rgbValue = hexToRgb(colorValue);
            var cmykValue = rgbToCmyk(rgbValue.r, rgbValue.g, rgbValue.b);
            var rgbString = 'rgb(' + rgbValue.r + ',' + rgbValue.g + ',' + rgbValue.b + ')';
            var cmykString = 'cmyk(' + cmykValue.c + ',' + cmykValue.m + ',' + cmykValue.y + ',' + cmykValue.k + ')';

            if (colorValue) {
                // dublicate code van de andere kleuren, maar dan met de nieuwe kleur
                var $newSwatch = $('<div class="swatch swatch' + colorName + '"><input type="color" id="color' + colorName + '" name="color' + colorName + '" value="' + colorValue + '"><div class="info"><h3>' + colorName + '</h3><p class="small" style="margin: 0 !important;"><span class="hex-value">' + colorValue + '</span></p><p class="small" style="margin: 0 !important;"><span class="rgb-value">' + rgbString + '</span></p><p class="small" style="margin: 0 !important;"><span class="cmyk-value">' + cmykString + '</span></p></div><span class="removeSwatch">X</span></div>');
                $('.group').append($newSwatch);

            }

            // Remove swatch functionality
            $(document).on('click', '.removeSwatch', function() {
                $(this).closest('.swatch').remove();
             });

            // Helper functions to convert hex to RGB and RGB to CMYK
            function hexToRgb(hex) {
                var bigint = parseInt(hex.replace('#', ''), 16);
                return {
                    r: (bigint >> 16) & 255,
                    g: (bigint >> 8) & 255,
                    b: bigint & 255
                };
            }

            function rgbToCmyk(r, g, b) {
                var c = 1 - (r / 255);
                var m = 1 - (g / 255);
                var y = 1 - (b / 255);
                var k = Math.min(c, m, y);
                if (k === 1) {
                    return { c: 0, m: 0, y: 0, k: 100 };
                }
                return {
                    c: Math.round(((c - k) / (1 - k)) * 100),
                    m: Math.round(((m - k) / (1 - k)) * 100),
                    y: Math.round(((y - k) / (1 - k)) * 100),
                    k: Math.round(k * 100)
                };
            }
        }
    });
});
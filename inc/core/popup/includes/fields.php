<?php
if (!defined('ABSPATH') || !function_exists('acf_add_local_field_group')) return;

acf_add_local_field_group([
    'key' => 'group_popup',
    'title' => 'M-Popup',
    'fields' => [
        // Trigger
        [
            'key' => 'tab_trigger',
            'label' => 'Trigger',
            'type' => 'tab',
            'placement' => 'left',
        ],
        [
            'key' => 'field_popup_enabled',
            'label' => 'Popup actief',
            'name' => 'popup_enabled',
            'type' => 'true_false',
            'ui' => 1,
            'default_value' => 1,
        ],
        [
            'key' => 'field_popup_start',
            'label' => 'Actief vanaf',
            'name' => 'popup_start',
            'type' => 'date_time_picker',
            'return_format' => 'Y-m-d H:i:s',
        ],
        [
            'key' => 'field_popup_end',
            'label' => 'Actief tot',
            'name' => 'popup_end',
            'type' => 'date_time_picker',
            'return_format' => 'Y-m-d H:i:s',
        ],
        [
            'key' => 'field_popup_delay',
            'label' => 'Uitstellen (ms)',
            'name' => 'popup_delay',
            'type' => 'number',
            'default_value' => 0,
        ],
        [
            'key' => 'field_popup_sessions',
            'label' => 'Sessies',
            'name' => 'popup_sessions',
            'type' => 'select',
            'choices' => [
                'once_per_visit' => 'Elke bezoek één keer',
                'every_page' => 'Elke pagina',
                'once_per_day' => 'Eén keer per dag',
                'once_per_week' => 'Eén keer per week',
                'once_per_month' => 'Eén keer per maand',
                'once_per_year' => 'Eén keer per jaar',
                'once_total' => 'Eén keer in totaal',
                'five_times_per_visit' => '5 keer, één keer per bezoek',
            ],
            'default_value' => 'once_per_visit',
        ],

        // Target
        [
            'key' => 'tab_target',
            'label' => 'Target',
            'type' => 'tab',
            'placement' => 'left',
        ],
        [
            'key' => 'field_popup_pages',
            'label' => 'Pagina\'s',
            'name' => 'popup_pages',
            'type' => 'relationship',
            'post_type' => ['page','post','product'],
            'return_format' => 'id',
        ],
        [
            'key' => 'field_popup_action',
            'label' => 'Actie',
            'name' => 'popup_action',
            'type' => 'select',
            'choices' => [
                'specific_pages' => 'Openen van specifieke pagina\'s',
            ],
            'default_value' => 'specific_pages',
        ],

        // Display
        [
            'key' => 'tab_display',
            'label' => 'Weergave',
            'type' => 'tab',
            'placement' => 'left',
        ],
        // Message veld: horizontale sub-tabs
        [
            'key' => 'field_display_subtabs',
            'label' => '',
            'name' => 'display_subtabs',
            'type' => 'message',
            'message' => '
                <div class="m-popup-subtabs">
                    <button class="m-popup-subtab active" data-tab="preset">Preset</button>
                    <button class="m-popup-subtab" data-tab="style">Stijl</button>
                    <button class="m-popup-subtab" data-tab="size">Grootte</button>
                    <button class="m-popup-subtab" data-tab="animation">Animatie</button>
                    <button class="m-popup-subtab" data-tab="position">Positie</button>
                </div>
            ',
            'new_lines' => 'none',
            'esc_html' => 0,
        ],

        // Groep: Preset
        [
            'key' => 'group_display_preset',
            'label' => 'Preset',
            'name' => 'display_preset_group',
            'type' => 'group',
            'sub_fields' => [
                [
                    'key' => 'field_display_preset_info',
                    'label' => '',
                    'name' => 'display_preset_info',
                    'type' => 'message',
                    'message' => 'Kies een preset voor de weergave van de popup. Je kunt later nog extra CSS toevoegen in het tabblad Geavanceerd.',
                    'new_lines' => 'wpautop',
                    'esc_html' => 0, // Laat HTML toe als je het wilt
                ],
                [
                    'key' => 'field_popup_template',
                    'label' => 'Template',
                    'name' => 'popup_template',
                    'type' => 'post_object',
                    'post_type' => ['popup_template'],
                    'return_format' => 'id',
                ]
            ],
        ],


        // Group: Style
        [
            'key' => 'group_display_style',
            'label' => 'Stijl',
            'name' => 'display_style_group',
            'type' => 'group',
            'sub_fields' => [
                [
                    'key' => 'field_display_style_select',
                    'label' => 'Popup stijl',
                    'name' => 'popup_style',
                    'type' => 'select',
                    'choices' => [
                        'default' => 'Standaard',
                        'light' => 'Licht',
                        'dark' => 'Donker',
                        'christmas' => 'Kerst',
                    ],
                ],
            ],
        ],

        // Group: Size
        [
            'key' => 'group_display_size',
            'label' => 'Grootte',
            'name' => 'display_size_group',
            'type' => 'group',
            'sub_fields' => [
                [
                    'key' => 'field_popup_size',
                    'label' => 'Popup grootte',
                    'name' => 'popup_size',
                    'type' => 'select',
                    'choices' => [
                        'small' => 'Klein 40%',
                        'medium' => 'Middel 60%',
                        'large' => 'Groot 80%',
                        'extra_large' => 'Extra groot 90%',
                    ],
                    'default_value' => 'medium',
                    'descriptions' => 'Kies de grootte van de popup.',
                ],
                //min width
                [
                    'key' => 'field_popup_min_width',
                    'label' => 'Minimale breedte (px)',
                    'name' => 'popup_min_width',
                    'type' => 'number',
                    'default_value' => 300,
                    'instructions' => 'Stel de minimale breedte van de popup in pixels in. Standaard is 300px.',
                ],
                //max width
                [
                    'key' => 'field_popup_max_width',
                    'label' => 'Maximale breedte (px)',
                    'name' => 'popup_max_width',
                    'type' => 'number',
                    'default_value' => 800,
                    'instructions' => 'Stel de maximale breedte van de popup in pixels in. Standaard is 800px.',
                ],
            ],
        ],

        // groep: animation
        [
            'key' => 'group_display_animation',
            'label' => 'Animatie',
            'name' => 'display_animation_group',
            'type' => 'group',
            'sub_fields' => [
                [
                    'key' => 'field_popup_animation',
                    'label' => 'Popup animatie',
                    'name' => 'popup_animation',
                    'type' => 'select',
                    'choices' => [
                        'fade' => 'Vervagen',
                        'slide_down' => 'Naar beneden schuiven',
                        'zoom_in' => 'Inzoomen',
                        'bounce' => 'Stuiteren',
                    ],
                    'default_value' => 'fade',
                    'instructions' => 'Kies de animatie voor het verschijnen van de popup.',
                ],
                [
                    'key' => 'field_popup_animation_speed',
                    'label' => 'Animatie snelheid (ms)',
                    'name' => 'popup_animation_speed',
                    'type' => 'number',
                    'default_value' => 300,
                    'instructions' => 'Stel de snelheid van de animatie in milliseconden in. Standaard is 300ms.',
                ]
            ],
        ],

        // groep: position
        [
            'key' => 'group_display_position',
            'label' => 'Positie',
            'name' => 'display_position_group',
            'type' => 'group',
            'sub_fields' => [
                [
                    'key' => 'field_popup_position',
                    'label' => 'Popup positie',
                    'name' => 'popup_position',
                    'type' => 'select',
                    'choices' => [
                        'center' => 'Midden',
                        'top_left' => 'Boven links',
                        'top_right' => 'Boven rechts',
                        'bottom_left' => 'Onder links',
                        'bottom_right' => 'Onder rechts',
                    ],
                    'default_value' => 'center',
                    'instructions' => 'Kies de positie van de popup op het scherm.',
                ],
            ],
        ],
        

        // Advanced
        [
            'key' => 'tab_advanced',
            'label' => 'Geavanceerd',
            'type' => 'tab',
            'placement' => 'left',
        ],

        [
            'key' => 'field_popup_info',
            'label' => 'Informatie',
            'name' => 'popup_info',
            'type' => 'message',
            'message' => 'Hier kun je instellen hoe en wanneer de popup verschijnt. Kies een start- en eindtijd, en welke pagina\'s de popup moet tonen.',
            'new_lines' => 'wpautop',
            'esc_html' => 0, // Laat HTML toe als je het wilt
        ],
        [
            'key' => 'field_popup_custom_css',
            'label' => 'Custom CSS',
            'name' => 'popup_custom_css',
            'type' => 'textarea',
            'instructions' => 'Voeg hier je eigen CSS toe om de popup verder te customizen.',
            'rows' => 6,
        ],

    ],
    'location' => [
        [
            ['param' => 'post_type', 'operator' => '==', 'value' => 'popup']
            
        ]
    ]
    
]);


?>
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Alle subtab knoppen
    const subtabs = document.querySelectorAll('.m-popup-subtab');
    // Alle field groups van display
    const groups = {
        preset: document.querySelector('.acf-field-group[data-name="display_preset_group"]'),
        style: document.querySelector('.acf-field-group[data-name="display_style_group"]'),
        size: document.querySelector('.acf-field-group[data-name="display_size_group"]'),
        animation: document.querySelector('.acf-field-group[data-name="display_animation_group"]'),
        position: document.querySelector('.acf-field-group[data-name="display_position_group"]'),
    };

    console.log(groups);
    // Functie om groepen te toggelen
    function showGroup(tab) {
        for (let key in groups) {
            if (!groups[key]) continue;
            groups[key].style.display = (key === tab) ? 'block' : 'none';
        }

        console.log('function showGroup called with tab: ' + tab);
    }

    // Voeg click event toe aan elke subtab
    subtabs.forEach(function(tabBtn){
        tabBtn.addEventListener('click', function(){
            // active class
            subtabs.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // toon juiste groep
            const tabName = this.getAttribute('data-tab');
            showGroup(tabName);
        });

        console.log('clickEvent' + tabBtn.getAttribute('data-tab'));
    });

    // Init: toon preset groep standaard
    showGroup('preset');
    const firstTab = document.querySelector('.m-popup-subtab[data-tab="preset"]');
    const fieldGroep = document.querySelector('.acf-field-group[name="group_display_preset"]');
    if (firstTab) firstTab.classList.add('active');
    if (fieldGroep) fieldGroep.style.display = 'block';
    


});

</script>

<style>
    .acf-fields.inside {
        min-height: 500px !important;
    }
    .acf-field-display-subtabs {
        padding-top: 0 !important;
    }
    .m-popup-subtabs {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    }
    .m-popup-subtab {
        padding: 5px 10px;
        color: black;
        cursor: pointer;
    }
    .m-popup-subtab.active {
        color: #0073aa;
    }

    .acf-field-group {
        display: none;
    }
    .acf-field-group.active {
        display: block;
    }
</style>
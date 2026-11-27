<?php

if (!defined('ABSPATH') || !function_exists('acf_add_local_field_group')) {
    return;
}

$choices = mp_popup_display_choices();

acf_add_local_field_group([
    'key'    => 'group_popup',
    'title'  => 'M-Popup',
    'fields' => [
        // Trigger
        [
            'key'       => 'tab_trigger',
            'label'     => 'Trigger',
            'type'      => 'tab',
            'placement' => 'left',
        ],
        [
            'key'           => 'field_popup_enabled',
            'label'         => 'Popup actief',
            'name'          => 'popup_enabled',
            'type'          => 'true_false',
            'ui'            => 1,
            'default_value' => 1,
        ],
        [
            'key'           => 'field_popup_start',
            'label'         => 'Actief vanaf',
            'name'          => 'popup_start',
            'type'          => 'date_time_picker',
            'display_format'=> 'd/m/Y H:i',
            'return_format' => 'd-m-Y H:i',
            'first_day'     => 1,
            'time_format'   => 'd-m-Y H:i',
        ],
        [
            'key'           => 'field_popup_end',
            'label'         => 'Actief tot',
            'name'          => 'popup_end',
            'type'          => 'date_time_picker',
            'display_format'=> 'd/m/Y H:i',
            'return_format' => 'd-m-Y H:i',
            'first_day'     => 1,
            'time_format'   => 'd-m-Y H:i',
        ],
        [
            'key'           => 'field_popup_delay',
            'label'         => 'Uitstellen (ms)',
            'name'          => 'popup_delay',
            'type'          => 'number',
            'default_value' => 0,
        ],
        [
            'key'     => 'field_popup_sessions',
            'label'   => 'Sessies',
            'name'    => 'popup_sessions',
            'type'    => 'select',
            'choices' => [
                'once_per_visit'       => 'Elke bezoek één keer',
                'every_page'           => 'Elke pagina',
                'once_per_day'         => 'Eén keer per dag',
                'once_per_week'        => 'Eén keer per week',
                'once_per_month'       => 'Eén keer per maand',
                'once_per_year'        => 'Eén keer per jaar',
                'once_total'           => 'Eén keer in totaal',
                'five_times_per_visit' => '5 keer, één keer per bezoek',
            ],
            'default_value' => 'once_per_visit',
        ],

        // Target
        [
            'key'       => 'tab_target',
            'label'     => 'Target',
            'type'      => 'tab',
            'placement' => 'left',
        ],
        [
            'key'     => 'field_popup_action',
            'label'   => 'Actie',
            'name'    => 'popup_action',
            'type'    => 'select',
            'choices' => [
                'specific_pages' => 'Openen van specifieke pagina\'s',
                'click'          => 'Openen na klik',
            ],
            'default_value' => 'specific_pages',
        ],
        [
            'key'     => 'field_popup_pages_mode',
            'label'   => 'Tonen op',
            'name'    => 'popup_pages_mode',
            'type'    => 'button_group',
            'choices' => [
                'all'      => 'Alle pagina\'s',
                'selected' => 'Geselecteerde pagina\'s',
            ],
            'default_value'     => 'selected',
            'layout'            => 'horizontal',
            'instructions'      => 'Kies "Alle pagina\'s" om de popup overal op de website te tonen, zonder pagina\'s te moeten aanduiden.',
            'conditional_logic' => [
                [
                    [
                        'field'    => 'field_popup_action',
                        'operator' => '==',
                        'value'    => 'specific_pages',
                    ],
                ],
            ],
        ],
        [
            'key'           => 'field_popup_pages',
            'label'         => 'Pagina\'s',
            'name'          => 'popup_pages',
            'type'          => 'relationship',
            'post_type'     => ['page', 'post', 'product'],
            'return_format' => 'id',

            'instructions' => 'Selecteer hier de pagina\'s waarop deze popup mag verschijnen.',

            'conditional_logic' => [
                [
                    [
                        'field'    => 'field_popup_action',
                        'operator' => '==',
                        'value'    => 'specific_pages',
                    ],
                    [
                        'field'    => 'field_popup_pages_mode',
                        'operator' => '==',
                        'value'    => 'selected',
                    ],
                ],
            ],
        ],

        // Weergave
        [
            'key'       => 'tab_display',
            'label'     => 'Weergave',
            'type'      => 'tab',
            'placement' => 'left',
        ],
        [
            'key'           => 'field_popup_show_title',
            'label'         => 'Titel tonen',
            'name'          => 'popup_show_title',
            'type'          => 'true_false',
            'ui'            => 1,
            'default_value' => 1,
            'message'       => '',
            'instructions'  => 'Toon de titel van de popup bovenaan. Zet uit als je enkel de inhoud wilt tonen (de sluitknop blijft zichtbaar).',
        ],
        [
            'key'           => 'field_popup_style',
            'label'         => 'Stijl',
            'name'          => 'popup_style',
            'type'          => 'select',
            'choices'       => $choices['style'],
            'default_value' => 'default',
        ],
        [
            'key'           => 'field_popup_size',
            'label'         => 'Grootte',
            'name'          => 'popup_size',
            'type'          => 'select',
            'choices'       => $choices['size'],
            'default_value' => 'medium',
        ],
        [
            'key'           => 'field_popup_position',
            'label'         => 'Positie',
            'name'          => 'popup_position',
            'type'          => 'select',
            'choices'       => $choices['position'],
            'default_value' => 'center',
        ],
        [
            'key'           => 'field_popup_animation',
            'label'         => 'Animatie',
            'name'          => 'popup_animation',
            'type'          => 'select',
            'choices'       => $choices['animation'],
            'default_value' => 'slide_down',
        ],

        // Preview
        [
            'key'       => 'tab_preview',
            'label'     => 'Preview',
            'type'      => 'tab',
            'placement' => 'left',
        ],
        [
            'key'       => 'field_popup_preview',
            'label'     => 'Live voorbeeld',
            'name'      => 'popup_preview',
            'type'      => 'message',
            'message'   => '',
            'new_lines' => 'none',
            'esc_html'  => 0,
        ],

        // Advanced
        [
            'key'       => 'tab_advanced',
            'label'     => 'Geavanceerd',
            'type'      => 'tab',
            'placement' => 'left',
        ],

        [
            'key'       => 'field_popup_info',
            'label'     => 'Informatie',
            'name'      => 'popup_info',
            'type'      => 'message',
            'message'   => 'Hier kun je instellen hoe en wanneer de popup verschijnt. Kies een start- en eindtijd, en welke pagina\'s de popup moet tonen.',
            'new_lines' => 'wpautop',
            'esc_html'  => 0, // Laat HTML toe als je het wilt
        ],
        [
            'key'          => 'field_popup_custom_css',
            'label'        => 'Custom CSS',
            'name'         => 'popup_custom_css',
            'type'         => 'textarea',
            'instructions' => 'Voeg hier je eigen CSS toe om de popup verder te customizen.',
            'rows'         => 6,
        ],

    ],
    'location' => [
        [
            ['param' => 'post_type', 'operator' => '==', 'value' => 'popup'],

        ],
    ],

]);

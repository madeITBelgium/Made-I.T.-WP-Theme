<?php

function cptui_register_my_cpts_popup()
{
    /**
     * Post Type: Popup.
     */
    $labels = [
        'name'                     => esc_html__('Popup', 'madeit'),
        'singular_name'            => esc_html__('Popup', 'madeit'),
        'menu_name'                => esc_html__('Popup', 'madeit'),
        'all_items'                => esc_html__('Alle Popups', 'madeit'),
        'add_new'                  => esc_html__('Voeg nieuwe toe', 'madeit'),
        'add_new_item'             => esc_html__('Voeg nieuwe popup toe', 'madeit'),
        'edit_item'                => esc_html__('Wijzig Popup', 'madeit'),
        'new_item'                 => esc_html__('Nieuwe Popup', 'madeit'),
        'view_item'                => esc_html__('Bekijk Popup', 'madeit'),
        'view_items'               => esc_html__('Bekijk Popup', 'madeit'),
        'search_items'             => esc_html__('Zoek Popup', 'madeit'),
        'not_found'                => esc_html__('Geen Popup gevonden', 'madeit'),
        'not_found_in_trash'       => esc_html__('Geen Popup gevonden in prullenmand', 'madeit'),
        'parent'                   => esc_html__('Hoofd Popup:', 'madeit'),
        'featured_image'           => esc_html__('Featured image for this Popup', 'madeit'),
        'set_featured_image'       => esc_html__('Set featured image for this Popup', 'madeit'),
        'remove_featured_image'    => esc_html__('Remove featured image for this Popup', 'madeit'),
        'use_featured_image'       => esc_html__('Use as featured image for this Popup', 'madeit'),
        'archives'                 => esc_html__('Popup archives', 'madeit'),
        'insert_into_item'         => esc_html__('Insert into Popup', 'madeit'),
        'uploaded_to_this_item'    => esc_html__('Upload to this Popup', 'madeit'),
        'filter_items_list'        => esc_html__('Filter Popup list', 'madeit'),
        'items_list_navigation'    => esc_html__('Popup list navigation', 'madeit'),
        'items_list'               => esc_html__('Popup list', 'madeit'),
        'attributes'               => esc_html__('Popup attributes', 'madeit'),
        'name_admin_bar'           => esc_html__('Popup', 'madeit'),
        'item_published'           => esc_html__('Popup published', 'madeit'),
        'item_published_privately' => esc_html__('Popup published privately.', 'madeit'),
        'item_reverted_to_draft'   => esc_html__('Popup reverted to draft.', 'madeit'),
        'item_scheduled'           => esc_html__('Popup scheduled', 'madeit'),
        'item_updated'             => esc_html__('Popup updated.', 'madeit'),
        'parent_item_colon'        => esc_html__('Hoofd Popup:', 'madeit'),
    ];

    $args = [
        'label'                 => esc_html__('Popup', 'madeit'),
        'labels'                => $labels,
        'description'           => '',
        'public'                => false,
        'publicly_queryable'    => false,
        'show_ui'               => true,
        'show_in_rest'          => true,
        'rest_base'             => '',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'rest_namespace'        => 'wp/v2',
        'has_archive'           => false,
        'show_in_menu'          => true,
        'show_in_nav_menus'     => true,
        'delete_with_user'      => false,
        'exclude_from_search'   => false,
        'capability_type'       => 'post',
        'map_meta_cap'          => true,
        'hierarchical'          => false,
        'can_export'            => false,
        'rewrite'               => false,
        'query_var'             => false,
        'menu_icon'             => 'dashicons-megaphone',
        'supports'              => ['title', 'editor', 'revisions'],
        'show_in_graphql'       => false,
    ];

    register_post_type('popup', $args);
}

add_action('init', 'cptui_register_my_cpts_popup');

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group([
        'key'    => 'group_63c6dd0512326',
        'title'  => 'Popup',
        'fields' => [
            [
                'key'               => 'field_63c6dd05088eb',
                'label'             => 'Actie',
                'name'              => 'actie',
                'aria-label'        => '',
                'type'              => 'select',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'choices' => [
                    //'Openen van pagina' => 'Openen van pagina',
                    'Openen van specifieke pagina\'s' => 'Openen van specifieke pagina\'s',
                    //'Openen na klik' => 'Openen na klik',
                ],
                'default_value' => 'Openen van specifieke pagina\'s',
                'return_format' => 'value',
                'multiple'      => 0,
                'allow_null'    => 0,
                'ui'            => 0,
                'ajax'          => 0,
                'placeholder'   => '',
            ],
            [
                'key'               => 'field_63c6dd62088ec',
                'label'             => 'Uitgestellen (in milliseconden, 1seconde is 1000miliseconden)',
                'name'              => 'delay',
                'aria-label'        => '',
                'type'              => 'number',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'default_value' => 0,
                'min'           => '',
                'max'           => '',
                'placeholder'   => '',
                'step'          => '',
                'prepend'       => '',
                'append'        => '',
            ],
            [
                'key'               => 'field_63c6dd8a088ed',
                'label'             => 'Pagina\'s',
                'name'              => 'paginas',
                'aria-label'        => '',
                'type'              => 'relationship',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'post_type' => [
                    0 => 'page',
                    1 => 'post',
                    2 => 'product',
                ],
                'taxonomy' => '',
                'filters'  => [
                    0 => 'search',
                    1 => 'post_type',
                    2 => 'taxonomy',
                ],
                'return_format' => 'id',
                'min'           => '',
                'max'           => '',
                'elements'      => '',
            ],
            [
                'key'               => 'field_63c6dde8088ee',
                'label'             => 'Sessies',
                'name'              => 'sessies',
                'aria-label'        => '',
                'type'              => 'select',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'choices' => [
                    'Elke bezoek één keer'         => 'Elke bezoek één keer',
                    'Elke pagina'                  => 'Elke pagina',
                    'Eén keer per dag'             => 'Eén keer per dag',
                    'Eén keer per week'            => 'Eén keer per week',
                    'Eén keer per maand'           => 'Eén keer per maand',
                    'Eén keer per jaar'            => 'Eén keer per jaar',
                    'Eén keer in totaal'           => 'Eén keer in totaal',
                    '5 keer, één keer per bezoek'  => '5 keer, één keer per bezoek',
                    '10 keer, één keer per bezoek' => '10 keer, één keer per bezoek',
                ],
                'default_value' => 'Elke bezoek één keer',
                'return_format' => 'value',
                'multiple'      => 0,
                'allow_null'    => 0,
                'ui'            => 0,
                'ajax'          => 0,
                'placeholder'   => '',
            ],
        ],
        'location' => [
            [
                [
                    'param'    => 'post_type',
                    'operator' => '==',
                    'value'    => 'popup',
                ],
            ],
        ],
        'menu_order'            => 0,
        'position'              => 'normal',
        'style'                 => 'default',
        'label_placement'       => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen'        => '',
        'active'                => true,
        'description'           => '',
        'show_in_rest'          => 0,
    ]);
}

function madeit_add_popup()
{
    $pageId = get_the_ID();
    $popups = get_posts([
        'post_type'  => 'popup',
        'meta_query' => [
            [
                'key'     => 'paginas',
                'value'   => $pageId,
                'compare' => 'LIKE',
            ],

        ],
    ]);

    foreach ($popups as $popup) {
        ?>
        <!-- Modal -->
        <div class="modal fade madeit-popup" data-id="<?php echo $popup->ID; ?>" id="popup-<?php echo $popup->ID; ?>" tabindex="-1" aria-labelledby="popupModalLabel<?php echo $popup->ID; ?>" aria-hidden="true" data-action="<?php echo get_field('actie', $popup); ?>" data-delay="<?php echo get_field('delay', $popup); ?>" data-sessies="<?php echo get_field('sessies', $popup); ?>">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="popupModalLabel<?php echo $popup->ID; ?>"><?php echo $popup->post_title; ?></h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <?php
                        $content = $popup->post_content;
        echo apply_filters('the_content', $content); ?>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php _e('Close'); ?></button>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
}
add_action('wp_footer', 'madeit_add_popup');

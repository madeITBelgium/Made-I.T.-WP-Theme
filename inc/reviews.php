<?php
function cptui_register_my_cpts_review()
{

    /**
     * Post Type: Reviews.
     */
    $labels = [
        'name'                     => esc_html__('Reviews', 'madeit'),
        'singular_name'            => esc_html__('Review', 'madeit'),
        'menu_name'                => esc_html__('Reviews', 'madeit'),
        'all_items'                => esc_html__('All Reviews', 'madeit'),
        'add_new'                  => esc_html__('Add new', 'madeit'),
        'add_new_item'             => esc_html__('Add new Review', 'madeit'),
        'edit_item'                => esc_html__('Edit Review', 'madeit'),
        'new_item'                 => esc_html__('New Review', 'madeit'),
        'view_item'                => esc_html__('View Review', 'madeit'),
        'view_items'               => esc_html__('View Reviews', 'madeit'),
        'search_items'             => esc_html__('Search Reviews', 'madeit'),
        'not_found'                => esc_html__('No Reviews found', 'madeit'),
        'not_found_in_trash'       => esc_html__('No Reviews found in trash', 'madeit'),
        'parent'                   => esc_html__('Parent Review:', 'madeit'),
        'featured_image'           => esc_html__('Featured image for this Review', 'madeit'),
        'set_featured_image'       => esc_html__('Set featured image for this Review', 'madeit'),
        'remove_featured_image'    => esc_html__('Remove featured image for this Review', 'madeit'),
        'use_featured_image'       => esc_html__('Use as featured image for this Review', 'madeit'),
        'archives'                 => esc_html__('Review archives', 'madeit'),
        'insert_into_item'         => esc_html__('Insert into Review', 'madeit'),
        'uploaded_to_this_item'    => esc_html__('Upload to this Review', 'madeit'),
        'filter_items_list'        => esc_html__('Filter Reviews list', 'madeit'),
        'items_list_navigation'    => esc_html__('Reviews list navigation', 'madeit'),
        'items_list'               => esc_html__('Reviews list', 'madeit'),
        'attributes'               => esc_html__('Reviews attributes', 'madeit'),
        'name_admin_bar'           => esc_html__('Review', 'madeit'),
        'item_published'           => esc_html__('Review published', 'madeit'),
        'item_published_privately' => esc_html__('Review published privately.', 'madeit'),
        'item_reverted_to_draft'   => esc_html__('Review reverted to draft.', 'madeit'),
        'item_scheduled'           => esc_html__('Review scheduled', 'madeit'),
        'item_updated'             => esc_html__('Review updated.', 'madeit'),
        'parent_item_colon'        => esc_html__('Parent Review:', 'madeit'),
    ];

    $args = [
        'label'                 => esc_html__('Reviews', 'madeit'),
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
        'exclude_from_search'   => true,
        'capability_type'       => 'post',
        'map_meta_cap'          => true,
        'hierarchical'          => false,
        'can_export'            => true,
        'rewrite'               => ['slug' => 'review', 'with_front' => false],
        'query_var'             => true,
        'supports'              => ['title'],
        'show_in_graphql'       => false,
    ];

    register_post_type('review', $args);
}

add_action('init', 'cptui_register_my_cpts_review');

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group([
        'key'    => 'group_6320a45d1dacc',
        'title'  => 'Reviews',
        'fields' => [
            [
                'key'               => 'field_6320a46330e4d',
                'label'             => 'Naam',
                'name'              => 'naam',
                'type'              => 'text',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'default_value' => '',
                'placeholder'   => '',
                'prepend'       => '',
                'append'        => '',
                'maxlength'     => '',
            ],
            [
                'key'               => 'field_6320a47030e4e',
                'label'             => 'E-mailadres',
                'name'              => 'e-mailadres',
                'type'              => 'email',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'default_value' => '',
                'placeholder'   => '',
                'prepend'       => '',
                'append'        => '',
            ],
            [
                'key'               => 'field_6320a47930e4f',
                'label'             => 'Bericht',
                'name'              => 'bericht',
                'type'              => 'wysiwyg',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'default_value' => '',
                'tabs'          => 'all',
                'toolbar'       => 'full',
                'media_upload'  => 1,
                'delay'         => 0,
            ],
            [
                'key'               => 'field_6320a48a30e50',
                'label'             => 'rating',
                'name'              => 'rating',
                'type'              => 'number',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'default_value' => 5,
                'placeholder'   => '',
                'prepend'       => '',
                'append'        => '',
                'min'           => 1,
                'max'           => 5,
                'step'          => 1,
            ],
        ],
        'location' => [
            [
                [
                    'param'    => 'post_type',
                    'operator' => '==',
                    'value'    => 'review',
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

function show_reviews()
{
    ob_start();

    $args = [
        'post_type' => 'review',
    ];

    $reviews = get_posts($args);

    $reviewCardClass = apply_filters('madeit_reviews_card_class', ['card', 'border-0', 'h-100']); ?>
    <div id="carouselReviewControls" class="carousel slide" data-ride="carousel" data-interval="5000" >
        <div class="carousel-inner row w-100 mx-auto reviews">
            <?php foreach ($reviews as $i => $review) {
        ?>
                <div class="carousel-item col-md-4 <?php echo $i === 0 ? 'active' : ''; ?>">
                    <div class="<?php echo implode(' ', $reviewCardClass); ?>">
                        <div class="card-body p-3 d-flex flex-column">
                            <h4 class="mb-2 text-center"><?php echo esc_html($review->post_title); ?></h4>
                            <p class="text-center">"<?php echo esc_html(str_replace(['<p>', '</p>'], '', get_field('bericht', $review))); ?>"</p>
                            <p class="text-center mt-auto">- <?php echo esc_html(get_field('naam', $review)); ?> -</p>
                            <div class="text-center">
                                <?php
                                for ($i = 1; $i <= 5; $i++) {
                                    if ($i <= get_field('rating', $review)) {
                                        ?>
                                        <i class="fas fa-star text-gold"></i>
                                        <?php
                                    } else {
                                        ?>
                                        <i class="far fa-star text-gold"></i>
                                        <?php
                                    }
                                } ?>
                            </div>
                        </div>
                    </div>
                </div>
            <?php
    } ?>
        </div>
        <a class="carousel-control-prev" href="#carouselReviewControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only"><?php echo __('Vorige', 'madeit'); ?></span>
        </a>
        <a class="carousel-control-next" href="#carouselReviewControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only"><?php echo __('Volgend', 'madeit'); ?></span>
        </a>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('show_reviews', 'show_reviews');

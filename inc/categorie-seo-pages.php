<?php

function madeit_categorie_seo_pages_wpml_current_language()
{
    if (has_filter('wpml_current_language')) {
        return apply_filters('wpml_current_language', null);
    }

    return null;
}

function madeit_categorie_seo_pages_wpml_default_language()
{
    if (has_filter('wpml_default_language')) {
        return apply_filters('wpml_default_language', null);
    }

    return null;
}

function madeit_categorie_seo_pages_wpml_term_lookup_ids($termId, $taxonomy)
{
    $ids = [(int) $termId];

    if (!has_filter('wpml_object_id')) {
        return $ids;
    }

    $defaultLanguage = madeit_categorie_seo_pages_wpml_default_language();

    if (!empty($defaultLanguage)) {
        $defaultLanguageTermId = apply_filters('wpml_object_id', (int) $termId, $taxonomy, true, $defaultLanguage);
        if (!empty($defaultLanguageTermId)) {
            $ids[] = (int) $defaultLanguageTermId;
        }
    }

    return array_values(array_unique(array_filter($ids)));
}

function madeit_categorie_seo_pages_wpml_translate_post_id($postId)
{
    if (!has_filter('wpml_object_id')) {
        return (int) $postId;
    }

    $currentLanguage = madeit_categorie_seo_pages_wpml_current_language();

    if (empty($currentLanguage)) {
        return (int) $postId;
    }

    $translatedId = apply_filters('wpml_object_id', (int) $postId, 'categorie-pagina', true, $currentLanguage);

    return !empty($translatedId) ? (int) $translatedId : (int) $postId;
}

function madeit_categorie_seo_pages_get_posts_for_position($termId, $positie)
{
    $taxonomy = is_product_tag() ? 'product_tag' : 'product_cat';
    $termLookupIds = madeit_categorie_seo_pages_wpml_term_lookup_ids($termId, $taxonomy);

    $queryArgs = [
        'post_type'      => 'categorie-pagina',
        'post_status'    => 'publish',
        'posts_per_page' => 1,
        'suppress_filters' => false,
        'meta_query'     => [
            [
                'key'     => 'categorie',
                'value'   => $termLookupIds,
                'compare' => 'IN',
            ],
            [
                'key'     => 'positie',
                'value'   => $positie,
                'compare' => '=',
            ],
        ],
    ];

    $currentLanguage = madeit_categorie_seo_pages_wpml_current_language();
    if (!empty($currentLanguage)) {
        $queryArgs['lang'] = $currentLanguage;
    }

    $categoriePages = get_posts($queryArgs);

    if (!empty($categoriePages)) {
        return $categoriePages;
    }

    if (empty($currentLanguage)) {
        return $categoriePages;
    }

    $fallbackArgs = $queryArgs;
    $fallbackArgs['lang'] = 'all';
    $fallbackPosts = get_posts($fallbackArgs);

    if (empty($fallbackPosts)) {
        return [];
    }

    $translatedPostId = madeit_categorie_seo_pages_wpml_translate_post_id($fallbackPosts[0]->ID);
    $translatedPost = get_post($translatedPostId);

    if ($translatedPost instanceof WP_Post && 'publish' === $translatedPost->post_status) {
        return [$translatedPost];
    }

    return [];
}

function madeit_categorie_seo_pages_render($categoriePages, $showDivider = false)
{
    if (empty($categoriePages)) {
        return;
    }

    if ($showDivider) {
        echo '<div class="categorie-seo-page-devider mt-5"></div>';
    }

    foreach ($categoriePages as $categoriePage) {
        if (false !== strpos($categoriePage->post_content, '<!-- wp:madeit/block-container') || false !== strpos($categoriePage->post_content, '<!-- wp:madeit/block-content')) {
            echo apply_filters('the_content', $categoriePage->post_content);
        } else {
            echo "<div class='container'>";
            echo "<div class='row'>";
            echo "<div class='col-12'>";
            echo apply_filters('the_content', $categoriePage->post_content);
            echo '</div>';
            echo '</div>';
            echo '</div>';
        }
    }
}

add_action('woocommerce_after_main_content', 'madeit_categorie_seo_pages_woo_after_main_content', 10);
function madeit_categorie_seo_pages_woo_after_main_content()
{
    //Check if the current page is a product category or tag archive
    if (is_product_category() /*|| is_product_tag()*/) {
        // Get the current category or tag
        $term = get_queried_object();

        if (!isset($term->term_id)) {
            return;
        }

        $termId = $term->term_id;
        $categoriePages = madeit_categorie_seo_pages_get_posts_for_position($termId, 'Onderaan');
        madeit_categorie_seo_pages_render($categoriePages, true);
    }
}

add_action('woocommerce_before_main_content', 'madeit_categorie_seo_pages_woo_before_main_content', 10);
function madeit_categorie_seo_pages_woo_before_main_content()
{
    //Check if the current page is a product category or tag archive
    if (is_product_category() /*|| is_product_tag()*/) {
        // Get the current category or tag
        $term = get_queried_object();

        if (!isset($term->term_id)) {
            return;
        }

        $termId = $term->term_id;
        $categoriePages = madeit_categorie_seo_pages_get_posts_for_position($termId, 'Bovenaan');
        madeit_categorie_seo_pages_render($categoriePages);
    }
}

add_action('woocommerce_shop_loop_header', 'madeit_categorie_seo_pages_woocommerce_shop_loop_header', 31);
function madeit_categorie_seo_pages_woocommerce_shop_loop_header()
{
    //Check if the current page is a product category or tag archive
    if (is_product_category() /*|| is_product_tag()*/) {
        // Get the current category or tag
        $term = get_queried_object();

        if (!isset($term->term_id)) {
            return;
        }

        $termId = $term->term_id;
        $categoriePages = madeit_categorie_seo_pages_get_posts_for_position($termId, 'Onder titel');
        madeit_categorie_seo_pages_render($categoriePages, true);
    }
}

add_action('acf/include_fields', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key'    => 'group_687a310ae4574',
        'title'  => 'Categorie pagina\'s',
        'fields' => [
            [
                'key'               => 'field_687a310b20eaf',
                'label'             => 'Positie',
                'name'              => 'positie',
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
                    'Onderaan'    => 'Onderaan',
                    'Onder titel' => 'Onder titel',
                    'Bovenaan'    => 'Bovenaan',
                ],
                'default_value'     => 'Onderaan',
                'return_format'     => 'value',
                'multiple'          => 0,
                'allow_null'        => 0,
                'allow_in_bindings' => 0,
                'ui'                => 0,
                'ajax'              => 0,
                'placeholder'       => '',
                'create_options'    => 0,
                'save_options'      => 0,
            ],
            [
                'key'               => 'field_687a332103a40',
                'label'             => 'Categorie',
                'name'              => 'categorie',
                'aria-label'        => '',
                'type'              => 'taxonomy',
                'instructions'      => '',
                'required'          => 0,
                'conditional_logic' => 0,
                'wrapper'           => [
                    'width' => '',
                    'class' => '',
                    'id'    => '',
                ],
                'taxonomy'             => 'product_cat',
                'add_term'             => 0,
                'save_terms'           => 1,
                'load_terms'           => 0,
                'return_format'        => 'id',
                'field_type'           => 'radio',
                'allow_null'           => 0,
                'allow_in_bindings'    => 0,
                'bidirectional'        => 0,
                'multiple'             => 0,
                'bidirectional_target' => [
                ],
            ],
        ],
        'location' => [
            [
                [
                    'param'    => 'post_type',
                    'operator' => '==',
                    'value'    => 'categorie-pagina',
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
});

add_action('init', function () {
    register_post_type('categorie-pagina', [
        'labels' => [
            'name'                     => 'Categorie pagina\'s',
            'singular_name'            => 'Categorie pagina',
            'menu_name'                => 'Categorie pagina\'s',
            'all_items'                => 'Alle Categorie pagina\'s',
            'edit_item'                => 'Bewerk Categorie pagina',
            'view_item'                => 'Bekijk Categorie pagina',
            'view_items'               => 'Bekijk Categorie pagina\'s',
            'add_new_item'             => 'Nieuwe Categorie pagina toevoegen',
            'add_new'                  => 'Nieuwe Categorie pagina toevoegen',
            'new_item'                 => 'Nieuw Categorie pagina',
            'parent_item_colon'        => 'Hoofd Categorie pagina:',
            'search_items'             => 'Zoek Categorie pagina\'s',
            'not_found'                => 'Geen categorie pagina\'s gevonden',
            'not_found_in_trash'       => 'Geen categorie pagina\'s gevonden in de prullenmand',
            'archives'                 => 'Categorie pagina archieven',
            'attributes'               => 'Categorie pagina attributen',
            'insert_into_item'         => 'Invoegen in categorie pagina',
            'uploaded_to_this_item'    => 'Geüpload naar deze categorie pagina',
            'filter_items_list'        => 'Filter categorie pagina\'s lijst',
            'filter_by_date'           => 'Filter categorie pagina\'s op datum',
            'items_list_navigation'    => 'Categorie pagina\'s lijst navigatie',
            'items_list'               => 'Categorie pagina\'s lijst',
            'item_published'           => 'Categorie pagina gepubliceerd.',
            'item_published_privately' => 'Categorie pagina privé gepubliceerd.',
            'item_reverted_to_draft'   => 'Categorie pagina teruggezet naar het concept.',
            'item_scheduled'           => 'Categorie pagina gepland.',
            'item_updated'             => 'Categorie pagina bijgewerkt.',
            'item_link'                => 'Categorie pagina link',
            'item_link_description'    => 'Een link naar een categorie pagina.',
        ],
        'public'              => false,
        'exclude_from_search' => false,
        'show_ui'             => true,
        'show_in_nav_menus'   => true,
        'show_in_rest'        => true,
        'menu_icon'           => 'dashicons-admin-post',
        'supports'            => [
            0 => 'title',
            1 => 'author',
            2 => 'editor',
            3 => 'revisions',
            4 => 'custom-fields',
        ],
        'rewrite'          => false,
        'delete_with_user' => false,
    ]);
});

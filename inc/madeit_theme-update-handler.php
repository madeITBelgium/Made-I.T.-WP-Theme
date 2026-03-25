<?php

/**
 * Blokkeer update als 'container-simple' block gebruikt wordt.
 */
function madeit_container_simple_exists()
{
    $posts = get_posts([
        // check all the post types, including custom post types, to ensure we catch all instances of the block
        'post_type' => 'any',
        // we only need to check a limited number of posts to determine if the block is used
        'posts_per_page' => 20,
    ]);

    foreach ($posts as $post) {
        // check if any of the specified blocks are used in the post content
        if (has_block([
            'madeit/block-column-simple',
            'madeit/block-container-simple',
            'madeit/block-row-simple',

        ], $post)) {
            // if we find a post that uses any of the specified blocks, we can stop checking further and return true
            return true;
        }
    }

    // if we finish checking all the posts and don't find any that use the specified blocks, we return false
    return false;
}

add_filter('site_transient_update_themes', function ($transient) {
    // als de container-simple block gebruikt wordt, blokkeren we de update voor het thema
    if (madeit_container_simple_exists()) {
        // we get the current theme's stylesheet (which is the folder name of the theme) to identify it in the update transient
        $theme = wp_get_theme()->get_stylesheet();

        // we check if the theme is listed in the update transient, and if it is, we remove it to block the update
        if (isset($transient->response[$theme])) {
            unset($transient->response[$theme]); // update blokkeren
        }
    }

    return $transient;
});

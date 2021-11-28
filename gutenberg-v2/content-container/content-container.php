<?php

function madeit_content_container_block_assets()
{
    wp_register_style('content-container-madeit-style-css', get_template_directory_uri().'/gutenberg-v2/content-container/build/style-index.css', ['wp-editor'], null);

    // Register block editor script for backend.
    wp_register_script('content-container-madeit-block-js', get_template_directory_uri().'/gutenberg-v2/content-container/build/index.js', ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'], null, true);

    // Register block editor styles for backend.
    wp_register_style('content-container-madeit-block-editor-css', get_template_directory_uri().'/gutenberg-v2/content-container/build/index.css', ['wp-edit-blocks'], null);

    register_block_type('madeit/block-content', [
        'style'         => 'content-container-madeit-style-css',
        'editor_script' => 'content-container-madeit-block-js',
        'editor_style'  => 'content-container-madeit-block-editor-css',
    ]);
}

add_action('init', 'madeit_content_container_block_assets');

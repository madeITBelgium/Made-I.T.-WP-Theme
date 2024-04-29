<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

function madeit_tabs_block_assets()
{
    wp_register_style('tabs-madeit-style-css', get_template_directory_uri().'/gutenberg/tabs/build/style-index.css', ['wp-editor'], null);

    // Register block editor script for backend.
    wp_register_script('tabs-madeit-block-js', get_template_directory_uri().'/gutenberg/tabs/build/index.js', ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'], null, true);

    // Register block editor styles for backend.
    wp_register_style('tabs-madeit-block-editor-css', get_template_directory_uri().'/gutenberg/tabs/build/index.css', ['wp-edit-blocks'], null);

    register_block_type('madeit/block-tabs', [
        'style'         => 'tabs-madeit-style-css',
        'editor_script' => 'tabs-madeit-block-js',
        'editor_style'  => 'tabs-madeit-block-editor-css',
    ]);
}

add_action('init', 'madeit_tabs_block_assets');

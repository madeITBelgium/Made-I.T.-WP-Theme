<?php
/**
 * Blocks Initializer.
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}



function madeit_card_block_assets()
{
    wp_register_style('card-madeit-style-css', get_template_directory_uri().'/gutenberg/card/build/style-index.css', ['wp-editor'], null);

    // Register block editor script for backend.
    wp_register_script('card-madeit-block-js', get_template_directory_uri().'/gutenberg/card/build/index.js', ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'], null, true);

    // Register block editor styles for backend.
    wp_register_style('card-madeit-block-editor-css', get_template_directory_uri().'/gutenberg/card/build/index.css', ['wp-edit-blocks'], null);

    register_block_type('madeit/block-card', [
        'style'         => 'card-madeit-style-css',
        'editor_script' => 'card-madeit-block-js',
        'editor_style'  => 'card-madeit-block-editor-css',
    ]);
}

add_action('init', 'madeit_card_block_assets');
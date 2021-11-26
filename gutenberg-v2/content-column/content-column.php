<?php
/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/writing-your-first-block-type/
 */


function madeit_content_column_block_assets()
{
    //wp_register_style('content-column-madeit-style-css', get_template_directory_uri().'/gutenberg-v2/content-column/build/style-index.css', ['wp-editor'], null);

    // Register block editor script for backend.
    wp_register_script('content-column-madeit-block-js', get_template_directory_uri().'/gutenberg-v2/content-column/build/index.js', ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'], null, true);

    // Register block editor styles for backend.
    //wp_register_style('content-column-madeit-block-editor-css', get_template_directory_uri().'/gutenberg-v2/content-column/build/index.css', ['wp-edit-blocks'], null);

    register_block_type('madeit/block-content-column', [
        //'style' => 'content-column-madeit-style-css',
        'editor_script' => 'content-column-madeit-block-js',
        //'editor_style'  => 'content-column-madeit-block-editor-css',
    ]);
}

add_action('init', 'madeit_content_column_block_assets');

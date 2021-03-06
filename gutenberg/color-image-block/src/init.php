<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function color_image_block_madeit_block_assets()
{
    // Styles.
    wp_enqueue_style(
        'color-image-block-madeit-style-css', // Handle.
        get_template_directory_uri().'/gutenberg/color-image-block/dist/blocks.style.build.css', // Block style CSS.
        ['wp-editor'] // Dependency to include the CSS after it.
        // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: filemtime — Gets file modification time.
    );
} // End function color-image-block_madeit_block_assets().

// Hook: Frontend assets.
add_action('enqueue_block_assets', 'color_image_block_madeit_block_assets');

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function color_image_block_madeit_editor_assets()
{
    // Scripts.
    wp_enqueue_script(
        'color-image-block-madeit-block-js', // Handle.
        get_template_directory_uri().'/gutenberg/color-image-block/dist/blocks.build.js',  // Block.build.js: We register the block here. Built with Webpack.
        ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-editor'], // Dependencies, defined above.
        // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
        true // Enqueue the script in the footer.
    );

    // Styles.
    wp_enqueue_style(
        'color-image-block-madeit-block-editor-css', // Handle.
        get_template_directory_uri().'/gutenberg/color-image-block/dist/blocks.editor.build.css', // Block editor CSS.
        ['wp-edit-blocks'] // Dependency to include the CSS after it.
        // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: filemtime — Gets file modification time.
    );
} // End function color-image-block_madeit_editor_assets().

// Hook: Editor assets.
add_action('enqueue_block_editor_assets', 'color_image_block_madeit_editor_assets');

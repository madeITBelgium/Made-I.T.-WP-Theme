<?php

function madeit_advanced_controls_block_assets(): void
{
    $handle = 'madeit-advanced-controls';
    $rel = 'gutenberg/blocks/advanced-controls/build/index.js';

    $src = get_parent_theme_file_uri($rel);
    $path = get_parent_theme_file_path($rel);
    $version = is_readable($path) ? (string) filemtime($path) : MADEIT_BLOCKS_VERSION;

    wp_enqueue_script(
        $handle,
        $src,
        [
            'wp-blocks',
            'wp-hooks',
            'wp-compose',
            'wp-element',
            'wp-i18n',
            'wp-data',
            'wp-components',
            'wp-block-editor',
        ],
        $version,
        true
    );
}
add_action('enqueue_block_editor_assets', 'madeit_advanced_controls_block_assets');

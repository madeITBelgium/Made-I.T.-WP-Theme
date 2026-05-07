<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_separator_extension_assets()
{
    $dir = get_template_directory();
    $uri = get_template_directory_uri();

    wp_enqueue_script(
        'madeit-separator-extension',
        $uri.'/inc/core/separator-extension/assets/separator.js',
        [
            'wp-blocks',
            'wp-element',
            'wp-hooks',
            'wp-compose',
            'wp-components',
            'wp-block-editor',
        ],
        filemtime($dir.'/inc/core/separator-extension/assets/separator.js'),
        true
    );

    wp_enqueue_style(
        'madeit-separator-extension',
        $uri.'/inc/core/separator-extension/assets/separator.css',
        [],
        filemtime($dir.'/inc/core/separator-extension/assets/separator.css')
    );
}

add_action('enqueue_block_editor_assets', 'madeit_separator_extension_assets');
add_action('enqueue_block_assets', 'madeit_separator_extension_assets');

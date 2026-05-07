<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_image_extention_assets()
{
    $dir = get_template_directory();
    $uri = get_template_directory_uri();

    wp_enqueue_script(
        'madeit-image-extention',
        $uri.'/inc/core/image-extention/assets/image.js',
        [
            'wp-blocks',
            'wp-element',
            'wp-hooks',
            'wp-compose',
            'wp-components',
            'wp-block-editor',
        ],
        filemtime($dir.'/inc/core/image-extention/assets/image.js'),
        true
    );

    wp_enqueue_style(
        'madeit-image-extention',
        $uri.'/inc/core/image-extention/assets/image.css',
        [],
        filemtime($dir.'/inc/core/image-extention/assets/image.css')
    );
}

add_action('enqueue_block_editor_assets', 'madeit_image_extention_assets');
add_action('enqueue_block_assets', 'madeit_image_extention_assets');

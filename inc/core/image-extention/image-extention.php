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
        MADEIT_VERSION,
        true
    );

    wp_enqueue_style(
        'madeit-image-extention',
        $uri.'/inc/core/image-extention/assets/image.css',
        [],
        MADEIT_VERSION
    );
}

add_action('enqueue_block_editor_assets', 'madeit_image_extention_assets');

function madeit_image_extention_frontend_assets()
{
    $dir = get_template_directory();
    $uri = get_template_directory_uri();

    wp_enqueue_style(
        'madeit-image-extention',
        $uri.'/inc/core/image-extention/assets/image.css',
        [],
        MADEIT_VERSION
    );
}

add_action('wp_enqueue_scripts', 'madeit_image_extention_frontend_assets');

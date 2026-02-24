<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

function madeit_tabs_block_assets()
{
    $asset_file = get_theme_file_path('gutenberg/blocks/tabs/build/index.asset.php');
    $asset = is_readable($asset_file) ? require $asset_file : [
        'dependencies' => ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'],
        'version' => null,
    ];

    wp_register_style(
        'tabs-madeit-style-css',
        get_theme_file_uri('gutenberg/blocks/tabs/build/style-index.css'),
        ['wp-editor'],
        $asset['version'] ?? null
    );

    // Register block editor script for backend.
    wp_register_script(
        'tabs-madeit-block-js',
        get_theme_file_uri('gutenberg/blocks/tabs/build/index.js'),
        $asset['dependencies'] ?? ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'],
        $asset['version'] ?? null,
        true
    );

    // Register block editor styles for backend.
    wp_register_style(
        'tabs-madeit-block-editor-css',
        get_theme_file_uri('gutenberg/blocks/tabs/build/index.css'),
        ['wp-edit-blocks'],
        $asset['version'] ?? null
    );

    register_block_type('madeit/block-tabs', [
        'style'         => 'tabs-madeit-style-css',
        'editor_script' => 'tabs-madeit-block-js',
        'editor_style'  => 'tabs-madeit-block-editor-css',
    ]);
}

if (did_action('init')) {
    madeit_tabs_block_assets();
} else {
    add_action('init', 'madeit_tabs_block_assets');
}

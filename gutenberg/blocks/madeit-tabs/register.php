<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_block_tabs_assets()
{
    if (function_exists('register_block_type')) {
        register_block_type(__DIR__);
    }
}

// Ensure FontAwesome is available for this block (editor + frontend) so icon previews work.
add_action('enqueue_block_editor_assets', function (): void {
    wp_enqueue_style(
        'madeit-fontawesome-5',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
        [],
        '5.15.4'
    );
});

add_action('enqueue_block_assets', function (): void {
    if (!function_exists('has_block')) {
        return;
    }

    if (is_admin()) {
        return;
    }

    if (has_block('madeit/block-tabs')) {
        wp_enqueue_style(
            'madeit-fontawesome-5',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
            [],
            '5.15.4'
        );
    }
});

if (function_exists('did_action') && did_action('init')) {
    madeit_block_tabs_assets();
} else {
    add_action('init', 'madeit_block_tabs_assets');
}

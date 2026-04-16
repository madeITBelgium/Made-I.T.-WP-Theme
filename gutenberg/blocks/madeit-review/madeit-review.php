<?php

if (!defined('ABSPATH')) {
    exit;
}

$madeit_register_review_block = function (): void {
    register_block_type(__DIR__.'/build');
};

if (function_exists('did_action') && did_action('init')) {
    $madeit_register_review_block();
} else {
    add_action('init', $madeit_register_review_block);
}

add_action('enqueue_block_assets', function (): void {
    // Swiper assets (shared with other blocks, same handles as madeit-slider).
    wp_enqueue_style('swiper-css', 'https://unpkg.com/swiper@11/swiper-bundle.min.css');
    wp_enqueue_script('swiper-js', 'https://unpkg.com/swiper@11/swiper-bundle.min.js', [], null, true);

    $init_path = __DIR__.'/init-swiper.js';
    if (is_readable($init_path)) {
        wp_add_inline_script('swiper-js', (string) file_get_contents($init_path));
    }
});

add_action('enqueue_block_editor_assets', function (): void {
    // Ensure Swiper is available for ServerSideRender previews in the editor.
    wp_enqueue_style('swiper-css', 'https://unpkg.com/swiper@11/swiper-bundle.min.css');
    wp_enqueue_script('swiper-js', 'https://unpkg.com/swiper@11/swiper-bundle.min.js', [], null, true);

    $init_path = __DIR__.'/init-swiper.js';
    if (is_readable($init_path)) {
        wp_add_inline_script('swiper-js', (string) file_get_contents($init_path));
    }
});

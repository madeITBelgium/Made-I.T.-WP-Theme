<?php

/**
 * Plugin Name: madeit-slider
 * Description: A customizable Gutenberg slider using Swiper.js
 * Version: 1.0
 * Author: Made I.T.
 */
$madeit_register_slider_blocks = function (): void {
    // Registreer via metadata in de build folder (wp-scripts kopieert src/block.json naar build/block.json).
    register_block_type(__DIR__.'/build');
    // Child block (slider-image) is a separate entrypoint; register it too.
    register_block_type(__DIR__.'/build/image');
};

if (function_exists('did_action') && did_action('init')) {
    $madeit_register_slider_blocks();
} else {
    add_action('init', $madeit_register_slider_blocks);
}

add_action('enqueue_block_assets', function () {
    // Gebruik Swiper CDN voor frontend
    wp_enqueue_style('swiper-css', 'https://unpkg.com/swiper@11/swiper-bundle.min.css');
    wp_enqueue_script('swiper-js', 'https://unpkg.com/swiper@11/swiper-bundle.min.js', [], null, true);

    // Voeg inline JS toe (Swiper init)
    wp_add_inline_script('swiper-js', file_get_contents(__DIR__.'/init-swiper.js'));
});

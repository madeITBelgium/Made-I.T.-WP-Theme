<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_block_maps_assets()
{
    if (function_exists('register_block_type')) {
        register_block_type(__DIR__);
    }
}

// Leaflet assets (editor + frontend).
add_action('enqueue_block_assets', function () {
    wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', [], null);
    wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', [], null, true);
});

if (function_exists('did_action') && did_action('init')) {
    madeit_block_maps_assets();
} else {
    add_action('init', 'madeit_block_maps_assets');
}

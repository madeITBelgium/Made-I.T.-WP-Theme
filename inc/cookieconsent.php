<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_enqueue_cookieconsent_assets()
{
    if (is_admin()) {
        return;
    }

    $css_rel = '/assets/css/cookieconsent.css';
    $js_rel = '/assets/js/cookieconsent.js';
    $conf_rel = '/assets/js/cookieconsent-config.js';

    $css_path = get_theme_file_path($css_rel);
    $js_path = get_theme_file_path($js_rel);
    $conf_path = get_theme_file_path($conf_rel);

    if (file_exists($css_path)) {
        wp_enqueue_style(
            'madeit-cookieconsent',
            get_theme_file_uri($css_rel),
            [],
            MADEIT_VERSION
        );
    }

    if (file_exists($js_path)) {
        wp_enqueue_script(
            'madeit-cookieconsent',
            get_theme_file_uri($js_rel),
            [],
            MADEIT_VERSION,
            true
        );
    }

    if (file_exists($conf_path)) {
        wp_enqueue_script(
            'madeit-cookieconsent-config',
            get_theme_file_uri($conf_rel),
            ['madeit-cookieconsent'],
            MADEIT_VERSION,
            true
        );
    }
}

add_action('wp_enqueue_scripts', 'madeit_enqueue_cookieconsent_assets', 20);

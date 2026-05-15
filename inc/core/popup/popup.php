<?php

/**
 * Plugin Name: Popup
 * Description: Modern popup system, volledig onafhankelijk van bestaande popups.
 * Version: 1.0.0
 * Author: Made I.T.
 */
if (!defined('ABSPATH')) {
    exit;
}

define('MPOPUP_VERSION', '1.0.0');
define('MPOPUP_PATH', get_parent_theme_file_path()); // Lokaal pad
define('MPOPUP_URL', get_parent_theme_file_uri()); // URL voor assets

// Includes
require_once MPOPUP_PATH.'/inc/core/popup/includes/post-type.php';
require_once MPOPUP_PATH.'/inc/core/popup/includes/fields.php';
require_once MPOPUP_PATH.'/inc/core/popup/includes/helper.php';
require_once MPOPUP_PATH.'/inc/core/popup/includes/frontend.php';

// Assets
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('popup-css', MPOPUP_URL.'/inc/core/popup/assets/css/popup.css', [], MPOPUP_VERSION);
    wp_enqueue_script('popup-js', MPOPUP_URL.'/inc/core/popup/assets/js/popup.js', ['jquery', 'bootstrap'], MPOPUP_VERSION, true);
});

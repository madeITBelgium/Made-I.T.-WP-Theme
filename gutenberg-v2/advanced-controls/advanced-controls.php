<?php

function madeit_advanced_controls_block_assets()
{
    wp_enqueue_script('advanced-controls-madeit-block-js', get_template_directory_uri().'/gutenberg-v2/advanced-controls/build/index.js', ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'], null, true);
}
add_action('init', 'madeit_advanced_controls_block_assets');

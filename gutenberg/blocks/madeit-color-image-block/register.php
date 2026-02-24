<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_color_image_block_register()
{
    register_block_type(__DIR__);
}

if (did_action('init')) {
    madeit_color_image_block_register();
} else {
    add_action('init', 'madeit_color_image_block_register');
}

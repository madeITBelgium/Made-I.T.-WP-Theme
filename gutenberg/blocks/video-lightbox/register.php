<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_register_video_lightbox_block()
{
    if (function_exists('register_block_type')) {
        register_block_type(__DIR__);
    }
}

if (function_exists('did_action') && did_action('init')) {
    madeit_register_video_lightbox_block();
} else {
    add_action('init', 'madeit_register_video_lightbox_block');
}

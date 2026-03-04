<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_block_card_assets()
{
    if (function_exists('register_block_type')) {
        register_block_type(__DIR__);
    }
}

if (function_exists('did_action') && did_action('init')) {
    madeit_block_card_assets();
} else {
    add_action('init', 'madeit_block_card_assets');
}

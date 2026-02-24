<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_content_column_block_assets()
{
    // Register via block.json.
    if (function_exists('register_block_type')) {
        register_block_type(__DIR__);
    }
}

if (function_exists('did_action') && did_action('init')) {
    madeit_content_column_block_assets();
} else {
    add_action('init', 'madeit_content_column_block_assets');
}

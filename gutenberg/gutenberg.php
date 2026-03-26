<?php

/**
 * Made I.T.: Gutenberg.
 *
 * @since 1.1
 */
if (!defined('ABSPATH')) {
    exit;
}

if (MADEIT_ADVANCED_BLOCKS) {
    require get_parent_theme_file_path('/gutenberg/container/plugin.php');
    require get_parent_theme_file_path('/gutenberg/container-simple/plugin.php');
}
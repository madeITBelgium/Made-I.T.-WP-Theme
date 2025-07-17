<?php

/**
 * Made I.T.: Gutenberg.
 *
 * @since 1.1
 */
if (!defined('ABSPATH')) {
    exit;
}

function madeit_filter_block_categories_when_post_provided($block_categories, $editor_context)
{
    if (!empty($editor_context->post)) {
        array_push(
            $block_categories,
            [
                'slug'  => 'madeit',
                'title' => __('Made I.T.', 'madeit'),
                'icon'  => null,
            ]
        );
    }

    return $block_categories;
}
add_filter('block_categories_all', 'madeit_filter_block_categories_when_post_provided', 10, 2);

require get_parent_theme_file_path('/gutenberg-v2/content-container/content-container.php');
require get_parent_theme_file_path('/gutenberg-v2/content-column/content-column.php');
require get_parent_theme_file_path('/gutenberg-v2/advanced-controls/advanced-controls.php');

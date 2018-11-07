<?php
/**
 * Made I.T.: Gutenberg.
 *
 * @since 1.1
 */
if (!defined('ABSPATH')) {
    exit;
}

//require get_parent_theme_file_path('/gutenberg/basic/plugin.php');
require get_parent_theme_file_path('/gutenberg/container/plugin.php');
require get_parent_theme_file_path('/gutenberg/row/plugin.php');
require get_parent_theme_file_path('/gutenberg/column/plugin.php');

require get_parent_theme_file_path('/gutenberg/container-simple/plugin.php');
//require get_parent_theme_file_path('/gutenberg/row-simple/plugin.php');
//require get_parent_theme_file_path('/gutenberg/column-simple/plugin.php');

require get_parent_theme_file_path('/gutenberg/tabs/plugin.php');

require get_parent_theme_file_path('/gutenberg/carousel/plugin.php');

//<!-- wp:madeit/block-tabs-title {"tabid":"1"} -->
//<!-- wp:madeit/block-tabs-title {"tabid":1} -->

//<!-- wp:madeit/block-mediabron {"content":"Crypte Ijzertoren"} -->
//<!-- wp:madeit/block-mediabron {"text":"Crypte Ijzertoren"} -->

//<!-- wp:madeit/block-tabs-content {"tabid":"3"} -->
//<!-- wp:madeit/block-tabs-content {"tabid":3} -->

function fixTabs()
{
    $posts = get_posts(['post_type' => 'kr_soldaat', 'numberposts' => -1, 'post_status' => 'any']);

    $patterns = [];
    $patterns[] = '|<!-- wp:madeit/block-tabs-title {"tabid":"([0-9]*)"} -->|';
    $patterns[] = '|<!-- wp:madeit/block-tabs-content {"tabid":"([0-9]*)"} -->|';
    $patterns[] = '|<!-- wp:madeit/block-mediabron {"content":"(.*)"} -->|';

    $replacements = [];
    $replacements[] = '<!-- wp:madeit/block-tabs-title {"tabid":$1} -->';
    $replacements[] = '<!-- wp:madeit/block-tabs-content {"tabid":$1} -->';
    $replacements[] = '<!-- wp:madeit/block-mediabron {"text":"$1"} -->';
    //echo count($posts);
    $done = 0;
    foreach ($posts as $post) {
        $c = $post->post_content;

        $c = preg_replace($patterns, $replacements, $c, -1, $count);
        if ($count > 0) {
            $done++;
            wp_update_post(['ID' => $post->ID, 'post_content' => $c]);
        }
    }
    //echo "<br>" . $done;
    //exit;
}
//add_action('init', 'fixTabs', 0, 1);
add_action('after_setup_theme', 'fixTabs');

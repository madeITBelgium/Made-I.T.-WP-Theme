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

/**
 * Fill in the card link with the permalink of the current post when "Link naar huidig bericht" is enabled
 * (e.g. a card inside a Query Loop links to its own post).
 */
function madeit_block_card_render_post_link($block_content, $block, $instance = null)
{
    if (empty($block['attrs']['linkToPost']) || strpos($block_content, 'data-madeit-post-link') === false) {
        return $block_content;
    }

    $post_id = 0;
    if ($instance instanceof WP_Block && !empty($instance->context['postId'])) {
        $post_id = (int) $instance->context['postId'];
    }
    if (!$post_id) {
        $post_id = (int) get_the_ID();
    }

    $permalink = $post_id ? get_permalink($post_id) : false;

    $processor = new WP_HTML_Tag_Processor($block_content);
    while ($processor->next_tag(['tag_name' => 'a', 'class_name' => 'card-link'])) {
        if ($processor->get_attribute('data-madeit-post-link') === null) {
            continue;
        }

        $processor->remove_attribute('data-madeit-post-link');
        if ($permalink) {
            $processor->set_attribute('href', esc_url($permalink));
            $title = get_the_title($post_id);
            if ($title !== '') {
                $processor->set_attribute('aria-label', wp_strip_all_tags($title));
            }
        }
        break;
    }

    return $processor->get_updated_html();
}
add_filter('render_block_madeit/block-card', 'madeit_block_card_render_post_link', 10, 3);

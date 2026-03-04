<?php

if (!defined('ABSPATH')) {
    exit;
}

// Auto-migration settings.
if (!defined('MADEIT_MIGRATE_CAROUSEL_TO_SLIDER_BATCH')) {
    define('MADEIT_MIGRATE_CAROUSEL_TO_SLIDER_BATCH', 10);
}

/**
 * Auto convert any newly saved content that contains the legacy block.
 * This ensures no one can "add" a broken legacy carousel and leave it in the database.
 */
add_filter('wp_insert_post_data', function (array $data, array $postarr): array {
    if (empty($data['post_content']) || !is_string($data['post_content'])) {
        return $data;
    }

    if (strpos($data['post_content'], 'wp:madeit/block-carousel') === false) {
        return $data;
    }

    $did_change = false;
    $stats = [
        'posts_scanned'            => 0,
        'posts_changed'            => 0,
        'blocks_converted'         => 0,
        'blocks_skipped_no_images' => 0,
        'errors'                   => 0,
    ];

    $data['post_content'] = madeit_migrate_carousel_to_slider_in_content($data['post_content'], $did_change, $stats);

    return $data;
}, 20, 2);

/**
 * Frontend fallback: if a legacy carousel is rendered before DB migration runs,
 * render it as a slider so the page still works without the old carousel assets.
 */
add_filter('render_block', function (string $block_content, array $block): string {
    $name = isset($block['blockName']) ? (string) $block['blockName'] : '';
    if ($name !== 'madeit/block-carousel') {
        return $block_content;
    }

    static $in_fallback = false;
    if ($in_fallback) {
        return $block_content;
    }

    $parsed = madeit_parse_legacy_carousel_html($block_content);
    $images = $parsed['images'] ?? [];
    if (empty($images)) {
        return $block_content;
    }

    $anchor = isset($parsed['anchor']) ? (string) $parsed['anchor'] : '';
    $slider_block = madeit_build_slider_block_from_images($images, $anchor);
    $serialized = serialize_blocks([$slider_block]);

    $in_fallback = true;
    $rendered = do_blocks($serialized);
    $in_fallback = false;

    return is_string($rendered) && $rendered !== '' ? $rendered : $block_content;
}, 9, 2);

/**
 * If an editor screen opens a post that still contains the legacy block,
 * migrate that post immediately so the editor doesn't show an unsupported block.
 */
add_action('current_screen', function ($screen): void {
    if (!is_admin()) {
        return;
    }

    if (!is_object($screen) || !property_exists($screen, 'base') || $screen->base !== 'post') {
        return;
    }

    $post_id = isset($_GET['post']) ? (int) $_GET['post'] : 0;
    if ($post_id <= 0) {
        return;
    }

    $post = get_post($post_id);
    if (!$post || !is_string($post->post_content)) {
        return;
    }

    if (strpos($post->post_content, 'wp:madeit/block-carousel') === false) {
        return;
    }

    $did_change = false;
    $stats = [
        'posts_scanned'            => 0,
        'posts_changed'            => 0,
        'blocks_converted'         => 0,
        'blocks_skipped_no_images' => 0,
        'errors'                   => 0,
    ];

    $new_content = madeit_migrate_carousel_to_slider_in_content($post->post_content, $did_change, $stats);
    if (!$did_change) {
        return;
    }

    wp_update_post([
        'ID'           => $post_id,
        'post_content' => $new_content,
    ]);
}, 1);

/**
 * Auto migrate existing DB content in small batches.
 * - Runs on init (lightweight) so it works on client sites without manual WP-CLI.
 * - Uses a transient lock to avoid concurrent runs.
 * - Also schedules a WP-Cron event as a backstop.
 */
add_action('init', function (): void {
    if (get_option('madeit_migrate_carousel_to_slider_done')) {
        return;
    }

    if (get_transient('madeit_migrate_carousel_to_slider_lock')) {
        return;
    }

    // Schedule cron as a backstop.
    if (!wp_next_scheduled('madeit_migrate_carousel_to_slider_cron')) {
        wp_schedule_single_event(time() + 30, 'madeit_migrate_carousel_to_slider_cron');
    }

    // Run a small inline batch (kept small to avoid slowing requests).
    $batch = is_admin() ? max(MADEIT_MIGRATE_CAROUSEL_TO_SLIDER_BATCH, 50) : MADEIT_MIGRATE_CAROUSEL_TO_SLIDER_BATCH;
    set_transient('madeit_migrate_carousel_to_slider_lock', 1, 60);
    $result = madeit_migrate_carousel_to_slider_run_batch($batch);
    delete_transient('madeit_migrate_carousel_to_slider_lock');

    if ($result['remaining'] <= 0) {
        update_option('madeit_migrate_carousel_to_slider_done', 1, true);
    }
}, 1);

add_action('madeit_migrate_carousel_to_slider_cron', function (): void {
    if (get_option('madeit_migrate_carousel_to_slider_done')) {
        return;
    }

    if (get_transient('madeit_migrate_carousel_to_slider_lock')) {
        return;
    }

    set_transient('madeit_migrate_carousel_to_slider_lock', 1, 60);
    $result = madeit_migrate_carousel_to_slider_run_batch(MADEIT_MIGRATE_CAROUSEL_TO_SLIDER_BATCH);
    delete_transient('madeit_migrate_carousel_to_slider_lock');

    if ($result['remaining'] > 0) {
        wp_schedule_single_event(time() + 60, 'madeit_migrate_carousel_to_slider_cron');
    } else {
        update_option('madeit_migrate_carousel_to_slider_done', 1, true);
    }
});

/**
 * @return array<int,string>
 */
function madeit_migrate_carousel_to_slider_post_types(): array
{
    $types = get_post_types(['public' => true], 'names');
    foreach (['wp_block', 'wp_template', 'wp_template_part', 'wp_navigation'] as $extra) {
        if (post_type_exists($extra)) {
            $types[] = $extra;
        }
    }

    $types = array_values(array_unique(array_filter(array_map('strval', $types))));

    // Never touch revisions.
    return array_values(array_diff($types, ['revision']));
}

/**
 * Run one batch of DB migrations.
 *
 * @return array{updated:int,remaining:int}
 */
function madeit_migrate_carousel_to_slider_run_batch(int $limit = 10): array
{
    global $wpdb;

    $limit = max(1, $limit);
    $like = '%wp:madeit/block-carousel%';

    $post_types = madeit_migrate_carousel_to_slider_post_types();
    if (empty($post_types)) {
        return ['updated' => 0, 'remaining' => 0];
    }

    $placeholders = implode(',', array_fill(0, count($post_types), '%s'));
    $sql_ids = "SELECT ID FROM {$wpdb->posts} WHERE post_type IN ($placeholders) AND post_type <> 'revision' AND post_content LIKE %s ORDER BY ID ASC LIMIT %d";
    $prepared = $wpdb->prepare($sql_ids, array_merge($post_types, [$like, $limit]));
    $ids = $wpdb->get_col($prepared);

    if (empty($ids)) {
        return ['updated' => 0, 'remaining' => 0];
    }

    $updated = 0;
    foreach ($ids as $post_id) {
        $post_id = (int) $post_id;
        if ($post_id <= 0) {
            continue;
        }

        $post = get_post($post_id);
        if (!$post || !is_string($post->post_content)) {
            continue;
        }

        $did_change = false;
        $stats = [
            'posts_scanned'            => 0,
            'posts_changed'            => 0,
            'blocks_converted'         => 0,
            'blocks_skipped_no_images' => 0,
            'errors'                   => 0,
        ];

        $new_content = madeit_migrate_carousel_to_slider_in_content($post->post_content, $did_change, $stats);
        if (!$did_change) {
            continue;
        }

        $result = wp_update_post([
            'ID'           => $post_id,
            'post_content' => $new_content,
        ], true);

        if (!is_wp_error($result)) {
            $updated++;
        }
    }

    // Remaining count (cheap indicator for whether we should keep scheduling).
    $sql_count = "SELECT COUNT(1) FROM {$wpdb->posts} WHERE post_type IN ($placeholders) AND post_type <> 'revision' AND post_content LIKE %s";
    $prepared_count = $wpdb->prepare($sql_count, array_merge($post_types, [$like]));
    $remaining = (int) $wpdb->get_var($prepared_count);

    return ['updated' => $updated, 'remaining' => $remaining];
}

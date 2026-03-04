<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * WP-CLI command: migrate legacy `madeit/block-carousel` blocks to `madeit/slider`.
 *
 * This works even when the legacy carousel block is not registered anymore.
 */
if (defined('WP_CLI') && WP_CLI) {
WP_CLI::add_command('madeit migrate-carousel-to-slider', function (array $args, array $assoc_args): void {
    $apply = isset($assoc_args['apply']);
    $verbose = isset($assoc_args['verbose']) || isset($assoc_args['v']);
    $log_file = isset($assoc_args['log-file']) ? (string) $assoc_args['log-file'] : '';
    $post_id_arg = isset($assoc_args['post-id']) ? (string) $assoc_args['post-id'] : '';
    $post_type = isset($assoc_args['post-type']) ? (string) $assoc_args['post-type'] : 'any';
    $status = isset($assoc_args['status']) ? (string) $assoc_args['status'] : 'any';
    $limit = isset($assoc_args['limit']) ? max(1, (int) $assoc_args['limit']) : 500;
    $offset = isset($assoc_args['offset']) ? max(0, (int) $assoc_args['offset']) : 0;

    $GLOBALS['madeit_migrate_carousel_opts'] = [
        'verbose' => $verbose,
        'log_file' => $log_file,
    ];

    if ($log_file !== '') {
        $dir = dirname($log_file);
        if (!is_dir($dir) || !is_writable($dir)) {
            WP_CLI::warning('log-file directory not writable: ' . $dir);
            $GLOBALS['madeit_migrate_carousel_opts']['log_file'] = '';
        }
    }

    if ($post_type === 'any') {
        $post_types = get_post_types(['public' => true], 'names');

        // Gutenberg stores content outside regular posts/pages too.
        foreach (['wp_block', 'wp_template', 'wp_template_part', 'wp_navigation'] as $extra) {
            if (post_type_exists($extra)) {
                $post_types[] = $extra;
            }
        }

        $post_types = array_values(array_unique($post_types));
    } else {
        $post_types = array_values(array_filter(array_map('trim', explode(',', $post_type))));
    }

    $post__in = [];
    if ($post_id_arg !== '') {
        $post__in = array_values(array_filter(array_map('intval', preg_split('/\s*,\s*/', $post_id_arg) ?: [])));
        $post__in = array_values(array_unique(array_filter($post__in)));
    }

    madeit_migrate_cli_log('Scanning posts for legacy madeit/block-carousel blocks...');
    if ($verbose) {
        madeit_migrate_cli_log('Mode: ' . ($apply ? 'APPLY' : 'DRY-RUN'));
        madeit_migrate_cli_log('Post types: ' . implode(', ', $post_types));
        if (!empty($post__in)) {
            madeit_migrate_cli_log('Post IDs: ' . implode(', ', $post__in));
        } else {
            madeit_migrate_cli_log('Limit/offset: ' . $limit . '/' . $offset);
        }
    }

    $query_args = [
        'post_type'              => $post_types,
        'post_status'            => $status,
        'posts_per_page'         => !empty($post__in) ? -1 : $limit,
        'offset'                 => !empty($post__in) ? 0 : $offset,
        'post__in'               => !empty($post__in) ? $post__in : [],
        'orderby'                => !empty($post__in) ? 'post__in' : 'ID',
        'fields'                 => 'ids',
        'no_found_rows'          => true,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
    ];

    $query = new WP_Query($query_args);

    $stats = [
        'posts_scanned' => 0,
        'posts_changed' => 0,
        'blocks_converted' => 0,
        'blocks_skipped_no_images' => 0,
        'errors' => 0,
    ];

    foreach ($query->posts as $post_id) {
        $stats['posts_scanned']++;
        $post = get_post($post_id);
        if (!$post || !is_string($post->post_content)) {
            continue;
        }

        if ($verbose) {
            $title = is_string($post->post_title) ? $post->post_title : '';
            madeit_migrate_cli_log('---');
            madeit_migrate_cli_log('Post ' . $post_id . ' (' . $post->post_type . '/' . $post->post_status . '): ' . $title);
        }

        $did_change = false;
        $new_content = madeit_migrate_carousel_to_slider_in_content($post->post_content, $did_change, $stats);
        if (!$did_change) {
            if ($verbose) {
                madeit_migrate_cli_log('No changes needed.');
            }
            continue;
        }

        $stats['posts_changed']++;
        if ($apply) {
            $result = wp_update_post([
                'ID' => $post_id,
                'post_content' => $new_content,
            ], true);

            if (is_wp_error($result)) {
                $stats['errors']++;
                WP_CLI::warning('Failed updating post ' . $post_id . ': ' . $result->get_error_message());
            } elseif ($verbose) {
                madeit_migrate_cli_log('Updated post_content.');
            }
        } elseif ($verbose) {
            madeit_migrate_cli_log('Would update post_content (dry-run).');
        }
    }

    madeit_migrate_cli_log('');
    madeit_migrate_cli_log('Done.');
    madeit_migrate_cli_log('Posts scanned: ' . $stats['posts_scanned']);
    madeit_migrate_cli_log('Posts changed: ' . $stats['posts_changed'] . ($apply ? '' : ' (dry-run)'));
    madeit_migrate_cli_log('Blocks converted: ' . $stats['blocks_converted']);
    if ($stats['blocks_skipped_no_images'] > 0) {
        madeit_migrate_cli_log('Blocks skipped (no images found): ' . $stats['blocks_skipped_no_images']);
    }
    if ($stats['errors'] > 0) {
        WP_CLI::warning('Errors: ' . $stats['errors']);
    }

    if (!$apply) {
        if ($stats['posts_changed'] > 0) {
            madeit_migrate_cli_log('Run again with --apply to write changes.');
        }
    }
});
}

/**
 * Lightweight logger that can also append to a file.
 */
function madeit_migrate_cli_log(string $message): void
{
    if (defined('WP_CLI') && WP_CLI) {
        WP_CLI::log($message);
    } elseif (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[madeit migrate] ' . $message);
    }

    $opts = $GLOBALS['madeit_migrate_carousel_opts'] ?? [];
    $log_file = is_array($opts) && isset($opts['log_file']) ? (string) $opts['log_file'] : '';
    if ($log_file === '') {
        return;
    }

    $line = '[' . gmdate('c') . '] ' . $message . "\n";
    @file_put_contents($log_file, $line, FILE_APPEND);
}

/**
 * @param bool $did_change Output flag
 * @param array<string,int> $stats
 */
function madeit_migrate_carousel_to_slider_in_content(string $content, bool &$did_change, array &$stats): string
{
    if (strpos($content, 'wp:madeit/block-carousel') === false) {
        return $content;
    }

    $blocks = parse_blocks($content);
    $converted = madeit_migrate_carousel_to_slider_blocks($blocks, $did_change, $stats);

    if (!$did_change) {
        return $content;
    }

    return serialize_blocks($converted);
}

/**
 * @param array<int,array> $blocks
 * @param bool $did_change Output flag
 * @param array<string,int> $stats
 * @return array<int,array>
 */
function madeit_migrate_carousel_to_slider_blocks(array $blocks, bool &$did_change, array &$stats): array
{
    $out = [];
    foreach ($blocks as $block) {
        if (!is_array($block)) {
            continue;
        }

        if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $inner_changed = false;
            $block['innerBlocks'] = madeit_migrate_carousel_to_slider_blocks($block['innerBlocks'], $inner_changed, $stats);
            if ($inner_changed) {
                $did_change = true;
            }
        }

        $name = isset($block['blockName']) ? (string) $block['blockName'] : '';
        if ($name !== 'madeit/block-carousel') {
            $out[] = $block;
            continue;
        }

        $opts = $GLOBALS['madeit_migrate_carousel_opts'] ?? [];
        $verbose = is_array($opts) && !empty($opts['verbose']);

        $html = '';
        if (isset($block['innerHTML']) && is_string($block['innerHTML'])) {
            $html = $block['innerHTML'];
        } elseif (isset($block['innerContent']) && is_array($block['innerContent'])) {
            $html = implode('', array_values(array_filter($block['innerContent'], 'is_string')));
        }

        if ($verbose) {
            madeit_migrate_cli_log('Found madeit/block-carousel block.');
        }

        $parsed = madeit_parse_legacy_carousel_html($html);
        $images = $parsed['images'] ?? [];
        if (empty($images)) {
            $stats['blocks_skipped_no_images']++;
            if ($verbose) {
                madeit_migrate_cli_log('Skipped: no images extracted from HTML.');
            }
            $out[] = $block;
            continue;
        }

        $anchor = $parsed['anchor'] ?? '';
        if ($verbose) {
            madeit_migrate_cli_log('Extracted images: ' . count($images) . ($anchor !== '' ? ('; anchor=' . $anchor) : ''));
            $sample = array_slice($images, 0, 3);
            foreach ($sample as $idx => $img) {
                $url = isset($img['url']) ? (string) $img['url'] : '';
                if ($url !== '') {
                    madeit_migrate_cli_log(' - img[' . $idx . ']: ' . $url);
                }
            }
        }
        $slider_block = madeit_build_slider_block_from_images($images, $anchor);

        $out[] = $slider_block;
        $did_change = true;
        $stats['blocks_converted']++;
    }

    return $out;
}

/**
 * Parse legacy carousel HTML and extract images + captions + links.
 *
 * @return array{anchor:string,images:array<int,array{url:string,alt:string,id:int|null,link:string,caption:string}>}
 */
function madeit_parse_legacy_carousel_html(string $html): array
{
    $result = [
        'anchor' => '',
        'images' => [],
    ];

    $html = trim($html);
    if ($html === '') {
        return $result;
    }

    if (!class_exists('DOMDocument')) {
        return $result;
    }

    $dom = new DOMDocument();
    libxml_use_internal_errors(true);

    // Note: we intentionally do NOT use mb_convert_encoding here.
    // PHP 8.5 deprecates using mbstring for HTML entities, and the meta charset is sufficient.
    $wrapped = '<!doctype html><html><head><meta charset="utf-8"></head><body>' . $html . '</body></html>';
    $dom->loadHTML($wrapped);

    libxml_clear_errors();
    libxml_use_internal_errors(false);

    $xpath = new DOMXPath($dom);

    $carousel = $xpath->query("//div[contains(concat(' ', normalize-space(@class), ' '), ' carousel ')][1]")->item(0);
    if ($carousel instanceof DOMElement) {
        $id = $carousel->getAttribute('id');
        if ($id === '') {
            $id = $carousel->getAttribute('ID');
        }
        $id = is_string($id) ? trim($id) : '';
        if ($id !== '' && $id !== 'demo') {
            $result['anchor'] = sanitize_title($id);
        }
    }

    $items = $xpath->query("//div[contains(concat(' ', normalize-space(@class), ' '), ' carousel-item ')]");
    if (!$items) {
        return $result;
    }

    foreach ($items as $item) {
        if (!$item instanceof DOMElement) {
            continue;
        }

        $img = $xpath->query('.//img[1]', $item)->item(0);
        if (!$img instanceof DOMElement) {
            continue;
        }

        $url = trim((string) $img->getAttribute('src'));
        if ($url === '') {
            continue;
        }

        $alt = (string) $img->getAttribute('alt');
        $data_id = trim((string) $img->getAttribute('data-id'));
        $id = $data_id !== '' ? (int) $data_id : null;
        $link = trim((string) $img->getAttribute('data-link'));

        $caption = '';
        $figcaption = $xpath->query('.//figcaption[1]', $item)->item(0);
        if ($figcaption instanceof DOMElement) {
            $caption = '';
            foreach ($figcaption->childNodes as $child) {
                $caption .= $dom->saveHTML($child);
            }
            $caption = trim($caption);
        }

        $result['images'][] = [
            'url' => $url,
            'alt' => $alt,
            'id' => $id,
            'link' => $link,
            'caption' => $caption,
        ];
    }

    return $result;
}

/**
 * @param array<int,array{url:string,alt:string,id:int|null,link:string,caption:string}> $images
 */
function madeit_build_slider_block_from_images(array $images, string $anchor = ''): array
{
    $inner_blocks = [];
    foreach ($images as $img) {
        if (!is_array($img) || empty($img['url'])) {
            continue;
        }

        $attrs = [
            'url' => (string) $img['url'],
            'alt' => isset($img['alt']) ? (string) $img['alt'] : '',
            'id' => isset($img['id']) && $img['id'] !== null ? (int) $img['id'] : null,
            'caption' => isset($img['caption']) ? (string) $img['caption'] : '',
            'linkUrl' => isset($img['link']) ? (string) $img['link'] : '',
            'linkTarget' => '_self',
        ];

        $inner_blocks[] = madeit_build_slider_image_block($attrs);
    }

    $slider_attrs = [
        'effect' => 'slide',
        'slidesDesktop' => 1,
        'slidesTablet' => 1,
        'slidesMobile' => 1,
        'height' => '300px',
        'minHeight' => '300px',
        'spaceBetween' => '10px',
        'objectFit' => 'cover',
        'navigation' => true,
        'navigationPosition' => 'outside',
        'navigationIconColor' => '#000',
        'navigationBackgroundColor' => '#fff',
        'navigationIconSize' => 24,
        'navigationBorderRadius' => 50,
        'navigationBorderWidth' => '1px',
        'navigationBorderStyle' => 'solid',
        'navigationBorderColor' => '#ccc',
        'pagination' => true,
        'paginationType' => 'bullets',
        'paginationInside' => false,
        'paginationDynamic' => false,
        'paginationMaxBullets' => 5,
        'paginationActiveColor' => '#000',
        'autoplay' => false,
        'speed' => 3000,
        'loop' => false,
    ];

    $anchor = trim($anchor);
    if ($anchor !== '') {
        $slider_attrs['anchor'] = sanitize_title($anchor);
    }

    return madeit_build_slider_block($slider_attrs, $inner_blocks);
}

/**
 * @param array<string,mixed> $attrs
 */
function madeit_build_slider_image_block(array $attrs): array
{
    $url = isset($attrs['url']) ? (string) $attrs['url'] : '';
    $alt = isset($attrs['alt']) ? (string) $attrs['alt'] : '';
    $caption = isset($attrs['caption']) ? (string) $attrs['caption'] : '';
    $link_url = isset($attrs['linkUrl']) ? (string) $attrs['linkUrl'] : '';
    $link_target = isset($attrs['linkTarget']) ? (string) $attrs['linkTarget'] : '_self';

    $class = 'wp-block-madeit-slider-image swiper-slide';

    $img_html = '<img src="' . esc_url($url) . '" alt="' . esc_attr($alt) . '" />';
    if ($link_url !== '') {
        $rel = $link_target === '_blank' ? ' rel="noopener noreferrer"' : '';
        $img_html = '<a href="' . esc_url($link_url) . '" target="' . esc_attr($link_target) . '"' . $rel . '>' . $img_html . '</a>';
    }

    $caption_html = '';
    if (trim($caption) !== '') {
        $caption_html = '<div class="swiper-caption"><div>' . wp_kses_post($caption) . '</div></div>';
    }

    $html = '<div class="' . esc_attr($class) . '">' . $img_html . $caption_html . '</div>';

    $block_attrs = [
        'url' => $url,
        'alt' => $alt,
        'caption' => $caption,
        'linkUrl' => $link_url,
        'linkTarget' => $link_target,
    ];
    if (isset($attrs['id']) && $attrs['id'] !== null && $attrs['id'] !== '') {
        $block_attrs['id'] = (int) $attrs['id'];
    }

    return [
        'blockName' => 'madeit/slider-image',
        'attrs' => $block_attrs,
        'innerBlocks' => [],
        'innerHTML' => $html,
        'innerContent' => [$html],
    ];
}

/**
 * @param array<string,mixed> $attrs
 * @param array<int,array> $inner_blocks
 */
function madeit_build_slider_block(array $attrs, array $inner_blocks): array
{
    $effect = isset($attrs['effect']) ? (string) $attrs['effect'] : 'slide';
    $slides_desktop = isset($attrs['slidesDesktop']) ? (string) $attrs['slidesDesktop'] : '1';
    $slides_tablet = isset($attrs['slidesTablet']) ? (string) $attrs['slidesTablet'] : '1';
    $slides_mobile = isset($attrs['slidesMobile']) ? (string) $attrs['slidesMobile'] : '1';
    $height = isset($attrs['height']) ? (string) $attrs['height'] : '300px';
    $min_height = isset($attrs['minHeight']) ? (string) $attrs['minHeight'] : (isset($attrs['minheight']) ? (string) $attrs['minheight'] : '300px');
    $space_between = isset($attrs['spaceBetween']) ? (string) $attrs['spaceBetween'] : '10px';
    $object_fit = isset($attrs['objectFit']) ? (string) $attrs['objectFit'] : 'cover';
    $navigation = !empty($attrs['navigation']);
    $pagination = !empty($attrs['pagination']);
    $pagination_type = isset($attrs['paginationType']) ? (string) $attrs['paginationType'] : 'bullets';
    $pagination_inside = !empty($attrs['paginationInside']);
    $pagination_dynamic = !empty($attrs['paginationDynamic']);
    $pagination_max_bullets = isset($attrs['paginationMaxBullets']) ? (int) $attrs['paginationMaxBullets'] : 5;
    $pagination_active_color = isset($attrs['paginationActiveColor']) ? (string) $attrs['paginationActiveColor'] : '#000';
    $speed = isset($attrs['speed']) ? (int) $attrs['speed'] : 3000;
    $autoplay = !empty($attrs['autoplay']);
    $loop = !empty($attrs['loop']);

    $navigation_position = isset($attrs['navigationPosition']) ? (string) $attrs['navigationPosition'] : 'outside';
    $navigation_icon_color = isset($attrs['navigationIconColor']) ? (string) $attrs['navigationIconColor'] : '#000';
    $navigation_background_color = isset($attrs['navigationBackgroundColor']) ? (string) $attrs['navigationBackgroundColor'] : '#fff';
    $navigation_icon_size = isset($attrs['navigationIconSize']) ? (int) $attrs['navigationIconSize'] : 24;
    $navigation_border_radius = isset($attrs['navigationBorderRadius']) ? (int) $attrs['navigationBorderRadius'] : 50;
    $navigation_border_width = isset($attrs['navigationBorderWidth']) ? (string) $attrs['navigationBorderWidth'] : '1px';
    $navigation_border_style = isset($attrs['navigationBorderStyle']) ? (string) $attrs['navigationBorderStyle'] : 'solid';
    $navigation_border_color = isset($attrs['navigationBorderColor']) ? (string) $attrs['navigationBorderColor'] : '#ccc';

    $id_attr = '';
    if (!empty($attrs['anchor']) && is_string($attrs['anchor'])) {
        $anchor = sanitize_title($attrs['anchor']);
        if ($anchor !== '') {
            $id_attr = ' id="' . esc_attr($anchor) . '"';
        }
    }

    $style = implode('', [
        '--height:' . esc_attr($height) . ';',
        '--spaceBetween:' . esc_attr($space_between) . ';',
        '--minheight:' . esc_attr($min_height) . ';',
        '--swiper-space-between:' . esc_attr($space_between) . ';',
        '--navigationIconSize:' . (int) $navigation_icon_size . 'px;',
        '--paginationActiveColor:' . esc_attr($pagination_active_color) . ';',
        '--objectFit:' . esc_attr($object_fit ?: 'cover') . ';',
    ]);

    $pagination_type_data = $pagination ? 'bullets' : ($pagination ? $pagination : 'false');

    $start = '<div class="wp-block-madeit-slider m-slider_front"' . $id_attr .
        ' data-slides-desktop="' . esc_attr($slides_desktop) . '"' .
        ' data-slides-tablet="' . esc_attr($slides_tablet) . '"' .
        ' data-slides-mobile="' . esc_attr($slides_mobile) . '"' .
        ' data-speed="' . esc_attr((string) $speed) . '"' .
        ' data-autoplay="' . ($autoplay ? 'true' : 'false') . '"' .
        ' data-loop="' . ($loop ? 'true' : 'false') . '"' .
        ' data-navigation="' . ($navigation ? 'true' : 'false') . '"' .
        ' data-pagination="' . ($pagination ? 'true' : 'false') . '"' .
        ' data-effect="' . esc_attr($effect) . '"' .
        ' data-cross-fade="' . ($effect === 'fade' ? 'true' : 'false') . '"' .
        ' data-pagination-type="' . esc_attr($pagination_type_data) . '"' .
        ' style="' . esc_attr($style) . '">';

    $start .= '<div class="swiper" style="overflow: hidden; height: ' . esc_attr($height) . '; min-height: ' . esc_attr($min_height) . '">';
    $start .= '<div class="swiper-wrapper">';

    $end = '</div></div>';

    if ($navigation) {
        $border = $navigation_border_width ? ($navigation_border_width . ' ' . $navigation_border_style . ' ' . $navigation_border_color) : 'none';
        $end .= '<div class="swiper-button ' . esc_attr($navigation_position) . '">' .
            '<button class="swiper-button-prev" aria-label="Vorige slide" style="background-color: ' . esc_attr($navigation_background_color) . '; color: ' . esc_attr($navigation_icon_color) . '; width: ' . (int) $navigation_icon_size . 'px; height: ' . (int) $navigation_icon_size . 'px; border: ' . esc_attr($border) . '; border-radius: ' . (int) $navigation_border_radius . 'px;"></button>' .
            '<button class="swiper-button-next" aria-label="Volgende slide" style="background-color: ' . esc_attr($navigation_background_color) . '; color: ' . esc_attr($navigation_icon_color) . '; width: ' . (int) $navigation_icon_size . 'px; height: ' . (int) $navigation_icon_size . 'px; border: ' . esc_attr($border) . '; border-radius: ' . (int) $navigation_border_radius . 'px;"></button>' .
        '</div>';
    }

    if ($pagination) {
        $classes = 'swiper-pagination swiper-pagination-' . $pagination_type . ' ' . ($pagination_inside ? 'inside' : 'outside');
        if ($pagination_dynamic) {
            $classes .= ' swiper-pagination-dynamic';
        }

        $end .= '<div class="' . esc_attr($classes) . '">';

        if ($pagination_type === 'bullets' && !$pagination_dynamic) {
            $end .= '<span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span>';
            $end .= '<span class="swiper-pagination-bullet"></span>';
            $end .= '<span class="swiper-pagination-bullet"></span>';
        } elseif ($pagination_type === 'fraction') {
            $end .= '<span class="swiper-pagination-fraction">1 / 3</span>';
        } elseif ($pagination_type === 'progressbar') {
            $end .= '<div class="progressbar--preview" style="width: 30%; height: 4px; background: #888"></div>';
        }

        if ($pagination_dynamic) {
            $end .= '<div class="swiper-pagination-dynamic">';
            for ($i = 0; $i < $pagination_max_bullets; $i++) {
                $end .= '<span class="swiper-pagination-bullet' . ($i === 0 ? ' swiper-pagination-bullet-active' : '') . '"></span>';
            }
            $end .= '</div>';
        }

        $end .= '</div>';
    }

    $end .= '</div>';

    $inner_content = [$start];
    if (!empty($inner_blocks)) {
        foreach ($inner_blocks as $_) {
            $inner_content[] = null;
            $inner_content[] = '';
        }
        $inner_content[count($inner_content) - 1] = $end;
    } else {
        $inner_content[] = $end;
    }

    return [
        'blockName' => 'madeit/slider',
        'attrs' => $attrs,
        'innerBlocks' => $inner_blocks,
        'innerHTML' => '',
        'innerContent' => $inner_content,
    ];
}

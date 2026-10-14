<?php

/**
 * Font Awesome icon registration.
 */
add_action('init', function () {
    // `Requires at least: 7.1` blocks activation on older sites, but guard anyway
    // in case the file is copied in by hand.
    if (!function_exists('wp_register_icon_collection') || !function_exists('wp_register_icon')) {
        return;
    }

    $collection = 'font-awesome';

    wp_register_icon_collection($collection, [
        'label'       => __('Font Awesome', 'themeslug'),
        'description' => __('A sample set of Font Awesome Free icons.', 'themeslug'),
    ]);

    // slug => human-readable label. The label is what the picker searches on,
    // so make it descriptive (there is no separate per-icon keywords field yet).
    $icons = [
        'solid-house'      => __('Solid House', 'themeslug'),
        'regular-house'    => __('Regular House', 'themeslug'),
        'solid-user'       => __('Solid User', 'themeslug'),
        'regular-user'     => __('Regular User', 'themeslug'),
        'solid-info'       => __('Solid Info', 'themeslug'),
        'social-facebook'  => __('Facebook', 'themeslug'),
        'social-instagram' => __('Instagram', 'themeslug'),
        'social-linkedin'  => __('LinkedIn', 'themeslug'),
        'social-youtube'   => __('YouTube', 'themeslug'),
        'social-twitch'    => __('Twitch', 'themeslug'),
    ];

    $icons_dir = get_template_directory().'/inc/core/icons/icons/';

    foreach ($icons as $slug => $label) {
        // Two ways to provide the SVG: a `file_path` (used here, mirrors core)
        // or inline `content`. Provide one or the other, never both.
        wp_register_icon(
            $collection.'/'.$slug,
            [
                'label'     => $label,
                'file_path' => $icons_dir.$slug.'.svg',
            ]
        );
    }
});

<?php

/**
 * Helper functions for blocks.
 */
$postTemplate = 'core/post-template';

// Add responsive columns support to the Post Template block when using grid layout.
// The editor UI is handled in assets/js/gutenberg.js; this PHP ensures the frontend
// also receives the CSS variables even if the markup wasn't re-saved.
if (function_exists('register_block_type')) {
    add_action('init', function () use ($postTemplate) {
        $blockType = WP_Block_Type_Registry::get_instance()->get_registered($postTemplate);
        if (!$blockType) {
            return;
        }

        // Register custom attributes without defaults so we don't unintentionally
        // override existing layouts.
        $blockType->attributes['madeitColumnsTablet'] = [
            'type' => 'number',
        ];
        $blockType->attributes['madeitColumnsMobile'] = [
            'type' => 'number',
        ];
    });
}

add_action('enqueue_block_assets', function () {
    wp_enqueue_style(
        'madeit-post-template-responsive-columns',
        get_theme_file_uri('/assets/css/post-template-responsive-columns.css'),
        [],
        defined('MADEIT_VERSION') ? MADEIT_VERSION : null
    );
});

add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_style(
        'madeit-post-template-responsive-columns',
        get_theme_file_uri('/assets/css/post-template-responsive-columns.css'),
        [],
        defined('MADEIT_VERSION') ? MADEIT_VERSION : null
    );
});

add_filter('render_block', function (string $block_content, array $block): string {
    if (($block['blockName'] ?? '') !== 'core/post-template') {
        return $block_content;
    }

    $attrs = $block['attrs'] ?? [];
    $layout_type = $attrs['layout']['type'] ?? null;
    $is_flex_grid = strpos($block_content, 'is-flex-container') !== false;
    if ($layout_type !== 'grid' && !$is_flex_grid) {
        return $block_content;
    }

    // Desktop comes from core `layout.columnCount`.
    $desktop_cols = $attrs['layout']['columnCount'] ?? null;
    $tablet_cols = $attrs['madeitColumnsTablet'] ?? null;
    $mobile_cols = $attrs['madeitColumnsMobile'] ?? null;

    // Backwards-compat: accept older attribute naming if present.
    if ($tablet_cols === null && isset($attrs['columnsCountTablet'])) {
        $tablet_cols = $attrs['columnsCountTablet'];
    }
    if ($mobile_cols === null && isset($attrs['columnsCountMobile'])) {
        $mobile_cols = $attrs['columnsCountMobile'];
    }

    $style_vars = [];
    if (is_numeric($desktop_cols)) {
        $style_vars[] = '--madeit-pt-cols-desktop:'.(int) $desktop_cols;
    }
    if (is_numeric($tablet_cols)) {
        $style_vars[] = '--madeit-pt-cols-tablet:'.(int) $tablet_cols;
    }
    if (is_numeric($mobile_cols)) {
        $style_vars[] = '--madeit-pt-cols-mobile:'.(int) $mobile_cols;
    }

    if (empty($style_vars)) {
        return $block_content;
    }

    if (!class_exists('WP_HTML_Tag_Processor')) {
        return $block_content;
    }

    $processor = new WP_HTML_Tag_Processor($block_content);
    if (!$processor->next_tag()) {
        return $block_content;
    }

    $existing_style = $processor->get_attribute('style');
    $existing_style = is_string($existing_style) ? trim($existing_style) : '';

    $append = implode(';', $style_vars);
    $next_style = $existing_style;
    if ($next_style !== '' && substr($next_style, -1) !== ';') {
        $next_style .= ';';
    }
    $next_style .= $append;

    $processor->set_attribute('style', $next_style);

    return $processor->get_updated_html();
}, 10, 2);

add_filter('render_block', function (string $block_content, array $block): string {
    $attrs = $block['attrs'] ?? [];
    $device_values = [
        'desktop' => ['x' => $attrs['translateXDesktop'] ?? $attrs['translateX'] ?? 0, 'y' => $attrs['translateYDesktop'] ?? $attrs['translateY'] ?? 0],
        'tablet' => ['x' => $attrs['translateXTablet'] ?? $attrs['translateX'] ?? 0, 'y' => $attrs['translateYTablet'] ?? $attrs['translateY'] ?? 0],
        'mobile' => ['x' => $attrs['translateXMobile'] ?? $attrs['translateX'] ?? 0, 'y' => $attrs['translateYMobile'] ?? $attrs['translateY'] ?? 0],
    ];

    $has_transform = false;
    foreach ($device_values as $device => $values) {
        if (is_numeric((string) $values['x']) && (float) $values['x'] !== 0.0) {
            $has_transform = true;
            break;
        }
        if (is_numeric((string) $values['y']) && (float) $values['y'] !== 0.0) {
            $has_transform = true;
            break;
        }
    }

    if (!$has_transform || !class_exists('WP_HTML_Tag_Processor')) {
        return $block_content;
    }

    $processor = new WP_HTML_Tag_Processor($block_content);
    if (!$processor->next_tag()) {
        return $block_content;
    }

    $class_name = 'madeit-transform-' . wp_unique_id('madeit-transform-');
    $existing_classes = $processor->get_attribute('class');
    $classes = is_string($existing_classes) ? preg_split('/\s+/', trim($existing_classes)) : [];
    $classes[] = $class_name;
    $processor->set_attribute('class', trim(implode(' ', array_filter(array_unique($classes)))));

    $style = $processor->get_attribute('style');
    $style = is_string($style) ? trim($style) : '';
    $style_vars = [];
    foreach ($device_values as $device => $values) {
        $style_vars[] = '--madeit-translate-x-' . $device . ':' . (float) $values['x'] . 'px';
        $style_vars[] = '--madeit-translate-y-' . $device . ':' . (float) $values['y'] . 'px';
    }

    $merged_style = $style;
    if ($merged_style !== '' && substr($merged_style, -1) !== ';') {
        $merged_style .= ';';
    }
    $merged_style .= implode(';', $style_vars) . ';';
    $processor->set_attribute('style', $merged_style);

    $block_html = $processor->get_updated_html();

    $css = ".{$class_name}{transform:translate(var(--madeit-translate-x-desktop,0),var(--madeit-translate-y-desktop,0));}";
    if (isset($device_values['tablet'])) {
        $css .= '@media (max-width: 1024px){.'.$class_name.'{transform:translate(var(--madeit-translate-x-tablet,0),var(--madeit-translate-y-tablet,0));}}';
    }
    if (isset($device_values['mobile'])) {
        $css .= '@media (max-width: 767px){.'.$class_name.'{transform:translate(var(--madeit-translate-x-mobile,0),var(--madeit-translate-y-mobile,0));}}';
    }

    return '<style>' . $css . '</style>' . $block_html;
}, 10, 2);

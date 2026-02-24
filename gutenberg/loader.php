<?php

// Versiebeheer
if (!defined('MADEIT_BLOCKS_VERSION')) {
    define('MADEIT_BLOCKS_VERSION', '1.3.0');
}

// Admin pagina's
if (is_admin()) {
    require_once get_parent_theme_file_path('gutenberg/admin/menu.php');
    require_once get_parent_theme_file_path('gutenberg/admin/settings.php');
    require_once get_parent_theme_file_path('gutenberg/admin/updates.php');
    require_once get_parent_theme_file_path('gutenberg/admin/support.php');
    require_once get_parent_theme_file_path('gutenberg/admin/notices.php');
    require_once get_parent_theme_file_path('gutenberg/helpers/changelog.php');
}

// Blocks laden
add_action('init', function () {
    $blocks_dir = get_parent_theme_file_path('gutenberg/blocks');
    if (!is_dir($blocks_dir)) {
        return;
    }

    // New behavior: store disabled slugs. Empty list = everything enabled by default.
    $disabled_option = get_option('madeit_blocks_disabled', null);
    $disabled = is_array($disabled_option) ? $disabled_option : [];
    $disabled = array_values(array_filter(array_map('sanitize_key', $disabled)));

    // Migration: legacy madeit_blocks_enabled stored enabled slugs.
    if ($disabled_option === null) {
        $legacy_enabled_option = get_option('madeit_blocks_enabled', null);
        $legacy_enabled = is_array($legacy_enabled_option) ? $legacy_enabled_option : [];
        $legacy_enabled = array_values(array_filter(array_map('sanitize_key', $legacy_enabled)));

        // Discover all blocks in the theme folder.
        $all = [];

        try {
            $iterator = new DirectoryIterator($blocks_dir);
            foreach ($iterator as $entry) {
                if ($entry->isDot() || !$entry->isDir()) {
                    continue;
                }
                $slug = $entry->getBasename();
                if (is_readable($entry->getPathname().'/register.php')) {
                    $all[] = $slug;
                }
            }
        } catch (Exception $e) {
            $all = [];
        }

        // If legacy enabled list is empty, treat as: nothing explicitly configured -> all enabled.
        if (!empty($legacy_enabled) && !empty($all)) {
            $disabled = array_values(array_diff($all, $legacy_enabled));
        } else {
            $disabled = [];
        }

        update_option('madeit_blocks_disabled', $disabled);
    }

    // Ensure advanced-controls always stays enabled.
    $advanced_controls_slug = 'advanced-controls';
    $disabled = array_values(array_diff($disabled, [$advanced_controls_slug]));
    update_option('madeit_blocks_disabled', $disabled);

    // Keep legacy option in sync for any older code paths.
    $all = [];

    try {
        $iterator = new DirectoryIterator($blocks_dir);
        foreach ($iterator as $entry) {
            if ($entry->isDot() || !$entry->isDir()) {
                continue;
            }
            $slug = $entry->getBasename();
            if (is_readable($entry->getPathname().'/register.php')) {
                $all[] = $slug;
            }
        }
    } catch (Exception $e) {
        $all = [];
    }
    $enabled = array_values(array_diff($all, $disabled));
    update_option('madeit_blocks_enabled', $enabled);

    // Register all blocks except disabled.
    try {
        $iterator = new DirectoryIterator($blocks_dir);
    } catch (Exception $e) {
        return;
    }

    foreach ($iterator as $entry) {
        if ($entry->isDot() || !$entry->isDir()) {
            continue;
        }

        $slug = $entry->getBasename();
        $register_file = $entry->getPathname().'/register.php';
        if (!is_readable($register_file)) {
            continue;
        }

        if (in_array($slug, $disabled, true)) {
            continue;
        }

        require_once $register_file;
    }
});

// Gutenberg: allow disabling core blocks from the inserter.
add_filter('allowed_block_types_all', function ($allowed_block_types, $editor_context) {
    $disabled = (array) get_option('madeit_core_blocks_disabled', []);
    $disabled = array_values(array_filter(array_map('sanitize_key', $disabled)));

    if (empty($disabled)) {
        return $allowed_block_types;
    }

    if ($allowed_block_types === false) {
        return false;
    }

    $disabled_names = array_map(static fn ($slug) => 'core/'.$slug, $disabled);

    // If true, treat as: all registered blocks are allowed.
    if ($allowed_block_types === true) {
        if (!class_exists('WP_Block_Type_Registry')) {
            return true;
        }

        $registry = WP_Block_Type_Registry::get_instance();
        $all = array_keys($registry->get_all_registered());

        return array_values(array_diff($all, $disabled_names));
    }

    if (is_array($allowed_block_types)) {
        return array_values(array_diff($allowed_block_types, $disabled_names));
    }

    return $allowed_block_types;
}, 999, 2);

// Gutenberg: eigen categorie voor Made I.T. blocks (bovenaan in de lijst).
add_filter('block_categories_all', function (array $block_categories, $editor_context): array {
    $slug = 'madeit';

    foreach ($block_categories as $category) {
        if (isset($category['slug']) && (string) $category['slug'] === $slug) {
            return $block_categories;
        }
    }

    array_unshift($block_categories, [
        'slug'  => $slug,
        'title' => __('Made I.T.', 'madeit'),
    ]);

    return $block_categories;
}, 0, 2);

// Backwards compatibility (WP < 5.8): zelfde categorie via block_categories.
add_filter('block_categories', function (array $block_categories, $editor_context): array {
    $slug = 'madeit';

    foreach ($block_categories as $category) {
        if (isset($category['slug']) && (string) $category['slug'] === $slug) {
            return $block_categories;
        }
    }

    array_unshift($block_categories, [
        'slug'  => $slug,
        'title' => __('Made I.T.', 'madeit'),
    ]);

    return $block_categories;
}, 0, 2);

// Gutenberg: default category voor alle blocks binnen /gutenberg/blocks.
add_filter('block_type_metadata_settings', function (array $settings, array $metadata): array {
    $source_file = $metadata['file'] ?? '';
    if (!is_string($source_file) || $source_file === '') {
        return $settings;
    }

    if (strpos($source_file, '/gutenberg/blocks/') !== false) {
        $settings['category'] = 'madeit';
    }

    return $settings;
}, 10, 2);

// Gutenberg: accentkleur voor de Made I.T. categorie in de inserter.
add_action('enqueue_block_editor_assets', function (): void {
    // Shared editor-only styles for our reusable inspector controls.
    $shared_rel = 'gutenberg/shared/editor-controls.css';
    $shared_src = get_parent_theme_file_uri($shared_rel);
    $shared_path = get_parent_theme_file_path($shared_rel);
    $shared_version = is_readable($shared_path) ? (string) filemtime($shared_path) : MADEIT_BLOCKS_VERSION;
    wp_enqueue_style('madeit-shared-editor-controls', $shared_src, [], $shared_version);

    wp_register_style('madeit-block-editor-inline', false, [], MADEIT_BLOCKS_VERSION);
    wp_enqueue_style('madeit-block-editor-inline');

    wp_add_inline_style('madeit-block-editor-inline', '
        .block-editor-inserter__panel .components-button[aria-label="Made I.T."] {
            color: #1cacb4;
        }
        .block-editor-inserter__panel .components-button[aria-label="Made I.T."]:where(:hover, :focus) {
            color: #1cacb4;
        }
    ');

    // Rename the Advanced inspector panel title consistently across all blocks.
    wp_register_script('madeit-block-editor-inline', '', [], MADEIT_BLOCKS_VERSION, true);
    wp_enqueue_script('madeit-block-editor-inline');
    wp_add_inline_script('madeit-block-editor-inline', "(function(){\n\tfunction setAdvancedPanelTitle(){\n\t\tvar el = document.querySelector('.block-editor-block-inspector__advanced .components-panel__body-title .components-panel__body-toggle');\n\t\tif(!el) return;\n\t\tif(el.textContent !== 'CSS classe') el.textContent = 'CSS classe';\n\t}\n\tfunction boot(){\n\t\tsetAdvancedPanelTitle();\n\t\tvar target = document.querySelector('.interface-interface-skeleton__sidebar') || document.body;\n\t\tif(!target || !window.MutationObserver) return;\n\t\tvar obs = new MutationObserver(function(){ setAdvancedPanelTitle(); });\n\t\tobs.observe(target,{subtree:true,childList:true});\n\t}\n\tif(window.wp && wp.domReady){ wp.domReady(boot); } else if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }\n})();", 'after');
});

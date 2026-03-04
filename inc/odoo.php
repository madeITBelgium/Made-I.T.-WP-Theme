<?php

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('madeit_odoo_log')) {
    function madeit_odoo_log($message, $context = []) {
        if (function_exists('madeit_wc_api_log')) {
            madeit_wc_api_log($message, $context);
        }
    }
}

if (!function_exists('madeit_odoo_get_category_id_from_path')) {
    function madeit_odoo_get_category_id_from_path($path) {
        $path = trim((string) $path);
        if ($path === '' || $path === '[undefined]') {
            return null;
        }

        $cacheKey = 'madeit_odoo_category_id_' . md5($path);
        $cachedValue = get_transient($cacheKey);
        if ($cachedValue) {
            return (int) $cachedValue;
        }

        $parentId = 0;
        $segments = explode('/', $path);
        foreach ($segments as $segment) {
            $segment = trim($segment);
            if ($segment === '') {
                continue;
            }

            $args = [
                'taxonomy' => 'product_cat',
                'name' => $segment,
                'hide_empty' => false,
                'parent' => (int) $parentId,
            ];

            $terms = get_terms($args);
            if (is_wp_error($terms)) {
                madeit_odoo_log('Fout bij opvragen categorie', [
                    'categorie' => $segment,
                    'parent_id' => (int) $parentId,
                    'error_codes' => $terms->get_error_codes(),
                    'error_messages' => $terms->get_error_messages(),
                ]);
                return null;
            }

            if (!empty($terms)) {
                $parentId = (int) $terms[0]->term_id;
                continue;
            }

            $insertedTerm = wp_insert_term($segment, 'product_cat', [
                'parent' => (int) $parentId,
                'slug' => sanitize_title($segment),
            ]);

            if (is_wp_error($insertedTerm)) {
                madeit_odoo_log('Fout bij aanmaken categorie', [
                    'categorie' => $segment,
                    'parent_id' => (int) $parentId,
                    'error_codes' => $insertedTerm->get_error_codes(),
                    'error_messages' => $insertedTerm->get_error_messages(),
                ]);
                return null;
            }

            $parentId = isset($insertedTerm['term_id']) ? (int) $insertedTerm['term_id'] : 0;
        }

        if ($parentId) {
            set_transient($cacheKey, $parentId, 60 * 60 * 24 * 5);
        }

        return $parentId ?: null;
    }
}

if (!function_exists('madeit_odoo_sync_product_category_from_meta')) {
    function madeit_odoo_sync_product_category_from_meta($postId, $post = null, $update = false) {
        if (wp_is_post_autosave($postId) || wp_is_post_revision($postId)) {
            return;
        }

        if (get_post_type($postId) !== 'product') {
            return;
        }

        static $isRunning = false;
        if ($isRunning) {
            return;
        }

        $rawCategory = get_post_meta($postId, 'odoo_category_name', true);
        if (empty($rawCategory) || $rawCategory === '[undefined]') {
            return;
        }

        $paths = preg_split('/\r\n|\r|\n|\s*\|\s*/', (string) $rawCategory);
        $paths = array_filter(array_map('trim', (array) $paths));
        if (empty($paths)) {
            return;
        }

        $newCategoryIds = [];
        foreach ($paths as $path) {
            $termId = madeit_odoo_get_category_id_from_path($path);
            if ($termId) {
                $newCategoryIds[] = (int) $termId;
            }
        }

        $newCategoryIds = array_values(array_unique($newCategoryIds));
        if (empty($newCategoryIds)) {
            return;
        }

        $product = wc_get_product($postId);
        if (!$product) {
            madeit_odoo_log('Product niet gevonden voor categorie-update', [
                'product_id' => (int) $postId,
            ]);
            return;
        }

        $currentCategoryIds = $product->get_category_ids();
        $currentSorted = $currentCategoryIds;
        $newSorted = $newCategoryIds;
        sort($currentSorted);
        sort($newSorted);

        if ($currentSorted === $newSorted) {
            return;
        }

        $isRunning = true;
        try {
            $product->set_category_ids($newCategoryIds);
            $product->save();

            update_post_meta($postId, '_yoast_wpseo_primary_product_cat', $newCategoryIds[0]);

            madeit_odoo_log('Product categorieen bijgewerkt vanuit Odoo', [
                'product_id' => (int) $postId,
                'old_category_ids' => $currentCategoryIds,
                'new_category_ids' => $newCategoryIds,
                'primary_category_id' => (int) $newCategoryIds[0],
            ]);
        } catch (Throwable $e) {
            madeit_odoo_log('Fout bij updaten product categorieen vanuit Odoo', [
                'product_id' => (int) $postId,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }

        $isRunning = false;
    }
}

add_action('save_post_product', 'madeit_odoo_sync_product_category_from_meta', 20, 3);


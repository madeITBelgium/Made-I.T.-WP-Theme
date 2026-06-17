<?php

if (!defined('WP_CLI') || !WP_CLI) {
    return;
}

/**
 * WP-CLI command om een productcategorie veilig samen te voegen in een andere.
 *
 * Standaard: source 2379 -> target 1645.
 *
 * Gebruik:
 *   wp --require=wp-content/themes/madeit/inc/wpcli/merge-product-cat.php madeit merge-product-cat --dry-run
 *   wp --require=wp-content/themes/madeit/inc/wpcli/merge-product-cat.php madeit merge-product-cat --apply
 *   wp --require=wp-content/themes/madeit/inc/wpcli/merge-product-cat.php madeit merge-product-cat --source=2379 --target=1645 --apply
 */
class Madeit_Merge_Product_Cat_Command
{
    /** @var array<int, string|null> */
    private $languageCache = [];

    /** @var bool */
    private $hasWpmlTable = false;

    /**
     * Merge een broncategorie in een doelcategorie.
     *
     * ## OPTIONS
     *
     * [--source=<id>]
     * : Bron term_id. Standaard: 2379.
     *
     * [--target=<id>]
     * : Doel term_id. Standaard: 1645.
     *
     * [--taxonomy=<taxonomy>]
     * : Taxonomy. Standaard: product_cat.
     *
     * [--apply]
     * : Voer effectief wijzigingen uit. Zonder deze flag is het een dry-run.
     *
     * [--dry-run]
     * : Expliciete dry-run (default gedrag zonder --apply).
     *
     * ## EXAMPLES
     *
     *   wp --require=wp-content/themes/madeit/inc/wpcli/merge-product-cat.php madeit merge-product-cat --dry-run
     *   wp --require=wp-content/themes/madeit/inc/wpcli/merge-product-cat.php madeit merge-product-cat --source=2379 --target=1645 --apply
     *
     * @when after_wp_load
     */
    public function __invoke($args, $assocArgs)
    {
        global $wpdb;

        $sourceId = isset($assocArgs['source']) ? (int) $assocArgs['source'] : 2379;
        $targetId = isset($assocArgs['target']) ? (int) $assocArgs['target'] : 1645;
        $taxonomy = isset($assocArgs['taxonomy']) ? sanitize_key((string) $assocArgs['taxonomy']) : 'product_cat';

        $apply = \WP_CLI\Utils\get_flag_value($assocArgs, 'apply', false);
        $dryRun = !$apply || \WP_CLI\Utils\get_flag_value($assocArgs, 'dry-run', false);

        if (!taxonomy_exists($taxonomy)) {
            \WP_CLI::error("Taxonomy '{$taxonomy}' bestaat niet.");
        }

        if ($sourceId <= 0 || $targetId <= 0) {
            \WP_CLI::error('Ongeldige source/target term_id.');
        }

        if ($sourceId === $targetId) {
            \WP_CLI::error('Source en target mogen niet gelijk zijn.');
        }

        $sourceTerm = get_term($sourceId, $taxonomy);
        $targetTerm = get_term($targetId, $taxonomy);

        if (!$sourceTerm || is_wp_error($sourceTerm)) {
            \WP_CLI::error("Bronterm {$sourceId} niet gevonden in taxonomy '{$taxonomy}'.");
        }

        if (!$targetTerm || is_wp_error($targetTerm)) {
            \WP_CLI::error("Doelterm {$targetId} niet gevonden in taxonomy '{$taxonomy}'.");
        }

        $this->hasWpmlTable = $this->tableExists($wpdb->prefix . 'icl_translations');

        \WP_CLI::log('Modus: ' . ($dryRun ? 'DRY-RUN' : 'APPLY'));
        \WP_CLI::log("Merge: {$sourceId} ({$sourceTerm->name}) -> {$targetId} ({$targetTerm->name})");

        $stats = [
            'products_touched' => 0,
            'children_reparented' => 0,
            'children_merged' => 0,
            'terms_deleted' => 0,
            'errors' => 0,
        ];

        $this->mergeTermInto($sourceId, $targetId, $taxonomy, $dryRun, $stats);

        \WP_CLI::log('');
        if ($stats['errors'] > 0) {
            \WP_CLI::warning(
                'Klaar met fouten. ' .
                'products_touched=' . $stats['products_touched'] . ', ' .
                'children_reparented=' . $stats['children_reparented'] . ', ' .
                'children_merged=' . $stats['children_merged'] . ', ' .
                'terms_deleted=' . $stats['terms_deleted'] . ', ' .
                'errors=' . $stats['errors']
            );
            return;
        }

        \WP_CLI::success(
            ($dryRun ? 'DRY-RUN klaar. ' : 'Klaar. ') .
            'products_touched=' . $stats['products_touched'] . ', ' .
            'children_reparented=' . $stats['children_reparented'] . ', ' .
            'children_merged=' . $stats['children_merged'] . ', ' .
            'terms_deleted=' . $stats['terms_deleted']
        );
    }

    private function mergeTermInto($sourceId, $targetId, $taxonomy, $dryRun, &$stats)
    {
        // 1) Producten van source naar target verplaatsen.
        $sourceProductIds = get_objects_in_term((int) $sourceId, $taxonomy);
        if (is_wp_error($sourceProductIds)) {
            $stats['errors']++;
            \WP_CLI::warning('Kon gekoppelde producten niet ophalen voor term ' . (int) $sourceId);
            $sourceProductIds = [];
        }

        foreach ($sourceProductIds as $productId) {
            $productId = (int) $productId;
            $currentTerms = wp_get_object_terms($productId, $taxonomy, ['fields' => 'ids']);
            if (is_wp_error($currentTerms)) {
                $stats['errors']++;
                \WP_CLI::warning("Kon categorieen niet ophalen voor product {$productId}.");
                continue;
            }

            $currentTerms = array_map('intval', (array) $currentTerms);
            $newTerms = [];
            foreach ($currentTerms as $termId) {
                if ($termId === (int) $sourceId) {
                    $newTerms[] = (int) $targetId;
                } else {
                    $newTerms[] = (int) $termId;
                }
            }
            $newTerms = array_values(array_unique($newTerms));

            if ($newTerms === $currentTerms) {
                continue;
            }

            if ($dryRun) {
                \WP_CLI::log("  [DRY-RUN] Product {$productId}: term {$sourceId} -> {$targetId}");
                $stats['products_touched']++;
                continue;
            }

            $setResult = wp_set_object_terms($productId, $newTerms, $taxonomy, false);
            if (is_wp_error($setResult)) {
                $stats['errors']++;
                \WP_CLI::warning("Product {$productId} kon niet geupdatet worden: " . $setResult->get_error_message());
                continue;
            }

            $stats['products_touched']++;
        }

        // 2) Directe subcategorieen vergelijken en samenvoegen/herhangen.
        $sourceChildren = $this->getChildren((int) $sourceId, $taxonomy);
        $targetChildren = $this->getChildren((int) $targetId, $taxonomy);
        $targetMap = $this->buildChildLookupMap($targetChildren, $taxonomy);

        foreach ($sourceChildren as $sourceChild) {
            $sourceChildId = (int) $sourceChild->term_id;
            $key = $this->buildMergeKey($sourceChild, $taxonomy);

            if (isset($targetMap[$key])) {
                $targetChildId = (int) $targetMap[$key]->term_id;
                $stats['children_merged']++;

                \WP_CLI::log("  Subcategorie merge: {$sourceChildId} ({$sourceChild->slug}) -> {$targetChildId} ({$targetMap[$key]->slug})");
                $this->mergeTermInto($sourceChildId, $targetChildId, $taxonomy, $dryRun, $stats);
                continue;
            }

            if ($dryRun) {
                \WP_CLI::log("  [DRY-RUN] Subcategorie herhangen: {$sourceChildId} parent {$sourceId} -> {$targetId}");
                $stats['children_reparented']++;
                continue;
            }

            $updated = wp_update_term($sourceChildId, $taxonomy, [
                'parent' => (int) $targetId,
            ]);

            if (is_wp_error($updated)) {
                $stats['errors']++;
                \WP_CLI::warning("Subcategorie {$sourceChildId} kon niet herhangen worden: " . $updated->get_error_message());
                continue;
            }

            $stats['children_reparented']++;
        }

        // 3) Source term verwijderen nadat producten/kinderen verwerkt zijn.
        if ($dryRun) {
            \WP_CLI::log("  [DRY-RUN] Term verwijderen: {$sourceId}");
            $stats['terms_deleted']++;
            return;
        }

        $deleted = wp_delete_term((int) $sourceId, $taxonomy);
        if (is_wp_error($deleted) || !$deleted) {
            $stats['errors']++;
            $message = is_wp_error($deleted) ? $deleted->get_error_message() : 'onbekende fout';
            \WP_CLI::warning("Term {$sourceId} kon niet verwijderd worden: {$message}");
            return;
        }

        $stats['terms_deleted']++;
    }

    private function getChildren($parentId, $taxonomy)
    {
        $children = get_terms([
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
            'parent' => (int) $parentId,
        ]);

        if (is_wp_error($children) || !is_array($children)) {
            return [];
        }

        return $children;
    }

    private function buildChildLookupMap($children, $taxonomy)
    {
        $map = [];

        foreach ($children as $child) {
            $key = $this->buildMergeKey($child, $taxonomy);
            if (!isset($map[$key])) {
                $map[$key] = $child;
                continue;
            }

            // Bij dubbele sleutel onder target nemen we de oudste term.
            if ((int) $child->term_id < (int) $map[$key]->term_id) {
                $map[$key] = $child;
            }
        }

        return $map;
    }

    private function buildMergeKey($term, $taxonomy)
    {
        $slug = sanitize_title((string) $term->slug);
        if ($slug === '') {
            $slug = sanitize_title((string) $term->name);
        }

        $lang = $this->getTermLanguage((int) $term->term_id, $taxonomy);
        if ($lang === null || $lang === '') {
            return $slug;
        }

        return $slug . '|' . $lang;
    }

    private function getTermLanguage($termId, $taxonomy)
    {
        global $wpdb;

        $termId = (int) $termId;
        if (array_key_exists($termId, $this->languageCache)) {
            return $this->languageCache[$termId];
        }

        if (!$this->hasWpmlTable) {
            $this->languageCache[$termId] = null;
            return null;
        }

        $termTaxonomyId = $wpdb->get_var($wpdb->prepare(
            "SELECT term_taxonomy_id FROM {$wpdb->term_taxonomy} WHERE term_id = %d AND taxonomy = %s LIMIT 1",
            $termId,
            $taxonomy
        ));

        if (!$termTaxonomyId) {
            $this->languageCache[$termId] = null;
            return null;
        }

        $languageCode = $wpdb->get_var($wpdb->prepare(
            "SELECT language_code
             FROM {$wpdb->prefix}icl_translations
             WHERE element_type = %s
               AND element_id = %d
             LIMIT 1",
            'tax_' . $taxonomy,
            (int) $termTaxonomyId
        ));

        $languageCode = $languageCode ? sanitize_key((string) $languageCode) : null;
        $this->languageCache[$termId] = $languageCode;

        return $languageCode;
    }

    private function tableExists($tableName)
    {
        global $wpdb;

        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $tableName));
        return $found === $tableName;
    }
}

WP_CLI::add_command('madeit merge-product-cat', 'Madeit_Merge_Product_Cat_Command');

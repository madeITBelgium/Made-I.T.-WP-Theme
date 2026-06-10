<?php

if (!defined('WP_CLI') || !WP_CLI) {
    return;
}

/**
 * Tijdelijk WP-CLI command om dubbele slugs in product_cat op te sporen en te herstellen.
 *
 * Gebruik:
 *   wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs --dry-run
 *   wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs
 */
class Madeit_Fix_Duplicate_Product_Cat_Slugs_Command
{
    /**
     * Spoor dubbele slugs op en herstel ze.
     *
     * ## OPTIONS
     *
     * [--dry-run]
     * : Toon welke wijzigingen zouden gebeuren zonder data aan te passen.
     *
     * [--taxonomy=<taxonomy>]
     * : Taxonomy om te controleren. Standaard: product_cat.
     *
     * ## EXAMPLES
     *
     *     wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs --dry-run
     *     wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs
     *
     * @when after_wp_load
     */
    public function __invoke($args, $assocArgs)
    {
        $dryRun = \WP_CLI\Utils\get_flag_value($assocArgs, 'dry-run', false);
        $taxonomy = isset($assocArgs['taxonomy']) ? sanitize_key((string) $assocArgs['taxonomy']) : 'product_cat';

        if (!taxonomy_exists($taxonomy)) {
            \WP_CLI::error("Taxonomy '{$taxonomy}' bestaat niet.");
        }

        $terms = get_terms([
            'taxonomy'   => $taxonomy,
            'hide_empty' => false,
        ]);

        if (is_wp_error($terms)) {
            \WP_CLI::error('Kon termen niet ophalen: ' . $terms->get_error_message());
        }

        if (empty($terms)) {
            \WP_CLI::success("Geen termen gevonden in taxonomy '{$taxonomy}'.");
            return;
        }

        $bySlug = [];
        foreach ($terms as $term) {
            $slug = (string) $term->slug;
            if (!isset($bySlug[$slug])) {
                $bySlug[$slug] = [];
            }
            $bySlug[$slug][] = $term;
        }

        $duplicateGroups = [];
        foreach ($bySlug as $slug => $group) {
            if (count($group) > 1) {
                usort($group, static function ($a, $b) {
                    return (int) $a->term_id <=> (int) $b->term_id;
                });
                $duplicateGroups[$slug] = $group;
            }
        }

        if (empty($duplicateGroups)) {
            \WP_CLI::success("Geen dubbele slugs gevonden in taxonomy '{$taxonomy}'.");
            return;
        }

        $usedSlugs = $this->buildUsedSlugsMap($taxonomy);

        $fixedCount = 0;
        $errorCount = 0;

        \WP_CLI::log('Dubbele slugs gevonden: ' . count($duplicateGroups));

        foreach ($duplicateGroups as $slug => $group) {
            \WP_CLI::log('');
            \WP_CLI::log("Slug '{$slug}' komt " . count($group) . 'x voor.');

            // Laat de oudste term ongewijzigd en herstel de rest.
            $keeper = array_shift($group);
            \WP_CLI::log('  Behouden: term_id=' . (int) $keeper->term_id . ' name="' . $keeper->name . '"');

            foreach ($group as $term) {
                $baseSlug = $this->buildBaseSlug($term, $taxonomy);
                if ($baseSlug === '') {
                    $baseSlug = 'term-' . (int) $term->term_id;
                }

                $newSlug = $this->makeUniqueSlug($baseSlug, $taxonomy, (int) $term->term_id, $usedSlugs);

                if ($newSlug === (string) $term->slug) {
                    $newSlug = $this->makeUniqueSlug(
                        $baseSlug . '-' . (int) $term->term_id,
                        $taxonomy,
                        (int) $term->term_id,
                        $usedSlugs
                    );
                }

                if ($dryRun) {
                    \WP_CLI::log(
                        '  [DRY-RUN] term_id=' . (int) $term->term_id .
                        ' name="' . $term->name . '" slug: "' . $term->slug . '" -> "' . $newSlug . '"'
                    );
                    $fixedCount++;
                    continue;
                }

                $updated = wp_update_term((int) $term->term_id, $taxonomy, [
                    'slug' => $newSlug,
                ]);

                if (is_wp_error($updated)) {
                    $errorCount++;
                    \WP_CLI::warning(
                        '  term_id=' . (int) $term->term_id .
                        ' kon niet geupdatet worden: ' .
                        $updated->get_error_message()
                    );
                    continue;
                }

                \WP_CLI::log(
                    '  term_id=' . (int) $term->term_id .
                    ' aangepast: "' . $term->slug . '" -> "' . $newSlug . '"'
                );
                $fixedCount++;
            }
        }

        \WP_CLI::log('');
        if ($dryRun) {
            \WP_CLI::success("DRY-RUN klaar. {$fixedCount} term(en) zouden aangepast worden.");
            return;
        }

        if ($errorCount > 0) {
            \WP_CLI::warning("Klaar met {$errorCount} fout(en). {$fixedCount} term(en) aangepast.");
            return;
        }

        \WP_CLI::success("Klaar. {$fixedCount} term(en) aangepast.");
    }

    private function buildUsedSlugsMap($taxonomy)
    {
        $terms = get_terms([
            'taxonomy'   => $taxonomy,
            'hide_empty' => false,
            'fields'     => 'all',
        ]);

        $map = [];
        if (is_wp_error($terms) || empty($terms)) {
            return $map;
        }

        foreach ($terms as $term) {
            $slug = (string) $term->slug;
            if (!isset($map[$slug])) {
                $map[$slug] = [];
            }
            $map[$slug][(int) $term->term_id] = true;
        }

        return $map;
    }

    private function buildBaseSlug($term, $taxonomy)
    {
        $parts = [];
        $ancestors = get_ancestors((int) $term->term_id, $taxonomy, 'taxonomy');

        if (!empty($ancestors)) {
            $ancestors = array_reverse($ancestors);
            foreach ($ancestors as $ancestorId) {
                $ancestor = get_term((int) $ancestorId, $taxonomy);
                if ($ancestor && !is_wp_error($ancestor) && $ancestor->slug !== '') {
                    $parts[] = (string) $ancestor->slug;
                }
            }
        }

        $selfSlug = sanitize_title((string) $term->name);
        if ($selfSlug === '') {
            $selfSlug = sanitize_title((string) $term->slug);
        }
        if ($selfSlug !== '') {
            $parts[] = $selfSlug;
        }

        return sanitize_title(implode('-', $parts));
    }

    private function makeUniqueSlug($baseSlug, $taxonomy, $termId, &$usedSlugs)
    {
        $baseSlug = sanitize_title((string) $baseSlug);
        if ($baseSlug === '') {
            $baseSlug = 'term-' . (int) $termId;
        }

        $candidate = $baseSlug;
        $index = 2;

        while (!$this->isSlugAvailableForTerm($candidate, (int) $termId, $usedSlugs)) {
            $candidate = $baseSlug . '-' . $index;
            $index++;

            if ($index > 10000) {
                // Extreme safeguard tegen oneindige loop bij corrupte data.
                $candidate = $baseSlug . '-' . (int) $termId;
                break;
            }
        }

        if (!isset($usedSlugs[$candidate])) {
            $usedSlugs[$candidate] = [];
        }
        $usedSlugs[$candidate][(int) $termId] = true;

        return $candidate;
    }

    private function isSlugAvailableForTerm($slug, $termId, $usedSlugs)
    {
        if (!isset($usedSlugs[$slug])) {
            return true;
        }

        if (count($usedSlugs[$slug]) === 1 && isset($usedSlugs[$slug][$termId])) {
            return true;
        }

        return false;
    }
}

WP_CLI::add_command('madeit fix-duplicate-product-cat-slugs', 'Madeit_Fix_Duplicate_Product_Cat_Slugs_Command');

<?php

if (!defined('WP_CLI') || !WP_CLI) {
    return;
}

/**
 * Tijdelijk WP-CLI command om product_cat slug- en parent-problemen veilig op te sporen en te herstellen.
 *
 * Gebruik:
 *   wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs --dry-run
 *   wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs --apply
 */
class Madeit_Fix_Duplicate_Product_Cat_Slugs_Command
{
    /**
     * Spoor dubbele slugs op en herstel ze.
     *
     * ## OPTIONS
     *
     * [--apply]
     * : Voer de wijzigingen effectief uit. Zonder deze flag draait het commando in dry-run modus.
     *
     * [--dry-run]
     * : Alias voor expliciet dry-run gedrag.
     *
     * [--taxonomy=<taxonomy>]
     * : Taxonomy om te controleren. Standaard: product_cat.
     *
     * [--languages=<languages>]
     * : Komma-gescheiden talen om te controleren in WPML. Standaard: nl,fr.
     *
     * [--default-language=<code>]
     * : Taalcode die voorkeur krijgt als slug behouden moet worden. Standaard: nl.
     *
     * [--fix-parent-orphans]
     * : Zet corrupte parent-referenties (parent bestaat niet in dezelfde taxonomy) op 0.
     *
     * ## EXAMPLES
     *
     *     wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs --dry-run
     *     wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs --apply
     *     wp --require=wp-content/themes/madeit/inc/wpcli/fix-duplicate-product-cat-slugs.php madeit fix-duplicate-product-cat-slugs --apply --fix-parent-orphans
     *
     * @when after_wp_load
     */
    public function __invoke($args, $assocArgs)
    {
        global $wpdb;

        $apply = \WP_CLI\Utils\get_flag_value($assocArgs, 'apply', false);
        $dryRun = !$apply || \WP_CLI\Utils\get_flag_value($assocArgs, 'dry-run', false);
        $taxonomy = isset($assocArgs['taxonomy']) ? sanitize_key((string) $assocArgs['taxonomy']) : 'product_cat';
        $defaultLanguage = isset($assocArgs['default-language']) ? sanitize_key((string) $assocArgs['default-language']) : 'nl';
        $languagesRaw = isset($assocArgs['languages']) ? (string) $assocArgs['languages'] : 'nl,fr';
        $fixParentOrphans = \WP_CLI\Utils\get_flag_value($assocArgs, 'fix-parent-orphans', false);

        $languages = $this->parseLanguages($languagesRaw);
        if (empty($languages)) {
            \WP_CLI::error('Geen geldige talen ontvangen. Gebruik bv --languages=nl,fr');
        }

        if (!taxonomy_exists($taxonomy)) {
            \WP_CLI::error("Taxonomy '{$taxonomy}' bestaat niet.");
        }

        if (!$this->tableExists($wpdb->prefix.'icl_translations')) {
            \WP_CLI::error('WPML tabel icl_translations niet gevonden. Dit commando verwacht WPML.');
        }

        \WP_CLI::log('Modus: '.($dryRun ? 'DRY-RUN' : 'APPLY'));

        $rows = $this->getWpmlTaxonomyRows($taxonomy, $languages);
        if (empty($rows)) {
            \WP_CLI::success("Geen termen gevonden in taxonomy '{$taxonomy}' voor talen: ".implode(',', $languages).'.');

            return;
        }

        $usedSlugs = $this->buildUsedSlugsMap($taxonomy);
        $duplicateGroups = $this->groupDuplicateSlugs($rows);

        $plannedSlugChanges = [];
        $keptCount = 0;

        foreach ($duplicateGroups as $slug => $group) {
            $classification = $this->classifyGroup($group);
            if (!$classification['needs_fix']) {
                continue;
            }

            usort($group, function ($a, $b) use ($defaultLanguage) {
                return $this->compareCandidates($a, $b, $defaultLanguage);
            });

            $keeper = array_shift($group);
            $keptCount++;

            \WP_CLI::log('');
            \WP_CLI::log("Slug '{$slug}' is verdacht: {$classification['reason']}");
            \WP_CLI::log(
                '  Behouden: term_id='.(int) $keeper['term_id'].
                ' lang='.$keeper['language_code'].
                ' trid='.(int) $keeper['trid'].
                ' name="'.$keeper['name'].'"'
            );

            foreach ($group as $term) {
                $baseSlug = $this->buildSafeBaseSlug($term);
                $newSlug = $this->makeUniqueSlug($baseSlug, (int) $term['term_id'], $usedSlugs);

                if ($newSlug === (string) $term['slug']) {
                    $newSlug = $this->makeUniqueSlug(
                        $baseSlug.'-'.(int) $term['term_id'],
                        (int) $term['term_id'],
                        $usedSlugs
                    );
                }

                $plannedSlugChanges[] = [
                    'term_id'       => (int) $term['term_id'],
                    'taxonomy'      => $taxonomy,
                    'old_slug'      => (string) $term['slug'],
                    'new_slug'      => $newSlug,
                    'name'          => (string) $term['name'],
                    'language_code' => (string) $term['language_code'],
                    'trid'          => (int) $term['trid'],
                ];

                \WP_CLI::log(
                    '  '.($dryRun ? '[DRY-RUN] ' : '').
                    'term_id='.(int) $term['term_id'].
                    ' lang='.$term['language_code'].
                    ' trid='.(int) $term['trid'].
                    ' slug: "'.$term['slug'].'" -> "'.$newSlug.'"'
                );
            }
        }

        $parentOrphans = $this->findParentOrphans($taxonomy);
        foreach ($parentOrphans as $orphan) {
            \WP_CLI::log(
                '  '.($dryRun ? '[DRY-RUN] ' : '').
                'Orphan parent: term_id='.(int) $orphan['term_id'].
                ' parent='.(int) $orphan['parent'].
                ($fixParentOrphans ? ' -> 0' : ' (geen wijziging zonder --fix-parent-orphans)')
            );
        }

        $slugFixedCount = 0;
        $parentFixedCount = 0;
        $errorCount = 0;

        if (!$dryRun) {
            foreach ($plannedSlugChanges as $change) {
                $updated = wp_update_term((int) $change['term_id'], $taxonomy, [
                    'slug' => $change['new_slug'],
                ]);

                if (is_wp_error($updated)) {
                    $errorCount++;
                    \WP_CLI::warning(
                        'Slug update mislukt voor term_id='.(int) $change['term_id'].
                        ': '.$updated->get_error_message()
                    );
                    continue;
                }

                $slugFixedCount++;
            }

            if ($fixParentOrphans) {
                foreach ($parentOrphans as $orphan) {
                    $result = wp_update_term((int) $orphan['term_id'], $taxonomy, [
                        'parent' => 0,
                    ]);

                    if (is_wp_error($result)) {
                        $errorCount++;
                        \WP_CLI::warning(
                            'Parent-fix mislukt voor term_id='.(int) $orphan['term_id'].
                            ': '.$result->get_error_message()
                        );
                        continue;
                    }

                    $parentFixedCount++;
                }
            }
        }

        \WP_CLI::log('');

        if ($dryRun) {
            \WP_CLI::success(
                'DRY-RUN klaar. '.
                count($plannedSlugChanges).' slug-wijziging(en) gepland, '.
                count($parentOrphans).' orphan parent(s) gevonden'.
                ($fixParentOrphans ? ' (zouden op 0 gezet worden)' : '').
                '. Bewaarde primaire termen: '.$keptCount.'.'
            );

            return;
        }

        if ($errorCount > 0) {
            \WP_CLI::warning(
                "Klaar met {$errorCount} fout(en). {$slugFixedCount} slug(s) aangepast, {$parentFixedCount} parent(s) hersteld."
            );

            return;
        }

        \WP_CLI::success("Klaar. {$slugFixedCount} slug(s) aangepast, {$parentFixedCount} parent(s) hersteld.");
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

    private function parseLanguages($languagesRaw)
    {
        $rawParts = array_map('trim', explode(',', (string) $languagesRaw));
        $languages = [];

        foreach ($rawParts as $part) {
            $lang = sanitize_key($part);
            if ($lang === '') {
                continue;
            }
            $languages[] = $lang;
        }

        return array_values(array_unique($languages));
    }

    private function tableExists($tableName)
    {
        global $wpdb;

        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $tableName));

        return $found === $tableName;
    }

    private function getWpmlTaxonomyRows($taxonomy, $languages)
    {
        global $wpdb;

        $languageSql = implode(',', array_fill(0, count($languages), '%s'));
        $params = [
            'tax_'.$taxonomy,
            $taxonomy,
        ];
        foreach ($languages as $lang) {
            $params[] = $lang;
        }

        $sql = "
            SELECT
                t.term_id,
                t.name,
                t.slug,
                tt.term_taxonomy_id,
                tt.parent,
                tr.language_code,
                tr.trid
            FROM {$wpdb->terms} t
            INNER JOIN {$wpdb->term_taxonomy} tt
                ON tt.term_id = t.term_id
            INNER JOIN {$wpdb->prefix}icl_translations tr
                ON tr.element_id = tt.term_taxonomy_id
                AND tr.element_type = %s
            WHERE tt.taxonomy = %s
              AND tr.language_code IN ({$languageSql})
            ORDER BY t.slug, tr.language_code, t.term_id
        ";

        $prepared = $wpdb->prepare($sql, $params);
        $rows = $wpdb->get_results($prepared, ARRAY_A);

        if (!is_array($rows)) {
            return [];
        }

        return $rows;
    }

    private function groupDuplicateSlugs($rows)
    {
        $bySlug = [];
        foreach ($rows as $row) {
            $slug = (string) $row['slug'];
            if ($slug === '') {
                continue;
            }
            if (!isset($bySlug[$slug])) {
                $bySlug[$slug] = [];
            }
            $bySlug[$slug][] = $row;
        }

        $duplicates = [];
        foreach ($bySlug as $slug => $group) {
            if (count($group) > 1) {
                $duplicates[$slug] = $group;
            }
        }

        return $duplicates;
    }

    private function classifyGroup($group)
    {
        $languages = [];
        $trids = [];
        $slugPerLanguageCount = [];

        foreach ($group as $term) {
            $lang = (string) $term['language_code'];
            $languages[$lang] = true;
            $trids[(string) $term['trid']] = true;
            if (!isset($slugPerLanguageCount[$lang])) {
                $slugPerLanguageCount[$lang] = 0;
            }
            $slugPerLanguageCount[$lang]++;
        }

        $hasIntraLanguageDuplicates = false;
        foreach ($slugPerLanguageCount as $count) {
            if ($count > 1) {
                $hasIntraLanguageDuplicates = true;
                break;
            }
        }

        $hasCrossLanguageCollision = count($languages) > 1;
        $singleTrid = count($trids) === 1;

        if ($hasIntraLanguageDuplicates) {
            return [
                'needs_fix' => true,
                'reason'    => 'duplicaat binnen dezelfde taal',
            ];
        }

        if ($hasCrossLanguageCollision && !$singleTrid) {
            return [
                'needs_fix' => true,
                'reason'    => 'zelfde slug over talen met verschillende WPML trid',
            ];
        }

        return [
            'needs_fix' => false,
            'reason'    => 'zelfde slug binnen dezelfde WPML vertaalgroep',
        ];
    }

    private function compareCandidates($a, $b, $defaultLanguage)
    {
        $aDefault = ((string) $a['language_code']) === $defaultLanguage;
        $bDefault = ((string) $b['language_code']) === $defaultLanguage;

        if ($aDefault !== $bDefault) {
            return $aDefault ? -1 : 1;
        }

        return (int) $a['term_id'] <=> (int) $b['term_id'];
    }

    private function buildSafeBaseSlug($term)
    {
        $slug = sanitize_title((string) $term['slug']);
        if ($slug === '') {
            $slug = sanitize_title((string) $term['name']);
        }
        if ($slug === '') {
            $slug = 'term';
        }

        $lang = sanitize_title((string) $term['language_code']);
        if ($lang === '') {
            $lang = 'x';
        }

        $suffix = '-'.$lang.'-'.(int) $term['term_id'];
        $maxBaseLen = 180 - strlen($suffix);
        if ($maxBaseLen < 20) {
            $maxBaseLen = 20;
        }

        $slugBase = substr($slug, 0, $maxBaseLen);
        $slugBase = rtrim($slugBase, '-');

        if ($slugBase === '') {
            $slugBase = 'term';
        }

        return $slugBase.$suffix;
    }

    private function findParentOrphans($taxonomy)
    {
        global $wpdb;

        $sql = "
            SELECT child.term_id, child.parent
            FROM {$wpdb->term_taxonomy} child
            LEFT JOIN {$wpdb->term_taxonomy} parent
                ON parent.term_id = child.parent
                AND parent.taxonomy = child.taxonomy
            WHERE child.taxonomy = %s
              AND child.parent <> 0
              AND parent.term_taxonomy_id IS NULL
            ORDER BY child.term_id
        ";

        $prepared = $wpdb->prepare($sql, $taxonomy);
        $rows = $wpdb->get_results($prepared, ARRAY_A);

        if (!is_array($rows)) {
            return [];
        }

        return $rows;
    }

    private function makeUniqueSlug($baseSlug, $termId, &$usedSlugs)
    {
        $baseSlug = sanitize_title((string) $baseSlug);
        if ($baseSlug === '') {
            $baseSlug = 'term-'.(int) $termId;
        }

        $candidate = $baseSlug;
        $index = 2;

        while (!$this->isSlugAvailableForTerm($candidate, (int) $termId, $usedSlugs)) {
            $candidate = $baseSlug.'-'.$index;
            $index++;

            if ($index > 10000) {
                // Extreme safeguard tegen oneindige loop bij corrupte data.
                $candidate = $baseSlug.'-'.(int) $termId;
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

<?php

if (!defined('ABSPATH')) {
    exit;
}

function madeit_get_all_changelogs()
{
    $blocks = madeit_get_all_blocks();

    $versions = [];

    foreach ($blocks as $slug => $block) {
        if (empty($block['madeit']['changelog'])) {
            continue;
        }

        foreach ($block['madeit']['changelog'] as $version => $items) {
            if (!isset($versions[$version])) {
                $versions[$version] = [];
            }

            $versions[$version][] = [
                'block' => $block['title'],
                'slug'  => $slug,
                'items' => $items,
            ];
        }
    }

    // newest first
    uksort($versions, 'version_compare');
    $versions = array_reverse($versions, true);

    return $versions;
}

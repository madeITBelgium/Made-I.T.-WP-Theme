#!/usr/bin/env php
<?php

if ($argc !== 3) {
    fwrite(STDERR, "Usage: php compare-filters-hooks.php <old-file.json> <new-file.json>\n");
    exit(1);
}

[$oldFile, $newFile] = array_slice($argv, 1);

foreach ([$oldFile, $newFile] as $file) {
    if (!is_readable($file)) {
        fwrite(STDERR, "File not readable: $file\n");
        exit(1);
    }
}

$oldData = json_decode(file_get_contents($oldFile), true);
$newData = json_decode(file_get_contents($newFile), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    fwrite(STDERR, 'JSON error: '.json_last_error_msg()."\n");
    exit(1);
}

$summary = [
    'files_added'   => 0,
    'files_removed' => 0,
    'hooks_added'   => 0,
    'hooks_removed' => 0,
    'hooks_changed' => 0,
];

$oldFiles = array_keys($oldData);
$newFiles = array_keys($newData);
$addedFiles = array_diff($newFiles, $oldFiles);
$removedFiles = array_diff($oldFiles, $newFiles);
$commonFiles = array_intersect($oldFiles, $newFiles);

if ($addedFiles) {
    echo "Files added:\n";
    foreach ($addedFiles as $file) {
        echo "  + $file\n";
        $summary['files_added']++;
    }
    echo "\n";
}

if ($removedFiles) {
    echo "Files removed:\n";
    foreach ($removedFiles as $file) {
        echo "  - $file\n";
        $summary['files_removed']++;
    }
    echo "\n";
}

foreach ($commonFiles as $file) {
    $fileOld = $oldData[$file];
    $fileNew = $newData[$file];
    $fileChanges = [];

    foreach (['defined', 'filters', 'actions'] as $category) {
        $oldCategory = $fileOld[$category] ?? [];
        $newCategory = $fileNew[$category] ?? [];

        $addedHooks = array_diff(array_keys($newCategory), array_keys($oldCategory));
        $removedHooks = array_diff(array_keys($oldCategory), array_keys($newCategory));
        $commonHooks = array_intersect(array_keys($oldCategory), array_keys($newCategory));

        foreach ($addedHooks as $hook) {
            $fileChanges[] = "  + [$category] $hook";
            $summary['hooks_added']++;
        }
        foreach ($removedHooks as $hook) {
            $fileChanges[] = "  - [$category] $hook";
            $summary['hooks_removed']++;
        }

        foreach ($commonHooks as $hook) {
            $changes = [];
            $oldHook = $oldCategory[$hook];
            $newHook = $newCategory[$hook];

            foreach (['linenr', 'line', 'default'] as $field) {
                $oldValue = $oldHook[$field] ?? null;
                $newValue = $newHook[$field] ?? null;
                if ($oldValue !== $newValue) {
                    $changes[] = "$field: ".displayDiff($oldValue, $newValue);
                }
            }

            if ($changes) {
                $fileChanges[] = "  * [$category] $hook";
                foreach ($changes as $change) {
                    $fileChanges[] = "      - $change";
                }
                $summary['hooks_changed']++;
            }
        }
    }

    if ($fileChanges) {
        echo "Changes in file: $file\n";
        echo implode("\n", $fileChanges)."\n\n";
    }
}

if ($summary['files_added'] === 0 && $summary['files_removed'] === 0 && $summary['hooks_added'] === 0 && $summary['hooks_removed'] === 0 && $summary['hooks_changed'] === 0) {
    echo "No differences found.\n";
    exit(0);
}

echo "Summary:\n";
echo "  Files added:   {$summary['files_added']}\n";
echo "  Files removed: {$summary['files_removed']}\n";
echo "  Hooks added:   {$summary['hooks_added']}\n";
echo "  Hooks removed: {$summary['hooks_removed']}\n";
echo "  Hooks changed: {$summary['hooks_changed']}\n";

function displayDiff($oldValue, $newValue)
{
    $old = $oldValue === null ? '<missing>' : trim((string) $oldValue);
    $new = $newValue === null ? '<missing>' : trim((string) $newValue);
    if ($old === $new) {
        return $old;
    }

    return "'$old' -> '$new'";
}

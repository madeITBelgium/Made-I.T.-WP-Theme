<?php

$curDir = __DIR__;
$themeRoot = realpath($curDir.'/..');
if ($themeRoot === false) {
    fwrite(STDERR, "Unable to resolve theme root directory\n");
    exit(1);
}

$stylePath = $themeRoot.'/style.css';
if (!is_readable($stylePath)) {
    fwrite(STDERR, "Unable to read theme style.css at: $stylePath\n");
    exit(1);
}

preg_match_all('/Version:\s*(.*)/', file_get_contents($stylePath), $output_array);
if (empty($output_array[1][0])) {
    fwrite(STDERR, "Unable to read theme version from style.css\n");
    exit(1);
}
$version = trim($output_array[1][0]);

$json = [];
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($themeRoot, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

foreach ($iterator as $item) {
    if ($item->isDir()) {
        continue;
    }

    $subPath = $iterator->getSubPathName();
    if (strpos($subPath, 'bin/') === 0 || strpos($subPath, 'node_modules/') === 0) {
        continue;
    }

    if (strtolower(pathinfo($subPath, PATHINFO_EXTENSION)) !== 'php') {
        continue;
    }

    $output = lookupSettings($item->getPathname());
    if (!is_array($output) || count($output) === 0) {
        continue;
    }

    echo $subPath."\n";

    if (!empty($output['defined'])) {
        echo 'Define: '.count($output['defined'])."\n";
        foreach ($output['defined'] as $key => $value) {
            echo $key."\tLijnnummer: ".$value['linenr']."\t Default: ".trim($value['default'])."\t (Ex: ".$value['line'].") \n";
        }
    }

    if (!empty($output['filters'])) {
        echo 'Filters: '.count($output['filters'])."\n";
        foreach ($output['filters'] as $key => $value) {
            echo $key."\tLijnnummer: ".$value['linenr']."\t Variables/Defaults: ".trim($value['default'])." \n";
        }
    }

    if (!empty($output['actions'])) {
        echo 'Actions: '.count($output['actions'])."\n";
        foreach ($output['actions'] as $key => $value) {
            echo $key."\tLijnnummer: ".$value['linenr']."\t Variables/Defaults: ".trim($value['default'])." \n";
        }
    }

    echo "\n\n\n";
    $json[$subPath] = $output;
}

$outFile = $curDir.'/filters-hooks-'.$version.'-'.date('Y-m-d-Hi').'.json';
if (file_put_contents($outFile, json_encode($json, JSON_PRETTY_PRINT)) === false) {
    fwrite(STDERR, "Unable to write JSON file: $outFile\n");
    exit(1);
}

echo "Written JSON to: $outFile\n";

function lookupSettings($path)
{
    $result = [];
    $content = file_get_contents($path);
    if ($content === false) {
        return $result;
    }

    preg_match_all('/\bdefine\b\(\s*["\']([\w_]+)["\']\s*,\s*(.*?)\s*\)/s', $content, $output_array, PREG_OFFSET_CAPTURE);
    foreach ($output_array[0] as $key => $line) {
        $result['defined'][$output_array[1][$key][0]] = [
            'linenr'  => substr_count(substr($content, 0, $line[1]), "\n") + 1,
            'line'    => $line[0],
            'default' => $output_array[2][$key][0],
        ];
    }

    preg_match_all('/\bapply_filters\b\(\s*["\']([^"\']+)["\']\s*,\s*(.*?)\s*\)/s', $content, $output_array, PREG_OFFSET_CAPTURE);
    foreach ($output_array[0] as $key => $line) {
        $result['filters'][$output_array[1][$key][0]] = [
            'linenr'  => substr_count(substr($content, 0, $line[1]), "\n") + 1,
            'line'    => $line[0],
            'default' => $output_array[2][$key][0],
        ];
    }

    preg_match_all('/\bdo_action\b\(\s*["\']([^"\']+)["\']\s*,\s*(.*?)\s*\)/s', $content, $output_array, PREG_OFFSET_CAPTURE);
    foreach ($output_array[0] as $key => $line) {
        $result['actions'][$output_array[1][$key][0]] = [
            'linenr'  => substr_count(substr($content, 0, $line[1]), "\n") + 1,
            'line'    => $line[0],
            'default' => $output_array[2][$key][0],
        ];
    }

    return $result;
}

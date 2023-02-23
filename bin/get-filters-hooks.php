<?php

$it = new RecursiveTreeIterator(new RecursiveDirectoryIterator('.', RecursiveDirectoryIterator::SKIP_DOTS));
foreach ($it as $path) {
    echo $path."\n";
}
exit;

preg_match_all('/Version: (.*)/', file_get_contents('../style.css'), $output_array);
$version = $output_array[1][0];

$json = [];
foreach ($iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('./', RecursiveDirectoryIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST) as $item) {
    $subPath = $iterator->getSubPathName();
    if (!$item->isDir()) {
        $output = lookupSettings($subPath);
        //skip if $output starts with bin/
        if (strlen($subPath) > 4 && substr($subPath, 0, 4) == 'bin/') {
            continue;
        }

        if (is_array($output) && count($output)) {
            echo $subPath."\n";
            if (isset($output['defined']) && count($output['defined'])) {
                echo 'Define: '.count($output['defined'])."\n";
                foreach ($output['defined'] as $key => $value) {
                    echo $key."\tLijnnummer: ".$value['linenr']."\t Default: ".$value['default']."\t (Ex: ".$value['line'].") \n";
                }
            }

            //filters
            if (isset($output['filters']) && count($output['filters'])) {
                echo 'Filters: '.count($output['filters'])."\n";
                foreach ($output['filters'] as $key => $value) {
                    echo $key."\tLijnnummer: ".$value['linenr']."\t Variables/Defaults: ".$value['default']." \n";
                }
            }

            //actions
            if (isset($output['actions']) && count($output['actions'])) {
                echo 'actions: '.count($output['actions'])."\n";
                foreach ($output['actions'] as $key => $value) {
                    echo $key."\tLijnnummer: ".$value['linenr']."\t Variables/Defaults: ".$value['default']." \n";
                }
            }

            echo "\n\n\n";
            $json[$subPath] = $output;
        }
    }
}

file_put_contents('filters-hooks-'.$version.'-'.date('Y-m-d-Hi').'.json', json_encode($json, JSON_PRETTY_PRINT));

function lookupSettings($path)
{
    $result = [];

    $content = file_get_contents('../'.$path);
    //Find all lines containing the word 'add_filter'
    preg_match_all('/\bdefine\b\([\'"](\w*)["\'],(.*)\);/', $content, $output_array, PREG_OFFSET_CAPTURE);
    foreach ($output_array[0] as $key => $line) {
        $result['defined'][$output_array[1][$key][0]] = [
            'linenr'  => substr_count(substr($content, 0, $line[1]), "\n") + 1,
            'line'    => $line[0],
            'default' => $output_array[2][$key][0],
        ];
    }

    //Find all lines containing the word 'apply_filters'
    preg_match_all('/\bapply_filters\b\([\'"](\w*)["\'],(.*)\);/', $content, $output_array, PREG_OFFSET_CAPTURE);
    foreach ($output_array[0] as $key => $line) {
        $result['filters'][$output_array[1][$key][0]] = [
            'linenr'  => substr_count(substr($content, 0, $line[1]), "\n") + 1,
            'line'    => $line[0],
            'default' => $output_array[2][$key][0],
        ];
    }

    //Find all lines containing the word 'do_action'
    preg_match_all('/\bdo_action\b\([\'"](\w*)["\'],(.*)\);/', $content, $output_array, PREG_OFFSET_CAPTURE);
    foreach ($output_array[0] as $key => $line) {
        $result['actions'][$output_array[1][$key][0]] = [
            'linenr'  => substr_count(substr($content, 0, $line[1]), "\n") + 1,
            'line'    => $line[0],
            'default' => $output_array[2][$key][0],
        ];
    }

    return $result;
}

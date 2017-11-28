<?php

$cssFile = file_get_contents('file.css');
$cssFile = explode("\n", $cssFile);

if (!is_array($cssFile)) {
    echo 'No file found';
    exit;
}

$styles = [];

$selector = '';
$cssStyle = [];
foreach ($cssFile as $line) {
    if (isCssSelector($line)) {
        $selector .= $line;
    } elseif (hasEndSelectorOnly($line)) {
        //Add to $styles
        foreach ($cssStyle as $css) {
            if (!isset($styles[$css])) {
                $styles[$css] = [];
            }

            $styles[$css] = getSelectors($selector);
        }

        //clear data
        $cssStyle = [];
        $selector = '';
    } else {
        $line = trim($line);
        if (strlen($line) > 0) {
            $cssStyle[] = $line;
        }
    }
}

foreach ($styles as $css => $selector) {
    echo implode(', ', $selector)." {\n";
    echo '    '.$css."\n";
    echo "}\n\n";
}

function isCssSelector($line)
{
    $line = trim($line);
    if (strlen($line) > 0) {
        if (substr($line, 0, 1) == '.' || strpos($line, '{') !== false || strpos($line, '.') !== false) {
            return true;
        }
    }

    return false;
}

function hasEndSelectorOnly($line)
{
    $line = trim($line);
    if (strlen($line) > 0) {
        return $line == '}';
    }

    return false;
}

function hasEndSelectorWithNew($line)
{
    $line = trim($line);
    if (strlen($line) > 1 && strpos($line, '}') !== false && $line != '}') {
        return true;
    }

    return false;
}

function getSelectors($string)
{
    $string = str_replace('{', '', $string);
    $selectors = explode(',', $string);
    $result = [];
    foreach ($selectors as $selector) {
        if (strlen(trim($selector)) > 0) {
            $result[] = trim($selector);
        }
    }

    return $result;
}

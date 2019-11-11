<?php

/*
 * Cache the generated CSS styles in a css file.
 *
 */

function madeit_css_cache_filename()
{
    $colorString = madeit_get_theme_color('text_color_rgb', MADEIT_TEXT_COLOR).
        madeit_get_theme_color('background_color_rgb', MADEIT_BACKGROUND_COLOR).
        madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR).
        madeit_get_theme_color('secondary_color_rgb', MADEIT_SECONDARY_COLOR).
        madeit_get_theme_color('success_color_rgb', MADEIT_SUCCESS_COLOR).
        madeit_get_theme_color('info_color_rgb', MADEIT_INFO_COLOR).
        madeit_get_theme_color('warning_color_rgb', MADEIT_WARNING_COLOR).
        madeit_get_theme_color('danger_color_rgb', MADEIT_DANGER_COLOR);

    return md5($colorString).'css';
}

function madeit_css_cachePath()
{
    $filePath = rtrim(WP_CONTENT_DIR, '/').'/'.madeit_css_cache_filename();

    return $filePath;
}

function madeit_css_cacheUrl()
{
    $path = rtrim(WP_CONTENT_URL, '/').'/'.madeit_css_cache_filename();

    return $path;
}

function madeit_css_cacheExists()
{
    return file_exists(madeit_css_cachePath());
}

function madeit_css_isCacheUpToDate()
{
    if (!madeit_css_cacheExists()) {
        return false;
    }
    require_once __DIR__.'/color-patterns.php';
    $css = madeit_custom_colors_css();

    $currentCss = file_get_contents(madeit_css_cachePath());

    return md5($css) == md5($currentCss);
}

function madeit_css_generateCache()
{
    require_once __DIR__.'/color-patterns.php';
    $css = madeit_custom_colors_css();

    file_put_contents(madeit_css_cachePath(), $css);
}

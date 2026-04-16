<?php

if (!defined('ABSPATH')) {
    exit;
}

// --- Local font uploads (stored in active theme, typically the child theme) + theme.json integration ---
//
// This file lives in the parent theme so any child theme automatically gets:
// - a REST endpoint to upload fonts into `get_stylesheet_directory()/assets/fonts`
// - automatic inclusion of local fonts into the generated theme.json fontFamilies presets
//
// If a legacy child theme already defines these helpers, we avoid redeclaring them.

if (!function_exists('thema1_fonts_dir')) {
    function thema1_fonts_dir(): array
    {
        $basePath = trailingslashit(get_stylesheet_directory()).'assets/fonts';
        $baseUrl = trailingslashit(get_stylesheet_directory_uri()).'assets/fonts';

        return [
            'path' => $basePath,
            'url'  => $baseUrl,
            'rel'  => 'assets/fonts',
        ];
    }
}

if (!function_exists('thema1_infer_font_variant_from_filename')) {
    function thema1_infer_font_variant_from_filename(string $filename): array
    {
        $base = preg_replace('/\.[^\.]+$/', '', $filename);
        $lower = strtolower((string) $base);

        $fontStyle = 'normal';
        if (strpos($lower, 'italic') !== false) {
            $fontStyle = 'italic';
        } elseif (strpos($lower, 'oblique') !== false) {
            $fontStyle = 'oblique';
        }

        $fontWeight = '400';
        if (preg_match('/(^|[^0-9])([1-9]00)([^0-9]|$)/', $lower, $m) && !empty($m[2])) {
            $fontWeight = $m[2];
        } else {
            $weightMap = [
                '/(thin|hairline)/'                                     => '100',
                '/(extra\s*light|ultra\s*light|extralight|ultralight)/' => '200',
                '/(light)/'                                             => '300',
                '/(regular|normal|book|roman)/'                         => '400',
                '/(medium)/'                                            => '500',
                '/(semi\s*bold|demi\s*bold|semibold|demibold)/'         => '600',
                '/(bold)/'                                              => '700',
                '/(extra\s*bold|ultra\s*bold|extrabold|ultrabold)/'     => '800',
                '/(black|heavy)/'                                       => '900',
            ];
            foreach ($weightMap as $re => $value) {
                if (preg_match($re, $lower)) {
                    $fontWeight = $value;
                    break;
                }
            }
        }

        // Family name guess: take first chunk before '-' or '_' (common font naming), otherwise use full base.
        $normalized = preg_replace('/_+/', '-', (string) $base);
        $chunks = array_values(array_filter(explode('-', (string) $normalized), static fn ($v) => $v !== ''));
        $familyChunk = $chunks[0] ?? $base;
        $familyName = trim(
            preg_replace(
                '/\s+/',
                ' ',
                preg_replace('/([a-z])([A-Z])/', '$1 $2', str_replace(['_', '-'], ' ', (string) $familyChunk))
            )
        );

        return [
            'familyName'  => $familyName,
            'fontWeight'  => $fontWeight,
            'fontStyle'   => $fontStyle,
        ];
    }
}

if (!function_exists('thema1_collect_local_font_families_for_theme_json')) {
    function thema1_collect_local_font_families_for_theme_json(): array
    {
        $dir = thema1_fonts_dir();
        $path = (string) ($dir['path'] ?? '');
        if ($path === '' || !is_dir($path)) {
            return [];
        }

        $files = glob(trailingslashit($path).'*.{otf,ttf,woff,woff2}', GLOB_BRACE);
        if (!$files) {
            return [];
        }

        $families = [];

        foreach ($files as $filePath) {
            $basename = basename((string) $filePath);
            $inferred = thema1_infer_font_variant_from_filename($basename);
            $familyName = trim((string) ($inferred['familyName'] ?? ''));
            if ($familyName === '') {
                continue;
            }

            $familySlug = sanitize_title($familyName);
            $cssFamilyName = preg_match('/\s/', $familyName) ? '"'.str_replace('"', '\\"', $familyName).'"' : $familyName;
            $fontFamilyStack = $cssFamilyName.', system-ui, sans-serif';

            if (!isset($families[$familySlug])) {
                $families[$familySlug] = [
                    'name'       => $familyName,
                    'slug'       => $familySlug,
                    'fontFamily' => $fontFamilyStack,
                    'fontFace'   => [],
                ];
            }

            $families[$familySlug]['fontFace'][] = [
                'fontFamily' => $familyName,
                'fontStyle'  => (string) ($inferred['fontStyle'] ?? 'normal'),
                'fontWeight' => (string) ($inferred['fontWeight'] ?? '400'),
                'src'        => [
                    'file:./'.trailingslashit((string) ($dir['rel'] ?? 'assets/fonts')).$basename,
                ],
            ];
        }

        // De-dupe faces per family (weight+style+src).
        foreach ($families as $slug => $family) {
            $seen = [];
            $uniqueFaces = [];
            foreach (($family['fontFace'] ?? []) as $face) {
                $key = ($face['fontStyle'] ?? '').'|'.($face['fontWeight'] ?? '').'|'.implode(',', (array) ($face['src'] ?? []));
                if (isset($seen[$key])) {
                    continue;
                }
                $seen[$key] = true;
                $uniqueFaces[] = $face;
            }
            $families[$slug]['fontFace'] = $uniqueFaces;
        }

        return array_values($families);
    }
}

if (!function_exists('thema1_add_local_fonts_to_theme_json')) {
    function thema1_add_local_fonts_to_theme_json($json)
    {
        // Append locally uploaded fonts from the active theme folder (assets/fonts).
        if (!is_array($json)) {
            $json = [];
        }
        if (!isset($json['settings'])) {
            $json['settings'] = [];
        }
        if (!isset($json['settings']['typography'])) {
            $json['settings']['typography'] = [];
        }
        if (!isset($json['settings']['typography']['fontFamilies']) || !is_array($json['settings']['typography']['fontFamilies'])) {
            $json['settings']['typography']['fontFamilies'] = [];
        }

        $existingSlugs = [];
        foreach ($json['settings']['typography']['fontFamilies'] as $ff) {
            if (is_array($ff) && !empty($ff['slug'])) {
                $existingSlugs[(string) $ff['slug']] = true;
            }
        }

        $localFamilies = thema1_collect_local_font_families_for_theme_json();
        foreach ($localFamilies as $family) {
            if (!is_array($family) || empty($family['slug'])) {
                continue;
            }
            $slug = (string) $family['slug'];
            if (isset($existingSlugs[$slug])) {
                continue;
            }
            $json['settings']['typography']['fontFamilies'][] = $family;
            $existingSlugs[$slug] = true;
        }

        return $json;
    }

    add_filter('madeit_theme_json', 'thema1_add_local_fonts_to_theme_json');
}

if (!function_exists('thema1_register_fonts_upload_route')) {
    function thema1_register_fonts_upload_route(): void
    {
        // Avoid double-registration when legacy child themes still register the same route.
        if (function_exists('rest_get_server')) {
            $routes = rest_get_server()->get_routes();
            if (isset($routes['/thema-1/v1/fonts/upload'])) {
                return;
            }
        }

        register_rest_route('thema-1/v1', '/fonts/upload', [
            'methods'             => 'POST',
            'permission_callback' => static function () {
                return current_user_can('edit_theme_options');
            },
            'callback'            => static function (WP_REST_Request $request) {
                $files = $request->get_file_params();
                if (empty($files['file']) || !is_array($files['file'])) {
                    return new WP_Error('thema1_missing_file', __('Geen fontbestand ontvangen.', 'madeit'), ['status' => 400]);
                }

                $file = $files['file'];
                if (!empty($file['error'])) {
                    return new WP_Error('thema1_upload_error', __('Upload fout.', 'madeit'), ['status' => 400, 'error' => $file['error']]);
                }

                $originalName = (string) ($file['name'] ?? '');
                $sanitizedName = sanitize_file_name($originalName);
                $ext = strtolower(pathinfo($sanitizedName, PATHINFO_EXTENSION));
                $allowed = ['otf', 'ttf', 'woff', 'woff2'];
                if (!in_array($ext, $allowed, true)) {
                    return new WP_Error('thema1_invalid_ext', __('Ongeldig bestandstype. Gebruik otf, ttf, woff of woff2.', 'madeit'), ['status' => 415]);
                }

                $dir = thema1_fonts_dir();
                $destDir = (string) ($dir['path'] ?? '');
                if ($destDir === '') {
                    return new WP_Error('thema1_invalid_dir', __('Kon de fonts-map niet bepalen.', 'madeit'), ['status' => 500]);
                }

                if (!wp_mkdir_p($destDir)) {
                    return new WP_Error('thema1_mkdir_failed', __('Kon de fonts-map niet aanmaken in het actieve theme.', 'madeit'), ['status' => 500]);
                }
                if (!is_writable($destDir)) {
                    return new WP_Error('thema1_not_writable', __('De fonts-map in het actieve theme is niet schrijfbaar.', 'madeit'), ['status' => 500]);
                }

                $uniqueName = wp_unique_filename($destDir, $sanitizedName ?: ('font.'.$ext));
                $destPath = trailingslashit($destDir).$uniqueName;

                $moved = @move_uploaded_file((string) ($file['tmp_name'] ?? ''), $destPath);
                if (!$moved) {
                    // Fallback in case tmp file isn't recognized as upload.
                    $moved = @copy((string) ($file['tmp_name'] ?? ''), $destPath);
                }
                if (!$moved) {
                    return new WP_Error('thema1_move_failed', __('Kon het fontbestand niet opslaan.', 'madeit'), ['status' => 500]);
                }

                // Regenerate theme.json so the dropdown can pick it up after refresh.
                if (function_exists('madeit_generate_json_file')) {
                    madeit_generate_json_file();
                }

                return rest_ensure_response([
                    'stored'   => 'active-theme',
                    'file'     => $uniqueName,
                    'relative' => trailingslashit((string) ($dir['rel'] ?? 'assets/fonts')).$uniqueName,
                    'url'      => trailingslashit((string) ($dir['url'] ?? '')).$uniqueName,
                ]);
            },
        ]);
    }

    add_action('rest_api_init', 'thema1_register_fonts_upload_route');
}

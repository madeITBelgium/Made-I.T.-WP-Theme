<?php

/*
 * https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/
 *
 */

function madeit_generate_json_file()
{
    $json = [
        'version' => 1,
        'settings' => [
            'color' => [
                'pallette' => get_theme_support('editor-color-palette'),
                "duotone" => madeit_generate_duotone_colors(),
                "gradients" => madeit_generate_gradients_colors(),
            ],
            "typography" => [
                "fontFamilies" => [
                    apply_filters('madeit_theme_font_family', [
                        "fontFamily" => "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell, \"Helvetica Neue\",sans-serif",
                        "slug" => "system-font",
                        "name" => "System Font"
                    ]),
                ],
                "fontSizes" => [
                    [
                        "slug" => "normal",
                        "size" => apply_filters('madeit_fontsize_normal', "1rem"),
                        "name" => "Normaal"
                    ],
                    [
                        "slug" => "h6",
                        "size" => apply_filters('madeit_fontsize_h6', "1rem"),
                        "name" => "h6"
                    ],
                    [
                        "slug" => "h5",
                        "size" => apply_filters('madeit_fontsize_h5', "1.25rem"),
                        "name" => "h5"
                    ],
                    [
                        "slug" => "h4",
                        "size" => apply_filters('madeit_fontsize_h4', "1.5rem"),
                        "name" => "h4"
                    ],
                    [
                        "slug" => "h3",
                        "size" => apply_filters('madeit_fontsize_h3', "1.75rem"),
                        "name" => "h3"
                    ],
                    [
                        "slug" => "h2",
                        "size" => apply_filters('madeit_fontsize_h2', "2rem"),
                        "name" => "h2"
                    ],
                    [
                        "slug" => "h1",
                        "size" => apply_filters('madeit_fontsize_h1', "2.5rem"),
                        "name" => "h1"
                    ]
                ]
            ],
            'custom' => [
                'line-height' => [
                    'body' => apply_filters('madeit_lineheight_body', 1.5),
                    'heading' => apply_filters('madeit_lineheight_heading', 1.2),
                ]
            ]
        ],
        "styles" => [],
        "customTemplates" => [],
        "templateParts" => []
    ];
    
    $json = apply_filters('madeit_theme_json', $json);
    
    $filePath = madeit_theme_json_file();
    $json = json_encode($json, JSON_PRETTY_PRINT);
    $update = !file_exists($filePath) || md5($json) !== md5(file_get_contents($filePath));
    
    if($update) {
        file_put_contents($filePath, $json);
    }
}
add_action('init', 'madeit_generate_json_file');

function madeit_theme_json_file() {
    return get_stylesheet_directory() . '/theme.json';
}

function madeit_generate_duotone_colors()
{
    $colors = [
        'color' => madeit_get_theme_color('text_color_rgb', MADEIT_TEXT_COLOR),
        'background' => madeit_get_theme_color('background_color_rgb', MADEIT_BACKGROUND_COLOR),
        'primary' => madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR),
        'secondary' => madeit_get_theme_color('secondary_color_rgb', MADEIT_SECONDARY_COLOR),
        'success' => madeit_get_theme_color('success_color_rgb', MADEIT_SUCCESS_COLOR),
        'info' => madeit_get_theme_color('info_color_rgb', MADEIT_INFO_COLOR),
        'warning' => madeit_get_theme_color('warning_color_rgb', MADEIT_WARNING_COLOR),
        'danger' => madeit_get_theme_color('danger_color_rgb', MADEIT_DANGER_COLOR),
    ];
    
    $combinations = apply_filters('madeit_duotone_combinations', [
        ['color', 'background'],
        ['background', 'primary'],
        ['primary', 'secondary'],
        ['primary', 'success'],
        ['primary', 'info'],
        ['primary', 'warning'],
        ['primary', 'danger'],
    ]);
    
    $result = [];
    foreach($combinations as $combination) {
        $result[] = [
            "colors" => [ $colors[$combination[0]], $colors[$combination[1]] ],
            "slug" => $combination[0] . "-and-" . $combination[1],
            "name" => ucfirst($combination[0]) . " and " . ucfirst($combination[1]),
        ];
    }
    
    return $result;
}


function madeit_generate_gradients_colors()
{
    $colors = [
        'color' => madeit_get_theme_color('text_color_rgb', MADEIT_TEXT_COLOR),
        'background' => madeit_get_theme_color('background_color_rgb', MADEIT_BACKGROUND_COLOR),
        'primary' => madeit_get_theme_color('primary_color_rgb', MADEIT_PRIMARY_COLOR),
        'secondary' => madeit_get_theme_color('secondary_color_rgb', MADEIT_SECONDARY_COLOR),
        'success' => madeit_get_theme_color('success_color_rgb', MADEIT_SUCCESS_COLOR),
        'info' => madeit_get_theme_color('info_color_rgb', MADEIT_INFO_COLOR),
        'warning' => madeit_get_theme_color('warning_color_rgb', MADEIT_WARNING_COLOR),
        'danger' => madeit_get_theme_color('danger_color_rgb', MADEIT_DANGER_COLOR),
    ];
    
    $combinations = apply_filters('madeit_gradients_combinations', [
        ['color', 'background'],
        ['background', 'primary'],
        ['primary', 'secondary'],
        ['primary', 'success'],
        ['primary', 'info'],
        ['primary', 'warning'],
        ['primary', 'danger'],
    ]);
    
    $result = [];
    foreach($combinations as $combination) {
        $result[] = [
            "gradient" => "linear-gradient(135deg," . $colors[$combination[0]] . " 0%," . $colors[$combination[1]] . " 100%)",
            "slug" => $combination[0] . "-and-" . $combination[1],
            "name" => ucfirst($combination[0]) . " and " . ucfirst($combination[1]),
        ];
    }
    
    return $result;
}

/*
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

    return md5($colorString).'.css';
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
*/
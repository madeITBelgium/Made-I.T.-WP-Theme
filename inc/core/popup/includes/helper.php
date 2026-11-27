<?php

if (!defined('ABSPATH')) {
    exit;
}

// Check of popup actief is
function mp_is_popup_active($popup_id)
{
    if (!get_field('popup_enabled', $popup_id)) {
        return false;
    }

    $now = current_time('timestamp');
    $start = get_field('popup_start', $popup_id);
    $end = get_field('popup_end', $popup_id);

    if ($start && strtotime($start) > $now) {
        return false;
    }
    if ($end && strtotime($end) < $now) {
        return false;
    }

    return true;
}

// Admin status label
function mp_get_popup_status($popup_id)
{
    $now = current_time('timestamp');
    $enabled = get_field('popup_enabled', $popup_id);
    $start = get_field('popup_start', $popup_id);
    $end = get_field('popup_end', $popup_id);
    $action = get_field('popup_action', $popup_id);

    if (!$enabled) {
        return ['status'=>'disabled', 'label'=>'<span style="color:#999">Uitgeschakeld</span>'];
    }
    if ($start && strtotime($start) > $now) {
        return ['status'=>'planned', 'label'=>'<span style="color:#0073aa">Gepland</span>'];
    }
    if ($end && strtotime($end) < $now) {
        return ['status'=>'expired', 'label'=>'<span style="color:#d63638">Verlopen</span>'];
    }

    if ($action === 'click') {
        return [
            'status' => 'click',
            'label'  => '<span style="color:#f0b429;font-weight:bold">Click trigger</span>',
        ];
    }

    return ['status'=>'online', 'label'=>'<span style="color:#46b450;font-weight:bold">Online</span>'];
}

// Admin active time
function mp_get_popup_active_time($popup_id)
{
    $now = current_time('timestamp');
    $start = get_field('popup_start', $popup_id);
    $end = get_field('popup_end', $popup_id);

    // Geen start en geen einde
    if (empty($start) && empty($end)) {
        return ['active' => true, 'label' => '<span>Altijd actief</span>'];
    }

    // Actief vanaf
    if (!empty($start) && strtotime($start) > $now) {
        $start_formatted = date_i18n(get_option('date_format').' '.get_option('time_format'), strtotime($start));

        return ['active' => false, 'label' => '<span>Actief vanaf '.$start_formatted.'</span>'];
    }

    // Verlopen
    if (!empty($end) && strtotime($end) < $now) {
        $end_formatted = date_i18n(get_option('date_format').' '.get_option('time_format'), strtotime($end));

        return ['active' => false, 'label' => '<span>Verloopt op '.$end_formatted.'</span>'];
    }

    // Actief nu
    $active_until = !empty($end) ? date_i18n(get_option('date_format').' '.get_option('time_format'), strtotime($end)) : 'onbepaald';

    return ['active' => true, 'label' => '<span>Actief tot '.$active_until.'</span>'];
}

// Keuzes voor de weergave-instellingen (gebruikt door de ACF-velden én als whitelist bij het renderen)
function mp_popup_display_choices()
{
    return [
        'style' => [
            'default'   => 'Standaard',
            'light'     => 'Licht',
            'dark'      => 'Donker',
            'christmas' => 'Kerst',
        ],
        'size' => [
            'small'  => 'Klein',
            'medium' => 'Middel (standaard)',
            'large'  => 'Groot',
            'xl'     => 'Extra groot',
        ],
        'position' => [
            'center'       => 'Midden',
            'top'          => 'Boven',
            'bottom'       => 'Onder',
            'top_left'     => 'Boven links',
            'top_right'    => 'Boven rechts',
            'bottom_left'  => 'Onder links',
            'bottom_right' => 'Onder rechts',
        ],
        'animation' => [
            'slide_down' => 'Naar beneden schuiven (standaard)',
            'slide_up'   => 'Naar boven schuiven',
            'fade'       => 'Vervagen',
            'zoom_in'    => 'Inzoomen',
            'none'       => 'Geen animatie',
        ],
    ];
}

// Weergave-instellingen van een popup (met veilige fallbacks; $overrides wordt gebruikt door de preview)
function mp_get_popup_display($popup_id, $overrides = [])
{
    $choices = mp_popup_display_choices();
    $defaults = [
        'style'     => 'default',
        'size'      => 'medium',
        'position'  => 'center',
        'animation' => 'slide_down',
    ];

    $display = [];
    foreach ($defaults as $key => $default) {
        $value = $overrides[$key] ?? get_field('popup_'.$key, $popup_id);
        $display[$key] = (is_string($value) && isset($choices[$key][$value])) ? $value : $default;
    }

    // Titel tonen: bestaande popups (nog niet opnieuw opgeslagen) tonen hun titel zoals voorheen.
    if (isset($overrides['show_title'])) {
        $display['show_title'] = $overrides['show_title'] === '1';
    } elseif (metadata_exists('post', $popup_id, 'popup_show_title')) {
        $display['show_title'] = (bool) get_field('popup_show_title', $popup_id);
    } else {
        $display['show_title'] = true;
    }

    return $display;
}

// Mag deze popup op deze pagina getoond worden? ("Alle pagina's" of een selectie)
function mp_popup_applies_to_page($popup_id, $page_id)
{
    if (get_field('popup_pages_mode', $popup_id) === 'all') {
        return true;
    }

    $pages = get_field('popup_pages', $popup_id);
    if (empty($pages)) {
        return false;
    }

    return in_array((int) $page_id, array_map('intval', (array) $pages), true);
}

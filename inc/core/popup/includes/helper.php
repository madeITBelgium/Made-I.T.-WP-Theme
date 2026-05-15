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

    if (!$enabled) {
        return ['status'=>'disabled', 'label'=>'<span style="color:#999">Uitgeschakeld</span>'];
    }
    if ($start && strtotime($start) > $now) {
        return ['status'=>'planned', 'label'=>'<span style="color:#0073aa">Gepland</span>'];
    }
    if ($end && strtotime($end) < $now) {
        return ['status'=>'expired', 'label'=>'<span style="color:#d63638">Verlopen</span>'];
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

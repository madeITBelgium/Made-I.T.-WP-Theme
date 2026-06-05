<?php


if (!defined('ABSPATH')) exit;

function madeit_popup_collect_and_decorate_button_block($block_content, $block)
{
    $attrs = $block['attrs'] ?? [];

    if (empty($attrs['hasPopup']) || empty($attrs['popupId'])) {
        return $block_content;
    }

    $popupId = (int) $attrs['popupId'];

    if ($popupId <= 0) {
        return $block_content;
    }

    // simpel injecteren zonder WP_HTML_Tag_Processor
    $block_content = str_replace(
        '<a',
        '<a data-madeit-popup-id="' . $popupId . '"',
        $block_content
    );

    return $block_content;
}
add_filter('render_block_core/button', 'madeit_popup_collect_and_decorate_button_block', 20, 2);


function mp_render_popups() {
    echo '<!-- mp_render_popups CALLED -->';
    if (is_admin()) return;

    $pageId = get_queried_object_id();

    $popups = get_posts([
        'post_type'      => 'popup',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
    ]);

    if (!$popups) return;

    // 🔥 FILTER HIER (voor loop)
    $popups = array_filter($popups, function ($popup) use ($pageId) {

        $action = get_field('popup_action', $popup->ID);

        // Click popups altijd tonen
        if ($action !== 'specific_pages') {
            return true;
        }

        $pages = get_field('popup_pages', $popup->ID);

        if (!$pages) return false;

        return in_array($pageId, (array) $pages);
    });

    foreach ($popups as $popup) {

        if (!function_exists('mp_is_popup_active') || !mp_is_popup_active($popup->ID)) {
            continue;
        }

        $style    = get_field('popup_style', $popup->ID) ?: 'default';
        $delay    = (int) get_field('popup_delay', $popup->ID);
        $sessions = get_field('popup_sessions', $popup->ID);
        $action   = get_field('popup_action', $popup->ID);
        ?>

        <div class="modal fade madeit-popup popup-<?= esc_attr($style); ?>" 
             id="popup-<?= $popup->ID; ?>"
             data-id="<?= $popup->ID; ?>"
             data-action="<?= esc_attr($action); ?>"
             data-delay="<?= esc_attr($delay); ?>"
             data-sessies="<?= esc_attr($sessions); ?>"
             >


            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title"><?= esc_html($popup->post_title); ?></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <?= apply_filters('the_content', $popup->post_content); ?>
                    </div>

                </div>
            </div>
        </div>

        <?php
    }
}
add_action('wp_footer', 'mp_render_popups');

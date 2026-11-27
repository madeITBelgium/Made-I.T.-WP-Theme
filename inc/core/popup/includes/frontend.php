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


function mp_render_popup($popup, $overrides = []) {
    $delay    = (int) get_field('popup_delay', $popup->ID);
    $sessions = get_field('popup_sessions', $popup->ID);
    $action   = get_field('popup_action', $popup->ID);
    $css      = $overrides['css'] ?? get_field('popup_custom_css', $popup->ID);
    $display  = mp_get_popup_display($popup->ID, $overrides);

    $size_classes = [
        'small'  => 'modal-sm',
        'medium' => '',
        'large'  => 'modal-lg',
        'xl'     => 'modal-xl',
    ];

    // Zonder animatie geen 'fade'-klasse (Bootstrap animeert dan ook de achtergrond niet)
    $modal_classes = ['modal', 'madeit-popup', 'popup-'.$display['style'], 'popup-anim-'.$display['animation']];
    if ($display['animation'] !== 'none') {
        $modal_classes[] = 'fade';
    }
    if (!$display['show_title']) {
        $modal_classes[] = 'popup-no-title';
    }

    $dialog_classes = array_filter([
        'modal-dialog',
        'modal-dialog-centered',
        $size_classes[$display['size']],
        'popup-pos-'.str_replace('_', '-', $display['position']),
    ]);
    ?>
    <div class="<?= esc_attr(implode(' ', $modal_classes)); ?>"
         id="popup-<?= (int) $popup->ID; ?>"
         data-id="<?= (int) $popup->ID; ?>"
         data-action="<?= esc_attr($action); ?>"
         data-delay="<?= esc_attr($delay); ?>"
         data-sessies="<?= esc_attr($sessions); ?>"
         <?php if (!$display['show_title']) : ?>aria-label="<?= esc_attr($popup->post_title); ?>"<?php endif; ?>>
        <div class="<?= esc_attr(implode(' ', $dialog_classes)); ?>">
            <div class="modal-content">
                <?php if ($display['show_title']) : ?>
                    <div class="modal-header">
                        <h5 class="modal-title"><?= esc_html($popup->post_title); ?></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="<?= esc_attr__('Sluiten', 'madeit'); ?>"></button>
                    </div>
                <?php else : ?>
                    <button type="button" class="btn-close popup-close-floating" data-bs-dismiss="modal" aria-label="<?= esc_attr__('Sluiten', 'madeit'); ?>"></button>
                <?php endif; ?>
                <div class="modal-body">
                    <?= apply_filters('the_content', $popup->post_content); ?>
                </div>
            </div>
        </div>
    </div>
    <?php
    if (is_string($css) && trim($css) !== '') {
        echo '<style id="popup-custom-css-'.(int) $popup->ID.'">'.wp_strip_all_tags($css).'</style>';
    }
}

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

        return mp_popup_applies_to_page($popup->ID, $pageId);
    });

    foreach ($popups as $popup) {

        if (!function_exists('mp_is_popup_active') || !mp_is_popup_active($popup->ID)) {
            continue;
        }

        mp_render_popup($popup);
    }
}
add_action('wp_footer', 'mp_render_popups');

<?php


if (!defined('ABSPATH')) exit;

function mp_render_popups() {
    echo '<!-- mp_render_popups CALLED -->';
    if (is_admin()) return;

    $template_file = get_post_meta($template_id, 'template_file', true);

    if (file_exists($template_file)) {
        include $template_file;
    }


    $pageId = get_queried_object_id();

    $popups = get_posts([
        'post_type'      => 'popup',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        // 'meta_query'     => [
        //     [
        //         'key'     => 'popup_pages',
        //         'value'   => '"' . $pageId . '"',
        //         'compare' => 'LIKE',
        //     ]
        // ]
    ]);

    if (!$popups) return;

    foreach ($popups as $popup) {

        if (!function_exists('mp_is_popup_active') || !mp_is_popup_active($popup->ID)) {
            continue;
        }

        $style    = get_field('popup_style', $popup->ID) ?: 'default';
        $delay    = (int) (get_field('popup_delay', $popup->ID) ?: 0);
        $sessions = get_field('popup_sessions', $popup->ID) ?: 'once_per_visit';
        ?>

        <div class="modal fade m-popup m-popup--<?= esc_attr($style); ?>"
             id="m-popup-<?= $popup->ID; ?>"
             tabindex="-1"
             data-delay="<?= esc_attr($delay); ?>"
             data-sessions="<?= esc_attr($sessions); ?>"
             aria-hidden="true">

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

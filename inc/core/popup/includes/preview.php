<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('acf/render_field/key=field_popup_preview', 'mp_popup_preview_field');

function mp_popup_preview_field($field)
{
    $post = get_post(acf_get_form_data('post_id'));
    if (!$post || $post->post_type !== 'popup' || !current_user_can('edit_post', $post->ID)) {
        echo '<p role="alert">'.esc_html__('Het popupvoorbeeld is niet beschikbaar. Herlaad de editor en probeer opnieuw.', 'madeit').'</p>';
        return;
    }

    ?>
    <div id="mp-popup-preview-panel"
         data-url="<?= esc_url(add_query_arg('mp_popup_preview', '1', home_url('/'))); ?>"
         data-post-id="<?= (int) $post->ID; ?>"
         data-nonce="<?= esc_attr(wp_create_nonce('mp_popup_preview_'.$post->ID)); ?>">
        <p><?= esc_html__('Bekijk je huidige titel, inhoud en eigen CSS zonder op te slaan of te activeren. Planning, triggers en bezoeklimieten worden in dit voorbeeld genegeerd.', 'madeit'); ?></p>
        <p>
            <button type="button" class="button" data-preview-refresh><?= esc_html__('Voorbeeld laden / vernieuwen', 'madeit'); ?></button>
            <label>
                <?= esc_html__('Scherm', 'madeit'); ?>
                <select data-preview-size>
                    <option value="desktop"><?= esc_html__('Desktop', 'madeit'); ?></option>
                    <option value="mobile"><?= esc_html__('Mobiel (375 px)', 'madeit'); ?></option>
                </select>
            </label>
            <label><input type="checkbox" data-preview-live checked> <?= esc_html__('Live bijwerken', 'madeit'); ?></label>
        </p>
        <p data-preview-status role="status" aria-live="polite"></p>
        <div class="mp-popup-preview-stage">
            <iframe title="<?= esc_attr__('Live voorbeeld van de popup', 'madeit'); ?>"
                    sandbox="allow-scripts allow-same-origin" referrerpolicy="same-origin" hidden></iframe>
        </div>
    </div>
    <?php
}

add_action('admin_enqueue_scripts', function () {
    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'popup' || $screen->base !== 'post') {
        return;
    }

    $path = '/inc/core/popup/assets/';
    wp_enqueue_style('mp-popup-preview', MPOPUP_URL.$path.'css/preview.css', [], filemtime(MPOPUP_PATH.$path.'css/preview.css'));
    wp_enqueue_script('mp-popup-preview', MPOPUP_URL.$path.'js/preview.js', ['wp-data', 'wp-i18n'], filemtime(MPOPUP_PATH.$path.'js/preview.js'), true);
});

add_action('template_redirect', 'mp_popup_preview_response', 0);

function mp_popup_preview_response()
{
    if (!isset($_GET['mp_popup_preview'])) {
        return;
    }

    nocache_headers();
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        wp_send_json_error(['message' => __('Dit voorbeeld vereist een POST-verzoek.', 'madeit')], 405);
    }

    foreach (['post_id', 'nonce', 'title', 'content', 'css'] as $key) {
        if (!isset($_POST[$key]) || !is_string($_POST[$key])) {
            wp_send_json_error(['message' => __('Ongeldige gegevens voor het popupvoorbeeld.', 'madeit')], 400);
        }
    }

    $post_id = absint($_POST['post_id']);
    if (!current_user_can('edit_post', $post_id) || !wp_verify_nonce(wp_unslash($_POST['nonce']), 'mp_popup_preview_'.$post_id)) {
        wp_send_json_error(['message' => __('Je hebt geen toegang tot dit voorbeeld. Herlaad de editor en probeer opnieuw.', 'madeit')], 403);
    }

    $popup = get_post($post_id);
    if (!$popup || $popup->post_type !== 'popup') {
        wp_send_json_error(['message' => __('Popup niet gevonden.', 'madeit')], 404);
    }

    // Render only an in-memory copy; previewing must never publish or save edits.
    $popup = clone $popup;
    $popup->post_title = sanitize_text_field(wp_unslash($_POST['title']));
    $popup->post_content = wp_unslash($_POST['content']);
    if (!current_user_can('unfiltered_html')) {
        $popup->post_content = wp_kses_post($popup->post_content);
    }
    $GLOBALS['post'] = $popup;
    setup_postdata($popup);

    ob_start();
    mp_render_popup($popup, ['css' => wp_unslash($_POST['css'])]);
    $markup = ob_get_clean();

    remove_action('wp_footer', 'mp_render_popups');
    add_action('wp_enqueue_scripts', function () {
        // Preview opening must not run the visitor/session tracking scripts.
        wp_dequeue_script('popup');
        wp_dequeue_script('popup-js');
        wp_dequeue_script('madeit-popup-frontend');
    }, PHP_INT_MAX);
    add_filter('show_admin_bar', '__return_false');

    ob_start();
    ?>
    <!doctype html>
    <html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?= esc_attr(get_bloginfo('charset')); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base href="<?= esc_url(home_url('/')); ?>">
        <?php wp_head(); ?>
    </head>
    <body <?php body_class('mp-popup-preview'); ?>>
        <?= $markup; ?>
        <?php wp_footer(); ?>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                var modal = document.getElementById(<?= wp_json_encode('popup-'.$post_id); ?>);
                if (window.bootstrap && window.bootstrap.Modal) {
                    new window.bootstrap.Modal(modal).show();
                } else if (window.jQuery && window.jQuery.fn.modal) {
                    window.jQuery(modal).modal('show');
                } else {
                    document.body.innerHTML = '';
                    var error = document.createElement('p');
                    error.textContent = <?= wp_json_encode(__('Voorbeeld niet beschikbaar: Bootstrap is niet geladen.', 'madeit')); ?>;
                    document.body.appendChild(error);
                }
                document.addEventListener('click', function (event) {
                    if (event.target.closest('a')) {
                        event.preventDefault();
                    }
                });
                document.addEventListener('submit', function (event) {
                    event.preventDefault();
                });
            });
        </script>
    </body>
    </html>
    <?php
    $html = ob_get_clean();
    wp_send_json_success(['html' => $html]);
}

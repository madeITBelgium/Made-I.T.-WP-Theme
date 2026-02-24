<?php

function madeit_is_welcome_notice_dismissed(): bool {
    $user_id = get_current_user_id();
    if (!$user_id) {
        return false;
    }

    return (bool) get_user_meta($user_id, 'madeit_welcome_notice_dismissed', true);
}

function madeit_dismiss_welcome_notice(): void {
    check_ajax_referer('madeit-dismiss-welcome-notice', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error(['message' => 'Unauthorized'], 403);
    }

    $user_id = get_current_user_id();
    if (!$user_id) {
        wp_send_json_error(['message' => 'No user'], 400);
    }

    update_user_meta($user_id, 'madeit_welcome_notice_dismissed', 1);
    wp_send_json_success();
}
add_action('wp_ajax_madeit_dismiss_welcome_notice', 'madeit_dismiss_welcome_notice');

// Full wide custom notice on the dashboard
function add_custom_welcome_widgets() {
    if (madeit_is_welcome_notice_dismissed()) {
        return;
    }

    $nonce = wp_create_nonce('madeit-dismiss-welcome-notice');
    $ajax_url = admin_url('admin-ajax.php');

    ?>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const postbox = document.querySelector('#dashboard-widgets .postbox-container');
            if (postbox) {
                const notice = document.createElement('section');
                notice.className = 'home-section madeit-welcome-notice notice is-dismissible';
                notice.innerHTML = `
                    <button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>
                    <div class="section-container" style="text-align:center;">
                        <h1>✨ Het Made I.T. thema kreeg een update! ✨</h1>
                        <p>
                            Het Made I.T. thema is bijgewerkt naar <b>versie 3.0.0!</b> We hebben hard gewerkt om nieuwe functies toe te voegen en verbeteringen aan te brengen om jouw ervaring te verbeteren.
                            <br>
                            In deze update hebben we onder andere een nieuwe blokcategorie "Made I.T." toegevoegd in de Gutenberg editor, waardoor het gemakkelijker is om onze aangepaste blokken te vinden en te gebruiken. We hebben ook de gebruikersinterface verbeterd en verschillende bugs opgelost om een soepelere ervaring te bieden.
                        </p>
                    </div>
                `;
                postbox.parentNode.insertBefore(notice, postbox);

                const dismissButton = notice.querySelector('.notice-dismiss');
                if (dismissButton) {
                    dismissButton.addEventListener('click', function() {
                        notice.style.display = 'none';

                        const data = new FormData();
                        data.append('action', 'madeit_dismiss_welcome_notice');
                        data.append('nonce', '<?php echo esc_js($nonce); ?>');

                        fetch('<?php echo esc_url_raw($ajax_url); ?>', {
                            method: 'POST',
                            credentials: 'same-origin',
                            body: data,
                        }).catch(() => {
                            // Intentionally swallow errors; UI is already dismissed.
                        });
                    });
                }
            }
        });
    </script>
    <?php
}
add_action('admin_notices', 'add_custom_welcome_widgets');


// custom widget with updates.
function madeit_dashboard_widgets() {
    wp_add_dashboard_widget(
        'madeit_updates_widget', // Widget slug.
        'Made I.T. Updates', // Title.
        'madeit_updates_widget_content' // Display function.
    );
}
function madeit_get_changelog_updates() {
    $updates = [];
    $versions = madeit_get_all_changelogs();
    $blocks = madeit_get_all_blocks();

        foreach ($blocks as $block => $block_data) {
            if (empty($block_data['madeit']['changelog'] ?? [])) {
                continue;
            }
            ?>
            <li>
                <strong><?php echo esc_html($block_data['title']); ?></strong>
                <ul>
                    <?php 
                    $changelog = $block_data['madeit']['changelog'] ?? [];
                    if (!empty($changelog)) {
                        $latest_version = array_key_first($changelog);
                        $latest_items = $changelog[$latest_version];
                    ?>
                        <li style="margin-bottom: 10px"><strong>v<?php echo esc_html($latest_version); ?>:</strong>
                            <ul>
                                <?php foreach ($latest_items as $item): ?>
                                    <li><?php echo esc_html($item); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        </li>
                    <?php } ?>
                </ul>
            </li>
            <?php
        }
}
function madeit_updates_widget_content() {
    ?>
    <h2>Nieuwe functies en verbeteringen</h2>
    <!-- dynamic implementation of the updates -->
    <ul>
        <?php
        $updates = madeit_get_changelog_updates();
        foreach ($updates as $update) {
            echo '<li><strong>' . esc_html($update['version']) . ':</strong> ' . esc_html($update['description']) . '</li>';
        }
        ?>
    </ul>



    <?php
}
add_action('wp_dashboard_setup', 'madeit_dashboard_widgets');


// add a close button to the notice
function add_close_button_to_notices() {
    ?>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const notices = document.querySelectorAll('.notice');
            notices.forEach(function(notice) {
                if (notice.classList.contains('madeit-welcome-notice')) {
                    return;
                }

                const closeButton = document.createElement('button');
                closeButton.className = 'notice-dismiss';
                closeButton.type = 'button';
                closeButton.addEventListener('click', function() {
                    notice.style.display = 'none';
                });
                notice.appendChild(closeButton);
            });
        });
    </script>
    <style>
        .madeit-welcome-notice {
            background-image: url('<?php echo get_parent_theme_file_uri('gutenberg/admin/assets/welcome-notice-bg.svg'); ?>');
            background-size: cover;
            background-position: center;
            min-height: 300px;
            position: relative;
            margin: 10px 0 30px 0;
        }
        .madeit-welcome-notice .section-container {
            align-content: center;
            min-height: 300px;
            max-width: 50%;
            margin: auto;
        }
        .madeit-welcome-notice .section-container h1 {
            font-size: 40px;
            margin-bottom: 20px;
        }
        .madeit-welcome-notice .section-container p {
            font-size: 15px;
            line-height: 1.5;
        }

    </style>
    <?php
}
add_action('admin_footer', 'add_close_button_to_notices');
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
    $blocks = madeit_get_all_blocks();

    if (!is_array($blocks)) {
        return $updates;
    }

    foreach ($blocks as $block_data) {
        $changelog = $block_data['madeit']['changelog'] ?? [];
        if (!is_array($changelog) || empty($changelog)) {
            continue;
        }

        $latest_version = array_key_first($changelog);
        $latest_items = $changelog[$latest_version] ?? [];

        if (!is_array($latest_items)) {
            $latest_items = [];
        }

        $updates[] = [
            'title' => (string) ($block_data['title'] ?? ''),
            'version' => (string) $latest_version,
            'items' => $latest_items,
            'description' => isset($latest_items[0]) ? (string) $latest_items[0] : '',
        ];
    }

    return $updates;
}
function madeit_updates_widget_content() {
    $updates = madeit_get_changelog_updates();

    ?>
    <div class="madeit-updates-widget">

        <?php if (empty($updates)) : ?>

            <p>Geen recente updates gevonden.</p>

        <?php else : ?>

            <div class="madeit-updates-accordion">

                <?php foreach ($updates as $index => $update) : ?>

                    <details class="madeit-update-group" <?php echo $index === 0 ? 'open' : ''; ?>>

                        <summary class="madeit-update-summary">

                            <div class="madeit-update-summary-left">
                                <span class="madeit-update-block">
                                    <?php echo esc_html($update['title']); ?>
                                </span>
                            </div>

                            <span class="madeit-update-version">
                                v<?php echo esc_html($update['version']); ?>
                            </span>

                        </summary>

                        <div class="madeit-update-content">

                            <?php if (!empty($update['items'])) : ?>

                                <ul class="madeit-update-list">

                                    <?php foreach ($update['items'] as $item) : ?>

                                        <li class="madeit-update-list-item">

                                            <?php
                                            // Structured item
                                            if (is_array($item)) {

                                                $type  = $item['type'] ?? 'info';
                                                $label = $item['label'] ?? ucfirst($type);
                                                $text  = $item['text'] ?? '';

                                                ?>

                                                <span class="madeit-update-badge madeit-update-<?php echo esc_attr($type); ?>">
                                                    <?php echo esc_html($label); ?>
                                                </span>

                                                <span class="madeit-update-text">
                                                    <?php echo esc_html($text); ?>
                                                </span>

                                                <?php

                                            } else {

                                                // Old string format
                                                echo wp_kses($item, [
                                                    'b' => [],
                                                    'strong' => [],
                                                    'em' => [],
                                                    'br' => [],
                                                ]);
                                            }
                                            ?>

                                        </li>

                                    <?php endforeach; ?>

                                </ul>

                            <?php endif; ?>

                        </div>

                    </details>

                <?php endforeach; ?>

            </div>

        <?php endif; ?>

    </div>

    <style>
        
        .madeit-updates-widget {
            padding: 4px;
        }

        .madeit-updates-title {
            margin-bottom: 16px;
        }

        .madeit-updates-accordion {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .madeit-update-group {
            border: 1px solid #dcdcde;
            border-radius: 10px;
            background: #fff;
            overflow: hidden;
        }

        .madeit-update-summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            cursor: pointer;
            list-style: none;
            user-select: none;
        }

        .madeit-update-summary::-webkit-details-marker {
            display: none;
        }

        .madeit-update-summary:hover {
            background: #f6f7f7;
        }

        .madeit-update-block {
            font-weight: 600;
            font-size: 14px;
        }

        .madeit-update-version {
            background: #2271b1;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 999px;
        }

        .madeit-update-content {
            padding: 16px 16px;
        }

        .madeit-update-list {
            margin: 0;
        }

        .madeit-update-list-item {
            margin-bottom: 10px;
            line-height: 1.5;
        }

        .madeit-update-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 999px;
            margin-right: 8px;
            text-transform: uppercase;
        }

        .madeit-update-fix {
            background: #ffeaea;
            color: #c0392b;
        }

        .madeit-update-feature {
            background: #eafaf1;
            color: #1e8449;
        }

        .madeit-update-improvement {
            background: #ebf5ff;
            color: #21618c;
        }

        .madeit-update-info {
            background: #f1f1f1;
            color: #555;
        }
        </style>
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
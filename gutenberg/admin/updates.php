<?php
function madeit_blocks_updates_page() {

    $get_latest_version = function (array $block_data): string {
        $changelog = $block_data['madeit']['changelog'] ?? [];
        if (is_array($changelog) && !empty($changelog)) {
            $keys = array_keys($changelog);
            usort($keys, 'version_compare');
            $latest = end($keys);
            if (is_string($latest) && $latest !== '') {
                return $latest;
            }
        }

        $v = $block_data['version'] ?? '';
        return is_string($v) ? $v : '';
    };

    $get_last_updated = function (string $slug, array $block_data): string {
        $block_json = null;
        if (isset($block_data['block_json']) && is_string($block_data['block_json']) && $block_data['block_json'] !== '') {
            $block_json = $block_data['block_json'];
        }

        if (!is_string($block_json) || $block_json === '' || !is_readable($block_json)) {
            // Backwards compat / safety net for older block data.
            $base_dir = function_exists('get_theme_file_path')
                ? get_theme_file_path('gutenberg/blocks/' . $slug)
                : (get_stylesheet_directory() . '/gutenberg/blocks/' . $slug);

            $candidates = [
                $base_dir . '/block.json',
                $base_dir . '/src/block.json',
                $base_dir . '/build/block.json',
            ];

            foreach ($candidates as $candidate) {
                if (is_string($candidate) && $candidate !== '' && is_readable($candidate)) {
                    $block_json = $candidate;
                    break;
                }
            }
        }

        $ts = (is_string($block_json) && is_readable($block_json)) ? filemtime($block_json) : false;
        if (is_int($ts) && $ts > 0) {
            return wp_date(get_option('date_format'), $ts);
        }

        $fallback = $block_data['madeit']['updated'] ?? '';
        return is_string($fallback) && $fallback !== '' ? $fallback : 'N/A';
    };

    if (!current_user_can('manage_options')) {
        return;
    }
    $blocks = madeit_get_all_blocks();
    ?>

    <div class="wrap madeit-updates">

    <div class="madeit-layout">

        <!-- SIDEBAR -->
        <aside class="madeit-sidebar">

            <div class="madeit-sidebar-inner">

                <h1>Updates</h1>

                <p class="madeit-sidebar-description">
                    Overzicht van alle block releases, verbeteringen en bugfixes.
                </p>

                <nav class="madeit-block-nav">

                    <?php foreach ($blocks as $block => $block_data): ?>

                        <a
                            href="#block-<?php echo esc_attr($block); ?>"
                            class="madeit-block-nav-item"
                        >
                            <?php echo esc_html($block_data['title']); ?>
                        </a>

                    <?php endforeach; ?>

                </nav>

            </div>

        </aside>

        <!-- CONTENT -->
        <div class="madeit-content">

            <?php foreach ($blocks as $block => $block_data): ?>

                <?php
                $latest_version = $get_latest_version((array) $block_data);
                $last_updated   = $get_last_updated((string) $block, (array) $block_data);

                $changelog = $block_data['madeit']['changelog'] ?? [];

                if (is_array($changelog) && !empty($changelog)) {

                    $versions_sorted = array_keys($changelog);

                    usort($versions_sorted, 'version_compare');

                    $versions_sorted = array_reverse($versions_sorted);

                } else {

                    $versions_sorted = [];
                }
                ?>

                <section
                    id="block-<?php echo esc_attr($block); ?>"
                    class="madeit-release-card"
                >

                    <div class="madeit-release-header">

                        <div>

                            <h2>
                                <?php echo esc_html($block_data['title']); ?>
                            </h2>

                            <div class="madeit-release-meta">

                                <span class="madeit-version-pill">
                                    v<?php echo esc_html($latest_version ?: 'N/A'); ?>
                                </span>

                                <span>
                                    Laatste update:
                                    <?php echo esc_html($last_updated); ?>
                                </span>

                            </div>

                        </div>

                    </div>

                    <div class="madeit-release-content">

                        <?php foreach ($versions_sorted as $version): ?>

                            <?php
                            $items = is_array($changelog[$version] ?? null)
                                ? $changelog[$version]
                                : [];
                            ?>

                            <details
                                class="madeit-version-group"
                                <?php echo $version === $latest_version ? 'open' : ''; ?>
                            >

                                <summary class="madeit-version-header">

                                    <span class="madeit-version-badge">
                                        v<?php echo esc_html($version); ?>
                                    </span>

                                </summary>

                                <div class="madeit-version-content">

                                    <ul class="madeit-changelog-list">

                                        <?php foreach ($items as $item): ?>

                                            <li class="madeit-changelog-item">

                                                <?php if (is_array($item)) : ?>

                                                    <?php
                                                    $type  = $item['type'] ?? 'info';
                                                    $label = $item['label'] ?? ucfirst($type);
                                                    $text  = $item['text'] ?? '';
                                                    $intro = $item['intro'] ?? '';
                                                    ?>

                                                    <?php if (!empty($intro)) : ?>

                                                        <div class="madeit-changelog-intro">
                                                            <span class="madeit-badge madeit-badge-<?php echo esc_attr($type); ?>">
                                                                <?php echo esc_html($label); ?>
                                                            </span>
                                                            <?php echo esc_html($intro); ?>
                                                        </div>

                                                        <?php if (!empty($item['items']) && is_array($item['items'])) : ?>
                                                            <ul class="madeit-update-bullets">
                                                                <?php foreach ($item['items'] as $bullet) : ?>
                                                                    <li><?php echo esc_html($bullet); ?></li>
                                                                <?php endforeach; ?>
                                                            </ul>
                                                        <?php endif; ?>

                                                    <?php else : ?>

                                                        <span class="madeit-badge madeit-badge-<?php echo esc_attr($type); ?>">
                                                            <?php echo esc_html($label); ?>
                                                        </span>

                                                        <span class="madeit-changelog-text">
                                                            <?php echo esc_html($text); ?>
                                                        </span>

                                                    <?php endif; ?>

                                                <?php else : ?>

                                                    <?php
                                                    echo wp_kses($item, [
                                                        'b' => [],
                                                        'strong' => [],
                                                        'em' => [],
                                                        'br' => [],
                                                    ]);
                                                    ?>

                                                <?php endif; ?>

                                            </li>

                                        <?php endforeach; ?>

                                    </ul>

                                </div>

                            </details>

                        <?php endforeach; ?>

                        <?php if (!empty($block_data['madeit']['upgrade_notice'] ?? '')): ?>

                            <div class="madeit-upgrade-notice">

                                <strong>Upgrade notice</strong>

                                <p>
                                    <?php
                                    echo esc_html(
                                        $block_data['madeit']['upgrade_notice']
                                    );
                                    ?>
                                </p>

                            </div>

                        <?php endif; ?>

                    </div>

                </section>

            <?php endforeach; ?>

        </div>

    </div>

</div>


    <style>
        [id] {
            scroll-margin-top: 30px;
        }
        .madeit-updates {
            max-width: 1600px;
        }

        .madeit-layout {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 30px;
            margin-top: 30px;
        }

        /* SIDEBAR */

        .madeit-sidebar {
            position: sticky;
            top: 58px;
            height: fit-content;
        }

        .madeit-sidebar-inner {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 24px;
            box-shadow: 0 4px 14px rgba(0,0,0,.04);
        }

        .madeit-sidebar h1 {
            margin-top: 0;
            margin-bottom: 10px;
        }

        .madeit-sidebar-description {
            color: #666;
            margin-bottom: 24px;
            line-height: 1.5;
        }

        .madeit-block-nav {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .madeit-block-nav-item {
            text-decoration: none;
            padding: 12px 14px;
            border-radius: 10px;
            color: #1d2327;
            transition: all .15s ease;
            border: 1px solid transparent;
        }

        .madeit-block-nav-item:hover {
            background: #f6f7f7;
            border-color: #e5e7eb;
        }

        /* CONTENT */

        .madeit-content {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .madeit-release-card {
            background: #fff;
            border-radius: 18px;
            border: 1px solid #e5e7eb;
            overflow: hidden;
            box-shadow: 0 4px 14px rgba(0,0,0,.04);
        }

        .madeit-release-header {
            padding: 28px;
            border-bottom: 1px solid #f1f1f1;
        }

        .madeit-release-header h2 {
            margin: 0 0 12px;
            font-size: 24px;
        }

        .madeit-release-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #777;
            font-size: 13px;
        }

        .madeit-version-pill {
            background: #2271b1;
            color: #fff;
            padding: 5px 10px;
            border-radius: 999px;
            font-weight: 600;
            font-size: 12px;
        }

        .madeit-release-content {
            padding: 24px;
        }

        .madeit-version-group {
            border: 1px solid #f1f1f1;
            border-radius: 14px;
            overflow: hidden;
            margin-bottom: 16px;
        }

        .madeit-version-header {
            padding: 16px 18px;
            cursor: pointer;
            background: #fafafa;
            list-style: none;
        }

        .madeit-version-header::-webkit-details-marker {
            display: none;
        }

        .madeit-version-badge {
            background: #111827;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 999px;
        }

        .madeit-version-content {
            padding: 18px;
        }

        .madeit-changelog-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .madeit-update-bullets {
            list-style: disc;
            padding-left: 30px;
            margin-top: 20px;
        }

        .madeit-changelog-item {
            margin-bottom: 14px;
            line-height: 1.6;
        }

        .madeit-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 10px;
            text-transform: uppercase;
        }

        .madeit-badge-fix {
            background: #ffe9e9;
            color: #c0392b;
        }

        .madeit-badge-feature {
            background: #eafaf1;
            color: #1e8449;
        }

        .madeit-badge-improvement {
            background: #ebf5ff;
            color: #21618c;
        }

        .madeit-badge-info {
            background: #f1f1f1;
            color: #555;
        }

        .madeit-upgrade-notice {
            margin-top: 20px;
            background: #fff8e5;
            border-left: 4px solid #ffb900;
            padding: 14px 16px;
            border-radius: 10px;
        }

        html {
            scroll-behavior: smooth;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {

            .madeit-layout {
                grid-template-columns: 1fr;
            }

            .madeit-sidebar {
                position: relative;
                top: 0;
            }

        }

    </style>
    <?php
}


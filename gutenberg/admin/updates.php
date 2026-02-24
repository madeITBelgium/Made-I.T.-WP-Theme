<?php
function madeit_blocks_updates_page() {

    if (!current_user_can('manage_options')) {
        return;
    }
    $versions = madeit_get_all_changelogs();
    $blocks = madeit_get_all_blocks();
    ?>

    <div class="wrap madeit-updates">

        <h1>Made I.T. - Updates & Releases</h1>

        <p class="description">
            Overzicht van nieuwe features, verbeteringen en bugfixes per block.
        </p>

        <div class="madeit-updates-wrapper">
        <?php foreach ($blocks as $block => $block_data): ?>

            <div class="madeit-release-card" style="break-inside: avoid;-webkit-column-break-inside: avoid;page-break-inside: avoid;">

                <div class="madeit-release-header">
                    <h2><?php echo esc_html($block_data['title']); ?></h2>
                    <span  class="madeit-release-version">
                        v<?php echo esc_html($version); ?> -
                        <?php echo esc_html($block_data['madeit']['updated'] ?? 'N/A'); ?>
                    </span>
                </div>

                <div class="madeit-release-block">
                    <ul>
                    <?php foreach ($block_data['madeit']['changelog'] ?? [] as $version => $items): ?>
                        <li style="margin-bottom: 20px"><strong>v<?php echo esc_html($version); ?>:</strong>
                            <ul>
                                <?php foreach ($items as $item): ?>
                                    <li><?php echo esc_html($item); ?></li>
                                <?php endforeach; ?>
                            </ul>
                        </li>
                    <?php endforeach; ?>
                    </ul>


                    <?php if (!empty($block_data['madeit']['upgrade_notice'] ?? '')): ?>
                        <h3>Upgrade Notice:</h3>
                        <p><?php echo esc_html($block_data['madeit']['upgrade_notice']); ?></p>
                    <?php endif; ?>

                </div>

            </div>

        <?php endforeach; ?>
        </div>

    </div>


    <style>
        .madeit-updates {
            max-width: 1400px;
        }

        .madeit-updates-wrapper {
            margin-top: 50px;
            column-count: 3;
            /* display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            column-gap: 20px; */
        }

        .madeit-release-card {
            background: #fff;
            border-radius: 16px;
            padding: 25px 30px;
            margin: 0px 0 20px 0;
            box-shadow: 0 8px 24px rgba(0,0,0,.06);
        }

        .madeit-release-header {
            display:flex;
            justify-content:space-between;
            align-items:center;
            border-bottom:1px solid #eee;
            padding-bottom:10px;
        }

        .madeit-release-date {
            font-size:13px;
            color:#777;
        }

        .madeit-release-block {
            margin-top:20px;
        }

        .madeit-release-block h3 {
            margin-bottom:6px;
        }

        .madeit-release-block ul {
            margin-left:18px;
        }



        .madeit-release-blocks {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        .madeit-release-card {
            border: 1px solid #ddd;
            border-radius: 15px;
            padding: 20px;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .madeit-release-title {
            font-size: 18px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .madeit-release-version {
            background: #2271b1;
            color: #fff;
            font-size: 12px;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 12px;
        }

        .madeit-release-changelog ul {
            margin: 5px 0 15px 20px;
        }

        .madeit-release-changelog li.version-header {
            font-weight: bold;
            margin-top: 8px;
        }

        .changelog-item {
            list-style-type: disc;
            margin-left: 20px;
            line-height: 1.5;
        }

        .madeit-upgrade-notice {
            background: #fffbe6;
            border-left: 4px solid #ffb900;
            padding: 10px 15px;
            border-radius: 8px;
        }


    </style>
    <?php
}


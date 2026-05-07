<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

use MadeIT\Security\modules\AICrawlers;

$block_all   = (bool) \MadeIT\Security\Settings::get( 'madeit_security_block_ai_crawlers', false );
$crawlers    = AICrawlers::get_crawler_definitions();
$rules       = AICrawlers::get_crawler_rules();
$stats       = AICrawlers::get_crawler_stats();
$robots_text = AICrawlers::get_robots_rules();
?>

    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🤖</span>
            <div>
                <h1 class="madeit-security-page-title">AI Crawler Management</h1>
                <p class="madeit-security-page-sub">Control how AI training bots interact with your content</p>
            </div>
        </div>
    </div>

    <div class="madeit-security-page-content">
    <div class="madeit-security-main-grid madeit-security-main-grid--70-30">

        <!-- MAIN COLUMN -->
        <div class="madeit-security-col-main">

        <!-- ══ GLOBAL SETTINGS ═════════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">Global Settings</h2>
            </div>
            <div class="madeit-security-form-body">
                <div class="madeit-security-form-row madeit-security-form-row--toggle">
                    <div>
                        <strong>Block All AI Crawlers</strong>
                        <p class="madeit-security-desc">When enabled, all known AI training crawlers are blocked with a 403 response</p>
                    </div>
                    <label class="madeit-security-toggle">
                        <input type="checkbox"
                               id="madeit-security-block-all-ai"
                               name="madeit_security_block_ai_crawlers"
                               class="madeit-security-setting-input"
                               value="1"
                               <?php checked( $block_all ); ?> />
                        <span class="madeit-security-toggle__slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <!-- ══ PER-CRAWLER CONTROLS ════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">Per-Crawler Controls</h2>
                <span class="madeit-security-badge madeit-security-badge--gray"><?php echo count( $crawlers ); ?> crawlers</span>
            </div>
            <div class="madeit-security-table-wrapper">
                <table class="madeit-security-table" id="ai-crawlers-table">
                    <thead>
                        <tr>
                            <th>Crawler</th>
                            <th>Company</th>
                            <th>Purpose</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ( empty( $crawlers ) ) : ?>
                            <tr><td colspan="5" class="madeit-security-empty-cell">No AI crawlers defined.</td></tr>
                        <?php else : ?>
                            <?php foreach ( $crawlers as $crawler ) :
                                $id          = $crawler['id'];
                                $rule        = $rules[ $id ] ?? $crawler['default_action'];
                                $is_blocked  = ( $rule === 'block' );
                            ?>
                                <tr id="crawler-row-<?php echo esc_attr( $id ); ?>">
                                    <td>
                                        <strong><?php echo esc_html( $crawler['name'] ); ?></strong><br>
                                        <code style="font-size:.75rem;color:#718096"><?php echo esc_html( $crawler['ua_pattern'] ); ?></code>
                                    </td>
                                    <td><?php echo esc_html( $crawler['company'] ); ?></td>
                                    <td><small><?php echo esc_html( $crawler['purpose'] ); ?></small></td>
                                    <td>
                                        <?php if ( $is_blocked ) : ?>
                                            <span class="madeit-security-badge madeit-security-badge--red">Blocked</span>
                                        <?php else : ?>
                                            <span class="madeit-security-badge madeit-security-badge--green">Allowed</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <label class="madeit-security-toggle">
                                            <input type="checkbox"
                                                   class="madeit-security-crawler-toggle"
                                                   data-crawler-id="<?php echo esc_attr( $id ); ?>"
                                                   <?php checked( ! $is_blocked ); ?> />
                                            <span class="madeit-security-toggle__slider"></span>
                                        </label>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
            <div class="madeit-security-form-body" style="border-top:1px solid #e2e8f0">
                <button class="madeit-security-btn madeit-security-btn--primary" id="btn-save-crawler-rules">💾 Save Rules</button>
                <div id="crawler-rules-result" class="madeit-security-form-result" style="display:none;"></div>
            </div>
        </div>

        <!-- ══ ROBOTS.TXT PREVIEW ══════════════════════════════════════════ -->
        <div class="madeit-security-panel">
            <div class="madeit-security-panel__header">
                <h2 class="madeit-security-panel__title">robots.txt Preview</h2>
            </div>
            <div class="madeit-security-form-body">
                <p class="madeit-security-desc">These rules are automatically injected into your WordPress robots.txt output based on the crawler settings above.</p>
                <?php if ( ! empty( $robots_text ) ) : ?>
                    <textarea class="madeit-security-input" readonly rows="10" style="font-family:monospace;font-size:.8rem;white-space:pre;resize:vertical"><?php echo esc_textarea( $robots_text ); ?></textarea>
                <?php else : ?>
                    <div class="madeit-security-notice madeit-security-notice--info">No robots.txt rules are currently being injected. Adjust the per-crawler settings above to generate rules.</div>
                <?php endif; ?>
            </div>
        </div>

        </div><!-- /col-main -->

        <!-- SIDEBAR -->
        <div class="madeit-security-col-side">

            <!-- ══ CRAWLER STATS ═══════════════════════════════════════════ -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">AI Crawler Stats (30 Days)</h2>
                </div>
                <?php if ( empty( $stats ) ) : ?>
                    <p class="madeit-security-empty-panel">No AI crawler visits recorded.</p>
                <?php else : ?>
                    <ul class="madeit-security-whitelist-list">
                        <?php foreach ( $stats as $stat ) : ?>
                            <li class="madeit-security-whitelist-item" style="justify-content:space-between">
                                <span><?php echo esc_html( $stat->crawler_name ); ?></span>
                                <span class="madeit-security-badge madeit-security-badge--blue"><?php echo esc_html( number_format( (int) $stat->total_visits ) ); ?> visits</span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>

            <!-- ══ ABOUT AI CRAWLERS ═══════════════════════════════════════ -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">About AI Crawlers</h2>
                </div>
                <div class="madeit-security-form-body">
                    <p class="madeit-security-desc">AI crawlers are automated bots operated by AI companies that scan and collect web content. They are used to:</p>
                    <ul class="madeit-security-desc" style="padding-left:18px;margin-top:8px;list-style:disc">
                        <li>Train large language models (LLMs)</li>
                        <li>Index content for AI search engines</li>
                        <li>Scrape data for AI-powered products</li>
                    </ul>
                    <div class="madeit-security-notice madeit-security-notice--warn" style="margin-top:12px">
                        Blocking via robots.txt is a polite request that compliant bots will respect. The WAF enforces blocking at the request level by returning a 403 to known AI user agents.
                    </div>
                </div>
            </div>

        </div><!-- /col-side -->

    </div><!-- /main-grid -->
    </div><!-- /.madeit-security-page-content -->

<?php defined( 'ABSPATH' ) || exit; ?>

    <!-- ── PAGE HEADER ────────────────────────────────────────────────── -->
    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">🛡️</span>
            <div>
                <h1 class="madeit-security-page-title">Security Dashboard</h1>
                <p class="madeit-security-page-sub">Real-time protection overview for <?php echo esc_html( get_bloginfo('name') ); ?></p>
            </div>
        </div>
        <div class="madeit-security-page-header__right">
            <span class="madeit-security-live-badge" id="madeit-security-live-badge">
                <span class="madeit-security-pulse"></span> LIVE
            </span>
            <span class="madeit-security-last-updated">Updated: <span id="madeit-security-last-update-time">—</span></span>
        </div>
    </div>

    <!-- ── CONTENT AREA ──────────────────────────────────────────────── -->
    <div class="madeit-security-page-content">

    <!-- ── STAT CARDS ─────────────────────────────────────────────────── -->
    <div class="madeit-security-stat-cards" id="madeit-security-stat-cards">
        <div class="madeit-security-stat-card madeit-security-stat-card--green">
            <div class="madeit-security-stat-card__icon">👁️</div>
            <div class="madeit-security-stat-card__data">
                <div class="madeit-security-stat-card__number" id="stat-live-now">—</div>
                <div class="madeit-security-stat-card__label">Online Now</div>
                <div class="madeit-security-stat-card__sub">last 5 minutes</div>
            </div>
        </div>
        <div class="madeit-security-stat-card madeit-security-stat-card--blue">
            <div class="madeit-security-stat-card__icon">📊</div>
            <div class="madeit-security-stat-card__data">
                <div class="madeit-security-stat-card__number" id="stat-total-24h">—</div>
                <div class="madeit-security-stat-card__label">Requests (24h)</div>
                <div class="madeit-security-stat-card__sub" id="stat-unique-ips">— unique IPs</div>
            </div>
        </div>
        <div class="madeit-security-stat-card madeit-security-stat-card--orange">
            <div class="madeit-security-stat-card__icon">🤖</div>
            <div class="madeit-security-stat-card__data">
                <div class="madeit-security-stat-card__number" id="stat-bots-24h">—</div>
                <div class="madeit-security-stat-card__label">Bots (24h)</div>
                <div class="madeit-security-stat-card__sub" id="stat-bot-pct">—% of traffic</div>
            </div>
        </div>
        <div class="madeit-security-stat-card madeit-security-stat-card--red">
            <div class="madeit-security-stat-card__icon">🚫</div>
            <div class="madeit-security-stat-card__data">
                <div class="madeit-security-stat-card__number" id="stat-blocked-24h">—</div>
                <div class="madeit-security-stat-card__label">Blocked (24h)</div>
                <div class="madeit-security-stat-card__sub" id="stat-total-blocked">— IPs on block list</div>
            </div>
        </div>
    </div>

    <!-- ── MAIN GRID ──────────────────────────────────────────────────── -->
    <div class="madeit-security-main-grid">

        <!-- LEFT COLUMN -->
        <div class="madeit-security-col-main">

            <!-- LIVE VISITORS TABLE -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">
                        <span class="madeit-security-pulse madeit-security-pulse--sm"></span>
                        Live Visitors
                        <span class="madeit-security-badge madeit-security-badge--green" id="live-count-badge">0</span>
                    </h2>
                    <div class="madeit-security-panel__actions">
                        <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost" id="btn-refresh-live">↻ Refresh</button>
                    </div>
                </div>
                <div class="madeit-security-table-wrapper">
                    <table class="madeit-security-table madeit-security-table--live" id="live-visitors-table">
                        <thead>
                            <tr>
                                <th class="col-ip">IP</th>
                                <th class="col-country"></th>
                                <th class="col-ua">Browser</th>
                                <th class="col-page">Page</th>
                                <th class="col-lastseen">Seen</th>
                                <th class="col-type">Type</th>
                                <th class="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="live-visitors-tbody">
                            <tr class="madeit-security-loading-row">
                                <td colspan="7" class="madeit-security-loading-cell">
                                    <div class="madeit-security-spinner"></div> Loading live visitors…
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TRAFFIC CHART -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Traffic — Last 24 Hours</h2>
                    <div class="madeit-security-panel__actions">
                        <select id="chart-metric" class="madeit-security-select-sm">
                            <option value="total">All Traffic</option>
                            <option value="bots">Bots Only</option>
                            <option value="blocked">Blocked Only</option>
                        </select>
                    </div>
                </div>
                <div class="madeit-security-chart-wrap">
                    <canvas id="traffic-chart" height="120"></canvas>
                </div>
            </div>

        </div>

        <!-- RIGHT COLUMN -->
        <div class="madeit-security-col-side">

            <!-- TOP IPs -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Top IPs (24h)</h2>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=madeit-security-visitor-log' ) ); ?>" class="madeit-security-link-sm">View all →</a>
                </div>
                <div id="top-ips-list" class="madeit-security-ip-list">
                    <div class="madeit-security-skeleton-list"></div>
                </div>
            </div>

            <!-- TOP PAGES -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Top Pages (24h)</h2>
                </div>
                <div id="top-pages-list" class="madeit-security-page-list">
                    <div class="madeit-security-skeleton-list"></div>
                </div>
            </div>

            <!-- BROWSER BREAKDOWN -->
            <div class="madeit-security-panel">
                <div class="madeit-security-panel__header">
                    <h2 class="madeit-security-panel__title">Browsers / Bots</h2>
                </div>
                <canvas id="browser-chart" height="160" style="padding:12px"></canvas>
            </div>

        </div>
    </div>

    </div><!-- /.madeit-security-page-content -->

<?php require_once __DIR__ . '/_modals.php'; ?>

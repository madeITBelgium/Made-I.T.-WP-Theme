<?php defined( 'ABSPATH' ) || exit; ?>

    <!-- PAGE HEADER -->
    <div class="madeit-security-page-header">
        <div class="madeit-security-page-header__left">
            <span class="madeit-security-shield-icon">📋</span>
            <div>
                <h1 class="madeit-security-page-title">Visitor Log</h1>
                <p class="madeit-security-page-sub">All requests to your site, searchable and filterable</p>
            </div>
        </div>
        <div class="madeit-security-page-header__right">
            <button class="madeit-security-btn madeit-security-btn--sm" id="btn-export-log">⬇ Export CSV</button>
        </div>
    </div>

    <!-- CONTENT AREA (padded, constrained) -->
    <div class="madeit-security-page-content">

        <!-- FILTER BAR -->
        <div class="madeit-security-filter-bar" id="madeit-security-filter-bar">
            <div class="madeit-security-filter-bar__row">
                <div class="madeit-security-filter-bar__search">
                    <span class="madeit-security-search-icon">🔍</span>
                    <input type="text"
                           id="filter-ip"
                           class="madeit-security-search-input"
                           placeholder="Search by IP address…"
                           autocomplete="off" />
                </div>
                <div class="madeit-security-filter-bar__search">
                    <span class="madeit-security-search-icon">🔗</span>
                    <input type="text"
                           id="filter-url"
                           class="madeit-security-search-input"
                           placeholder="Search by URL / page…"
                           autocomplete="off" />
                </div>
                <select id="filter-bot" class="madeit-security-select">
                    <option value="-1">All Traffic</option>
                    <option value="0">Humans Only</option>
                    <option value="1">Bots Only</option>
                </select>
                <select id="filter-blocked" class="madeit-security-select">
                    <option value="-1">Any Status</option>
                    <option value="1">Blocked Only</option>
                    <option value="0">Allowed Only</option>
                </select>
                <select id="filter-hours" class="madeit-security-select">
                    <option value="1">Last 1 hour</option>
                    <option value="6">Last 6 hours</option>
                    <option value="24" selected>Last 24 hours</option>
                    <option value="48">Last 48 hours</option>
                    <option value="72">Last 3 days</option>
                    <option value="168">Last 7 days</option>
                </select>
                <button class="madeit-security-btn madeit-security-btn--primary" id="btn-apply-filters">Apply Filters</button>
                <button class="madeit-security-btn madeit-security-btn--ghost" id="btn-clear-filters">Clear</button>
            </div>
            <div class="madeit-security-filter-bar__row">
                <label class="madeit-security-filter-checkbox">
                    <input type="checkbox" id="filter-exclude-logged-in" />
                    <span>Exclude logged-in users</span>
                </label>
            </div>
        </div>

        <!-- RESULTS INFO -->
        <div class="madeit-security-results-info" id="madeit-security-results-info">
            <span id="results-count">Loading…</span>
            <span class="madeit-security-results-info__time">Last refreshed: <span id="log-refresh-time">—</span></span>
            <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--icon" id="btn-refresh-log" title="Refresh">↻</button>
        </div>

        <!-- LOG TABLE -->
        <div class="madeit-security-panel madeit-security-panel--no-header">
            <div class="madeit-security-table-wrapper madeit-security-table-wrapper--scroll">
                <table class="madeit-security-table madeit-security-table--log" id="visitor-log-table">
                    <thead>
                        <tr>
                            <th class="col-time">Time</th>
                            <th class="col-ip">IP</th>
                            <th class="col-country"></th>
                            <th class="col-method"></th>
                            <th class="col-page">Page / URL</th>
                            <th class="col-ua">Browser</th>
                            <th class="col-user">User</th>
                            <th class="col-status"></th>
                            <th class="col-actions"></th>
                        </tr>
                    </thead>
                    <tbody id="visitor-log-tbody">
                        <tr class="madeit-security-loading-row">
                            <td colspan="9" class="madeit-security-loading-cell">
                                <div class="madeit-security-spinner"></div> Loading visitor log…
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- PAGINATION -->
            <div class="madeit-security-pagination" id="madeit-security-pagination">
                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost" id="btn-prev-page" disabled>← Prev</button>
                <span class="madeit-security-pagination__info" id="pagination-info">Page 1 of 1</span>
                <button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--ghost" id="btn-next-page" disabled>Next →</button>
            </div>
        </div>

    </div><!-- /.madeit-security-page-content -->

<?php require_once __DIR__ . '/_modals.php'; ?>


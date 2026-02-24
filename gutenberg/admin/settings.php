<?php
add_action('admin_init', function () {
    // Custom (theme) blocks: store disabled slugs. Empty = everything enabled by default.
    register_setting('madeit_blocks', 'madeit_blocks_disabled', [
        'type' => 'array',
        'default' => [],
        'sanitize_callback' => function ($value) {
            $value = is_array($value) ? $value : [];
            $value = array_values(array_filter(array_map('sanitize_key', $value)));
            return array_values(array_unique($value));
        },
    ]);

    // Core (wp-includes) blocks: store disabled slugs. Empty = everything enabled by default.
    register_setting('madeit_blocks', 'madeit_core_blocks_disabled', [
        'type' => 'array',
        'default' => [],
        'sanitize_callback' => function ($value) {
            $value = is_array($value) ? $value : [];
            $value = array_values(array_filter(array_map('sanitize_key', $value)));
            return array_values(array_unique($value));
        },
    ]);

    // Backwards-compat: legacy option used to store enabled slugs.
    register_setting('madeit_blocks', 'madeit_blocks_enabled', [
        'type' => 'array',
        'default' => [],
        'sanitize_callback' => function ($value) {
            $value = is_array($value) ? $value : [];
            $value = array_values(array_filter(array_map('sanitize_key', $value)));
            return array_values(array_unique($value));
        },
    ]);
});

add_action('admin_enqueue_scripts', function ($hook) {
    // Only load assets on our page.
    if ($hook !== 'toplevel_page_madeit-blocks' && $hook !== 'made-i-t-blocks_page_madeit-blocks') {
        if (!isset($_GET['page']) || $_GET['page'] !== 'madeit-blocks') {
            return;
        }
    }

    wp_register_style('madeit-blocks-admin', false);
    wp_enqueue_style('madeit-blocks-admin');
    wp_add_inline_style('madeit-blocks-admin', '
        .madeit-block-card { position: relative; }
        .madeit-toggle { display:inline-flex; align-items:center; gap:10px; margin-top:12px; }
        .madeit-toggle input { position:absolute; opacity:0; width:1px; height:1px; }
        .madeit-toggle-slider { width:44px; height:24px; background:#c3c4c7; border-radius:999px; position:relative; transition:background .15s ease; }
        .madeit-toggle-slider:before { content:""; position:absolute; width:20px; height:20px; left:2px; top:2px; background:#fff; border-radius:50%; box-shadow:0 1px 2px rgba(0,0,0,.2); transition:transform .15s ease; }
        .madeit-toggle input:checked + .madeit-toggle-slider { background:#2271b1; }
        .madeit-toggle input:checked + .madeit-toggle-slider:before { transform:translateX(20px); }
        .madeit-toggle input:focus-visible + .madeit-toggle-slider { outline:2px solid #2271b1; outline-offset:2px; }
        .madeit-toggle-status { font-size:12px; color:#646970; }
        .madeit-toggle.is-saving .madeit-toggle-status { color:#2271b1; }

        .tab-container {
            display: flex;
            width: max-content;
            background: #d3d3d3;
            border-radius: 8px;
            gap: 0px;
        }
        .tab-item {
            padding: 13px 5px;
        }
        .tab-link {
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            padding: 10px 20px;
            position: relative;
            z-index: 2;
        }
        .tab-link:before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            top: 0;
            left: 0;
            z-index: -1;
            transition: all .15s ease;
        }
        .tab-link.active:before {
            background: #2271b1;
            transition: all .15s ease;
        }
        .tab-link.active {
            color: white;
        }
        .tab-link:focus {
            box-shadow: none;
            outline: 0;
        }
    ');

    // Include WP block libraries so core blocks (and their icons) are registered on this admin page.
    wp_register_script('madeit-blocks-admin', '', ['wp-block-library', 'wp-block-editor', 'wp-dom-ready', 'wp-element', 'wp-components', 'wp-blocks'], false, true);
    wp_enqueue_script('madeit-blocks-admin');

    $nonce = wp_create_nonce('madeit_toggle_block');
    wp_add_inline_script('madeit-blocks-admin', 'window.MADEIT_BLOCKS_ADMIN = ' . wp_json_encode([
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => $nonce,
    ]) . ';', 'before');

    wp_add_inline_script('madeit-blocks-admin', '
        (function() {
            var coreBlocksRegistered = false;

            function ensureCoreBlocksRegistered() {
                if (coreBlocksRegistered) return;
                if (!window.wp) return;
                if (!wp.blockLibrary || typeof wp.blockLibrary.registerCoreBlocks !== "function") return;

                try {
                    wp.blockLibrary.registerCoreBlocks();
                    coreBlocksRegistered = true;
                } catch (e) {
                    // ignore
                }
            }

            function renderCoreBlockIcons() {
                if (!window.wp || !wp.blocks || !wp.element || !wp.components || !wp.components.Icon) return;

                ensureCoreBlocksRegistered();

                var nodes = document.querySelectorAll(".madeit-core-icon[data-block-name]");
                if (!nodes || !nodes.length) return;

                nodes.forEach(function(node) {
                    var name = node.getAttribute("data-block-name");
                    if (!name) return;

                    var blockType = wp.blocks.getBlockType(name);
                    if (!blockType || !blockType.icon) return;

                    try {
                        var icon = blockType.icon;

                        // Prefer BlockIcon when available: it supports icon objects like { src, foreground, background }.
                        var el;
                        if (wp.blockEditor && wp.blockEditor.BlockIcon) {
                            el = wp.element.createElement(wp.blockEditor.BlockIcon, { icon: icon, showColors: true });
                        } else {
                            if (icon && typeof icon === "object" && icon.src) {
                                icon = icon.src;
                            }
                            el = wp.element.createElement(wp.components.Icon, { icon: icon });
                        }

                        if (wp.element.createRoot) {
                            wp.element.createRoot(node).render(el);
                        } else if (wp.element.render) {
                            wp.element.render(el, node);
                        }
                    } catch (e) {
                        // keep fallback icon
                    }
                });
            }

            function postToggle(action, slug, enabled) {
                var data = new URLSearchParams();
                data.append("action", action);
                data.append("nonce", (window.MADEIT_BLOCKS_ADMIN && window.MADEIT_BLOCKS_ADMIN.nonce) || "");
                data.append("slug", slug);
                data.append("enabled", enabled ? "1" : "0");

                return fetch((window.MADEIT_BLOCKS_ADMIN && window.MADEIT_BLOCKS_ADMIN.ajaxUrl) || ajaxurl, {
                    method: "POST",
                    credentials: "same-origin",
                    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                    body: data.toString()
                }).then(function(res) { return res.json(); });
            }

            document.addEventListener("change", function(e) {
                var input = e.target;
                if (!input || !input.classList || !input.classList.contains("madeit-block-toggle")) return;

                var slug = input.getAttribute("data-slug");
                if (!slug) return;

                var scope = input.getAttribute("data-scope") || "custom";
                var action = scope === "core" ? "madeit_toggle_core_block" : "madeit_toggle_block";

                var wrap = input.closest(".madeit-toggle");
                if (wrap) wrap.classList.add("is-saving");

                postToggle(action, slug, input.checked).then(function(payload) {
                    if (!payload || payload.success !== true) {
                        throw new Error((payload && payload.data && payload.data.message) || "Save failed");
                    }
                }).catch(function(err) {
                    input.checked = !input.checked;
                    alert("Kon niet opslaan: " + (err && err.message ? err.message : err));
                }).finally(function() {
                    if (wrap) wrap.classList.remove("is-saving");
                });
            });

            if (window.wp && wp.domReady) {
                wp.domReady(renderCoreBlockIcons);
            } else if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", renderCoreBlockIcons);
            } else {
                renderCoreBlockIcons();
            }
        })();
    ');

    // Tabs (all/active/inactive) + search filtering. Must be enqueued (not echoed), otherwise it breaks admin-ajax JSON.
    wp_add_inline_script('madeit-blocks-admin', '
        (function() {
            function ready(fn) {
                if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", fn);
                } else {
                    fn();
                }
            }

            ready(function() {
                var tabLinks = document.querySelectorAll(".tab-link");
                var searchInput = document.getElementById("block-search");

                function getCardToggle(card) {
                    return card ? card.querySelector("input.madeit-block-toggle") : null;
                }

                function updateCategoryHeadings() {
                    // Works for both grids (custom + core). Headings and cards are siblings in DOM order.
                    document.querySelectorAll(".container > div").forEach(function(grid) {
                        var children = Array.from(grid.children);
                        var currentHeading = null;
                        var hasVisibleCardUnderHeading = false;

                        function flushHeading() {
                            if (!currentHeading) return;
                            currentHeading.style.display = hasVisibleCardUnderHeading ? "" : "none";
                        }

                        children.forEach(function(el) {
                            if (el.tagName && el.tagName.toLowerCase() === "h2") {
                                flushHeading();
                                currentHeading = el;
                                hasVisibleCardUnderHeading = false;
                                return;
                            }

                            if (el.classList && el.classList.contains("madeit-block-card")) {
                                if (el.style.display !== "none") {
                                    hasVisibleCardUnderHeading = true;
                                }
                            }
                        });

                        flushHeading();
                    });
                }

                function applySearchFilter() {
                    if (!searchInput) return;
                    var query = (searchInput.value || "").trim().toLowerCase();
                    var blockCards = document.querySelectorAll(".madeit-block-card");

                    blockCards.forEach(function(card) {
                        var titleEl = card.querySelector("h4, strong");
                        var descEl = card.querySelector("p, .content");
                        var title = titleEl ? (titleEl.textContent || "").toLowerCase() : "";
                        var description = descEl ? (descEl.textContent || "").toLowerCase() : "";

                        if (!query || title.includes(query) || description.includes(query)) {
                            if (card.getAttribute("data-search-hidden") === "1") {
                                card.removeAttribute("data-search-hidden");
                            }
                        } else {
                            card.setAttribute("data-search-hidden", "1");
                        }
                    });
                }

                function filterBlocks(filter) {
                    var blockCards = document.querySelectorAll(".madeit-block-card");

                    applySearchFilter();

                    blockCards.forEach(function(card) {
                        // First apply search hiding.
                        if (card.getAttribute("data-search-hidden") === "1") {
                            card.style.display = "none";
                            return;
                        }

                        var toggle = getCardToggle(card);
                        var isChecked = !!(toggle && toggle.checked);

                        if (filter === "all") {
                            card.style.display = "";
                            return;
                        }

                        if (filter === "active") {
                            card.style.display = isChecked ? "" : "none";
                            return;
                        }

                        if (filter === "inactive") {
                            card.style.display = !isChecked ? "" : "none";
                            return;
                        }

                        card.style.display = "";
                    });

                    updateCategoryHeadings();
                }

                tabLinks.forEach(function(link) {
                    link.addEventListener("click", function(e) {
                        e.preventDefault();
                        tabLinks.forEach(function(l) { l.classList.remove("active"); });
                        link.classList.add("active");

                        tabLinks.forEach(function(l) { l.removeAttribute("aria-current"); });
                        link.setAttribute("aria-current", "true");

                        var filter = link.getAttribute("data-filter") || "all";
                        filterBlocks(filter);
                    });
                });

                if (searchInput) {
                    searchInput.addEventListener("input", function() {
                        var activeTab = document.querySelector(".tab-link.active");
                        var filter = activeTab ? (activeTab.getAttribute("data-filter") || "all") : "all";
                        filterBlocks(filter);
                    });
                }

                // Keep current filter consistent when toggles change.
                document.addEventListener("change", function(e) {
                    var target = e.target;
                    if (!target || !target.classList || !target.classList.contains("madeit-block-toggle")) return;

                    var activeTab = document.querySelector(".tab-link.active");
                    var filter = activeTab ? (activeTab.getAttribute("data-filter") || "all") : "all";
                    filterBlocks(filter);
                });

                // Initial state.
                filterBlocks("all");
            });
        })();
    ');
});

function madeit_can_manage_core_blocks(): bool
{
    if (!current_user_can('manage_options')) {
        return false;
    }

    $user = wp_get_current_user();
    $email = is_object($user) ? (string) ($user->user_email ?? '') : '';
    if ($email === '') {
        return false;
    }

    return stripos($email, '@madeit') !== false;
}

function madeit_custom_block_slugs(): array
{
    $blocks_dir = function_exists('get_theme_file_path')
        ? get_theme_file_path('gutenberg/blocks')
        : (get_stylesheet_directory() . '/gutenberg/blocks');

    if (!is_dir($blocks_dir)) {
        return [];
    }

    $slugs = [];
    try {
        $iterator = new DirectoryIterator($blocks_dir);
    } catch (Exception $e) {
        return [];
    }

    foreach ($iterator as $entry) {
        if ($entry->isDot() || !$entry->isDir()) {
            continue;
        }

        $slug = $entry->getBasename();
        $register_file = $entry->getPathname() . '/register.php';
        if (is_readable($register_file)) {
            $slugs[] = $slug;
        }
    }

    sort($slugs);
    return $slugs;
}

function madeit_blocks_disabled(): array
{
    $disabled = (array) get_option('madeit_blocks_disabled', []);
    return array_values(array_filter(array_map('sanitize_key', $disabled)));
}

function madeit_core_blocks_disabled(): array
{
    $disabled = (array) get_option('madeit_core_blocks_disabled', []);
    return array_values(array_filter(array_map('sanitize_key', $disabled)));
}

add_action('wp_ajax_madeit_toggle_block', function () {
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => 'Forbidden'], 403);
    }

    check_ajax_referer('madeit_toggle_block', 'nonce');

    $slug = isset($_POST['slug']) ? sanitize_key((string) $_POST['slug']) : '';
    $enabled = isset($_POST['enabled']) && (string) $_POST['enabled'] === '1';

    if ($slug === '') {
        wp_send_json_error(['message' => 'Missing slug'], 400);
    }

    // Update disabled list (default = all enabled).
    $disabled = madeit_blocks_disabled();

    if ($enabled) {
        $disabled = array_values(array_diff($disabled, [$slug]));
    } else {
        if (!in_array($slug, $disabled, true)) {
            $disabled[] = $slug;
        }
    }

    update_option('madeit_blocks_disabled', $disabled);

    // Backwards-compat: also keep madeit_blocks_enabled in sync.
    $all = madeit_custom_block_slugs();
    $enabled_list = array_values(array_diff($all, $disabled));
    update_option('madeit_blocks_enabled', $enabled_list);

    wp_send_json_success(['disabled' => $disabled, 'enabled' => $enabled_list]);
});

add_action('wp_ajax_madeit_toggle_core_block', function () {
    if (!madeit_can_manage_core_blocks()) {
        wp_send_json_error(['message' => 'Forbidden'], 403);
    }

    check_ajax_referer('madeit_toggle_block', 'nonce');

    $slug = isset($_POST['slug']) ? sanitize_key((string) $_POST['slug']) : '';
    $enabled = isset($_POST['enabled']) && (string) $_POST['enabled'] === '1';

    if ($slug === '') {
        wp_send_json_error(['message' => 'Missing slug'], 400);
    }

    $disabled = madeit_core_blocks_disabled();
    if ($enabled) {
        $disabled = array_values(array_diff($disabled, [$slug]));
    } else {
        if (!in_array($slug, $disabled, true)) {
            $disabled[] = $slug;
        }
    }

    update_option('madeit_core_blocks_disabled', $disabled);
    wp_send_json_success(['disabled' => $disabled]);
});

function madeit_get_all_blocks(): array
{
    $blocks_dir = function_exists('get_theme_file_path')
        ? get_theme_file_path('gutenberg/blocks')
        : (get_stylesheet_directory() . '/gutenberg/blocks');

    if (!is_dir($blocks_dir)) {
        return [];
    }

    // if you want to exclude certain blocks from the overview, you can do it here by skipping them in the loop below (e.g. continue if slug is 'advanced-controls')
    $blocks = [];
    $enabled_blocks = madeit_blocks_enabled(); // voor checks
    $stored_statuses = get_option('madeit_blocks_status', []); // status per block

    foreach (glob(trailingslashit($blocks_dir) . '*', GLOB_ONLYDIR) as $dir) {
        $slug = basename($dir);
        if ($slug === 'advanced-controls') {
            continue;
        }
        $title = $slug;
        $description = '';
        $icon = null;
        $status = 'normal';
        $version = null;
        $madeit  = [];
        $category = 'madeit';


        $block_json_file = $dir . '/block.json';
        if (is_readable($block_json_file)) {
            $decoded = json_decode((string) file_get_contents($block_json_file), true);
            if (is_array($decoded)) {
                $title = $decoded['title'] ?? $title;
                $description = $decoded['description'] ?? $description;
                $icon = $decoded['icon'] ?? null;
                $status = $decoded['status'] ?? 'normal'; // ← hier haal je het uit JSON
                $version = $decoded['version'] ?? null;
                $madeit  = $decoded['madeit'] ?? [];
                $category = isset($decoded['category']) ? (string) $decoded['category'] : $category;
            }
        }

        $blocks[$slug] = [
            'title' => $title,
            'description' => $description,
            'icon' => $icon,
            'status' => $status,

            'category'    => $category,

            'version'     => $version,
            'madeit'      => $madeit,
        ];
    }

    uasort($blocks, fn($a, $b) => strcasecmp((string) ($a['title'] ?? ''), (string) ($b['title'] ?? '')));
    return $blocks;
}

function guttenberg_get_all_blocks(): array
{
    // Core Gutenberg blocks live in: wp-includes/blocks/<block-slug>/block.json
    // We use ABSPATH/WPINC so this also works when the theme folder moves.
    $blocks_dir_gut = trailingslashit(trailingslashit(ABSPATH) . WPINC . '/blocks');

    if (!is_dir($blocks_dir_gut)) {
        var_dump('Core blocks directory not found', $blocks_dir_gut);
        return [];
    }

    $blocks_gut = [];

    // Prefer DirectoryIterator over glob(): some hosts disable glob via disable_functions.
    try {
        $iterator = new DirectoryIterator($blocks_dir_gut);
    } catch (Exception $e) {
        var_dump('Failed to read core blocks directory', $blocks_dir_gut, $e->getMessage());
        return [];
    }

    foreach ($iterator as $entry) {
        if ($entry->isDot() || !$entry->isDir()) {
            continue;
        }

        $dir = $entry->getPathname();
        $slug = $entry->getBasename();
        $block_json_file = $dir . '/block.json';

        $data = [
            'slug' => $slug,
            'dir' => $dir,
            'block_json' => $block_json_file,
            'title' => $slug,
            'description' => '',
            'name' => 'core/' . $slug,
            'icon' => null,
        ];

        if (is_readable($block_json_file)) {
            $decoded = json_decode((string) file_get_contents($block_json_file), true);
            if (is_array($decoded)) {
                $data['title'] = $decoded['title'] ?? $data['title'];
                $data['description'] = $decoded['description'] ?? $data['description'];
                $data['name'] = $decoded['name'] ?? $data['name'];
                $data['icon'] = $decoded['icon'] ?? $data['icon'];
                $data['category'] = $decoded['category'] ?? null;
                $data['keywords'] = $decoded['keywords'] ?? null;
                $data['version'] = $decoded['version'] ?? null;
            }
        }

        $blocks_gut[$slug] = $data;
    }

    ksort($blocks_gut);
    return $blocks_gut;
}

function madeit_dashicon_for_core_block_category(string $category): string
{
    $category = sanitize_key($category);
    return match ($category) {
        'text' => 'dashicons-editor-paragraph',
        'media' => 'dashicons-format-image',
        'design' => 'dashicons-layout',
        'widgets' => 'dashicons-screenoptions',
        'theme' => 'dashicons-admin-appearance',
        'embed' => 'dashicons-share',
        'reusable' => 'dashicons-admin-page',
        default => 'dashicons-block-default',
    };
}

function madeit_category_label(string $category): string
{
    $category = sanitize_key($category);
    return match ($category) {
        'madeit' => 'Made I.T.',
        'text' => 'Text',
        'media' => 'Media',
        'design' => 'Design',
        'widgets' => 'Widgets',
        'theme' => 'Theme',
        'embed' => 'Embeds',
        'reusable' => 'Reusable',
        'uncategorized' => 'Other',
        default => ucfirst($category),
    };
}

function madeit_group_blocks_by_category(array $blocks, string $default_category = 'uncategorized'): array
{
    $default_category = sanitize_key($default_category);
    if ($default_category === '') {
        $default_category = 'uncategorized';
    }

    $grouped = [];
    foreach ($blocks as $slug => $block) {
        $category = sanitize_key((string) ($block['category'] ?? $default_category));
        if ($category === '') {
            $category = $default_category;
        }
        if (!isset($grouped[$category])) {
            $grouped[$category] = [];
        }
        $grouped[$category][$slug] = $block;
    }

    ksort($grouped);
    foreach ($grouped as $cat => $cat_blocks) {
        uasort($cat_blocks, fn($a, $b) => strcasecmp((string) ($a['title'] ?? ''), (string) ($b['title'] ?? '')));
        $grouped[$cat] = $cat_blocks;
    }

    return $grouped;
}



function madeit_blocks_overview_page() {
    // Temporary debug: dump WP core blocks and stop execution.
    if (isset($_GET['dump_core_blocks']) && (string) $_GET['dump_core_blocks'] === '1' && current_user_can('manage_options')) {
        $blocks_gut = guttenberg_get_all_blocks();

        ob_start();
        var_dump($blocks_gut);
        $dump = (string) ob_get_clean();

        wp_die('<pre style="white-space:pre-wrap;word-break:break-word;">' . esc_html($dump) . '</pre>', 'Core Gutenberg blocks');
    }

    $blocks = madeit_get_all_blocks(); // custom/theme blocks
    $core_blocks = guttenberg_get_all_blocks(); // wp-includes core blocks

    // Counts for tabs should reflect ALL blocks (custom + core) and match the toggle state.
    $custom_total = is_array($blocks) ? count($blocks) : 0;
    $core_total = is_array($core_blocks) ? count($core_blocks) : 0;

    $custom_disabled = madeit_blocks_disabled();
    $core_disabled = madeit_core_blocks_disabled();

    $custom_inactive = 0;
    foreach (array_keys((array) $blocks) as $slug) {
        if (in_array((string) $slug, $custom_disabled, true)) {
            $custom_inactive++;
        }
    }
    $core_inactive = 0;
    foreach (array_keys((array) $core_blocks) as $slug) {
        if (in_array((string) $slug, $core_disabled, true)) {
            $core_inactive++;
        }
    }

    $custom_active = max(0, $custom_total - $custom_inactive);
    $core_active = max(0, $core_total - $core_inactive);

    $all_total = $custom_total + $core_total;
    $all_active = $custom_active + $core_active;
    $all_inactive = $custom_inactive + $core_inactive;

    ?>
    <div class="wrap">
        <h1 style="font-size: 30px;">Gutenberg Blocks - Settings</h1>
        <p>Beheer alle Gutenberg-blokken die beschikbaar zijn in uw thema.</p>

        <!-- Tabs -->
         <div class="" style="display: flex; justify-content: space-between;">
            <div class="tab-container" style="margin-top: 50px;">
                <div class="tab-item">
                    <a href="#" class="tab-link active" data-filter="all" aria-current="true">Alles (<?php echo (int) $all_total; ?>)</a>
                </div>
                <div class="tab-item">
                    <a href="#" class="tab-link" data-filter="active">Actief (<?php echo (int) $all_active; ?>)</a>
                </div>
                <div class="tab-item">
                    <a href="#" class="tab-link" data-filter="inactive">Inactief (<?php echo (int) $all_inactive; ?>)</a>
                </div>
            </div>

            <div class="search-container">
                <input type="text" id="block-search" placeholder="Zoek blokken..." style="margin-top: 20px; padding: 10px; width: 100%; max-width: 400px; box-sizing: border-box;">
            </div>
        </div>

        <form method="post" action="<?php echo esc_url(admin_url('options.php')); ?>">
            <?php settings_fields('madeit_blocks'); ?>

            <div class="container" style="margin-top:30px">
                <div style=" gap: 15px; display: grid; grid-template-columns: repeat(5, 1fr);">

                <?php foreach (madeit_group_blocks_by_category($blocks, 'madeit') as $category => $cat_blocks): ?>
                    <h2 style="-webkit-column-span: all; column-span: all; margin: 10px 0; grid-area: span 1 / span 5;">
                        <?php echo esc_html(madeit_category_label((string) $category)); ?> (<?php echo (int) count($cat_blocks); ?>)
                    </h2>

                    <?php foreach ($cat_blocks as $slug => $block): ?>
                        <div class="madeit-block-card" style="box-shadow: 0 0 6px #80808026;background: white;border-radius: 20px;min-height: 150px; break-inside: avoid;-webkit-column-break-inside: avoid;page-break-inside: avoid; padding: 20px;margin-bottom: 15px; position: relative;">
                            <?php if (($block['status'] ?? '') === 'new'): ?>
                                <span style="position:absolute; top: -10px; left: 30px; background: #ff0; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">Nieuw</span>
                            <?php elseif (($block['status'] ?? '') === 'update'): ?>
                                <span style="position:absolute; top: -10px; left: 30px; background: #0af; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">Update</span>
                            <?php endif; ?>

                            <div class="" style="display: flex; justify-content: space-between;">
                                <?php if (!empty($block['icon'])): ?>
                                    <?php echo $block['icon']; // raw svg ?>
                                <?php else: ?>
                                    <span class="dashicons dashicons-block-default"></span>
                                <?php endif; ?>

                                <label class="madeit-toggle" style="margin-top: 0;">
                                    <input
                                        class="madeit-block-toggle"
                                        type="checkbox"
                                        name="madeit_blocks_enabled[]"
                                        value="<?php echo esc_attr($slug); ?>"
                                        data-slug="<?php echo esc_attr($slug); ?>"
                                        data-scope="custom"
                                        <?php checked(!in_array($slug, madeit_blocks_disabled(), true)); ?>
                                    />
                                    <span class="madeit-toggle-slider" aria-hidden="true"></span>
                                    <span class="madeit-toggle-status"></span>
                                </label>
                            </div>
                            <br>
                            <h4 style="margin: 0.33em 0;"><strong><?php echo esc_html((string) ($block['title'] ?? $slug)); ?></strong></h4>
                            <p style="opacity: .8; margin-top: 0; margin-bottom: 0;"><?php echo esc_html((string) ($block['description'] ?? '')); ?></p>
                            <br>
                            
                        </div>
                    <?php endforeach; ?>
                <?php endforeach; ?>

                </div>
            </div>
            
        </form>

        <br><br>
        <hr>
        <h1>Other blocks</h1>
        <form method="post" action="<?php echo esc_url(admin_url('options.php')); ?>">
            <?php settings_fields('madeit_blocks'); ?>

            <div class="container" style="margin-top:50px">
                <div style=" gap: 15px; display: grid; grid-template-columns: repeat(5, 1fr);">

                <?php foreach (madeit_group_blocks_by_category($core_blocks, 'uncategorized') as $category => $cat_blocks): ?>
                    <h2 style="-webkit-column-span: all; column-span: all; margin: 50px 0 10px 0; grid-area: span 1 / span 5;">
                        <?php echo esc_html(madeit_category_label((string) $category)); ?> (<?php echo (int) count($cat_blocks); ?>)
                    </h2>

                    <?php foreach ($cat_blocks as $slug => $block): ?>
                        <div class="madeit-block-card" style="box-shadow: 0 0 6px #80808026;background: white;border-radius: 20px;min-height: 150px; break-inside: avoid;-webkit-column-break-inside: avoid;page-break-inside: avoid; padding: 20px; margin-bottom: 15px; position: relative;">
                            <div class="d-flex justify-content-between" style="display: flex; justify-content: space-between;">
                                <span class="madeit-core-icon" data-block-name="<?php echo esc_attr((string) ($block['name'] ?? ('core/' . $slug))); ?>">
                                    <?php $dashicon = madeit_dashicon_for_core_block_category((string) ($block['category'] ?? '')); ?>
                                    <span class="dashicons <?php echo esc_attr($dashicon); ?>"></span>
                                </span>

                                <label class="madeit-toggle" style="margin-top: 0;">
                                    <input
                                        class="madeit-block-toggle"
                                        type="checkbox"
                                        name="madeit_core_blocks_enabled[]"
                                        value="<?php echo esc_attr($slug); ?>"
                                        data-slug="<?php echo esc_attr($slug); ?>"
                                        data-scope="core"
                                        <?php checked(!in_array($slug, madeit_core_blocks_disabled(), true)); ?>
                                        <?php disabled(!madeit_can_manage_core_blocks()); ?>
                                    />
                                    <span class="madeit-toggle-slider" aria-hidden="true"></span>
                                    <span class="madeit-toggle-status"></span>
                                </label>
                            </div>
                            <br>
                            <div class="content">
                                <strong><?php echo esc_html((string) ($block['title'] ?? $slug)); ?></strong>
                                <br>
                                <?php echo esc_html((string) ($block['description'] ?? '')); ?>
                                <br>

                            </div>
                            
                        </div>
                    <?php endforeach; ?>
                <?php endforeach; ?>

                </div>
            </div>
        </form>

    </div>
    <?php
}

function madeit_blocks_enabled() {
    // Backwards-compatible helper: enabled = all custom blocks minus disabled.
    static $cache = null;
    if (is_array($cache)) {
        return $cache;
    }

    $all = madeit_custom_block_slugs();
    $disabled = madeit_blocks_disabled();
    $cache = array_values(array_diff($all, $disabled));
    return $cache;
}

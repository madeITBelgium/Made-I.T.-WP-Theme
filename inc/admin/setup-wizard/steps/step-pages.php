<?php
/**
 * MadeIt Setup Wizard - Step: Pages
 * Dit is de stap van de setup wizard waar gebruikers pagina's kunnen aanmaken en configureren, zoals de homepage, blogpagina, contactpagina, etc.
 * 
 * @package MadeIt
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

?>

<div class="madeit-setup-wizard-step madeit-setup-wizard-step-pages">

    <h1>Pagina's</h1>

    <p class="small">In deze stap kan je pagina's aanmaken en configureren, zoals de homepage, blogpagina, contactpagina, etc.</p>


    <?php
    $default_pages = [
        [
            'slug' => 'home',
            'enabled' => true,
            'title' => 'Home',
            'description' => 'Startpagina van je website.',
        ],
        [
            'slug' => 'blog',
            'enabled' => false,
            'title' => 'Blog',
            'description' => 'Overzicht van nieuwsberichten en artikels.',
        ],
        [
            'slug' => 'contact',
            'enabled' => false,
            'title' => 'Contact',
            'description' => 'Contactgegevens en formulier voor bezoekers.',
        ],
    ];

    $pages = apply_filters('madeit_setup_wizard_page_suggestions', $default_pages);
    if (!is_array($pages)) {
        $pages = $default_pages;
    }
    ?>
    <div class="settingsForm">
        <p>Welke pagina's moeten worden aangemaakt?</p>

        <p>
            <button id="madeit-generate-pages-ai" type="button" class="button button-secondary">Pagina's laten voorstellen door AI</button>
            <span id="madeit-generate-pages-ai-status" class="small" style="margin-left: 8px;"></span>
        </p>

        <div id="madeit-page-list" class="madeit-page-list">
            <?php foreach ($pages as $page) :
                $page_slug = isset($page['slug']) ? sanitize_key((string) $page['slug']) : '';
                $page_enabled = !empty($page['enabled']);
                $page_title = isset($page['title']) ? (string) $page['title'] : '';
                $page_description = isset($page['description']) ? (string) $page['description'] : '';

                if ($page_slug === '') {
                    continue;
                }
                ?>
                <div class="madeit-page-item">
                    <label class="madeit-page-toggle">
                        <input
                            type="checkbox"
                            name="pages[<?php echo esc_attr($page_slug); ?>][enabled]"
                            value="1"
                            <?php checked($page_enabled); ?>
                        >
                        <?php echo esc_html__('Aanmaken', 'madeit'); ?>
                    </label>

                    <input
                        type="text"
                        name="pages[<?php echo esc_attr($page_slug); ?>][title]"
                        value="<?php echo esc_attr($page_title); ?>"
                        placeholder="<?php echo esc_attr__('Titel', 'madeit'); ?>"
                    >

                    <textarea
                        name="pages[<?php echo esc_attr($page_slug); ?>][description]"
                        placeholder="<?php echo esc_attr__('Beschrijving', 'madeit'); ?>"
                        rows="2"
                    ><?php echo esc_textarea($page_description); ?></textarea>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="madeit-add-page-row">
            <input id="newPageTitle" type="text" placeholder="Titel van nieuwe pagina">
            <textarea id="newPageDescription" rows="2" placeholder="Beschrijving van nieuwe pagina"></textarea>
            <button id="addPageButton" type="button" class="button"><?php echo esc_html__('Pagina toevoegen', 'madeit'); ?></button>
        </div>
        

    </div>


    <div class="buttons">
        <a href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=finish')); ?>">Overslaan</a>
        <a class="button button-primary" data-save="1" href="<?php echo esc_url(admin_url('themes.php?page=madeit-setup-wizard&step=finish')); ?>">Instellingen Opslaan</a>
    </div>
</div>

<!-- script for add new pages -->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const pageList = document.getElementById('madeit-page-list');
        const titleInput = document.getElementById('newPageTitle');
        const descriptionInput = document.getElementById('newPageDescription');
        const addButton = document.getElementById('addPageButton');
        const aiButton = document.getElementById('madeit-generate-pages-ai');
        const aiStatus = document.getElementById('madeit-generate-pages-ai-status');
        const aiConfig = window.madeitSetupWizard || null;

        if (!pageList || !titleInput || !descriptionInput || !addButton) {
            return;
        }

        const slugify = function (value) {
            return value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
        };

        const getCurrentPages = function () {
            const pages = [];
            const rows = pageList.querySelectorAll('.madeit-page-item');

            rows.forEach(function (row) {
                const titleField = row.querySelector('input[name*="[title]"]');
                const descriptionField = row.querySelector('textarea[name*="[description]"]');
                const enabledField = row.querySelector('input[name*="[enabled]"]');

                if (!titleField || !enabledField || !enabledField.name) {
                    return;
                }

                const slugMatch = enabledField.name.match(/^pages\[([^\]]+)\]\[enabled\]$/);
                const slug = slugMatch && slugMatch[1] ? slugMatch[1] : '';
                const title = titleField.value ? String(titleField.value).trim() : '';

                if (!slug && !title) {
                    return;
                }

                pages.push({
                    slug: slug,
                    title: title,
                    description: descriptionField && descriptionField.value ? String(descriptionField.value).trim() : '',
                    enabled: enabledField.checked ? '1' : '0',
                });
            });

            return pages;
        };

        const appendPageItem = function (slug, title, description) {
            if (!slug || !title) {
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'madeit-page-item';

            const toggleLabel = document.createElement('label');
            toggleLabel.className = 'madeit-page-toggle';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'pages[' + slug + '][enabled]';
            checkbox.value = '1';
            checkbox.checked = true;

            toggleLabel.appendChild(checkbox);
            toggleLabel.appendChild(document.createTextNode('Aanmaken'));

            const titleField = document.createElement('input');
            titleField.type = 'text';
            titleField.name = 'pages[' + slug + '][title]';
            titleField.value = title;
            titleField.placeholder = 'Titel';

            const descriptionField = document.createElement('textarea');
            descriptionField.name = 'pages[' + slug + '][description]';
            descriptionField.placeholder = 'Beschrijving';
            descriptionField.rows = 2;
            descriptionField.value = description || '';

            wrapper.appendChild(toggleLabel);
            wrapper.appendChild(titleField);
            wrapper.appendChild(descriptionField);
            pageList.appendChild(wrapper);
        };

        const handleAddPage = function () {
            const title = titleInput.value.trim();
            const description = descriptionInput.value.trim();
            let slug = slugify(title);

            if (!title || !slug) {
                return;
            }

            const originalSlug = slug;
            let i = 2;
            while (document.querySelector('input[name="pages[' + slug + '][title]"]')) {
                slug = originalSlug + '-' + i;
                i++;
            }

            appendPageItem(slug, title, description);
            titleInput.value = '';
            descriptionInput.value = '';
            titleInput.focus();
        };

        addButton.addEventListener('click', handleAddPage);

        if (aiButton && aiConfig && aiConfig.ajaxUrl && aiConfig.generatePagesNonce) {
            aiButton.addEventListener('click', function () {
                aiButton.disabled = true;
                if (aiStatus) {
                    aiStatus.textContent = 'AI suggesties ophalen...';
                }

                const payload = new URLSearchParams({
                    action: 'madeit_setup_wizard_generate_pages',
                    nonce: aiConfig.generatePagesNonce,
                    existing_pages: JSON.stringify(getCurrentPages()),
                });

                fetch(aiConfig.ajaxUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    },
                    body: payload.toString(),
                })
                    .then(function (res) {
                        return res.json();
                    })
                    .then(function (res) {
                        if (!res || !res.success || !res.data || !Array.isArray(res.data.pages)) {
                            throw new Error('Geen geldige AI suggesties ontvangen.');
                        }

                        res.data.pages.forEach(function (page) {
                            if (!page || !page.title) {
                                return;
                            }

                            const generatedTitle = String(page.title).trim();
                            const generatedDescription = page.description ? String(page.description).trim() : '';
                            const generatedSlug = slugify(generatedTitle);

                            if (!generatedSlug) {
                                return;
                            }

                            if (document.querySelector('input[name="pages[' + generatedSlug + '][title]"]')) {
                                return;
                            }

                            let slug = generatedSlug;
                            const originalSlug = generatedSlug;
                            let i = 2;
                            while (document.querySelector('input[name="pages[' + slug + '][title]"]')) {
                                slug = originalSlug + '-' + i;
                                i++;
                            }

                            appendPageItem(slug, generatedTitle, generatedDescription);
                        });

                        if (aiStatus) {
                            aiStatus.textContent = 'AI suggesties toegevoegd.';
                        }
                    })
                    .catch(function (error) {
                        if (aiStatus) {
                            aiStatus.textContent = error && error.message ? error.message : 'AI suggesties ophalen mislukt.';
                        }
                    })
                    .finally(function () {
                        aiButton.disabled = false;
                    });
            });
        }

        titleInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleAddPage();
            }
        });
    });
</script>
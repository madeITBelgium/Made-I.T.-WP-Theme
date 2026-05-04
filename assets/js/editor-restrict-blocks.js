wp.domReady(function () {

    // const dynamicParents = ['madeit/block-content-column'];

    // // detecteer blocks waar inner blocks in kunnen
    // wp.blocks.getBlockTypes().forEach(function (blockType) {

    //     if (
    //         blockType?.supports?.innerBlocks ||   // sommige custom blocks
    //         blockType?.name === 'core/group' ||
    //         blockType?.name === 'core/columns' ||
    //         blockType?.name === 'core/column' ||
    //         blockType?.name === 'core/buttons' ||
    //         blockType?.name === 'core/button' ||
    //         blockType?.name === 'core/navigation' ||
    //         blockType?.name === 'madeit/block-card' ||
    //         blockType?.name === 'madeit/block-tabs'
    //     ) {
    //         dynamicParents.push(blockType.name);
    //     }

    // });

    // const skipBlocks = [
    //     'madeit/block-content',
    //     'madeit/block-content-column',
    //     'core/block',
    //     'core/template-part',
    //     'core/post-content'
    // ];

    // wp.blocks.getBlockTypes().forEach(function (blockType) {

    //     const name = blockType.name;
    //     const hasOwnParents = Array.isArray(blockType.parent) && blockType.parent.length > 0;

    //     if (skipBlocks.includes(name) || hasOwnParents) {
    //         return;
    //     }

    //     const newSettings = {
    //         ...blockType,
    //         parent: dynamicParents
    //     };

    //     wp.blocks.unregisterBlockType(name);
    //     wp.blocks.registerBlockType(name, newSettings);
    // });


    //? Insider niet tonen buiten container
    wp.data.subscribe(() => {

        const selected = wp.data.select('core/block-editor').getSelectedBlockClientId();
        if (!selected) return;

        const containerBlocks = [
            'madeit/block-content',
            'madeit/block-content-column'
        ];

        const isInside = (clientId) => {

            let current = wp.data.select('core/block-editor').getBlock(clientId);

            while (current) {
                if (containerBlocks.includes(current.name)) {
                    return true;
                }
                current = current.parent
                    ? wp.data.select('core/block-editor').getBlock(current.parent)
                    : null;
            }

            return false;
        };

        const inside = isInside(selected);

        document.body.classList.toggle('madeit-inside-container', inside);

    });


    //? Zorg dat we geen blokken kunnen toevoegen buiten de container
    let isProcessing = false;
    let isFixingOutsideBlocks = false;

    wp.data.subscribe(() => {

        if (window?.madeitIsRenderingBlockPreview) return;
        if (isProcessing || isFixingOutsideBlocks) return;

        const editorSelect = wp.data.select('core/block-editor');
        const editorDispatch = wp.data.dispatch('core/block-editor');

        // Root-level blocks die wél buiten de container mogen staan
        const allowedOutsideRootBlocks = [
            'madeit/block-content',
            'madeit/block-content-column',
            'core/cover',
            'core/spacer'
        ];

        const rootBlocks = editorSelect.getBlocks();
        const outsideRootBlocks = rootBlocks.filter((block) => !allowedOutsideRootBlocks.includes(block.name));

        // Als er root-level blocks buiten de container staan: zet ze veilig in een container.
        if (outsideRootBlocks.length) {
            isFixingOutsideBlocks = true;

            if (!document.querySelector('.madeit-outside-block-warning')) {
                const warning = document.createElement('div');
                warning.classList.add('madeit-outside-block-warning');
                warning.style = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #ffebe6;
                    color: #c00;
                    padding: 20px;
                    border: 1px solid #c00;
                    border-radius: 4px;
                    z-index: 9999;
                `;
                warning.textContent = 'Er werden blokken gedetecteerd buiten de container. Deze werden automatisch verplaatst naar binnen de container om verlies van content te voorkomen. Als je deze melding blijft zien, neem dan contact op met support@madeit.be.';
                document.body.appendChild(warning);
                // close button
                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Sluiten';
                closeBtn.style = `
                    margin-left: 20px;
                    padding: 5px 10px;
                    background-color: transparent;
                    border: none;
                    color: rgb(204, 0, 0);
                    border-radius: 4px;
                    cursor: pointer;
                    position: absolute;
                    right: 5px;
                    top: 5px;
                `;
                closeBtn.addEventListener('click', () => {
                    if (warning.parentNode) {
                        warning.parentNode.removeChild(warning);
                    }
                });
                warning.appendChild(closeBtn);
            }

            // Belangrijk: maak een NIEUWE container op de plaats waar blocks stonden.
            // We willen niets “bijplakken” in een bestaande container.
            const newRootBlocks = [];
            let pendingOutsideGroup = [];

            const flushPendingOutsideGroup = () => {
                if (!pendingOutsideGroup.length) return;

                // madeit/block-content laat enkel madeit/block-content-column toe als innerBlocks.
                // Daarom wrappen we deze outside root blocks in één column.
                const movedColumn = wp.blocks.createBlock(
                    'madeit/block-content-column',
                    { width: 12 },
                    pendingOutsideGroup
                );

                const containerBlock = wp.blocks.createBlock('madeit/block-content', {}, [movedColumn]);
                newRootBlocks.push(containerBlock);
                pendingOutsideGroup = [];
            };

            rootBlocks.forEach((block) => {
                const isAllowedOutside = allowedOutsideRootBlocks.includes(block.name);

                if (isAllowedOutside) {
                    // Sluit eerst een groep outside blocks af (als die er is)
                    flushPendingOutsideGroup();
                    newRootBlocks.push(block);
                } else {
                    // Deel van outside blocks group (root-level)
                    pendingOutsideGroup.push(block);
                }
            });

            // flush eventuele groep op het einde
            flushPendingOutsideGroup();

            editorDispatch.resetBlocks(newRootBlocks);

            setTimeout(() => {
                isFixingOutsideBlocks = false;
            }, 1);

            // Stop hier zodat er niks verwijderd wordt in dezelfde subscribe-run.
            return;
        }

    });


    //? Laat de block inserter standaard open (maar forceer het niet daarna)
    let hasAutoOpenedInserter = false;

    wp.data.subscribe(() => {

        if (hasAutoOpenedInserter) return;

        const editPostSelect = wp.data.select('core/edit-post');
        const editPostDispatch = wp.data.dispatch('core/edit-post');

        if (!editPostSelect || !editPostDispatch || typeof editPostSelect.isInserterOpened !== 'function') {
            return;
        }

        const isOpen = editPostSelect.isInserterOpened();

        if (!isOpen) {
            hasAutoOpenedInserter = true;
            editPostDispatch.setIsInserterOpened(true);
        } else {
            hasAutoOpenedInserter = true;
        }
    });
   




    //? Voeg een container block toe als de editor leeg is
    let hasRestored = false;

    wp.data.subscribe(() => {

        const blocks = wp.data.select('core/block-editor').getBlocks();

        const isEmpty =
            blocks.length === 0 ||
            (blocks.length === 1 &&
            blocks[0].name === 'core/paragraph' &&
            !blocks[0].attributes?.content?.trim());

        if (isEmpty && !hasRestored) {

            hasRestored = true;

            wp.data.dispatch('core/block-editor').insertBlocks(
                wp.blocks.parse(`
                <!-- wp:madeit/block-content {"containerPaddingOnRow":true,"overflow":"visible","flexDirection":"row","flexDirectionTablet":"column","flexDirectionMobile":"column","alignItems":"stretch","justifyContent":"flex-start","rowGap":20,"rowGapTablet":20,"rowGapMobile":20,"columnsCount":0,"flexWrap":"nowrap"} -->
                <div class="wp-block-madeit-block-content container madeit-block-content--frontend">
                    <div class="container">
                        <div class="row madeit-container-row rows-0"
                            data-madeit-dir="row"
                            data-madeit-dir-tablet="column"
                            data-madeit-dir-mobile="column">
                        </div>
                    </div>
                </div>
                <!-- /wp:madeit/block-content -->
                `)
            );
        }

        // reset flag zodra er weer content is
        if (!isEmpty) {
            hasRestored = false;
        }
    });

    //? Voeg een builder UI toe aan het laatste block
    wp.hooks.addFilter('editor.BlockListBlock', 'madeit/add-builder-ui', (BlockListBlock) => {
        return (props) => {
            const { createElement } = wp.element;
            const original = createElement(BlockListBlock, props);

            // enkel tonen bij laatste block
            const { useSelect } = wp.data;

            const isLast = useSelect((select) => {
                const blockOrder = select('core/block-editor').getBlockOrder(undefined); 
                return blockOrder.length === 0 || blockOrder[blockOrder.length - 1] === props.clientId;
            }, [props.clientId]);

            const isRootLevel = useSelect((select) => {
                return select('core/block-editor').getBlockRootClientId(props.clientId) === '';
            }, [props.clientId]);

            const isInQuery = useSelect((select) => {
                const parents = select('core/block-editor').getBlockParents(props.clientId);
                return parents.some(parentId => {
                    const block = select('core/block-editor').getBlock(parentId);
                    return block?.name === 'core/query' || block?.name === 'core/post-template';
                });
            }, [props.clientId]);

            // styling
            const styles = {
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'center',
                margin: '20px',
                padding: '60px 0px',
                textAlign: 'center',
                backgroundColor: 'hsla(0, 0%, 100%, .5)',
                border: '2px dashed #c3c3c3',
                gap: '20px',
            };

            const btnStyles = {
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#0073aa',
                color: '#fff',
            };

            // Tijdens preview-cards (BlockPreview) willen we geen builder UI injecteren.
            // Let op: dit mag NIET de builder in de echte editor uitschakelen.
            if (window?.madeitIsRenderingBlockPreview) {
                return original;
            }

            if (!isLast || !isRootLevel || isInQuery) {
                return original;
            }

            return createElement(
                wp.element.Fragment,
                null,
                original,
                createElement('div', { className: 'madeit-builder-bar', style: styles },

                    createElement('button', {
                        className: 'madeit-add-btn',
                        style: btnStyles,
                        onClick: () => {
                            wp.data.dispatch('core/block-editor').insertBlocks(
                                wp.blocks.createBlock('madeit/block-content')
                            );
                        }
                    }, '+ Container'),

                    createElement('button', {
                        className: 'madeit-template-btn',
                        style: btnStyles,
                        onClick: () => {
                            const modal = document.createElement('div');
                            modal.classList.add('madeitheek-modal');
                            modal.style = `
                                            position: fixed;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            background-color: rgba(0, 0, 0, 0.5);
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            z-index: 9999;
                                        `;

                            const templateContainer = document.createElement('div');
                            templateContainer.classList.add('madeitheek-container');

                            const mountedPreviewNodes = [];

                            const cleanup = () => {
                                if (wp?.element?.unmountComponentAtNode) {
                                    mountedPreviewNodes.forEach((node) => {
                                        try {
                                            wp.element.unmountComponentAtNode(node);
                                        } catch (e) { }
                                    });
                                }
                            };

                            const removeModal = () => {
                                cleanup();
                                if (modal?.parentNode) {
                                    document.body.removeChild(modal);
                                }
                            };

                            // Header: Madeitheek + tabs + sluiten
                            const header = document.createElement('div');
                            header.classList.add('madeitheek-header');
                            header.style = 'display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom: 12px;';

                            const headerTitle = document.createElement('div');
                            headerTitle.textContent = 'Madeitheek';
                            headerTitle.style = 'font-size: 18px; font-weight: 600;';

                            const tabs = document.createElement('div');
                            tabs.classList.add('madeitheek-tabs');
                            tabs.style = 'display:flex; align-items:center; gap:8px; flex-wrap:wrap;';

                            const closeBtn = document.createElement('button');
                            closeBtn.type = 'button';
                            closeBtn.textContent = 'Sluiten';
                            closeBtn.style = 'padding: 8px 12px; cursor: pointer; border: 1px solid #c3c3c3; background: #fff; border-radius: 4px;';
                            closeBtn.addEventListener('click', () => removeModal());

                            header.appendChild(headerTitle);
                            header.appendChild(tabs);
                            header.appendChild(closeBtn);
                            const status = document.createElement('div');
                            status.classList.add('madeitheek-status');

                            const loaderImg = document.createElement('img');
                            loaderImg.classList.add('madeitheek-loader');
                            loaderImg.alt = '';
                            loaderImg.setAttribute('aria-hidden', 'true');
                            if (window?.madeitEditorRestrict?.loaderUrl) {
                                loaderImg.src = window.madeitEditorRestrict.loaderUrl;
                            }

                            const statusText = document.createElement('span');
                            statusText.classList.add('madeitheek-status-text');

                            status.appendChild(loaderImg);
                            status.appendChild(statusText);

                            const setStatus = (text, isLoading) => {
                                statusText.textContent = text || '';
                                status.classList.toggle('is-loading', !!isLoading);
                            };

                            setStatus('Laden…', true);

                            const list = document.createElement('div');
                            list.classList.add('madeitheek-list');
                            list.style = 'columns: 3;';

                            let activeTab = 'blocks';
                            const tabButtons = {};

                            const getBlockPreviewComponent = () => {
                                return wp?.blockEditor?.BlockPreview || wp?.blockEditor?.__experimentalBlockPreview || null;
                            };

                            const renderBlockPreview = (mountNode, blocks, viewportWidth) => {
                                const BlockPreview = getBlockPreviewComponent();
                                if (!BlockPreview || !wp?.element?.render) {
                                    return;
                                }

                                try {
                                    window.madeitIsRenderingBlockPreview = true;
                                    wp.element.render(
                                        wp.element.createElement(BlockPreview, {
                                            blocks,
                                            viewportWidth: viewportWidth || 1200,
                                        }),
                                        mountNode
                                    );
                                    mountedPreviewNodes.push(mountNode);
                                } catch (e) { }
                                finally {
                                    window.madeitIsRenderingBlockPreview = false;
                                }
                            };

                            const createItemCard = (label, content, viewportWidth) => {
                                const btn = document.createElement('button');
                                btn.type = 'button';
                                btn.classList.add('madeit-template-item');

                                const labelEl = document.createElement('div');
                                labelEl.textContent = label;
                                labelEl.classList.add('madeitheek-item-label');
                                labelEl.style = 'font-weight: 600;';

                                const previewMount = document.createElement('div');
                                previewMount.classList.add('madeitheek-item-preview');
                                previewMount.style = 'border: 1px solid #dcdcde; border-radius: 4px; padding: 8px; background: #f6f7f7; overflow: hidden;';

                                btn.appendChild(labelEl);

                                if (content && typeof content === 'string' && content.trim()) {
                                    btn.appendChild(previewMount);

                                    try {
                                        const blocks = wp?.blocks?.parse ? wp.blocks.parse(content) : [];
                                        if (Array.isArray(blocks) && blocks.length) {
                                            renderBlockPreview(previewMount, blocks, viewportWidth);
                                        } else {
                                            previewMount.textContent = '(Geen preview beschikbaar)';
                                            previewMount.style = previewMount.style + ' color: #50575e;';
                                        }
                                    } catch (e) {
                                        previewMount.textContent = '(Geen preview beschikbaar)';
                                        previewMount.style = previewMount.style + ' color: #50575e;';
                                    }
                                } else {
                                    const noContent = document.createElement('div');
                                    noContent.textContent = '(Geen content)';
                                    noContent.style = 'color: #50575e;';
                                    btn.appendChild(noContent);
                                }

                                btn.addEventListener('click', () => {
                                    insertAndClose(content);
                                });

                                return btn;
                            };

                            const insertAndClose = (content) => {
                                if (!content || typeof content !== 'string' || !content.trim()) {
                                    return;
                                }
                                wp.data.dispatch('core/block-editor').insertBlocks(
                                    wp.blocks.parse(content)
                                );
                                removeModal();
                            };

                            const getActiveThemeInfo = async () => {
                                try {
                                    const coreDispatch = wp.data?.dispatch?.('core');
                                    if (coreDispatch?.getCurrentTheme) {
                                        await coreDispatch.getCurrentTheme();
                                    }
                                    const current = wp.data?.select?.('core')?.getCurrentTheme?.();
                                    if (current?.stylesheet) {
                                        return {
                                            stylesheet: current.stylesheet,
                                            template: current.template || null,
                                        };
                                    }
                                } catch (e) { }

                                try {
                                    const themes = await wp.apiFetch({ path: '/wp/v2/themes?status=active&per_page=1' });
                                    if (Array.isArray(themes) && themes[0]?.stylesheet) {
                                        return {
                                            stylesheet: themes[0].stylesheet,
                                            template: themes[0].template || null,
                                        };
                                    }
                                } catch (e) { }

                                return {
                                    stylesheet: null,
                                    template: null,
                                };
                            };

                            const render = async () => {
                                setStatus('Laden…', true);
                                cleanup();
                                mountedPreviewNodes.length = 0;
                                list.innerHTML = '';

                                const { stylesheet, template } = await getActiveThemeInfo();

                                const data = {
                                    themePatterns: [],
                                    pages: [],
                                    templates: [],
                                    userPatterns: [],
                                };

                                try {
                                    const [templates, patterns, syncedPatterns] = await Promise.all([
                                        wp.apiFetch({ path: '/wp/v2/templates?per_page=100&context=edit' }).catch(() => []),
                                        // block-patterns endpoint ondersteunt geen per_page/context params.
                                        wp.apiFetch({ path: '/wp/v2/block-patterns/patterns' }).catch(() => []),
                                        wp.apiFetch({ path: '/wp/v2/blocks?per_page=100&context=edit' }).catch(() => []),
                                    ]);

                                    // Templates (wp_template)
                                    const templatesFiltered = Array.isArray(templates)
                                        ? templates.filter(t => {
                                            if (!stylesheet) return true;
                                            return t?.theme === stylesheet;
                                        })
                                        : [];

                                    data.templates = templatesFiltered.map(t => ({
                                        label: `[Template] ${t?.title?.rendered || t?.title?.raw || t?.slug || t?.id}`,
                                        content: t?.content?.raw || t?.content?.rendered || t?.content,
                                    }));

                                    // Theme patterns (uit child-theme /patterns)
                                    const activeThemeSlugs = [stylesheet, template].filter(Boolean);

                                    const themePatterns = Array.isArray(patterns)
                                        ? patterns.filter(p => {
                                            if (typeof p?.name !== 'string') {
                                                return false;
                                            }

                                            if (p?.source === 'theme') {
                                                return true;
                                            }

                                            if (!activeThemeSlugs.length) {
                                                // Als we de actieve stylesheet niet kennen: toon enkel patterns met een "theme-like" prefix (slug/...).
                                                return p.name.includes('/');
                                            }

                                            // In deze codebase komen theme patterns soms zonder `source: 'theme'` terug.
                                            return activeThemeSlugs.some((slug) => p.name.startsWith(slug + '/'));
                                        })
                                        : [];

                                    data.themePatterns = themePatterns.map(p => ({
                                        label: `${p?.title || p?.name}`,
                                        content: p?.content,
                                        viewportWidth: p?.viewport_width,
                                        categories: p?.categories,
                                        postTypes: p?.post_types,
                                    }));

                                    // User patterns (synced patterns / reusable blocks)
                                    const syncedFiltered = Array.isArray(syncedPatterns)
                                        ? syncedPatterns.filter(b => {
                                            // endpoint levert alleen wp_block items; we tonen ze als “user patterns”
                                            // content/raw is enkel beschikbaar in edit context
                                            return !!(b?.content?.raw || b?.content) && (b?.status !== 'trash');
                                        })
                                        : [];

                                    data.userPatterns = syncedFiltered.map(b => ({
                                        label: `${b?.title?.raw || b?.slug || b?.id}`,
                                        content: b?.content?.raw || b?.content,
                                    }));

                                    // Vooraf ingestelde pagina's: neem enkel patterns die expliciet als "page" bedoeld zijn.
                                    // Dit voorkomt dat we alle bestaande pagina's van de website tonen.
                                    const presetPages = data.themePatterns.filter((p) => {
                                        const categories = Array.isArray(p.categories)
                                            ? p.categories.map((category) => String(category).toLowerCase())
                                            : [];
                                        const postTypes = Array.isArray(p.postTypes)
                                            ? p.postTypes.map((postType) => String(postType).toLowerCase())
                                            : [];
                                        return categories.includes('pages') || categories.includes('page') || postTypes.includes('page');
                                    });
                                    data.pages = presetPages.map(p => ({
                                        label: p.label,
                                        content: p.content,
                                        viewportWidth: p.viewportWidth,
                                    }));

                                    const renderActiveTab = () => {
                                        cleanup();
                                        mountedPreviewNodes.length = 0;
                                        list.innerHTML = '';

                                        let items = [];
                                        if (activeTab === 'blocks') {
                                            items = data.themePatterns;
                                        } else if (activeTab === 'pages') {
                                            items = data.pages;
                                        } else if (activeTab === 'templates') {
                                            items = [...data.templates, ...data.userPatterns];
                                        }

                                        items.forEach(item => {
                                            list.appendChild(createItemCard(item.label, item.content, item.viewportWidth));
                                        });

                                        if (!items.length) {
                                            setStatus('Geen items gevonden.', false);
                                        } else {
                                            setStatus('', false);
                                        }
                                    };

                                    const setTab = (tab) => {
                                        activeTab = tab;
                                        Object.keys(tabButtons).forEach((key) => {
                                            tabButtons[key].classList.toggle('is-active', key === tab);
                                        });
                                        renderActiveTab();
                                    };

                                    const makeTabButton = (key, label) => {
                                        const b = document.createElement('button');
                                        b.type = 'button';
                                        b.textContent = label;
                                        b.classList.add('madeitheek-tab');
                                        b.addEventListener('click', () => setTab(key));
                                        tabButtons[key] = b;
                                        return b;
                                    };

                                    tabs.appendChild(makeTabButton('blocks', 'Blokken'));
                                    tabs.appendChild(makeTabButton('pages', "Pagina's"));
                                    tabs.appendChild(makeTabButton('templates', 'Templates'));

                                    // init
                                    setTab(activeTab);

                                    if (!data.templates.length && !data.themePatterns.length && !data.userPatterns.length && !data.pages.length) {
                                        setStatus('Geen items gevonden (of onvoldoende rechten).', false);
                                    }
                                } catch (error) {
                                    setStatus('Kon templates/patterns niet laden.', false);
                                }
                            };

                            templateContainer.appendChild(header);
                            templateContainer.appendChild(status);
                            templateContainer.appendChild(list);
                            modal.appendChild(templateContainer);
                            document.body.appendChild(modal);

                            // Close when clicking outside.
                            modal.addEventListener('click', () => {
                                removeModal();
                            });
                            templateContainer.addEventListener('click', (e) => e.stopPropagation());

                            render();

                        }
                    }, '📁 Template')

                )
            );

        };
    });
});
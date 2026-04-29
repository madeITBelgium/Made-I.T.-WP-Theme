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

    wp.data.subscribe(() => {

        if (isProcessing) return;

        const blocks = wp.data.select('core/block-editor').getBlocks();

        const containerBlocks = [
            'madeit/block-content',
            'madeit/block-content-column',
            'core/cover',
            'core/spacer'
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

        const invalidBlocks = blocks.filter(b =>
            !isInside(b.clientId) &&
            b.name !== 'madeit/block-content'
        );

        if (!invalidBlocks.length) return;

        isProcessing = true;

        invalidBlocks.forEach(b => {
            wp.data.dispatch('core/block-editor').removeBlock(b.clientId);
        });

        setTimeout(() => {
            isProcessing = false;
        }, 0);

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
                        className: 'madeit-template-btn d-none',
                        style: btnStyles,
                        onClick: () => {
                            // create a modal with the templates
                            const modal = document.createElement('div');
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
                            templateContainer.style = `
                                            width: 80%;
                                            max-width: 600px;
                                            background-color: #fff;
                                            padding: 20px;
                                            border-radius: 4px;
                                            text-align: center;
                                        `;
                            templateContainer.innerText = 'Templates coming soon...';

                            modal.appendChild(templateContainer);
                            document.body.appendChild(modal);

                            // close the modal when clicking outside the container
                            modal.addEventListener('click', (e) => {
                                if (e.target === modal) {
                                    document.body.removeChild(modal);

                                } else {
                                    // insert template blocks here
                                    wp.data.dispatch('core/block-editor').insertBlocks();
                                    document.body.removeChild(modal);
                                }
                            });

                        }
                    }, '📁 Template')

                )
            );

        };
    });
});
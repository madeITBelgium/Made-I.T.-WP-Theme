wp.domReady(function () {

    const dynamicParents = ['madeit/block-content-column'];

    // detecteer blocks waar inner blocks in kunnen
    wp.blocks.getBlockTypes().forEach(function (blockType) {

        if (
            blockType?.supports?.innerBlocks ||   // sommige custom blocks
            blockType?.name === 'core/group' ||
            blockType?.name === 'core/columns' ||
            blockType?.name === 'core/column' ||
            blockType?.name === 'core/buttons' ||
            blockType?.name === 'core/button' ||
            blockType?.name === 'core/navigation' ||
            blockType?.name === 'madeit/block-card' ||
            blockType?.name === 'madeit/block-tabs'
        ) {
            dynamicParents.push(blockType.name);
        }

    });

    const skipBlocks = [
        'madeit/block-content',
        'madeit/block-content-column',
        'core/block',
        'core/template-part',
        'core/post-content'
    ];

    wp.blocks.getBlockTypes().forEach(function (blockType) {

        const name = blockType.name;
        const hasOwnParents = Array.isArray(blockType.parent) && blockType.parent.length > 0;

        if (skipBlocks.includes(name) || hasOwnParents) {
            return;
        }

        const newSettings = {
            ...blockType,
            parent: dynamicParents
        };

        wp.blocks.unregisterBlockType(name);
        wp.blocks.registerBlockType(name, newSettings);
    });

    wp.hooks.addFilter('editor.BlockListBlock', 'madeit/add-builder-ui', (BlockListBlock) => {
        return (props) => {
            const { createElement } = wp.element;
            const original = createElement(BlockListBlock, props);

            // enkel tonen bij laatste block
            const blocks = wp.data.select('core/block-editor').getBlocks();
            const isLast = blocks.length === 0 || blocks[blocks.length - 1]?.clientId === props.clientId;

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

            if (!isLast) {
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
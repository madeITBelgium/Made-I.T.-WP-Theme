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
            blockType?.name === 'core/navigation'
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

        if (skipBlocks.includes(name)) {
            return;
        }

        const newSettings = {
            ...blockType,
            parent: dynamicParents
        };

        wp.blocks.unregisterBlockType(name);
        wp.blocks.registerBlockType(name, newSettings);

    });

});
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const deprecated = [
    {
        // Oude versie: inline stijlen op outer + inner div
        attributes: {
            color: { type: 'string', default: '#000000' },
            top:    { type: 'number', default: 50 },
            right:  { type: 'number', default: 50 },
            bottom: { type: 'number', default: 50 },
            left:   { type: 'number', default: 50 },
        },

        save( { attributes } ) {
            const { color, top, right, bottom, left } = attributes;

            const wrapperMargins = {
                marginTop:    top    < 0 ? `${ -top }px`    : `${ top }px`,
                marginRight:  right  < 0 ? `${ -right }px`  : `${ right }px`,
                marginBottom: bottom < 0 ? `${ -bottom }px` : `${ bottom }px`,
                marginLeft:   left   < 0 ? `${ -left }px`   : `${ left }px`,
            };

            const blockProps = useBlockProps.save( {
                style: {
                    backgroundColor: color,
                    ...wrapperMargins,
                },
            } );

            return (
                <div { ...blockProps }>
                    <div
                        style={ {
                            marginTop:    `${ top }px`,
                            marginRight:  `${ right }px`,
                            marginBottom: `${ bottom }px`,
                            marginLeft:   `${ left }px`,
                        } }
                    >
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },

        migrate( attributes ) {
            // Geen attribuut-wijzigingen nodig, zelfde structuur
            return attributes;
        },
    },
];

export default deprecated;
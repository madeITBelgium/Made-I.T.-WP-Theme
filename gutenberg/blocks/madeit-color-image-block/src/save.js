import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
    const { color, top, right, bottom, left } = attributes;

    const wrapperMargins = {
        marginTop: top < 0 ? `${ -top }px` : undefined,
        marginRight: right < 0 ? `${ -right }px` : undefined,
        marginBottom: bottom < 0 ? `${ -bottom }px` : undefined,
        marginLeft: left < 0 ? `${ -left }px` : undefined,
    };

    const blockProps = useBlockProps.save( {
        style: {
            // backgroundColor: color,
            // ...wrapperMargins,
        },
    } );

    return (
        <div { ...blockProps }>
            <div
                className="madeit-color-image__inner"
                style={ {
                    '--margin-top': `${ top }px`,
                    '--margin-right': `${ right }px`,
                    '--margin-bottom': `${ bottom }px`,
                    '--margin-left': `${ left }px`,
                    '--background-color': color,
                } }
            >
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
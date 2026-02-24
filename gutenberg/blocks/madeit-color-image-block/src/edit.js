import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';
import {
    InspectorControls,
    InnerBlocks,
    PanelColorSettings,
    useBlockProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

const ALLOWED_BLOCKS = [ 'core/image' ];
const TEMPLATE = [ [ 'core/image', {} ] ];

export default function Edit( { attributes, setAttributes } ) {
    const { color, top, right, bottom, left } = attributes;

    const wrapperMargins = {
        marginTop: top < 0 ? `${ -top }px` : undefined,
        marginRight: right < 0 ? `${ -right }px` : undefined,
        marginBottom: bottom < 0 ? `${ -bottom }px` : undefined,
        marginLeft: left < 0 ? `${ -left }px` : undefined,
    };

    const blockProps = useBlockProps( {
        style: {
            // backgroundColor: color,
            // ...wrapperMargins,
        },
    } );

    // Get height and width of the image to set the height and width of the wrapper div, so the background color is visible.
    // const imageAttributes = useSelect( ( select ) => {
    //     const { getBlocks } = select( 'core/block-editor' );
    //     const blocks = getBlocks( props.clientId );
    //     if ( blocks.length > 0 && blocks[ 0 ].name === 'core/image' ) {
    //         return blocks[ 0 ].attributes;
    //     }
    //     return null;
    // } );

    return (
        <Fragment>
            <InspectorControls>
                <RangeControl
                    label={ __( 'Top' ) }
                    value={ top }
                    min={ -100 }
                    max={ 100 }
                    onChange={ ( value ) => setAttributes( { top: parseInt( value, 10 ) } ) }
                />
                <RangeControl
                    label={ __( 'Right' ) }
                    value={ right }
                    min={ -100 }
                    max={ 100 }
                    onChange={ ( value ) => setAttributes( { right: parseInt( value, 10 ) } ) }
                />
                <RangeControl
                    label={ __( 'Bottom' ) }
                    value={ bottom }
                    min={ -100 }
                    max={ 100 }
                    onChange={ ( value ) => setAttributes( { bottom: parseInt( value, 10 ) } ) }
                />
                <RangeControl
                    label={ __( 'Left' ) }
                    value={ left }
                    min={ -100 }
                    max={ 100 }
                    onChange={ ( value ) => setAttributes( { left: parseInt( value, 10 ) } ) }
                />

                <PanelColorSettings
                    title={ __( 'Color Settings' ) }
                    initialOpen={ false }
                    colorSettings={ [
                        {
                            value: color,
                            onChange: ( value ) => setAttributes( { color: value } ),
                            label: __( 'Background Color' ),
                        },
                    ] }
                />
            </InspectorControls>

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
                <InnerBlocks
                    template={ TEMPLATE }
                    templateLock="all"
                    allowedBlocks={ ALLOWED_BLOCKS }
                />
                </div>
            </div>
        </Fragment>
    );
}
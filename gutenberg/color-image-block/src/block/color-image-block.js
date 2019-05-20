/* global esversion: 6 */

//  Import CSS.
import './style.scss';
import './editor.scss';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const {
    withState,
    RangeControl,
    SelectControl,
    TextControl,
} = wp.components

export const { Fragment, PanelBody } = wp.element;

export const {
    InspectorControls,
    BlockControls,
    ContrastChecker,
    InnerBlocks,
    PanelColorSettings
} = wp.editor


export const ALLOWED_BLOCKS = [ 'core/image' ];

export const TEMPLATE = [
    [ 'core/image', { } ], 
];

export const edit = ( props ) => {
    const {
        setAttributes,
        className
    } = props

    const {
        color,
        top,
        right,
        bottom,
        left
    } = props.attributes
    
    const fallbackBackgroundColor = '#FFFFFF';
    
    var classes = "";
    if(className !== undefined) {
        classes = className;
    }
    
    return [
        <InspectorControls key='inspector'>
            <RangeControl
                label={ __( 'Top' ) }
                value={ top }
                min='-100'
                max='100'
                onChange={ ( value ) => setAttributes( { top: parseInt(value) } ) }
            />
            <RangeControl
                label={ __( 'Right' ) }
                value={ right }
                min='-100'
                max='100'
                onChange={ ( value ) => setAttributes( { right: parseInt(value) } ) }
            />
            <RangeControl
                label={ __( 'Bottom' ) }
                value={ bottom }
                min='-100'
                max='100'
                onChange={ ( value ) => setAttributes( { bottom: parseInt(value) } ) }
            />
            <RangeControl
                label={ __( 'Left' ) }
                value={ left }
                min='-100'
                max='100'
                onChange={ ( value ) => setAttributes( { left: parseInt(value) } ) }
            />
            <PanelColorSettings
                title={ __( 'Color Settings' ) }
                initialOpen={ false }
                colorSettings={ [
                    {
                        value: color,
                        onChange:  ( value ) => setAttributes( { color: value } ) ,
                        label: __( 'Background Color' ),
                    }
                ] }
                >
            </PanelColorSettings>
        </InspectorControls>
        ,
        <div
            className={ classes }
            style = {{
                backgroundColor: color
            }}>
            <div
                style = {{
                    marginTop: (top - 32) + 'px',
                    marginBottom: (bottom - 32) + 'px',
                    marginLeft: (left - 42) + 'px',
                    marginRight: (right - 42) + 'px',
                }}>
                <InnerBlocks 
                    template={ TEMPLATE }
                    templateLock="all"
                    allowedBlocks={ ALLOWED_BLOCKS } />
            </div>
        </div>
    ]
}

export const save = ( props ) => {
    const {
        color,
        top,
        right,
        bottom,
        left
    } = props.attributes;
    
    const {
        className
    } = props
    
    
    var classes = "";
    if(className !== undefined) {
        classes = ' ' + className;
    }
    
    var marginLeft = 0;
    var marginRight = 0;
    var marginTop = 0;
    var marginBottom = 0;
    
    if(top < 0) {
        marginTop = -top;
    }
    if(left < 0) {
        marginLeft = -left;
    }
    if(right < 0) {
        marginRight = -right;
    }
    if(bottom < 0) {
        marginBottom = -bottom;
    }
    
    return (
        <div
            className={ classes }
            style = {{
                backgroundColor: color,
                marginTop: marginTop + 'px',
                marginBottom: marginBottom + 'px',
                marginLeft: marginLeft + 'px',
                marginRight: marginRight + 'px',
            }}>
            <div
                style = {{
                    marginTop: top + 'px',
                    marginBottom: bottom + 'px',
                    marginLeft: left + 'px',
                    marginRight: right + 'px',
                }}>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}

registerBlockType( 'madeit/block-color-image', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Color Image Block - Made IT' ), // Block title.
    icon: 'format-image', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'image' ),
        __( 'Made IT' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
        color: {
            type: 'string',
            default: '#000000',
        },
        top: {
            type: 'number',
            default: 50,
        },
        right: {
            type: 'number',
            default: 50,
        },
        bottom: {
            type: 'number',
            default: 50,
        },
        left: {
            type: 'number',
            default: 50,
        },
    },
    
    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} )
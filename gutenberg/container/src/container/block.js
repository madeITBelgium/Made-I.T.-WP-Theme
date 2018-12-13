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


export const ALLOWED_BLOCKS = [ 'madeit/block-row' ];
export const CONTAINER_TEMPLATE = [ [ 'madeit/block-row', {}, [
    [ 'madeit/block-column', {}, [
        [ 'core/paragraph', { placeholder: 'Enter left content...' } ],
    ] ],
    [ 'madeit/block-column', {}, [
        [ 'core/paragraph', { placeholder: 'Enter right content...' } ],
    ] ],
] ] ];

export const edit = ( props ) => {
    const {
        setAttributes,
        className
    } = props

    const {
        textColor,
        color,
        size,
        margin,
        padding
    } = props.attributes
    
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';

    const containerSizes = [
        { value: 'container', label: __( 'Boxed' ) },
        { value: 'container-fluid', label: __( 'Full width ' ) },
    ]

    return [
        <InspectorControls key='inspector'>
            <SelectControl
                label={ __( 'Size' ) }
                value={ size }
                options={ containerSizes.map( ( { value, label } ) => ( {
                    value: value,
                    label: label,
                } ) ) }
                onChange={ ( newSize ) => { setAttributes( { size: newSize } ) } }
            />
            <RangeControl
                label={ __( 'Margin' ) }
                value={ margin }
                min='0'
                max='100'
                onChange={ ( value ) => setAttributes( { margin: value } ) }
            />
            <RangeControl
                label={ __( 'Padding' ) }
                value={ padding }
                min='0'
                max='100'
                onChange={ ( value ) => setAttributes( { padding: value } ) }
            />
            <PanelColorSettings
                title={ __( 'Color Settings' ) }
                initialOpen={ false }
                colorSettings={ [
                    {
                        value: color,
                        onChange:  ( value ) => setAttributes( { color: value } ) ,
                        label: __( 'Background Color' ),
                    },
                    {
                        value: textColor,
                        onChange: ( value ) => setAttributes( { textColor: value } ) ,
                        label: __( 'Text Color' ),
                    },
                ] }
                >
                <ContrastChecker
                    { ...{
                        textColor: textColor,
                        backgroundColor: color,
                        fallbackTextColor,
                        fallbackBackgroundColor,
                    } }
                />
            </PanelColorSettings>
        </InspectorControls>
        ,
        <div
            className={ size + ' ' + className }
            style = {{
                color: textColor,
                backgroundColor: color,
                paddingTop: padding + 'px',
                paddingBottom: padding + 'px',
                marginTop: margin + 'px',
                marginBottom: margin + 'px',
            }}>
            <wp.editor.InnerBlocks
                /*template={ CONTAINER_TEMPLATE }
                templateLock={ false }
                allowedBlocks={ ALLOWED_BLOCKS }*/ />
        </div>
    ]
}

export const save = ( props ) => {
    const {
        textColor,
        color,
        size,
        margin,
        padding
    } = props.attributes;
    
    const {
        className
    } = props
    
    return (
        <div
            className={ size + ' ' + className }
            style = {{
                    color: textColor,
                    backgroundColor: color,
                    paddingTop: padding + 'px',
                    paddingBottom: padding + 'px',
                    marginTop: margin + 'px',
                    marginBottom: margin + 'px',
                }}
            >
            <wp.editor.InnerBlocks.Content />
        </div>
    );
}

registerBlockType( 'madeit/block-container', {
    title: __( 'container - Made IT Block' ),
    icon: 'editor-justify', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'container' ),
        __( 'Made IT' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
        textColor: {
            type: 'string',
        },
        color: {
            type: 'string',
        },
        size: {
            type: 'string',
            default: 'container',
        },
        margin: {
            type: 'number',
            default: 0,
        },
        padding: {
            type: 'number',
            default: 0,
        }
    },
    
    getEditWrapperProps( attributes ) {
        const { size } = attributes;
        if ( 'container-fluid' === size ) {
            return { 'data-align': 'wide' };
        }
        return { 'data-align': 'container' };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} )

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


export const ALLOWED_BLOCKS = [ 'madeit/block-column' ];

export const edit = ( props ) => {
    const {
        isSelected,
        setAttributes,
        className
    } = props

    const {
        textColor,
        color,
        margin,
        padding
    } = props.attributes
    
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';
    
    return [
        <InspectorControls key='inspector'>
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
            className={ className }
            style = {{
                color: textColor,
                backgroundColor: color,
                paddingTop: padding + 'px',
                paddingBottom: padding + 'px',
                marginTop: margin + 'px',
                marginBottom: margin + 'px',
            }}>
            <wp.editor.InnerBlocks 
                /*template={ ALLOWED_BLOCKS }
                templateLock={ false }
                allowedBlocks={ ALLOWED_BLOCKS }*/ />
        </div>
    ]
}

export const save = ( props ) => {
    const {
        textColor,
        color,
        margin,
        padding
    } = props.attributes;
    
    const {
        className
    } = props;
    
    return (
        <div
            className={ className }
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

registerBlockType( 'madeit/block-row', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Row - Made IT Block' ), // Block title.
    icon: 'align-center', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'row' ),
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
        return { 'data-row': 'row' };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} )
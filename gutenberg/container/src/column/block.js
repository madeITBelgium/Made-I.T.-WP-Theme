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


export const edit = ( props ) => {
    const {
        setAttributes,
        className
    } = props

    const {
        xs,
        sm,
        md,
        lg,
        xl,
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
                label={ __( 'XS size - Smartphone' ) }
                value={ xs }
                min='1'
                max='12'
                onChange={ ( value ) => setAttributes( { xs: value } ) }
            />
            <RangeControl
                label={ __( 'SM size - Small devices (landscape phones)' ) }
                value={ sm }
                min='1'
                max='12'
                onChange={ ( value ) => setAttributes( { sm: value } ) }
            />
            <RangeControl
                label={ __( 'MD size - Medium devices (tablets)' ) }
                value={ md }
                min='1'
                max='12'
                onChange={ ( value ) => setAttributes( { md: value } ) }
            />
            <RangeControl
                label={ __( 'LG size - Large devices (desktops)' ) }
                value={ lg }
                min='1'
                max='12'
                onChange={ ( value ) => setAttributes( { lg: value } ) }
            />
            <RangeControl
                label={ __( 'LG size - Extra large devices (large desktops)' ) }
                value={ xl }
                min='1'
                max='12'
                onChange={ ( value ) => setAttributes( { xl: value } ) }
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
            className={ 'col-' + xs + ' col-sm-' + sm + ' col-md-' + md + ' col-lg-' + lg + ' col-xl-' + xl + ' ' + className }
            style = {{
                color: textColor,
                backgroundColor: color,
                paddingTop: padding + 'px',
                paddingBottom: padding + 'px',
                marginTop: margin + 'px',
                marginBottom: margin + 'px',
            }}>
            <wp.editor.InnerBlocks /* allowedBlocks={ ALLOWED_BLOCKS } */ />
        </div>
    ]
}

export const save = ( props ) => {
    const {
        xs,
        sm,
        md,
        lg,
        xl,
        textColor,
        color,
        margin,
        padding
    } = props.attributes;
    
    const {
        className
    } = props
    
    return (
        <div
            className={ 'col-' + xs + ' col-sm-' + sm + ' col-md-' + md + ' col-lg-' + lg + ' col-xl-' + xl + ' ' + className }
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

registerBlockType( 'madeit/block-column', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Column - Made IT Block' ), // Block title.
    icon: 'align-center', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'column' ),
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
        },
        xs: {
            type: 'number',
            default: 12,
        },
        sm: {
            type: 'number',
            default: 12,
        },
        md: {
            type: 'number',
            default: 6,
        },
        lg: {
            type: 'number',
            default: 6,
        },
        xl: {
            type: 'number',
            default: 6,
        },
    },
    
    getEditWrapperProps( attributes ) {
        return {
            'data-column-xs': attributes.xs,
            'data-column-sm': attributes.sm,
            'data-column-md': attributes.md,
            'data-column-lg': attributes.lg,
            'data-column-xl': attributes.xl
        };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} )
/* global esversion: 6 */

//  Import CSS.
import './style.scss';
import './editor.scss';

import times from 'lodash/times';
import memoize from 'memize';

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


export const ALLOWED_BLOCKS = [ 'madeit/block-column-simple' ];

export const getColumnsTemplate = memoize( ( columns ) => {
    var colsm = 12;
    var colmd = Math.floor(12 / columns);
    var collg = Math.floor(12 / columns);
    
	return times( columns, () => [ 'madeit/block-column-simple', { sm: colsm, md: colmd, lg: collg} ] );
} );

export const edit = ( props ) => {
    const {
        setAttributes,
        className
    } = props

    const {
        textColor,
        color,
        margin,
        padding,
        columns
    } = props.attributes
    
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';
    
    var columnValues = [];
    for(var i = 0; i < 100; i++) {
        columnValues.push({value: i, label: i});
    }
    
    return [
        <InspectorControls key='inspector'>
            <SelectControl
                label={ __( 'Columns' ) }
                value={ columns }
                options={ columnValues.map(({ value, label }) => ({
                    value: value,
                    label: label,
                })) }
                onChange={ ( value ) => { setAttributes( { columns: parseInt(value) } ) } }
            />
            <RangeControl
                label={ __( 'Margin' ) }
                value={ margin }
                min='0'
                max='100'
                onChange={ ( value ) => setAttributes( { margin: parseInt(value) } ) }
            />
            <RangeControl
                label={ __( 'Padding' ) }
                value={ padding }
                min='0'
                max='100'
                onChange={ ( value ) => setAttributes( { padding: parseInt(value) } ) }
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
            <InnerBlocks 
                template={ getColumnsTemplate( columns ) }
                templateLock="all"
                allowedBlocks={ ALLOWED_BLOCKS } />
        </div>
    ]
}

export const save = ( props ) => {
    const {
        textColor,
        color,
        margin,
        padding,
        columns
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
            <InnerBlocks.Content />
        </div>
    );
}

registerBlockType( 'madeit/block-row-simple', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Row - Simple' ), // Block title.
    icon: 'align-center', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    parent: [ 'madeit/block-container-simple' ],
    keywords: [
        __( 'row-simple' ),
        __( 'Made IT' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
        columns: {
            type: 'number',
            default: 2,
        },
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
            default: 30,
        }
    },
    
    getEditWrapperProps( attributes ) {
        return { 'data-row-simple': 'row-simple' };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
    
        
    deprecated: [
        {
            attributes: {
                columns: {
                    type: 'number',
                    default: 2,
                },
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
                    default: 30,
                }
            },

            migrate: function( attributes ) {
                return {
                    columns: parseInt(attributes.columns),
                    textColor: attributes.textColor,
                    color: attributes.color,
                    margin: parseInt(attributes.margin),
                    padding: parseInt(attributes.padding),
                };
            },

            save: function( props ) {
               const {
                    textColor,
                    color,
                    margin,
                    padding,
                    columns
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
                        <InnerBlocks.Content />
                    </div>
                );
            },
        }
    ]
} )
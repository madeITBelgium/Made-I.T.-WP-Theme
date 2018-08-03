//  Import CSS.
import './style.scss';
import './editor.scss';

import { times } from 'lodash/times';
import memoize from 'memize';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const {
    withState,
    PanelColor,
    RangeControl,
    TextControl,
    SelectControl
} = wp.components

export const {
    InspectorControls,
    BlockControls,
    ColorPalette,
} = wp.editor.InspectorControls ? wp.editor : wp.blocks


export const ALLOWED_BLOCKS = [ 'madeit/block-column-simple' ];

export const getColumnsTemplate = memoize( ( columns ) => {
    var colsm = 12;
    var colmd = Math.floor(12 / columns);
    var collg = Math.floor(12 / columns);
    
	return times( columns, () => [ 'madeit/block-column-simple', { sm: colsm, md: colmd, lg: collg} ] );
} );

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
        padding,
        columns
    } = props.attributes
    
    
    var columnValues = [];
    for(var i = 0; i < 100; i++) {
        columnValues.push({value: i, label: i});
    }
    
    return [
        <div>
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
                    template={ getColumnsTemplate( columns ) }
                    templateLock="all"
                    allowedBlocks={ ALLOWED_BLOCKS } />
            </div>
            {
                isSelected &&
                <InspectorControls key='inspector'>
                    <SelectControl
                        label={ __( 'Columns' ) }
                        value={ columns }
                        options={ columnValues.map(({ value, label }) => ({
                            value: value,
                            label: label,
                        })) }
                        onChange={ ( value ) => { setAttributes( { columns: value } ) } }
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
                    <PanelColor
                        title={ __( 'Text Color' ) }
                        colorValue={ textColor }
                        initialOpen={ false }
                        >
                        <ColorPalette
                            value={ textColor }
                            onChange={ ( colorValue ) => setAttributes( { textColor: colorValue } ) }
                        />
                    </PanelColor>
                    <PanelColor
                        title={ __( 'Background Color' ) }
                        colorValue={ color }
                        initialOpen={ false }
                        >
                        <ColorPalette
                            value={ color }
                            onChange={ ( colorValue ) => setAttributes( { color: colorValue } ) }
                        />
                    </PanelColor>
                </InspectorControls>
            }
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
            <wp.editor.InnerBlocks.Content />
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
} )
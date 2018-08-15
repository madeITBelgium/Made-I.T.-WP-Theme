//  Import CSS.
import './style.scss';
import './editor.scss';


import times from 'lodash/times';
import memoize from 'memize';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const {
    withState,
    PanelColor,
    RangeControl,
    SelectControl,
    TextControl,
} = wp.components

export const {
    InspectorControls,
    BlockControls,
    ColorPalette,
} = wp.editor.InspectorControls ? wp.editor : wp.blocks


export const ALLOWED_BLOCKS = [ 'madeit/block-row-simple' ];

export const getRowsTemplate = memoize( ( columns ) => {
	return times( columns, () => [ 'madeit/block-row-simple' ] );
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
        size,
        margin,
        padding,
        rows
    } = props.attributes

    const containerSizes = [
        { value: 'container', label: __( 'Boxed' ) },
        { value: 'container-fluid', label: __( 'Full width ' ) },
    ]
    
    
    var rowValues = [];
    for(var i = 0; i < 100; i++) {
        rowValues.push({value: i, label: i});
    }

    return [
        <div>
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
                    template={ getRowsTemplate( rows ) }
                    templateLock="all"
                    allowedBlocks={ ALLOWED_BLOCKS } />
            </div>
            {
                isSelected &&
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
                    <SelectControl
                        label={ __( 'Rows' ) }
                        value={ rows }
                        options={ rowValues.map(({ value, label }) => ({
                            value: value,
                            label: label,
                        })) }
                        onChange={ ( value ) => { setAttributes( { rows: value } ) } }
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

registerBlockType( 'madeit/block-container-simple', {
    title: __( 'Container - Simple' ),
    icon: 'editor-justify', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'container-simple' ),
        __( 'Made IT' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
        rows: {
            type:'number',
            default: 1,
        },
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
            default: 30,
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

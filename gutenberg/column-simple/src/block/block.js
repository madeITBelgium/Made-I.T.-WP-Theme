//  Import CSS.
import './style.scss';
import './editor.scss';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const {
    withState,
    PanelColor,
    RangeControl,
    TextControl,
    SelectControl,
} = wp.components

export const {
    InspectorControls,
    BlockControls,
    ColorPalette,
} = wp.editor.InspectorControls ? wp.editor : wp.blocks



export const edit = ( props ) => {
    const {
        isSelected,
        setAttributes,
        className
    } = props

    const {
        type,
        sm,
        md,
        lg,
        textColor,
        color,
        margin,
        padding
    } = props.attributes
    
    
    const columnTypes = [
        { value: 'manual', label: __( 'Manueel' ) },
        { value: 'auto', label: __( 'Automatisch' ) },
        { value: 'auto-sm', label: __( 'Small device wide, Medium and large automatic' ) },
        { value: 'auto-md', label: __( 'Small and medium wide, large automatic' ) },
    ];
    
    
    const widths = [
        { value: '12', label: __( 'Full width' ) },
        { value: '11', label: __( '11/12de' ) },
        { value: '10', label: __( '10/12de' ) },
        { value: '9', label: __( '9/12de' ) },
        { value: '8', label: __( '8/12de' ) },
        { value: '7', label: __( '7/12de' ) },
        { value: '6', label: __( '6/12de' ) },
        { value: '5', label: __( '5/12de' ) },
        { value: '4', label: __( '4/12de' ) },
        { value: '3', label: __( '3/12de' ) },
        { value: '2', label: __( '2/12de' ) },
        { value: '1', label: __( '1/12de' ) },
    ];
    
    var classes = "";
    if('auto' === type) {
        classes = 'col';
    }
    else if('auto-sm' === type) {
        classes = 'col-12 col-md';
    }
    else if('auto-md' === type) {
        classes = 'col-12 col-lg';
    }
    if(className !== undefined) {
        classes += ' ' + className;
    }
    return [
        <div>
            <div
                className={ classes }
                style = {{
                    color: textColor,
                    backgroundColor: color,
                    paddingTop: padding + 'px',
                    paddingBottom: padding + 'px',
                    marginTop: margin + 'px',
                    marginBottom: margin + 'px',
                }}>
                <wp.editor.InnerBlocks templateLock={ false } />
            </div>
            {
                isSelected &&
                <InspectorControls key='inspector'>
                    <SelectControl
                        label={ __( 'Type' ) }
                        value={ type }
                        options={ columnTypes.map(({ value, label }) => ({
                            value: value,
                            label: label,
                        })) }
                        onChange={ ( newType ) => { setAttributes( { type: newType } ) } }
                    />
                    {
                        'manual' === type &&
                        <SelectControl
                            label={ __( 'Small devices (Smartphones, tablets)' ) }
                            value={ sm }
                            options={ widths.map(({ value, label }) => ({
                                value: value,
                                label: label,
                            })) }
                            onChange={ ( value ) => { setAttributes( { sm: value } ) } }
                        />
                    }
                    {
                        'manual' === type &&
                        <SelectControl
                            label={ __( 'Medium devices (tablets)' ) }
                            value={ md }
                            options={ widths.map(({ value, label }) => ({
                                value: value,
                                label: label,
                            })) }
                            onChange={ ( value ) => { setAttributes( { md: value } ) } }
                        />
                    }
                    {
                        'manual' === type &&
                        <SelectControl
                            label={ __( 'Large devices (Laptops, desktops)' ) }
                            value={ lg }
                            options={ widths.map(({ value, label }) => ({
                                value: value,
                                label: label,
                            })) }
                            onChange={ ( value ) => { setAttributes( { lg: value } ) } }
                        />
                    }
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
        type,
        sm,
        md,
        lg,
        textColor,
        color,
        margin,
        padding
    } = props.attributes;
    
    const {
        className
    } = props
    
    
    var classes = "";
    if('auto' === type) {
        classes = 'col';
    }
    else if('auto-sm' === type) {
        classes = 'col-12 col-md';
    }
    else if('auto-md' === type) {
        classes = 'col-12 col-lg';
    }
    if(className !== undefined) {
        classes += ' ' + className;
    }
    
    return (
        <div
            className={ classes }
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

registerBlockType( 'madeit/block-column-simple', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Column - Simple' ), // Block title.
    icon: 'align-center', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    parent: [ 'madeit/block-row-simple' ],
    keywords: [
        __( 'column' ),
        __( 'Made IT' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
        type: {
            type: 'string',
            default: 'auto-sm'
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
            default: 0,
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
    },
    
    getEditWrapperProps( attributes ) {
        var sm = attributes.sm;
        var md = attributes.md;
        var lg = attributes.lg;
        
        if('auto' === attributes.type) {
            sm = 'auto';
            md = 'auto';
            lg = 'auto';
        }
        else if('auto-sm' === attributes.type) {
            sm = '12';
            md = 'auto';
            lg = 'auto';
        }
        else if('auto-md' === attributes.type) {
            sm = '12';
            md = '12';
            lg = 'auto';
        }
        
        return {
            'data-column-xs': sm,
            'data-column-md': md,
            'data-column-lg': lg
        };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} )
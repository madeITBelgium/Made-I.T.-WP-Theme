/* global esversion: 6 */

//  Import CSS.
import './style.scss';
import './editor.scss';

import times from 'lodash/times';
import memoize from 'memize';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const { TextControl } = wp.components

export const {
    InspectorControls,
    BlockControls,
    RichText,
} = wp.editor

export const ALLOWED_BLOCKS = [ 'madeit/block-tabs-title', 'madeit/block-tabs-content' ];

export const getTabsTemplate = memoize( ( tabs ) => {
    var content = [
        ['madeit/block-tabs-titles', {aantaltabs: tabs}, times( tabs, (i) => [ 'madeit/block-tabs-title', {tabid: i} ] ) ],
        ['madeit/block-tabs-contents', {aantaltabs: tabs}, times( tabs, (i) => [ 'madeit/block-tabs-content', {tabid: i} ] ) ],
    ];
    return content;
} );

export const edit = ( props ) => {
    const {
        isSelected,
        setAttributes,
        className,
        focus,
        setFocus,
    } = props

    const {
        aantaltabs
    } = props.attributes
    
    return [
        <div>
            <wp.editor.InnerBlocks
                    template={ getTabsTemplate( aantaltabs ) }
                    templateLock="all"
                    allowedBlocks={ ALLOWED_BLOCKS } />
            {
                isSelected &&
                <InspectorControls key='inspector'>
                    <TextControl
                        label={ __( 'Aantal tabs' ) }
                        value={ aantaltabs }
                        type='number'
                        onChange={ ( value ) => setAttributes( { aantaltabs: parseInt(value) } ) }
                    />
                </InspectorControls>
            }
        </div>
    ];
}

export const save = ( props ) => {
    const {
        aantaltabs,
    } = props.attributes;
    
    const {
        className
    } = props
    
    return (
        <div className={ className }>
            <wp.editor.InnerBlocks.Content />
        </div>
    );
}

registerBlockType( 'madeit/block-tabs', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Tabs - Made IT Block' ), // Block title.
    icon: 'editor-kitchensink', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'tabs' ),
        __( 'Made IT' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
        aantaltabs: {
            type: 'number',
            default: 3,
        },
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
    
    deprecated: [
        {
            attributes: {
                aantaltabs: {
                    type: 'number',
                    default: '3',
                },
            },

            migrate: function( attributes ) {
                return {
                    aantaltabs: parseInt(attributes.aantaltabs)
                };
            },

            save: function( props ) {
                const {
                    aantaltabs,
                } = props.attributes;

                const {
                    className
                } = props

                return (
                    <div className={ className }>
                        <wp.editor.InnerBlocks.Content />
                    </div>
                );
            },
        }
    ]
} )
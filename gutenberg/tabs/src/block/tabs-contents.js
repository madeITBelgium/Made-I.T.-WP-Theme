/* global esversion: 6 */

//  Import CSS.
import './style.scss';
import './editor.scss';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const { TextControl } = wp.components

export const {
    InspectorControls,
    BlockControls,
    RichText,
    InnerBlocks
} = wp.editor

export const ALLOWED_BLOCKS = [ 'madeit/block-tabs-content' ];

export const edit = ( props ) => {
    const {
        isSelected,
        setAttributes,
        className,
    } = props

    const {
        aantaltabs
    } = props.attributes
    
    return [
        <div>
            <InnerBlocks
                templateLock="all"
                allowedBlocks={ ALLOWED_BLOCKS } />
        </div>
    ];
}

export const save = ( props ) => {
    const {
        aantaltabs,
    } = props.attributes;
    
    const {
        className
    } = props;
    
    var classN = className !== undefined ? className : '';
    
    return (
        <div className={ 'tab-content ' + classN }>
            <InnerBlocks.Content />
        </div>
    );
}

registerBlockType( 'madeit/block-tabs-contents', {
    title: __( 'Tab content list' ),
    icon: 'editor-kitchensink',
    category: 'common',
    parent: ['madeit/block-tabs'],
    keywords: [],

    attributes: {
        aantaltabs: {
            type: 'number',
            default: 3,
        },
    },

    edit: edit,

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
                } = props;

                var classN = className !== undefined ? className : '';

                return (
                    <div className={ 'tab-content ' + classN }>
                        <InnerBlocks.Content />
                    </div>
                );
            },
        }
    ]
} )
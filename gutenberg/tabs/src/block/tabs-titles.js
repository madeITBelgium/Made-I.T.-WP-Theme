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
} = wp.editor

export const ALLOWED_BLOCKS = [ 'madeit/block-tabs-title' ];

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
            <wp.editor.InnerBlocks
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
    } = props
    
    return (
        <div className={ className }>
            <ul class="nav nav-tabs" role="tablist">
                <wp.editor.InnerBlocks.Content />
            </ul>
        </div>
    );
}

registerBlockType( 'madeit/block-tabs-titles', {
    title: __( 'Tab title list' ),
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
    
    getEditWrapperProps( attributes ) {
        return {
            'data-tab-titles': 'true',
        };
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
                } = props

                return (
                    <div className={ className }>
                        <ul class="nav nav-tabs" role="tablist">
                            <wp.editor.InnerBlocks.Content />
                        </ul>
                    </div>
                );
            },
        }
    ]
} )
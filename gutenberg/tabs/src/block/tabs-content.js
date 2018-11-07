//  Import CSS.
import './style.scss';
import './editor.scss';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const { TextControl } = wp.components

export const {
    BlockControls,
    InnerBlocks,
} = wp.editor.InspectorControls ? wp.editor : wp.blocks


export const edit = ( props ) => {
    const {
        isSelected,
        setAttributes,
        className,
        placeholder
    } = props

    const {
        tabid
    } = props.attributes
    
    return [
        <div>
        <h2>{ __('Content tab ' + (parseInt(tabid) + 1)) }</h2>
            <InnerBlocks templateLock={false} />
        <hr />
        </div>
    ];
}

export const save = ( props ) => {
    var tabid = props.attributes.tabid;
    
    const {
        className
    } = props
    
    var classN = className !== undefined ? className : '';
    classN += tabid == 0 ? ' show active' : '';
    
    return (
        <div className={ 'tab-pane fade ' + classN }
        role="tabpanel"
        id={tabid}
        aria-labelledby={ tabid + '-tab'}>
            <InnerBlocks.Content />
        </div>
    );
}

registerBlockType( 'madeit/block-tabs-content', {
    title: __( 'Tab content' ),
    icon: 'editor-kitchensink',
    category: 'common',
    parent: ['madeit/block-tabs-contents'],
    keywords: [],

    attributes: {
        tabid: {
            type: 'number'
        },
    },
    
    edit: edit,
    
    save: save,
    
    deprecated: [
        {
            attributes: {
                tabid: {
                    type: 'string'
                },
            },

            migrate: function( attributes ) {
                return {
                    tabid: parseInt(attributes.tabid),
                };
            },

            save: function( props ) {
                var tabid = props.attributes.tabid;
    
                const {
                    className
                } = props

                var classN = className !== undefined ? className : '';
                classN += tabid == 0 ? ' show active' : '';

                return (
                    <div className={ 'tab-pane fade ' + classN }
                    role="tabpanel"
                    id={tabid}
                    aria-labelledby={ tabid + '-tab'}>
                        <InnerBlocks.Content />
                    </div>
                );
            },
        },
    ]
} )
/* global esversion: 6 */

//  Import CSS.
import './style.scss';
import './editor.scss';

export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const { TextControl } = wp.components

export const {
    BlockControls,
    RichText,
} = wp.editor.InspectorControls ? wp.editor : wp.blocks


export const edit = ( props ) => {
    const {
        isSelected,
        setAttributes,
        className,
        placeholder
    } = props

    const {
        content,
    } = props.attributes
    
    return [
        <div>
            <RichText
                tagName="a"
                className={ className }
                value={ content }
                onChange={ ( nextContent ) => {
                    setAttributes( {
                        content: nextContent,
                    } );
                } }
                placeholder={ placeholder || __( 'Add tab title' ) }
            />
        </div>
    ];
}

export const save = ( props ) => {
    const {
        tabid,
        content
    } = props.attributes;
    
    const {
        className
    } = props
    
    var classN = className !== undefined ? className : '';
    var active = tabid == 0 ? 'active' : '';
    
    return (
        <li className={ 'nav-item ' + classN }>
            <RichText.Content
                tagName="a"
                className={'nav-link ' + active} 
                id={ 'tab-' + tabid}
                data-toggle="tab"
                href={'#' + tabid }
                role="tab"
                aria-controls={ tabid }
                aria-selected="true"
                value={ content }
            />
        </li>
    );
}

registerBlockType( 'madeit/block-tabs-title', {
    title: __( 'Tab title' ),
    icon: 'editor-kitchensink',
    category: 'common',
    parent: ['madeit/block-tabs-titles'],
    keywords: [],

    attributes: {
        tabid: {
            type: 'number',
            default: 0
        },
        content: {
            source: 'html',
            selector: 'a',
            default: [],
        },
    },
    
    
    getEditWrapperProps( attributes ) {
        return {
            'data-tab-title': 'true',
        };
    },
    
    deprecated: [
        {
            save: function( props ) {
                const {
                    aantaltabs,
                    tabid,
                    content
                } = props.attributes;

                const {
                    className
                } = props

                var classN = className !== undefined ? className : '';
                var active = tabid == 0 ? 'active' : '';

                return (
                    <li className={ 'nav-item ' + classN }>
                        <RichText.Content
                            tagName="a"
                            className={'nav-link ' + active} 
                            id={ 'tab-' + tabid}
                            href={'#' + tabid }
                            role="tab"
                            value={ content }
                        />
                    </li>
                );
            },
        },
        {
            attributes: {
                tabid: {
                    type: 'string',
                    default: 0
                },
                content: {
                    type: 'array',
                    source: 'children',
                    selector: 'a',
                    default: [],
                }
            },

            migrate: function( attributes ) {
                return {
                    tabid: parseInt(attributes.tabid),
                    content: attributes.content,
                };
            },

            save: function( props ) {
                const {
                    tabid,
                    content
                } = props.attributes;
                
                var tabnr = tabid;
                
                const {
                    className
                } = props

                var classN = className !== undefined ? className : '';
                var active = tabnr == 0 ? 'active' : '';

                return (
                    <li className={ 'nav-item ' + classN }>
                        <RichText.Content
                            tagName="a"
                            className={'nav-link ' + active} 
                            id={ 'tab-' + tabnr}
                            data-toggle="tab"
                            href={'#' + tabnr }
                            role="tab"
                            aria-controls={ tabnr }
                            aria-selected="true"
                            value={ content }
                        />
                    </li>
                );
            },
        },
    ],
    
    edit: edit,
    
    save: save,
} )
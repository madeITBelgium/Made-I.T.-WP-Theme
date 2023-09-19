/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';
import classnames from 'classnames';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './../block.json';
import variations from './variations';
import icon from './icon';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata, {
    title: __( 'Content by Made I.T.' ), // Block title.
	icon, 
	category: 'madeit',
	keywords: [
		__( 'content — Made I.T.' ),
		__( 'columns' ),
		__( 'Made I.T.' ),
	],
    
    variations,
    
    supports: {
        html: false,
    },

    attributes: {
        verticalAlignment: {
            type: "string"
        },
        containerBackgroundColor: {
            type: 'string',
        },
        customContainerBackgroundColor: {
            type: 'string',
        },
        size: {
            type: 'string',
            default: 'container',
        },
        containerMargin: {
            type: 'object'
        },
        containerPadding: {
            type: 'object'
        },
        rowMargin: {
            type: 'object'
        },
        rowPadding: {
            type: 'object'
        }
    },
    
    getEditWrapperProps( attributes ) {
        const { size } = attributes;
        if ( 'container-fluid' === size || 'container-content-boxed' === size) {
            return { 'data-align': 'full' };
        }
        return { 'data-align': 'container' };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,

    deprecated: [
        {

            save: function( props ) {
                const {
                    verticalAlignment,
                    containerBackgroundColor,
                    customContainerBackgroundColor,
                    size,
                    rowBackgroundColor,
                    rowTextColor,
                    customRowBackgroundColor,
                    customRowTextColor,
                    containerMargin,
                    containerPadding,
                    rowMargin,
                    rowPadding,
                } = props.attributes;
                
                const {
                    className
                } = props
                
                const containerBackgroundColorClass = containerBackgroundColor ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;
                const rowBackgroundColorClass = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
                const rowTextColorClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;
                
                var classes = className;
                var classesChild = '';
                
            
                console.log(size);
                
                var defaultSize = size;
                if(defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
                    defaultSize = 'container';
                }
                
                console.log(defaultSize);
                
                classes = classnames( classes, {
                    [ `container` ]: 'container' === defaultSize,
                    [ `container-fluid` ]: 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
                } );
                
                if(defaultSize !== 'container-content-boxed') {
                    classes = classnames( classes, {
                        [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && defaultSize !== 'container-content-boxed',
                    } );
                }
                
                classesChild = classnames( classesChild, {
                    [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && defaultSize === 'container-content-boxed',
                    [ `container` ]: 'container' === defaultSize || 'container-content-boxed' === defaultSize,
                    [ `container-fluid` ]: 'container-fluid' === defaultSize,
                } );
                
                classes = classnames(classes, {
                    'has-text-color': rowTextColorClass,
                    'has-background': containerBackgroundColorClass,
                    [ containerBackgroundColorClass ]: containerBackgroundColorClass,
                    [ rowTextColorClass ]: rowTextColorClass,
                } );
                
                var style = {
                    backgroundColor: containerBackgroundColorClass ? undefined : customContainerBackgroundColor,
                };
                
                if(containerMargin !== undefined && containerMargin.top !== undefined) {
                    style.marginTop = containerMargin.top;
                }
                if(containerMargin !== undefined && containerMargin.bottom !== undefined) {
                    style.marginBottom = containerMargin.bottom;
                }
                if(containerPadding !== undefined && containerPadding.top !== undefined ) {
                    style.paddingTop = containerPadding.top;
                }
                if(containerPadding !== undefined && containerPadding.bottom !== undefined) {
                    style.paddingBottom = containerPadding.bottom;
                }
                if(containerPadding !== undefined && containerPadding.left !== undefined) {
                    style.paddingLeft = containerPadding.left;
                }
                if(containerPadding !== undefined && containerPadding.right !== undefined) {
                    style.paddingRight = containerPadding.right;
                }
                
                var styleChild = {};
                if(defaultSize === 'container-content-boxed') {
                    classesChild = classnames(classesChild, {
                        'has-text-color': rowTextColor !== undefined,
                        'has-background': rowBackgroundColor !== undefined,
                        [ rowBackgroundColorClass ]: rowBackgroundColor !== undefined,
                        [ rowTextColorClass ]: rowTextColor !== undefined,
                    } );
                    
                    styleChild = {
                        backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
                        color: rowTextColorClass ? undefined : rowTextColorClass
                    };
            
                    if(rowMargin !== undefined && rowMargin.top !== undefined) {
                        style.marginTop = rowMargin.top;
                    }
                    if(rowMargin !== undefined && rowMargin.bottom !== undefined) {
                        style.marginBottom = rowMargin.bottom;
                    }
                    if(rowPadding !== undefined && rowPadding.top !== undefined ) {
                        style.paddingTop = rowPadding.top;
                    }
                    if(rowPadding !== undefined && rowPadding.bottom !== undefined) {
                        style.paddingBottom = rowPadding.bottom;
                    }
                    if(rowPadding !== undefined && rowPadding.left !== undefined) {
                        style.paddingLeft = rowPadding.left;
                    }
                    if(rowPadding !== undefined && rowPadding.right !== undefined) {
                        style.paddingRight = rowPadding.right;
                    }
                }
                else {
                    style.color = rowTextColorClass ? undefined : rowTextColorClass;
                }
                
                const blockProps = useBlockProps.save( {
                    className: classes,
                    style: style,
                });
                
                if(size === 'container-content-boxed') {
                    return (
                        <div { ...blockProps }>
                            <div className="row">
                                <div className="col">
                                    <div className={ classesChild }
                                        style = {styleChild}>
                                        <div className="row">
                                            <InnerBlocks.Content />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                else {
                    return (
                        <div { ...blockProps }>
                            <div class="row">
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                }
            },
        },
        {
            supports: {
                html: false,
            },

            attributes: {
                verticalAlignment: {
                    type: "string"
                },
                containerBackgroundColor: {
                    type: 'string',
                },
                customContainerBackgroundColor: {
                    type: 'string',
                },
                size: {
                    type: 'string',
                    default: 'container',
                },
                containerMarginBottom: {
                    type: 'number',
                    default: 0
                },
                containerMarginTop: {
                    type: 'number',
                    default: 0
                },
                containerPaddingTop: {
                    type: 'number',
                    default: 0
                },
                containerPaddingBottom: {
                    type: 'number',
                    default: 0
                },
                containerPaddingLeft: {
                    type: 'number',
                    default: 0
                },
                containerPaddingRight: {
                    type: 'number',
                    default: 0
                },
                rowBackgroundColor: {
                    type: 'string',
                },
                customRowBackgroundColor: {
                    type: 'string',
                },
                rowTextColor: {
                    type: 'string',
                },
                customRowTextColor: {
                    type: 'string',
                },
                rowMarginBottom: {
                    type: 'number',
                    default: 0
                },
                rowMarginTop: {
                    type: 'number',
                    default: 0
                },
                rowPaddingTop: {
                    type: 'number',
                    default: 0
                },
                rowPaddingBottom: {
                    type: 'number',
                    default: 0
                },
                rowPaddingLeft: {
                    type: 'number',
                    default: 0
                },
                rowPaddingRight: {
                    type: 'number',
                    default: 0
                },
            },

            migrate( attributes ) {
                return {
                    containerPadding: {
                        top: attributes.containerPaddingTop !== null && attributes.containerPaddingTop !== undefined ? (attributes.containerPaddingTop + 'px') : undefined,
                        bottom: attributes.containerPaddingBottom !== null && attributes.containerPaddingBottom !== undefined ? (attributes.containerPaddingBottom + 'px') : undefined,
                        left: attributes.containerPaddingLeft !== null && attributes.containerPaddingLeft !== undefined ? (attributes.containerPaddingLeft + 'px') : undefined,
                        right: attributes.containerPaddingRight !== null && attributes.containerPaddingRight !== undefined ? (attributes.containerPaddingRight + 'px') : undefined,
                    },
                    containerMargin: {
                        top: attributes.containerMarginTop !== null && attributes.containerMarginTop !== undefined ? (attributes.containerMarginTop + 'px') : undefined,
                        bottom: attributes.containerMarginBottom !== null && attributes.containerMarginBottom !== undefined ? (attributes.containerMarginBottom + 'px') : undefined,
                        left: undefined,
                        right: undefined,
                    },
                    rowPadding: {
                        top: attributes.rowPaddingTop !== null && attributes.rowPaddingTop !== undefined ? (attributes.rowPaddingTop + 'px') : undefined,
                        bottom: attributes.rowPaddingBottom !== null && attributes.rowPaddingBottom !== undefined ? (attributes.rowPaddingBottom + 'px') : undefined,
                        left: attributes.rowPaddingLeft !== null && attributes.rowPaddingLeft !== undefined ? (attributes.rowPaddingLeft + 'px') : undefined,
                        right: attributes.rowPaddingRight !== null && attributes.rowPaddingRight !== undefined ? (attributes.rowPaddingRight + 'px') : undefined,
                    },
                    rowMargin: {
                        top: attributes.rowMarginTop !== null && attributes.rowMarginTop !== undefined ? (attributes.rowMarginTop + 'px') : undefined,
                        bottom: attributes.rowMarginBottom !== null && attributes.rowMarginBottom !== undefined ? (attributes.rowMarginBottom + 'px') : undefined,
                        left: undefined,
                        right: undefined,
                    },
                    size: attributes.size,
                    verticalAlignment: attributes.verticalAlignment,
                    containerBackgroundColor: attributes.containerBackgroundColor,
                    customContainerBackgroundColor: attributes.customContainerBackgroundColor
                };
            },

            save: function( props ) {
                const {
                    verticalAlignment,
                    containerBackgroundColor,
                    customContainerBackgroundColor,
                    size,
                    containerMarginTop,
                    containerMarginBottom,
                    containerPaddingTop,
                    containerPaddingBottom,
                    containerPaddingLeft,
                    containerPaddingRight,
                    rowMarginTop,
                    rowMarginBottom,
                    rowPaddingTop,
                    rowPaddingBottom,
                    rowPaddingLeft,
                    rowPaddingRight,
                    rowBackgroundColor,
                    rowTextColor,
                    customRowBackgroundColor,
                    customRowTextColor,
                } = props.attributes;
                
                const {
                    className
                } = props
                
                const containerBackgroundColorClass = containerBackgroundColor ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;
                const rowBackgroundColorClass = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
                const rowTextColorClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;
                
                var classes = className;
                var classesChild = '';
                
                classes = classnames( classes, {
                    [ `container` ]: 'container' === size,
                    [ `container-fluid` ]: 'container-fluid' === size || 'container-content-boxed' === size,
                } );
                
                if(size !== 'container-content-boxed') {
                    classes = classnames( classes, {
                        [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && size !== 'container-content-boxed',
                    } );
                }
                
                classesChild = classnames( classesChild, {
                    [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && size === 'container-content-boxed',
                    [ `container` ]: 'container' === size || 'container-content-boxed' === size,
                    [ `container-fluid` ]: 'container-fluid' === size,
                } );
                
                classes = classnames(classes, {
                    'has-text-color': rowTextColorClass,
                    'has-background': containerBackgroundColorClass,
                    [ containerBackgroundColorClass ]: containerBackgroundColorClass,
                    [ rowTextColorClass ]: rowTextColorClass,
                } );
                
                var style = {
                    backgroundColor: containerBackgroundColorClass ? undefined : customContainerBackgroundColor,
                };
                
                if(containerMarginTop > 0) {
                    style.marginTop = containerMarginTop + 'px';
                }
                if(containerMarginBottom > 0) {
                    style.marginBottom = containerMarginBottom + 'px';
                }
                
                if(containerPaddingTop > 0) {
                    style.paddingTop = containerPaddingTop + 'px';
                }
                if(containerPaddingBottom > 0) {
                    style.paddingBottom = containerPaddingBottom + 'px';
                }
                if(containerPaddingLeft > 0) {
                    style.paddingLeft = containerPaddingLeft + 'px';
                }
                if(containerPaddingRight > 0) {
                    style.paddingRight = containerPaddingRight + 'px';
                }
                
                var styleChild = {};
                if(size === 'container-content-boxed') {
                    classesChild = classnames(classesChild, {
                        'has-text-color': rowTextColor !== undefined,
                        'has-background': rowBackgroundColor !== undefined,
                        [ rowBackgroundColorClass ]: rowBackgroundColor !== undefined,
                        [ rowTextColorClass ]: rowTextColor !== undefined,
                    } );
                    
                    styleChild = {
                        backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
                        color: rowTextColorClass ? undefined : rowTextColorClass
                    };
                    
                    if(rowMarginTop > 0) {
                        styleChild.marginTop = rowMarginTop + 'px';
                    }
                    if(rowMarginBottom > 0) {
                        styleChild.marginBottom = rowMarginBottom + 'px';
                    }
            
                    if(rowPaddingTop > 0) {
                        styleChild.paddingTop = rowPaddingTop + 'px';
                    }
                    if(rowPaddingBottom > 0) {
                        styleChild.paddingBottom = rowPaddingBottom + 'px';
                    }
                    if(rowPaddingLeft > 0) {
                        styleChild.paddingLeft = rowPaddingLeft + 'px';
                    }
                    if(rowPaddingRight > 0) {
                        styleChild.paddingRight = rowPaddingRight + 'px';
                    }
                }
                else {
                    style.color = rowTextColorClass ? undefined : rowTextColorClass;
                }
                
                const blockProps = useBlockProps.save( {
                    className: classes,
                    style: style,
                });
                
                if(size === 'container-content-boxed') {
                    return (
                        <div { ...blockProps }>
                            <div className="row">
                                <div className="col">
                                    <div className={ classesChild }
                                        style = {styleChild}>
                                        <div className="row">
                                            <InnerBlocks.Content />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                else {
                    return (
                        <div { ...blockProps }>
                            <div class="row">
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                }
            },
        },
    ],
} );

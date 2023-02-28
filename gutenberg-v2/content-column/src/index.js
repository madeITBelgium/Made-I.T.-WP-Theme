/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import classnames from 'classnames';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { InnerBlocks, useBlockProps, getColorClassName } from "@wordpress/block-editor";

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
import icon from './icon';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata, {
	title: __( 'Content Column by Made I.T.' ),
    icon,
    category: 'madeit',
    keywords: [
        __( 'content — Made I.T.' ),
        __( 'columns' ),
        __( 'Made I.T.' ),
    ],
    
    supports: {
        inserter: false,
        reusable: false,
        html: false,
    },
    
    getEditWrapperProps( attributes ) {
        const { width } = attributes;
        if ( Number.isFinite( width ) ) {
            return {
                style: {
                    flexBasis: (width * (100/12)) + '%',
                },
            };
        }
    },

    attributes: {
        verticalAlignment: {
            type: "string"
        },
        width: {
            "type": "number",
            "min": 0,
            "max": 12
        },
        backgroundColor: {
            type: 'string',
        },
        customBackgroundColor: {
            type: 'string',
        },
        textColor: {
            type: 'string',
        },
        customTextColor: {
            type: 'string',
        },
        margin: {
            type: 'object'
        },
        padding: {
            type: 'object'
        }
    },
    
    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save,
    
    deprecated: [

        {
            supports: {
                inserter: false,
                reusable: false,
                html: false,
            },

            attributes: {
                verticalAlignment: {
                    type: "string"
                },
                width: {
                    "type": "number",
                    "min": 0,
                    "max": 12
                },
                backgroundColor: {
                    type: 'string',
                },
                customBackgroundColor: {
                    type: 'string',
                },
                textColor: {
                    type: 'string',
                },
                customTextColor: {
                    type: 'string',
                },
                marginBottom: {
                    type: 'number',
                    default: 0
                },
                marginTop: {
                    type: 'number',
                    default: 0
                },
                paddingTop: {
                    type: 'number',
                    default: 0
                },
                paddingBottom: {
                    type: 'number',
                    default: 0
                },
                paddingLeft: {
                    type: 'number',
                    default: 0
                },
                paddingRight: {
                    type: 'number',
                    default: 0
                },
            },

            migrate( attributes ) {
                return {
                    padding: {
                        top: attributes.paddingTop !== null && attributes.paddingTop !== undefined ? (attributes.paddingTop + 'px') : undefined,
                        bottom: attributes.paddingBottom !== null && attributes.paddingBottom !== undefined ? (attributes.paddingBottom + 'px') : undefined,
                        left: attributes.paddingLeft !== null && attributes.paddingLeft !== undefined ? (attributes.paddingLeft + 'px') : undefined,
                        right: attributes.paddingRight !== null && attributes.paddingRight !== undefined ? (attributes.paddingRight + 'px') : undefined,
                    },
                    margin: {
                        top: attributes.marginTop !== null && attributes.marginTop !== undefined ? (attributes.marginTop + 'px') : undefined,
                        bottom: attributes.marginBottom !== null && attributes.marginBottom !== undefined ? (attributes.marginBottom + 'px') : undefined,
                        left: undefined,
                        right: undefined,
                    },
                    verticalAlignment: attributes.verticalAlignment,
                    width: attributes.width,
                    backgroundColor: attributes.backgroundColor,
                    customBackgroundColor: attributes.customBackgroundColor,
                    textColor: attributes.textColor,
                    customTextColor: attributes.customTextColor,
                };
            },

            save: function( props ) {
                const { 
                    verticalAlignment,
                    width,
                    customBackgroundColor,
                    backgroundColor,
                    customTextColor,
                    textColor,
                    marginTop,
                    marginBottom,
                    paddingTop,
                    paddingBottom,
                    paddingLeft,
                    paddingRight,
                } = props.attributes;

                const {
                    className
                } = props
                
                const backgroundColorClass = backgroundColor ? getColorClassName( 'background-color', backgroundColor ) : undefined;
                const textColorClass = textColor ? getColorClassName( 'color', textColor ) : undefined;
                
                var widthRounded = Math.round(width);
                
                var wrapperClasses = classnames( className, {
                    [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
                    [ `col-12` ]: true,
                    [ `col-lg-${widthRounded}` ]: widthRounded,
                } );
                
                wrapperClasses = classnames(wrapperClasses, {
                    'has-text-color': textColorClass,
                    'has-background': backgroundColorClass,
                    [ backgroundColorClass ]: backgroundColorClass,
                    [ textColorClass ]: textColorClass,
                } );
                
                var style = {
                    backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
                    color: textColorClass ? undefined : customTextColor,
                };

                if(marginTop > 0) {
                    style.marginTop = (marginTop + 28) + 'px';
                }
                if(marginBottom > 0) {
                    style.marginBottom = (marginBottom + 28) + 'px';
                }
                
                if(paddingTop > 0) {
                    style.paddingTop = paddingTop + 'px';
                }
                if(paddingBottom > 0) {
                    style.paddingBottom = paddingBottom + 'px';
                }
                if(paddingLeft > 0) {
                    style.paddingLeft = paddingLeft + 'px';
                }
                if(paddingRight > 0) {
                    style.paddingRight = paddingRight + 'px';
                }
                
                const blockProps = useBlockProps.save( {
                    className: wrapperClasses,
                    style: style,
                });
                
                return (
                    <div { ...blockProps }>
                        <InnerBlocks.Content />
                    </div>
                );
            },
        },

        {
            supports: {
                inserter: false,
                reusable: false,
                html: false,
            },
            attributes: {
                verticalAlignment: {
                    type: "string"
                },
                width: {
                    "type": "number",
                    "min": 0,
                    "max": 12
                },
                backgroundColor: {
                    type: 'string',
                },
                customBackgroundColor: {
                    type: 'string',
                },
                textColor: {
                    type: 'string',
                },
                customTextColor: {
                    type: 'string',
                },
                marginBottom: {
                    type: 'number',
                    default: 0
                },
                marginTop: {
                    type: 'number',
                    default: 0
                },
                paddingTop: {
                    type: 'number',
                    default: 0
                },
                paddingBottom: {
                    type: 'number',
                    default: 0
                },
                paddingLeft: {
                    type: 'number',
                    default: 0
                },
                paddingRight: {
                    type: 'number',
                    default: 0
                },
            },
            save: function( { attributes } ) {
                const { verticalAlignment, width } = attributes;

                var wrapperClasses = classnames( 'col', {
                    [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
                    [ `col-md-${width}` ]: width,
                } );

                let style;

                return (
                    <div className={ wrapperClasses } style={ style }>
                        <InnerBlocks.Content />
                    </div>
                );
            },
        },
    ]
});

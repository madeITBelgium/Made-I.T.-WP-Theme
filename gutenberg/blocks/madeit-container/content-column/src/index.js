/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import classnames from 'classnames';
import { registerBlockType } from '@wordpress/blocks';

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

const stripBackgroundClasses = ( className = '' ) =>
    className
        .split( /\s+/ )
        .filter( Boolean )
        .filter( ( token ) => token !== 'has-background' && ! /^has-.*-background-color$/.test( token ) )
        .join( ' ' );

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
    ...metadata,
    icon,
    
    getEditWrapperProps( attributes ) {
        const { width } = attributes;
        if ( Number.isFinite( width ) ) {
            const widthRounded = Math.round( width );
            const widthPercent = ( width * ( 100 / 12 ) ) + '%';
            return {
                className: `is-width-${ widthRounded }`,
                style: {
                    flexBasis: widthPercent,
                    // maxWidth: widthPercent,
                },
            };
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

// Ensure background color classes never stick to the outer wrapper.
if ( typeof window !== 'undefined' && window.wp?.hooks?.addFilter ) {
    window.wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        'madeit/block-content-column/strip-bg-save-props',
        ( extraProps, blockType ) => {
            if ( blockType?.name !== metadata.name ) {
                return extraProps;
            }
            if ( typeof extraProps?.className === 'string' ) {
                extraProps.className = stripBackgroundClasses( extraProps.className );
            }
            return extraProps;
        },
        100
    );

    window.wp.hooks.addFilter(
        'editor.BlockListBlock',
        'madeit/block-content-column/strip-bg-editor-wrapper',
        ( BlockListBlock ) => ( props ) => {
            if ( props?.name !== metadata.name ) {
                return <BlockListBlock { ...props } />;
            }

        const nextProps = { ...props };
        if ( typeof nextProps.className === 'string' ) {
            nextProps.className = stripBackgroundClasses( nextProps.className );
        }
        if ( nextProps.wrapperProps && typeof nextProps.wrapperProps.className === 'string' ) {
            nextProps.wrapperProps = {
                ...nextProps.wrapperProps,
                className: stripBackgroundClasses( nextProps.wrapperProps.className ),
            };
        }

        return <BlockListBlock { ...nextProps } />;
        },
        100
    );
}

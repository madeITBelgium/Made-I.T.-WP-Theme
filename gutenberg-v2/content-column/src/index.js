/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

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
    },
    
    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
    
    deprecated: [
        {
            save: function( { attributes } ) {
                const { verticalAlignment, width } = attributes;

                var wrapperClasses = classnames( 'col', {
                    [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
                    [ `col-md-${width}` ]: width,
                } );

                let style;
                /*if ( Number.isFinite( width ) ) {
                    style = { flexBasis: width + '%' };
                }*/

                return (
                    <div className={ wrapperClasses } style={ style }>
                        <InnerBlocks.Content />
                    </div>
                );
            },
        },
    ]
});

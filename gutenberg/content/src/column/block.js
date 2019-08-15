/**
 * BLOCK: content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import edit from './edit';
import save from './save';
import icon from './icon';
import classnames from 'classnames';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.blockEditor;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'madeit/block-content-column', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Content Column by Made I.T.' ), // Block title.
    icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
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
        }
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
} );

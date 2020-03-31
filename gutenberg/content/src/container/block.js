/**
 * BLOCK: content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import edit from './edit';
import save from './save';
import icon from './icon';
import variations from './variations';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

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
registerBlockType( 'madeit/block-content', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Content by Made I.T.' ), // Block title.
	icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
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
        rowTextColor: {
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
    
    getEditWrapperProps( attributes ) {
        const { size } = attributes;
        if ( 'container-fluid' === size || 'container-content-boxed' === size) {
            return { 'data-align': 'wide' };
        }
        return { 'data-align': 'container' };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} );

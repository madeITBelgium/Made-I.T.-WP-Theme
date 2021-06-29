/**
 * BLOCK: content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import './style.scss';
import './editor.scss';
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
registerBlockType( 'madeit/block-card', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Card by Made I.T.' ), // Block title.
    icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'card — Made I.T.' ),
        __( 'card' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
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
        hasTitle: {
            type: 'boolean',
            default: false,
        },
        cardTitle: {
            type: 'string',
        },
        level: {
			type: "number",
			default: 2
		},
    },
    
    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} );

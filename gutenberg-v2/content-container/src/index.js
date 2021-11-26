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
} );

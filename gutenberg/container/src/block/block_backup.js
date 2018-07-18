/**
 * BLOCK: container
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

var el = wp.element.createElement;
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
registerBlockType( 'madeit/block-container', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'container - Made IT Block' ), // Block title.
	icon: 'columns', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'container — Made IT Block' ),
		__( 'Made IT' ),
		__( 'Made I.T.' ),
	],
    
    attributes: {
        content: {
            type: 'array',
            source: 'children',
            selector: 'p',
        },
        content2: {
            type: 'array',
            source: 'children',
            selector: 'p',
        },
    },

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( props ) {
        var editor1 = el( wp.editor.RichText, {
            tagName: 'p',
            className: '',
            value: props.attributes.content,
            onChange: function( content ) {
                props.setAttributes( { content: content } );
            }
        } );
        
        var editor2 = el( wp.editor.RichText, {
            tagName: 'p',
            className: '',
            value: props.attributes.content2,
            onChange: function( content ) {
                props.setAttributes( { content2: content } );
            }
        } );
        
        return el(
            'div',
            { className: props.className + ' container' }, 
            
            el(
                'div',
                {className: 'row'},
                
                el(
                    'div',
                    {className: 'col-sm-6'},
                    editor1
                ),
                el(
                    'div',
                    {className: 'col-sm-6'},
                    editor2
                )
            )
        );
        
        /*(
			<div className={ props.className }>
                <div class="row">
                    <div class="col-sm-6">{ editor1 }</div>
                    <div class="col-sm-6"><p>Kolom 2</p>
                    </div>
                </div>
			</div>
		);*/
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {
        var editor1 = el(wp.editor.RichText.Content, {tagName: 'p', value: props.attributes.content});
        var editor2 = el(wp.editor.RichText.Content, {tagName: 'p', value: props.attributes.content2});
		return el(
            'div',
            { className: props.className + ' container' }, 
            
            el(
                'div',
                {className: 'row'},
                
                el(
                    'div',
                    {className: 'col-sm-6'},
                    editor1
                ),
                el(
                    'div',
                    {className: 'col-sm-6'},
                    editor2
                )
            )
        );
	},
} );

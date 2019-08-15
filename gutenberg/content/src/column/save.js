/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

export default function save( { attributes } ) {
    const { verticalAlignment, width } = attributes;

    var wrapperClasses = classnames( 'col-12', {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
        [ `col-lg-${width}` ]: width,
    } );
    
    return (
        <div className={ wrapperClasses }>
            <InnerBlocks.Content />
        </div>
    );
}
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
}
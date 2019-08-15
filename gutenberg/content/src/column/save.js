/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

export default function save( props ) {
    const { verticalAlignment, width } = props.attributes;
    
    const {
        className
    } = props

    var wrapperClasses = classnames( className, {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
        [ `col-12` ]: true,
        [ `col-lg-${width}` ]: width,
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
/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
    InnerBlocks,
    getColorClassName
} = wp.blockEditor;

export default function save( props ) {
    const { 
        verticalAlignment,
        width,
        customBackgroundColor,
        backgroundColor,
        customTextColor,
        textColor,
    } = props.attributes;
    
    const {
        className
    } = props
    
    const backgroundColorClass = backgroundColor ? getColorClassName( 'background-color', backgroundColor ) : undefined;
	const textColorClass = textColor ? getColorClassName( 'color', textColor ) : undefined;
    
    
    var wrapperClasses = classnames( className, {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
        [ `col-12` ]: true,
        [ `col-lg-${width}` ]: width,
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

    return (
        <div className={ wrapperClasses } style={ style }>
            <InnerBlocks.Content />
        </div>
    );
}
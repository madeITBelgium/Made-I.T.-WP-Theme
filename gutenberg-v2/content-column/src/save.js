/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

export default function save( props ) {
    const { 
        verticalAlignment,
        width,
        customBackgroundColor,
        backgroundColor,
        customTextColor,
        textColor,
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
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

    if(marginTop > 0) {
        style.marginTop = (marginTop + 28) + 'px';
    }
    if(marginBottom > 0) {
        style.marginBottom = (marginBottom + 28) + 'px';
    }
    
    if(paddingTop > 0) {
        style.paddingTop = paddingTop + 'px';
    }
    if(paddingBottom > 0) {
        style.paddingBottom = paddingBottom + 'px';
    }
    if(paddingLeft > 0) {
        style.paddingLeft = paddingLeft + 'px';
    }
    if(paddingRight > 0) {
        style.paddingRight = paddingRight + 'px';
    }
    
    
    const blockProps = useBlockProps.save( {
        className: wrapperClasses,
        style: style,
    });
    

    return (
        <div { ...blockProps }>
            <InnerBlocks.Content />
        </div>
    );
}
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
        margin,
        padding,
    } = props.attributes;
    
    const {
        className
    } = props
    
    const backgroundColorClass = backgroundColor ? getColorClassName( 'background-color', backgroundColor ) : undefined;
	const textColorClass = textColor ? getColorClassName( 'color', textColor ) : undefined;

    var widthRounded = Math.round(width);

    var wrapperClasses = classnames( className, {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
        [ `col-12` ]: true,
        [ `col-lg-${widthRounded}` ]: widthRounded,
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

    if(margin !== undefined && margin.top !== undefined) {
        style.marginTop = margin.top;
    }
    if(margin !== undefined && margin.bottom !== undefined) {
        style.marginBottom = margin.bottom;
    }
    if(padding !== undefined && padding.top !== undefined ) {
        style.paddingTop = padding.top;
    }
    if(padding !== undefined && padding.bottom !== undefined) {
        style.paddingBottom = padding.bottom;
    }
    if(padding !== undefined && padding.left !== undefined) {
        style.paddingLeft = padding.left;
    }
    if(padding !== undefined && padding.right !== undefined) {
        style.paddingRight = padding.right;
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
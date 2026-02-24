/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { InnerBlocks, getColorClassName, useBlockProps } from '@wordpress/block-editor';

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
        maxContainerSize,
    } = props.attributes;
    
    const {
        className
    } = props

    const defaultBlockClassName = 'wp-block-madeit-block-content-column';

    const outerClassName = ( className || '' )
        .split( /\s+/ )
        .filter( Boolean )
        .filter( ( token ) => token !== 'has-background' && ! /^has-.*-background-color$/.test( token ) )
        .join( ' ' );
    
    const backgroundColorClass = backgroundColor ? getColorClassName( 'background-color', backgroundColor ) : undefined;
	const textColorClass = textColor ? getColorClassName( 'color', textColor ) : undefined;

    var widthRounded = Math.round(width);

    var wrapperClasses = classnames( defaultBlockClassName, outerClassName, {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
        [ `col-12` ]: true,
        [ `col-lg-${widthRounded}` ]: widthRounded,
        [ 'keep-max-container-size' ]: !! maxContainerSize,
    } );

    wrapperClasses = classnames( wrapperClasses, {
        'has-text-color': textColorClass,
        [ textColorClass ]: textColorClass,
    } );

    const innerClasses = classnames( 'madeit-content-column__inner', {
        'has-background': backgroundColorClass,
        [ backgroundColorClass ]: backgroundColorClass,
    } );

    var style = {
        color: textColorClass ? undefined : customTextColor,
    };

    const innerStyle = {
        backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
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
    } );

    return (
        <div { ...blockProps }>
            <div className={ innerClasses } style={ innerStyle }>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
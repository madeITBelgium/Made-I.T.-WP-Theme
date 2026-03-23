/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { InnerBlocks, getColorClassName } from '@wordpress/block-editor';

export default function save( props ) {
    const { 
        wrapperClassName,
        verticalAlignment,
        hasCustomVerticalAlignment,
        width,
        customBackgroundColor,
        backgroundColor,
        customTextColor,
        textColor,
        margin,
        padding,
        maxContainerSize,
        innerWrapperClassName,
    } = props.attributes;
    
    const {
        className
    } = props

    const defaultBlockClassName = 'wp-block-madeit-block-content-column';

    const stripManagedTokens = ( value = '' ) =>
        value
            .split( /\s+/ )
            .filter( Boolean )
            .filter( ( token ) => token !== defaultBlockClassName )
            .filter( ( token ) => token !== 'col-12' )
            .filter( ( token ) => token !== 'keep-max-container-size' )
            .filter( ( token ) => token !== 'has-background' )
            .filter( ( token ) => token !== 'has-text-color' )
            .filter( ( token ) => ! /^col-(?:sm|md|lg|xl|xxl)-\d+$/.test( token ) )
            .filter( ( token ) => ! /^is-vertically-aligned-/.test( token ) )
            .filter( ( token ) => ! /^has-.*-background-color$/.test( token ) )
            .filter( ( token ) => ! /^has-.*-color$/.test( token ) )
            .join( ' ' );

    const outerClassName = stripManagedTokens( className || '' );
    
    const backgroundColorClass = backgroundColor ? getColorClassName( 'background-color', backgroundColor ) : undefined;
	const textColorClass = textColor ? getColorClassName( 'color', textColor ) : undefined;

    const widthRounded = Number.isFinite( width ) ? Math.round( width ) : undefined;

    const upsertVerticalAlignmentClass = ( rawClassString = '' ) => {
        const base = String( rawClassString || '' )
            .split( /\s+/ )
            .filter( Boolean )
            .filter( ( token ) => ! /^is-vertically-aligned-/.test( token ) );

        if ( hasCustomVerticalAlignment && verticalAlignment ) {
            base.push( `is-vertically-aligned-${ verticalAlignment }` );
        }

        return base.join( ' ' );
    };

    // TODO: Fix the column classes, and update
    let wrapperClasses = classnames( defaultBlockClassName, outerClassName, {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: !! hasCustomVerticalAlignment && !! verticalAlignment,
        [ `col-12` ]: true,
        [ `col-lg-${ widthRounded }` ]: widthRounded,
        [ 'keep-max-container-size' ]: !! maxContainerSize,
        // [ 'madeit-block-content--frontend' ]: true,
    } );

    wrapperClasses = classnames( wrapperClasses, {
        'has-text-color': textColorClass,
        [ textColorClass ]: textColorClass,
    } );

    const hasBackground = !! ( backgroundColorClass || customBackgroundColor );
    const hasInnerWrapper = !! innerWrapperClassName;

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
    
    const blockProps = {
        className: wrapperClasses,
        style: style,
    };

    // Legacy markup: no inner wrapper when no background.
    if ( ! hasBackground ) {
        console.log('Save Column, ' + className + ': POS 1');
        return (
            <div { ...blockProps }>
                { '\n\n' }
                <InnerBlocks.Content />
                { '\n\n' }
            </div>
        );
    }

    // Legacy markup (older saved posts): background classes lived on the OUTER
    // wrapper and there was no inner wrapper.
    // We keep this output for legacy blocks to avoid validation errors.
    if ( hasBackground && ! hasInnerWrapper ) {
        const rawWrapperClassName =
            typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0
                ? wrapperClassName.trim()
                : '';

        if ( rawWrapperClassName ) {
            const legacyStyle = {
                ...style,
                backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
            };

            const legacyBlockProps = {
                className: upsertVerticalAlignmentClass( rawWrapperClassName ) + ' ' + ( backgroundColorClass ? ` ${ backgroundColorClass }` : '' ),
                style: legacyStyle,
            };

            console.log('Save Column, ' + className + ': POS 2');
            return (
                <div { ...legacyBlockProps }>
                    { '\n\n' }
                    <InnerBlocks.Content />
                    { '\n\n' }
                </div>
            );
        }

        const legacyWrapperClasses = classnames( wrapperClasses, {
            'has-background': !! backgroundColorClass,
            [ backgroundColorClass ]: backgroundColorClass,
        } );

        const legacyStyle = {
            ...style,
            backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
        };

        const legacyBlockProps = {
            className: legacyWrapperClasses,
            style: legacyStyle,
        };

        console.log('Save Column, ' + className + ': POS 3');
        return (
            <div { ...legacyBlockProps }>
                { '\n\n' }
                <InnerBlocks.Content />
                { '\n\n' }
            </div>
        );
    }

    console.log('Save Column, ' + className + ': POS 4'); 
    return (
        <div { ...blockProps }>
            <div className={ innerClasses } style={ innerStyle }>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
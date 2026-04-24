import classnames from 'classnames';
import { InnerBlocks, useBlockProps, getColorClassName } from '@wordpress/block-editor';

// Deprecated save (2026-04-22, earlier iteration): added text/background colors
// but could serialize duplicated/conflicting background classes when legacy
// `innerWrapperClassName` already contained `has-background` / `has-*-background-color`.
export default function save( { attributes } ) {
    const {
        verticalAlignment,
        width,
        customTextColor,
        customBackgroundColor,
        margin,
        padding,
        maxContainerSize,
        innerWrapperClassName,
        textColor,
        backgroundColor,
    } = attributes;

    const widthRounded = Number.isFinite( width ) ? Math.round( width ) : undefined;

    const textColorClass = textColor
        ? getColorClassName( 'color', textColor )
        : undefined;

    const backgroundColorClass = backgroundColor
        ? getColorClassName( 'background-color', backgroundColor )
        : undefined;

    const hasTextColor = !! ( textColorClass || customTextColor );
    const hasBackground = !! ( backgroundColorClass || customBackgroundColor );

    const classes = classnames( 'wp-block-madeit-block-content-column', {
        'col-12': true,
        [ `col-lg-${ widthRounded }` ]: Number.isFinite( widthRounded ),
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
        'keep-max-container-size': maxContainerSize,
        'has-text-color': hasTextColor,
        [ textColorClass ]: !! textColorClass,
    } );

    const outerStyle = {
        marginTop: margin?.top,
        marginBottom: margin?.bottom,
        color: textColorClass ? undefined : customTextColor,
    };

    const innerStyle = {
        paddingTop: padding?.top,
        paddingBottom: padding?.bottom,
        paddingLeft: padding?.left,
        paddingRight: padding?.right,
        backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
    };

    // NOTE: keep legacy duplication behavior for exact matching.
    const innerClasses = classnames( innerWrapperClassName || 'madeit-content-column__inner', {
        'has-background': hasBackground,
        [ backgroundColorClass ]: !! backgroundColorClass,
    } );

    const blockProps = useBlockProps.save( {
        className: classes,
        style: outerStyle,
    } );

    return (
        <div { ...blockProps }>
            <div className={ innerClasses } style={ innerStyle }>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}

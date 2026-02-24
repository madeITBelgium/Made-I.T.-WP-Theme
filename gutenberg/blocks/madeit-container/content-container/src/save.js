/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */

import classnames from 'classnames';

import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( props ) {
    const {
        verticalAlignment,
        containerBackgroundColor,
        customContainerBackgroundColor,
        size,
        contentWidth,
        rowBackgroundColor,
        rowTextColor,
        customRowBackgroundColor,
        customRowTextColor,
        containerMargin,
        containerPadding,
        rowMargin,
        rowPadding,
        overflow,
        htmlTag,
        flexDirection,
        flexDirectionTablet,
        flexDirectionMobile,
        alignItems,
        alignItemsTablet,
        alignItemsMobile,
        justifyContent,
        justifyContentTablet,
        justifyContentMobile,
        flexWrap,
        flexWrapTablet,
        flexWrapMobile,
        minHeight,
        minHeightUnit,
        minHeightTablet,
        minHeightUnitTablet,
        minHeightMobile,
        minHeightUnitMobile,
        maxWidth,
        maxWidthUnit,
        maxWidthTablet,
        maxWidthUnitTablet,
        maxWidthMobile,
        maxWidthUnitMobile,
        rowGap,
        rowGapUnit,
        rowGapTablet,
        rowGapUnitTablet,
        rowGapMobile,
        rowGapUnitMobile,
        columnsCount,
        hideOnDesktop,
        hideOnTablet,
        hideOnMobile,
    } = props.attributes;
    
    const {
        className
    } = props

    const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
    
    const containerBackgroundColorClass = containerBackgroundColor ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;
	const rowBackgroundColorClass = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
	const rowTextColorClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;
    
    var classes = className;
    var classesChild = '';
    
    
    var defaultSize = size;
    if(defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
        defaultSize = 'container';
    }

    const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';
    const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
    const contentWidthResolvedRaw = hasContentWidth
        ? contentWidth
        : defaultSize === 'container-content-boxed'
            ? 'container'
            : outerSizeNormalized;
    let contentWidthNormalized =
        contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';

    // If the outer container is boxed, content cannot be full width.
    if ( outerSizeNormalized === 'container' ) {
        contentWidthNormalized = 'container';
    }
    
    
    classes = classnames( classes, {
        [ `container` ]: 'container' === defaultSize,
        [ `container-fluid` ]: 'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
         [ `is-hidden-desktop` ]: !! hideOnDesktop,
        [ `is-hidden-tablet` ]: !! hideOnTablet,
        [ `is-hidden-mobile` ]: !! hideOnMobile,
    } );
    
    if(defaultSize !== 'container-content-boxed') {
        classes = classnames( classes, {
            [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && defaultSize !== 'container-content-boxed',
        } );
    }
    
    classesChild = classnames( classesChild, {
        [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && defaultSize === 'container-content-boxed',
        [ `container` ]: contentWidthNormalized === 'container',
        [ `container-fluid` ]: contentWidthNormalized === 'container-fluid',
    } );
    
    classes = classnames(classes, {
        'has-text-color': rowTextColorClass,
        'has-background': containerBackgroundColorClass,
        [ containerBackgroundColorClass ]: containerBackgroundColorClass,
        [ rowTextColorClass ]: rowTextColorClass,
    } );
    
    var style = {
        backgroundColor: containerBackgroundColorClass ? undefined : customContainerBackgroundColor,
    };

    // Apply overflow to outer wrapper.
    if ( overflow ) {
        style.overflow = overflow;
    }

    // Responsive min-height via CSS variables.
    if ( typeof minHeight === 'number' ) {
        style['--madeit-min-height-desktop'] = `${ minHeight }${ minHeightUnit || 'px' }`;
    }
    if ( typeof minHeightTablet === 'number' ) {
        style['--madeit-min-height-tablet'] = `${ minHeightTablet }${ minHeightUnitTablet || 'px' }`;
    }
    if ( typeof minHeightMobile === 'number' ) {
        style['--madeit-min-height-mobile'] = `${ minHeightMobile }${ minHeightUnitMobile || 'px' }`;
    }

    // Responsive max-width via CSS variables.
    if ( typeof maxWidth === 'number' ) {
        style['--madeit-max-width-desktop'] = `${ maxWidth }${ maxWidthUnit || 'px' }`;
    }
    if ( typeof maxWidthTablet === 'number' ) {
        style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }`;
    }
    if ( typeof maxWidthMobile === 'number' ) {
        style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }`;
    }

     // Responsive row-gap via CSS variables.
    if ( typeof rowGap === 'number' ) {
        style['--madeit-row-gap-desktop'] = `${ rowGap }${ rowGapUnit || 'px' }`;
    }
    if ( typeof rowGapTablet === 'number' ) {
        style['--madeit-row-gap-tablet'] = `${ rowGapTablet }${ rowGapUnitTablet || 'px' }`;
    }
    if ( typeof rowGapMobile === 'number' ) {
        style['--madeit-row-gap-mobile'] = `${ rowGapMobile }${ rowGapUnitMobile || 'px' }`;
    }

    // Responsive flex-direction via CSS variables.
    style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
    if ( flexDirectionTablet ) {
        style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
    }
    if ( flexDirectionMobile ) {
        style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
    }

    // Responsive align-items / justify-content via CSS variables.
    style['--madeit-align-items-desktop'] = alignItems || 'stretch';
    if ( alignItemsTablet ) {
        style['--madeit-align-items-tablet'] = alignItemsTablet;
    }
    if ( alignItemsMobile ) {
        style['--madeit-align-items-mobile'] = alignItemsMobile;
    }

    style['--madeit-justify-content-desktop'] = justifyContent || 'flex-start';
    if ( justifyContentTablet ) {
        style['--madeit-justify-content-tablet'] = justifyContentTablet;
    }
    if ( justifyContentMobile ) {
        style['--madeit-justify-content-mobile'] = justifyContentMobile;
    }

    // Responsive flex-wrap via CSS variables.
    style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
    if ( flexWrapTablet ) {
        style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
    }
    if ( flexWrapMobile ) {
        style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
    }
    
    if(containerMargin !== undefined && containerMargin.top !== undefined) {
        style.marginTop = containerMargin.top;
    }
    if(containerMargin !== undefined && containerMargin.bottom !== undefined) {
        style.marginBottom = containerMargin.bottom;
    }
    if(containerPadding !== undefined && containerPadding.top !== undefined ) {
        style.paddingTop = containerPadding.top;
    }
    if(containerPadding !== undefined && containerPadding.bottom !== undefined) {
        style.paddingBottom = containerPadding.bottom;
    }
    if(containerPadding !== undefined && containerPadding.left !== undefined) {
        style.paddingLeft = containerPadding.left;
    }
    if(containerPadding !== undefined && containerPadding.right !== undefined) {
        style.paddingRight = containerPadding.right;
    }
    
    var styleChild = {};
    if(defaultSize === 'container-content-boxed') {
        classesChild = classnames(classesChild, {
            'has-text-color': rowTextColor !== undefined,
            'has-background': rowBackgroundColor !== undefined,
            [ rowBackgroundColorClass ]: rowBackgroundColor !== undefined,
            [ rowTextColorClass ]: rowTextColor !== undefined,
        } );
        
        styleChild = {
            backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
            color: rowTextColorClass ? undefined : rowTextColorClass
        };

        if(rowMargin !== undefined && rowMargin.top !== undefined) {
            styleChild.marginTop = rowMargin.top;
        }
        if(rowMargin !== undefined && rowMargin.bottom !== undefined) {
            styleChild.marginBottom = rowMargin.bottom;
        }
        if(rowPadding !== undefined && rowPadding.top !== undefined ) {
            styleChild.paddingTop = rowPadding.top;
        }
        if(rowPadding !== undefined && rowPadding.bottom !== undefined) {
            styleChild.paddingBottom = rowPadding.bottom;
        }
        if(rowPadding !== undefined && rowPadding.left !== undefined) {
            styleChild.paddingLeft = rowPadding.left;
        }
        if(rowPadding !== undefined && rowPadding.right !== undefined) {
            styleChild.paddingRight = rowPadding.right;
        }
    }
    else {
        style.color = rowTextColorClass ? undefined : rowTextColorClass;
    }
    
    const blockProps = useBlockProps.save( {
        className: classnames( classes, FRONTEND_WRAPPER_CLASS ),
        style: style,
    });

    const allowedHtmlTags = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];
    const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

    const dirDesktop = flexDirection || 'row';
    const dirTablet = flexDirectionTablet || undefined;
    const dirMobile = flexDirectionMobile || undefined;
    
    if(size === 'container-content-boxed') {
        return (
            <HtmlTag { ...blockProps }>
                <div
                    className={`row madeit-container-row rows-${ columnsCount || 0 }`}
                    data-madeit-dir={ dirDesktop }
                    data-madeit-dir-tablet={ dirTablet }
                    data-madeit-dir-mobile={ dirMobile }
                >
                    <div className="col">
                        <div className={ classesChild }
                            style = {styleChild}>
                            <div
                                className={`row madeit-container-row rows-${ columnsCount || 0 }`}
                                data-madeit-dir={ dirDesktop }
                                data-madeit-dir-tablet={ dirTablet }
                                data-madeit-dir-mobile={ dirMobile }
                            >
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    </div>
                </div>
            </HtmlTag>
        );
    }
    else {
        const shouldWrapContent =
            outerSizeNormalized !== 'container' &&
            hasContentWidth &&
            contentWidthNormalized !== outerSizeNormalized;

        if ( shouldWrapContent ) {
            return (
                <HtmlTag { ...blockProps }>
                    <div
                        className={ classnames( {
                            container: contentWidthNormalized === 'container',
                            'container-fluid': contentWidthNormalized === 'container-fluid',
                        } ) }
                    >
                        <div
                            className={`row madeit-container-row rows-${ columnsCount || 0 }`}
                            data-madeit-dir={ dirDesktop }
                            data-madeit-dir-tablet={ dirTablet }
                            data-madeit-dir-mobile={ dirMobile }
                        >
                            <InnerBlocks.Content />
                        </div>
                    </div>
                </HtmlTag>
            );
        }

        return (
            <HtmlTag { ...blockProps }>
                <div
                    className={`row madeit-container-row rows-${ columnsCount || 0 }`}
                    data-madeit-dir={ dirDesktop }
                    data-madeit-dir-tablet={ dirTablet }
                    data-madeit-dir-mobile={ dirMobile }
                >
                    <InnerBlocks.Content />
                </div>
            </HtmlTag>
        );
    }
}
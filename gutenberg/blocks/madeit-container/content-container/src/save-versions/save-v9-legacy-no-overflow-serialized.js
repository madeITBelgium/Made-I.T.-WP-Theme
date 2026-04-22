import classnames from 'classnames';

import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

/**
 * Deprecated (legacy markup):
 * - Wrapper *did* include `madeit-block-content--frontend`
 * - Inner wrapper *did* include `.madeit-container-row` + data attrs
 * - But `overflow:visible` was NOT serialized in the style attribute
 * - The inner row wrapper contained newline whitespace
 */
export default function saveV9LegacyNoOverflowSerialized( props ) {
    const {
        verticalAlignment,
        backgroundType,
        containerBackgroundColor,
        customContainerBackgroundColor,
        containerBackgroundImage,
        containerBackgroundPosition,
        containerBackgroundRepeat,
        containerBackgroundSize,
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
        // overflow intentionally ignored
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

    const { className } = props;

    const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';

    const containerBackgroundColorClass = containerBackgroundColor
        ? getColorClassName( 'background-color', containerBackgroundColor )
        : undefined;
    const rowBackgroundColorClass = rowBackgroundColor
        ? getColorClassName( 'background-color', rowBackgroundColor )
        : undefined;
    const rowTextColorClass = rowTextColor
        ? getColorClassName( 'color', rowTextColor )
        : undefined;

    const hasClassicBackground = !!(
        containerBackgroundImage?.url ||
        containerBackgroundColor ||
        customContainerBackgroundColor
    );
    const computedBackgroundType =
        backgroundType || ( hasClassicBackground ? 'classic' : undefined );

    let classes = className;
    let classesChild = '';

    let defaultSize = size;
    if (
        defaultSize !== 'container' &&
        defaultSize !== 'container-fluid' &&
        defaultSize !== 'container-content-boxed'
    ) {
        defaultSize = 'container';
    }

    const outerSizeNormalized =
        defaultSize === 'container' ? 'container' : 'container-fluid';
    const hasContentWidth =
        typeof contentWidth === 'string' && contentWidth.length > 0;
    const contentWidthResolvedRaw = hasContentWidth
        ? contentWidth
        : defaultSize === 'container-content-boxed'
            ? 'container'
            : outerSizeNormalized;
    let contentWidthNormalized =
        contentWidthResolvedRaw === 'container-fluid'
            ? 'container-fluid'
            : 'container';

    if ( outerSizeNormalized === 'container' ) {
        contentWidthNormalized = 'container';
    }

    classes = classnames( classes, {
        container: 'container' === defaultSize,
        'container-fluid':
            'container-fluid' === defaultSize ||
            'container-content-boxed' === defaultSize,
        'is-hidden-desktop': !! hideOnDesktop,
        'is-hidden-tablet': !! hideOnTablet,
        'is-hidden-mobile': !! hideOnMobile,
    } );

    if ( defaultSize !== 'container-content-boxed' ) {
        classes = classnames( classes, {
            [ `are-vertically-aligned-${ verticalAlignment }` ]:
                verticalAlignment &&
                defaultSize !== 'container-content-boxed',
        } );
    }

    classesChild = classnames( classesChild, {
        [ `are-vertically-aligned-${ verticalAlignment }` ]:
            verticalAlignment && defaultSize === 'container-content-boxed',
        container: contentWidthNormalized === 'container',
        'container-fluid': contentWidthNormalized === 'container-fluid',
    } );

    classes = classnames( classes, {
        'has-text-color': rowTextColorClass,
        'has-background': containerBackgroundColorClass,
        [ containerBackgroundColorClass ]: containerBackgroundColorClass,
        [ rowTextColorClass ]: rowTextColorClass,
    } );

    const style = {
        backgroundColor:
            backgroundType === 'transparent'
                ? 'transparent'
                : containerBackgroundColorClass
                    ? undefined
                    : customContainerBackgroundColor,
    };

    const hasBackgroundPosition =
        typeof containerBackgroundPosition === 'string' &&
        containerBackgroundPosition.length > 0;
    const hasBackgroundRepeat =
        typeof containerBackgroundRepeat === 'string' &&
        containerBackgroundRepeat.length > 0;
    const hasBackgroundSize =
        typeof containerBackgroundSize === 'string' &&
        containerBackgroundSize.length > 0;

    const computedBackgroundGradient =
        props.attributes.containerBackgroundGradient || {
            gradient: '',
        };
    const computedBackgroundGradientValue =
        typeof computedBackgroundGradient?.gradient === 'string' &&
        computedBackgroundGradient.gradient.trim().length > 0
            ? computedBackgroundGradient.gradient
            : undefined;

    if ( computedBackgroundType === 'classic' && containerBackgroundImage?.url ) {
        style.backgroundImage = `url(${ containerBackgroundImage.url })`;
        if ( hasBackgroundPosition ) {
            style.backgroundPosition = containerBackgroundPosition;
        }
        if ( hasBackgroundRepeat ) {
            style.backgroundRepeat = containerBackgroundRepeat;
        }
        if ( hasBackgroundSize ) {
            style.backgroundSize = containerBackgroundSize;
        }
    }

    if ( computedBackgroundType === 'gradient' && computedBackgroundGradientValue ) {
        style.backgroundImage = computedBackgroundGradientValue;
    }

    // Responsive min-height via CSS variables.
    if ( typeof minHeight === 'number' ) {
        style['--madeit-min-height-desktop'] = `${ minHeight }${
            minHeightUnit || 'px'
        }`;
    }
    if ( typeof minHeightTablet === 'number' ) {
        style['--madeit-min-height-tablet'] = `${ minHeightTablet }${
            minHeightUnitTablet || 'px'
        }`;
    }
    if ( typeof minHeightMobile === 'number' ) {
        style['--madeit-min-height-mobile'] = `${ minHeightMobile }${
            minHeightUnitMobile || 'px'
        }`;
    }

    // Responsive max-width via CSS variables.
    if ( typeof maxWidth === 'number' ) {
        style['--madeit-max-width-desktop'] = `${ maxWidth }${
            maxWidthUnit || 'px'
        }`;
    }
    if ( typeof maxWidthTablet === 'number' ) {
        style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${
            maxWidthUnitTablet || 'px'
        }`;
    }
    if ( typeof maxWidthMobile === 'number' ) {
        style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${
            maxWidthUnitMobile || 'px'
        }`;
    }

    // Row gap via CSS variables.
    const hasRowGapDesktop = typeof rowGap === 'number';
    if ( hasRowGapDesktop ) {
        style['--madeit-row-gap-desktop'] = `${ rowGap }${ rowGapUnit || 'px' }`;
        if ( typeof rowGapTablet === 'number' ) {
            style['--madeit-row-gap-tablet'] = `${ rowGapTablet }${
                rowGapUnitTablet || 'px'
            }`;
        }
        if ( typeof rowGapMobile === 'number' ) {
            style['--madeit-row-gap-mobile'] = `${ rowGapMobile }${
                rowGapUnitMobile || 'px'
            }`;
        }
    }

    // Responsive flex-direction via CSS variables.
    style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
    if ( flexDirectionTablet ) {
        style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
    }
    if ( flexDirectionMobile ) {
        style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
    }

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

    style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
    if ( flexWrapTablet ) {
        style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
    }
    if ( flexWrapMobile ) {
        style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
    }

    if ( containerMargin?.top !== undefined ) {
        style.marginTop = containerMargin.top;
    }
    if ( containerMargin?.bottom !== undefined ) {
        style.marginBottom = containerMargin.bottom;
    }
    if ( containerMargin?.left !== undefined ) {
        style.marginLeft = containerMargin.left;
    }
    if ( containerMargin?.right !== undefined ) {
        style.marginRight = containerMargin.right;
    }
    if ( containerPadding?.top !== undefined ) {
        style.paddingTop = containerPadding.top;
    }
    if ( containerPadding?.bottom !== undefined ) {
        style.paddingBottom = containerPadding.bottom;
    }
    if ( containerPadding?.left !== undefined ) {
        style.paddingLeft = containerPadding.left;
    }
    if ( containerPadding?.right !== undefined ) {
        style.paddingRight = containerPadding.right;
    }

    let styleChild = {};
    if ( defaultSize === 'container-content-boxed' ) {
        classesChild = classnames( classesChild, {
            'has-text-color': rowTextColor !== undefined,
            'has-background': rowBackgroundColor !== undefined,
            [ rowBackgroundColorClass ]: rowBackgroundColor !== undefined,
            [ rowTextColorClass ]: rowTextColor !== undefined,
        } );

        styleChild = {
            backgroundColor: rowBackgroundColorClass
                ? undefined
                : customRowBackgroundColor,
            color: rowTextColorClass ? undefined : customRowTextColor,
        };

        if ( rowMargin?.top !== undefined ) {
            styleChild.marginTop = rowMargin.top;
        }
        if ( rowMargin?.bottom !== undefined ) {
            styleChild.marginBottom = rowMargin.bottom;
        }
        if ( rowMargin?.left !== undefined ) {
            styleChild.marginLeft = rowMargin.left;
        }
        if ( rowMargin?.right !== undefined ) {
            styleChild.marginRight = rowMargin.right;
        }
        if ( rowPadding?.top !== undefined ) {
            styleChild.paddingTop = rowPadding.top;
        }
        if ( rowPadding?.bottom !== undefined ) {
            styleChild.paddingBottom = rowPadding.bottom;
        }
        if ( rowPadding?.left !== undefined ) {
            styleChild.paddingLeft = rowPadding.left;
        }
        if ( rowPadding?.right !== undefined ) {
            styleChild.paddingRight = rowPadding.right;
        }
    } else {
        style.color = rowTextColorClass ? undefined : customRowTextColor;
    }

    const blockProps = useBlockProps.save( {
        className: classnames( classes, FRONTEND_WRAPPER_CLASS ),
        style,
    } );

    const allowedHtmlTags = [
        'div',
        'section',
        'article',
        'main',
        'header',
        'footer',
    ];
    const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

    const dirDesktop = flexDirection || 'row';
    const dirTablet = flexDirectionTablet || undefined;
    const dirMobile = flexDirectionMobile || undefined;

    if ( size === 'container-content-boxed' ) {
        return (
            <HtmlTag { ...blockProps }>
                <div
                    className={ `row madeit-container-row rows-${
                        columnsCount || 0
                    }` }
                    data-madeit-dir={ dirDesktop }
                    data-madeit-dir-tablet={ dirTablet }
                    data-madeit-dir-mobile={ dirMobile }
                >
                    <div className="col">
                        <div className={ classesChild } style={ styleChild }>
                            <div
                                className={ `row madeit-container-row rows-${
                                    columnsCount || 0
                                }` }
                                data-madeit-dir={ dirDesktop }
                                data-madeit-dir-tablet={ dirTablet }
                                data-madeit-dir-mobile={ dirMobile }
                            >
                                { '\n\n' }
                                <InnerBlocks.Content />
                                { '\n\n' }
                            </div>
                        </div>
                    </div>
                </div>
            </HtmlTag>
        );
    }

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
                        'container-fluid':
                            contentWidthNormalized === 'container-fluid',
                    } ) }
                >
                    <div
                        className={ `row madeit-container-row rows-${
                            columnsCount || 0
                        }` }
                        data-madeit-dir={ dirDesktop }
                        data-madeit-dir-tablet={ dirTablet }
                        data-madeit-dir-mobile={ dirMobile }
                    >
                        { '\n\n' }
                        <InnerBlocks.Content />
                        { '\n\n' }
                    </div>
                </div>
            </HtmlTag>
        );
    }

    return (
        <HtmlTag { ...blockProps }>
            <div
                className={ `row madeit-container-row rows-${ columnsCount || 0 }` }
                data-madeit-dir={ dirDesktop }
                data-madeit-dir-tablet={ dirTablet }
                data-madeit-dir-mobile={ dirMobile }
            >
                { '\n\n' }
                <InnerBlocks.Content />
                { '\n\n' }
            </div>
        </HtmlTag>
    );
}

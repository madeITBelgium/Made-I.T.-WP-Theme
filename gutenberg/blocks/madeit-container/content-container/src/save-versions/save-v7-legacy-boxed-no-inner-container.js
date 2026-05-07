import classnames from 'classnames';

import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

import save from '../save';

/**
 * Deprecated (2026-03-09):
 * Boxed (`size: container`) used to serialize the container background on the
 * outer wrapper, without an inner `.container` wrapper.
 *
 * Kept to avoid validation errors for existing content.
 */
export default function saveV7LegacyBoxedNoInnerContainer( props ) {
    const { attributes, className } = props;
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
        containerMargin,
        containerPadding,
        rowTextColor,
    } = attributes;

    // Only handle boxed legacy markup here; for other sizes, use the
    // current save implementation (unchanged for those cases).
    let defaultSize = size;
    if (
        defaultSize !== 'container' &&
        defaultSize !== 'container-fluid' &&
        defaultSize !== 'container-content-boxed'
    ) {
        defaultSize = 'container';
    }
    if ( defaultSize !== 'container' ) {
        return save( props );
    }

    const containerBackgroundColorClass = containerBackgroundColor
        ? getColorClassName( 'background-color', containerBackgroundColor )
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

    let classes = classnames( className, {
        container: true,
        'is-hidden-desktop': !! hideOnDesktop,
        'is-hidden-tablet': !! hideOnTablet,
        'is-hidden-mobile': !! hideOnMobile,
        'madeit-block-content--frontend': true,
        [ `are-vertically-aligned-${ verticalAlignment }` ]: !! verticalAlignment,
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
        attributes.containerBackgroundGradient || { gradient: '' };
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

    if (
        typeof overflow === 'string' &&
        overflow.length > 0 &&
        overflow !== 'visible'
    ) {
        style.overflow = overflow;
    }

    // Responsive min-height via CSS variables.
    if ( typeof minHeight === 'number' ) {
        style['--madeit-min-height-desktop'] = `${ minHeight }${
            minHeightUnit || 'px'
        }`;
    }
    if ( typeof minHeightTablet === 'number' ) {
        style['--madeit-min-height-tablet'] = `${ minHeightTablet }${
            minHeightUnitTablet || minHeightUnit || 'px'
        }`;
    }
    if ( typeof minHeightMobile === 'number' ) {
        style['--madeit-min-height-mobile'] = `${ minHeightMobile }${
            minHeightUnitMobile ||
            minHeightUnitTablet ||
            minHeightUnit ||
            'px'
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

    // Responsive flex-direction via CSS variables (only if explicitly set).
    if ( typeof flexDirection === 'string' && flexDirection.length > 0 ) {
        style['--madeit-flex-direction-desktop'] = flexDirection;
    }
    if (
        typeof flexDirectionTablet === 'string' &&
        flexDirectionTablet.length > 0
    ) {
        style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
    }
    if (
        typeof flexDirectionMobile === 'string' &&
        flexDirectionMobile.length > 0
    ) {
        style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
    }

    if ( typeof alignItems === 'string' && alignItems.length > 0 ) {
        style['--madeit-align-items-desktop'] = alignItems;
    }
    if ( typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0 ) {
        style['--madeit-align-items-tablet'] = alignItemsTablet;
    }
    if ( typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0 ) {
        style['--madeit-align-items-mobile'] = alignItemsMobile;
    }

    if ( typeof justifyContent === 'string' && justifyContent.length > 0 ) {
        style['--madeit-justify-content-desktop'] = justifyContent;
    }
    if (
        typeof justifyContentTablet === 'string' &&
        justifyContentTablet.length > 0
    ) {
        style['--madeit-justify-content-tablet'] = justifyContentTablet;
    }
    if (
        typeof justifyContentMobile === 'string' &&
        justifyContentMobile.length > 0
    ) {
        style['--madeit-justify-content-mobile'] = justifyContentMobile;
    }

    if ( typeof flexWrap === 'string' && flexWrap.length > 0 ) {
        style['--madeit-flex-wrap-desktop'] = flexWrap;
    }
    if ( typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0 ) {
        style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
    }
    if ( typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0 ) {
        style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
    }

    if ( containerMargin !== undefined && containerMargin.top !== undefined ) {
        style.marginTop = containerMargin.top;
    }
    if ( containerMargin !== undefined && containerMargin.bottom !== undefined ) {
        style.marginBottom = containerMargin.bottom;
    }
    if ( containerMargin !== undefined && containerMargin.left !== undefined ) {
        style.marginLeft = containerMargin.left;
        style['--margin-left-desktop'] = containerMargin.left;
    }
    if ( containerMargin !== undefined && containerMargin.right !== undefined ) {
        style.marginRight = containerMargin.right;
        style['--margin-right-desktop'] = containerMargin.right;
    }
    if ( containerPadding !== undefined && containerPadding.top !== undefined ) {
        style.paddingTop = containerPadding.top;
    }
    if (
        containerPadding !== undefined &&
        containerPadding.bottom !== undefined
    ) {
        style.paddingBottom = containerPadding.bottom;
    }
    if ( containerPadding !== undefined && containerPadding.left !== undefined ) {
        style.paddingLeft = containerPadding.left;
    }
    if (
        containerPadding !== undefined &&
        containerPadding.right !== undefined
    ) {
        style.paddingRight = containerPadding.right;
    }

    // Apply row text color inline only when no class exists.
    if ( ! rowTextColorClass ) {
        style.color = rowTextColorClass;
    }

    const blockProps = useBlockProps.save( {
        className: classes,
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

    const dirDesktop =
        typeof flexDirection === 'string' && flexDirection.length > 0
            ? flexDirection
            : 'row';
    const dirTablet =
        typeof flexDirectionTablet === 'string' &&
        flexDirectionTablet.length > 0
            ? flexDirectionTablet
            : undefined;
    const dirMobile =
        typeof flexDirectionMobile === 'string' &&
        flexDirectionMobile.length > 0
            ? flexDirectionMobile
            : undefined;

    const hasEnhancedRowWrapper =
        Number.isFinite( columnsCount ) ||
        ( typeof flexDirection === 'string' && flexDirection.length > 0 ) ||
        ( typeof flexDirectionTablet === 'string' &&
            flexDirectionTablet.length > 0 ) ||
        ( typeof flexDirectionMobile === 'string' &&
            flexDirectionMobile.length > 0 );

    const rowsCount = Number.isFinite( columnsCount ) ? columnsCount : 0;
    const rowClassName = hasEnhancedRowWrapper
        ? `row madeit-container-row rows-${ rowsCount }`
        : 'row';
    const rowProps = hasEnhancedRowWrapper
        ? {
                className: rowClassName,
                'data-madeit-dir': dirDesktop,
                'data-madeit-dir-tablet': dirTablet,
                'data-madeit-dir-mobile': dirMobile,
            }
        : {
                className: rowClassName,
            };

    return (
        <HtmlTag { ...blockProps }>
            <div { ...rowProps }>
                { '\n\n' }
                <InnerBlocks.Content />
                { '\n\n' }
            </div>
        </HtmlTag>
    );
}

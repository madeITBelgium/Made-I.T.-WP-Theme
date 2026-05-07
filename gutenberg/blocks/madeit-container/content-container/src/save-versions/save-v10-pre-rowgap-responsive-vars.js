import classnames from 'classnames';

import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

/**
 * Deprecated version (pre rowGap responsive vars):
 * - Only the desktop row-gap var was serialized (tablet/mobile ignored)
 * - Inner row wrapper did not include newline whitespace in all cases
 */
export default function saveV10PreRowGapResponsiveVars( props ) {
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
        // rowGapTablet/rowGapMobile existed as attributes but were not serialized.
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

    const computedBackgroundType =
        backgroundType ||
        ( containerBackgroundImage?.url ||
        containerBackgroundColor ||
        customContainerBackgroundColor
            ? 'classic'
            : 'transparent' );

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
        [ FRONTEND_WRAPPER_CLASS ]: true,
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
            computedBackgroundType === 'transparent'
                ? 'transparent'
                : containerBackgroundColorClass
                    ? undefined
                    : customContainerBackgroundColor,
    };

    const computedContainerBackgroundPosition =
        typeof containerBackgroundPosition === 'string' &&
        containerBackgroundPosition.length > 0
            ? containerBackgroundPosition
            : 'center center';
    const computedContainerBackgroundRepeat =
        typeof containerBackgroundRepeat === 'string' &&
        containerBackgroundRepeat.length > 0
            ? containerBackgroundRepeat
            : 'no-repeat';
    const computedContainerBackgroundSize =
        typeof containerBackgroundSize === 'string' &&
        containerBackgroundSize.length > 0
            ? containerBackgroundSize
            : 'cover';

    if ( computedBackgroundType === 'classic' && containerBackgroundImage?.url ) {
        style.backgroundImage = `url(${ containerBackgroundImage.url })`;
        style.backgroundPosition = computedContainerBackgroundPosition;
        style.backgroundRepeat = computedContainerBackgroundRepeat;
        style.backgroundSize = computedContainerBackgroundSize;
    }

    // Historic: gradient support may not have been used here; keep compatible.
    if ( computedBackgroundType === 'gradient' ) {
        const computedBackgroundGradient =
            props.attributes?.containerBackgroundGradient || {
                gradient: 'var(--wp--preset--gradient--color-and-background)',
            };
        if ( computedBackgroundGradient?.gradient ) {
            style.backgroundImage = computedBackgroundGradient.gradient;
        }
    }

    if ( overflow ) {
        style.overflow = overflow;
    }

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

    // Historic: only desktop row-gap was serialized.
    if ( typeof rowGap === 'number' ) {
        style['--madeit-row-gap-desktop'] = `${ rowGap }${ rowGapUnit || 'px' }`;
    }

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

    if ( containerMargin !== undefined && containerMargin.top !== undefined ) {
        style.marginTop = containerMargin.top;
    }
    if ( containerMargin !== undefined && containerMargin.bottom !== undefined ) {
        style.marginBottom = containerMargin.bottom;
    }
    if ( containerMargin !== undefined && containerMargin.left !== undefined ) {
        style.marginLeft = containerMargin.left;
    }
    if ( containerMargin !== undefined && containerMargin.right !== undefined ) {
        style.marginRight = containerMargin.right;
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

    const shouldWrapContent =
        outerSizeNormalized !== 'container' &&
        hasContentWidth &&
        contentWidthNormalized !== outerSizeNormalized;

    const HtmlTag = htmlTag || 'div';
    const blockProps = useBlockProps.save( {
        className: classes,
        style,
    } );

    const rowProps = {
        className: `row madeit-container-row rows-${ columnsCount || 0 }`,
        'data-madeit-dir': flexDirection || 'row',
        'data-madeit-dir-tablet': flexDirectionTablet || undefined,
        'data-madeit-dir-mobile': flexDirectionMobile || undefined,
    };

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
                    <div { ...rowProps }>
                        <InnerBlocks.Content />
                    </div>
                </div>
            </HtmlTag>
        );
    }

    return (
        <HtmlTag { ...blockProps }>
            <div { ...rowProps }>
                <InnerBlocks.Content />
            </div>
        </HtmlTag>
    );
}

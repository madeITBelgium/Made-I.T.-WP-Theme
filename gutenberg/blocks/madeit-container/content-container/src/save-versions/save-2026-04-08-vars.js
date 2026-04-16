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
 * Deprecated save (2026-04-08): responsive spacing via CSS variables.
 *
 * This is the first responsive implementation that stored desktop/tablet/mobile
 * spacing entirely as CSS variables (no inline margin/padding properties).
 * Kept to avoid block validation errors if content was saved in that window.
 */
export default function save20260408Vars( props ) {
    const {
        wrapperClassName,
        directRowClassName,
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
        containerMarginTablet,
        containerMarginMobile,
        containerPadding,
        containerPaddingTablet,
        containerPaddingMobile,
        containerPaddingOnRow,
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

    const { className } = props;

    const containerBackgroundColorClass = containerBackgroundColor
        ? getColorClassName( 'background-color', containerBackgroundColor )
        : undefined;
    const rowBackgroundColorClass = rowBackgroundColor
        ? getColorClassName( 'background-color', rowBackgroundColor )
        : undefined;
    const rowTextColorClass = rowTextColor
        ? getColorClassName( 'color', rowTextColor )
        : undefined;

    const hasClassicBackground =
        !! ( containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor );
    const computedBackgroundType = backgroundType || ( hasClassicBackground ? 'classic' : undefined );

    var classes = className;
    var classesChild = '';

    var defaultSize = size;
    if ( defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed' ) {
        defaultSize = 'container';
    }

    const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';

    const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
    const hasWrapperClassNameFromMarkup =
        typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0;
    const wrapperHasFrontendClass =
        hasWrapperClassNameFromMarkup &&
        wrapperClassName.split( /\s+/ ).includes( FRONTEND_WRAPPER_CLASS );

    const shouldUseLegacyWrapperClasses =
        hasWrapperClassNameFromMarkup && ! wrapperHasFrontendClass;

    const shouldUseLegacyBoxedMarkup =
        defaultSize === 'container' &&
        hasWrapperClassNameFromMarkup &&
        ! wrapperHasFrontendClass;

    const hasDirectRowWrapper =
        typeof directRowClassName === 'string' && directRowClassName.trim().length > 0;

    const applyContainerBackgroundToInner =
        defaultSize === 'container' &&
        ! shouldUseLegacyBoxedMarkup &&
        ! hasDirectRowWrapper;
    const hasContentWidth = typeof contentWidth === 'string' && contentWidth.length > 0;
    const contentWidthResolvedRaw = hasContentWidth
        ? contentWidth
        : defaultSize === 'container-content-boxed'
            ? 'container'
            : outerSizeNormalized;
    let contentWidthNormalized =
        contentWidthResolvedRaw === 'container-fluid' ? 'container-fluid' : 'container';

    if ( outerSizeNormalized === 'container' ) {
        contentWidthNormalized = 'container';
    }

    classes = classnames( classes, {
        container: 'container' === defaultSize,
        'container-fluid':
            'container-fluid' === defaultSize || 'container-content-boxed' === defaultSize,
        'is-hidden-desktop': !! hideOnDesktop,
        'is-hidden-tablet': !! hideOnTablet,
        'is-hidden-mobile': !! hideOnMobile,
        'madeit-block-content--frontend': ! shouldUseLegacyWrapperClasses,
    } );

    if ( defaultSize !== 'container-content-boxed' ) {
        classes = classnames( classes, {
            [ `are-vertically-aligned-${ verticalAlignment }` ]:
                verticalAlignment && defaultSize !== 'container-content-boxed',
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
        [ rowTextColorClass ]: rowTextColorClass,
    } );

    if ( applyContainerBackgroundToInner ) {
        classesChild = classnames( classesChild, {
            'has-background': containerBackgroundColorClass,
            [ containerBackgroundColorClass ]: containerBackgroundColorClass,
        } );
    } else {
        classes = classnames( classes, {
            'has-background': containerBackgroundColorClass,
            [ containerBackgroundColorClass ]: containerBackgroundColorClass,
        } );
    }

    const containerBackgroundStyle = {
        backgroundColor:
            backgroundType === 'transparent'
                ? 'transparent'
                : containerBackgroundColorClass
                    ? undefined
                    : customContainerBackgroundColor,
    };

    var style = {};

    const toCssLength = ( value, unit = 'px' ) => {
        if ( typeof value === 'number' && Number.isFinite( value ) ) {
            return `${ value }${ unit || 'px' }`;
        }

        if ( typeof value !== 'string' ) {
            return undefined;
        }

        const trimmed = value.trim();
        if ( trimmed === '' ) {
            return undefined;
        }

        if ( /^-?\d+(?:\.\d+)?$/.test( trimmed ) ) {
            return `${ trimmed }${ unit || 'px' }`;
        }

        if ( /^-?\d+(?:\.\d+)?[a-z%]+$/i.test( trimmed ) ) {
            return trimmed;
        }

        return undefined;
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
        containerBackgroundStyle.backgroundImage = `url(${ containerBackgroundImage.url })`;
        if ( hasBackgroundPosition ) {
            containerBackgroundStyle.backgroundPosition = containerBackgroundPosition;
        }
        if ( hasBackgroundRepeat ) {
            containerBackgroundStyle.backgroundRepeat = containerBackgroundRepeat;
        }
        if ( hasBackgroundSize ) {
            containerBackgroundStyle.backgroundSize = containerBackgroundSize;
        }
    }

    if ( computedBackgroundType === 'gradient' && computedBackgroundGradientValue ) {
        containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
    }

    if ( ! applyContainerBackgroundToInner ) {
        style = { ...style, ...containerBackgroundStyle };
    }

    if ( typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible' ) {
        style.overflow = overflow;
    }

    const minHeightDesktopCss = toCssLength( minHeight, minHeightUnit || 'px' );
    if ( minHeightDesktopCss !== undefined ) {
        style['--madeit-min-height-desktop'] = minHeightDesktopCss;
    }
    const minHeightTabletCss = toCssLength(
        minHeightTablet,
        minHeightUnitTablet || minHeightUnit || 'px'
    );
    if ( minHeightTabletCss !== undefined ) {
        style['--madeit-min-height-tablet'] = minHeightTabletCss;
    }
    const minHeightMobileCss = toCssLength(
        minHeightMobile,
        minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px'
    );
    if ( minHeightMobileCss !== undefined ) {
        style['--madeit-min-height-mobile'] = minHeightMobileCss;
    }

    if ( typeof maxWidth === 'number' ) {
        style['--madeit-max-width-desktop'] = `${ maxWidth }${ maxWidthUnit || 'px' }`;
    }
    if ( typeof maxWidthTablet === 'number' ) {
        style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }`;
    }
    if ( typeof maxWidthMobile === 'number' ) {
        style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }`;
    }

    const hasRowGapDesktop = typeof rowGap === 'number';
    if ( hasRowGapDesktop ) {
        const rowGapDesktopCss = `${ rowGap }${ rowGapUnit || 'px' }`;
        if ( rowGapDesktopCss !== '20px' ) {
            style['--madeit-row-gap-desktop'] = rowGapDesktopCss;
        }

        if ( typeof rowGapTablet === 'number' ) {
            const rowGapTabletCss = `${ rowGapTablet }${ rowGapUnitTablet || 'px' }`;
            if ( rowGapTabletCss !== '20px' ) {
                style['--madeit-row-gap-tablet'] = rowGapTabletCss;
            }
        }
        if ( typeof rowGapMobile === 'number' ) {
            const rowGapMobileCss = `${ rowGapMobile }${ rowGapUnitMobile || 'px' }`;
            if ( rowGapMobileCss !== '20px' ) {
                style['--madeit-row-gap-mobile'] = rowGapMobileCss;
            }
        }
    }

    if (
        typeof flexDirection === 'string' &&
        flexDirection.length > 0 &&
        flexDirection !== 'row'
    ) {
        style['--madeit-flex-direction-desktop'] = flexDirection;
    }
    if (
        typeof flexDirectionTablet === 'string' &&
        flexDirectionTablet.length > 0 &&
        flexDirectionTablet !== 'column'
    ) {
        style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
    }
    if (
        typeof flexDirectionMobile === 'string' &&
        flexDirectionMobile.length > 0 &&
        flexDirectionMobile !== 'column'
    ) {
        style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
    }

    if (
        typeof alignItems === 'string' &&
        alignItems.length > 0 &&
        alignItems !== 'stretch'
    ) {
        style['--madeit-align-items-desktop'] = alignItems;
    }
    if ( typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0 ) {
        style['--madeit-align-items-tablet'] = alignItemsTablet;
    }
    if ( typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0 ) {
        style['--madeit-align-items-mobile'] = alignItemsMobile;
    }

    if (
        typeof justifyContent === 'string' &&
        justifyContent.length > 0 &&
        justifyContent !== 'flex-start'
    ) {
        style['--madeit-justify-content-desktop'] = justifyContent;
    }
    if ( typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0 ) {
        style['--madeit-justify-content-tablet'] = justifyContentTablet;
    }
    if ( typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0 ) {
        style['--madeit-justify-content-mobile'] = justifyContentMobile;
    }

    if (
        typeof flexWrap === 'string' &&
        flexWrap.length > 0 &&
        flexWrap !== 'nowrap'
    ) {
        style['--madeit-flex-wrap-desktop'] = flexWrap;
    }
    if ( typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0 ) {
        style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
    }
    if ( typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0 ) {
        style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
    }

    const setCssVarIfDefined = ( targetStyle, key, value ) => {
        if ( value === undefined || value === null ) return;
        if ( typeof value !== 'string' ) return;
        const trimmed = value.trim();
        if ( trimmed === '' ) return;
        targetStyle[ key ] = trimmed;
    };

    const setSpacingVars = ( targetStyle, prefix, spacing, breakpoint ) => {
        if ( ! spacing || typeof spacing !== 'object' ) return;

        setCssVarIfDefined( targetStyle, `--${ prefix }-top-${ breakpoint }`, spacing.top );
        setCssVarIfDefined( targetStyle, `--${ prefix }-right-${ breakpoint }`, spacing.right );
        setCssVarIfDefined( targetStyle, `--${ prefix }-bottom-${ breakpoint }`, spacing.bottom );
        setCssVarIfDefined( targetStyle, `--${ prefix }-left-${ breakpoint }`, spacing.left );
    };

    if ( containerMargin && typeof containerMargin === 'object' ) {
        setCssVarIfDefined( style, '--madeit-container-margin-top-desktop', containerMargin.top );
        setCssVarIfDefined( style, '--madeit-container-margin-bottom-desktop', containerMargin.bottom );
    }
    if ( containerMarginTablet && typeof containerMarginTablet === 'object' ) {
        setCssVarIfDefined( style, '--madeit-container-margin-top-tablet', containerMarginTablet.top );
        setCssVarIfDefined( style, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom );
    }
    if ( containerMarginMobile && typeof containerMarginMobile === 'object' ) {
        setCssVarIfDefined( style, '--madeit-container-margin-top-mobile', containerMarginMobile.top );
        setCssVarIfDefined( style, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom );
    }

    const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;

    const rowStyle = {};
    if ( shouldApplyContainerPaddingOnRow ) {
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPadding, 'desktop' );
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile' );
    } else {
        setSpacingVars( style, 'madeit-container-padding', containerPadding, 'desktop' );
        setSpacingVars( style, 'madeit-container-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( style, 'madeit-container-padding', containerPaddingMobile, 'mobile' );
    }

    var styleChild = {};
    if ( defaultSize === 'container-content-boxed' ) {
        classesChild = classnames( classesChild, {
            'has-text-color': rowTextColor !== undefined,
            'has-background': rowBackgroundColor !== undefined,
            [ rowBackgroundColorClass ]: rowBackgroundColor !== undefined,
            [ rowTextColorClass ]: rowTextColor !== undefined,
        } );

        styleChild = {
            backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
            color: rowTextColorClass ? undefined : rowTextColorClass,
        };

        if ( rowMargin !== undefined && rowMargin.top !== undefined ) {
            styleChild.marginTop = rowMargin.top;
        }
        if ( rowMargin !== undefined && rowMargin.bottom !== undefined ) {
            styleChild.marginBottom = rowMargin.bottom;
        }
        if ( rowMargin !== undefined && rowMargin.left !== undefined ) {
            styleChild.marginLeft = rowMargin.left;
        }
        if ( rowMargin !== undefined && rowMargin.right !== undefined ) {
            styleChild.marginRight = rowMargin.right;
        }
        if ( rowPadding !== undefined && rowPadding.top !== undefined ) {
            styleChild.paddingTop = rowPadding.top;
        }
        if ( rowPadding !== undefined && rowPadding.bottom !== undefined ) {
            styleChild.paddingBottom = rowPadding.bottom;
        }
        if ( rowPadding !== undefined && rowPadding.left !== undefined ) {
            styleChild.paddingLeft = rowPadding.left;
        }
        if ( rowPadding !== undefined && rowPadding.right !== undefined ) {
            styleChild.paddingRight = rowPadding.right;
        }
    } else {
        style.color = rowTextColorClass ? undefined : rowTextColorClass;

        if ( applyContainerBackgroundToInner ) {
            styleChild = { ...styleChild, ...containerBackgroundStyle };
        }
    }

    const blockProps = useBlockProps.save( {
        className: classes,
        style: style,
    } );

    const allowedHtmlTags = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];
    const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

    const dirDesktop =
        typeof flexDirection === 'string' && flexDirection.length > 0
            ? flexDirection
            : 'row';
    const dirTablet =
        typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0
            ? flexDirectionTablet
            : undefined;
    const dirMobile =
        typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0
            ? flexDirectionMobile
            : undefined;

    const hasEnhancedRowWrapper =
        Number.isFinite( columnsCount ) ||
        ( typeof flexDirection === 'string' && flexDirection.length > 0 ) ||
        ( typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ) ||
        ( typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 );

    const rowsCount = Number.isFinite( columnsCount ) ? columnsCount : 0;
    const rowClassName = hasEnhancedRowWrapper
        ? `row madeit-container-row rows-${ rowsCount }`
        : 'row';
    const baseRowProps = hasEnhancedRowWrapper
        ? {
            className: rowClassName,
            'data-madeit-dir': dirDesktop,
            'data-madeit-dir-tablet': dirTablet,
            'data-madeit-dir-mobile': dirMobile,
        }
        : {
            className: rowClassName,
        };

    const hasRowStyle = Object.keys( rowStyle ).length > 0;
    const outerRowProps = hasRowStyle ? { ...baseRowProps, style: rowStyle } : baseRowProps;
    const innerRowProps = baseRowProps;

    if ( size === 'container-content-boxed' ) {
        return (
            <HtmlTag { ...blockProps }>
                <div { ...outerRowProps }>
                    <div className="col">
                        <div className={ classesChild } style={ styleChild }>
                            <div { ...innerRowProps }>
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

    if ( hasDirectRowWrapper ) {
        return (
            <HtmlTag { ...blockProps }>
                <div { ...outerRowProps }>
                    { '\n\n' }
                    <InnerBlocks.Content />
                    { '\n\n' }
                </div>
            </HtmlTag>
        );
    }

    const shouldWrapContent =
        outerSizeNormalized !== 'container' &&
        hasContentWidth &&
        contentWidthNormalized !== outerSizeNormalized;

    if ( applyContainerBackgroundToInner ) {
        return (
            <HtmlTag { ...blockProps }>
                <div className={ classesChild } style={ styleChild }>
                    <div { ...outerRowProps }>
                        { '\n\n' }
                        <InnerBlocks.Content />
                        { '\n\n' }
                    </div>
                </div>
            </HtmlTag>
        );
    }

    if ( shouldWrapContent ) {
        return (
            <HtmlTag { ...blockProps }>
                <div
                    className={ classnames( {
                        container: contentWidthNormalized === 'container',
                        'container-fluid': contentWidthNormalized === 'container-fluid',
                    } ) }
                >
                    <div { ...outerRowProps }>
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
            <div { ...outerRowProps }>
                { '\n\n' }
                <InnerBlocks.Content />
                { '\n\n' }
            </div>
        </HtmlTag>
    );
}

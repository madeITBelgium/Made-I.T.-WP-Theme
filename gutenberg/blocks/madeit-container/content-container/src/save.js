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
        containerPadding,
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
    
    const {
        className
    } = props

    // NOTE: Historically this block was saved without additional wrapper classes
    // and without layout-related inline CSS vars. To avoid block validation
    // failures on legacy/pasted content, we only serialize “enhanced” markup
    // when the corresponding attributes are explicitly set.
    
    const containerBackgroundColorClass = containerBackgroundColor ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;
	const rowBackgroundColorClass = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
	const rowTextColorClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;

    const hasClassicBackground =
        !! ( containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor );
    const computedBackgroundType = backgroundType || ( hasClassicBackground ? 'classic' : undefined );
    
    var classes = className;
    var classesChild = '';
    
    
    var defaultSize = size;
    if(defaultSize !== 'container' && defaultSize !== 'container-fluid' && defaultSize !== 'container-content-boxed') {
        defaultSize = 'container';
    }

    const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';

    const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
    const hasWrapperClassNameFromMarkup =
        typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0;
    const wrapperHasFrontendClass =
        hasWrapperClassNameFromMarkup &&
        wrapperClassName.split( /\s+/ ).includes( FRONTEND_WRAPPER_CLASS );

    // General legacy compatibility:
    // Older saved content may not include the frontend wrapper class at all
    // (regardless of `size`). When we can detect that from parsed markup,
    // we must not inject the class in `save()`, otherwise block validation
    // fails and the editor shows recovery prompts.
    const shouldUseLegacyWrapperClasses =
        hasWrapperClassNameFromMarkup && ! wrapperHasFrontendClass;

    // Legacy boxed markup (the one throwing validation errors):
    // - Wrapper did NOT include `madeit-block-content--frontend`
    // - `.row` was a direct child of the wrapper (no inner `.container`)
    // We only switch to legacy serialization when we can positively detect
    // legacy markup from the stored HTML (wrapperClassName derived attr).
    const shouldUseLegacyBoxedMarkup =
        defaultSize === 'container' &&
        hasWrapperClassNameFromMarkup &&
        ! wrapperHasFrontendClass;

    // Keep the old direct-row detector as a secondary hint (some HTML parsers
    // won't support :scope selectors), but do not rely on it as the primary
    // switch.
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
		[ 'madeit-block-content--frontend' ]: ! shouldUseLegacyWrapperClasses,
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
    
    // Text color stays on the outer wrapper so it inherits everywhere.
    classes = classnames( classes, {
        'has-text-color': rowTextColorClass,
        [ rowTextColorClass ]: rowTextColorClass,
    } );

    // Container background should live on the inner container when the block
    // is boxed, so padding/margins on the wrapper don't get painted.
    // BUT: legacy boxed markup had no inner container wrapper, so in that case
    // we keep the background on the outer wrapper for validation compatibility.
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

        // Plain number string: treat as the number + provided unit.
        if ( /^-?\d+(?:\.\d+)?$/.test( trimmed ) ) {
            return `${ trimmed }${ unit || 'px' }`;
        }

        // Number with explicit unit (legacy): accept it as-is.
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

    // Apply overflow to outer wrapper (avoid serializing default `visible`).
    if ( typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible' ) {
        style.overflow = overflow;
    }

    // Responsive min-height via CSS variables.
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
        // Row gap via CSS variables.
        // Important for block validation stability: only serialize tablet/mobile overrides
        // when a desktop rowGap is explicitly set.
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
    if ( typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ) {
        style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
    }
    if ( typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ) {
        style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
    }

    // Responsive align-items / justify-content via CSS variables (only if explicitly set).
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
    if ( typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0 ) {
        style['--madeit-justify-content-tablet'] = justifyContentTablet;
    }
    if ( typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0 ) {
        style['--madeit-justify-content-mobile'] = justifyContentMobile;
    }

    // Responsive flex-wrap via CSS variables (only if explicitly set).
    if ( typeof flexWrap === 'string' && flexWrap.length > 0 ) {
        style['--madeit-flex-wrap-desktop'] = flexWrap;
    }
    if ( typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0 ) {
        style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
    }
    if ( typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0 ) {
        style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
    }
    
    if(containerMargin !== undefined && containerMargin.top !== undefined) {
        style.marginTop = containerMargin.top;
    }
    if(containerMargin !== undefined && containerMargin.bottom !== undefined) {
        style.marginBottom = containerMargin.bottom;
    }
    /*
    if(containerMargin !== undefined && containerMargin.left !== undefined) {
        style.marginLeft = containerMargin.left;
        style['--margin-left-desktop'] = containerMargin.left;
    }
    if(containerMargin !== undefined && containerMargin.right !== undefined) {
        style.marginRight = containerMargin.right;
        style['--margin-right-desktop'] = containerMargin.right;
    }
        */

    const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;

    // Legacy compatibility: existing content may have containerPadding serialized
    // on the outer wrapper. Keep doing that unless explicitly migrated.
    if ( ! shouldApplyContainerPaddingOnRow ) {
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
    }

    // New behaviour: apply containerPadding on `.madeit-container-row`.
    const rowStyle = {};
    if ( shouldApplyContainerPaddingOnRow ) {
        if(containerPadding !== undefined && containerPadding.top !== undefined ) {
            rowStyle.paddingTop = containerPadding.top;
        }
        if(containerPadding !== undefined && containerPadding.bottom !== undefined) {
            rowStyle.paddingBottom = containerPadding.bottom;
        }
        if(containerPadding !== undefined && containerPadding.left !== undefined) {
            rowStyle.paddingLeft = containerPadding.left;
        }
        if(containerPadding !== undefined && containerPadding.right !== undefined) {
            rowStyle.paddingRight = containerPadding.right;
        }
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
        if(rowMargin !== undefined && rowMargin.left !== undefined) {
            styleChild.marginLeft = rowMargin.left;
        }
        if(rowMargin !== undefined && rowMargin.right !== undefined) {
            styleChild.marginRight = rowMargin.right;
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
    
    if(size === 'container-content-boxed') {
        return (
            <HtmlTag { ...blockProps }>
                <div { ...outerRowProps }>
                    <div className="col">
                        <div className={ classesChild }
                            style = {styleChild}>
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
    else {
        // Legacy markup: some older saved content had `.row` directly under the
        // wrapper (no inner `.container`). When detected via `directRowClassName`
        // (derived from stored HTML), serialize the same structure to avoid
        // block validation errors.
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
}
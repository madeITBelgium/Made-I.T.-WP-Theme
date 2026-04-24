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
        wrapperStyle,
        directRowClassName,
        boxedInnerContainerClassName,
        boxedInnerRowClassName,
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
        madeitHasUserEdits,
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
    
    const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
    const classNameRaw = typeof className === 'string' ? className.trim() : '';
    const extraClassName = classNameRaw
        ? classNameRaw
                .split( /\s+/ )
                .filter( Boolean )
                // Strip classes that are controlled by this block's save() so
                // legacy parsing doesn't accidentally re-inject them and cause
                // validation mismatches (e.g. `container` + `container-fluid`).
                .filter( ( token ) => {
                    if ( token === 'wp-block-madeit-block-content' ) return false;
                    if ( token === 'container' || token === 'container-fluid' ) return false;
                    if ( token === FRONTEND_WRAPPER_CLASS ) return false;
                    if ( token === 'has-text-color' || token === 'has-background' ) return false;
                    if ( token.startsWith( 'are-vertically-aligned-' ) ) return false;
                    if ( token.startsWith( 'is-hidden-' ) ) return false;
                    return true;
                } )
                .join( ' ' )
        : '';

    var classes = classnames( 'wp-block-madeit-block-content', extraClassName );
    var classesChild = '';
    
    
    const hasExplicitSize = typeof size === 'string' && size.trim().length > 0;

    var defaultSize = hasExplicitSize ? size.trim() : undefined;
    if (
        defaultSize !== 'container' &&
        defaultSize !== 'container-fluid' &&
        defaultSize !== 'container-content-boxed'
    ) {
        defaultSize = undefined;
    }

    const wrapperClassNameRaw =
        typeof wrapperClassName === 'string' ? wrapperClassName.trim() : '';
    const wrapperTokens = wrapperClassNameRaw.length
        ? wrapperClassNameRaw.split( /\s+/ )
        : [];
    const wrapperHasContainer = wrapperTokens.includes( 'container' );
    const wrapperHasContainerFluid = wrapperTokens.includes( 'container-fluid' );

    // Legacy compatibility (default drift / missing serialized attributes):
    // Only override based on wrapper classes when it helps match stored markup
    // for content that parses with defaults.
    if ( defaultSize === 'container-content-boxed' ) {
        // Old content saved as `.container` should not be forced into boxed.
        if ( wrapperHasContainer && ! wrapperHasContainerFluid ) {
            defaultSize = 'container';
        }
    } else {
        // If our inferred size differs from the wrapper markup, correct it.
        if ( wrapperHasContainerFluid && ! wrapperHasContainer ) {
            defaultSize = 'container-fluid';
        } else if ( wrapperHasContainer && ! wrapperHasContainerFluid ) {
            defaultSize = 'container';
        }
    }

    // Fallback default when neither attributes nor markup specify a size.
    if ( ! defaultSize ) {
        defaultSize = 'container';
    }

    const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';

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
        hasWrapperClassNameFromMarkup && ! wrapperHasFrontendClass && ! madeitHasUserEdits;

    // Very old saved content (no frontend wrapper class) also did not include
    // the enhanced layout-related CSS variables. To keep block validation
    // stable, do not serialize these vars for that legacy markup.
    const shouldSerializeEnhancedLayoutVars = ! shouldUseLegacyWrapperClasses;

    // Compatibility: some historical versions stored only a subset of the
    // `--madeit-*` CSS vars even when the attributes existed. When we can read
    // the stored `style` attribute (via derived `wrapperStyle`), only serialize
    // vars that were present in the original markup to avoid validation errors.
    const wrapperStyleRaw = typeof wrapperStyle === 'string' ? wrapperStyle : '';
    const wrapperStyleNormalized = wrapperStyleRaw.replace( /\s+/g, '' );
    const shouldMatchWrapperStyleVars = wrapperStyleNormalized.length > 0 && ! madeitHasUserEdits;

    // Defaults from the block's default variation (`madeit-default-responsive`).
    // These are provided via CSS on `.madeit-block-content--frontend`, so we
    // should NOT serialize them inline (doing so causes validation drift for
    // older posts that had no `style` attribute).
    const DEFAULT_ROW_GAP = 20;
    const DEFAULT_FLEX_DIRECTION_DESKTOP = 'row';
    const DEFAULT_FLEX_DIRECTION_TABLET = 'column';
    const DEFAULT_FLEX_DIRECTION_MOBILE = 'column';
    const DEFAULT_ALIGN_ITEMS_DESKTOP = 'stretch';
    const DEFAULT_JUSTIFY_CONTENT_DESKTOP = 'flex-start';
    const DEFAULT_FLEX_WRAP_DESKTOP = 'nowrap';

    const escapeRegExp = ( value ) =>
        String( value ).replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );

    const wrapperHadVar = ( varName ) =>
        shouldMatchWrapperStyleVars &&
        wrapperStyleNormalized.includes( `${ varName }:` );

    const getWrapperVarValue = ( varName ) => {
        if ( ! shouldMatchWrapperStyleVars ) return undefined;
        const pattern = new RegExp(
            `${ escapeRegExp( varName ) }:([^;]+)`
        );
        const match = wrapperStyleNormalized.match( pattern );
        return match?.[ 1 ];
    };

    const maybeSetVar = ( targetStyle, varName, value ) => {
        if ( shouldMatchWrapperStyleVars && ! wrapperHadVar( varName ) ) return;
        if ( value === undefined || value === null ) return;
        targetStyle[ varName ] = value;
    };

    // Legacy boxed markup (the one throwing validation errors):
    // - Wrapper did NOT include `madeit-block-content--frontend`
    // - `.row` was a direct child of the wrapper (no inner `.container`)
    // We only switch to legacy serialization when we can positively detect
    // legacy markup from the stored HTML (wrapperClassName derived attr).
    const shouldUseLegacyBoxedMarkup =
        defaultSize === 'container' &&
        hasWrapperClassNameFromMarkup &&
        ! wrapperHasFrontendClass &&
        ! madeitHasUserEdits;

    // Keep the old direct-row detector as a secondary hint (some HTML parsers
    // won't support :scope selectors), but do not rely on it as the primary
    // switch.
    const hasDirectRowWrapper =
        typeof directRowClassName === 'string' && directRowClassName.trim().length > 0;

    const hasLegacyBoxedInnerRowWrapper =
        typeof boxedInnerRowClassName === 'string' &&
        boxedInnerRowClassName.trim().length > 0;

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
    maybeSetVar(
        style,
        '--madeit-min-height-desktop',
        minHeightDesktopCss !== undefined
            ? minHeightDesktopCss
            : getWrapperVarValue( '--madeit-min-height-desktop' )
    );
    const minHeightTabletCss = toCssLength(
        minHeightTablet,
        minHeightUnitTablet || minHeightUnit || 'px'
    );
    maybeSetVar(
        style,
        '--madeit-min-height-tablet',
        minHeightTabletCss !== undefined
            ? minHeightTabletCss
            : getWrapperVarValue( '--madeit-min-height-tablet' )
    );
    const minHeightMobileCss = toCssLength(
        minHeightMobile,
        minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px'
    );
    maybeSetVar(
        style,
        '--madeit-min-height-mobile',
        minHeightMobileCss !== undefined
            ? minHeightMobileCss
            : getWrapperVarValue( '--madeit-min-height-mobile' )
    );

    // Responsive max-width via CSS variables.
    maybeSetVar(
        style,
        '--madeit-max-width-desktop',
        typeof maxWidth === 'number'
            ? `${ maxWidth }${ maxWidthUnit || 'px' }`
            : getWrapperVarValue( '--madeit-max-width-desktop' )
    );
    maybeSetVar(
        style,
        '--madeit-max-width-tablet',
        typeof maxWidthTablet === 'number'
            ? `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }`
            : getWrapperVarValue( '--madeit-max-width-tablet' )
    );
    maybeSetVar(
        style,
        '--madeit-max-width-mobile',
        typeof maxWidthMobile === 'number'
            ? `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }`
            : getWrapperVarValue( '--madeit-max-width-mobile' )
    );

     // Responsive row-gap via CSS variables.
        // Row gap via CSS variables.
        // Important for block validation stability: only serialize tablet/mobile overrides
        // when a desktop rowGap is explicitly set.
        if ( shouldSerializeEnhancedLayoutVars ) {
            const hasRowGapDesktop = typeof rowGap === 'number';
            if ( hasRowGapDesktop ) {
                const rowGapDesktopCss = `${ rowGap }${ rowGapUnit || 'px' }`;
                const shouldEmitRowGapDesktop = shouldMatchWrapperStyleVars
                    ? wrapperHadVar( '--madeit-row-gap-desktop' )
                    : rowGap !== DEFAULT_ROW_GAP;

                if ( shouldEmitRowGapDesktop ) {
                    maybeSetVar( style, '--madeit-row-gap-desktop', rowGapDesktopCss );
                }

                const shouldEmitRowGapTablet = shouldMatchWrapperStyleVars
                    ? wrapperHadVar( '--madeit-row-gap-tablet' )
                    : typeof rowGapTablet === 'number' &&
                      rowGapTablet !== DEFAULT_ROW_GAP;
                if ( shouldEmitRowGapTablet ) {
                    const rowGapTabletCss = `${ rowGapTablet }${ rowGapUnitTablet || 'px' }`;
                    maybeSetVar( style, '--madeit-row-gap-tablet', rowGapTabletCss );
                }

                const shouldEmitRowGapMobile = shouldMatchWrapperStyleVars
                    ? wrapperHadVar( '--madeit-row-gap-mobile' )
                    : typeof rowGapMobile === 'number' &&
                      rowGapMobile !== DEFAULT_ROW_GAP;
                if ( shouldEmitRowGapMobile ) {
                    const rowGapMobileCss = `${ rowGapMobile }${ rowGapUnitMobile || 'px' }`;
                    maybeSetVar( style, '--madeit-row-gap-mobile', rowGapMobileCss );
                }
            } else {
                // Only restore vars from stored markup when present.
                if ( shouldMatchWrapperStyleVars ) {
                    maybeSetVar(
                        style,
                        '--madeit-row-gap-desktop',
                        getWrapperVarValue( '--madeit-row-gap-desktop' )
                    );
                    maybeSetVar(
                        style,
                        '--madeit-row-gap-tablet',
                        getWrapperVarValue( '--madeit-row-gap-tablet' )
                    );
                    maybeSetVar(
                        style,
                        '--madeit-row-gap-mobile',
                        getWrapperVarValue( '--madeit-row-gap-mobile' )
                    );
                }
            }
        }

    // Responsive flex-direction via CSS variables.
    if ( shouldSerializeEnhancedLayoutVars ) {
        const shouldEmitFlexDirDesktop = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-flex-direction-desktop' )
            : typeof flexDirection === 'string' &&
              flexDirection.length > 0 &&
              flexDirection !== DEFAULT_FLEX_DIRECTION_DESKTOP;
        if ( shouldEmitFlexDirDesktop ) {
            maybeSetVar( style, '--madeit-flex-direction-desktop', flexDirection );
        }

        const shouldEmitFlexDirTablet = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-flex-direction-tablet' )
            : typeof flexDirectionTablet === 'string' &&
              flexDirectionTablet.length > 0 &&
              flexDirectionTablet !== DEFAULT_FLEX_DIRECTION_TABLET;
        if ( shouldEmitFlexDirTablet ) {
            maybeSetVar(
                style,
                '--madeit-flex-direction-tablet',
                flexDirectionTablet
            );
        }

        const shouldEmitFlexDirMobile = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-flex-direction-mobile' )
            : typeof flexDirectionMobile === 'string' &&
              flexDirectionMobile.length > 0 &&
              flexDirectionMobile !== DEFAULT_FLEX_DIRECTION_MOBILE;
        if ( shouldEmitFlexDirMobile ) {
            maybeSetVar(
                style,
                '--madeit-flex-direction-mobile',
                flexDirectionMobile
            );
        }
    }

    // Responsive align-items / justify-content via CSS variables.
    if ( shouldSerializeEnhancedLayoutVars ) {
        const shouldEmitAlignDesktop = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-align-items-desktop' )
            : typeof alignItems === 'string' &&
              alignItems.length > 0 &&
              alignItems !== DEFAULT_ALIGN_ITEMS_DESKTOP;
        if ( shouldEmitAlignDesktop ) {
            maybeSetVar( style, '--madeit-align-items-desktop', alignItems );
        }

        const shouldEmitAlignTablet = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-align-items-tablet' )
            : typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0;
        if ( shouldEmitAlignTablet ) {
            maybeSetVar( style, '--madeit-align-items-tablet', alignItemsTablet );
        }

        const shouldEmitAlignMobile = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-align-items-mobile' )
            : typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0;
        if ( shouldEmitAlignMobile ) {
            maybeSetVar( style, '--madeit-align-items-mobile', alignItemsMobile );
        }

        const shouldEmitJustifyDesktop = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-justify-content-desktop' )
            : typeof justifyContent === 'string' &&
              justifyContent.length > 0 &&
              justifyContent !== DEFAULT_JUSTIFY_CONTENT_DESKTOP;
        if ( shouldEmitJustifyDesktop ) {
            maybeSetVar(
                style,
                '--madeit-justify-content-desktop',
                justifyContent
            );
        }

        const shouldEmitJustifyTablet = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-justify-content-tablet' )
            : typeof justifyContentTablet === 'string' &&
              justifyContentTablet.length > 0;
        if ( shouldEmitJustifyTablet ) {
            maybeSetVar(
                style,
                '--madeit-justify-content-tablet',
                justifyContentTablet
            );
        }

        const shouldEmitJustifyMobile = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-justify-content-mobile' )
            : typeof justifyContentMobile === 'string' &&
              justifyContentMobile.length > 0;
        if ( shouldEmitJustifyMobile ) {
            maybeSetVar(
                style,
                '--madeit-justify-content-mobile',
                justifyContentMobile
            );
        }
    }

    // Responsive flex-wrap via CSS variables.
    if ( shouldSerializeEnhancedLayoutVars ) {
        const shouldEmitWrapDesktop = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-flex-wrap-desktop' )
            : typeof flexWrap === 'string' &&
              flexWrap.length > 0 &&
              flexWrap !== DEFAULT_FLEX_WRAP_DESKTOP;
        if ( shouldEmitWrapDesktop ) {
            maybeSetVar( style, '--madeit-flex-wrap-desktop', flexWrap );
        }

        const shouldEmitWrapTablet = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-flex-wrap-tablet' )
            : typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0;
        if ( shouldEmitWrapTablet ) {
            maybeSetVar( style, '--madeit-flex-wrap-tablet', flexWrapTablet );
        }

        const shouldEmitWrapMobile = shouldMatchWrapperStyleVars
            ? wrapperHadVar( '--madeit-flex-wrap-mobile' )
            : typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0;
        if ( shouldEmitWrapMobile ) {
            maybeSetVar( style, '--madeit-flex-wrap-mobile', flexWrapMobile );
        }
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

        setCssVarIfDefined(
            targetStyle,
            `--${ prefix }-top-${ breakpoint }`,
            spacing.top
        );
        setCssVarIfDefined(
            targetStyle,
            `--${ prefix }-right-${ breakpoint }`,
            spacing.right
        );
        setCssVarIfDefined(
            targetStyle,
            `--${ prefix }-bottom-${ breakpoint }`,
            spacing.bottom
        );
        setCssVarIfDefined(
            targetStyle,
            `--${ prefix }-left-${ breakpoint }`,
            spacing.left
        );
    };

    // Desktop margin stays as inline style for backward compatibility.
    // Tablet/mobile overrides are stored as CSS variables (overriding inline via
    // `!important` rules in the stylesheet when set).
    if ( containerMargin && typeof containerMargin === 'object' ) {
        if ( containerMargin.top !== undefined ) {
            style.marginTop = containerMargin.top;
        }
        if ( containerMargin.bottom !== undefined ) {
            style.marginBottom = containerMargin.bottom;
        }
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

    // Desktop padding stays as inline style for backward compatibility.
    // Tablet/mobile overrides are stored as CSS variables.
    const rowStyle = {};
    if ( shouldApplyContainerPaddingOnRow ) {
        if ( containerPadding && typeof containerPadding === 'object' ) {
            if ( containerPadding.top !== undefined ) rowStyle.paddingTop = containerPadding.top;
            if ( containerPadding.right !== undefined ) rowStyle.paddingRight = containerPadding.right;
            if ( containerPadding.bottom !== undefined ) rowStyle.paddingBottom = containerPadding.bottom;
            if ( containerPadding.left !== undefined ) rowStyle.paddingLeft = containerPadding.left;
        }

        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile' );
    } else {
        if ( containerPadding && typeof containerPadding === 'object' ) {
            if ( containerPadding.top !== undefined ) style.paddingTop = containerPadding.top;
            if ( containerPadding.right !== undefined ) style.paddingRight = containerPadding.right;
            if ( containerPadding.bottom !== undefined ) style.paddingBottom = containerPadding.bottom;
            if ( containerPadding.left !== undefined ) style.paddingLeft = containerPadding.left;
        }

        setSpacingVars( style, 'madeit-container-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( style, 'madeit-container-padding', containerPaddingMobile, 'mobile' );
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
    
    const hasStyleProps = Object.keys( style ).length > 0;
    const blockProps = useBlockProps.save( {
        className: classes,
        style: hasStyleProps ? style : undefined,
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
    
    if ( defaultSize === 'container-content-boxed' ) {
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
        // Legacy boxed inner structure (row > col > container > row).
        // If detected from stored markup, serialize the exact same wrapper
        // structure so Gutenberg validation can succeed.
        if ( hasLegacyBoxedInnerRowWrapper && defaultSize !== 'container-content-boxed' ) {
            const innerContainerClassFromMarkup =
                typeof boxedInnerContainerClassName === 'string' &&
                boxedInnerContainerClassName.trim().length > 0
                    ? boxedInnerContainerClassName.trim()
                    : 'container';

            const innerRowClassFromMarkup =
                typeof boxedInnerRowClassName === 'string' &&
                boxedInnerRowClassName.trim().length > 0
                    ? boxedInnerRowClassName.trim()
                    : innerRowProps.className;

            const innerRowPropsFromMarkup = {
                ...innerRowProps,
                className: innerRowClassFromMarkup,
            };

            return (
                <HtmlTag { ...blockProps }>
                    <div { ...outerRowProps }>
                        <div className="col">
                            <div className={ innerContainerClassFromMarkup }>
                                <div { ...innerRowPropsFromMarkup }>
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
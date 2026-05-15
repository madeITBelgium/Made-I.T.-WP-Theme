/**
 * saveV0 — Geen inner container div + inline margin/padding
 *
 * Structuur:
 *   <HtmlTag class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend ...">
 *     <div class="row ...">          ← GEEN inner container div
 *       <InnerBlocks />
 *     </div>
 *   </HtmlTag>
 *
 * Verschil met huidige save:
 * - Geen <div class="container|container-fluid"> tussen HtmlTag en .row
 * - margin/padding als directe inline stijlen (marginTop, paddingTop, ...)
 *   in plaats van CSS-variabelen
 * - Alle CSS-vars aanwezig (row-gap desktop+tablet+mobile, flex-direction, etc.)
 */

import classnames from 'classnames';
import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
const ALLOWED_HTML_TAGS = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];

function setCssVar( targetStyle, key, value ) {
    if ( value === undefined || value === null ) return;
    if ( typeof value === 'number' && Number.isFinite( value ) ) {
        targetStyle[ key ] = `${ value }px`;
        return;
    }
    if ( typeof value !== 'string' ) return;
    const trimmed = value.trim();
    if ( trimmed ) targetStyle[ key ] = trimmed;
}

function toCssLength( value, unit = 'px' ) {
    if ( typeof value === 'number' && Number.isFinite( value ) ) return `${ value }${ unit || 'px' }`;
    if ( typeof value !== 'string' ) return undefined;
    const trimmed = value.trim();
    if ( trimmed === '' ) return undefined;
    if ( /^-?\d+(?:\.\d+)?$/.test( trimmed ) )         return `${ trimmed }${ unit || 'px' }`;
    if ( /^-?\d+(?:\.\d+)?[a-z%]+$/i.test( trimmed ) ) return trimmed;
    return undefined;
}

function setSpacingVars( targetStyle, prefix, spacing, breakpoint ) {
    if ( ! spacing || typeof spacing !== 'object' ) return;
    const { top, right, bottom, left } = spacing;
    const hasAnyValue = [ top, right, bottom, left ].some(
        ( v ) => v !== undefined && v !== null && String( v ).trim() !== ''
    );
    if ( ! hasAnyValue ) return;
    const fallback = ( v ) => ( v === undefined || v === null || String( v ).trim() === '' ) ? '0px' : v;
    setCssVar( targetStyle, `--${ prefix }-top-${ breakpoint }`,    fallback( top ) );
    setCssVar( targetStyle, `--${ prefix }-right-${ breakpoint }`,  fallback( right ) );
    setCssVar( targetStyle, `--${ prefix }-bottom-${ breakpoint }`, fallback( bottom ) );
    setCssVar( targetStyle, `--${ prefix }-left-${ breakpoint }`,   fallback( left ) );
}

function filterExtraClasses( className ) {
    if ( typeof className !== 'string' || ! className.trim() ) return '';
    return className.trim()
        .split( /\s+/ )
        .filter( Boolean )
        .filter( ( token ) => {
            if ( token === 'wp-block-madeit-block-content' ) return false;
            if ( token === 'container' || token === 'container-fluid' ) return false;
            if ( token === FRONTEND_WRAPPER_CLASS ) return false;
            if ( token === 'has-text-color' || token === 'has-background' ) return false;
            if ( token.startsWith( 'are-vertically-aligned-' ) ) return false;
            if ( token.startsWith( 'is-hidden-' ) ) return false;
            return true;
        } )
        .join( ' ' );
}

function buildBackgroundStyle( attributes ) {
    const {
        backgroundType, containerBackgroundColor, customContainerBackgroundColor,
        containerBackgroundImage, containerBackgroundPosition, containerBackgroundRepeat,
        containerBackgroundSize, containerBackgroundGradient,
    } = attributes;

    const hasClassicBackground = !! ( containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor );
    const computedBackgroundType = backgroundType || ( hasClassicBackground ? 'classic' : undefined );
    const containerBgClass = containerBackgroundColor
        ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;

    const style = {
        backgroundColor:
            backgroundType === 'transparent' ? 'transparent'
            : containerBgClass ? undefined
            : customContainerBackgroundColor,
    };

    if ( computedBackgroundType === 'classic' && containerBackgroundImage?.url ) {
        style.backgroundImage = `url(${ containerBackgroundImage.url })`;
        if ( containerBackgroundPosition ) style.backgroundPosition = containerBackgroundPosition;
        if ( containerBackgroundRepeat )   style.backgroundRepeat   = containerBackgroundRepeat;
        if ( containerBackgroundSize )     style.backgroundSize     = containerBackgroundSize;
    }

    const gradientValue =
        typeof containerBackgroundGradient?.gradient === 'string' &&
        containerBackgroundGradient.gradient.trim().length > 0
            ? containerBackgroundGradient.gradient : undefined;

    if ( computedBackgroundType === 'gradient' && gradientValue ) {
        style.backgroundImage = gradientValue;
    }

    return style;
}

export default function save( props ) {
    const { attributes, className } = props;

    const containerBgClass = attributes.containerBackgroundColor
        ? getColorClassName( 'background-color', attributes.containerBackgroundColor ) : undefined;
    const rowTextClass = attributes.rowTextColor
        ? getColorClassName( 'color', attributes.rowTextColor ) : undefined;

    const customClassNames = [
        typeof attributes.className === 'string' && attributes.className.trim() ? attributes.className.trim() : '',
        typeof className === 'string' && className.trim() ? className.trim() : '',
    ].filter( Boolean ).join( ' ' );
    const extraClass = filterExtraClasses( customClassNames );

    const { hideOnDesktop, hideOnTablet, hideOnMobile } = attributes;

    const wrapperClass = classnames(
        'wp-block-madeit-block-content',
        'container-fluid',
        FRONTEND_WRAPPER_CLASS,
        extraClass,
        {
            'is-hidden-desktop': !! hideOnDesktop,
            'is-hidden-tablet':  !! hideOnTablet,
            'is-hidden-mobile':  !! hideOnMobile,
            'has-text-color':    !! rowTextClass,
            [ rowTextClass ]:     !! rowTextClass,
            'has-background':    !! containerBgClass,
            [ containerBgClass ]: !! containerBgClass,
        }
    );

    // ── Stijl: achtergrond + volledige CSS-vars + inline margin/padding ────────
    const backgroundStyle = buildBackgroundStyle( attributes );
    const {
        overflow,
        minHeight, minHeightUnit, minHeightTablet, minHeightUnitTablet, minHeightMobile, minHeightUnitMobile,
        maxWidth, maxWidthUnit, maxWidthTablet, maxWidthUnitTablet, maxWidthMobile, maxWidthUnitMobile,
        rowGap, rowGapUnit, rowGapTablet, rowGapUnitTablet, rowGapMobile, rowGapUnitMobile,
        flexDirection, flexDirectionTablet, flexDirectionMobile,
        alignItems, alignItemsTablet, alignItemsMobile,
        justifyContent, justifyContentTablet, justifyContentMobile,
        flexWrap, flexWrapTablet, flexWrapMobile,
        containerMargin, containerPadding, containerPaddingOnRow,
    } = attributes;

    const wrapperStyle = { ...backgroundStyle };

    if ( typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible' ) {
        wrapperStyle.overflow = overflow;
    }

    const minHeightDesktopV = toCssLength( minHeight, minHeightUnit || 'px' );
    const minHeightTabletVV = toCssLength( minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px' );
    const minHeightMobileVV = toCssLength( minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px' );
    if ( minHeightDesktopV ) setCssVar( wrapperStyle, '--madeit-min-height-desktop', minHeightDesktopV );
    if ( minHeightTabletVV ) setCssVar( wrapperStyle, '--madeit-min-height-tablet',  minHeightTabletVV );
    if ( minHeightMobileVV ) setCssVar( wrapperStyle, '--madeit-min-height-mobile',  minHeightMobileVV );

    if ( typeof maxWidth === 'number' )
        setCssVar( wrapperStyle, '--madeit-max-width-desktop', `${ maxWidth }${ maxWidthUnit || 'px' }` );
    if ( typeof maxWidthTablet === 'number' )
        setCssVar( wrapperStyle, '--madeit-max-width-tablet', `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }` );
    if ( typeof maxWidthMobile === 'number' )
        setCssVar( wrapperStyle, '--madeit-max-width-mobile', `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }` );

    if ( typeof rowGap === 'number' ) {
        setCssVar( wrapperStyle, '--madeit-row-gap-desktop', `${ rowGap }${ rowGapUnit || 'px' }` );
        if ( typeof rowGapTablet === 'number' )
            setCssVar( wrapperStyle, '--madeit-row-gap-tablet', `${ rowGapTablet }${ rowGapUnitTablet || 'px' }` );
        if ( typeof rowGapMobile === 'number' )
            setCssVar( wrapperStyle, '--madeit-row-gap-mobile', `${ rowGapMobile }${ rowGapUnitMobile || 'px' }` );
    }

    if ( typeof flexDirection === 'string' && flexDirection.length > 0 )
        setCssVar( wrapperStyle, '--madeit-flex-direction-desktop', flexDirection );
    if ( typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 )
        setCssVar( wrapperStyle, '--madeit-flex-direction-tablet', flexDirectionTablet );
    if ( typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 )
        setCssVar( wrapperStyle, '--madeit-flex-direction-mobile', flexDirectionMobile );

    if ( typeof alignItems === 'string' && alignItems.length > 0 )
        setCssVar( wrapperStyle, '--madeit-align-items-desktop', alignItems );
    if ( typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0 )
        setCssVar( wrapperStyle, '--madeit-align-items-tablet', alignItemsTablet );
    if ( typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0 )
        setCssVar( wrapperStyle, '--madeit-align-items-mobile', alignItemsMobile );

    if ( typeof justifyContent === 'string' && justifyContent.length > 0 )
        setCssVar( wrapperStyle, '--madeit-justify-content-desktop', justifyContent );
    if ( typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0 )
        setCssVar( wrapperStyle, '--madeit-justify-content-tablet', justifyContentTablet );
    if ( typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0 )
        setCssVar( wrapperStyle, '--madeit-justify-content-mobile', justifyContentMobile );

    if ( typeof flexWrap === 'string' && flexWrap.length > 0 )
        setCssVar( wrapperStyle, '--madeit-flex-wrap-desktop', flexWrap );
    if ( typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0 )
        setCssVar( wrapperStyle, '--madeit-flex-wrap-tablet', flexWrapTablet );
    if ( typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0 )
        setCssVar( wrapperStyle, '--madeit-flex-wrap-mobile', flexWrapMobile );

    // Margin: INLINE stijlen (oud formaat)
    if ( containerMargin && typeof containerMargin === 'object' ) {
        if ( containerMargin.top    !== undefined ) wrapperStyle.marginTop    = containerMargin.top;
        if ( containerMargin.bottom !== undefined ) wrapperStyle.marginBottom = containerMargin.bottom;
    }

    // Padding op wrapper: INLINE stijlen (oud formaat)
    if ( containerPaddingOnRow !== true && containerPadding && typeof containerPadding === 'object' ) {
        if ( containerPadding.top    !== undefined ) wrapperStyle.paddingTop    = containerPadding.top;
        if ( containerPadding.right  !== undefined ) wrapperStyle.paddingRight  = containerPadding.right;
        if ( containerPadding.bottom !== undefined ) wrapperStyle.paddingBottom = containerPadding.bottom;
        if ( containerPadding.left   !== undefined ) wrapperStyle.paddingLeft   = containerPadding.left;
    }

    const hasStyleProps = Object.keys( wrapperStyle ).length > 0;
    const blockProps = useBlockProps.save( {
        className: wrapperClass,
        style: hasStyleProps ? wrapperStyle : undefined,
    } );

    const HtmlTag = ALLOWED_HTML_TAGS.includes( attributes.htmlTag ) ? attributes.htmlTag : 'div';

    const { columnsCount } = attributes;
    const dirDesktop = typeof flexDirection      === 'string' && flexDirection.length      > 0 ? flexDirection      : 'row';
    const dirTablet  = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
    const dirMobile  = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;

    const hasEnhancedRowWrapper =
        Number.isFinite( columnsCount ) ||
        ( typeof flexDirection      === 'string' && flexDirection.length      > 0 ) ||
        ( typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ) ||
        ( typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 );

    const rowsCount   = Number.isFinite( columnsCount ) ? columnsCount : 0;
    const rowClassName = hasEnhancedRowWrapper ? `row madeit-container-row rows-${ rowsCount }` : 'row';

    const baseRowProps = hasEnhancedRowWrapper
        ? { className: rowClassName, 'data-madeit-dir': dirDesktop, 'data-madeit-dir-tablet': dirTablet, 'data-madeit-dir-mobile': dirMobile }
        : { className: rowClassName };

    // Padding op row: INLINE stijlen (oud formaat)
    const rowStyle = {};
    if ( containerPaddingOnRow === true && containerPadding && typeof containerPadding === 'object' ) {
        if ( containerPadding.top    !== undefined ) rowStyle.paddingTop    = containerPadding.top;
        if ( containerPadding.right  !== undefined ) rowStyle.paddingRight  = containerPadding.right;
        if ( containerPadding.bottom !== undefined ) rowStyle.paddingBottom = containerPadding.bottom;
        if ( containerPadding.left   !== undefined ) rowStyle.paddingLeft   = containerPadding.left;
    }

    // ── OUD: padding op row als CSS-vars (tussen inline en nieuwe save) ───────
    if ( containerPaddingOnRow === true && containerPadding && typeof containerPadding === 'object' ) {
        const { containerPaddingTablet, containerPaddingMobile } = attributes;
        // Alleen als er GEEN inline waarden zijn, maar wel CSS-var waarden
        if ( Object.keys( rowStyle ).length === 0 ) {
            setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPadding,       'desktop' );
            setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet' );
            setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile' );
        }
    }

    const hasRowStyleProps = Object.keys( rowStyle ).length > 0;
    const outerRowProps = hasRowStyleProps ? { ...baseRowProps, style: rowStyle } : baseRowProps;

    // GEEN inner container div — .row direct onder HtmlTag
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
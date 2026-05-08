/**
 * save.js — madeit-block-content
 *
 * STRUCTUUR VAN DE OUTPUT
 * ────────────────────────
 * De HtmlTag is ALTIJD container-fluid (de outer wrapper).
 * De size-instelling (container / container-fluid) bepaalt de INNER div, niet de outer.
 *
 * <HtmlTag class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend {color?}" style="{bg?}">
 *   <div class="{container | container-fluid}">
 *     <div class="row ...">
 *       <InnerBlocks />
 *     </div>
 *   </div>
 * </HtmlTag>
 *
 * MARKUP-VARIANTEN:
 *   A. container-content-boxed  → inner div = container, met extra boxed child
 *   B. Legacy boxed inner row   → row > col > container > row
 *   C. Legacy direct row        → geen inner container div
 *   D. Standaard                → inner div = container of container-fluid op basis van `size`
 */

// ─── 1. Imports ──────────────────────────────────────────────────────────────

import classnames from 'classnames';
import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

// ─── 2. Constanten ───────────────────────────────────────────────────────────

/** CSS-klasse die alleen op de frontend-wrapper staat (niet in de editor). */
const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';

/** HTML-tags die toegestaan zijn als wrapper-element. */
const ALLOWED_HTML_TAGS = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];

// ─── 3. Hulpfuncties ─────────────────────────────────────────────────────────

/**
 * Zet een numerieke of string-waarde om naar een geldige CSS-lengte.
 */
function toCssLength( value, unit = 'px' ) {
    if ( typeof value === 'number' && Number.isFinite( value ) ) {
        return `${ value }${ unit || 'px' }`;
    }
    if ( typeof value !== 'string' ) return undefined;
    const trimmed = value.trim();
    if ( trimmed === '' ) return undefined;
    if ( /^-?\d+(?:\.\d+)?$/.test( trimmed ) )         return `${ trimmed }${ unit || 'px' }`;
    if ( /^-?\d+(?:\.\d+)?[a-z%]+$/i.test( trimmed ) ) return trimmed;
    return undefined;
}

/**
 * Schrijft één CSS-variabele naar een stijl-object.
 */
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

/**
 * Filtert de `className`-prop van de block zodat klassen die door save()
 * zelf worden beheerd niet dubbel verschijnen.
 */
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

// ─── 4. Stijl-opbouw helpers ──────────────────────────────────────────────────

/**
 * Voegt responsieve spacing (margin of padding) toe aan een stijl-object via CSS-vars.
 */
function setSpacingVars( targetStyle, prefix, spacing, breakpoint ) {
    if ( ! spacing || typeof spacing !== 'object' ) return;
    const { top, right, bottom, left } = spacing;
    const hasAnyValue = [ top, right, bottom, left ].some(
        ( v ) => v !== undefined && v !== null && String( v ).trim() !== ''
    );
    if ( ! hasAnyValue ) return;
    const fallback = ( v ) =>
        ( v === undefined || v === null || String( v ).trim() === '' ) ? '0px' : v;
    setCssVar( targetStyle, `--${ prefix }-top-${ breakpoint }`,    fallback( top ) );
    setCssVar( targetStyle, `--${ prefix }-right-${ breakpoint }`,  fallback( right ) );
    setCssVar( targetStyle, `--${ prefix }-bottom-${ breakpoint }`, fallback( bottom ) );
    setCssVar( targetStyle, `--${ prefix }-left-${ breakpoint }`,   fallback( left ) );
}

/**
 * Maakt het stijl-object voor de achtergrond (kleur, afbeelding, gradient).
 */
function buildBackgroundStyle( attributes ) {
    const {
        backgroundType,
        containerBackgroundColor,
        customContainerBackgroundColor,
        containerBackgroundImage,
        containerBackgroundPosition,
        containerBackgroundRepeat,
        containerBackgroundSize,
        containerBackgroundGradient,
    } = attributes;

    const hasClassicBackground =
        !! ( containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor );
    const computedBackgroundType = backgroundType || ( hasClassicBackground ? 'classic' : undefined );

    const containerBgClass = containerBackgroundColor
        ? getColorClassName( 'background-color', containerBackgroundColor )
        : undefined;

    const style = {
        backgroundColor:
            backgroundType === 'transparent'
                ? 'transparent'
                : containerBgClass
                    ? undefined
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
            ? containerBackgroundGradient.gradient
            : undefined;

    if ( computedBackgroundType === 'gradient' && gradientValue ) {
        style.backgroundImage = gradientValue;
    }

    return style;
}

/**
 * Bouwt het volledige stijl-object voor de buitenste wrapper (HtmlTag).
 * De HtmlTag is ALTIJD container-fluid — size heeft hier geen effect op de klasse.
 * Stijlen: achtergrond, overflow, min-height, max-width, row-gap,
 *          flex-direction, align-items, justify-content, flex-wrap,
 *          container margin + padding (als niet op row).
 */
function buildWrapperStyle( attributes, backgroundStyle ) {
    const {
        overflow,
        minHeight, minHeightUnit, minHeightTablet, minHeightUnitTablet, minHeightMobile, minHeightUnitMobile,
        maxWidth, maxWidthUnit, maxWidthTablet, maxWidthUnitTablet, maxWidthMobile, maxWidthUnitMobile,
        rowGap, rowGapUnit, rowGapTablet, rowGapUnitTablet, rowGapMobile, rowGapUnitMobile,
        flexDirection, flexDirectionTablet, flexDirectionMobile,
        alignItems, alignItemsTablet, alignItemsMobile,
        justifyContent, justifyContentTablet, justifyContentMobile,
        flexWrap, flexWrapTablet, flexWrapMobile,
        containerMargin, containerMarginTablet, containerMarginMobile,
        containerPadding, containerPaddingTablet, containerPaddingMobile,
        containerPaddingOnRow,
    } = attributes;

    const style = {};

    // Achtergrond altijd op de wrapper.
    Object.assign( style, backgroundStyle );

    // Overflow (standaard 'visible' wordt niet geserialiseerd).
    if ( typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible' ) {
        style.overflow = overflow;
    }

    // ── Min-height ────────────────────────────────────────────────────────────
    const minHeightDesktop = toCssLength( minHeight, minHeightUnit || 'px' );
    const minHeightTabletV = toCssLength( minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px' );
    const minHeightMobileV = toCssLength( minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px' );
    if ( minHeightDesktop ) setCssVar( style, '--madeit-min-height-desktop', minHeightDesktop );
    if ( minHeightTabletV ) setCssVar( style, '--madeit-min-height-tablet',  minHeightTabletV );
    if ( minHeightMobileV ) setCssVar( style, '--madeit-min-height-mobile',  minHeightMobileV );

    // ── Max-width ─────────────────────────────────────────────────────────────
    if ( typeof maxWidth === 'number' )
        setCssVar( style, '--madeit-max-width-desktop', `${ maxWidth }${ maxWidthUnit || 'px' }` );
    if ( typeof maxWidthTablet === 'number' )
        setCssVar( style, '--madeit-max-width-tablet', `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }` );
    if ( typeof maxWidthMobile === 'number' )
        setCssVar( style, '--madeit-max-width-mobile', `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }` );

    // ── Row-gap ───────────────────────────────────────────────────────────────
    if ( typeof rowGap === 'number' ) {
        setCssVar( style, '--madeit-row-gap-desktop', `${ rowGap }${ rowGapUnit || 'px' }` );
        if ( typeof rowGapTablet === 'number' )
            setCssVar( style, '--madeit-row-gap-tablet', `${ rowGapTablet }${ rowGapUnitTablet || 'px' }` );
        if ( typeof rowGapMobile === 'number' )
            setCssVar( style, '--madeit-row-gap-mobile', `${ rowGapMobile }${ rowGapUnitMobile || 'px' }` );
    }

    // ── Flex-direction ────────────────────────────────────────────────────────
    if ( typeof flexDirection === 'string' && flexDirection.length > 0 )
        setCssVar( style, '--madeit-flex-direction-desktop', flexDirection );
    if ( typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 )
        setCssVar( style, '--madeit-flex-direction-tablet', flexDirectionTablet );
    if ( typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 )
        setCssVar( style, '--madeit-flex-direction-mobile', flexDirectionMobile );

    // ── Align-items ───────────────────────────────────────────────────────────
    if ( typeof alignItems === 'string' && alignItems.length > 0 )
        setCssVar( style, '--madeit-align-items-desktop', alignItems );
    if ( typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0 )
        setCssVar( style, '--madeit-align-items-tablet', alignItemsTablet );
    if ( typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0 )
        setCssVar( style, '--madeit-align-items-mobile', alignItemsMobile );

    // ── Justify-content ───────────────────────────────────────────────────────
    if ( typeof justifyContent === 'string' && justifyContent.length > 0 )
        setCssVar( style, '--madeit-justify-content-desktop', justifyContent );
    if ( typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0 )
        setCssVar( style, '--madeit-justify-content-tablet', justifyContentTablet );
    if ( typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0 )
        setCssVar( style, '--madeit-justify-content-mobile', justifyContentMobile );

    // ── Flex-wrap ─────────────────────────────────────────────────────────────
    if ( typeof flexWrap === 'string' && flexWrap.length > 0 )
        setCssVar( style, '--madeit-flex-wrap-desktop', flexWrap );
    if ( typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0 )
        setCssVar( style, '--madeit-flex-wrap-tablet', flexWrapTablet );
    if ( typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0 )
        setCssVar( style, '--madeit-flex-wrap-mobile', flexWrapMobile );

    // ── Container margin ──────────────────────────────────────────────────────
    if ( containerMargin && typeof containerMargin === 'object' ) {
        if ( containerMargin.top !== undefined )
            setCssVar( style, '--madeit-container-margin-top-desktop', containerMargin.top );
        if ( containerMargin.bottom !== undefined )
            setCssVar( style, '--madeit-container-margin-bottom-desktop', containerMargin.bottom );
    }
    if ( containerMarginTablet && typeof containerMarginTablet === 'object' ) {
        setCssVar( style, '--madeit-container-margin-top-tablet',    containerMarginTablet.top );
        setCssVar( style, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom );
    }
    if ( containerMarginMobile && typeof containerMarginMobile === 'object' ) {
        setCssVar( style, '--madeit-container-margin-top-mobile',    containerMarginMobile.top );
        setCssVar( style, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom );
    }

    // ── Container padding (op wrapper, niet op row) ───────────────────────────
    if ( containerPaddingOnRow !== true ) {
        setSpacingVars( style, 'madeit-container-padding', containerPadding,       'desktop' );
        setSpacingVars( style, 'madeit-container-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( style, 'madeit-container-padding', containerPaddingMobile, 'mobile' );
    }

    return style;
}

/**
 * Bouwt het stijl-object voor de `.row`-div.
 */
function buildRowStyle( attributes ) {
    const {
        containerPadding, containerPaddingTablet, containerPaddingMobile,
        containerPaddingOnRow,
    } = attributes;

    if ( containerPaddingOnRow !== true ) return {};

    const rowStyle = {};
    setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPadding,       'desktop' );
    setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet' );
    setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile' );
    return rowStyle;
}

/**
 * Bouwt het stijl-object voor het boxed child-element (alleen container-content-boxed).
 */
function buildChildStyle( attributes, defaultSize ) {
    if ( defaultSize !== 'container-content-boxed' ) return {};

    const { rowBackgroundColor, rowTextColor, rowMargin, rowPadding } = attributes;
    const styleChild = {};

    const rowBgClass   = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
    const rowTextClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;

    if ( ! rowBgClass )   styleChild.backgroundColor = rowBackgroundColor;
    if ( ! rowTextClass ) styleChild.color           = rowTextColor;

    const spacingProps = [
        [ rowMargin,   'margin' ],
        [ rowPadding,  'padding' ],
    ];
    for ( const [ spacing, prop ] of spacingProps ) {
        if ( spacing && typeof spacing === 'object' ) {
            if ( spacing.top    !== undefined ) styleChild[ `${ prop }Top` ]    = spacing.top;
            if ( spacing.right  !== undefined ) styleChild[ `${ prop }Right` ]  = spacing.right;
            if ( spacing.bottom !== undefined ) styleChild[ `${ prop }Bottom` ] = spacing.bottom;
            if ( spacing.left   !== undefined ) styleChild[ `${ prop }Left` ]   = spacing.left;
        }
    }

    return styleChild;
}

// ─── 5. Hoofd save()-functie ──────────────────────────────────────────────────

/**
 * Genereert de opgeslagen HTML voor het madeit-block-content block.
 *
 * STRUCTUUR (altijd):
 *
 *   <HtmlTag class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend ..." style="...">
 *     <div class="{container | container-fluid}">      ← bepaald door `size`
 *       <div class="row ...">
 *         <InnerBlocks />
 *       </div>
 *     </div>
 *   </HtmlTag>
 *
 * Uitzonderingen:
 *   A. container-content-boxed → inner div = container, met extra boxed wrapper
 *   B. Legacy boxed inner row  → row > col > container > row
 *   C. Legacy direct row       → geen inner div
 */
export default function save( props ) {
    const { attributes, className } = props;

    // ── Kleur-classes ──────────────────────────────────────────────────────────
    const containerBgClass = attributes.containerBackgroundColor
        ? getColorClassName( 'background-color', attributes.containerBackgroundColor )
        : undefined;
    const rowBgClass = attributes.rowBackgroundColor
        ? getColorClassName( 'background-color', attributes.rowBackgroundColor )
        : undefined;
    const rowTextClass = attributes.rowTextColor
        ? getColorClassName( 'color', attributes.rowTextColor )
        : undefined;

    // ── Size bepalen ───────────────────────────────────────────────────────────
    // `size` bepaalt de INNER div, NIET de outer HtmlTag.
    // De outer HtmlTag is altijd container-fluid.
    const rawSize = typeof attributes.size === 'string' ? attributes.size.trim() : '';
    const innerSize = [ 'container', 'container-fluid', 'container-content-boxed' ].includes( rawSize )
        ? rawSize
        : 'container'; // fallback

    // De klasse voor de inner div (tweede niveau):
    //   - container-content-boxed → inner div = 'container'
    //   - container               → inner div = 'container'
    //   - container-fluid         → inner div = 'container-fluid'
    const innerDivClass =
        innerSize === 'container-fluid'
            ? 'container-fluid'
            : 'container';

    // ── Stijlen bouwen ─────────────────────────────────────────────────────────
    const backgroundStyle = buildBackgroundStyle( attributes );
    const wrapperStyle    = buildWrapperStyle( attributes, backgroundStyle );
    const rowStyle        = buildRowStyle( attributes );
    const childStyle      = buildChildStyle( attributes, innerSize );

    // ── Klassen bouwen voor de outer HtmlTag ───────────────────────────────────
    const customClassNames = [
        typeof attributes.className === 'string' && attributes.className.trim() ? attributes.className.trim() : '',
        typeof className === 'string' && className.trim() ? className.trim() : '',
    ].filter( Boolean ).join( ' ' );
    const extraClass = filterExtraClasses( customClassNames );

    const { hideOnDesktop, hideOnTablet, hideOnMobile, verticalAlignment } = attributes;

    // De outer wrapper is ALTIJD container-fluid.
    // Tekstkleur erft overal via de wrapper.
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

    // ── Block props ────────────────────────────────────────────────────────────
    const hasStyleProps = Object.keys( wrapperStyle ).length > 0;
    const blockProps    = useBlockProps.save( {
        className: wrapperClass,
        style: hasStyleProps ? wrapperStyle : undefined,
    } );

    // Zorg dat onze wrapperClass altijd de basis vormt (geen dubbelen).
    // blockProps.className = classnames( wrapperClass, blockProps.className );

    // ── HTML-tag ───────────────────────────────────────────────────────────────
    const HtmlTag = ALLOWED_HTML_TAGS.includes( attributes.htmlTag ) ? attributes.htmlTag : 'div';

    // ── Row props ──────────────────────────────────────────────────────────────
    const { flexDirection, flexDirectionTablet, flexDirectionMobile, columnsCount } = attributes;
    const dirDesktop = typeof flexDirection       === 'string' && flexDirection.length       > 0 ? flexDirection       : 'row';
    const dirTablet  = typeof flexDirectionTablet  === 'string' && flexDirectionTablet.length  > 0 ? flexDirectionTablet  : undefined;
    const dirMobile  = typeof flexDirectionMobile  === 'string' && flexDirectionMobile.length  > 0 ? flexDirectionMobile  : undefined;

    const hasEnhancedRowWrapper =
        Number.isFinite( columnsCount ) ||
        ( typeof flexDirection       === 'string' && flexDirection.length       > 0 ) ||
        ( typeof flexDirectionTablet  === 'string' && flexDirectionTablet.length  > 0 ) ||
        ( typeof flexDirectionMobile  === 'string' && flexDirectionMobile.length  > 0 );

    const rowsCount   = Number.isFinite( columnsCount ) ? columnsCount : 0;
    const rowClassName = hasEnhancedRowWrapper
        ? `row madeit-container-row rows-${ rowsCount }`
        : 'row';

    const baseRowProps = hasEnhancedRowWrapper
        ? {
            className:                   rowClassName,
            'data-madeit-dir':           dirDesktop,
            'data-madeit-dir-tablet':    dirTablet,
            'data-madeit-dir-mobile':    dirMobile,
          }
        : { className: rowClassName };

    const hasRowStyleProps = Object.keys( rowStyle ).length > 0;
    const outerRowProps    = hasRowStyleProps ? { ...baseRowProps, style: rowStyle } : baseRowProps;

    // ── JSX renderen ───────────────────────────────────────────────────────────

    // VARIANT A: container-content-boxed
    // Inner div = 'container', plus extra boxed child wrapper.
    if ( innerSize === 'container-content-boxed' ) {
        const childBgClass = rowBgClass;
        const childClassNames = classnames( {
            [ `are-vertically-aligned-${ verticalAlignment }` ]: !! verticalAlignment,
            'has-background':  !! childBgClass || !! attributes.rowBackgroundColor,
            [ childBgClass ]:   !! childBgClass,
            'has-text-color':  !! rowTextClass,
            [ rowTextClass ]:   !! rowTextClass,
        } );

        return (
            <HtmlTag { ...blockProps }>
                <div className="container">
                    <div { ...outerRowProps }>
                        <div className="col">
                            <div className={ childClassNames } style={ childStyle }>
                                <div className={ rowClassName }>
                                    { '\n\n' }
                                    <InnerBlocks.Content />
                                    { '\n\n' }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </HtmlTag>
        );
    }

    // VARIANT B: legacy boxed inner row (row > col > container > row)
    if (
        typeof attributes.boxedInnerRowClassName === 'string' &&
        attributes.boxedInnerRowClassName.trim().length > 0
    ) {
        const innerContainerClass =
            typeof attributes.boxedInnerContainerClassName === 'string' &&
            attributes.boxedInnerContainerClassName.trim().length > 0
                ? attributes.boxedInnerContainerClassName.trim()
                : 'container';

        const innerRowClass = attributes.boxedInnerRowClassName.trim() || rowClassName;

        return (
            <HtmlTag { ...blockProps }>
                <div className={ innerDivClass }>
                    <div { ...outerRowProps }>
                        <div className="col">
                            <div className={ innerContainerClass }>
                                <div className={ innerRowClass }>
                                    { '\n\n' }
                                    <InnerBlocks.Content />
                                    { '\n\n' }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </HtmlTag>
        );
    }

    // VARIANT C: legacy direct row (geen inner container div)
    if (
        typeof attributes.directRowClassName === 'string' &&
        attributes.directRowClassName.trim().length > 0
    ) {
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

    // VARIANT D: standaard
    // HtmlTag = altijd container-fluid
    // Inner div = container of container-fluid op basis van `size`
    return (
        <HtmlTag { ...blockProps }>
            <div className={ innerDivClass }>
                <div { ...outerRowProps }>
                    { '\n\n' }
                    <InnerBlocks.Content />
                    { '\n\n' }
                </div>
            </div>
        </HtmlTag>
    );
}
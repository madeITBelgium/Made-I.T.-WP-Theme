/**
 * save.js — madeit-block-content
 *
 * OUTPUT STRUCTUUR (altijd):
 *
 *   <HtmlTag class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend ...">
 *     <div class="container | container-fluid">   ← bepaald door `size`
 *       <div class="row madeit-container-row rows-N" data-madeit-dir="...">
 *         <InnerBlocks />
 *       </div>
 *     </div>
 *   </HtmlTag>
 *
 * De outer HtmlTag is ALTIJD container-fluid.
 * De inner div = container of container-fluid op basis van het `size` attribuut.
 */

import classnames from 'classnames';
import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
const ALLOWED_HTML_TAGS = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];

function toCssLength( value, unit = 'px' ) {
    if ( typeof value === 'number' && Number.isFinite( value ) ) return `${ value }${ unit || 'px' }`;
    if ( typeof value !== 'string' ) return undefined;
    const t = value.trim();
    if ( ! t ) return undefined;
    if ( /^-?\d+(?:\.\d+)?$/.test( t ) )         return `${ t }${ unit || 'px' }`;
    if ( /^-?\d+(?:\.\d+)?[a-z%]+$/i.test( t ) ) return t;
    return undefined;
}

function setCssVar( s, k, v ) {
    if ( v === undefined || v === null ) return;
    if ( typeof v === 'number' && Number.isFinite( v ) ) { s[ k ] = `${ v }px`; return; }
    if ( typeof v !== 'string' ) return;
    const t = v.trim();
    if ( t ) s[ k ] = t;
}

function setSpacingVars( s, prefix, spacing, bp ) {
    if ( ! spacing || typeof spacing !== 'object' ) return;
    const { top, right, bottom, left } = spacing;
    if ( ! [ top, right, bottom, left ].some( v => v !== undefined && v !== null && String( v ).trim() ) ) return;
    const fb = v => ( v === undefined || v === null || ! String( v ).trim() ) ? '0px' : v;
    setCssVar( s, `--${ prefix }-top-${ bp }`,    fb( top ) );
    setCssVar( s, `--${ prefix }-right-${ bp }`,  fb( right ) );
    setCssVar( s, `--${ prefix }-bottom-${ bp }`, fb( bottom ) );
    setCssVar( s, `--${ prefix }-left-${ bp }`,   fb( left ) );
}

function filterExtraClasses( className ) {
    if ( typeof className !== 'string' || ! className.trim() ) return '';
    return className.trim().split( /\s+/ ).filter( Boolean ).filter( t => {
        if ( t === 'wp-block-madeit-block-content' ) return false;
        if ( t === 'container' || t === 'container-fluid' ) return false;
        if ( t === FRONTEND_WRAPPER_CLASS ) return false;
        // has-text-color en has-background worden verderop via wrapperClass
        // opnieuw correct gezet op basis van kleur-attributen — hier NIET filteren.
        if ( t.startsWith( 'are-vertically-aligned-' ) ) return false;
        if ( t.startsWith( 'is-hidden-' ) ) return false;
        return true;
    } ).join( ' ' );
}

function buildBackgroundStyle( attributes ) {
    const {
        backgroundType, containerBackgroundColor, customContainerBackgroundColor,
        containerBackgroundImage, containerBackgroundPosition, containerBackgroundRepeat,
        containerBackgroundSize, containerBackgroundGradient,
    } = attributes;

    const hasClassic = !! ( containerBackgroundImage?.url || containerBackgroundColor || customContainerBackgroundColor );
    const bgType = backgroundType || ( hasClassic ? 'classic' : undefined );
    const bgClass = containerBackgroundColor
        ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;

    const style = {
        backgroundColor:
            backgroundType === 'transparent' ? 'transparent'
            : bgClass ? undefined
            : customContainerBackgroundColor,
    };

    if ( bgType === 'classic' && containerBackgroundImage?.url ) {
        style.backgroundImage = `url(${ containerBackgroundImage.url })`;
        if ( containerBackgroundPosition ) style.backgroundPosition = containerBackgroundPosition;
        if ( containerBackgroundRepeat )   style.backgroundRepeat   = containerBackgroundRepeat;
        if ( containerBackgroundSize )     style.backgroundSize     = containerBackgroundSize;
    }

    const gradVal = typeof containerBackgroundGradient?.gradient === 'string' &&
        containerBackgroundGradient.gradient.trim()
            ? containerBackgroundGradient.gradient : undefined;
    if ( bgType === 'gradient' && gradVal ) style.backgroundImage = gradVal;

    return style;
}

export default function save( props ) {
    const { attributes, className } = props;

    // Kleur classes
    const containerBgClass = attributes.containerBackgroundColor
        ? getColorClassName( 'background-color', attributes.containerBackgroundColor ) : undefined;
    const rowTextClass = attributes.rowTextColor
        ? getColorClassName( 'color', attributes.rowTextColor ) : undefined;

    // Size → inner div klasse (outer is altijd container-fluid)
    const rawSize = typeof attributes.size === 'string' ? attributes.size.trim() : '';
    const size = rawSize === 'container-fluid' ? 'container-fluid' : 'container';
    const innerDivClass = size === 'container-fluid' ? 'container-fluid' : 'container';

    // Outer wrapper klassen
    const extraClass = filterExtraClasses( [
        typeof attributes.className === 'string' ? attributes.className : '',
        typeof className === 'string' ? className : '',
    ].filter( Boolean ).join( ' ' ) );

    const { hideOnDesktop, hideOnTablet, hideOnMobile } = attributes;

    const wrapperClass = classnames(
        'wp-block-madeit-block-content', 'container-fluid', FRONTEND_WRAPPER_CLASS, extraClass,
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

    // Wrapper stijl
    const bgStyle = buildBackgroundStyle( attributes );
    const {
        overflow,
        minHeight, minHeightUnit, minHeightTablet, minHeightUnitTablet, minHeightMobile, minHeightUnitMobile, minHeightCustom, minHeightCustomTablet, minHeightCustomMobile,
        maxWidth, maxWidthUnit, maxWidthTablet, maxWidthUnitTablet, maxWidthMobile, maxWidthUnitMobile, maxWidthCustom, maxWidthCustomTablet, maxWidthCustomMobile,
        rowGap, rowGapUnit, rowGapTablet, rowGapUnitTablet, rowGapMobile, rowGapUnitMobile,
        flexDirection, flexDirectionTablet, flexDirectionMobile,
        alignItems, alignItemsTablet, alignItemsMobile,
        justifyContent, justifyContentTablet, justifyContentMobile,
        flexWrap, flexWrapTablet, flexWrapMobile,
        containerMargin, containerMarginTablet, containerMarginMobile,
        containerPadding, containerPaddingTablet, containerPaddingMobile,
        containerPaddingOnRow, columnsCount, htmlTag,
    } = attributes;

    const ws = { ...bgStyle };

    if ( typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible' ) ws.overflow = overflow;

    function getResponsiveValue(value, unit, customValue) {
    if (unit === '__custom__') {
        return customValue || undefined;
    }

    if (typeof value === 'number') {
        return `${value}${unit || 'px'}`;
    }

    return undefined;
}

// ─────────────────────────────────────────────
// MAX WIDTH (DESKTOP / TABLET / MOBILE)
// ─────────────────────────────────────────────

const mwD = getResponsiveValue(
    maxWidth,
    maxWidthUnit,
    maxWidthCustom
);

const mwT = getResponsiveValue(
    maxWidthTablet,
    maxWidthUnitTablet || maxWidthUnit,
    maxWidthCustomTablet || maxWidthCustom
);

const mwM = getResponsiveValue(
    maxWidthMobile,
    maxWidthUnitMobile || maxWidthUnitTablet || maxWidthUnit,
    maxWidthCustomMobile || maxWidthCustomTablet || maxWidthCustom
);

// ── CSS VARS SETTING ─────────────────────────

if (mwD) {
    setCssVar(ws, '--madeit-max-width-desktop', mwD);
}

if (mwT) {
    setCssVar(ws, '--madeit-max-width-tablet', mwT);
}

if (mwM) {
    setCssVar(ws, '--madeit-max-width-mobile', mwM);
}

// ─────────────────────────────────────────────
// MIN HEIGHT (zoals je al had)
// ─────────────────────────────────────────────

const mhD = toCssLength(minHeight, minHeightUnit || 'px');

const mhT = toCssLength(
    minHeightTablet,
    minHeightUnitTablet || minHeightUnit || 'px'
);

const mhM = toCssLength(
    minHeightMobile,
    minHeightUnitMobile ||
        minHeightUnitTablet ||
        minHeightUnit ||
        'px'
);

if (mhD) {
    setCssVar(ws, '--madeit-min-height-desktop', mhD);
}

if (mhT) {
    setCssVar(ws, '--madeit-min-height-tablet', mhT);
}

if (mhM) {
    setCssVar(ws, '--madeit-min-height-mobile', mhM);
}

    if ( typeof rowGap === 'number' ) {
        setCssVar( ws, '--madeit-row-gap-desktop', `${ rowGap }${ rowGapUnit || 'px' }` );
        if ( typeof rowGapTablet === 'number' ) setCssVar( ws, '--madeit-row-gap-tablet', `${ rowGapTablet }${ rowGapUnitTablet || 'px' }` );
        if ( typeof rowGapMobile === 'number' ) setCssVar( ws, '--madeit-row-gap-mobile', `${ rowGapMobile }${ rowGapUnitMobile || 'px' }` );
    }

    const str = v => typeof v === 'string' && v.length > 0;
    if ( str( flexDirection      ) ) setCssVar( ws, '--madeit-flex-direction-desktop', flexDirection );
    if ( str( flexDirectionTablet ) ) setCssVar( ws, '--madeit-flex-direction-tablet',  flexDirectionTablet );
    if ( str( flexDirectionMobile ) ) setCssVar( ws, '--madeit-flex-direction-mobile',  flexDirectionMobile );
    if ( str( alignItems         ) ) setCssVar( ws, '--madeit-align-items-desktop',     alignItems );
    if ( str( alignItemsTablet    ) ) setCssVar( ws, '--madeit-align-items-tablet',      alignItemsTablet );
    if ( str( alignItemsMobile    ) ) setCssVar( ws, '--madeit-align-items-mobile',      alignItemsMobile );
    if ( str( justifyContent     ) ) setCssVar( ws, '--madeit-justify-content-desktop', justifyContent );
    if ( str( justifyContentTablet ) ) setCssVar( ws, '--madeit-justify-content-tablet', justifyContentTablet );
    if ( str( justifyContentMobile ) ) setCssVar( ws, '--madeit-justify-content-mobile', justifyContentMobile );
    if ( str( flexWrap           ) ) setCssVar( ws, '--madeit-flex-wrap-desktop',       flexWrap );
    if ( str( flexWrapTablet      ) ) setCssVar( ws, '--madeit-flex-wrap-tablet',        flexWrapTablet );
    if ( str( flexWrapMobile      ) ) setCssVar( ws, '--madeit-flex-wrap-mobile',        flexWrapMobile );

    if ( containerMargin?.top    !== undefined ) setCssVar( ws, '--madeit-container-margin-top-desktop',    containerMargin.top );
    if ( containerMargin?.bottom !== undefined ) setCssVar( ws, '--madeit-container-margin-bottom-desktop', containerMargin.bottom );
    if ( containerMarginTablet?.top    ) setCssVar( ws, '--madeit-container-margin-top-tablet',    containerMarginTablet.top );
    if ( containerMarginTablet?.bottom ) setCssVar( ws, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom );
    if ( containerMarginMobile?.top    ) setCssVar( ws, '--madeit-container-margin-top-mobile',    containerMarginMobile.top );
    if ( containerMarginMobile?.bottom ) setCssVar( ws, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom );

    if ( containerPaddingOnRow !== true ) {
        setSpacingVars( ws, 'madeit-container-padding', containerPadding,       'desktop' );
        setSpacingVars( ws, 'madeit-container-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( ws, 'madeit-container-padding', containerPaddingMobile, 'mobile' );
    }

    // Row stijl
    const rs = {};
    if ( containerPaddingOnRow === true ) {
        setSpacingVars( rs, 'madeit-container-row-padding', containerPadding,       'desktop' );
        setSpacingVars( rs, 'madeit-container-row-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( rs, 'madeit-container-row-padding', containerPaddingMobile, 'mobile' );
    }

    // Block props — forceer onze className zodat Gutenberg geen stale klassen injecteert
    const blockProps = useBlockProps.save( {
        className: wrapperClass,
        style: Object.keys( ws ).length > 0 ? ws : undefined,
    } );
    blockProps.className = wrapperClass;

    const HtmlTag   = ALLOWED_HTML_TAGS.includes( htmlTag ) ? htmlTag : 'div';
    const rowsCount = Number.isFinite( columnsCount ) ? columnsCount : 0;
    const dirD = str( flexDirection      ) ? flexDirection      : 'row';
    const dirT = str( flexDirectionTablet ) ? flexDirectionTablet : undefined;
    const dirM = str( flexDirectionMobile ) ? flexDirectionMobile : undefined;

    const rowProps = {
        className:                `row madeit-container-row rows-${ rowsCount }`,
        'data-madeit-dir':        dirD,
        'data-madeit-dir-tablet': dirT,
        'data-madeit-dir-mobile': dirM,
        ...( Object.keys( rs ).length > 0 ? { style: rs } : {} ),
    };

    // Standaard: container of container-fluid inner div
    return (
        <HtmlTag { ...blockProps }>
            <div className={ innerDivClass }>
                <div { ...rowProps }>
                    { '\n\n' }
                    <InnerBlocks.Content />
                    { '\n\n' }
                </div>
            </div>
        </HtmlTag>
    );
}
// Save V7

/**
 * MET inner container div + partial CSS-vars
 *
 * Dit matcht de eerste versie NADAT de inner container div werd toegevoegd,
 * maar VOORDAT de volledige set CSS-vars (row-gap tablet/mobile,
 * flex-direction desktop/tablet/mobile, flex-wrap) werd uitgebreid.
 *
 * Patroon in opgeslagen markup (inner div aanwezig, partial vars):
 *   <div class="wp-block-madeit-block-content container-fluid madeit-block-content--frontend" style="...;--madeit-align-items-desktop:center">
 *     <div class="container">
 *       <div class="row ...">
 *
 * Vars die ONTBRAKEN in deze versie (t.o.v. huidige save):
 * - --madeit-row-gap-tablet, --madeit-row-gap-mobile
 * - --madeit-flex-direction-desktop, tablet, mobile
 * - --madeit-flex-wrap-desktop, tablet, mobile
 * - --madeit-justify-content-tablet, mobile
 * - --madeit-align-items-tablet, mobile
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

    // ── PARTIAL stijl: alleen de vars die in deze versie bestonden ─────────────
    const backgroundStyle = buildBackgroundStyle( attributes );
    const {
        overflow,
        minHeight, minHeightUnit, minHeightMobile, minHeightUnitMobile,
        maxWidth, maxWidthUnit,
        rowGap, rowGapUnit,
        // alignItems desktop was aanwezig, tablet/mobile niet
        alignItems,
        // justifyContent desktop was aanwezig, tablet/mobile niet
        justifyContent,
        // flex-direction bestond NIET in deze versie
        // flex-wrap bestond NIET in deze versie
        // row-gap tablet/mobile bestonden NIET in deze versie
        containerMargin, containerMarginTablet, containerMarginMobile,
        containerPadding, containerPaddingTablet, containerPaddingMobile,
        containerPaddingOnRow,
        flexDirection, flexDirectionTablet, flexDirectionMobile,
        columnsCount,
    } = attributes;

    const wrapperStyle = { ...backgroundStyle };

    if ( typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible' ) {
        wrapperStyle.overflow = overflow;
    }

    const minHeightDesktopV = toCssLength( minHeight, minHeightUnit || 'px' );
    const minHeightMobileVV = toCssLength( minHeightMobile, minHeightUnitMobile || minHeightUnit || 'px' );
    if ( minHeightDesktopV ) setCssVar( wrapperStyle, '--madeit-min-height-desktop', minHeightDesktopV );
    if ( minHeightMobileVV ) setCssVar( wrapperStyle, '--madeit-min-height-mobile',  minHeightMobileVV );

    if ( typeof maxWidth === 'number' )
        setCssVar( wrapperStyle, '--madeit-max-width-desktop', `${ maxWidth }${ maxWidthUnit || 'px' }` );

    // Row-gap: alleen desktop in deze versie
    if ( typeof rowGap === 'number' )
        setCssVar( wrapperStyle, '--madeit-row-gap-desktop', `${ rowGap }${ rowGapUnit || 'px' }` );

    // Align-items: alleen desktop in deze versie
    if ( typeof alignItems === 'string' && alignItems.length > 0 )
        setCssVar( wrapperStyle, '--madeit-align-items-desktop', alignItems );

    // Justify-content: alleen desktop in deze versie
    if ( typeof justifyContent === 'string' && justifyContent.length > 0 )
        setCssVar( wrapperStyle, '--madeit-justify-content-desktop', justifyContent );

    // Container margin als CSS-vars
    if ( containerMargin && typeof containerMargin === 'object' ) {
        if ( containerMargin.top !== undefined )
            setCssVar( wrapperStyle, '--madeit-container-margin-top-desktop', containerMargin.top );
        if ( containerMargin.bottom !== undefined )
            setCssVar( wrapperStyle, '--madeit-container-margin-bottom-desktop', containerMargin.bottom );
    }
    if ( containerMarginTablet && typeof containerMarginTablet === 'object' ) {
        setCssVar( wrapperStyle, '--madeit-container-margin-top-tablet',    containerMarginTablet.top );
        setCssVar( wrapperStyle, '--madeit-container-margin-bottom-tablet', containerMarginTablet.bottom );
    }
    if ( containerMarginMobile && typeof containerMarginMobile === 'object' ) {
        setCssVar( wrapperStyle, '--madeit-container-margin-top-mobile',    containerMarginMobile.top );
        setCssVar( wrapperStyle, '--madeit-container-margin-bottom-mobile', containerMarginMobile.bottom );
    }

    if ( containerPaddingOnRow !== true ) {
        setSpacingVars( wrapperStyle, 'madeit-container-padding', containerPadding, 'desktop' );
    }

    const hasStyleProps = Object.keys( wrapperStyle ).length > 0;
    const blockProps = useBlockProps.save( {
        className: wrapperClass,
        style: hasStyleProps ? wrapperStyle : undefined,
    } );

    const HtmlTag = ALLOWED_HTML_TAGS.includes( attributes.htmlTag ) ? attributes.htmlTag : 'div';

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

    const rowStyle = {};
    if ( containerPaddingOnRow === true ) {
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPadding,       'desktop' );
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile' );
    }

    const hasRowStyleProps = Object.keys( rowStyle ).length > 0;
    const outerRowProps = hasRowStyleProps ? { ...baseRowProps, style: rowStyle } : baseRowProps;

    const rawSize = typeof attributes.size === 'string' ? attributes.size.trim() : '';
    const innerDivClass = rawSize === 'container-fluid' ? 'container-fluid' : 'container';

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
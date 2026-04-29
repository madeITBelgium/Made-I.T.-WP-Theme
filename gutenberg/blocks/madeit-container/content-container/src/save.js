/**
 * save.js — madeit-block-content
 *
 * De save()-functie bepaalt hoe de block-attributen worden omgezet naar HTML
 * die WordPress opslaat in de database (post_content).
 *
 * STRUCTUUR VAN DIT BESTAND
 * ─────────────────────────
 * 1. Imports
 * 2. Constanten (defaults, toegestane HTML-tags, …)
 * 3. Hulpfuncties  (CSS-lengte, CSS-variabelen, spacing, …)
 * 4. Legacy-detectie helpers
 * 5. Klasse-opbouw helpers (wrapper + child)
 * 6. Stijl-opbouw helpers (inline styles + CSS vars)
 * 7. Hoofd save()-functie
 *    └─ Rendert één van de vijf markup-varianten:
 *       A. container-content-boxed
 *       B. legacy boxed inner row
 *       C. legacy direct row (geen inner container)
 *       D. inner background wrapper
 *       E. standaard (content width wrap of gewoon row)
 */

// ─── 1. Imports ──────────────────────────────────────────────────────────────

import classnames from 'classnames';
import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

// ─── 2. Constanten ───────────────────────────────────────────────────────────

/** CSS-klasse die alleen op de frontend-wrapper staat (niet in de editor). */
const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';

/** Standaardwaarden uit de `madeit-default-responsive` variatie.
 *  Deze worden via CSS op `.madeit-block-content--frontend` geleverd,
 *  dus we schrijven ze NIET inline (dat zou validatieverschillen geven). */
const DEFAULTS = {
    rowGap:           20,
    flexDirection:    'row',
    flexDirTablet:    'column',
    flexDirMobile:    'column',
    alignItems:       'stretch',
    justifyContent:   'flex-start',
    flexWrap:         'nowrap',
};

/** HTML-tags die toegestaan zijn als wrapper-element. */
const ALLOWED_HTML_TAGS = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];

// ─── 3. Hulpfuncties ─────────────────────────────────────────────────────────

/**
 * Zet een numerieke of string-waarde om naar een geldige CSS-lengte.
 *
 * Voorbeelden:
 *   toCssLength(20)        → '20px'
 *   toCssLength(20, 'em')  → '20em'
 *   toCssLength('1.5rem')  → '1.5rem'  (al van eenheid voorzien)
 *   toCssLength('')        → undefined
 */
function toCssLength( value, unit = 'px' ) {
    if ( typeof value === 'number' && Number.isFinite( value ) ) {
        return `${ value }${ unit || 'px' }`;
    }
    if ( typeof value !== 'string' ) return undefined;

    const trimmed = value.trim();
    if ( trimmed === '' ) return undefined;
    if ( /^-?\d+(?:\.\d+)?$/.test( trimmed ) )        return `${ trimmed }${ unit || 'px' }`;
    if ( /^-?\d+(?:\.\d+)?[a-z%]+$/i.test( trimmed ) ) return trimmed; // al van eenheid voorzien
    return undefined;
}

/**
 * Hulpfunctie voor RegExp-escaping (gebruikt bij het doorzoeken van wrapperStyle).
 */
function escapeRegExp( value ) {
    return String( value ).replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
}

/**
 * Schrijft één CSS-variabele naar een stijl-object.
 * Accepteert getallen (→ 'Npx'), strings of undefined.
 * Lege strings / null / undefined worden overgeslagen.
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

// ─── 4. Legacy-detectie helpers ──────────────────────────────────────────────

/**
 * Leest alle legacy-flags uit de block-attributen.
 * Dit zijn vlaggen die bepalen welke markup-variant we moeten renderen
 * zodat Gutenberg de opgeslagen HTML correct kan valideren.
 *
 * Gutenberg vergelijkt de opgeslagen HTML met wat save() nu genereert.
 * Als ze niet overeenkomen, toont de editor een "block recovery" melding.
 * Met deze flags zorgen we dat oude content exact hetzelfde HTML terugkrijgt.
 *
 * @param {object} attributes - De block-attributen van props.attributes
 * @returns {object} Een object met alle legacy-vlaggen
 */
function detectLegacyFlags( attributes ) {
    const {
        wrapperClassName,
        wrapperStyle,
        directRowClassName,
        boxedInnerRowClassName,
        madeitHasUserEdits,
    } = attributes;

    const wrapperClassRaw = typeof wrapperClassName === 'string' ? wrapperClassName.trim() : '';
    const wrapperTokens   = wrapperClassRaw.length ? wrapperClassRaw.split( /\s+/ ) : [];

    const hasWrapperClassFromMarkup = wrapperClassRaw.length > 0;
    const wrapperHasFrontendClass   = wrapperTokens.includes( FRONTEND_WRAPPER_CLASS );
    const wrapperHasContainer       = wrapperTokens.includes( 'container' );
    const wrapperHasContainerFluid  = wrapperTokens.includes( 'container-fluid' );

    // Normaliseer de opgeslagen wrapperStyle (verwijder whitespace voor matching).
    const wrapperStyleRaw        = typeof wrapperStyle === 'string' ? wrapperStyle : '';
    const wrapperStyleNormalized = wrapperStyleRaw.replace( /\s+/g, '' );
    const hasStoredStyle         = wrapperStyleNormalized.length > 0;

    // Detecteer of de opgeslagen markup legacy inline spacing gebruikte
    // (margin-top/margin-bottom/padding-* als directe inline stijlen)
    // in plaats van CSS-variabelen.
    const hasLegacyInlineSpacing =
        hasStoredStyle &&
        ( wrapperStyleNormalized.includes( 'margin-top:' ) ||
          wrapperStyleNormalized.includes( 'margin-bottom:' ) ||
          wrapperStyleNormalized.includes( 'padding-top:' ) ||
          wrapperStyleNormalized.includes( 'padding-right:' ) ||
          wrapperStyleNormalized.includes( 'padding-bottom:' ) ||
          wrapperStyleNormalized.includes( 'padding-left:' ) );

    // Detecteer of de opgeslagen markup al container-spacing CSS-vars had.
    const SPACING_VARS = [
        '--madeit-container-margin-top-desktop',    '--madeit-container-margin-bottom-desktop',
        '--madeit-container-margin-top-tablet',     '--madeit-container-margin-bottom-tablet',
        '--madeit-container-margin-top-mobile',     '--madeit-container-margin-bottom-mobile',
        '--madeit-container-padding-top-desktop',   '--madeit-container-padding-right-desktop',
        '--madeit-container-padding-bottom-desktop','--madeit-container-padding-left-desktop',
        '--madeit-container-padding-top-tablet',    '--madeit-container-padding-right-tablet',
        '--madeit-container-padding-bottom-tablet', '--madeit-container-padding-left-tablet',
        '--madeit-container-padding-top-mobile',    '--madeit-container-padding-right-mobile',
        '--madeit-container-padding-bottom-mobile', '--madeit-container-padding-left-mobile',
    ];
    const hasContainerSpacingVars = hasStoredStyle &&
        SPACING_VARS.some( ( v ) => wrapperStyleNormalized.includes( `${ v }:` ) );

    return {
        wrapperStyleNormalized,
        hasStoredStyle,

        /** Oude content had geen FRONTEND_WRAPPER_CLASS en geen enhanced CSS-vars. */
        shouldUseLegacyWrapperClasses:
            hasWrapperClassFromMarkup && ! wrapperHasFrontendClass && ! madeitHasUserEdits,

        /** Kunnen we enhanced layout CSS-vars serialiseren? */
        shouldSerializeEnhancedLayoutVars:
            ! ( hasWrapperClassFromMarkup && ! wrapperHasFrontendClass && ! madeitHasUserEdits ),

        /** Moeten we alleen de CSS-vars serialiseren die al in de markup stonden? */
        shouldMatchWrapperStyleVars: hasStoredStyle && ! madeitHasUserEdits,

        /** Moet de spacing via old-school inline stijlen (marginTop, paddingTop, …)? */
        shouldPreserveLegacyInlineSpacing:
            hasLegacyInlineSpacing && ! hasContainerSpacingVars,

        /** Had de wrapper `.container` of `.container-fluid`? */
        wrapperHasContainer,
        wrapperHasContainerFluid,

        /** Directe `.row` onder de wrapper (geen inner container). */
        hasDirectRowWrapper:
            typeof directRowClassName === 'string' && directRowClassName.trim().length > 0,

        /** Legacy boxed inner row (row > col > container > row). */
        hasLegacyBoxedInnerRowWrapper:
            typeof boxedInnerRowClassName === 'string' && boxedInnerRowClassName.trim().length > 0,

        /** Ruwe string-waarden voor fallback-parsing. */
        boxedInnerRowClassName:       attributes.boxedInnerRowClassName,
        boxedInnerContainerClassName: attributes.boxedInnerContainerClassName,
    };
}

/**
 * Berekent de genormaliseerde `size` op basis van attributen en legacy markup.
 *
 * Mogelijke waarden: 'container' | 'container-fluid' | 'container-content-boxed'
 */
function resolveSize( attributes, legacy ) {
    const { size } = attributes;
    const { wrapperHasContainer, wrapperHasContainerFluid } = legacy;

    const hasExplicitSize = typeof size === 'string' && size.trim().length > 0;

    let resolved =
        hasExplicitSize &&
        [ 'container', 'container-fluid', 'container-content-boxed' ].includes( size.trim() )
            ? size.trim()
            : undefined;

    // Legacy-correctie: pas de grootte aan op basis van de opgeslagen markup.
    if ( resolved === 'container-content-boxed' ) {
        if ( wrapperHasContainer && ! wrapperHasContainerFluid ) resolved = 'container';
    } else {
        if ( wrapperHasContainerFluid && ! wrapperHasContainer ) resolved = 'container-fluid';
        else if ( wrapperHasContainer && ! wrapperHasContainerFluid ) resolved = 'container';
    }

    return resolved || 'container'; // fallback
}

// ─── 5. Klasse-opbouw helpers ─────────────────────────────────────────────────

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

/**
 * Berekent de klassen voor de buitenste wrapper.
 *
 * @param {object} attributes  - Block-attributen
 * @param {string} extraClass  - Gefilterde extra className
 * @param {string} defaultSize - Opgeloste size ('container' | 'container-fluid' | 'container-content-boxed')
 * @param {object} legacy      - Legacy-vlaggen uit detectLegacyFlags()
 * @param {object} colorClasses - { containerBg, rowBg, rowText } color class strings
 * @param {boolean} applyBgToInner - Wordt de achtergrond op het inner element toegepast?
 * @returns {string}
 */
function buildWrapperClasses( attributes, extraClass, defaultSize, legacy, colorClasses, applyBgToInner ) {
    const { verticalAlignment, hideOnDesktop, hideOnTablet, hideOnMobile } = attributes;
    const { shouldUseLegacyWrapperClasses } = legacy;
    const { containerBgClass, rowTextClass } = colorClasses;

    let classes = classnames( 'wp-block-madeit-block-content', extraClass, {
        'container':                   defaultSize === 'container',
        'container-fluid':             defaultSize === 'container-fluid' || defaultSize === 'container-content-boxed',
        'is-hidden-desktop':           !! hideOnDesktop,
        'is-hidden-tablet':            !! hideOnTablet,
        'is-hidden-mobile':            !! hideOnMobile,
        [ FRONTEND_WRAPPER_CLASS ]:    ! shouldUseLegacyWrapperClasses,
    } );

    // Verticale uitlijning alleen op wrapper voor niet-boxed layouts.
    if ( defaultSize !== 'container-content-boxed' ) {
        classes = classnames( classes, {
            [ `are-vertically-aligned-${ verticalAlignment }` ]: !! verticalAlignment,
        } );
    }

    // Tekstkleur staat altijd op de wrapper (zodat hij overal erft).
    classes = classnames( classes, {
        'has-text-color': !! rowTextClass,
        [ rowTextClass ]:  !! rowTextClass,
    } );

    // Achtergrondkleur: op wrapper als de achtergrond NIET op het inner element staat.
    if ( ! applyBgToInner ) {
        classes = classnames( classes, {
            'has-background':    !! containerBgClass,
            [ containerBgClass ]: !! containerBgClass,
        } );
    }

    return classes;
}

/**
 * Berekent de klassen voor het inner child-element.
 *
 * @param {object} attributes
 * @param {string} defaultSize
 * @param {string} contentWidthNormalized - 'container' | 'container-fluid'
 * @param {object} colorClasses
 * @param {boolean} applyBgToInner
 * @returns {string}
 */
function buildChildClasses( attributes, defaultSize, contentWidthNormalized, colorClasses, applyBgToInner ) {
    const { verticalAlignment, rowBackgroundColor, rowTextColor } = attributes;
    const { containerBgClass, rowBgClass, rowTextClass } = colorClasses;

    let classesChild = classnames( {
        [ `are-vertically-aligned-${ verticalAlignment }` ]: !! verticalAlignment && defaultSize === 'container-content-boxed',
        'container':       contentWidthNormalized === 'container',
        'container-fluid': contentWidthNormalized === 'container-fluid',
    } );

    if ( applyBgToInner ) {
        classesChild = classnames( classesChild, {
            'has-background':    !! containerBgClass,
            [ containerBgClass ]: !! containerBgClass,
        } );
    }

    if ( defaultSize === 'container-content-boxed' ) {
        classesChild = classnames( classesChild, {
            'has-text-color':  rowTextColor !== undefined,
            'has-background':  rowBackgroundColor !== undefined,
            [ rowBgClass ]:    rowBackgroundColor !== undefined,
            [ rowTextClass ]:  rowTextColor !== undefined,
        } );
    }

    return classesChild;
}

// ─── 6. Stijl-opbouw helpers ──────────────────────────────────────────────────

/**
 * Maakt het stijl-object voor de achtergrond (kleur, afbeelding, gradient).
 *
 * @param {object} attributes
 * @param {string} containerBgClass - Tailwind/theme color class name (of undefined)
 * @returns {object} React inline-style object
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
 * Schrijft een CSS-variabele naar het stijl-object, maar enkel als:
 * - shouldMatchWrapperStyleVars = false  → altijd schrijven
 * - shouldMatchWrapperStyleVars = true   → alleen als de var al in de opgeslagen markup stond
 *
 * Gebruik dit voor alle layout CSS-vars (flex-direction, row-gap, …).
 */
function makeVarWriter( wrapperStyleNormalized, shouldMatchWrapperStyleVars ) {
    /** Geeft true als de variabele al in de opgeslagen wrapperStyle staat. */
    const hadVar = ( varName ) =>
        shouldMatchWrapperStyleVars && wrapperStyleNormalized.includes( `${ varName }:` );

    /** Lees de huidige waarde van een var uit de opgeslagen wrapperStyle. */
    const getVarValue = ( varName ) => {
        if ( ! shouldMatchWrapperStyleVars ) return undefined;
        const match = wrapperStyleNormalized.match(
            new RegExp( `${ escapeRegExp( varName ) }:([^;]+)` )
        );
        return match?.[ 1 ];
    };

    /**
     * Schrijft de var naar targetStyle, rekening houdend met de matching-mode.
     * @param {object} targetStyle
     * @param {string} varName     - CSS-variabelenaam (bv. '--madeit-flex-direction-desktop')
     * @param {*}      value       - Waarde om in te stellen (of undefined om over te slaan)
     */
    const maybeSetVar = ( targetStyle, varName, value ) => {
        if ( shouldMatchWrapperStyleVars && ! hadVar( varName ) ) return;
        setCssVar( targetStyle, varName, value );
    };

    /**
     * Schrijft de var enkel als hij expliciet afwijkt van de standaardwaarde
     * (of als hij al in de opgeslagen markup stond).
     *
     * @param {object}  targetStyle
     * @param {string}  varName
     * @param {*}       value        - Te serialiseren waarde
     * @param {*}       defaultValue - Standaardwaarde (uit DEFAULTS)
     * @param {boolean} hasValue     - Geeft aan of de waarde expliciet is ingesteld
     */
    const conditionalVar = ( targetStyle, varName, value, defaultValue, hasValue ) => {
        const shouldEmit = shouldMatchWrapperStyleVars
            ? hadVar( varName )
            : hasValue && value !== defaultValue;
        if ( shouldEmit ) maybeSetVar( targetStyle, varName, value );
    };

    return { hadVar, getVarValue, maybeSetVar, conditionalVar };
}

/**
 * Voegt responsieve spacing (margin of padding) toe aan een stijl-object.
 *
 * In het nieuwe formaat: CSS-variabelen per breakpoint.
 * In het legacy formaat: directe inline stijlen (marginTop, paddingLeft, …).
 *
 * @param {object}  targetStyle
 * @param {string}  prefix       - CSS-var prefix (bv. 'madeit-container-padding')
 * @param {object}  spacing      - { top, right, bottom, left }
 * @param {string}  breakpoint   - 'desktop' | 'tablet' | 'mobile'
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
 * Past legacy inline spacing toe in dezelfde volgorde als de opgeslagen markup.
 * Dit is nodig om block-validatiefouten te vermijden.
 *
 * @param {object}  targetStyle
 * @param {object}  spacingEntries - Array van { cssProp, reactProp, value }
 * @param {string}  wrapperStyleNormalized
 * @param {boolean} shouldMatchWrapperStyleVars
 */
function applyLegacyInlineSpacing( targetStyle, spacingEntries, wrapperStyleNormalized, shouldMatchWrapperStyleVars ) {
    if ( ! shouldMatchWrapperStyleVars ) {
        for ( const { reactProp, value } of spacingEntries ) {
            if ( value !== undefined ) targetStyle[ reactProp ] = value;
        }
        return;
    }

    const positioned = spacingEntries
        .map( ( entry ) => ( {
            ...entry,
            pos: wrapperStyleNormalized.indexOf( `${ entry.cssProp }:` ),
        } ) )
        .filter( ( entry ) => entry.pos >= 0 )
        .sort( ( a, b ) => a.pos - b.pos );

    for ( const { reactProp, value } of positioned ) {
        if ( value !== undefined ) targetStyle[ reactProp ] = value;
    }
}

/**
 * Bouwt het volledige stijl-object voor de buitenste wrapper.
 * Bevat: achtergrond, overflow, min-height, max-width, row-gap,
 *        flex-direction, align-items, justify-content, flex-wrap,
 *        en container margin + padding.
 */
function buildWrapperStyle( attributes, legacy, applyBgToInner, backgroundStyle ) {
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

    const {
        wrapperStyleNormalized,
        shouldMatchWrapperStyleVars,
        shouldSerializeEnhancedLayoutVars,
        shouldPreserveLegacyInlineSpacing,
    } = legacy;

    const { maybeSetVar, conditionalVar, getVarValue } =
        makeVarWriter( wrapperStyleNormalized, shouldMatchWrapperStyleVars );

    const style = {};

    // Achtergrond op wrapper (tenzij op inner element).
    if ( ! applyBgToInner ) Object.assign( style, backgroundStyle );

    // Overflow (standaard 'visible' wordt niet geserialiseerd).
    if ( typeof overflow === 'string' && overflow.length > 0 && overflow !== 'visible' ) {
        style.overflow = overflow;
    }

    // ── Min-height (responsief via CSS-vars) ──────────────────────────────────
    maybeSetVar( style, '--madeit-min-height-desktop',
        toCssLength( minHeight, minHeightUnit || 'px' ) ?? getVarValue( '--madeit-min-height-desktop' ) );
    maybeSetVar( style, '--madeit-min-height-tablet',
        toCssLength( minHeightTablet, minHeightUnitTablet || minHeightUnit || 'px' ) ?? getVarValue( '--madeit-min-height-tablet' ) );
    maybeSetVar( style, '--madeit-min-height-mobile',
        toCssLength( minHeightMobile, minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px' ) ?? getVarValue( '--madeit-min-height-mobile' ) );

    // ── Max-width (responsief via CSS-vars) ───────────────────────────────────
    maybeSetVar( style, '--madeit-max-width-desktop',
        typeof maxWidth === 'number' ? `${ maxWidth }${ maxWidthUnit || 'px' }` : getVarValue( '--madeit-max-width-desktop' ) );
    maybeSetVar( style, '--madeit-max-width-tablet',
        typeof maxWidthTablet === 'number' ? `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }` : getVarValue( '--madeit-max-width-tablet' ) );
    maybeSetVar( style, '--madeit-max-width-mobile',
        typeof maxWidthMobile === 'number' ? `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }` : getVarValue( '--madeit-max-width-mobile' ) );

    // ── Row-gap (responsief via CSS-vars) ─────────────────────────────────────
    if ( shouldSerializeEnhancedLayoutVars ) {
        const hasRowGapDesktop = typeof rowGap === 'number';

        if ( hasRowGapDesktop ) {
            conditionalVar( style, '--madeit-row-gap-desktop',
                `${ rowGap }${ rowGapUnit || 'px' }`, `${ DEFAULTS.rowGap }px`, true );

            conditionalVar( style, '--madeit-row-gap-tablet',
                `${ rowGapTablet }${ rowGapUnitTablet || 'px' }`,
                `${ DEFAULTS.rowGap }px`,
                typeof rowGapTablet === 'number' );

            conditionalVar( style, '--madeit-row-gap-mobile',
                `${ rowGapMobile }${ rowGapUnitMobile || 'px' }`,
                `${ DEFAULTS.rowGap }px`,
                typeof rowGapMobile === 'number' );
        } else if ( shouldMatchWrapperStyleVars ) {
            // Herstel alleen de vars die al in de markup stonden.
            maybeSetVar( style, '--madeit-row-gap-desktop', getVarValue( '--madeit-row-gap-desktop' ) );
            maybeSetVar( style, '--madeit-row-gap-tablet',  getVarValue( '--madeit-row-gap-tablet' ) );
            maybeSetVar( style, '--madeit-row-gap-mobile',  getVarValue( '--madeit-row-gap-mobile' ) );
        }
    }

    // ── Flex-direction (responsief via CSS-vars) ──────────────────────────────
    if ( shouldSerializeEnhancedLayoutVars ) {
        conditionalVar( style, '--madeit-flex-direction-desktop',
            flexDirection, DEFAULTS.flexDirection,
            typeof flexDirection === 'string' && flexDirection.length > 0 );

        conditionalVar( style, '--madeit-flex-direction-tablet',
            flexDirectionTablet, DEFAULTS.flexDirTablet,
            typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 );

        conditionalVar( style, '--madeit-flex-direction-mobile',
            flexDirectionMobile, DEFAULTS.flexDirMobile,
            typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 );
    }

    // ── Align-items (responsief via CSS-vars) ─────────────────────────────────
    if ( shouldSerializeEnhancedLayoutVars ) {
        conditionalVar( style, '--madeit-align-items-desktop',
            alignItems, DEFAULTS.alignItems,
            typeof alignItems === 'string' && alignItems.length > 0 );

        conditionalVar( style, '--madeit-align-items-tablet',
            alignItemsTablet, undefined,
            typeof alignItemsTablet === 'string' && alignItemsTablet.length > 0 );

        conditionalVar( style, '--madeit-align-items-mobile',
            alignItemsMobile, undefined,
            typeof alignItemsMobile === 'string' && alignItemsMobile.length > 0 );
    }

    // ── Justify-content (responsief via CSS-vars) ─────────────────────────────
    if ( shouldSerializeEnhancedLayoutVars ) {
        conditionalVar( style, '--madeit-justify-content-desktop',
            justifyContent, DEFAULTS.justifyContent,
            typeof justifyContent === 'string' && justifyContent.length > 0 );

        conditionalVar( style, '--madeit-justify-content-tablet',
            justifyContentTablet, undefined,
            typeof justifyContentTablet === 'string' && justifyContentTablet.length > 0 );

        conditionalVar( style, '--madeit-justify-content-mobile',
            justifyContentMobile, undefined,
            typeof justifyContentMobile === 'string' && justifyContentMobile.length > 0 );
    }

    // ── Flex-wrap (responsief via CSS-vars) ───────────────────────────────────
    if ( shouldSerializeEnhancedLayoutVars ) {
        conditionalVar( style, '--madeit-flex-wrap-desktop',
            flexWrap, DEFAULTS.flexWrap,
            typeof flexWrap === 'string' && flexWrap.length > 0 );

        conditionalVar( style, '--madeit-flex-wrap-tablet',
            flexWrapTablet, undefined,
            typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0 );

        conditionalVar( style, '--madeit-flex-wrap-mobile',
            flexWrapMobile, undefined,
            typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0 );
    }

    // ── Container margin ──────────────────────────────────────────────────────
    const shouldApplyPaddingOnRow = containerPaddingOnRow === true;

    if ( shouldPreserveLegacyInlineSpacing ) {
        // Oud formaat: directe marginTop / marginBottom inline.
        if ( containerMargin && typeof containerMargin === 'object' ) {
            applyLegacyInlineSpacing( style, [
                { cssProp: 'margin-top',    reactProp: 'marginTop',    value: containerMargin.top },
                { cssProp: 'margin-bottom', reactProp: 'marginBottom', value: containerMargin.bottom },
            ], wrapperStyleNormalized, shouldMatchWrapperStyleVars );
        }

        // Padding op de wrapper (niet op de row) — legacy formaat.
        if ( ! shouldApplyPaddingOnRow && containerPadding && typeof containerPadding === 'object' ) {
            applyLegacyInlineSpacing( style, [
                { cssProp: 'padding-top',    reactProp: 'paddingTop',    value: containerPadding.top },
                { cssProp: 'padding-right',  reactProp: 'paddingRight',  value: containerPadding.right },
                { cssProp: 'padding-bottom', reactProp: 'paddingBottom', value: containerPadding.bottom },
                { cssProp: 'padding-left',   reactProp: 'paddingLeft',   value: containerPadding.left },
            ], wrapperStyleNormalized, shouldMatchWrapperStyleVars );
        }
    } else {
        // Nieuw formaat: CSS-variabelen.
        // Gebruik setCssVar (altijd schrijven) — NIET maybeSetVar — zodat nieuwe
        // blocks de vars ook krijgen (maybeSetVar slaat over als de var nog niet
        // in de opgeslagen markup stond, wat voor nieuwe blocks altijd het geval is).
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

        // Padding op de wrapper (niet op de row) — nieuw CSS-var formaat.
        // Inline paddingTop/Right/Bottom/Left worden niet meer geserialiseerd:
        // de SCSS leest uitsluitend de CSS-vars. Dit vermijdt ook conflicten
        // met Bootstrap container padding.
        if ( ! shouldApplyPaddingOnRow ) {
            setSpacingVars( style, 'madeit-container-padding', containerPadding,       'desktop' );
            setSpacingVars( style, 'madeit-container-padding', containerPaddingTablet, 'tablet' );
            setSpacingVars( style, 'madeit-container-padding', containerPaddingMobile, 'mobile' );
        }
    }

    return style;
}

/**
 * Bouwt het stijl-object voor de `.row`-div.
 * Bevat padding wanneer `containerPaddingOnRow` is ingeschakeld.
 */
function buildRowStyle( attributes, legacy ) {
    const {
        containerPadding, containerPaddingTablet, containerPaddingMobile,
        containerPaddingOnRow,
    } = attributes;
    const { shouldPreserveLegacyInlineSpacing, wrapperStyleNormalized, shouldMatchWrapperStyleVars } = legacy;

    if ( containerPaddingOnRow !== true ) return {};

    const rowStyle = {};

    if ( shouldPreserveLegacyInlineSpacing ) {
        if ( containerPadding && typeof containerPadding === 'object' ) {
            applyLegacyInlineSpacing( rowStyle, [
                { cssProp: 'padding-top',    reactProp: 'paddingTop',    value: containerPadding.top },
                { cssProp: 'padding-right',  reactProp: 'paddingRight',  value: containerPadding.right },
                { cssProp: 'padding-bottom', reactProp: 'paddingBottom', value: containerPadding.bottom },
                { cssProp: 'padding-left',   reactProp: 'paddingLeft',   value: containerPadding.left },
            ], wrapperStyleNormalized, shouldMatchWrapperStyleVars );
        }
    } else {
        // Nieuw formaat: alleen CSS-vars, geen inline padding.
        // De SCSS op .madeit-container-row leest uitsluitend de vars.
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPadding,       'desktop' );
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile' );
    }

    return rowStyle;
}

/**
 * Bouwt het stijl-object voor het inner child-element (boxed layout).
 */
function buildChildStyle( attributes, defaultSize, backgroundStyle, applyBgToInner ) {
    const { rowBackgroundColor, rowTextColor, rowMargin, rowPadding } = attributes;

    const styleChild = {};

    if ( applyBgToInner ) {
        Object.assign( styleChild, backgroundStyle );
    }

    if ( defaultSize === 'container-content-boxed' ) {
        const rowBgClass  = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
        const rowTextClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;

        if ( ! rowBgClass )   styleChild.backgroundColor = rowBackgroundColor;
        if ( ! rowTextClass ) styleChild.color           = rowTextColor;

        // Row margin + padding (alleen voor boxed layouts).
        const spacingProps = [
            [ rowMargin,   'margin' ],
            [ rowPadding, 'padding' ],
        ];
        for ( const [ spacing, prop ] of spacingProps ) {
            if ( spacing && typeof spacing === 'object' ) {
                if ( spacing.top    !== undefined ) styleChild[ `${ prop }Top` ]    = spacing.top;
                if ( spacing.right  !== undefined ) styleChild[ `${ prop }Right` ]  = spacing.right;
                if ( spacing.bottom !== undefined ) styleChild[ `${ prop }Bottom` ] = spacing.bottom;
                if ( spacing.left   !== undefined ) styleChild[ `${ prop }Left` ]   = spacing.left;
            }
        }
    }

    return styleChild;
}

// ─── 7. Hoofdfunctie save() ──────────────────────────────────────────────────

/**
 * Genereert de opgeslagen HTML voor het madeit-block-content block.
 *
 * MARKUP-VARIANTEN (in volgorde van controlestroom):
 *
 *   A. container-content-boxed
 *      <HtmlTag>
 *        <div.row> <div.col> <div.classesChild> <div.row> <InnerBlocks /> </div> </div> </div> </div>
 *      </HtmlTag>
 *
 *   B. Legacy boxed inner row  (row > col > container > row)
 *      <HtmlTag>
 *        <div.row> <div.col> <div.container> <div.row> <InnerBlocks /> </div> </div> </div> </div>
 *      </HtmlTag>
 *
 *   C. Legacy direct row  (geen inner container)
 *      <HtmlTag>
 *        <div.row> <InnerBlocks /> </div>
 *      </HtmlTag>
 *
 *   D. Inner background wrapper
 *      <HtmlTag>
 *        <div.classesChild> <div.row> <InnerBlocks /> </div> </div>
 *      </HtmlTag>
 *
 *   E. Standaard (met of zonder content-width wrapper)
 *      <HtmlTag>
 *        [<div.container>]  ← alleen als shouldWrapContent
 *          <div.row> <InnerBlocks /> </div>
 *        [</div>]
 *      </HtmlTag>
 */
export default function save( props ) {
    const { attributes, className } = props;

    // ── Kleur-classes ──────────────────────────────────────────────────────
    const containerBgClass = attributes.containerBackgroundColor
        ? getColorClassName( 'background-color', attributes.containerBackgroundColor )
        : undefined;
    const rowBgClass = attributes.rowBackgroundColor
        ? getColorClassName( 'background-color', attributes.rowBackgroundColor )
        : undefined;
    const rowTextClass = attributes.rowTextColor
        ? getColorClassName( 'color', attributes.rowTextColor )
        : undefined;
    const colorClasses = { containerBgClass, rowBgClass, rowTextClass };

    // ── Legacy-detectie ────────────────────────────────────────────────────
    const legacy = detectLegacyFlags( attributes );

    // ── Grootte / layout berekening ────────────────────────────────────────
    const defaultSize = resolveSize( attributes, legacy );
    const outerSizeNormalized = defaultSize === 'container' ? 'container' : 'container-fluid';

    // Content-breedte (voor boxed outer containers met fluid inner content).
    const hasContentWidth = typeof attributes.contentWidth === 'string' && attributes.contentWidth.length > 0;
    const contentWidthResolvedRaw = hasContentWidth
        ? attributes.contentWidth
        : defaultSize === 'container-content-boxed'
            ? 'container'
            : outerSizeNormalized;

    // Als de outer container al boxed is, kan de content niet full-width zijn.
    const contentWidthNormalized =
        outerSizeNormalized === 'container' || contentWidthResolvedRaw !== 'container-fluid'
            ? 'container'
            : 'container-fluid';

    // De achtergrond staat op het inner element als de layout boxed is
    // (zodat padding/margin van de wrapper de achtergrond niet beïnvloedt).
    const applyBgToInner =
        defaultSize === 'container' &&
        ! legacy.shouldUseLegacyBoxedMarkup &&
        ! legacy.hasDirectRowWrapper;

    // ── Stijlen bouwen ─────────────────────────────────────────────────────
    const backgroundStyle = buildBackgroundStyle( attributes );
    const wrapperStyle    = buildWrapperStyle( attributes, legacy, applyBgToInner, backgroundStyle );
    const rowStyle        = buildRowStyle( attributes, legacy );
    const childStyle      = buildChildStyle( attributes, defaultSize, backgroundStyle, applyBgToInner );

    // ── Klassen bouwen ─────────────────────────────────────────────────────
    const extraClass    = filterExtraClasses( className );
    const wrapperClass  = buildWrapperClasses( attributes, extraClass, defaultSize, legacy, colorClasses, applyBgToInner );
    const childClass    = buildChildClasses( attributes, defaultSize, contentWidthNormalized, colorClasses, applyBgToInner );

    // ── Block props (Gutenberg wrapper) ────────────────────────────────────
    const hasStyleProps = Object.keys( wrapperStyle ).length > 0;
    const blockProps    = useBlockProps.save( {
        className: wrapperClass,
        style: hasStyleProps ? wrapperStyle : undefined,
    } );

    // ── HTML-tag ───────────────────────────────────────────────────────────
    const HtmlTag = ALLOWED_HTML_TAGS.includes( attributes.htmlTag ) ? attributes.htmlTag : 'div';

    // ── Row props (flex-richting data-attributen) ──────────────────────────
    const { flexDirection, flexDirectionTablet, flexDirectionMobile, columnsCount } = attributes;
    const dirDesktop = typeof flexDirection      === 'string' && flexDirection.length      > 0 ? flexDirection      : 'row';
    const dirTablet  = typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ? flexDirectionTablet : undefined;
    const dirMobile  = typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0 ? flexDirectionMobile : undefined;

    const hasEnhancedRowWrapper =
        Number.isFinite( columnsCount ) ||
        typeof flexDirection      === 'string' && flexDirection.length      > 0 ||
        typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0 ||
        typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0;

    const rowsCount   = Number.isFinite( columnsCount ) ? columnsCount : 0;
    const rowClassName = hasEnhancedRowWrapper
        ? `row madeit-container-row rows-${ rowsCount }`
        : 'row';

    const baseRowProps = hasEnhancedRowWrapper
        ? { className: rowClassName, 'data-madeit-dir': dirDesktop, 'data-madeit-dir-tablet': dirTablet, 'data-madeit-dir-mobile': dirMobile }
        : { className: rowClassName };

    const hasRowStyleProps = Object.keys( rowStyle ).length > 0;
    const outerRowProps    = hasRowStyleProps ? { ...baseRowProps, style: rowStyle } : baseRowProps;
    const innerRowProps    = baseRowProps;

    // ── JSX renderen ───────────────────────────────────────────────────────

    // VARIANT A: container-content-boxed
    if ( defaultSize === 'container-content-boxed' ) {
        return (
            <HtmlTag { ...blockProps }>
                <div { ...outerRowProps }>
                    <div className="col">
                        <div className={ childClass } style={ childStyle }>
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

    // VARIANT B: legacy boxed inner row (row > col > container > row)
    if ( legacy.hasLegacyBoxedInnerRowWrapper ) {
        const innerContainerClass =
            typeof attributes.boxedInnerContainerClassName === 'string' &&
            attributes.boxedInnerContainerClassName.trim().length > 0
                ? attributes.boxedInnerContainerClassName.trim()
                : 'container';

        const innerRowClass =
            typeof attributes.boxedInnerRowClassName === 'string' &&
            attributes.boxedInnerRowClassName.trim().length > 0
                ? attributes.boxedInnerRowClassName.trim()
                : innerRowProps.className;

        return (
            <HtmlTag { ...blockProps }>
                <div { ...outerRowProps }>
                    <div className="col">
                        <div className={ innerContainerClass }>
                            <div { ...{ ...innerRowProps, className: innerRowClass } }>
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

    // VARIANT C: legacy direct row (geen inner container)
    if ( legacy.hasDirectRowWrapper ) {
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

    // VARIANT D: inner background wrapper (achtergrond op inner element)
    if ( applyBgToInner ) {
        return (
            <HtmlTag { ...blockProps }>
                <div className={ childClass } style={ childStyle }>
                    <div { ...outerRowProps }>
                        { '\n\n' }
                        <InnerBlocks.Content />
                        { '\n\n' }
                    </div>
                </div>
            </HtmlTag>
        );
    }

    // VARIANT E: standaard — met optionele content-width wrapper
    const shouldWrapContent =
        outerSizeNormalized !== 'container' &&
        hasContentWidth &&
        contentWidthNormalized !== outerSizeNormalized;

    if ( shouldWrapContent ) {
        return (
            <HtmlTag { ...blockProps }>
                <div className={ classnames( {
                    'container':       contentWidthNormalized === 'container',
                    'container-fluid': contentWidthNormalized === 'container-fluid',
                } ) }>
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
/**
 * index.js — madeit/block-content
 *
 * DEPRECATED VOLGORDE (meest recent bovenaan):
 *
 * Vpre0b: geen dubbele classes + inner container div + partial CSS-vars
 * Vpre0:  dubbele classes + inner container div + partial CSS-vars
 * V0:     geen inner div + inline margin + volledige CSS-vars
 * V1–V15: alle vorige deprecated versies
 */

import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

import edit from './edit';
import save from './save';
import metadata from './../block.json';
import icon from './icon';

import {
    saveVpre0b,
    saveVpre0,
    saveV0,
    saveV1, saveV2, saveV3, saveV4, saveV5, saveV6,
    saveV7, saveV8, saveV9, saveV10, saveV11, saveV12,
    saveV13, saveV14, saveV15,
} from './save-versions';

// ─── Hulpfuncties voor migrate() ──────────────────────────────────────────────

const normalizeCssLength = ( value, defaultUnit = 'px' ) => {
    if ( value === undefined || value === null ) return undefined;
    if ( typeof value === 'number' && Number.isFinite( value ) ) {
        return `${ value }${ defaultUnit || 'px' }`;
    }
    if ( typeof value !== 'string' ) return undefined;
    const trimmed = value.trim();
    if ( trimmed === '' ) return undefined;
    if ( /^-?\d+(?:\.\d+)?$/.test( trimmed ) ) return `${ trimmed }${ defaultUnit || 'px' }`;
    if ( /^-?\d+(?:\.\d+)?[a-z%]+$/i.test( trimmed ) ) return trimmed;
    return undefined;
};

const normalizeSpacingObject = ( spacing ) => {
    if ( ! spacing || typeof spacing !== 'object' ) return undefined;
    const { top, right, bottom, left } = spacing;
    const hasAnyValue = [ top, right, bottom, left ].some(
        ( v ) => v !== undefined && v !== null && String( v ).trim() !== ''
    );
    if ( ! hasAnyValue ) return undefined;
    return {
        top:    normalizeCssLength( top )    ?? '0px',
        right:  normalizeCssLength( right )  ?? '0px',
        bottom: normalizeCssLength( bottom ) ?? '0px',
        left:   normalizeCssLength( left )   ?? '0px',
    };
};

const normalizeSpacingAttributes = ( attributes ) => {
    const next = { ...( attributes || {} ) };
    next.containerMargin        = normalizeSpacingObject( next.containerMargin );
    next.containerMarginTablet  = normalizeSpacingObject( next.containerMarginTablet );
    next.containerMarginMobile  = normalizeSpacingObject( next.containerMarginMobile );
    next.containerPadding       = normalizeSpacingObject( next.containerPadding );
    next.containerPaddingTablet = normalizeSpacingObject( next.containerPaddingTablet );
    next.containerPaddingMobile = normalizeSpacingObject( next.containerPaddingMobile );
    next.rowMargin              = normalizeSpacingObject( next.rowMargin );
    next.rowPadding             = normalizeSpacingObject( next.rowPadding );
    return next;
};

/**
 * Detecteert of de opgeslagen wrapperStyle de partial vars heeft:
 * - Geen --madeit-row-gap-tablet (tablet/mobile row-gap ontbreekt)
 * - Geen --madeit-flex-direction-* vars
 * - Geen --madeit-flex-wrap-* vars
 */
const isPartialVarsStyle = ( wrapperStyle ) => {
    if ( typeof wrapperStyle !== 'string' ) return false;
    const s = wrapperStyle.replace( /\s+/g, '' );
    if ( ! s.length ) return false;
    const hasRowGapTablet     = s.includes( '--madeit-row-gap-tablet:' );
    const hasFlexDirection    = s.includes( '--madeit-flex-direction-desktop:' ) ||
                                s.includes( '--madeit-flex-direction-tablet:' )  ||
                                s.includes( '--madeit-flex-direction-mobile:' );
    const hasFlexWrap         = s.includes( '--madeit-flex-wrap-desktop:' );
    return ! hasRowGapTablet && ! hasFlexDirection && ! hasFlexWrap;
};


// ─── Block registratie ────────────────────────────────────────────────────────

registerBlockType( metadata.name, {
    ...metadata,
    icon,

    variations: [
        {
            name:      'madeit-default-responsive',
            title:     metadata.title,
            isDefault: true,
            scope:     [ 'inserter' ],
            attributes: {
                overflow:              'visible',
                flexDirection:         'row',
                flexDirectionTablet:   'column',
                flexDirectionMobile:   'column',
                alignItems:            'stretch',
                justifyContent:        'flex-start',
                flexWrap:              'nowrap',
                containerPaddingOnRow: true,
                columnsCount:          0,
                rowGap:                20,
                rowGapUnit:            'px',
                rowGapTablet:          20,
                rowGapUnitTablet:      'px',
                rowGapMobile:          20,
                rowGapUnitMobile:      'px',
            },
        },
    ],

    getEditWrapperProps( attributes ) {
        const { size } = attributes;
        if ( size === 'container-fluid' || size === 'container-content-boxed' ) {
            return { 'data-align': 'full' };
        }
        return { 'data-align': 'container' };
    },

    edit,
    save,

    deprecated: [

        // ── Vpre0b: Geen dubbele classes + inner container div + partial vars ──
        //
        // Meest recente tussenfase vóór de huidige save:
        // - Classes zijn normaal (niet verdubbeld)
        // - Inner <div class="container"> altijd aanwezig (size werd nog niet
        //   doorvertaald naar de inner div class)
        // - Slechts partial CSS-vars (geen row-gap tablet/mobile,
        //   geen flex-direction, geen flex-wrap)
        // - Geen madeitHasUserEdits → dit block werd nog niet gemigreerd
        {
            attributes: metadata.attributes,
            isEligible( attributes ) {
                // Sla over als al gemigreerd
                if ( attributes?.madeitHasUserEdits ) return false;

                const wrapperClassName = typeof attributes?.wrapperClassName === 'string'
                    ? attributes.wrapperClassName : '';
                const tokens = wrapperClassName.trim().split( /\s+/ ).filter( Boolean );

                // Niet matchen als classes verdubbeld zijn (dat is Vpre0)
                const isDoubled = tokens.filter( t => t === 'wp-block-madeit-block-content' ).length >= 2;
                if ( isDoubled ) return false;

                // Moet madeit-block-content--frontend hebben (recente versie)
                // of geen wrapperClassName (nieuwe blocks die nog niet zijn opgeslagen)
                return tokens.includes( 'madeit-block-content--frontend' ) ||
                       tokens.length === 0;
            },
            save: saveVpre0b,
            migrate( attributes ) {
                return { ...normalizeSpacingAttributes( attributes ), madeitHasUserEdits: true };
            },
        },

        // ── Vpre0: Dubbele classes + inner container div + partial vars ────────
        //
        // Veroorzaakt door bug: blockProps.className = classnames( wrapperClass, blockProps.className )
        // gecombineerd met partial CSS-vars.
        {
            attributes: metadata.attributes,
            isEligible( attributes ) {
                const wrapperClassName = typeof attributes?.wrapperClassName === 'string'
                    ? attributes.wrapperClassName : '';
                const tokens = wrapperClassName.trim().split( /\s+/ ).filter( Boolean );
                return tokens.filter( t => t === 'wp-block-madeit-block-content' ).length >= 2;
            },
            save: saveVpre0,
            migrate( attributes ) {
                return { ...normalizeSpacingAttributes( attributes ), madeitHasUserEdits: true };
            },
        },

        // ── V0: Geen inner div + inline margin + volledige CSS-vars ───────────
        {
            attributes: metadata.attributes,
            save: saveV0,
            migrate( attributes ) {
                return { ...normalizeSpacingAttributes( attributes ), madeitHasUserEdits: true };
            },
        },

        // ── V1: Size default veranderd van 'container' naar 'container-content-boxed' (2026-04-17) ──
        {
            attributes: metadata.attributes,
            save: saveV1,
            migrate( attributes ) {
                const wrapperClassName = typeof attributes?.wrapperClassName === 'string'
                    ? attributes.wrapperClassName : '';
                const wrapperTokens = wrapperClassName.trim().length
                    ? wrapperClassName.trim().split( /\s+/ ) : [];

                const wrapperHasContainer      = wrapperTokens.includes( 'container' );
                const wrapperHasContainerFluid = wrapperTokens.includes( 'container-fluid' );
                const isLegacyDefaultContainer = wrapperHasContainer && ! wrapperHasContainerFluid;

                const correctedSize =
                    ( typeof attributes?.size === 'string' &&
                      attributes.size.length > 0 &&
                      attributes.size !== 'container-content-boxed' )
                        ? attributes.size
                        : isLegacyDefaultContainer
                            ? 'container'
                            : attributes.size;

                return {
                    ...attributes,
                    size: correctedSize,
                    madeitHasUserEdits: true,
                };
            },
        },

        // ── V2: Responsive spacing volledig als CSS vars (2026-04-08) ──────────
        {
            attributes: metadata.attributes,
            save: saveV2,
            migrate( attributes ) {
                return { ...normalizeSpacingAttributes( attributes ), madeitHasUserEdits: true };
            },
        },

        // ── V3: Spacing als directe inline stijlen (2026-04-08) ───────────────
        {
            attributes: metadata.attributes,
            save: saveV3,
            migrate( attributes ) {
                return { ...normalizeSpacingAttributes( attributes ), madeitHasUserEdits: true };
            },
        },

        // ── V4: Zonder default CSS vars (2026-03-26) ──────────────────────────
        {
            isEligible( attributes ) {
                return (
                    typeof attributes?.rowGap              === 'number' ||
                    typeof attributes?.rowGapTablet        === 'number' ||
                    typeof attributes?.rowGapMobile        === 'number' ||
                    typeof attributes?.flexDirection       === 'string' ||
                    typeof attributes?.flexDirectionTablet === 'string' ||
                    typeof attributes?.flexDirectionMobile === 'string' ||
                    typeof attributes?.alignItems          === 'string' ||
                    typeof attributes?.justifyContent      === 'string' ||
                    typeof attributes?.flexWrap            === 'string'
                );
            },
            save: saveV4,
            migrate( attributes ) {
                return { ...attributes, madeitHasUserEdits: true };
            },
        },

        // ── V5: Wrapper padding zonder whitespace tekst nodes ─────────────────
        { save: saveV5 },

        // ── V6: Padding op outer wrapper (2026-03-17) ─────────────────────────
        { save: saveV6 },

        // ── V7: Legacy boxed zonder inner container (2026-03-09) ──────────────
        { save: saveV7 },

        // ── V8: Zeer oude markup met plain `.row` (geen `madeit-container-row`) ──
        { save: saveV8 },

        // ── V14: Legacy direct row met overflow:visible geserialiseerd ─────────
        {
            isEligible( attributes ) {
                if ( attributes?.size && attributes.size !== 'container-content-boxed' ) return false;
                const wrapperClassName = typeof attributes?.wrapperClassName === 'string'
                    ? attributes.wrapperClassName : '';
                if ( wrapperClassName.trim().length === 0 ) return true;
                const tokens = wrapperClassName.trim().split( /\s+/ );
                return (
                    tokens.includes( 'container' ) &&
                    ! tokens.includes( 'container-fluid' ) &&
                    tokens.includes( 'madeit-block-content--frontend' )
                );
            },
            attributes: metadata.attributes,
            save: saveV14,
        },

        // ── V15: Legacy wrapper container met inner container ─────────────────
        {
            isEligible( attributes ) {
                if ( attributes?.size && attributes.size !== 'container-content-boxed' ) return false;
                const wrapperClassName = typeof attributes?.wrapperClassName === 'string'
                    ? attributes.wrapperClassName : '';
                const tokens = wrapperClassName.trim().length
                    ? wrapperClassName.trim().split( /\s+/ ) : [];
                return (
                    tokens.includes( 'container' ) &&
                    ! tokens.includes( 'container-fluid' ) &&
                    tokens.includes( 'madeit-block-content--frontend' )
                );
            },
            attributes: metadata.attributes,
            save: saveV15,
        },

        // ── V9: Legacy zonder overflow:visible serialisatie ───────────────────
        { save: saveV9 },

        // ── V10: Pre rowGap responsive vars ───────────────────────────────────
        { save: saveV10 },

        // ── V11: Altijd background-color: transparent (2026-02) ───────────────
        { save: saveV11 },

        // ── V12 ⭐ LIVE OP WEBSITES ────────────────────────────────────────────
        { save: saveV12 },

        // ── V13 ⭐ LIVE OP WEBSITES (alleroudste versie) ──────────────────────
        {
            supports: { html: false },

            attributes: {
                verticalAlignment:              { type: 'string' },
                containerBackgroundColor:       { type: 'string' },
                customContainerBackgroundColor: { type: 'string' },
                size: {
                    type:    'string',
                    default: 'container',
                },
                containerMarginBottom: { type: 'number', default: 0 },
                containerMarginTop:    { type: 'number', default: 0 },
                containerMarginLeft:   { type: 'number', default: 0 },
                containerMarginRight:  { type: 'number', default: 0 },
                containerPaddingTop:    { type: 'number', default: 0 },
                containerPaddingBottom: { type: 'number', default: 0 },
                containerPaddingLeft:   { type: 'number', default: 0 },
                containerPaddingRight:  { type: 'number', default: 0 },
                rowBackgroundColor:       { type: 'string' },
                customRowBackgroundColor: { type: 'string' },
                rowTextColor:             { type: 'string' },
                customRowTextColor:       { type: 'string' },
                rowMarginBottom: { type: 'number', default: 0 },
                rowMarginTop:    { type: 'number', default: 0 },
                rowMarginLeft:   { type: 'number', default: 0 },
                rowMarginRight:  { type: 'number', default: 0 },
                rowPaddingTop:    { type: 'number', default: 0 },
                rowPaddingBottom: { type: 'number', default: 0 },
                rowPaddingLeft:   { type: 'number', default: 0 },
                rowPaddingRight:  { type: 'number', default: 0 },
            },

            save: saveV13,

            migrate( attributes ) {
                const toPx = ( value ) =>
                    value !== null && value !== undefined ? value + 'px' : undefined;

                const wrapperClassName = typeof attributes?.wrapperClassName === 'string'
                    ? attributes.wrapperClassName : '';
                const wrapperTokens = wrapperClassName.trim().split( /\s+/ );
                const wrapperHasContainerFluid = wrapperTokens.includes( 'container-fluid' );
                const migratedSize = wrapperHasContainerFluid ? 'container-fluid'
                    : ( attributes.size || 'container' );

                return {
                    containerPadding: {
                        top:    toPx( attributes.containerPaddingTop ),
                        bottom: toPx( attributes.containerPaddingBottom ),
                        left:   toPx( attributes.containerPaddingLeft ),
                        right:  toPx( attributes.containerPaddingRight ),
                    },
                    containerMargin: {
                        top:    toPx( attributes.containerMarginTop ),
                        bottom: toPx( attributes.containerMarginBottom ),
                        left:   toPx( attributes.containerMarginLeft ),
                        right:  toPx( attributes.containerMarginRight ),
                    },
                    rowPadding: {
                        top:    toPx( attributes.rowPaddingTop ),
                        bottom: toPx( attributes.rowPaddingBottom ),
                        left:   toPx( attributes.rowPaddingLeft ),
                        right:  toPx( attributes.rowPaddingRight ),
                    },
                    rowMargin: {
                        top:    toPx( attributes.rowMarginTop ),
                        bottom: toPx( attributes.rowMarginBottom ),
                        left:   toPx( attributes.rowMarginLeft ),
                        right:  toPx( attributes.rowMarginRight ),
                    },
                    size:                           migratedSize,
                    verticalAlignment:              attributes.verticalAlignment,
                    containerBackgroundColor:       attributes.containerBackgroundColor,
                    customContainerBackgroundColor: attributes.customContainerBackgroundColor,
                    madeitHasUserEdits:             true,
                };
            },
        },

    ],
} );
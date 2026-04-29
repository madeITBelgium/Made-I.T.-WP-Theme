/**
 * index.js — madeit/block-content
 *
 * Registreert het block type en definieert:
 * - Variaties (layout presets)
 * - Edit & save functies
 * - Deprecated versies (voor backward compatibility met bestaande content)
 *
 * DEPRECATED VOLGORDE
 * ───────────────────
 * Gutenberg doorloopt de deprecated array van boven naar onder.
 * De meest recente deprecated versie staat bovenaan (saveV1),
 * de oudste versie staat onderaan (saveV13).
 *
 * ⚠️  BELANGRIJK: Verwijder nooit een deprecated versie tenzij je 100% zeker
 * bent dat er geen live content meer bestaat die met die versie werd opgeslagen.
 */

import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

import edit from './edit';
import save from './save';
import metadata from './../block.json';
import icon from './icon';

import {
    saveV1, saveV2, saveV3, saveV4, saveV5, saveV6,
    saveV7, saveV8, saveV9, saveV10, saveV11, saveV12,
    saveV13, saveV14, saveV15,
} from './save-versions';


// ─── Hulpfuncties voor migrate() ──────────────────────────────────────────────

/**
 * Normaliseert een CSS-lengtewaarde naar een string met eenheid.
 * - Getal:             20       → '20px'
 * - Getal met eenheid: '1.5rem' → '1.5rem'
 * - Leeg / undefined:           → undefined
 */
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

/**
 * Normaliseert een spacing-object { top, right, bottom, left }.
 * Zorgt ervoor dat alle 4 zijden aanwezig zijn als minstens één zijde een waarde heeft.
 * Dit voorkomt ongeldige CSS-var-kortschriften in responsieve stijlen.
 */
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

/**
 * Normaliseert alle spacing-attributen van een block (margin + padding).
 * Gebruik dit in migrate()-functies om verouderde waarden op te schonen.
 */
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


// ─── Block registratie ────────────────────────────────────────────────────────

registerBlockType( metadata.name, {
    ...metadata,
    icon,

    /**
     * Variaties / Layout presets
     *
     * Deze waarden worden automatisch als attributen ingesteld wanneer iemand
     * het block toevoegt via de inserter. Ze wijzigen bestaande blocks NIET.
     */
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

    /**
     * Bepaalt de breedte van het block in de editor.
     * Full-width voor fluid containers, normale breedte voor boxed.
     */
    getEditWrapperProps( attributes ) {
        const { size } = attributes;
        if ( size === 'container-fluid' || size === 'container-content-boxed' ) {
            return { 'data-align': 'full' };
        }
        return { 'data-align': 'container' };
    },

    edit,
    save,


    // ─── Deprecated versies ────────────────────────────────────────────────────
    //
    // Volgorde: meest recent bovenaan (V1), oudste onderaan (V13).
    // Gutenberg probeert ze van boven naar onder totdat er een match is.

    deprecated: [

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

                const isLegacyDefaultContainer =
                    wrapperHasContainer && ! wrapperHasContainerFluid;

                if (
                    ( typeof attributes?.size === 'string' &&
                      attributes.size.length > 0 &&
                      attributes.size !== 'container-content-boxed' ) ||
                    ! isLegacyDefaultContainer
                ) {
                    return attributes;
                }

                return { ...attributes, size: 'container' };
            },
        },

        // ── V2: Responsive spacing volledig als CSS vars (2026-04-08) ──────────
        {
            attributes: metadata.attributes,
            save: saveV2,
            migrate: normalizeSpacingAttributes,
        },

        // ── V3: Spacing als directe inline stijlen (2026-04-08) ───────────────
        {
            attributes: metadata.attributes,
            save: saveV3,
            migrate: normalizeSpacingAttributes,
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
            save:    saveV4,
            migrate: ( attributes ) => attributes,
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
        // Object-gebaseerde spacing, `<div class="row">` typo,
        // geen madeit-block-content--frontend klasse, geen flex CSS vars.
        { save: saveV12 },

        // ── V13 ⭐ LIVE OP WEBSITES (alleroudste versie) ──────────────────────
        // Afzonderlijke numerieke attributen (containerPaddingTop, etc.)
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
                    value !== null && value !== undefined
                        ? value + 'px'
                        : undefined;

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
                    size:                           attributes.size,
                    verticalAlignment:              attributes.verticalAlignment,
                    containerBackgroundColor:       attributes.containerBackgroundColor,
                    customContainerBackgroundColor: attributes.customContainerBackgroundColor,
                };
            },
        },

    ],
} );
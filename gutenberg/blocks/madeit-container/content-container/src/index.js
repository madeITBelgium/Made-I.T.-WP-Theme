/**
 * index.js — madeit/block-content
 *
 * DEPRECATED VERSIES — van meest recent naar oudst
 * ─────────────────────────────────────────────────
 * Elke entry heeft een migrate() die madeitHasUserEdits: true zet en de
 * correcte size afleidt. Hierdoor migreert Gutenberg de content automatisch
 * naar de nieuwe structuur zodra een pagina wordt ingeladen — zonder dat de
 * gebruiker hoeft op te slaan.
 *
 * VERSIES (6 i.p.v. 16):
 *   VnoDir – Standaard markup, geen data-madeit-dir-tablet/mobile
 *   Vboxed – Boxed markup met .col wrapper en inner row zonder data attrs
 *   Vdirect – Directe row + inline margin styles
 *   Vpre0b – Inner div aanwezig, normale classes, partial CSS-vars
 *   Vpre0  – Inner div aanwezig, dubbele classes (bug)
 *   V9     – Inline margin (geen CSS-var), container-fluid + frontend-class
 *   V12    ⭐ LIVE: wrapper = container, geen frontend-class, JSX typo
 *   V13    ⭐ LIVE: numerieke attributen (alleroudst)
 *
 * VERWIJDERD (intern, nooit live gegaan):
 *   V1, V2, V3, V5, V7, V8, V9, V10, V11, V14, V15
 */

import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

import edit from './edit';
import save from './save';
import metadata from './../block.json';
import icon from './icon';

import {
    saveVnoResponsiveDir,
    saveVlegacyBoxedInnerRow,
    saveVlegacyDirectRowInlineStyle,
    saveVpre0b,
    saveVpre0,
    saveV9,
    saveV5,
    saveV12,
    saveV13,
} from './save-versions';


// ─── Hulpfuncties ─────────────────────────────────────────────────────────────

const normalizeCssLength = ( value, unit = 'px' ) => {
    if ( value === undefined || value === null ) return undefined;
    if ( typeof value === 'number' && Number.isFinite( value ) ) return `${ value }${ unit }`;
    if ( typeof value !== 'string' ) return undefined;
    const t = value.trim();
    if ( ! t ) return undefined;
    if ( /^-?\d+(?:\.\d+)?$/.test( t ) ) return `${ t }${ unit }`;
    if ( /^-?\d+(?:\.\d+)?[a-z%]+$/i.test( t ) ) return t;
    return undefined;
};

const normalizeSpacingObject = ( s ) => {
    if ( ! s || typeof s !== 'object' ) return undefined;
    const { top, right, bottom, left } = s;
    if ( ! [ top, right, bottom, left ].some( v => v !== undefined && v !== null && String( v ).trim() ) ) return undefined;
    return {
        top:    normalizeCssLength( top )    ?? '0px',
        right:  normalizeCssLength( right )  ?? '0px',
        bottom: normalizeCssLength( bottom ) ?? '0px',
        left:   normalizeCssLength( left )   ?? '0px',
    };
};

const normalizeSpacing = ( attrs ) => {
    const n = { ...( attrs || {} ) };
    n.containerMargin        = normalizeSpacingObject( n.containerMargin );
    n.containerMarginTablet  = normalizeSpacingObject( n.containerMarginTablet );
    n.containerMarginMobile  = normalizeSpacingObject( n.containerMarginMobile );
    n.containerPadding       = normalizeSpacingObject( n.containerPadding );
    n.containerPaddingTablet = normalizeSpacingObject( n.containerPaddingTablet );
    n.containerPaddingMobile = normalizeSpacingObject( n.containerPaddingMobile );
    n.rowMargin              = normalizeSpacingObject( n.rowMargin );
    n.rowPadding             = normalizeSpacingObject( n.rowPadding );
    return n;
};

/**
 * Leidt de correcte `size` af uit wrapperClassName.
 * Zo weet de nieuwe save() of hij container of container-fluid moet renderen.
 */
const resolveSize = ( attrs ) => {
    const { size, wrapperClassName } = attrs;
    // Vertrouw een expliciete niet-boxed size
    if ( size === 'container-fluid' ) return 'container-fluid';
    // Afleiden uit opgeslagen wrapper klassen
    const tokens = typeof wrapperClassName === 'string'
        ? wrapperClassName.trim().split( /\s+/ ) : [];
    if ( tokens.includes( 'container-fluid' ) ) return 'container-fluid';
    if ( tokens.includes( 'container' ) )       return 'container';
    return 'container'; // fallback
};

/**
 * Standaard migrate: normaliseer spacing + zet madeitHasUserEdits.
 * Dit zorgt dat de nieuwe save() de juiste markup genereert zonder opslaan.
 */
const migrate = ( attrs ) => ( {
    ...normalizeSpacing( attrs ),
    size:               resolveSize( attrs ),
    madeitHasUserEdits: true,
} );


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
        if ( size === 'container-fluid' ) {
            return { 'data-align': 'full' };
        }
        return { 'data-align': 'container' };
    },

    edit,
    save,

    deprecated: [

        // ── V5 ───────────────────────────────────────────────────────────────
        // Legacy markup met inline margin/padding styles en optioneel de oude
        // frontend wrapper class. Dit dekt oudere frontend- en non-frontend
        // wrappers met inline container margin.
        {
            attributes: metadata.attributes,
            isEligible( attrs ) {
                if ( attrs?.madeitHasUserEdits ) return false;
                const ws = ( attrs?.wrapperStyle ?? '' ).replace( /\s+/g, '' );
                if ( ! ws ) return false;
                const hasInlineMargin = /(?:^|;)margin-[a-zA-Z0-9-]+:/.test( ws );
                return hasInlineMargin && ! ws.includes( '--madeit-container-margin' );
            },
            save: saveV5,
            migrate,
        },

        // ── Vpre0b ────────────────────────────────────────────────────────────
        // Inner container div aanwezig, normale klassen, partial CSS-vars.
        // Meest recente tussenfase vóór de huidige save.
        {
            attributes: metadata.attributes,
            isEligible( attrs ) {
                if ( attrs?.madeitHasUserEdits ) return false;
                const tokens = ( attrs?.wrapperClassName ?? '' ).trim().split( /\s+/ ).filter( Boolean );
                // Niet matchen als klassen verdubbeld zijn (dat is Vpre0)
                if ( tokens.filter( t => t === 'wp-block-madeit-block-content' ).length >= 2 ) return false;
                const ws = ( attrs?.wrapperStyle ?? '' ).replace( /\s+/g, '' );
                if ( /(?:^|;)margin-[a-zA-Z0-9-]+:/.test( ws ) ) return false;
                return tokens.includes( 'madeit-block-content--frontend' ) || tokens.length === 0;
            },
            save: saveVpre0b,
            migrate,
        },

        // ── Vpre0 ─────────────────────────────────────────────────────────────
        // Inner container div aanwezig maar klassen zijn verdubbeld door een bug
        // (blockProps.className werd samengevoegd met wrapperClass).
        {
            attributes: metadata.attributes,
            isEligible( attrs ) {
                const tokens = ( attrs?.wrapperClassName ?? '' ).trim().split( /\s+/ ).filter( Boolean );
                return tokens.filter( t => t === 'wp-block-madeit-block-content' ).length >= 2;
            },
            save: saveVpre0,
            migrate,
        },

        // ── VnoDir ───────────────────────────────────────────────────────────
        // Standaard markup maar zonder data-madeit-dir-tablet/mobile.
        {
            attributes: metadata.attributes,
            isEligible( attrs ) {
                if ( attrs?.madeitHasUserEdits ) return false;
                if ( attrs?.flexDirectionTablet !== undefined && attrs?.flexDirectionTablet !== null ) return false;
                if ( attrs?.flexDirectionMobile !== undefined && attrs?.flexDirectionMobile !== null ) return false;
                const tokens = ( attrs?.wrapperClassName ?? '' ).trim().split( /\s+/ ).filter( Boolean );
                return tokens.includes( 'madeit-block-content--frontend' );
            },
            save: saveVnoResponsiveDir,
            migrate,
        },

        // ── Vboxed ───────────────────────────────────────────────────────────
        // Boxed markup met .col wrapper en inner row zonder data attrs.
        {
            attributes: metadata.attributes,
            isEligible( attrs ) {
                if ( attrs?.madeitHasUserEdits ) return false;
                const boxedInnerRow = typeof attrs?.boxedInnerRowClassName === 'string'
                    ? attrs.boxedInnerRowClassName.trim() : '';
                const boxedInnerContainer = typeof attrs?.boxedInnerContainerClassName === 'string'
                    ? attrs.boxedInnerContainerClassName.trim() : '';
                if ( ! boxedInnerRow ) return false;
                if ( ! boxedInnerContainer ) return false;
                const wrapperTokens = ( attrs?.wrapperClassName ?? '' ).trim().split( /\s+/ ).filter( Boolean );
                const hasFrontendClass = wrapperTokens.includes( 'madeit-block-content--frontend' );
                const hasMadeitRowClass = boxedInnerRow.includes( 'madeit-container-row' );
                return hasFrontendClass || hasMadeitRowClass;
            },
            save: saveVlegacyBoxedInnerRow,
            migrate( attrs ) {
                return {
                    ...migrate( attrs ),
                    size: 'container',
                };
            },
        },

        // ── Vdirect ──────────────────────────────────────────────────────────
        // Directe row + inline margin styles op wrapper (geen CSS-var margins).
        {
            attributes: metadata.attributes,
            isEligible( attrs ) {
                if ( attrs?.madeitHasUserEdits ) return false;
                const directRowClass = typeof attrs?.directRowClassName === 'string'
                    ? attrs.directRowClassName.trim() : '';
                if ( ! directRowClass ) return false;
                const ws = typeof attrs?.wrapperStyle === 'string'
                    ? attrs.wrapperStyle.replace( /\s+/g, '' ) : '';
                if ( ! ws ) return false;
                if ( ws.includes( '--madeit-container-margin' ) ) return false;
                return ws.includes( 'margin-top:' ) || ws.includes( 'margin-bottom:' ) || ws.includes( 'margin-left:' ) || ws.includes( 'margin-right:' );
            },
            save: saveVlegacyDirectRowInlineStyle,
            migrate,
        },

        // ── V9 ────────────────────────────────────────────────────────────────
        // Container-fluid wrapper MET frontend-class, maar margin als inline stijl
        // (margin-bottom:30px) i.p.v. CSS-var. Geen inner container div.
        // isEligible herkent de inline margin in de opgeslagen wrapperStyle.
        {
            attributes: metadata.attributes,
            isEligible( attrs ) {
                if ( attrs?.madeitHasUserEdits ) return false;
                const wrapperTokens = ( attrs?.wrapperClassName ?? '' ).trim().split( /\s+/ ).filter( Boolean );
                if ( ! wrapperTokens.includes( 'madeit-block-content--frontend' ) ) return false;
                if ( ! wrapperTokens.includes( 'container-fluid' ) ) return false;
                const ws = ( attrs?.wrapperStyle ?? '' ).replace( /\s+/g, '' );
                if ( ! ws ) return false;
                return ( ws.includes( 'margin-top:' ) || ws.includes( 'margin-bottom:' ) ) &&
                       ! ws.includes( '--madeit-container-margin' );
            },
            save: saveV9,
            migrate,
        },

        // ── V5 ────────────────────────────────────────────────────────────────
        // Legacy markup met inline margin/padding styles en optioneel de oude
        // frontend wrapper class. Dit dekt oudere frontend- en non-frontend
        // wrappers met inline container margin.
        {
            attributes: metadata.attributes,
            isEligible( attrs ) {
                if ( attrs?.madeitHasUserEdits ) return false;
                const ws = ( attrs?.wrapperStyle ?? '' ).replace( /\s+/g, '' );
                if ( ! ws ) return false;
                return ( ws.includes( 'margin-top:' ) || ws.includes( 'margin-bottom:' ) ) &&
                       ! ws.includes( '--madeit-container-margin' );
            },
            save: saveV5,
            migrate,
        },

        // ── V12 ⭐ LIVE OP WEBSITES ────────────────────────────────────────────
        // Wrapper = container (niet container-fluid), geen madeit-block-content--frontend
        // klasse, JSX typo `class="row"` i.p.v. `className="row"`, geen CSS-vars.
        // Dit is de versie die op alle huidige live websites staat.
        {
            attributes: metadata.attributes,
            save: saveV12,
            migrate,
        },



        // ── V13 ⭐ LIVE OP WEBSITES ────────────────────────────────────────────
        // Alleroudste versie met afzonderlijke numerieke attributen
        // (containerPaddingTop, containerMarginBottom, etc.).
        {
            supports: { html: false },
            attributes: {
                verticalAlignment:              { type: 'string' },
                containerBackgroundColor:       { type: 'string' },
                customContainerBackgroundColor: { type: 'string' },
                size: { type: 'string', default: 'container' },
                containerMarginBottom:  { type: 'number', default: 0 },
                containerMarginTop:     { type: 'number', default: 0 },
                containerMarginLeft:    { type: 'number', default: 0 },
                containerMarginRight:   { type: 'number', default: 0 },
                containerPaddingTop:    { type: 'number', default: 0 },
                containerPaddingBottom: { type: 'number', default: 0 },
                containerPaddingLeft:   { type: 'number', default: 0 },
                containerPaddingRight:  { type: 'number', default: 0 },
                rowBackgroundColor:       { type: 'string' },
                customRowBackgroundColor: { type: 'string' },
                rowTextColor:             { type: 'string' },
                customRowTextColor:       { type: 'string' },
                rowMarginBottom:  { type: 'number', default: 0 },
                rowMarginTop:     { type: 'number', default: 0 },
                rowMarginLeft:    { type: 'number', default: 0 },
                rowMarginRight:   { type: 'number', default: 0 },
                rowPaddingTop:    { type: 'number', default: 0 },
                rowPaddingBottom: { type: 'number', default: 0 },
                rowPaddingLeft:   { type: 'number', default: 0 },
                rowPaddingRight:  { type: 'number', default: 0 },
            },
            save: saveV13,
            migrate( attrs ) {
                const px = v => ( v !== null && v !== undefined && v > 0 ) ? `${ v }px` : undefined;
                return {
                    containerPadding: {
                        top:    px( attrs.containerPaddingTop ),
                        bottom: px( attrs.containerPaddingBottom ),
                        left:   px( attrs.containerPaddingLeft ),
                        right:  px( attrs.containerPaddingRight ),
                    },
                    containerMargin: {
                        top:    px( attrs.containerMarginTop ),
                        bottom: px( attrs.containerMarginBottom ),
                        left:   px( attrs.containerMarginLeft ),
                        right:  px( attrs.containerMarginRight ),
                    },
                    rowPadding: {
                        top:    px( attrs.rowPaddingTop ),
                        bottom: px( attrs.rowPaddingBottom ),
                        left:   px( attrs.rowPaddingLeft ),
                        right:  px( attrs.rowPaddingRight ),
                    },
                    rowMargin: {
                        top:    px( attrs.rowMarginTop ),
                        bottom: px( attrs.rowMarginBottom ),
                        left:   px( attrs.rowMarginLeft ),
                        right:  px( attrs.rowMarginRight ),
                    },
                    size:                           resolveSize( attrs ),
                    verticalAlignment:              attrs.verticalAlignment,
                    containerBackgroundColor:       attrs.containerBackgroundColor,
                    customContainerBackgroundColor: attrs.customContainerBackgroundColor,
                    madeitHasUserEdits:             true,
                };
            },
        },

    ],
} );
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

import edit from './edit';
import save from './save';
import metadata from './../block.json';
import icon from './icon';

// Oude save versies importeren
import { saveV1, saveV2, saveV3, saveV4, saveV5, saveV6, saveV7, saveV8, saveV9, saveV10, saveV11, saveV12, saveV13, saveV14, saveV15,
} from './save-versions';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
    ...metadata,
    icon,

    //? Wanneer iemand block toevoegd -> Deze waarden worden automatisch toegevoegd aan de attributes van het block
    //? Deze waarden worden ook gebruikt als default waarden bij het renderen van het block
    //? Het veranderd de bestaande block niet!
    variations: [
        {
            name: 'madeit-default-responsive',
            title: metadata.title,
            isDefault: true,
            
            scope: [ 'inserter' ],
            attributes: {
                overflow: 'visible',
                flexDirection: 'row',
                flexDirectionTablet: 'column',
                flexDirectionMobile: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                flexWrap: 'nowrap',
                containerPaddingOnRow: true,
                columnsCount: 0,
                rowGap: 20,
                rowGapUnit: 'px',
                rowGapTablet: 20,
                rowGapUnitTablet: 'px',
                rowGapMobile: 20,
                rowGapUnitMobile: 'px',
            },
        },
    ],
    
    getEditWrapperProps( attributes ) {
        const { size } = attributes;
        if ( 'container-fluid' === size || 'container-content-boxed' === size) {
            return { 'data-align': 'full' };
        }
        return { 'data-align': 'container' };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,

    deprecated: [
        {
            // Deprecated (2026-04-17): `size` default changed from `container`
            // to `container-content-boxed`. Keep old content without an explicit
            // `size` attribute valid by serializing with legacy fallback.
            save: saveV1,
            migrate: function( attributes ) {
                const wrapperClassName =
                    typeof attributes?.wrapperClassName === 'string'
                        ? attributes.wrapperClassName
                        : '';
                const wrapperTokens = wrapperClassName.trim().length
                    ? wrapperClassName.trim().split( /\s+/ )
                    : [];

                const wrapperHasContainer = wrapperTokens.includes( 'container' );
                const wrapperHasContainerFluid = wrapperTokens.includes( 'container-fluid' );

                const isLegacyDefaultContainerMarkup =
                    wrapperHasContainer && ! wrapperHasContainerFluid;

                if (
                    ( typeof attributes?.size === 'string' &&
                        attributes.size.length > 0 &&
                        attributes.size !== 'container-content-boxed' ) ||
                    ! isLegacyDefaultContainerMarkup
                ) {
                    return attributes;
                }

                return {
                    ...attributes,
                    size: 'container',
                };
            },
        },
        {
            // Deprecated (2026-04-08): spacing serialized entirely as CSS vars
            // (desktop/tablet/mobile). Kept for validation.
            save: saveV2,
            migrate: function( attributes ) {
                return attributes;
            },
        },
        {
            // Deprecated (2026-04-08): spacing was serialized as direct inline
            // margin/padding styles. Current save() uses CSS variables for
            // responsive padding/margin.
            save: saveV3,
            migrate: function( attributes ) {
                return attributes;
            },
        },
        {
            /** Deprecated (2026-03-26):
             * - Remove default css variables
             */
            isEligible: function( attributes ) {
                const hasLegacyDefaultVars =
                    typeof attributes?.rowGap === 'number' ||
                    typeof attributes?.rowGapTablet === 'number' ||
                    typeof attributes?.rowGapMobile === 'number' ||
                    typeof attributes?.flexDirection === 'string' ||
                    typeof attributes?.flexDirectionTablet === 'string' ||
                    typeof attributes?.flexDirectionMobile === 'string' ||
                    typeof attributes?.alignItems === 'string' ||
                    typeof attributes?.justifyContent === 'string' ||
                    typeof attributes?.flexWrap === 'string';

                return hasLegacyDefaultVars;
            },
            save: saveV4,
            migrate: function( attributes ) {
                return attributes;
            },
        },
        {
            // Deprecated (2026-03-17):
            // Same as the wrapper-padding legacy serializer, but without
            // explicit whitespace text nodes. This helps match older saved
            // content across different serialization histories.
            save: saveV5,
        },
        {
            // Deprecated (2026-03-17):
            // containerPadding used to be serialized on the outer wrapper
            // instead of `.madeit-container-row`.
            save: saveV6,
        },
        {
            // Deprecated (2026-03-09):
            // Boxed (`size: container`) used to serialize the container background
            // on the outer wrapper, without an inner `.container` wrapper.
            // Kept to avoid validation errors for existing content.
            save: saveV7,
        },
        {
            // Deprecated (very old markup):
            // - No `madeit-block-content--frontend` class on the wrapper
            // - Inner wrapper was a plain `.row` (no `madeit-container-row`, no data attrs)
            // Keep this so copy/pasting older blocks won't require recovery.
            save: saveV8,
        },

        {
            // Deprecated (legacy direct-row markup + overflow:visible + default flex vars):
            // Some older content was saved with:
            // - wrapper `.container` (not container-fluid)
            // - direct `.row.madeit-container-row` child
            // - `overflow:visible` serialized inline (even though it's the default)
            isEligible: function( attributes ) {
                // Only target legacy content that now parses with the new default size
                // (`container-content-boxed`) but was saved as a boxed `.container` wrapper.
                if ( attributes?.size && attributes.size !== 'container-content-boxed' ) {
                    return false;
                }

                const wrapperClassName =
                    typeof attributes?.wrapperClassName === 'string'
                        ? attributes.wrapperClassName
                        : '';

                // If the wrapper class cannot be derived (unexpected parser edge),
                // do not skip this variant: it is safe to try and will only match
                // if markup is identical.
                if ( wrapperClassName.trim().length === 0 ) {
                    return true;
                }

                const wrapperTokens = wrapperClassName.trim().split( /\s+/ );

                const hasContainer = wrapperTokens.includes( 'container' );
                const hasContainerFluid = wrapperTokens.includes( 'container-fluid' );
                const hasFrontend = wrapperTokens.includes( 'madeit-block-content--frontend' );

                return hasContainer && ! hasContainerFluid && hasFrontend;
            },
            attributes: metadata.attributes,
            save: saveV14,
        },

        {
            // Deprecated (legacy boxed wrapper + inner container wrapper):
            // Some older content was saved with:
            // - wrapper `.container.madeit-block-content--frontend`
            // - inner `.container` wrapper
            // - `.row.madeit-container-row` inside that container (no `.col` wrapper)
            isEligible: function( attributes ) {
                if ( attributes?.size && attributes.size !== 'container-content-boxed' ) {
                    return false;
                }

                const wrapperClassName =
                    typeof attributes?.wrapperClassName === 'string'
                        ? attributes.wrapperClassName
                        : '';
                const wrapperTokens = wrapperClassName.trim().length
                    ? wrapperClassName.trim().split( /\s+/ )
                    : [];

                const hasContainer = wrapperTokens.includes( 'container' );
                const hasContainerFluid = wrapperTokens.includes( 'container-fluid' );
                const hasFrontend = wrapperTokens.includes( 'madeit-block-content--frontend' );

                // NOTE: older content often did not serialize `contentWidth` at all.
                // The structural signature we care about is `.container` (no fluid)
                // + `madeit-block-content--frontend` on the wrapper.
                return hasContainer && ! hasContainerFluid && hasFrontend;
            },
            attributes: metadata.attributes,
            save: saveV15,
        },

        {
            // Deprecated (legacy markup):
            // - Wrapper *did* include `madeit-block-content--frontend`
            // - Inner wrapper *did* include `.madeit-container-row` + data attrs
            // - But `overflow:visible` was NOT serialized in the style attribute
            // - The inner row wrapper contained newline whitespace
            // Needed for older/copy-pasted content that predates the overflow serialization.
            save: saveV9,
        },
        {
            // Deprecated version (pre rowGap responsive vars):
            // Only the desktop row-gap var was serialized (tablet/mobile were ignored),
            // and the inner row wrapper contained newline whitespace.
            // Keep this to prevent "Try recovery" on existing content.
            save: saveV10,
        },
        {
            // Deprecated version (2026-02): matched a save() that always serialized
            // `background-color: transparent` when no explicit background was set.
            // Keeping this prevents "This block contains unexpected or invalid content"
            // for content saved during that period.
            save: saveV11,
        },
        {
            /**
             * Deprecated version (2026-02)
             */
            save: saveV12,
        },

        {
            supports: {
                html: false,
            },

            attributes: {
                verticalAlignment: {
                    type: "string"
                },
                containerBackgroundColor: {
                    type: 'string',
                },
                customContainerBackgroundColor: {
                    type: 'string',
                },
                size: {
                    type: 'string',
                    default: 'container',
                },
                containerMarginBottom: {
                    type: 'number',
                    default: 0
                },
                containerMarginTop: {
                    type: 'number',
                    default: 0
                },
                containerMarginLeft: {
                    type: 'number',
                    default: 0
                },
                containerMarginRight: {
                    type: 'number',
                    default: 0
                },
                containerPaddingTop: {
                    type: 'number',
                    default: 0
                },
                containerPaddingBottom: {
                    type: 'number',
                    default: 0
                },
                containerPaddingLeft: {
                    type: 'number',
                    default: 0
                },
                containerPaddingRight: {
                    type: 'number',
                    default: 0
                },
                rowBackgroundColor: {
                    type: 'string',
                },
                customRowBackgroundColor: {
                    type: 'string',
                },
                rowTextColor: {
                    type: 'string',
                },
                customRowTextColor: {
                    type: 'string',
                },
                rowMarginBottom: {
                    type: 'number',
                    default: 0
                },
                rowMarginTop: {
                    type: 'number',
                    default: 0
                },
                rowMarginLeft: {
                    type: 'number',
                    default: 0
                },
                rowMarginRight: {
                    type: 'number',
                    default: 0
                },
                rowPaddingTop: {
                    type: 'number',
                    default: 0
                },
                rowPaddingBottom: {
                    type: 'number',
                    default: 0
                },
                rowPaddingLeft: {
                    type: 'number',
                    default: 0
                },
                rowPaddingRight: {
                    type: 'number',
                    default: 0
                },
            },

            migrate( attributes ) {
                return {
                    containerPadding: {
                        top: attributes.containerPaddingTop !== null && attributes.containerPaddingTop !== undefined ? (attributes.containerPaddingTop + 'px') : undefined,
                        bottom: attributes.containerPaddingBottom !== null && attributes.containerPaddingBottom !== undefined ? (attributes.containerPaddingBottom + 'px') : undefined,
                        left: attributes.containerPaddingLeft !== null && attributes.containerPaddingLeft !== undefined ? (attributes.containerPaddingLeft + 'px') : undefined,
                        right: attributes.containerPaddingRight !== null && attributes.containerPaddingRight !== undefined ? (attributes.containerPaddingRight + 'px') : undefined,
                    },
                    containerMargin: {
                        top: attributes.containerMarginTop !== null && attributes.containerMarginTop !== undefined ? (attributes.containerMarginTop + 'px') : undefined,
                        bottom: attributes.containerMarginBottom !== null && attributes.containerMarginBottom !== undefined ? (attributes.containerMarginBottom + 'px') : undefined,
                        left: attributes.containerMarginLeft !== null && attributes.containerMarginLeft !== undefined ? (attributes.containerMarginLeft + 'px') : undefined,
                        right: attributes.containerMarginRight !== null && attributes.containerMarginRight !== undefined ? (attributes.containerMarginRight + 'px') : undefined,
                    },
                    rowPadding: {
                        top: attributes.rowPaddingTop !== null && attributes.rowPaddingTop !== undefined ? (attributes.rowPaddingTop + 'px') : undefined,
                        bottom: attributes.rowPaddingBottom !== null && attributes.rowPaddingBottom !== undefined ? (attributes.rowPaddingBottom + 'px') : undefined,
                        left: attributes.rowPaddingLeft !== null && attributes.rowPaddingLeft !== undefined ? (attributes.rowPaddingLeft + 'px') : undefined,
                        right: attributes.rowPaddingRight !== null && attributes.rowPaddingRight !== undefined ? (attributes.rowPaddingRight + 'px') : undefined,
                    },
                    rowMargin: {
                        top: attributes.rowMarginTop !== null && attributes.rowMarginTop !== undefined ? (attributes.rowMarginTop + 'px') : undefined,
                        bottom: attributes.rowMarginBottom !== null && attributes.rowMarginBottom !== undefined ? (attributes.rowMarginBottom + 'px') : undefined,
                        left: attributes.rowMarginLeft !== null && attributes.rowMarginLeft !== undefined ? (attributes.rowMarginLeft + 'px') : undefined,
                        right: attributes.rowMarginRight !== null && attributes.rowMarginRight !== undefined ? (attributes.rowMarginRight + 'px') : undefined,
                    },
                    size: attributes.size,
                    verticalAlignment: attributes.verticalAlignment,
                    containerBackgroundColor: attributes.containerBackgroundColor,
                    customContainerBackgroundColor: attributes.customContainerBackgroundColor
                };
            },

            save: saveV13,
        },
    ],
} );

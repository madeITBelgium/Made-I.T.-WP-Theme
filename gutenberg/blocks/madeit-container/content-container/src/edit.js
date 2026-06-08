/**
 * edit.js — madeit-block-content
*
*/
import classnames from 'classnames';
import { dropRight, get, map, times } from 'lodash';
import { __ } from '@wordpress/i18n';
import { 
    useBlockProps,
    InspectorControls,
    InnerBlocks,
    BlockControls,
    BlockVerticalAlignmentToolbar,
    ContrastChecker,
    PanelColorSettings,
    MediaUpload,
    MediaUploadCheck,
    withColors,
} from '@wordpress/block-editor';
import { createBlock, store as blocksStore } from '@wordpress/blocks';
import { useState, useEffect, useRef } from "@wordpress/element";
import { compose } from "@wordpress/compose";
import { withDispatch, useDispatch, useSelect } from "@wordpress/data";
import { 
    PanelBody, 
    RangeControl, 
    SVG, 
    Path, 
    Icon,
    SelectControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    ToggleControl,
    Card,
    CardBody,
    Flex,
    FlexItem,
    GradientPicker as GradientControl,
    __experimentalBoxControl as BoxControl,
    __experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from "@wordpress/components";
import {
    getColumnsTemplate,
    hasExplicitColumnWidths,
    getMappedColumnWidths,
    getRedistributedColumnWidths,
    toWidthPrecision,
} from './utils.js';
import { ControlHeader, ResponsiveBoxControl, ResponsiveVisibilityPanel, UnitSelect, AdvancedUnitSelect } from '../../../../shared';
import containerVariations from './variations';
import './editor.scss';


const ALLOWED_BLOCKS = [ 'madeit/block-content-column' ];



// ─── 1. Inner component: heeft toegang tot BreakpointContext ─────────────────

export function ColumnsEditContainer( props ) {
    const {
        attributes,
        setAttributes,
        className,
        updateAlignment,
        updateColumns,
        clientId,
        containerBackgroundColor,
        setContainerBackgroundColor,
        rowBackgroundColor,
        setRowBackgroundColor,
        rowTextColor,
        setRowTextColor
    } = props;

    const isBlockSelected = useSelect(
        ( select ) => select( 'core/block-editor' )?.isBlockSelected?.( clientId ),
        [ clientId ]
    );
    
    const {
        // ─── General attributes ─────────────────
        verticalAlignment, 
        size,

        // ─── Container attributes ─────────────────
        contentWidth,
        containerMargin,
        containerMarginTablet,
        containerMarginMobile,
        containerPadding,
        containerPaddingTablet,
        containerPaddingMobile,
        containerPaddingOnRow,

        // ─── Row attributes (only for "container-content-boxed" size) ─────────────────
        rowMargin,
        marginUnit,
        rowPadding,
        paddingUnit,

        // ─── Background attributes ─────────────────
        containerBackgroundImage,
        containerBackgroundPosition,
        containerBackgroundRepeat,
        containerBackgroundSize,
        containerBackgroundGradient,

        // ─── Other attributes ─────────────────
        minHeight,
        minHeightUnit,
        minHeightTablet,
        minHeightUnitTablet,
        minHeightMobile,
        minHeightUnitMobile,
        minHeightCustom,
        minHeightCustomTablet,
        minHeightCustomMobile,

        maxWidth,
        maxWidthUnit,
        maxWidthTablet,
        maxWidthUnitTablet,
        maxWidthMobile,
        maxWidthUnitMobile,
        maxWidthCustom,
        maxWidthCustomTablet,
        maxWidthCustomMobile,

        rowGap,
        rowGapUnit,
        rowGapTablet,
        rowGapUnitTablet,
        rowGapMobile,
        rowGapUnitMobile,
        columnsCount,
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
        hideOnDesktop,
        hideOnTablet,
        hideOnMobile,
        backgroundType,
    } = attributes;

    
    // ── Eén globale breakpoint state ───────────────────────────────────────
    const [ activeBreakpoint, setActiveBreakpoint ] = useState( 'desktop' );

    const activeMaxWidthBreakpoint     = activeBreakpoint;
    const activeMinHeightBreakpoint    = activeBreakpoint;
    const activeRowGapBreakpoint       = activeBreakpoint;
    const activePaddingBreakpoint      = activeBreakpoint;
    const activeMarginBreakpoint       = activeBreakpoint;
    const activeDirectionBreakpoint    = activeBreakpoint;
    
    // ── Huidige breakpunt voor elke aanpasbare CSS-eigenschap ──────────────
    // const [ activeMaxWidthBreakpoint, setActiveMaxWidthBreakpoint ] = useState( 'desktop' );
    // const [ activeMinHeightBreakpoint, setActiveMinHeightBreakpoint ] = useState( 'desktop' );
    // const [ activeRowGapBreakpoint, setActiveRowGapBreakpoint ] = useState( 'desktop' );
    // const [ activePaddingBreakpoint, setActivePaddingBreakpoint ] = useState( 'desktop' );
    // const [ activeMarginBreakpoint, setActiveMarginBreakpoint ] = useState( 'desktop' );
    // const [ activeDirectionBreakpoint, setActiveDirectionBreakpoint ] = useState( 'desktop' );
    

    // ── Afgeleide keys — allemaal gestuurd door activeBreakpoint ───────────
    const directionValueKey = activeDirectionBreakpoint === 'tablet' ? 'flexDirectionTablet' : activeDirectionBreakpoint === 'mobile' ? 'flexDirectionMobile' : 'flexDirection';
    const maxWidthValueKey =  activeMaxWidthBreakpoint === 'tablet' ? 'maxWidthTablet' : activeMaxWidthBreakpoint === 'mobile' ? 'maxWidthMobile' : 'maxWidth';
    const maxWidthUnitKey =   activeMaxWidthBreakpoint === 'tablet' ? 'maxWidthUnitTablet' : activeMaxWidthBreakpoint === 'mobile' ? 'maxWidthUnitMobile' : 'maxWidthUnit';
    
    const maxWidthCustomKey =
        activeMaxWidthBreakpoint === 'tablet'
            ? 'maxWidthCustomTablet'
            : activeMaxWidthBreakpoint === 'mobile'
            ? 'maxWidthCustomMobile'
            : 'maxWidthCustom';
    
    const minHeightValueKey = activeMinHeightBreakpoint === 'tablet' ? 'minHeightTablet' : activeMinHeightBreakpoint === 'mobile' ? 'minHeightMobile' : 'minHeight';
    const minHeightUnitKey = activeMinHeightBreakpoint === 'tablet' ? 'minHeightUnitTablet' : activeMinHeightBreakpoint === 'mobile' ? 'minHeightUnitMobile' : 'minHeightUnit';
    
    const minHeightCustomKey =
        activeMinHeightBreakpoint === 'tablet'
            ? 'minHeightCustomTablet'
            : activeMinHeightBreakpoint === 'mobile'
            ? 'minHeightCustomMobile'
            : 'minHeightCustom';

    // ── Huidige waarden ────────────────────────────────────────────────────
    const currentDirection = attributes?.[ directionValueKey ] || 'row';
    const currentMaxWidthValue = attributes?.[ maxWidthValueKey ];
    const currentMaxWidthUnit = attributes?.[ maxWidthUnitKey ] || 'px';
    const currentMaxWidthCustom =
        attributes?.[maxWidthCustomKey] || '';
    
    const currentMinHeightValue = attributes?.[ minHeightValueKey ];
    const currentMinHeightUnit = attributes?.[ minHeightUnitKey ] || 'px';
    const currentMinHeightCustom = attributes?.[ minHeightCustomKey ] || '';

    // ── Reset helpers ──────────────────────────────────────────────────────
    const resetDirection = () =>
        setAttributes( { [ directionValueKey ]: activeDirectionBreakpoint === 'desktop' ? 'row' : undefined, } );
    const resetMaxWidth = () =>
        setAttributes( { [ maxWidthValueKey ]: undefined, [ maxWidthUnitKey ]: 'px', [maxWidthCustomKey]: '',  madeitHasUserEdits: true, } );

    const resetMinHeight = () =>
        setAttributes( { [ minHeightValueKey ]: undefined, [ minHeightUnitKey ]: 'px', [minHeightCustomKey]: '',  madeitHasUserEdits: true, } );


    // ── Container / size helpers ───────────────────────────────────────────
    const containerSizes = [
        { value: 'container', label: __( 'Boxed' ) },
        { value: 'container-fluid', label: __( 'Full width' ) },
    ];
    const contentBoxedSizes = [
        { value: 'container', label: __( 'Boxed' ) },
        { value: 'container-fluid', label: __( 'Full width' ) },
    ];
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';

    const didInitContentWidth = useRef( false );
    useEffect( () => {
        if ( didInitContentWidth.current ) return;

        if ( typeof contentWidth === 'string' && contentWidth.length > 0 ) {
            didInitContentWidth.current = true;
            return;
        }

        const initialContentWidth = size === 'container-fluid' ? 'container-fluid' : 'container';
        setAttributes( { contentWidth: initialContentWidth } );
        didInitContentWidth.current = true;
    }, [ contentWidth, size, setAttributes ] );

    useEffect( () => {
        if ( size !== 'container' ) return;
        if ( contentWidth !== 'container-fluid' ) return;
        setAttributes( { contentWidth: 'container' } );
    }, [ size, contentWidth, setAttributes ] );
    
    const { count } = useSelect( ( select ) => {
        return {
            count: select( 'core/block-editor' ).getBlockCount( clientId ),
        };
    } );

    useEffect( () => {   
        if ( columnsCount === count ) return;
        setAttributes( { columnsCount: count } );
    }, [ columnsCount, count, setAttributes ] );

    // ── CSS klassen ────────────────────────────────────────────────────────
    var classes = classnames( className, {
        [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
        [ `container` ]: 'container' === size,
        [ `container-fluid` ]: 'container-fluid' === size || 'container-content-boxed' === size,
    } );

    // classes = classnames( classes, {
    // } );






    // In ColumnsEditContainer, naast je andere hooks:
    const blockStyles = useSelect((select) =>
        select(blocksStore).getBlockStyles('madeit/block-content'), // jouw block name
        []
    );

    const { updateBlockAttributes } = useDispatch('core/block-editor');

    const currentClassName = useSelect((select) =>
        select('core/block-editor').getBlockAttributes(clientId)?.className ?? '',
        [clientId]
    );

    const applyBlockStyle = (styleName) => {
        const withoutStyles = currentClassName
            .split(' ')
            .filter(cls => !cls.startsWith('is-style-'))
            .join(' ')
            .trim();

        // Is deze stijl al actief? Dan uitzetten
        const isActive = currentClassName.includes(`is-style-${styleName}`);
        
        const newClass = isActive
            ? withoutStyles                                          // uitzetten
            : `${withoutStyles} is-style-${styleName}`.trim();      // aanzetten

        updateBlockAttributes(clientId, { className: newClass });
    };

    



    const computedContainerBackgroundPosition =
        typeof containerBackgroundPosition === 'string' && containerBackgroundPosition.length > 0
            ? containerBackgroundPosition
            : 'center center';
    const computedContainerBackgroundRepeat =
        typeof containerBackgroundRepeat === 'string' && containerBackgroundRepeat.length > 0
            ? containerBackgroundRepeat
            : 'no-repeat';
    const computedContainerBackgroundSize =
        typeof containerBackgroundSize === 'string' && containerBackgroundSize.length > 0
            ? containerBackgroundSize
            : 'cover';

    const computedBackgroundType =
        backgroundType ||
        ( containerBackgroundImage?.url || containerBackgroundColor?.color
            ? 'classic'
            : 'transparent' );

    const computedBackgroundGradient = 
        attributes.containerBackgroundGradient || {
            gradient: '',
        };

    const computedBackgroundGradientValue =
        typeof computedBackgroundGradient?.gradient === 'string' &&
        computedBackgroundGradient.gradient.trim().length > 0
            ? computedBackgroundGradient.gradient
            : undefined;

    const gradients = useSelect( ( select ) => {
        const settings = select( 'core/block-editor' )?.getSettings?.() || {};

        // Gutenberg has multiple possible shapes depending on WP/Gutenberg version.
        const gradientsFromFeatures =
            settings?.__experimentalFeatures?.color?.gradients?.theme ||
            settings?.__experimentalFeatures?.color?.gradients?.default ||
            settings?.__experimentalFeatures?.color?.gradients?.custom;

        return settings.gradients || gradientsFromFeatures || [];
    }, [] );

    
    

    // Initialize `contentWidth` once so it doesn't keep following `size`.
    // This keeps existing blocks stable, while making the controls truly independent.
    
    
    // Als we in "container" zitten, is contentWidth altijd "container". Anders is het "container-fluid" tenzij het al een andere waarde had (omdat de gebruiker die heeft aangepast).
    const computedContentWidth = size === 'container' ? 'container' : contentWidth === 'container-fluid'
                ? 'container-fluid'
                : 'container-fluid';

    const canChooseContentWidth = size !== 'container';
    
    var classesChild = classnames( '', {
        [ `container` ]: computedContentWidth === 'container',
        [ `container-fluid` ]: computedContentWidth === 'container-fluid',
    });




    const setContainerPadding = ( containerPadding ) => {
        setAttributes( { containerPadding } );
    }

    const setContainerMargin = ( containerMargin ) => {
        setAttributes( { containerMargin } );
    }

    const setRowPadding = ( rowPadding ) => {
        setAttributes( { rowPadding } );
    }

    const setRowMargin = ( rowMargin ) => {
        setAttributes( { rowMargin } );
    }
    const resetAllContainer = () => {
		setContainerPadding( undefined );
		setContainerMargin( undefined );
	};
    const resetAllRow = () => {
		setRowPadding( undefined );
		setRowMargin( undefined );
	};

    const resetContainerPadding = () => {
        setContainerPadding( undefined );
    };

    const resetContainerMargin = () => {
        setContainerMargin( undefined );
    };

    const setContainerBackgroundImage = ( media ) => {
        if ( ! media || ! media.id ) {
            setAttributes( { containerBackgroundImage: undefined } );
            return;
        }

        const url =
            media.url ||
            media?.sizes?.full?.url ||
            media?.sizes?.large?.url ||
            media?.source_url;

        setAttributes( {
            containerBackgroundImage: {
                id: media.id,
                url,
                alt: media.alt || '',
            },
            containerBackgroundPosition:
                typeof containerBackgroundPosition === 'string' &&
                containerBackgroundPosition.length > 0
                    ? containerBackgroundPosition
                    : 'center center',
            containerBackgroundRepeat:
                typeof containerBackgroundRepeat === 'string' &&
                containerBackgroundRepeat.length > 0
                    ? containerBackgroundRepeat
                    : 'no-repeat',
            containerBackgroundSize:
                typeof containerBackgroundSize === 'string' &&
                containerBackgroundSize.length > 0
                    ? containerBackgroundSize
                    : 'cover',
        } );
    };
    const setContainerBackgroundPosition = ( value ) =>
        setAttributes( { containerBackgroundPosition: value } );
    const setContainerBackgroundRepeat = ( value ) =>
        setAttributes( { containerBackgroundRepeat: value } );
    const setContainerBackgroundSize = ( value ) =>
        setAttributes( { containerBackgroundSize: value } );

    const setContainerBackgroundGradient = ( value ) => {
        if ( ! value ) {
            setAttributes( { containerBackgroundGradient: undefined } );
            return;
        }

        if ( typeof value === 'string' ) {
            if ( value.trim().length === 0 ) {
                setAttributes( { containerBackgroundGradient: undefined } );
                return;
            }
            setAttributes( { containerBackgroundGradient: { gradient: value } } );
            return;
        }

        // Handle objects like { gradient: '' } coming from pickers.
        if ( typeof value?.gradient === 'string' && value.gradient.trim().length === 0 ) {
            setAttributes( { containerBackgroundGradient: undefined } );
            return;
        }

        setAttributes( { containerBackgroundGradient: value } );
    };
    
    const computedOverflow = overflow ?? 'visible';
    const computedHtmlTag = htmlTag ?? 'div';
    const allowedHtmlTags = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];
    const HtmlTag = allowedHtmlTags.includes( computedHtmlTag ) ? computedHtmlTag : 'div';

    // background-image always on the outher container, never on the inner row, because that's more intuitive for users and works better with the way the block is structured (the inner row can be toggled between "container" and "container-fluid" widths, which would be weird if it also had the background image). The "container-content-boxed" size is a special case where we want the background color on the inner row but the background image on the outer container, so we also apply the background image styles to the inner row in that case.
    const applyContainerBackgroundToChild = size === 'container-fluid' || size === 'container-content-boxed';

    const containerBackgroundStyle = {
        backgroundColor:
            computedBackgroundType === 'transparent'
                ? 'transparent'
                : containerBackgroundColor.color,
    };

    if ( computedBackgroundType === 'classic' && containerBackgroundImage?.url ) {
        containerBackgroundStyle.backgroundImage = `url(${ containerBackgroundImage.url })`;
        containerBackgroundStyle.backgroundPosition = computedContainerBackgroundPosition;
        containerBackgroundStyle.backgroundRepeat = computedContainerBackgroundRepeat;
        containerBackgroundStyle.backgroundSize = computedContainerBackgroundSize;
    }

    if ( computedBackgroundType === 'gradient' && computedBackgroundGradientValue ) {
        containerBackgroundStyle.backgroundImage = computedBackgroundGradientValue;
    }

    var style = {
        overflow: computedOverflow,
    };

    if ( ! applyContainerBackgroundToChild ) {
        style = { ...style, ...containerBackgroundStyle };
    }

    // Responsive flex-direction via CSS variables.
    style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
    if ( flexDirectionTablet ) {
        style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
    }
    if ( flexDirectionMobile ) {
        style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
    }

    // Responsive align-items / justify-content via CSS variables.
    style['--madeit-align-items-desktop'] = alignItems || 'stretch';
    if ( alignItemsTablet ) {
        style['--madeit-align-items-tablet'] = alignItemsTablet;
    }
    if ( alignItemsMobile ) {
        style['--madeit-align-items-mobile'] = alignItemsMobile;
    }

    style['--madeit-justify-content-desktop'] = justifyContent || 'flex-start';
    if ( justifyContentTablet ) {
        style['--madeit-justify-content-tablet'] = justifyContentTablet;
    }
    if ( justifyContentMobile ) {
        style['--madeit-justify-content-mobile'] = justifyContentMobile;
    }

    // Responsive flex-wrap via CSS variables.
    style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
    if ( flexWrapTablet ) {
        style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
    }
    if ( flexWrapMobile ) {
        style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
    }

    // Responsive min-height via CSS variables.
    if ( minHeightUnit === '__custom__' ) {
        if ( minHeightCustom ) {
            style['--madeit-min-height-desktop'] = minHeightCustom;
        }
    } else {
        if ( typeof minHeight === 'number' ) {
            style['--madeit-min-height-desktop'] = `${ minHeight }${ minHeightUnit || 'px' }`;
        }
    }

    if ( minHeightUnitTablet === '__custom__' ) {
        if ( minHeightCustomTablet ) {
            style['--madeit-min-height-tablet'] = minHeightCustomTablet;
        }
    } else {
        if ( typeof minHeightTablet === 'number' ) {
            style['--madeit-min-height-tablet'] = `${ minHeightTablet }${ minHeightUnitTablet || 'px' }`;
        }
    }

    if ( minHeightUnitMobile === '__custom__' ) {
        if ( minHeightCustomMobile ) {
            style['--madeit-min-height-mobile'] = minHeightCustomMobile;
        }
    } else {
        if ( typeof minHeightMobile === 'number' ) {
            style['--madeit-min-height-mobile'] = `${ minHeightMobile }${ minHeightUnitMobile || 'px' }`;
        }
    }


    // Responsive max-width via CSS variables.
    if ( maxWidthUnit === '__custom__' ) {
        if ( maxWidthCustom ) {
            style['--madeit-max-width-desktop'] = maxWidthCustom;
        }
    } else if ( typeof maxWidth === 'number' ) {
        style['--madeit-max-width-desktop'] =
            `${ maxWidth }${ maxWidthUnit || 'px' }`;
    }

    if ( maxWidthUnitTablet === '__custom__' ) {
        if ( maxWidthCustomTablet ) {
            style['--madeit-max-width-tablet'] =
                maxWidthCustomTablet;
        }
    } else if ( typeof maxWidthTablet === 'number' ) {
        style['--madeit-max-width-tablet'] =
            `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }`;
    }

    if ( maxWidthUnitMobile === '__custom__' ) {
        if ( maxWidthCustomMobile ) {
            style['--madeit-max-width-mobile'] =
                maxWidthCustomMobile;
        }
    } else if ( typeof maxWidthMobile === 'number' ) {
        style['--madeit-max-width-mobile'] =
            `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }`;
    }

     // Responsive row-gap via CSS variables.
    if ( typeof rowGap === 'number' ) {
        style['--madeit-row-gap-desktop'] = `${ rowGap }${ rowGapUnit || 'px' }`;
    }
    if ( typeof rowGapTablet === 'number' ) {
        style['--madeit-row-gap-tablet'] = `${ rowGapTablet }${ rowGapUnitTablet || 'px' }`;
    }
    if ( typeof rowGapMobile === 'number' ) {
        style['--madeit-row-gap-mobile'] = `${ rowGapMobile }${ rowGapUnitMobile || 'px' }`;
    }

    const setCssVarIfDefined = ( targetStyle, key, value ) => {
        if ( value === undefined || value === null ) return;

        // BoxControl typically returns strings like "12px", but some older
        // blocks/controls can still pass numbers.
        if ( typeof value === 'number' && Number.isFinite( value ) ) {
            targetStyle[ key ] = `${ value }px`;
            return;
        }

        if ( typeof value !== 'string' ) return;
        const trimmed = value.trim();
        if ( trimmed === '' ) return;
        targetStyle[ key ] = trimmed;
    };

    const setSpacingVars = ( targetStyle, prefix, spacing, breakpoint ) => {
        if ( ! spacing || typeof spacing !== 'object' ) return;

        const rawTop = spacing.top;
        const rawRight = spacing.right;
        const rawBottom = spacing.bottom;
        const rawLeft = spacing.left;

        const hasAnyValue =
            rawTop !== undefined && rawTop !== null && String( rawTop ).trim() !== '' ||
            rawRight !== undefined && rawRight !== null && String( rawRight ).trim() !== '' ||
            rawBottom !== undefined && rawBottom !== null && String( rawBottom ).trim() !== '' ||
            rawLeft !== undefined && rawLeft !== null && String( rawLeft ).trim() !== '';

        if ( ! hasAnyValue ) return;

        // Important: the build pipeline can merge longhand padding declarations
        // into a single `padding: ...` shorthand. If any of the 4 values is an
        // invalid var() (missing), the whole shorthand becomes invalid.
        // To keep responsive padding working, always emit all 4 sides when
        // spacing is used (missing sides default to 0).
        setCssVarIfDefined(
            targetStyle,
            `--${ prefix }-top-${ breakpoint }`,
            rawTop === undefined || rawTop === null || String( rawTop ).trim() === '' ? '0px' : rawTop
        );
        setCssVarIfDefined(
            targetStyle,
            `--${ prefix }-right-${ breakpoint }`,
            rawRight === undefined || rawRight === null || String( rawRight ).trim() === '' ? '0px' : rawRight
        );
        setCssVarIfDefined(
            targetStyle,
            `--${ prefix }-bottom-${ breakpoint }`,
            rawBottom === undefined || rawBottom === null || String( rawBottom ).trim() === '' ? '0px' : rawBottom
        );
        setCssVarIfDefined(
            targetStyle,
            `--${ prefix }-left-${ breakpoint }`,
            rawLeft === undefined || rawLeft === null || String( rawLeft ).trim() === '' ? '0px' : rawLeft
        );
    };

    // Desktop margin stays inline; we also set matching desktop CSS variables
    // so tablet/mobile fallbacks can safely reference them.
    if ( containerMargin && typeof containerMargin === 'object' ) {
        if ( containerMargin.top !== undefined ) {
            style.marginTop = containerMargin.top;
            setCssVarIfDefined( style, '--madeit-container-margin-top-desktop', containerMargin.top );
        }
        if ( containerMargin.bottom !== undefined ) {
            style.marginBottom = containerMargin.bottom;
            setCssVarIfDefined( style, '--madeit-container-margin-bottom-desktop', containerMargin.bottom );
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

    // Desktop padding stays inline; we also set matching desktop CSS variables
    // so tablet/mobile fallbacks can safely reference them.
    var rowStyle = {};
    if ( shouldApplyContainerPaddingOnRow ) {
        if ( containerPadding && typeof containerPadding === 'object' ) {
            if ( containerPadding.top !== undefined ) rowStyle.paddingTop = containerPadding.top;
            if ( containerPadding.right !== undefined ) rowStyle.paddingRight = containerPadding.right;
            if ( containerPadding.bottom !== undefined ) rowStyle.paddingBottom = containerPadding.bottom;
            if ( containerPadding.left !== undefined ) rowStyle.paddingLeft = containerPadding.left;
        }

        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPadding, 'desktop' );

        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( rowStyle, 'madeit-container-row-padding', containerPaddingMobile, 'mobile' );
    } else {
        if ( containerPadding && typeof containerPadding === 'object' ) {
            if ( containerPadding.top !== undefined ) style.paddingTop = containerPadding.top;
            if ( containerPadding.right !== undefined ) style.paddingRight = containerPadding.right;
            if ( containerPadding.bottom !== undefined ) style.paddingBottom = containerPadding.bottom;
            if ( containerPadding.left !== undefined ) style.paddingLeft = containerPadding.left;
        }

        setSpacingVars( style, 'madeit-container-padding', containerPadding, 'desktop' );

        setSpacingVars( style, 'madeit-container-padding', containerPaddingTablet, 'tablet' );
        setSpacingVars( style, 'madeit-container-padding', containerPaddingMobile, 'mobile' );
    }
    
    var styleChild = {};
    if(size === 'container-content-boxed') {
        styleChild = {
            backgroundColor: rowBackgroundColor.color,
            color: rowTextColor.color
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
        if(rowPadding !== undefined && rowPadding.top !== undefined) {
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
        style.color = rowTextColor.color;

        if ( applyContainerBackgroundToChild ) {
            styleChild = { ...styleChild, ...containerBackgroundStyle };
        }
    }
    
    const blockProps = useBlockProps({
        className: classes,
        style: style,
        'data-madeit-dir': flexDirection || 'row',
        'data-madeit-dir-tablet': flexDirectionTablet || undefined,
        'data-madeit-dir-mobile': flexDirectionMobile || undefined,
    });

    // Auto-migrate legacy blocks: if containerPadding exists but the new
    // containerPaddingOnRow flag was never set, switch it on so the next save
    // serializes padding on `.madeit-container-row`.
    useEffect( () => {
        if ( containerPaddingOnRow === true ) return;
        if ( ! containerPadding ) return;
        const hasAnyPadding =
            containerPadding.top !== undefined ||
            containerPadding.bottom !== undefined ||
            containerPadding.left !== undefined ||
            containerPadding.right !== undefined;
        if ( ! hasAnyPadding ) return;
        setAttributes( { containerPaddingOnRow: true } );
    }, [ containerPaddingOnRow, containerPadding, setAttributes ] );
    
    const [activeTab, setActiveTab] = useState('layout');
    
   

    
    

    const parseWrapperLengthVar = ( varName ) => {
        const wrapperStyle = attributes?.wrapperStyle;
        if ( typeof wrapperStyle !== 'string' || wrapperStyle.trim() === '' ) {
            return undefined;
        }

        const match = wrapperStyle.match(
            new RegExp( `${ varName }\\s*:\\s*([^;]+)` )
        );
        const raw = match?.[ 1 ]?.trim();
        if ( ! raw ) return undefined;

        const lengthMatch = raw.match( /^(-?\d+(?:\.\d+)?)([a-z%]+)$/i );
        if ( ! lengthMatch ) return undefined;
        const value = Number.parseFloat( lengthMatch[ 1 ] );
        const unit = String( lengthMatch[ 2 ] ).toLowerCase();
        if ( ! Number.isFinite( value ) ) return undefined;

        return { value, unit };
    };

    const madeitHasUserEdits = attributes?.madeitHasUserEdits === true;
    const legacyMinHeightVarName =
        activeMinHeightBreakpoint === 'tablet'
            ? '--madeit-min-height-tablet'
            : activeMinHeightBreakpoint === 'mobile'
                ? '--madeit-min-height-mobile'
                : '--madeit-min-height-desktop';
    const legacyMinHeight = ! madeitHasUserEdits
        ? parseWrapperLengthVar( legacyMinHeightVarName )
        : undefined;

    const minHeightValueForUi =
        typeof currentMinHeightValue === 'number'
            ? currentMinHeightValue
            : legacyMinHeight?.value ?? 0;
    const minHeightUnitForUi =
        typeof currentMinHeightValue === 'number'
            ? currentMinHeightUnit
            : legacyMinHeight?.unit ?? currentMinHeightUnit;


    const rowGapValueKey =
        activeRowGapBreakpoint === 'tablet'
            ? 'rowGapTablet'
            : activeRowGapBreakpoint === 'mobile'
                ? 'rowGapMobile'
                : 'rowGap';
    const rowGapUnitKey =
        activeRowGapBreakpoint === 'tablet'
            ? 'rowGapUnitTablet'
            : activeRowGapBreakpoint === 'mobile'
                ? 'rowGapUnitMobile'
                : 'rowGapUnit';
    const paddingValueKey =
        activePaddingBreakpoint === 'tablet'        
            ? 'containerPaddingTablet'
            : activePaddingBreakpoint === 'mobile'
                ? 'containerPaddingMobile'
                : 'containerPadding';   

    const marginValueKey =
        activeMarginBreakpoint === 'tablet'
            ? 'containerMarginTablet'
            : activeMarginBreakpoint === 'mobile'
                ? 'containerMarginMobile'
                : 'containerMargin';

                
    const currentRowGapValueRaw = attributes?.[ rowGapValueKey ];
    const currentRowGapValue =
        typeof currentRowGapValueRaw === 'number' ? currentRowGapValueRaw : 20;
    const currentRowGapUnit = attributes?.[ rowGapUnitKey ] || 'px';

    const resetRowGap = () =>
        setAttributes( {
            [ rowGapValueKey ]: activeRowGapBreakpoint === 'desktop' ? 20 : undefined,
            [ rowGapUnitKey ]: 'px',
            madeitHasUserEdits: true,
        } );



    const isRowDirection =
        currentDirection === 'row' ||
        currentDirection === 'row-reverse';

    const isColumnDirection =
        currentDirection === 'column' ||
        currentDirection === 'column-reverse';

    const alignItemsValueKey =
        activeDirectionBreakpoint === 'tablet'
            ? 'alignItemsTablet'
            : activeDirectionBreakpoint === 'mobile'
                ? 'alignItemsMobile'
                : 'alignItems';

    const currentAlignItems =
        attributes?.[ alignItemsValueKey ] ??
        attributes?.alignItems ??
        'flex-start';

    const resetAlignItems = () =>
        setAttributes( {
            [ alignItemsValueKey ]:
                activeDirectionBreakpoint === 'desktop' ? 'flex-start' : undefined,
        } );

    const justifyContentValueKey =
        activeDirectionBreakpoint === 'tablet'
            ? 'justifyContentTablet'
            : activeDirectionBreakpoint === 'mobile'
                ? 'justifyContentMobile'
                : 'justifyContent';

    const currentJustifyContent =
        attributes?.[ justifyContentValueKey ] ??
        attributes?.justifyContent ??
        'flex-start';

    const resetJustifyContent = () =>
        setAttributes( {
            [ justifyContentValueKey ]:
                activeDirectionBreakpoint === 'desktop' ? 'flex-start' : undefined,
        } );

    const flexWrapValueKey =
        activeDirectionBreakpoint === 'tablet'
            ? 'flexWrapTablet'
            : activeDirectionBreakpoint === 'mobile'
                ? 'flexWrapMobile'
                : 'flexWrap';

    const currentFlexWrap =
        attributes?.[ flexWrapValueKey ] ??
        attributes?.flexWrap ??
        'nowrap';

    const resetFlexWrap = () =>
        setAttributes( {
            [ flexWrapValueKey ]:
                activeDirectionBreakpoint === 'desktop' ? 'nowrap' : undefined,
        } );

    const FlexStartIcon = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-start</title><path d="M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"></path></svg>
    );
    const CenterIcon = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-center</title><path d="M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
    const FlexEndIcon = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-end</title><path d="M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
    const StretchIcon = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>shrink</title><path d="M16 0c0.736 0 1.344 0.608 1.344 1.344v29.312c0 0.736-0.608 1.344-1.344 1.344s-1.344-0.608-1.344-1.344v-29.312c0-0.736 0.608-1.344 1.344-1.344zM26.368 8.672c0.256 0.032 0.48 0.16 0.704 0.384 0.16 0.224 0.256 0.48 0.256 0.8v3.488h2.816c1.024 0 1.856 0.832 1.856 1.856v1.6c0 1.024-0.832 1.856-1.856 1.856h-2.816v3.616c-0.032 0.32-0.16 0.608-0.384 0.8-0.224 0.16-0.448 0.256-0.704 0.256-0.256-0.032-0.48-0.16-0.704-0.384l-5.216-6.080-0.128-0.16c-0.16-0.224-0.224-0.48-0.192-0.8s0.128-0.576 0.32-0.768l5.344-6.208c0.192-0.192 0.416-0.288 0.704-0.256zM5.632 8.672c0.224-0.032 0.448 0.032 0.608 0.16l0.128 0.096 5.344 6.176c0.16 0.224 0.288 0.48 0.288 0.8 0.032 0.256 0 0.448-0.096 0.64l-0.064 0.16-0.128 0.16-5.248 6.080c-0.192 0.224-0.416 0.352-0.704 0.384-0.224 0-0.48-0.096-0.704-0.256-0.16-0.16-0.288-0.352-0.352-0.608l-0.032-0.192v-3.616h-2.816c-1.024 0-1.856-0.832-1.856-1.856v-1.6c0-1.024 0.832-1.856 1.856-1.856h2.816v-3.488c0-0.256 0.064-0.48 0.16-0.672l0.096-0.128c0.192-0.224 0.448-0.352 0.704-0.384z"></path></svg>
    );
    const FlexStartIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-start</title><path d="M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"></path></svg>
    );
    const CenterIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-center</title><path d="M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
    const FlexEndIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-end</title><path d="M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
    const StretchIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>shrink</title><path d="M16 0c0.736 0 1.344 0.608 1.344 1.344v29.312c0 0.736-0.608 1.344-1.344 1.344s-1.344-0.608-1.344-1.344v-29.312c0-0.736 0.608-1.344 1.344-1.344zM26.368 8.672c0.256 0.032 0.48 0.16 0.704 0.384 0.16 0.224 0.256 0.48 0.256 0.8v3.488h2.816c1.024 0 1.856 0.832 1.856 1.856v1.6c0 1.024-0.832 1.856-1.856 1.856h-2.816v3.616c-0.032 0.32-0.16 0.608-0.384 0.8-0.224 0.16-0.448 0.256-0.704 0.256-0.256-0.032-0.48-0.16-0.704-0.384l-5.216-6.080-0.128-0.16c-0.16-0.224-0.224-0.48-0.192-0.8s0.128-0.576 0.32-0.768l5.344-6.208c0.192-0.192 0.416-0.288 0.704-0.256zM5.632 8.672c0.224-0.032 0.448 0.032 0.608 0.16l0.128 0.096 5.344 6.176c0.16 0.224 0.288 0.48 0.288 0.8 0.032 0.256 0 0.448-0.096 0.64l-0.064 0.16-0.128 0.16-5.248 6.080c-0.192 0.224-0.416 0.352-0.704 0.384-0.224 0-0.48-0.096-0.704-0.256-0.16-0.16-0.288-0.352-0.352-0.608l-0.032-0.192v-3.616h-2.816c-1.024 0-1.856-0.832-1.856-1.856v-1.6c0-1.024 0.832-1.856 1.856-1.856h2.816v-3.488c0-0.256 0.064-0.48 0.16-0.672l0.096-0.128c0.192-0.224 0.448-0.352 0.704-0.384z"></path></svg>
    );


    const JustifyStartIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-start</title><path d="M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"></path></svg>
    );
    const JustifyStartIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-start</title><path d="M8 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM15.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888z"></path></svg>
    );
    const JustifyCenterIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-center</title><path d="M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
      const JustifyCenterIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-center</title><path d="M16 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM23.616 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.888c-0.96 0-1.728-0.768-1.728-1.728v-17.856c0-0.96 0.768-1.728 1.728-1.728h1.888zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
    const JustifyEndIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-end</title><path d="M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
    const JustifyEndIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-end</title><path d="M24 0c0.672 0 1.248 0.512 1.312 1.184l0.032 0.16v29.312c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184l-0.032-0.16v-29.312c0-0.736 0.608-1.344 1.344-1.344zM18.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856zM10.272 5.344c0.96 0 1.728 0.768 1.728 1.728v17.856c0 0.96-0.768 1.728-1.728 1.728h-1.856c-0.96 0-1.76-0.768-1.76-1.728v-17.856c0-0.96 0.8-1.728 1.76-1.728h1.856z"></path></svg>
    );
    const JustifyBetweenIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-space-between</title><path d="M1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM8.8 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-3.456v-21.312h3.456zM26.656 5.344v21.312h-3.456c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h3.456z"></path></svg>
    );
    const JustifyBetweenIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-space-between</title><path d="M1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM8.8 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-3.456v-21.312h3.456zM26.656 5.344v21.312h-3.456c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h3.456z"></path></svg>
    );
    const JustifySpaceAroundIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-space-between</title><path d="M1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM8.8 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-3.456v-21.312h3.456zM26.656 5.344v21.312h-3.456c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h3.456z"></path></svg>
    );
    const JustifySpaceAroundIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-space-between</title><path d="M1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM8.8 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-3.456v-21.312h3.456zM26.656 5.344v21.312h-3.456c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h3.456z"></path></svg>
    );
    const JustifySpaceEvenlyIcon = () => (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-space-evenly</title><path d="M30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM22.144 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-1.6c-1.024 0-1.888-0.832-1.888-1.856v-17.6c0-1.024 0.864-1.856 1.888-1.856h1.6zM11.456 5.344c1.024 0 1.888 0.832 1.888 1.856v17.6c0 1.024-0.864 1.856-1.888 1.856h-1.6c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h1.6z"></path></svg>
    );
    const JustifySpaceEvenlyIconRotate = () => (
        <svg style={{ transform: 'rotate(90deg)' }} version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><title>justify-space-evenly</title><path d="M30.656 0c0.704 0 1.28 0.512 1.344 1.184v29.472c0 0.736-0.608 1.344-1.344 1.344-0.672 0-1.248-0.512-1.312-1.184v-29.472c0-0.736 0.576-1.344 1.312-1.344zM1.344 0c0.672 0 1.248 0.512 1.312 1.184v29.472c0 0.736-0.576 1.344-1.312 1.344-0.704 0-1.248-0.512-1.344-1.184v-29.472c0-0.736 0.608-1.344 1.344-1.344zM22.144 5.344c1.024 0 1.856 0.832 1.856 1.856v17.6c0 1.024-0.832 1.856-1.856 1.856h-1.6c-1.024 0-1.888-0.832-1.888-1.856v-17.6c0-1.024 0.864-1.856 1.888-1.856h1.6zM11.456 5.344c1.024 0 1.888 0.832 1.888 1.856v17.6c0 1.024-0.864 1.856-1.888 1.856h-1.6c-1.024 0-1.856-0.832-1.856-1.856v-17.6c0-1.024 0.832-1.856 1.856-1.856h1.6z"></path></svg>
    );

    const StyleTransparentIcon = () => (
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.49991 0.877075C3.84222 0.877075 0.877075 3.84222 0.877075 7.49991C0.877075 11.1576 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1576 14.1227 7.49991C14.1227 3.84222 11.1576 0.877075 7.49991 0.877075ZM3.85768 3.15057C4.84311 2.32448 6.11342 1.82708 7.49991 1.82708C10.6329 1.82708 13.1727 4.36689 13.1727 7.49991C13.1727 8.88638 12.6753 10.1567 11.8492 11.1421L3.85768 3.15057ZM3.15057 3.85768C2.32448 4.84311 1.82708 6.11342 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C8.88638 13.1727 10.1567 12.6753 11.1421 11.8492L3.15057 3.85768Z" fill="#000000"></path> </g></svg>
    );
    const StyleClassicIcon = () => (
        <svg viewBox="0 -2 32 32" fill="#000000"> <g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g><g fill="none" fillRule="evenodd"><g transform="translate(-101.000000, -156.000000)" fill="#000000"><path d="M132.132,156.827 C130.975,155.685 129.099,155.685 127.942,156.827 L115.336,169.277 L119.499,173.44 L132.132,160.964 C133.289,159.821 133.289,157.969 132.132,156.827 Z M112.461,180.385 C111.477,181.298 107.08,183.333 104.491,181.36 C104.491,181.36 105.392,180.657 106.074,179.246 C107.703,174.919 111.763,175.56 111.763,175.56 L113.159,176.938 C113.173,176.952 114.202,178.771 112.461,180.385 Z M113.913,170.683 L110.764,173.788 C108.661,173.74 105.748,174.485 104.491,178.603 C103.53,180.781 101,180.671 101,180.671 C106.253,186.498 112.444,183.196 113.857,181.764 C115.1,180.506 115.279,178.966 115.146,177.734 L118.076,174.846 L113.913,170.683 Z" /></g></g></g></svg>
    );
    const StyleGradientIcon = () => (
        <svg fill="#000000" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> </defs> <path d="M26,4H6A2.0023,2.0023,0,0,0,4,6V26a2.0023,2.0023,0,0,0,2,2H26a2.0023,2.0023,0,0,0,2-2V6A2.0023,2.0023,0,0,0,26,4ZM22,26V22H18v4H14V22H10V18h4V14H10V10h4V6h4v4h4V6h4V26Z"></path> <rect x="14" y="10" width="4" height="4"></rect> <rect x="14" y="18" width="4" height="4"></rect> <rect x="18" y="14" width="4" height="4"></rect> <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" className="cls-1" width="32" height="32" fill="none"></rect> </g></svg>
    );

    const handleBackgroundTypeChange = ( newType ) => {
        // When switching to transparent, clear classic background selections
        // so they don't "stick" when toggling back and forth.
        if ( newType === 'transparent' ) {
            setAttributes( {
                backgroundType: 'transparent',
                containerBackgroundColor: undefined,
                customContainerBackgroundColor: undefined,
            } );
            return;
        }

        setAttributes( { backgroundType: newType } );
    };

    const resetBackgroundType = () => {
        setAttributes( {
            backgroundType: 'transparent',
            containerBackgroundColor: undefined,
            customContainerBackgroundColor: undefined,
            containerBackgroundImage: undefined,
            containerBackgroundPosition: undefined,
            containerBackgroundRepeat: undefined,
            containerBackgroundSize: undefined,
            containerBackgroundGradient: {},
        } );
    };

    const StyleSwitcher = ( { active, onChange } ) => (
        <ToggleGroupControl
            __next40pxDefaultSize
            className="madeit-control-styleSwitcher"
            value={ active }
            onChange={ onChange }
        >
            <ToggleGroupControlOption
                value="transparent"
                label={ <StyleTransparentIcon /> }
            />

            <ToggleGroupControlOption
                value="classic"
                label={ <StyleClassicIcon /> }
            />

            <ToggleGroupControlOption
                value="gradient"
                label={ <StyleGradientIcon /> }
            />
        </ToggleGroupControl>
    );


    const previewBlockStyle = ( styleName ) => {
    const block = document.querySelector(
        `.block-editor-block-list__block[data-block="${ clientId }"]`
    );

    if ( ! block ) {
        return;
    }

    // verwijder vorige previews
    block.classList.forEach( ( className ) => {
        if ( className.startsWith( 'is-style-preview-' ) ) {
            block.classList.remove( className );
        }
    } );

    if ( styleName ) {
        block.classList.add( `is-style-preview-${ styleName }` );
    }
};

const clearPreviewBlockStyle = () => {
    const block = document.querySelector(
        `.block-editor-block-list__block[data-block="${ clientId }"]`
    );

    if ( ! block ) {
        return;
    }

    block.classList.forEach( ( className ) => {
        if ( className.startsWith( 'is-style-preview-' ) ) {
            block.classList.remove( className );
        }
    } );
};

    useEffect( () => {
        const bodyClass = 'madeit-content-container-advanced-tabs';
        if ( isBlockSelected ) {
            document.body.classList.add( bodyClass );
        } else {
            document.body.classList.remove( bodyClass );
        }

        return () => {
            document.body.classList.remove( bodyClass );
        };
    }, [ isBlockSelected ] );

    useEffect( () => {
         if (!isBlockSelected) return;

        const advancedPanel = document.querySelector(
            '.block-editor-block-inspector__advanced'
        );

        if (!advancedPanel) return;

        if (activeTab === 'advanced') {
            advancedPanel.style.display = 'block'; 


        } else if (activeTab === 'layout' || activeTab === 'style') {
            console.log('Hiding advanced panel');
            advancedPanel.style.display = 'none'; 
        }
    }, [ activeTab, isBlockSelected ] );

    // 1. Body-class: enkel afhankelijk van isBlockSelected
    useEffect(() => {
        const bodyClass = 'madeit-content-container-advanced-tabs';
        if (isBlockSelected) {
            document.body.classList.add(bodyClass);
        } else {
            document.body.classList.remove(bodyClass);
        }
        return () => {
            document.body.classList.remove(bodyClass);
        };
    }, [isBlockSelected]);

    // 2. Stijlen panel klasse: ook direct bij selectie toevoegen, niet bij tab-wissel
    useEffect(() => {
        if (!isBlockSelected) return;

        const stylesPanel = document.querySelector(
            '.block-editor-block-styles'
        )?.closest('.components-panel__body');

        if (!stylesPanel) return;

        stylesPanel.classList.add('madeit-gutenberg-styles-panel');

        return () => {
            stylesPanel.classList.remove('madeit-gutenberg-styles-panel');
        };
    }, [isBlockSelected]);


    return [
            <InspectorControls>
                {/* Tab buttons */}
                <div 
                    style={{ display: 'flex', justifyContent: 'space-evenly' }}
                    className={'TabContents'}
                >
                    <Button 
                        isPrimary={activeTab === 'layout'} 
                        onClick={() => setActiveTab('layout')}
                        style={{ flex: '1', justifyContent: 'center' }}
                    >
                        Layout
                    </Button>
                    <Button 
                        isPrimary={activeTab === 'style'} 
                        onClick={() => setActiveTab('style')}
                        style={{ flex: '1', justifyContent: 'center' }}
                    >
                        Style
                    </Button>
                    <Button 
                        isPrimary={activeTab === 'advanced'} 
                        onClick={() => setActiveTab('advanced')}
                        style={{ flex: '1', justifyContent: 'center' }}
                    >
                        Advanced
                    </Button>
                </div>

                {/* Tab content */}
                {activeTab === 'layout' && (
                    <>
                    {/* Algemene instellingen */}
                    <PanelBody title="Container" initialOpen={true}>
                        {/* Kolommen wijzigen */}
                        <RangeControl
                            __next40pxDefaultSize
                            label={ __( 'Aantal kolommen' ) }
                            value={ count }
                            onChange={ ( value ) => updateColumns( count, value ) }
                            min={ 1 }
                            max={ 6 }
                        />

                        {/* Container breedte */}
                        <SelectControl
                            __next40pxDefaultSize
                            label={ __( 'Inhoud breedte' ) }
                            labelPosition='left'
                            value={ size }
                            options={ [
                                { value: 'container', label: __( 'Boxed' ) },
                                { value: 'container-fluid', label: __( 'Full width' ) },
                            ] }
                            onChange={ ( newSize ) => setAttributes( { size: newSize, madeitHasUserEdits: true } ) }
                        />
                        <hr></hr>
                        {/* { canChooseContentWidth && (
                            <SelectControl
                                label={ __( 'Content breedte' ) }
                                value={ computedContentWidth }
                                onChange={ ( newSize ) =>
                                    setAttributes( { contentWidth: newSize } )
                                }
                                options={ contentBoxedSizes }
                            />
                        ) } */}
                        


                        {/* Max width */}
                        <div
                            className="madeit-control"
                            style={
                                currentMaxWidthUnit == '__custom__'
                                    ? { marginBottom: '52px' }
                                    : {}
                            }
                        >
                            <ControlHeader
                                title={ __( 'max breedte' ) }
                                breakpoint={ activeBreakpoint }
                                onBreakpointChange={ setActiveBreakpoint }
                                afterBreakpoint={
                                    <AdvancedUnitSelect
                                        value={currentMaxWidthUnit}
                                        customValue={currentMaxWidthCustom}
                                        units={['px', '%', 'em', 'rem', 'vw']}
                                        onChange={(unit) =>
                                            setAttributes({
                                                [maxWidthUnitKey]: unit,
                                                madeitHasUserEdits: true,
                                            })
                                        }
                                        onCustomChange={(custom) =>
                                            setAttributes({
                                                [maxWidthCustomKey]: custom,
                                                madeitHasUserEdits: true,
                                            })
                                        }
                                    />
                                    
                                }
                                
                            />
                            {/* If maxWidthUnitKey value = __custom__, doon't show the madeit-control-rangeRow */}
                            { currentMaxWidthUnit !== '__custom__' && (
                                <div className="madeit-control-rangeRow">
                                    <RangeControl
                                        __next40pxDefaultSize
                                        label=""
                                        value={
                                            typeof currentMaxWidthValue === 'number'
                                                ? currentMaxWidthValue
                                                : 0
                                        }
                                        onChange={ ( value ) =>
                                            setAttributes( {
                                                [ maxWidthValueKey ]: value,
                                                madeitHasUserEdits: true,
                                            } )
                                        }
                                        min={ 0 }
                                        max={ currentMaxWidthUnit === 'vh' || currentMaxWidthUnit === '%' ? 100 : 1000 }
                                    />

                                    <Button
                                        className="madeit-control-rangeRow__reset"
                                        icon="undo"
                                        variant="tertiary"
                                        onClick={ resetMaxWidth }
                                        showTooltip
                                        label={ __( 'Reset max breedte' ) }
                                    />
                                </div>
                            )}
                        </div>

                        {/* Container hoogte (min-height) */}
                        <div
                            className="madeit-control"
                            style={
                                currentMinHeightUnit == '__custom__'
                                    ? { marginBottom: '52px' }
                                    : {}
                            }
                        >
                            <ControlHeader
                                title={ __( 'Min hoogte' ) }
                                breakpoint={ activeBreakpoint }
                                onBreakpointChange={ setActiveBreakpoint }
                                afterBreakpoint={
                                    <AdvancedUnitSelect
                                        value={currentMinHeightUnit}
                                        customValue={currentMinHeightCustom}
                                        units={['px', '%', 'em', 'rem', 'vh']}
                                        onChange={(unit) =>
                                            setAttributes({
                                                [minHeightUnitKey]: unit,
                                                madeitHasUserEdits: true,
                                            })
                                        }
                                        onCustomChange={(custom) =>
                                            setAttributes({
                                                [minHeightCustomKey]: custom,
                                                madeitHasUserEdits: true,
                                            })
                                        }
                                    />
                                }
                                
                            />

                            
                            {/* If maxWidthUnitKey value = __custom__, doon't show the madeit-control-rangeRow */}
                            { currentMinHeightUnit !== '__custom__' && (
                            <div className="madeit-control-rangeRow">
                                <RangeControl
                                    __next40pxDefaultSize
                                    label=""
                                    value={ minHeightValueForUi }
                                    onChange={ ( value ) =>
                                        setAttributes( {
                                            [ minHeightValueKey ]: value,
                                            madeitHasUserEdits: true,
                                        } )
                                    }
                                    min={ 0 }
                                    max={ minHeightUnitForUi === 'vh' ? 100 : 1000 }
                                    description={ __( 'Gebruik 100vh om de container op volledige hoogte te bereiken' ) }
                                />

                                <Button
                                    className="madeit-control-rangeRow__reset"
                                    icon="undo"
                                    variant="tertiary"
                                    onClick={ resetMinHeight }
                                    showTooltip
                                    label={ __( 'Reset min hoogte' ) }
                                />
                            </div>
                            )}
                            
                            <p 
                                className='description'
                                style={
                                    currentMinHeightUnit == '__custom__'
                                    ? { marginTop: '49px', marginBottom: '-51px' }
                                    : {}   
                                } 
                            >
                            Gebruik 100vh om de container op volledige hoogte te bereiken</p>
                        </div>

                        <hr></hr>
                        <ControlHeader
                            title={ __( 'Items' ) }
                        />
                        {/* Direction */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Direction' ) }
                                breakpoint={ activeBreakpoint }
                                onBreakpointChange={ setActiveBreakpoint }
                            />

                           <ToggleGroupControl
                                __next40pxDefaultSize
                                className="madeit-control-buttonGroup"
                                value={ currentDirection }
                                onChange={ ( value ) =>
                                    setAttributes( { [ directionValueKey ]: value } )
                                }
                            >
                                <ToggleGroupControlOption
                                    value="row"
                                    label={ <Icon icon="arrow-right-alt2" /> }
                                    aria-label={ __( 'Row' ) }
                                />

                                <ToggleGroupControlOption
                                    value="column"
                                    label={ <Icon icon="arrow-down-alt2" /> }
                                    aria-label={ __( 'Column' ) }
                                />

                                <ToggleGroupControlOption
                                    value="row-reverse"
                                    label={ <Icon icon="arrow-left-alt2" /> }
                                    aria-label={ __( 'Row reverse' ) }
                                />

                                <ToggleGroupControlOption
                                    value="column-reverse"
                                    label={ <Icon icon="arrow-up-alt2" /> }
                                    aria-label={ __( 'Column reverse' ) }
                                />
                            </ToggleGroupControl>
                        </div>

                        {/* Align items */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Align items' ) }
                                breakpoint={ activeBreakpoint }
                                onBreakpointChange={ setActiveBreakpoint }
                                onReset={ resetAlignItems }
                                resetLabel={ __( 'Reset align items' ) }
                            />

                            <ToggleGroupControl 
                                __next40pxDefaultSize
                                className="madeit-control-buttonGroup"
                                value={ currentAlignItems }
                                onChange={ ( value ) =>
                                    setAttributes( { [ alignItemsValueKey ]: value } )
                                }
                            >

                                { isRowDirection && (
                                    <>
                                        <ToggleGroupControlOption
                                            value="flex-start"
                                            label={ < FlexStartIconRotate /> }
                                            aria-label={ __( 'Top' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="center"
                                            label={ < CenterIconRotate /> }
                                            aria-label={ __( 'Center' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="flex-end"
                                            label={ < FlexEndIconRotate /> }
                                            aria-label={ __( 'Bottom' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="stretch"
                                            label={ < StretchIconRotate /> }
                                            aria-label={ __( 'Stretch' ) }
                                        />
                                    </>
                                )}

                                { isColumnDirection && (
                                    <>
                                        <ToggleGroupControlOption
                                            value="flex-start"
                                            label={ < FlexStartIcon /> }
                                            aria-label={ __( 'Left' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="center"
                                            label={ < CenterIcon /> }
                                            aria-label={ __( 'Center' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="flex-end"
                                            label={ < FlexEndIcon /> }
                                            aria-label={ __( 'Right' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="stretch"
                                            label={ < StretchIcon /> }
                                            aria-label={ __( 'Stretch' ) }
                                        />
                                    </>
                                )}

                            </ToggleGroupControl>
                        </div>


                        {/* Justify items */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Justify items' ) }
                                breakpoint={ activeBreakpoint }
                                onBreakpointChange={ setActiveBreakpoint }
                                onReset={ resetJustifyContent }
                                resetLabel={ __( 'Reset justify items' ) }
                            />

                            <ToggleGroupControl 
                                __next40pxDefaultSize
                                className="madeit-control-buttonGroup"
                                value={ currentJustifyContent }
                                onChange={ ( value ) =>
                                    setAttributes( { [ justifyContentValueKey ]: value } )
                                }
                            >

                                { isRowDirection && (
                                    <>
                                        <ToggleGroupControlOption
                                            value="flex-start"
                                            label={ < JustifyStartIcon /> }
                                            aria-label={ __( 'Justify start' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="center"
                                            label={ < JustifyCenterIcon /> }
                                            aria-label={ __( 'Justify center' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="flex-end"
                                            label={ < JustifyEndIcon /> }
                                            aria-label={ __( 'Justify end' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="space-between"
                                            label={ < JustifyBetweenIcon /> }
                                            aria-label={ __( 'Justify between' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="space-around"
                                            label={ < JustifySpaceAroundIcon /> }
                                            aria-label={ __( 'Justify space around' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="space-evenly"
                                            label={ < JustifySpaceEvenlyIcon /> }
                                            aria-label={ __( 'Justify space evenly' ) }
                                        />
                                    </>
                                )}

                                { isColumnDirection && (
                                    <>
                                        <ToggleGroupControlOption
                                            value="flex-start"
                                            label={ < JustifyStartIconRotate /> }
                                            aria-label={ __( 'Justify start' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="center"
                                            label={ < JustifyCenterIconRotate /> }
                                            aria-label={ __( 'Justify center' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="flex-end"
                                            label={ < JustifyEndIconRotate /> }
                                            aria-label={ __( 'Justify end' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="space-between"
                                            label={ < JustifyBetweenIconRotate /> }
                                            aria-label={ __( 'Justify between' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="space-around"
                                            label={ < JustifySpaceAroundIconRotate /> }
                                            aria-label={ __( 'Justify space around' ) }
                                        />

                                        <ToggleGroupControlOption
                                            value="space-evenly"
                                            label={ < JustifySpaceEvenlyIconRotate /> }
                                            aria-label={ __( 'Justify space evenly' ) }
                                        />
                                    </>
                                )}

                            </ToggleGroupControl>
                        </div>

                        {/* Wrap items */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Wrap' ) }
                                breakpoint={ activeBreakpoint }
                                onBreakpointChange={ setActiveBreakpoint }
                                onReset={ resetFlexWrap }
                                resetLabel={ __( 'Reset wrap' ) }
                            />

                            <ToggleGroupControl 
                                __next40pxDefaultSize
                                className="madeit-control-buttonGroup"
                                value={ currentFlexWrap }
                                onChange={ ( value ) =>
                                    setAttributes( { [ flexWrapValueKey ]: value } )
                                }
                            >
                                <ToggleGroupControlOption
                                    value="wrap"
                                    label={ __( 'Wrap' ) }
                                    aria-label={ __( 'Wrap' ) }
                                />

                                <ToggleGroupControlOption
                                    value="nowrap"
                                    label={ __( 'No wrap' ) }
                                    aria-label={ __( 'No wrap' ) }
                                />
                            </ToggleGroupControl>
                        </div> 
                    </PanelBody>

                    <PanelBody title="Extra opties" initialOpen={false}>
                        {/* Overflow */}
                        <SelectControl
                            __next40pxDefaultSize
                            className="flex1"
                            label={ __( 'Overflow' ) }
                            labelPosition='left'
                            value={ computedOverflow }
                            options={ [
                                { value: 'visible', label: __( 'Visible' ) },
                                { value: 'hidden', label: __( 'Hidden' ) },
                                { value: 'scroll', label: __( 'Scroll' ) },
                                { value: 'auto', label: __( 'Auto' ) },
                            ] }
                            onChange={ ( newOverflow ) =>
                                setAttributes( { overflow: newOverflow } )
                            }
                        />

                        {/* HTML tag */}
                        <SelectControl
                            __next40pxDefaultSize
                            className="flex1"
                            label={ __( 'HTML tag' ) }
                            labelPosition='left'
                            value={ computedHtmlTag }
                            options={ [
                                { value: 'div', label: __( 'Standaard' ) },
                                { value: 'div', label: __( 'div' ) },
                                { value: 'section', label: __( 'section' ) },
                                { value: 'article', label: __( 'article' ) },
                                { value: 'main', label: __( 'main' ) },
                                { value: 'header', label: __( 'header' ) },
                                { value: 'footer', label: __( 'footer' ) },
                            ] }
                            onChange={ ( newHtmlTag ) =>
                                setAttributes( { htmlTag: newHtmlTag } )
                            }
                        />
                    </PanelBody>
                    </>
                )}

                {activeTab === 'style' && (
                    <>
                        {/* Style blocks from gutenberg self */}
                        {blockStyles?.length > 0 && (
                            <PanelBody title="Stijlen" initialOpen={false}>
                                <ToggleGroupControl
                                    __next40pxDefaultSize
                                    className="madeit-block-styles-picker"
                                    value={
                                        blockStyles.find( ( style ) =>
                                            ( currentClassName || '' ).includes( `is-style-${ style.name }` )
                                        )?.name || 'default'
                                    }
                                    onChange={ ( value ) => {

                                        if ( value === 'default' ) {
                                            applyBlockStyle( '' );
                                            return;
                                        }

                                        applyBlockStyle( value );
                                    } }
                                >

                                    <ToggleGroupControlOption
                                        className='madeit-block-styles-picker-button'
                                        value="default"
                                        label={ __( 'Default' ) }
                                    />

                                    { blockStyles.map( ( style ) => (
                                        <ToggleGroupControlOption
                                            className='madeit-block-styles-picker-button'
                                            key={ style.name }
                                            value={ style.name }
                                            label={ style.label }
                                            onMouseEnter={ () => previewBlockStyle( style.name ) }
                                            onMouseLeave={ clearPreviewBlockStyle }
                                        />
                                    ) ) }

                                </ToggleGroupControl>
                            </PanelBody>
                        )}

                        <PanelBody title="Achtergrond" initialOpen={true}>
                            <ControlHeader
                                title={ __( 'Achtergrond type' ) }
                                onReset={ resetBackgroundType }
                                afterBreakpoint={
                                    <StyleSwitcher
                                        active={ computedBackgroundType }
                                        onChange={ handleBackgroundTypeChange }
                                    />
                                }
                            />

                            { computedBackgroundType === 'classic' && (
                                
                                <>
                                    {/* Achtergrond kleur */}
                                    <div className="madeit-control">
                                        <PanelColorSettings
                                            initialOpen={ true }
                                            colorSettings={ [
                                                {
                                                    label: __( 'Achtergrond kleur' ),
                                                    value: containerBackgroundColor.color,
                                                    onChange: ( value ) => setContainerBackgroundColor(value),
                                                },
                                            ] }
                                        />
                                    </div>

                                    {/* Achtergrond afbeelding */}
                                    <div className="madeit-control">
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={ ( media ) => setContainerBackgroundImage(media) }
                                                allowedTypes={ ['image'] }
                                                value={ containerBackgroundImage?.id }
                                                render={ ( { open } ) => (
                                                    <Button 
                                                    onClick={ open } 
                                                    style={ { width: '100%', height: '150px', justifyContent: 'center', padding: '0px' } 
                                                    }>
                                                    {/*  if no image selected, gray background with + icon and selecteer afbeelding in a div. Else if image selected, show the image */}
                                                    { !containerBackgroundImage ? (
                                                        <div style={ { width: '100%', height: '150px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px' } }>
                                                            { __( 'Selecteer afbeelding' ) }
                                                        </div>
                                                    ) : (
                                                        <div className={ 'madeit-background-image-preview' }>
                                                            <button className="remove-image-button" onClick={ (e) => { e.stopPropagation(); setContainerBackgroundImage(null); } }>
                                                                { __( 'x' ) }
                                                            </button>
                                                            <img src={ containerBackgroundImage.url } alt={ containerBackgroundImage.alt } style={ { width: '100%', height: '150px', objectFit: 'cover' } } />
                                                            <button className="edit-image-button" onClick={ (e) => { e.stopPropagation(); open(); } }>
                                                                { __( 'Wijzig afbeelding' ) }
                                                            </button>
                                                        </div>
                                                    ) }
                                                    </Button>
                                                ) }
                                            />
                                        </MediaUploadCheck>
                                    </div>

                                    {/* Achtergrond positie */}
                                    {  containerBackgroundImage && (
                                        <>
                                            <div className="madeit-control">
                                                <SelectControl
                                                    __next40pxDefaultSize
                                                    label={ __( 'Achtergrond positie' ) }
                                                    value={ computedContainerBackgroundPosition }
                                                    options={ [
                                                        { label: __( 'Links boven' ), value: 'left top' },
                                                        { label: __( 'Midden boven' ), value: 'center top' },
                                                        { label: __( 'Rechts boven' ), value: 'right top' },
                                                        { label: __( 'Links midden' ), value: 'left center' },
                                                        { label: __( 'Midden' ), value: 'center center' },
                                                        { label: __( 'Rechts midden' ), value: 'right center' },
                                                        { label: __( 'Links onder' ), value: 'left bottom' },
                                                        { label: __( 'Midden onder' ), value: 'center bottom' },
                                                        { label: __( 'Rechts onder' ), value: 'right bottom' },
                                                    ] }
                                                    onChange={ ( value ) => setContainerBackgroundPosition(value) }
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Achtergrond herhaling */}
                                    {  containerBackgroundImage && (
                                        <div className="madeit-control">
                                            <SelectControl
                                                __next40pxDefaultSize
                                                label={ __( 'Achtergrond herhaling' ) }
                                                value={ computedContainerBackgroundRepeat }
                                                options={ [
                                                    { label: __( 'No-repeat' ), value: 'no-repeat' },
                                                    { label: __( 'Repeat' ), value: 'repeat' },
                                                    { label: __( 'Repeat-x' ), value: 'repeat-x' },
                                                    { label: __( 'Repeat-y' ), value: 'repeat-y' },
                                                ] }
                                                onChange={ ( value ) => setContainerBackgroundRepeat(value) }
                                            />
                                        </div>
                                    )}

                                    {/* Achtergrond grootte */}
                                    {  containerBackgroundImage && (
                                        <div className="madeit-control">
                                            <SelectControl
                                                __next40pxDefaultSize
                                                label={ __( 'Achtergrond grootte' ) }
                                                value={ computedContainerBackgroundSize }
                                                options={ [
                                                    { label: __( 'Auto' ), value: 'auto' },
                                                    { label: __( 'Cover' ), value: 'cover' },
                                                    { label: __( 'Contain' ), value: 'contain' },
                                                ] }
                                                onChange={ ( value ) => setContainerBackgroundSize(value) }
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            { computedBackgroundType === 'gradient' && (
                                <>
                                    {/* Gradient instellingen */}
                                    <div className="madeit-control">
                                        <GradientControl
                                            label={ __( 'Gradient' ) }
                                            gradients={ gradients }
                                            value={ computedBackgroundGradientValue }
                                            onChange={ ( value ) => setContainerBackgroundGradient( { gradient: value } ) }
                                        />
                                    </div>
                                </>
                            )}
                        </PanelBody>

                        <PanelBody className="disabledPanel" title="Achtergrond overlay" initialOpen={false}>
                            {/* Overlay Transparant, classic */}

                            {/* Overlay kleur */}

                            {/* Overlay dekking */}

                            {/* Blend mode */}
                        </PanelBody>

                        <PanelBody title="Spatie" initialOpen={false}>

                            {/* Row gap */}
                            <div className="madeit-control">
                                <ControlHeader
                                    title={ __( 'row gap' ) }
                                    breakpoint={ activeBreakpoint }
                                    onBreakpointChange={ setActiveBreakpoint }
                                    afterBreakpoint={
                                        <UnitSelect
                                            value={ currentRowGapUnit }
                                            units={ [ 'px', 'em', 'rem' ] }
                                            onChange={ ( unit ) => {

                                                const currentRowGap = attributes?.[ rowGapValueKey ] || {};

                                                const nextRowGap = {};

                                                Object.keys( currentRowGap ).forEach( ( key ) => {

                                                    const raw = currentRowGap[ key ];

                                                    if ( raw === undefined || raw === null || raw === '' ) {
                                                        return;
                                                    }

                                                    const numeric = parseFloat( raw );

                                                    if ( ! Number.isFinite( numeric ) ) {
                                                        return;
                                                    }

                                                    nextRowGap[ key ] = `${ numeric }${ unit }`;
                                                } );

                                                setAttributes( {
                                                    [ rowGapValueKey ]: nextRowGap,
                                                    [ rowGapUnitKey ]: unit,
                                                    madeitHasUserEdits: true,
                                                } );
                                            } }
                                        />
                                    }
                                    
                                />

                                <div className="madeit-control-rangeRow">
                                    <RangeControl
                                        __next40pxDefaultSize
                                        label=""
                                        value={
                                            typeof currentRowGapValue === 'number'
                                                ? currentRowGapValue
                                                : 0
                                        }
                                        onChange={ ( value ) =>
                                            setAttributes( {
                                                [ rowGapValueKey ]: value,
                                                madeitHasUserEdits: true,
                                            } )
                                        }
                                        min={ 0 }
                                        max={ 100 }
                                    />

                                    <Button
                                        className="madeit-control-rangeRow__reset"
                                        icon="undo"
                                        variant="tertiary"
                                        onClick={ resetRowGap }
                                        showTooltip
                                        label={ __( 'Reset Row Gap' ) }
                                    />
                                </div>
                            </div>


                            {/* Padding */}
                            {/* <ResponsiveBoxControl
                                __next40pxDefaultSize
                                title={ __( 'Padding' ) }
                                breakpoint={ activePaddingBreakpoint }
                                onBreakpointChange={ setActivePaddingBreakpoint }
                                values={ attributes?.[ paddingValueKey ] }
                                onChange={ ( next ) =>
                                    setAttributes( { [ paddingValueKey ]: next } )
                                }
                                onReset={ () => setAttributes( { [ paddingValueKey ]: undefined } ) }
                                resetLabel={ __( 'Reset padding' ) }
                                // allowReset={ true }
                            /> */}

                            {/* Padding als één geheel */}
                            <div className='madeit-control' style={{ display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                                <ControlHeader
                                    title={ __( 'Padding', 'madeit' ) }
                                    breakpoint={ activeBreakpoint }
                                    onBreakpointChange={ setActiveBreakpoint }
                                    afterBreakpoint={
                                        <UnitSelect
                                            value={ paddingUnit }
                                            units={ [ 'px', '%', 'em', 'rem', 'vw', 'vh' ] }
                                            onChange={ ( unit ) => {

                                                const currentPadding =
                                                    attributes?.[ paddingValueKey ] || {};

                                                const nextPadding = {};

                                                [ 'top', 'right', 'bottom', 'left' ].forEach(
                                                    ( key ) => {

                                                        const raw = currentPadding?.[ key ];

                                                        if ( ! raw ) {
                                                            return;
                                                        }

                                                        const numeric = parseFloat( raw );

                                                        if ( ! Number.isFinite( numeric ) ) {
                                                            return;
                                                        }

                                                        nextPadding[ key ] =
                                                            `${ numeric }${ unit }`;

                                                    }
                                                );

                                                setAttributes( {
                                                    [ paddingValueKey ]: nextPadding,
                                                    paddingUnit: unit,
                                                    madeitHasUserEdits: true,
                                                } );

                                            } }
                                        />
                                    }
                                />

                                <div
                                    className="madeit-controls"
                                    style={ {
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        maxWidth: 'calc(100% - 35px)',
                                    } }
                                >
                                    { [
                                        { label: 'Bovenaan', key: 'top', status: 'default' },
                                        { label: 'Rechts', key: 'right', status: 'default' },
                                        { label: 'Onderaan', key: 'bottom', status: 'default' },
                                        { label: 'Links', key: 'left', status: 'default' },
                                    ].map( ( item ) => {

                                        const currentPadding =
                                            attributes?.[ paddingValueKey ] || {};

                                        const rawValue = currentPadding?.[ item.key ];

                                        const numericValue = parseFloat( rawValue );

                                        const displayValue = Number.isFinite( numericValue )
                                            ? numericValue
                                            : '';

                                        return (
                                            <div
                                                key={ item.key }
                                                style={ {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    flex: 1,
                                                } }
                                                className="control-item"
                                            >
                                                <input
                                                    type="number"
                                                    value={ displayValue }
                                                    min={ -9999 }
                                                    disabled={ item.status === 'disabled' }
                                                    onChange={ ( e ) => {

                                                        const val = e.target.value;

                                                        const currentPadding =
                                                            attributes?.[ paddingValueKey ] || {};

                                                        setAttributes( {
                                                            [ paddingValueKey ]: {
                                                                ...currentPadding,
                                                                [ item.key ]:
                                                                    val === ''
                                                                        ? undefined
                                                                        : `${ val }${ paddingUnit || 'px' }`,
                                                            },
                                                        } );

                                                    } }
                                                    style={ {
                                                        width: '100%',
                                                        height: '27px',
                                                        minHeight: '27px',
                                                        fontSize: '.85em',
                                                        textAlign: 'center',
                                                    } }
                                                />

                                                <span
                                                    style={ {
                                                        fontSize: '9px',
                                                        marginTop: '4px',
                                                    } }
                                                >
                                                    { __( item.label, 'madeit' ) }
                                                </span>
                                            </div>
                                        );

                                    } ) }
                                </div>

                                <Button
                                    title="Waarden koppelen"
                                    variant="tertiary"
                                    onClick={ () => {

                                        const currentPadding =
                                            attributes?.[ paddingValueKey ] || {};

                                        const values = [
                                            currentPadding.top,
                                            currentPadding.right,
                                            currentPadding.bottom,
                                            currentPadding.left,
                                        ];

                                        const allEqual = values.every(
                                            ( val ) => val === values[ 0 ]
                                        );

                                        if ( allEqual ) {

                                            setAttributes( {
                                                [ paddingValueKey ]: {
                                                    top: undefined,
                                                    right: undefined,
                                                    bottom: undefined,
                                                    left: undefined,
                                                },
                                            } );

                                        } else {

                                            const firstValue =
                                                values.find( ( val ) => val ) || '';

                                            setAttributes( {
                                                [ paddingValueKey ]: {
                                                    top: firstValue,
                                                    right: firstValue,
                                                    bottom: firstValue,
                                                    left: firstValue,
                                                },
                                            } );

                                        }

                                    } }
                                    style={ {
                                        height: 'fit-content',
                                        marginLeft: '10px',
                                        marginTop: '9px',
                                        padding: '0',
                                    } }
                                    showTooltip
                                >
                                    { (() => {

                                        const currentPadding =
                                            attributes?.[ paddingValueKey ] || {};

                                        const values = [
                                            currentPadding.top,
                                            currentPadding.right,
                                            currentPadding.bottom,
                                            currentPadding.left,
                                        ];

                                        const allEqual = values.every(
                                            ( val ) =>
                                                val === values[ 0 ] &&
                                                val !== undefined
                                        );

                                        return allEqual ? (
                                            <span
                                                className="dashicons dashicons-editor-unlink"
                                                style={ {
                                                    fontSize: '15px',
                                                    width: 'min-content',
                                                } }
                                            />
                                        ) : (
                                            <span
                                                className="dashicons dashicons-admin-links"
                                                style={ {
                                                    fontSize: '15px',
                                                    width: 'min-content',
                                                } }
                                            />
                                        );

                                    } )()}
                                </Button>
                            </div>

                            {/* Margin */}
                            
                            {/* <ResponsiveBoxControl
                                __next40pxDefaultSize
                                title={ __( 'Margin' ) }
                                breakpoint={ activeMarginBreakpoint }
                                onBreakpointChange={ setActiveMarginBreakpoint }
                                values={ attributes?.[ marginValueKey ] }
                                onChange={ ( next ) =>
                                    setAttributes( { [ marginValueKey ]: next } )
                                }
                                onReset={ () => setAttributes( { [ marginValueKey ]: undefined } ) }
                                resetLabel={ __( 'Reset margin' ) }
                                // allowReset={ true }
                                inputProps={ { min: -1000, max: 1000 } }
                                sides={ [ 'top', 'bottom' ] }
                            /> */}

                            {/* Margin als één geheel */}
                            <div className='madeit-control' style={{ display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                                <ControlHeader
                                    title={ __( 'Margin', 'madeit' ) }
                                    breakpoint={ activeBreakpoint }
                                    onBreakpointChange={ setActiveBreakpoint }
                                    afterBreakpoint={
                                        <UnitSelect
                                            value={ marginUnit }
                                            units={ [ 'px', '%', 'em', 'rem', 'vw', 'vh' ] }
                                            onChange={ ( unit ) => {

                                                const currentMargin =
                                                    attributes?.[ marginValueKey ] || {};

                                                const nextMargin = {};

                                                [ 'top', 'right', 'bottom', 'left' ].forEach(
                                                    ( key ) => {

                                                        const raw = currentMargin?.[ key ];

                                                        if ( ! raw ) {
                                                            return;
                                                        }

                                                        const numeric = parseFloat( raw );

                                                        if ( ! Number.isFinite( numeric ) ) {
                                                            return;
                                                        }

                                                        nextMargin[ key ] =
                                                            `${ numeric }${ unit }`;

                                                    }
                                                );

                                                setAttributes( {
                                                    [ marginValueKey ]: nextMargin,
                                                    marginUnit: unit,
                                                    madeitHasUserEdits: true,
                                                } );

                                            } }
                                        />
                                    }
                                />

                                <div
                                    className="madeit-controls"
                                    style={ {
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        maxWidth: 'calc(100% - 35px)',
                                    } }
                                >
                                    { [
                                        { label: 'Bovenaan', key: 'top', status: 'default' },
                                        { label: 'Rechts', key: 'right', status: 'disabled' },
                                        { label: 'Onderaan', key: 'bottom', status: 'default' },
                                        { label: 'Links', key: 'left', status: 'disabled' },
                                    ].map( ( item ) => {

                                        const currentMargin =
                                            attributes?.[ marginValueKey ] || {};

                                        const rawValue = currentMargin?.[ item.key ];

                                        const numericValue = parseFloat( rawValue );

                                        const displayValue = Number.isFinite( numericValue )
                                            ? numericValue
                                            : '';

                                        return (
                                            <div
                                                key={ item.key }
                                                style={ {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    flex: 1,
                                                } }
                                                className="control-item"
                                            >
                                                <input
                                                    type="number"
                                                    value={ displayValue }
                                                    min={ -9999 }
                                                    disabled={ item.status === 'disabled' }
                                                    onChange={ ( e ) => {

                                                        const val = e.target.value;

                                                        const currentMargin =
                                                            attributes?.[ marginValueKey ] || {};

                                                        setAttributes( {
                                                            [ marginValueKey ]: {
                                                                ...currentMargin,
                                                                [ item.key ]:
                                                                    val === ''
                                                                        ? undefined
                                                                        : `${ val }${ marginUnit || 'px' }`,
                                                            },
                                                        } );

                                                    } }
                                                    style={ {
                                                        width: '100%',
                                                        height: '27px',
                                                        minHeight: '27px',
                                                        fontSize: '.85em',
                                                        textAlign: 'center',
                                                    } }
                                                />

                                                <span
                                                    style={ {
                                                        fontSize: '9px',
                                                        marginTop: '4px',
                                                    } }
                                                >
                                                    { __( item.label, 'madeit' ) }
                                                </span>
                                            </div>
                                        );

                                    } ) }
                                </div>

                                <Button
                                    title="Waarden koppelen"
                                    variant="tertiary"
                                    onClick={ () => {

                                        const currentMargin =
                                            attributes?.[ marginValueKey ] || {};

                                        const values = [
                                            currentMargin.top,
                                            currentMargin.right,
                                            currentMargin.bottom,
                                            currentMargin.left,
                                        ];

                                        const allEqual = values.every(
                                            ( val ) => val === values[ 0 ]
                                        );

                                        if ( allEqual ) {

                                            setAttributes( {
                                                [ marginValueKey ]: {
                                                    top: undefined,
                                                    right: undefined,
                                                    bottom: undefined,
                                                    left: undefined,
                                                },
                                            } );

                                        } else {

                                            const firstValue =
                                                values.find( ( val ) => val ) || '';

                                            setAttributes( {
                                                [ marginValueKey ]: {
                                                    top: firstValue,
                                                    right: firstValue,
                                                    bottom: firstValue,
                                                    left: firstValue,
                                                },
                                            } );

                                        }

                                    } }
                                    style={ {
                                        height: 'fit-content',
                                        marginLeft: '10px',
                                        marginTop: '9px',
                                        padding: '0',
                                    } }
                                    showTooltip
                                >
                                    { (() => {

                                        const currentMargin =
                                            attributes?.[ marginValueKey ] || {};

                                        const values = [
                                            currentMargin.top,
                                            currentMargin.right,
                                            currentMargin.bottom,
                                            currentMargin.left,
                                        ];

                                        const allEqual = values.every(
                                            ( val ) =>
                                                val === values[ 0 ] &&
                                                val !== undefined
                                        );

                                        return allEqual ? (
                                            <span
                                                className="dashicons dashicons-editor-unlink"
                                                style={ {
                                                    fontSize: '15px',
                                                    width: 'min-content',
                                                } }
                                            />
                                        ) : (
                                            <span
                                                className="dashicons dashicons-admin-links"
                                                style={ {
                                                    fontSize: '15px',
                                                    width: 'min-content',
                                                } }
                                            />
                                        );

                                    } )()}
                                </Button>
                            </div>

                        </PanelBody>
                    </>
                )}

                {activeTab === 'advanced' && (
                    <>
                        <ResponsiveVisibilityPanel
                            title="Responsive"
                            initialOpen={ true }
                            hideOnDesktop={ hideOnDesktop }
                            hideOnTablet={ hideOnTablet }
                            hideOnMobile={ hideOnMobile }
                            setAttributes={ setAttributes }
                        />

                        <PanelBody className="disabledPanel" title="Binnenkomende animatie" initialOpen={false}>
                            {/* Animatie type */}

                            {/* Animatie duur */}

                            {/* Animatie vertraging */}
                        </PanelBody>
                    </>
                )}

                {/* 
                <PanelBody
                    title={__('Container settings')}
                    initialOpen={true}>
                    <SelectControl
                        label={ __( 'Size' ) }
                        value={ size }
                        options={ containerSizes.map( ( { value, label } ) => ( {
                            value: value,
                            label: label,
                        } ) ) }
                        onChange={ ( newSize ) => setAttributes( { size: newSize } ) }
                    />
                    
                    <ToolsPanel label={ __( 'Dimensions' ) } resetAll={ resetAllContainer }>
                        <ToolsPanelItem
                            hasValue={ () => !! containerPadding }
                            label={ __( 'Padding' ) }
                            onDeselect={ () => setContainerPadding( undefined ) }
                        >
                            <BoxControl
                                label={ __( 'Padding' ) }
                                onChange={ setContainerPadding }
                                values={ containerPadding }
                                allowReset={ false }
                            />
                        </ToolsPanelItem>
                        <ToolsPanelItem
                            hasValue={ () => !! containerMargin }
                            label={ __( 'Margin' ) }
                            onDeselect={ () => setContainerMargin( undefined ) }
                        >
                            <BoxControl
                                label={ __( 'Margin' ) }
                                onChange={ setContainerMargin }
                                values={ containerMargin }
                                allowReset={ false }
                                sides={ [ 'bottom', 'top' ] }
                            />
                        </ToolsPanelItem>
                    </ToolsPanel>

                    { size !== 'container-content-boxed' && (
                        <PanelColorSettings
                            title={ __( 'Container Color Settings' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                {
                                    value: containerBackgroundColor.color,
                                    onChange: ( value ) => setContainerBackgroundColor(value),
                                    label: __( 'Background Color' ),
                                },
                                {
                                    value: rowTextColor.color,
                                    onChange: ( value ) => setRowTextColor(value),
                                    label: __( 'Text Color' ),
                                },
                            ] }
                            >
                            <ContrastChecker
                                { ...{
                                    textColor: rowTextColor.color,
                                    backgroundColor: containerBackgroundColor.color,
                                    fallbackTextColor,
                                    fallbackBackgroundColor,
                                } }
                            />
                        </PanelColorSettings>
                    )}
                    { size === 'container-content-boxed' && (
                        <PanelColorSettings
                            title={ __( 'Container Color Settings' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                {
                                    value: containerBackgroundColor.color,
                                    onChange: ( value ) => setContainerBackgroundColor(value),
                                    label: __( 'Background Color' ),
                                }
                            ] }
                            >
                            <ContrastChecker
                                { ...{
                                    textColor: rowTextColor.color,
                                    backgroundColor: containerBackgroundColor.color,
                                    fallbackTextColor,
                                    fallbackBackgroundColor,
                                } }
                            />
                        </PanelColorSettings>
                    )}
                </PanelBody>

                <PanelBody
                    title={__('Row settings')}
                    initialOpen={true}>
                        <RangeControl
                            label={ __( 'Columns' ) }
                            value={ count }
                            onChange={ ( value ) => updateColumns( count, value ) }
                            min={ 1 }
                            max={ 6 }
                        />
                        { size === 'container-content-boxed' && (
                            <div>
                                <ToolsPanel label={ __( 'Dimensions' ) } resetAll={ resetAllRow }>
                                    <ToolsPanelItem
                                        hasValue={ () => !! rowPadding }
                                        label={ __( 'Padding' ) }
                                        onDeselect={ () => setRowPadding( undefined ) }
                                    >
                                        <BoxControl
                                            label={ __( 'Padding' ) }
                                            onChange={ setRowPadding }
                                            values={ rowPadding }
                                            allowReset={ false }
                                        />
                                    </ToolsPanelItem>
                                    <ToolsPanelItem
                                        hasValue={ () => !! rowMargin }
                                        label={ __( 'Margin' ) }
                                        onDeselect={ () => setRowMargin( undefined ) }
                                    >
                                        <BoxControl
                                            label={ __( 'Margin' ) }
                                            onChange={ setRowMargin }
                                            values={ rowMargin }
                                            allowReset={ false }
                                            sides={ [ 'bottom', 'top' ] }
                                        />
                                    </ToolsPanelItem>
                                </ToolsPanel>
                                <PanelColorSettings
                                    title={ __( 'Row Color Settings' ) }
                                    initialOpen={ false }
                                    colorSettings={ [
                                        {
                                            value: rowBackgroundColor.color,
                                            onChange:  ( value ) => setRowBackgroundColor(value),
                                            label: __( 'Background Color' ),
                                        },
                                        {
                                            value: rowTextColor.color,
                                            onChange: ( value ) => setRowTextColor(value),
                                            label: __( 'Text Color' ),
                                        },
                                    ] }
                                    >
                                    <ContrastChecker
                                        { ...{
                                            textColor: rowTextColor.color,
                                            backgroundColor: rowBackgroundColor.color,
                                            fallbackTextColor,
                                            fallbackBackgroundColor,
                                        } }
                                    />
                                </PanelColorSettings>
                            </div>
                        )}
                </PanelBody> */
                }
            </InspectorControls>,
            <BlockControls>
                <BlockVerticalAlignmentToolbar
                    onChange={ updateAlignment }
                    value={ verticalAlignment }
                />
            </BlockControls>,
        <HtmlTag { ...blockProps }>
            <div className={ classesChild }
            style = { styleChild }>
                <div
                    className={ `row madeit-container-row rows-${ columnsCount || 0 }` }
                    style={ rowStyle }
                >
                    <InnerBlocks
                        orientation="horizontal"
                        allowedBlocks={ ALLOWED_BLOCKS } />
                </div>
            </div>
        </HtmlTag>
    ];
}

const ColumnsEditContainerWrapper = withDispatch( ( dispatch, ownProps, registry ) => ( {
    /**
     * Update all child Column blocks with a new vertical alignment setting
     * based on whatever alignment is passed in. This allows change to parent
     * to overide anything set on a individual column basis.
     *
     * @param {string} verticalAlignment the vertical alignment setting
     */
    updateAlignment( verticalAlignment ) {
        const { clientId, setAttributes } = ownProps;
        const { updateBlockAttributes } = dispatch( 'core/block-editor' );
        const { getBlockOrder } = registry.select( 'core/block-editor' );

        // Update own alignment.
        setAttributes( { verticalAlignment } );

        // Update all child Column Blocks to match
        const innerBlockClientIds = getBlockOrder( clientId );
        innerBlockClientIds.forEach( ( innerBlockClientId ) => {
            updateBlockAttributes( innerBlockClientId, {
                verticalAlignment,
            } );
        } );
    },

    /**
     * Updates the column count, including necessary revisions to child Column
     * blocks to grant required or redistribute available space.
     *
     * @param {number} previousColumns Previous column count.
     * @param {number} newColumns      New column count.
     */
    updateColumns( previousColumns, newColumns ) {
        const { clientId } = ownProps;
        const { replaceInnerBlocks } = dispatch( 'core/block-editor' );
        const { getBlocks } = registry.select( 'core/block-editor' );

        let innerBlocks = getBlocks( clientId );
        
        // Redistribute available width for existing inner blocks.
        const isAddingColumn = newColumns > previousColumns;

        if ( isAddingColumn) {
            // If adding a new column, assign width to the new column equal to
            // as if it were `1 / columns` of the total available space.
            const newColumnWidth = toWidthPrecision( 12 / newColumns );

            // Redistribute in consideration of pending block insertion as
            // constraining the available working width.
            const widths = getRedistributedColumnWidths( innerBlocks, 12 - newColumnWidth );

            innerBlocks = [
                ...getMappedColumnWidths( innerBlocks, widths ),
                ...times( newColumns - previousColumns, () => {
                    return createBlock( 'madeit/block-content-column', {
                        width: newColumnWidth,
                    } );
                } ),
            ];
        } else if ( isAddingColumn ) {
            innerBlocks = [
                ...innerBlocks,
                ...times( newColumns - previousColumns, () => {
                    return createBlock( 'madeit/block-content-column' );
                } ),
            ];
        } else {
            // The removed column will be the last of the inner blocks.
            innerBlocks = dropRight( innerBlocks, previousColumns - newColumns );

            //if ( hasExplicitWidths ) {
                // Redistribute as if block is already removed.
                const widths = getRedistributedColumnWidths( innerBlocks, 12 );

                innerBlocks = getMappedColumnWidths( innerBlocks, widths );
            //}
        }

        replaceInnerBlocks( clientId, innerBlocks, false );
    },
} ) )( ColumnsEditContainer );

const createBlocksFromInnerBlocksTemplate = ( innerBlocksTemplate ) => {
    return map(
        innerBlocksTemplate,
        ( [ name, attributes, innerBlocks = [] ] ) =>
            createBlock(
                name,
                attributes,
                createBlocksFromInnerBlocksTemplate( innerBlocks )
            )
    );
};

const ColumnsEdit = ( props ) => {

    const { clientId, attributes, setAttributes } = props;
	// Must be called unconditionally to keep hook order stable
	// when switching from placeholder → inner blocks.
	const placeholderBlockProps = useBlockProps();

    const { hasInnerBlocks } = useSelect(
        ( select ) => ( {
            hasInnerBlocks:
                select( 'core/block-editor' ).getBlocks( clientId ).length > 0,
        } ),
        [ clientId ]
    );

    const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

    const didInitNewResponsiveDefaults = useRef( false );
    const columnsCount = attributes?.columnsCount;
    const flexDirectionTablet = attributes?.flexDirectionTablet;
    const flexDirectionMobile = attributes?.flexDirectionMobile;

    // New blocks (placeholder state) should default to column on tablet/mobile.
    // Existing blocks are left untouched (they already render as row via fallback
    // when tablet/mobile values are undefined).
    useEffect( () => {
        if ( didInitNewResponsiveDefaults.current ) return;
        didInitNewResponsiveDefaults.current = true;

        // Only apply defaults for truly new blocks (placeholder state).
        // if ( hasInnerBlocks ) return;

        // If the block already has a layout chosen at least once, don't override.
        if ( columnsCount !== undefined && columnsCount !== null ) return;

        const shouldInitTablet = flexDirectionTablet === undefined || flexDirectionTablet === null;
        const shouldInitMobile = flexDirectionMobile === undefined || flexDirectionMobile === null;
        if ( !shouldInitTablet && !shouldInitMobile ) return;

        setAttributes( {
            ...( shouldInitTablet ? { flexDirectionTablet: 'column' } : {} ),
            ...( shouldInitMobile ? { flexDirectionMobile: 'column' } : {} ),
        } );
    }, [
        hasInnerBlocks,
        columnsCount,
        flexDirectionTablet,
        flexDirectionMobile,
        setAttributes,
    ] );

    if ( hasInnerBlocks ) {
        return <ColumnsEditContainerWrapper { ...props } />;
    }

	const defaultVariation =
		Array.isArray( containerVariations )
			? containerVariations.find( ( v ) => v?.isDefault ) || containerVariations[ 0 ]
			: undefined;

    const startEmpty = () => {
        replaceInnerBlocks(
            clientId,
            [ createBlock( 'madeit/block-content-column', { width: 12 } ) ],
            false
        );
    };

    const applyVariation = ( nextVariation = defaultVariation ) => {
        if ( nextVariation?.attributes ) {
            setAttributes( nextVariation.attributes );
        }

        if ( nextVariation?.innerBlocks ) {
            replaceInnerBlocks(
                clientId,
                createBlocksFromInnerBlocksTemplate( nextVariation.innerBlocks ),
                false
            );
            return;
        }

        startEmpty();
    };

    // Merge custom class name into placeholder props.
    const mergedPlaceholderProps = {
        ...placeholderBlockProps,
        className: classnames( placeholderBlockProps.className, 'madeit-container-placeholder' ),
    };

    // Placeholder with layout options (local variations, not registered with core).
    return (
		<div { ...mergedPlaceholderProps }>
            <div className="madeit-container-placeholder__inner">
                <div className="madeit-container-placeholder__header">
                    <p className="madeit-container-placeholder__description">
                        { __( 'Kies een layout om te starten.' ) }
                    </p>
                </div>

                { Array.isArray( containerVariations ) && containerVariations.length > 0 && (
                    <div className="madeit-container-placeholder__variations">
                        <ul className="premium-blocks__placeholder-group">
                            { containerVariations.map( ( variation ) => (
                                <li
                                    key={ variation.name || variation.title }
                                    className="premium-blocks__placeholder-item"
                                >
                                    <Button
                                        className="premium-blocks__placeholder-button"
                                        variant="secondary"
                                        onClick={ () => applyVariation( variation ) }
                                        aria-label={ variation.title || variation.name }
                                    >
                                        { variation.icon }
                                    </Button>
                                </li>
                            ) ) }
                        </ul>
                    </div>
                ) }
            </div>
        </div>
    );
};

export default compose([
    withColors('containerBackgroundColor', 'rowTextColor', 'rowBackgroundColor')
])( ColumnsEdit );
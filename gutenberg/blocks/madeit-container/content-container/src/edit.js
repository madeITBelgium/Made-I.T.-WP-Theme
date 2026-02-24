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
    withColors,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useState, useEffect, useRef } from "@wordpress/element";
import { compose } from "@wordpress/compose";
import { withDispatch, useDispatch, useSelect } from "@wordpress/data";
import { PanelBody, RangeControl, SVG, Path, SelectControl,
    Button,
    ButtonGroup,
    ToggleControl,
    Card,
    CardBody,
    Flex,
    FlexItem,
    __experimentalBoxControl as BoxControl,
    __experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem} from "@wordpress/components";
import {
    getColumnsTemplate,
    hasExplicitColumnWidths,
    getMappedColumnWidths,
    getRedistributedColumnWidths,
    toWidthPrecision,
} from './utils';
import { ControlHeader } from '../../../../shared';
import containerVariations from './variations';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'madeit/block-content-column' ];

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
        verticalAlignment, 
        size,
        contentWidth,
        containerMargin,
        containerPadding,
        rowMargin,
        rowPadding,
        minHeight,
        minHeightUnit,
        minHeightTablet,
        minHeightUnitTablet,
        minHeightMobile,
        minHeightUnitMobile,
        maxWidth,
        maxWidthUnit,
        maxWidthTablet,
        maxWidthUnitTablet,
        maxWidthMobile,
        maxWidthUnitMobile,
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
        backgroundType = 'transparent',
    } = attributes;
    
    // Define the container size options and their corresponding CSS classes
    const containerSizes = [
        { value: 'container', label: __( 'Boxed' ) },
        // { value: 'container-content-boxed', label: __( 'Full width - Content boxed' ) },
        { value: 'container-fluid', label: __( 'Full width' ) },
    ];
    const contentBoxedSizes = [
        { value: 'container', label: __( 'Boxed' ) },
        { value: 'container-fluid', label: __( 'Full width' ) },
    ];
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';

    // Initialize `contentWidth` once so it doesn't keep following `size`.
    // This keeps existing blocks stable, while making the controls truly independent.
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

    // If the outer container is boxed, content cannot be full width.
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
    
    var classes = classnames( className, {
        [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
    } );

    classes = classnames( classes, {
        [ `container` ]: 'container' === size,
        [ `container-fluid` ]: 'container-fluid' === size || 'container-content-boxed' === size,
    } );

    const computedContentWidth =
        size === 'container'
            ? 'container'
            : contentWidth === 'container-fluid'
                ? 'container-fluid'
                : 'container';

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
    
    const computedOverflow = overflow ?? 'visible';
    const computedHtmlTag = htmlTag ?? 'div';
    const allowedHtmlTags = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];
    const HtmlTag = allowedHtmlTags.includes( computedHtmlTag ) ? computedHtmlTag : 'div';

    var style = {
        backgroundColor: containerBackgroundColor.color,
        overflow: computedOverflow,
    };

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
    if ( typeof minHeight === 'number' ) {
        style['--madeit-min-height-desktop'] = `${ minHeight }${ minHeightUnit || 'px' }`;
    }
    if ( typeof minHeightTablet === 'number' ) {
        style['--madeit-min-height-tablet'] = `${ minHeightTablet }${ minHeightUnitTablet || 'px' }`;
    }
    if ( typeof minHeightMobile === 'number' ) {
        style['--madeit-min-height-mobile'] = `${ minHeightMobile }${ minHeightUnitMobile || 'px' }`;
    }

    // Responsive max-width via CSS variables.
    if ( typeof maxWidth === 'number' ) {
        style['--madeit-max-width-desktop'] = `${ maxWidth }${ maxWidthUnit || 'px' }`;
    }
    if ( typeof maxWidthTablet === 'number' ) {
        style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }`;
    }
    if ( typeof maxWidthMobile === 'number' ) {
        style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }`;
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
    
    if(containerMargin !== undefined && containerMargin.top !== undefined) {
        style.marginTop = containerMargin.top;
    }
    if(containerMargin !== undefined && containerMargin.bottom !== undefined) {
        style.marginBottom = containerMargin.bottom;
    }
    if(containerPadding !== undefined && containerPadding.top !== undefined) {
        style.paddingTop = containerPadding.top;
    }
    if(containerPadding !== undefined && containerPadding.bottom !== undefined) {
        style.paddingBottom = containerPadding.bottom;
    }
    if(containerPadding !== undefined && containerPadding.left !== undefined) {
        style.paddingLeft = containerPadding.left;
    }
    if(containerPadding !== undefined && containerPadding.right !== undefined) {
        style.paddingRight = containerPadding.right;
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
    }
    
    const blockProps = useBlockProps({
        className: classes,
        style: style,
        'data-madeit-dir': flexDirection || 'row',
        'data-madeit-dir-tablet': flexDirectionTablet || undefined,
        'data-madeit-dir-mobile': flexDirectionMobile || undefined,
    });
    
    const [activeTab, setActiveTab] = useState('layout');
    const [ activeMaxWidthBreakpoint, setActiveMaxWidthBreakpoint ] = useState( 'desktop' );
    const [ activeMinHeightBreakpoint, setActiveMinHeightBreakpoint ] = useState( 'desktop' );
    const [ activeRowGapBreakpoint, setActiveRowGapBreakpoint ] = useState( 'desktop' );

    const [ activeDirectionBreakpoint, setActiveDirectionBreakpoint ] = useState( 'desktop' );
    const directionValueKey =
        activeDirectionBreakpoint === 'tablet'
            ? 'flexDirectionTablet'
            : activeDirectionBreakpoint === 'mobile'
                ? 'flexDirectionMobile'
                : 'flexDirection';
    const currentDirection = attributes?.[ directionValueKey ] || 'row';
    const resetDirection = () =>
        setAttributes( {
            [ directionValueKey ]: activeDirectionBreakpoint === 'desktop' ? 'row' : undefined,
        } );

    const maxWidthValueKey =
        activeMaxWidthBreakpoint === 'tablet'
            ? 'maxWidthTablet'
            : activeMaxWidthBreakpoint === 'mobile'
                ? 'maxWidthMobile'
                : 'maxWidth';
    const maxWidthUnitKey =
        activeMaxWidthBreakpoint === 'tablet'
            ? 'maxWidthUnitTablet'
            : activeMaxWidthBreakpoint === 'mobile'
                ? 'maxWidthUnitMobile'
                : 'maxWidthUnit';
    const currentMaxWidthValue = attributes?.[ maxWidthValueKey ];
    const currentMaxWidthUnit = attributes?.[ maxWidthUnitKey ] || 'px';
    const resetMaxWidth = () =>
        setAttributes( {
            [ maxWidthValueKey ]: undefined,
            [ maxWidthUnitKey ]: 'px',
        } );
    const minHeightValueKey =
        activeMinHeightBreakpoint === 'tablet'
            ? 'minHeightTablet'
            : activeMinHeightBreakpoint === 'mobile'
                ? 'minHeightMobile'
                : 'minHeight';
    const minHeightUnitKey =
        activeMinHeightBreakpoint === 'tablet'
            ? 'minHeightUnitTablet'
            : activeMinHeightBreakpoint === 'mobile'
                ? 'minHeightUnitMobile'
                : 'minHeightUnit';
    const currentMinHeightValue = attributes?.[ minHeightValueKey ];
    const currentMinHeightUnit = attributes?.[ minHeightUnitKey ] || 'px';
    const resetMinHeight = () =>
        setAttributes( {
            [ minHeightValueKey ]: undefined,
            [ minHeightUnitKey ]: 'px',
        } );


    const RowGapValueKey =
        activeRowGapBreakpoint === 'tablet'
            ? 'rowGapTablet'
            : activeRowGapBreakpoint === 'mobile'
                ? 'rowGapMobile'
                : 'rowGap';
    const RowGapUnitKey =
        activeRowGapBreakpoint === 'tablet'
            ? 'rowGapUnitTablet'
            : activeRowGapBreakpoint === 'mobile'
                ? 'rowGapUnitMobile'
                : 'rowGapUnit';
    const currentRowGapValue = attributes?.[ RowGapValueKey ];
    const currentRowGapUnit = attributes?.[ RowGapUnitKey ] || 'px';
    const resetRowGap = () =>
        setAttributes( {
            [ RowGapValueKey ]: undefined,
            [ RowGapUnitKey ]: 'px',
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

    const styleTransparentIcon = () => (
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.49991 0.877075C3.84222 0.877075 0.877075 3.84222 0.877075 7.49991C0.877075 11.1576 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1576 14.1227 7.49991C14.1227 3.84222 11.1576 0.877075 7.49991 0.877075ZM3.85768 3.15057C4.84311 2.32448 6.11342 1.82708 7.49991 1.82708C10.6329 1.82708 13.1727 4.36689 13.1727 7.49991C13.1727 8.88638 12.6753 10.1567 11.8492 11.1421L3.85768 3.15057ZM3.15057 3.85768C2.32448 4.84311 1.82708 6.11342 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C8.88638 13.1727 10.1567 12.6753 11.1421 11.8492L3.15057 3.85768Z" fill="#000000"></path> </g></svg>
    );
    const styleClassicIcon = () => (
        <svg viewBox="0 -2 32 32" fill="#000000"> <g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g><g fill="none" fillRule="evenodd"><g transform="translate(-101.000000, -156.000000)" fill="#000000"><path d="M132.132,156.827 C130.975,155.685 129.099,155.685 127.942,156.827 L115.336,169.277 L119.499,173.44 L132.132,160.964 C133.289,159.821 133.289,157.969 132.132,156.827 Z M112.461,180.385 C111.477,181.298 107.08,183.333 104.491,181.36 C104.491,181.36 105.392,180.657 106.074,179.246 C107.703,174.919 111.763,175.56 111.763,175.56 L113.159,176.938 C113.173,176.952 114.202,178.771 112.461,180.385 Z M113.913,170.683 L110.764,173.788 C108.661,173.74 105.748,174.485 104.491,178.603 C103.53,180.781 101,180.671 101,180.671 C106.253,186.498 112.444,183.196 113.857,181.764 C115.1,180.506 115.279,178.966 115.146,177.734 L118.076,174.846 L113.913,170.683 Z" /></g></g></g></svg>
    );
    const styleGradientIcon = () => (
        <svg fill="#000000" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> </defs> <path d="M26,4H6A2.0023,2.0023,0,0,0,4,6V26a2.0023,2.0023,0,0,0,2,2H26a2.0023,2.0023,0,0,0,2-2V6A2.0023,2.0023,0,0,0,26,4ZM22,26V22H18v4H14V22H10V18h4V14H10V10h4V6h4v4h4V6h4V26Z"></path> <rect x="14" y="10" width="4" height="4"></rect> <rect x="14" y="18" width="4" height="4"></rect> <rect x="18" y="14" width="4" height="4"></rect> <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" className="cls-1" width="32" height="32"></rect> </g></svg>
    );

    const resetBackgroundType = () => {
        setAttributes( { backgroundType: 'transparent' } );
    };

    const StyleSwitcher = ( { active, onChange } ) => (
        <ButtonGroup className="madeit-control-styleSwitcher">
            <Button
                icon={ styleTransparentIcon }
                isPressed={ active === 'transparent' }
                onClick={ () => onChange( 'transparent' ) }
            />
            <Button
                icon={ styleClassicIcon }
                isPressed={ active === 'classic' }
                onClick={ () => onChange( 'classic' ) }
            />
            <Button
                icon={ styleGradientIcon }
                isPressed={ active === 'gradient' }
                onClick={ () => onChange( 'gradient' ) }
            />
        </ButtonGroup>
    );

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


    return [
            <InspectorControls>
                {/* Tab buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button 
                        isPrimary={activeTab === 'layout'} 
                        onClick={() => setActiveTab('layout')}
                        style={{ marginRight: '5px' }}
                    >
                        Layout
                    </Button>
                    <Button 
                        isPrimary={activeTab === 'style'} 
                        onClick={() => setActiveTab('style')}
                        style={{ marginRight: '5px' }}
                    >
                        Style
                    </Button>
                    <Button 
                        isPrimary={activeTab === 'advanced'} 
                        onClick={() => setActiveTab('advanced')}
                    >
                        Advanced
                    </Button>
                </div>

                {/* Tab content */}
                {activeTab === 'layout' && (
                    <>
                    {/* Algemene instellingen */}
                    <PanelBody title="Algemeen" initialOpen={true}>
                        {/* Kolommen wijzigen */}
                        <RangeControl
                            label={ __( 'Wijzig kolommen' ) }
                            value={ count }
                            onChange={ ( value ) => updateColumns( count, value ) }
                            min={ 1 }
                            max={ 6 }
                        />

                        {/* Container breedte */}
                        <ControlHeader
                            title={ __( 'Container breedte' ) }
                        />
                        <ButtonGroup>
                            {containerSizes.map( ( { value, label } ) => (
                                <Button
                                    key={ value }
                                    isPrimary={ size === value }
                                    onClick={ () => setAttributes( { size: value } ) }
                                >
                                    { label }
                                </Button>
                            ) )}
                        </ButtonGroup>
                        <br /><br />
                        { canChooseContentWidth && (
                            <SelectControl
                                label={ __( 'Content breedte' ) }
                                value={ computedContentWidth }
                                onChange={ ( newSize ) =>
                                    setAttributes( { contentWidth: newSize } )
                                }
                                options={ contentBoxedSizes }
                            />
                        ) }
                        


                        {/* Max width */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'max breedte' ) }
                                breakpoint={ activeMaxWidthBreakpoint }
                                onBreakpointChange={ setActiveMaxWidthBreakpoint }
                                afterBreakpoint={
                                    <ButtonGroup className="madeit-control-units">
                                        <Button
                                            isPressed={ currentMaxWidthUnit === 'px' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ maxWidthUnitKey ]: 'px',
                                                } )
                                            }
                                        >
                                            px
                                        </Button>

                                        <Button
                                            isPressed={ currentMaxWidthUnit === '%' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ maxWidthUnitKey ]: '%',
                                                } )
                                            }
                                        >
                                            %
                                        </Button>

                                        <Button
                                            isPressed={ currentMaxWidthUnit === 'vh' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ maxWidthUnitKey ]: 'vh',
                                                } )
                                            }
                                        >
                                            vh
                                        </Button>
                                    </ButtonGroup>
                                }
                                
                            />

                            <div className="madeit-control-rangeRow">
                                <RangeControl
                                    label=""
                                    value={
                                        typeof currentMaxWidthValue === 'number'
                                            ? currentMaxWidthValue
                                            : 0
                                    }
                                    onChange={ ( value ) =>
                                        setAttributes( {
                                            [ maxWidthValueKey ]: value,
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
                        </div>

                        {/* Container hoogte (min-height) */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Min hoogte' ) }
                                breakpoint={ activeMinHeightBreakpoint }
                                onBreakpointChange={ setActiveMinHeightBreakpoint }
                                afterBreakpoint={
                                    <ButtonGroup className="madeit-control-units">
                                        <Button
                                            isPressed={ currentMinHeightUnit === 'px' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ minHeightUnitKey ]: 'px',
                                                } )
                                            }
                                        >
                                            px
                                        </Button>

                                        <Button
                                            isPressed={ currentMinHeightUnit === 'vh' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ minHeightUnitKey ]: 'vh',
                                                } )
                                            }
                                        >
                                            vh
                                        </Button>
                                    </ButtonGroup>
                                }
                                
                            />

                            <div className="madeit-control-rangeRow">
                                <RangeControl
                                    label=""
                                    value={
                                        typeof currentMinHeightValue === 'number'
                                            ? currentMinHeightValue
                                            : 0
                                    }
                                    onChange={ ( value ) =>
                                        setAttributes( {
                                            [ minHeightValueKey ]: value,
                                        } )
                                    }
                                    min={ 0 }
                                    max={ currentMinHeightUnit === 'vh' ? 100 : 1000 }
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
                        </div>


                        {/* Overflow */}
                        <SelectControl
                            label={ __( 'Overflow' ) }
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
                            label={ __( 'HTML tag' ) }
                            value={ computedHtmlTag }
                            options={ [
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

                    {/* Flex instellingen */}
                    <PanelBody title="Flex" initialOpen={false}>
                        {/* Direction */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Direction' ) }
                                breakpoint={ activeDirectionBreakpoint }
                                onBreakpointChange={ setActiveDirectionBreakpoint }
                            />

                            <ButtonGroup className="madeit-control-buttonGroup">
                                <Button
                                    icon="arrow-right-alt2"
                                    isPressed={ currentDirection === 'row' }
                                    onClick={ () =>
                                        setAttributes( { [ directionValueKey ]: 'row' } )
                                    }
                                    aria-label={ __( 'Row' ) }
                                />
                                <Button
                                    icon="arrow-down-alt2"
                                    isPressed={ currentDirection === 'column' }
                                    onClick={ () =>
                                        setAttributes( { [ directionValueKey ]: 'column' } )
                                    }
                                    aria-label={ __( 'Column' ) }
                                />
                                <Button
                                    icon="arrow-left-alt2"
                                    isPressed={ currentDirection === 'row-reverse' }
                                    onClick={ () =>
                                        setAttributes( { [ directionValueKey ]: 'row-reverse' } )
                                    }
                                    aria-label={ __( 'Row reverse' ) }
                                />
                                <Button
                                    icon="arrow-up-alt2"
                                    isPressed={ currentDirection === 'column-reverse' }
                                    onClick={ () =>
                                        setAttributes( {
                                            [ directionValueKey ]: 'column-reverse',
                                        } )
                                    }
                                    aria-label={ __( 'Column reverse' ) }
                                />
                            </ButtonGroup>
                        </div>

                        {/* Align items */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Align items' ) }
                                breakpoint={ activeDirectionBreakpoint }
                                onBreakpointChange={ setActiveDirectionBreakpoint }
                                onReset={ resetAlignItems }
                                resetLabel={ __( 'Reset align items' ) }
                            />

                            <ButtonGroup className="madeit-control-buttonGroup">

                                { isRowDirection && (
                                    <>
                                        <Button
                                            icon={ <FlexStartIconRotate /> }
                                            isPressed={ currentAlignItems === 'flex-start' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ alignItemsValueKey ]: 'flex-start',
                                                } )
                                            }
                                            aria-label={ __( 'Top' ) }
                                        />

                                        <Button
                                            icon={ <CenterIconRotate /> }
                                            isPressed={ currentAlignItems === 'center' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ alignItemsValueKey ]: 'center',
                                                } )
                                            }
                                            aria-label={ __( 'Center' ) }
                                        />

                                        <Button
                                            icon={ <FlexEndIconRotate /> }
                                            isPressed={ currentAlignItems === 'flex-end' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ alignItemsValueKey ]: 'flex-end',
                                                } )
                                            }
                                            aria-label={ __( 'Bottom' ) }
                                        />

                                        <Button
                                            icon={ <StretchIconRotate /> }
                                            isPressed={ currentAlignItems === 'stretch' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ alignItemsValueKey ]: 'stretch',
                                                } )
                                            }
                                            aria-label={ __( 'Stretch' ) }
                                        />
                                    </>
                                )}

                                { isColumnDirection && (
                                    <>
                                        <Button
                                            icon={ <FlexStartIcon /> }
                                            isPressed={ currentAlignItems === 'flex-start' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ alignItemsValueKey ]: 'flex-start',
                                                } )
                                            }
                                            aria-label={ __( 'Left' ) }
                                        />

                                        <Button
                                            icon={ <CenterIcon /> }
                                            isPressed={ currentAlignItems === 'center' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ alignItemsValueKey ]: 'center',
                                                } )
                                            }
                                            aria-label={ __( 'Center' ) }
                                        />

                                        <Button
                                            icon={ <FlexEndIcon /> }
                                            isPressed={ currentAlignItems === 'flex-end' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ alignItemsValueKey ]: 'flex-end',
                                                } )
                                            }
                                            aria-label={ __( 'Right' ) }
                                        />

                                        <Button
                                            icon={ <StretchIcon /> }
                                            isPressed={ currentAlignItems === 'stretch' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ alignItemsValueKey ]: 'stretch',
                                                } )
                                            }
                                            aria-label={ __( 'Stretch' ) }
                                        />
                                    </>
                                )}

                            </ButtonGroup>
                        </div>


                        {/* Justify items */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Justify items' ) }
                                breakpoint={ activeDirectionBreakpoint }
                                onBreakpointChange={ setActiveDirectionBreakpoint }
                                onReset={ resetJustifyContent }
                                resetLabel={ __( 'Reset justify items' ) }
                            />

                            <ButtonGroup className="madeit-control-buttonGroup">

                                { isRowDirection && (
                                    <>
                                        <Button
                                            icon={ <JustifyStartIcon /> }
                                            isPressed={ currentJustifyContent === 'flex-start' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'flex-start',
                                                } )
                                            }
                                            aria-label={ __( 'Justify start' ) }
                                        />

                                        <Button
                                            icon={ <JustifyCenterIcon /> }
                                            isPressed={ currentJustifyContent === 'center' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'center',
                                                } )
                                            }
                                            aria-label={ __( 'Justify center' ) }
                                        />

                                        <Button
                                            icon={ <JustifyEndIcon /> }
                                            isPressed={ currentJustifyContent === 'flex-end' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'flex-end',
                                                } )
                                            }
                                            aria-label={ __( 'Justify end' ) }
                                        />

                                        <Button
                                            icon={ <JustifyBetweenIcon /> }
                                            isPressed={ currentJustifyContent === 'space-between' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'space-between',
                                                } )
                                            }
                                            aria-label={ __( 'Justify between' ) }
                                        />

                                        <Button
                                            icon={ <JustifySpaceAroundIcon /> }
                                            isPressed={ currentJustifyContent === 'space-around' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'space-around',
                                                } )
                                            }
                                            aria-label={ __( 'Justify space around' ) }
                                        />

                                        <Button
                                            icon={ <JustifySpaceEvenlyIcon /> }
                                            isPressed={ currentJustifyContent === 'space-evenly' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'space-evenly',
                                                } )
                                            }
                                            aria-label={ __( 'Justify space evenly' ) }
                                        />
                                    </>
                                )}

                                { isColumnDirection && (
                                    <>
                                        <Button
                                            icon={ <JustifyStartIconRotate /> }
                                            isPressed={ currentJustifyContent === 'flex-start' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'flex-start',
                                                } )
                                            }
                                            aria-label={ __( 'Justify start' ) }
                                        />

                                        <Button
                                            icon={ <JustifyCenterIconRotate /> }
                                            isPressed={ currentJustifyContent === 'center' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'center',
                                                } )
                                            }
                                            aria-label={ __( 'Justify center' ) }
                                        />

                                        <Button
                                            icon={ <JustifyEndIconRotate /> }
                                            isPressed={ currentJustifyContent === 'flex-end' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'flex-end',
                                                } )
                                            }
                                            aria-label={ __( 'Justify end' ) }
                                        />

                                        <Button
                                            icon={ <JustifyBetweenIconRotate /> }
                                            isPressed={ currentJustifyContent === 'space-between' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'space-between',
                                                } )
                                            }
                                            aria-label={ __( 'Justify between' ) }
                                        />

                                        <Button
                                            icon={ <JustifySpaceAroundIconRotate /> }
                                            isPressed={ currentJustifyContent === 'space-around' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'space-around',
                                                } )
                                            }
                                            aria-label={ __( 'Justify space around' ) }
                                        />

                                        <Button
                                            icon={ <JustifySpaceEvenlyIconRotate /> }
                                            isPressed={ currentJustifyContent === 'space-evenly' }
                                            onClick={ () =>
                                                setAttributes( {
                                                    [ justifyContentValueKey ]: 'space-evenly',
                                                } )
                                            }
                                            aria-label={ __( 'Justify space evenly' ) }
                                        />
                                    </>
                                )}

                            </ButtonGroup>
                        </div>

                        {/* Wrap items */}
                        <div className="madeit-control">
                            <ControlHeader
                                title={ __( 'Wrap' ) }
                                breakpoint={ activeDirectionBreakpoint }
                                onBreakpointChange={ setActiveDirectionBreakpoint }
                                onReset={ resetFlexWrap }
                                resetLabel={ __( 'Reset wrap' ) }
                            />
                            <ButtonGroup className="madeit-control-buttonGroup">
                                <Button
                                    isPressed={ currentFlexWrap === 'wrap' }
                                    onClick={ () =>
                                        setAttributes( { [ flexWrapValueKey ]: 'wrap' } )
                                    }
                                    aria-label={ __( 'Wrap' ) }
                                >
                                    { __( 'Wrap' ) }
                                </Button>
                                <Button
                                    isPressed={ currentFlexWrap === 'nowrap' }
                                    onClick={ () =>
                                        setAttributes( { [ flexWrapValueKey ]: 'nowrap' } )
                                    }
                                    aria-label={ __( 'No wrap' ) }
                                >
                                    { __( 'No wrap' ) }
                                </Button>
                            </ButtonGroup>
                        </div>
                    </PanelBody>
                    </>
                )}

                {activeTab === 'style' && (
                    <>
                        <PanelBody title="Achtergrond" initialOpen={true}>
                            {/* Achtergrond type
                                - Transparant
                                - classic (kleur of afbeelding)
                                - gradient
                            */}
                            <ControlHeader
                                title={ __( 'Achtergrond type' ) }
                                onReset={ resetBackgroundType }
                                afterBreakpoint={
                                    <StyleSwitcher
                                        active={ backgroundType }
                                        onChange={ ( newType ) => setAttributes( { backgroundType: newType } ) }
                                    />
                                }
                            />

                            { backgroundType === 'classic' && (
                                
                                <>
                                    {/* Achtergrond kleur */}
                                    <PanelColorSettings
                                        title={ __( 'Achtergrond kleur' ) }
                                        initialOpen={ true }
                                        colorSettings={ [
                                            {
                                                label: __( 'Kleur' ),
                                                value: containerBackgroundColor.color,
                                                onChange: ( value ) => setContainerBackgroundColor(value),
                                            },
                                        ] }
                                    />

                                    {/* Achtergrond afbeelding */}

                                    {/* Achtergrond positie */}
                                    
                                    {/* Achtergrond herhaling */}

                                    {/* Achtergrond grootte */}
                                </>
                            )}

                            { backgroundType === 'gradient' && (
                                <>
                                    {/* Gradient instellingen */}
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
                                    breakpoint={ activeRowGapBreakpoint }
                                    onBreakpointChange={ setActiveRowGapBreakpoint }
                                    afterBreakpoint={
                                        <ButtonGroup className="madeit-control-units">
                                            <Button
                                                isPressed={ currentRowGapUnit === 'px' }
                                                onClick={ () =>
                                                    setAttributes( {
                                                        [ RowGapUnitKey ]: 'px',
                                                    } )
                                                }
                                            >
                                                px
                                            </Button>

                                            <Button
                                                isPressed={ currentRowGapUnit === 'em' }
                                                onClick={ () =>
                                                    setAttributes( {
                                                        [ RowGapUnitKey ]: 'em',
                                                    } )
                                                }
                                            >
                                                em
                                            </Button>

                                            <Button
                                                isPressed={ currentRowGapUnit === 'rem' }
                                                onClick={ () =>
                                                    setAttributes( {
                                                        [ RowGapUnitKey ]: 'rem',
                                                    } )
                                                }
                                            >
                                                rem
                                            </Button>
                                        </ButtonGroup>
                                    }
                                    
                                />

                                <div className="madeit-control-rangeRow">
                                    <RangeControl
                                        label=""
                                        value={
                                            typeof currentRowGapValue === 'number'
                                                ? currentRowGapValue
                                                : 0
                                        }
                                        onChange={ ( value ) =>
                                            setAttributes( {
                                                [ RowGapValueKey ]: value,
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
                            <BoxControl
                                label={ __( 'Padding' ) }
                                onChange={ setContainerPadding }
                                values={ containerPadding }
                                allowReset={ false }
                            />

                            {/* Margin */}
                            <BoxControl
                                label={ __( 'Margin' ) }
                                onChange={ setContainerMargin }
                                values={ containerMargin }
                                allowReset={ false }
                                sides={ [ 'bottom', 'top' ] }
                            />
                        </PanelBody>
                    </>
                )}

                {activeTab === 'advanced' && (
                    <>
                        <PanelBody title="Responsive" initialOpen={true}>
                            {/* Hide on Desktop */}
                            <ToggleControl
                                label={ __( 'Hide on Desktop' ) }
                                checked={ !! hideOnDesktop }
                                onChange={ () => setAttributes( { hideOnDesktop: ! hideOnDesktop } ) }
                            />

                            {/* Hide on Tablet */}
                            <ToggleControl
                                label={ __( 'Hide on Tablet' )}
                                checked={ !! hideOnTablet }
                                onChange={ () => setAttributes( { hideOnTablet: ! hideOnTablet } ) }
                            />

                            {/* Hide on Mobile */}
                            <ToggleControl
                                label={ __( 'Hide on Mobile' )}
                                checked={ !! hideOnMobile }
                                onChange={ () => setAttributes( { hideOnMobile: ! hideOnMobile } ) }
                            />

                        </PanelBody>

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
                <InnerBlocks
                    orientation="horizontal"
                    allowedBlocks={ ALLOWED_BLOCKS } />
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
        if ( hasInnerBlocks ) return;

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
/**
 * External dependencies
 */
import classnames from 'classnames';
import { forEach, find, difference } from 'lodash';

/**
 * WordPress dependencies
 */
import { InnerBlocks, BlockControls, BlockVerticalAlignmentToolbar, InspectorControls, ContrastChecker, PanelColorSettings, withColors, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import {
    PanelBody,
    RangeControl,
    SelectControl,
    TabPanel,
    ToggleControl,
    __experimentalBoxControl as BoxControl,
    __experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { useEffect, useState } from '@wordpress/element';
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import {
    toWidthPrecision,
    getTotalColumnsWidth,
    getColumnWidths,
    getAdjacentBlocks,
    getRedistributedColumnWidths,
} from '../../content-container/src/utils';
import { Button, ButtonGroup, __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption, } from '@wordpress/components';
import { ControlHeader, getTabIcon, ResponsiveVisibilityPanel, UnitSelect } from '../../../../shared';

const stripBackgroundClasses = ( className = '' ) =>
    className
        .split( /\s+/ )
        .filter( Boolean )
        .filter( ( token ) => token !== 'has-background' && ! /^has-.*-background-color$/.test( token ) )
        .join( ' ' );

const inferWidthFromClassNames = ( ...classNameCandidates ) => {
    const className = classNameCandidates
        .filter( ( value ) => typeof value === 'string' && value.trim().length > 0 )
        .join( ' ' );

    if ( ! className ) {
        return undefined;
    }

    const breakpointMatch = className.match( /\bcol-(?:lg|md|sm|xl|xxl)-(\d{1,2})\b/ );
    if ( breakpointMatch ) {
        return Number( breakpointMatch[ 1 ] );
    }

    if ( /\bcol-12\b/.test( className ) ) {
        return 12;
    }

    return undefined;
};

function ColumnEdit( props ) {
    const {
        attributes,
        updateAlignment,
        updateWidth,
        hasChildBlocks,
        backgroundColor,
        setBackgroundColor,
        textColor,
        setTextColor,
        className,
        setAttributes
    } = props;

    const outerClassName = stripBackgroundClasses( className || '' );
    
    const {
        verticalAlignment,
        hasCustomVerticalAlignment,
        width,
        margin,
        marginTablet,
        marginMobile,
        marginUnit,
        padding,
        paddingTablet,
        paddingMobile,
        paddingUnit,
        paddingUnitTablet,
        paddingUnitMobile,
        marginUnitTablet,
        marginUnitMobile,
        aosFade,
        maxContainerSize,
        orderFirst,
        orderLast,
        hideOnDesktop,
        hideOnTablet,
        hideOnMobile,
    } = attributes;

    const inferredWidth = inferWidthFromClassNames( className, attributes.wrapperClassName );
    const effectiveWidth = Number.isFinite( width ) ? width : inferredWidth;

    const [ activeBreakpoint, setActiveBreakpoint ] = useState( 'desktop' );
    const paddingValueKey = activeBreakpoint === 'tablet'
        ? 'paddingTablet'
        : activeBreakpoint === 'mobile'
            ? 'paddingMobile'
            : 'padding';
    const marginValueKey = activeBreakpoint === 'tablet'
        ? 'marginTablet'
        : activeBreakpoint === 'mobile'
            ? 'marginMobile'
            : 'margin';
    const paddingUnitKey = activeBreakpoint === 'tablet'
        ? 'paddingUnitTablet'
        : activeBreakpoint === 'mobile'
            ? 'paddingUnitMobile'
            : 'paddingUnit';
    const marginUnitKey = activeBreakpoint === 'tablet'
        ? 'marginUnitTablet'
        : activeBreakpoint === 'mobile'
            ? 'marginUnitMobile'
            : 'marginUnit';
    const currentPadding = attributes?.[ paddingValueKey ] || {};
    const currentMargin = attributes?.[ marginValueKey ] || {};
    const currentPaddingUnit = attributes?.[ paddingUnitKey ] || paddingUnit || 'px';
    const currentMarginUnit = attributes?.[ marginUnitKey ] || marginUnit || 'px';

    useEffect( () => {
        if ( Number.isFinite( width ) || ! Number.isFinite( inferredWidth ) ) {
            return;
        }

        setAttributes( { width: inferredWidth } );
    }, [ width, inferredWidth, setAttributes ] );

    const widthRounded = Math.round( effectiveWidth );
    
    const setPadding = ( nextPadding ) => {
        setAttributes( { [ paddingValueKey ]: nextPadding } );
    }

    const setMargin = ( nextMargin ) => {
        setAttributes( { [ marginValueKey ]: nextMargin } );
    }

    const resetAll = () => {
		setPadding( undefined );
		setMargin( undefined );
	};


    const classes = classnames( outerClassName, classnames( 'block-core-columns', {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: !! hasCustomVerticalAlignment && !! verticalAlignment,
        [ `col-12` ]: true,
        [ `col-lg-${ widthRounded }` ]: Number.isFinite( widthRounded ),
        [ `is-width-${ widthRounded }` ]: Number.isFinite( widthRounded ),
        [ 'keep-max-container-size' ]: !! maxContainerSize,
    } ) );
    
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';
    
    const outerStyle = {
        color: textColor?.color,
    };

    const innerStyle = {
        backgroundColor: backgroundColor?.color,
        height: '100%',
    };

    if ( margin !== undefined && margin.top !== undefined ) {
        outerStyle.marginTop = margin.top;
    }
    if ( margin !== undefined && margin.bottom !== undefined ) {
        outerStyle.marginBottom = margin.bottom;
    }
    if ( padding !== undefined && padding.top !== undefined ) {
        innerStyle.paddingTop = padding.top;
    }
    if ( padding !== undefined && padding.bottom !== undefined ) {
        innerStyle.paddingBottom = padding.bottom;
    }
    if ( padding !== undefined && padding.left !== undefined ) {
        innerStyle.paddingLeft = padding.left;
    }
    if ( padding !== undefined && padding.right !== undefined ) {
        innerStyle.paddingRight = padding.right;
    }

    const setResponsiveSpacingVars = ( style, prefix, tablet, mobile ) => {
        if ( tablet && typeof tablet === 'object' ) {
            [ 'top', 'right', 'bottom', 'left' ].forEach( ( side ) => {
                if ( tablet[ side ] !== undefined ) {
                    style[ `--madeit-column-${ prefix }-${ side }-tablet` ] = tablet[ side ];
                }
            } );
        }
        if ( mobile && typeof mobile === 'object' ) {
            [ 'top', 'right', 'bottom', 'left' ].forEach( ( side ) => {
                if ( mobile[ side ] !== undefined ) {
                    style[ `--madeit-column-${ prefix }-${ side }-mobile` ] = mobile[ side ];
                }
            } );
        }
    };

    setResponsiveSpacingVars( outerStyle, 'margin', marginTablet, marginMobile );
    setResponsiveSpacingVars( innerStyle, 'padding', paddingTablet, paddingMobile );

    const blockProps = useBlockProps({
        className: classes,
        style: outerStyle,
    });

    const sanitizedBlockProps = {
        ...blockProps,
        className: stripBackgroundClasses( blockProps.className ),
    };

    const innerBlocksProps = useInnerBlocksProps(
        {
            style: innerStyle,
        },
        {
            templateLock: false,
            renderAppender: hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender />,
        }
    );
    
    
    return (
        <div { ...sanitizedBlockProps }>
            <BlockControls>
                <BlockVerticalAlignmentToolbar
                    onChange={ updateAlignment }
                    value={ verticalAlignment }
                />
            </BlockControls>

            <InspectorControls>
                <TabPanel
                    className="madeit-inspector-tabs"
                    tabs={ [
                        {
                            name: 'settings',
                            title: __( 'Algemeen' ),
                            icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'settings' ) }} />,
                        },
                        {
                            name: 'styles',
                            title: __( 'Stijl' ),
                            icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'styles' ) }} />,
                        },
                        {
                            name: 'advanced',
                            title: __( 'Advanced' ),
                            icon: <span dangerouslySetInnerHTML={{ __html: getTabIcon( 'advanced' ) }} />,
                        },
                    ] }
                >
                    { ( tab ) => (
                        <div className="madeit-inspector-tabs__content" style={{ padding: '0 10px' }}>
                            { tab.name === 'settings' && (
                                <PanelBody title={ __( 'Kolom' ) }>
                                    <RangeControl
                                        __next40pxDefaultSize
                                        label={ __( 'Breedte kolom' ) }
                                        description={ __( 'De breedte van de kolom gaat van 1 tot 12.' ) }
                                        value={ effectiveWidth || '' }
                                        onChange={ updateWidth }
                                        min={ 1 }
                                        max={ 12 }
                                        required
                                        allowReset
                                    />
                                </PanelBody>
                            ) }

                            { tab.name === 'styles' && (
                                <>
                                    <PanelBody title={ __( 'Achtergrond' ) } initialOpen={ false } >
                                        <PanelColorSettings
                                            colorSettings={ [
                                            {
                                                value: backgroundColor?.color,
                                                onChange: ( value ) => setBackgroundColor(value),
                                                label: __( 'Achtergrondkleur' ),
                                            },
                                            {
                                                value: textColor?.color,
                                                onChange: ( value ) => setTextColor(value),
                                                label: __( 'Tekstkleur' ),
                                            },
                                            ] }
                                        />
                                        <ContrastChecker
                                            { ...{
                                                textColor: textColor?.color,
                                                backgroundColor: backgroundColor?.color,
                                                fallbackTextColor,
                                                fallbackBackgroundColor,
                                            } }
                                        />
                                    </PanelBody>

                                    <PanelBody title={ __( 'Spatie' ) } initialOpen={ false } >
                                        <div className='madeit-control' style={{ display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                                            <ControlHeader
                                                title={ __( 'Padding', 'madeit' ) }
                                                breakpoint={ activeBreakpoint }
                                                onBreakpointChange={ setActiveBreakpoint }
                                                afterBreakpoint={
                                                    <UnitSelect
                                                        value={ currentPaddingUnit }
                                                        units={ [ 'px', '%', 'em', 'rem', 'vw', 'vh' ] }
                                                        onChange={ ( unit ) => {
            
                                                            const currentPadding = attributes?.[ paddingValueKey ] || {};
            
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
                                                                [ paddingUnitKey ]: unit,
                                                            } );
            
                                                        } }
                                                    />
                                                }
                                            />
                                            <div
                                                className="madeit-controls"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    maxWidth: 'calc(100% - 35px)',
                                                }}
                                            >
                                                {[
                                                    { label: 'Bovenaan', key: 'top' },
                                                    { label: 'Rechts',   key: 'right' },
                                                    { label: 'Onderaan', key: 'bottom' },
                                                    { label: 'Links',    key: 'left' },
                                                ].map((item) => {
                                                    const hasPaddingValue = Object.prototype.hasOwnProperty.call(
                                                        currentPadding,
                                                        item.key
                                                    );
                                                    const rawValue = hasPaddingValue
                                                        ? currentPadding[ item.key ]
                                                        : undefined;
                                                    const numericValue = parseFloat(rawValue);
                                                    const displayValue = Number.isFinite(numericValue)
                                                        ? numericValue
                                                        : ! hasPaddingValue && [ 'left', 'right' ].includes( item.key )
                                                            ? 12
                                                            : '';

                                                    return (
                                                        <div
                                                            key={item.key}
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                flex: 1,
                                                            }}
                                                            className='control-item'
                                                        >
                                                            <input
                                                                type="number"
                                                                value={displayValue}
                                                                min={0}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setPadding({
                                                                        ...(currentPadding || {}),
                                                                        [item.key]: val === ''
                                                                            ? null
                                                                            : `${val}${currentPaddingUnit}`,
                                                                    });
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '27px',
                                                                    minHeight: '27px',
                                                                    fontSize: '.85em',
                                                                    textAlign: 'center',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    fontSize: '9px',
                                                                    marginTop: '4px',
                                                                }}
                                                            >
                                                                {__(item.label, 'madeit')}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                title="Waarden koppelen"
                                                variant="tertiary"
                                                onClick={() => {
                                                    const values = [
                                                        currentPadding?.top,
                                                        currentPadding?.right,
                                                        currentPadding?.bottom,
                                                        currentPadding?.left,
                                                    ];

                                                    const allEqual = values.every((val) => val === values[0]);

                                                    if (allEqual) {
                                                        setPadding({
                                                            top: undefined,
                                                            right: undefined,
                                                            bottom: undefined,
                                                            left: undefined,
                                                        });
                                                    } else {
                                                        const firstValue = values.find((val) => val) || '';
                                                        setPadding({
                                                            top: firstValue,
                                                            right: firstValue,
                                                            bottom: firstValue,
                                                            left: firstValue,
                                                        });
                                                    }
                                                }}
                                                style={{
                                                    height: 'fit-content',
                                                    marginLeft: '10px',
                                                    marginTop: '9px',
                                                    padding: '0',
                                                }}
                                                showTooltip
                                            >
                                                {(() => {
                                                    const values = [
                                                        currentPadding?.top,
                                                        currentPadding?.right,
                                                        currentPadding?.bottom,
                                                        currentPadding?.left,
                                                    ];

                                                    const allEqual = values.every(
                                                        (val) => val === values[0] && val !== undefined
                                                    );

                                                    return allEqual ? (
                                                        <span
                                                            className="dashicons dashicons-editor-unlink"
                                                            style={{
                                                                fontSize: '15px',
                                                                width: 'min-content',
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="dashicons dashicons-admin-links"
                                                            style={{
                                                                fontSize: '15px',
                                                                width: 'min-content',
                                                            }}
                                                        />
                                                    );
                                                })()}
                                            </Button>
                                        </div>

                                        <div className='madeit-control' style={{ display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                                            <ControlHeader
                                                title={ __( 'Margin', 'madeit' ) }
                                                breakpoint={ activeBreakpoint }
                                                onBreakpointChange={ setActiveBreakpoint }
                                                afterBreakpoint={
                                                    <UnitSelect
                                                        value={ currentMarginUnit }
                                                        units={ [ 'px', '%', 'em', 'rem', 'vw', 'vh' ] }
                                                        onChange={ ( unit ) => {
                                                            const currentMargin = attributes?.[ marginValueKey ] || {};

                                                            const nextMargin = {};
                                                            const MARGIN_KEYS = [ 'top', 'right', 'bottom', 'left' ];

                                                            MARGIN_KEYS.forEach( ( key ) => {
                                                                const raw = currentMargin?.[ key ];

                                                                if ( raw === undefined || raw === null || raw === '' ) {
                                                                    return;
                                                                }

                                                                const numeric = parseFloat( raw );

                                                                if ( ! Number.isFinite( numeric ) ) {
                                                                    return;
                                                                }

                                                                nextMargin[ key ] = `${ numeric }${ unit }`;
                                                            } );

                                                            setAttributes( {
                                                                [ marginValueKey ]: nextMargin,
                                                                [ marginUnitKey ]: unit,
                                                            } );
                                                        } }
                                                    />
                                                }
                                            />
                                            <div
                                                className="madeit-controls"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    maxWidth: 'calc(100% - 35px)',
                                                }}
                                            >
                                                {[
                                                    { label: 'Bovenaan', key: 'top',    status: 'default' },
                                                    { label: 'Rechts',   key: 'right',  status: 'disabled' },
                                                    { label: 'Onderaan', key: 'bottom', status: 'default' },
                                                    { label: 'Links',    key: 'left',   status: 'disabled' },
                                                ].map((item) => {
                                                    const rawValue = currentMargin?.[item.key] || '';
                                                    const numericValue = parseFloat(rawValue);
                                                    const displayValue = Number.isFinite(numericValue)
                                                        ? numericValue
                                                        : '';

                                                    return (
                                                        <div
                                                            key={item.key}
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                flex: 1,
                                                            }}
                                                            className='control-item'
                                                        >
                                                            <input
                                                                type="number"
                                                                value={displayValue}
                                                                min={-9999}
                                                                disabled={item.status === 'disabled'}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setMargin({
                                                                        ...(currentMargin || {}),
                                                                        [item.key]: val === ''
                                                                            ? undefined
                                                                            : `${val}${currentMarginUnit}`,
                                                                    });
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '27px',
                                                                    minHeight: '27px',
                                                                    fontSize: '.85em',
                                                                    textAlign: 'center',
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    fontSize: '9px',
                                                                    marginTop: '4px',
                                                                }}
                                                            >
                                                                {__(item.label, 'madeit')}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                title="Waarden koppelen"
                                                variant="tertiary"
                                                onClick={() => {
                                                    const values = [
                                                        currentMargin?.top,
                                                        currentMargin?.right,
                                                        currentMargin?.bottom,
                                                        currentMargin?.left,
                                                    ];

                                                    const allEqual = values.every((val) => val === values[0]);

                                                    if (allEqual) {
                                                        setMargin({
                                                            top: undefined,
                                                            right: undefined,
                                                            bottom: undefined,
                                                            left: undefined,
                                                        });
                                                    } else {
                                                        const firstValue = values.find((val) => val) || '';
                                                        setMargin({
                                                            top: firstValue,
                                                            right: firstValue,
                                                            bottom: firstValue,
                                                            left: firstValue,
                                                        });
                                                    }
                                                }}
                                                style={{
                                                    height: 'fit-content',
                                                    marginLeft: '10px',
                                                    marginTop: '9px',
                                                    padding: '0',
                                                }}
                                                showTooltip
                                            >
                                                {(() => {
                                                    const values = [
                                                        currentMargin?.top,
                                                        currentMargin?.right,
                                                        currentMargin?.bottom,
                                                        currentMargin?.left,
                                                    ];

                                                    const allEqual = values.every(
                                                        (val) => val === values[0] && val !== undefined
                                                    );

                                                    return allEqual ? (
                                                        <span
                                                            className="dashicons dashicons-editor-unlink"
                                                            style={{
                                                                fontSize: '15px',
                                                                width: 'min-content',
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="dashicons dashicons-admin-links"
                                                            style={{
                                                                fontSize: '15px',
                                                                width: 'min-content',
                                                            }}
                                                        />
                                                    );
                                                })()}
                                            </Button>
                                        </div>
                                    </PanelBody>
                                </>
                            ) }

                            { tab.name === 'advanced' && (
                                <>
                                    <ResponsiveVisibilityPanel
                                        title="Responsive"
                                        initialOpen={ true }
                                        hideOnDesktop={ hideOnDesktop }
                                        hideOnTablet={ hideOnTablet }
                                        hideOnMobile={ hideOnMobile }
                                        setAttributes={ setAttributes }
                                    />

                                    <PanelBody title={ __( 'Kolom volgorde', 'madeit' ) } initialOpen={ false }>
                                        <ToggleControl
                                            label={ __( 'Order kolom als eerst op mobiel, laatst op desktop.', 'madeit' ) }
                                            checked={ !! orderFirst }
                                            onChange={ () => setAttributes( { orderFirst: ! orderFirst } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Order kolom als laatste op mobiel, eerste op desktop.', 'madeit' ) }
                                            checked={ !! orderLast }
                                            onChange={ () => setAttributes( { orderLast: ! orderLast } ) }
                                        />
                                        <ToggleControl
                                            label={ __( 'Maximale breedte container aanhouden.', 'madeit' ) }
                                            checked={ !! maxContainerSize }
                                            onChange={ () => setAttributes( { maxContainerSize: ! maxContainerSize } ) }
                                        />
                                    </PanelBody>
            
                                    <PanelBody className="" title="Binnenkomende animatie" initialOpen={false}>
                                        <SelectControl
                                            __next40pxDefaultSize
                                            label={ __( 'Animatie', 'madeit' ) }
                                            value={ aosFade || '' }
                                            options={ [
                                                { label: __( 'Geen', 'madeit' ), value: '' },
                                                { label: __( 'Fade', 'madeit' ), value: 'fade' },
                                                { label: __( 'Fade up', 'madeit' ), value: 'fade-up' },
                                                { label: __( 'Fade down', 'madeit' ), value: 'fade-down' },
                                                { label: __( 'Fade left', 'madeit' ), value: 'fade-left' },
                                                { label: __( 'Fade right', 'madeit' ), value: 'fade-right' },
                                                { label: __( 'Fade up right', 'madeit' ), value: 'fade-up-right' },
                                                { label: __( 'Fade up left', 'madeit' ), value: 'fade-up-left' },
                                                { label: __( 'Fade down right', 'madeit' ), value: 'fade-down-right' },
                                                { label: __( 'Fade down left', 'madeit' ), value: 'fade-down-left' },
                                                { label: __( 'Flip up', 'madeit' ), value: 'flip-up' },
                                                { label: __( 'Flip down', 'madeit' ), value: 'flip-down' },
                                                { label: __( 'Flip left', 'madeit' ), value: 'flip-left' },
                                                { label: __( 'Flip right', 'madeit' ), value: 'flip-right' },
                                                { label: __( 'Slide up right', 'madeit' ), value: 'slide-up-right' },
                                                { label: __( 'Slide up left', 'madeit' ), value: 'slide-up-left' },
                                                { label: __( 'Slide down right', 'madeit' ), value: 'slide-down-right' },
                                                { label: __( 'Slide down left', 'madeit' ), value: 'slide-down-left' },
                                                { label: __( 'Slide up', 'madeit' ), value: 'slide-up' },
                                                { label: __( 'Slide down', 'madeit' ), value: 'slide-down' },
                                                { label: __( 'Zoom in', 'madeit' ), value: 'zoom-in' },
                                                { label: __( 'Zoom in up', 'madeit' ), value: 'zoom-in-up' },
                                                { label: __( 'Zoom in down', 'madeit' ), value: 'zoom-in-down' },
                                                { label: __( 'Zoom in left', 'madeit' ), value: 'zoom-in-left' },
                                                { label: __( 'Zoom in right', 'madeit' ), value: 'zoom-in-right' },
                                                { label: __( 'Zoom out', 'madeit' ), value: 'zoom-out' },
                                                { label: __( 'Zoom out up', 'madeit' ), value: 'zoom-out-up' },
                                                { label: __( 'Zoom out down', 'madeit' ), value: 'zoom-out-down' },
                                                { label: __( 'Zoom out left', 'madeit' ), value: 'zoom-out-left' },
                                                { label: __( 'Zoom out right', 'madeit' ), value: 'zoom-out-right' },
                                            ] }
                                            onChange={ ( value ) => setAttributes( { aosFade: value || '' } ) }
                                        />
                                    </PanelBody>
                                </>
                            ) }
                        </div>
                    ) }
                </TabPanel>
            </InspectorControls>
            <div { ...innerBlocksProps } />
        </div>
    );
}

export default compose(
    withColors('backgroundColor', 'textColor'),
    withSelect( ( select, ownProps ) => {
        const { clientId } = ownProps;
        const { getBlockOrder } = select( 'core/block-editor' );

        return {
            hasChildBlocks: getBlockOrder( clientId ).length > 0,
        };
    } ),
    withDispatch( ( dispatch, ownProps, registry ) => {
        return {
            updateAlignment( verticalAlignment ) {
                const { clientId, setAttributes } = ownProps;
                const { updateBlockAttributes } = dispatch( 'core/block-editor' );
                const { getBlockRootClientId } = registry.select( 'core/block-editor' );

                // Update own alignment.
                if ( verticalAlignment ) {
                    setAttributes( {
                        verticalAlignment,
                        hasCustomVerticalAlignment: true,
                    } );
                } else {
                    setAttributes( {
                        verticalAlignment,
                        hasCustomVerticalAlignment: false,
                    } );
                }

                // Reset Parent Columns Block
                const rootClientId = getBlockRootClientId( clientId );
                updateBlockAttributes( rootClientId, { verticalAlignment: null } );
            },
            updateWidth( width ) {
                const { clientId } = ownProps;
                const { updateBlockAttributes } = dispatch( 'core/block-editor' );
                const { getBlockRootClientId, getBlocks } = registry.select( 'core/block-editor' );

                // Constrain or expand siblings to account for gain or loss of
                // total columns area.
                const columns = getBlocks( getBlockRootClientId( clientId ) );
                const adjacentColumns = getAdjacentBlocks( columns, clientId );

                // The occupied width is calculated as the sum of the new width
                // and the total width of blocks _not_ in the adjacent set.
                const occupiedWidth = width + getTotalColumnsWidth(
                    difference( columns, [
                        find( columns, { clientId } ),
                        ...adjacentColumns,
                    ] )
                );

                // Compute _all_ next column widths, in case the updated column
                // is in the middle of a set of columns which don't yet have
                // any explicit widths assigned (include updates to those not
                // part of the adjacent blocks).
                const nextColumnWidths = {
                    ...getColumnWidths( columns, columns.length ),
                    [ clientId ]: toWidthPrecision( width ),
                    ...getRedistributedColumnWidths( adjacentColumns, 12 - occupiedWidth, columns.length ),
                };

                forEach( nextColumnWidths, ( nextColumnWidth, columnClientId ) => {
                    updateBlockAttributes( columnClientId, { width: nextColumnWidth } );
                } );
            }
        };
    } )
)( ColumnEdit );
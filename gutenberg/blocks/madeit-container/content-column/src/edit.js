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
    __experimentalBoxControl as BoxControl,
    __experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { useEffect } from '@wordpress/element';
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
import { ControlHeader } from '../../../../shared';

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
        marginUnit,
        padding,
        paddingUnit,
        maxContainerSize
    } = attributes;

    const inferredWidth = inferWidthFromClassNames( className, attributes.wrapperClassName );
    const effectiveWidth = Number.isFinite( width ) ? width : inferredWidth;

    useEffect( () => {
        if ( Number.isFinite( width ) || ! Number.isFinite( inferredWidth ) ) {
            return;
        }

        setAttributes( { width: inferredWidth } );
    }, [ width, inferredWidth, setAttributes ] );

    const widthRounded = Math.round( effectiveWidth );
    
    const setPadding = ( padding ) => {
        setAttributes( { padding } );
    }

    const setMargin = ( margin ) => {
        setAttributes( { margin } );
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
                <PanelBody title={ __( 'Column Settings' ) }>
                    <RangeControl
                        __next40pxDefaultSize
                        label={ __( 'Percentage width' ) }
                        value={ effectiveWidth || '' }
                        onChange={ updateWidth }
                        min={ 1 }
                        max={ 12 }
                        required
                        allowReset
                    />
                </PanelBody>
                <PanelColorSettings
                    title={ __( 'Column Color Settings' ) }
                    initialOpen={ false }
                    colorSettings={ [
                        {
                            value: backgroundColor.color,
                            onChange: ( value ) => setBackgroundColor(value),
                            label: __( 'Background Color' ),
                        },
                        {
                            value: textColor.color,
                            onChange: ( value ) => setTextColor(value),
                            label: __( 'Text Color' ),
                        },
                    ] }
                    >
                    <ContrastChecker
                        { ...{
                            textColor: textColor.color,
                            backgroundColor: backgroundColor.color,
                            fallbackTextColor,
                            fallbackBackgroundColor,
                        } }
                    />
                </PanelColorSettings>
                <ToolsPanel label={ __( 'Dimensions' ) } resetAll={ resetAll }>

                    {/* ----------------------- PADDING -------------------- */}
                    <ToolsPanelItem
                        className="madeit-padding-controls"
                        style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}
                        hasValue={ () => !! padding }
                        label={ __( 'Padding' ) }
                        onDeselect={ () => setPadding( undefined ) }
                    >
                        {/* <BoxControl
                            __next40pxDefaultSize
                            label={ __( 'Padding' ) }
                            onChange={ setPadding }
                            values={ padding }
                            allowReset={ false }
                        /> */}

                        {/* Padding als één geheel */}
                            <ControlHeader
                                title={ __( 'Padding', 'madeit' ) }
                                afterBreakpoint={
                                    <ToggleGroupControl
                                        __next40pxDefaultSize
                                        className="madeit-control-units"
                                        value={ paddingUnit }
                                        onChange={ ( unit ) => {

                                            const nextPadding = { ...( padding || {} ) };
                                            const PADDING_KEYS = [ 'top', 'right', 'bottom', 'left' ];

                                            PADDING_KEYS.forEach( ( key ) => {

                                                const raw = padding?.[ key ];

                                                if ( raw === undefined || raw === null || raw === '' ) {
                                                    return;
                                                }

                                                const numeric = parseFloat( raw );

                                                if ( ! Number.isFinite( numeric ) ) {
                                                    return;
                                                }

                                                nextPadding[ key ] = `${ numeric }${ unit }`;
                                            } );

                                            setAttributes( {
                                                padding: nextPadding,
                                                paddingUnit: unit,
                                            } );
                                        } }
                                    >
                                        { [ 'px', '%', 'em', 'rem', 'vw', 'vh' ].map( ( unit ) => (
                                            <ToggleGroupControlOption
                                                key={ unit }
                                                value={ unit }
                                                label={ unit }
                                            />
                                        ) ) }
                                    </ToggleGroupControl>
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

                                const rawValue = padding?.[item.key] || '';
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
                                            min={0}
                                            onChange={(e) => {

                                                const val = e.target.value;

                                                setPadding({
                                                    ...(padding || {}),
                                                    [item.key]: val === ''
                                                        ? undefined
                                                        : `${val}px`,
                                                });

                                            }}
                                            style={{
                                                width: '100%',
                                                height: '27px',
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
                                    padding?.top,
                                    padding?.right,
                                    padding?.bottom,
                                    padding?.left,
                                ];

                                const allEqual = values.every(
                                    (val) => val === values[0]
                                );

                                if (allEqual) {

                                    setPadding({
                                        top: undefined,
                                        right: undefined,
                                        bottom: undefined,
                                        left: undefined,
                                    });

                                } else {

                                    const firstValue =
                                        values.find((val) => val) || '';

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
                                    padding?.top,
                                    padding?.right,
                                    padding?.bottom,
                                    padding?.left,
                                ];

                                const allEqual = values.every(
                                    (val) =>
                                        val === values[0] &&
                                        val !== undefined
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
                    </ToolsPanelItem>


                    {/* ----------------------- MARGIN -------------------- */}
                    <ToolsPanelItem
                        className="madeit-margin-controls"
                        style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}
                        hasValue={ () => !! margin }
                        label={ __( 'Margin' ) }
                        onDeselect={ () => setMargin( undefined ) }
                    >
                        {/* <BoxControl
                            __next40pxDefaultSize
                            label={ __( 'Margin' ) }
                            onChange={ setMargin }
                            values={ margin }
                            allowReset={ false }
                            sides={ [ 'bottom', 'top' ] }
                        /> */}


                        {/* Margin als één geheel */}
                            <ControlHeader
                                title={ __( 'Margin', 'madeit' ) }
                                afterBreakpoint={
                                   <ToggleGroupControl
                                        __next40pxDefaultSize
                                        className="madeit-control-units"
                                        value={ marginUnit }
                                        onChange={ ( unit ) => {

                                            const nextMargin = { ...( margin || {} ) };
                                            const MARGIN_KEYS = [ 'top', 'right', 'bottom', 'left' ];

                                            MARGIN_KEYS.forEach( ( key ) => {

                                                const raw = margin?.[ key ];

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
                                                margin: nextMargin,
                                                marginUnit: unit,
                                            } );
                                        } }
                                    >
                                        { [ 'px', '%', 'em', 'rem', 'vw', 'vh' ].map( ( unit ) => (
                                            <ToggleGroupControlOption
                                                key={ unit }
                                                value={ unit }
                                                label={ unit }
                                            />
                                        ) ) }
                                    </ToggleGroupControl>
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

                                const rawValue = margin?.[item.key] || '';
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
                                                    ...(margin || {}),
                                                    [item.key]: val === ''
                                                        ? undefined
                                                        : `${val}px`,
                                                });

                                            }}
                                            style={{
                                                width: '100%',
                                                height: '27px',
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
                                    margin?.top,
                                    margin?.right,
                                    margin?.bottom,
                                    margin?.left,
                                ];

                                const allEqual = values.every(
                                    (val) => val === values[0]
                                );

                                if (allEqual) {

                                    setMargin({
                                        top: undefined,
                                        right: undefined,
                                        bottom: undefined,
                                        left: undefined,
                                    });

                                } else {

                                    const firstValue =
                                        values.find((val) => val) || '';

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
                                    margin?.top,
                                    margin?.right,
                                    margin?.bottom,
                                    margin?.left,
                                ];

                                const allEqual = values.every(
                                    (val) =>
                                        val === values[0] &&
                                        val !== undefined
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
                        

                    </ToolsPanelItem>
                </ToolsPanel>
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
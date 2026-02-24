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

const stripBackgroundClasses = ( className = '' ) =>
    className
        .split( /\s+/ )
        .filter( Boolean )
        .filter( ( token ) => token !== 'has-background' && ! /^has-.*-background-color$/.test( token ) )
        .join( ' ' );

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
        width,
        margin,
        padding,
        maxContainerSize
    } = attributes;

    const widthRounded = Math.round( width );
    
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
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
        [ `col-12` ]: true,
        [ `col-lg-${ widthRounded }` ]: Number.isFinite( widthRounded ),
        [ `is-width-${ widthRounded }` ]: Number.isFinite( widthRounded ),
        [ 'keep-max-container-size' ]: !! maxContainerSize,
    } ) );
    
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';
    
    var style = {
        color: textColor.color,
    };

    if(margin !== undefined && margin.top !== undefined) {
        style.marginTop = margin.top;
    }
    if(margin !== undefined && margin.bottom !== undefined) {
        style.marginBottom = margin.bottom;
    }
    if(padding !== undefined && padding.top !== undefined) {
        style.paddingTop = padding.top;
    }
    if(padding !== undefined && padding.bottom !== undefined) {
        style.paddingBottom = padding.bottom;
    }
    if(padding !== undefined && padding.left !== undefined) {
        style.paddingLeft = padding.left;
    }
    if(padding !== undefined && padding.right !== undefined) {
        style.paddingRight = padding.right;
    }

    const blockProps = useBlockProps({
        className: classes,
        style: style,
    });

    const sanitizedBlockProps = {
        ...blockProps,
        className: stripBackgroundClasses( blockProps.className ),
    };

    const innerBlocksProps = useInnerBlocksProps(
        {
            style: {
                backgroundColor: backgroundColor.color,
                height: '100%',
            },
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
                        label={ __( 'Percentage width' ) }
                        value={ width || '' }
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
                    <ToolsPanelItem
                        hasValue={ () => !! padding }
                        label={ __( 'Padding' ) }
                        onDeselect={ () => setPadding( undefined ) }
                    >
                        <BoxControl
                            label={ __( 'Padding' ) }
                            onChange={ setPadding }
                            values={ padding }
                            allowReset={ false }
                        />
                    </ToolsPanelItem>
                    <ToolsPanelItem
                        hasValue={ () => !! margin }
                        label={ __( 'Margin' ) }
                        onDeselect={ () => setMargin( undefined ) }
                    >
                        <BoxControl
                            label={ __( 'Margin' ) }
                            onChange={ setMargin }
                            values={ margin }
                            allowReset={ false }
                            sides={ [ 'bottom', 'top' ] }
                        />
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
                setAttributes( { verticalAlignment } );

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
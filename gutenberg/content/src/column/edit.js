/**
 * External dependencies
 */
import classnames from 'classnames';
import { forEach, find, difference } from 'lodash';

/**
 * WordPress dependencies
 */
const {
    InnerBlocks,
    BlockControls,
    BlockVerticalAlignmentToolbar,
    InspectorControls,
    ContrastChecker,
    PanelColorSettings,
    withColors,
} = wp.blockEditor;
const { PanelBody, RangeControl } = wp.components;
const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import {
    toWidthPrecision,
    getTotalColumnsWidth,
    getColumnWidths,
    getAdjacentBlocks,
    getRedistributedColumnWidths,
} from '../container/utils';

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
        className
    } = props;
    
    const { verticalAlignment, width } = attributes;
    

    const classes = classnames( className, classnames( 'block-core-columns', {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
    } ) );
    
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';
    
    var style = {
        backgroundColor: backgroundColor.color,
        color: textColor.color
    };
    
    return (
        <div className={ classes } style = { style }>
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
            </InspectorControls>
            <InnerBlocks
                templateLock={ false }
                renderAppender={ (
                    hasChildBlocks ?
                        undefined :
                        () => <InnerBlocks.ButtonBlockAppender />
                ) }
            />
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
            },
        };
    } )
)( ColumnEdit );
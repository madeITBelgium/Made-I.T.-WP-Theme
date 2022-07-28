/**
 * External dependencies
 */
import classnames from 'classnames';
import { forEach, find, difference } from 'lodash';

/**
 * WordPress dependencies
 */
import { InnerBlocks, BlockControls, BlockVerticalAlignmentToolbar, InspectorControls, ContrastChecker, PanelColorSettings, withColors, useBlockProps} from "@wordpress/block-editor";
import { PanelBody, RangeControl } from "@wordpress/components";
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
        setAttributes,
    } = props;
    
    const {
        verticalAlignment,
        width,
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
    } = attributes;
    

    const classes = classnames( className, classnames( 'block-core-columns', {
        [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
    } ) );
    
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';
    
    var style = {
        backgroundColor: backgroundColor.color,
        color: textColor.color
    };

    if(marginTop > 0) {
        style.marginTop = (marginTop + 28) + 'px';
    }
    if(marginBottom > 0) {
        style.marginBottom = (marginBottom + 28) + 'px';
    }
    
    if(paddingTop > 0) {
        style.paddingTop = paddingTop + 'px';
    }
    if(paddingBottom > 0) {
        style.paddingBottom = paddingBottom + 'px';
    }
    if(paddingLeft > 0) {
        style.paddingLeft = paddingLeft + 'px';
    }
    if(paddingRight > 0) {
        style.paddingRight = paddingRight + 'px';
    }
    
    
    const blockProps = useBlockProps({
        className: classes,
        style: style,
    });
    
    return (
        <div { ...blockProps }>
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

                <PanelBody
                    title={__('Margin')}
                    initialOpen={ false }>
                    <RangeControl
                        label={ __( 'Top' ) }
                        value={ marginTop }
                        min='0'
                        max='100'
                        onChange={ ( value ) => {
                            setAttributes( { marginTop: value } )
                        } }
                    />
                    <RangeControl
                        label={ __( 'Bottom' ) }
                        value={ marginBottom }
                        min='0'
                        max='100'
                        onChange={ ( value ) => {
                            setAttributes( { marginBottom: value } )
                        } }
                    />
                </PanelBody>
                
                <PanelBody
                    title={__('Padding')}
                    initialOpen={ false }>
                    <RangeControl
                        label={ __( 'Top' ) }
                        value={ paddingTop }
                        min='0'
                        max='100'
                        onChange={ ( value ) => {
                            setAttributes( { paddingTop: value } )
                        } }
                    />
                    <RangeControl
                        label={ __( 'Bottom' ) }
                        value={ paddingBottom }
                        min='0'
                        max='100'
                        onChange={ ( value ) => {
                            setAttributes( { paddingBottom: value } )
                        } }
                    />
                    <RangeControl
                        label={ __( 'Left' ) }
                        value={ paddingLeft }
                        min='0'
                        max='100'
                        onChange={ ( value ) => {
                            setAttributes( { paddingLeft: value } )
                        } }
                    />
                    <RangeControl
                        label={ __( 'Right' ) }
                        value={ paddingRight }
                        min='0'
                        max='100'
                        onChange={ ( value ) => {
                            setAttributes( { paddingRight: value } )
                        } }
                    />
                </PanelBody>
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
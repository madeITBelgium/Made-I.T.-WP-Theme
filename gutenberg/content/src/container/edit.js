/**
 * External dependencies
 */
import classnames from 'classnames';
import { dropRight, get, map, times } from 'lodash';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { createBlock } = wp.blocks;
export const {
    PanelBody,
    RangeControl,
    SVG,
    Path,
    SelectControl,
} = wp.components

export const { useState, useEffect } = wp.element;

export const { compose } = wp.compose;

export const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
    BlockVerticalAlignmentToolbar,
    ContrastChecker,
    PanelColorSettings,
    withColors,
	__experimentalBlockVariationPicker,
} = wp.blockEditor

export const {
	withDispatch,
	useDispatch,
	useSelect,
} = wp.data

/**
 * Internal dependencies
 */
import {
    getColumnsTemplate,
    hasExplicitColumnWidths,
    getMappedColumnWidths,
    getRedistributedColumnWidths,
    toWidthPrecision,
} from './utils';

/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In columns block, the only block we allow is 'madeit/block-content-column'.
 *
 * @constant
 * @type {string[]}
*/
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
    
    const {
        verticalAlignment, 
        size,
        containerMarginTop,
        containerMarginBottom,
        containerPaddingTop,
        containerPaddingBottom,
        containerPaddingLeft,
        containerPaddingRight,
        rowMarginTop,
        rowMarginBottom,
        rowPaddingTop,
        rowPaddingBottom,
        rowPaddingLeft,
        rowPaddingRight,
    } = attributes;
    
    
    const containerSizes = [
        { value: 'container', label: __( 'Boxed' ) },
        { value: 'container-content-boxed', label: __( 'Full width - Content boxed' ) },
        { value: 'container-fluid', label: __( 'Full width' ) },
    ];
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';
    
    const { count } = useSelect( ( select ) => {
        return {
            count: select( 'core/block-editor' ).getBlockCount( clientId ),
        };
    } );
    
    var classes = classnames( className, {
        [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
    } );

    classes = classnames( classes, {
        [ `container` ]: 'container' === size,
        [ `container-fluid` ]: 'container-fluid' === size || 'container-content-boxed' === size,
    } );
    
    var classesChild = classnames( '', {
        [ `container` ]: 'container' === size || 'container-content-boxed' === size,
        [ `container-fluid` ]: 'container-fluid' === size,
    });
    
    var style = {
        backgroundColor: containerBackgroundColor.color,
    };
    
    if(containerMarginTop > 0) {
        style.marginTop = (containerMarginTop + 28) + 'px';
    }
    if(containerMarginBottom > 0) {
        style.marginBottom = (containerMarginBottom + 28) + 'px';
    }
    
    if(containerPaddingTop > 0) {
        style.paddingTop = containerPaddingTop + 'px';
    }
    if(containerPaddingBottom > 0) {
        style.paddingBottom = containerPaddingBottom + 'px';
    }
    if(containerPaddingLeft > 0) {
        style.paddingLeft = containerPaddingLeft + 'px';
    }
    if(containerPaddingRight > 0) {
        style.paddingRight = containerPaddingRight + 'px';
    }
    
    var styleChild = {};
    if(size === 'container-content-boxed') {
        styleChild = {
            backgroundColor: rowBackgroundColor.color,
            color: rowTextColor.color
        };
        
        
        if(rowMarginTop > 0) {
            styleChild.marginTop = rowMarginTop + 'px';
        }
        if(rowMarginBottom > 0) {
            styleChild.marginBottom = rowMarginBottom + 'px';
        }

        if(rowPaddingTop > 0) {
            styleChild.paddingTop = rowPaddingTop + 'px';
        }
        if(rowPaddingBottom > 0) {
            styleChild.paddingBottom = rowPaddingBottom + 'px';
        }
        if(rowPaddingLeft > 0) {
            styleChild.paddingLeft = rowPaddingLeft + 'px';
        }
        if(rowPaddingRight > 0) {
            styleChild.paddingRight = rowPaddingRight + 'px';
        }
    }
    else {
        style['color'] = rowTextColor.color;
    }
    
    return [
            <InspectorControls>
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
                    <PanelBody
                        title={__('Margin')}
                        initialOpen={ false }>
                        <RangeControl
                            label={ __( 'Top' ) }
                            value={ containerMarginTop }
                            min='0'
                            max='100'
                            onChange={ ( value ) => {
                                setAttributes( { containerMarginTop: value } )
                            } }
                        />
                        <RangeControl
                            label={ __( 'Bottom' ) }
                            value={ containerMarginBottom }
                            min='0'
                            max='100'
                            onChange={ ( value ) => {
                                setAttributes( { containerMarginBottom: value } )
                            } }
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('Padding')}
                        initialOpen={ false }>
                        <RangeControl
                            label={ __( 'Top' ) }
                            value={ containerPaddingTop }
                            min='0'
                            max='100'
                            onChange={ ( value ) => {
                                setAttributes( { containerPaddingTop: value } )
                            } }
                        />
                        <RangeControl
                            label={ __( 'Bottom' ) }
                            value={ containerPaddingBottom }
                            min='0'
                            max='100'
                            onChange={ ( value ) => {
                                setAttributes( { containerPaddingBottom: value } )
                            } }
                        />
                        <RangeControl
                            label={ __( 'Left' ) }
                            value={ containerPaddingLeft }
                            min='0'
                            max='100'
                            onChange={ ( value ) => {
                                setAttributes( { containerPaddingLeft: value } )
                            } }
                        />
                        <RangeControl
                            label={ __( 'Right' ) }
                            value={ containerPaddingRight }
                            min='0'
                            max='100'
                            onChange={ ( value ) => {
                                setAttributes( { containerPaddingRight: value } )
                            } }
                        />
                    </PanelBody>
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
                                <PanelBody
                                    title={__('Margin')}
                                    initialOpen={ false }>
                                    <RangeControl
                                        label={ __( 'Top' ) }
                                        value={ rowMarginTop }
                                        min='0'
                                        max='100'
                                        onChange={ ( value ) => {
                                            setAttributes( { rowMarginTop: value } )
                                        } }
                                    />
                                    <RangeControl
                                        label={ __( 'Bottom' ) }
                                        value={ rowMarginBottom }
                                        min='0'
                                        max='100'
                                        onChange={ ( value ) => {
                                            setAttributes( { rowMarginBottom: value } )
                                        } }
                                    />
                                </PanelBody>
                                <PanelBody
                                    title={__('Padding')}
                                    initialOpen={ false }>
                                    <RangeControl
                                        label={ __( 'Top' ) }
                                        value={ rowPaddingTop }
                                        min='0'
                                        max='100'
                                        onChange={ ( value ) => {
                                            setAttributes( { rowPaddingTop: value } )
                                        } }
                                    />
                                    <RangeControl
                                        label={ __( 'Bottom' ) }
                                        value={ rowPaddingBottom }
                                        min='0'
                                        max='100'
                                        onChange={ ( value ) => {
                                            setAttributes( { rowPaddingBottom: value } )
                                        } }
                                    />
                                    <RangeControl
                                        label={ __( 'Left' ) }
                                        value={ rowPaddingLeft }
                                        min='0'
                                        max='100'
                                        onChange={ ( value ) => {
                                            setAttributes( { rowPaddingLeft: value } )
                                        } }
                                    />
                                    <RangeControl
                                        label={ __( 'Right' ) }
                                        value={ rowPaddingRight }
                                        min='0'
                                        max='100'
                                        onChange={ ( value ) => {
                                            setAttributes( { rowPaddingRight: value } )
                                        } }
                                    />
                                </PanelBody>
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
                </PanelBody>
            </InspectorControls>,
            <BlockControls>
                <BlockVerticalAlignmentToolbar
                    onChange={ updateAlignment }
                    value={ verticalAlignment }
                />
            </BlockControls>,
        <div className={ classes }
            style = { style }>
            <div className={ classesChild }
            style = { styleChild }>
                <InnerBlocks
                    __experimentalMoverDirection="horizontal"
                    allowedBlocks={ ALLOWED_BLOCKS } />
            </div>
        </div>
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
    const { clientId, name } = props;
    const {
        blockType,
        defaultVariation,
        hasInnerBlocks,
        variations,
    } = useSelect(
        ( select ) => {
            const {
                getBlockVariations,
                getBlockType,
                getDefaultBlockVariation,
            } = select( 'core/blocks' );

            return {
                blockType: getBlockType( name ),
                defaultVariation: getDefaultBlockVariation( name, 'block' ),
                hasInnerBlocks:
                    select( 'core/block-editor' ).getBlocks( clientId ).length >
                    0,
                variations: getBlockVariations( name, 'block' ),
            };
        },
        [ clientId, name ]
    );

    const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

    if ( hasInnerBlocks ) {
        return <ColumnsEditContainerWrapper { ...props } />;
    }

    return (
        <div>
            <__experimentalBlockVariationPicker
                icon={ get( blockType, [ 'icon', 'src' ] ) }
                label={ get( blockType, [ 'title' ] ) }
                variations={ variations }
                onSelect={ ( nextVariation = defaultVariation ) => {
                    if ( nextVariation.attributes ) {
                        props.setAttributes( nextVariation.attributes );
                    }
                    if ( nextVariation.innerBlocks ) {
                        replaceInnerBlocks(
                            props.clientId,
                            createBlocksFromInnerBlocksTemplate(
                                nextVariation.innerBlocks
                            )
                        );
                    }
                } }
                allowSkip
            />
        </div>
    );
};

export default compose([
    withColors('containerBackgroundColor', 'rowTextColor', 'rowBackgroundColor')
])( ColumnsEdit );
/**
 * External dependencies
 */
import classnames from 'classnames';
import { dropRight, get, map, times } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { 
    useBlockProps,
    InspectorControls,
    InnerBlocks,
    BlockControls,
    BlockVerticalAlignmentToolbar,
    ContrastChecker,
    PanelColorSettings,
    withColors,
	__experimentalBlockVariationPicker,
} from '@wordpress/block-editor';

import { createBlock } from '@wordpress/blocks';
import { useState, useEffect } from "@wordpress/element";
import { compose } from "@wordpress/compose";
import { withDispatch, useDispatch, useSelect } from "@wordpress/data";
import { PanelBody, RangeControl, SVG, Path, SelectControl,
    __experimentalBoxControl as BoxControl,
    __experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem} from "@wordpress/components";

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
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
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
        containerMargin,
        containerPadding,
        rowMargin,
        rowPadding,
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
    
    var style = {
        backgroundColor: containerBackgroundColor.color,
    };
    
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
        // style: style,
    });
    
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
                </PanelBody>
            </InspectorControls>,
            <BlockControls>
                <BlockVerticalAlignmentToolbar
                    onChange={ updateAlignment }
                    value={ verticalAlignment }
                />
            </BlockControls>,
            <div { ...blockProps } style={ rowBackgroundColor.color ? { backgroundColor: rowBackgroundColor.color } : {} }>
                {/* This is the container classname (container, container-fluid ) */}
                <div className={ `${classesChild} maxContainerSize` } style={ style }>
                    <InnerBlocks
                        orientation="horizontal"
                        allowedBlocks={ ALLOWED_BLOCKS } 
                    />
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
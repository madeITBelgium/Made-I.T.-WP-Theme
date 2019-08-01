/**
 * External dependencies
 */
import classnames from 'classnames';
import { dropRight, times } from 'lodash';

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
    withColors
} = wp.blockEditor

export const {
    withDispatch, useSelect
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

/**
 * Template option choices for predefined columns layouts.
 *
 * @constant
 * @type {Array}
 */
const TEMPLATE_OPTIONS = [
    {
        title: __( 'One columns' ),
        icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" clipRule="evenodd" d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H20V34H39ZM18 34H9V14H20V34Z" /></SVG>,
        template: [
            [ 'madeit/block-content-column', { width: 12 } ],
        ],
    },
    {
        title: __( 'Two columns; equal split' ),
        icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" clipRule="evenodd" d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H25V34H39ZM23 34H9V14H23V34Z" /></SVG>,
        template: [
            [ 'madeit/block-content-column', { width: 6 } ],
            [ 'madeit/block-content-column', { width: 6 } ],
        ],
    },
    {
        title: __( 'Two columns; one-third, two-thirds split' ),
        icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" clipRule="evenodd" d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H20V34H39ZM18 34H9V14H18V34Z" /></SVG>,
        template: [
            [ 'madeit/block-content-column', { width: 4 } ],
            [ 'madeit/block-content-column', { width: 8 } ],
        ],
    },
    {
        title: __( 'Two columns; two-thirds, one-third split' ),
        icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" clipRule="evenodd" d="M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H30V34H39ZM28 34H9V14H28V34Z" /></SVG>,
        template: [
            [ 'madeit/block-content-column', { width: 8 } ],
            [ 'madeit/block-content-column', { width: 4 } ],
        ],
    },
    {
        title: __( 'Three columns; equal split' ),
        icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" d="M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM28.5 34h-9V14h9v20zm2 0V14H39v20h-8.5zm-13 0H9V14h8.5v20z" /></SVG>,
        template: [
            [ 'madeit/block-content-column', { width: 4 } ],
            [ 'madeit/block-content-column', { width: 4 } ],
            [ 'madeit/block-content-column', { width: 4 } ],
        ],
    },
    {
        title: __( 'Three columns; wide center column' ),
        icon: <SVG width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><Path fillRule="evenodd" d="M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM31 34H17V14h14v20zm2 0V14h6v20h-6zm-18 0H9V14h6v20z" /></SVG>,
        template: [
            [ 'madeit/block-content-column', { width: 3 } ],
            [ 'madeit/block-content-column', { width: 6 } ],
            [ 'madeit/block-content-column', { width: 3 } ],
        ],
    },
];

/**
 * Number of columns to assume for template in case the user opts to skip
 * template option selection.
 *
 * @type {Number}
 */
const DEFAULT_COLUMNS = 2;

export function ColumnsEdit( props ) {
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
    const [ template, setTemplate ] = useState( getColumnsTemplate( count ) );
    const [ forceUseTemplate, setForceUseTemplate ] = useState( false );

    // This is used to force the usage of the template even if the count doesn't match the template
    // The count doesn't match the template once you use undo/redo (this is used to reset to the placeholder state).
    useEffect( () => {
        // Once the template is applied, reset it.
        if ( forceUseTemplate ) {
            setForceUseTemplate( false );
        }
    }, [ forceUseTemplate ] );

    var classes = classnames( className, {
        [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
    } );

    // The template selector is shown when we first insert the columns block (count === 0).
    // or if there's no template available.
    // The count === 0 trick is useful when you use undo/redo.
    const showTemplateSelector = ( count === 0 && ! forceUseTemplate ) || ! template;
    
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
                    __experimentalTemplateOptions={ TEMPLATE_OPTIONS }
                    __experimentalOnSelectTemplateOption={ ( nextTemplate ) => {
                        if ( nextTemplate === undefined ) {
                            nextTemplate = getColumnsTemplate( DEFAULT_COLUMNS );
                        }

                        setTemplate( nextTemplate );
                        setForceUseTemplate( true );
                    } }
                    __experimentalAllowTemplateOptionSkip
                    template={ showTemplateSelector ? null : template }
                    templateLock="all"
                    allowedBlocks={ ALLOWED_BLOCKS } />
            </div>
        </div>
    ];
}

const withDisp = withDispatch( ( dispatch, ownProps, registry ) => ( {
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

        if ( isAddingColumn ) {
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
} ) );

export default compose([
    withColors('containerBackgroundColor', 'rowTextColor', 'rowBackgroundColor'),
    withDisp
])( ColumnsEdit );
/**
 * External dependencies
 */
import HeadingLevelDropdown from './heading-level-dropdown';

/**
 * WordPress dependencies
 */
import { InnerBlocks,
    InspectorControls,
    ContrastChecker,
    PanelColorSettings,
    withColors,
    RichText,
    BlockControls } from '@wordpress/block-editor';

import { PanelBody, RangeControl, ToggleControl } from "@wordpress/components";
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { __ } from '@wordpress/i18n';

function CardEdit( props ) {
    const {
        attributes,
        setAttributes,
        updateWidth,
        hasChildBlocks,
        backgroundColor,
        setBackgroundColor,
        textColor,
        setTextColor,
        className
    } = props;
    
    const { level, cardTitle, hasTitle } = attributes;
    const TagName = 'h' + level;
    
    const classes = className;
    
    const fallbackTextColor = '#FFFFFF';
    const fallbackBackgroundColor = '#000000';
    
    var style = {
        backgroundColor: backgroundColor.color,
        color: textColor.color
    };
    
    return (
        <div className={ classes } style = { style }>
            <InspectorControls>
                <PanelBody title={ __( 'Title' ) }>
                    <ToggleControl
                        label="Has title"
                        checked={ hasTitle }
                        onChange={ (state) => { console.log(state); setAttributes({hasTitle: state}) } }
                    />
                </PanelBody>
                { hasTitle && (
                    <BlockControls group="block">
                        <HeadingLevelDropdown
                            selectedLevel={ level }
                            onChange={ ( newLevel ) =>
                                setAttributes( { level: newLevel } )
                            }
                        />
                    </BlockControls>
                )}
                <PanelColorSettings
                    title={ __( 'Color Settings' ) }
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
            { hasTitle && (
                <div class="card-header">
                    <RichText
                        identifier="cardTitle"
                        tagName={ TagName }
                        value={ cardTitle }
                        onChange={ ( value ) => setAttributes( { cardTitle: value } ) }
                        aria-label={ __( 'Heading text' ) }
                        placeholder={ __( 'Heading' ) }
                    />
                </div>
            ) }
            <div class="card-body">
                <InnerBlocks
                    templateLock={ false }
                    renderAppender={ (
                        hasChildBlocks ?
                            undefined :
                            () => <InnerBlocks.ButtonBlockAppender />
                    ) }
                />
           </div>
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
    } )
)( CardEdit );
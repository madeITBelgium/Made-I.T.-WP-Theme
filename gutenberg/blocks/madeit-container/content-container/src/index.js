/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';
import classnames from 'classnames';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './../block.json';
import icon from './icon';

// Oude save versies importeren
import saveV1 from './save-versions/save-v1';
import savePaddingOnWrapper from './save-versions/save-padding-on-wrapper';
import savePaddingOnWrapperMin from './save-versions/save-padding-on-wrapper-min';



/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
    ...metadata,
    icon,
    // Variations are intentionally not registered to keep the inserter/editor
    // UI clean: only the main block should be selectable/visible.

    // Set defaults for *newly inserted* blocks without changing existing content.
    // We keep block.json defaults for tablet/mobile undefined, then apply these
    // attributes only at insertion time.
    variations: [
        {
            name: 'madeit-default-responsive',
            title: metadata.title,
            isDefault: true,
            scope: [ 'inserter' ],
            attributes: {
                overflow: 'visible',
                flexDirection: 'row',
                flexDirectionTablet: 'column',
                flexDirectionMobile: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                flexWrap: 'nowrap',
                containerPaddingOnRow: true,
                columnsCount: 0,
                rowGap: 20,
                rowGapUnit: 'px',
                rowGapTablet: 20,
                rowGapUnitTablet: 'px',
                rowGapMobile: 20,
                rowGapUnitMobile: 'px',
            },
        },
    ],
    
    getEditWrapperProps( attributes ) {
        const { size } = attributes;
        if ( 'container-fluid' === size || 'container-content-boxed' === size) {
            return { 'data-align': 'full' };
        }
        return { 'data-align': 'container' };
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,

    deprecated: [
        {
            // Deprecated (2026-03-17):
            // Same as the wrapper-padding legacy serializer, but without
            // explicit whitespace text nodes. This helps match older saved
            // content across different serialization histories.
            save: savePaddingOnWrapperMin,
        },
        {
            // Deprecated (2026-03-17):
            // containerPadding used to be serialized on the outer wrapper
            // instead of `.madeit-container-row`.
            save: savePaddingOnWrapper,
        },
        {
            // Deprecated (2026-03-09):
            // Boxed (`size: container`) used to serialize the container background
            // on the outer wrapper, without an inner `.container` wrapper.
            // Kept to avoid validation errors for existing content.
            save: function( props ) {
                const { attributes, className } = props;
                const {
                    verticalAlignment,
                    backgroundType,
                    containerBackgroundColor,
                    customContainerBackgroundColor,
                    containerBackgroundImage,
                    containerBackgroundPosition,
                    containerBackgroundRepeat,
                    containerBackgroundSize,
                    size,
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
                    hideOnDesktop,
                    hideOnTablet,
                    hideOnMobile,
                    containerMargin,
                    containerPadding,
                    rowTextColor,
                } = attributes;

                // Only handle boxed legacy markup here; for other sizes, use the
                // current save implementation (unchanged for those cases).
                let defaultSize = size;
                if (
                    defaultSize !== 'container' &&
                    defaultSize !== 'container-fluid' &&
                    defaultSize !== 'container-content-boxed'
                ) {
                    defaultSize = 'container';
                }
                if ( defaultSize !== 'container' ) {
                    return save( props );
                }

                const containerBackgroundColorClass = containerBackgroundColor
                    ? getColorClassName( 'background-color', containerBackgroundColor )
                    : undefined;
                const rowTextColorClass = rowTextColor
                    ? getColorClassName( 'color', rowTextColor )
                    : undefined;

                const hasClassicBackground = !!(
                    containerBackgroundImage?.url ||
                    containerBackgroundColor ||
                    customContainerBackgroundColor
                );
                const computedBackgroundType =
                    backgroundType || ( hasClassicBackground ? 'classic' : undefined );

                let classes = classnames( className, {
                    container: true,
                    'is-hidden-desktop': !! hideOnDesktop,
                    'is-hidden-tablet': !! hideOnTablet,
                    'is-hidden-mobile': !! hideOnMobile,
                    'madeit-block-content--frontend': true,
                    [ `are-vertically-aligned-${ verticalAlignment }` ]: !! verticalAlignment,
                } );

                classes = classnames( classes, {
                    'has-text-color': rowTextColorClass,
                    'has-background': containerBackgroundColorClass,
                    [ containerBackgroundColorClass ]: containerBackgroundColorClass,
                    [ rowTextColorClass ]: rowTextColorClass,
                } );

                const style = {
                    backgroundColor:
                        backgroundType === 'transparent'
                            ? 'transparent'
                            : containerBackgroundColorClass
                                ? undefined
                                : customContainerBackgroundColor,
                };

                const hasBackgroundPosition =
                    typeof containerBackgroundPosition === 'string' &&
                    containerBackgroundPosition.length > 0;
                const hasBackgroundRepeat =
                    typeof containerBackgroundRepeat === 'string' &&
                    containerBackgroundRepeat.length > 0;
                const hasBackgroundSize =
                    typeof containerBackgroundSize === 'string' &&
                    containerBackgroundSize.length > 0;

                const computedBackgroundGradient =
                    attributes.containerBackgroundGradient || { gradient: '' };
                const computedBackgroundGradientValue =
                    typeof computedBackgroundGradient?.gradient === 'string' &&
                    computedBackgroundGradient.gradient.trim().length > 0
                        ? computedBackgroundGradient.gradient
                        : undefined;

                if ( computedBackgroundType === 'classic' && containerBackgroundImage?.url ) {
                    style.backgroundImage = `url(${ containerBackgroundImage.url })`;
                    if ( hasBackgroundPosition ) {
                        style.backgroundPosition = containerBackgroundPosition;
                    }
                    if ( hasBackgroundRepeat ) {
                        style.backgroundRepeat = containerBackgroundRepeat;
                    }
                    if ( hasBackgroundSize ) {
                        style.backgroundSize = containerBackgroundSize;
                    }
                }

                if ( computedBackgroundType === 'gradient' && computedBackgroundGradientValue ) {
                    style.backgroundImage = computedBackgroundGradientValue;
                }

                if (
                    typeof overflow === 'string' &&
                    overflow.length > 0 &&
                    overflow !== 'visible'
                ) {
                    style.overflow = overflow;
                }

                // Responsive min-height via CSS variables.
                if ( typeof minHeight === 'number' ) {
                    style['--madeit-min-height-desktop'] = `${ minHeight }${
                        minHeightUnit || 'px'
                    }`;
                }
                if ( typeof minHeightTablet === 'number' ) {
                    style['--madeit-min-height-tablet'] = `${ minHeightTablet }${
                        minHeightUnitTablet || minHeightUnit || 'px'
                    }`;
                }
                if ( typeof minHeightMobile === 'number' ) {
                    style['--madeit-min-height-mobile'] = `${ minHeightMobile }${
                        minHeightUnitMobile ||
                        minHeightUnitTablet ||
                        minHeightUnit ||
                        'px'
                    }`;
                }

                // Responsive max-width via CSS variables.
                if ( typeof maxWidth === 'number' ) {
                    style['--madeit-max-width-desktop'] = `${ maxWidth }${
                        maxWidthUnit || 'px'
                    }`;
                }
                if ( typeof maxWidthTablet === 'number' ) {
                    style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${
                        maxWidthUnitTablet || 'px'
                    }`;
                }
                if ( typeof maxWidthMobile === 'number' ) {
                    style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${
                        maxWidthUnitMobile || 'px'
                    }`;
                }

                // Row gap via CSS variables.
                const hasRowGapDesktop = typeof rowGap === 'number';
                if ( hasRowGapDesktop ) {
                    style['--madeit-row-gap-desktop'] = `${ rowGap }${
                        rowGapUnit || 'px'
                    }`;
                    if ( typeof rowGapTablet === 'number' ) {
                        style['--madeit-row-gap-tablet'] = `${ rowGapTablet }${
                            rowGapUnitTablet || 'px'
                        }`;
                    }
                    if ( typeof rowGapMobile === 'number' ) {
                        style['--madeit-row-gap-mobile'] = `${ rowGapMobile }${
                            rowGapUnitMobile || 'px'
                        }`;
                    }
                }

                // Responsive flex-direction via CSS variables (only if explicitly set).
                if ( typeof flexDirection === 'string' && flexDirection.length > 0 ) {
                    style['--madeit-flex-direction-desktop'] = flexDirection;
                }
                if (
                    typeof flexDirectionTablet === 'string' &&
                    flexDirectionTablet.length > 0
                ) {
                    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
                }
                if (
                    typeof flexDirectionMobile === 'string' &&
                    flexDirectionMobile.length > 0
                ) {
                    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
                }

                if ( typeof alignItems === 'string' && alignItems.length > 0 ) {
                    style['--madeit-align-items-desktop'] = alignItems;
                }
                if (
                    typeof alignItemsTablet === 'string' &&
                    alignItemsTablet.length > 0
                ) {
                    style['--madeit-align-items-tablet'] = alignItemsTablet;
                }
                if (
                    typeof alignItemsMobile === 'string' &&
                    alignItemsMobile.length > 0
                ) {
                    style['--madeit-align-items-mobile'] = alignItemsMobile;
                }

                if (
                    typeof justifyContent === 'string' &&
                    justifyContent.length > 0
                ) {
                    style['--madeit-justify-content-desktop'] = justifyContent;
                }
                if (
                    typeof justifyContentTablet === 'string' &&
                    justifyContentTablet.length > 0
                ) {
                    style['--madeit-justify-content-tablet'] = justifyContentTablet;
                }
                if (
                    typeof justifyContentMobile === 'string' &&
                    justifyContentMobile.length > 0
                ) {
                    style['--madeit-justify-content-mobile'] = justifyContentMobile;
                }

                if ( typeof flexWrap === 'string' && flexWrap.length > 0 ) {
                    style['--madeit-flex-wrap-desktop'] = flexWrap;
                }
                if ( typeof flexWrapTablet === 'string' && flexWrapTablet.length > 0 ) {
                    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
                }
                if ( typeof flexWrapMobile === 'string' && flexWrapMobile.length > 0 ) {
                    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
                }

                if ( containerMargin !== undefined && containerMargin.top !== undefined ) {
                    style.marginTop = containerMargin.top;
                }
                if (
                    containerMargin !== undefined &&
                    containerMargin.bottom !== undefined
                ) {
                    style.marginBottom = containerMargin.bottom;
                }
                if (
                    containerMargin !== undefined &&
                    containerMargin.left !== undefined
                ) {
                    style.marginLeft = containerMargin.left;
                    style['--margin-left-desktop'] = containerMargin.left;
                }
                if (
                    containerMargin !== undefined &&
                    containerMargin.right !== undefined
                ) {
                    style.marginRight = containerMargin.right;
                    style['--margin-right-desktop'] = containerMargin.right;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.top !== undefined
                ) {
                    style.paddingTop = containerPadding.top;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.bottom !== undefined
                ) {
                    style.paddingBottom = containerPadding.bottom;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.left !== undefined
                ) {
                    style.paddingLeft = containerPadding.left;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.right !== undefined
                ) {
                    style.paddingRight = containerPadding.right;
                }

                // Apply row text color inline only when no class exists.
                if ( ! rowTextColorClass ) {
                    style.color = rowTextColorClass;
                }

                const blockProps = useBlockProps.save( {
                    className: classes,
                    style,
                } );

                const allowedHtmlTags = [
                    'div',
                    'section',
                    'article',
                    'main',
                    'header',
                    'footer',
                ];
                const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

                const dirDesktop =
                    typeof flexDirection === 'string' && flexDirection.length > 0
                        ? flexDirection
                        : 'row';
                const dirTablet =
                    typeof flexDirectionTablet === 'string' &&
                    flexDirectionTablet.length > 0
                        ? flexDirectionTablet
                        : undefined;
                const dirMobile =
                    typeof flexDirectionMobile === 'string' &&
                    flexDirectionMobile.length > 0
                        ? flexDirectionMobile
                        : undefined;

                const hasEnhancedRowWrapper =
                    Number.isFinite( columnsCount ) ||
                    ( typeof flexDirection === 'string' && flexDirection.length > 0 ) ||
                    ( typeof flexDirectionTablet === 'string' &&
                        flexDirectionTablet.length > 0 ) ||
                    ( typeof flexDirectionMobile === 'string' &&
                        flexDirectionMobile.length > 0 );

                const rowsCount = Number.isFinite( columnsCount ) ? columnsCount : 0;
                const rowClassName = hasEnhancedRowWrapper
                    ? `row madeit-container-row rows-${ rowsCount }`
                    : 'row';
                const rowProps = hasEnhancedRowWrapper
                    ? {
                            className: rowClassName,
                            'data-madeit-dir': dirDesktop,
                            'data-madeit-dir-tablet': dirTablet,
                            'data-madeit-dir-mobile': dirMobile,
                        }
                    : {
                            className: rowClassName,
                        };

                return (
                    <HtmlTag { ...blockProps }>
                        <div { ...rowProps }>
                            { '\n\n' }
                            <InnerBlocks.Content />
                            { '\n\n' }
                        </div>
                    </HtmlTag>
                );
            },
        },
        {
            // Deprecated (very old markup):
            // - No `madeit-block-content--frontend` class on the wrapper
            // - Inner wrapper was a plain `.row` (no `madeit-container-row`, no data attrs)
            // Keep this so copy/pasting older blocks won't require recovery.
            save: function( props ) {
                const {
                    size,
                    contentWidth,
                    containerMargin,
                    containerPadding,
                    rowMargin,
                    rowPadding,
                    htmlTag,
                } = props.attributes;

                const { className } = props;

                let classes = className;

                let defaultSize = size;
                if (
                    defaultSize !== 'container' &&
                    defaultSize !== 'container-fluid' &&
                    defaultSize !== 'container-content-boxed'
                ) {
                    defaultSize = 'container';
                }

                const outerSizeNormalized =
                    defaultSize === 'container' ? 'container' : 'container-fluid';
                const hasContentWidth =
                    typeof contentWidth === 'string' && contentWidth.length > 0;
                const contentWidthResolvedRaw = hasContentWidth
                    ? contentWidth
                    : defaultSize === 'container-content-boxed'
                        ? 'container'
                        : outerSizeNormalized;
                let contentWidthNormalized =
                    contentWidthResolvedRaw === 'container-fluid'
                        ? 'container-fluid'
                        : 'container';

                if ( outerSizeNormalized === 'container' ) {
                    contentWidthNormalized = 'container';
                }

                classes = classnames( classes, {
                    container: 'container' === defaultSize,
                    'container-fluid':
                        'container-fluid' === defaultSize ||
                        'container-content-boxed' === defaultSize,
                } );

                const style = {};

                if ( containerMargin !== undefined && containerMargin.top !== undefined ) {
                    style.marginTop = containerMargin.top;
                }
                if (
                    containerMargin !== undefined &&
                    containerMargin.bottom !== undefined
                ) {
                    style.marginBottom = containerMargin.bottom;
                }
                if (
                    containerMargin !== undefined &&
                    containerMargin.left !== undefined
                ) {
                    style.marginLeft = containerMargin.left;
                }
                if (
                    containerMargin !== undefined &&
                    containerMargin.right !== undefined
                ) {
                    style.marginRight = containerMargin.right;
                }   
                if (
                    containerPadding !== undefined &&
                    containerPadding.top !== undefined
                ) {
                    style.paddingTop = containerPadding.top;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.bottom !== undefined
                ) {
                    style.paddingBottom = containerPadding.bottom;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.left !== undefined
                ) {
                    style.paddingLeft = containerPadding.left;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.right !== undefined
                ) {
                    style.paddingRight = containerPadding.right;
                }

                // Historic: for these old blocks, row spacing/padding was applied
                // on the same wrapper (so we mimic the old behavior).
                if ( rowMargin !== undefined && rowMargin.top !== undefined ) {
                    style.marginTop = rowMargin.top;
                }
                if ( rowMargin !== undefined && rowMargin.bottom !== undefined ) {
                    style.marginBottom = rowMargin.bottom;
                }
                if ( rowMargin !== undefined && rowMargin.left !== undefined ) {
                    style.marginLeft = rowMargin.left;
                }
                if ( rowMargin !== undefined && rowMargin.right !== undefined ) {
                    style.marginRight = rowMargin.right;
                }
                if ( rowPadding !== undefined && rowPadding.top !== undefined ) {
                    style.paddingTop = rowPadding.top;
                }
                if ( rowPadding !== undefined && rowPadding.bottom !== undefined ) {
                    style.paddingBottom = rowPadding.bottom;
                }
                if ( rowPadding !== undefined && rowPadding.left !== undefined ) {
                    style.paddingLeft = rowPadding.left;
                }
                if ( rowPadding !== undefined && rowPadding.right !== undefined ) {
                    style.paddingRight = rowPadding.right;
                }

                const allowedHtmlTags = [
                    'div',
                    'section',
                    'article',
                    'main',
                    'header',
                    'footer',
                ];
                const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

                const shouldWrapContent =
                    outerSizeNormalized !== 'container' &&
                    hasContentWidth &&
                    contentWidthNormalized !== outerSizeNormalized;

                const blockProps = useBlockProps.save( {
                    className: classes,
                    style,
                } );

                if ( shouldWrapContent ) {
                    return (
                        <HtmlTag { ...blockProps }>
                            <div
                                className={ classnames( {
                                    container: contentWidthNormalized === 'container',
                                    'container-fluid':
                                        contentWidthNormalized === 'container-fluid',
                                } ) }
                            >
                                <div className="row">
                                    { '\n\n' }
                                    <InnerBlocks.Content />
                                    { '\n\n' }
                                </div>
                            </div>
                        </HtmlTag>
                    );
                }

                return (
                    <HtmlTag { ...blockProps }>
                        <div className="row">
                            { '\n\n' }
                            <InnerBlocks.Content />
                            { '\n\n' }
                        </div>
                    </HtmlTag>
                );
            },
        },

        {
            // Deprecated (legacy markup):
            // - Wrapper *did* include `madeit-block-content--frontend`
            // - Inner wrapper *did* include `.madeit-container-row` + data attrs
            // - But `overflow:visible` was NOT serialized in the style attribute
            // - The inner row wrapper contained newline whitespace
            // Needed for older/copy-pasted content that predates the overflow serialization.
            save: function( props ) {
                const {
                    verticalAlignment,
                    backgroundType,
                    containerBackgroundColor,
                    customContainerBackgroundColor,
                    containerBackgroundImage,
                    containerBackgroundPosition,
                    containerBackgroundRepeat,
                    containerBackgroundSize,
                    size,
                    contentWidth,
                    rowBackgroundColor,
                    rowTextColor,
                    customRowBackgroundColor,
                    customRowTextColor,
                    containerMargin,
                    containerPadding,
                    rowMargin,
                    rowPadding,
                    // overflow intentionally ignored
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
                    hideOnDesktop,
                    hideOnTablet,
                    hideOnMobile,
                } = props.attributes;

                const { className } = props;

                const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';

                const containerBackgroundColorClass = containerBackgroundColor
                    ? getColorClassName( 'background-color', containerBackgroundColor )
                    : undefined;
                const rowBackgroundColorClass = rowBackgroundColor
                    ? getColorClassName( 'background-color', rowBackgroundColor )
                    : undefined;
                const rowTextColorClass = rowTextColor
                    ? getColorClassName( 'color', rowTextColor )
                    : undefined;

                const hasClassicBackground = !!(
                    containerBackgroundImage?.url ||
                    containerBackgroundColor ||
                    customContainerBackgroundColor
                );
                const computedBackgroundType =
                    backgroundType || ( hasClassicBackground ? 'classic' : undefined );

                let classes = className;
                let classesChild = '';

                let defaultSize = size;
                if (
                    defaultSize !== 'container' &&
                    defaultSize !== 'container-fluid' &&
                    defaultSize !== 'container-content-boxed'
                ) {
                    defaultSize = 'container';
                }

                const outerSizeNormalized =
                    defaultSize === 'container' ? 'container' : 'container-fluid';
                const hasContentWidth =
                    typeof contentWidth === 'string' && contentWidth.length > 0;
                const contentWidthResolvedRaw = hasContentWidth
                    ? contentWidth
                    : defaultSize === 'container-content-boxed'
                        ? 'container'
                        : outerSizeNormalized;
                let contentWidthNormalized =
                    contentWidthResolvedRaw === 'container-fluid'
                        ? 'container-fluid'
                        : 'container';

                if ( outerSizeNormalized === 'container' ) {
                    contentWidthNormalized = 'container';
                }

                classes = classnames( classes, {
                    container: 'container' === defaultSize,
                    'container-fluid':
                        'container-fluid' === defaultSize ||
                        'container-content-boxed' === defaultSize,
                    'is-hidden-desktop': !! hideOnDesktop,
                    'is-hidden-tablet': !! hideOnTablet,
                    'is-hidden-mobile': !! hideOnMobile,
                } );

                if ( defaultSize !== 'container-content-boxed' ) {
                    classes = classnames( classes, {
                        [ `are-vertically-aligned-${ verticalAlignment }` ]:
                            verticalAlignment &&
                            defaultSize !== 'container-content-boxed',
                    } );
                }

                classesChild = classnames( classesChild, {
                    [ `are-vertically-aligned-${ verticalAlignment }` ]:
                        verticalAlignment &&
                        defaultSize === 'container-content-boxed',
                    container: contentWidthNormalized === 'container',
                    'container-fluid': contentWidthNormalized === 'container-fluid',
                } );

                classes = classnames( classes, {
                    'has-text-color': rowTextColorClass,
                    'has-background': containerBackgroundColorClass,
                    [ containerBackgroundColorClass ]: containerBackgroundColorClass,
                    [ rowTextColorClass ]: rowTextColorClass,
                } );

                const style = {
                    backgroundColor:
                        backgroundType === 'transparent'
                            ? 'transparent'
                            : containerBackgroundColorClass
                                ? undefined
                                : customContainerBackgroundColor,
                };

                const hasBackgroundPosition =
                    typeof containerBackgroundPosition === 'string' &&
                    containerBackgroundPosition.length > 0;
                const hasBackgroundRepeat =
                    typeof containerBackgroundRepeat === 'string' &&
                    containerBackgroundRepeat.length > 0;
                const hasBackgroundSize =
                    typeof containerBackgroundSize === 'string' &&
                    containerBackgroundSize.length > 0;

                const computedBackgroundGradient =
                    props.attributes.containerBackgroundGradient || {
                        gradient: '',
                    };
                const computedBackgroundGradientValue =
                    typeof computedBackgroundGradient?.gradient === 'string' &&
                    computedBackgroundGradient.gradient.trim().length > 0
                        ? computedBackgroundGradient.gradient
                        : undefined;

                if ( computedBackgroundType === 'classic' && containerBackgroundImage?.url ) {
                    style.backgroundImage = `url(${ containerBackgroundImage.url })`;
                    if ( hasBackgroundPosition ) {
                        style.backgroundPosition = containerBackgroundPosition;
                    }
                    if ( hasBackgroundRepeat ) {
                        style.backgroundRepeat = containerBackgroundRepeat;
                    }
                    if ( hasBackgroundSize ) {
                        style.backgroundSize = containerBackgroundSize;
                    }
                }

                if ( computedBackgroundType === 'gradient' && computedBackgroundGradientValue ) {
                    style.backgroundImage = computedBackgroundGradientValue;
                }

                // Responsive min-height via CSS variables.
                if ( typeof minHeight === 'number' ) {
                    style['--madeit-min-height-desktop'] = `${ minHeight }${
                        minHeightUnit || 'px'
                    }`;
                }
                if ( typeof minHeightTablet === 'number' ) {
                    style['--madeit-min-height-tablet'] = `${ minHeightTablet }${
                        minHeightUnitTablet || 'px'
                    }`;
                }
                if ( typeof minHeightMobile === 'number' ) {
                    style['--madeit-min-height-mobile'] = `${ minHeightMobile }${
                        minHeightUnitMobile || 'px'
                    }`;
                }

                // Responsive max-width via CSS variables.
                if ( typeof maxWidth === 'number' ) {
                    style['--madeit-max-width-desktop'] = `${ maxWidth }${
                        maxWidthUnit || 'px'
                    }`;
                }
                if ( typeof maxWidthTablet === 'number' ) {
                    style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${
                        maxWidthUnitTablet || 'px'
                    }`;
                }
                if ( typeof maxWidthMobile === 'number' ) {
                    style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${
                        maxWidthUnitMobile || 'px'
                    }`;
                }

                // Row gap via CSS variables.
                const hasRowGapDesktop = typeof rowGap === 'number';
                if ( hasRowGapDesktop ) {
                    style['--madeit-row-gap-desktop'] = `${ rowGap }${
                        rowGapUnit || 'px'
                    }`;
                    if ( typeof rowGapTablet === 'number' ) {
                        style['--madeit-row-gap-tablet'] = `${ rowGapTablet }${
                            rowGapUnitTablet || 'px'
                        }`;
                    }
                    if ( typeof rowGapMobile === 'number' ) {
                        style['--madeit-row-gap-mobile'] = `${ rowGapMobile }${
                            rowGapUnitMobile || 'px'
                        }`;
                    }
                }

                // Responsive flex-direction via CSS variables.
                style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
                if ( flexDirectionTablet ) {
                    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
                }
                if ( flexDirectionMobile ) {
                    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
                }

                style['--madeit-align-items-desktop'] = alignItems || 'stretch';
                if ( alignItemsTablet ) {
                    style['--madeit-align-items-tablet'] = alignItemsTablet;
                }
                if ( alignItemsMobile ) {
                    style['--madeit-align-items-mobile'] = alignItemsMobile;
                }

                style['--madeit-justify-content-desktop'] =
                    justifyContent || 'flex-start';
                if ( justifyContentTablet ) {
                    style['--madeit-justify-content-tablet'] = justifyContentTablet;
                }
                if ( justifyContentMobile ) {
                    style['--madeit-justify-content-mobile'] = justifyContentMobile;
                }

                style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
                if ( flexWrapTablet ) {
                    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
                }
                if ( flexWrapMobile ) {
                    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
                }

                if ( containerMargin?.top !== undefined ) {
                    style.marginTop = containerMargin.top;
                }
                if ( containerMargin?.bottom !== undefined ) {
                    style.marginBottom = containerMargin.bottom;
                }
                if ( containerMargin?.left !== undefined ) {
                    style.marginLeft = containerMargin.left;
                }
                if ( containerMargin?.right !== undefined ) {
                    style.marginRight = containerMargin.right;
                }
                if ( containerPadding?.top !== undefined ) {
                    style.paddingTop = containerPadding.top;
                }
                if ( containerPadding?.bottom !== undefined ) {
                    style.paddingBottom = containerPadding.bottom;
                }
                if ( containerPadding?.left !== undefined ) {
                    style.paddingLeft = containerPadding.left;
                }
                if ( containerPadding?.right !== undefined ) {
                    style.paddingRight = containerPadding.right;
                }

                let styleChild = {};
                if ( defaultSize === 'container-content-boxed' ) {
                    classesChild = classnames( classesChild, {
                        'has-text-color': rowTextColor !== undefined,
                        'has-background': rowBackgroundColor !== undefined,
                        [ rowBackgroundColorClass ]: rowBackgroundColor !== undefined,
                        [ rowTextColorClass ]: rowTextColor !== undefined,
                    } );

                    styleChild = {
                        backgroundColor: rowBackgroundColorClass
                            ? undefined
                            : customRowBackgroundColor,
                        color: rowTextColorClass
                            ? undefined
                            : customRowTextColor,
                    };

                    if ( rowMargin?.top !== undefined ) {
                        styleChild.marginTop = rowMargin.top;
                    }
                    if ( rowMargin?.bottom !== undefined ) {
                        styleChild.marginBottom = rowMargin.bottom;
                    }
                    if ( rowMargin?.left !== undefined ) {
                        styleChild.marginLeft = rowMargin.left;
                    }
                    if ( rowMargin?.right !== undefined ) {
                        styleChild.marginRight = rowMargin.right;
                    }
                    if ( rowPadding?.top !== undefined ) {
                        styleChild.paddingTop = rowPadding.top;
                    }
                    if ( rowPadding?.bottom !== undefined ) {
                        styleChild.paddingBottom = rowPadding.bottom;
                    }
                    if ( rowPadding?.left !== undefined ) {
                        styleChild.paddingLeft = rowPadding.left;
                    }
                    if ( rowPadding?.right !== undefined ) {
                        styleChild.paddingRight = rowPadding.right;
                    }
                } else {
                    style.color = rowTextColorClass ? undefined : customRowTextColor;
                }

                const blockProps = useBlockProps.save( {
                    className: classnames( classes, FRONTEND_WRAPPER_CLASS ),
                    style,
                } );

                const allowedHtmlTags = [
                    'div',
                    'section',
                    'article',
                    'main',
                    'header',
                    'footer',
                ];
                const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

                const dirDesktop = flexDirection || 'row';
                const dirTablet = flexDirectionTablet || undefined;
                const dirMobile = flexDirectionMobile || undefined;

                if ( size === 'container-content-boxed' ) {
                    return (
                        <HtmlTag { ...blockProps }>
                            <div
                                className={ `row madeit-container-row rows-${
                                    columnsCount || 0
                                }` }
                                data-madeit-dir={ dirDesktop }
                                data-madeit-dir-tablet={ dirTablet }
                                data-madeit-dir-mobile={ dirMobile }
                            >
                                <div className="col">
                                    <div className={ classesChild } style={ styleChild }>
                                        <div
                                            className={ `row madeit-container-row rows-${
                                                columnsCount || 0
                                            }` }
                                            data-madeit-dir={ dirDesktop }
                                            data-madeit-dir-tablet={ dirTablet }
                                            data-madeit-dir-mobile={ dirMobile }
                                        >
                                            { '\n\n' }
                                            <InnerBlocks.Content />
                                            { '\n\n' }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </HtmlTag>
                    );
                }

                const shouldWrapContent =
                    outerSizeNormalized !== 'container' &&
                    hasContentWidth &&
                    contentWidthNormalized !== outerSizeNormalized;

                if ( shouldWrapContent ) {
                    return (
                        <HtmlTag { ...blockProps }>
                            <div
                                className={ classnames( {
                                    container: contentWidthNormalized === 'container',
                                    'container-fluid':
                                        contentWidthNormalized === 'container-fluid',
                                } ) }
                            >
                                <div
                                    className={ `row madeit-container-row rows-${
                                        columnsCount || 0
                                    }` }
                                    data-madeit-dir={ dirDesktop }
                                    data-madeit-dir-tablet={ dirTablet }
                                    data-madeit-dir-mobile={ dirMobile }
                                >
                                    { '\n\n' }
                                    <InnerBlocks.Content />
                                    { '\n\n' }
                                </div>
                            </div>
                        </HtmlTag>
                    );
                }

                return (
                    <HtmlTag { ...blockProps }>
                        <div
                            className={ `row madeit-container-row rows-${
                                columnsCount || 0
                            }` }
                            data-madeit-dir={ dirDesktop }
                            data-madeit-dir-tablet={ dirTablet }
                            data-madeit-dir-mobile={ dirMobile }
                        >
                            { '\n\n' }
                            <InnerBlocks.Content />
                            { '\n\n' }
                        </div>
                    </HtmlTag>
                );
            },
        },
        {
            // Deprecated version (pre rowGap responsive vars):
            // Only the desktop row-gap var was serialized (tablet/mobile were ignored),
            // and the inner row wrapper contained newline whitespace.
            // Keep this to prevent "Try recovery" on existing content.
            save: function( props ) {
                const {
                    verticalAlignment,
                    backgroundType,
                    containerBackgroundColor,
                    customContainerBackgroundColor,
                    containerBackgroundImage,
                    containerBackgroundPosition,
                    containerBackgroundRepeat,
                    containerBackgroundSize,
                    size,
                    contentWidth,
                    rowBackgroundColor,
                    rowTextColor,
                    customRowBackgroundColor,
                    customRowTextColor,
                    containerMargin,
                    containerPadding,
                    rowMargin,
                    rowPadding,
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
                    // rowGapTablet/rowGapMobile existed as attributes but were not serialized.
                    columnsCount,
                    hideOnDesktop,
                    hideOnTablet,
                    hideOnMobile,
                } = props.attributes;

                const { className } = props;

                const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';

                const containerBackgroundColorClass = containerBackgroundColor
                    ? getColorClassName( 'background-color', containerBackgroundColor )
                    : undefined;
                const rowBackgroundColorClass = rowBackgroundColor
                    ? getColorClassName( 'background-color', rowBackgroundColor )
                    : undefined;
                const rowTextColorClass = rowTextColor
                    ? getColorClassName( 'color', rowTextColor )
                    : undefined;

                const computedBackgroundType =
                    backgroundType ||
                    ( containerBackgroundImage?.url ||
                    containerBackgroundColor ||
                    customContainerBackgroundColor
                        ? 'classic'
                        : 'transparent' );

                let classes = className;
                let classesChild = '';

                let defaultSize = size;
                if (
                    defaultSize !== 'container' &&
                    defaultSize !== 'container-fluid' &&
                    defaultSize !== 'container-content-boxed'
                ) {
                    defaultSize = 'container';
                }

                const outerSizeNormalized =
                    defaultSize === 'container' ? 'container' : 'container-fluid';
                const hasContentWidth =
                    typeof contentWidth === 'string' && contentWidth.length > 0;
                const contentWidthResolvedRaw = hasContentWidth
                    ? contentWidth
                    : defaultSize === 'container-content-boxed'
                        ? 'container'
                        : outerSizeNormalized;
                let contentWidthNormalized =
                    contentWidthResolvedRaw === 'container-fluid'
                        ? 'container-fluid'
                        : 'container';

                if ( outerSizeNormalized === 'container' ) {
                    contentWidthNormalized = 'container';
                }

                classes = classnames( classes, {
                    container: 'container' === defaultSize,
                    'container-fluid':
                        'container-fluid' === defaultSize ||
                        'container-content-boxed' === defaultSize,
                    'is-hidden-desktop': !! hideOnDesktop,
                    'is-hidden-tablet': !! hideOnTablet,
                    'is-hidden-mobile': !! hideOnMobile,
                } );

                if ( defaultSize !== 'container-content-boxed' ) {
                    classes = classnames( classes, {
                        [ `are-vertically-aligned-${ verticalAlignment }` ]:
                            verticalAlignment &&
                            defaultSize !== 'container-content-boxed',
                    } );
                }

                classesChild = classnames( classesChild, {
                    [ `are-vertically-aligned-${ verticalAlignment }` ]:
                        verticalAlignment &&
                        defaultSize === 'container-content-boxed',
                    container: contentWidthNormalized === 'container',
                    'container-fluid': contentWidthNormalized === 'container-fluid',
                } );

                classes = classnames( classes, {
                    'has-text-color': rowTextColorClass,
                    'has-background': containerBackgroundColorClass,
                    [ containerBackgroundColorClass ]: containerBackgroundColorClass,
                    [ rowTextColorClass ]: rowTextColorClass,
                    [ FRONTEND_WRAPPER_CLASS ]: true,
                } );

                const style = {
                    backgroundColor:
                        computedBackgroundType === 'transparent'
                            ? 'transparent'
                            : containerBackgroundColorClass
                                ? undefined
                                : customContainerBackgroundColor,
                };

                const computedContainerBackgroundPosition =
                    typeof containerBackgroundPosition === 'string' &&
                    containerBackgroundPosition.length > 0
                        ? containerBackgroundPosition
                        : 'center center';
                const computedContainerBackgroundRepeat =
                    typeof containerBackgroundRepeat === 'string' &&
                    containerBackgroundRepeat.length > 0
                        ? containerBackgroundRepeat
                        : 'no-repeat';
                const computedContainerBackgroundSize =
                    typeof containerBackgroundSize === 'string' &&
                    containerBackgroundSize.length > 0
                        ? containerBackgroundSize
                        : 'cover';

                if ( computedBackgroundType === 'classic' && containerBackgroundImage?.url ) {
                    style.backgroundImage = `url(${ containerBackgroundImage.url })`;
                    style.backgroundPosition = computedContainerBackgroundPosition;
                    style.backgroundRepeat = computedContainerBackgroundRepeat;
                    style.backgroundSize = computedContainerBackgroundSize;
                }

                // Historic: gradient support may not have been used here; keep compatible.
                if ( computedBackgroundType === 'gradient' ) {
                    const computedBackgroundGradient =
                        props.attributes?.containerBackgroundGradient || {
                            gradient: 'var(--wp--preset--gradient--color-and-background)',
                        };
                    if ( computedBackgroundGradient?.gradient ) {
                        style.backgroundImage = computedBackgroundGradient.gradient;
                    }
                }

                if ( overflow ) {
                    style.overflow = overflow;
                }

                if ( typeof minHeight === 'number' ) {
                    style['--madeit-min-height-desktop'] = `${ minHeight }${
                        minHeightUnit || 'px'
                    }`;
                }
                if ( typeof minHeightTablet === 'number' ) {
                    style['--madeit-min-height-tablet'] = `${ minHeightTablet }${
                        minHeightUnitTablet || 'px'
                    }`;
                }
                if ( typeof minHeightMobile === 'number' ) {
                    style['--madeit-min-height-mobile'] = `${ minHeightMobile }${
                        minHeightUnitMobile || 'px'
                    }`;
                }

                if ( typeof maxWidth === 'number' ) {
                    style['--madeit-max-width-desktop'] = `${ maxWidth }${
                        maxWidthUnit || 'px'
                    }`;
                }
                if ( typeof maxWidthTablet === 'number' ) {
                    style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${
                        maxWidthUnitTablet || 'px'
                    }`;
                }
                if ( typeof maxWidthMobile === 'number' ) {
                    style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${
                        maxWidthUnitMobile || 'px'
                    }`;
                }

                // Historic: only desktop row-gap was serialized.
                if ( typeof rowGap === 'number' ) {
                    style['--madeit-row-gap-desktop'] = `${ rowGap }${
                        rowGapUnit || 'px'
                    }`;
                }

                style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
                if ( flexDirectionTablet ) {
                    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
                }
                if ( flexDirectionMobile ) {
                    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
                }

                style['--madeit-align-items-desktop'] = alignItems || 'stretch';
                if ( alignItemsTablet ) {
                    style['--madeit-align-items-tablet'] = alignItemsTablet;
                }
                if ( alignItemsMobile ) {
                    style['--madeit-align-items-mobile'] = alignItemsMobile;
                }

                style['--madeit-justify-content-desktop'] =
                    justifyContent || 'flex-start';
                if ( justifyContentTablet ) {
                    style['--madeit-justify-content-tablet'] = justifyContentTablet;
                }
                if ( justifyContentMobile ) {
                    style['--madeit-justify-content-mobile'] = justifyContentMobile;
                }

                style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
                if ( flexWrapTablet ) {
                    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
                }
                if ( flexWrapMobile ) {
                    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
                }

                if ( containerMargin !== undefined && containerMargin.top !== undefined ) {
                    style.marginTop = containerMargin.top;
                }
                if (
                    containerMargin !== undefined &&
                    containerMargin.bottom !== undefined
                ) {
                    style.marginBottom = containerMargin.bottom;
                }
                if ( containerMargin !== undefined && containerMargin.left !== undefined ) {
                    style.marginLeft = containerMargin.left;
                }
                if ( containerMargin !== undefined && containerMargin.right !== undefined ) {
                    style.marginRight = containerMargin.right;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.top !== undefined
                ) {
                    style.paddingTop = containerPadding.top;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.bottom !== undefined
                ) {
                    style.paddingBottom = containerPadding.bottom;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.left !== undefined
                ) {
                    style.paddingLeft = containerPadding.left;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.right !== undefined
                ) {
                    style.paddingRight = containerPadding.right;
                }

                const shouldWrapContent =
                    outerSizeNormalized !== 'container' &&
                    hasContentWidth &&
                    contentWidthNormalized !== outerSizeNormalized;

                const HtmlTag = htmlTag || 'div';
                const blockProps = useBlockProps.save( {
                    className: classes,
                    style,
                } );

                const rowProps = {
                    className: `row madeit-container-row rows-${ columnsCount || 0 }`,
                    'data-madeit-dir': flexDirection || 'row',
                    'data-madeit-dir-tablet': flexDirectionTablet || undefined,
                    'data-madeit-dir-mobile': flexDirectionMobile || undefined,
                };

                if ( shouldWrapContent ) {
                    return (
                        <HtmlTag { ...blockProps }>
                            <div
                                className={ classnames( {
                                    container: contentWidthNormalized === 'container',
                                    'container-fluid':
                                        contentWidthNormalized === 'container-fluid',
                                } ) }
                            >
                                <div { ...rowProps }>
                                    <InnerBlocks.Content />
                                </div>
                            </div>
                        </HtmlTag>
                    );
                }

                return (
                    <HtmlTag { ...blockProps }>
                        <div { ...rowProps }>
                            <InnerBlocks.Content />
                        </div>
                    </HtmlTag>
                );
            },
        },
        {
            // Deprecated version (2026-02): matched a save() that always serialized
            // `background-color: transparent` when no explicit background was set.
            // Keeping this prevents "This block contains unexpected or invalid content"
            // for content saved during that period.
            save: function( props ) {
                const {
                    verticalAlignment,
                    backgroundType,
                    containerBackgroundColor,
                    customContainerBackgroundColor,
                    containerBackgroundImage,
                    containerBackgroundPosition,
                    containerBackgroundRepeat,
                    containerBackgroundSize,
                    size,
                    contentWidth,
                    rowBackgroundColor,
                    rowTextColor,
                    customRowBackgroundColor,
                    customRowTextColor,
                    containerMargin,
                    containerPadding,
                    rowMargin,
                    rowPadding,
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
                    hideOnDesktop,
                    hideOnTablet,
                    hideOnMobile,
                } = props.attributes;

                const { className } = props;

                const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';

                const containerBackgroundColorClass = containerBackgroundColor
                    ? getColorClassName( 'background-color', containerBackgroundColor )
                    : undefined;
                const rowBackgroundColorClass = rowBackgroundColor
                    ? getColorClassName( 'background-color', rowBackgroundColor )
                    : undefined;
                const rowTextColorClass = rowTextColor
                    ? getColorClassName( 'color', rowTextColor )
                    : undefined;

                const computedBackgroundType =
                    backgroundType ||
                    ( containerBackgroundImage?.url ||
                    containerBackgroundColor ||
                    customContainerBackgroundColor
                        ? 'classic'
                        : 'transparent' );

                var classes = className;
                var classesChild = '';

                var defaultSize = size;
                if (
                    defaultSize !== 'container' &&
                    defaultSize !== 'container-fluid' &&
                    defaultSize !== 'container-content-boxed'
                ) {
                    defaultSize = 'container';
                }

                const outerSizeNormalized =
                    defaultSize === 'container' ? 'container' : 'container-fluid';
                const hasContentWidth =
                    typeof contentWidth === 'string' && contentWidth.length > 0;
                const contentWidthResolvedRaw = hasContentWidth
                    ? contentWidth
                    : defaultSize === 'container-content-boxed'
                        ? 'container'
                        : outerSizeNormalized;
                let contentWidthNormalized =
                    contentWidthResolvedRaw === 'container-fluid'
                        ? 'container-fluid'
                        : 'container';

                if ( outerSizeNormalized === 'container' ) {
                    contentWidthNormalized = 'container';
                }

                classes = classnames( classes, {
                    [ `container` ]: 'container' === defaultSize,
                    [ `container-fluid` ]:
                        'container-fluid' === defaultSize ||
                        'container-content-boxed' === defaultSize,
                    [ `is-hidden-desktop` ]: !! hideOnDesktop,
                    [ `is-hidden-tablet` ]: !! hideOnTablet,
                    [ `is-hidden-mobile` ]: !! hideOnMobile,
                } );

                if ( defaultSize !== 'container-content-boxed' ) {
                    classes = classnames( classes, {
                        [ `are-vertically-aligned-${ verticalAlignment }` ]:
                            verticalAlignment &&
                            defaultSize !== 'container-content-boxed',
                    } );
                }

                classesChild = classnames( classesChild, {
                    [ `are-vertically-aligned-${ verticalAlignment }` ]:
                        verticalAlignment &&
                        defaultSize === 'container-content-boxed',
                    [ `container` ]: contentWidthNormalized === 'container',
                    [ `container-fluid` ]: contentWidthNormalized === 'container-fluid',
                } );

                classes = classnames( classes, {
                    'has-text-color': rowTextColorClass,
                    'has-background': containerBackgroundColorClass,
                    [ containerBackgroundColorClass ]: containerBackgroundColorClass,
                    [ rowTextColorClass ]: rowTextColorClass,
                } );

                var style = {
                    backgroundColor:
                        computedBackgroundType === 'transparent'
                            ? 'transparent'
                            : containerBackgroundColorClass
                                ? undefined
                                : customContainerBackgroundColor,
                };

                const computedContainerBackgroundPosition =
                    typeof containerBackgroundPosition === 'string' &&
                    containerBackgroundPosition.length > 0
                        ? containerBackgroundPosition
                        : 'center center';
                const computedContainerBackgroundRepeat =
                    typeof containerBackgroundRepeat === 'string' &&
                    containerBackgroundRepeat.length > 0
                        ? containerBackgroundRepeat
                        : 'no-repeat';
                const computedContainerBackgroundSize =
                    typeof containerBackgroundSize === 'string' &&
                    containerBackgroundSize.length > 0
                        ? containerBackgroundSize
                        : 'cover';

                const computedBackgroundGradient =
                    props.attributes?.containerBackgroundGradient || {
                        gradient: 'var(--wp--preset--gradient--color-and-background)',
                    };
                if ( computedBackgroundType === 'classic' && containerBackgroundImage?.url ) {
                    style.backgroundImage = `url(${ containerBackgroundImage.url })`;
                    style.backgroundPosition = computedContainerBackgroundPosition;
                    style.backgroundRepeat = computedContainerBackgroundRepeat;
                    style.backgroundSize = computedContainerBackgroundSize;
                }

                if ( computedBackgroundType === 'gradient' ) {
                    style.backgroundImage = computedBackgroundGradient.gradient;
                }

                if ( overflow ) {
                    style.overflow = overflow;
                }

                if ( typeof minHeight === 'number' ) {
                    style['--madeit-min-height-desktop'] = `${ minHeight }${
                        minHeightUnit || 'px'
                    }`;
                }
                if ( typeof minHeightTablet === 'number' ) {
                    style['--madeit-min-height-tablet'] = `${ minHeightTablet }${
                        minHeightUnitTablet || 'px'
                    }`;
                }
                if ( typeof minHeightMobile === 'number' ) {
                    style['--madeit-min-height-mobile'] = `${ minHeightMobile }${
                        minHeightUnitMobile || 'px'
                    }`;
                }

                if ( typeof maxWidth === 'number' ) {
                    style['--madeit-max-width-desktop'] = `${ maxWidth }${
                        maxWidthUnit || 'px'
                    }`;
                }
                if ( typeof maxWidthTablet === 'number' ) {
                    style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${
                        maxWidthUnitTablet || 'px'
                    }`;
                }
                if ( typeof maxWidthMobile === 'number' ) {
                    style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${
                        maxWidthUnitMobile || 'px'
                    }`;
                }

                if ( typeof rowGap === 'number' ) {
                    style['--madeit-row-gap-desktop'] = `${ rowGap }${
                        rowGapUnit || 'px'
                    }`;
                }
                if ( typeof rowGapTablet === 'number' ) {
                    style['--madeit-row-gap-tablet'] = `${ rowGapTablet }${
                        rowGapUnitTablet || 'px'
                    }`;
                }
                if ( typeof rowGapMobile === 'number' ) {
                    style['--madeit-row-gap-mobile'] = `${ rowGapMobile }${
                        rowGapUnitMobile || 'px'
                    }`;
                }

                style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
                if ( flexDirectionTablet ) {
                    style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
                }
                if ( flexDirectionMobile ) {
                    style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
                }

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

                style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';
                if ( flexWrapTablet ) {
                    style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
                }
                if ( flexWrapMobile ) {
                    style['--madeit-flex-wrap-mobile'] = flexWrapMobile;
                }

                if ( containerMargin !== undefined && containerMargin.top !== undefined ) {
                    style.marginTop = containerMargin.top;
                }
                if (
                    containerMargin !== undefined &&
                    containerMargin.bottom !== undefined
                ) {
                    style.marginBottom = containerMargin.bottom;
                }
                if ( containerMargin !== undefined && containerMargin.left !== undefined ) {
                    style.marginLeft = containerMargin.left;
                }
                if ( containerMargin !== undefined && containerMargin.right !== undefined ) {
                    style.marginRight = containerMargin.right;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.top !== undefined
                ) {
                    style.paddingTop = containerPadding.top;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.bottom !== undefined
                ) {
                    style.paddingBottom = containerPadding.bottom;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.left !== undefined
                ) {
                    style.paddingLeft = containerPadding.left;
                }
                if (
                    containerPadding !== undefined &&
                    containerPadding.right !== undefined
                ) {
                    style.paddingRight = containerPadding.right;
                }

                var styleChild = {};
                if ( defaultSize === 'container-content-boxed' ) {
                    classesChild = classnames( classesChild, {
                        'has-text-color': rowTextColor !== undefined,
                        'has-background': rowBackgroundColor !== undefined,
                        [ rowBackgroundColorClass ]: rowBackgroundColor !== undefined,
                        [ rowTextColorClass ]: rowTextColor !== undefined,
                    } );

                    styleChild = {
                        backgroundColor: rowBackgroundColorClass
                            ? undefined
                            : rowBackgroundColor,
                        color: rowTextColorClass ? undefined : rowTextColorClass,
                    };

                    if ( rowMargin !== undefined && rowMargin.top !== undefined ) {
                        styleChild.marginTop = rowMargin.top;
                    }
                    if (
                        rowMargin !== undefined &&
                        rowMargin.bottom !== undefined
                    ) {
                        styleChild.marginBottom = rowMargin.bottom;
                    }
                    if ( rowMargin !== undefined && rowMargin.left !== undefined ) {
                        styleChild.marginLeft = rowMargin.left;
                    }
                    if ( rowMargin !== undefined && rowMargin.right !== undefined ) {
                        styleChild.marginRight = rowMargin.right;
                    }
                    if ( rowPadding !== undefined && rowPadding.top !== undefined ) {
                        styleChild.paddingTop = rowPadding.top;
                    }
                    if (
                        rowPadding !== undefined &&
                        rowPadding.bottom !== undefined
                    ) {
                        styleChild.paddingBottom = rowPadding.bottom;
                    }
                    if (
                        rowPadding !== undefined &&
                        rowPadding.left !== undefined
                    ) {
                        styleChild.paddingLeft = rowPadding.left;
                    }
                    if (
                        rowPadding !== undefined &&
                        rowPadding.right !== undefined
                    ) {
                        styleChild.paddingRight = rowPadding.right;
                    }
                } else {
                    style.color = rowTextColorClass ? undefined : rowTextColorClass;
                }

                const blockProps = useBlockProps.save( {
                    className: classnames( classes, FRONTEND_WRAPPER_CLASS ),
                    style: style,
                } );

                const allowedHtmlTags = [
                    'div',
                    'section',
                    'article',
                    'main',
                    'header',
                    'footer',
                ];
                const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

                const dirDesktop = flexDirection || 'row';
                const dirTablet = flexDirectionTablet || undefined;
                const dirMobile = flexDirectionMobile || undefined;

                if ( size === 'container-content-boxed' ) {
                    return (
                        <HtmlTag { ...blockProps }>
                            <div
                                className={ `row madeit-container-row rows-${
                                    columnsCount || 0
                                }` }
                                data-madeit-dir={ dirDesktop }
                                data-madeit-dir-tablet={ dirTablet }
                                data-madeit-dir-mobile={ dirMobile }
                            >
                                <div className="col">
                                    <div className={ classesChild } style={ styleChild }>
                                        <div
                                            className={ `row madeit-container-row rows-${
                                                columnsCount || 0
                                            }` }
                                            data-madeit-dir={ dirDesktop }
                                            data-madeit-dir-tablet={ dirTablet }
                                            data-madeit-dir-mobile={ dirMobile }
                                        >
                                            <InnerBlocks.Content />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </HtmlTag>
                    );
                }

                const shouldWrapContent =
                    outerSizeNormalized !== 'container' &&
                    hasContentWidth &&
                    contentWidthNormalized !== outerSizeNormalized;

                if ( shouldWrapContent ) {
                    return (
                        <HtmlTag { ...blockProps }>
                            <div
                                className={ classnames( {
                                    container: contentWidthNormalized === 'container',
                                    'container-fluid':
                                        contentWidthNormalized === 'container-fluid',
                                } ) }
                            >
                                <div
                                    className={ `row madeit-container-row rows-${
                                        columnsCount || 0
                                    }` }
                                    data-madeit-dir={ dirDesktop }
                                    data-madeit-dir-tablet={ dirTablet }
                                    data-madeit-dir-mobile={ dirMobile }
                                >
                                    <InnerBlocks.Content />
                                </div>
                            </div>
                        </HtmlTag>
                    );
                }

                return (
                    <HtmlTag { ...blockProps }>
                        <div
                            className={ `row madeit-container-row rows-${
                                columnsCount || 0
                            }` }
                            data-madeit-dir={ dirDesktop }
                            data-madeit-dir-tablet={ dirTablet }
                            data-madeit-dir-mobile={ dirMobile }
                        >
                            <InnerBlocks.Content />
                        </div>
                    </HtmlTag>
                );
            },
        },
        {
            /**
             * Deprecated version (2026-02)
             */
            save: saveV1,
        },
        {
            supports: {
                html: false,
            },

            attributes: {
                verticalAlignment: {
                    type: "string"
                },
                containerBackgroundColor: {
                    type: 'string',
                },
                customContainerBackgroundColor: {
                    type: 'string',
                },
                size: {
                    type: 'string',
                    default: 'container',
                },
                containerMarginBottom: {
                    type: 'number',
                    default: 0
                },
                containerMarginTop: {
                    type: 'number',
                    default: 0
                },
                containerMarginLeft: {
                    type: 'number',
                    default: 0
                },
                containerMarginRight: {
                    type: 'number',
                    default: 0
                },
                containerPaddingTop: {
                    type: 'number',
                    default: 0
                },
                containerPaddingBottom: {
                    type: 'number',
                    default: 0
                },
                containerPaddingLeft: {
                    type: 'number',
                    default: 0
                },
                containerPaddingRight: {
                    type: 'number',
                    default: 0
                },
                rowBackgroundColor: {
                    type: 'string',
                },
                customRowBackgroundColor: {
                    type: 'string',
                },
                rowTextColor: {
                    type: 'string',
                },
                customRowTextColor: {
                    type: 'string',
                },
                rowMarginBottom: {
                    type: 'number',
                    default: 0
                },
                rowMarginTop: {
                    type: 'number',
                    default: 0
                },
                rowMarginLeft: {
                    type: 'number',
                    default: 0
                },
                rowMarginRight: {
                    type: 'number',
                    default: 0
                },
                rowPaddingTop: {
                    type: 'number',
                    default: 0
                },
                rowPaddingBottom: {
                    type: 'number',
                    default: 0
                },
                rowPaddingLeft: {
                    type: 'number',
                    default: 0
                },
                rowPaddingRight: {
                    type: 'number',
                    default: 0
                },
            },

            migrate( attributes ) {
                return {
                    containerPadding: {
                        top: attributes.containerPaddingTop !== null && attributes.containerPaddingTop !== undefined ? (attributes.containerPaddingTop + 'px') : undefined,
                        bottom: attributes.containerPaddingBottom !== null && attributes.containerPaddingBottom !== undefined ? (attributes.containerPaddingBottom + 'px') : undefined,
                        left: attributes.containerPaddingLeft !== null && attributes.containerPaddingLeft !== undefined ? (attributes.containerPaddingLeft + 'px') : undefined,
                        right: attributes.containerPaddingRight !== null && attributes.containerPaddingRight !== undefined ? (attributes.containerPaddingRight + 'px') : undefined,
                    },
                    containerMargin: {
                        top: attributes.containerMarginTop !== null && attributes.containerMarginTop !== undefined ? (attributes.containerMarginTop + 'px') : undefined,
                        bottom: attributes.containerMarginBottom !== null && attributes.containerMarginBottom !== undefined ? (attributes.containerMarginBottom + 'px') : undefined,
                        left: attributes.containerMarginLeft !== null && attributes.containerMarginLeft !== undefined ? (attributes.containerMarginLeft + 'px') : undefined,
                        right: attributes.containerMarginRight !== null && attributes.containerMarginRight !== undefined ? (attributes.containerMarginRight + 'px') : undefined,
                    },
                    rowPadding: {
                        top: attributes.rowPaddingTop !== null && attributes.rowPaddingTop !== undefined ? (attributes.rowPaddingTop + 'px') : undefined,
                        bottom: attributes.rowPaddingBottom !== null && attributes.rowPaddingBottom !== undefined ? (attributes.rowPaddingBottom + 'px') : undefined,
                        left: attributes.rowPaddingLeft !== null && attributes.rowPaddingLeft !== undefined ? (attributes.rowPaddingLeft + 'px') : undefined,
                        right: attributes.rowPaddingRight !== null && attributes.rowPaddingRight !== undefined ? (attributes.rowPaddingRight + 'px') : undefined,
                    },
                    rowMargin: {
                        top: attributes.rowMarginTop !== null && attributes.rowMarginTop !== undefined ? (attributes.rowMarginTop + 'px') : undefined,
                        bottom: attributes.rowMarginBottom !== null && attributes.rowMarginBottom !== undefined ? (attributes.rowMarginBottom + 'px') : undefined,
                        left: attributes.rowMarginLeft !== null && attributes.rowMarginLeft !== undefined ? (attributes.rowMarginLeft + 'px') : undefined,
                        right: attributes.rowMarginRight !== null && attributes.rowMarginRight !== undefined ? (attributes.rowMarginRight + 'px') : undefined,
                    },
                    size: attributes.size,
                    verticalAlignment: attributes.verticalAlignment,
                    containerBackgroundColor: attributes.containerBackgroundColor,
                    customContainerBackgroundColor: attributes.customContainerBackgroundColor
                };
            },

            save: function( props ) {
                const {
                    verticalAlignment,
                    containerBackgroundColor,
                    customContainerBackgroundColor,
                    size,
                    containerMarginTop,
                    containerMarginBottom,
                    containerMarginLeft,
                    containerMarginRight,
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
                    rowMarginLeft,
                    rowMarginRight,
                    rowBackgroundColor,
                    rowTextColor,
                    customRowBackgroundColor,
                    customRowTextColor,
                } = props.attributes;
                
                const {
                    className
                } = props
                
                const containerBackgroundColorClass = containerBackgroundColor ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;
                const rowBackgroundColorClass = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
                const rowTextColorClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;
                
                var classes = className;
                var classesChild = '';
                
                classes = classnames( classes, {
                    [ `container` ]: 'container' === size,
                    [ `container-fluid` ]: 'container-fluid' === size || 'container-content-boxed' === size,
                } );
                
                if(size !== 'container-content-boxed') {
                    classes = classnames( classes, {
                        [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && size !== 'container-content-boxed',
                    } );
                }
                
                classesChild = classnames( classesChild, {
                    [ `are-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment && size === 'container-content-boxed',
                    [ `container` ]: 'container' === size || 'container-content-boxed' === size,
                    [ `container-fluid` ]: 'container-fluid' === size,
                } );
                
                classes = classnames(classes, {
                    'has-text-color': rowTextColorClass,
                    'has-background': containerBackgroundColorClass,
                    [ containerBackgroundColorClass ]: containerBackgroundColorClass,
                    [ rowTextColorClass ]: rowTextColorClass,
                } );
                
                var style = {
                    backgroundColor: containerBackgroundColorClass ? undefined : customContainerBackgroundColor,
                };
                
                if(containerMarginTop > 0) {
                    style.marginTop = containerMarginTop + 'px';
                }
                if(containerMarginBottom > 0) {
                    style.marginBottom = containerMarginBottom + 'px';
                }
                if(containerMarginLeft > 0) {
                    style.marginLeft = containerMarginLeft + 'px';
                }
                if(containerMarginRight > 0) {
                    style.marginRight = containerMarginRight + 'px';
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
                    classesChild = classnames(classesChild, {
                        'has-text-color': rowTextColor !== undefined,
                        'has-background': rowBackgroundColor !== undefined,
                        [ rowBackgroundColorClass ]: rowBackgroundColor !== undefined,
                        [ rowTextColorClass ]: rowTextColor !== undefined,
                    } );
                    
                    styleChild = {
                        backgroundColor: rowBackgroundColorClass ? undefined : rowBackgroundColor,
                        color: rowTextColorClass ? undefined : rowTextColorClass
                    };
                    
                    if(rowMarginTop > 0) {
                        styleChild.marginTop = rowMarginTop + 'px';
                    }
                    if(rowMarginBottom > 0) {
                        styleChild.marginBottom = rowMarginBottom + 'px';
                    }
                    if(rowMarginLeft > 0) {
                        styleChild.marginLeft = rowMarginLeft + 'px';
                    }
                    if(rowMarginRight > 0) {
                        styleChild.marginRight = rowMarginRight + 'px';
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
                    style.color = rowTextColorClass ? undefined : rowTextColorClass;
                }
                
                const blockProps = useBlockProps.save( {
                    className: classes,
                    style: style,
                });
                
                if(size === 'container-content-boxed') {
                    return (
                        <div { ...blockProps }>
                            <div className="row">
                                <div className="col">
                                    <div className={ classesChild }
                                        style = {styleChild}>
                                        <div className="row">
                                            <InnerBlocks.Content />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                else {
                    return (
                        <div { ...blockProps }>
                            <div class="row">
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                }
            },
        },
    ],
} );

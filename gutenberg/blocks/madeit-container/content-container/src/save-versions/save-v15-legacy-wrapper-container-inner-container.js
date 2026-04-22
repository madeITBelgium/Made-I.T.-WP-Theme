import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Deprecated legacy variant:
 * - Outer wrapper is `.container` (not container-fluid)
 * - Wrapper includes `madeit-block-content--frontend`
 * - Content is wrapped in an inner `.container`
 * - Inner wrapper is `.row.madeit-container-row...` (no `.col` wrapper)
 *
 * This exists purely for block validation compatibility.
 */
export default function saveV15LegacyWrapperContainerInnerContainer( props ) {
    const {
        htmlTag,
        flexDirection,
        flexDirectionTablet,
        flexDirectionMobile,
        alignItems,
        justifyContent,
        flexWrap,
        maxWidth,
        maxWidthUnit,
        maxWidthTablet,
        maxWidthUnitTablet,
        maxWidthMobile,
        maxWidthUnitMobile,
        columnsCount,
        wrapperClassName,
        containerMargin,
        containerPadding,
        containerPaddingOnRow,
    } = props.attributes;

    const allowedHtmlTags = [
        'div',
        'section',
        'article',
        'main',
        'header',
        'footer',
    ];
    const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

    const wrapperClassNameFromMarkup =
        typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0
            ? wrapperClassName
            : 'wp-block-madeit-block-content container madeit-block-content--frontend';

    const rowProps = {
        className: `row madeit-container-row rows-${ columnsCount || 0 }`,
        'data-madeit-dir': flexDirection || 'row',
        'data-madeit-dir-tablet':
            typeof flexDirectionTablet === 'string' && flexDirectionTablet.length > 0
                ? flexDirectionTablet
                : undefined,
        'data-madeit-dir-mobile':
            typeof flexDirectionMobile === 'string' && flexDirectionMobile.length > 0
                ? flexDirectionMobile
                : undefined,
    };

    // Legacy versions serialized some layout vars and wrapper spacing inline.
    // Only emit style keys that exist to avoid introducing new attributes.
    const style = {};

    const shouldApplyContainerPaddingOnRow = containerPaddingOnRow === true;

    // Match current save() rules for stability:
    // Only serialize layout vars when they differ from defaults.
    if ( typeof alignItems === 'string' && alignItems.length > 0 && alignItems !== 'stretch' ) {
        style['--madeit-align-items-desktop'] = alignItems;
    }
    if ( typeof justifyContent === 'string' && justifyContent.length > 0 && justifyContent !== 'flex-start' ) {
        style['--madeit-justify-content-desktop'] = justifyContent;
    }
    if ( typeof flexWrap === 'string' && flexWrap.length > 0 && flexWrap !== 'nowrap' ) {
        style['--madeit-flex-wrap-desktop'] = flexWrap;
    }

    // Responsive max-width via CSS variables.
    if ( typeof maxWidth === 'number' ) {
        style['--madeit-max-width-desktop'] = `${ maxWidth }${ maxWidthUnit || 'px' }`;
    }
    if ( typeof maxWidthTablet === 'number' ) {
        style['--madeit-max-width-tablet'] = `${ maxWidthTablet }${ maxWidthUnitTablet || 'px' }`;
    }
    if ( typeof maxWidthMobile === 'number' ) {
        style['--madeit-max-width-mobile'] = `${ maxWidthMobile }${ maxWidthUnitMobile || 'px' }`;
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

    if ( ! shouldApplyContainerPaddingOnRow ) {
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
    }

    const wrapperStyle = Object.keys( style ).length > 0 ? style : undefined;

    // When `containerPaddingOnRow` was enabled, desktop padding was serialized on the row.
    // (This matches the stored markup shown in the validation warning.)
    if ( shouldApplyContainerPaddingOnRow && containerPadding && typeof containerPadding === 'object' ) {
        const rowStyle = {};
        if ( containerPadding.top !== undefined ) rowStyle.paddingTop = containerPadding.top;
        if ( containerPadding.right !== undefined ) rowStyle.paddingRight = containerPadding.right;
        if ( containerPadding.bottom !== undefined ) rowStyle.paddingBottom = containerPadding.bottom;
        if ( containerPadding.left !== undefined ) rowStyle.paddingLeft = containerPadding.left;

        if ( Object.keys( rowStyle ).length > 0 ) {
            rowProps.style = rowStyle;
        }
    }

    return (
        <HtmlTag className={ wrapperClassNameFromMarkup } style={ wrapperStyle }>
            <div className="container">
                <div { ...rowProps }>
                    { '\n\n' }
                    <InnerBlocks.Content />
                    { '\n\n' }
                </div>
            </div>
        </HtmlTag>
    );
}

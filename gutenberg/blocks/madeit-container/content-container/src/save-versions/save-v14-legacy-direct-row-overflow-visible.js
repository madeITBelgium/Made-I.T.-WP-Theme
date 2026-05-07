import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Deprecated legacy variant:
 * - Wrapper is `container` (not container-fluid)
 * - Direct `.row.madeit-container-row` child (no inner container wrappers)
 * - Serializes `overflow: visible` inline
 * - Serializes default flex vars inline
 *
 * This exists purely for block validation compatibility.
 */
export default function saveV14LegacyDirectRowOverflowVisible( props ) {
    const {
        verticalAlignment,
        containerMargin,
        containerPadding,
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
        columnsCount,
        hideOnDesktop,
        hideOnTablet,
        hideOnMobile,
    } = props.attributes;

    // For validation we want to mirror the saved markup as closely as possible.
    // When available, use the wrapper/row classnames that were parsed from the
    // stored HTML (attribute sources in block.json).
    const wrapperClassNameFromMarkup =
        typeof props?.attributes?.wrapperClassName === 'string'
            ? props.attributes.wrapperClassName
            : '';
    const directRowClassNameFromMarkup =
        typeof props?.attributes?.directRowClassName === 'string'
            ? props.attributes.directRowClassName
            : '';

    const hasWrapperClassNameFromMarkup =
        wrapperClassNameFromMarkup.trim().length > 0;

    // Fallback if parser couldn't provide wrapperClassName.
    const FRONTEND_WRAPPER_CLASS = 'madeit-block-content--frontend';
    let wrapperClassName = hasWrapperClassNameFromMarkup
        ? wrapperClassNameFromMarkup
        : `wp-block-madeit-block-content container ${ FRONTEND_WRAPPER_CLASS }`;

    // Normalize structural tokens without changing overall intent.
    // (This variant is specifically for `.container` wrappers.)
    if ( wrapperClassName.includes( 'container-fluid' ) ) {
        wrapperClassName = wrapperClassName
            .split( /\s+/ )
            .filter( ( token ) => token && token !== 'container-fluid' )
            .join( ' ' );
    }
    if ( ! wrapperClassName.split( /\s+/ ).includes( 'container' ) ) {
        wrapperClassName = `${ wrapperClassName } container`;
    }
    if ( ! wrapperClassName.split( /\s+/ ).includes( FRONTEND_WRAPPER_CLASS ) ) {
        wrapperClassName = `${ wrapperClassName } ${ FRONTEND_WRAPPER_CLASS }`;
    }

    // Add optional classes (only if they exist in attributes; legacy content can have them).
    if ( verticalAlignment ) {
        wrapperClassName = `${ wrapperClassName } are-vertically-aligned-${ verticalAlignment }`;
    }
    if ( hideOnDesktop ) {
        wrapperClassName = `${ wrapperClassName } is-hidden-desktop`;
    }
    if ( hideOnTablet ) {
        wrapperClassName = `${ wrapperClassName } is-hidden-tablet`;
    }
    if ( hideOnMobile ) {
        wrapperClassName = `${ wrapperClassName } is-hidden-mobile`;
    }

    // Style key ordering matters for validation.
    const style = {};

    // Always serialize overflow (legacy always had it, even when visible).
    style.overflow =
        typeof overflow === 'string' && overflow.length > 0 ? overflow : 'visible';

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
            minHeightUnitMobile || minHeightUnitTablet || minHeightUnit || 'px'
        }`;
    }

    // Legacy: desktop vars were serialized even when they matched defaults.
    style['--madeit-flex-direction-desktop'] = flexDirection || 'row';
    style['--madeit-align-items-desktop'] = alignItems || 'stretch';
    style['--madeit-justify-content-desktop'] = justifyContent || 'flex-start';
    style['--madeit-flex-wrap-desktop'] = flexWrap || 'nowrap';

    // Legacy: tablet/mobile vars were typically omitted when they were default.
    if ( flexDirectionTablet && flexDirectionTablet !== 'column' ) {
        style['--madeit-flex-direction-tablet'] = flexDirectionTablet;
    }
    if ( flexDirectionMobile && flexDirectionMobile !== 'column' ) {
        style['--madeit-flex-direction-mobile'] = flexDirectionMobile;
    }

    if ( alignItemsTablet && alignItemsTablet !== 'stretch' ) {
        style['--madeit-align-items-tablet'] = alignItemsTablet;
    }
    if ( alignItemsMobile && alignItemsMobile !== 'stretch' ) {
        style['--madeit-align-items-mobile'] = alignItemsMobile;
    }

    if ( justifyContentTablet && justifyContentTablet !== 'flex-start' ) {
        style['--madeit-justify-content-tablet'] = justifyContentTablet;
    }
    if ( justifyContentMobile && justifyContentMobile !== 'flex-start' ) {
        style['--madeit-justify-content-mobile'] = justifyContentMobile;
    }

    if ( flexWrapTablet && flexWrapTablet !== 'nowrap' ) {
        style['--madeit-flex-wrap-tablet'] = flexWrapTablet;
    }
    if ( flexWrapMobile && flexWrapMobile !== 'nowrap' ) {
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

    const allowedHtmlTags = [
        'div',
        'section',
        'article',
        'main',
        'header',
        'footer',
    ];
    const HtmlTag = allowedHtmlTags.includes( htmlTag ) ? htmlTag : 'div';

    const rowClassName =
        directRowClassNameFromMarkup.trim().length > 0
            ? directRowClassNameFromMarkup
            : `row madeit-container-row rows-${ columnsCount || 0 }`;
    const rowProps = {
        className: rowClassName,
        // Legacy saved markup included only the desktop dir attribute.
        'data-madeit-dir': flexDirection || 'row',
    };

    return (
        <HtmlTag className={ wrapperClassName } style={ style }>
            <div { ...rowProps }>
                <InnerBlocks.Content />
            </div>
        </HtmlTag>
    );
}

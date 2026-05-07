import classnames from 'classnames';

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Deprecated (very old markup):
 * - No `madeit-block-content--frontend` class on the wrapper
 * - Inner wrapper was a plain `.row` (no `madeit-container-row`, no data attrs)
 */
export default function saveV8VeryOldMarkupPlainRow( props ) {
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
    if ( containerMargin !== undefined && containerMargin.bottom !== undefined ) {
        style.marginBottom = containerMargin.bottom;
    }
    if ( containerMargin !== undefined && containerMargin.left !== undefined ) {
        style.marginLeft = containerMargin.left;
    }
    if ( containerMargin !== undefined && containerMargin.right !== undefined ) {
        style.marginRight = containerMargin.right;
    }
    if ( containerPadding !== undefined && containerPadding.top !== undefined ) {
        style.paddingTop = containerPadding.top;
    }
    if (
        containerPadding !== undefined &&
        containerPadding.bottom !== undefined
    ) {
        style.paddingBottom = containerPadding.bottom;
    }
    if ( containerPadding !== undefined && containerPadding.left !== undefined ) {
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
}

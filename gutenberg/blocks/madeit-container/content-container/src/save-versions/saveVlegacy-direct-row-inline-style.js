/**
 * saveVlegacy-direct-row-inline-style.js — madeit-block-content
 *
 * Legacy markup:
 * - Direct .row child (no inner container)
 * - Inline margin styles on the wrapper (no CSS vars for margins)
 */

import classnames from 'classnames';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const ALLOWED_HTML_TAGS = [ 'div', 'section', 'article', 'main', 'header', 'footer' ];

function parseInlineStyle( styleText ) {
    if ( typeof styleText !== 'string' || ! styleText.trim() ) return undefined;
    const style = {};
    const parts = styleText.split( ';' );
    for ( const part of parts ) {
        const trimmed = part.trim();
        if ( ! trimmed ) continue;
        const idx = trimmed.indexOf( ':' );
        if ( idx === -1 ) continue;
        const rawProp = trimmed.slice( 0, idx ).trim();
        const rawVal = trimmed.slice( idx + 1 ).trim();
        if ( ! rawProp || ! rawVal ) continue;
        const prop = rawProp.startsWith( '--' )
            ? rawProp
            : rawProp.replace( /-([a-z])/g, ( _m, c ) => c.toUpperCase() );
        style[ prop ] = rawVal;
    }
    return Object.keys( style ).length > 0 ? style : undefined;
}

export default function saveVlegacyDirectRowInlineStyle( props ) {
    const { attributes, className } = props;
    const {
        wrapperClassName,
        wrapperStyle,
        directRowClassName,
        flexDirection,
        flexDirectionTablet,
        flexDirectionMobile,
        columnsCount,
        htmlTag,
    } = attributes;

    const HtmlTag = ALLOWED_HTML_TAGS.includes( htmlTag ) ? htmlTag : 'div';
    const rowsCount = Number.isFinite( columnsCount ) ? columnsCount : 0;
    const rowClassName = typeof directRowClassName === 'string' && directRowClassName.trim()
        ? directRowClassName.trim()
        : `row madeit-container-row rows-${ rowsCount }`;

    const wrapperClass = typeof wrapperClassName === 'string' && wrapperClassName.trim()
        ? wrapperClassName.trim()
        : classnames( 'wp-block-madeit-block-content', 'container-fluid' );

    const style = parseInlineStyle( wrapperStyle );

    const rowProps = {
        className: rowClassName,
        'data-madeit-dir': flexDirection || 'row',
        'data-madeit-dir-tablet': flexDirectionTablet || undefined,
        'data-madeit-dir-mobile': flexDirectionMobile || undefined,
    };

    const blockProps = useBlockProps.save( {
        className: wrapperClass,
        style,
    } );
    blockProps.className = wrapperClass;

    return (
        <HtmlTag { ...blockProps }>
            <div { ...rowProps }>
                { '\n\n' }
                <InnerBlocks.Content />
                { '\n\n' }
            </div>
        </HtmlTag>
    );
}

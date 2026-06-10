/**
 * save-legacy-boxed-inline-wrapper.js — madeit-block-content
 *
 * Legacy boxed markup:
 * - Wrapper has inline spacing styles (margin/padding)
 * - No `madeit-block-content--frontend` class
 * - Structure: .row > .col > .container > .row
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

export default function saveLegacyBoxedInlineWrapper( props ) {
    const { attributes, className } = props;
    const {
        wrapperClassName,
        wrapperStyle,
        directRowClassName,
        boxedInnerContainerClassName,
        boxedInnerRowClassName,
        htmlTag,
    } = attributes;

    const HtmlTag = ALLOWED_HTML_TAGS.includes( htmlTag ) ? htmlTag : 'div';

    const wrapperClass =
        typeof wrapperClassName === 'string' && wrapperClassName.trim()
            ? wrapperClassName.trim()
            : ( typeof className === 'string' && className.trim() ? className.trim() : classnames( 'wp-block-madeit-block-content', 'container-fluid' ) );

    const outerRowClass =
        typeof directRowClassName === 'string' && directRowClassName.trim()
            ? directRowClassName.trim()
            : 'row';

    const innerContainerClass =
        typeof boxedInnerContainerClassName === 'string' && boxedInnerContainerClassName.trim()
            ? boxedInnerContainerClassName.trim()
            : 'container';

    const innerRowClass =
        typeof boxedInnerRowClassName === 'string' && boxedInnerRowClassName.trim()
            ? boxedInnerRowClassName.trim()
            : 'row';

    const style = parseInlineStyle( wrapperStyle );

    const blockProps = useBlockProps.save( {
        className: wrapperClass,
        style: style || undefined,
    } );
    blockProps.className = wrapperClass;

    return (
        <HtmlTag { ...blockProps }>
            <div className={ outerRowClass }>
                <div className="col">
                    <div className={ innerContainerClass }>
                        <div className={ innerRowClass }>
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

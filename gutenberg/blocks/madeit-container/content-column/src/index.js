/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import classnames from 'classnames';
import { registerBlockType } from '@wordpress/blocks';

import { InnerBlocks, useBlockProps, getColorClassName } from "@wordpress/block-editor";

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
import save_20260407 from './save-versions/save_20260407';
import save_20260422 from './save-versions/save_20260422';
import save_20260422_color_legacy_duplicates from './save-versions/save_20260422_color_legacy_duplicates';

const stripBackgroundClasses = ( className = '' ) =>
    className
        .split( /\s+/ )
        .filter( Boolean )
        .filter( ( token ) => token !== 'has-background' && ! /^has-.*-background-color$/.test( token ) )
        .join( ' ' );

const inferWidthFromClassNames = ( ...classNameCandidates ) => {
    const className = classNameCandidates
        .filter( ( value ) => typeof value === 'string' && value.trim().length > 0 )
        .join( ' ' );

    if ( ! className ) {
        return undefined;
    }

    const breakpointMatch = className.match( /\bcol-(?:lg|md|sm|xl|xxl)-(\d{1,2})\b/ );
    if ( breakpointMatch ) {
        return Number( breakpointMatch[ 1 ] );
    }

    if ( /\bcol-12\b/.test( className ) ) {
        return 12;
    }

    return undefined;
};

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
    ...metadata,
    icon,
    
    getEditWrapperProps( attributes ) {
        const { width, wrapperClassName } = attributes;
        const effectiveWidth = Number.isFinite( width )
            ? width
            : inferWidthFromClassNames( wrapperClassName );

        if ( Number.isFinite( effectiveWidth ) ) {
            const widthRounded = Math.round( effectiveWidth );
            const widthPercent = ( effectiveWidth * ( 100 / 12 ) ) + '%';
            return {
                className: `is-width-${ widthRounded }`,
                style: {
                    flexBasis: widthPercent,
                    // maxWidth: widthPercent,
                },
            };
        }
    },

    
    
    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save,
    
    deprecated: [
            {
                // Deprecated (2026-04-22): early color support could serialize
                // duplicated/conflicting background classes on the inner wrapper.
                // Keep as-is so existing posts validate.
                save: save_20260422_color_legacy_duplicates,
            },
            {
                // Deprecated (2026-04-22): previous save did not output
                // background/text colors to the frontend.
                save: save_20260422,
            },
            {
                // Deprecated (width default compatibility): before `width`
                // defaulted to 12, legacy content could be saved without
                // `col-lg-12`. Keep raw wrapper classes to match that markup.
                attributes: {
                    wrapperClassName: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.wp-block-madeit-block-content-column',
                        attribute: 'class',
                    },
                    legacyWrapperStyle: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.wp-block-madeit-block-content-column',
                        attribute: 'style',
                    },
                    innerWrapperClassName: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.madeit-content-column__inner',
                        attribute: 'class',
                    },
                    legacyInnerStyle: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.madeit-content-column__inner',
                        attribute: 'style',
                    },
                    verticalAlignment: { type: 'string' },
                    width: { type: 'number', min: 0, max: 12 },
                    margin: { type: 'object' },
                    padding: { type: 'object' },
                    maxContainerSize: { type: 'boolean' },
                },
                save: function( props ) {
                    const {
                        wrapperClassName,
                        legacyWrapperStyle,
                        innerWrapperClassName,
                        legacyInnerStyle,
                        margin,
                        padding,
                    } = props.attributes;

                    const rawOuterClassName =
                        typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0
                            ? wrapperClassName.trim()
                            : 'wp-block-madeit-block-content-column col-12';

                    const outerStyle = {};
                    if ( margin?.top !== undefined ) outerStyle.marginTop = margin.top;
                    if ( margin?.bottom !== undefined ) outerStyle.marginBottom = margin.bottom;

                    if ( legacyWrapperStyle && Object.keys( outerStyle ).length === 0 ) {
                        const readPx = ( key ) => {
                            const re = new RegExp( `${ key }\\s*:\\s*([0-9.]+)px`, 'i' );
                            const m = String( legacyWrapperStyle ).match( re );
                            return m ? `${ m[ 1 ] }px` : undefined;
                        };

                        const mt = readPx( 'margin-top' );
                        const mb = readPx( 'margin-bottom' );

                        if ( mt !== undefined ) outerStyle.marginTop = mt;
                        if ( mb !== undefined ) outerStyle.marginBottom = mb;
                    }

                    const rawInnerClassName =
                        typeof innerWrapperClassName === 'string' && innerWrapperClassName.trim().length > 0
                            ? innerWrapperClassName.trim()
                            : 'madeit-content-column__inner';

                    const innerStyle = {};
                    if ( padding?.top !== undefined ) innerStyle.paddingTop = padding.top;
                    if ( padding?.bottom !== undefined ) innerStyle.paddingBottom = padding.bottom;
                    if ( padding?.left !== undefined ) innerStyle.paddingLeft = padding.left;
                    if ( padding?.right !== undefined ) innerStyle.paddingRight = padding.right;

                    if ( legacyInnerStyle ) {
                        const readCssValue = ( key ) => {
                            const re = new RegExp( `(?:^|;)\\s*${ key }\\s*:\\s*([^;]+)`, 'i' );
                            const m = String( legacyInnerStyle ).match( re );
                            return m ? String( m[ 1 ] ).trim() : undefined;
                        };

                        const legacyColor = readCssValue( 'color' );
                        const legacyBackgroundColor = readCssValue( 'background-color' );

                        if ( legacyColor !== undefined && innerStyle.color === undefined ) {
                            innerStyle.color = legacyColor;
                        }
                        if (
                            legacyBackgroundColor !== undefined &&
                            innerStyle.backgroundColor === undefined
                        ) {
                            innerStyle.backgroundColor = legacyBackgroundColor;
                        }
                    }

                    const hasPaddingFromAttributes =
                        innerStyle.paddingTop !== undefined ||
                        innerStyle.paddingBottom !== undefined ||
                        innerStyle.paddingLeft !== undefined ||
                        innerStyle.paddingRight !== undefined;

                    if ( legacyInnerStyle && ! hasPaddingFromAttributes ) {
                        const readPx = ( key ) => {
                            const re = new RegExp( `${ key }\\s*:\\s*([0-9.]+)px`, 'i' );
                            const m = String( legacyInnerStyle ).match( re );
                            return m ? `${ m[ 1 ] }px` : undefined;
                        };

                        const pt = readPx( 'padding-top' );
                        const pb = readPx( 'padding-bottom' );
                        const pl = readPx( 'padding-left' );
                        const pr = readPx( 'padding-right' );

                        if ( pt !== undefined ) innerStyle.paddingTop = pt;
                        if ( pb !== undefined ) innerStyle.paddingBottom = pb;
                        if ( pl !== undefined ) innerStyle.paddingLeft = pl;
                        if ( pr !== undefined ) innerStyle.paddingRight = pr;
                    }

                    return (
                        <div className={ rawOuterClassName } style={ outerStyle }>
                            <div className={ rawInnerClassName } style={ innerStyle }>
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                },
            },
            {
                // Deprecated (legacy whitespace + raw wrapper classes): some older
                // saved blocks did not include `col-lg-12` when width was 12, and
                // kept an empty line inside the inner wrapper when no inner blocks
                // were present. Keep this to avoid block validation errors.
                attributes: {
                    wrapperClassName: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.wp-block-madeit-block-content-column',
                        attribute: 'class',
                    },
                    legacyWrapperStyle: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.wp-block-madeit-block-content-column',
                        attribute: 'style',
                    },
                    innerWrapperClassName: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.madeit-content-column__inner',
                        attribute: 'class',
                    },
                    legacyInnerStyle: {
                        type: 'string',
                        source: 'attribute',
                        selector: '.madeit-content-column__inner',
                        attribute: 'style',
                    },
                    verticalAlignment: { type: 'string' },
                    width: { type: 'number', min: 0, max: 12 },
                    margin: { type: 'object' },
                    padding: { type: 'object' },
                    maxContainerSize: { type: 'boolean' },
                },
                save: function( props ) {
                    const {
                        wrapperClassName,
                        legacyWrapperStyle,
                        innerWrapperClassName,
                        legacyInnerStyle,
                        margin,
                        padding,
                    } = props.attributes;

                    const rawOuterClassName =
                        typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0
                            ? wrapperClassName.trim()
                            : 'wp-block-madeit-block-content-column col-12';

                    const outerStyle = {};
                    if ( margin?.top !== undefined ) outerStyle.marginTop = margin.top;
                    if ( margin?.bottom !== undefined ) outerStyle.marginBottom = margin.bottom;

                    if ( legacyWrapperStyle && Object.keys( outerStyle ).length === 0 ) {
                        const readPx = ( key ) => {
                            const re = new RegExp( `${ key }\\s*:\\s*([0-9.]+)px`, 'i' );
                            const m = String( legacyWrapperStyle ).match( re );
                            return m ? `${ m[ 1 ] }px` : undefined;
                        };

                        const mt = readPx( 'margin-top' );
                        const mb = readPx( 'margin-bottom' );

                        if ( mt !== undefined ) outerStyle.marginTop = mt;
                        if ( mb !== undefined ) outerStyle.marginBottom = mb;
                    }

                    const rawInnerClassName =
                        typeof innerWrapperClassName === 'string' && innerWrapperClassName.trim().length > 0
                            ? innerWrapperClassName.trim()
                            : 'madeit-content-column__inner';

                    const innerStyle = {};
                    if ( padding?.top !== undefined ) innerStyle.paddingTop = padding.top;
                    if ( padding?.bottom !== undefined ) innerStyle.paddingBottom = padding.bottom;
                    if ( padding?.left !== undefined ) innerStyle.paddingLeft = padding.left;
                    if ( padding?.right !== undefined ) innerStyle.paddingRight = padding.right;

                    if ( legacyInnerStyle ) {
                        const readCssValue = ( key ) => {
                            const re = new RegExp( `(?:^|;)\\s*${ key }\\s*:\\s*([^;]+)`, 'i' );
                            const m = String( legacyInnerStyle ).match( re );
                            return m ? String( m[ 1 ] ).trim() : undefined;
                        };

                        const legacyColor = readCssValue( 'color' );
                        const legacyBackgroundColor = readCssValue( 'background-color' );

                        if ( legacyColor !== undefined && innerStyle.color === undefined ) {
                            innerStyle.color = legacyColor;
                        }
                        if (
                            legacyBackgroundColor !== undefined &&
                            innerStyle.backgroundColor === undefined
                        ) {
                            innerStyle.backgroundColor = legacyBackgroundColor;
                        }
                    }

                    const hasPaddingFromAttributes =
                        innerStyle.paddingTop !== undefined ||
                        innerStyle.paddingBottom !== undefined ||
                        innerStyle.paddingLeft !== undefined ||
                        innerStyle.paddingRight !== undefined;

                    if ( legacyInnerStyle && ! hasPaddingFromAttributes ) {
                        const readPx = ( key ) => {
                            const re = new RegExp( `${ key }\\s*:\\s*([0-9.]+)px`, 'i' );
                            const m = String( legacyInnerStyle ).match( re );
                            return m ? `${ m[ 1 ] }px` : undefined;
                        };

                        const pt = readPx( 'padding-top' );
                        const pb = readPx( 'padding-bottom' );
                        const pl = readPx( 'padding-left' );
                        const pr = readPx( 'padding-right' );

                        if ( pt !== undefined ) innerStyle.paddingTop = pt;
                        if ( pb !== undefined ) innerStyle.paddingBottom = pb;
                        if ( pl !== undefined ) innerStyle.paddingLeft = pl;
                        if ( pr !== undefined ) innerStyle.paddingRight = pr;
                    }

                    return (
                        <div className={ rawOuterClassName } style={ outerStyle }>
                            <div className={ rawInnerClassName } style={ innerStyle }>
                                { '\n\n' }
                                <InnerBlocks.Content />
                            </div>
                        </div>
                    );
                },
            },
        {
            // Deprecated (previous markup): padding was saved on the OUTER wrapper,
            // while background classes were stored on the INNER wrapper.
            //
            // This must use the raw `innerWrapperClassName` to preserve legacy
            // duplicated tokens and exact class strings from post content.
            attributes: {
                wrapperClassName: {
                    type: 'string',
                    source: 'attribute',
                    selector: '.wp-block-madeit-block-content-column',
                    attribute: 'class',
                },
                // Legacy HTML stored padding/margins on the wrapper `style`.
                legacyWrapperStyle: {
                    type: 'string',
                    source: 'attribute',
                    selector: '.wp-block-madeit-block-content-column',
                    attribute: 'style',
                },
                innerWrapperClassName: {
                    type: 'string',
                    source: 'attribute',
                    selector: '.madeit-content-column__inner',
                    attribute: 'class',
                },
                verticalAlignment: { type: 'string' },
                hasCustomVerticalAlignment: { type: 'boolean' },
                width: { type: 'number', min: 0, max: 12 },
                backgroundColor: { type: 'string' },
                customBackgroundColor: { type: 'string' },
                textColor: { type: 'string' },
                customTextColor: { type: 'string' },
                margin: { type: 'object' },
                padding: { type: 'object' },
                maxContainerSize: { type: 'boolean' },
            },
            save: function( props ) {
                const {
                    wrapperClassName,
                    legacyWrapperStyle,
                    verticalAlignment,
                    width,
                    margin,
                    padding,
                    maxContainerSize,
                    innerWrapperClassName,
                } = props.attributes;

                // Prefer the raw class string sourced from saved HTML so we don't
                // accidentally normalize, reorder, or dedupe legacy tokens.
                const rawOuterClassName =
                    typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0
                        ? wrapperClassName.trim()
                        : typeof props?.className === 'string' && props.className.trim().length > 0
                            ? props.className.trim()
                            : classnames( 'wp-block-madeit-block-content-column', {
                                    'col-12': true,
                                    [ `col-lg-${ Math.round( width ) }` ]: Number.isFinite( width ),
                                    [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
                                    'keep-max-container-size': maxContainerSize,
                                } );

                const style = {};
                if ( margin?.top !== undefined ) style.marginTop = margin.top;
                if ( margin?.bottom !== undefined ) style.marginBottom = margin.bottom;
                if ( padding?.top !== undefined ) style.paddingTop = padding.top;
                if ( padding?.bottom !== undefined ) style.paddingBottom = padding.bottom;
                if ( padding?.left !== undefined ) style.paddingLeft = padding.left;
                if ( padding?.right !== undefined ) style.paddingRight = padding.right;

                // If this legacy block stored spacing only on the wrapper style
                // attribute (without JSON attributes), fall back to parsing it.
                if ( legacyWrapperStyle && Object.keys( style ).length === 0 ) {
                    const readPx = ( key ) => {
                        const re = new RegExp( `${ key }\\s*:\\s*([0-9.]+)px`, 'i' );
                        const m = String( legacyWrapperStyle ).match( re );
                        return m ? `${ m[ 1 ] }px` : undefined;
                    };

                    const pt = readPx( 'padding-top' );
                    const pb = readPx( 'padding-bottom' );
                    const pl = readPx( 'padding-left' );
                    const pr = readPx( 'padding-right' );
                    const mt = readPx( 'margin-top' );
                    const mb = readPx( 'margin-bottom' );

                    if ( pt !== undefined ) style.paddingTop = pt;
                    if ( pb !== undefined ) style.paddingBottom = pb;
                    if ( pl !== undefined ) style.paddingLeft = pl;
                    if ( pr !== undefined ) style.paddingRight = pr;
                    if ( mt !== undefined ) style.marginTop = mt;
                    if ( mb !== undefined ) style.marginBottom = mb;
                }

                return (
                    <div className={ rawOuterClassName } style={ style }>
                        <div className={ innerWrapperClassName || 'madeit-content-column__inner' }>
                            { '\n\n' }
                            <InnerBlocks.Content />
                            { '\n\n' }
                        </div>
                    </div>
                );
            },
        },
        {
            // Deprecated (ultra-legacy markup): keep the exact wrapper class
            // string from stored HTML (including duplicates / legacy grid
            // classes) when there is NO inner wrapper and NO `col-md-*`.
            // This prevents block validation errors on very old content.
            attributes: {
                wrapperClassName: {
                    type: 'string',
                    source: 'attribute',
                    selector: '.wp-block-madeit-block-content-column',
                    attribute: 'class',
                },
                verticalAlignment: {
                    type: 'string',
                },
                hasCustomVerticalAlignment: {
                    type: 'boolean',
                },
                margin: {
                    type: 'object',
                },
                padding: {
                    type: 'object',
                },
            },
            save: function( props ) {
                const {
                    wrapperClassName,
                    margin,
                    padding,
                } = props.attributes;

                const rawWrapperClassName =
                    typeof wrapperClassName === 'string' && wrapperClassName.trim().length > 0
                        ? wrapperClassName.trim()
                        : typeof props?.className === 'string' && props.className.trim().length > 0
                            ? props.className.trim()
                            : '';

                // Only target the legacy variants we know can be matched safely.
                if ( rawWrapperClassName === '' || /\bcol-md-\d+\b/.test( rawWrapperClassName ) ) {
                    return save( props );
                }

                const style = {};
                if ( margin !== undefined && margin.top !== undefined ) {
                    style.marginTop = margin.top;
                }
                if ( margin !== undefined && margin.bottom !== undefined ) {
                    style.marginBottom = margin.bottom;
                }
                if ( padding !== undefined && padding.top !== undefined ) {
                    style.paddingTop = padding.top;
                }
                if ( padding !== undefined && padding.bottom !== undefined ) {
                    style.paddingBottom = padding.bottom;
                }
                if ( padding !== undefined && padding.left !== undefined ) {
                    style.paddingLeft = padding.left;
                }
                if ( padding !== undefined && padding.right !== undefined ) {
                    style.paddingRight = padding.right;
                }

                // Do NOT use useBlockProps.save here, as it may normalize
                // className and break exact legacy matching.
                return (
                    <div className={ rawWrapperClassName } style={ style }>
                        { '\n\n' }
                        <InnerBlocks.Content />
                        { '\n\n' }
                    </div>
                );
            },
        },
        {
            // Deprecated (previous current markup): same as the modern markup but
            // WITHOUT `col-md-*` classes. Keep to avoid block validation errors.
            save: function( props ) {
                const {
                    verticalAlignment,
                    width,
                    customBackgroundColor,
                    backgroundColor,
                    customTextColor,
                    textColor,
                    margin,
                    padding,
                    maxContainerSize,
                    innerWrapperClassName,
                } = props.attributes;

                const { className } = props;

                const defaultBlockClassName = 'wp-block-madeit-block-content-column';
                const extraClasses = stripBackgroundClasses( className || '' )
                    .split( /\s+/ )
                    .filter( Boolean )
                    .filter( ( token ) => token !== defaultBlockClassName )
                    .filter( ( token ) => token !== 'has-text-color' )
                    .filter( ( token ) => token !== 'keep-max-container-size' )
                    .filter( ( token ) => token !== 'col-12' )
                    .filter( ( token ) => ! /^col-(?:sm|md|lg|xl|xxl)-\d+$/.test( token ) )
                    .filter( ( token ) => ! /^is-vertically-aligned-/.test( token ) )
                    .join( ' ' );

                const backgroundColorClass = backgroundColor
                    ? getColorClassName( 'background-color', backgroundColor )
                    : undefined;
                const textColorClass = textColor
                    ? getColorClassName( 'color', textColor )
                    : undefined;

                const widthRounded = Math.round( width );

                const wrapperClasses = [
                    defaultBlockClassName,
                    verticalAlignment ? `is-vertically-aligned-${ verticalAlignment }` : null,
                    'col-12',
                    widthRounded ? `col-lg-${ widthRounded }` : null,
                    extraClasses || null,
                    maxContainerSize ? 'keep-max-container-size' : null,
                    textColorClass ? 'has-text-color' : null,
                    textColorClass || null,
                ]
                    .filter( Boolean )
                    .join( ' ' );

                const hasBackground = !! ( backgroundColorClass || customBackgroundColor );
                const hasInnerWrapper = !! innerWrapperClassName;

                const innerClasses = classnames( 'madeit-content-column__inner', {
                    'has-background': backgroundColorClass,
                    [ backgroundColorClass ]: backgroundColorClass,
                } );

                const style = {
                    color: textColorClass ? undefined : customTextColor,
                };
                const innerStyle = {
                    backgroundColor: backgroundColorClass
                        ? undefined
                        : customBackgroundColor,
                };

                if ( margin !== undefined && margin.top !== undefined ) {
                    style.marginTop = margin.top;
                }
                if ( margin !== undefined && margin.bottom !== undefined ) {
                    style.marginBottom = margin.bottom;
                }
                if ( padding !== undefined && padding.top !== undefined ) {
                    style.paddingTop = padding.top;
                }
                if ( padding !== undefined && padding.bottom !== undefined ) {
                    style.paddingBottom = padding.bottom;
                }
                if ( padding !== undefined && padding.left !== undefined ) {
                    style.paddingLeft = padding.left;
                }
                if ( padding !== undefined && padding.right !== undefined ) {
                    style.paddingRight = padding.right;
                }

                const blockProps = useBlockProps.save( {
                    className: wrapperClasses,
                    style,
                } );

                if ( ! hasBackground ) {
                    return (
                        <div { ...blockProps }>
                            { '\n\n' }
                            <InnerBlocks.Content />
                            { '\n\n' }
                        </div>
                    );
                }

                if ( hasBackground && ! hasInnerWrapper ) {
                    const legacyWrapperClasses = classnames( wrapperClasses, {
                        'has-background': !! backgroundColorClass,
                        [ backgroundColorClass ]: backgroundColorClass,
                    } );

                    const legacyStyle = {
                        ...style,
                        backgroundColor: backgroundColorClass
                            ? undefined
                            : customBackgroundColor,
                    };

                    const legacyBlockProps = useBlockProps.save( {
                        className: legacyWrapperClasses,
                        style: legacyStyle,
                    } );

                    return (
                        <div { ...legacyBlockProps }>
                            { '\n\n' }
                            <InnerBlocks.Content />
                            { '\n\n' }
                        </div>
                    );
                }

                return (
                    <div { ...blockProps }>
                        <div className={ innerClasses } style={ innerStyle }>
                            <InnerBlocks.Content />
                        </div>
                    </div>
                );
            },
        },
        {
            // Deprecated (legacy markup): background classes were saved on the
            // outer wrapper and there was no `.madeit-content-column__inner`.
            // This must match older post content to avoid requiring recovery.
            save: function( props ) {
                const {
                    verticalAlignment,
                    width,
                    customBackgroundColor,
                    backgroundColor,
                    customTextColor,
                    textColor,
                    margin,
                    padding,
                    maxContainerSize,
                } = props.attributes;

                const { className } = props;

                const defaultBlockClassName = 'wp-block-madeit-block-content-column';
                const outerClassName = stripBackgroundClasses( className || '' )
                    .split( /\s+/ )
                    .filter( Boolean )
                    .filter( ( token ) => token !== defaultBlockClassName )
                    .join( ' ' );

                const backgroundColorClass = backgroundColor
                    ? getColorClassName( 'background-color', backgroundColor )
                    : undefined;

                const textColorClass = textColor
                    ? getColorClassName( 'color', textColor )
                    : undefined;

                const widthRounded = Math.round( width );

                let wrapperClasses = classnames(
                    defaultBlockClassName,
                    outerClassName,
                    {
                        [ `is-vertically-aligned-${ verticalAlignment }` ]:
                            verticalAlignment,
                        'col-12': true,
                        [ `col-lg-${ widthRounded }` ]: widthRounded,
                        'keep-max-container-size': !! maxContainerSize,
                    }
                );

                wrapperClasses = classnames( wrapperClasses, {
                    'has-text-color': textColorClass,
                    [ textColorClass ]: textColorClass,
                    'has-background': !! ( backgroundColorClass || customBackgroundColor ),
                    [ backgroundColorClass ]: backgroundColorClass,
                } );

                const style = {
                    backgroundColor: backgroundColorClass
                        ? undefined
                        : customBackgroundColor,
                    color: textColorClass ? undefined : customTextColor,
                };

                if ( margin !== undefined && margin.top !== undefined ) {
                    style.marginTop = margin.top;
                }
                if ( margin !== undefined && margin.bottom !== undefined ) {
                    style.marginBottom = margin.bottom;
                }
                if ( padding !== undefined && padding.top !== undefined ) {
                    style.paddingTop = padding.top;
                }
                if ( padding !== undefined && padding.bottom !== undefined ) {
                    style.paddingBottom = padding.bottom;
                }
                if ( padding !== undefined && padding.left !== undefined ) {
                    style.paddingLeft = padding.left;
                }
                if ( padding !== undefined && padding.right !== undefined ) {
                    style.paddingRight = padding.right;
                }

                const blockProps = useBlockProps.save( {
                    className: wrapperClasses,
                    style,
                } );

                return (
                    <div { ...blockProps }>
                        { '\n\n' }
                        <InnerBlocks.Content />
                        { '\n\n' }
                    </div>
                );
            },
        },
        {
            // Deprecated (legacy markup): columns were saved without the
            // `.madeit-content-column__inner` wrapper.
            // Needed so copy/pasting older content does not require recovery.
            save: function( props ) {
                const {
                    verticalAlignment,
                    width,
                    customBackgroundColor,
                    backgroundColor,
                    customTextColor,
                    textColor,
                    margin,
                    padding,
                    maxContainerSize,
                } = props.attributes;

                const { className } = props;

                const defaultBlockClassName = 'wp-block-madeit-block-content-column';
                const outerClassName = ( className || '' )
                    .split( /\s+/ )
                    .filter( Boolean )
                    .filter(
                        ( token ) =>
                            token !== 'has-background' &&
                            ! /^has-.*-background-color$/.test( token )
                    )
                    .join( ' ' );

                const textColorClass = textColor
                    ? getColorClassName( 'color', textColor )
                    : undefined;

                const backgroundColorClass = backgroundColor
                    ? getColorClassName( 'background-color', backgroundColor )
                    : undefined;

                const widthRounded = Math.round( width );

                let wrapperClasses = classnames(
                    defaultBlockClassName,
                    outerClassName,
                    {
                        [ `is-vertically-aligned-${ verticalAlignment }` ]:
                            verticalAlignment,
                        'col-12': true,
                        [ `col-lg-${ widthRounded }` ]: widthRounded,
                        'keep-max-container-size': !! maxContainerSize,
                    }
                );

                wrapperClasses = classnames( wrapperClasses, {
                    'has-text-color': textColorClass,
                    [ textColorClass ]: textColorClass,
                } );

                const style = {
                    backgroundColor: backgroundColorClass
                        ? undefined
                        : customBackgroundColor,
                    color: textColorClass ? undefined : customTextColor,
                };

                if ( margin !== undefined && margin.top !== undefined ) {
                    style.marginTop = margin.top;
                }
                if ( margin !== undefined && margin.bottom !== undefined ) {
                    style.marginBottom = margin.bottom;
                }
                if ( padding !== undefined && padding.top !== undefined ) {
                    style.paddingTop = padding.top;
                }
                if ( padding !== undefined && padding.bottom !== undefined ) {
                    style.paddingBottom = padding.bottom;
                }
                if ( padding !== undefined && padding.left !== undefined ) {
                    style.paddingLeft = padding.left;
                }
                if ( padding !== undefined && padding.right !== undefined ) {
                    style.paddingRight = padding.right;
                }

                const blockProps = useBlockProps.save( {
                    className: wrapperClasses,
                    style,
                } );

                return (
                    <div { ...blockProps }>
                        { '\n\n' }
                        <InnerBlocks.Content />
                        { '\n\n' }
                    </div>
                );
            },
        },
        {
            save: save_20260407,
        },

        {
            supports: {
                inserter: false,
                reusable: false,
                html: false,
            },

            attributes: {
                verticalAlignment: {
                    type: "string"
                },
                width: {
                    "type": "number",
                    "min": 0,
                    "max": 12
                },
                backgroundColor: {
                    type: 'string',
                },
                customBackgroundColor: {
                    type: 'string',
                },
                textColor: {
                    type: 'string',
                },
                customTextColor: {
                    type: 'string',
                },
                marginBottom: {
                    type: 'number',
                    default: 0
                },
                marginTop: {
                    type: 'number',
                    default: 0
                },
                paddingTop: {
                    type: 'number',
                    default: 0
                },
                paddingBottom: {
                    type: 'number',
                    default: 0
                },
                paddingLeft: {
                    type: 'number',
                    default: 0
                },
                paddingRight: {
                    type: 'number',
                    default: 0
                },
            },

            migrate( attributes, innerBlocks ) {
                return [
                    {
                        padding: {
                            top: attributes.paddingTop !== null && attributes.paddingTop !== undefined ? (attributes.paddingTop + 'px') : undefined,
                            bottom: attributes.paddingBottom !== null && attributes.paddingBottom !== undefined ? (attributes.paddingBottom + 'px') : undefined,
                            left: attributes.paddingLeft !== null && attributes.paddingLeft !== undefined ? (attributes.paddingLeft + 'px') : undefined,
                            right: attributes.paddingRight !== null && attributes.paddingRight !== undefined ? (attributes.paddingRight + 'px') : undefined,
                        },
                        margin: {
                            top: attributes.marginTop !== null && attributes.marginTop !== undefined ? (attributes.marginTop + 'px') : undefined,
                            bottom: attributes.marginBottom !== null && attributes.marginBottom !== undefined ? (attributes.marginBottom + 'px') : undefined,
                            left: undefined,
                            right: undefined,
                        },
                        verticalAlignment: attributes.verticalAlignment,
                        width: attributes.width,
                        backgroundColor: attributes.backgroundColor,
                        customBackgroundColor: attributes.customBackgroundColor,
                        textColor: attributes.textColor,
                        customTextColor: attributes.customTextColor,
                    },
                    innerBlocks
                ];
            },

            save: function( props ) {
                const { 
                    verticalAlignment,
                    width,
                    customBackgroundColor,
                    backgroundColor,
                    customTextColor,
                    textColor,
                    marginTop,
                    marginBottom,
                    paddingTop,
                    paddingBottom,
                    paddingLeft,
                    paddingRight,
                } = props.attributes;

                const {
                    className
                } = props
                
                const backgroundColorClass = backgroundColor ? getColorClassName( 'background-color', backgroundColor ) : undefined;
                const textColorClass = textColor ? getColorClassName( 'color', textColor ) : undefined;
                
                var widthRounded = Math.round(width);
                
                var wrapperClasses = classnames( className, {
                    [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
                    [ `col-12` ]: true,
                    [ `col-lg-${widthRounded}` ]: widthRounded,
                } );
                
                wrapperClasses = classnames(wrapperClasses, {
                    'has-text-color': textColorClass,
                    'has-background': backgroundColorClass,
                    [ backgroundColorClass ]: backgroundColorClass,
                    [ textColorClass ]: textColorClass,
                } );
                
                var style = {
                    backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
                    color: textColorClass ? undefined : customTextColor,
                };

                if(marginTop > 0) {
                    style.marginTop = (marginTop + 28) + 'px';
                }
                if(marginBottom > 0) {
                    style.marginBottom = (marginBottom + 28) + 'px';
                }
                
                if(paddingTop > 0) {
                    style.paddingTop = paddingTop + 'px';
                }
                if(paddingBottom > 0) {
                    style.paddingBottom = paddingBottom + 'px';
                }
                if(paddingLeft > 0) {
                    style.paddingLeft = paddingLeft + 'px';
                }
                if(paddingRight > 0) {
                    style.paddingRight = paddingRight + 'px';
                }
                
                const blockProps = useBlockProps.save( {
                    className: wrapperClasses,
                    style: style,
                });
                
                return (
                    <div { ...blockProps }>
                        <InnerBlocks.Content />
                    </div>
                );
            },
        },

        {
            supports: {
                inserter: false,
                reusable: false,
                html: false,
            },
            attributes: {
                verticalAlignment: {
                    type: "string"
                },
                width: {
                    "type": "number",
                    "min": 0,
                    "max": 12
                },
                backgroundColor: {
                    type: 'string',
                },
                customBackgroundColor: {
                    type: 'string',
                },
                textColor: {
                    type: 'string',
                },
                customTextColor: {
                    type: 'string',
                },
                marginBottom: {
                    type: 'number',
                    default: 0
                },
                marginTop: {
                    type: 'number',
                    default: 0
                },
                paddingTop: {
                    type: 'number',
                    default: 0
                },
                paddingBottom: {
                    type: 'number',
                    default: 0
                },
                paddingLeft: {
                    type: 'number',
                    default: 0
                },
                paddingRight: {
                    type: 'number',
                    default: 0
                },
            },
            save: function( { attributes } ) {
                const { verticalAlignment, width } = attributes;

                var wrapperClasses = classnames( 'col', {
                    [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
                    [ `col-md-${width}` ]: width,
                } );

                let style;

                return (
                    <div className={ wrapperClasses } style={ style }>
                        <InnerBlocks.Content />
                    </div>
                );
            },
        },
    ]
});

// Ensure background color classes never stick to the outer wrapper.
if ( typeof window !== 'undefined' && window.wp?.hooks?.addFilter ) {
    window.wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        'madeit/block-content-column/strip-bg-save-props',
        ( extraProps, blockType, attributes ) => {
            if ( blockType?.name !== metadata.name ) {
                return extraProps;
            }

            // WordPress core may inject `has-background` + `has-*-background-color`
            // classes on the outer wrapper via block supports. For the CURRENT
            // version of this block we explicitly want background classes only
            // on the inner wrapper.
            //
            // IMPORTANT: do NOT strip for deprecated saves, because legacy posts
            // legitimately rely on these classes on the outer wrapper.
            if ( blockType?.save !== save ) {
                return extraProps;
            }

            // Only strip when using the new markup (inner wrapper exists).
            // Legacy blocks intentionally keep background classes on the outer
            // wrapper for backwards-compatible serialization.
            if ( ! attributes?.innerWrapperClassName ) {
                return extraProps;
            }

            if ( typeof extraProps?.className === 'string' ) {
                extraProps.className = stripBackgroundClasses( extraProps.className );
            }

            return extraProps;
        },
        100
    );

    // NOTE: Do not strip background classes at save-time via extraProps.
    // Deprecated versions of this block legitimately saved background classes
    // on the outer wrapper. Stripping here breaks deprecated matching and
    // triggers “Block herstellen” in the editor.

    window.wp.hooks.addFilter(
        'editor.BlockListBlock',
        'madeit/block-content-column/strip-bg-editor-wrapper',
        ( BlockListBlock ) => ( props ) => {
            if ( props?.name !== metadata.name ) {
                return <BlockListBlock { ...props } />;
            }

        const nextProps = { ...props };
        if ( typeof nextProps.className === 'string' ) {
            nextProps.className = stripBackgroundClasses( nextProps.className );
        }
        if ( nextProps.wrapperProps && typeof nextProps.wrapperProps.className === 'string' ) {
            nextProps.wrapperProps = {
                ...nextProps.wrapperProps,
                className: stripBackgroundClasses( nextProps.wrapperProps.className ),
            };
        }

        return <BlockListBlock { ...nextProps } />;
        },
        100
    );
}

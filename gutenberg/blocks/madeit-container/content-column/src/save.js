import classnames from 'classnames';
import { InnerBlocks, useBlockProps, getColorClassName } from '@wordpress/block-editor';

export default function save( { attributes } ) {
    const {
        verticalAlignment,
        width,
        customTextColor,
        customBackgroundColor,
        margin,
        padding,
        paddingTablet,
        paddingMobile,
        maxContainerSize,
        aosFade,
        innerWrapperClassName,
        textColor,
        backgroundColor,
        marginTablet,
        marginMobile,
    } = attributes;

    const widthRounded = Number.isFinite( width ) ? Math.round( width ) : undefined;

    const textColorClass = textColor
        ? getColorClassName( 'color', textColor )
        : undefined;

    const backgroundColorClass = backgroundColor
        ? getColorClassName( 'background-color', backgroundColor )
        : undefined;

    const hasTextColor = !! ( textColorClass || customTextColor );
    const hasBackground = !! ( backgroundColorClass || customBackgroundColor );

    const tokenizeClassString = ( value = '' ) =>
        String( value || '' )
            .split( /\s+/ )
            .map( ( token ) => token.trim() )
            .filter( Boolean );

    const uniqClassString = ( value = '' ) => {
        const seen = new Set();
        const tokens = [];

        tokenizeClassString( value ).forEach( ( token ) => {
            if ( seen.has( token ) ) return;
            seen.add( token );
            tokens.push( token );
        } );

        return tokens.join( ' ' );
    };

    // Ensure we don't end up with conflicting/duplicated background tokens
    // coming from legacy markup stored in `innerWrapperClassName`.
    const stripBackgroundTokens = ( className = '' ) =>
        tokenizeClassString( className )
            .filter( ( token ) => token !== 'has-background' )
            .filter( ( token ) => ! /^has-.*-background-color$/.test( token ) )
            .join( ' ' );

    const classes = classnames(
        'wp-block-madeit-block-content-column',
        {
            'col-12': true,
            [ `col-lg-${ widthRounded }` ]: Number.isFinite( widthRounded ),
            [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
            'keep-max-container-size': maxContainerSize,
            'has-text-color': hasTextColor,
            [ textColorClass ]: !! textColorClass,
        }
    );

    const outerStyle = {
        marginTop: margin?.top,
        marginBottom: margin?.bottom,
        color: textColorClass ? undefined : customTextColor,
    };
    
    const innerStyle = {
        paddingTop: padding?.top,
        paddingBottom: padding?.bottom,
        paddingLeft: padding?.left,
        paddingRight: padding?.right,
        backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
    };

    const setSpacingVars = ( style, prefix, values, breakpoint ) => {
        if ( ! values || typeof values !== 'object' ) return;

        [ 'top', 'right', 'bottom', 'left' ].forEach( ( side ) => {
            if ( values[ side ] !== undefined ) {
                style[ `--madeit-column-${ prefix }-${ side }-${ breakpoint }` ] = values[ side ];
            }
        } );
    };

    setSpacingVars( outerStyle, 'margin', marginTablet, 'tablet' );
    setSpacingVars( outerStyle, 'margin', marginMobile, 'mobile' );
    setSpacingVars( innerStyle, 'padding', paddingTablet, 'tablet' );
    setSpacingVars( innerStyle, 'padding', paddingMobile, 'mobile' );

    const innerBaseClassName = stripBackgroundTokens(
        innerWrapperClassName || 'madeit-content-column__inner'
    );

    const innerClasses = uniqClassString(
        classnames( innerBaseClassName, {
            'has-background': hasBackground,
            [ backgroundColorClass ]: !! backgroundColorClass,
        } )
    );

    const blockProps = useBlockProps.save({
        className: classes,
        style: outerStyle,
        'data-aos': aosFade || undefined,
    });

    return (
        <div { ...blockProps }>
            <div className={ innerClasses } style={ innerStyle } >
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
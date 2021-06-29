/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
    InnerBlocks,
    getColorClassName,
    RichText
} = wp.blockEditor;

export default function save( props ) {
    const { 
        verticalAlignment,
        width,
        customBackgroundColor,
        backgroundColor,
        customTextColor,
        textColor,
        cardTitle,
        level,
        hasTitle
    } = props.attributes;
    
    const {
        className
    } = props
    
    const backgroundColorClass = backgroundColor ? getColorClassName( 'background-color', backgroundColor ) : undefined;
	const textColorClass = textColor ? getColorClassName( 'color', textColor ) : undefined;
    
    const TagName = 'h' + level;
    
    var wrapperClasses = classnames( className, {
        [ `card` ]: true,
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

    return (
        <div className={ wrapperClasses } style={ style }>
            { hasTitle && (
                <div class="card-header">
                    <TagName><RichText.Content value={ cardTitle } /></TagName>
                </div>
            ) }
            <div class="card-body">
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
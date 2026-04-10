import classnames from 'classnames';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
    const {
        verticalAlignment,
        width,
        margin,
        padding,
        maxContainerSize,
        innerWrapperClassName,
    } = attributes;

    const widthRounded = Math.round( width );

    const classes = classnames(
        'wp-block-madeit-block-content-column',
        {
            'col-12': true,
            [ `col-lg-${ widthRounded }` ]: widthRounded,
            [ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
            'keep-max-container-size': maxContainerSize,
        }
    );

    const outerStyle = {
        marginTop: margin?.top,
        marginBottom: margin?.bottom,
    };

    const innerStyle = {
        paddingTop: padding?.top,
        paddingBottom: padding?.bottom,
        paddingLeft: padding?.left,
        paddingRight: padding?.right,
    };

    const blockProps = useBlockProps.save({
        className: classes,
        style: outerStyle,
    });

    return (
        <div { ...blockProps }>
            <div className={ innerWrapperClassName || 'madeit-content-column__inner' } style={ innerStyle }>
                <InnerBlocks.Content />
            </div>
        </div>
    );
}
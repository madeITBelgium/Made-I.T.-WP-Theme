/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */

import classnames from 'classnames';

import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InnerBlocks, getColorClassName } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( props ) {
    const {
        verticalAlignment,
        containerBackgroundColor,
        customContainerBackgroundColor,
        size,
        rowBackgroundColor,
        rowTextColor,
        customRowBackgroundColor,
        customRowTextColor,
        containerMargin,
        containerPadding,
        rowMargin,
        rowPadding,
    } = props.attributes;
    
    const {
        className
    } = props
    
    const containerBackgroundColorClass = containerBackgroundColor ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;
	const rowBackgroundColorClass = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
	const rowTextColorClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;
    
    var classes = className;
    var classesChild = '';
    
    if(size !== 'container' && size !== 'container-fluid' && size !== 'container-content-boxed') {
        size = 'container';
    }
    
    console.log(size);
    
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
    
    if(containerMargin !== undefined && containerMargin.top !== undefined) {
        style.marginTop = containerMargin.top;
    }
    if(containerMargin !== undefined && containerMargin.bottom !== undefined) {
        style.marginBottom = containerMargin.bottom;
    }
    if(containerPadding !== undefined && containerPadding.top !== undefined ) {
        style.paddingTop = containerPadding.top;
    }
    if(containerPadding !== undefined && containerPadding.bottom !== undefined) {
        style.paddingBottom = containerPadding.bottom;
    }
    if(containerPadding !== undefined && containerPadding.left !== undefined) {
        style.paddingLeft = containerPadding.left;
    }
    if(containerPadding !== undefined && containerPadding.right !== undefined) {
        style.paddingRight = containerPadding.right;
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

        if(rowMargin !== undefined && rowMargin.top !== undefined) {
            style.marginTop = rowMargin.top;
        }
        if(rowMargin !== undefined && rowMargin.bottom !== undefined) {
            style.marginBottom = rowMargin.bottom;
        }
        if(rowPadding !== undefined && rowPadding.top !== undefined ) {
            style.paddingTop = rowPadding.top;
        }
        if(rowPadding !== undefined && rowPadding.bottom !== undefined) {
            style.paddingBottom = rowPadding.bottom;
        }
        if(rowPadding !== undefined && rowPadding.left !== undefined) {
            style.paddingLeft = rowPadding.left;
        }
        if(rowPadding !== undefined && rowPadding.right !== undefined) {
            style.paddingRight = rowPadding.right;
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
    
    
}
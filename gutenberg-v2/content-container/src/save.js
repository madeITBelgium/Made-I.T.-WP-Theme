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
        containerMarginTop,
        containerMarginBottom,
        containerPaddingTop,
        containerPaddingBottom,
        containerPaddingLeft,
        containerPaddingRight,
        rowMarginTop,
        rowMarginBottom,
        rowPaddingTop,
        rowPaddingBottom,
        rowPaddingLeft,
        rowPaddingRight,
        rowBackgroundColor,
        rowTextColor,
        customRowBackgroundColor,
        customRowTextColor,
    } = props.attributes;
    
    const {
        className
    } = props
    
    const containerBackgroundColorClass = containerBackgroundColor ? getColorClassName( 'background-color', containerBackgroundColor ) : undefined;
	const rowBackgroundColorClass = rowBackgroundColor ? getColorClassName( 'background-color', rowBackgroundColor ) : undefined;
	const rowTextColorClass = rowTextColor ? getColorClassName( 'color', rowTextColor ) : undefined;
    
    var classes = className;
    var classesChild = '';
    
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
    
    if(containerMarginTop > 0) {
        style.marginTop = containerMarginTop + 'px';
    }
    if(containerMarginBottom > 0) {
        style.marginBottom = containerMarginBottom + 'px';
    }
    
    if(containerPaddingTop > 0) {
        style.paddingTop = containerPaddingTop + 'px';
    }
    if(containerPaddingBottom > 0) {
        style.paddingBottom = containerPaddingBottom + 'px';
    }
    if(containerPaddingLeft > 0) {
        style.paddingLeft = containerPaddingLeft + 'px';
    }
    if(containerPaddingRight > 0) {
        style.paddingRight = containerPaddingRight + 'px';
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
        
        if(rowMarginTop > 0) {
            styleChild.marginTop = rowMarginTop + 'px';
        }
        if(rowMarginBottom > 0) {
            styleChild.marginBottom = rowMarginBottom + 'px';
        }

        if(rowPaddingTop > 0) {
            styleChild.paddingTop = rowPaddingTop + 'px';
        }
        if(rowPaddingBottom > 0) {
            styleChild.paddingBottom = rowPaddingBottom + 'px';
        }
        if(rowPaddingLeft > 0) {
            styleChild.paddingLeft = rowPaddingLeft + 'px';
        }
        if(rowPaddingRight > 0) {
            styleChild.paddingRight = rowPaddingRight + 'px';
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
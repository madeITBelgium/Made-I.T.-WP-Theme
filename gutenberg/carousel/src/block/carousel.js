//  Import CSS.
import './style.scss';
import './editor.scss';

import filter from 'lodash/filter';
import every from 'lodash/every';

/**
 * WordPress dependencies
 */
export const { createBlock, registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const { RichText, mediaUpload } = wp.editor
export const { createBlobURL } = wp.blob

import { default as edit } from './edit';

export const save = ( props ) => {
    const { images, anchor } = props.attributes;
    
    var elemID = anchor !== undefined ? anchor : 'demo';
    var i = 0;
    var j = 0;
    
    return (
        <div className="carousel slide" data-ride="carousel" ID={elemID}>
            <ul className="carousel-indicators">
                {
                    images.map( ( image ) => {
                        let className = i == 0 ? 'active' : '';
        
                        var result = (
                            <li data-target={'#' + elemID} data-slide-to={i} className={className}></li>
                        );
        
                        i++;
                        return result;
                    } ) 
                }
            </ul>
            <div class="carousel-inner">
                { images.map( ( image ) => {

                    const img = <img src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } className={ image.id ? `wp-image-${ image.id }` : null } />;
                    let active = j == 0 ? 'active' : '';
                    var result = (
                        <div className={ 'carousel-item ' + active } key={ image.id || image.url }>
                            { img }
                            { image.caption && image.caption.length > 0 && (
                                <div class="carousel-caption">
                                    <RichText.Content tagName="figcaption" value={ image.caption } />
                                </div>
                            ) }
                        </div>
                    );
                    j++;
                    return result;
                } ) }
            </div>
            
            <a class="carousel-control-prev" href={'#' + elemID} data-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </a>
            <a class="carousel-control-next" href={'#' + elemID} data-slide="next">
                <span class="carousel-control-next-icon"></span>
            </a>
        </div>
    );
}

registerBlockType( 'madeit/block-carousel', {
    // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
    title: __( 'Carousel - Made IT' ), // Block title.
    icon: 'editor-kitchensink', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
    category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
    keywords: [
        __( 'Carousel' ),
        __( 'Made IT' ),
        __( 'Made I.T.' ),
    ],

    attributes: {
        images: {
            type: 'array',
            default: [],
            source: 'query',
            selector: 'div.carousel .carousel-inner .carousel-item',
            query: {
                url: {
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'src',
                },
                link: {
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'data-link',
                },
                alt: {
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'alt',
                    default: '',
                },
                id: {
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'data-id',
                },
                caption: {
                    type: 'array',
                    source: 'children',
                    selector: 'figcaption',
                },
            },
        }
    },

    supports: {
        align: true,
        anchor: true,
    },

    // The "edit" property must be a valid function.
    edit: edit,

    // The "save" property must be  valid function.
    save: save,
} )
/* global esversion: 6 */

/**
 * External Dependencies
 */
import filter from 'lodash/filter';
import pick from 'lodash/pick';

/**
 * WordPress dependencies
 */
export const { Component, Fragment } = wp.element
export const { createBlock } = wp.blocks
export const { __ } = wp.i18n
export const {  BlockControls,
    MediaUpload,
    MediaPlaceholder,
    InspectorControls,
    mediaUpload, } = wp.editor
export const { IconButton,
    DropZone,
    FormFileUpload,
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
    Toolbar,
    withNotices, } = wp.components

/**
 * Internal dependencies
 */
import GalleryImage from './gallery-image';

class GalleryEdit extends Component {
    constructor() {
        super( ...arguments );

        this.onSelectImage = this.onSelectImage.bind( this );
        this.onSelectImages = this.onSelectImages.bind( this );
        this.onRemoveImage = this.onRemoveImage.bind( this );
        this.setImageAttributes = this.setImageAttributes.bind( this );
        this.addFiles = this.addFiles.bind( this );
        this.uploadFromFiles = this.uploadFromFiles.bind( this );

        this.state = {
            selectedImage: null,
        };
    }

    onSelectImage( index ) {
        return () => {
            if ( this.state.selectedImage !== index ) {
                this.setState( {
                    selectedImage: index,
                } );
            }
        };
    }

    onRemoveImage( index ) {
        return () => {
            const images = filter( this.props.attributes.images, ( img, i ) => index !== i );
            this.setState( { selectedImage: null } );
            this.props.setAttributes( {
                images,
            } );
        };
    }

    onSelectImages( images ) {
        this.props.setAttributes( {
            images: images.map( ( image ) => pick( image, [ 'alt', 'caption', 'id', 'link', 'url' ] ) ),
        } );
    }

    setImageAttributes( index, attributes ) {
        const { attributes: { images }, setAttributes } = this.props;
        if ( ! images[ index ] ) {
            return;
        }
        setAttributes( {
            images: [
                ...images.slice( 0, index ),
                {
                    ...images[ index ],
                    ...attributes,
                },
                ...images.slice( index + 1 ),
            ],
        } );
    }

    uploadFromFiles( event ) {
        this.addFiles( event.target.files );
    }

    addFiles( files ) {
        const currentImages = this.props.attributes.images || [];
        const { noticeOperations, setAttributes } = this.props;
        mediaUpload( {
            allowedType: 'image',
            filesList: files,
            onFileChange: ( images ) => {
                setAttributes( {
                    images: currentImages.concat( images ),
                } );
            },
            onError: noticeOperations.createErrorNotice,
        } );
    }

    componentDidUpdate( prevProps ) {
        // Deselect images when deselecting the block
        if ( ! this.props.isSelected && prevProps.isSelected ) {
            this.setState( {
                selectedImage: null,
                captionSelected: false,
            } );
        }
    }

    render() {
        const { attributes, isSelected, className, noticeOperations, noticeUI } = this.props;
        const { images, align } = attributes;

        const dropZone = (
            <DropZone
                onFilesDrop={ this.addFiles }
            />
        );

        const controls = (
            <BlockControls>
                { !! images.length && (
                    <Toolbar>
                        <MediaUpload
                            onSelect={ this.onSelectImages }
                            type="image"
                            multiple
                            gallery
                            value={ images.map( ( img ) => img.id ) }
                            render={ ( { open } ) => (
                                <IconButton
                                    className="components-toolbar__control"
                                    label={ __( 'Edit Carousel' ) }
                                    icon="edit"
                                    onClick={ open }
                                />
                            ) }
                        />
                    </Toolbar>
                ) }
            </BlockControls>
        );

        if ( images.length === 0 ) {
            return (
                <Fragment>
                    { controls }
                    <MediaPlaceholder
                        icon="format-gallery"
                        className={ className }
                        labels={ {
                            title: __( 'Carousel' ),
                            name: __( 'images' ),
                        } }
                        onSelect={ this.onSelectImages }
                        accept="image/*"
                        type="image"
                        multiple
                        notices={ noticeUI }
                        onError={ noticeOperations.createErrorNotice }
                    />
                </Fragment>
            );
        }

        return (
            <Fragment>
                { controls }
                { noticeUI }
                <ul className={ `${ className } align${ align }` }>
                    { dropZone }
                    { images.map( ( img, index ) => (
                        <li className="blocks-gallery-item" key={ img.id || img.url }>
                            <GalleryImage
                                url={ img.url }
                                alt={ img.alt }
                                id={ img.id }
                                isSelected={ isSelected && this.state.selectedImage === index }
                                onRemove={ this.onRemoveImage( index ) }
                                onSelect={ this.onSelectImage( index ) }
                                setAttributes={ ( attrs ) => this.setImageAttributes( index, attrs ) }
                                caption={ img.caption }
                            />
                        </li>
                    ) ) }
                    { isSelected &&
                        <li className="blocks-gallery-item has-add-item-button">
                            <FormFileUpload
                                multiple
                                isLarge
                                className="block-library-gallery-add-item-button"
                                onChange={ this.uploadFromFiles }
                                accept="image/*"
                                icon="insert"
                            >
                                { __( 'Upload an image' ) }
                            </FormFileUpload>
                        </li>
                    }
                </ul>
            </Fragment>
        );
    }
}

export default withNotices( GalleryEdit );
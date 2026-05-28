import { MediaUpload, MediaUploadCheck, useBlockProps, BlockControls, InspectorControls, RichText } from '@wordpress/block-editor';
import { Button, ToolbarGroup, ToolbarButton, FocalPointPicker, PanelBody } from '@wordpress/components';
import { useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';



export default function Edit({ attributes, setAttributes }) {
    const { url, alt, id, focalPoint, objectFit, caption, showCaption, captionHeight } = attributes;

    const onSelectImage = (media) => {
        if (!media || !media.url) return;

        setAttributes({
            id: media.id,
            url: media.url,
            alt: media.alt || '',
        });
    };

    const isCaptionVisible = showCaption || caption?.length > 0;
    
    const blockProps = useBlockProps({
        className: `swiper-slide ${showCaption ? 'has-caption' : ''}`,
        style: {
            textAlign: 'center',
            ...(showCaption
            ? { '--caption-height': attributes.captionHeight + 'px' }
            : {}),
        },
    });

    const captionRef = useRef(null);
    useEffect(() => {
        if (!showCaption || !captionRef.current) return;

        const height = captionRef.current.offsetHeight;

        if (height && height !== attributes.captionHeight) {
            setAttributes({ captionHeight: height });
        }
    }, [caption, showCaption]);

    return (
        <>
            {/* Toolbar boven het blok */}
            {url && (
                <BlockControls>
                    <ToolbarGroup>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={id}
                                render={({ open }) => (
                                    <ToolbarButton
                                        icon="edit"
                                        label={__('Afbeelding wijzigen', 'm-slider')}
                                        onClick={open}
                                    />
                                )}
                            />
                        </MediaUploadCheck>
                        
                        <ToolbarButton
                            icon="editor-textcolor"
                            label={__('Bijschrift tonen/verbergen', 'm-slider')}
                            isPressed={showCaption}
                            onClick={() =>
                                setAttributes({ showCaption: !showCaption })
                            }
                        />
                    </ToolbarGroup>
                </BlockControls>
            )}
            
            <div {...blockProps}>
                {url ? (
                    <figure>
                        <img
                            src={url}
                            alt={alt}
                            style={{
                                maxWidth: '100%',
                                marginBottom: '10px',
                                objectFit: 'cover',
                                width: '100%',
                                objectPosition: focalPoint ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : 'center'
                            }}
                        />

                        {isCaptionVisible && (
                            <div ref={captionRef} style={{ display: showCaption ? 'block' : 'none' }}>
                                <RichText
                                    tagName="figcaption"
                                    value={caption}
                                    allowedFormats={[]}
                                    onChange={(caption) => setAttributes({ caption })}
                                    placeholder={__('Voeg een bijschrift toe...', 'slider')}
                                />
                            </div>
                        )}
                    </figure>
                ) : (
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={id}
                            render={({ open }) => (
                                <Button onClick={open} icon="format-image" variant="primary">
                                    {__('Afbeelding kiezen', 'slider')}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                )}
            </div>

            {/* Focalpoint instellen voor de afbeelding */}
            {url && (
                <InspectorControls>
                    <PanelBody title={__('Afbeelding instellingen', 'slider')}>
                        <FocalPointPicker
                            url={url}
                            value={attributes.focalPoint}
                            onChange={(focalPoint) => setAttributes({ focalPoint })}
                        />
                    </PanelBody>
                </InspectorControls>
                
            )}
        </>
    );
}

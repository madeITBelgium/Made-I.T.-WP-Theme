import { MediaUpload, MediaUploadCheck, useBlockProps, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Button, ToolbarGroup, ToolbarButton, FocalPointPicker, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';



export default function Edit({ attributes, setAttributes }) {
    const { url, alt, id, focalPoint, objectFit } = attributes;

    const onSelectImage = (media) => {
        if (!media || !media.url) return;

        setAttributes({
            id: media.id,
            url: media.url,
            alt: media.alt || '',
        });
    };
    

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
                    </ToolbarGroup>
                </BlockControls>
            )}

            <div {...useBlockProps({ className: 'swiper-slide', style: { textAlign: 'center' } })}>
                {url ? (
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

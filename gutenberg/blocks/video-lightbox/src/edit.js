import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
} from '@wordpress/block-editor';

import {
    Button,
    PanelBody,
    RangeControl,
    SelectControl,
    TextControl,
    ToggleControl,
} from '@wordpress/components';


export default function Edit({
    attributes,
    setAttributes,
}) {
    const {
        videoUrl,
        videoId,
        posterUrl,
        posterId,
        videoTitle,
        controls,
        autoplay,
        loop,
        muted,
        closeOnOverlay,
        aspectRatio,
        playButtonSize,
        overlayOpacity,
    } = attributes;


    const [videoInput, setVideoInput] = useState(videoUrl || '');
    const [posterInput, setPosterInput] = useState(posterUrl || '');


    /*
     * ---------------------------------------------------------
     * VIDEO
     * ---------------------------------------------------------
     */

    function selectVideo(media) {
        if (!media) {
            return;
        }

        const url = media.url || '';

        setAttributes({
            videoUrl: url,
            videoId: media.id || 0,
            videoTitle: media.title || '',
        });

        setVideoInput(url);
    }


    function removeVideo() {
        setAttributes({
            videoUrl: '',
            videoId: 0,
            videoTitle: '',
        });

        setVideoInput('');
    }


    function updateVideoUrl(value) {
        setVideoInput(value);

        setAttributes({
            videoUrl: value,
            videoId: 0,
            videoTitle: '',
        });
    }


    /*
     * ---------------------------------------------------------
     * POSTER
     * ---------------------------------------------------------
     */

    function selectPoster(media) {
        if (!media) {
            return;
        }

        const url = media.url || '';

        setAttributes({
            posterUrl: url,
            posterId: media.id || 0,
        });

        setPosterInput(url);
    }


    function removePoster() {
        setAttributes({
            posterUrl: '',
            posterId: 0,
        });

        setPosterInput('');
    }


    function updatePosterUrl(value) {
        setPosterInput(value);

        setAttributes({
            posterUrl: value,
            posterId: 0,
        });
    }


    /*
     * ---------------------------------------------------------
     * BLOCK PROPS
     * ---------------------------------------------------------
     */

    const blockProps = useBlockProps({
        className: 'madeit-video-lightbox-block',
    });


    /*
     * ---------------------------------------------------------
     * EDITOR PREVIEW
     * ---------------------------------------------------------
     */

    return (
        <>
            <InspectorControls>

                {/* -------------------------------------------------
                    VIDEO
                -------------------------------------------------- */}

                <PanelBody
                    title={__('Video', 'madeit')}
                    initialOpen={true}
                >

                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={selectVideo}
                            allowedTypes={['video']}
                            value={videoId}
                            render={({ open }) => (
                                <Button
                                    variant="secondary"
                                    onClick={open}
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        marginBottom: '8px',
                                    }}
                                >
                                    {videoUrl
                                        ? __('Andere video kiezen', 'madeit')
                                        : __('Video uit mediabibliotheek kiezen', 'madeit')
                                    }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>


                    {videoUrl && (
                        <Button
                            variant="link"
                            isDestructive
                            onClick={removeVideo}
                            style={{
                                marginBottom: '12px',
                            }}
                        >
                            {__('Video verwijderen', 'madeit')}
                        </Button>
                    )}


                    <TextControl
                        __next40pxDefaultSize
                        label={__('Video URL', 'madeit')}
                        help={__(
                            'Je kunt ook rechtstreeks een video-URL invoeren.',
                            'madeit'
                        )}
                        value={videoInput}
                        onChange={updateVideoUrl}
                        type="url"
                    />

                </PanelBody>


                {/* -------------------------------------------------
                    POSTER
                -------------------------------------------------- */}

                <PanelBody
                    title={__('Poster / thumbnail', 'madeit')}
                    initialOpen={true}
                >

                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={selectPoster}
                            allowedTypes={['image']}
                            value={posterId}
                            render={({ open }) => (
                                <Button
                                    variant="secondary"
                                    onClick={open}
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        marginBottom: '8px',
                                    }}
                                >
                                    {posterUrl
                                        ? __('Andere afbeelding kiezen', 'madeit')
                                        : __('Afbeelding uit mediabibliotheek kiezen', 'madeit')
                                    }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>


                    {posterUrl && (
                        <Button
                            variant="link"
                            isDestructive
                            onClick={removePoster}
                            style={{
                                marginBottom: '12px',
                            }}
                        >
                            {__('Poster verwijderen', 'madeit')}
                        </Button>
                    )}
{/* 

                    <TextControl
                        __next40pxDefaultSize
                        label={__('Poster URL', 'madeit')}
                        help={__(
                            'Je kunt ook rechtstreeks een afbeelding-URL invoeren.',
                            'madeit'
                        )}
                        value={posterInput}
                        onChange={updatePosterUrl}
                        type="url"
                    /> */}

                </PanelBody>


                {/* -------------------------------------------------
                    VIDEO INSTELLINGEN
                -------------------------------------------------- */}

                <PanelBody
                    title={__('Video instellingen', 'madeit')}
                    initialOpen={false}
                >

                    <ToggleControl
                        __next40pxDefaultSize
                        label={__('Bediening tonen', 'madeit')}
                        checked={!!controls}
                        onChange={(value) =>
                            setAttributes({
                                controls: value,
                            })
                        }
                    />


                    <ToggleControl
                        __next40pxDefaultSize
                        label={__('Automatisch afspelen', 'madeit')}
                        help={__(
                            'Browsers kunnen autoplay blokkeren wanneer de video niet gedempt is.',
                            'madeit'
                        )}
                        checked={!!autoplay}
                        onChange={(value) =>
                            setAttributes({
                                autoplay: value,
                            })
                        }
                    />


                    <ToggleControl
                        __next40pxDefaultSize
                        label={__('Herhalen', 'madeit')}
                        checked={!!loop}
                        onChange={(value) =>
                            setAttributes({
                                loop: value,
                            })
                        }
                    />


                    <ToggleControl
                        __next40pxDefaultSize
                        label={__('Gedempt starten', 'madeit')}
                        checked={!!muted}
                        onChange={(value) =>
                            setAttributes({
                                muted: value,
                            })
                        }
                    />

                </PanelBody>


                {/* -------------------------------------------------
                    LIGHTBOX
                -------------------------------------------------- */}

                <PanelBody
                    title={__('Lightbox', 'madeit')}
                    initialOpen={false}
                >

                    <RangeControl
                        __next40pxDefaultSize
                        label={__('Overlay transparantie', 'madeit')}
                        value={overlayOpacity}
                        min={0}
                        max={100}
                        step={5}
                        onChange={(value) =>
                            setAttributes({
                                overlayOpacity: value,
                            })
                        }
                        help={__(
                            '100% = volledig zwart.',
                            'madeit'
                        )}
                    />


                    <ToggleControl
                        __next40pxDefaultSize
                        label={__('Sluiten bij klikken naast video', 'madeit')}
                        checked={!!closeOnOverlay}
                        onChange={(value) =>
                            setAttributes({
                                closeOnOverlay: value,
                            })
                        }
                    />

                </PanelBody>


                {/* -------------------------------------------------
                    WEERGAVE
                -------------------------------------------------- */}

                <PanelBody
                    title={__('Weergave', 'madeit')}
                    initialOpen={false}
                >

                    <SelectControl
                        __next40pxDefaultSize
                        label={__('Beeldverhouding', 'madeit')}
                        value={aspectRatio}
                        options={[
                            {
                                label: __('16:9', 'madeit'),
                                value: '16/9',
                            },
                            {
                                label: __('4:3', 'madeit'),
                                value: '4/3',
                            },
                            {
                                label: __('1:1', 'madeit'),
                                value: '1/1',
                            },
                            {
                                label: __('9:16', 'madeit'),
                                value: '9/16',
                            },
                            {
                                label: __('Automatisch', 'madeit'),
                                value: 'auto',
                            },
                        ]}
                        onChange={(value) =>
                            setAttributes({
                                aspectRatio: value,
                            })
                        }
                    />


                    <RangeControl
                        __next40pxDefaultSize
                        label={__('Grootte play-knop', 'madeit')}
                        value={playButtonSize}
                        min={40}
                        max={160}
                        step={5}
                        onChange={(value) =>
                            setAttributes({
                                playButtonSize: value,
                            })
                        }
                    />

                </PanelBody>

            </InspectorControls>


            {/* -----------------------------------------------------
                EDITOR
            ------------------------------------------------------ */}

            <div {...blockProps}>

                {!videoUrl ? (

                    <div className="madeit-video-lightbox__placeholder">

                        <div className="madeit-video-lightbox__placeholder-icon">
                            ▶
                        </div>

                        <p>
                            {__('Selecteer een video om de Video Lightbox te gebruiken.', 'madeit')}
                        </p>

                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={selectVideo}
                                allowedTypes={['video']}
                                value={videoId}
                                render={({ open }) => (
                                    <Button
                                        variant="primary"
                                        onClick={open}
                                    >
                                        {__('Video kiezen', 'madeit')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>

                    </div>

                ) : (

                    <div
                        className="madeit-video-lightbox__preview"
                        style={{
                            '--madeit-video-lightbox-play-size': `${playButtonSize}px`,
                            '--madeit-video-lightbox-aspect-ratio': aspectRatio,
                        }}
                    >

                        {posterUrl ? (

                            <img
                                src={posterUrl}
                                alt={videoTitle || __('Video poster', 'madeit')}
                                className="madeit-video-lightbox__poster"
                            />

                        ) : (

                            <video
                                src={videoUrl}
                                className="madeit-video-lightbox__poster"
                                muted
                                playsInline
                                preload="metadata"
                            />

                        )}


                        <div className="madeit-video-lightbox__play">
                            <span>▶</span>
                        </div>

                    </div>

                )}

            </div>
        </>
    );
}
import { useBlockProps } from '@wordpress/block-editor';


export default function Save({
    attributes,
}) {
    const {
        videoUrl,
        posterUrl,
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


    const blockProps = useBlockProps.save({
        className: 'madeit-video-lightbox-block',
    });


    if (!videoUrl) {
        return (
            <div {...blockProps}>
                <div className="madeit-video-lightbox__placeholder">
                    <p>
                        Video ontbreekt.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div {...blockProps}>

            <button
                type="button"
                className="madeit-video-lightbox__trigger"
                aria-label={
                    videoTitle
                        ? `Video afspelen: ${videoTitle}`
                        : 'Video afspelen'
                }
                data-video-url={videoUrl}
                data-poster-url={posterUrl || ''}
                data-video-title={videoTitle || ''}
                data-controls={controls ? '1' : '0'}
                data-autoplay={autoplay ? '1' : '0'}
                data-loop={loop ? '1' : '0'}
                data-muted={muted ? '1' : '0'}
                data-close-on-overlay={closeOnOverlay ? '1' : '0'}
                data-aspect-ratio={aspectRatio || '16/9'}
                data-play-button-size={playButtonSize || 80}
                data-overlay-opacity={overlayOpacity ?? 90}
            >

                {posterUrl ? (

                    <img
                        src={posterUrl}
                        alt={videoTitle || 'Video'}
                        className="madeit-video-lightbox__poster"
                    />

                ) : (

                    <video
                        className="madeit-video-lightbox__poster"
                        src={videoUrl}
                        muted
                        playsInline
                        preload="metadata"
                    />

                )}


                <span
                    className="madeit-video-lightbox__play"
                    aria-hidden="true"
                    style={{
                        '--madeit-video-lightbox-play-size': `${playButtonSize || 80}px`,
                    }}
                >
                    <span>▶</span>
                </span>

            </button>

        </div>
    );
}
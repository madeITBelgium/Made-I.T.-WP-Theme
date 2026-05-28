import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { url, alt, caption, linkUrl, linkTarget, height, objectFit, showCaption, captionHeight } = attributes;

    const blockProps = useBlockProps.save({
        className: 'swiper-slide',
    });

    const img = <img src={url} alt={alt || ''} />;

    const rel = linkTarget === '_blank' ? 'noopener noreferrer' : undefined;

    return url ? (
        <div
            {...blockProps}
            style={{
                height: attributes.height,
                objectFit: attributes.objectFit,
            }}
        >
            {linkUrl ? (
                <a href={linkUrl} target={linkTarget || '_self'} rel={rel}>
                    {img}
                </a>
            ) : (
                img
            )}

            {showCaption && caption && (
                <figcaption>
                    <RichText.Content value={caption} />
                </figcaption>
            )}
        </div>
    ) : null;
}

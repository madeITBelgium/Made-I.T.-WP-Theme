import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { url, alt, caption, linkUrl, linkTarget } = attributes;

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

            {caption ? (
                <div className="swiper-caption">
                    <RichText.Content tagName="div" value={caption} />
                </div>
            ) : null}
        </div>
    ) : null;
}

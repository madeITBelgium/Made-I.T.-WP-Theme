import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { url, alt } = attributes;

    return url ? (
        <div {...useBlockProps.save()} className="swiper-slide" style={{ height: attributes.height, objectFit: attributes.objectFit }}>
            <img src={url} alt={alt} />
        </div>
    ) : null;
}

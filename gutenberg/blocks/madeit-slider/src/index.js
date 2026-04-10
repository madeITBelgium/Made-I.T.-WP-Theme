/**
 * BLOCK: slider
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const icon = {
    src: (
        <svg xmlns="http://www.w3.org/2000/svg"width="24" height="24" viewBox="0 0 200 154" version="1.1">
            <g transform="matrix(1,0,0,1,-249.594603,-25.218512)">
                <g id="SVGRepo_iconCarrier" transform="matrix(13.333333,0,0,13.333333,222.5497,-41.031488)">
                    <g transform="matrix(0.06,0,0,0.07,-11.5,3.5)">
                        <path 
                        d="M393,34.433L393,163.504C393,172.039 386.176,178.969 377.772,178.969L323.228,178.969C314.824,178.969 308,172.039 308,163.504L308,34.433C308,25.898 314.824,18.969 323.228,18.969L377.772,18.969C386.176,18.969 393,25.898 393,34.433Z"
                        fill="none"
                        stroke="rgb(71,106,138)"
                        strokeWidth="14.08px"
                        fillRule="nonzero"
                        />
                    </g>
                    <g transform="matrix(0.03094,0,0,0.054438,-7.032526,5.144863)">
                        <path d="M393,36.956L393,160.981C393,170.909 378.819,178.969 361.353,178.969L339.647,178.969C322.181,178.969 308,170.909 308,160.981L308,36.956C308,27.028 322.181,18.969 339.647,18.969L361.353,18.969C378.819,18.969 393,27.028 393,36.956Z" 
                        fill="none"
                        stroke="rgb(28,172,180)"
                        strokeWidth="21.17px"
                        fillRule="nonzero"
                        />
                    </g>
                    <g transform="matrix(0.03094,0,0,0.054438,4.357953,5.144863)">
                        <path d="M393,36.956L393,160.981C393,170.909 378.819,178.969 361.353,178.969L339.647,178.969C322.181,178.969 308,170.909 308,160.981L308,36.956C308,27.028 322.181,18.969 339.647,18.969L361.353,18.969C378.819,18.969 393,27.028 393,36.956Z" 
                        fill="none"
                        stroke="rgb(28,172,180)"
                        strokeWidth="21.17px"
                        fillRule="nonzero"
                        />
                    </g>
                </g>
            </g>
        </svg>
    ),
};

function normalizeSpaceBetween(value) {
    if (value === undefined || value === null || value === '') return '10px';
    if (typeof value === 'number' && Number.isFinite(value)) return `${value}px`;
    const raw = String(value).trim();
    if (!raw) return '10px';
    // If it's a plain number, treat as px.
    if (/^[0-9]*\.?[0-9]+$/.test(raw)) return `${raw}px`;
    return raw;
}

// Deprecated save: older content did not include `data-space-between` and `data-touch-slides`.
function DeprecatedSaveV1({ attributes }) {
    const {
        effect = 'slide',
        slidesDesktop = 1, slidesTablet = 1, slidesMobile = 1,
        height = '300px',
        spaceBetween = '10px', objectFit = 'cover',
        navigation = false,
        navigationPosition = 'outside',
        navigationIconColor = '#000',
        navigationBackgroundColor = '#fff',
        navigationIconSize = 24,
        navigationBorderRadius = 50,
        navigationBorderWidth = '1px',
        navigationBorderStyle = 'solid',
        navigationBorderColor = '#ccc',
        // IMPORTANT: older markup did not serialize data-touch-slides
        pagination = false,
        paginationType = 'bullets',
        paginationInside = false,
        paginationDynamic = false,
        paginationMaxBullets = 5,
        paginationActiveColor = '#000',
        autoplay = true,
        speed = 5000,
        loop = false,
    } = attributes;

    const effectiveMinHeight = attributes?.minHeight ?? attributes?.minheight ?? '300px';
    const normalizedSpaceBetween = normalizeSpaceBetween(spaceBetween);

    const blockProps = useBlockProps.save({
        className: 'm-slider_front',
        style: {
            '--height': height,
            '--spaceBetween': normalizedSpaceBetween,
            '--minheight': effectiveMinHeight,
            '--swiper-space-between': normalizedSpaceBetween,
            '--navigationIconSize': navigationIconSize + 'px',
            '--paginationActiveColor': paginationActiveColor,
            '--objectFit': objectFit || 'cover',
        },
    });

    return (
        <div
            className="m-slider"
            data-slides-desktop={slidesDesktop}
            data-slides-tablet={slidesTablet}
            data-slides-mobile={slidesMobile}
            data-speed={speed}
            data-autoplay={autoplay}
            data-loop={loop}
            data-navigation={navigation}
            data-pagination={pagination}
            data-effect={effect}
            data-cross-fade={effect === 'fade'}
            data-pagination-type={pagination ? paginationType : 'false'}
            {...blockProps}
        >
            <div className="swiper" style={{ overflow: 'hidden', height: height, minHeight: effectiveMinHeight }}>
                <div className="swiper-wrapper">
                    <InnerBlocks.Content />
                </div>
            </div>

            {navigation && (
                <>
                    <div className={`swiper-button ${navigationPosition}`}>
                        <button className="swiper-button-prev" aria-label="Vorige slide" style={{ backgroundColor: navigationBackgroundColor, color: navigationIconColor, width: navigationIconSize, height: navigationIconSize, border: navigationBorderWidth ? `${navigationBorderWidth} ${navigationBorderStyle} ${navigationBorderColor}` : 'none', borderRadius: navigationBorderRadius }}></button>
                        <button className="swiper-button-next" aria-label="Volgende slide" style={{ backgroundColor: navigationBackgroundColor, color: navigationIconColor, width: navigationIconSize, height: navigationIconSize, border: navigationBorderWidth ? `${navigationBorderWidth} ${navigationBorderStyle} ${navigationBorderColor}` : 'none', borderRadius: navigationBorderRadius }}></button>
                    </div>
                </>
            )}

            {pagination && (
                <div className={`swiper-pagination swiper-pagination-${paginationType} ${paginationInside ? 'inside' : 'outside'}${paginationDynamic ? ' swiper-pagination-dynamic' : ''}`}>
                    {paginationType === 'bullets' && !paginationDynamic && (
                        <>
                            <span className="swiper-pagination-bullet swiper-pagination-bullet-active" />
                            <span className="swiper-pagination-bullet" />
                            <span className="swiper-pagination-bullet" />
                        </>
                    )}
                    {paginationType === 'fraction' && (
                        <span className="swiper-pagination-fraction">1 / 3</span>
                    )}
                    {paginationType === 'progressbar' && (
                        <div className="progressbar--preview" style={{ width: '30%', height: '4px', background: '#888' }} />
                    )}

                    {paginationDynamic && (
                        <div className="swiper-pagination-dynamic">
                            {Array.from({ length: paginationMaxBullets }, (_, i) => (
                                <span key={i} className={`swiper-pagination-bullet ${i === 0 ? 'swiper-pagination-bullet-active' : ''}`} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    deprecated: [
        {
            attributes: {
                ...metadata.attributes,
                // Prior schema accepted `spaceBetween` as number in some posts.
                spaceBetween: { type: 'string', default: '10px' },
            },
            migrate: (attributes) => {
                return {
                    ...attributes,
                    spaceBetween: normalizeSpaceBetween(attributes?.spaceBetween),
                    // Ensure newer attributes exist so next save writes them.
                    touchSlides: attributes?.touchSlides ?? true,
                };
            },
            save: DeprecatedSaveV1,
        },
    ],
    transforms: {
        from: [
            {
                type: 'block',
                blocks: ['madeit/block-carousel'],
                transform: (attributes = {}) => {
                    const { images = [], anchor } = attributes;

                    const innerBlocks = (Array.isArray(images) ? images : [])
                        .filter((image) => image && image.url)
                        .map((image) =>
                            createBlock('madeit/slider-image', {
                                id: image.id ? Number(image.id) : undefined,
                                url: image.url,
                                alt: image.alt || '',
                                caption: Array.isArray(image.caption)
                                    ? image.caption
                                          .map((part) => (typeof part === 'string' ? part : ''))
                                          .join('')
                                    : image.caption || '',
                                linkUrl: image.link || '',
                                linkTarget: '_self',
                            })
                        );

                    return createBlock(
                        'madeit/slider',
                        {
                            anchor,
                            slidesDesktop: 1,
                            slidesTablet: 1,
                            slidesMobile: 1,
                            navigation: true,
                            pagination: true,
                            paginationType: 'bullets',
                            autoplay: false,
                            loop: false,
                        },
                        innerBlocks
                    );
                },
            },
        ],
    },
    edit: Edit,
    save: Save,
});

// Register child block
import './image';
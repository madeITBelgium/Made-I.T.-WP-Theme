/**
 * Save the block content to the frontend.
 * 
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const {
        // Slider effect
        effect = 'slide',
        // Slides per view
        slidesDesktop = 1, slidesTablet = 1, slidesMobile = 1,
        // Height and space
        height = '300px',
        spaceBetween = '10px', objectFit = 'cover',
        // Navigation
        navigation = false,
        navigationPosition = 'outside',
        navigationIconColor = '#000',
        navigationBackgroundColor = '#fff',
        navigationIconSize = 24,
        navigationBorderRadius = 50,
        navigationBorderWidth = '1px',
        navigationBorderStyle = 'solid',
        navigationBorderColor = '#ccc',

        touchSlides = false,
        // Pagination
        pagination = false,
        paginationType = 'bullets',
        paginationInside = false,
        paginationDynamic = false,
        paginationMaxBullets = 5,
        paginationActiveColor = '#000',
        // Autoplay
        autoplay = false,
        speed = 3000,
        loop = false,        
       
    } = attributes;

    // Backwards compatibility: some older content used `minheight` instead of `minHeight`.
    const effectiveMinHeight = attributes?.minHeight ?? attributes?.minheight ?? '300px';

    // Set the block properties for saving
    const blockProps = useBlockProps.save({
        className: 'm-slider_front',
        style: {
            '--height': height,
            '--spaceBetween': spaceBetween,
            '--minheight': effectiveMinHeight,
            '--swiper-space-between': spaceBetween,
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
            data-pagination-type={pagination === true ? 'bullets' : pagination}
            {...blockProps}
        >
            <div className="swiper" style={{ overflow: 'hidden', height: height, minHeight: effectiveMinHeight }}>
                <div className="swiper-wrapper">
                    <InnerBlocks.Content />
                </div>
            </div>

            {navigation && (
                <>
                    <div className={`swiper-button ${navigationPosition }`}>
                        <button className="swiper-button-prev" aria-label="Vorige slide" style={{ backgroundColor: navigationBackgroundColor, color: navigationIconColor, width: navigationIconSize, height: navigationIconSize , border: navigationBorderWidth ? `${navigationBorderWidth} ${navigationBorderStyle} ${navigationBorderColor}` : 'none', borderRadius: navigationBorderRadius }}></button>
                        <button className="swiper-button-next" aria-label="Volgende slide" style={{ backgroundColor: navigationBackgroundColor, color: navigationIconColor, width: navigationIconSize, height: navigationIconSize , border: navigationBorderWidth ? `${navigationBorderWidth} ${navigationBorderStyle} ${navigationBorderColor}` : 'none', borderRadius: navigationBorderRadius }}></button>
                    </div>
                </>
            )}

            {pagination && (
                <div
                className={`swiper-pagination swiper-pagination-${paginationType} ${paginationInside ? 'inside' : 'outside'}${paginationDynamic ? ' swiper-pagination-dynamic' : ''}`}
                >
                    {/* Static dummy bullets for frontend, JS will replace */}
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

                    { paginationDynamic && (
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

import { InnerBlocks, InspectorControls, MediaPlaceholder, useBlockProps, MediaUpload, MediaUploadCheck, BlockControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl, Button, ButtonGroup, TextControl, SelectControl, __experimentalUnitControl as UnitControl, ColorPalette, Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch, select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { ControlHeader } from '../../../shared';

// Images

export default function Edit({ attributes, setAttributes, clientId }) {
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

    const DIMENSION_UNITS = [
        { value: 'px', label: 'px', default: 0 },
        { value: 'em', label: 'em', default: 0 },
        { value: 'rem', label: 'rem', default: 0 },
        { value: 'vh', label: 'vh', default: 0 },
        { value: '%', label: '%', default: 0 },
    ];

    const blockProps = useBlockProps({
        style: {
            '--slides-desktop': slidesDesktop,
            '--slides-tablet': slidesTablet,
            '--slides-mobile': slidesMobile,
            '--height': height,
            '--spaceBetween': spaceBetween,
            '--minheight': effectiveMinHeight,
            '--navigationIconColor': navigationIconColor,
            '--navigationBackgroundColor': navigationBackgroundColor,
            '--objectFit': objectFit || 'cover',
            '--navigationPosition': navigationPosition,

            '--navigationIconSize': navigationIconSize + 'px',
        },
        'data-effect': effect
    });

    const innerBlocks = useSelect(
        (select) => select('core/block-editor').getBlocks(clientId),
        [clientId]
    );

    const valueMap = {
        desktop: slidesDesktop,
        tablet: slidesTablet,
        mobile: slidesMobile
    };

    const DISABLED_EFFECTS = ['cube', 'coverflow', 'flip', 'creative'];
    const SwiperEffectSelector = ({ selectedEffect, onChange }) => {
    const effects = ['slide', 'fade', 'cube', 'coverflow', 'flip', 'creative'];

    return (
        <div className="effect-selector">
            {effects.map((effect) => {
                const isDisabled = DISABLED_EFFECTS.includes(effect);
                const isActive = selectedEffect === effect;

                    return (
                        <div
                            key={effect}
                            className={`
                                effect-box
                                ${effect}
                                ${isActive ? 'active' : ''}
                                ${isDisabled ? 'is-disabled' : ''}
                            `}
                            onClick={() => {
                                if (!isDisabled) {
                                    onChange(effect);
                                }
                            }}
                            role="button"
                            aria-disabled={isDisabled}
                        >
                            <div className="effect-label">{effect}</div>

                            <div className={`motion motion-${effect}`}>
                                <div className="page">
                                    <div className="swiper">
                                        <div className="wrapper">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="swiper-slide">
                                                    <div className="swiper-slide-bg" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isDisabled && (
                                <div className="effect-overlay">
                                    <span>{__('Binnenkort beschikbaar', 'slider')}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };


    const themeColors = select('core/block-editor').getSettings().colors || [];

    const iconColorPopover = ({ value, onChange, themeColors }) => {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <Button onClick={() => setIsVisible((v) => !v)}>
                <span
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: value || '#000',
                        borderRadius: '50%',
                        border: '1px solid #ccc'
                    }}
                ></span>
                {isVisible && (
                    <Popover>
                        <ColorPalette
                            colors={themeColors}
                            value={value}
                            onChange={onChange}
                            enableAlpha
                        />
                    </Popover>
                )}
            </Button>
        );
    };

   const BackgroundColorPopover = ({ value, onChange, themeColors }) => {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <Button onClick={() => setIsVisible((v) => !v)}>
                <span
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: value || '#000',
                        borderRadius: '50%',
                        border: '1px solid #ccc'
                    }}
                ></span>
                {isVisible && (
                    <Popover>
                        <ColorPalette
                            colors={themeColors}
                            value={value}
                            onChange={onChange}
                            enableAlpha
                        />
                    </Popover>
                )}
            </Button>
        );
    };


    const NavigationBorderColorPopover = ({ value, onChange, themeColors }) => {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <Button onClick={() => setIsVisible((v) => !v)}>
                <span
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: value || '#000',
                        borderRadius: '50%',
                        border: '1px solid #ccc'
                    }}
                ></span>
                {isVisible && (
                    <Popover>
                        <ColorPalette
                            colors={themeColors}
                            value={value}
                            onChange={onChange}
                            enableAlpha
                        />
                    </Popover>
                )}
            </Button>
        );
    };

    const PaginationActiveColorPopover = ({ value, onChange, themeColors }) => {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <Button onClick={() => setIsVisible((v) => !v)}>
                <span
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: value || '#000',
                        borderRadius: '50%',
                        border: '1px solid #ccc'
                    }}
                ></span>
                {isVisible && (
                    <Popover>
                        <ColorPalette
                            colors={themeColors}
                            value={value}
                            onChange={onChange}
                            enableAlpha
                        />
                    </Popover>
                )}
            </Button>
        );
    };

    const [ activeSlidesPerViewBreakpoint, setActiveSlidesPerViewBreakpoint ] = useState( 'desktop' );
    const SlidesPerViewValueKey =
        activeSlidesPerViewBreakpoint === 'tablet'
            ? 'slidesTablet'
            : activeSlidesPerViewBreakpoint === 'mobile'
                ? 'slidesMobile'
                : 'slidesDesktop';

    const currentSlidesPerViewValue = attributes?.[ SlidesPerViewValueKey ];
    const resetSlidesPerView = () =>
        setAttributes( {
            [ SlidesPerViewValueKey ]: undefined,
        } );

    const device = activeSlidesPerViewBreakpoint;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Slider Instellingen', 'm-slider')}>
                    {/* 1. Choose slider effect */}
                    <SwiperEffectSelector
                        selectedEffect={effect}
                        onChange={(val) => setAttributes({ effect: val })}
                    />

                    {/* 2. Slider settings / effect */}
                    {attributes.effect === 'slide' && (
                        <>
                            {/* Aantal slides */}
                            <div className="madeit-control" style={{ marginTop: '30px' }}>
                                <ControlHeader
                                    title={ __( 'Slides per view' ) }
                                    breakpoint={ activeSlidesPerViewBreakpoint }
                                    onBreakpointChange={ setActiveSlidesPerViewBreakpoint }
                                />
    
                                <div className="madeit-control-rangeRow">
                                    <RangeControl
                                        value={valueMap[activeSlidesPerViewBreakpoint]}
                                        onChange={(val) => {
                                            if (activeSlidesPerViewBreakpoint === 'desktop') setAttributes({ slidesDesktop: val });
                                            else if (activeSlidesPerViewBreakpoint === 'tablet') setAttributes({ slidesTablet: val });
                                            else if (activeSlidesPerViewBreakpoint === 'mobile') setAttributes({ slidesMobile: val });
                                        }}
                                        min={1}
                                        max={5}
                                        step={0.5}
                                    />
    
                                    <Button
                                        className="madeit-control-rangeRow__reset"
                                        icon="undo"
                                        variant="tertiary"
                                        onClick={ resetSlidesPerView }
                                        showTooltip
                                        label={ __( 'Reset slides per view' ) }
                                    />
                                </div>
                            </div>

                            {/* Hoogte instellingen */}
                            <div className="m_slider_height_value" style={{ display: 'flex', gap: '10px' }}>
                                <UnitControl
                                    label={__('Hoogte', 'slider')}
                                    value={height}
                                    onChange={(val) => setAttributes({ height: val })}
                                    units={DIMENSION_UNITS}
                                />
                                <UnitControl
                                    label={__('Min hoogte', 'slider')}
                                    value={effectiveMinHeight}
                                    onChange={(val) => setAttributes({ minHeight: val })}
                                    units={DIMENSION_UNITS}
                                />
                            </div>

                            {/* Space beetween items */}
                            <div className="m_slider_setting" style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ width: '30%' }}>
                                    <UnitControl
                                        label={__('Ruimte', 'slider')}
                                        value={attributes.spaceBetween || '10px' }
                                        onChange={(val) => setAttributes({ spaceBetween: val })}
                                        min={0}
                                        max={100}
                                        step={1}
                                        units={DIMENSION_UNITS}
                                    />
                                </div>

                                {/* Afbeelding weergave */}
                                <div style={{ width: '70%' }}>
                                    <SelectControl
                                        label={__('Afbeelding weergave', 'slider')}
                                        value={objectFit || 'cover'}
                                        onChange={(val) => setAttributes({ objectFit: val })}
                                        options={[
                                            { label: __('Cover', 'slider'), value: 'cover' },
                                            { label: __('Contain', 'slider'), value: 'contain' },
                                            { label: __('Fill', 'slider'), value: 'fill' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <hr></hr>

                            {/* Navigatie */}
                            <ToggleControl
                                label={__('Navigatie', 'slider')}
                                checked={navigation}
                                onChange={(val) => setAttributes({ navigation: val })}
                            />
                            {navigation && (
                                <>
                                 {/* Pictogramstijl kiezen */}
                                    <SelectControl
                                        label={__('Navigatiepositie', 'slider')}
                                        value={attributes.navigationPosition || 'outside'}
                                        onChange={(val) => setAttributes({ navigationPosition: val })}
                                        options={[
                                            { label: __('Buiten de afbeelding', 'slider'), value: 'outside' },
                                            { label: __('Binnen de afbeelding', 'slider'), value: 'inside' },
                                            { label: __('Links onderaan', 'slider'), value: 'left_bottom' },
                                            { label: __('Rechts onderaan', 'slider'), value: 'right_bottom' },
                                            { label: __('Links bovenaan', 'slider'), value: 'left_top' },
                                            { label: __('Rechts bovenaan', 'slider'), value: 'right_top' }
                                        ]}
                                    />

                                    {/* Kleur en grootte */}
                                    <div className="madeit-control" style={{ marginTop: '30px' }}>
                                        
                                        {/* Add the iconColorPopover */}
                                        <PanelColorSettings
                                            title={ __( 'Navigatie kleur', 'slider' ) }
                                            initialOpen={ true }
                                            colorSettings={ [
                                                {
                                                    value: navigationIconColor,
                                                    label: __( 'Icon kleur', 'slider' ),
                                                    onChange: ( value ) => setAttributes( { navigationIconColor: value } ),
                                                },
                                                {
                                                    value: navigationBackgroundColor,
                                                    label: __( 'Achtergrondkleur', 'slider' ),
                                                    onChange: ( value ) => setAttributes( { navigationBackgroundColor: value } ),
                                                },
                                            ] }
                                        />
                                    </div>
                                    
                                    <RangeControl
                                        label={__('Grootte (px)', 'slider')}
                                        value={attributes.navigationIconSize || 24}
                                        onChange={(val) => setAttributes({ navigationIconSize: val })}
                                        min={12}
                                        max={60}
                                    />
                                    {/*  navigationBorderRadius = 50,
                                        navigationBorder = '1px solid #ccc', */}

                                    <RangeControl
                                        label={__('Border radius (px)', 'slider')}
                                        value={navigationBorderRadius || 50}
                                        onChange={(val) => setAttributes({ navigationBorderRadius: val })}
                                        min={0}
                                        max={100}
                                        step={1}
                                    />
                                    <div className="m-slider-border-preview" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <UnitControl
                                            label={__('Border', 'slider')}
                                            value={navigationBorderWidth || '1px'}
                                            onChange={(val) => setAttributes({ navigationBorderWidth: val })}
                                            units={['px']}
                                        />
                                        <SelectControl
                                            label={__('Border stijl', 'slider')}
                                            value={navigationBorderStyle || 'solid'}
                                            onChange={(val) => setAttributes({ navigationBorderStyle: val })}
                                            options={[
                                                { label: __('Solid', 'slider'), value: 'solid' },
                                                { label: __('Dotted', 'slider'), value: 'dotted' },
                                                { label: __('Dashed', 'slider'), value: 'dashed' },
                                                { label: __('Double', 'slider'), value: 'double' },
                                                { label: __('Groove', 'slider'), value: 'groove' },
                                                { label: __('Ridge', 'slider'), value: 'ridge' },
                                                { label: __('Inset', 'slider'), value: 'inset' },
                                                { label: __('Outset', 'slider'), value: 'outset' }
                                            ]}
                                        />
                                        

                                    </div>
                                    {/* Add the navigationBorderColorPopover */}
                                    <div className="m-slider-colorpicker" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                                        <p style={{margin: '0'}}><strong>{__('Border kleur', 'slider')}</strong></p>
                                        <NavigationBorderColorPopover
                                            value={navigationBorderColor}
                                            onChange={(color) => setAttributes({ navigationBorderColor: color })}
                                            themeColors={themeColors}
                                        />
                                    </div>

                                    <ToggleControl
                                        label={__('Touch slide activeren', 'slider')}
                                        checked={touchSlides || false}
                                        onChange={(val) => setAttributes({ touchSlides: val })}
                                    />
                                    <em> {/* Add a note about touch slides */}
                                        {__('Activeer deze optie om slides te kunnen slepen op mobiele apparaten.', 'slider')}
                                    </em>          
                                </>
                            )}


                            <hr></hr>
                            {/* Paginatie */}
                            <ToggleControl
                                label={__('Paginatie', 'slider')}
                                checked={pagination}
                                onChange={(val) => setAttributes({ pagination: val })}
                            />
                            {pagination && (
                                <>
                                <SelectControl
                                    label={__('Paginatie type', 'slider')}
                                    value={paginationType}
                                    onChange={(val) => setAttributes({ paginationType: val })}
                                    options={[
                                        { label: __('Bullets', 'slider'), value: 'bullets' },
                                        { label: __('Fraction', 'slider'), value: 'fraction' },
                                        { label: __('Progressbar', 'slider'), value: 'progressbar' },
                                    ]}
                                />
                                {/* Dynamische bullets */}
                                { attributes.paginationType === 'bullets' && (
                                    <>
                                        <ToggleControl
                                            label={__('dynamic bullets', 'slider')}
                                            checked={attributes.paginationDynamic}
                                            onChange={(val) => setAttributes({ paginationDynamic: val })}
                                        />
                                        {attributes.paginationDynamic && (
                                            <TextControl
                                                label={__('Max aantal bullets', 'slider')}
                                                value={attributes.paginationMaxBullets || ''}
                                                onChange={(val) => setAttributes({ paginationMaxBullets: val })}
                                                placeholder={__('Max aantal bullets', 'slider')}
                                                type="number"
                                                min={1}
                                                max={10}
                                                step={1}
                                            />
                                        )}

                                        {/* Paginatie kleur */}
                                
                                        <div className="m-slider-colorpicker" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                                            <p style={{margin: '0'}}><strong>{__('Actieve bullet kleur', 'slider')}</strong></p>
                                            {/* Add the paginationActiveColorPopover */}
                                            <PaginationActiveColorPopover
                                                value={paginationActiveColor}
                                                onChange={(color) => setAttributes({ paginationActiveColor: color })}
                                                themeColors={themeColors}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Onder de afbeelding of in de afbeelding pagination tonen */}
                                <div className="button-group-wrapper">
                                    <Button
                                        variant={!paginationInside ? 'primary' : 'secondary'}
                                        onClick={() => setAttributes({ paginationInside: false })}
                                    >
                                        {__('Buiten', 'slider')}
                                    </Button>
                                    <Button
                                        variant={paginationInside ? 'primary' : 'secondary'}
                                        onClick={() => setAttributes({ paginationInside: true })}
                                    >
                                        {__('Binnen', 'slider')}
                                    </Button>
                                </div>
                            
                                </>
                            )}
                        </>
                    )}

                    

                    
                    {/* Every type */}
                    <hr></hr>

                    <ToggleControl
                        label={__('Autoplay', 'slider')}
                        checked={autoplay}
                        onChange={(val) => setAttributes({ autoplay: val })}
                    />

                    {autoplay && (
                        <>
                            <RangeControl
                                label={__('Autoplay snelheid (ms)', 'slider')}
                                value={speed}
                                onChange={(val) => setAttributes({ speed: val })}
                                min={1000}
                                max={10000}
                                step={500}
                            />
                            <ToggleControl
                                label={__('Loop', 'slider')}
                                checked={loop}
                                onChange={(val) => setAttributes({ loop: val })}
                            />
                        </>
                    )}
                </PanelBody>

            </InspectorControls>
                <BlockControls> 
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={(media) => {
                            const { insertBlocks } = dispatch('core/block-editor');
                            const { getBlocks } = select('core/block-editor');

                            const images = Array.isArray(media) ? media : [media];
                            if (!images.length) return;

                            // Haal bestaande blokken op en filter al toegevoegde afbeeldingen
                            const existingBlocks = getBlocks(clientId);
                            const existingImageUrls = existingBlocks.map((block) => block.attributes.url);

                            const newImages = images.filter((img) => !existingImageUrls.includes(img.url));
                            if (!newImages.length) return;

                            const blocks = newImages.map((img) =>
                                createBlock('madeit/slider-image', {
                                    id: img.id,
                                    url: img.url,
                                    alt: img.alt || '',
                                    caption: img.caption || '',
                                    title: img.title || '',
                                    description: img.description || '',
                                    width: img.width || 0,
                                    height: img.height || 0
                                })
                            );

                            insertBlocks(blocks, undefined, clientId); 
                        }}
                            value={innerBlocks.map((block) => block.attributes.id)}
                            accept="image/*"
                            allowedTypes={['image']}
                            multiple
                            gallery
                            render={({ open }) => (
                                <Button
                                    className="components-toolbar-button"
                                    onClick={open}
                                    icon="format-gallery"
                                    label={__('Afbeeldingen toevoegen', 'slider')}
                                    showTooltip
                                />
                            )}
                        />
                    </MediaUploadCheck>
                </BlockControls>

                <div {...blockProps}>
                    {/* If no inner blocks, show media placeholder */}
                {innerBlocks.length === 0 ? (
                    <MediaPlaceholder
                        icon="format-gallery"
                        labels={{
                            title: __('Voeg afbeeldingen toe aan de slider', 'slider'),
                            instructions: __('Versleep afbeeldingen, upload, of kies uit je mediabibliotheek.', 'slider'),
                        }}
                        onSelect={(media) => {
                            const { replaceInnerBlocks } = dispatch('core/block-editor');
                            const images = Array.isArray(media) ? media : [media];
                            if (!images.length) return;

                            const blocks = images.map((img) =>
                                createBlock('madeit/slider-image', {
                                    id: img.id,
                                    url: img.url,
                                    alt: img.alt || '',
                                    caption: img.caption || '',
                                    title: img.title || '',
                                    description: img.description || '',
                                    width: img.width || 0,
                                    height: img.height || 0
                                })
                            );

                            replaceInnerBlocks(clientId, blocks, false);
                        }}
                        multiple
                        accept="image/*"
                        allowedTypes={['image']}
                    />
                ) : (
                    <div className={`swiper-container m-slider-preview device-${device}`} style={{ display: 'flex', height: height, minHeight: effectiveMinHeight,  }}>
                        <div className="swiper-wrapper">
                        <InnerBlocks
                            renderAppender={false}
                            allowedBlocks={['madeit/slider-image']}
                        />
                        {/* Add swiper navigation and pagination */}
                        {/* show navigation if on */}
                        {navigation && (
                            <div className={`swiper-button ${navigationPosition }`}>
                                <button className="swiper-button-prev" aria-label={__('Vorige slide', 'slider')} style={{ backgroundColor: navigationBackgroundColor, color: navigationIconColor, width: navigationIconSize, height: navigationIconSize , border: navigationBorderWidth ? `${navigationBorderWidth} ${navigationBorderStyle} ${navigationBorderColor}` : 'none', borderRadius: navigationBorderRadius }}></button>
                                <button className="swiper-button-next" aria-label={__('Volgende slide', 'slider')} style={{ backgroundColor: navigationBackgroundColor, color: navigationIconColor, width: navigationIconSize, height: navigationIconSize , border: navigationBorderWidth ? `${navigationBorderWidth} ${navigationBorderStyle} ${navigationBorderColor}` : 'none', borderRadius: navigationBorderRadius }}></button>
                            </div>
                        )}
                        {/* show pagination if on */}
                        {pagination && (
                            <div
                            className={`swiper-pagination swiper-pagination-${paginationType} ${paginationInside ? 'inside' : 'outside'}${paginationDynamic ? ' swiper-pagination-dynamic' : ''}`}
                            >
                            {/* Dummy inhoud voor editorpreview */}
                            {paginationType === 'bullets' && !paginationDynamic && innerBlocks.map((_, index) => (
                                <span key={index} className={`swiper-pagination-bullet ${index === 0 ? 'swiper-pagination-bullet-active' : ''}`} style={{ backgroundColor: index === 0 ? paginationActiveColor : '' }} />
                            ))}
                            {paginationType === 'fraction' && `1 / ${innerBlocks.length}`}
                            {paginationType === 'progressbar' && <div className="progressbar--preview" style={{ width: '30%', height: '4px', background: '#888' }} />}

                            { paginationDynamic && (
                                <div className="swiper-pagination-dynamic">
                                    {Array.from({ length: paginationMaxBullets }, (_, i) => (
                                        <span key={i} className={`swiper-pagination-bullet ${i === 0 ? 'swiper-pagination-bullet-active' : ''}`} style={{ backgroundColor: i === 0 ? paginationActiveColor : '' }} />
                                    ))}
                                </div>
                            )}
                            </div>
                        )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}


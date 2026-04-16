import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import {
	PanelBody,
	Button,
	ToggleControl,
	RangeControl,
	SelectControl,
	CheckboxControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { ControlHeader } from '../../../shared';

const DIMENSION_UNITS = [
	{ value: 'px', label: 'px', default: 0 },
	{ value: 'em', label: 'em', default: 0 },
	{ value: 'rem', label: 'rem', default: 0 },
	{ value: 'vh', label: 'vh', default: 0 },
	{ value: '%', label: '%', default: 0 },
];

// Layout images: keep as a single mapping so you can swap to SVGs later.
// NOTE: these are lightweight inline SVG placeholders (no visible names in UI).
const LAYOUT_IMAGES = {
	standaard:
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="64" height="64" rx="32" fill="#E5E7EB"/><rect x="96" y="28" width="126" height="10" rx="5" fill="#D1D5DB"/><rect x="96" y="48" width="98" height="10" rx="5" fill="#D1D5DB"/><rect x="18" y="100" width="204" height="10" rx="5" fill="#D1D5DB"/></svg>'
		),
	klassiek:
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="18" width="204" height="14" rx="7" fill="#D1D5DB"/><rect x="18" y="44" width="204" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="62" width="170" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="80" width="190" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="104" width="120" height="10" rx="5" fill="#D1D5DB"/></svg>'
		),
	'inhoud | afbeelding | bio':
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="140" height="12" rx="6" fill="#D1D5DB"/><rect x="18" y="44" width="140" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="62" width="120" height="10" rx="5" fill="#E5E7EB"/><rect x="172" y="22" width="50" height="50" rx="10" fill="#E5E7EB"/><rect x="172" y="84" width="50" height="10" rx="5" fill="#D1D5DB"/></svg>'
		),
	'afbeelding | inhoud':
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="70" height="96" rx="12" fill="#E5E7EB"/><rect x="104" y="26" width="118" height="12" rx="6" fill="#D1D5DB"/><rect x="104" y="48" width="102" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="66" width="110" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="84" width="86" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="108" width="74" height="10" rx="5" fill="#D1D5DB"/></svg>'
		),
	'inhoud | afbeelding':
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="26" width="140" height="12" rx="6" fill="#D1D5DB"/><rect x="18" y="48" width="122" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="66" width="134" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="84" width="98" height="10" rx="5" fill="#E5E7EB"/><rect x="172" y="26" width="50" height="50" rx="10" fill="#E5E7EB"/></svg>'
		),
	'icoon titel inline':
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="18" height="18" rx="9" fill="#D1D5DB"/><rect x="44" y="24" width="178" height="14" rx="7" fill="#D1D5DB"/><rect x="18" y="52" width="204" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="70" width="190" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="100" width="120" height="10" rx="5" fill="#D1D5DB"/></svg>'
		),
};

export default function Edit({ attributes, setAttributes }) {
	const {
		layout = 'standaard',
		slidesDesktop = 3,
		slidesTablet = 2,
		slidesMobile = 1,
		showArrows = true,
		paginationType = 'bullets',
		transitionDuration = 500,
		autoplay = true,
		autoplaySpeed = 5000,
		infiniteLoop = false,
		pauseOnInteraction = true,
		textColor = '',
		containerBackgroundColor = '',
		showImage = true,
		width = '48px',
		height = '48px',
		objectFit = 'cover',
		borderRadius_leftTop = '50%',
		borderRadius_rightTop = '50%',
		borderRadius_rightBottom = '50%',
		borderRadius_leftBottom = '50%',
		arrowSize = '24px',
		arrowColor = '',
		paginationSize = '8px',
		paginationColor = '',
		categoryIds = [],
	} = attributes;

	const [activeTab, setActiveTab] = useState('layout');
	const [activeSlidesPerViewBreakpoint, setActiveSlidesPerViewBreakpoint] = useState('desktop');

	const blockProps = useBlockProps({
		style: {
			'--madeit-review-text-color': textColor || undefined,
			'--madeit-review-bg-color': containerBackgroundColor || undefined,
			'--madeit-review-arrow-size': arrowSize || undefined,
			'--madeit-review-arrow-color': arrowColor || undefined,
			'--madeit-review-pagination-size': paginationSize || undefined,
			'--madeit-review-pagination-color': paginationColor || undefined,
		},
	});

	const reviewCategories = useSelect(
		(select) =>
			select('core')?.getEntityRecords?.('taxonomy', 'review_category', {
				per_page: 100,
				orderby: 'name',
				order: 'asc',
			}),
		[]
	);

	const valueMap = {
		desktop: slidesDesktop,
		tablet: slidesTablet,
		mobile: slidesMobile,
	};

	const resetSlidesPerView = () => {
		setAttributes({ slidesDesktop: 3, slidesTablet: 2, slidesMobile: 1 });
	};

	const DISABLED_LAYOUTS = ['inhoud | afbeelding | bio', 'afbeelding | inhoud', 'inhoud | afbeelding', 'icoon titel inline'];
	const reviewLayoutSelector = ({ selectedLayout, onChange }) => {
		const layouts = ['standaard', 'klassiek', 'inhoud | afbeelding | bio', 'afbeelding | inhoud', 'inhoud | afbeelding', 'icoon titel inline'];

		return (
			<div className="layout-selector">
				{layouts.map((layoutOption) => {
					const isDisabled = DISABLED_LAYOUTS.includes(layoutOption);
					const isActive = selectedLayout === layoutOption;

					return (
						<div
							key={layoutOption}
							className={
								'layout-box ' +
								layoutOption.replace(/\s/g, '-').toLowerCase() +
								(isActive ? ' active' : '') +
								(isDisabled ? ' is-disabled' : '')
							}
							onClick={() => {
								if (!isDisabled) {
									onChange(layoutOption);
								}
							}}
							role="button"
							aria-disabled={isDisabled}
							aria-label={layoutOption}
						>
							<span className="screen-reader-text">{layoutOption}</span>

							<div className={'review review-' + layoutOption.replace(/\s/g, '-').toLowerCase()}>
								<div className="card">
									<div className="card-body">
										<div className="inner-content">
											{LAYOUT_IMAGES[layoutOption] ? (
												<img
													src={LAYOUT_IMAGES[layoutOption]}
													alt={layoutOption}
													className="review-image"
												/>
											) : null}
										</div>
									</div>
								</div>
							</div>

							{isDisabled ? (
								<div className="layout-overlay">
									<span>{__('Binnenkort beschikbaar', 'madeit-review')}</span>
								</div>
							) : null}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<>
			<InspectorControls>
				{/* Tab buttons */}
				<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
					<Button 
						isPrimary={activeTab === 'layout'} 
						onClick={() => setActiveTab('layout')}
						style={{ marginRight: '5px' }}
					>
						Layout
					</Button>
					<Button 
						isPrimary={activeTab === 'style'} 
						onClick={() => setActiveTab('style')}
						style={{ marginRight: '5px' }}
					>
						Style
					</Button>
					<Button 
						isPrimary={activeTab === 'advanced'} 
						onClick={() => setActiveTab('advanced')}
					>
						Advanced
					</Button>
				</div>



				{activeTab === 'layout' && (
					<>
					{/* Style of the reviews */}
					<PanelBody title={__('reviews', 'madeit-review')} initialOpen={true}>
						{/* 1. Choose slider layout */}
						{reviewLayoutSelector({
							selectedLayout: layout,
							onChange: (val) => setAttributes({ layout: val }),
						})}
					
						{/* Seperator */}
						<div style={{ borderBottom: '1px solid #eee', margin: '20px 0' }}></div>

						{/* 2. Choose slides per view */}
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
								max={10}
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
					</PanelBody>

					<PanelBody title={__('extra opties', 'madeit-review')} initialOpen={false}>
						{/* Arrow */}
						<ToggleControl
							label={__('Navigatie', 'madeit-review')}
							checked={showArrows}
							onChange={(val) => setAttributes({ showArrows: val })}
						/>

						{/* Pagination */}
						<SelectControl
							label={__('Pagination', 'madeit-review')}
							value={paginationType}
							options={[
								{ label: 'Geen', value: 'none' },
								{ label: 'Stippen', value: 'bullets' },
								{ label: 'Nummers', value: 'fraction' },
								{ label: 'Progress bar', value: 'progressbar' },
							]}
							onChange={(val) => setAttributes({ paginationType: val })}
						/>

						{/* Transition duration */}
						<ControlHeader
							title={ __( 'Transition duur (ms)' ) }
						/>
						<RangeControl
							value={transitionDuration}
							onChange={(val) => setAttributes({ transitionDuration: val })}
							min={100}
							max={5000}
							step={100}
						/>

						<div style={{ borderBottom: '1px solid #eee', margin: '20px 0' }}></div>

						{/* Autoplay */}
						<ToggleControl
							label={__('Autoplay', 'madeit-review')}
							checked={autoplay}
							onChange={(val) => setAttributes({ autoplay: val })}
						/>

						{/* Autoplay speed */}
						<RangeControl
							label={__('Autoplay snelheid (ms)', 'madeit-review')}
							value={autoplaySpeed}
							onChange={(val) => setAttributes({ autoplaySpeed: val })}
							min={100}
							max={10000}
							step={100}
						/>

						{/* Infinite loop */}
						<ToggleControl
							label={__('Oneindige loop', 'madeit-review')}
							checked={infiniteLoop}
							onChange={(val) => setAttributes({ infiniteLoop: val })}
						/>

						{/* Pause on interaction */}
						<ToggleControl
							label={__('Pauzeren bij interactie', 'madeit-review')}
							checked={pauseOnInteraction}
							onChange={(val) => setAttributes({ pauseOnInteraction: val })}
						/>

						<div style={{ borderBottom: '1px solid #eee', margin: '20px 0' }}></div>

						{/* Filter op categorie */}
						{Array.isArray(reviewCategories) ? (
							<div className="madeit-control">
								<p style={{ margin: '0 0 8px' }}>{__('Categorieën', 'madeit-review')}</p>
								<p style={{ margin: '0 0 12px', opacity: 0.8 }}>{__('Laat alles uitgevinkt om alle categorieën te tonen.', 'madeit-review')}</p>
								<div style={{ display: 'grid', gap: '8px', maxHeight: '220px', overflow: 'auto' }}>
									{(reviewCategories || []).map((term) => {
										const termId = term?.id;
										if (!termId) return null;
										const checked = Array.isArray(categoryIds) ? categoryIds.includes(termId) : false;
										return (
											<CheckboxControl
												key={termId}
												label={term?.name ?? String(termId)}
												checked={checked}
												onChange={(isChecked) => {
													const current = Array.isArray(categoryIds) ? categoryIds : [];
													const next = isChecked
														? Array.from(new Set([...current, termId]))
														: current.filter((id) => id !== termId);
													setAttributes({ categoryIds: next });
												}}
											/>
										);
									})}
								</div>
							</div>
						) : (
							<p>{__('Categorieën laden…', 'madeit-review')}</p>
						)}


					</PanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<>
					<PanelBody title={__('Stijl', 'madeit-review')} initialOpen={true}>
						{/* Tekst kleur */}
						<div className="madeit-control">
							<PanelColorSettings
								initialOpen={ true }
								colorSettings={ [
									{
										label: __( 'Tekst kleur' ),
										value: textColor,
										onChange: ( value ) => setAttributes({ textColor: value }),
									},
								] }
							/>
						</div>

						{/* Achtergrond kleur */}
						<div className="madeit-control">
							<PanelColorSettings
								initialOpen={ true }
								colorSettings={ [
									{
										label: __( 'Achtergrond kleur' ),
										value: containerBackgroundColor,
										onChange: ( value ) => setAttributes({ containerBackgroundColor: value }),
									},
								] }
							/>
						</div>

					</PanelBody>

					<PanelBody title={__('Afbeelding', 'madeit-review')} initialOpen={false}>
						{/*  */}
						<ToggleControl
							label={__('Toon afbeelding', 'madeit-review')}
							checked={showImage}
							onChange={(val) => setAttributes({ showImage: val })}
						/>

						<div className="afbeelding-settings" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
							<UnitControl
								__next40pxDefaultSize
								label={__('Breedte', 'madeit-review')}
								value={width}
								onChange={(val) => setAttributes({ width: val })}
								units={DIMENSION_UNITS}
							/>
							<UnitControl
								__next40pxDefaultSize
								label={__('Hoogte', 'madeit-review')}
								value={height}
								onChange={(val) => setAttributes({ height: val })}
								units={DIMENSION_UNITS}
							/>
						</div>
						{height && (
							<div style={{ marginTop: '20px' }}>
								<SelectControl
									label={__('Object-fit', 'madeit-review')}
									value={objectFit}
									onChange={(val) => setAttributes({ objectFit: val })}
									options={[
										{ label: 'cover', value: 'cover' },
										{ label: 'contain', value: 'contain' },
										{ label: 'fill', value: 'fill' },
										{ label: 'none', value: 'none' },
										{ label: 'scale-down', value: 'scale-down' },
									]}
								/>
							</div>
						)}

						{/* Border radius */}
						<div style={{ marginTop: '20px' }}>
							<ControlHeader title={ __( 'Border radius' ) } />
							<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
								<UnitControl
									__next40pxDefaultSize
									label={__('Links boven', 'madeit-review')}
									value={borderRadius_leftTop}
									onChange={(val) => setAttributes({ borderRadius_leftTop: val })}
									units={DIMENSION_UNITS}
								/>
								<UnitControl
									__next40pxDefaultSize
									label={__('Rechts boven', 'madeit-review')}
									value={borderRadius_rightTop}
									onChange={(val) => setAttributes({ borderRadius_rightTop: val })}
									units={DIMENSION_UNITS}
								/>
								<UnitControl
									__next40pxDefaultSize
									label={__('Rechts onder', 'madeit-review')}
									value={borderRadius_rightBottom}
									onChange={(val) => setAttributes({ borderRadius_rightBottom: val })}
									units={DIMENSION_UNITS}
								/>
								<UnitControl
									__next40pxDefaultSize
									label={__('Links onder', 'madeit-review')}
									value={borderRadius_leftBottom}
									onChange={(val) => setAttributes({ borderRadius_leftBottom: val })}
									units={DIMENSION_UNITS}
								/>
							</div>
						</div>
					</PanelBody>

					<PanelBody title={__('Navigation', 'madeit-review')} initialOpen={false}>
						{/* Arrows size */}
						<div className="madeit-control">
							<UnitControl
								__next40pxDefaultSize
								label={__('Pijl grootte', 'madeit-review')}
								value={arrowSize}
								onChange={(val) => setAttributes({ arrowSize: val })}
								units={DIMENSION_UNITS}
							/>
						</div>
						{/* Arrow kleur */}
						<div className="madeit-control">
							<PanelColorSettings
								initialOpen={ true }
								colorSettings={ [
									{
										label: __( 'Pijl kleur' ),
										value: arrowColor,
										onChange: ( value ) => setAttributes({ arrowColor: value }),
									},
								] }
							/>
						</div>

						{/* Pagination size */}
						<div className="madeit-control">
							<UnitControl
								__next40pxDefaultSize
								label={__('Pagination grootte', 'madeit-review')}
								value={paginationSize}
								onChange={(val) => setAttributes({ paginationSize: val })}
								units={DIMENSION_UNITS}
							/>
						</div>
						{/* Pagination kleur */}
						<div className="madeit-control">
							<PanelColorSettings
								initialOpen={ true }
								colorSettings={ [
									{
										label: __( 'Pagination kleur' ),
										value: paginationColor,
										onChange: ( value ) => setAttributes({ paginationColor: value }),
									},
								] }
							/>
						</div>
					</PanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
					<PanelBody title={__('Geavanceerd', 'madeit-review')} initialOpen={true}>
						{/* 1. Choose slider layout */}
						<p>{__('Binnenkort beschikbaar', 'madeit-review')}</p>
					</PanelBody>
					</>
				)}

			</InspectorControls>





			<div {...blockProps}>
				<ServerSideRender block="madeit/reviews" attributes={attributes} />
			</div>
		</>
	);
}
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import {
	PanelBody,
	Button,
	ButtonGroup,
	ToggleControl,
	RangeControl,
	SelectControl,
	CheckboxControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { ControlHeader, ResponsiveVisibilityPanel } from '../../../shared';

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
	minimal:
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="140" height="12" rx="6" fill="#D1D5DB"/><rect x="18" y="44" width="140" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="62" width="120" height="10" rx="5" fill="#E5E7EB"/><rect x="172" y="22" width="50" height="50" rx="10" fill="#E5E7EB"/><rect x="172" y="84" width="50" height="10" rx="5" fill="#D1D5DB"/></svg>'
		),
	spotlight:
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="22" width="70" height="96" rx="12" fill="#E5E7EB"/><rect x="104" y="26" width="118" height="12" rx="6" fill="#D1D5DB"/><rect x="104" y="48" width="102" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="66" width="110" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="84" width="86" height="10" rx="5" fill="#E5E7EB"/><rect x="104" y="108" width="74" height="10" rx="5" fill="#D1D5DB"/></svg>'
		),
	compact:
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="26" width="140" height="12" rx="6" fill="#D1D5DB"/><rect x="18" y="48" width="122" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="66" width="134" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="84" width="98" height="10" rx="5" fill="#E5E7EB"/><rect x="172" y="26" width="50" height="50" rx="10" fill="#E5E7EB"/></svg>'
		),
	modern:
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect width="240" height="140" rx="12" fill="#F3F4F6"/><rect x="18" y="18" width="204" height="12" rx="6" fill="#D1D5DB"/><rect x="18" y="38" width="186" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="54" width="204" height="10" rx="5" fill="#E5E7EB"/><rect x="18" y="72" width="204" height="2" rx="1" fill="#D1D5DB"/><rect x="18" y="86" width="28" height="28" rx="14" fill="#E5E7EB"/><rect x="54" y="88" width="106" height="10" rx="5" fill="#D1D5DB"/><rect x="54" y="102" width="78" height="8" rx="4" fill="#E5E7EB"/><rect x="54" y="116" width="64" height="8" rx="4" fill="#D1D5DB"/></svg>'
		),
};

const BORDER_RADIUS_KEYS = [
	'borderRadius_leftTop',
	'borderRadius_rightTop',
	'borderRadius_rightBottom',
	'borderRadius_leftBottom',
];

const getCssUnit = (value) => {
	if (typeof value !== 'string') return '';
	const match = value.trim().match(/(px|%|vh|vw|em|rem)$/);
	return match ? match[1] : '';
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
		infiniteLoop = true,
		pauseOnInteraction = true,
		textColor = '',
		containerBackgroundColor = '',
		showImage = true,
		width = '48px',
		height = '48px',
		objectFit = 'cover',
		borderRadiusUnit = '%',
		borderRadius_leftTop = '50%',
		borderRadius_rightTop = '50%',
		borderRadius_rightBottom = '50%',
		borderRadius_leftBottom = '50%',
		arrowSize = '24px',
		arrowColor = '',
		paginationSize = '8px',
		paginationColor = '',
		categoryIds = [],

		hideOnDesktop = false,
		hideOnTablet = false,
		hideOnMobile = false,
	} = attributes;

	const [activeTab, setActiveTab] = useState('layout');
	const [activeSlidesPerViewBreakpoint, setActiveSlidesPerViewBreakpoint] = useState('desktop');
	const isSpotlightLayout = layout === 'spotlight';
	const wasSpotlightLayoutRef = useRef(false);

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
		if (isSpotlightLayout) {
			setAttributes({ slidesDesktop: 1, slidesTablet: 1, slidesMobile: 1 });
			return;
		}
		setAttributes({ slidesDesktop: 3, slidesTablet: 2, slidesMobile: 1 });
	};

	const DISABLED_LAYOUTS = [];
	const reviewLayoutSelector = ({ selectedLayout, onChange }) => {
		const layouts = ['standaard', 'klassiek', 'minimal', 'modern', 'compact', 'spotlight'];

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

	const detectedBorderRadiusUnit =
		getCssUnit(borderRadius_leftTop) ||
		getCssUnit(borderRadius_rightTop) ||
		getCssUnit(borderRadius_rightBottom) ||
		getCssUnit(borderRadius_leftBottom) ||
		borderRadiusUnit ||
		'%';

	// Keep the stored attribute in sync for older content where borderRadiusUnit didn't exist yet.
	useEffect(() => {
		if (borderRadiusUnit !== detectedBorderRadiusUnit) {
			setAttributes({ borderRadiusUnit: detectedBorderRadiusUnit });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		borderRadius_leftTop,
		borderRadius_rightTop,
		borderRadius_rightBottom,
		borderRadius_leftBottom,
	]);

	// Spotlight layout: fixed layout-specific constraints.
	useEffect(() => {
		const wasSpotlightLayout = wasSpotlightLayoutRef.current;
		wasSpotlightLayoutRef.current = isSpotlightLayout;
		if (!isSpotlightLayout) return;

		const enteringSpotlight = !wasSpotlightLayout;

		const nextAttributes = {};
		if (slidesDesktop !== 1) nextAttributes.slidesDesktop = 1;
		if (slidesTablet !== 1) nextAttributes.slidesTablet = 1;
		if (slidesMobile !== 1) nextAttributes.slidesMobile = 1;

		if (width !== '100%') nextAttributes.width = '100%';
		if (height !== '100%') nextAttributes.height = '100%';

		// Border radius: default to 20px when switching to spotlight, but keep it editable afterwards.
		const allCornersEmpty =
			!borderRadius_leftTop &&
			!borderRadius_rightTop &&
			!borderRadius_rightBottom &&
			!borderRadius_leftBottom;
		if (enteringSpotlight || allCornersEmpty) {
			if (borderRadiusUnit !== 'px') nextAttributes.borderRadiusUnit = 'px';
			if (borderRadius_leftTop !== '20px') nextAttributes.borderRadius_leftTop = '20px';
			if (borderRadius_rightTop !== '20px') nextAttributes.borderRadius_rightTop = '20px';
			if (borderRadius_rightBottom !== '20px') nextAttributes.borderRadius_rightBottom = '20px';
			if (borderRadius_leftBottom !== '20px') nextAttributes.borderRadius_leftBottom = '20px';
		}

		if (Object.keys(nextAttributes).length > 0) {
			setAttributes(nextAttributes);
		}
	}, [
		isSpotlightLayout,
		slidesDesktop,
		slidesTablet,
		slidesMobile,
		width,
		height,
		borderRadiusUnit,
		borderRadius_leftTop,
		borderRadius_rightTop,
		borderRadius_rightBottom,
		borderRadius_leftBottom,
		setAttributes,
	]);

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
								value={isSpotlightLayout ? 1 : valueMap[activeSlidesPerViewBreakpoint]}
								onChange={(val) => {
									if (isSpotlightLayout) return;
									if (activeSlidesPerViewBreakpoint === 'desktop') setAttributes({ slidesDesktop: val });
									else if (activeSlidesPerViewBreakpoint === 'tablet') setAttributes({ slidesTablet: val });
									else if (activeSlidesPerViewBreakpoint === 'mobile') setAttributes({ slidesMobile: val });
								}}
								min={1}
								max={10}
								step={0.5}
								disabled={isSpotlightLayout}
							/>

							<Button
								className="madeit-control-rangeRow__reset"
								icon="undo"
								variant="tertiary"
								onClick={ resetSlidesPerView }
								disabled={isSpotlightLayout}
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
								{ label: 'Nummers (1,2,3)', value: 'numbers' },
								{ label: 'Fractie (1/5)', value: 'fraction' },
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
							<div className="madeit-control review_categories">
								<p style={{ margin: '0 0 8px' }}>{__('Categorieën', 'madeit-review')}</p>
								<p style={{ margin: '0 0 12px', opacity: 0.8 }}>{__('Laat alles uitgevinkt om alle categorieën te tonen.', 'madeit-review')}</p>
								<div className="categories" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
									{(reviewCategories || []).map((term) => {
										const termId = term?.id;
										if (!termId) return null;
										const checked = Array.isArray(categoryIds) ? categoryIds.includes(termId) : false;
										return (
											<CheckboxControl
												className="categorie"
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
						<div className="madeit-control">
							<>
								{/* Tekst kleur */}
								<PanelColorSettings
									initialOpen={ true }
									colorSettings={ [
										{
											label: __( 'Tekst kleur', 'madeit-review' ),
											value: textColor,
											onChange: ( value ) => setAttributes({ textColor: value }),
										},
									] }
								/>

								{/* Achtergrond kleur */}
								<PanelColorSettings
									initialOpen={ true }
									colorSettings={ [
										{
											label: __( 'Achtergrond kleur', 'madeit-review' ),
											value: containerBackgroundColor,
											onChange: ( value ) => setAttributes({ containerBackgroundColor: value }),
										},
									] }
								/>
							</>
						</div>

					</PanelBody>

					{/* If LayoutOption = standaard or modern */}
					{ (layout === 'standaard' || layout === 'modern' || layout === 'minimal' || layout === 'spotlight' ) && (
						<>
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
									disabled={isSpotlightLayout}
								/>
								<UnitControl
									__next40pxDefaultSize
									label={__('Hoogte', 'madeit-review')}
									value={height}
									onChange={(val) => setAttributes({ height: val })}
									units={DIMENSION_UNITS}
									disabled={isSpotlightLayout}
								/>
							</div>
							{height && (
								<div style={{ marginTop: '0px' }}>
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
																			<ControlHeader
																				title={ __( 'Border radius', 'madeit-review' ) }
																				afterBreakpoint={
																					<ButtonGroup className="madeit-control-units">
																						{['px', '%', 'vh'].map((unit) => (
																							<Button
																								key={unit}
																								isPressed={detectedBorderRadiusUnit === unit}
																								onClick={() => {
																									const nextAttributes = { borderRadiusUnit: unit };
																									BORDER_RADIUS_KEYS.forEach((key) => {
																										const raw = attributes[key];
																										if (!raw) return;
																										const numeric = parseFloat(raw);
																										if (!Number.isFinite(numeric)) return;
																										nextAttributes[key] = `${numeric}${unit}`;
																									});
																									setAttributes(nextAttributes);
																								}}
																							>
																								{unit}
																							</Button>
																						))}
																				</ButtonGroup>
																			}
																		/>

																			<div
																				style={{
																					display: 'flex',
																					alignItems: 'flex-start',
																				}}
																			>
																				{[
																					{ label: 'Bovenaan', key: 'borderRadius_leftTop' },
																					{ label: 'Rechts', key: 'borderRadius_rightTop' },
																					{ label: 'Onderaan', key: 'borderRadius_rightBottom' },
																					{ label: 'Links', key: 'borderRadius_leftBottom' },
																				].map((item) => {
																					const rawValue = attributes[item.key] || '';
																					const numericValue = parseFloat(rawValue);
																					const displayValue = Number.isFinite(numericValue) ? numericValue : '';

																					return (
																						<div
																							key={item.key}
																							style={{
																								display: 'flex',
																								flexDirection: 'column',
																								alignItems: 'center',
																								flex: 1,
																							}}
																						>
																							<input
																								type="number"
																								value={displayValue}
																								min={0}
																								onChange={(e) => {
																									const val = e.target.value;
																									setAttributes({
																										[item.key]: val !== '' ? `${val}${detectedBorderRadiusUnit}` : '',
																									});
																								}}
																								style={{
																									width: '100%',
																									height: '35px',
																									// Only round the outer corners of the input group.
																																	borderRadius:
																																		item.key === 'borderRadius_leftTop'
																																			? '4px 0 0 4px'
																																			: item.key === 'borderRadius_rightTop'
																																			? '0 0 0 0'
																																			: item.key === 'borderRadius_rightBottom'
																																			? '0 0 0 0'
																																			: item.key === 'borderRadius_leftBottom'
																																			? '0 4px 4px 0'
																																			: '4px',
																									textAlign: 'center',
																								}}
																							/>

																							<span style={{ fontSize: '9px', marginTop: '4px' }}>
																								{__(item.label, 'madeit-review')}
																							</span>
																						</div>
																					);
																				})}

																				<Button
																					title="Waarden koppelen"
																					variant="tertiary"
																					onClick={() => {
																						const values = BORDER_RADIUS_KEYS.map((key) => attributes[key] || '');
																						const allEqual = values.every((val) => val === values[0]);
																						if (allEqual) {
																							setAttributes({
																								borderRadius_leftTop: '',
																								borderRadius_rightTop: '',
																								borderRadius_rightBottom: '',
																								borderRadius_leftBottom: '',
																							});
																							} else {
																							const firstValue = values.find((val) => val) || '';
																							setAttributes({
																								borderRadius_leftTop: firstValue,
																								borderRadius_rightTop: firstValue,
																								borderRadius_rightBottom: firstValue,
																								borderRadius_leftBottom: firstValue,
																							});
																						}
																					}}
																					style={{ height: '35px', marginLeft: '10px', marginTop: '4px', padding: '0' }}
																					showTooltip
																					label={__( 'Koppel waarden', 'madeit-review' )}
																				>
																					{(() => {
																						const values = BORDER_RADIUS_KEYS.map((key) => attributes[key] || '');
																						const allEqual = values.every((val) => val === values[0]);
																						return allEqual ? (
																							<span
																								className="dashicons dashicons-editor-unlink"
																								style={{ fontSize: '15px', width: 'min-content' }}
																							/>
																						) : (
																							<span
																								className="dashicons dashicons-admin-links"
																								style={{ fontSize: '15px', width: 'min-content' }}
																							/>
																						);
																					})()}
																				</Button>
																			</div>
																		</div>
						</PanelBody>
						</>
					)}

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
										label: __( 'Pijl kleur', 'madeit-review' ),
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
										label: __( 'Pagination kleur', 'madeit-review' ),
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
						<ResponsiveVisibilityPanel
							title="Responsive"
							initialOpen={ true }
							hideOnDesktop={ hideOnDesktop }
							hideOnTablet={ hideOnTablet }
							hideOnMobile={ hideOnMobile }
							setAttributes={ setAttributes }
						/>

						<PanelBody className="disabledPanel" title="Binnenkomende animatie" initialOpen={false}>
							{/* Animatie type */}

							{/* Animatie duur */}

							{/* Animatie vertraging */}
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
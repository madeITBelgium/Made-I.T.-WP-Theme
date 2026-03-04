import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { InspectorControls, PanelColorSettings, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl, TextareaControl, ToggleControl, ButtonGroup, Button, Flex, FlexItem, FlexBlock } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

import greyscaleIcon from './assets/greyscale.png';
import standardIcon from './assets/standard.png';
import purpleIcon from './assets/paars.png';

function ensureLeaflet() {
	if (window.L) {
		return Promise.resolve(window.L);
	}

	if (window.__madeitLeafletPromise) {
		return window.__madeitLeafletPromise;
	}

	window.__madeitLeafletPromise = new Promise((resolve, reject) => {
		const existingCss = document.querySelector('link[data-madeit-leaflet]');
		if (!existingCss) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			link.setAttribute('data-madeit-leaflet', '1');
			document.head.appendChild(link);
		}

		const existingScript = document.querySelector('script[data-madeit-leaflet]');
		if (existingScript) {
			existingScript.addEventListener('load', () => resolve(window.L));
			existingScript.addEventListener('error', reject);
			return;
		}

		const script = document.createElement('script');
		script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
		script.defer = true;
		script.setAttribute('data-madeit-leaflet', '1');
		script.addEventListener('load', () => resolve(window.L));
		script.addEventListener('error', reject);
		document.body.appendChild(script);
	});

	return window.__madeitLeafletPromise;
}

async function geocodeLocation(query) {
	const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
	const resp = await fetch(url, { method: 'GET' });
	if (!resp.ok) throw new Error('request_failed');
	const data = await resp.json();
	if (!Array.isArray(data) || !data[0]) return null;

	const latitude = Number(data[0].lat);
	const longitude = Number(data[0].lon);
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
	const displayName = typeof data[0].display_name === 'string' ? data[0].display_name : '';
	return { latitude, longitude, displayName };
}

const DEFAULT_MARKER_SVG = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" xml:space="preserve"><path fill="currentColor" d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"/></svg>';

function flagSvgForRecolor(svg) {
	if (!svg) return '';
	const str = String(svg);
	return str.replace(/<svg\b([^>]*?)(\/?)>/i, (match, attrs, selfClose) => {
		if (/data-madeit-recolor\s*=/.test(attrs)) return match;
		return `<svg${attrs} data-madeit-recolor="1"${selfClose}>`;
	});
}

function rewriteSvgColorsToCurrentColor(svg) {
	if (!svg) return '';
	let s = String(svg);

	// Attribute colors (keep none)
	s = s.replace(/\b(fill|stroke)\s*=\s*"(?!none\b)[^"]+"/gi, (m, prop) => `${prop}="currentColor"`);
	s = s.replace(/\b(fill|stroke)\s*=\s*'(?!none\b)[^']+'/gi, (m, prop) => `${prop}='currentColor'`);

	// Inline style="..."
	s = s.replace(/\bstyle\s*=\s*"([^"]*)"/gi, (m, styleText) => {
		let next = styleText;
		next = next.replace(/(\bfill\s*:\s*)(?!none\b)[^;]+/gi, '$1currentColor');
		next = next.replace(/(\bstroke\s*:\s*)(?!none\b)[^;]+/gi, '$1currentColor');
		return `style="${next}"`;
	});
	s = s.replace(/\bstyle\s*=\s*'([^']*)'/gi, (m, styleText) => {
		let next = styleText;
		next = next.replace(/(\bfill\s*:\s*)(?!none\b)[^;]+/gi, '$1currentColor');
		next = next.replace(/(\bstroke\s*:\s*)(?!none\b)[^;]+/gi, '$1currentColor');
		return `style='${next}'`;
	});

	// <style>...</style>
	s = s.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (m, cssText) => {
		let next = cssText;
		next = next.replace(/(\bfill\s*:\s*)(?!none\b)[^;}{]+/gi, '$1currentColor');
		next = next.replace(/(\bstroke\s*:\s*)(?!none\b)[^;}{]+/gi, '$1currentColor');
		return m.replace(cssText, next);
	});

	return s;
}

function sanitizeSvg(svg) {
	if (!svg) return '';
	let cleaned = String(svg);
	cleaned = cleaned.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
	cleaned = cleaned.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
	cleaned = cleaned.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
	cleaned = cleaned.replace(/javascript:/gi, '');
	cleaned = rewriteSvgColorsToCurrentColor(cleaned);
	return flagSvgForRecolor(cleaned);
}

function createMarkerIcon(L, svg, color) {
	const safeSvg = sanitizeSvg(svg) || flagSvgForRecolor(DEFAULT_MARKER_SVG);
	const html = `<span class="madeit-maps__marker" style="color:${color || '#1cacb4'}">${safeSvg}</span>`;
	return L.divIcon({
		className: 'madeit-maps__marker-icon',
		html,
		iconSize: [32, 32],
		iconAnchor: [16, 32],
		popupAnchor: [0, -28],
	});
}

function mapColorToClass(mapColor) {
	const key = String(mapColor || '').trim().toLowerCase();
	if (!key) return '';
	const safe = key.replace(/[^a-z0-9_-]+/g, '-');
	return safe ? `madeit-maps--${safe}` : '';
}

export default function Edit({ attributes, setAttributes, clientId, isSelected }) {
	const { selectBlock } = useDispatch('core/block-editor');

	const {
		location,
		mapColor,
		latitude,
		longitude,
		zoom,
		height,
		marker,
		markerColor,
		markerSvg,
		markers,
		markerLatitude,
		markerLongitude,
		markerPopup,
	} = attributes;

	const hasLocation = Boolean((location || '').trim());
	const [locationInput, setLocationInput] = useState(location || '');
	const [isSearching, setIsSearching] = useState(false);
	const [searchError, setSearchError] = useState('');
	const [leafletReadyTick, setLeafletReadyTick] = useState(() => (window.L ? 1 : 0));
	const [collapsedMarkers, setCollapsedMarkers] = useState({});
	const [markerSearchingIndex, setMarkerSearchingIndex] = useState(-1);
	const [markerSearchErrors, setMarkerSearchErrors] = useState({});
	const [openCoordinates, setOpenCoordinates] = useState(false);

	const mapElRef = useRef(null);
	const leafletRef = useRef(window.L || null);
	const mapRef = useRef(null);
	const tileLayerRef = useRef(null);
	const markerRefs = useRef([]);

	const normalizedMarkers = Array.isArray(markers) ? markers : [];

	function setMarkers(nextMarkers) {
		const next = Array.isArray(nextMarkers) ? nextMarkers : [];
		setAttributes({ markers: next });
	}

	useEffect(() => {
		let cancelled = false;
		ensureLeaflet()
			.then((L) => {
				if (cancelled) return;
				leafletRef.current = L;
				setLeafletReadyTick((t) => t + 1);
			})
			.catch(() => {
				leafletRef.current = null;
				setLeafletReadyTick((t) => t + 1);
			});

		return () => {
			cancelled = true;
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
				tileLayerRef.current = null;
				markerRefs.current = [];
			}
		};
	}, []);

	useEffect(() => {
		if (!hasLocation) return;
		if (!leafletReadyTick) return;
		const L = leafletRef.current;
		const el = mapElRef.current;
		if (!L || !el) return;

		if (!mapRef.current) {
			mapRef.current = L.map(el, {
				zoomControl: true,
				scrollWheelZoom: false,
			});

			tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; OpenStreetMap contributors',
			});
			tileLayerRef.current.addTo(mapRef.current);
		}

		el.style.height = height || '400px';
		mapRef.current.setView([latitude, longitude], zoom);

		markerRefs.current.forEach((m) => m && m.remove && m.remove());
		markerRefs.current = [];

		if (marker) {
			const icon = createMarkerIcon(L, markerSvg, markerColor);
			if (Number.isFinite(markerLatitude) && Number.isFinite(markerLongitude)) {
				const mainMarker = L.marker([markerLatitude, markerLongitude], { icon });
				mainMarker.addTo(mapRef.current);
				if (typeof markerPopup === 'string' && markerPopup) {
					mainMarker.bindPopup(markerPopup);
				}
				markerRefs.current.push(mainMarker);
			}

			normalizedMarkers.forEach((m) => {
				const lat = Number(m && m.latitude);
				const lng = Number(m && m.longitude);
				if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
				const leafletMarker = L.marker([lat, lng], { icon });
				leafletMarker.addTo(mapRef.current);
				if (m && typeof m.popup === 'string' && m.popup) {
					leafletMarker.bindPopup(m.popup);
				}
				markerRefs.current.push(leafletMarker);
			});
		}

		setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 0);
	}, [hasLocation, leafletReadyTick, latitude, longitude, zoom, height, marker, markerColor, markerSvg, normalizedMarkers]);

	async function searchLocationAndShowMap() {
		const query = (locationInput || '').trim();
		setSearchError('');
		if (!query) {
			setSearchError(__('Voer eerst een locatie in.', 'madeit'));
			return;
		}

		setIsSearching(true);
		try {
			const coords = await geocodeLocation(query);
			if (!coords) {
				setSearchError(__('Geen resultaten gevonden voor deze locatie.', 'madeit'));
				return;
			}

			setAttributes({
				location: query,
				latitude: coords.latitude,
				longitude: coords.longitude,
				markerLatitude: coords.latitude,
				markerLongitude: coords.longitude,
				// Extra markers are managed separately in markers[]
			});
		} catch (e) {
			setSearchError(__('Kon de locatie niet ophalen. Probeer opnieuw.', 'madeit'));
		} finally {
			setIsSearching(false);
		}
	}

	function addMarker() {
		let lat = latitude;
		let lng = longitude;
		if (mapRef.current && mapRef.current.getCenter) {
			const center = mapRef.current.getCenter();
			if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
				lat = center.lat;
				lng = center.lng;
			}
		}

		const nextIndex = normalizedMarkers.length;
		const next = [...normalizedMarkers, { latitude: lat, longitude: lng, query: '', title: '', popup: '' }];
		setAttributes({ marker: true });
		setMarkers(next);
		setCollapsedMarkers((prev) => ({ ...prev, [nextIndex]: true }));
	}

	function removeMarker(index) {
		const next = normalizedMarkers.filter((_, i) => i !== index);
		if (!next.length) {
			setAttributes({ marker: false });
		}
		setMarkers(next);
	}

	function updateMarker(index, patch) {
		const next = normalizedMarkers.map((m, i) => (i === index ? { ...(m || {}), ...(patch || {}) } : m));
		setMarkers(next);
	}

	async function searchMarkerLocation(index) {
		const markerItem = normalizedMarkers[index] || {};
		const query = String(markerItem.query || '').trim();
		setMarkerSearchErrors((prev) => ({ ...prev, [index]: '' }));
		if (!query) {
			setMarkerSearchErrors((prev) => ({ ...prev, [index]: __('Voer eerst een locatie in.', 'madeit') }));
			return;
		}

		setMarkerSearchingIndex(index);
		try {
			const coords = await geocodeLocation(query);
			if (!coords) {
				setMarkerSearchErrors((prev) => ({ ...prev, [index]: __('Geen resultaten gevonden voor deze locatie.', 'madeit') }));
				return;
			}

			updateMarker(index, {
				latitude: coords.latitude,
				longitude: coords.longitude,
				title: coords.displayName || query,
			});
		} catch (e) {
			setMarkerSearchErrors((prev) => ({ ...prev, [index]: __('Kon de locatie niet ophalen. Probeer opnieuw.', 'madeit') }));
		} finally {
			setMarkerSearchingIndex(-1);
		}
	}

	const normalizedMapColor = String(mapColor || '').trim().toLowerCase();
	const mapColorClass = mapColorToClass(normalizedMapColor);

	const blockProps = useBlockProps({ className: `madeit-maps-block ${mapColorClass}`.trim() });

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Map instellingen', 'madeit')} initialOpen={true}>
					<div style={{ marginBottom: '0px' }}>
						<TextControl
							label={__('Locatie', 'madeit')}
							value={locationInput}
							onChange={(value) => setLocationInput(value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									searchLocationAndShowMap();
								}
							}}
						/>
					</div>
					<Button
						style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'space-between', width: '100%' }} 
						className="madeit-maps__show-coordinates-button" 
						onClick={() => setOpenCoordinates(!openCoordinates)} 
						disabled={!hasLocation}
					>
						{__('Toon coördinaten', 'madeit')} <span>{openCoordinates ? ' -' : ' +'}</span>
					</Button>
					{/* Show latitude and longitude inputs after location is found */}
					{openCoordinates && (
						<div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
							<TextControl
								label={__('Latitude', 'madeit')}
								value={latitude}
								onChange={(value) => setAttributes({ latitude: parseFloat(value) || 0 })}
							/>
							<TextControl
								label={__('Longitude', 'madeit')}
								value={longitude}
								onChange={(value) => setAttributes({ longitude: parseFloat(value) || 0 })}
							/>
						</div>
					)}
					<div style={{ marginTop: '20px' }}>
						<RangeControl
							label={__('Zoom', 'madeit')}
							value={zoom}
							min={1}
							max={19}
							onChange={(value) => setAttributes({ zoom: value })}
						/>
					</div>
					<TextControl
						label={__('Hoogte', 'madeit')}
						value={height}
						help={__('Bijv. 400px of 60vh', 'madeit')}
						onChange={(value) => setAttributes({ height: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Marker', 'madeit')} initialOpen={false}>
					<ToggleControl
						style={{ marginBottom: '12px' }}
						label={__('Marker tonen', 'madeit')}
						checked={!!marker}
						onChange={(value) => setAttributes({ marker: value })}
					/>
					<TextareaControl
						label={__('Eigen marker (SVG)', 'madeit')}
						help={__('Plak hier je <svg>…</svg>.', 'madeit')}
						value={markerSvg}
						onChange={(value) => setAttributes({ markerSvg: value })}
					/>

					<div className="madeit-control">
						<PanelColorSettings
							title={__('Kleur', 'madeit')}
							initialOpen={false}
							colorSettings={[
								{
									label: __('Marker kleur', 'madeit'),
									value: markerColor,
									onChange: (value) => setAttributes({ markerColor: value }),
								},
							]}
						/>
					</div>
				</PanelBody>

				<PanelBody title={__('Map styling', 'madeit')} initialOpen={false}>
					{/* Map kleur veranderen, zorg voor kleine voorbeelden en pas een aangepaste classe toe aan de madeit-maps-block */}
					{mapColorClass ? (
						<p style={{ marginBottom: '8px' }}>
							{__('Huidige map kleur:', 'madeit')} <strong>{normalizedMapColor}</strong>
						</p>
					) : (
						<p style={{ marginTop: '8px' }}>{__('Standaard map kleur wordt gebruikt.', 'madeit')}</p>
					)}
					<ButtonGroup
						style={{ display: 'flex', marginTop: '12px', flexWrap: 'wrap', gap: '8px' }}
					>
							<Button
								style={{ height: '76px', width: '31%', padding: '0'}}
								isPressed={!normalizedMapColor}
								onClick={() => setAttributes({ mapColor: '' })}
							>
								<img src={standardIcon} alt={__('Standaard', 'madeit')} style={{ width: '90%', height: '70px', objectFit: 'cover', margin: 'auto' }} />
							</Button>
							<Button
								style={{ height: '76px', width: '31%', padding: '0'}}
								isPressed={normalizedMapColor === 'grayscale'}
								onClick={() => setAttributes({ mapColor: 'grayscale' })}
							>
								<img src={greyscaleIcon} alt={__('Grijstinten', 'madeit')} style={{ width: '90%', height: '70px', objectFit: 'cover', margin: 'auto' }} />
							</Button>
							<Button
								style={{ height: '76px', width: '31%', padding: '0'}}
								isPressed={normalizedMapColor === 'purple'}
								onClick={() => setAttributes({ mapColor: 'purple' })}
							>
								<img src={purpleIcon} alt={__('Paars', 'madeit')} style={{ width: '90%', height: '70px', objectFit: 'cover', margin: 'auto' }} />
							</Button>
							
					</ButtonGroup>
					
				</PanelBody>

				<PanelBody title={__('Extra locaties toevoegen', 'madeit')} initialOpen={false}>
					
					{!normalizedMarkers.length ? (
						<p style={{ marginTop: '8px' }}>{__('Nog geen locaties toegevoegd.', 'madeit')}</p>
					) : (
						<div style={{ marginTop: '12px' }}>
							{normalizedMarkers.map((m, i) => {
								const title = String(m && (m.title || m.query) ? (m.title || m.query) : '').trim() || `${__('Locatie', 'madeit')} ${i + 1}`;
								const isOpen = !!collapsedMarkers[i];
								const isMarkerSearching = markerSearchingIndex === i;
								const markerError = markerSearchErrors[i];

								return (
									<div key={i} style={{ marginBottom: '12px' }}>
										<Flex align="center" justify="space-between">
											<FlexItem>
												<Button
													variant="tertiary"
													isDestructive
													icon="trash"
													label={__('Verwijder marker', 'madeit')}
													onClick={() => removeMarker(i)}
												/>
											</FlexItem>

											<FlexBlock>
												<strong>{title}</strong>
											</FlexBlock>

											<FlexItem>
												<Button
													variant="tertiary"
													icon={isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'}
													label={isOpen ? __('Inklappen', 'madeit') : __('Openklappen', 'madeit')}
													onClick={() => setCollapsedMarkers((prev) => ({ ...prev, [i]: !prev[i] }))}
												/>
											</FlexItem>
										</Flex>

										{isOpen ? (
											<div style={{ marginTop: '8px' }}>
												<div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
													<TextControl
														style={{ minWidth: '79%', marginBottom: '0' }}
														label={__('Locatie', 'madeit')}
														value={m && typeof m.query === 'string' ? m.query : ''}
														onChange={(value) => updateMarker(i, { query: value })}
														onKeyDown={(event) => {
															if (event.key === 'Enter') {
																searchMarkerLocation(i);
															}
														}}
													/>
													<Button 
														variant="secondary" 
														style={{ margin: 'auto 0 auto auto' }} 
														onClick={() => searchMarkerLocation(i)} 
														disabled={isMarkerSearching}>
														{isMarkerSearching ? __('Zoeken…', 'madeit') : <span className="dashicons dashicons-search" />}
													</Button>
												</div>

												{isOpen && location && (
												<Button
													style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'space-between', width: '100%', marginTop: '-25px' }} 
													className="madeit-maps__show-coordinates-button" 
													onClick={() => setOpenCoordinates(!openCoordinates)} 
													disabled={!hasLocation}
												>
													{__('Toon coördinaten', 'madeit')} <span>{openCoordinates ? ' -' : ' +'}</span>
												</Button>
												)}
												
												{openCoordinates && (
													<div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
														<TextControl
															label={__('Latitude', 'madeit')}
															value={m && Number.isFinite(m.latitude) ? m.latitude : ''}
															onChange={(value) => updateMarker(i, { latitude: parseFloat(value) || 0 })}
														/>
														<TextControl
															label={__('Longitude', 'madeit')}
															value={m && Number.isFinite(m.longitude) ? m.longitude : ''}
															onChange={(value) => updateMarker(i, { longitude: parseFloat(value) || 0 })}
														/>
													</div>
												)}	
												{markerError ? <p className="madeit-maps__placeholder-error">{markerError}</p> : null}

												<TextareaControl
													label={__('Popup tekst', 'madeit')}
													value={m && typeof m.popup === 'string' ? m.popup : ''}
													onChange={(value) => updateMarker(i, { popup: value })}
												/>
											</div>
										) : null}
									</div>
								);
							})}
						</div>
					)}

					<Button variant="secondary" onClick={addMarker} disabled={!hasLocation}>
						{__('Marker toevoegen', 'madeit')}
					</Button>
				</PanelBody>
			</InspectorControls>

			{!hasLocation ? (
				<div className="madeit-maps__placeholder">
					<p className="madeit-maps__placeholder-title">
						{__('Voer een locatie in om de kaart te tonen', 'madeit')}
					</p>
					<TextControl
						label={__('Locatie', 'madeit')}
						value={locationInput}
						onChange={(value) => setLocationInput(value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								searchLocationAndShowMap();
							}
						}}
					/>
					<Button variant="primary" onClick={searchLocationAndShowMap} disabled={isSearching}>
						{isSearching ? __('Zoeken…', 'madeit') : __('Toon kaart', 'madeit')}
					</Button>
					{searchError ? <p className="madeit-maps__placeholder-error">{searchError}</p> : null}
				</div>
			) : (
				<div
					className="madeit-maps__map-wrap"
					onMouseDown={() => {
						if (!isSelected && clientId) {
							selectBlock(clientId);
						}
					}}
				>
					<div
						className="madeit-maps__map"
						ref={mapElRef}
						style={{
							height: height || '400px',
							// Leaflet eats clicks; keep it non-interactive until block is selected.
							pointerEvents: isSelected ? 'auto' : 'none',
						}}
					/>
				</div>
			)}
		</div>
	);
}

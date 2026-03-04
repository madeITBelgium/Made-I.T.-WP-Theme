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

function readNumber(el, name, fallback) {
	const raw = el.dataset[name];
	const value = raw === undefined ? NaN : Number(raw);
	return Number.isFinite(value) ? value : fallback;
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


function readExtraMarkers(el) {
	const raw = el.dataset.markers;
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		return [];
	}
}

function initMap(el, L) {
	if (!el || el.dataset.leafletInitialized === '1') return;
	if (!el.style.height) el.style.height = '400px';

	const latitude = readNumber(el, 'latitude', 51.505);
	const longitude = readNumber(el, 'longitude', -0.09);
	const zoom = readNumber(el, 'zoom', 13);

	const map = L.map(el, {
		zoomControl: true,
		scrollWheelZoom: false,
	}).setView([latitude, longitude], zoom);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; OpenStreetMap contributors',
	}).addTo(map);

	const markerEnabled = el.dataset.marker === '1';
	if (markerEnabled) {
		const markerColor = el.dataset.markerColor || '#1cacb4';
		const markerSvg = el.dataset.markerSvg || '';
		const markerPopup = el.dataset.markerPopup || '';

		const icon = createMarkerIcon(L, markerSvg, markerColor);

		// Main marker (legacy attributes)
		const mainMarkerLatitude = readNumber(el, 'markerLatitude', latitude);
		const mainMarkerLongitude = readNumber(el, 'markerLongitude', longitude);
		if (Number.isFinite(mainMarkerLatitude) && Number.isFinite(mainMarkerLongitude)) {
			const leafletMarker = L.marker([mainMarkerLatitude, mainMarkerLongitude], { icon });
			leafletMarker.addTo(map);
			if (markerPopup) {
				leafletMarker.bindPopup(markerPopup);
			}
		}

		// Extra markers
		const markers = readExtraMarkers(el);
		markers.forEach((m) => {
			const lat = Number(m && m.latitude);
			const lng = Number(m && m.longitude);
			if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
			const leafletMarker = L.marker([lat, lng], { icon });
			leafletMarker.addTo(map);
			if (m && typeof m.popup === 'string' && m.popup) {
				leafletMarker.bindPopup(m.popup);
			}
		});
	}

	el.dataset.leafletInitialized = '1';
	setTimeout(() => map.invalidateSize(), 0);
}

function boot() {
	ensureLeaflet()
		.then((L) => {
			document.querySelectorAll('.madeit-maps__map').forEach((el) => initMap(el, L));
		})
		.catch(() => {
			// Silent fail; leave empty container.
		});
}

if (window.wp && window.wp.domReady) {
	window.wp.domReady(boot);
} else if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', boot);
} else {
	boot();
}

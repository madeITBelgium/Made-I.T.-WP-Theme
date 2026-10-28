export const DEFAULT_SHADOW_COLOR = 'rgba(0, 0, 0, 0.15)';

// Attributes copied by "Kopieer card-stijl" (no content, title or link).
export const CARD_STYLE_KEYS = [
	'backgroundColor',
	'customBackgroundColor',
	'textColor',
	'customTextColor',
	'contentPadding',
	'paddingUnit',
	'mediaBleed',
	'minHeight',
	'minHeightUnit',
	'alignItems',
	'borderType',
	'borderWidth',
	'borderWidthUnit',
	'borderColor',
	'borderHoverType',
	'borderHoverWidth',
	'borderHoverWidthUnit',
	'borderHoverColor',
	'borderRadius',
	'borderRadiusUnit',
	'boxShadow',
	'boxShadowHover',
	'aosFade',
	'aosDelay',
	'aosDelayCustom',
];

export const CARD_STYLE_STORAGE_KEY = 'madeit-card-style-clipboard';

// Accepts numbers (RangeControl) and legacy strings like '4px' or '0px'.
export const toNumber = ( value ) => {
	const numeric = parseFloat( value );
	return Number.isFinite( numeric ) ? numeric : 0;
};

export const normalizeShadow = ( value ) => {
	const safe = value && typeof value === 'object' ? value : {};

	return {
		x: toNumber( safe.x ?? safe.horizontal ),
		y: toNumber( safe.y ?? safe.vertical ),
		blur: toNumber( safe.blur ),
		spread: toNumber( safe.spread ),
		color: safe.color || DEFAULT_SHADOW_COLOR,
		inset: !! safe.inset,
	};
};

export const hasShadow = ( value ) => {
	if ( ! value || typeof value !== 'object' ) {
		return false;
	}

	const safe = normalizeShadow( value );
	return safe.x !== 0 || safe.y !== 0 || safe.blur !== 0 || safe.spread !== 0;
};

export const shadowToCss = ( value ) => {
	const safe = normalizeShadow( value );
	const prefix = safe.inset ? 'inset ' : '';
	return `${ prefix }${ safe.x }px ${ safe.y }px ${ safe.blur }px ${ safe.spread }px ${ safe.color }`;
};

export const normalizeRadius = ( value ) => {
	if ( ! value || typeof value !== 'object' ) {
		return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
	}

	return {
		top: value.top ?? '0px',
		right: value.right ?? '0px',
		bottom: value.bottom ?? '0px',
		left: value.left ?? '0px',
	};
};

export const borderRadiusToCss = ( value ) => {
	const safe = normalizeRadius( value );
	return `${ safe.top } ${ safe.right } ${ safe.bottom } ${ safe.left }`;
};

export const normalizeBorderWidth = ( value ) => {
	if ( ! value || typeof value !== 'object' ) {
		return { top: '1px', right: '1px', bottom: '1px', left: '1px' };
	}

	return {
		top: value.top ?? '1px',
		right: value.right ?? '1px',
		bottom: value.bottom ?? '1px',
		left: value.left ?? '1px',
	};
};

export const borderWidthToCss = ( value ) => {
	const safe = normalizeBorderWidth( value );
	return `${ safe.top } ${ safe.right } ${ safe.bottom } ${ safe.left }`;
};

export const isVisibleColor = ( color ) => !! color && color !== 'transparent';

/**
 * CSS custom properties for the card, shared by edit (preview) and save (frontend).
 * Hover values that are not set are omitted so the stylesheet falls back to the default values.
 */
export const getCardStyleVars = ( attributes ) => {
	const {
		contentPadding,
		minHeight,
		minHeightUnit,
		alignItems,
		borderType,
		borderWidth,
		borderColor,
		borderHoverType,
		borderHoverWidth,
		borderHoverColor,
		borderRadius,
		boxShadow,
		boxShadowHover,
	} = attributes;

	const styleVars = {};
	const safePadding = contentPadding && typeof contentPadding === 'object'
		? contentPadding
		: {
			top: '1.25rem',
			right: '1.25rem',
			bottom: '1.25rem',
			left: '1.25rem',
		};

	if ( safePadding.top || safePadding.right || safePadding.bottom || safePadding.left ) {
		styleVars[ '--madeit-card-content-padding-top' ] = safePadding.top;
		styleVars[ '--madeit-card-content-padding-right' ] = safePadding.right;
		styleVars[ '--madeit-card-content-padding-bottom' ] = safePadding.bottom;
		styleVars[ '--madeit-card-content-padding-left' ] = safePadding.left;
	}

	if ( minHeight > 0 ) {
		styleVars[ '--madeit-card-min-height' ] = `${ minHeight }${ minHeightUnit || 'px' }`;
	}

	if ( alignItems && alignItems !== 'stretch' ) {
		styleVars[ '--madeit-card-align-items' ] = alignItems;
	}

	if ( borderType && borderType !== 'none' ) {
		styleVars[ '--madeit-card-border-style' ] = borderType;
		styleVars[ '--madeit-card-border-width' ] = borderWidthToCss( borderWidth );
		if ( isVisibleColor( borderColor ) ) {
			styleVars[ '--madeit-card-border-color' ] = borderColor;
		}
	}

	if ( borderHoverType && borderHoverType !== 'none' ) {
		styleVars[ '--madeit-card-border-hover-style' ] = borderHoverType;
		styleVars[ '--madeit-card-border-hover-width' ] = borderWidthToCss( borderHoverWidth );
		if ( isVisibleColor( borderHoverColor ) ) {
			styleVars[ '--madeit-card-border-hover-color' ] = borderHoverColor;
		}
	}

	const radiusCss = borderRadiusToCss( borderRadius );
	if ( radiusCss !== '0px 0px 0px 0px' ) {
		styleVars[ '--madeit-card-border-radius' ] = radiusCss;
	}

	if ( hasShadow( boxShadow ) ) {
		styleVars[ '--madeit-card-box-shadow' ] = shadowToCss( boxShadow );
	}

	if ( hasShadow( boxShadowHover ) ) {
		styleVars[ '--madeit-card-box-shadow-hover' ] = shadowToCss( boxShadowHover );
	}

	return styleVars;
};

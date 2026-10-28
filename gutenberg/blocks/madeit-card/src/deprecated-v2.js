/**
 * Deprecated v2: save output before the hover/shadow fixes (shadows could be saved as "0pxpx",
 * hover styles depended on the Default/Hover tab). Kept verbatim so existing cards stay valid.
 */
import classnames from 'classnames';

import {
	InnerBlocks,
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { hasShadow, normalizeShadow } from './utils';

const boxShadowToCss = (shadow) => {
	if (!shadow || typeof shadow !== 'object') {
		return 'none';
	}

	const color = shadow.color || 'rgba(0, 0, 0, 0.15)';
	const x = shadow.x ?? shadow.horizontal ?? '0px';
	const y = shadow.y ?? shadow.vertical ?? '0px';
	const blur = shadow.blur ?? '0px';
	const spread = shadow.spread ?? '0px';
	const inset = shadow.inset ? 'inset ' : '';

	return `${ inset }${ x }px ${ y }px ${ blur }px ${ spread }px ${ color }`;
};

const normalizeBorderWidth = (value) => {
	if (!value || typeof value !== 'object') {
		return { top: '1px', right: '1px', bottom: '1px', left: '1px' };
	}

	return {
		top: value.top ?? '1px',
		right: value.right ?? '1px',
		bottom: value.bottom ?? '1px',
		left: value.left ?? '1px',
	};
};

const borderWidthToCss = (value) => {
	const safe = normalizeBorderWidth(value);
	return `${ safe.top } ${ safe.right } ${ safe.bottom } ${ safe.left }`;
};

function saveV2(props) {
	const {
		customBackgroundColor,
		backgroundColor,
		customTextColor,
		textColor,
		cardTitle,
		level,
		hasTitle,
		contentPadding,
		mediaBleed,
		url,
		opensInNewTab,
		linkTarget,
		minHeight,
		minHeightUnit,
		alignItems,
		borderHover,
		borderHoverType,
		borderType,
		borderWidth,
		borderWidthUnit,
		borderColor,
		borderHoverWidth,
		borderHoverWidthUnit,
		borderHoverColor,
		borderRadius,
		boxShadow,
		shadowHover,
		boxShadowHover,
	} = props.attributes;

	const styleVars = {};
	const safePadding = contentPadding && typeof contentPadding === 'object'
		? contentPadding
		: {
			top: '1.25rem',
			right: '1.25rem',
			bottom: '1.25rem',
			left: '1.25rem',
		};

	if (safePadding.top || safePadding.right || safePadding.bottom || safePadding.left) {
		styleVars['--madeit-card-content-padding-top'] = safePadding.top;
		styleVars['--madeit-card-content-padding-right'] = safePadding.right;
		styleVars['--madeit-card-content-padding-bottom'] = safePadding.bottom;
		styleVars['--madeit-card-content-padding-left'] = safePadding.left;
	}

	if (minHeight > 0) {
		styleVars['--madeit-card-min-height'] = `${ minHeight }${ minHeightUnit || 'px' }`;
	}

	if (alignItems && alignItems !== 'stretch') {
		styleVars['--madeit-card-align-items'] = alignItems;
	}

	const hasDefaultBorder = borderType && borderType !== 'none';
	const hasHoverBorder = (borderHover === 'hover' || borderHover === true) && borderHoverType && borderHoverType !== 'none';
	const hasCustomBorderWidth = borderWidth && typeof borderWidth === 'object' && Object.values(borderWidth).some((value) => value && value !== '1px' && value !== '0px');
	const hasCustomHoverBorderWidth = borderHoverWidth && typeof borderHoverWidth === 'object' && Object.values(borderHoverWidth).some((value) => value && value !== '1px' && value !== '0px');
	const hasCustomBorderColor = !!borderColor && borderColor !== 'transparent';
	const hasCustomHoverBorderColor = !!borderHoverColor && borderHoverColor !== 'transparent' && borderHoverColor !== borderColor;

	if (hasDefaultBorder) {
		styleVars['--madeit-card-border-style'] = borderType;
		if (hasCustomBorderWidth) {
			styleVars['--madeit-card-border-width'] = borderWidthToCss(borderWidth);
		}
		if (hasCustomBorderColor) {
			styleVars['--madeit-card-border-color'] = borderColor;
		}
	}

	if (hasHoverBorder) {
		styleVars['--madeit-card-border-hover-style'] = borderHoverType;
		if (hasCustomHoverBorderWidth) {
			styleVars['--madeit-card-border-hover-width'] = borderWidthToCss(borderHoverWidth);
		}
		if (hasCustomHoverBorderColor) {
			styleVars['--madeit-card-border-hover-color'] = borderHoverColor;
		}
	}

	if (borderRadius && typeof borderRadius === 'object') {
		const radiusCss = [
			borderRadius.top ?? '0px',
			borderRadius.right ?? '0px',
			borderRadius.bottom ?? '0px',
			borderRadius.left ?? '0px',
		].join(' ');

		if (radiusCss !== '0px 0px 0px 0px') {
			styleVars['--madeit-card-border-radius'] = radiusCss;
		}
	}

	if (boxShadow && typeof boxShadow === 'object') {
		const shadowCss = boxShadowToCss(boxShadow);
		if (shadowCss && shadowCss !== 'none' && shadowCss !== '0px 0px 0px 0px rgba(0, 0, 0, 0.15)') {
			styleVars['--madeit-card-box-shadow'] = shadowCss;
		}
	}

	if (shadowHover === 'hover' && boxShadowHover && typeof boxShadowHover === 'object') {
		const shadowHoverCss = boxShadowToCss(boxShadowHover);
		if (shadowHoverCss && shadowHoverCss !== 'none' && shadowHoverCss !== '0px 0px 0px 0px rgba(0, 0, 0, 0.15)') {
			styleVars['--madeit-card-box-shadow-hover'] = shadowHoverCss;
		}
	}

	const { className } = props;

	const backgroundColorClass = backgroundColor
		? getColorClassName('background-color', backgroundColor)
		: undefined;
	const textColorClass = textColor
		? getColorClassName('color', textColor)
		: undefined;

	const TagName = 'h' + level;
	const cardUrl = typeof url === 'object' && url !== null ? url.url : url;
	const isNewTab = opensInNewTab !== undefined ? opensInNewTab : (linkTarget === '_blank' || (typeof url === 'object' && url !== null && url.opensInNewTab));
	const target = isNewTab ? '_blank' : undefined;
	const rel = isNewTab ? 'noopener' : undefined;
	const borderRadiusValue = borderRadius || {};
	const radiusCss = [
		borderRadiusValue.top ?? '0px',
		borderRadiusValue.right ?? '0px',
		borderRadiusValue.bottom ?? '0px',
		borderRadiusValue.left ?? '0px',
	].join(' ');

	let wrapperClasses = classnames(className, {
		card: true,
	});

	wrapperClasses = classnames(wrapperClasses, {
		'has-media-bleed': !!mediaBleed,
	});

	wrapperClasses = classnames(wrapperClasses, {
		'has-text-color': textColorClass,
		'has-background': backgroundColorClass,
		[backgroundColorClass]: backgroundColorClass,
		[textColorClass]: textColorClass,
	});

	const blockProps = useBlockProps.save({
		className: wrapperClasses,
		style: {
			backgroundColor: backgroundColorClass
				? undefined
				: customBackgroundColor,
			color: textColorClass ? undefined : customTextColor,
			...styleVars,
		},
	});

	return (
		<div {...blockProps}>
			{cardUrl ? (
				<>
					<a
						href={cardUrl}
						className="card-link"
						target={target}
						rel={rel}
					></a>
					{hasTitle && (
						<div className="card-header">
							<TagName>
								<RichText.Content value={cardTitle} />
							</TagName>
						</div>
					)}
					<div className="card-body">
						<InnerBlocks.Content />
					</div>
				</>
			) : (
				<>
					{hasTitle && (
						<div className="card-header">
							<TagName>
								<RichText.Content value={cardTitle} />
							</TagName>
						</div>
					)}
					<div className="card-body">
						<InnerBlocks.Content />
					</div>
				</>
			)}
		</div>
	);
}


const migrateShadow = ( shadow ) => {
	if ( ! hasShadow( shadow ) ) {
		return {};
	}

	return normalizeShadow( shadow );
};

export default {
	attributes: {
		"backgroundColor": {
			"type": "string"
		},
		"customBackgroundColor": {
			"type": "string"
		},
		"textColor": {
			"type": "string"
		},
		"customTextColor": {
			"type": "string"
		},
		"hasTitle": {
			"type": "boolean",
			"default": false
		},
		"cardTitle": {
			"type": "string"
		},
		"level": {
			"type": "number",
			"default": 2
		},
		"contentPadding": {
			"type": "object",
			"default": {
				"top": "20px",
				"right": "20px",
				"bottom": "20px",
				"left": "20px"
			}
		},
		"paddingUnit": {
			"type": "string",
			"default": "px"
		},
		"mediaBleed": {
			"type": "boolean",
			"default": false
		},
		"minHeight": {
			"type": "number",
			"default": 0
		},
		"minHeightUnit": {
			"type": "string",
			"default": "px"
		},
		"alignItems": {
			"type": "string",
			"default": "stretch"
		},
		"borderHover": {
			"type": "string",
			"default": "default"
		},
		"borderHoverType": {
			"type": "string",
			"default": "none"
		},
		"borderType": {
			"type": "string",
			"default": "none"
		},
		"borderWidth": {
			"type": "object",
			"default": {
				"top": "1px",
				"right": "1px",
				"bottom": "1px",
				"left": "1px"
			}
		},
		"borderWidthUnit": {
			"type": "string",
			"default": "px"
		},
		"borderColor": {
			"type": "string",
			"default": "transparent"
		},
		"borderHoverWidth": {
			"type": "object",
			"default": {
				"top": "1px",
				"right": "1px",
				"bottom": "1px",
				"left": "1px"
			}
		},
		"borderHoverWidthUnit": {
			"type": "string",
			"default": "px"
		},
		"borderHoverColor": {
			"type": "string",
			"default": "transparent"
		},
		"borderRadius": {
			"type": "object",
			"default": {
				"top": "0px",
				"right": "0px",
				"bottom": "0px",
				"left": "0px"
			}
		},
		"borderRadiusUnit": {
			"type": "string",
			"default": "px"
		},
		"boxShadow": {
			"type": "object",
			"default": {}
		},
		"shadowHover": {
			"type": "string",
			"default": "default"
		},
		"boxShadowHover": {
			"type": "object",
			"default": {}
		},
		"url": {
			"type": "string"
		},
		"opensInNewTab": {
			"type": "boolean",
			"default": false
		},
		"linkTarget": {
			"type": "string"
		},
		"hideOnDesktop": {
			"type": "boolean"
		},
		"hideOnTablet": {
			"type": "boolean"
		},
		"hideOnMobile": {
			"type": "boolean"
		},
		"aosFade": {
			"type": "string",
			"default": "",
			"source": "attribute",
			"selector": ".wp-block-madeit-block-card",
			"attribute": "data-aos"
		},
		"aosDelay": {
			"type": "string",
			"default": "",
			"source": "attribute",
			"selector": ".wp-block-madeit-block-card",
			"attribute": "data-aos-delay"
		},
		"aosDelayCustom": {
			"type": "string",
			"default": "",
			"source": "attribute",
			"selector": ".wp-block-madeit-block-card",
			"attribute": "data-aos-delay"
		}
	},
	migrate: ( attributes ) => {
		const { borderHover, shadowHover, ...rest } = attributes;

		return {
			...rest,
			boxShadow: migrateShadow( attributes.boxShadow ),
			boxShadowHover: migrateShadow( attributes.boxShadowHover ),
		};
	},
	save: saveV2,
};

(function (wp) {
	const { addFilter } = wp.hooks;
	const { createHigherOrderComponent } = wp.compose;
	const { Fragment, createElement } = wp.element;
	const { InspectorControls } = wp.blockEditor || wp.editor;
	const {
		PanelBody,
		RangeControl,
		SelectControl,
		ToggleControl,
		TextControl
	} = wp.components;

	const DEFAULT_SEPARATOR_ATTRS = {
		separatorWidth: 100,
		separatorAlign: 'center',
		separatorThickness: 1,
		separatorStyle: 'solid',
		separatorHasIcon: false,
		separatorIcon: '★'
	};

	/**
	 * Add custom attributes
	 */
	function addSeparatorAttributes(settings, name) {
		if (name !== 'core/separator') return settings;

		const legacyAttrs = {
			separatorWidth: { type: 'number' },
			separatorAlign: { type: 'string' },
			separatorThickness: { type: 'number' },
			separatorStyle: { type: 'string' },
			separatorHasIcon: { type: 'boolean' },
			separatorIcon: { type: 'string' },
		};

		settings.attributes = {
			...settings.attributes,
			...legacyAttrs,
		};

		const legacyDeprecatedSave = {
			attributes: {
				...settings.attributes,
				...legacyAttrs,
			},
			migrate: (attributes) => ({
				...attributes,
				separatorWidth: attributes.separatorWidth ?? DEFAULT_SEPARATOR_ATTRS.separatorWidth,
				separatorAlign: attributes.separatorAlign ?? DEFAULT_SEPARATOR_ATTRS.separatorAlign,
				separatorThickness: attributes.separatorThickness ?? DEFAULT_SEPARATOR_ATTRS.separatorThickness,
				separatorStyle: attributes.separatorStyle ?? DEFAULT_SEPARATOR_ATTRS.separatorStyle,
				separatorHasIcon: attributes.separatorHasIcon ?? DEFAULT_SEPARATOR_ATTRS.separatorHasIcon,
				separatorIcon: attributes.separatorIcon ?? DEFAULT_SEPARATOR_ATTRS.separatorIcon,
			}),
			save: (props) => {
				const { separatorWidth, separatorAlign, separatorThickness, separatorStyle } = props.attributes;
				const width = separatorWidth ?? DEFAULT_SEPARATOR_ATTRS.separatorWidth;
				const thickness = separatorThickness ?? DEFAULT_SEPARATOR_ATTRS.separatorThickness;
				const style = separatorStyle ?? DEFAULT_SEPARATOR_ATTRS.separatorStyle;
				const align = separatorAlign ?? DEFAULT_SEPARATOR_ATTRS.separatorAlign;

				return createElement('hr', {
					className: [
						'wp-block-separator',
						align ? `is-aligned-${align}` : '',
					].filter(Boolean).join(' '),
					style: {
						width: `${width}%`,
						borderTop: `${style} ${thickness}px`,
						margin: align === 'left'
							? '0 auto 0 0'
							: align === 'right'
								? '0 0 0 auto'
								: '0 auto',
					},
				});
			},
		};

		settings.deprecated = [
			legacyDeprecatedSave,
			...(Array.isArray(settings.deprecated) ? settings.deprecated : []),
		];

		return settings;
	}

	addFilter(
		'blocks.registerBlockType',
		'madeit/separator-attributes',
		addSeparatorAttributes
	);

	function parseLegacySeparatorAttributes(attributes = {}) {
		if (!attributes || typeof attributes !== 'object') {
			return attributes;
		}

		const next = { ...attributes };
		const style = next.style;
		const className = next.className || '';

		if (next.separatorWidth === undefined) {
			const widthValue = typeof style === 'string'
				? style.match(/width\s*:\s*([0-9.]+%)/i)?.[1]
				: style && typeof style === 'object'
					? style.width
					: undefined;

			if (widthValue !== undefined) {
				next.separatorWidth = parseFloat(widthValue);
			}
		}

		if (next.separatorThickness === undefined || next.separatorStyle === undefined) {
			const shorthandMatch = typeof style === 'string'
				? style.match(/border-top\s*:\s*([a-z-]+)\s+([0-9.]+px)/i)
				: null;

			if (shorthandMatch) {
				if (next.separatorStyle === undefined) {
					next.separatorStyle = shorthandMatch[1].toLowerCase();
				}
				if (next.separatorThickness === undefined) {
					next.separatorThickness = parseFloat(shorthandMatch[2]);
				}
			}
		}

		if (next.separatorThickness === undefined) {
			const thicknessValue = typeof style === 'string'
				? style.match(/border-top-width\s*:\s*([0-9.]+px)/i)?.[1]
				: style && typeof style === 'object'
					? style.borderTopWidth
					: undefined;

			if (thicknessValue !== undefined) {
				next.separatorThickness = parseFloat(thicknessValue);
			}
		}

		if (next.separatorStyle === undefined) {
			const styleValue = typeof style === 'string'
				? style.match(/border-top-style\s*:\s*([a-z-]+)/i)?.[1]
				: style && typeof style === 'object'
					? style.borderTopStyle
					: undefined;

			if (styleValue) {
				next.separatorStyle = styleValue.toLowerCase();
			}
		}

		if (next.separatorAlign === undefined) {
			const alignMatch = className.match(/is-aligned-(left|center|right)/i);
			if (alignMatch) {
				next.separatorAlign = alignMatch[1].toLowerCase();
			}
		}

		return next;
	}

	addFilter(
		'blocks.getBlockAttributes',
		'madeit/separator-auto-migrate',
		(attributes, settings, name) => {
			if (name !== 'core/separator') {
				return attributes;
			}

			return parseLegacySeparatorAttributes(attributes);
		}
	);

	/**
	 * Add Inspector Controls
	 */
	const withSeparatorControls = createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			if (props.name !== 'core/separator') {
				return createElement(BlockEdit, props);
			}

			const {
				attributes: {
					separatorWidth,
					separatorAlign,
					separatorThickness,
					separatorStyle,
					separatorHasIcon,
					separatorIcon
				},
				setAttributes
			} = props;

				const effectiveWidth = separatorWidth ?? DEFAULT_SEPARATOR_ATTRS.separatorWidth;
				const effectiveAlign = separatorAlign ?? DEFAULT_SEPARATOR_ATTRS.separatorAlign;
				const effectiveThickness = separatorThickness ?? DEFAULT_SEPARATOR_ATTRS.separatorThickness;
				const effectiveStyle = separatorStyle ?? DEFAULT_SEPARATOR_ATTRS.separatorStyle;
				const effectiveHasIcon = separatorHasIcon ?? DEFAULT_SEPARATOR_ATTRS.separatorHasIcon;
				const effectiveIcon = separatorIcon ?? DEFAULT_SEPARATOR_ATTRS.separatorIcon;

			return createElement(
				Fragment,
				{},
				createElement(BlockEdit, props),
				createElement(
					InspectorControls,
					{},
					createElement(
						PanelBody,
						{ title: 'Separator Settings', initialOpen: true },

						createElement(RangeControl, {
							label: 'Width (%)',
							value: effectiveWidth,
							onChange: (value) => setAttributes({ separatorWidth: value }),
							min: 10,
							max: 100
						}),

						createElement(SelectControl, {
							label: 'Alignment',
							value: effectiveAlign,
							options: [
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' }
							],
							onChange: (value) => setAttributes({ separatorAlign: value })
						}),

						createElement(RangeControl, {
							label: 'Thickness (px)',
							value: effectiveThickness,
							onChange: (value) => setAttributes({ separatorThickness: value }),
							min: 1,
							max: 10
						}),

						createElement(SelectControl, {
							label: 'Line Style',
							value: effectiveStyle,
							options: [
								{ label: 'Solid', value: 'solid' },
								{ label: 'Dashed', value: 'dashed' },
								{ label: 'Dotted', value: 'dotted' }
							],
							onChange: (value) => setAttributes({ separatorStyle: value })
						}),

						// createElement(ToggleControl, {
						// 	label: 'Show Icon',
						// 	checked: effectiveHasIcon,
						// 	onChange: (value) => setAttributes({ separatorHasIcon: value })
						// }),

						// separatorHasIcon &&
						// 	createElement(TextControl, {
						// 	label: 'Icon / Character',
						// 	value: effectiveIcon,
						// 		onChange: (value) => setAttributes({ separatorIcon: value })
						// 	})
					)
				)
			);
		};
	}, 'withSeparatorControls');

	addFilter(
		'editor.BlockEdit',
		'madeit/separator-controls',
		withSeparatorControls
	);

	


	/**
	 * Add extra props
	 */
	const TARGET_BLOCKS = ['core/separator'];
	function getSeparatorStyleVars(attributes = {}) {
		return {};
	}

	function addSeparatorProps(extraProps, blockType, attributes) {
		if (!TARGET_BLOCKS.includes(blockType.name)) return extraProps;
		if (
			attributes.separatorWidth === undefined &&
			attributes.separatorAlign === undefined &&
			attributes.separatorThickness === undefined &&
			attributes.separatorStyle === undefined &&
			attributes.separatorHasIcon === undefined &&
			attributes.separatorIcon === undefined
		) {
			return extraProps;
		}

		const width = attributes.separatorWidth;
		const thickness = attributes.separatorThickness;
		const style = attributes.separatorStyle;
		const align = attributes.separatorAlign;

		extraProps.className = [
			extraProps.className || '',
			align ? `is-aligned-${align}` : '',
			attributes.separatorHasIcon ? 'has-icon' : ''
		].join(' ');

		extraProps.style = {
			...(extraProps.style || {}),
			...(width !== undefined ? { width: `${width}%` } : {}),
			...(style !== undefined && thickness !== undefined ? { borderTop: `${style} ${thickness}px` } : {}),
			...(align !== undefined ? {
				margin: align === 'left'
					? '0 auto 0 0'
					: align === 'right'
						? '0 0 0 auto'
						: '0 auto',
			} : {}),
		};

		return extraProps;
	}

	addFilter(
		'blocks.getSaveContent.extraProps',
		'madeit/separator-save-props',
		addSeparatorProps
	);

	const withSeparatorEditorStyles = createHigherOrderComponent((BlockListBlock) => {
		return (props) => {
			if (props.name !== 'core/separator') {
				return createElement(BlockListBlock, props);
			}

			const {
				separatorWidth,
				separatorAlign,
				separatorThickness,
				separatorStyle,
				separatorHasIcon
			} = props.attributes;

			const effectiveWidth = separatorWidth ?? DEFAULT_SEPARATOR_ATTRS.separatorWidth;
			const effectiveAlign = separatorAlign ?? DEFAULT_SEPARATOR_ATTRS.separatorAlign;
			const effectiveThickness = separatorThickness ?? DEFAULT_SEPARATOR_ATTRS.separatorThickness;
			const effectiveStyle = separatorStyle ?? DEFAULT_SEPARATOR_ATTRS.separatorStyle;

			const wrapperProps = {
				style: {
					paddingTop: '4px',
					paddingBottom: '4px',
					minHeight: '18px',
					cursor: 'pointer',
					marginLeft: effectiveAlign === 'left' ? '0' : 'auto',
					marginRight: effectiveAlign === 'right' ? '0' : 'auto',
					width: `${effectiveWidth}%`,
					borderTop: `${effectiveStyle} ${effectiveThickness}px`,
				},
				className: [
					props.className || '',
					separatorAlign ? `is-aligned-${separatorAlign}` : '',
					separatorHasIcon ? 'has-icon' : '',
				].join(' ')
			};

			const mergedStyle = {
				...(props.style || {}),
				width: `${effectiveWidth}%`,
				borderTop: `${effectiveStyle} ${effectiveThickness}px`,
				margin: effectiveAlign === 'left'
					? '0 auto 0 0'
					: effectiveAlign === 'right'
						? '0 0 0 auto'
						: '0 auto',
			};

			return createElement(BlockListBlock, {
				...props,
				style: mergedStyle,
				wrapperProps
			});
		};
	}, 'withSeparatorEditorStyles');

	addFilter(
		'editor.BlockListBlock',
		'madeit/separator-editor-styles',
		withSeparatorEditorStyles
	);

	/**
	 * Wrap save output if icon is enabled
	 */
	function wrapSeparatorSave(element, blockType, attributes) {
		if (blockType.name !== 'core/separator') return element;
		if (!attributes.separatorHasIcon) return element;

		return createElement(
			'div',
			{
				className: `wp-block-separator-wrapper is-aligned-${attributes.separatorAlign}`
			},
			createElement('span', { className: 'separator-line' }),
			createElement('span', { className: 'separator-icon' }, attributes.separatorIcon),
			createElement('span', { className: 'separator-line' })
		);
	}

	addFilter(
		'blocks.getSaveElement',
		'madeit/separator-wrap-save',
		wrapSeparatorSave
	);
})(window.wp);
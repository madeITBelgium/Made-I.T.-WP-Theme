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

		settings.attributes = {
			...settings.attributes,
			separatorWidth: {
				type: 'number'
			},
			separatorAlign: {
				type: 'string'
			},
			separatorThickness: {
				type: 'number'
			},
			separatorStyle: {
				type: 'string'
			},
			separatorHasIcon: {
				type: 'boolean'
			},
			separatorIcon: {
				type: 'string'
			}
		};

		return settings;
	}

	addFilter(
		'blocks.registerBlockType',
		'madeit/separator-attributes',
		addSeparatorAttributes
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

		extraProps.className = [
			extraProps.className || '',
			attributes.separatorAlign ? `is-aligned-${attributes.separatorAlign}` : '',
			attributes.separatorHasIcon ? 'has-icon' : ''
		].join(' ');

		extraProps.style = {
			...(extraProps.style || {}),
			...(attributes.separatorWidth !== undefined ? { width: `${attributes.separatorWidth}%` } : {}),
			...(attributes.separatorStyle && attributes.separatorThickness !== undefined
				? {
					'border-top': attributes.separatorStyle === 'solid'
						? `solid ${attributes.separatorThickness}px`
						: `${attributes.separatorStyle} ${attributes.separatorThickness}px`
				}
				: {}),
			...(attributes.separatorAlign
				? {
					margin: attributes.separatorAlign === 'left'
						? '0 auto'
						: attributes.separatorAlign === 'right'
							? '0 0 0 auto'
							: '0 auto'
				}
				: {})

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
					...(separatorWidth !== undefined ? { width: `${effectiveWidth}%` } : {}),
					...(separatorStyle !== undefined ? { borderTopStyle: effectiveStyle } : {}),
					...(separatorThickness !== undefined ? { borderTopWidth: `${effectiveThickness}px` } : {}),
					...(separatorAlign !== undefined
						? {
							marginLeft: effectiveAlign === 'left' ? '0' : 'auto',
							marginRight: effectiveAlign === 'right' ? '0' : 'auto'
						}
						: {})
				},
				className: [
					props.className || '',
					separatorAlign ? `is-aligned-${separatorAlign}` : '',
					separatorHasIcon ? 'has-icon' : '',
				].join(' ')
			};

			return createElement(BlockListBlock, {
				...props,
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
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

	/**
	 * Add custom attributes
	 */
	function addSeparatorAttributes(settings, name) {
		if (name !== 'core/separator') return settings;

		settings.attributes = {
			...settings.attributes,
			separatorWidth: {
				type: 'number',
				default: 100
			},
			separatorAlign: {
				type: 'string',
				default: 'center'
			},
			separatorThickness: {
				type: 'number',
				default: 1
			},
			separatorStyle: {
				type: 'string',
				default: 'solid'
			},
			separatorHasIcon: {
				type: 'boolean',
				default: false
			},
			separatorIcon: {
				type: 'string',
				default: '★'
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
							value: separatorWidth,
							onChange: (value) => setAttributes({ separatorWidth: value }),
							min: 10,
							max: 100
						}),

						createElement(SelectControl, {
							label: 'Alignment',
							value: separatorAlign,
							options: [
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' }
							],
							onChange: (value) => setAttributes({ separatorAlign: value })
						}),

						createElement(RangeControl, {
							label: 'Thickness (px)',
							value: separatorThickness,
							onChange: (value) => setAttributes({ separatorThickness: value }),
							min: 1,
							max: 10
						}),

						createElement(SelectControl, {
							label: 'Line Style',
							value: separatorStyle,
							options: [
								{ label: 'Solid', value: 'solid' },
								{ label: 'Dashed', value: 'dashed' },
								{ label: 'Dotted', value: 'dotted' }
							],
							onChange: (value) => setAttributes({ separatorStyle: value })
						}),

						// createElement(ToggleControl, {
						// 	label: 'Show Icon',
						// 	checked: separatorHasIcon,
						// 	onChange: (value) => setAttributes({ separatorHasIcon: value })
						// }),

						// separatorHasIcon &&
						// 	createElement(TextControl, {
						// 		label: 'Icon / Character',
						// 		value: separatorIcon,
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

		extraProps.className = [
			extraProps.className || '',
			`is-aligned-${attributes.separatorAlign}`,
			attributes.separatorHasIcon ? 'has-icon' : ''
		].join(' ');

		extraProps.style = {
			...(extraProps.style || {}),
			'width': `${attributes.separatorWidth}%`,
			'border-top': attributes.separatorStyle === 'solid' ? `solid ${attributes.separatorThickness}px` : `${attributes.separatorStyle} ${attributes.separatorThickness}px`,
			'margin-inline': attributes.separatorAlign === 'left' ? '0 auto' :
							 attributes.separatorAlign === 'right' ? '0 0 0 auto' : '0 auto'

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

			const wrapperProps = {
				style: {
					width: `${separatorWidth}%`,
					borderTopStyle: separatorStyle,
					borderTopWidth: `${separatorThickness}px`,
					marginLeft: separatorAlign === 'left' ? '0' : 'auto',
					marginRight: separatorAlign === 'right' ? '0' : 'auto',
				},
				className: [
					props.className || '',
					`is-aligned-${separatorAlign}`,
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
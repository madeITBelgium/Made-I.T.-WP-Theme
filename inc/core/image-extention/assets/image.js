(function (wp) {
	const { addFilter } = wp.hooks;
	const { createHigherOrderComponent } = wp.compose;
	const { Fragment, createElement, cloneElement, Children } = wp.element;
	const { InspectorControls } = wp.blockEditor || wp.editor;
	const { PanelBody, TextControl } = wp.components;

	/* --------------------------------------------------
	 * ADD CUSTOM ATTRIBUTES
	 * -------------------------------------------------- */
	function addImageAttributes(settings, name) {
		if (name !== 'core/image') return settings;

		settings.attributes = {
			...settings.attributes,
			imageWidthTablet: {
				type: 'number',
			},
			imageHeightTablet: {
				type: 'number',
			},
			imageWidthMobile: {
				type: 'number',
			},
			imageHeightMobile: {
				type: 'number',
			},
		};

		return settings;
	}

	addFilter(
		'blocks.registerBlockType',
		'madeit/image-attributes',
		addImageAttributes
	);

	/* --------------------------------------------------
	 * BREAKPOINT SWITCHER
	 * -------------------------------------------------- */
	const BreakpointSwitcher = ({ active, onChange }) =>
		createElement(
			'div',
			{ className: 'madeit-breakpoint-switcher' },
			[
				{ key: 'tablet', icon: 'tablet' },
				{ key: 'mobile', icon: 'smartphone' },
			].map(({ key, icon }) =>
				createElement(
					'button',
					{
						key,
						type: 'button',
						className:
							'madeit-bp-btn' + (active === key ? ' is-active' : ''),
						onClick: () => onChange(key),
					},
					createElement('span', {
						className: `dashicons dashicons-${icon}`,
					})
				)
			)
		);

	/* --------------------------------------------------
	 * CONTROL HEADER
	 * -------------------------------------------------- */
	const ControlHeader = ({ title, breakpoint, onBreakpointChange }) =>
		createElement(
			'div',
			{ className: 'madeit-control-header' },
			createElement(
				'div',
				{ className: 'madeit-control-header__left' },
				createElement('div', { className: 'madeit-control-title' }, title)
			),
			createElement(
				'div',
				{ className: 'madeit-control-header__right' },
				createElement(BreakpointSwitcher, {
					active: breakpoint,
					onChange: onBreakpointChange,
				})
			)
		);

	/* --------------------------------------------------
	 * INSPECTOR CONTROLS
	 * -------------------------------------------------- */
	const withImageControls = createHigherOrderComponent((BlockEdit) => {
		return (props) => {
			if (props.name !== 'core/image') {
				return createElement(BlockEdit, props);
			}

			const [breakpoint, setBreakpoint] = wp.element.useState('tablet');

			const {
				attributes: {
					imageWidthTablet,
					imageHeightTablet,
					imageWidthMobile,
					imageHeightMobile,
				},
				setAttributes,
			} = props;

			const breakpointMap = {
				tablet: {
					width: imageWidthTablet,
					height: imageHeightTablet,
				},
				mobile: {
					width: imageWidthMobile,
					height: imageHeightMobile,
				},
			};

			const current = breakpointMap[breakpoint];

			return createElement(
				Fragment,
				{},
				createElement(BlockEdit, props),
				createElement(
					InspectorControls,
					{},
					createElement(
						PanelBody,
						{
							title: 'Responsive',
							initialOpen: true,
							className: 'madeit-responsive-image-panel',
						},
						createElement(ControlHeader, {
							title: 'Responsive Image',
							breakpoint,
							onBreakpointChange: setBreakpoint,
						}),
						createElement(
							'div',
							{ className: 'madeit-controlUnits' },
							createElement(TextControl, {
								label: 'Breedte',
								value: current.width || '',
								onChange: (value) =>
									setAttributes({
										[`imageWidth${
											breakpoint.charAt(0).toUpperCase() +
											breakpoint.slice(1)
										}`]: value ? parseInt(value, 10) : undefined,
									}),
								placeholder: 'Automatisch',
							})
						),
						createElement(
							'div',
							{ className: 'madeit-controlUnits' },
							createElement(TextControl, {
								label: 'Hoogte',
								value: current.height || '',
								onChange: (value) =>
									setAttributes({
										[`imageHeight${
											breakpoint.charAt(0).toUpperCase() +
											breakpoint.slice(1)
										}`]: value ? parseInt(value, 10) : undefined,
									}),
								placeholder: 'Automatisch',
							})
						)
					)
				)
			);
		};
	}, 'withImageControls');

	addFilter(
		'editor.BlockEdit',
		'madeit/image-controls',
		withImageControls
	);

	/* --------------------------------------------------
	 * BUILD RESPONSIVE CSS VARIABLES
	 * desktop = native Gutenberg width/height
	 * mobile = custom min
	 * tablet = optional override
	 * -------------------------------------------------- */
	function applyImageStyle(attributes) {
		const {
			width,
			height,
			imageWidthTablet,
			imageHeightTablet,
			imageWidthMobile,
			imageHeightMobile,
			style = {},
		} = attributes;

		const customStyle = { ...style };

        const hasResponsive =
            imageWidthMobile ||
            imageHeightMobile ||
            imageWidthTablet ||
            imageHeightTablet;

        // 👉 NIETS DOEN als geen responsive data
        if (!hasResponsive) {
            return customStyle;
        }

		if (imageWidthTablet || imageWidthMobile) {
            const maxWidth = width || '1400px';
            const minWidth = imageWidthMobile ? `${imageWidthMobile}px` : '250px';

            customStyle['--madeit-image-width'] = `clamp(${minWidth}, 35vw, ${maxWidth})`;
        }

		if (imageHeightMobile || imageHeightTablet) {
            const maxHeight = height || '800px';
            const minHeight = imageHeightMobile ? `${imageHeightMobile}px` : '100px';

            customStyle['--madeit-image-height'] = `clamp(${minHeight}, 90vw, ${maxHeight})`;
        }

        if (width && !imageWidthTablet && !imageWidthMobile) {
            customStyle['--madeit-image-width'] = `${width}`;
        }

        if (height && !imageHeightTablet && !imageHeightMobile) {
            customStyle['--madeit-image-height'] = `${height}`;
        }


		return customStyle;
	}

	/* --------------------------------------------------
	 * ADD CSS VARS TO SAVED BLOCK
	 * -------------------------------------------------- */
	function addImageExtraProps(extraProps, blockType, attributes) {
		if (blockType.name !== 'core/image') {
			return extraProps;
		}

		const {
			width,
			height,
			imageWidthTablet,
			imageHeightTablet,
			imageWidthMobile,
			imageHeightMobile,
			style = {},
		} = attributes;

		const hasResponsive =
            imageWidthMobile ||
            imageHeightMobile ||
            imageWidthTablet ||
            imageHeightTablet;

		const result = {
			...extraProps,
			style: {
				...(extraProps.style || {}),
				...applyImageStyle(attributes),
			},
		};

		if (hasResponsive) {
			result['data-has-responsive'] = true;
			result.className = 'madeit-responsive-size';
		}

		return result;
	}

	addFilter(
		'blocks.getSaveContent.extraProps',
		'madeit/image-extra-props',
		addImageExtraProps
	);

	/* --------------------------------------------------
	 * REPLACE GUTENBERG INLINE IMG WIDTH/HEIGHT
	 * -------------------------------------------------- */
	// function replaceImageStyles(node) {
    //     if (!node || !node.props) {
    //         return node;
    //     }

    //     // Direct image
    //     if (node.type === 'img') {
    //         const existingStyle = node.props.style || {};
    //         const { width, height, aspectRatio, ...restStyle } = existingStyle;


    //         return wp.element.cloneElement(node, {
    //             style: {
    //                 ...restStyle,
    //                 width: 'var(--madeit-image-width, auto)',
    //                 height: 'var(--madeit-image-height, auto)',
    //             },
    //         });
    //     }

    //     // Recursive children
    //     if (node.props.children) {
    //         const newChildren = wp.element.Children.map(node.props.children, (child) =>
    //             replaceImageStyles(child)
    //         );

    //         return wp.element.cloneElement(node, {
    //             children: newChildren,
    //         });
    //     }

    //     return node;
    // }

    // function withResponsiveImageStyles(ExtraProps, blockType, attributes) {
    //     if (blockType.name !== 'core/image') {
    //         return ExtraProps;
    //     }

    //     return {
    //         ...ExtraProps,
    //         children: replaceImageStyles(ExtraProps.children),
    //     };
    // }

    // addFilter(
    //     'blocks.getSaveContent.extraProps',
    //     'madeit/image-responsive-styles',
    //     withResponsiveImageStyles
    // );

})(window.wp);
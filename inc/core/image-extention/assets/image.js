(function (wp) {
	const { addFilter } = wp.hooks;
	const { createHigherOrderComponent } = wp.compose;
	const { Fragment, createElement } = wp.element;
	const { InspectorControls } = wp.blockEditor;
	const {
		Button,
		ButtonGroup,
		ToggleControl,
		__experimentalUnitControl: UnitControl,
	} = wp.components;

	const SUPPORTED_BLOCKS = ['core/image', 'core/cover'];

	const DEVICE_OPTIONS = [
		{ label: 'Tablet', key: 'tablet', icon: 'tablet' },
		{ label: 'Mobile', key: 'mobile', icon: 'smartphone' },
	];

	function isSupportedBlock(name) {
		return SUPPORTED_BLOCKS.includes(name);
	}

	function normalizeResponsiveValue(value) {
		if (value === null || value === undefined) {
			return undefined;
		}

		const normalized = String(value).trim();
		return normalized === '' ? undefined : normalized;
	}

	function hasResponsiveValues(responsiveDimensions) {
		return DEVICE_OPTIONS.some(({ key }) => {
			const values = responsiveDimensions?.[key] || {};
			return !!(normalizeResponsiveValue(values.width) || normalizeResponsiveValue(values.height));
		});
	}

	function buildResponsiveStyle(attributes) {
		const responsiveDimensions = attributes.responsiveDimensions || {};
		const responsiveEnabled = !!attributes.useResponsiveDimensions;

		if (!responsiveEnabled || !hasResponsiveValues(responsiveDimensions)) {
			return null;
		}

		const style = {};

		DEVICE_OPTIONS.forEach(({ key }) => {
			const dimensions = responsiveDimensions[key] || {};
			const width = normalizeResponsiveValue(dimensions.width);
			const height = normalizeResponsiveValue(dimensions.height);

			if (width) {
				style[`--madeit-image-width-${key}`] = width;
			}

			if (height) {
				style[`--madeit-image-height-${key}`] = height;
			}
		});

		return Object.keys(style).length > 0 ? style : null;
	}

	function addClassName(className, nextClass) {
		const source = String(className || '').trim();
		if (!source) {
			return nextClass;
		}

		if (source.split(/\s+/).includes(nextClass)) {
			return source;
		}

		return `${source} ${nextClass}`;
	}

	function registerResponsiveAttributes(settings, name) {
		if (!isSupportedBlock(name)) {
			return settings;
		}

		settings.attributes = {
			...settings.attributes,
			useResponsiveDimensions: {
				type: 'boolean',
				default: false,
			},
			responsiveDimensions: {
				type: 'object',
				default: {},
			},
			responsiveActiveDevice: {
				type: 'string',
				default: '',
			},
		};

		return settings;
	}

	addFilter(
		'blocks.registerBlockType',
		'madeit/responsive-dimensions-attributes',
		registerResponsiveAttributes
	);

	const withResponsiveDimensions = createHigherOrderComponent(
		(BlockEdit) => (props) => {
			if (!isSupportedBlock(props.name)) {
				return createElement(BlockEdit, props);
			}

			const { attributes, setAttributes } = props;
			const responsiveEnabled = !!attributes.useResponsiveDimensions;
			const responsive = attributes.responsiveDimensions || {};
			const selectedDevice = attributes.responsiveActiveDevice || '';
			const activeDevice = DEVICE_OPTIONS.some(({ key }) => key === selectedDevice)
				? selectedDevice
				: '';

			const setCurrentDeviceValue = (property, nextValue) => {
				if (!activeDevice) {
					return;
				}

				setAttributes({
					responsiveDimensions: {
						...responsive,
						[activeDevice]: {
							...(responsive[activeDevice] || {}),
							[property]: normalizeResponsiveValue(nextValue),
						},
					},
				});
			};

			const setPreviewDevice = (targetDevice) => {
				const label = DEVICE_OPTIONS.find((option) => option.key === targetDevice)?.label;
				if (!label) {
					return;
				}

				const editPostDispatch = wp.data.dispatch('core/edit-post');
				if (typeof editPostDispatch?.setDeviceType === 'function') {
					editPostDispatch.setDeviceType(label);
					return;
				}

				if (typeof editPostDispatch?.__experimentalSetPreviewDeviceType === 'function') {
					editPostDispatch.__experimentalSetPreviewDeviceType(label);
				}
			};

			return createElement(
				Fragment,
				{},
				createElement(BlockEdit, props),
				createElement(
					InspectorControls,
					{ group: 'dimensions' },
					createElement(
						'div',
						{
							className: 'madeit-responsive-image-panel',
						},
						createElement(ToggleControl, {
							label: 'Responsive gebruiken',
							checked: responsiveEnabled,
							onChange: (enabled) =>
								setAttributes({
									useResponsiveDimensions: !!enabled,
									responsiveActiveDevice: enabled ? attributes.responsiveActiveDevice || '' : '',
								}),
						}),
						responsiveEnabled
							? createElement(
								Fragment,
								{},
								createElement(
									'div',
									{ className: 'madeit-responsive-device-row' },
									createElement('span', { className: 'madeit-responsive-device-label' }, 'Per apparaat'),
									createElement(
										ButtonGroup,
										{ className: 'madeit-breakpoint-switcher' },
										DEVICE_OPTIONS.map(({ key, label, icon }) =>
											createElement(Button, {
												key,
												icon,
												label,
												isSmall: true,
												variant: activeDevice === key ? 'primary' : 'secondary',
												onClick: () => {
													setAttributes({ responsiveActiveDevice: key });
													setPreviewDevice(key);
												},
											})
										)
									)
								),
								activeDevice
									? createElement(UnitControl, {
										label: `Breedte (${activeDevice})`,
										value: responsive[activeDevice]?.width || '',
										onChange: (width) => setCurrentDeviceValue('width', width),
									})
									: createElement(
										'p',
										{ className: 'madeit-responsive-help' },
										'Klik eerst op Tablet of Mobile om waardes in te vullen.'
									),
								activeDevice
									? createElement(UnitControl, {
										label: `Hoogte (${activeDevice})`,
										value: responsive[activeDevice]?.height || '',
										onChange: (height) => setCurrentDeviceValue('height', height),
									})
									: null
							)
							: null
					)
				)
			);
		},
		'withResponsiveDimensions'
	);

	addFilter(
		'editor.BlockEdit',
		'madeit/responsive-dimensions',
		withResponsiveDimensions
	);

	function withResponsiveEditorStyles(BlockListBlock) {
		return (props) => {
			if (!isSupportedBlock(props.name)) {
				return createElement(BlockListBlock, props);
			}

			const styleVars = buildResponsiveStyle(props.attributes || {});
			if (!styleVars) {
				return createElement(BlockListBlock, props);
			}

			const wrapperProps = props.wrapperProps || {};
			return createElement(BlockListBlock, {
				...props,
				wrapperProps: {
					...wrapperProps,
					style: {
						...(wrapperProps.style || {}),
						...styleVars,
					},
					className: addClassName(wrapperProps.className, 'madeit-responsive-size'),
				},
			});
		};
	}

	addFilter(
		'editor.BlockListBlock',
		'madeit/responsive-dimensions-editor-style',
		withResponsiveEditorStyles
	);

	function addResponsiveSaveProps(extraProps, blockType, attributes) {
		if (!isSupportedBlock(blockType.name)) {
			return extraProps;
		}

		const styleVars = buildResponsiveStyle(attributes || {});
		if (!styleVars) {
			return extraProps;
		}

		return {
			...extraProps,
			style: {
				...(extraProps.style || {}),
				...styleVars,
			},
			className: addClassName(extraProps.className, 'madeit-responsive-size'),
		};
	}

	addFilter(
		'blocks.getSaveContent.extraProps',
		'madeit/responsive-dimensions-save-style',
		addResponsiveSaveProps
	);
})(window.wp);

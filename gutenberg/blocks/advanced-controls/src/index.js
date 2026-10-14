const MADEIT_ADVANCED_CONTROLS_EXCLUDED_BLOCKS = [
    'madeit/block-content',
    'madeit/block-tabs',
    'madeit/reviews',
    'madeit/block-content-column',
    'madeit/block-card',
];

function madeit_hide_block_mobile(settings, name) {
    // Deze attributen altijd toevoegen, ook aan excluded blocks
    if (typeof settings.attributes !== 'undefined') {
        settings.attributes = Object.assign(settings.attributes, {
            translateX: {
                type: 'number',
                default: '',
            },
            translateY: {
                type: 'number',
                default: '',
            },
            translateXDesktop: {
                type: 'number',
                default: '',
            },
            translateYDesktop: {
                type: 'number',
                default: '',
            },
            translateXTablet: {
                type: 'number',
                default: '',
            },
            translateYTablet: {
                type: 'number',
                default: '',
            },
            translateXMobile: {
                type: 'number',
                default: '',
            },
            translateYMobile: {
                type: 'number',
                default: '',
            },
        });
    }



    if (MADEIT_ADVANCED_CONTROLS_EXCLUDED_BLOCKS.includes(name)) {
        return settings;
    }
    if (typeof settings.attributes !== 'undefined') {
       settings.attributes = Object.assign(settings.attributes, {
            hideOnMobile: {
                type: 'boolean',
            },
            hideOnDesktop: {
                type: 'boolean',
            },
            aosFade: {
                type: 'string',
                default: ''
            },
            aosDelay: {
                type: 'string',
                default: ''
            },
            aosDelayCustom: {
                type: 'string',
                default: ''
            },
        });

        if (name === 'core/image') {
            settings.attributes = Object.assign(settings.attributes, {
                lightbox: {
                    type: 'boolean',
                }
            });
        }
        if (name === 'madeit/block-content-column') {
            settings.attributes = Object.assign(settings.attributes, {
                orderFirst: {
                    type: 'boolean',
                },
                orderLast: {
                    type: 'boolean',
                },
                maxContainerSize: {
                    type: 'boolean',
                }
            });
        }
        if (name === 'madeit/block-content') {
            settings.attributes = Object.assign(settings.attributes, {
                appendMarginToColumnsMobile: {
                    type: 'boolean',
                }
            });
        }

        if (name === 'core/group') {
            settings.attributes = Object.assign(settings.attributes, {
                lockContent: {
                    type: 'boolean',
                }
            });
        }
    }
    return settings;
}
wp.hooks.addFilter('blocks.registerBlockType', 'madeit/hide-block-on-mobile', madeit_hide_block_mobile);

const madeitAdvancedControls = wp.compose.createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { Fragment, useState } = wp.element;
        const { ToggleControl, PanelBody, SelectControl, TextControl, RangeControl, Popover, Button } = wp.components;
        const { InspectorControls, InspectorAdvancedControls } = wp.blockEditor;
        const { attributes, setAttributes, isSelected } = props;
        const { setDeviceType } = wp.data.useDispatch('core/editor');
        const deviceType = wp.data.useSelect((select) => select('core/editor').getDeviceType(), []);
        const isExcluded = MADEIT_ADVANCED_CONTROLS_EXCLUDED_BLOCKS.includes(props.name);
        const [isTransformOpen, setIsTransformOpen] = useState(false);
        const activeDevice = ['desktop', 'tablet', 'mobile'].includes((deviceType || '').toLowerCase()) ? (deviceType || '').toLowerCase() : 'desktop';
        const transformDeviceMap = {
            desktop: 'Desktop',
            tablet: 'Tablet',
            mobile: 'Mobile',
        };
        const getTranslateValueForDevice = (axis, device) => getTranslateValueForAttributes(attributes, axis, device);
        
        var animationOptions = [
            {
	                label: wp.i18n.__( 'No Animation', 'madeit' ),
	                value: '',
	        },
	        {
	                label: wp.i18n.__( 'Fade', 'madeit' ),
	                value: 'fade',
	        },
	        {
	                label: wp.i18n.__( 'Fade up', 'madeit' ),
	                value: 'fade-up',
	        },
	        {
	                label: wp.i18n.__( 'Fade down', 'madeit' ),
	                value: 'fade-down',
	        },
	        {
	                label: wp.i18n.__( 'Fade left', 'madeit' ),
	                value: 'fade-left',
	        },
	        {
	                label: wp.i18n.__( 'Fade right', 'madeit' ),
	                value: 'fade-right',
	        },
	        {
	                label: wp.i18n.__( 'Fade up right', 'madeit' ),
	                value: 'fade-up-right',
	        },
	        {
	                label: wp.i18n.__( 'Fade up left', 'madeit' ),
	                value: 'fade-up-left',
	        },
	        {
	                label: wp.i18n.__( 'Fade down right', 'madeit' ),
	                value: 'fade-down-right',
	        },
	        {
	                label: wp.i18n.__( 'Fade down left', 'madeit' ),
	                value: 'fade-down-left',
	        },
	        {
	                label: wp.i18n.__( 'Flip up', 'madeit' ),
	                value: 'flip-up',
	        },
	        {
	                label: wp.i18n.__( 'Flip down', 'madeit' ),
	                value: 'flip-down',
	        },
	        {
	                label: wp.i18n.__( 'Flip left', 'madeit' ),
	                value: 'flip-left',
	        },
	        {
	                label: wp.i18n.__( 'Flip right', 'madeit' ),
	                value: 'flip-right',
	        },
	        {
	                label: wp.i18n.__( 'Slide up', 'madeit' ),
	                value: 'slide-up',
	        },
	        {
	                label: wp.i18n.__( 'Slide down', 'madeit' ),
	                value: 'slide-down',
	        },
	        {
	                label: wp.i18n.__( 'Slide left', 'madeit' ),
	                value: 'slide-left',
	        },
	        {
	                label: wp.i18n.__( 'Slide right', 'madeit' ),
	                value: 'slide-right',
	        },
	        {
	                label: wp.i18n.__( 'Zoom in', 'madeit' ),
	                value: 'zoom-in',
	        },
	        {
	                label: wp.i18n.__( 'Zoom in up', 'madeit' ),
	                value: 'zoom-in-up',
	        },
	        {
	                label: wp.i18n.__( 'Zoom in down', 'madeit' ),
	                value: 'zoom-in-down',
	        },
	        {
	                label: wp.i18n.__( 'Zoom in left', 'madeit' ),
	                value: 'zoom-in-left',
	        },
	        {
	                label: wp.i18n.__( 'Zoom in right', 'madeit' ),
	                value: 'zoom-in-right',
	        },
	        {
	                label: wp.i18n.__( 'Zoom out', 'madeit' ),
	                value: 'zoom-out',
	        },
	        {
	                label: wp.i18n.__( 'Zoom out up', 'madeit' ),
	                value: 'zoom-out-up',
	        },
	        {
	                label: wp.i18n.__( 'Zoom out down', 'madeit' ),
	                value: 'zoom-out-down',
	        },
	        {
	                label: wp.i18n.__( 'Zoom out left', 'madeit' ),
	                value: 'zoom-out-left',
	        },
	        {
	                label: wp.i18n.__( 'Zoom out right', 'madeit' ),
	                value: 'zoom-out-right',
	        },
	    ];
        
        return (
            <Fragment>
                <BlockEdit {...props} />
                {isSelected && !isExcluded /*&& (props.name == 'core/cover')*/ && 
                <InspectorControls>
                    <PanelBody
                        title={wp.i18n.__('Extra Made IT Opties')}
                        initialOpen={true}>
                        
                        <ToggleControl
                            label={wp.i18n.__('Hide on mobile', 'madeit')}
                            checked={!!attributes.hideOnMobile}
                            onChange={(newval) => setAttributes({ hideOnMobile: !attributes.hideOnMobile })}
                        />
                        <ToggleControl
                            label={wp.i18n.__('Hide on desktop', 'madeit')}
                            checked={!!attributes.hideOnDesktop}
                            onChange={(newval) => setAttributes({ hideOnDesktop: !attributes.hideOnDesktop })}
                        />
                        {props.name == 'core/image' && 
                            <ToggleControl
                                label={wp.i18n.__('Gebruik lightbox', 'madeit')}
                                checked={!!attributes.lightbox}
                                onChange={(newval) => setAttributes({ lightbox: !attributes.lightbox })}
                            />
                        }
                        
                        {props.name == 'madeit/block-content-column' && 
                            <ToggleControl
                                label={wp.i18n.__('Order kolom als eerst op mobiel, laatst op desktop.', 'madeit')}
                                checked={!!attributes.orderFirst}
                                onChange={(newval) => setAttributes({ orderFirst: !attributes.orderFirst })}
                            />
                        }
                        {props.name == 'madeit/block-content-column' && 
                            <ToggleControl
                                label={wp.i18n.__('Order kolom als laatste op mobiel, eerste op desktop.', 'madeit')}
                                checked={!!attributes.orderLast}
                                onChange={(newval) => setAttributes({ orderLast: !attributes.orderLast })}
                            />
                        }
                        {props.name == 'madeit/block-content-column' && 
                            <ToggleControl
                                label={wp.i18n.__('Maximale breedte container aanhouden.', 'madeit')}
                                checked={!!attributes.maxContainerSize}
                                onChange={(newval) => setAttributes({ maxContainerSize: !attributes.maxContainerSize })}
                            />
                        }
                        {props.name == 'madeit/block-content' && 
                            <ToggleControl
                                label={wp.i18n.__('Voeg spatie toe onder kolommen op mobiel', 'madeit')}
                                checked={!!attributes.appendMarginToColumnsMobile}
                                onChange={(newval) => setAttributes({ appendMarginToColumnsMobile: !attributes.appendMarginToColumnsMobile })}
                            />
                        }
                        {props.name == 'core/group' && 
                            <ToggleControl
                                label={wp.i18n.__('Blokkeer de inhoud.', 'madeit')}
                                checked={!!attributes.lockContent}
                                onChange={(newval) => setAttributes({ lockContent: !attributes.lockContent })}
                            />
                        }
                        <SelectControl
                            __next40pxDefaultSize
                            label={ wp.i18n.__( 'Animation', 'madeit' ) }
                            value={ attributes.aosFade }
                            options={ animationOptions }
                            onChange={(newval) => setAttributes({ aosFade: newval })}
                        />
                        
                        {attributes.aosFade && attributes.aosFade !== '' && (
                            <>
                                <SelectControl
                                    __next40pxDefaultSize
                                    label={ wp.i18n.__( 'Animation delay', 'madeit' ) }
                                    value={ attributes.aosDelay }
                                    options={[
                                        { label: wp.i18n.__( 'No delay', 'madeit' ), value: '' },
                                        { label: wp.i18n.__( '100ms', 'madeit' ), value: '100' },
                                        { label: wp.i18n.__( '200ms', 'madeit' ), value: '200' },
                                        { label: wp.i18n.__( '300ms', 'madeit' ), value: '300' },
                                        { label: wp.i18n.__( '400ms', 'madeit' ), value: '400' },
                                        { label: wp.i18n.__( '500ms', 'madeit' ), value: '500' },
                                        { label: wp.i18n.__( '600ms', 'madeit' ), value: '600' },
                                        { label: wp.i18n.__( '700ms', 'madeit' ), value: '700' },
                                        { label: wp.i18n.__( '800ms', 'madeit' ), value: '800' },
                                        { label: wp.i18n.__( '900ms', 'madeit' ), value: '900' },
                                        { label: wp.i18n.__( '1000ms', 'madeit' ), value: '1000' },
                                        { label: wp.i18n.__( 'Eigen invoer', 'madeit' ), value: 'custom' },

                                    ]}
                                    onChange={(newval) => setAttributes({ aosDelay: newval })}
                                />

                                {attributes.aosDelay === 'custom' && (
                                    <TextControl
                                        label={ wp.i18n.__( 'Custom animation delay (ms)', 'madeit' ) }
                                        value={ attributes.aosDelayCustom }
                                        onChange={(newval) => setAttributes({ aosDelayCustom: newval })}
                                    />
                                
                                )}
                            </>
                        )}

                        <div className="madeit-transform-row">
                            <Button
                                variant="secondary"
                                className="madeit-transform-trigger"
                                onClick={() => setIsTransformOpen(!isTransformOpen)}
                            >
                                <span className="dashicons dashicons-move" style={{ marginRight: 6 }}></span>
                                {wp.i18n.__('Transform', 'madeit')}
                            </Button>

                            {isTransformOpen && (
                                <Popover
                                    position="bottom left"
                                    onClose={() => setIsTransformOpen(false)}
                                    className="madeit-transform-popover"
                                >
                                    <div className="madeit-transform-popover__header">
                                        <span>
                                            {wp.i18n.__('Transform settings', 'madeit')}
                                        </span>
                                        <span className="madeit-transform-device-tabs">
                                            {['desktop', 'tablet', 'mobile'].map((device) => (
                                                <span
                                                    key={device}
                                                    className={`madeit-transform-device-tab ${activeDevice === device ? 'is-active' : ''}`}
                                                    onClick={() => setDeviceType(transformDeviceMap[device])}
                                                >
                                                    <span className={device}></span>
                                                </span>
                                            ))}
                                        </span>
                                        <Button
                                            icon="no-alt"
                                            label={wp.i18n.__('Sluiten', 'madeit')}
                                            onClick={() => setIsTransformOpen(false)}
                                        />
                                    </div>
                                    <div className="madeit-transform-popover__body">
                                        <p className="madeit-transform-popover__section-title">
                                            {wp.i18n.__('Move', 'madeit')}
                                        </p>
                                        <RangeControl
                                            __next40pxDefaultSize
                                            label={wp.i18n.__('X (px)', 'madeit')}
                                            value={getTranslateValueForDevice('x', activeDevice)}
                                            onChange={(newval) => setAttributes({ [
                                                `translateX${activeDevice.charAt(0).toUpperCase()}${activeDevice.slice(1)}`
                                            ]: newval })}
                                            min={-200}
                                            max={200}
                                            step={1}
                                            allowReset
                                            resetFallbackValue={0}
                                        />
                                        <RangeControl
                                            __next40pxDefaultSize
                                            label={wp.i18n.__('Y (px)', 'madeit')}
                                            value={getTranslateValueForDevice('y', activeDevice)}
                                            onChange={(newval) => setAttributes({ [
                                                `translateY${activeDevice.charAt(0).toUpperCase()}${activeDevice.slice(1)}`
                                            ]: newval })}
                                            min={-200}
                                            max={200}
                                            step={1}
                                            allowReset
                                            resetFallbackValue={0}
                                        />
                                    </div>
                                </Popover>
                            )}
                        </div>

                    </PanelBody>
                </InspectorControls>
                }
            </Fragment>
        );
    };
}, 'madeitAdvancedControls');
wp.hooks.addFilter('editor.BlockEdit', 'madeit/advanced-control', madeitAdvancedControls);

function hasTranslateValue(value) {
    if (typeof value === 'undefined' || value === null || value === '') {
        return false;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue !== 0;
}

function getTranslateValueForAttributes(attributes, axis, device) {
    const normalizedDevice = ['desktop', 'tablet', 'mobile'].includes(device || '') ? device : 'desktop';
    const suffix = normalizedDevice.charAt(0).toUpperCase() + normalizedDevice.slice(1);
    const key = axis === 'x' ? `translateX${suffix}` : `translateY${suffix}`;
    const value = attributes?.[key];
    if (hasTranslateValue(value)) {
        return Number(value);
    }

    const fallbackKey = axis === 'x' ? 'translateX' : 'translateY';
    const fallbackValue = attributes?.[fallbackKey];
    if (hasTranslateValue(fallbackValue)) {
        return Number(fallbackValue);
    }

    return 0;
}

function madeitApplyExtraClass(extraProps, blockType, attributes) {
    const { hideOnMobile, hideOnDesktop, lightbox, orderFirst, orderLast, maxContainerSize, aosFade, aosDelay, aosDelayCustom, appendMarginToColumnsMobile, lockContent, translateX, translateY } = attributes;
    const deviceNames = ['desktop', 'tablet', 'mobile'];
    const resolveTranslateValue = (axis, device) => {
        const key = axis === 'x' ? `translateX${device.charAt(0).toUpperCase()}${device.slice(1)}` : `translateY${device.charAt(0).toUpperCase()}${device.slice(1)}`;
        const value = attributes[key];
        if (typeof value !== 'undefined' && value !== null && value !== '') {
            return Number(value);
        }
        const legacyKey = axis === 'x' ? 'translateX' : 'translateY';
        const legacyValue = attributes[legacyKey];
        if (typeof legacyValue !== 'undefined' && legacyValue !== null && legacyValue !== '') {
            return Number(legacyValue);
        }
        return 0;
    };
    
    var showDesktop = true;
    var showMobile = true;
    
    if (typeof hideOnMobile !== 'undefined' && hideOnMobile) {
        showMobile = false;
    }
    
    if (typeof hideOnDesktop !== 'undefined' && hideOnDesktop) {
        showDesktop = false;
    }
    
    if(extraProps.className !== undefined) {
        if(!showMobile && showDesktop) {
            if(extraProps.className.indexOf('d-none d-lg-block') === -1) {
                extraProps.className = extraProps.className + ' d-none d-lg-block';
            }
        }
        else if(!showMobile && !showDesktop) {
            if(extraProps.className.indexOf('d-none') === -1) {
                extraProps.className = extraProps.className + ' d-none';
            }
        }
        else if(showMobile && !showDesktop) {
            if(extraProps.className.indexOf('d-lg-none') === -1) {
                extraProps.className = extraProps.className + ' d-lg-none';
            }
        }

        if(typeof appendMarginToColumnsMobile !== 'undefined' && appendMarginToColumnsMobile) {
            if(extraProps.className.indexOf('margin-column-mobile') === -1) {
                extraProps.className  = extraProps.className + ' margin-column-mobile';
            }
        }
        
        if (typeof lightbox !== 'undefined' && lightbox) {
            if(extraProps.className.indexOf('do-lightbox') === -1) {
                extraProps.className = extraProps.className + ' do-lightbox';
            }
        }
        
        
        if (typeof lightbox !== 'undefined' && lightbox) {
            if(extraProps.className.indexOf('do-lightbox') === -1) {
                extraProps.className = extraProps.className + ' do-lightbox';
            }
        }
        
        if (typeof orderFirst !== 'undefined' && orderFirst) {
            if(extraProps.className.indexOf('order-first order-lg-last') === -1) {
                extraProps.className = extraProps.className + ' order-first order-lg-last';
            }
        }
        
        if (typeof orderLast !== 'undefined' && orderLast) {
            if(extraProps.className.indexOf('order-last order-lg-first') === -1) {
                extraProps.className = extraProps.className + ' order-last order-lg-first';
            }
        }

        if(typeof maxContainerSize !== 'undefined' && maxContainerSize) {
            if(extraProps.className.indexOf('keep-max-container-size') === -1) {
                extraProps.className = extraProps.className + ' keep-max-container-size';
            }
        }

        if (typeof lockContent !== 'undefined' && lockContent) {
            if(extraProps.className.indexOf('madeit-lock-content') === -1) {
                extraProps.className = extraProps.className + ' madeit-lock-content';
            }
        }
    }
    
    if (typeof aosFade !== 'undefined' && aosFade !== '' && aosFade !== null ) {
        extraProps['data-aos'] = aosFade;
    }

    if (typeof aosDelay !== 'undefined' && aosDelay !== '' && aosDelay !== null ) {
        extraProps['data-aos-delay'] = aosDelay;
    }

    if (typeof aosDelayCustom !== 'undefined' && aosDelayCustom !== '' && aosDelayCustom !== null ) {
        extraProps['data-aos-delay'] = aosDelayCustom;
    }

    if (hasTranslateValue(translateX) || hasTranslateValue(translateY) || deviceNames.some((device) => hasTranslateValue(resolveTranslateValue('x', device)) || hasTranslateValue(resolveTranslateValue('y', device)))) {
        const desktopX = resolveTranslateValue('x', 'desktop');
        const desktopY = resolveTranslateValue('y', 'desktop');
        const tabletX = resolveTranslateValue('x', 'tablet');
        const tabletY = resolveTranslateValue('y', 'tablet');
        const mobileX = resolveTranslateValue('x', 'mobile');
        const mobileY = resolveTranslateValue('y', 'mobile');

        extraProps.style = Object.assign({}, extraProps.style, {
            '--madeit-translate-x-desktop': `${desktopX}px`,
            '--madeit-translate-y-desktop': `${desktopY}px`,
            '--madeit-translate-x-tablet': `${tabletX}px`,
            '--madeit-translate-y-tablet': `${tabletY}px`,
            '--madeit-translate-x-mobile': `${mobileX}px`,
            '--madeit-translate-y-mobile': `${mobileY}px`,
            // transform: `translate(${desktopX}px, ${desktopY}px)`,
        });
    }

    return extraProps;
}
wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'madeit/apply-class', madeitApplyExtraClass);

const withTransformPreview = wp.compose.createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        const { attributes } = props;
        const deviceType = wp.data.select('core/editor')?.getDeviceType?.();
        const activeDevice = ['desktop', 'tablet', 'mobile'].includes((deviceType || '').toLowerCase()) ? (deviceType || '').toLowerCase() : 'desktop';

        let wrapperProps = props.wrapperProps || {};

        if (
            hasTranslateValue(attributes?.translateX) ||
            hasTranslateValue(attributes?.translateY) ||
            hasTranslateValue(getTranslateValueForAttributes(attributes, 'x', 'desktop')) ||
            hasTranslateValue(getTranslateValueForAttributes(attributes, 'y', 'desktop')) ||
            hasTranslateValue(getTranslateValueForAttributes(attributes, 'x', 'tablet')) ||
            hasTranslateValue(getTranslateValueForAttributes(attributes, 'y', 'tablet')) ||
            hasTranslateValue(getTranslateValueForAttributes(attributes, 'x', 'mobile')) ||
            hasTranslateValue(getTranslateValueForAttributes(attributes, 'y', 'mobile'))
        ) {
            const x = getTranslateValueForAttributes(attributes, 'x', activeDevice);
            const y = getTranslateValueForAttributes(attributes, 'y', activeDevice);
            wrapperProps = {
                ...wrapperProps,
                style: {
                    ...wrapperProps.style,
                    transform: `translate(${x}px, ${y}px)`,
                },
            };
        }

        return <BlockListBlock {...props} wrapperProps={wrapperProps} />;
    };
}, 'withTransformPreview');

wp.hooks.addFilter('editor.BlockListBlock', 'madeit/live-transform-preview', withTransformPreview);
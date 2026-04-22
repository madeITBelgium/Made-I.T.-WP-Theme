const MADEIT_ADVANCED_CONTROLS_EXCLUDED_BLOCKS = [
    'madeit/block-content',
    'madeit/block-tabs',
    'madeit/reviews',
];

function madeit_hide_block_mobile(settings, name) {
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
                type: 'string'
            }
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
        const { Fragment } = wp.element;
        const { ToggleControl, PanelBody, SelectControl } = wp.components;
        const { InspectorControls } = wp.blockEditor;
        const { attributes, setAttributes, isSelected } = props;
        const isExcluded = MADEIT_ADVANCED_CONTROLS_EXCLUDED_BLOCKS.includes(props.name);
        
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
                            label={ wp.i18n.__( 'Animation', 'madeit' ) }
                            value={ attributes.aosFade }
                            options={ animationOptions }
                            onChange={(newval) => setAttributes({ aosFade: newval })}
                        />
                    </PanelBody>
                </InspectorControls>
                }
            </Fragment>
        );
    };
}, 'madeitAdvancedControls');
wp.hooks.addFilter('editor.BlockEdit', 'madeit/advanced-control', madeitAdvancedControls);

function madeitApplyExtraClass(extraProps, blockType, attributes) {
    const { hideOnMobile, hideOnDesktop, lightbox, orderFirst, orderLast, maxContainerSize, aosFade, appendMarginToColumnsMobile, lockContent } = attributes;
    
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
    return extraProps;
}
wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'madeit/apply-class', madeitApplyExtraClass);
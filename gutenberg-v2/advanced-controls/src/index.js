function madeit_hide_block_mobile(settings, name) {
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
        
        var animationOptions = [
            {
	                label: __( 'No Animation', 'mandiet' ),
	                value: '',
	        },
	        {
	                label: __( 'Fade', 'mandiet' ),
	                value: 'fade',
	        },
	        {
	                label: __( 'Fade up', 'mandiet' ),
	                value: 'fade-up',
	        },
	        {
	                label: __( 'Fade down', 'mandiet' ),
	                value: 'fade-down',
	        },
	        {
	                label: __( 'Fade left', 'mandiet' ),
	                value: 'fade-left',
	        },
	        {
	                label: __( 'Fade right', 'mandiet' ),
	                value: 'fade-right',
	        },
	        {
	                label: __( 'Fade up right', 'mandiet' ),
	                value: 'fade-up-right',
	        },
	        {
	                label: __( 'Fade up left', 'mandiet' ),
	                value: 'fade-up-left',
	        },
	        {
	                label: __( 'Fade down right', 'mandiet' ),
	                value: 'fade-down-right',
	        },
	        {
	                label: __( 'Fade down left', 'mandiet' ),
	                value: 'fade-down-left',
	        },
	        {
	                label: __( 'Flip up', 'mandiet' ),
	                value: 'flip-up',
	        },
	        {
	                label: __( 'Flip down', 'mandiet' ),
	                value: 'flip-down',
	        },
	        {
	                label: __( 'Flip left', 'mandiet' ),
	                value: 'flip-left',
	        },
	        {
	                label: __( 'Flip right', 'mandiet' ),
	                value: 'flip-right',
	        },
	        {
	                label: __( 'Slide up', 'mandiet' ),
	                value: 'slide-up',
	        },
	        {
	                label: __( 'Slide down', 'mandiet' ),
	                value: 'slide-down',
	        },
	        {
	                label: __( 'Slide left', 'mandiet' ),
	                value: 'slide-left',
	        },
	        {
	                label: __( 'Slide right', 'mandiet' ),
	                value: 'slide-right',
	        },
	        {
	                label: __( 'Zoom in', 'mandiet' ),
	                value: 'zoom-in',
	        },
	        {
	                label: __( 'Zoom in up', 'mandiet' ),
	                value: 'zoom-in-up',
	        },
	        {
	                label: __( 'Zoom in down', 'mandiet' ),
	                value: 'zoom-in-down',
	        },
	        {
	                label: __( 'Zoom in left', 'mandiet' ),
	                value: 'zoom-in-left',
	        },
	        {
	                label: __( 'Zoom in right', 'mandiet' ),
	                value: 'zoom-in-right',
	        },
	        {
	                label: __( 'Zoom out', 'mandiet' ),
	                value: 'zoom-out',
	        },
	        {
	                label: __( 'Zoom out up', 'mandiet' ),
	                value: 'zoom-out-up',
	        },
	        {
	                label: __( 'Zoom out down', 'mandiet' ),
	                value: 'zoom-out-down',
	        },
	        {
	                label: __( 'Zoom out left', 'mandiet' ),
	                value: 'zoom-out-left',
	        },
	        {
	                label: __( 'Zoom out right', 'mandiet' ),
	                value: 'zoom-out-right',
	        },
	    ];
        
        return (
            <Fragment>
                <BlockEdit {...props} />
                {isSelected /*&& (props.name == 'core/cover')*/ && 
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
                        <SelectControl
                            label={ __( 'Animation', 'madeit' ) }
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
    const { hideOnMobile, hideOnDesktop, lightbox, orderFirst, orderLast, aosFade } = attributes;
    
    var showDesktop = true;
    var showMobile = true;
    
    if (typeof hideOnMobile !== 'undefined' && hideOnMobile) {
        showMobile = false;
    }
    
    if (typeof hideOnDesktop !== 'undefined' && hideOnDesktop) {
        showDesktop = false;
    }
    
    if(!showMobile && showDesktop) {
        extraProps.className = extraProps.className + ' d-none d-lg-block';
    }
    else if(!showMobile && !showDesktop) {
        extraProps.className = extraProps.className + ' d-none';
    }
    else if(showMobile && !showDesktop) {
        extraProps.className = extraProps.className + ' d-lg-none';
    }
    
    if (typeof lightbox !== 'undefined' && lightbox) {
        extraProps.className = extraProps.className + ' do-lightbox';
    }
    
    
    if (typeof lightbox !== 'undefined' && lightbox) {
        extraProps.className = extraProps.className + ' do-lightbox';
    }
    
    if (typeof orderFirst !== 'undefined' && orderFirst) {
        extraProps.className = extraProps.className + ' order-first order-lg-last';
    }
    
    if (typeof orderLast !== 'undefined' && orderLast) {
        extraProps.className = extraProps.className + ' order-last order-lg-first';
    }
    
    if (typeof aosFade !== 'undefined' && aosFade !== '' && aosFade !== null ) {
        extraProps['data-aos']=aosFade;
        //extraProps.className = extraProps.className + ' aos-fade-' + aosFade;
    }
    return extraProps;
}
wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'madeit/apply-class', madeitApplyExtraClass);
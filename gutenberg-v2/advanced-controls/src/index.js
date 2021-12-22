function madeit_hide_block_mobile(settings, name) {
    if (typeof settings.attributes !== 'undefined') {
       settings.attributes = Object.assign(settings.attributes, {
                hideOnMobile: {
                    type: 'boolean',
                },
                hideOnDesktop: {
                    type: 'boolean',
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
        const { ToggleControl, PanelBody } = wp.components;
        const { InspectorControls } = wp.blockEditor;
        const { attributes, setAttributes, isSelected } = props;
        
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
                    </PanelBody>
                </InspectorControls>
                }
            </Fragment>
        );
    };
}, 'madeitAdvancedControls');
wp.hooks.addFilter('editor.BlockEdit', 'madeit/advanced-control', madeitAdvancedControls);

function madeitApplyExtraClass(extraProps, blockType, attributes) {
    const { hideOnMobile, hideOnDesktop, lightbox, orderFirst, orderLast } = attributes;
    
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
    
    
    if (typeof orderFirst !== 'undefined' && orderFirst) {
        extraProps.className = extraProps.className + ' order-lg-first';
    }
    if (typeof orderLast !== 'undefined' && orderLast) {
        extraProps.className = extraProps.className + ' order-last order-lg-first';
    }
    return extraProps;
}
wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'madeit/apply-class', madeitApplyExtraClass);
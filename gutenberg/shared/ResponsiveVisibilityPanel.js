import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default function ResponsiveVisibilityPanel(props) {
    var title = props && typeof props.title !== 'undefined' ? props.title : __('Responsive');
    var initialOpen = props && typeof props.initialOpen === 'boolean' ? props.initialOpen : true;

    var hideOnDesktop = props && typeof props.hideOnDesktop !== 'undefined' ? !!props.hideOnDesktop : false;
    var hideOnTablet = props && typeof props.hideOnTablet !== 'undefined' ? !!props.hideOnTablet : false;
    var hideOnMobile = props && typeof props.hideOnMobile !== 'undefined' ? !!props.hideOnMobile : false;

    var setAttributes = props && props.setAttributes ? props.setAttributes : null;

    var onChangeDesktop = props && props.onChangeDesktop ? props.onChangeDesktop : null;
    var onChangeTablet = props && props.onChangeTablet ? props.onChangeTablet : null;
    var onChangeMobile = props && props.onChangeMobile ? props.onChangeMobile : null;

    return createElement(
        PanelBody,
        { title: title, initialOpen: initialOpen },
        createElement(ToggleControl, {
            label: __('Hide on Desktop'),
            checked: hideOnDesktop,
            onChange: function (val) {
                if (onChangeDesktop) {
                    onChangeDesktop(val);
                } else if (setAttributes) {
                    setAttributes({ hideOnDesktop: !!val });
                }
            },
        }),
        createElement(ToggleControl, {
            label: __('Hide on Tablet'),
            checked: hideOnTablet,
            onChange: function (val) {
                if (onChangeTablet) {
                    onChangeTablet(val);
                } else if (setAttributes) {
                    setAttributes({ hideOnTablet: !!val });
                }
            },
        }),
        createElement(ToggleControl, {
            label: __('Hide on Mobile'),
            checked: hideOnMobile,
            onChange: function (val) {
                if (onChangeMobile) {
                    onChangeMobile(val);
                } else if (setAttributes) {
                    setAttributes({ hideOnMobile: !!val });
                }
            },
        })
    );
}

import { createElement } from '@wordpress/element';
import { Button, ButtonGroup } from '@wordpress/components';

export default function BreakpointSwitcher(props) {
    var active = props && props.active ? props.active : 'desktop';
    var onChange = props && props.onChange ? props.onChange : null;

    return createElement(
        ButtonGroup,
        { className: 'madeit-control-breakpoints' },
        createElement(Button, {
            icon: 'desktop',
            isPressed: active === 'desktop',
            onClick: function () {
                if (onChange) onChange('desktop');
            },
        }),
        createElement(Button, {
            icon: 'tablet',
            isPressed: active === 'tablet',
            onClick: function () {
                if (onChange) onChange('tablet');
            },
        }),
        createElement(Button, {
            icon: 'smartphone',
            isPressed: active === 'mobile',
            onClick: function () {
                if (onChange) onChange('mobile');
            },
        })
    );
}

import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import BreakpointSwitcher from './BreakpointSwitcher';

export default function ControlHeader(props) {
    var title = props && typeof props.title !== 'undefined' ? props.title : '';
    var breakpoint = props && props.breakpoint ? props.breakpoint : null;
    var onBreakpointChange = props && props.onBreakpointChange ? props.onBreakpointChange : null;
    var afterBreakpoint = props && props.afterBreakpoint ? props.afterBreakpoint : null;
    var onReset = props && props.onReset ? props.onReset : null;
    var resetLabel = props && props.resetLabel ? props.resetLabel : null;

    return createElement(
        'div',
        { className: 'madeit-control-header' },
        createElement(
            'span',
            { className: 'madeit-control-header__title' },
            title
        ),
        createElement(
            'div',
            { className: 'madeit-control-header__tools' },
            breakpoint && onBreakpointChange
                ? createElement(BreakpointSwitcher, {
                    active: breakpoint,
                    onChange: onBreakpointChange,
                })
                : null,
            afterBreakpoint,
            onReset
                ? createElement(Button, {
                    className: 'madeit-control-header__reset',
                    icon: 'undo',
                    variant: 'tertiary',
                    onClick: onReset,
                    showTooltip: true,
                    label: resetLabel || __('Reset'),
                })
                : null
        )
    );
}

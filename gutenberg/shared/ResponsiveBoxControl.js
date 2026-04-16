import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { __experimentalBoxControl as BoxControl } from '@wordpress/components';

import ControlHeader from './ControlHeader';

export default function ResponsiveBoxControl( props ) {
    var title = props && typeof props.title !== 'undefined' ? props.title : '';
    var breakpoint = props && props.breakpoint ? props.breakpoint : 'desktop';
    var onBreakpointChange = props && props.onBreakpointChange ? props.onBreakpointChange : null;

    var values = props && typeof props.values !== 'undefined' ? props.values : undefined;
    var onChange = props && props.onChange ? props.onChange : null;

    var sides = props && props.sides ? props.sides : undefined;
    var inputProps = props && props.inputProps ? props.inputProps : undefined;

    var allowReset = props && typeof props.allowReset !== 'undefined' ? props.allowReset : true;
    var onReset = props && props.onReset ? props.onReset : null;
    var resetLabel = props && props.resetLabel ? props.resetLabel : null;

    var next40pxDefaultSize = props && props.__next40pxDefaultSize ? props.__next40pxDefaultSize : undefined;

    return createElement(
        'div',
        { className: 'madeit-control' },
        createElement( ControlHeader, {
            title: title,
            breakpoint: breakpoint,
            onBreakpointChange: onBreakpointChange,
            onReset: onReset,
            resetLabel: resetLabel || __( 'Reset' ),
        } ),
        createElement( BoxControl, {
            __next40pxDefaultSize: next40pxDefaultSize,
            label: '',
            onChange: onChange,
            values: values,
            allowReset: allowReset,
            sides: sides,
            inputProps: inputProps,
        } )
    );
}

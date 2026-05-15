/**
 * ControlHeader.js — Shared component for managing control headers in Gutenberg blocks.
 *
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import BreakpointSwitcher from './BreakpointSwitcher';

export default function ControlHeader({
    title = '',
    breakpoint = null,
    onBreakpointChange = null,
    afterBreakpoint = null,
    onReset = null,
    resetLabel = null,
}) {
    return (
        <div className="madeit-control-header" style={{ width: '100%' }}>
            <span className="madeit-control-header__title">{ title }</span>
            <div className="madeit-control-header__tools">
                { breakpoint && onBreakpointChange && (
                    <BreakpointSwitcher
                        active={ breakpoint }
                        onChange={ onBreakpointChange }
                    />
                )}
                { afterBreakpoint }
                { onReset && (
                    <Button
                        className="madeit-control-header__reset"
                        icon="undo"
                        variant="tertiary"
                        onClick={ onReset }
                        showTooltip
                        label={ resetLabel || __('Reset') }
                    />
                )}
            </div>
        </div>
    );
}
/**
 * BreakpointSwitcher.js
 *
 */

import { Button, ButtonGroup, Icon, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

const DEVICE_MAP = {
    desktop: 'Desktop',
    tablet:  'Tablet',
    mobile:  'Mobile',
};

// Omgekeerde mapping voor uitlezen
const REVERSE_DEVICE_MAP = Object.fromEntries(
    Object.entries(DEVICE_MAP).map(([k, v]) => [v, k])
);

export default function BreakpointSwitcher({ onChange }) {
    const { setDeviceType } = useDispatch('core/editor');

    const gutenbergDevice = useSelect((select) =>
        select('core/editor').getDeviceType()
    );

    // Sync met Gutenberg, fallback naar 'desktop'
    const active = REVERSE_DEVICE_MAP[gutenbergDevice] ?? 'desktop';

    const handleChange = (breakpoint) => {
        setDeviceType(DEVICE_MAP[breakpoint]);
        onChange?.(breakpoint);
    };

    return (
        <ToggleGroupControl 
            className="madeit-control-breakpoints"
            value={ active }
            onChange={ ( value ) => handleChange( value ) }
        >
            <ToggleGroupControlOption
                value="desktop"
                label={ <Icon icon="desktop" /> }
                aria-label="Desktop"
            />

            <ToggleGroupControlOption
                value="tablet"
                label={ <Icon icon="tablet" /> }
                aria-label="Tablet"
            />

            <ToggleGroupControlOption
                value="mobile"
                label={ <Icon icon="smartphone" /> }
                aria-label="Mobile"
            />
        </ToggleGroupControl>
    );
}
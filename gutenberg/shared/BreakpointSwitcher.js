import { Button, ButtonGroup } from '@wordpress/components';
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
    const { __experimentalSetPreviewDeviceType } = useDispatch('core/edit-post');

    const gutenbergDevice = useSelect((select) =>
        select('core/edit-post').__experimentalGetPreviewDeviceType()
    );

    // Sync met Gutenberg, fallback naar 'desktop'
    const active = REVERSE_DEVICE_MAP[gutenbergDevice] ?? 'desktop';

    const handleChange = (breakpoint) => {
        __experimentalSetPreviewDeviceType(DEVICE_MAP[breakpoint]);
        onChange?.(breakpoint);
    };

    return (
        <ButtonGroup className="madeit-control-breakpoints">
            <Button
                icon="desktop"
                isPressed={active === 'desktop'}
                onClick={() => handleChange('desktop')}
            />
            <Button
                icon="tablet"
                isPressed={active === 'tablet'}
                onClick={() => handleChange('tablet')}
            />
            <Button
                icon="smartphone"
                isPressed={active === 'mobile'}
                onClick={() => handleChange('mobile')}
            />
        </ButtonGroup>
    );
}
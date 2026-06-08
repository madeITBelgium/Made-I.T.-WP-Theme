import { useState, useEffect } from '@wordpress/element';
import { SelectControl, TextControl } from '@wordpress/components';

export default function AdvancedUnitSelect({
    value = 'px',
    customValue = '',
    onChange,
    onCustomChange,
    units = ['px', '%', 'vh', 'vw', 'em', 'rem'],
}) {
    const [showCustom, setShowCustom] = useState(
        value === '__custom__'
    );

    useEffect(() => {
        setShowCustom(value === '__custom__');
    }, [value]);

    const options = [
        ...units.map((unit) => ({
            value: unit,
            label: unit,
        })),
        {
            value: '__custom__',
            label: '✎',
        },
    ];

    return (
        <div
            className="madeit-unit-select"
            style={{ position: 'relative' }}
        >
            <SelectControl
                value={value}
                options={options}
                onChange={(next) => {
                    if (next === '__custom__') {
                        setShowCustom(true);
                        onChange('__custom__');
                    } else {
                        setShowCustom(false);
                        onChange(next);
                    }
                }}
                __nextHasNoMarginBottom
            />

            {showCustom && (
                <TextControl
                    __next40pxDefaultSize
                    placeholder="calc(100% - 2rem)"
                    value={customValue}
                    onChange={onCustomChange}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        width: '230px',
                        transform: 'translateY(8px)',
                    }}
                    __nextHasNoMarginBottom
                />
            )}
        </div>
    );
}
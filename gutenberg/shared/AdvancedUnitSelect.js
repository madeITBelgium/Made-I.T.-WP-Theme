import { useState } from '@wordpress/element';
import { SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const PRESET_UNITS = ['px', '%', 'vh', 'vw', 'em', 'rem'];

export default function UnitSelect({ value = 'px', onChange, units = ['px', '%', 'vh'] }) {
    const isCustom = value && !PRESET_UNITS.includes(value);
    const [showCustom, setShowCustom] = useState(isCustom);
 
    const options = [
        ...units.map(u => ({ value: u, label: u })),
        { value: '__custom__', label: '✎' },
    ];

    const selectValue = showCustom ? '__custom__' : (value || 'px');

    return (
        <div className="madeit-unit-select">
            <SelectControl
                value={ selectValue }
                options={ options }
                onChange={ (next) => {
                    if (next === '__custom__') {
                        setShowCustom(true);
                        onChange('__custom__');  // ← sla '__custom__' op als tijdelijke waarde
                    } else {
                        setShowCustom(false);
                        onChange(next);
                    }
                }}
                __nextHasNoMarginBottom
            />
            { showCustom && (
                <TextControl
                    style={{ width: '100%', position: 'absolute', right: 0, left: '-3px', maxWidth: '251px', margin: 'auto', transform: 'translateY(8px)'}}
                    placeholder="calc(100% - 2rem)"
                    value={ value === '__custom__' ? '' : value }
                    onChange={ (val) => onChange(val || '__custom__') }  // ← val leeg? blijf '__custom__'
                    __nextHasNoMarginBottom
                />
            )}
        </div>
    );
}
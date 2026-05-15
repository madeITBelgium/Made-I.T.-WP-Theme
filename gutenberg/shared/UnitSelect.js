import { SelectControl } from '@wordpress/components';

const PRESET_UNITS = ['px', '%', 'vh', 'vw', 'em', 'rem'];

export default function UnitSelect({
    value = 'px',
    onChange,
    units = PRESET_UNITS,
}) {

    const options = units.map( ( unit ) => ( {
        value: unit,
        label: unit,
    } ) );

    return (
        <div className="madeit-unit-select">
            <SelectControl
                value={ value }
                options={ options }
                onChange={ onChange }
                __nextHasNoMarginBottom
            />
        </div>
    );

}
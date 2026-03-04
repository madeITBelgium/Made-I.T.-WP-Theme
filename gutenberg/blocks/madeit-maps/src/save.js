/**
 * Save the block content to the frontend.
 * 
 */

import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const {
        location,
        mapColor,
        latitude,
        longitude,
        zoom,
        height,
        marker,
        markerColor,
        markerSvg,
        markers,
        markerLatitude,
        markerLongitude,
        markerPopup,
    } = attributes;

    const normalizedMarkers = Array.isArray(markers) ? markers : [];
    const markersJson = normalizedMarkers.length ? JSON.stringify(normalizedMarkers) : '';

    const normalizedMapColor = String(mapColor || '').trim().toLowerCase();
    const safeMapColor = normalizedMapColor ? normalizedMapColor.replace(/[^a-z0-9_-]+/g, '-') : '';
    const mapColorClass = safeMapColor ? `madeit-maps--${safeMapColor}` : '';

    const blockProps = useBlockProps.save({
        className: `madeit-maps-block ${mapColorClass}`.trim(),
    });

    return (
        <div {...blockProps}>
            {location ? (
                <div
                    className="madeit-maps__map"
                    style={{ height: height || '400px' }}
                    data-latitude={latitude}
                    data-longitude={longitude}
                    data-zoom={zoom}
                    data-marker={marker ? '1' : '0'}
                    data-marker-color={markerColor || ''}
                    data-marker-svg={markerSvg || ''}
                    data-markers={markersJson}
                    data-marker-latitude={markerLatitude}
                    data-marker-longitude={markerLongitude}
                    data-marker-popup={markerPopup || ''}
                />
            ) : (
                <div className="madeit-maps__placeholder">
                    <p>Locatie ontbreekt.</p>
                </div>
            )}
        </div>
    );
}
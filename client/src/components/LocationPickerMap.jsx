import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet markers
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
    const map = useMapEvents({
        click(e) {
            const newPos = e.latlng;
            setPosition(newPos);
            // Simulate reverse geocoding or just pass coords
            onLocationSelect({
                lat: newPos.lat,
                lng: newPos.lng,
                address: `${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)}`
            });
            map.flyTo(newPos, map.getZoom());
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

const RecenterControl = ({ onRecenter }) => {
    return (
        <button
            type="button"
            onClick={onRecenter}
            className="absolute bottom-4 right-4 z-[400] bg-white p-2 text-sm font-semibold text-gray-700 shadow-md rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Use My Location
        </button>
    );
};

const LocationPickerMap = ({ onLocationSelect, initialLocation }) => {
    // Default to New Delhi if no initial location
    const [position, setPosition] = useState(initialLocation || null);
    const defaultCenter = [28.6139, 77.2090];

    const handleRecenter = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                const newPos = { lat: latitude, lng: longitude };
                setPosition(newPos);
                onLocationSelect({
                    lat: latitude,
                    lng: longitude,
                    address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                });
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="h-full w-full relative rounded-lg overflow-hidden border border-gray-300">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    onLocationSelect={onLocationSelect}
                />
                <RecenterControl onRecenter={handleRecenter} />
            </MapContainer>
        </div>
    );
};

export default LocationPickerMap;

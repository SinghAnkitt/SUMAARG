import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Navigation, MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default Leaflet markers in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colors for markers based on status
const getMarkerIcon = (status) => {
    // You could replace these with custom colorful icons/SVGs if you want to be fancy
    // For now using default, but maybe we can tint them via CSS or custom SVGs later
    return DefaultIcon;
    // Ideally we'd use L.divIcon to create custom colored markers
};

const RecenterControl = () => {
    const map = useMap();

    const handleRecenter = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                map.flyTo([latitude, longitude], 15);
            });
        }
    };

    return (
        <button
            onClick={handleRecenter}
            className="bg-white p-2 rounded-md shadow-md border-2 border-gray-300 hover:bg-gray-100 transition-colors absolute bottom-24 right-4 z-[400]"
            title="Center on current location"
        >
            <Navigation className="h-5 w-5 text-gray-700" />
        </button>
    );
};

const MapMain = ({ complaints, showSearch = false }) => {
    const defaultCenter = [28.6139, 77.2090]; // New Delhi

    // Extract coordinates from GeoJSON format
    const [mapData, setMapData] = useState([]);

    useEffect(() => {
        if (complaints) {
            const dataWithCoords = complaints.map(c => {
                // Check if location exists in GeoJSON format (MongoDB format)
                if (c.location && c.location.coordinates && Array.isArray(c.location.coordinates)) {
                    // GeoJSON format is [longitude, latitude], but Leaflet expects [latitude, longitude]
                    return { 
                        ...c, 
                        lat: c.location.coordinates[1], 
                        lng: c.location.coordinates[0] 
                    };
                }
                // Check if lat/lng already exist
                if (c.lat && c.lng) {
                    return c;
                }
                // If no coordinates, use default center (shouldn't happen with proper data)
                console.warn(`Complaint ${c._id} has no valid coordinates`);
                return { 
                    ...c, 
                    lat: defaultCenter[0], 
                    lng: defaultCenter[1] 
                };
            });
            setMapData(dataWithCoords);
        }
    }, [complaints]);

    return (
        <div className="flex-1 relative h-full w-full bg-gray-200">
            {/* Map */}
            <MapContainer
                center={defaultCenter}
                zoom={13}
                zoomControl={false}
                className="h-full w-full z-0 outline-none"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <ZoomControl position="bottomright" />
                <RecenterControl />

                {mapData.map((c, idx) => (
                    <Marker key={c._id || idx} position={[c.lat, c.lng]}>
                        <Popup className="custom-popup">
                            <div className="min-w-[200px]">
                                <h3 className="font-bold text-gray-800 mb-1">{c.title}</h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                                        ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            c.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {c.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{c.address || "Unknown Location"}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Floating Search Bar */}
            {showSearch && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[400] w-[90%] max-w-2xl">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center p-2 pl-6 transition-all focus-within:ring-4 focus-within:ring-blue-500/20 border border-white/50">
                        <Search className="text-gray-400 h-5 w-5 mr-3" />
                        <input
                            type="text"
                            placeholder="Search address, postcode, or issue ID..."
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-medium"
                        />
                        <div className="border-l pl-2 ml-2 border-gray-200 h-6 flex items-center">
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-95 ml-2">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Controls Container (Right Side) - implemented via ZoomControl(bottomright) and custom RecenterControl */}
        </div>
    );
};

export default MapMain;

import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different markers
const createCustomIcon = (color, label) => {
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">${label}</div>`,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const currentLocationIcon = L.divIcon({
  html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  className: 'current-location-icon',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Component to handle map clicks
const MapClickHandler = ({ onMapClick, inputMode }) => {
  useMapEvents({
    click: (e) => {
      if (inputMode === 'click') {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const MapComponent = () => {
  const { logout } = useAuth();
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [zoom, setZoom] = useState(6);
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('click'); // 'click' or 'search'
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');

  const mapRef = useRef();

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setCurrentLocation(location);
          setPointA(location);
          setCenter(location);
          setZoom(12);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get current location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
    }
  };

  const handleMapClick = useCallback((latlng) => {
    if (inputMode !== 'click') return;
    
    const clickedPoint = [latlng.lat, latlng.lng];
    
    if (!pointA) {
      setPointA(clickedPoint);
    } else if (!pointB) {
      setPointB(clickedPoint);
    } else {
      // Reset and start over
      setPointA(clickedPoint);
      setPointB(null);
      setRoute(null);
      setRouteInfo(null);
    }
  }, [pointA, pointB, inputMode]);

  // Simple route calculation (straight line)
  // For production, you'd want to use a routing service like OpenRouteService, GraphHopper, or OSRM
  const calculateRoute = useCallback(() => {
    if (!pointA || !pointB) return;
    
    setLoading(true);
    
    // Simple straight line route
    const routeCoordinates = [pointA, pointB];
    setRoute(routeCoordinates);
    
    // Calculate distance using Haversine formula
    const distance = calculateDistance(pointA[0], pointA[1], pointB[0], pointB[1]);
    // Estimate time based on average speed (50 km/h)
    const estimatedTime = Math.round((distance / 50) * 60);
    
    setRouteInfo({
      distance: distance.toFixed(2),
      duration: estimatedTime
    });
    
    setLoading(false);
  }, [pointA, pointB]);

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    if (pointA && pointB) {
      calculateRoute();
    }
  }, [pointA, pointB, calculateRoute]);

  // Geocoding using Nominatim (OpenStreetMap)
  const geocodeLocation = async (query) => {
    if (!query.trim()) return null;
    
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (searchA) {
        const locationA = await geocodeLocation(searchA);
        if (locationA) {
          setPointA(locationA);
        } else {
          setError('Could not find location A');
        }
      }
      
      if (searchB) {
        const locationB = await geocodeLocation(searchB);
        if (locationB) {
          setPointB(locationB);
        } else {
          setError(prev => prev ? `${prev}, Could not find location B` : 'Could not find location B');
        }
      }
    } catch (error) {
      setError('Failed to find locations');
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setPointA(currentLocation);
    setPointB(null);
    setRoute(null);
    setRouteInfo(null);
    setSearchA('');
    setSearchB('');
    setError('');
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Route Planner</h1>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-sm p-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Input Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setInputMode('click')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  inputMode === 'click'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Click Mode
              </button>
              <button
                onClick={() => setInputMode('search')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  inputMode === 'search'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Search Mode
              </button>
            </div>

            {/* Search Inputs */}
            {inputMode === 'search' && (
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Point A (or use current location)"
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Point B"
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Search
                </button>
              </form>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={getCurrentLocation}
                className="px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                My Location
              </button>
              <button
                onClick={clearRoute}
                className="px-3 py-2 text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Instructions and Route Info */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {inputMode === 'click' && (
              <p className="text-sm text-gray-600">
                {!pointA ? 'Click on the map to set Point A' :
                 !pointB ? 'Click on the map to set Point B' :
                 'Click anywhere to start over'}
              </p>
            )}
            
            {routeInfo && (
              <div className="flex gap-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Distance: {routeInfo.distance} km
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Time: ~{routeInfo.duration} min
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        )}

        <MapContainer
          ref={mapRef}
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapClickHandler onMapClick={handleMapClick} inputMode={inputMode} />

          {/* Current Location Marker */}
          {currentLocation && (
            <Marker position={currentLocation} icon={currentLocationIcon}>
              <Popup>Your current location</Popup>
            </Marker>
          )}

          {/* Point A Marker */}
          {pointA && pointA !== currentLocation && (
            <Marker position={pointA} icon={createCustomIcon('#10b981', 'A')}>
              <Popup>Point A</Popup>
            </Marker>
          )}

          {/* Point B Marker */}
          {pointB && (
            <Marker position={pointB} icon={createCustomIcon('#ef4444', 'B')}>
              <Popup>Point B</Popup>
            </Marker>
          )}

          {/* Route Line */}
          {route && (
            <Polyline
              positions={route}
              color="#3b82f6"
              weight={5}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
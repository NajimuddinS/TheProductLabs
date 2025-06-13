import { useState, useEffect, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useAuth } from "../contexts/AuthContext";
import {
  Navigation,
  LogOut,
  MousePointer,
  Search,
  MapPin,
  X,
  Clock,
  Route,
  Locate,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const LoadingSpinner = ({ size = "md" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${
      size === "sm" ? "h-4 w-4" : "h-6 w-6"
    }`}
  ></div>
);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomIcon = (color, label) => {
  return L.divIcon({
    html: `<div style="
      position: relative;
      width: 30px;
      height: 42px;
    ">
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 24px;
        background-color: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
          text-align: center;
          width: 100%;
        ">${label}</div>
      </div>
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background-color: ${color};
        clip-path: polygon(50% 100%, 0 0, 100% 0);
      "></div>
    </div>`,
    className: "custom-div-icon",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36],
  });
};

const currentLocationIcon = L.divIcon({
  html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  className: "current-location-icon",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const MapClickHandler = ({ onMapClick, inputMode }) => {
  useMapEvents({
    click: (e) => {
      if (inputMode === "click") {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const MapComponent = () => {
  const { logout } = useAuth();
  const [center, setCenter] = useState([12.9716, 77.5946]);
  const [zoom, setZoom] = useState(10);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState("click");
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [suggestionsA, setSuggestionsA] = useState([]);
  const [suggestionsB, setSuggestionsB] = useState([]);
  const [showSuggestionsA, setShowSuggestionsA] = useState(false);
  const [showSuggestionsB, setShowSuggestionsB] = useState(false);

  const mapRef = useRef();
  const routingControlRef = useRef();
  const searchARef = useRef();
  const searchBRef = useRef();

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Create debounced functions
  const debouncedFetchSuggestionsA = useCallback(
    debounce((query) => fetchSuggestions(query, setSuggestionsA), 300),
    []
  );

  const debouncedFetchSuggestionsB = useCallback(
    debounce((query) => fetchSuggestions(query, setSuggestionsB), 300),
    []
  );

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setCurrentLocation(location);
          setPointA(location);
          setCenter(location);
          setZoom(12);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get current location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
    }
  };

  const handleMapClick = useCallback(
    (latlng) => {
      if (inputMode !== "click") return;

      const clickedPoint = [latlng.lat, latlng.lng];

      if (!pointA) {
        setPointA(clickedPoint);
      } else if (!pointB) {
        setPointB(clickedPoint);
      } else {
        setPointA(clickedPoint);
        setPointB(null);
        setRouteInfo(null);
        removeRoutingControl();
      }
    },
    [pointA, pointB, inputMode]
  );

  const removeRoutingControl = () => {
    if (routingControlRef.current) {
      const map = mapRef.current;
      if (map) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    }
  };

  const calculateRoute = useCallback(() => {
    if (!pointA || !pointB) return;

    setLoading(true);
    removeRoutingControl();

    const map = mapRef.current;
    if (!map) return;

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(pointA[0], pointA[1]),
        L.latLng(pointB[0], pointB[1]),
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);

    routingControlRef.current.on("routesfound", (e) => {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const route = routes[0];
        setRouteInfo({
          distance: (route.summary.totalDistance / 1000).toFixed(2),
          duration: Math.round(route.summary.totalTime / 60),
        });
      }
      setLoading(false);
    });

    routingControlRef.current.on("routingerror", (e) => {
      setError("Failed to calculate route");
      setLoading(false);
    });
  }, [pointA, pointB]);

  useEffect(() => {
    if (pointA && pointB) {
      calculateRoute();
    }
  }, [pointA, pointB, calculateRoute]);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        setSuggestions(
          data.map((item) => ({
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          }))
        );
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setSuggestions([]);
    }
  };

  const handleSearchAChange = (e) => {
    const value = e.target.value;
    setSearchA(value);
    debouncedFetchSuggestionsA(value);
    setShowSuggestionsA(true);
  };

  const handleSearchBChange = (e) => {
    const value = e.target.value;
    setSearchB(value);
    debouncedFetchSuggestionsB(value);
    setShowSuggestionsB(true);
  };

  const selectSuggestion = (suggestion, isPointA) => {
    const location = [suggestion.lat, suggestion.lon];
    if (isPointA) {
      setPointA(location);
      setSearchA(suggestion.displayName);
      setShowSuggestionsA(false);
      searchARef.current.blur();
    } else {
      setPointB(location);
      setSearchB(suggestion.displayName);
      setShowSuggestionsB(false);
      searchBRef.current.blur();
    }
    setCenter(location);
    setZoom(12);
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setShowSuggestionsA(false);
    setShowSuggestionsB(false);

    try {
      if (searchA && !pointA) {
        const locationA = await geocodeLocation(searchA);
        if (locationA) {
          setPointA(locationA);
        } else {
          setError("Could not find location A");
        }
      }

      if (searchB && !pointB) {
        const locationB = await geocodeLocation(searchB);
        if (locationB) {
          setPointB(locationB);
        } else {
          setError((prev) =>
            prev
              ? `${prev}, Could not find location B`
              : "Could not find location B"
          );
        }
      }
    } catch (error) {
      setError("Failed to find locations");
    } finally {
      setLoading(false);
    }
  };

  const geocodeLocation = async (query) => {
    if (!query.trim()) return null;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  };

  const clearRoute = () => {
    setPointA(currentLocation);
    setPointB(null);
    setRouteInfo(null);
    setSearchA("");
    setSearchB("");
    setError("");
    setSuggestionsA([]);
    setSuggestionsB([]);
    removeRoutingControl();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RouteMate
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Smart Route Planning
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 ease-in-out group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setInputMode("click")}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    inputMode === "click"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <MousePointer className="w-4 h-4" />
                  <span>Click Mode</span>
                </button>
                <button
                  onClick={() => setInputMode("search")}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    inputMode === "search"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search Mode</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <Locate className="w-4 h-4" />
                  <span>My Location</span>
                </button>
                <button
                  onClick={clearRoute}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {inputMode === "search" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="w-5 h-5 text-red-400" />
                    </div>
                    <input
                      ref={searchARef}
                      type="text"
                      placeholder="Starting point (Point A)"
                      value={searchA}
                      onChange={handleSearchAChange}
                      onFocus={() => setShowSuggestionsA(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestionsA(false), 200)
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSearchSubmit(e)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500"
                    />
                    {showSuggestionsA && suggestionsA.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                        {suggestionsA.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                            onMouseDown={() =>
                              selectSuggestion(suggestion, true)
                            }
                          >
                            {suggestion.displayName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="w-5 h-5 text-green-400" />
                    </div>
                    <input
                      ref={searchBRef}
                      type="text"
                      placeholder="Destination (Point B)"
                      value={searchB}
                      onChange={handleSearchBChange}
                      onFocus={() => setShowSuggestionsB(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestionsB(false), 200)
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSearchSubmit(e)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500"
                    />
                    {showSuggestionsB && suggestionsB.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                        {suggestionsB.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                            onMouseDown={() =>
                              selectSuggestion(suggestion, false)
                            }
                          >
                            {suggestion.displayName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleSearchSubmit}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Route</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {inputMode === "click" && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <MousePointer className="w-4 h-4 text-blue-500" />
                  <span>
                    {!pointA
                      ? "Click on the map to set starting point"
                      : !pointB
                      ? "Click on the map to set destination"
                      : "Click anywhere to start over"}
                  </span>
                </div>
              )}

              {routeInfo && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                    <Route className="w-4 h-4" />
                    <span className="font-medium">{routeInfo.distance} km</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      ~{routeInfo.duration} min
                    </span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <LoadingSpinner size="sm" />
              <span className="text-sm font-medium text-gray-700">
                Loading route...
              </span>
            </div>
          </div>
        )}

        <MapContainer
          ref={mapRef}
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler onMapClick={handleMapClick} inputMode={inputMode} />

          {currentLocation && (
            <Marker position={currentLocation} icon={currentLocationIcon}>
              <Popup>Your current location</Popup>
            </Marker>
          )}

          {pointA && pointA !== currentLocation && (
            <Marker position={pointA} icon={createCustomIcon("#ef4444", "A")}>
              <Popup>Point A</Popup>
            </Marker>
          )}

          {pointB && (
            <Marker position={pointB} icon={createCustomIcon("#10b981", "B")}>
              <Popup>Point B</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;

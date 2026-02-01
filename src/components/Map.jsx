import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRide } from '../context/RideContext';



// Custom Icons
const createIcon = (url, size = [40, 40]) => new L.Icon({
  iconUrl: url,
  iconSize: size,
  iconAnchor: [size[0] / 2, size[1]],
});

const bikeIcon = createIcon('https://cdn-icons-png.flaticon.com/512/3198/3198336.png');
const userIcon = createIcon('https://cdn-icons-png.flaticon.com/512/1144/1144760.png', [30, 30]);

// Component to handle map center updates
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom() < 13 ? 13 : map.getZoom(), { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

// Map Event Handler for clicks
function MapEvents() {
  const { selectingOnMap, setPickup, setDrop, setSelectingOnMap } = useRide();
  const map = useMap();

  useEffect(() => {
    if (selectingOnMap) {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = '';
    }
  }, [selectingOnMap, map]);

  useMapEvents({
    click(e) {
      if (selectingOnMap === 'pickup') {
        setPickup({ label: 'Selected on Map', lat: e.latlng.lat, lng: e.latlng.lng });
      } else if (selectingOnMap === 'drop') {
        setDrop({ label: 'Selected on Map', lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

const Map = () => {
  const { pickup, drop, rideStatus, captain, selectingOnMap, setSelectingOnMap } = useRide();
  const [center, setCenter] = useState([17.3850, 78.4867]); // Hyderabad default
  const [captainPos, setCaptainPos] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Fix for default leaflet icons in React
    if (typeof L !== 'undefined') {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setMapReady(true);
    }
  }, []);

  useEffect(() => {
    if (pickup) {
      setCenter([pickup.lat, pickup.lng]);
    }
  }, [pickup]);

  // Simulate captain movement when assigned
  useEffect(() => {
    if (rideStatus === 'assigned' && captain && pickup) {
      setCaptainPos(captain.location);
      
      const interval = setInterval(() => {
        setCaptainPos(prev => {
          if (!prev) return captain.location;
          
          // Move slowly towards pickup
          const dx = (pickup.lat - prev.lat) * 0.05;
          const dy = (pickup.lng - prev.lng) * 0.05;
          
          if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
            clearInterval(interval);
            return prev;
          }
          
          return {
            lat: prev.lat + dx,
            lng: prev.lng + dy
          };
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [rideStatus, captain, pickup]);

  if (!mapReady) return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-secondary font-black animate-pulse uppercase tracking-widest text-xs">Initializing Map...</div>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" // More modern "HOT" style
        />
        
        <RecenterMap position={center} />
        <MapEvents />

        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]}>
            <Popup>Pickup: {pickup.label}</Popup>
          </Marker>
        )}

        {drop && (
          <Marker position={[drop.lat, drop.lng]}>
            <Popup>Drop: {drop.label}</Popup>
          </Marker>
        )}

        {pickup && drop && (
          <Polyline 
            positions={[[pickup.lat, pickup.lng], [drop.lat, drop.lng]]} 
            color="#2d2d2d" 
            weight={4}
            dashArray="10, 10"
          />
        )}

        {captainPos && (
          <Marker position={[captainPos.lat, captainPos.lng]} icon={bikeIcon}>
            <Popup>Captain {captain?.name}</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Manual Selection Overlay */}
      {selectingOnMap && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xs px-4">
          <div className="bg-secondary text-white p-4 rounded-2xl shadow-2xl border-2 border-primary text-center">
            <p className="font-black uppercase text-xs tracking-widest mb-3">
              Tap on map to set {selectingOnMap}
            </p>
            <button 
              onClick={() => setSelectingOnMap(null)}
              className="w-full py-2 bg-primary text-secondary rounded-xl font-black text-sm uppercase tracking-tighter"
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;

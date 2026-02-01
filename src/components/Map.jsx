import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRide } from '../context/RideContext';

// Safe Icon Creator
const createIcon = (url, size = [40, 40]) => {
  if (typeof L === 'undefined') return null;
  return new L.Icon({
    iconUrl: url,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1]],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [size[0], size[0]],
  });
};

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom() < 13 ? 14 : map.getZoom(), {
        animate: true,
        duration: 1.5
      });
    }
  }, [position, map]);
  return null;
};

const MapEvents = () => {
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
      if (!selectingOnMap) return;
      const loc = { label: 'Pinned Location', lat: e.latlng.lat, lng: e.latlng.lng };
      if (selectingOnMap === 'pickup') setPickup(loc);
      else if (selectingOnMap === 'drop') setDrop(loc);
    },
  });
  return null;
};

const Map = () => {
  const { pickup, drop, rideStatus, captain, selectingOnMap, setSelectingOnMap } = useRide();
  const [captainPos, setCaptainPos] = useState(null);
  
  // Icon Memoization
  const icons = useMemo(() => {
    if (typeof L === 'undefined') return {};
    return {
      pickup: createIcon('https://cdn-icons-png.flaticon.com/512/1673/1673188.png', [32, 32]),
      drop: createIcon('https://cdn-icons-png.flaticon.com/512/684/684908.png', [32, 32]),
      captain: createIcon('https://cdn-icons-png.flaticon.com/512/3202/3202931.png', [40, 40])
    };
  }, []);

  // Center logic
  const center = useMemo(() => {
    if (pickup) return [pickup.lat, pickup.lng];
    return [17.3850, 78.4867]; // Hyderabad
  }, [pickup]);

  // Simulation: Captain moves to pickup
  useEffect(() => {
    if (rideStatus === 'assigned' && captain && pickup) {
      setCaptainPos(captain.location);
      
      const speed = 0.005; 
      const interval = setInterval(() => {
        setCaptainPos(prev => {
          if (!prev) return captain.location;
          const latDiff = pickup.lat - prev.lat;
          const lngDiff = pickup.lng - prev.lng;
          
          if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
            clearInterval(interval);
            return prev;
          }
          
          return {
            lat: prev.lat + (latDiff * 0.1),
            lng: prev.lng + (lngDiff * 0.1)
          };
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCaptainPos(null);
    }
  }, [rideStatus, captain, pickup]);

  return (
    <div className="w-full h-full relative" id="map-parent">
      <MapContainer 
        center={center} 
        zoom={13} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RecenterMap position={center} />
        <MapEvents />

        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={icons.pickup}>
            <Popup>Pickup: {pickup.label}</Popup>
          </Marker>
        )}

        {drop && (
          <Marker position={[drop.lat, drop.lng]} icon={icons.drop}>
            <Popup>Drop: {drop.label}</Popup>
          </Marker>
        )}

        {pickup && drop && (
          <Polyline 
            positions={[[pickup.lat, pickup.lng], [drop.lat, drop.lng]]} 
            color="#2d2d2d" 
            weight={3}
            dashArray="10, 10"
          />
        )}

        {captainPos && (
          <Marker position={[captainPos.lat, captainPos.lng]} icon={icons.captain}>
            <Popup>Captain Arjun is arriving</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Manual Selection Overlay */}
      {selectingOnMap && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-xs">
          <div className="bg-secondary text-white p-4 rounded-3xl shadow-2xl border-2 border-primary text-center">
            <p className="font-black uppercase text-[10px] tracking-widest mb-3 opacity-80">
              Tap on map to select {selectingOnMap}
            </p>
            <button 
              onClick={() => setSelectingOnMap(null)}
              className="w-full py-3 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-tighter shadow-lg active:scale-95 transition-transform"
            >
              Confirm Spot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;

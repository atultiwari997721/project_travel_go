import React, { createContext, useContext, useState } from 'react';

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [rideStatus, setRideStatus] = useState('idle'); // idle, searching, assigned, active, completed
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [selectingOnMap, setSelectingOnMap] = useState(null); // 'pickup' or 'drop'
  const [captain, setCaptain] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [history, setHistory] = useState([]);

  const detectLiveLocation = () => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPickup({ label: 'Current Location', lat, lng });
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error("Error detecting location", error);
          // Fallback to mock
          setPickup({ label: 'Gachibowli DLF', lat: 17.4483, lng: 78.3488 });
          setIsDetectingLocation(false);
        }
      );
    } else {
      setPickup({ label: 'Gachibowli DLF (Fallback)', lat: 17.4483, lng: 78.3488 });
      setIsDetectingLocation(false);
    }
  };

  const startRideSearch = (vehicle) => {
    setSelectedVehicle(vehicle);
    setRideStatus('searching');
    
    // Simulate finding a captain after 3 seconds
    setTimeout(() => {
      setCaptain({
        name: 'Rajesh Kumar',
        bike: 'Honda Shine - TS 09 EA 1234',
        rating: 4.8,
        location: { lat: 17.3850, lng: 78.4867 } // Will be updated by simulation
      });
      setRideStatus('assigned');
    }, 4000);
  };

  const cancelRide = () => {
    setRideStatus('idle');
    setCaptain(null);
    setSelectedVehicle(null);
  };

  return (
    <RideContext.Provider value={{ 
      pickup, setPickup, 
      drop, setDrop, 
      rideStatus, setRideStatus,
      isDetectingLocation, detectLiveLocation,
      selectingOnMap, setSelectingOnMap,
      captain, setCaptain,
      selectedVehicle, setSelectedVehicle,
      startRideSearch, cancelRide,
      history, setHistory
    }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => useContext(RideContext);

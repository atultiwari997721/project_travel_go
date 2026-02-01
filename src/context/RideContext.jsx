import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [rideStatus, setRideStatus] = useState('idle'); // idle, searching, assigned, active, completed
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [selectingOnMap, setSelectingOnMap] = useState(null); // 'pickup' or 'drop'
  const [captain, setCaptain] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const detectLiveLocation = useCallback(() => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setPickup({ label: 'Live Location Detected', lat, lng });
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error("Location error", error);
          setPickup({ label: 'Gachibowli DLF', lat: 17.4483, lng: 78.3488 });
          setIsDetectingLocation(false);
        },
        { timeout: 10000 }
      );
    } else {
      setPickup({ label: 'Indira Park (Fallback)', lat: 17.4124, lng: 78.4854 });
      setIsDetectingLocation(false);
    }
  }, []);

  const simulateCaptainAssignment = useCallback(() => {
    if (!pickup) return;

    // Start searching
    setRideStatus('searching');

    // Assign captain after randomized delay
    setTimeout(() => {
      setCaptain({
        name: 'Arjun Reddy',
        vType: selectedVehicle?.id || 'cab',
        vNumber: 'TS 07 EG 5566',
        rating: 4.9,
        otp: '2024',
        location: { 
          lat: pickup.lat + (Math.random() - 0.5) * 0.02, 
          lng: pickup.lng + (Math.random() - 0.5) * 0.02 
        }
      });
      setRideStatus('assigned');
    }, 3500);
  }, [pickup, selectedVehicle]);

  const startRideSearch = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    simulateCaptainAssignment();
  }, [simulateCaptainAssignment]);

  const cancelRide = useCallback(() => {
    setRideStatus('idle');
    setCaptain(null);
    setSelectedVehicle(null);
  }, []);

  const resetAll = useCallback(() => {
    setPickup(null);
    setDrop(null);
    setRideStatus('idle');
    setCaptain(null);
    setSelectingOnMap(null);
  }, []);

  const value = {
    pickup, setPickup,
    drop, setDrop,
    rideStatus, setRideStatus,
    isDetectingLocation, detectLiveLocation,
    selectingOnMap, setSelectingOnMap,
    captain, setCaptain,
    selectedVehicle, setSelectedVehicle,
    startRideSearch, cancelRide,
    resetAll
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) throw new Error("useRide must be used within RideProvider");
  return context;
};

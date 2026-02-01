import React, { useState } from 'react';
import { Search, MapPin, Navigation, Bike, Car, Clock, Star, X } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { motion, AnimatePresence } from 'framer-motion';

const BookingPanel = () => {
  const { 
    pickup, setPickup, 
    drop, setDrop, 
    rideStatus, startRideSearch, cancelRide,
    isDetectingLocation, detectLiveLocation,
    setSelectingOnMap,
    captain, selectedVehicle 
  } = useRide();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeInput, setActiveInput] = useState(null); // 'pickup' or 'drop'

  // Auto focus pickup if not set
  React.useEffect(() => {
    if (!pickup && rideStatus === 'idle') {
      setActiveInput('pickup');
    }
  }, [pickup, rideStatus]);

  const mockLocations = [
    { label: 'Gachibowli DLF', lat: 17.4483, lng: 78.3488 },
    { label: 'Hitech City Metro', lat: 17.4474, lng: 78.3814 },
    { label: 'Banjara Hills Rd 1', lat: 17.4150, lng: 78.4411 },
    { label: 'Jubilee Hills Check Post', lat: 17.4278, lng: 78.4116 },
    { label: 'Charminar', lat: 17.3616, lng: 78.4747 },
  ];

  const vehicles = [
    { id: 'bike', name: 'Bike', icon: Bike, desc: 'Fastest way to beat traffic', price: 45, time: 2 },
    { id: 'auto', name: 'Auto', icon: Navigation, desc: 'Comfortable & open air', price: 90, time: 5 },
    { id: 'cab', name: 'Cab', icon: Car, desc: 'AC ride with music', price: 180, time: 8 },
  ];

  const handleSelectLocation = (loc) => {
    if (activeInput === 'pickup') setPickup(loc);
    else setDrop(loc);
    setSearchQuery('');
    setActiveInput(null);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
      <div className="max-w-md mx-auto px-4 pb-4 pointer-events-auto">
        
        {/* Search Panel */}
        <AnimatePresence>
          {rideStatus === 'idle' && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="bg-white rounded-t-3xl shadow-2xl overflow-hidden border-t-4 border-secondary"
            >
              <div className="p-6">
                <div className="space-y-4">
                  <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${activeInput === 'pickup' ? 'border-primary bg-yellow-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <input 
                      placeholder={isDetectingLocation ? "Detecting Live Location..." : "Enter Pickup Location"}
                      className="bg-transparent flex-1 font-bold outline-none text-secondary"
                      value={activeInput === 'pickup' ? searchQuery : (pickup?.label || '')}
                      onFocus={() => setActiveInput('pickup')}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {activeInput === 'pickup' && (
                      <button 
                        onClick={() => {
                          setSelectingOnMap('pickup');
                          setActiveInput(null);
                        }}
                        className="p-1 px-2 bg-secondary text-primary rounded-lg text-xs font-black uppercase tracking-tighter"
                      >
                        Pin
                      </button>
                    )}
                  </div>
                  <div className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${activeInput === 'drop' ? 'border-primary bg-yellow-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="w-2 h-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                    <input 
                      placeholder="Where to go?" 
                      className="bg-transparent flex-1 font-bold outline-none text-secondary"
                      value={activeInput === 'drop' ? searchQuery : (drop?.label || '')}
                      onFocus={() => setActiveInput('drop')}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {activeInput === 'drop' && (
                      <button 
                        onClick={() => {
                          setSelectingOnMap('drop');
                          setActiveInput(null);
                        }}
                        className="p-1 px-2 bg-secondary text-primary rounded-lg text-xs font-black uppercase tracking-tighter"
                      >
                        Pin
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                {activeInput && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="mt-6 space-y-4 overflow-hidden"
                  >
                    <div className="flex justify-between items-center px-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Suggestions</p>
                      {activeInput === 'pickup' && (
                        <button 
                          onClick={detectLiveLocation}
                          className="flex items-center space-x-1 text-primary-dark font-black text-xs uppercase underline"
                        >
                          <Navigation size={12} fill="currentColor" />
                          <span>Use Live Location</span>
                        </button>
                      )}
                    </div>
                    {mockLocations.map((loc, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSelectLocation(loc)}
                        className="flex items-center space-x-4 w-full group py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary transition-colors">
                          <MapPin size={18} className="text-gray-600 group-hover:text-secondary" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-secondary">{loc.label}</p>
                          <p className="text-xs text-gray-400 font-semibold">Hyderabad, Telangana</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Vehicle Selection */}
                {pickup && drop && !activeInput && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 space-y-3"
                  >
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Suggested Rides</p>
                    {vehicles.map((v) => (
                      <button 
                        key={v.id}
                        onClick={() => startRideSearch(v)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-yellow-50 transition-all group active:scale-95"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-secondary rounded-xl text-primary group-hover:scale-110 transition-transform">
                            <v.icon size={24} />
                          </div>
                          <div className="text-left">
                            <h4 className="font-black text-secondary leading-none mb-1">{v.name}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">{v.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-secondary text-lg">₹{v.price}</p>
                          <p className="text-xs font-bold text-green-600">{v.time} min away</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Searching Animation */}
          {rideStatus === 'searching' && (
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              className="bg-white rounded-t-3xl p-8 text-center shadow-2xl border-t-4 border-secondary"
            >
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <div className="radar-circle" />
                <div className="radar-circle" style={{ animationDelay: '0.6s' }} />
                <div className="radar-circle" style={{ animationDelay: '1.2s' }} />
                <div className="relative z-10 p-4 bg-secondary rounded-full text-primary">
                  <Bike size={32} />
                </div>
              </div>
              <h3 className="text-xl font-black text-secondary mb-2 uppercase tracking-tight">Finding Your Captain</h3>
              <p className="text-gray-400 font-bold text-sm">Hold tight! Fastest bike taxis coming your way.</p>
              <button 
                onClick={cancelRide}
                className="mt-8 px-6 py-2 rounded-full border-2 border-gray-200 text-gray-400 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel Ride
              </button>
            </motion.div>
          )}

          {/* Captain Assigned */}
          {rideStatus === 'assigned' && captain && (
            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              className="bg-white rounded-t-3xl shadow-2xl overflow-hidden border-t-4 border-secondary"
            >
              <div className="bg-secondary p-4 flex justify-between items-center">
                <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Captain On The Way</span>
                <span className="text-primary font-black text-xl tracking-tighter italic">RAPIDO</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-100">
                      <Bike size={32} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-black text-secondary text-xl leading-none mb-1">{captain.name}</h3>
                      <p className="text-sm font-bold text-gray-500">{captain.bike}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star size={12} className="fill-primary text-primary" />
                        <span className="text-xs font-black text-secondary">{captain.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-2xl text-center min-w-[80px] border border-primary/20">
                    <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">OTP</p>
                    <p className="text-2xl font-black text-secondary tracking-widest">4832</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex-1 py-4 bg-secondary text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform">Call Captain</button>
                  <button className="flex-1 py-4 bg-gray-50 text-secondary border-2 border-gray-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors">Message</button>
                </div>
                
                <button 
                  onClick={cancelRide}
                  className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Cancel Ride
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingPanel;

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Navigation, Bike, Car, Truck, Star, Clock, Heart } from 'lucide-react';
import { useRide } from '../context/RideContext';

const BookingPanel = () => {
  const { 
    pickup, setPickup, 
    drop, setDrop, 
    rideStatus, startRideSearch, cancelRide,
    isDetectingLocation, detectLiveLocation,
    setSelectingOnMap,
    captain
  } = useRide();

  const [activeInput, setActiveInput] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  const suggestions = [
    { label: 'Hitech City Metro Station', lat: 17.4474, lng: 78.3814 },
    { label: 'Inorbit Mall Cyberabad', lat: 17.4338, lng: 78.3867 },
    { label: 'DLF Cyber City', lat: 17.4483, lng: 78.3488 },
    { label: 'Secunderabad Junction', lat: 17.4334, lng: 78.5017 },
  ];

  const vehicles = [
    { id: 'bike', name: 'Bike', icon: Bike, eta: '2 min', price: 42 },
    { id: 'auto', name: 'Auto', icon: Navigation, eta: '4 min', price: 85 },
    { id: 'cab', name: 'Premier Cab', icon: Car, eta: '6 min', price: 160 },
  ];

  // Auto focus pickup on start
  useEffect(() => {
    if (!pickup && rideStatus === 'idle') {
      setActiveInput('pickup');
    }
  }, [pickup, rideStatus]);

  const handleSelect = useCallback((loc) => {
    if (activeInput === 'pickup') setPickup(loc);
    else setDrop(loc);
    setActiveInput(null);
    setSearchVal('');
  }, [activeInput, setPickup, setDrop]);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[500] pointer-events-none">
      <div className="max-w-md mx-auto px-4 pb-6 pointer-events-auto">
        
          {/* Main Booking Interface */}
          {rideStatus === 'idle' && (
            <div 
              className="bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-t-4 border-secondary"
            >
              <div className="p-7">
                <div className="flex flex-col space-y-4 relative">
                  {/* Decorative dot connector */}
                  <div className="absolute left-[15px] top-[28px] bottom-[28px] w-0.5 border-l-2 border-dashed border-gray-200 z-0" />
                  
                  {/* Pickup Input */}
                  <div className={`relative z-10 flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all ${activeInput === 'pickup' ? 'border-primary bg-yellow-50/50' : 'border-gray-50 bg-gray-50'}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-200" />
                    <input 
                      readOnly={!!pickup && activeInput !== 'pickup'}
                      placeholder={isDetectingLocation ? "Locating you..." : "From where?"}
                      className="flex-1 bg-transparent border-none outline-none font-black text-secondary placeholder:text-gray-300"
                      value={activeInput === 'pickup' ? searchVal : (pickup?.label || '')}
                      onFocus={() => { setActiveInput('pickup'); setSearchVal(pickup?.label || ''); }}
                      onChange={(e) => setSearchVal(e.target.value)}
                    />
                    {activeInput === 'pickup' && (
                      <button onClick={() => { setSelectingOnMap('pickup'); setActiveInput(null); }} className="bg-secondary text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase">Pin</button>
                    )}
                  </div>

                  {/* Drop Input */}
                  <div className={`relative z-10 flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all ${activeInput === 'drop' ? 'border-primary bg-yellow-50/50' : 'border-gray-50 bg-gray-50'}`}>
                    <div className="w-2.5 h-2.5 bg-red-500 shadow-lg shadow-red-200" />
                    <input 
                      placeholder="Where to?"
                      className="flex-1 bg-transparent border-none outline-none font-black text-secondary placeholder:text-gray-300"
                      value={activeInput === 'drop' ? searchVal : (drop?.label || '')}
                      onFocus={() => { setActiveInput('drop'); setSearchVal(drop?.label || ''); }}
                      onChange={(e) => setSearchVal(e.target.value)}
                    />
                    {activeInput === 'drop' && (
                      <button onClick={() => { setSelectingOnMap('drop'); setActiveInput(null); }} className="bg-secondary text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase">Pin</button>
                    )}
                  </div>
                </div>

                {/* Suggestions / Results */}
                {activeInput && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suggested for you</span>
                      {activeInput === 'pickup' && (
                        <button onClick={detectLiveLocation} className="text-secondary font-black text-xs underline flex items-center space-x-1">
                          <Navigation size={12} fill="currentColor" />
                          <span>Use Live Location</span>
                        </button>
                      )}
                    </div>
                    <div className="max-h-48 overflow-y-auto no-scrollbar space-y-2">
                       {suggestions.map((loc, i) => (
                         <button key={i} onClick={() => handleSelect(loc)} className="w-full text-left p-4 hover:bg-gray-50 rounded-2xl flex items-center space-x-4 group transition-colors">
                           <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary transition-colors"><MapPin size={16} /></div>
                           <div>
                             <p className="font-bold text-secondary text-sm">{loc.label}</p>
                             <p className="text-[10px] text-gray-400 font-semibold uppercase">Hyderabad, Telangana</p>
                           </div>
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {/* Vehicle Selection */}
                {pickup && drop && !activeInput && (
                  <div className="mt-8 space-y-3">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Choose a ride</p>
                     {vehicles.map((v) => (
                       <button key={v.id} onClick={() => startRideSearch(v)} className="w-full flex items-center justify-between p-4 rounded-3xl border-2 border-gray-100 hover:border-primary hover:bg-yellow-50 transition-all active:scale-[0.98] group">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-secondary rounded-2xl text-primary group-hover:rotate-12 transition-transform"><v.icon size={22} /></div>
                            <div className="text-left font-black">
                              <p className="text-secondary leading-none">{v.name}</p>
                              <p className="text-[10px] text-green-600 uppercase tracking-tight">{v.eta} away</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-secondary leading-none">₹{v.price}</p>
                          </div>
                       </button>
                     ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Searching Radar */}
          {rideStatus === 'searching' && (
            <div 
              className="bg-white rounded-t-[40px] p-10 text-center shadow-2xl border-t-4 border-secondary"
            >
              <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
                <div className="radar-circle" />
                <div className="radar-circle" style={{ animationDelay: '0.5s' }} />
                <div className="relative z-10 p-5 bg-secondary rounded-full text-primary shadow-xl">
                  <Car size={36} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-secondary italic tracking-tighter uppercase mb-2">Connecting to Cabs</h2>
              <p className="text-gray-400 font-bold text-sm mb-8">Securing your affordable ride to {drop?.label.split(' ')[0]}...</p>
              <button onClick={cancelRide} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">Cancel Request</button>
            </div>
          )}

          {/* Captain Assigned Info */}
          {rideStatus === 'assigned' && captain && (
            <div 
              className="bg-white rounded-t-[40px] shadow-2xl overflow-hidden border-t-4 border-secondary"
            >
              <div className="bg-secondary p-5 flex justify-between items-center text-primary">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary/20 px-3 py-1 rounded-full">Arriving in 3m</span>
                <span className="font-black italic tracking-tighter px-2 border-l-2 border-primary/20">RAPIDO</span>
              </div>
              <div className="p-7">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-gray-50 rounded-[20px] border-2 border-gray-100 flex items-center justify-center shadow-inner relative">
                       <Car size={32} className="text-secondary" />
                       <div className="absolute -bottom-1 -right-1 bg-primary text-secondary p-1 rounded-lg border-2 border-white"><Star size={10} fill="currentColor" /></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-secondary leading-none mb-1">{captain.name}</h3>
                      <p className="text-xs font-bold text-gray-500 uppercase">{captain.vNumber}</p>
                      <p className="text-[10px] font-black text-secondary/60 mt-1 uppercase tracking-wider">Top Rated Partner</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-3xl border border-primary/20 text-center min-w-[90px] shadow-sm">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Your OTP</p>
                    <p className="text-2xl font-black text-secondary tracking-widest">{captain.otp}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-5 bg-secondary text-primary rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-transform">Call Arjun</button>
                  <button className="py-5 bg-gray-50 text-secondary border-2 border-gray-100 rounded-[24px] font-black uppercase text-xs tracking-widest active:scale-95 transition-transform">Message</button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-gray-400 px-2 font-bold text-[10px] uppercase tracking-widest">
                   <div className="flex items-center space-x-2"><Clock size={12} /><span>Safe Ride Guarantee</span></div>
                   <button onClick={cancelRide} className="text-red-400">Cancel</button>
                </div>
              </div>
            </div>
          )}


      </div>
    </div>
  );
};

export default BookingPanel;

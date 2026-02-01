import React, { useState } from 'react';
import { MapPin, Camera, CheckCircle, Smartphone, ShieldCheck, Zap } from 'lucide-react';

const PermissionScreen = ({ onPermissionsGranted }) => {
  const [permissions, setPermissions] = useState({
    location: false,
    camera: false,
  });

  const [requesting, setRequesting] = useState(null);

  const handleGrant = (type) => {
    console.log(`Requesting ${type} permission...`);
    setRequesting(type);
    
    // Smooth delay for professional feel
    setTimeout(() => {
      console.log(`${type} permission granted!`);
      setPermissions(prev => ({ ...prev, [type]: true }));
      setRequesting(null);
    }, 1000);
  };

  const onStart = () => {
    console.log("Start My Ride button clicked in PermissionScreen");
    onPermissionsGranted();
  };

  const allGranted = permissions.location && permissions.camera;

  return (
    <div className="fixed inset-0 z-[2000] bg-primary flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
      <div 
        className="w-full max-w-sm bg-white rounded-[50px] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.2)] border-2 border-secondary relative overflow-hidden transition-all"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="relative z-10 text-center mb-10">
          <div className="bg-secondary text-primary w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6">
             <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black text-secondary leading-tight mb-2 tracking-tighter uppercase italic">
            Secure Ride
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest opacity-80">Safety & Precision Required</p>
        </div>

        <div className="space-y-4">
          {/* Location UI */}
          <div className={`p-5 rounded-[32px] border-2 transition-all duration-300 ${permissions.location ? 'border-green-500 bg-green-50/50' : 'border-gray-50 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-2xl ${permissions.location ? 'bg-green-500 text-white' : 'bg-secondary text-primary'}`}>
                  <MapPin size={22} />
                </div>
                <span className="font-black text-secondary uppercase tracking-wider text-xs">Precise Location</span>
              </div>
              {permissions.location && <CheckCircle size={22} className="text-green-500 fill-white" />}
            </div>
            {!permissions.location && (
              <button 
                onClick={() => handleGrant('location')}
                disabled={requesting === 'location'}
                className="w-full mt-2 py-3.5 bg-secondary text-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                {requesting === 'location' ? 'Syncing...' : 'Enable Access'}
              </button>
            )}
          </div>

          {/* Camera UI */}
          <div className={`p-5 rounded-[32px] border-2 transition-all duration-300 ${permissions.camera ? 'border-green-500 bg-green-50/50' : 'border-gray-50 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-2xl ${permissions.camera ? 'bg-green-500 text-white' : 'bg-secondary text-primary'}`}>
                  <Camera size={22} />
                </div>
                <span className="font-black text-secondary uppercase tracking-wider text-xs">Verify & Safety</span>
              </div>
              {permissions.camera && <CheckCircle size={22} className="text-green-500 fill-white" />}
            </div>
            {!permissions.camera && (
              <button 
                onClick={() => handleGrant('camera')}
                disabled={requesting === 'camera'}
                className="w-full mt-2 py-3.5 bg-secondary text-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                {requesting === 'camera' ? 'Syncing...' : 'Enable Access'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-10">
          <button 
            onClick={onStart}
            disabled={!allGranted}
            className={`w-full py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.3em] transition-all relative overflow-hidden active:scale-[0.98] ${
              allGranted ? 'bg-secondary text-primary shadow-2xl' : 'bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-gray-50'
            }`}
          >
            {allGranted && <div className="absolute inset-0 bg-white/20 skew-x-12 animate-pulse" />}
            <span className="relative z-10">Start My Ride</span>
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center space-x-3 text-secondary/30 font-black text-[10px] uppercase tracking-[0.3em]">
        <Zap size={14} fill="currentColor" />
        <span>Insta-Booking Active</span>
      </div>
    </div>
  );
};

export default PermissionScreen;

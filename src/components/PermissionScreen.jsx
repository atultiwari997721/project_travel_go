import React, { useState } from 'react';
import { MapPin, Camera, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PermissionScreen = ({ onPermissionsGranted }) => {
  const [permissions, setPermissions] = useState({
    location: false,
    camera: false,
  });

  const [requesting, setRequesting] = useState(null);

  const handleGrant = (type) => {
    setRequesting(type);
    
    // Simulating system permission delay
    setTimeout(() => {
      setPermissions(prev => ({ ...prev, [type]: true }));
      setRequesting(null);
    }, 1200);
  };

  const allGranted = permissions.location && permissions.camera;

  return (
    <div className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl border-4 border-secondary relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-secondary leading-tight mb-2 tracking-tighter uppercase italic">
              Permissions
            </h1>
            <p className="text-gray-500 font-bold text-sm">To give you the best ride experience, Rapido needs a few permissions.</p>
          </div>

          <div className="space-y-4">
            {/* Location Permission */}
            <div className={`p-4 rounded-3xl border-2 transition-all duration-500 ${permissions.location ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${permissions.location ? 'bg-green-500 text-white' : 'bg-secondary text-primary'}`}>
                    <MapPin size={20} />
                  </div>
                  <span className="font-black text-secondary uppercase tracking-wider text-sm">Location</span>
                </div>
                {permissions.location && <CheckCircle size={20} className="text-green-500 fill-green-50" />}
              </div>
              <p className="text-xs text-gray-400 font-bold mb-4">Required to find your pickup and track your ride in real-time.</p>
              {!permissions.location && (
                <button 
                  onClick={() => handleGrant('location')}
                  disabled={requesting === 'location'}
                  className="w-full py-3 bg-secondary text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {requesting === 'location' ? 'Allowing...' : 'Grant Location'}
                </button>
              )}
            </div>

            {/* Camera Permission */}
            <div className={`p-4 rounded-3xl border-2 transition-all duration-500 ${permissions.camera ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${permissions.camera ? 'bg-green-500 text-white' : 'bg-secondary text-primary'}`}>
                    <Camera size={20} />
                  </div>
                  <span className="font-black text-secondary uppercase tracking-wider text-sm">Camera</span>
                </div>
                {permissions.camera && <CheckCircle size={20} className="text-green-500 fill-green-50" />}
              </div>
              <p className="text-xs text-gray-400 font-bold mb-4">Used for safety features and scanning ride QR codes.</p>
              {!permissions.camera && (
                <button 
                  onClick={() => handleGrant('camera')}
                  disabled={requesting === 'camera'}
                  className="w-full py-3 bg-secondary text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {requesting === 'camera' ? 'Allowing...' : 'Grant Camera'}
                </button>
              )}
            </div>
          </div>

          <motion.div 
            animate={allGranted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="mt-8"
          >
            <button 
              onClick={onPermissionsGranted}
              disabled={!allGranted}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                allGranted ? 'bg-green-500 text-white shadow-lg shadow-green-200 hover:scale-105' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-8 flex items-center space-x-2 text-secondary/40 font-black text-[10px] uppercase tracking-[0.2em]">
        <Smartphone size={12} />
        <span>Secure & Trusted</span>
      </div>
    </div>
  );
};

export default PermissionScreen;

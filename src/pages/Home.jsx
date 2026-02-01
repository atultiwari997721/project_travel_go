import React, { useState } from 'react';
import { Menu, User, History, Shield, Info, LogOut, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Map from '../components/Map';
import BookingPanel from '../components/BookingPanel';
import PermissionScreen from '../components/PermissionScreen';
import { useRide } from '../context/RideContext';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, hasPermissions, grantPermissions } = useAuth();
  const { detectLiveLocation, pickup } = useRide();

  // Auto detect location once permissions are granted
  useEffect(() => {
    if (hasPermissions && !pickup) {
      detectLiveLocation();
    }
  }, [hasPermissions, pickup, detectLiveLocation]);

  if (!hasPermissions) {
    return <PermissionScreen onPermissionsGranted={grantPermissions} />;
  }

  const menuItems = [
    { icon: User, label: 'My Profile' },
    { icon: History, label: 'Ride History' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Safety' },
    { icon: HelpCircle, label: 'Support' },
    { icon: Info, label: 'About' },
  ];

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm z-40 transition-all"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col"
      >
        <div className="bg-primary p-8 pt-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="flex items-center space-x-4 mb-6 relative z-10">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
              <User size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-secondary leading-none mb-1">Rajesh</h2>
              <p className="text-secondary font-bold text-sm tracking-tight opacity-70">+91 {user?.phoneNumber}</p>
            </div>
          </div>
          <div className="flex space-x-4 relative z-10">
            <div className="bg-secondary/10 px-4 py-2 rounded-xl text-secondary font-black text-xs uppercase tracking-widest">
              4.9 Star
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item, i) => (
            <button 
              key={i} 
              className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-secondary group transition-all active:scale-95"
            >
              <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary transition-colors">
                <item.icon size={20} className="group-hover:text-secondary" />
              </div>
              <span className="font-black text-sm uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-gray-100 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-colors uppercase tracking-widest text-xs"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Header */}
      <header className="absolute top-6 left-6 right-6 flex justify-between items-center z-30 pointer-events-none">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-4 bg-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all pointer-events-auto border-2 border-gray-50"
        >
          <Menu size={24} className="text-secondary" />
        </button>
        <div className="flex space-x-3 pointer-events-auto">
          <button className="p-4 bg-primary text-secondary rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all font-black italic tracking-tighter border-2 border-white">
            RAPIDO
          </button>
        </div>
      </header>

      {/* Map Background */}
      <div className="absolute inset-0 z-10">
        <Map />
      </div>

      {/* Booking Panel */}
      <BookingPanel />

    </div>
  );
};

export default Home;

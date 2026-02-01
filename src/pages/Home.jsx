import React, { useState, useEffect } from 'react';
import { Menu, User, History, Shield, Info, LogOut, Bell, HelpCircle, Heart, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Map from '../components/Map';
import BookingPanel from '../components/BookingPanel';
import PermissionScreen from '../components/PermissionScreen';
import { useRide } from '../context/RideContext';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, hasPermissions, grantPermissions } = useAuth();
  const { detectLiveLocation, pickup } = useRide();

  console.log("Home Rendering, hasPermissions:", hasPermissions);

  // Auto detect location once permissions are granted
  useEffect(() => {
    if (hasPermissions && !pickup) {
      console.log("Home: Triggering auto-detection");
      detectLiveLocation();
    }
  }, [hasPermissions, pickup, detectLiveLocation]);

  // Failsafe Rendering Logic
  if (!hasPermissions) {
    console.log("Home: Showing PermissionScreen");
    return <PermissionScreen onPermissionsGranted={grantPermissions} />;
  }

  console.log("Home: Showing Main Interface (Map/Panel)");

  const menuItems = [
    { icon: User, label: 'My Profile' },
    { icon: History, label: 'Ride History' },
    { icon: Bell, label: 'Notifications' },
    { icon: Heart, label: 'Saved Places' },
    { icon: Shield, label: 'Safety' },
    { icon: Info, label: 'About Rapido' },
  ];

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden font-sans">
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-secondary/60 backdrop-blur-md z-[1000] transition-all"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[1001] shadow-[25px_0_50px_-12px_rgba(0,0,0,0.25)] flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="bg-primary p-10 pt-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex items-center space-x-5 mb-8 relative z-10">
            <div className="w-20 h-20 bg-secondary rounded-[32px] flex items-center justify-center border-4 border-white shadow-2xl">
              <User size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary leading-none mb-1">Rajesh Reddy</h2>
              <p className="text-secondary font-black text-xs tracking-tighter opacity-60 uppercase">+91 {user?.phoneNumber}</p>
            </div>
          </div>
          <div className="flex space-x-3 relative z-10">
            <div className="bg-secondary text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              4.9 ★ Rider
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2 py-8">
          {menuItems.map((item, i) => (
            <button 
              key={i} 
              className="w-full flex items-center space-x-5 p-5 rounded-[24px] hover:bg-gray-50 text-gray-500 hover:text-secondary group transition-all active:scale-[0.98]"
            >
              <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-primary transition-colors">
                <item.icon size={22} className="group-hover:text-secondary transition-colors" />
              </div>
              <span className="font-black text-xs uppercase tracking-[0.15em]">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8 border-t border-gray-100">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 p-5 border-2 border-gray-100 rounded-3xl text-red-500 font-black hover:bg-red-50 transition-colors uppercase tracking-[0.2em] text-[10px]"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Dynamic Header */}
      <header className="absolute top-8 left-6 right-6 flex justify-between items-center z-[800] pointer-events-none">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-5 bg-white rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 transition-all pointer-events-auto border-2 border-gray-50 group"
        >
          <Menu size={24} className="text-secondary group-hover:rotate-12 transition-transform" />
        </button>
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="px-6 py-4 bg-primary text-secondary rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] font-black italic tracking-tighter text-xl border-2 border-white select-none">
            RAPIDO
          </div>
        </div>
      </header>

      {/* Map Content Layer */}
      <div className="absolute inset-0 z-0 bg-gray-50">
        <Map />
      </div>

      {/* Booking Panel */}
      <BookingPanel />

      {/* Failsafe Debug Overlay */}
      <div className="fixed top-0 right-0 p-2 z-[9999] pointer-events-none opacity-20">
        <span className="bg-black text-white text-[8px] px-2 py-1 rounded">ROOT_ACTIVE</span>
      </div>

    </div>
  );
};

export default Home;


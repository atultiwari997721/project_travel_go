import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    console.log("AuthProvider Initializing...");
    try {
      const savedUser = localStorage.getItem('rapido_user');
      const savedPermissions = localStorage.getItem('rapido_permissions');
      console.log("Initial state from Storage:", { savedUser: !!savedUser, savedPermissions });
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedPermissions === 'true') {
        setHasPermissions(true);
      }
    } catch (e) {
      console.error("Auth initialization error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((phoneNumber) => {
    console.log("Logging in with:", phoneNumber);
    const newUser = { 
      id: 'u_' + Math.random().toString(36).substr(2, 5), 
      phoneNumber, 
      name: 'User' 
    };
    setUser(newUser);
    localStorage.setItem('rapido_user', JSON.stringify(newUser));
  }, []);

  const grantPermissions = useCallback(() => {
    console.log("grantPermissions called - setting hasPermissions to true");
    setHasPermissions(true);
    localStorage.setItem('rapido_permissions', 'true');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setHasPermissions(false);
    localStorage.removeItem('rapido_user');
    localStorage.removeItem('rapido_permissions');
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      isAuthenticated: !!user, 
      loading, 
      hasPermissions, grantPermissions 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

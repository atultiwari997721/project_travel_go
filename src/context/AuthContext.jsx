import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('rapido_user');
    const savedPermissions = localStorage.getItem('rapido_permissions');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedPermissions) {
      setHasPermissions(true);
    }
    setLoading(false);
  }, []);

  const login = (phoneNumber) => {
    const newUser = { id: 'user_' + Math.random().toString(36).substr(2, 9), phoneNumber, name: 'User' };
    setUser(newUser);
    localStorage.setItem('rapido_user', JSON.stringify(newUser));
  };

  const grantPermissions = () => {
    setHasPermissions(true);
    localStorage.setItem('rapido_permissions', 'true');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rapido_user');
  };

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

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoutUser } from '../features/auth/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  });
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('userData');
    
    if (token && userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parseando los datos del usuario:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    logoutUser();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');  
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    if (!user) {
      console.warn("Se intentó actualizar el usuario pero no hay sesión activa.");
      return; 
    }

    if (updatedData && typeof updatedData.preventDefault === 'function') {
      console.error("Estás pasando el evento del formulario en lugar de los datos.");
      return;
    }

    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
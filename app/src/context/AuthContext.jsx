import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoutUser } from '../features/auth/AuthService';
import { getCurrentUser } from '../features/user/UserService';
import { AUTH_STATE_CHANGED_EVENT, notifyAuthStateChanged } from '../features/auth/authSession';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error leyendo userData desde localStorage:', error);
      localStorage.removeItem('userData');
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    const syncUserFromBackend = async () => {
      try {
        const currentUser = await getCurrentUser();
        const normalizedUser = {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        };
        localStorage.setItem('userData', JSON.stringify(normalizedUser));
        setIsAuthenticated(true);
        setUser(normalizedUser);
      } catch (error) {
        console.error('Error recuperando sesión del backend:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    syncUserFromBackend();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncFromStorage = () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');

      setIsAuthenticated(!!token);

      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error leyendo userData desde localStorage:', error);
        localStorage.removeItem('userData');
        setUser(null);
      }
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncFromStorage);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncFromStorage);
    };
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    notifyAuthStateChanged();
  };

  const logout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    if (!user) {
      console.warn("Se intentó actualizar el usuario pero no hay sesión activa.");
      return; 
    }

    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
    notifyAuthStateChanged();
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

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../components/Toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [authError, setAuthError] = useState(null);
  
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthError = useCallback((error) => {
    console.error('Auth Error:', error);
    setAuthError(error.message);
    setIsAuthenticated(false);
    setClientData(null);
    localStorage.removeItem('membershipId');
    
    // Only show toast for session expiry
    if (error.message === 'Session expired') {
      addToast(error.message, 'error');
    }
  }, [addToast]);

  const checkAuth = useCallback(async (skipNavigation = false) => {
    const membershipId = localStorage.getItem('membershipId');
    
    if (!membershipId) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    try {
      const response = await fetch(
        `/api/v2/method/personal_trainer.custom_methods.authenticate_membership?membership_id=${membershipId}`
      );

      if (!response.ok) {
        throw new Error('Session expired');
      }

      const data = await response.json();
      setClientData(data.data);
      setIsAuthenticated(true);
      setAuthError(null);

      if (!skipNavigation && location.pathname === '/login') {
        const intendedPath = location.state?.from?.pathname || '/';
        navigate(intendedPath, { replace: true });
      }

      return true;
    } catch (error) {
      handleAuthError(error);
      if (!skipNavigation && location.pathname !== '/login') {
        navigate('/login', { 
          replace: true,
          state: { from: location }
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location, handleAuthError]);

  const login = useCallback(async (membershipId) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch(
        `/api/v2/method/personal_trainer.custom_methods.authenticate_membership?membership_id=${membershipId}`
      );

      if (!response.ok) {
        throw new Error('Invalid membership ID');
      }

      const data = await response.json();
      
      localStorage.setItem('membershipId', membershipId);
      setClientData(data.data);
      setIsAuthenticated(true);
      setAuthError(null);

      // Single success toast
      addToast('Welcome back! 👋', 'success');

      const intendedPath = location.state?.from?.pathname || '/';
      navigate(intendedPath, { replace: true });

      return true;
    } catch (error) {
      handleAuthError(error);
      addToast(error.message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location, addToast, handleAuthError]);

  const logout = useCallback(() => {
    localStorage.removeItem('membershipId');
    setIsAuthenticated(false);
    setClientData(null);
    setAuthError(null);
    addToast('Successfully logged out', 'info');
    navigate('/login', { replace: true });
  }, [navigate, addToast]);

  const updateClientData = useCallback((newData) => {
    setClientData(prev => {
      const updated = { ...prev, ...newData };
      return updated;
    });
  }, []);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Periodic auth check (every 5 minutes)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        checkAuth(true);
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, checkAuth]);

  const value = {
    isLoading,
    isAuthenticated,
    clientData,
    authError,
    login,
    logout,
    updateClientData,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
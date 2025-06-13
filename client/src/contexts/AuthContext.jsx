import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'https://theproductlabs.onrender.com/api';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false); // New state to track initialization

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/auth/verify`);
      
      if (data?.authenticated) {
        setUser({
          authenticated: true,
          email: data.user.email,
          username: data.user.username
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
      setIsInitialized(true); // Mark as initialized after first auth check
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      const userData = {
        authenticated: true,
        email: response.data.data.email,
        username: response.data.data.username
      };
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        username,
        email,
        password
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    isInitialized, // Expose initialization state
    login,
    signup,
    logout,
    clearError: () => setError(''),
    checkAuthStatus // Expose for manual refresh if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
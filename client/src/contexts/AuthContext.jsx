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

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home`);
    console.log('Auth check response:', response.data); // Debug logging
    
    if (response.data?.authenticated) {
      setUser({ 
        authenticated: true,
        email: response.data.user.email,
        username: response.data.user.username
      });
    } else {
      setUser(null);
    }
  } catch (error) {
    console.error('Auth check error:', error);
    setUser(null);
  } finally {
    setLoading(false);
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
    
    setUser({ 
      authenticated: true,
      email: response.data.data.email,
      username: response.data.data.username
    });
    
    return { success: true }; // Ensure consistent return shape
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    setError(errorMessage);
    return { success: false, error: errorMessage }; // Ensure consistent return shape
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
    
    return { success: true }; // Ensure consistent return shape
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Signup failed';
    setError(errorMessage);
    return { success: false, error: errorMessage }; // Ensure consistent return shape
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
    login,
    signup,
    logout,
    clearError: () => setError('')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
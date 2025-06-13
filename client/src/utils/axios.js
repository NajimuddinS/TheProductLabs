import axios from 'axios';

const API_BASE_URL = 'https://theproductlabs.onrender.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      console.log('Unauthorized request');
    }
    
    if (error.code === 'NETWORK_ERROR') {
      console.error('Network error - check if backend is running');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
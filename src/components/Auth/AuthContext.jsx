import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults and interceptors
  useEffect(() => {
    // Set base URL
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://localhost:7065/api';

    // Request interceptor to add auth token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Auto logout on 401
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setUser(null);
          // Don't redirect automatically - let the component handle it
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login function that handles API call and stores data
  const login = async (loginData) => {
    try {
      const response = await axios.post('/Auth/login', loginData);
      
      if (response.data) {
        const { token, role, ...userData } = response.data;
        
        // Create complete user object
        const user = {
          role: role,
          email: loginData.email,
          ...userData
        };

        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        setUser(user);
        
        return { user, token };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Alternative: Login with existing token and user data
  const loginWithToken = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    window.location.href = '/';
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    loginWithToken,
    logout,
    loading,
    hasRole,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
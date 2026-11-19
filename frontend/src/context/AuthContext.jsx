import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user on app start if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ Load user from API
  const loadUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login user
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Register user (NO auto-login)
  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      console.log('Register response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Register API error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // ✅ Update user (called after profile update)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      loadUser,
      updateUser // ✅ Added this for manual updates
    }}>
      {children}
    </AuthContext.Provider>
  );
};
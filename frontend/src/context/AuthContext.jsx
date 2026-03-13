import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Verify token and fetch user profile based on role
          // Assuming user info is minimal in token, we fetch full profile or at least user details
          // Since the backend synthesis says auth/login returns { token, utilisateur: { id, type, profile } }
          // We might need to store type in localStorage as well to know which profile to fetch if needed on reload
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
             setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Auth init error", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, utilisateur } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(utilisateur));
    setToken(token);
    setUser(utilisateur);
    return utilisateur;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

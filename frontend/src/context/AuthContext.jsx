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
    const { token: newToken, utilisateur } = response.data;

    // Flatten profile into top-level user object for easy access
    const flatUser = {
      id: utilisateur.id,
      email: utilisateur.email,
      type: utilisateur.type,
      ...(utilisateur.profile || {}),
    };

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(flatUser));
    setToken(newToken);
    setUser(flatUser);
    return flatUser;
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

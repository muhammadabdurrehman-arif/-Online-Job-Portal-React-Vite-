import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in localStorage
    const savedSession = localStorage.getItem('cc_session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (err) {
        localStorage.removeItem('cc_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      localStorage.setItem('cc_session', JSON.stringify(userData));
      if (rememberMe) {
        localStorage.setItem('cc_remembered_email', email);
      } else {
        localStorage.removeItem('cc_remembered_email');
      }
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, role) => {
    setLoading(true);
    try {
      const userData = await authService.signup(name, email, password, role);
      setUser(userData);
      localStorage.setItem('cc_session', JSON.stringify(userData));
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedProfile) => {
    if (!user) throw new Error('Not authenticated');
    try {
      const updatedUser = await authService.updateProfile(user.id, updatedProfile);
      setUser(updatedUser);
      localStorage.setItem('cc_session', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  const updateCompanyProfile = async (updatedCompany) => {
    if (!user) throw new Error('Not authenticated');
    try {
      const updatedUser = await authService.updateCompanyProfile(user.id, updatedCompany);
      setUser(updatedUser);
      localStorage.setItem('cc_session', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('cc_session');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updateCompanyProfile
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

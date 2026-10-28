import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        setUser(response.data.data.user);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { token, user: userData } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      showSuccess(`Welcome back, ${userData.fullName}!`);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to login. Please check credentials.';
      showError(msg);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      const { token, user: newUser } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      showSuccess(`Account created! Welcome, ${newUser.fullName}.`);
      return newUser;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      showError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue client cleanup even if backend fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      showSuccess('You have been logged out.');
    }
  };

  const updateProfile = async (fields) => {
    try {
      const response = await authApi.updateProfile(fields);
      const updatedUser = response.data.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showSuccess('Profile updated successfully.');
      return updatedUser;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      showError(msg);
      throw err;
    }
  };

  const changePassword = async (passwords) => {
    try {
      await authApi.changePassword(passwords);
      showSuccess('Password changed successfully.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password.';
      showError(msg);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

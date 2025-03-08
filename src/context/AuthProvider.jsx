import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import axios from 'axios';
import { SERVER_URL } from '../api';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await localforage.getItem('user');
        const storedToken = await localforage.getItem('authToken');
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setAuthToken(storedToken);
          setIsAdmin(parsedUser.role === 'admin'); 
        }
      } catch (error) {
        console.error('Error fetching user or token from local storage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUserLogin = async (userData) => {
    try {
      const response = await axios.post(`${SERVER_URL}/auth/login`, userData);
      const { user: loggedInUser, token } = response.data;

      setUser(loggedInUser);
      setAuthToken(token);
      setIsAdmin(loggedInUser && loggedInUser.role === 'admin');
      
      await localforage.setItem('user', JSON.stringify(loggedInUser));
      await localforage.setItem('authToken', token);
      await localforage.setItem('isAdmin', JSON.stringify(loggedInUser && loggedInUser.role === 'admin'));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const handleUserLogout = async () => {
    try {
      setUser(null);
      setIsAdmin(false);
      setAuthToken(null);
      await localforage.removeItem('user');
      await localforage.removeItem('authToken');
      await localforage.removeItem('isAdmin');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateUserFunction = async (userData, avatarFile) => {
    try {
      if (!user || !user._id) {
        throw new Error('User ID not found');
      }
  
      const formData = new FormData();
      for (const key in userData) {
        formData.append(key, userData[key]);
      }
  
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
  
      const response = await axios.put(
        `${SERVER_URL}/users/profile/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      const updatedUser = response.data;
      setUser(updatedUser);
      await localforage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };
  

  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${SERVER_URL}/users/profile/${user._id}/password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  };

  const authContextValue = {
    user,
    isAdmin,
    loading,
    login: handleUserLogin,
    logout: handleUserLogout,
    updateUser: updateUserFunction,
    updateUserPassword: updateUserPassword,
    authToken,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
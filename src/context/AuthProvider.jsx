import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await localforage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.role === 'admin'); 
        }
      } catch (error) {
        console.error('Error fetching user from local storage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUserLogin = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', userData);
      const loggedInUser = response.data.user;
      setUser(loggedInUser);
      setIsAdmin(loggedInUser && loggedInUser.role === 'admin');
      await localforage.setItem('user', JSON.stringify(loggedInUser));
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
      await localforage.removeItem('user');
      await localforage.removeItem('isAdmin');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateUserFunction = async (userData) => {
    try {
      if (!user || !user._id) {
        throw new Error('User ID not found');
      }
      const response = await axios.put(`http://localhost:3000/users/profile/${user._id}`, userData);
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
      const response = await axios.put(`http://localhost:3000/users/profile/${user._id}/password`, { currentPassword, newPassword });
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
    updateUserPassword: updateUserPassword 
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import React, { useState } from 'react';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import localforage from 'localforage';
import { SERVER_URL } from '../api';

export default function ModalLoginSignUp({ show, onHide }) {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTogglePage = () => {
    setIsLoginPage(!isLoginPage);
  };

  const handleRedirectToHome = () => {
    onHide();
    navigate('/home');
  };

  const handleLogin = async (userData) => {
    try {
      const response = await axios.post(`${SERVER_URL}/auth/login`, userData);
      const { data: { user, token } } = response;
      await localforage.setItem('user', JSON.stringify(user));
      await localforage.setItem('token', token);
      handleRedirectToHome();
    } catch (error) {
      console.error('Error during login:', error);
      setError('User not registered or incorrect password');
    }
  };

  const handleSignup = async (formData) => {
    try {
      const response = await axios.post(`${SERVER_URL}/auth/signup`, formData);
      const { data: { user, token } } = response;
      await localforage.setItem('user', JSON.stringify(user));
      await localforage.setItem('token', token);
      handleRedirectToHome();
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Signup process was unsuccessful');
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center border-b pb-4">
          <div
            className={`text-lg font-semibold cursor-pointer ${isLoginPage ? 'text-blue-500' : 'text-gray-600'}`}
            onClick={handleTogglePage}
          >
            Login
          </div>
          <div
            className={`text-lg font-semibold cursor-pointer ${!isLoginPage ? 'text-blue-500' : 'text-gray-600'}`}
            onClick={handleTogglePage}
          >
            Sign Up
          </div>
        </div>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        <div className="mt-4">
          {isLoginPage ? (
            <LoginForm onSubmit={handleLogin} onLoginSuccess={handleRedirectToHome} />
          ) : (
            <SignUpForm onSubmit={handleSignup} onSignupSuccess={handleRedirectToHome} />
          )}
        </div>

        <div className="mt-4 text-center">
          <button onClick={onHide} className="text-gray-500 hover:text-gray-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
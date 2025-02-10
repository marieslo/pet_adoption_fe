import React, { useState } from 'react';
import axios from 'axios';
import localforage from 'localforage';
import { useAuth } from '../context/AuthProvider';
import { SERVER_URL } from '../api';

export default function SignupForm({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isValidPassword(formData.password)) {
        throw new Error(
          'Password must contain at least one letter, one digit, and be at least 6 characters long.'
        );
      }
      if (!isValidPhoneNumber(formData.phoneNumber)) {
        throw new Error('Invalid phone number. Please use the format XXXXXX.');
      }

      const response = await axios.post(`${SERVER_URL}/auth/signup`, formData);
      console.log('User registered successfully:', response.data);
      const {
        data: { user, token },
      } = response;
      await localforage.setItem('user', JSON.stringify(user));
      await localforage.setItem('token', token);
      await login({ email: formData.email, password: formData.password });
      onSignupSuccess();
    } catch (error) {
      console.error('Error registering user:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return /\d{3}\d{3}/.test(phoneNumber);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}

      <div>
        <label htmlFor="email" className="block text-lg font-semibold">Email address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-lg font-semibold">Password</label>
        <input
          type="password"
          placeholder="at least 6 characters"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-lg font-semibold">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="firstName" className="block text-lg font-semibold">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-lg font-semibold">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-lg font-semibold">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-3 mt-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {loading ? (
          <span className="flex justify-center items-center space-x-2">
            <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 0 0 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          'Sign Up'
        )}
      </button>
    </form>
  );
}
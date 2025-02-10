import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      setShowAlert(false);
      onLoginSuccess();
    } catch (error) {
      setShowAlert(true);
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showAlert && <div className="text-red-500 bg-red-100 p-3 rounded-md">User not registered or incorrect password</div>}

      <div>
        <label htmlFor="email" className="block text-lg font-semibold">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-lg font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
          'Login'
        )}
      </button>
    </form>
  );
}
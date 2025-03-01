import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';

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
    <form onSubmit={handleSubmit}>
      {showAlert && <Alert variant="danger">User not registered or incorrect password</Alert>}
      
      <CustomInput
        label="Email address"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
      />

      <CustomInput
        label="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
      />

      <CustomButton
        text="Login"
        color="#a72d66"
        isLoading={loading}
        type="submit"
      />
    </form>
  );
}

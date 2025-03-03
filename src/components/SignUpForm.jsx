import React, { useState } from 'react';
import { Alert, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import { SERVER_URL } from '../api';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';

export default function SignupForm({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isAdmin: e.target.checked });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/auth/signup`, formData);
      const { data: { user, token } } = response;
      await login({ email: formData.email, password: formData.password });
      onSignupSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const isFormValid = () => {
    return (
      isValidEmail(formData.email) &&
      formData.firstName.trim() &&
      formData.password === formData.confirmPassword
    );
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        {error && <Alert severity="error">{error}</Alert>}

        {/* First Name and Email */}
        <div>
          <CustomInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <CustomInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            required
          />
        </div>

        {/* Password and Confirm Password */}
        <div>
          <CustomInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            required
            helperText="Password must contain at least one letter, one digit, and be at least 6 characters long."
            togglePasswordVisibility={togglePasswordVisibility}
            showPassword={showPassword}
          />
          <CustomInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            type="password"
            required
            error={formData.password !== formData.confirmPassword}
            helperText={formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
            togglePasswordVisibility={toggleConfirmPasswordVisibility}
            showPassword={showConfirmPassword}
          />
        </div>

        {/* Admin Access */}
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isAdmin}
                onChange={handleCheckboxChange}
                name="isAdmin"
                color="primary"
              />
            }
            label="To see all the features register as an admin"
          />

          <CustomButton
            text="Sign Up"
            color="var(--accent)"
            isLoading={loading}
            type="submit"
            disabled={loading || !isFormValid()}
          />
        </div>
      </form>
    </div>
  );
}
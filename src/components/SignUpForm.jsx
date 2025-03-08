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

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isAdmin: e.target.checked });
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

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

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

        <div>
          <CustomInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            required
            helperText="Password must contain at least one letter, one digit, and be at least 6 characters long."
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
          />
        </div>


        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isAdmin}
                onChange={handleCheckboxChange}
                name="isAdmin"
                color="var(--accent)"
              />
            }
            label="I'd like to see all the features. Register me as an admin"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '12px',
                fontWeight: 400
              },
            }}
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
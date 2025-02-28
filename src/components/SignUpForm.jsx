import React, { useState } from 'react';
import { Alert, Button, InputAdornment, IconButton, Checkbox, FormControlLabel, TextField, Tooltip, Stepper, Step, StepLabel } from '@mui/material'; // Corrected import
import { Visibility, VisibilityOff } from '@mui/icons-material';
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
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
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
    try {
      if (!isValidPassword(formData.password)) {
        throw new Error(
          'Password must contain at least one letter, one digit, and be at least 6 characters long.'
        );
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

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const handleNextStep = () => {
    setPasswordMismatch(formData.password !== formData.confirmPassword);

    if (activeStep === 0 && isValidEmail(formData.email) && formData.firstName.trim()) {
      setActiveStep(activeStep + 1);
    } else if (activeStep === 1 && formData.password === formData.confirmPassword && isValidPassword(formData.password)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isNextButtonEnabled = () => {
    if (activeStep === 0) {
      return isValidEmail(formData.email) && formData.firstName.trim();
    }

    if (activeStep === 1) {
      return formData.password === formData.confirmPassword && isValidPassword(formData.password);
    }

    return true;
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        <Step>
          <StepLabel>Email and Name</StepLabel>
        </Step>
        <Step>
          <StepLabel>Password</StepLabel>
        </Step>
        <Step>
          <StepLabel>Confirmation</StepLabel>
        </Step>
      </Stepper>

      <form onSubmit={handleSignup}>
        {error && <Alert severity="error">{error}</Alert>}
        
        {activeStep === 0 && (
          <div>
            <TextField
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{
                marginBottom: 2,
                height: 40,
                borderRadius: '10px',
                backgroundColor: '#f3f3f3',
              }}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{
                marginBottom: 2,
                height: 40,
                borderRadius: '10px',
                backgroundColor: '#f3f3f3',
              }}
            />
          </div>
        )}
        
        {activeStep === 1 && (
          <div>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{
                marginBottom: 2,
                height: 40,
                borderRadius: '10px',
                backgroundColor: '#f3f3f3',
              }}
            />
            <Tooltip
              title="Password Requirements: 6 characters minimum, one uppercase letter, one lowercase letter, one number, one special character"
              placement="right"
            >
              <IconButton sx={{ marginLeft: '8px' }}>?</IconButton>
            </Tooltip>
            <TextField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              sx={{
                marginBottom: 2,
                height: 40,
                borderRadius: '10px',
                backgroundColor: '#f3f3f3',
              }}
            />
            {passwordMismatch && (
              <Alert severity="error">Passwords do not match</Alert>
            )}
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          </div>
        )}
        
        {activeStep === 2 && (
          <div>
            <p>Check your data:</p>
            <p>Email: {formData.email}</p>
            <p>First Name: {formData.firstName}</p>
            <p>Password: ******** (hidden for security)</p> 
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || passwordMismatch || !isValidEmail(formData.email)}
              sx={{
                marginBottom: 2,
                fontSize: '16px',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
              }}
            >

                Sign Up

            </Button>
          </div>
        )}
        
        {activeStep < 2 && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleNextStep}
            disabled={!isNextButtonEnabled()}
            sx={{
              width: '100%',
              padding: '12px',
              marginBottom: 2,
              borderRadius: '10px',
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#45a049',
              },
            }}
          >
            Next
          </Button>
        )}

        {activeStep > 0 && (
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={handleBackStep}
            sx={{
              width: '100%',
              padding: '12px',
              marginBottom: 2,
              borderRadius: '10px',
              backgroundColor: '#f44336',
              '&:hover': {
                backgroundColor: '#e53935',
              },
            }}
          >
            Back
          </Button>
        )}
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { Alert, InputAdornment, IconButton, Checkbox, FormControlLabel, Stepper, Step, StepLabel, Box} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import localforage from 'localforage';
import { useAuth } from '../context/AuthProvider';
import { SERVER_URL } from '../api';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { styled } from '@mui/material/styles';

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

  const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
    '&.Mui-active': {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
    },
    '&.Mui-completed': {
      color: theme.palette.secondary.main,
      fontWeight: 'bold',
    },
    '&.Mui-stepLabel': {
      color: theme.palette.text.primary,
      fontSize: '16px',
      transition: 'color 0.3s ease, font-weight 0.3s ease',
    },
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.primary.dark,
    },
  }));

  const StyledStepper = styled(Stepper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: '20px 0',
    '& .MuiStepConnector-root': {
      borderColor: theme.palette.primary.light,
    },
  }));

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
      const { data: { user, token } } = response;
      await localforage.setItem('user', JSON.stringify(user));
      await localforage.setItem('token', token);
      await login({ email: formData.email, password: formData.password });
      onSignupSuccess();
    } catch (error) {
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
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
      <Box sx={{ width: '100%' }}>
        <StyledStepper activeStep={activeStep} alternativeLabel>
          <Step>
            <CustomStepLabel>Name and email</CustomStepLabel>
          </Step>
          <Step>
            <CustomStepLabel>Password</CustomStepLabel>
          </Step>
          <Step>
            <CustomStepLabel>Admin-level access</CustomStepLabel>
          </Step>
        </StyledStepper>
      </Box>

      <form onSubmit={handleSignup}>
        {error && <Alert severity="error">{error}</Alert>}

        {activeStep === 0 && (
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
        )}

        {activeStep === 1 && (
          <div>
            <CustomInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              type={showPassword ? 'text' : 'password'} 
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <CustomInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              type={showPassword ? 'text' : 'password'}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {passwordMismatch && <Alert severity="error">Passwords do not match</Alert>}
          </div>
        )}

        {activeStep === 2 && (
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
              disabled={loading || passwordMismatch || !isValidEmail(formData.email)}
            />
          </div>
        )}

        {activeStep < 2 && (
          <CustomButton
            text="Next"
            color="var(--primary)"
            isLoading={loading}
            type="button"
            onClick={handleNextStep}
            disabled={!isNextButtonEnabled()}
          />
        )}

        {activeStep > 0 && (
          <CustomButton
            text="Back"
            color="var(--primary)"
            isLoading={loading}
            type="button"
            onClick={handleBackStep}
          />
        )}
      </form>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import { Box, Typography, Alert } from '@mui/material';
import CustomInput from '../components/CustomInput.jsx';
import CustomButton from '../components/CustomButton.jsx';

export default function EditProfileForm({ onSave, initialData }) {
  const { updateUser, updateUserPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: initialData.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    firstName: initialData.firstName || '',
    shortBio: initialData.shortBio || '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && !loading) {
        handleSave();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      if (formData.newPassword !== formData.confirmNewPassword) {
        throw new Error('New password and confirm new password do not match');
      }
      if (formData.newPassword) {
        await updateUserPassword(formData.currentPassword, formData.newPassword);
      }
      await updateUser({
        ...formData,
      });
      setSuccessMessage('Your profile was successfully updated!');
      onSave(formData);
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        maxWidth: '600px',
        mx: 'auto',
        mt: 8,
        p: 4,
        backgroundColor: 'var(--light)',
        borderRadius: 'var(--border-radius)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          color: 'var(--dark)', 
          fontFamily: 'var(--font-header)', 
          mb: 2 
        }}
      >
        Edit Profile
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <CustomInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />

      <CustomInput
        label="Current Password"
        type={showPassword ? 'text' : 'password'}
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        placeholder="***********"
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      <CustomInput
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="At least 6 characters"
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      <CustomInput
        label="Confirm New Password"
        type={showPassword ? 'text' : 'password'}
        name="confirmNewPassword"
        value={formData.confirmNewPassword}
        onChange={handleChange}
        placeholder="Confirm new password"
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      <CustomInput
        label="First Name"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Your first name"
      />

      <CustomInput
        label="Short Bio"
        type="text"
        name="shortBio"
        value={formData.shortBio}
        onChange={handleChange}
        placeholder="A short bio about yourself"
      />

      <CustomButton
        text={loading ? 'Saving...' : 'Save'}
        isLoading={loading}
        onClick={handleSave}
      />
    </Box>
  );
}

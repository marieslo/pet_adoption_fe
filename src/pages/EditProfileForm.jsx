// EditProfileForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import CustomTextField from '../components/CustomTextField';

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

      <CustomTextField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />

      <CustomTextField
        label="Current Password"
        type="password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        placeholder="***********"
      />

      <CustomTextField
        label="New Password"
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="At least 6 characters"
      />

      <CustomTextField
        label="Confirm New Password"
        type="password"
        name="confirmNewPassword"
        value={formData.confirmNewPassword}
        onChange={handleChange}
        placeholder="Confirm new password"
      />

      <CustomTextField
        label="First Name"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Your first name"
      />
      <CustomTextField
        label="Short Bio"
        type="text"
        name="shortBio"
        value={formData.shortBio}
        onChange={handleChange}
        placeholder="A short bio about yourself"
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ 
          backgroundColor: 'var(--primary)', 
          color: 'var(--light)', 
          borderRadius: 'var(--border-radius)',
          '&:hover': {
            backgroundColor: 'var(--accent)'
          }
        }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'var(--light)' }} /> : 'Save'}
      </Button>
    </Box>
  );
}
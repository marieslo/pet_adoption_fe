import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import { Box, Grid, Alert, Typography, Avatar} from '@mui/material';
import CustomInput from './CustomInput.jsx';
import CustomButton from './CustomButton.jsx';


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
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatar || ''); 
  
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); 
    }
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

      await updateUser(formData, avatarFile);

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
    <Grid
      container
      justifyContent="center"
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        textAlign: 'start',
      }}
    >
      <Grid item xs={12} md={8} lg={6}>
        <Box
          sx={{
            borderRadius: 'var(--border-radius)',
            overflow: 'hidden',
            padding: 2,
            backgroundColor: 'rgb(188, 168, 168)', 
            color: 'var(--accent)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            textAlign: 'start',
            minWidth: '360px'
          }}
        >
          <Typography sx={{ marginBottom: 2, fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>
            Edit Profile
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 1 }}>
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                sx={{ mb: 1, width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                sx={{ mb: 1, width: '100%' }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <CustomInput
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                sx={{ mb: 1, width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomInput
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                sx={{ mb: 1, width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomInput
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                sx={{ mb: 1, width: '100%' }}
              />
            </Grid>
          </Grid>

          <CustomInput
            label="Short Bio"
            type="text"
            name="shortBio"
            value={formData.shortBio}
            onChange={handleChange}
            placeholder="A short bio about yourself"
            sx={{ mb: 1 }}
          />
      
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Avatar
              src={avatarPreview || ''}
              alt="Avatar Preview"
              sx={{
                width: 80,
                height: 80,
                bgcolor: avatarPreview ? 'transparent' : 'gray',
                fontSize: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
              }}
            >
              {!avatarPreview && initialData.firstName ? initialData.firstName[0] : null}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ textAlign: 'left' }}
            />
          </Box>

          <CustomButton
            text={loading ? 'Saving...' : 'Update'}
            isLoading={loading}
            onClick={handleSave}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

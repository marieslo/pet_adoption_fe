import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radio, RadioGroup, FormControlLabel, FormLabel, FormControl, Alert, Box, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { SERVER_URL } from '../api';

export default function PetForm({ petId, isEdit, onSuccess }) {
  const initialState = {
    type: '',
    name: '',
    adoptionStatus: 'adoptable',
    picture: '',
    heightCm: '',
    weightKg: '',
    color: '',
    bio: '',
    hypoallergenic: false,
    dietaryRestrictions: '',
    breed: ''
  };

  const [petDetails, setPetDetails] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewSource, setPreviewSource] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && petId) {
      fetchPetDetails();
    }
  }, [isEdit, petId]);

  const fetchPetDetails = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/pets/${petId}`);
      setPetDetails(response.data);
    } catch (error) {
      console.error('Error fetching pet details:', error);
      setErrorMessage('Error fetching pet details.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'picture' && files) {
      previewFile(files[0]);
      uploadImage(files);
    } else {
      setPetDetails(prevDetails => ({
        ...prevDetails,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isEdit ? `${SERVER_URL}/pets/${petId}/details` : `${SERVER_URL}/pets/addpet`;
      const method = isEdit ? 'put' : 'post';

      await axios[method](endpoint, petDetails);
      setLoading(false);
      setPetDetails(initialState);
      onSuccess();
    } catch (error) {
      setLoading(false);
      setErrorMessage('Error saving pet details.');
      console.error('Error saving pet details:', error);
    }
  };

  const uploadImage = (files) => {
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'pet-adoption');
    const uploadUrl = process.env.CLOUDINARY_UPLOAD_URL;

    axios.post(uploadUrl, formData)
      .then(response => {
        setPetDetails(prevDetails => ({
          ...prevDetails,
          picture: response.data.url,
        }));
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <motion.div
      className="pet-form-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h5" sx={{ color: '#a72d66', marginBottom: 3 }}>
        {isEdit ? 'Edit Pet' : 'Add New Pet'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: '#a72d66' }}>Type *</FormLabel>
              <RadioGroup
                row
                name="type"
                value={petDetails.type}
                onChange={handleChange}
                required
              >
                <FormControlLabel value="dog" control={<Radio sx={{ color: '#a72d66', '&.Mui-checked': { color: '#a72d66' } }} />} label="Dog" />
                <FormControlLabel value="cat" control={<Radio sx={{ color: '#a72d66', '&.Mui-checked': { color: '#a72d66' } }} />} label="Cat" />
                <FormControlLabel value="other" control={<Radio sx={{ color: '#a72d66', '&.Mui-checked': { color: '#a72d66' } }} />} label="Other" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomInput
              label="Name *"
              name="name"
              value={petDetails.name}
              onChange={handleChange}
              required
              sx={{ color: '#a72d66' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: '#a72d66' }}>Adoption Status *</FormLabel>
              <RadioGroup
                row
                name="adoptionStatus"
                value={petDetails.adoptionStatus}
                onChange={handleChange}
                required
              >
                <FormControlLabel value="adoptable" control={<Radio sx={{ color: '#a72d66', '&.Mui-checked': { color: '#a72d66' } }} />} label="Adoptable" />
                <FormControlLabel value="adopted" control={<Radio sx={{ color: '#a72d66', '&.Mui-checked': { color: '#a72d66' } }} />} label="Adopted" />
                <FormControlLabel value="fostered" control={<Radio sx={{ color: '#a72d66', '&.Mui-checked': { color: '#a72d66' } }} />} label="Fostered" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomInput
              label="Height (cm) *"
              name="heightCm"
              type="number"
              value={petDetails.heightCm}
              onChange={handleChange}
              required
              sx={{ color: '#a72d66' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomInput
              label="Weight (kg) *"
              name="weightKg"
              type="number"
              value={petDetails.weightKg}
              onChange={handleChange}
              required
              sx={{ color: '#a72d66' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomInput
              label="Color *"
              name="color"
              value={petDetails.color}
              onChange={handleChange}
              required
              sx={{ color: '#a72d66' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomInput
              label="Dietary Restrictions *"
              name="dietaryRestrictions"
              value={petDetails.dietaryRestrictions}
              onChange={handleChange}
              required
              sx={{ color: '#a72d66' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomInput
              label="Breed *"
              name="breed"
              value={petDetails.breed}
              onChange={handleChange}
              required
              sx={{ color: '#a72d66' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomInput
              label="Bio *"
              name="bio"
              value={petDetails.bio}
              onChange={handleChange}
              multiline
              required
              sx={{ color: '#a72d66' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: '#a72d66' }}>Hypoallergenic *</FormLabel>
              <RadioGroup
                row
                name="hypoallergenic"
                value={petDetails.hypoallergenic}
                onChange={handleChange}
                required
              >
                <FormControlLabel value="yes" control={<Radio sx={{ color: '#a72d66', '&.Mui-checked': { color: '#a72d66' } }} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio sx={{ color: '#a72d66', '&.Mui-checked': { color: '#a72d66' } }} />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <input
                type="file"
                name="picture"
                onChange={handleChange}
                accept="image/*"
                style={{ marginBottom: '10px' }}
              />
              {previewSource && (
                <img src={previewSource} alt="Preview" className="pic-preview" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              type="submit"
              text={loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Pet'}
              isLoading={loading}
              disabled={loading}
            />
          </Grid>

        </Grid>

        {errorMessage && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </form>
    </motion.div>
  );
}
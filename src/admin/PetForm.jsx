import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radio, RadioGroup, FormControlLabel, FormLabel, FormControl, Alert } from '@mui/material';
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
    axios.post('https://api.cloudinary.com/v1_1/diunuo4xf/upload', formData)
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
      <h2>{isEdit ? 'Edit Pet' : 'Add New Pet'}</h2>

      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Type *</FormLabel>
          <RadioGroup
            row
            name="type"
            value={petDetails.type}
            onChange={handleChange}
            required
          >
            <FormControlLabel value="dog" control={<Radio />} label="Dog" />
            <FormControlLabel value="cat" control={<Radio />} label="Cat" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>

        <CustomInput
          label="Name *"
          name="name"
          value={petDetails.name}
          onChange={handleChange}
          required
        />

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Adoption Status *</FormLabel>
          <RadioGroup
            row
            name="adoptionStatus"
            value={petDetails.adoptionStatus}
            onChange={handleChange}
            required
          >
            <FormControlLabel value="adoptable" control={<Radio />} label="Adoptable" />
            <FormControlLabel value="adopted" control={<Radio />} label="Adopted" />
            <FormControlLabel value="fostered" control={<Radio />} label="Fostered" />
          </RadioGroup>
        </FormControl>

        <CustomInput
          label="Height (cm) *"
          name="heightCm"
          type="number"
          value={petDetails.heightCm}
          onChange={handleChange}
          required
        />

        <CustomInput
          label="Weight (kg) *"
          name="weightKg"
          type="number"
          value={petDetails.weightKg}
          onChange={handleChange}
          required
        />

        <CustomInput
          label="Color *"
          name="color"
          value={petDetails.color}
          onChange={handleChange}
          required
        />

        <CustomInput
          label="Dietary Restrictions *"
          name="dietaryRestrictions"
          value={petDetails.dietaryRestrictions}
          onChange={handleChange}
          required
        />

        <CustomInput
          label="Breed *"
          name="breed"
          value={petDetails.breed}
          onChange={handleChange}
          required
        />

        <CustomInput
          label="Bio *"
          name="bio"
          value={petDetails.bio}
          onChange={handleChange}
          multiline
          required
        />

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">Hypoallergenic *</FormLabel>
          <RadioGroup
            row
            name="hypoallergenic"
            value={petDetails.hypoallergenic}
            onChange={handleChange}
            required
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        <input
          type="file"
          name="picture"
          onChange={handleChange}
          accept="image/*"
        />

        {previewSource && (
          <img src={previewSource} alt="Preview" className="pic-preview" />
        )}

        <CustomButton
          type="submit"
          text={loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Pet'}
          isLoading={loading}
          disabled={loading}
        />

        {errorMessage && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </form>
    </motion.div>
  );
}
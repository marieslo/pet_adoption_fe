import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function EditPetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialState = {
    type: '',
    name: '',
    adoptionStatus: '',
    picture: '',
    heightCm: '',
    weightKg: '',
    color: '',
    bio: '',
    hypoallergenic: '',
    dietaryRestrictions: '',
    breed: '',
  };
  const [petDetails, setPetDetails] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [previewSource, setPreviewSource] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPetDetails();
  }, []);

  const fetchPetDetails = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/pets/${id}`);
      setPetDetails(response.data);
    } catch (error) {
      console.error('Error fetching pet details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'picture') {
      previewFile(files[0]);
      uploadImage(files);
    }
    setPetDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${SERVER_URL}/pets/${id}/details`, petDetails);
      setLoading(false);
      setShowSuccessMessage(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating pet details:', error);
      setErrorMessage('Error updating pet details. Please try again.');
    }
  };

  const uploadImage = (files) => {
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'pet-adoption'); 
    axios.post('https://api.cloudinary.com/v1_1/diunuo4xf/upload', formData
    ).then((response) => {
      console.log(response);
      setPetDetails((prevDetails) => ({
        ...prevDetails,
        picture: response.data.url,
      }));
    }).catch((error) => {
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
    <div className='admin-dashboard-container'>
      <div className="add-pet-form-container">
        <h2>Edit Pet's Details:</h2>
        <br/>
        <br/>
        <form onSubmit={handleSubmit} className="add-pet-form">
          <div className="add-pet-form-column">
            <div className="add-pet-form-column-item">
              <label className='left-label'>
                Type: *
                <br />
                <br />
                <input
                  className='radio-choice'
                  type="radio"
                  name="type"
                  value="dog"
                  checked={petDetails.type === "dog"}
                  onChange={handleChange}
                  required
                />
                Dog
                <input
                  className='radio-choice'
                  type="radio"
                  name="type"
                  value="cat"
                  checked={petDetails.type === "cat"}
                  onChange={handleChange}
                  required
                />
                Cat
                <input
                  className='radio-choice'
                  type="radio"
                  name="type"
                  value="other"
                  checked={petDetails.type === "other"}
                  onChange={handleChange}
                  required
                />
                Other
              </label>
            </div>
            <br />
            <div className="add-pet-form-column-item">
              <label className="left-label">
                Name: *
                <br />
                <input type="text" name="name" value={petDetails.name} onChange={handleChange} required />
              </label>
              <br />
              <label className="left-label">
                Adoption Status: *
                <br />
                <br />
                <input
                  className='radio-choice'
                  type="radio"
                  name="adoptionStatus"
                  value="adoptable"
                  checked={petDetails.adoptionStatus === "adoptable"}
                  onChange={handleChange}
                  required
                />
                Adoptable
                <input
                  className='radio-choice'
                  type="radio"
                  name="adoptionStatus"
                  value="adopted"
                  checked={petDetails.adoptionStatus === "adopted"}
                  onChange={handleChange}
                  required
                />
                Adopted
                <input
                  className='radio-choice'
                  type="radio"
                  name="adoptionStatus"
                  value="fostered"
                  checked={petDetails.adoptionStatus === "fostered"}
                  onChange={handleChange}
                  required
                />
                Fostered
              </label>
              <br/>
              <label className="left-label">
                Picture: *
                <br />
                <input type="file" name="picture" onChange={handleChange} accept="image/*" />
              </label>
              <label className="left-label">
                Height, cm: *
                <br />
                <input type="number" min="1" max="100" name="heightCm" value={petDetails.heightCm} onChange={handleChange} required />
              </label>
              <label className="left-label">
                Weight, kg: *
                <br />
                <input type="number" min="1" max="100"  name="weightKg" value={petDetails.weightKg} onChange={handleChange} required />
              </label>
            </div>
          </div>
          <div className="add-pet-form-column">
            <div className="add-pet-form-column-item">
              <label className="left-label">
                Color: *
                <br />
                <input type="text" name="color" value={petDetails.color} onChange={handleChange} required />
              </label>
              <label className="left-label">
                Bio: *
                <br/>
                <textarea name="bio" value={petDetails.bio} onChange={handleChange} required />
              </label>
            </div>
            <div className="add-pet-form-column-item">
              <div className="choice-container">
              <label className="left-label">
                  Hypoallergenic: *
                  <br />
                  <br />
                  <input
                    className="radio-choice"
                    type="radio"
                    name="hypoallergenic"
                    value="yes"
                    checked={petDetails.hypoallergenic === true}
                    onChange={handleChange}
                    required
                  />
                  Yes
                  <input
                    className="radio-choice"
                    type="radio"
                    name="hypoallergenic"
                    value="no"
                    checked={petDetails.hypoallergenic === false}
                    onChange={handleChange}
                    required
                  />
                  No
                </label>
              </div>
              <label className="left-label">
                Dietary Restrictions: *
                <br/>
                <input type="text" name="dietaryRestrictions" value={petDetails.dietaryRestrictions} onChange={handleChange} required />
              </label>
              <label className="left-label">
                Breed: *
                <br/>
                <input type="text" name="breed" value={petDetails.breed} onChange={handleChange} required />
              </label>
            </div>
          </div>
          {previewSource && (
            <img src={previewSource} alt='Preview' className='pic-preview' />
          )}
          <button className='save-pet-details-button add-pet' variant='secondary' type="submit">
          {loading ? (
                <>
                  <LoadingSpinner/>
                </>
              ) : (
                'Save changes'
              )}
          </button>
          {showSuccessMessage && (
            <div className="success-message">
              Pet updated successfully!
            </div>
          )}
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import './MyProfilePage.css';
import { useAuth } from '../../context/AuthProvider';
import { Spinner } from 'react-bootstrap';

export default function EditProfileForm({ onSave, initialData }) {
  const { updateUser, updateUserPassword } = useAuth(); 
  const [formData, setFormData] = useState({
    email: initialData.email || '',
    currentPassword: '', 
    newPassword: '', 
    confirmNewPassword: '', 
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    phoneNumber: initialData.phoneNumber || '',
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
    <>
      <div className='edit-profile-spinner-container'>
      </div>
      <div className='success-edit-profile-msg'>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
      <div className='error-edit-profile-msg'>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div className='edit-profile-container'>
        <div className='editprofile-inputs'>
          <h2 className='edit-profile-name'>Edit Profile</h2>
          <br />
          <br />
          <br />
          <div>
            <label className='edit-profile-label'>Email:</label>
            <input className='edit-profile-input-item'
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label className='edit-profile-label'>Current Password:</label>
            <input  className='edit-profile-input-item'
              type="password"
              name="currentPassword" 
              placeholder='***********'
              value={formData.currentPassword} 
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label className='edit-profile-label'>New Password:</label>
            <input  className='edit-profile-input-item'
              type="password"
              placeholder="at least 6 characters"
              name="newPassword" 
              value={formData.newPassword} 
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label className='edit-profile-label'>Confirm New Password:</label>
            <input  className='edit-profile-input-item'
              type="password"
              name="confirmNewPassword" 
              value={formData.confirmNewPassword} 
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label className='edit-profile-label'>First Name:</label>
            <input  className='edit-profile-input-item'
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label className='edit-profile-label'>Last Name:</label>
            <input  className='edit-profile-input-item'
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <br />
          <div>
            <label className='edit-profile-label'>Phone Number:</label>
            <input className='edit-profile-input-item'
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <br />
        </div>
        <div className='editprofile-shortbio'>
          <label className='edit-profile-label'>Short Bio:</label>
          <textarea  
            className='edit-profile-textarea'
            name="shortBio"
            value={formData.shortBio}
            onChange={handleChange}
          />
        </div>
        <button
          className="edit-profile-page-btn"
          type="button"
          onClick={handleSave}
          disabled={loading}>
          {loading ? <Spinner animation="grow" variant="light" /> : 'Save'}
        </button>
      </div>
    </>
  );
}
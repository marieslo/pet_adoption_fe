import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';

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
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-[70px] right-[30px] bg-[#f5efee] text-[#593202] shadow-md rounded-md p-4 text-center opacity-80">
          <p className="text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-[70px] right-[30px] bg-[#f5efee] text-[#593202] shadow-md rounded-md p-4 text-center opacity-80">
          <p className="text-red-600">{errorMessage}</p>
        </div>
      )}

      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-16">
        <h2 className="text-2xl font-semibold text-[#401e12] mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#401e12]">Email:</label>
            <input
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#401e12]">Current Password:</label>
            <input
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              type="password"
              name="currentPassword"
              placeholder="***********"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#401e12]">New Password:</label>
            <input
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              type="password"
              placeholder="at least 6 characters"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#401e12]">Confirm New Password:</label>
            <input
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#401e12]">First Name:</label>
            <input
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#401e12]">Last Name:</label>
            <input
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#401e12]">Phone Number:</label>
            <input
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#401e12]">Short Bio:</label>
            <textarea
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              name="shortBio"
              value={formData.shortBio}
              onChange={handleChange}
            />
          </div>
          <button
            className="w-full mt-4 bg-[#593202] text-white p-3 rounded-md"
            type="button"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin border-4 border-t-transparent border-blue-500 rounded-full w-6 h-6 mx-auto"></div>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
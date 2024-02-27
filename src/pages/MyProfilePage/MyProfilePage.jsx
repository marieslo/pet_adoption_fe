import React from 'react';
import { useAuth } from '../../context/AuthProvider.jsx';
import EditProfileForm from './EditProfileForm';

export default function MyProfilePage() {
  const { user } = useAuth();

  const handleSave = async (formData) => {
    try {
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className='profile-page-container'>
      {user && <EditProfileForm initialData={user} onSave={handleSave} />}
    </div>
  );
}
import React from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import EditProfileForm from './EditProfileForm.jsx';

export default function ProfilePage() {
  const { user } = useAuth();

  const handleSave = async () => {
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
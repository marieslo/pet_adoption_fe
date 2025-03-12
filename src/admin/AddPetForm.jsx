import React, { useState } from 'react';
import PetForm from './PetForm';
import { Snackbar, Alert } from '@mui/material';

export default function AddPetForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSuccess = () => {
    setShowSuccessMessage(true);
  };

  const handleCloseSnackbar = () => {
    setShowSuccessMessage(false);
  };

  return (
    <div>
      <PetForm isEdit={false} onSuccess={handleSuccess} />
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Pet added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

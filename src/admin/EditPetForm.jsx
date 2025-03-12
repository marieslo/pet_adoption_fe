import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import PetForm from './PetForm';
import { Snackbar, Alert } from '@mui/material';

export default function EditPetForm() {
  const { id } = useParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSuccess = () => {
    setShowSuccessMessage(true);
  };

  const handleCloseSnackbar = () => {
    setShowSuccessMessage(false);
  };

  return (
    <div>
      <PetForm petId={id} isEdit={true} onSuccess={handleSuccess} />
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Pet updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
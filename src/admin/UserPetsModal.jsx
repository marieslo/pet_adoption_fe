import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { SERVER_URL } from '../api';
import { Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Button } from '@mui/material';

export default function UserPetsModal({ showUserPetsModal, setShowUserPetsModal, selectedUser }) {
  const [userPets, setUserPets] = useState({ likedPets: [], fosteredPets: [], adoptedPets: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserPets = async () => {
      if (selectedUser) {
        try {
          setLoading(true);
          const response = await axios.get(`${SERVER_URL}/users/profile/${selectedUser.id}/pets`);
          const userData = response.data;
          setUserPets(userData);
        } catch (error) {
          console.error('Error fetching user pets:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserPets();
  }, [selectedUser]);

  const renderPets = () => {
    if (loading) {
      return <CircularProgress />;
    }
    if (!selectedUser) return <p>No user selected</p>;
    const hasPets = userPets.adoptedPets?.length > 0 || userPets.fosteredPets?.length > 0 || userPets.likedPets?.length > 0;
    if (!hasPets) {
      return <p>User has no pets.</p>; 
    }

    return (
      <div className="pets-of-user">
        {userPets.adoptedPets?.length > 0 && (
          <div className="pets-of-user-modal-section">
            <h4><u>Adopted:</u></h4>
            <ol>
              {userPets.adoptedPets.map((pet, index) => (
                <li className="pet-name" key={`adopted-pet-${pet._id}-${index}`}>
                  <span onClick={() => navigate(`/pets/${pet._id}`)} style={{ cursor: 'pointer' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px', position: 'relative' }}>
                      <img 
                        src={pet.picture} 
                        alt={pet.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                      />
                    </div>
                    {pet.name}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
        {userPets.fosteredPets?.length > 0 && (
          <div className="pets-of-user-modal-section">
            <h4><u>Fostered:</u></h4>
            <ol>
              {userPets.fosteredPets.map((pet, index) => (
                <li className="pet-name" key={`fostered-pet-${pet._id}-${index}`}>
                  <span onClick={() => navigate(`/pets/${pet._id}`)} style={{ cursor: 'pointer' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px', position: 'relative' }}>
                      <img 
                        src={pet.picture} 
                        alt={pet.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                      />
                    </div>
                    {pet.name}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
        {userPets.likedPets?.length > 0 && (
          <div className="pets-of-user-modal-section">
            <h4><u>Liked:</u></h4>
            <ol>
              {userPets.likedPets.map((pet, index) => (
                <li className="pet-name" key={`liked-pet-${pet._id}-${index}`}>
                  <span onClick={() => navigate(`/pets/${pet._id}`)} style={{ cursor: 'pointer' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px', position: 'relative' }}>
                      <img 
                        src={pet.picture} 
                        alt={pet.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                      />
                    </div>
                    {pet.name}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog
      open={showUserPetsModal}
      onClose={() => setShowUserPetsModal(false)}
      fullWidth
      maxWidth="sm"
      sx={{
        borderRadius: '30px',
        '& .MuiDialogTitle-root': {
          fontWeight: 'bold',
        },
        '& .MuiDialogContent-root': {
          padding: '20px',
        },
      }}
    >
      <DialogTitle>{`${selectedUser ? `${selectedUser.firstName}` : 'User'}'s Pets`}</DialogTitle>
      <DialogContent>
        {renderPets()}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowUserPetsModal(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
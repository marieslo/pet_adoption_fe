import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { SERVER_URL } from '../api';

export default function UserPetsModal({ showUserPetsModal, setShowUserPetsModal, selectedUser }) {
  const [userPets, setUserPets] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserPets = async () => {
      if (selectedUser) {
        try {
          const response = await axios.get(`${SERVER_URL}/users/profile/${selectedUser.id}/pets`);
          const userData = response.data;
          setUserPets(userData);
        } catch (error) {
          console.error('Error fetching user pets:', error);
        }
      }
    };

    fetchUserPets();
  }, [selectedUser]);

  const renderPets = () => {
    if (!selectedUser) return null;
  
    return (
      <div className='pets-of-user'>
        <div className='pets-of-user-modal-section'>
          <h6><u>Adopted:</u></h6>
          <ol>
            {userPets.adoptedPets && userPets.adoptedPets.map((pet, index) => (
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
        <div className='pets-of-user-modal-section'>
          <h6><u>Fostered:</u></h6>
          <ol>
            {userPets.fosteredPets && userPets.fosteredPets.map((pet, index) => (
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
        <div className='pets-of-user-modal-section'>
          <h6><u>Liked:</u></h6>
          <ol>
            {userPets.likedPets && userPets.likedPets.map((pet, index) => (
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
      </div>
    );
  };

  return (
    <>
      {showUserPetsModal && (
        <div className="custom-modal-overlay" onClick={() => setShowUserPetsModal(false)}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h2>{`Pets of ${selectedUser ? selectedUser.firstName + " " + selectedUser.lastName : ""}`}</h2>
              <button className="close-modal" onClick={() => setShowUserPetsModal(false)}>
                X
              </button>
            </div>
            <div className="custom-modal-body">
              {renderPets()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
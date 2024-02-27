import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import './AdminDashboards.css';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

export default function UserPetsModal({ showUserPetsModal, setShowUserPetsModal, selectedUser }) {
  const [userPets, setUserPets] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserPets = async () => {
      if (selectedUser) {
        try {
          const response = await axios.get(`http://localhost:3000/users/profile/${selectedUser.id}/pets`);
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
    <Modal show={showUserPetsModal} onHide={() => setShowUserPetsModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{`Pets of ${selectedUser ? selectedUser.firstName + " " + selectedUser.lastName : ""}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderPets()}</Modal.Body>
    </Modal>
  );
}
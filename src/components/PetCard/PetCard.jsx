import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { useMyPetsContext } from '../../context/MyPetsProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import localforage from 'localforage'; 
import './PetCard.css';
import likeIcon from '../../styles/icons/heart-filled.png';
import unlikeIcon from '../../styles/icons/heart-outlined.png';
import seeMoreIcon from '../../styles/icons/seemore.png';
import { SERVER_URL } from '../../../api';

export default function PetCard({ pet }) {
  const { _id, picture, name } = pet;
  const imageUrl = picture;
  const isDefaultImage = !imageUrl;

  const navigate = useNavigate();
  const { likePet, unlikePet } = useMyPetsContext();
  const { user } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [adoptionStatus, setAdoptionStatus] = useState('');

  useEffect(() => {
    fetchPetAdoptionStatus();
    if (user && _id) {
      localforage.getItem(`likedStatus_${user._id}_${_id}`).then((value) => {
        if (value !== null) {
          setIsLiked(value);
        }
      });
    }
  }, [user, _id]);

  const fetchPetAdoptionStatus = async () => {
    try {
      if (_id) {
        const response = await fetch(`${SERVER_URL}/pets/${_id}`);
        const data = await response.json();
        setAdoptionStatus(data.adoptionStatus);
      }
    } catch (error) {
      console.error('Error fetching pet adoption status:', error);
    }
  };

  const handleSeeMore = () => {
    if (!user) {
      setShowAlert(true);
    } else {
      navigate(`/pets/${_id}`, { state: { isLiked } });
    }
  };

  const handleLike = async () => {
    try {
      if (!user) {
        setShowAlert(true);
      } else {
        if (!isLiked) {
          await likePet(_id);
        } else {
          await unlikePet(_id);
        }
        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);
        localforage.setItem(`likedStatus_${user._id}_${_id}`, newLikedStatus);
      }
    } catch (error) {
      console.error('Error updating liked status:', error);
      setShowAlert(true);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert
          className="alert-modal-ask-login"
          variant="warning"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          <p>Please log in to see details or save this pet</p>
        </Alert>
      )}
      <div className="pet-card-container">
        <Card className={`pet-card ${adoptionStatus.toLowerCase()}`}>
          {imageUrl && (
            <div className="custom-frame">
              <Card.Img
                variant="top"
                src={imageUrl}
                alt={`Image of ${name}`}
                className={`card-img ${isDefaultImage ? 'default-img' : ''}`}
              />
            </div>
          )}
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>{adoptionStatus}</Card.Text>
            <button className="pet-card-btn seemore" onClick={handleSeeMore}>
              <img src={seeMoreIcon} alt="See more" className="see-more-icon" />
            </button>
            {user && (
              <button className="like-btn" onClick={handleLike}>
                <img
                  src={isLiked ? likeIcon : unlikeIcon}
                  alt={isLiked ? 'Like' : 'Unlike'}
                  className="like-icon"
                />
              </button>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
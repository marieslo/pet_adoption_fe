import React, { useState, useEffect } from 'react';
import { useMyPetsContext } from '../context/MyPetsProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import localforage from 'localforage'; 
import { Favorite, FavoriteBorder, Visibility } from '@mui/icons-material'; 
import { Box, Card, CardMedia, CardContent, Typography, IconButton, Alert } from '@mui/material';
import { SERVER_URL } from '../api';

export default function PetCard ({ pet }) {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', margin: 2 }}>
        <Card sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 345,
          margin: 2,
          backgroundColor: 'lightgrey',
          boxShadow: 3,
          borderRadius: 2,
          fontFamily: 'Arial, sans-serif',
          '&.adopted': { backgroundColor: 'lightgreen' },
          '&.available': { backgroundColor: 'lightblue' },
          '&.pending': { backgroundColor: 'lightyellow' }
        }}>
          {imageUrl ? (
            <CardMedia
              component="img"
              alt={`Image of ${name}`}
              height="200"
              image={imageUrl}
              sx={{ objectFit: 'cover', borderRadius: 2 }}
            />
          ) : (
            <Box sx={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200,
              backgroundColor: '#f5f5f5', borderRadius: 2
            }}>
              <FavoriteBorder sx={{ fontSize: 100, color: '#ccc' }} />
            </Box>
          )}
          <CardContent>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="textSecondary">{adoptionStatus}</Typography>
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: 10, left: 10
            }}>
              <IconButton onClick={handleSeeMore} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%' }}>
                <Visibility sx={{ fontSize: 30, color: '#401e12' }} />
              </IconButton>
              {user && (
                <IconButton onClick={handleLike} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%' }}>
                  {isLiked ? (
                    <Favorite sx={{ fontSize: 40, color: '#d32f2f' }} />
                  ) : (
                    <FavoriteBorder sx={{ fontSize: 40, color: '#d32f2f' }} />
                  )}
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

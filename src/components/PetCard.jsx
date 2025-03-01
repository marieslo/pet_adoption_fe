import React, { useState, useEffect } from 'react';
import { useMyPetsContext } from '../context/MyPetsProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import localforage from 'localforage';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Alert } from '@mui/material';
import { Favorite, FavoriteBorder, Visibility } from '@mui/icons-material';
import { SERVER_URL } from '../api';
import { motion } from 'framer-motion';

export default function PetCard({ pet }) {
  const { _id, picture, name } = pet;
  const imageUrl = picture;

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
        <Alert severity="warning" onClose={() => setShowAlert(false)}>
          Please log in to see details or save this pet
        </Alert>
      )}
      <motion.div whileHover={{ scale: 1.05 }} className="d-flex justify-content-center my-3">
        <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
          {imageUrl ? (
            <CardMedia component="img" height="200" image={imageUrl} alt={`Image of ${name}`} />
          ) : (
            <CardMedia
              sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'grey.300' }}
            >
              <FavoriteBorder sx={{ fontSize: 100, color: 'grey.700' }} />
            </CardMedia>
          )}
          <CardContent>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {adoptionStatus}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <IconButton onClick={handleSeeMore} color="primary">
              <Visibility fontSize="large" />
            </IconButton>
            {user && (
              <IconButton onClick={handleLike} color="secondary">
                {isLiked ? <Favorite fontSize="large" /> : <FavoriteBorder fontSize="large" />}
              </IconButton>
            )}
          </CardActions>
        </Card>
      </motion.div>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { useMyPetsContext } from '../context/MyPetsProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import localforage from 'localforage';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, MoreVert } from '@mui/icons-material';
import { SERVER_URL } from '../api';

export default function PetCard({ pet }) {
  if (!pet || !pet._id) {
    return <Typography>No pet data available</Typography>;
  }

  const { _id, picture, name } = pet;
  const imageUrl = picture || '';

  const navigate = useNavigate();
  const { likePet, unlikePet } = useMyPetsContext();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [adoptionStatus, setAdoptionStatus] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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
        setAdoptionStatus(data.adoptionStatus || 'Unknown');
      }
    } catch (error) {
      console.error('Error fetching pet adoption status:', error);
      setAdoptionStatus('Unknown');
    }
  };

  const handleLike = async () => {
    try {
      if (!user) {
        setShowAlert(true);
        return;
      }
      if (!isLiked) {
        await likePet(_id);
        setIsLiked(true);
      }
      localforage.setItem(`likedStatus_${user._id}_${_id}`, true);
    } catch (error) {
      console.error('Error updating liked status:', error);
      setShowAlert(true);
    }
  };

  const handleUnlike = async () => {
    try {
      if (!user) {
        setShowAlert(true);
        return;
      }
      if (isLiked) {
        await unlikePet(_id);
        setIsLiked(false);
      }
      localforage.setItem(`likedStatus_${user._id}_${_id}`, false);
    } catch (error) {
      console.error('Error updating liked status:', error);
      setShowAlert(true);
    }
  };

  return (
    <Card sx={{ width: '200px', height: '300px', border: 1, borderRadius: 6, borderColor: 'white', position: 'relative', overflow: 'hidden' }}>
      <CardActions sx={{ padding: 0, justifyContent: 'space-between', position: 'absolute', top: 10, left: 10, right: 10, zIndex: 2, cursor: 'pointer' }}>
        {isLiked ? (
          <Favorite sx={{ color: 'var(--accent)', fontSize: 30 }} onClick={handleUnlike} />
        ) : (
          <FavoriteBorder sx={{ color: 'var(--accent)', fontSize: 30 }} onClick={handleLike} />
        )}
        <IconButton aria-label="more" onClick={() => navigate(`/pets/${_id}`)} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '50%' }}>
          <MoreVert />
        </IconButton>
      </CardActions>
      <CardMedia component="img" image={imageUrl} alt={`Image of ${name}`} sx={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      <CardContent sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1, background: 'rgba(0, 0, 0, 0.3)', padding: '10px' }}>
        <Typography variant="h6" align="center" noWrap sx={{ color: 'white' }}>
          {name}
        </Typography>
        <Typography variant="body2" color="white" noWrap align="center" fontStyle={'italic'}>
          {adoptionStatus}
        </Typography>
      </CardContent>
      {showAlert && <div>Please log in to like pets!</div>}
    </Card>
  );
}

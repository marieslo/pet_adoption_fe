import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import localforage from 'localforage';
import { FetchPetsContext } from '../context/FetchPetsProvider';
import { useMyPetsContext } from '../context/MyPetsProvider';
import { useAuth } from '../context/AuthProvider';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Card, Typography, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';

import CustomButton from '../components/CustomButton';

export default function SinglePetPage() {
  const { id } = useParams();
  const { fetchPetById } = useContext(FetchPetsContext);
  const { likePet, unlikePet, adoptPet, fosterPet, returnPet } = useMyPetsContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const data = await fetchPetById(id);
        setPetData(data);
        const storedLikedStatus = await localforage.getItem(`likedStatus_${user?._id}_${id}`);
        setIsLiked(storedLikedStatus || false);
      } catch (error) {
        console.error('Error fetching pet data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPetData();
  }, [fetchPetById, id, user?._id]);

  const handleLike = async () => {
    if (!user) return setShowAlert(true);
    await likePet(id);
    setIsLiked(true);
    await localforage.setItem(`likedStatus_${user._id}_${id}`, true);
  };

  const handleUnlike = async () => {
    if (!user) return setShowAlert(true);
    await unlikePet(id);
    setIsLiked(false);
    await localforage.removeItem(`likedStatus_${user._id}_${id}`);
  };

  const handleAdopt = async () => {
    await adoptPet(id);
    setPetData(prev => ({ ...prev, adoptionStatus: 'adopted' }));
  };

  const handleFoster = async () => {
    await fosterPet(id);
    setPetData(prev => ({ ...prev, adoptionStatus: 'fostered' }));
  };

  const handleReturn = async () => {
    await returnPet(id);
    setPetData(prev => ({ ...prev, adoptionStatus: 'adoptable' }));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!petData) return <Typography>No pet data found</Typography>;

  const { picture, name, adoptionStatus, bio, type, heightCm, weightKg, color, hypoallergenic, dietaryRestrictions, breed } = petData;

  return (
    <Box sx={{
      backgroundImage: "url('https://res.cloudinary.com/nkwjho4xf/image/upload/v1741190670/pet-adoption/single-pet-page-background_kirjzl.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      width: '100vw',
      paddingTop: '64px',
      paddingBottom: '80px', 
      position: 'relative',
    }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* Pet Info Card */}
          <Grid item xs={12} sm={10} md={8} sx={{ display: 'flex', justifyContent: 'center'}}>
            <Card sx={{
              borderRadius: 'var(--border-radius)',
              overflow: 'hidden',
              padding: 2,
              backgroundColor: 'rgba(72, 60, 50, 0.8)', 
              color: 'var(--light)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              textAlign: 'start',
              position: 'relative',
              width: '100%',
              margin: '0 auto', 
            }}>
              <Box sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                maxHeight: '500px',
                marginBottom: { xs: 2, md: 0 }, 
              }}>
                <Box
                  component="img"
                  src={picture}
                  alt={name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 'var(--border-radius)',
                  }}
                />
                
                <Box sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 2,
                  cursor: 'pointer',
                }}>
                  {isLiked ? (
                    <Favorite sx={{ color: 'var(--accent)', fontSize: 60 }} onClick={handleUnlike} />
                  ) : (
                    <FavoriteBorder sx={{ color: 'var(--accent)', fontSize: 60 }} onClick={handleLike} />
                  )}
                </Box>
              </Box>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'start',
                paddingTop: { xs: 2, md: 0 },
                width: '100%',
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{name}</Typography>
                <Typography sx={{ fontStyle: 'italic', marginTop: 2, marginBottom: 2 }}>{bio}</Typography>
                <Typography><span style={{ fontStyle: 'italic', fontSize: '12px'}}>Status:</span> {adoptionStatus}</Typography>
                <Typography><span style={{ fontStyle: 'italic', fontSize: '12px'}}>Type:</span> {type}</Typography>
                <Typography><span style={{ fontStyle: 'italic', fontSize: '12px'}}>Height:</span> {heightCm} cm</Typography>
                <Typography><span style={{ fontStyle: 'italic', fontSize: '12px'}}>Weight:</span> {weightKg} kg</Typography>
                <Typography><span style={{ fontStyle: 'italic', fontSize: '12px'}}>Color:</span> {color}</Typography>
                <Typography><span style={{ fontStyle: 'italic', fontSize: '12px'}}>Hypoallergenic:</span> {hypoallergenic ? 'Yes' : 'No'}</Typography>
                <Typography><span style={{ fontStyle: 'italic', fontSize: '12px'}}>Dietary Restrictions:</span> {dietaryRestrictions}</Typography>
                <Typography><span style={{ fontStyle: 'italic', fontSize: '12px'}}>Breed:</span> {breed}</Typography>

                <Box sx={{
                  marginTop: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                }}>
                  {adoptionStatus === 'adoptable' ? (
                    <>
                      <CustomButton text="Adopt" onClick={handleAdopt} />
                      <CustomButton text="Foster" onClick={handleFoster} />
                    </>
                  ) : (
                    <CustomButton text="Return" color="var(--secondary)" onClick={handleReturn} />
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
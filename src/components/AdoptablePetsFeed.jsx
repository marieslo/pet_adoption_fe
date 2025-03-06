import React, { useEffect, useState, useContext, Suspense } from 'react';
import axios from 'axios';
import { useFetchPets } from '../context/FetchPetsProvider';
import { AuthContext } from '../context/AuthProvider';
import { Box, IconButton, Alert } from '@mui/joy';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { SERVER_URL } from '../api';

const PetCard = React.lazy(() => import('./PetCard'));

export default function AdoptablePetsFeed() {
  const { loading, adoptablePets, fetchPets } = useFetchPets();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPets();
      } catch (error) {
        console.error('There was an error fetching the pets');
      }
    };
    fetchData();
  }, [fetchPets]);

  const handleLike = async (pet) => {
    if (isAuthenticated) {
      try {
        await axios.post(`${SERVER_URL}/pets/${pet._id}/like`, { userId: user.id });
      } catch (error) {
        setErrorMessage('There was an error liking the pet');
      }
    }
  };


  const visiblePets = [
    adoptablePets[(currentIndex) % adoptablePets.length],
    adoptablePets[(currentIndex + 1) % adoptablePets.length],
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % adoptablePets.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + adoptablePets.length) % adoptablePets.length);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      zIndex: 10,
    }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {errorMessage && (
            <Alert color="danger" variant="outlined">
              {errorMessage}
            </Alert>
          )}

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            width: '60%',
            minWidth: '450px',
            overflow: 'hidden',
            gap: 2,
          }}>
            <IconButton 
              onClick={handlePrev} 
              variant="soft" 
              color="neutral" 
              sx={{
                position: 'absolute',
                left: 0,
                borderRadius: '50%', 
                opacity: 0.7,
                '&:hover': { opacity: 1 },
                width: 40,
                height: 40,
                zIndex: 20, 
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              width: '100%',
            }}>
              {visiblePets.map((pet, index) => (
                <Box key={pet?._id || index} sx={{
                  width: '50%',
                  padding: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  <div>
                    <Suspense fallback={<div>Loading...</div>}>
                      {pet && <PetCard pet={pet} showLikeButton={true} onLike={() => handleLike(pet)} showAdoptionStatus={true} />}
                    </Suspense>
                  </div>
                </Box>
              ))}
            </Box>

            <IconButton 
              onClick={handleNext} 
              variant="soft" 
              color="neutral" 
              sx={{
                position: 'absolute',
                right: 0,
                borderRadius: '50%', 
                opacity: 0.7,
                '&:hover': { opacity: 1 },
                width: 40,
                height: 40,
                zIndex: 20,
              }}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
}

import React, { useEffect, useState, useContext, Suspense } from 'react';
import { useFetchPets } from '../context/FetchPetsProvider';
import { Box, IconButton, Alert } from '@mui/joy';
import { ArrowForward, ArrowBack } from '@mui/icons-material';


const PetCard = React.lazy(() => import('./PetCard'));

export default function NewlyAddedPets() {
  const { loading, newlyAddedPets } = useFetchPets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    if (!newlyAddedPets.length) {
      setErrorMessage('No newly added pets available.');
    }
  }, [newlyAddedPets]);


  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newlyAddedPets.length);
  };


  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + newlyAddedPets.length) % newlyAddedPets.length);
  };


  const visiblePets = [
    newlyAddedPets[(currentIndex) % newlyAddedPets.length],
    newlyAddedPets[(currentIndex + 1) % newlyAddedPets.length],
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      zIndex: 10,
      width: '100%',
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
            width: '100%',
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
                  width: '100%',
                  padding: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  <div>
                    <Suspense fallback={<div>Loading...</div>}>
                      {pet && <PetCard pet={pet} showLikeButton={true} showAdoptionStatus={true} />}
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
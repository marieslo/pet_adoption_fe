import React, { useState } from 'react';
import PetCard from './PetCard';
import { Box, IconButton } from '@mui/joy';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

export default function FavoritePetsList({ title, cssClass, pets, onLike, onUnlike, likedPets }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasPets = pets.length > 0;


  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pets.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length);
  };

  const renderPets = () => {
    if (likedPets.length === 0) {
      return <p className="no-pets">No pets available</p>;
    }

    return pets.map((pet, index) => (
      <Box key={pet._id || index} sx={{
        width: '100%',
        padding: 1,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <PetCard pet={pet} onLike={onLike} onUnlike={onUnlike} />
      </Box>
    ));
  };

  return (
    <div className={`pets-section ${cssClass}`}>
      {hasPets && <h2 className={`my-pets-${cssClass}`}>{title}:</h2>}
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
          {hasPets ? renderPets() : <p className="no-pets">No pets available</p>}
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
    </div>
  );
}

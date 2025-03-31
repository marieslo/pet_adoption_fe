import React from 'react';
import PetCard from './PetCard';
import { Box, } from '@mui/joy';

export default function FavoritePetsList({cssClass, pets, onLike, onUnlike, likedPets }) {

  const hasPets = pets.length > 0;

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
     <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          minWidth: '450px',
          overflow: 'hidden',
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' }, 
          top: '80px',
        }}>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          transition: 'transform 0.3s ease',
          width: '100%',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          padding: { xs: 2, sm: 0 },
          height: '80vh',
          overflowY: 'auto', 
        }}>
          {hasPets ? renderPets() : <p className="no-pets">No pets available</p>}
        </Box>
      </Box>
    </div>
  );
}

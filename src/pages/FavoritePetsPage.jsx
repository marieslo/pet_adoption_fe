import React, { useEffect, useState } from 'react';
import { useMyPetsContext } from '../context/MyPetsProvider';
import PetsList from './PetsList';
import AdoptablePetsFeed from '../components/AdoptablePetsFeed';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';

export default function FavoritePetsPage() {
  const {
    likedPets = [],
    adoptedPets = [],
    fosteredPets = [],
    likePet,
    unlikePet,
    adoptPet,
    fosterPet,
    returnPet,
    adoptedPetsUpdated,
    fosteredPetsUpdated,
    unlikedPetsUpdated,
  } = useMyPetsContext();

  const [likedPetsUpdated, setLikedPetsUpdated] = useState(false);

  useEffect(() => {
    setLikedPetsUpdated(unlikedPetsUpdated || adoptedPetsUpdated || fosteredPetsUpdated);
  }, [unlikedPetsUpdated, adoptedPetsUpdated, fosteredPetsUpdated]);

  return (
    <div className='fav-pets-page-container'>
      <div className='my-pets-lists-wrapper'>
        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ flexWrap: 'wrap' }}>

          {/* Pet List: Liked Pets */}
          <Grid item xs={12} sm={4} md={3}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <PetsList
                key={likedPetsUpdated ? 'likedUpdated' : 'liked'}
                title="Liked"
                cssClass="liked"
                pets={likedPets}
                onLike={likePet}
                onUnlike={unlikePet}
              />
            </motion.div>
          </Grid>

          {/* Pet List: Fostered Pets */}
          <Grid item xs={12} sm={4} md={3}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <PetsList
                key={fosteredPetsUpdated ? 'fosteredUpdated' : 'fostered'}
                title="Fostered"
                cssClass="fostered"
                pets={fosteredPets}
                onLike={likePet}
                onUnlike={unlikePet}
                onAdopt={adoptPet}
                onFoster={fosterPet}
                onReturn={returnPet}
              />
            </motion.div>
          </Grid>

          {/* Pet List: Adopted Pets */}
          <Grid item xs={12} sm={4} md={3}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <PetsList
                key={adoptedPetsUpdated ? 'adoptedUpdated' : 'adopted'}
                title="Adopted"
                cssClass="adopted"
                pets={adoptedPets}
                onLike={likePet}
                onUnlike={unlikePet}
                onReturn={returnPet}
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Show message when no pets are saved, adopted, or fostered */}
        {(likedPets.length === 0 && adoptedPets.length === 0 && fosteredPets.length === 0) && (
          <Box className="they-need-your-love" mt={4} textAlign="center">
            <Typography variant="h6" paragraph>
              For now, you don't have any saved, adopted, or fostered pets.
            </Typography>
            <Typography variant="body1" paragraph>
              Look for adoptable ones
            </Typography>
            <AdoptablePetsFeed />
          </Box>
        )}
      </div>
    </div>
  );
}
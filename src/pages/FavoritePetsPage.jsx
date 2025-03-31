import React, { useEffect, useState } from 'react';
import { useFavoritePetsContext } from '../context/FavoritePetsProvider';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import FavoritePetsList from '../components/FavoritePetsList';
import NewlyAddedPets from '../components/NewlyAddedPets';

export default function FavoritePetsPage() {
  const {
    likedPets = [],
    likePet,
    unlikePet,
    unlikedPetsUpdated,
  } = useFavoritePetsContext();

  const [likedPetsUpdated, setLikedPetsUpdated] = useState(false);

  useEffect(() => {
    setLikedPetsUpdated(unlikedPetsUpdated);
  }, [unlikedPetsUpdated]);

  return (
    <div
      className="fav-pets-page-container"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        padding: 4,
        pt: 12,
        backgroundImage:
          'url("https://res.cloudinary.com/nkwjho4xf/image/upload/v1741191743/pet-adoption/2150747649_mg03mc.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="start"
        alignItems="center"
      >
        <Grid item xs={12} sm={12} md={12}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                flexWrap: 'wrap',
              }}
            >
              {likedPets.length > 0 ? (
                <>
                  <FavoritePetsList
                    cssClass="liked"
                    pets={likedPets}
                    onLike={likePet}
                    onUnlike={unlikePet}
                    likedPets={likedPets}
                  />
                </>
              ) : (
                <>
                  <NewlyAddedPets />
                  <Typography
                    variant="body2"
                    color="var(--light)"
                    sx={{ textAlign: 'center', marginTop: 2 }}
                  >
                    You haven't added any favorite pets yet. Browse recently added pets.
                  </Typography>
                </>
              )}
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </div>
  );
}

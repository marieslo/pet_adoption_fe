import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import PetCard from './PetCard';

export default function SearchResults({ petsData, loading, error }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4, color: 'red' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!petsData || petsData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
        <Typography color="textSecondary">No pets found</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ justifyContent: 'center', width: '100%' }}>
      {petsData.map((pet, index) => (
        <Grid 
          item 
          xs={12}
          sm={6}
          md={4}
          key={index}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Box
            sx={{
              minWidth: '200px',
              minHeight: '300px',
              width: '100%',
              height: 'auto',
            }}
          >
            <PetCard pet={pet} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
import React from 'react';
import { Box, Grid } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import PostFeed from '../components/PostFeed';
import ClarifyingText from '../components/ClarifyingText';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Box
      className="home-page-container">
      <Box sx={{ mb: 4 }}>
  <ClarifyingText
    text={`Welcome, ${user.firstName}! You can ask or share something about a specific pet, clarify breed details, or talk about anything else on your mind.`}
  />
</Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', paddingBottom: '20px' }}>
            <PostFeed />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

import React from 'react';
import { Box, Grid } from '@mui/material';
import PostFeed from '../components/PostFeed';


export default function HomePage() {

  return (
    <Box
      className="home-page-container">
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

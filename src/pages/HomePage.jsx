import React from 'react';
import { Box } from '@mui/material';
import PostFeed from '../components/PostFeed';

export default function HomePage() {
  return (
    <Box
      className="home-page-container"
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <PostFeed />
    </Box>
  );
}

import React from 'react';
import { Box } from '@mui/material';
import PostFeed from '../components/PostFeed';

export default function HomePage() {
  return (
    <Box
      className="home-page-container"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'start',
        gap: 2,
        width: '100%', 
        height: '100%',
      }}
    >
      <PostFeed />
    </Box>
  );
}

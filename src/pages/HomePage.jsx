import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import PostFeed from '../components/PostFeed';
import AdoptablePetsFeed from '../components/AdoptablePetsFeed';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Box
      className="home-page-container"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        padding: 3,
        pt: 12,
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          {user && (
                <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  marginLeft: '10%',
                }}
              >
                <Typography
                  fontSize='20px'
                  fontWeight={600}
                  sx={{ fontFamily: 'var(--font-body)', color: 'var(--accent)', margin: 4}}
                >
                  Glad to see you here, {user.firstName}!<br />
                  Transform your life,<br />
                  adopt a furry friend today!<br />
                </Typography>
              </Box>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <AdoptablePetsFeed />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <PostFeed />
        </Grid>
      </Grid>
    </Box>
  );
}
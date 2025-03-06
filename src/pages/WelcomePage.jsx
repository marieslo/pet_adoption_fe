import React from 'react';
import { Box, Container } from '@mui/material';
import AboutUs from '../components/AboutUs';
import AdoptablePetsFeed from '../components/AdoptablePetsFeed';


export default function WelcomePage() {
  return (
    <Box
      className="welcome-page-container"
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
      <Container maxWidth="lg" sx={{ flex: 1, marginTop: 8 }}> 
        <AboutUs />
      </Container>
      <Container maxWidth="lg" sx={{ flex: 1, marginTop: 8, marginBottom: 6 }}>
        <AdoptablePetsFeed />
      </Container>
    </Box>
  );
}

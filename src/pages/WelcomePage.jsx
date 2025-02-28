import React from 'react';
import { Box, Container} from '@mui/material';
import AboutUs from '../components/AboutUs';
import AdoptablePetsFeed from '../components/AdoptablePetsFeed';

export default function WelcomePage() {


  return (
    <Box
      className="welcome-page-container">
      <Container maxWidth="lg">
            <AboutUs />
            <AdoptablePetsFeed />
      </Container>
    </Box>
  );
}

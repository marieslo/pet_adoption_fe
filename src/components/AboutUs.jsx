import React from 'react';
import { Box, Typography } from '@mui/material';

export default function AboutUs() {
  return (
    <Box
      className="welcome-text"
      sx={{
        position: 'absolute',
        top: '12%',
        left: '5%',
        zIndex: 1,
        width: '80%',
        textAlign: 'center',
        fontFamily: 'var(--font-header)',
        color: 'var(--primary)',
        fontSize: { xs: '1rem', sm: '1.2rem', lg: '1.5rem' },
        lineHeight: 1.5,
        letterSpacing: '-1px',
        '@media (max-width: 1024px)': { top: '15%' },
        '@media (max-width: 768px)': { top: '18%' },
        '@media (max-width: 480px)': { top: '20%' },
      }}
    >
      <Typography variant="body1">Are you planning to adopt a pet?</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        We have dogs, cats, and other
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        pets patiently waiting for
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        a loving home in need
      </Typography>
    </Box>
  );
}

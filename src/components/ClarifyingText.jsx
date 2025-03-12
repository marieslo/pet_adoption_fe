import React from 'react';
import { Typography, Box } from '@mui/material';

export default function ClarifyingText({ text }) {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'var(--accent-color)',
        color: '#fff',
        padding: '20px 30px',
        textAlign: 'center',
        borderRadius: '8px',
        margin: '20px 0',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -5,
          left: -5,
          right: -5,
          bottom: -5,
          background: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%23ffffff" d="M0,160L30,154.7C60,149,120,139,180,138.7C240,138,300,149,360,144C420,139,480,128,540,133.3C600,138,660,160,720,160C780,160,840,138,900,128C960,117,1020,128,1080,144C1140,160,1200,181,1260,186.7C1320,192,1380,181,1410,170.7L1440,160V0H1410C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z%22/%3E%3C/svg%3E') no-repeat center`,
          backgroundSize: 'cover',
          zIndex: -1,
          transform: 'scale(1.1)',
        },
      }}
    >
      <Typography variant="body2" sx={{ zIndex: 1 }}>
        {text}
      </Typography>
    </Box>
  );
}

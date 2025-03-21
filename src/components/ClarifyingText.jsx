import React from 'react';
import { Typography, Box } from '@mui/material';

export default function ClarifyingText({ text }) {
  return (
    <Box
      sx={{
        border: '1px solid var(--accent)',
        padding: '8px',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '30px',
        backgroundColor: 'rgb(231, 216, 216)',
        opacity: 0.5,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '3px',
          left: '3px',
          right: '3px',
          bottom: '3px',
          border: '2px solid var(--accent)',
          borderRadius: '28px',
        },
      }}
    >
      <Typography variant="body2" sx={{ position: 'relative', zIndex: 1, padding: 2 }}>
        {text}
      </Typography>
    </Box>
  );
}

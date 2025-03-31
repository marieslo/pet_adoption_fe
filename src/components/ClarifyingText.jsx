import React from 'react';
import { Typography, Box } from '@mui/material';

export default function ClarifyingText({ text }) {
  return (
    <Box sx={{ width: '250px' }}>
       <Typography variant="body2" color="var(--light)">
        {text}
      </Typography>
    </Box>
  );
}

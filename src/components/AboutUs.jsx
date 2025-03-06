import React from 'react';
import { Box, Typography } from '@mui/joy';

export default function AboutUs() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        marginLeft: '10%',
        marginTop: '100px'
      }}
    >
      <Typography
        fontSize='20px'
        fontWeight={600}
        sx={{ fontFamily: 'var(--font-body)', color: 'var(--accent)' }}
      >
        Are you planning to adopt a pet?<br />
        We have dogs, cats, and other pets<br />
        patiently waiting for a loving home.<br />
        Find your new best friend today!
      </Typography>
    </Box>
  );
}

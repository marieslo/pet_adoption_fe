import React from 'react';
import { Box} from '@mui/joy';
import ClarifyingText from './ClarifyingText';

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
      <ClarifyingText text=" Are you planning to adopt a pet? We have dogs, cats, and other pets. patiently waiting for a loving home. Find your new best friend today!" />
    </Box>
  );
}

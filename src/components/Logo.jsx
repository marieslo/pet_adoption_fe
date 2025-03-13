import React from 'react';
import { Box, Typography } from '@mui/joy';
import { Pets as PetsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Logo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Typography
        sx={{
          fontSize: '1.4rem',
          color: 'var(--accent)',
          fontFamily: 'var(--font-logo)',
          marginTop: 1,
          textTransform: 'none',
          display: 'flex',
          justifyContent: 'center',
          letterSpacing: '-1px'
        }}
      >
        Purrfect
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PetsIcon sx={{ fontSize: '1.2rem', color: 'var(--accent)', marginLeft: 1, transform: 'rotate(-15deg)' }} />
        <PetsIcon sx={{ fontSize: '1.2rem', color: 'var(--accent)', marginLeft: 1, transform: 'rotate(15deg)' }} />
        <Typography
          sx={{
            fontSize: '1.4rem',
            color: 'var(--accent)',
            fontFamily: 'var(--font-logo)',
            marginLeft: 1,
            textTransform: 'none',
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '-1px'
          }}
        >
          Pals
        </Typography>
      </Box>
    </Box>
  );
}

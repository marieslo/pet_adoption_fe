import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { darken } from '@mui/system';

export default function CustomButton({ text, color, isLoading, ...props }) {
  
  return (
    <Button
      {...props}
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: color,
        '&:hover': { backgroundColor: darken(color, 0.1) },
        padding: '12px',
        fontWeight: 'bold',
        marginTop: '16px',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoading ? (
        <CircularProgress size={24} sx={{ color: 'white' }} />
      ) : (
        text
      )}
    </Button>
  );
}

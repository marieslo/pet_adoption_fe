import React from 'react';
import { Button, Box } from '@mui/material';

export default function SearchResetButton({ onClick }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Button
        onClick={onClick}
        variant="outlined"
        color="primary"
        sx={{
          marginBottom: 3,
          borderRadius: 'var(--border-radius)',
          borderColor: 'var(--accent)',
          color: 'var(--accent)',
          '&:hover': {
            borderColor: 'var(--accent)',
            backgroundColor: 'var(--light)',
          },
        }}
      >
        Reset
      </Button>
    </Box>
  );
}
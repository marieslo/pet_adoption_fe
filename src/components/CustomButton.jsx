import React from 'react';
import { Button, CircularProgress } from '@mui/material';

export default function CustomButton({ text, color, isLoading, ...props }) {
  const buttonColor = color || 'var(--accent)';
  const primaryColor = 'var(--primary)';

  return (
    <Button
      {...props}
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: primaryColor,
        borderRadius: 'var(--border-radius)',
        fontFamily: 'var(--font-body)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        textTransform: 'uppercase',
        border: `1px solid ${buttonColor}`,
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: 1
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '-6px',
          left: '-6px',
          right: '-6px',
          bottom: '-6px',
          border: `1px solid ${buttonColor}`,
          borderRadius: 'var(--border-radius)',
        }}
      />
      {isLoading ? (
        <CircularProgress size={24} sx={{ color: 'white' }} />
      ) : (
        text
      )}
    </Button>
  );
}
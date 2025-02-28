import React from 'react';
import { TextField } from '@mui/material';

export default function CustomInput ({ label, name, value, onChange, type = 'text', required = false, error = '', sx = {} }) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      fullWidth
      required={required}
      variant="outlined"
      margin="normal"
      error={!!error}
      sx={{
        input: { color: 'text.primary', padding: '8px 12px', textAlign: 'left', fontSize: '14px' },
        borderRadius: '25px',
        '& .MuiInputLabel-root': {
          fontSize: '12px',
          color: '#FF3FA4',
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '25px',
          '& fieldset': {
            borderColor: '#FF3FA4',
          },
          '&:hover fieldset': {
            borderColor: '#FF3FA4',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#FF3FA4',
          },
        },
        ...sx,
      }}
    />
  );
};

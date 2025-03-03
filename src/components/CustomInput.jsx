import React from 'react';
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const getCssVariable = (variable) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

const theme = createTheme({
  palette: {
    primary: {
      main: getCssVariable('--accent') || getCssVariable('--primary') || '#a72d66',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-radius': 'var(--border-radius)',
          '--TextField-height': '50px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--TextField-radius)',
            height: 'var(--TextField-height)',
            display: 'flex',
            alignItems: 'center',
            padding: '0',
          },
          '& .MuiOutlinedInput-input': {
            padding: '10px 12px',
            fontSize: '14px',
            textAlign: 'left',
            lineHeight: 'normal',
            alignItems: 'center',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: getCssVariable('--accent') || getCssVariable('--primary') || '#a72d66',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: getCssVariable('--accent') || getCssVariable('--primary') || '#a72d66',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: getCssVariable('--accent') || getCssVariable('--primary') || '#a72d66',
          },
          '& label.Mui-focused': {
            color: getCssVariable('--accent') || getCssVariable('--primary') || '#a72d66',
          },
          '& label': {
            fontSize: '14px',
          },
          '& input::placeholder': {
            fontSize: '16px',
            textAlign: 'center',
          },
        },
      },
    },
  },
});

export default function CustomInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  helperText,
}) {
  return (
    <ThemeProvider theme={theme}>
      <TextField
        fullWidth
        label={label}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        sx={{ mb: 1 }}
        error={error}
        helperText={helperText}
      />
    </ThemeProvider>
  );
}
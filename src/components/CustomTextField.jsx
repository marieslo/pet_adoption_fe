import React from 'react';
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const getCssVariable = (variable) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};


const theme = createTheme({
  palette: {
    primary: {
      main: getCssVariable('--accent') || '#aa0647',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-radius': 'var(--border-radius)',
          '--TextField-height': '40px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--TextField-radius)',
            height: 'var(--TextField-height)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: getCssVariable('--accent') || '#aa0647',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: getCssVariable('--accent') || '#aa0647',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: getCssVariable('--accent') || '#aa0647',
          },
          '& label.Mui-focused': {
            color: getCssVariable('--accent') || '#aa0647',
          },
        },
      },
    },
  },
});

export default function CustomTextField ({ label, name, value, onChange, type = 'text', placeholder }) {
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
        sx={{ mb: 2 }}
      />
    </ThemeProvider>
  );
};

import React from 'react';
import { Select, MenuItem, Slider, Box, Typography } from '@mui/material';

export default function SearchFilters({ filters, onFilterChange }) {
  return (
    <Box sx={{ mt: 3 }}>
    <Select
        fullWidth
        value={filters.type || ''}
        onChange={(e) => onFilterChange('type', e.target.value)}
        displayEmpty
        sx={{
            mt: 2,
            mb: 2,
            borderRadius: 'var(--border-radius)',
            fontSize: '1rem',
            height: 40,
            padding: '6px',
        }}
        >
        <MenuItem value="" disabled>
            All Types
        </MenuItem>
        <MenuItem value="dog">Dog</MenuItem>
        <MenuItem value="cat">Cat</MenuItem>
        <MenuItem value="other">Other</MenuItem>
        </Select>
      <Slider
        value={filters.weightMin}
        onChange={(e, newValue) => onFilterChange('weightMin', newValue)}
        min={0}
        max={100}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value} kg`}
        sx={{
          mt: 2,
          '& .MuiSlider-rail': {
            backgroundColor: 'var(--secondary)',
          },
          '& .MuiSlider-track': {
            backgroundColor: 'var(--accent)',
          },
          '& .MuiSlider-thumb': {
            backgroundColor: 'var(--accent)',
            '&:hover': {
              backgroundColor: 'darken(var(--accent), 10%)',
            },
          },
        }}
      />
      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.9rem', color: 'var(--dark)' }}>
        Weight: {filters.weightMin} kg
      </Typography>
      <Slider
        value={filters.heightMin}
        onChange={(e, newValue) => onFilterChange('heightMin', newValue)}
        min={0}
        max={100}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value} cm`}
        sx={{
          mt: 2,
          '& .MuiSlider-rail': {
            backgroundColor: 'var(--secondary)',
          },
          '& .MuiSlider-track': {
            backgroundColor: 'var(--accent)',
          },
          '& .MuiSlider-thumb': {
            backgroundColor: 'var(--accent)',
            '&:hover': {
              backgroundColor: 'darken(var(--accent), 10%)',
            },
          },
        }}
      />
      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.9rem', color: 'var(--dark)' }}>
        Height: {filters.heightMin} cm
      </Typography>
    </Box>
  );
}
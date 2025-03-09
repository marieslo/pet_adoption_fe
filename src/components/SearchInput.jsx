import React from 'react';
import { InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function CustomSearchInput({ value, onChange, placeholder }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        border: '1px solid #ccc',
        borderRadius: 'var(--border-radius)',
        transition: 'border-color 0.3s, color 0.3s',
        height: '40px',
      }}
    >
      <InputAdornment position="start" style={{ marginRight: '8px', color: 'var(--accent)' }}>
        <SearchIcon />
      </InputAdornment>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          fontSize: '1rem',
          backgroundColor: 'transparent',
          padding: '8px 0',
          color: 'var(--accent)',
          transition: 'border-color 0.3s, color 0.3s',
        }}
      />
    </div>
  );
}
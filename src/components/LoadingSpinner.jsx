import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function  LoadingSpinner () {
  return (
    <div className="flex justify-center items-center h-screen">
      <CircularProgress />
    </div>
  );
};


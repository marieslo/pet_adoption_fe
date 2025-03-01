import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton } from '@mui/material';
import { Delete, Person } from '@mui/icons-material';
import { blue } from '@mui/material/colors';

export default function PhotoUpload({ photo, onPhotoChange }) {
  const [isSkipping, setIsSkipping] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      onPhotoChange(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }, [onPhotoChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
  });

  const handleSkip = () => {
    setIsSkipping(true);
    onPhotoChange(null);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Profile Photo
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed var(--accent)',
          borderRadius: 'var(--border-radius)',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'var(--light)' : 'transparent',
          transition: 'background-color 0.2s',
        }}
      >
        <input {...getInputProps()} />
        {photo ? (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={photo}
              alt="Profile Preview"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
            <IconButton
              onClick={() => onPhotoChange('')}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'var(--light)',
                '&:hover': {
                  backgroundColor: 'var(--accent)',
                  color: 'var(--light)',
                },
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        ) : isSkipping ? (
          <Box
            sx={{
              width: '150px',
              height: '150px',
              backgroundColor: blue[300], 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Person sx={{ fontSize: 50, color: 'white' }} />
          </Box>
        ) : (
          <Typography>
            {isDragActive
              ? 'Drop the photo here...'
              : 'Drag & drop a photo, or click to select'}
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: 1 }}>
        <button onClick={handleSkip} style={{ padding: '10px', cursor: 'pointer' }}>
          Skip
        </button>
      </Box>
    </Box>
  );
}
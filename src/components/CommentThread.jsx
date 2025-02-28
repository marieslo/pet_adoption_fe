import React from 'react';
import { Box, Typography } from '@mui/material';

export default function CommentThread({ comments }) {
  if (!comments || comments.length === 0) return null;

  return (
    <Box marginTop={2} sx={{ backgroundColor: 'var(--secondary)', padding: '1rem', borderRadius: 'var(--border-radius)' }}>
      <Typography variant="h6" sx={{ marginBottom: 1, fontFamily: 'var(--font-header)', color: 'var(--accent)' }}>Comments:</Typography>
      {comments.map((comment, index) => (
        <Box key={index} sx={{ marginBottom: 1, borderBottom: '1px solid var(--primary)' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--dark)' }}>
            {comment.user.firstName} {comment.user.lastName}:
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--light)' }}>{comment.text}</Typography>
        </Box>
      ))}
    </Box>
  );
}
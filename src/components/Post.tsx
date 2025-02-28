import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Avatar, IconButton, TextField } from '@mui/material';
import { ThumbUp, Favorite, SentimentVerySatisfied, EmojiEvents } from '@mui/icons-material';
import { motion } from 'framer-motion';
import CommentThread from './CommentThread';

export default function Post({ post, onReaction }) {
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleToggleCommentInput = () => {
    setShowCommentInput((prevState) => !prevState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{
        borderRadius: 'var(--border-radius)',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        },
        backgroundColor: 'var(--light)',
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Avatar sx={{ marginRight: 2, width: 40, height: 40 }} src={post.user.profileImage} alt={post.user.firstName} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--dark)' }}>
              {post.user.firstName} {post.user.lastName}
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'var(--dark)' }}>
            {post.content}
          </Typography>
          {post.image && (
            <Box marginBottom={2}>
              <img src={post.image} alt="Post" style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} />
            </Box>
          )}
          <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
            <Typography variant="subtitle2" sx={{ color: 'var(--dark)' }}>Tags: </Typography>
            {post.tags.map((tag, index) => (
              <Chip key={index} label={tag} color="primary" size="small" sx={{ marginBottom: 1 }} />
            ))}
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            <strong>Reactions:</strong> {post.reactions.length}
          </Typography>
          <Box display="flex" gap={2} marginTop={2}>
            <IconButton onClick={() => onReaction(post._id, 'Like')} color="primary">
              <ThumbUp />
            </IconButton>
            <IconButton onClick={() => onReaction(post._id, 'Love')} color="secondary">
              <Favorite />
            </IconButton>
            <IconButton onClick={() => onReaction(post._id, 'Laugh')} color="warning">
              <SentimentVerySatisfied />
            </IconButton>
            <IconButton onClick={() => onReaction(post._id, 'Celebrate')} color="info">
              <EmojiEvents />
            </IconButton>
          </Box>
          <Box marginTop={2}>
            <button 
              onClick={handleToggleCommentInput} 
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}>
              {showCommentInput ? 'Cancel' : 'Add Comment'}
            </button>
            {showCommentInput && (
              <Box marginTop={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Write a comment..."
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                />
                <button 
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                  }}>
                  Submit Comment
                </button>
              </Box>
            )}
          </Box>
          <CommentThread comments={post.comments} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
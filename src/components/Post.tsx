import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThumbUp, Comment, Delete, Edit } from "@mui/icons-material";
import { Box, Typography, IconButton, Textarea, Divider, Avatar } from '@mui/joy';
import CustomButton from "./CustomButton";
import CommentThread from "./CommentThread";
import moment from "moment";

export default function Post({ post, onReaction, onDelete, onEdit }) {
  const [showCommentInput, setShowCommentInput] = useState(false);


  const handleDelete = () => {
    onDelete(post._id);
  };


  const formattedDate = (date) => {
    return moment(date).format('DD MMM YYYY, HH:mm');
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    style={{
      width: '100%',
      maxWidth: '600px',
      margin: 'auto',
      backgroundColor: 'white',
      border: '1px solid #e1e1e1',
      borderRadius: 'var(--border-radius)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, padding: 2, backgroundColor: 'var(--secondary)', borderBottom: '1px solid #e1e1e1' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Avatar src={post.user.avatar || undefined}>
      {!post.user.avatar && post.user.firstName
        ? post.user.firstName.slice(0, 2).toUpperCase()
        : 'PL'}
    </Avatar>
    <Typography sx={{ color: 'var(--dark)', fontWeight: 'bold' }}>
      {post.user.firstName}
    </Typography>
  </Box>

  <Box sx={{ textAlign: 'right' }}>
    <Typography sx={{ color: 'var(--dark)', fontSize: '0.875rem' }}>
      {formattedDate(post.createdAt)}{post.updatedAt && ` (Updated: ${formattedDate(post.updatedAt)})`}
    </Typography>
  </Box>
      </Box>

      <Box sx={{ padding: 2 }}>
        <Typography sx={{ backgroundColor: 'var(--light', color: 'var(--dark)', fontSize: '1rem' }}>
          {post.content}
        </Typography>
        {post.image && (
          <Box sx={{ mt: 2 }}>
            <img
              src={post.image}
              alt="Post"
              style={{ width: '30%', borderRadius: 'var(--border-radius)', objectFit: 'cover', border: '1px solid #e1e1e1' }}
            />
          </Box>
        )}
        {showCommentInput && (
          <Box sx={{ mt: 2 }}>
            <Textarea
              minRows={3}
              placeholder="Write a comment..."
              sx={{
                width: '100%',
                padding: 1.5,
                borderRadius: 'var(--border-radius)',
                border: '1px solid #e1e1e1',
                backgroundColor: 'var(--light)',
                '&:focus': { borderColor: 'var(--primary)', outline: 'none' },
                fontFamily: 'var(--font-body)',
                color: 'var(--dark)',
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <CustomButton
                text="Cancel"
                isLoading={false} 
                onClick={() => setShowCommentInput(false)}
                color="var(--accent)"
                sx={{
                  '&:hover': { backgroundColor: 'var(--accent-dark)' },
                  borderRadius: 'var(--border-radius)',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  padding: '4px 8px',
                }}
              />
              <CustomButton
                text="Submit"
                isLoading={false}
                onClick={() => {}}
                color="var(--primary)"
                sx={{
                  '&:hover': { backgroundColor: 'var(--accent)' },
                  borderRadius: 'var(--border-radius)',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  padding: '4px 8px',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: '#e1e1e1' }} />
      <Box sx={{ padding: 1, backgroundColor: 'var(--secondary)', display: 'flex', justifyContent: 'end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => onReaction(post._id, "Like")} sx={{ color: 'var(--dark)', '&:hover': { color: 'var(--accent)' } }}>
            <ThumbUp sx={{ fontSize: 20, marginRight: 1 }} />
            <Typography sx={{ color: 'var(--dark)' }}>{post.reactions.length}</Typography>
          </IconButton>

          <IconButton onClick={() => setShowCommentInput(!showCommentInput)} sx={{ color: 'var(--dark)', '&:hover': { color: 'var(--accent)'} }}>
            <Comment sx={{ fontSize: 20 }} />
          </IconButton>

          {post.user._id === post.user._id && (
            <>
              <IconButton onClick={handleDelete} sx={{ color: 'var(--dark)', '&:hover': { color: 'var(--accent)'} }}>
                <Delete sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton onClick={onEdit} sx={{ color: 'var(--dark)', '&:hover': { color: 'var(--accent)'} }}>
                <Edit sx={{ fontSize: 20 }} />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
      <CommentThread comments={post.comments} />
    </motion.div>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThumbUp, Comment} from "@mui/icons-material";
import { Box, Typography, IconButton, Textarea, Divider } from '@mui/joy';
import CustomButton from "./CustomButton";
import CommentThread from "./CommentThread";

export default function Post({ post, onReaction }) {
  const [showCommentInput, setShowCommentInput] = useState(false);

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: 2, backgroundColor: 'var(--light)', borderBottom: '1px solid #e1e1e1' }}>
        <img
          src={post.user.profileImage || "/default-avatar.png"}
          alt={post.user.firstName}
          style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <Typography sx={{ color: 'var(--dark)', fontWeight: 'bold' }}>
            {post.user.firstName} {post.user.lastName}
          </Typography>
          <Typography sx={{ color: 'var(--dark)' }}>
            {post.timestamp}
          </Typography>
        </div>
      </Box>


      <Box sx={{ padding: 2 }}>
        <Typography sx={{ color: 'var(--dark)', fontSize: '1rem' }}>
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
      <Box sx={{ padding: 2, backgroundColor: '#f7f7f7',  display: 'flex', justifyContent: 'end',  }}>

        {/* Reactions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <IconButton onClick={() => onReaction(post._id, "Like")} sx={{ color: 'var(--dark)', '&:hover': { color: 'var(--primary)' } }}>
            <ThumbUp sx={{ fontSize: 20}} />
            <Typography sx={{ color: 'var(--dark)' }}>{post.reactions.length}</Typography>
          </IconButton>

          {/* Comment Icon - toggles the comment input */}
          <IconButton onClick={() => setShowCommentInput(!showCommentInput)} sx={{ color: 'var(--dark)', '&:hover': { color: 'blue' } }}>
            <Comment sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <CommentThread comments={post.comments} />
      </Box>
    </motion.div>
  );
}

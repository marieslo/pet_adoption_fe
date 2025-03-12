import React, { useState } from "react";
import { Comment } from "@mui/icons-material";
import { Box, Typography, IconButton, Textarea, Avatar } from '@mui/joy';
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import CustomButton from './CustomButton';
import { useAuth } from "../context/AuthProvider";

const formattedDate = (date) => {
  return moment(date).isValid() ? moment(date).format('DD MMM YYYY, HH:mm') : 'Invalid date';
};

export default function CommentSection({ post, onComment }) {
    const { user } = useAuth();
    const [commentContent, setCommentContent] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);
  
    const handleAddComment = () => {
      if (commentContent.trim()) {
        const comment = {
          user: user,
          content: commentContent,
          createdAt: new Date().toISOString(), 
        };
        
        onComment(post._id, comment);
        setCommentContent('');
        setShowCommentInput(false);
      }
    };
  
    return (
      <Box sx={{ padding: 2 }}>
        <IconButton onClick={() => setShowCommentInput(!showCommentInput)}>
          <Comment color="action" />
        </IconButton>
        {showCommentInput && (
          <Box>
            <Textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              sx={{ width: '100%', padding: 2, borderRadius: 'var(--border-radius)', border: '1px solid #e1e1e1', fontSize: '0.875rem' }}
            />
            <CustomButton text="Post Comment" onClick={handleAddComment} isLoading={false} sx={{ fontSize: '0.8rem', marginTop: 1 }} />
          </Box>
        )}
        <Box sx={{ marginTop: 2 }}>
          {post.comments.map((comment) => (
            <Box key={`${comment._id || uuidv4()}-${comment.createdAt}`} sx={{ marginBottom: 1, padding: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f7f7f7' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={comment.user?.avatar || undefined}>
                  {!comment.user?.avatar && comment.user?.firstName ? comment.user.firstName.slice(0, 2).toUpperCase() : 'U'}
                </Avatar>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {comment.user?.firstName || 'Anonymous'}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{formattedDate(comment.createdAt)}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', marginTop: 1 }}>{comment.content}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
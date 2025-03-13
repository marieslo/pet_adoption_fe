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
  const [comments, setComments] = useState(post.comments);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleAddComment = () => {
    if (commentContent.trim()) {
      const newComment = {
        _id: uuidv4(),
        content: commentContent,
        createdAt: new Date(),
        user: {
          avatar: user?.avatar || "",
          firstName: user?.firstName || "Anonymous",
        },
      };
      onComment(post._id, commentContent);
      setComments((prevComments) => [newComment, ...prevComments]);
      setCommentContent('');
      setShowCommentInput(false);
    }
  };

  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const commentsToShow = showAllComments ? sortedComments : sortedComments.slice(0, 3);

  const toggleComments = () => {
    setShowAllComments((prev) => !prev);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <IconButton onClick={() => setShowCommentInput(!showCommentInput)}>
          <Comment color="action" /> Add a comment
        </IconButton>
        <Typography variant="body2">{comments.length} Comments</Typography>
      </Box>

      {showCommentInput && (
        <Box sx={{ marginTop: 2 }}>
          <Textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            sx={{
              width: '100%',
              padding: 2,
              borderRadius: 'var(--border-radius)',
              border: '1px solid #e1e1e1',
              fontSize: '0.875rem',
            }}
          />
          <CustomButton
            text="Post Comment"
            onClick={handleAddComment}
            isLoading={false}
            sx={{ fontSize: '0.8rem', marginTop: 1 }}
          />
        </Box>
      )}

      <Box sx={{ marginTop: 2 }}>
        {commentsToShow.map((comment) => (
          <Box
            key={`${comment._id || uuidv4()}-${comment.createdAt}`}
            sx={{
              marginBottom: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={comment.user?.avatar || undefined}
                  sx={{ fontSize: '0.9rem', bgcolor: '#ccc' }}
                >
                  {!comment.user?.avatar && comment.user?.firstName
                    ? comment.user.firstName.slice(0, 2).toUpperCase()
                    : 'U'}
                </Avatar>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {comment.user?.firstName || 'Anonymous'}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                padding: 2,
                maxWidth: '80%',
                wordWrap: 'break-word',
                backgroundColor: 'rgb(239, 238, 238)',
                borderRadius: '30px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '-10px',
                  transform: 'translateY(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid rgb(239, 238, 238)',
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: 'text.secondary',
                  marginBottom: 1,
                }}
              >
                {formattedDate(comment.createdAt)}
              </Typography>

              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>
                {comment.content}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {comments.length > 3 && !showAllComments && (
        <Typography
          onClick={toggleComments}
          sx={{
            marginTop: 2,
            fontSize: '0.75rem',
            color: 'var(--accent)',
            textDecoration: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          show more comments
        </Typography>
      )}

      {showAllComments && comments.length > 3 && (
        <Typography
          onClick={toggleComments}
          sx={{
            marginTop: 2,
            fontSize: '0.75rem',
            color: 'var(--accent)',
            textDecoration: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          hide comments
        </Typography>
      )}
    </Box>
  );
}
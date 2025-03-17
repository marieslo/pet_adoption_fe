import React, { useState } from "react";
import { Comment, ThumbUp } from "@mui/icons-material";
import { Box, Typography, IconButton, Textarea, Avatar } from '@mui/joy';
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import CustomButton from './CustomButton';
import { useAuth } from "../context/AuthProvider";

const formattedDate = (date) => {
  return moment(date).isValid() ? moment(date).format('DD MMM YYYY, HH:mm') : 'Invalid date';
};

export default function CommentSection({ post, onComment, onReact }) {
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

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


  const userReaction = post.reactions?.find(
    (reaction) => reaction.user && reaction.user._id && reaction.user._id.toString() === user?._id
  );

  const handleReact = (type) => {
    onReact(post._id, type);
  };

  return (
    <Box sx={{ padding: 1 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'end' }}>
        <IconButton onClick={() => setShowCommentInput(!showCommentInput)}>
          <Comment color="action" sx={{ fontSize: 16 }} />
        </IconButton>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {comments.length} comment{comments.length !== 1 && 's'}
        </Typography>
        <IconButton
          onClick={() => handleReact(userReaction ? null : "like")}
        >
          <ThumbUp sx={{ fontSize: 16, color: userReaction ? "primary.main" : "action.active" }} />
        </IconButton>
        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {post.reactions?.length || 0} reaction{post.reactions?.length !== 1 && 's'}
        </Typography>
      </Box>
      {showCommentInput && (
        <Box sx={{ marginTop: 2 }}>
          <Textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Share your thoughts here"
            sx={{
              width: '100%',
              padding: 2,
              borderRadius: 'var(--border-radius)',
              border: '1px solid #e1e1e1',
              fontSize: '0.875rem',
            }}
          />
          <CustomButton
            text="Add comment"
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
              <Avatar
                src={comment.user?.avatar || undefined}
                sx={{ fontSize: '0.9rem', bgcolor: '#ccc' }}
              >
                {!comment.user?.avatar && comment.user?.firstName
                  ? comment.user.firstName.slice(0, 2).toUpperCase()
                  : 'Pet Lover'}
              </Avatar>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                {comment.user?.firstName || 'Anonymous'}
              </Typography>
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CustomButton
            text="Show more"
            onClick={toggleComments}
            isLoading={false}
            sx={{ fontSize: '0.8rem', marginTop: 2 }}
          />
        </Box>
      )}

      {comments.length > 3 && showAllComments && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CustomButton
            text="Show less"
            onClick={toggleComments}
            isLoading={false}
            sx={{ fontSize: '0.8rem', marginTop: 2 }}
          />
        </Box>
      )}
    </Box>
  );
}
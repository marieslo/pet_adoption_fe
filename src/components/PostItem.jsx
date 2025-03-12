import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbUp, Comment, Delete, Edit } from "@mui/icons-material";
import { Box, Typography, IconButton, Textarea, Button, Avatar } from '@mui/joy';
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";  
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import CustomButton from './CustomButton';

const formattedDate = (date) => {
  return moment(date).isValid() ? moment(date).format('DD MMM YYYY, HH:mm') : 'Invalid date';
};

export default function PostItem({ post, onDelete, onEdit, onReact, onComment }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [commentContent, setCommentContent] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [petData, setPetData] = useState(post.pet ? {
    name: post.pet.name,
    picture: post.pet.picture ? post.pet.picture.trim() : '',
  } : null);

  useEffect(() => {
    if (post.pet && post.pet.name) {
      setPetData({
        name: post.pet.name,
        picture: post.pet.picture ? post.pet.picture.trim() : '',
      });
    }
  }, [post.pet]);

  const isPostOwner = user && user._id === post.user._id;

  const handleSaveEdit = () => {
    if (editedContent.trim() !== post.content) {
      onEdit(post._id, editedContent);
    }
    setIsEditing(false);
  };

  const userReaction = post.reactions.find(reaction => reaction.user && reaction.user._id && reaction.user._id.toString() === user?._id);

  const handleReact = (type) => {
    onReact(post._id, type);
  };

  const handleAddComment = () => {
    if (commentContent.trim()) {
      onComment(post._id, commentContent);
      setCommentContent('');
      setShowCommentInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ width: '100%', maxWidth: '600px', margin: 'auto', backgroundColor: 'rgba(217, 200, 187, 0.94)', border: '1px solid #e1e1e1', borderRadius: 'var(--border-radius)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, padding: 1.2, background: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%23ffffff" d="M0,160L30,154.7C60,149,120,139,180,138.7C240,138,300,149,360,144C420,139,480,128,540,133.3C600,138,660,160,720,160C780,160,840,138,900,128C960,117,1020,128,1080,144C1140,160,1200,181,1260,186.7C1320,192,1380,181,1410,170.7L1440,160V0H1410C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z%22/%3E%3C/svg%3E') no-repeat center`, backgroundSize: 'cover' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={post.user.avatar || undefined}>
            {!post.user.avatar && post.user.firstName ? post.user.firstName.slice(0, 2).toUpperCase() : 'Pet Lover'}
          </Avatar>
          <Typography sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
            {post.user.firstName}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.8rem', textAlign: 'right' }}>
          {formattedDate(post.createdAt)}
        </Typography>
      </Box>
      {petData && petData.name && petData.picture && (
        <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={petData.picture || undefined} sx={{ width: 32, height: 32 }} />
          <Link to={`/pets/${post.pet._id}`} style={{ textDecoration: 'none' }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'primary.main' }}>
              {petData.name}
            </Typography>
          </Link>
        </Box>
      )}
      <Box sx={{ padding: 2 }}>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            sx={{
              width: '100%',
              padding: 2,
              borderRadius: 'var(--border-radius)',
              border: '1px solid #e1e1e1',
              fontSize: '1rem',
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}
            minRows={3}
            autoFocus
          />
        ) : (
          <Typography sx={{ fontSize: '1rem', lineHeight: '1.6' }}>{post.content}</Typography>
        )}
      </Box>

      <Box sx={{ padding: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => handleReact(userReaction ? 'dislike' : 'like')}>
            <ThumbUp color={userReaction ? 'primary' : 'action'} />
          </IconButton>

          <Typography>{post.reactions.length}</Typography>
          <IconButton onClick={() => setShowCommentInput(!showCommentInput)}>
            <Comment color="action" />
          </IconButton>
          <Typography>{post.comments.length}</Typography>
        </Box>

        {isPostOwner && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setIsEditing(!isEditing)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(post._id)}>
              <Delete />
            </IconButton>
            {isEditing && (
              <Button onClick={handleSaveEdit} sx={{ fontSize: '0.8rem' }}>Save Edit</Button>
            )}
          </Box>
        )}
      </Box>
      <Box sx={{ padding: 2 }}>
        {showCommentInput && (
          <Box>
            <Textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              sx={{ width: '100%', padding: 2, borderRadius: 'var(--border-radius)', border: '1px solid #e1e1e1', fontSize: '0.875rem' }}
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
          {post.comments.map((comment) => (
            <Box key={`${comment._id || uuidv4()}-${comment.createdAt}`} sx={{ marginBottom: 1, paddingLeft: comment.parentComment ? 4 : 0, backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                {comment.user.firstName}: 
              </Typography>
              <Typography sx={{ fontSize: '0.875rem' }}>
                {comment.content}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}
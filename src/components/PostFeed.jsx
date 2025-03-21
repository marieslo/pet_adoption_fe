import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Switch, FormControlLabel, Skeleton, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import { SERVER_URL } from '../api';
import PostItem from './PostItem';
import PostWriting from './PostWriting';

export default function PostFeed() {
  const { user, authToken, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/posts/feed`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []); 
  

  const handleEditPost = (postId, editedContent) => {
    if (!editedContent.trim()) {
      setSnackbarMessage('Content cannot be empty.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
  
    axios
      .put(
        `${SERVER_URL}/posts/${postId}`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, content: editedContent } : post
          )
        );
        setSnackbarMessage('Post updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error updating post:', error);
        setSnackbarMessage('Error updating post. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleDeletePost = (postId) => {
    if (!postId) return;

    axios.delete(`${SERVER_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then(() => {
      setPosts(posts.filter(post => post._id !== postId));
      setSnackbarMessage('Post deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    })
    .catch(error => {
      console.error('Error deleting post:', error);
      setSnackbarMessage('Error deleting post. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    });
  };

  const handleNewPost = (newPost) => {
    if (!user || !user.firstName) {
      setSnackbarMessage('User information is missing. Please log in again.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    const postWithUserInfo = {
      ...newPost,
      user: {
        _id: user._id,
        firstName: user.firstName,
        avatar: user.avatar,
      },
      pet: newPost.pet,
    };
    setPosts([postWithUserInfo, ...posts]);
    setSnackbarMessage('New post added!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  

  const filteredPosts = showMyPosts ? posts.filter(post => post.user._id === user?._id) : posts;

  const handleReactToPost = (postId, reactionType) => {
    axios
      .post(
        `${SERVER_URL}/posts/${postId}/reactions`,
        { type: reactionType },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      .then((response) => {
        setPosts(posts.map((post) =>
          post._id === postId ? { ...post, reactions: response.data } : post
        ));
      })
      .catch((error) => {
        console.error('Error reacting to post:', error);
      });
  };

  const handleCommentOnPost = (postId, commentContent) => {
    if (typeof commentContent !== 'string' || !commentContent.trim()) {
      setSnackbarMessage('Content cannot be empty.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    axios
      .post(
        `${SERVER_URL}/posts/${postId}/comments`,
        { content: commentContent },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      .then((response) => {
        setPosts(posts.map((post) =>
          post._id === postId ? { ...post, comments: [...post.comments, response.data] } : post
        ));
        setSnackbarMessage('Comment added!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error commenting on post:', error);
        setSnackbarMessage('Error commenting on post. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };
  
  
  if (loading) return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4 }}>
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ marginBottom: 2 }} />
      <Grid container spacing={2} justifyContent="center" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} key={index} sx={{ gridRowEnd: 'span 2', gridColumnEnd: index % 2 === 0 ? 'span 2' : 'span 1' }}>
            <Skeleton variant="rectangular" width="100%" height={200} />
            <Skeleton width="60%" sx={{ marginTop: 1 }} />
            <Skeleton width="40%" sx={{ marginTop: 1 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
  

  return (
    <Box
      className="post-feed-wrapper"
      sx={{
        width: '100%',
        height: 'calc(100vh - 100px)',
        overflowY: 'scroll',
        marginTop: '80px',
        marginBottom: '20px',
        padding: '16px',
        boxSizing: 'border-box',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <Box sx={{ marginTop: 8, marginBottom: 4, maxWidth: '40vh' }}>
        <PostWriting onPostSubmit={handleNewPost} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <FormControlLabel
          sx={{ fontFamily: 'var(--font-body)', color: 'white' }}
          control={<Switch checked={showMyPosts} onChange={() => setShowMyPosts(!showMyPosts)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--accent)' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--accent)' } }} />}
          label={<Typography sx={{ fontFamily: 'var(--font-body)', color: 'white' }}>{showMyPosts ? "Showing My Posts" : "Showing All Posts"}</Typography>}
        />
      </Box>

      <Grid container spacing={2} justifyContent="center" sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {filteredPosts.map((post, index) => (
          <Grid item xs={12} key={post._id} sx={{ gridRowEnd: 'span 2', gridColumnEnd: 'span 1' }} >
            <PostItem post={post} onDelete={handleDeletePost} onEdit={handleEditPost} onReact={handleReactToPost} onComment={handleCommentOnPost} />
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Switch, FormControlLabel } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import { SERVER_URL } from '../api';
import LoadingSpinner from './LoadingSpinner';
import Post from './Post';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';


export default function PostFeed() {
  const { user, authToken, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loadingPost, setLoadingPost] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const [newPostContentForEdit, setNewPostContentForEdit] = useState('');

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

  const handleReaction = (postId, reaction) => {
    if (!user) {
      console.log('User not logged in');
      return;
    }

    axios.post(`${SERVER_URL}/posts/${postId}/reaction`, { reaction })
      .then(response => {
        console.log('Reaction added:', response.data);
      })
      .catch(error => {
        console.error('Error adding reaction:', error);
      });
  };

  const handlePostSubmit = async () => {
    if (!authToken) {
      console.log('Authentication token not found. Please log in.');
      return;
    }
    if (!newPostContent.trim()) {
      console.log('Post content cannot be empty');
      return;
    }
    setLoadingPost(true);
    try {
      const response = await axios.post(
        `${SERVER_URL}/posts/create`,
        { content: newPostContent },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const newPost = {
        ...response.data,
        user: user,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleDeletePost = () => {
    if (postToDelete) {
      axios.delete(`${SERVER_URL}/posts/${postToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then(() => {
        setPosts(posts.filter(post => post._id !== postToDelete._id));
        setOpenDeleteModal(false);
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
    }
  };

  const handleEditPost = async () => {
    if (!authToken || !postToEdit) {
      console.log('Authentication token not found or no post selected for editing.');
      return;
    }
    if (!newPostContentForEdit.trim()) {
      console.log('Post content cannot be empty');
      return;
    }
    try {
      const response = await axios.put(
        `${SERVER_URL}/posts/${postToEdit._id}`,
        { content: newPostContentForEdit },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const updatedPosts = posts.map(post => 
        post._id === postToEdit._id ? { ...post, content: newPostContentForEdit, updatedAt: response.data.updatedAt } : post
      );
      setPosts(updatedPosts);
      setPostToEdit(null);
      setNewPostContentForEdit('');
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleComment = async (postId, commentContent) => {
    if (!authToken) {
      console.log('Authentication token not found. Please log in.');
      return;
    }
    if (!commentContent.trim()) {
      console.log('Comment content cannot be empty');
      return;
    }

    try {
      const response = await axios.post(
        `${SERVER_URL}/posts/${postId}/comment`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const updatedPosts = posts.map((post) =>
        post._id === postId
          ? { ...post, comments: [...post.comments, response.data] }
          : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };


  const filteredPosts = showMyPosts ? posts.filter(post => post.user._id === user?._id) : posts;

  if (loading) return <LoadingSpinner />;

  return (
    <Box className="post-feed-wrapper" sx={{ maxWidth: '80vh', mx: 'auto', mt: 4 }}>
      <Box sx={{ marginTop: 8,  marginBottom: 4, maxWidth: '40vh', }}>
        <CustomInput
          label="What's on your mind?"
          name="newPostContent"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share your thoughts here"
          sx={{
            backgroundColor: 'var(--light)', borderRadius: '8px', color: 'var(--dark)',
            padding: '12px', marginBottom: '16px'
          }}
        />
        <CustomButton
          text={loadingPost ? 'Posting...' : 'Post'}
          color="var(--accent)"
          isLoading={loadingPost}
          onClick={handlePostSubmit}
          sx={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius)' }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <FormControlLabel
          sx={{ fontFamily: 'var(--font-body)', color: 'white' }}
          control={
            <Switch
              checked={showMyPosts}
              onChange={() => setShowMyPosts(!showMyPosts)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'var(--accent)',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'var(--accent)',
                },
              }}
            />
          }
          label={<Typography sx={{ fontFamily: 'var(--font-body)', color: 'white' }}>
            {showMyPosts ? "Showing My Posts" : "Showing All Posts"}
          </Typography>}
        />
      </Box>

      <Grid container spacing={2} justifyContent="center" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <Grid item xs={12} key={post._id} sx={{
              gridRowEnd: 'span 2',
              gridColumnEnd: index % 2 === 0 ? 'span 2' : 'span 1',
            }}>
              <Post post={post} onReaction={handleReaction} onDelete={handleDeletePost} onEdit={handleEditPost} onComment={handleComment} />
            
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            {showMyPosts ? "You haven't posted anything yet." : "No posts available."}
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
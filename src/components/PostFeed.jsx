import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import { SERVER_URL } from '../api';
import LoadingSpinner from './LoadingSpinner';
import Post from './Post';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';

export default function PostFeed() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loadingPost, setLoadingPost] = useState(false);

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
    if (!newPostContent.trim()) {
      console.log('Post content cannot be empty');
      return;
    }

    setLoadingPost(true);
    try {
      const response = await axios.post(`${SERVER_URL}/posts/create`, { content: newPostContent });
      setPosts([response.data, ...posts]); 
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoadingPost(false);
    }
  };

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
        />

        <CustomButton
          text={loadingPost ? 'Posting...' : 'Post'}
          color="var(--primary)"
          isLoading={loadingPost}
          onClick={handlePostSubmit}
        />
      </Box>
      <Grid container spacing={2} justifyContent="center" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Grid item xs={12} key={post._id} sx={{
              gridRowEnd: 'span 2',
              gridColumnEnd: index % 2 === 0 ? 'span 2' : 'span 1',
            }}>
              <Post post={post} onReaction={handleReaction} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No posts available
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

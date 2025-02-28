import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import { SERVER_URL } from '../api';
import LoadingSpinner from './LoadingSpinner';
import Post from './Post'; 

export default function PostFeed() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filterTag, setFilterTag] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/posts/feed`);
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterTag(value);
    const filtered = posts.filter(post => {
      const isTagMatch = value.trim() === '' || post.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()));
      const isAuthorMatch = post.user._id === user?._id;
      return isTagMatch && isAuthorMatch;
    });

    setFilteredPosts(filtered);
  };

  const handleReaction = (postId, reaction) => {
    if (!user) {
      console.log('User not logged in');
      return;
    }

    axios.post(`${SERVER_URL}/posts/${postId}/reaction`, {
      reaction: reaction
    })
    .then(response => {
      console.log('Reaction added:', response.data);
    })
    .catch(error => {
      console.error('Error adding reaction:', error);
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box className="post-feed-wrapper" sx={{ maxWidth: 800 }}>
      <Grid container spacing={2}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Post post={post} onReaction={handleReaction} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">No posts available matching the tag and author filter</Typography>
        )}
      </Grid>
    </Box>
  );
}

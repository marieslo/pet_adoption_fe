import React, { createContext, useContext, useState, useEffect } from 'react';
import _ from 'lodash';
import localForage from 'localforage';
import { SERVER_URL } from '../api';
import { useAuth } from './AuthProvider';

const PostContext = createContext();

export default function PostProvider({ children }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [page, setPage] = useState(1);
  const [postCount, setPostCount] = useState(0);
  const [endMessage, setEndMessage] = useState(null);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState(user?.username || '');
  const [updatedUsername, setUpdatedUsername] = useState('');


  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await localForage.getItem('userId');
      setUserId(storedUserId || '');
    };
    fetchUserId();
  }, []);


  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);


  const showLoadingSpinner = () => setLoading(true);
  const hideLoadingSpinner = () => setLoading(false);
  const setEndMessageText = (text) => setEndMessage(text);

  const addPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
    setPostCount((prevCount) => prevCount + 1);
  };


  useEffect(() => {
    const fetchInitialPostCount = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/posts`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Error fetching initial post count');
        }
        const initialPosts = await response.json();
        setPostCount(initialPosts.length);
      } catch (error) {
        console.error('Error fetching initial post count:', error);
      }
    };
    fetchInitialPostCount();
  }, []);


  const createPostWithTimestamp = (newPost) => ({
    ...newPost,
    timeofpost: new Date().toISOString(),
    userId,
  });


  const handleCreatePost = async (newPost) => {
    const postWithTimestamp = createPostWithTimestamp(newPost);
    setLoading(true);
    setError(null);
    try {
      const token = await localForage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`${SERVER_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postWithTimestamp),
      });
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(`Post could not be created: ${responseBody.message || response.statusText}`);
      }
      const data = await response.json();
      setPosts((prevPosts) => [data, ...prevPosts]);
    } catch (error) {
      setError(error.message || 'Error creating post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleFetchPosts = async () => {
    try {
      const url = new URL(`${SERVER_URL}/posts/feed`);
      url.searchParams.append('page', page);
      url.searchParams.append('limit', '10'); 
      setLoading(true);
      setError(null);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Error fetching posts');
      }
      const newPosts = await response.json();
      handleFetchPostsSuccess(newPosts);
    } catch (error) {
      setError(error.message || 'Error fetching posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleFetchPostsSuccess = (newPosts) => {
    if (newPosts.length === 0) {
      setHasMorePosts(false);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    }
  };


  const handleFetchPostsError = (status) => {
    if (status === 429) {
      setTimeout(handleFetchPosts, 500);
    } else {
      setError('Error fetching posts');
    }
  };


  const getPosts = _.debounce(handleFetchPosts, 300);

  useEffect(() => {
    getPosts();
  }, [page]);

  // Intersection observer callback
  const handleIntersection = () => {
    getPosts();
  };


  const handleUpdateUserId = async (newUserId) => {
    setUserId(newUserId);
    await localForage.setItem('userId', newUserId);
    setPosts((prevPosts) =>
      prevPosts.map((post) => ({ ...post, userId: newUserId }))
    );
  };


  const handleUpdateUsername = (newUsername) => {
    setUsername(newUsername);
  };


  const handleUpdatePost = async (postId, updatedData) => {
    const postWithUpdatedTimestamp = createPostWithTimestamp(updatedData);
    
    try {
      const token = await localForage.getItem('token');
  
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`${SERVER_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postWithUpdatedTimestamp),
      });
    
      if (!response.ok) {
        throw new Error('Error updating post');
      }
    
      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const token = await localForage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`${SERVER_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(`Error deleting post: ${responseBody.message || response.statusText}`);
      }
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      setError(error.message || 'Error deleting post');
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (postId, commentContent) => {
    const token = await localForage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await fetch(`${SERVER_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });
      if (!response.ok) {
        throw new Error('Error adding comment');
      }
      const newComment = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleReactToPost = async (postId, emoji) => {
    const token = await localForage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await fetch(`${SERVER_URL}/posts/${postId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ emoji }),
      });
  
      if (!response.ok) {
        throw new Error('Error adding reaction');
      }
      const newReaction = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, reactions: [...post.reactions, newReaction] }
            : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
  

  // Value to be provided to components via context
  const value = {
    username,
    setUsername,
    posts: posts || [],
    userId,
    loading,
    error,
    hasMorePosts,
    page,
    addPost,
    handleCreatePost,
    getPosts,
    handleIntersection,
    handleUpdateUserId,
    handleUpdateUsername,
    handleUpdatePost,
    handleDeletePost,
    endMessage,
    showLoadingSpinner,
    hideLoadingSpinner,
    setEndMessageText,
    postCount,
    updatedUsername,
    setUpdatedUsername,
    handleCreateComment,
    handleReactToPost
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export const usePostContext = () => useContext(PostContext);
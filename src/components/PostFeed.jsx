import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import { SERVER_URL } from '../api';
import LoadingSpinner from './LoadingSpinner';

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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="post-feed">
      <div className="tag-filter mb-4">
        <input
          type="text"
          value={filterTag}
          onChange={handleFilterChange}
          placeholder="Filter by tag"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div key={post._id} className="post p-4 border-b border-gray-200 mb-4">
            <h3 className="font-semibold">{post.user.firstName} {post.user.lastName}</h3>
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post" className="mt-2 mb-4" />}
            <div>
              <strong>Tags:</strong> {post.tags.join(', ')}
            </div>
            <div>
              <strong>Reactions:</strong> {post.reactions.length}
            </div>
          </div>
        ))
      ) : (
        <p>No posts available matching the tag and author filter</p>
      )}
    </div>
  );
}
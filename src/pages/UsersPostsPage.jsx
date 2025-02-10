import React, { useState } from 'react';
import { usePostContext } from '../context/PostProvider';
import CreatePost from '../components/CreatePost';

export default function UserPostsPage() {
  const { posts, handleCreatePost, handleDeletePost, handleUpdatePost, loading } = usePostContext();
  const [newPost, setNewPost] = useState('');
  const [image, setImage] = useState('');

  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedImage, setEditedImage] = useState('');

  const handleCreate = async () => {
    if (newPost.trim()) {
      const newPostData = { content: newPost, image };
      await handleCreatePost(newPostData);
      setNewPost('');
      setImage('');
    }
  };

  const handleEdit = (postId, content, image) => {
    setEditingPostId(postId);
    setEditedContent(content);
    setEditedImage(image);
  };

  const handleSaveEdit = (postId) => {
    const updatedData = { content: editedContent, image: editedImage };
    handleUpdatePost(postId, updatedData);
    setEditingPostId(null);
    setEditedContent('');
    setEditedImage('');
  };

  return (
    <div className="container">
      <h1>Your Posts</h1>
      <div className="mb-4">
        <CreatePost updatedUsername="User" />
      </div>
      <div>
        <h3>Your Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="card my-3">
              <div className="card-body">
                {editingPostId === post._id ? (
                  <div>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="form-control"
                    />
                    <input
                      type="text"
                      value={editedImage}
                      onChange={(e) => setEditedImage(e.target.value)}
                      className="form-control my-2"
                    />
                    <button
                      onClick={() => handleSaveEdit(post._id)}
                      className="btn btn-success btn-sm mt-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPostId(null)} 
                      className="btn btn-secondary btn-sm mt-2 ms-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>{post.content}</p>
                    {post.image && <img src={post.image} alt="Post" className="img-fluid" />}
                    <div className="mt-3">
                      <button
                        onClick={() => handleEdit(post._id, post.content, post.image)} 
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="btn btn-danger btn-sm ms-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { usePostContext } from '../context/PostProvider';

export default function CreatePost({ updatedUsername, pets }) {
  const { handleCreatePost } = usePostContext();
  const [postText, setPostText] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');

  const handlePostChange = (e) => {
    setPostText(e.target.value);
  };

  const handleTagChange = (e) => {
    const inputTags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setTags(inputTags);
  };

  const handleCreateClick = () => {
    if (postText.trim() === '') {
      alert("Oops, you can't post empty posts.");
      return;
    }

    const newPost = {
      content: postText,
      petId: selectedPet,
      tags: tags 
    };

    handleCreatePost(newPost);
    setPostText('');
    setTags([]);
    setSelectedPet('');
  };

  return (
    <div className="create-post-container p-6 max-w-xl mx-auto bg-white shadow-lg rounded-md">
      <textarea
        value={postText}
        onChange={handlePostChange}
        placeholder={`What do you have in mind, ${updatedUsername}?`}
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
      />

      <input
        type="text"
        value={tags.join(', ')}
        onChange={handleTagChange}
        placeholder="Add tags (comma separated)"
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
      />

      <select
        value={selectedPet}
        onChange={(e) => setSelectedPet(e.target.value)}
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
      >
        <option value="">Select Pet</option>
        {pets.map((pet) => (
          <option key={pet.id} value={pet.id}>
            {pet.name}
          </option>
        ))}
      </select>

      <button
        className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={handleCreateClick}
      >
        Post
      </button>
    </div>
  );
}
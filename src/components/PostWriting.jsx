import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Autocomplete } from '@mui/material';
import { SERVER_URL } from '../api';
import { useAuth } from '../context/AuthProvider';
import CustomButton from './CustomButton';

export default function PostWriting({ onPostSubmit }) {
  const { authToken, user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/pets`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    if (authToken) fetchPets();
  }, [authToken]);

  const handlePostSubmit = async () => {
    if (!authToken || !content.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVER_URL}/posts/create`,
        { content, petId: selectedPet ? selectedPet._id : null },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      onPostSubmit(response.data);
      setContent("");
      setSelectedPet(null);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "var(--light)", borderRadius: "var(--border-radius)" }}>
      <TextField
        multiline
        rows={5}
        fullWidth
        placeholder="Share your thoughts here"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2, backgroundColor: "white", borderRadius: "var(--border-radius)" }}
      />
      <Autocomplete
        options={pets}
        getOptionLabel={(option) => option.name}
        value={selectedPet}
        onChange={(event, newValue) => setSelectedPet(newValue)}
        renderInput={(params) => <TextField {...params} label="Select a pet (optional)" variant="outlined" fullWidth sx={{ mb: 2 }} />}
      />
      <CustomButton text={loading ? "Posting..." : "Post it"} color="var(--accent)" onClick={handlePostSubmit} sx={{ width: "100%" }} />
    </Box>
  );
}
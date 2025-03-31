import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Autocomplete, TextField } from '@mui/material';
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
    if (!user) return null;
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
    <Box sx={{ p: 2, backgroundColor: "rgba(217, 200, 187, 0.94)",  borderRadius: "30px", width: '100%', maxWidth: '500px',margin: '0 auto', justifyContent: 'center', alignItems: 'center',}}>
      <TextField
        label={`${user?.firstName || "Hello"}, glad to see you here`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        rows={5}
        placeholder="You can ask or share questions about a specific pet, breed, etc."
        sx={{
          mb: 2,
          backgroundColor: "white",
          borderRadius: "30px",
          fontSize: '0.75rem',
          minHeight: '120px',
          width: '100%',
         
          '& .MuiOutlinedInput-input': {
            padding: '10px 12px',
            fontSize: '14px',
            textAlign: 'left',
            lineHeight: 'normal',
            alignItems: 'center',
            borderRadius: "30px",
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a72d66',
            borderRadius: "30px",
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a72d66',
            borderRadius: "30px",
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a72d66',
          },
          '& label.Mui-focused': {
            color: '#a72d66',
          },
          '& label': {
            fontSize: '14px',
          },
          '& input::placeholder': {
            fontSize: '16px',
            textAlign: 'center',
          }
        }}
      />
      <Autocomplete
        options={pets}
        getOptionLabel={(option) => option.name}
        value={selectedPet}
        onChange={(event, newValue) => setSelectedPet(newValue)}
        sx={{
          '--TextField-radius': 'var(--border-radius)',
          '--TextField-height': '50px',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--light)',
            borderRadius: 'var(--TextField-radius)',
            height: 'var(--TextField-height)',
            display: 'flex',
            alignItems: 'center',
            padding: '0',
          },
          '& .MuiOutlinedInput-input': {
            padding: '10px 12px',
            fontSize: '14px',
            textAlign: 'left',
            lineHeight: 'normal',
            alignItems: 'center',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a72d66',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a72d66',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a72d66',
          },
          '& label.Mui-focused': {
            color: '#a72d66',
          },
          '& label': {
            fontSize: '14px',
          },
          '& input::placeholder': {
            fontSize: '16px',
            textAlign: 'center',
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a pet (optional)"
            value={selectedPet ? selectedPet.name : ''}
            sx={{
              mb: 2,
              fontSize: '0.6rem',
              color: 'var(--accent)',
              '.MuiInputLabel-root': {
                fontSize: '0.75rem',
                color: 'var(--accent)',
                borderColor: 'var(--accent)',
              },
              '.MuiInputBase-root': {
                minHeight: '56px', 
                borderColor: 'var(--accent)',
              },
            }}
          />
        )}
      />
      <CustomButton text={loading ? "Posting..." : "Post it"} color="var(--accent)" onClick={handlePostSubmit} sx={{ width: "100%" }} />
    </Box>
  );
}

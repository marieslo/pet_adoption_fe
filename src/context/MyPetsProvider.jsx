import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthProvider';
import { useParams } from 'react-router-dom'; 
import { SERVER_URL } from '../../api';

const MyPetsContext = createContext();

export const useMyPetsContext = () => useContext(MyPetsContext);

export default function MyPetsProvider ({ children }) {
  const { user } = useAuth();
  const { id } = useParams(); 
  const [likedPets, setLikedPets] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [fosteredPets, setFosteredPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedPetsUpdated, setLikedPetsUpdated] = useState(false);
  const [adoptedPetsUpdated, setAdoptedPetsUpdated] = useState(false);
  const [fosteredPetsUpdated, setFosteredPetsUpdated] = useState(false);
  const [isOwner, setIsOwner] = useState(false); 
  
  useEffect(() => {
    const fetchUserPets = async () => {
      setLoading(true);
      try {
        if (user && user._id) {
          const response = await axios.get(`${SERVER_URL}/users/profile/${user._id}/pets`);
          const userData = response.data;
          setLikedPets(userData.likedPets || []);
          setAdoptedPets(userData.adoptedPets || []);
          setFosteredPets(userData.fosteredPets || []);
          const userPets = [...userData.likedPets, ...userData.adoptedPets, ...userData.fosteredPets];
          setIsOwner(userData.likedPets.includes(id) || userData.adoptedPets.includes(id) || userData.fosteredPets.includes(id));
        }
      } catch (error) {
        console.error('Error fetching user pets:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPets();
  }, [user, likedPetsUpdated, adoptedPetsUpdated, fosteredPetsUpdated, id]); 

  const likePet = async (petId) => {
    try {
      await axios.post(`${SERVER_URL}/pets/${petId}/like`, { userId: user._id });
      setLikedPets(prevLikedPets => [...prevLikedPets, petId]);
      setLikedPetsUpdated(prev => !prev); 
    } catch (error) {
      console.error('Error liking pet:', error);
      setError(error);
    }
  };

  const unlikePet = async (petId) => {
    try {
      await axios.delete(`${SERVER_URL}/pets/${petId}/unlike/${user._id}`);
      setLikedPets(prevLikedPets => prevLikedPets.filter(id => id !== petId));
      setLikedPetsUpdated(prev => !prev);
    } catch (error) {
      console.error('Error unliking pet:', error);
      setError(error);
    }
  };

  const adoptPet = async (petId) => {
    try {
      await axios.put(`${SERVER_URL}/pets/${petId}/adopt`, { userId: user._id });
      setAdoptedPets(prevAdoptedPets => [...prevAdoptedPets, petId]);
      setAdoptedPetsUpdated(prev => !prev); 
    } catch (error) {
      console.error('Error adopting pet:', error);
      setError(error);
    }
  };

  const fosterPet = async (petId) => {
    try {
      await axios.put(`${SERVER_URL}/pets/${petId}/foster`, { userId: user._id });
      setFosteredPets(prevFosteredPets => [...prevFosteredPets, petId]);
      setFosteredPetsUpdated(prev => !prev); 
    } catch (error) {
      console.error('Error fostering pet:', error);
      setError(error);
    }
  };

  const returnPet = async (petId) => {
    try {
      await axios.put(`${SERVER_URL}/pets/${petId}/return`, { userId: user._id });
      setAdoptedPets(prevAdoptedPets => prevAdoptedPets.filter(id => id !== petId));
      setFosteredPets(prevFosteredPets => prevFosteredPets.filter(id => id !== petId));
    } catch (error) {
      console.error('Error returning pet:', error);
      setError(error);
    }
  };
  
  return (
    <MyPetsContext.Provider
      value={{
        likedPets,
        setLikedPets,
        adoptedPets,
        setAdoptedPets,
        fosteredPets,
        setFosteredPets,
        user,
        likePet,
        unlikePet,
        adoptPet,
        fosterPet,
        returnPet,
        error,
        loading,
        likedPetsUpdated,
        setLikedPetsUpdated,
        adoptedPetsUpdated,
        setAdoptedPetsUpdated,
        fosteredPetsUpdated,
        setFosteredPetsUpdated,
        isOwner
      }}
    >
      {children}
    </MyPetsContext.Provider>
  );
}

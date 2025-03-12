import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import localforage from 'localforage';
import axios from 'axios';
import { SERVER_URL } from '../api';

export const FetchPetsContext = createContext();

export const useFetchPets = () => {
  return useContext(FetchPetsContext);
};

export default function FetchPetsProvider({ children }) {
  const [petsData, setPetsData] = useState([]);
  const [adoptablePets, setAdoptablePets] = useState([]);
  const [newlyAddedPets, setNewlyAddedPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchPets = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/pets`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching pets: ${error.message}`);
    }
  }, []);


  const fetchAdoptablePets = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/pets/search`, {
        params: { adoptionStatus: 'adoptable' }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching adoptable pets: ${error.message}`);
    }
  }, []);

  const fetchPetById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/pets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pet by ID ${id}: ${error.message}`);
      throw new Error(`Error fetching pet data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchPetsData = async () => {
      try {
        setLoading(true);
        const pets = await fetchPets();
        setPetsData(pets);
        const sortedPets = pets.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        const newlyAdded = sortedPets.slice(0, 5);  // Display the last 5 added pets
        setNewlyAddedPets(newlyAdded);
        await localforage.setItem('pets', pets);
        const adoptable = await fetchAdoptablePets();
        setAdoptablePets(adoptable);
      } catch (error) {
        setError(`Error fetching pets data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPetsData();
  }, [fetchPets, fetchAdoptablePets]);


  const searchPets = async (searchParams) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/pets/search`, { params: searchParams });
      const filteredPets = response.data.filter(pet => !pet.deleted);
      return filteredPets;
    } catch (error) {
      setError(`Error during search: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    petsData,
    adoptablePets,
    newlyAddedPets,
    setPetsData,
    fetchPets,
    fetchPetById,
    loading,
    error,
    searchPets,
  };

  return <FetchPetsContext.Provider value={value}>{children}</FetchPetsContext.Provider>;
}
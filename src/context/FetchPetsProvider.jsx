import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import localforage from 'localforage';
import axios from 'axios';

export const FetchPetsContext = createContext();

export const useFetchPets = () => {
  return useContext(FetchPetsContext);
};

export default function FetchPetsProvider ({ children })  {
  const [petsData, setPetsData] = useState([]);
  const [adoptablePets, setAdoptablePets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPets = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/pets');
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching pets: ${error.message}`);
    }
  }, []);

  const fetchAdoptablePets = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/pets/search', {
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
      const response = await axios.get(`http://localhost:3000/pets/${id}`);
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
      const response = await axios.get('http://localhost:3000/pets/search', { params: searchParams });
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
    setPetsData,
    fetchPets,
    fetchPetById,
    loading,
    error,
    searchPets,
  };

  return <FetchPetsContext.Provider value={value}>{children}</FetchPetsContext.Provider>;
};
import React, { useState, useEffect } from 'react';
import { useFetchPets } from '../context/FetchPetsProvider';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

export default function SearchPage() {
  const { petsData, error, searchPets, fetchPets } = useFetchPets();
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleSearch = async (searchTerm) => {
    try {
      setSearchTerm(searchTerm);
      const filteredPets = await searchPets(searchTerm);
      setFilteredPets(filteredPets);
    } catch (error) {
      console.error('Error during search:', error.message);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm(null);
    setFilteredPets([]);
  };

  return (
    <div className="bg-gradient-to-b from-[#837364] to-[#D7C3B8] flex justify-start items-start w-full h-screen p-2 overflow-hidden">
      <div className="flex flex-col justify-start items-start w-[90vw] box-border mt-12 ml-12 p-2">
        <div className="flex flex-col items-start w-full box-border">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          <div className="relative">
            <div className="mt-16">
              <SearchResults petsData={searchTerm ? filteredPets : petsData} loading={false} error={null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
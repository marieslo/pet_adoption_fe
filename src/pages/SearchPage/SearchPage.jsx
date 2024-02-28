import React, { useState } from 'react';
import './SearchPage.css';
import { useFetchPets } from '../../context/FetchPetsProvider';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchResults from '../../components/SearchResults/SearchResults';

export default function SearchPage() {
  const { petsData, error, searchPets } = useFetchPets();
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);

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
    <div className='search-page-container'>
      <div className='searchbar-and-searchresults-wrapper'>
        <div className='search-container'>
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          <div className='searchresults-wrapper'>
            <div className='search-results'>
              <SearchResults petsData={searchTerm ? filteredPets : petsData} loading={false} error={null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
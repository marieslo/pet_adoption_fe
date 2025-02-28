import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { SERVER_URL } from '../api';

const fetchSuggestions = async (query) => {
  try {
    const response = await axios.get(`${SERVER_URL}/pets/search`, {
      params: {
        autocomplete: 'true',
        name: query,
        breed: query,
        type: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export default function SearchBar({ onSearch }) {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    type: '',
    adoptionStatus: '',
    heightCm: 0,
    weightKg: 0,
    name: '',
    breed: '',
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchAutoSuggestions = async () => {
      if (searchTerm.name || searchTerm.breed || searchTerm.type) {
        setLoadingSuggestions(true);
        const query = searchTerm.name || searchTerm.breed || searchTerm.type;
        const fetchedSuggestions = await fetchSuggestions(query);
        setSuggestions(fetchedSuggestions);
        setLoadingSuggestions(false);
      } else {
        setSuggestions([]);
      }
    };

    fetchAutoSuggestions();
  }, [searchTerm.name, searchTerm.breed, searchTerm.type]);

  const handleSearch = () => {
    const searchParams = {
      type: searchTerm.type,
      adoptionStatus: isAdvancedSearch ? searchTerm.adoptionStatus : '',
      name: isAdvancedSearch ? searchTerm.name : '',
      breed: isAdvancedSearch ? searchTerm.breed : '',
      heightCm: isAdvancedSearch ? searchTerm.heightCm : 0,
      weightKg: isAdvancedSearch ? searchTerm.weightKg : 0,
    };
    onSearch(searchParams);


    const searchParamsQuery = new URLSearchParams(searchParams).toString();
    window.open(`/search?${searchParamsQuery}`, '_blank');
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleToggleSearchMode = () => {
    setIsAdvancedSearch((prev) => !prev);
  };

  const handleClearSearch = () => {
    setSearchTerm({
      type: '',
      adoptionStatus: '',
      heightCm: 0,
      weightKg: 0,
      name: '',
      breed: '',
    });
    onSearch({});
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm({
      ...searchTerm,
      name: suggestion.name,
      breed: suggestion.breed,
    });
    setSuggestions([]);
  };

  return (
    <div className="searchbar-container">
      <div className="flex justify-between items-center mb-4">
        <button
          className={`px-4 py-2 text-sm font-semibold bg-gray-200 rounded-md transition-all duration-300 ease-in-out ${isAdvancedSearch ? 'ml-auto' : 'mr-auto'}`}
          onClick={handleToggleSearchMode}
        >
          <span className="text-gray-700" style={{ fontWeight: 'bold', fontSize: '12px', marginTop: '50%', letterSpacing: '-1px', lineHeight: '1.1' }}>
            {isAdvancedSearch ? 'Switch to Basic' : 'Switch to Advanced'}
          </span>
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleSearch}
        >
          <SearchIcon className="w-6 h-6" />
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={handleClearSearch}
        >
          Clear Results
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <select
            value={searchTerm.type}
            onChange={(e) => setSearchTerm({ ...searchTerm, type: e.target.value })}
            onKeyPress={handleEnterPress}
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          >
            <option className="text-gray-700" value="">Type:</option>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="other">Other</option>
          </select>
        </div>
        {isAdvancedSearch && (
          <div className="space-y-4">
            <div>
              <select
                value={searchTerm.adoptionStatus}
                onChange={(e) => setSearchTerm({ ...searchTerm, adoptionStatus: e.target.value })}
                onKeyPress={handleEnterPress}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              >
                <option className="text-gray-700" value="">Adoption Status:</option>
                <option value="adoptable">Adoptable</option>
                <option value="adopted">Adopted</option>
                <option value="fostered">Fostered</option>
              </select>
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="heightRange" className="text-sm font-medium text-gray-700">
                  Height, over cm: {searchTerm.heightCm}
                </label>
                <input
                  id="heightRange"
                  type="range"
                  value={searchTerm.heightCm}
                  min="1"
                  max="100"
                  onChange={(e) => setSearchTerm({ ...searchTerm, heightCm: e.target.value })}
                  onKeyPress={handleEnterPress}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="weightRange" className="text-sm font-medium text-gray-700">
                  Weight, over kg: {searchTerm.weightKg}
                </label>
                <input
                  id="weightRange"
                  type="range"
                  value={searchTerm.weightKg}
                  min="1"
                  max="100"
                  onChange={(e) => setSearchTerm({ ...searchTerm, weightKg: e.target.value })}
                  onKeyPress={handleEnterPress}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Name"
                value={searchTerm.name}
                onChange={(e) => setSearchTerm({ ...searchTerm, name: e.target.value })}
                onKeyPress={handleEnterPress}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
              {suggestions.length > 0 && (
                <div className="modal-suggestions">
                  {loadingSuggestions ? (
                    <div>Loading...</div>
                  ) : (
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                          <img src={suggestion.picture} alt={suggestion.name} width={50} height={50} />
                          <div>
                            <h3>{suggestion.name}</h3>
                            <p>{suggestion.breed} ({suggestion.type})</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Breed"
                value={searchTerm.breed}
                onChange={(e) => setSearchTerm({ ...searchTerm, breed: e.target.value })}
                onKeyPress={handleEnterPress}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

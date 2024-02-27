import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './SearchBar.css';
import searchIcon from '../../styles/icons/search.png';

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

  return (
    <div className="searchbar-container">
      <div className="toggle-search-container">
        <Button
          className={`toggle-search-button ${isAdvancedSearch ? 'move-right' : 'move-left'}`}
          onClick={handleToggleSearchMode}
        >
          <span className="toggle-handle">
            <span
              className="toggle-text"
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                color: '#A68D85',
                marginTop: '50%',
                letterSpacing: '-1px',
                lineHeight: '1.1',
              }}
            >
              {isAdvancedSearch ? 'Switch to Basic' : 'Switch to Advanced'}
            </span>
          </span>
        </Button>
      </div>
      <div className="search-bar-btn-container">
        <button className="search-bar-btn" onClick={handleSearch}>
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
        </button>
        <button className="clear-results-btn" onClick={handleClearSearch}>
          Clear Results
        </button>
      </div>
      <div className="searchbar-fields">
        <select
          value={searchTerm.type}
          onChange={(e) => setSearchTerm({ ...searchTerm, type: e.target.value })}
          onKeyPress={handleEnterPress}
        >
          <option className="select-pet-type" value="">
            Type:
          </option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="other">Other</option>
        </select>
        {isAdvancedSearch && (
          <div className="advanced-search-fields">
            <select
              value={searchTerm.adoptionStatus}
              onChange={(e) => setSearchTerm({ ...searchTerm, adoptionStatus: e.target.value })}
              onKeyPress={handleEnterPress}
            >
              <option className="select-pet-status" value="">
                Adoption Status:
              </option>
              <option value="adoptable">Adoptable</option>
              <option value="adopted">Adopted</option>
              <option value="fostered">Fostered</option>
            </select>
            <div className="range-input-container">
              <div className="range-input">
                <label htmlFor="heightRange" className="placeholder-label height">
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
                />
              </div>
              <div className="range-input">
                <label htmlFor="weightRange" className="placeholder-label weight">
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
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Name"
              value={searchTerm.name}
              onChange={(e) => setSearchTerm({ ...searchTerm, name: e.target.value })}
              onKeyPress={handleEnterPress}
            />
            <input
              type="text"
              placeholder="Breed"
              value={searchTerm.breed}
              onChange={(e) => setSearchTerm({ ...searchTerm, breed: e.target.value })}
              onKeyPress={handleEnterPress}
            />
          </div>
        )}
      </div>
    </div>
  );
}
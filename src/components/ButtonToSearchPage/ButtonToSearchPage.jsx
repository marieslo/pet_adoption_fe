import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ButtonToSearchPage.css'

export default function ButtonToSearchPage() {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/pets/search');
  };
  
  return (
      <button className="search-button" onClick={handleSearch}>
        Find a pet
      </button>
  );
}
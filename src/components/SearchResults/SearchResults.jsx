import React, {useEffect} from 'react';
import { Spinner } from 'react-bootstrap';
import PetCard from '../PetCard/PetCard';
import './SearchResults.css';

export default function SearchResults({ petsData, loading, error }) {

  useEffect(() => {
  }, [petsData]);

  if (loading) {
    return (
      <div className='search-results-msg-and-spinner'>
        <Spinner animation="grow" variant="light" />
      </div>
    );
  }
  if (error) {
    return <div className='search-results-msg-and-spinner'>{error}</div>;
  }
  if (!petsData || petsData.length === 0) {
    return <div className='search-results-msg-and-spinner'>No pets found</div>;
  }
  const resultsCount = (
    <div className='search-results-msg-and-spinner'>
      Found {petsData.length} {petsData.length === 1 ? 'pet' : 'pets'}
    </div>
  );

  return (
    <div className='search-results-container'>
      {resultsCount}
      {petsData.map((pet, index) => (
        <PetCard key={index} pet={pet} showLikeButton={true} />
      ))}
    </div>
  );
}
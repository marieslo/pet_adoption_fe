import React, { useEffect, useState } from 'react';
import './MyPetsPage.css';
import { useMyPetsContext } from '../../context/MyPetsProvider';
import PetsList from './PetsList';
import AdoptablePetsFeed from '../../components/AdoptablePetsFeed/AdoptablePetsFeed';

export default function MyPetsPage() {
  const {
    likedPets = [], 
    adoptedPets = [],
    fosteredPets = [], 
    likePet,
    unlikePet,
    fetchAdoptedPets,
    fetchFosteredPets,
  } = useMyPetsContext();

  useEffect(() => {
    fetchAdoptedPets();
    fetchFosteredPets();
  }, [fetchAdoptedPets, fetchFosteredPets]);

  const handleUnlikePet = async (petId) => {
    try {
      await unlikePet(petId);
    } catch (error) {
      console.error('Error unliking pet:', error);
    }
  };

  return (
    <div className='my-pets-page-container'>
      <div className='my-pets-lists-wrapper'>
        <PetsList
          title='Adopted'
          cssClass='adopted'
          pets={adoptedPets}
          onUnlike={handleUnlikePet} 
        />
        <PetsList
          title='Fostered'
          cssClass='fostered'
          pets={fosteredPets}
          onUnlike={handleUnlikePet} 
        />
        <PetsList
          title='Liked'
          cssClass='liked'
          pets={likedPets}
          onUnlike={handleUnlikePet} 
        />

        {!(adoptedPets.length || fosteredPets.length || likedPets.length) && (
          <div className='they-need-your-love'>
            <p>
              Until you don't have any saved, adopted, or fostered pets,
            </p>
            <div className='mypets-page-petsfeed-container'>
              look for adoptable ones
              <AdoptablePetsFeed />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

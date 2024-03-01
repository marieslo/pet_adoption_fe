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
    unlikedPetsUpdated,
  } = useMyPetsContext();

  const [adoptedPetsUpdated, setAdoptedPetsUpdated] = useState(false);
  const [fosteredPetsUpdated, setFosteredPetsUpdated] = useState(false);
  const [likedPetsUpdated, setLikedPetsUpdated] = useState(false);


  useEffect(() => {
    setLikedPetsUpdated(unlikedPetsUpdated);
  }, [unlikedPetsUpdated]);

  useEffect(() => {
    if (adoptedPets.length > 0) setAdoptedPetsUpdated(true);
    else setAdoptedPetsUpdated(false);
  }, [adoptedPets]);

  useEffect(() => {
    if (fosteredPets.length > 0) setFosteredPetsUpdated(true);
    else setFosteredPetsUpdated(false);
  }, [fosteredPets]);

  useEffect(() => {
    if (likedPets.length > 0) setLikedPetsUpdated(true);
    else setLikedPetsUpdated(false);
  }, [likedPets]);

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
         key={likedPetsUpdated ? 'likedUpdated' : 'liked'}
         title='Liked'
         cssClass='liked'
         pets={likedPets}
         onLike={likePet}
         onUnlike={handleUnlikePet} 
        />
        <PetsList
          key={fosteredPetsUpdated ? 'fosteredUpdated' : 'fostered'}
          title='Fostered'
          cssClass='fostered'
          pets={fosteredPets}
          onLike={likePet}
          onUnlike={unlikePet}
        />
        <PetsList
          key={adoptedPetsUpdated ? 'adoptedUpdated' : 'adopted'}
          title='Adopted'
          cssClass='adopted'
          pets={adoptedPets}
          onLike={likePet}
          onUnlike={unlikePet}
        />
        {!(likedPetsUpdated || adoptedPetsUpdated || fosteredPetsUpdated) && (
       <p className='they-need-your-love'>
            Until you have no saved, fostered or adopted pets, take a look at the adoptable ones
            </p>
            <div className='mypets-page-petsfeed-container'>
              <AdoptablePetsFeed />
            </div>
        )}
      </div>
    </div>
  );
}

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
    adoptPet,
    fosterPet,
    returnPet,
    adoptedPetsUpdated,
    fosteredPetsUpdated,
    unlikedPetsUpdated,
  } = useMyPetsContext();

  const [likedPetsUpdated, setLikedPetsUpdated] = useState(false);

  useEffect(() => {
    setLikedPetsUpdated(unlikedPetsUpdated || adoptedPetsUpdated || fosteredPetsUpdated);
  }, [unlikedPetsUpdated, adoptedPetsUpdated, fosteredPetsUpdated]);

  const hasPets = likedPets.length > 0 || adoptedPets.length > 0 || fosteredPets.length > 0;

  return (
    <div className='my-pets-page-container'>
      <div className='my-pets-lists-wrapper'>
        <PetsList
         key={likedPetsUpdated ? 'likedUpdated' : 'liked'}
         title='Liked'
         cssClass='liked'
         pets={likedPets}
         onLike={likePet}
         onUnlike={unlikePet} 
        />
        <PetsList
          key={fosteredPetsUpdated ? 'fosteredUpdated' : 'fostered'}
          title='Fostered'
          cssClass='fostered'
          pets={fosteredPets}
          onLike={likePet}
          onUnlike={unlikePet}
          onAdopt={adoptPet}
          onFoster={fosterPet}
          onReturn={returnPet}
        />
        <PetsList
          key={adoptedPetsUpdated ? 'adoptedUpdated' : 'adopted'}
          title='Adopted'
          cssClass='adopted'
          pets={adoptedPets} 
          onLike={likePet}
          onUnlike={unlikePet}
          onAdopt={adoptPet}
          onFoster={fosterPet}
          onReturn={returnPet}
        />

        {!hasPets && (
          <div className='they-need-your-love'>
            <p>
              For now, you don't have any saved, adopted, or fostered pets.
            </p>
            <div className='mypets-page-petsfeed-container'>
              Look for adoptable ones
              <AdoptablePetsFeed />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

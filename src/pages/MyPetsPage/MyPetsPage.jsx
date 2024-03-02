import React from 'react';
import './MyPetsPage.css';
import { useMyPetsContext } from '../../context/MyPetsProvider';
import PetsList from './PetsList';
import AdoptablePetsFeed from '../../components/AdoptablePetsFeed/AdoptablePetsFeed';

export default function MyPetsPage() {
  const {
    user,
    likedPets,
    adoptedPets,
    fosteredPets,
    likePet,
    unlikePet,
  } = useMyPetsContext();

  const hasLikedPets = likedPets.length > 0;
  const hasAdoptedPets = adoptedPets.length > 0;
  const hasFosteredPets = fosteredPets.length > 0;

  return (
    <div className='my-pets-page-container'>
      <div className='my-pets-lists-wrapper'>
        <PetsList
         title='Saved for later'
         cssClass='saved'
         pets={likedPets}
         onLike={likePet}
         onUnlike={unlikePet}
        />
        <PetsList
          title='Fostered'
          cssClass='fostered'
          pets={fosteredPets}
          onUnlike={unlikePet}
        />
        <PetsList
          title='Adopted'
          cssClass='adopted'
          pets={adoptedPets}
          onUnlike={unlikePet}
        />

        {!hasLikedPets && !hasAdoptedPets && !hasFosteredPets && (
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
  );
}

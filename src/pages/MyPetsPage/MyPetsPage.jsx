import React, { useEffect, useState } from 'react';
import './MyPetsPage.scss';
import { usePetsOfUserContext } from '../../context/PetsOfUserProvider';
import PetsList from './PetsList';

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
  } = usePetsOfUserContext();

  const [likedPetsUpdated, setLikedPetsUpdated] = useState(false);

  useEffect(() => {
    setLikedPetsUpdated(unlikedPetsUpdated || adoptedPetsUpdated || fosteredPetsUpdated);
  }, [unlikedPetsUpdated, adoptedPetsUpdated, fosteredPetsUpdated]);

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
          onReturn={returnPet}
        />

        {(likedPets.length === 0 && adoptedPets.length === 0 && fosteredPets.length === 0) && (
          <div className='they-need-your-love'>
            <p>
              For now, you don't have any saved, adopted, or fostered pets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

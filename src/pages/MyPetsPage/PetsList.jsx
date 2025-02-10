import React from 'react';
import PetCard from '../../components/PetCard';

export default function PetsList({ title, cssClass, pets, onLike, onUnlike }) {
  const hasPets = pets.length > 0;

  const renderPets = () => {
    return pets.map((pet, index) => (
      <PetCard
        key={pet._id || index} 
        pet={pet}
        onLike={onLike}
        onUnlike={onUnlike}
      />
    ));
  };

  return (
    <div className='pets-section'>
      {hasPets && <h2 className={`my-pets-${cssClass}`}>{title}:</h2>}
      <div className={`pets-list ${cssClass}`}>
        {hasPets ? renderPets() : <p className='no-pets'></p>}
      </div>
    </div>
  );
}
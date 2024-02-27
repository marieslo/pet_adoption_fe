import React, { useEffect, useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useFetchPets } from '../../context/FetchPetsProvider';
import { AuthContext } from '../../context/AuthProvider';
import PetCard from '../PetCard/PetCard';
import './AdoptablePetsFeed.css';

export default function AdoptablePetsFeed() {
  const { loading, adoptablePets, fetchPets } = useFetchPets();
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPets();
      } catch (error) {
        console.error('Error fetching pets:', error.message);
      }
    };

    fetchData();
  }, [fetchPets]);

  const handleLike = async (pet) => {
    if (isAuthenticated) {
      try {
        await axios.post(`http://localhost:3000/pets/${pet._id}/like`, { userId: user.id });
        console.log(`User ${user.username} liked pet with ID ${pet._id}`);
      } catch (error) {
        console.error('Error liking pet:', error.message);
      }
    } else {
      console.log('Please log in to like pets');
    }
  };

  return (
    <div className='allpets-feed-wrapper'>
      {loading ? (
        <Spinner animation="grow" variant="light">
        </Spinner>
      ) : (
        <div className="pet-cards-container">
          {adoptablePets.map((pet, index) => (
            <PetCard
              key={pet._id}
              pet={pet}
              showLikeButton={true} 
              onLike={() => handleLike(pet)}
              showAdoptionStatus={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
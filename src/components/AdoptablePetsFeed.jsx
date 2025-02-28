import React, { useEffect, useContext, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useFetchPets } from '../context/FetchPetsProvider';
import { AuthContext } from '../context/AuthProvider';
import PetCard from './PetCard';
import { Box, IconButton } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import gsap from 'gsap';
import { SERVER_URL } from '../api';

export default function AdoptablePetsFeed() {
  const { loading, adoptablePets, fetchPets } = useFetchPets();
  const { isAuthenticated, user } = useContext(AuthContext);
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(scrollContainerRef.current, {
        x: `-=${300 * adoptablePets.length}`,
        repeat: -1,
        ease: 'none',
        duration: adoptablePets.length * 5,
        modifiers: {
          x: (x) => {
            if (parseFloat(x) <= -300 * adoptablePets.length) {
              return '0px';
            }
            return x;
          },
        },
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, [adoptablePets.length]);

  const handleLike = async (pet) => {
    if (isAuthenticated) {
      try {
        await axios.post(`${SERVER_URL}/pets/${pet._id}/like`, { userId: user.id });
        console.log(`User ${user.username} liked pet with ID ${pet._id}`);
      } catch (error) {
        console.error('Error liking pet:', error.message);
      }
    } else {
      console.log('Please log in to like pets');
    }
  };


  const handleScrollNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % adoptablePets.length);
  };


  const handleScrollPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? adoptablePets.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box sx={{ padding: 2, position: 'relative' }}>
      {loading ? (
        <Spinner animation="grow" variant="light" />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'hidden',
              position: 'relative',
            }}
            ref={scrollContainerRef}
            onMouseEnter={() => gsap.globalTimeline.pause()}
            onMouseLeave={() => gsap.globalTimeline.play()}
          >
            <Box sx={{ display: 'flex', minWidth: '100%' }}>
              {adoptablePets.map((pet, index) => (
                <Box
                  key={pet._id}
                  sx={{
                    minWidth: '300px',
                    transition: 'transform 0.5s ease',
                  }}
                >
                  <PetCard
                    pet={pet}
                    showLikeButton={true}
                    onLike={() => handleLike(pet)}
                    showAdoptionStatus={true}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
            onClick={handleScrollPrev}
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
            onClick={handleScrollNext}
          >
            <ArrowForward />
          </IconButton>
        </>
      )}
    </Box>
  );
}
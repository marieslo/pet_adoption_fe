import React, { useState, useEffect } from 'react';
import { usePetsOfUserContext } from '../context/PetsOfUserProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import localforage from 'localforage'; 
import { SERVER_URL } from '../api';
import { Favorite, FavoriteBorder, Visibility } from '@mui/icons-material';

export default function PetCard({ pet }) {
  const { _id, picture, name } = pet;
  const imageUrl = picture;
  const isDefaultImage = !imageUrl;

  const navigate = useNavigate();
  const { likePet, unlikePet } = usePetsOfUserContext();
  const { user } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [adoptionStatus, setAdoptionStatus] = useState('');

  useEffect(() => {
    fetchPetAdoptionStatus();
    if (user && _id) {
      localforage.getItem(`likedStatus_${user._id}_${_id}`).then((value) => {
        if (value !== null) {
          setIsLiked(value);
        }
      });
    }
  }, [user, _id]);

  const fetchPetAdoptionStatus = async () => {
    try {
      if (_id) {
        const response = await fetch(`${SERVER_URL}/pets/${_id}`);
        const data = await response.json();
        setAdoptionStatus(data.adoptionStatus);
      }
    } catch (error) {
      console.error('Error fetching pet adoption status:', error);
    }
  };

  const handleSeeMore = () => {
    if (!user) {
      setShowAlert(true);
    } else {
      navigate(`/pets/${_id}`, { state: { isLiked } });
    }
  };

  const handleLike = async () => {
    try {
      if (!user) {
        setShowAlert(true);
      } else {
        if (!isLiked) {
          await likePet(_id);
        } else {
          await unlikePet(_id);
        }
        const newLikedStatus = !isLiked;
        setIsLiked(newLikedStatus);
        localforage.setItem(`likedStatus_${user._id}_${_id}`, newLikedStatus);
      }
    } catch (error) {
      console.error('Error updating liked status:', error);
      setShowAlert(true);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-16 right-8 bg-[#f5efee] text-[#593202] shadow-md rounded-md p-4 text-center opacity-80">
          <p>Please log in to see details or save this pet</p>
        </div>
      )}
      <div className="flex flex-col justify-center items-center h-[300px] w-[195px] m-1 font-gotu text-[#593202] relative">
        <div className="w-[200px] h-[300px] rounded-md bg-[#d9c5c1] shadow-md text-[#401e12] font-gotu text-[14px] relative mb-0">
          {imageUrl && (
            <div className="w-[190px] h-[190px] overflow-hidden rounded-md shadow-md m-1">
              <img
                src={imageUrl}
                alt={`Image of ${name}`}
                className={`object-cover w-full h-full ${isDefaultImage ? 'w-[50px] h-[50px]' : ''}`}
              />
            </div>
          )}
          <div className="p-3">
            <h3 className="text-[24px] text-[#401e12]">{name}</h3>
            <p>{adoptionStatus}</p>
            <button
              className="absolute top-[82%] right-[5%] w-[40px] h-[40px] rounded-full bg-transparent flex justify-center items-center"
              onClick={handleSeeMore}
            >
              <Visibility className="w-[65%] h-[65%]" />
            </button>
            {user && (
              <button
                className="absolute top-[77%] right-[5px] w-[50px] h-[50px] flex justify-center items-center"
                onClick={handleLike}
              >
                {isLiked ? (
                  <Favorite className="w-[80%] h-[80%] text-red-500" />
                ) : (
                  <FavoriteBorder className="w-[80%] h-[80%] text-gray-500" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FetchPetsContext } from '../context/FetchPetsProvider';
import { usePetsOfUserContext } from '../context/PetsOfUserProvider';
import { useAuth } from '../context/AuthProvider';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import localforage from 'localforage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SinglePetPage() {
  const { id } = useParams();
  const { fetchPetById } = useContext(FetchPetsContext);
  const { likePet, unlikePet, adoptPet, fosterPet, returnPet, adoptedPets, fosteredPets, isOwner } = usePetsOfUserContext();
  const { user } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const data = await fetchPetById(id);
        setPetData(data);
        const storedLikedStatus = await localforage.getItem(`likedStatus_${user?._id}_${id}`);
        setIsLiked(storedLikedStatus || false);
      } catch (error) {
        console.error('Error fetching pet data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPetData();
  }, [fetchPetById, id, user._id, adoptedPets, fosteredPets]);

  const handleLike = async () => {
    try {
      if (!user) {
        setShowAlert(true);
      } else {
        await likePet(id);
        setIsLiked(true);
        await localforage.setItem(`likedStatus_${user._id}_${id}`, true);
      }
    } catch (error) {
      console.error('Error liking pet:', error);
      setShowAlert(true);
    }
  };

  const handleUnlike = async () => {
    try {
      if (!user) {
        setShowAlert(true);
        return;
      }
      await unlikePet(id);
      setIsLiked(false);
      await localforage.removeItem(`likedStatus_${user._id}_${id}`);
    } catch (error) {
      console.error('Error updating liked status:', error);
      setShowAlert(true);
    }
  };

  const handleAdopt = async () => {
    try {
      await adoptPet(id);
      setPetData(prevPetData => ({
        ...prevPetData,
        adoptionStatus: 'adopted'
      }));
    } catch (error) {
      console.error('Error adopting pet:', error);
      setShowAlert(true);
    }
  };

  const handleFoster = async () => {
    try {
      await fosterPet(id);
      setPetData(prevPetData => ({
        ...prevPetData,
        adoptionStatus: 'fostered'
      }));
    } catch (error) {
      console.error('Error fostering pet:', error);
      setShowAlert(true);
    }
  };

  const handleReturn = async () => {
    try {
      await returnPet(id);
      setPetData(prevPetData => ({
        ...prevPetData,
        adoptionStatus: 'adoptable'
      }));
    } catch (error) {
      console.error('Error returning pet:', error);
      setShowAlert(true);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!petData) {
    return <div>No pet data found</div>;
  }

  const {
    picture,
    name,
    adoptionStatus,
    bio,
    type,
    heightCm,
    weightKg,
    color,
    hypoallergenic,
    dietaryRestrictions,
    breed,
  } = petData;

  return (
    <>
      <div className="flex justify-center mt-6">
        <div className="bg-white shadow-lg rounded-lg w-96 p-6">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-primary"
              onClick={isLiked ? handleUnlike : handleLike}
            >
              {isLiked ? (
                <ThumbUp className="text-blue-500" />
              ) : (
                <ThumbDown className="text-gray-500" />
              )}
            </button>
            <div className="relative">
              <img src={picture} alt={`Image of ${name}`} className="w-full h-64 object-cover rounded-lg" />
              <h2 className="mt-4 text-2xl font-semibold text-center">{name}</h2>
              <p className="mt-2 text-center text-gray-600">{bio}</p>
            </div>
            <div className="mt-4">
              <p><span className="font-semibold">Type:</span> {type}</p>
              <p><span className="font-semibold">Status:</span> {adoptionStatus}</p>
              <p><span className="font-semibold">Height, cm:</span> {heightCm}</p>
              <p><span className="font-semibold">Weight, kg:</span> {weightKg}</p>
              <p><span className="font-semibold">Color:</span> {color}</p>
              <p><span className="font-semibold">Hypoallergenic:</span> {hypoallergenic ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Dietary Restrictions:</span> {dietaryRestrictions}</p>
              <p><span className="font-semibold">Breed:</span> {breed}</p>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {adoptionStatus === 'adoptable' ? (
                <>
                  <button
                    onClick={handleAdopt}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Adopt
                  </button>
                  <button
                    onClick={handleFoster}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Foster
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReturn}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Return
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <div className="alert-single-pet-page absolute top-20 left-1/2 transform -translate-x-1/2 w-80">
          <div className="bg-yellow-100 p-4 text-yellow-800 rounded-lg shadow-md">
            <p>Please log in to perform this action</p>
          </div>
        </div>
      )}
    </>
  );
}
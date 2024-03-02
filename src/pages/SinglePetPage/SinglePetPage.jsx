import React, { useEffect, useState, useContext } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import localforage from 'localforage';
import './SinglePetPage.css';
import { FetchPetsContext } from '../../context/FetchPetsProvider';
import { useMyPetsContext } from '../../context/MyPetsProvider';
import { useAuth } from '../../context/AuthProvider';
import likeIcon from '../../styles/icons/heart-filled.png';
import unlikeIcon from '../../styles/icons/heart-outlined.png';

export default function SinglePetPage() {
  const { id } = useParams();
  const { fetchPetById } = useContext(FetchPetsContext);
  const { likePet, unlikePet, adoptPet, fosterPet, returnPet, adoptedPets, fosteredPets } = useMyPetsContext(); 
  const { user } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const isCurrentUserAdopterOrFosterer = user && petData && (
    (petData.adoptionStatus === 'adopted' && adoptedPets.includes(id)) ||
    (petData.adoptionStatus === 'fostered' && fosteredPets.includes(id))
  );

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
  }, [fetchPetById, id, user._id]);

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
    return <Spinner className='single-pet-page-spinner' animation="grow" variant="light" />;
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
      <div className='single-pet-card-container'>
        <Card className='single-page-pet-card'>
          <button className="like-btn-singlepage" onClick={isLiked ? handleUnlike : handleLike}>
            <img
              src={isLiked ? likeIcon : unlikeIcon}
              alt={isLiked ? 'Like' : 'Unlike'}
              className="like-icon"
            />
          </button>
          <Card.Body>
            <div className='pet-picture-and-info-container'>
              <div className="custom-frame">
                <Card.Img
                  variant="top"
                  src={picture}
                  alt={`Image of ${name}`}
                  className="card-img"
                />
              </div>
              <Card.Title className='single-page-card-title'>{name}</Card.Title>
              <Card.Text className='single-page-card-bio'>{bio}</Card.Text>
            </div>
            <br />
            <div className='single-pet-card-fields-container'>
              <Card.Text><u>Type:</u> {type}</Card.Text>
              <Card.Text><u>Status:</u> {adoptionStatus}</Card.Text>
              <Card.Text><u>Height, cm:</u> {heightCm}</Card.Text>
              <Card.Text><u>Weight, kg:</u> {weightKg}</Card.Text>
              <Card.Text><u>Color:</u> {color}</Card.Text>
              <Card.Text><u>Hypoallergenic:</u> {hypoallergenic ? 'Yes' : 'No'}</Card.Text>
              <Card.Text><u>Dietary Restrictions:</u> {dietaryRestrictions}</Card.Text>
              <Card.Text><u>Breed:</u> {breed}</Card.Text>
            </div>
            <div className="pet-buttons">
              {(adoptionStatus === 'adoptable') && (
                <>
                  <button className='pet-page-btn' onClick={handleAdopt}>
                    Adopt
                  </button>
                  <button className='pet-page-btn' onClick={handleFoster}>
                    Foster
                  </button>
                </>
              )}
              {(adoptionStatus === 'adopted' || adoptionStatus === 'fostered') && 
                (isCurrentUserAdopterOrFosterer) && (
                  <button className='pet-page-btn' onClick={handleReturn}>
                    Return
                  </button>
                )}
              {!(adoptionStatus === 'adoptable' || isCurrentUserAdopterOrFosterer) && 
                (
                  <div className="pet-already-has-home-message">
                    This pet has already found its home.
                    <br/>
                    But its status may change later, so you can save it by clicking Like
                  </div>
                )}
            </div>
          </Card.Body>
        </Card>
        {showAlert && (
          <Alert className='alert-single-pet-page' variant="warning" onClose={() => setShowAlert(false)} dismissible>
            <p>Something went wrong. Please try again later</p>
          </Alert>
        )}
      </div>
    </>
  );
}

export default function SinglePetPage() {
  const { id } = useParams();
  const { fetchPetById } = useContext(FetchPetsContext);
  const { likePet, unlikePet, adoptPet, fosterPet, returnPet, adoptedPets, fosteredPets } = useMyPetsContext(); 
  const { user } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const isOwner = petData?.owner === user?.id;

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const data = await fetchPetById(id);
        setPetData(data);
        const storedLikedStatus = await localforage.getItem(`likedStatus_${user?.id}_${id}`);
        setIsLiked(storedLikedStatus || false);
      } catch (error) {
        console.error('Error fetching pet data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [fetchPetById, id, user?.id]);

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
              {adoptionStatus === 'adoptable' && (
                <>
                  <button className='pet-page-btn' onClick={handleAdopt}>
                    Adopt
                  </button>
                  <button className='pet-page-btn' onClick={handleFoster}>
                    Foster
                  </button>
                </>
              )}
              {(adoptionStatus === 'adopted' || adoptionStatus === 'fostered') && (
                <>
                  {isOwner ? (
                    <button className='pet-page-btn' onClick={handleReturn}>
                      Return
                    </button>
                  ) : (
                    <div className="pet-already-has-home-message">
                      This pet has already found its home.
                      <br/>
                      But its status may change later, so you can save it by clicking Like
                    </div>
                  )}
                </>
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

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Table, Button, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { SERVER_URL } from '../../api';

const itemsPerPage = 4;

export default function PetsDashboard() {
  const [pets, setPets] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAddNewPet = () => {
    navigate('/pets/addpet');
  };

  const fetchPets = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/pets`);
      setPets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleDeleteClick = (pet) => {
    setSelectedPet(pet);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${SERVER_URL}/pets/${selectedPet._id}`);
      fetchPets();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const handleDeleteCancel = () => {
    setSelectedPet(null);
    setShowDeleteModal(false);
  };

  const handleEditClick = (id) => {
    navigate(`/pets/addpet/${encodeURIComponent(id)}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedPetsData = [...pets].sort((a, b) => a.name.localeCompare(b.name));
  const currentItems = sortedPetsData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const adoptedCount = pets.filter((pet) => pet.adoptionStatus === 'adopted').length;
  const fosteredCount = pets.filter((pet) => pet.adoptionStatus === 'fostered').length;
  const adoptableCount = pets.filter((pet) => pet.adoptionStatus === 'adoptable').length;

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h2 className="admin-dashboard-name">Pets</h2>
      </div>
      <div className="status-counts">
        <span className="dashboard-counter">Adopted: {adoptedCount}</span>
        <span className="dashboard-counter">Fostered: {fosteredCount}</span>
        <span className="dashboard-counter">Adoptable: {adoptableCount}</span>
        <Button onClick={handleAddNewPet} className="add-new-pet-btn" variant="secondary">
          Add Pet
        </Button>
      </div>
      <div className="pagination-container">
        Page:
        {loading ? (
          <Spinner animation="grow" variant="light" /> 
        ) : (
          Array.from({ length: Math.ceil(pets.length / itemsPerPage) }).map((_, index) => (
            <Button
              className="pagination-btn"
              key={index}
              onClick={() => paginate(index + 1)}
              variant={currentPage === index + 1 ? 'light' : 'transparent'}
            >
              {index + 1}
            </Button>
          ))
        )}
      </div>

      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Pet's id</th>
            <th>Type</th>
            <th>Adoption Status</th>
            <th>Picture</th>
            <th>Height, cm</th>
            <th>Weight, kg</th>
            <th>Color</th>
            <th>Bio</th>
            <th>Hypoallergenic</th>
            <th>Dietary Restrictions</th>
            <th>Breed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pet) => (
            <tr key={pet._id}>
              <td className="w-max-conten-name">
                <Link to={`/pets/${pet._id}`}><u>{pet.name}</u></Link>
              </td>
              <td>{pet._id}</td>
              <td className="w-max-content">{pet.type}</td>
              <td className="w-max-content">{pet.adoptionStatus}</td>
              <td>
                  <div className="picture-frame">
                    <img src={pet.picture} alt={pet.name} />
                  </div>
              </td>
              <td>{pet.heightCm}</td>
              <td>{pet.weightKg}</td>
              <td>{pet.color}</td>
              <td>{pet.bio}</td>
              <td>{pet.hypoallergenic ? 'yes' : 'no'}</td> 
              <td>{pet.dietaryRestrictions}</td>
              <td>{pet.breed}</td>
              <td>
                <div className='pet-dashboard-btns'>
                  <Link className='link-petdash' to={`/pets/addpet/${encodeURIComponent(pet._id)}`}>
                    <button className='dashboard-icon-edit' onClick={() => handleEditClick(pet._id)}>
                    </button>
                  </Link>
                  <button
                    className='dashboard-icon-delete'
                    onClick={() => handleDeleteClick(pet)}
                  >
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedPet && selectedPet.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button className='admin-dashboard-modal-btn' variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button className='admin-dashboard-modal-btn' variant="secondary" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
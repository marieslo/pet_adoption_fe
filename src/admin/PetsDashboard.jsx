import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { SERVER_URL } from '../api';
import AdminTable from './AdminTable';

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

  const fetchPets = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/pets`);
      setPets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleAddNewPet = () => navigate('/pets/addpet');

  const handleEditClick = (id) => navigate(`/pets/addpet/${encodeURIComponent(id)}`);

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
      <AdminTable 
        data={pets}
        loading={loading}
        columns={[
          { key: "name", label: "Name", render: (value, pet) => <Link to={`/pets/${pet._id}`}><u>{value}</u></Link> },
          { key: "_id", label: "Pet's ID" },
          { key: "type", label: "Type" },
          { key: "adoptionStatus", label: "Adoption Status" },
          { key: "picture", label: "Picture", render: (value, pet) => <img src={value} alt={pet.name} width="50" /> },
          { key: "heightCm", label: "Height (cm)" },
          { key: "weightKg", label: "Weight (kg)" },
          { key: "color", label: "Color" },
          { key: "bio", label: "Bio" },
          { key: "hypoallergenic", label: "Hypoallergenic", render: (value) => value ? "Yes" : "No" },
          { key: "dietaryRestrictions", label: "Dietary Restrictions" },
          { key: "breed", label: "Breed" }
        ]}
        actions={[
          { label: "Edit", className: "dashboard-icon-edit", onClick: (pet) => handleEditClick(pet._id) },
          { label: "Delete", className: "dashboard-icon-delete", onClick: (pet) => handleDeleteClick(pet) }
        ]}
        itemsPerPage={itemsPerPage}
      />
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
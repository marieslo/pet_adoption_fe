import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../api';
import AdminTable from './AdminTable';
import { Container, Box } from '@mui/material';
import CustomButton from '../components/CustomButton';

const itemsPerPage = 4;

export default function PetsDashboard() {
  const [pets, setPets] = useState([]);
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

  const handleDeleteClick = async (pet) => {
    try {
      await axios.delete(`${SERVER_URL}/pets/${pet._id}`);
      fetchPets();
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const adoptedCount = pets.filter((pet) => pet.adoptionStatus === 'adopted').length;
  const fosteredCount = pets.filter((pet) => pet.adoptionStatus === 'fostered').length;
  const adoptableCount = pets.filter((pet) => pet.adoptionStatus === 'adoptable').length;

  return (
    <Container   
    sx={{
    width: '100%',
    height: '100vh',
    overflowY: 'scroll',
    marginTop: '80px',
    marginBottom: '50px',
    padding: '16px',
  }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CustomButton
          text="Add Pet"
          color="var(--accent)"
          onClick={handleAddNewPet}
          sx={{ width: '200px' }}
        />
      </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '20px',
          }}
        >
          <span className="dashboard-counter">Adopted: {adoptedCount}</span>
          <span className="dashboard-counter">Fostered: {fosteredCount}</span>
          <span className="dashboard-counter">Adoptable: {adoptableCount}</span>
        </Box>
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
        onDelete={handleDeleteClick}
      />
    </Container>
  );
}
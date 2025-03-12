import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { useFetchPets } from '../context/FetchPetsProvider';
import SearchInput from '../components/SearchInput';
import SearchFilters from '../components/SearchFilters';
import SearchResetButton from '../components/SearchResetButton';
import SearchResults from '../components/SearchResults';

export default function SearchPage() {
  const { petsData, fetchPets } = useFetchPets();
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    adoptionStatus: '',
    breed: '',
    weightMin: 0,
    weightMax: 100,
    heightMin: 0,
    heightMax: 100,
  });

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    filterPets(searchTerm, filters);
  }, [petsData]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    filterPets(searchTerm, filters);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    filterPets(searchTerm, newFilters);
  };

  const filterPets = (searchTerm, filters) => {
    const filtered = petsData.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.type || pet.type.toLowerCase().includes(filters.type.toLowerCase())) &&
        pet.adoptionStatus.toLowerCase() !== 'adopted' &&
        (!filters.adoptionStatus || pet.adoptionStatus.toLowerCase().includes(filters.adoptionStatus.toLowerCase())) &&
        (!filters.breed || pet.breed.toLowerCase().includes(filters.breed.toLowerCase())) &&
        pet.weightKg >= filters.weightMin &&
        pet.weightKg <= filters.weightMax &&
        pet.heightCm >= filters.heightMin &&
        pet.heightCm <= filters.heightMax;

      return matchesSearch && matchesFilters;
    });

    setFilteredPets(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      adoptionStatus: '',
      breed: '',
      weightMin: 0,
      weightMax: 100,
      heightMin: 0,
      heightMax: 100,
    });
    filterPets('', filters);
  };

  return (
    <Container sx={{ mt: 10, mb: 6, minWidth: '360px', maxWidth: '100%' }}>
      <Grid container justifyContent="center" spacing={4}>
        <Grid item xs={12} sm={8} md={5}>
          <Paper sx={{ padding: 3, backgroundColor: 'var(--light)', borderRadius: 'var(--border-radius)', boxShadow: 3 }}>
            <Box className="search-container" sx={{ width: '100%' }}>
              <SearchInput value={searchTerm} onChange={handleSearch} placeholder="Search by Name or Breed" />
              <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
              <SearchResetButton onClick={handleClearSearch} />
            </Box>
          </Paper>
          <Box sx={{ mt: 3, fontStyle: 'italic', color: '#ffffff' }}>
            <Typography variant="body2" color="var{--light)">
              <strong>Adoptable Pets:</strong> These pets are available for adoption and are looking for their forever home.
              <br />
              <br />
              <strong>Fostered Pets:</strong> These pets are in temporary foster homes and are awaiting adoption. 
              They are not yet available for adoption but are being cared for in the meantime.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={7}>
          <SearchResults petsData={filteredPets} loading={false} error={null} />
        </Grid>
      </Grid>
    </Container>
  );
}

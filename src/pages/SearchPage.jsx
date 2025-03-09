import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import gsap from 'gsap';
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
    setFilteredPets(petsData);
  };

  useEffect(() => {
    gsap.fromTo(
      '.search-container',
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

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
        </Grid>
        <Grid item xs={12} sm={8} md={7}>
          <SearchResults petsData={filteredPets} loading={false} error={null} />
        </Grid>
      </Grid>
    </Container>
  );
}
import React, { useState, useEffect } from 'react';
import { useFetchPets } from '../context/FetchPetsProvider';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { Box, Container, Grid, Typography, Paper, Button } from '@mui/material';
import gsap from 'gsap';

export default function SearchPage() {
  const { petsData, searchPets, fetchPets } = useFetchPets();
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const [advancedSearchTerm, setAdvancedSearchTerm] = useState({
    type: '',
    adoptionStatus: '',
    heightCm: 0,
    weightKg: 0,
    name: '',
    breed: '',
  });

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleSearch = async (searchTerm) => {
    try {
      setSearchTerm(searchTerm);
      const filteredPets = await searchPets(searchTerm);
      setFilteredPets(filteredPets);
    } catch (error) {
      console.error('Error during search:', error.message);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm(null);
    setFilteredPets([]);
    setAdvancedSearchTerm({
      type: '',
      adoptionStatus: '',
      heightCm: 0,
      weightKg: 0,
      name: '',
      breed: '',
    });
  };

  const handleToggleSearchMode = () => {
    setIsAdvancedSearch((prev) => !prev);
  };

  useEffect(() => {
    gsap.fromTo(
      '.search-container',
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 4, backgroundColor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
            <Box className="search-container">
              <Typography variant="h4" gutterBottom align="center">
                Find Your Perfect Pet
              </Typography>
              <SearchBar
                onSearch={handleSearch}
                isAdvancedSearch={isAdvancedSearch}
                onToggleSearchMode={handleToggleSearchMode}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={handleClearSearch}
              variant="outlined"
              color="primary"
              sx={{ marginBottom: 3 }}
            >
              Clear Search
            </Button>
          </Box>

          {isAdvancedSearch && (
            <Paper sx={{ padding: 4, backgroundColor: '#fafafa', borderRadius: 2, boxShadow: 3 }}>
              <div className="advanced-search-settings space-y-4">
                <div className="space-y-2">
                  <label htmlFor="adoptionStatus" className="text-sm font-medium text-gray-700">
                    Adoption Status:
                  </label>
                  <select
                    id="adoptionStatus"
                    value={advancedSearchTerm.adoptionStatus}
                    onChange={(e) =>
                      setAdvancedSearchTerm({ ...advancedSearchTerm, adoptionStatus: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  >
                    <option value="">Any</option>
                    <option value="adoptable">Adoptable</option>
                    <option value="adopted">Adopted</option>
                    <option value="fostered">Fostered</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="heightRange" className="text-sm font-medium text-gray-700">
                    Height, over cm: {advancedSearchTerm.heightCm}
                  </label>
                  <input
                    id="heightRange"
                    type="range"
                    value={advancedSearchTerm.heightCm}
                    min="1"
                    max="100"
                    onChange={(e) =>
                      setAdvancedSearchTerm({ ...advancedSearchTerm, heightCm: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="weightRange" className="text-sm font-medium text-gray-700">
                    Weight, over kg: {advancedSearchTerm.weightKg}
                  </label>
                  <input
                    id="weightRange"
                    type="range"
                    value={advancedSearchTerm.weightKg}
                    min="1"
                    max="100"
                    onChange={(e) =>
                      setAdvancedSearchTerm({ ...advancedSearchTerm, weightKg: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter pet's name"
                    value={advancedSearchTerm.name}
                    onChange={(e) => setAdvancedSearchTerm({ ...advancedSearchTerm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="breed" className="text-sm font-medium text-gray-700">
                    Breed:
                  </label>
                  <input
                    id="breed"
                    type="text"
                    placeholder="Enter pet's breed"
                    value={advancedSearchTerm.breed}
                    onChange={(e) => setAdvancedSearchTerm({ ...advancedSearchTerm, breed: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </Paper>
          )}

          <SearchResults petsData={searchTerm ? filteredPets : petsData} loading={false} error={null} />
        </Grid>
      </Grid>
    </Container>
  );
}

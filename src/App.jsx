import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddPetForm from './pages/admin/AddPetForm';
import EditPetForm from './pages/admin/EditPetForm';
import PetsDashboard from './pages/admin/PetsDashboard';
import UsersDashboard from './pages/admin/UsersDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import FavoritePetsPage from './pages/FavoritePetsPage';
import SinglePetPage from './pages/SinglePetPage';
import { AuthProvider } from './context/AuthProvider';
import FetchPetsProvider from './context/FetchPetsProvider';
import MyPetsProvider from './context/MyPetsProvider';
import { Container, Row, Col } from 'react-bootstrap';
import ProtectedRoute from './context/ProtectedRoute';
import '../public/styles.css';

export default function App() {
  return (
    <div className="App">
      <AuthProvider>
        <FetchPetsProvider>
          <MyPetsProvider>
            <Router>
              <Container fluid className="px-4">
              <Header />
                <Row>
                  <Col xs={12} md={10} lg={8} className="mx-auto">
                    <Routes>
                      <Route path="/" element={<WelcomePage />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/users/profile/:id" element={<ProfilePage />} />
                      <Route path="/users/favoritepets" element={<FavoritePetsPage />} />
                      <Route path="/pets/search" element={<SearchPage />} />
                      <Route path="/pets/:id" element={<SinglePetPage />} />
                      <Route path="/pets/addpet" element={<AddPetForm />} />
                      <Route path="/pets/addpet/:id" element={<EditPetForm />} />
                     {/* Admin protected routes */}
                     <Route 
                        path="/petsdashboard" 
                        element={<ProtectedRoute element={<PetsDashboard />} />} 
                      />
                      <Route 
                        path="/usersdashboard" 
                        element={<ProtectedRoute element={<UsersDashboard />} />} 
                      />
                    </Routes>
                  </Col>
                </Row>
                <Footer />
              </Container>
            </Router>
          </MyPetsProvider>
        </FetchPetsProvider>
      </AuthProvider>
    </div>
  );
}
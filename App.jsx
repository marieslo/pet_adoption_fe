import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './src/context/AuthProvider';
import FetchPetsProvider from './src/context/FetchPetsProvider';
import MyPetsProvider from './src/context/MyPetsProvider';
import AddPetForm from './src/admin/AddPetForm';
import EditPetForm from './src/admin/EditPetForm';
import PetsDashboard from './src/admin/PetsDashboard';
import UsersDashboard from './src/admin/UsersDashboard';
import Header from './src/components/Header/Header';
import Footer from './src/components/Footer/Footer';
import NavigateBar from './src/components/NavigateBar/NavigateBar';
import WelcomePage from './src/pages/WelcomePage/WelcomePage';
import HomePage from './src/pages/HomePage/HomePage';
import SearchPage from './src/pages/SearchPage/SearchPage';
import MyProfilePage from './src/pages/MyProfilePage/MyProfilePage';
import MyPetsPage from './src/pages/MyPetsPage/MyPetsPage';
import SinglePetPage from './src/pages/SinglePetPage/SinglePetPage';
import './src/styles/style.css';

export default function App() {
  return (
    <AuthProvider>
      <FetchPetsProvider>
        <MyPetsProvider>
          <Router>
            <NavigateBar />
            <Header />
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/users/profile/:id" element={<MyProfilePage />} />
              <Route path="/users/mypets" element={<MyPetsPage />} />
              <Route path="/pets/search" element={<SearchPage />} />
              <Route path="/pets/:id" element={<SinglePetPage />} />
              <Route path="/pets/addpet" element={<AddPetForm />} />
              <Route path="/pets/addpet/:id" element={<EditPetForm />} />
              <Route path="/petsdashboard" element={<PetsDashboard />} />
              <Route path="/usersdashboard" element={<UsersDashboard />} />
            </Routes>
            <Footer />
          </Router>
        </MyPetsProvider>
      </FetchPetsProvider>
    </AuthProvider>
  );
}
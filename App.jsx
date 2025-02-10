import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './public/style.scss';
import { AuthProvider } from './src/context/AuthProvider';
import FetchPetsProvider from './src/context/FetchPetsProvider';
import PetsOfUserProvider from './src/context/PetsOfUserProvider';
import PostProvider from './src/context/PostProvider';
import AddPetForm from './src/pages/admin/AddPetForm';
import EditPetForm from './src/pages/admin/EditPetForm';
import PetsDashboard from './src/pages/admin/PetsDashboard';
import UsersDashboard from './src/pages/admin/UsersDashboard';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import WelcomePage from './src/pages/WelcomePage';
import HomePage from './src/pages/HomePage';
import SearchPage from './src/pages/SearchPage';
import MyProfilePage from './src/pages/MyProfilePage';
import MyPetsPage from './src/pages/MyPetsPage/MyPetsPage';
import SinglePetPage from './src/pages/SinglePetPage';
import UserPostsPage from './src/pages/UsersPostsPage';

export default function App () {
  return (
    <div className='container'>
    <AuthProvider>
      <PostProvider>
        <FetchPetsProvider>
          <PetsOfUserProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/users/profile/:id" element={<MyProfilePage />} />
                <Route path="/users/mypets" element={<MyPetsPage />} />
                <Route path="/users/myposts" element={<UserPostsPage />} />
                <Route path="/pets/search" element={<SearchPage />} />
                <Route path="/pets/:id" element={<SinglePetPage />} />
                <Route path="/pets/addpet" element={<AddPetForm />} />
                <Route path="/pets/addpet/:id" element={<EditPetForm />} />
                <Route path="/petsdashboard" element={<PetsDashboard />} />
                <Route path="/usersdashboard" element={<UsersDashboard />} />
              </Routes>
              <Footer />
            </Router>
          </PetsOfUserProvider>
        </FetchPetsProvider>
      </PostProvider>
    </AuthProvider>
    </div>
  );
};
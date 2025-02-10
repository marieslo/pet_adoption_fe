import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import ModalLoginSignUp from './ModalLoginSignUp.jsx';
import { useAuth } from '../context/AuthProvider.jsx';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const handleModalOpen = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleLogout = () => setAlertShow(true);
  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
    setAlertShow(false);
  };

  const activeLinkStyle = 'text-red-600 font-bold';

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <NavLink to="/" className="text-gray-800 font-bold text-xl">PetCare</NavLink>
        </div>
        <button
          className="lg:hidden text-gray-800 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className={`lg:flex items-center space-x-4 ${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="flex flex-col lg:flex-row lg:space-x-6 lg:space-y-0 space-y-4">
            {!user && location.pathname !== '/' && (
              <NavLink to="/" className="text-gray-800 hover:text-red-600">Back</NavLink>
            )}
            {user && !loading && (
              <>
                <NavLink
                  to="/home"
                  className={`text-gray-800 hover:text-red-600 ${location.pathname === '/home' ? activeLinkStyle : ''}`}
                >
                  Home
                </NavLink>

                <NavLink
                  to={`/users/profile/${user._id}`}
                  className={`text-gray-800 hover:text-red-600 ${location.pathname === `/users/profile/${user._id}` ? activeLinkStyle : ''}`}
                >
                  {user.firstName}'s Profile
                </NavLink>

                <NavLink
                  to="/users/mypets"
                  className={`text-gray-800 hover:text-red-600 ${location.pathname === '/users/mypets' ? activeLinkStyle : ''}`}
                >
                  Favorite Pets
                </NavLink>

                <NavLink
                  to="/pets/search"
                  className={`text-gray-800 hover:text-red-600 ${location.pathname === '/pets/search' ? activeLinkStyle : ''}`}
                >
                  Search
                </NavLink>

                <NavLink
                  to="/users/myposts"
                  className={`text-gray-800 hover:text-red-600 ${location.pathname === '/users/myposts' ? activeLinkStyle : ''}`}
                >
                  My Posts
                </NavLink>

                {isAdmin && (
                  <div className="relative">
                    <button className="text-gray-800 hover:text-red-600">Admin Dashboards</button>
                    <div className="absolute bg-white shadow-lg mt-2 w-40 rounded-md">
                      <NavLink
                        to="/petsdashboard"
                        className={`block px-4 py-2 text-gray-800 hover:bg-gray-200 ${location.pathname === '/petsdashboard' ? activeLinkStyle : ''}`}
                      >
                        All Pets
                      </NavLink>
                      <NavLink
                        to="/usersdashboard"
                        className={`block px-4 py-2 text-gray-800 hover:bg-gray-200 ${location.pathname === '/usersdashboard' ? activeLinkStyle : ''}`}
                      >
                        All Users
                      </NavLink>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span
                  onClick={handleLogout}
                  className="text-gray-800 cursor-pointer hover:text-red-600"
                >
                  Log Out
                </span>
                {alertShow && (
                  <div className="absolute top-16 right-6 bg-white shadow-lg rounded-md p-4 text-center">
                    <p>Are you sure you want to log out?</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={handleLogoutConfirm}
                      >
                        Yes
                      </button>
                      <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                        onClick={() => setAlertShow(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <span
                onClick={handleModalOpen}
                className="text-gray-800 cursor-pointer hover:text-red-600"
              >
                Log In / Sign Up
              </span>
            )}
          </div>
        </div>
      </div>
      <ModalLoginSignUp
        show={modalShow}
        onHide={handleModalClose}
        onSignup={(userData) => console.log('Signing up:', userData)}
        onLogin={(userData) => console.log('Logging in:', userData)}
        onAdminStatusChange={(isAdmin) => console.log('Admin status changed:', isAdmin)}
      />
    </nav>
  );
}
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Alert } from 'react-bootstrap'; 
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import LoginSignUpModal from '../LogInSignUp/LoginSignUpModal.jsx';
import './NavigateBar.css';
import { useAuth } from '../../context/AuthProvider.jsx';

export default function NavigateBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalShow, setModalShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false); 
  const { user, logout, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const handleModalOpen = () => {
    setModalShow(true);
  };

  useEffect(() => {
    if (user) {
      setUsername(username); 
    }
  }, [user]);

  const handleLogout = () => {
    setAlertShow(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
    setAlertShow(false);
  };

  const activeLinkStyle = {
    color: '#FF0000',
    fontWeight: 'bold',
  };

  return (
    <Navbar className="nav" expand="md">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-start">
        <Nav className="mr-auto">
          {!user && location.pathname !== '/' && (
            <NavLink to="/" className="nav-link back">
              Back
            </NavLink>
          )}

          {user && !loading && (
            <>
              <NavLink
                to="/home"
                className="nav-link home"
                style={location.pathname === '/home' ? activeLinkStyle : {}}
              >
                Home
              </NavLink>

              <NavLink
                to={`/users/profile/${user._id}`}
                className="nav-link profile"
                style={location.pathname === `/users/profile/${user._id}` ? activeLinkStyle : {}}
              >
               {user.firstName}'s Profile
              </NavLink>

              <NavLink
                to="/users/mypets"
                className="nav-link pets"
                style={location.pathname === '/users/mypets' ? activeLinkStyle : {}}
              >
                Favorite Pets
              </NavLink>
              <NavLink
                to="/pets/search"
                className="nav-link search"
                style={location.pathname === '/pets/search' ? activeLinkStyle : {}}
              >
                Search
              </NavLink>

              {isAdmin && (
                <NavDropdown title={<span className="nav-link admin">Admin Dashboards</span> } id="admin-dropdown"> 
                  <NavDropdown.Item
                    as={NavLink}
                    to="/petsdashboard"
                    className="nav-link petdash"
                    style={location.pathname === '/petsdashboard' ? activeLinkStyle : {}}
                  >
                    All Pets
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/usersdashboard"
                    className="nav-link userdash"
                    style={location.pathname === '/usersdashboard' ? activeLinkStyle : {}}
                  >
                    All Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </>
          )}
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        {user ? (
          <>
            <span onClick={handleLogout} className="nav-link logout-icon">
              Log Out
            </span>
            <Alert show={alertShow} onClose={() => setAlertShow(false)} variant="info" className="alert-box">
                <div>
                  Are you sure you want to log out?
                  <button className="alert-btn" onClick={handleLogoutConfirm}>Yes</button>
                  <button className="alert-btn"  onClick={() => setAlertShow(false)}>No</button>
                </div>
              </Alert>
          </>
        ) : (
          <span onClick={handleModalOpen} className="nav-link login-icon">
            Log In / Sign Up
          </span>
        )}
      </Navbar.Collapse>
      <LoginSignUpModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onSignup={(userData) => {
          console.log('Signing up:', userData);
        }}
        onLogin={(userData) => {
          console.log('Logging in:', userData);
        }}
        onAdminStatusChange={(isAdmin) => {
          console.log('Admin status changed:', isAdmin);
        }}
      />
    </Navbar>
  );
}
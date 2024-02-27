import React, { useState } from 'react';
import { Modal, Nav, Tab, Alert } from 'react-bootstrap';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import localforage from 'localforage';
import './LoginSignUp.css';

export default function LoginSignUpModal({ show, onHide }) {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleTogglePage = () => {
    setIsLoginPage(!isLoginPage);
  };

  const handleRedirectToHome = () => {
    onHide();
    navigate('/home');
  };

  const handleLogin = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', userData);
      const { data: { user, token } } = response;
      await localforage.setItem('user', JSON.stringify(user));
      await localforage.setItem('token', token);
      handleRedirectToHome();
    } catch (error) {
      console.error('Error during login:', error);
      setError('User not registered or incorrect password');
    }
  };
  
  const handleSignup = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', formData);
      const { data: { user, token } } = response;
      await localforage.setItem('user', JSON.stringify(user));
      await localforage.setItem('token', token);
      handleRedirectToHome();
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Signup process was unsuccessful');
    }
  };
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Tab.Container activeKey={isLoginPage ? 'login' : 'signup'}>
        <Modal.Header closeButton>
          <Nav className='modal-tabs'>
            <Nav.Item>
              <Nav.Link className='tab-login' eventKey="login" onClick={handleTogglePage}>
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='tab-signup' eventKey="signup" onClick={handleTogglePage}>
                Sign Up
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Tab.Content>
            <Tab.Pane eventKey="login">
              <LoginForm onSubmit={handleLogin} onLoginSuccess={handleRedirectToHome} />
            </Tab.Pane>
            <Tab.Pane eventKey="signup">
              <SignUpForm onSubmit={handleSignup} onSignupSuccess={handleRedirectToHome} />
            </Tab.Pane>
          </Tab.Content>
        </Modal.Body>
      </Tab.Container>
    </Modal>
  );
}
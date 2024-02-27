import React, { useState } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import localforage from 'localforage';
import { useAuth } from '../../context/AuthProvider';

export default function SignupForm({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isValidPassword(formData.password)) {
        throw new Error(
          'Password must contain at least one letter, one digit, and be at least 6 characters long.'
        );
      }
      if (!isValidPhoneNumber(formData.phoneNumber)) {
        throw new Error('Invalid phone number. Please use the format XXXXXX.');
      }

      const response = await axios.post('http://localhost:3000/auth/signup', formData);
      console.log('User registered successfully:', response.data);
      const {
        data: { user, token },
      } = response;
      await localforage.setItem('user', JSON.stringify(user));
      await localforage.setItem('token', token);
      await login({ email: formData.email, password: formData.password });
      onSignupSuccess();
    } catch (error) {
      console.error('Error registering user:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return /\d{3}\d{3}/.test(phoneNumber);
  };

  return (
    <Form onSubmit={handleSignup}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="at least 6 characters"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPhoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />
      </Form.Group>

      <button className="switch-login-signup-btn" type="submit" disabled={loading}>
        {loading ? (
          <>
            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
          </>
        ) : (
          'Sign Up'
        )}
      </button>
    </Form>
  );
}
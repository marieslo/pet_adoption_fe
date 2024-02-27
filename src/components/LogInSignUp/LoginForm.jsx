import React, { useState } from 'react';
import { Form, Alert, Spinner} from 'react-bootstrap';
import { useAuth } from '../../context/AuthProvider';

export default function LoginForm ({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      setShowAlert(false);
      onLoginSuccess();
    } catch (error) {
      setShowAlert(true);
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {showAlert && <Alert variant="danger">User not registered or incorrect password</Alert>}
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <button className="switch-login-signup-btn" type="submit">
              {loading ? (
                <>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                </>
              ) : (
                'Login'
              )}
      </button>
    </Form>
  );
}
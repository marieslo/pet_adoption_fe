import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function ProtectedRoute ({ element }) {
  const { user, isAdmin } = useAuth(); 

  if (!user) {
    // If user is not logged in, redirect to welcome
    return <Navigate to="/" />;
  }

  if (!isAdmin) {
    // If user is logged in but not an admin, redirect to home
    return <Navigate to="/home" />;
  }

  // If user is an admin, render the protected route
  return element;
};
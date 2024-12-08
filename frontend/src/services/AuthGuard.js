import React from 'react';
import { Navigate } from 'react-router-dom';

// A simple function to check if the user is authenticated
const isAuthenticated = () => {
  // Example: Check if a token exists in localStorage
  return !!localStorage.getItem('authToken');
};

const AuthGuard = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/" />;
  }
  // Render children if authenticated
  return children;
};

export default AuthGuard;
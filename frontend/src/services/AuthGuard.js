import React from 'react';
import { Navigate } from 'react-router-dom';

// A simple function to check if the user is authenticated
const isAuthenticated = () => {
  
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return !!getCookie('authToken');
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
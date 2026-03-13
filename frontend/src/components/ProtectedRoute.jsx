import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.type)) {
    // Logged in but wrong role (e.g., candidate trying to access company route)
    // Redirect to their respective dashboard
    if (user.type === 'candidat') {
      return <Navigate to="/candidate/dashboard" replace />;
    } else if (user.type === 'entreprise') {
      return <Navigate to="/company/dashboard" replace />;
    }
  }

  // Authorized
  return <Outlet />;
};

export default ProtectedRoute;

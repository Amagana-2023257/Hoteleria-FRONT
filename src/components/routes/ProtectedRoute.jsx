// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks/useUserDetails.jsx';
import { Unauthorized } from '../common/Unauthorized';

export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isLogged, role } = useUserDetails();

  if (!isLogged) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

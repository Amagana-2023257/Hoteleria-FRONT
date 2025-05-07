// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
// IMPORTA explícitamente el archivo .js si tu setup lo requiere:
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

import React from 'react';
import { DashboardPage } from './pages/dashboard';
import { AuthPage } from './pages/auth';

export const routes = [
  {
    path: '/dashboard/*',
    element: <DashboardPage />,
  },
  {
    path: '/*',
    element: <AuthPage />,
  }
];

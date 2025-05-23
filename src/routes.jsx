import React from 'react';
import { DashboardPage } from './pages/dashboard';
import { AuthPage } from './pages/auth';
import { StartPage } from './pages/startPage';

export const routes = [
  {
    path: '/dashboard/*',
    element: <DashboardPage />,
  },
  {
    path: '/auth/*',
    element: <AuthPage />,
  },
   {
    path: '/*',
    element: <StartPage />,
  }
];

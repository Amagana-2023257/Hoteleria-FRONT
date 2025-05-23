import React from 'react';
import { NavBar } from '../../components/nav/NavBar';
import { Sidebar } from '../../components/nav/Sidebar';
import { Content } from '../../components/dashboard/Content';
import './Dashboard.css';

export const DashboardPage = () => {
  return (
    <div className="dashboard-wrapper d-flex">
      <Sidebar />

      <div className="d-flex flex-column flex-grow-1">
        <NavBar />

        <Content />
      </div>
    </div>
  );
};

import React from 'react';
import Dashboard from '../pos/components/Dashboard';
import '../styles/DashboardPage.css';

const DashboardPage = ({ sales }) => {
  return (
    <div className="dashboardPageContainer">
      <Dashboard sales={sales} />
    </div>
  );
};

export default DashboardPage;

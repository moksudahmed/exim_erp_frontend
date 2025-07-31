import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../components/pos/Dashboard';

const HomePage = ({ sales, products, recentTransactions, currentBalance, isOpen, token, isAuthenticated}) => {
  return (
    <div>
      <Dashboard sales={sales} inventory={products} recentTransactions={recentTransactions} currentBalance={currentBalance} isOpen={isOpen} token={token} isAuthenticated={isAuthenticated}/>
      <nav>
        <ul>
          <li><Link to="/pos">POS</Link></li>
          <li><Link to="/stock">Stock</Link></li>
          <li><Link to="/sales">Sales</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;

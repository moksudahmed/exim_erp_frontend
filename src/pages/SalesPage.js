import React, { useState, useEffect } from 'react';
import {
  FaChartBar,
  FaFileAlt,
  FaList,
  FaTable,
  FaMoon,
  FaSun,
} from 'react-icons/fa';

import Sales from '../components/pos/Sales';
import SalesSummary from '../components/Sales/SalesSummary';
import SalesAnalytics from '../components/Sales/SalesAnalytics';
import SalesReports from '../components/Sales/SalesReports';
import SalesByCustomer from '../components/Sales/SalesByCustomer';
import SalesWithDelivery from '../components/Sales/SalesWithDelivery';
import OrderComponent from '../components/Sales/OrderComponent';

import { fetchClientsByType } from '../api/client';
import { fetchSales as fetchSalesAPI } from '../api/sales';

import './styles/SalesPage.css';

const SalesPage = ({ products, isAuthenticated, token }) => {
  const [selectedComponent, setSelectedComponent] = useState('sales');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadClients();
    loadSales();
  }, []);

  const loadClients = async () => {
    try {
      const data = await fetchClientsByType('CUSTOMER', token);
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const loadSales = async () => {
    try {
      const fetchedSales = await fetchSalesAPI(token);
      setSales(fetchedSales);
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  const handleUpdateSale = (updatedSale) => {
    setSales((prev) =>
      prev.map((sale) => (sale.id === updatedSale.id ? updatedSale : sale))
    );
  };

  const handleDeleteSale = (id) => {
    setSales((prev) => prev.filter((sale) => sale.id !== id));
  };

  const filteredClients = clients.filter((client) =>
    client.account_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSalesByCustomer = sales.filter((sale) => {
    const customer = clients.find((c) => c.client_id === sale.client_id);
    return customer?.account_name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'sales':
        return (
          <Sales
            clients={filteredClients}
            sales={sales}
            products={products}
            onUpdateSale={handleUpdateSale}
            onDeleteSale={handleDeleteSale}
            isAuthenticated={isAuthenticated}
            token={token}
          />
        );
      case 'order':
        return (
          <OrderComponent
            clients={filteredClients}
            sales={sales}
            products={products}
            onUpdateSale={handleUpdateSale}
            onDeleteSale={handleDeleteSale}
            isAuthenticated={isAuthenticated}
            token={token}
          />
        );
      case 'customer':
        return (
          <SalesByCustomer
            sales={filteredSalesByCustomer}
            customers={clients} // using clients as customers
          />
        );
      case 'delivary':
        return <SalesWithDelivery />;
      case 'summary':
        return <SalesSummary sales={sales} />;
      case 'analytics':
        return <SalesAnalytics sales={sales} />;
      case 'reports':
        return <SalesReports sales={sales} products={products} />;
      default:
        return <Sales sales={sales} products={products} />;
    }
  };

  return (
    <div className={`sales_page_container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="sales_page_header">
        <h1 className="sales_page_title">Sales Management</h1>
        <p className="sales_page_subtitle">Manage and analyze your sales efficiently</p>
        <div className="sales_page_controls">
          <input
            type="text"
            placeholder={
              selectedComponent === 'customer'
                ? 'Search sales by customer...'
                : 'Search client...'
            }
            className="search_input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="theme_toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      <div className="sales_page_content">
        <nav className="sales_nav">
          <ul>
            {[
              ['sales', <FaList />, 'Sales'],
              ['order', <FaTable />, 'Orders'],
              ['customer', <FaTable />, 'Sales By Customer'],
              ['delivary', <FaTable />, 'Delivery'],
              ['summary', <FaTable />, 'Sales Summary'],
              ['analytics', <FaChartBar />, 'Sales Analytics'],
              ['reports', <FaFileAlt />, 'Sales Reports'],
            ].map(([key, icon, label]) => (
              <li
                key={key}
                className={selectedComponent === key ? 'active' : ''}
                onClick={() => setSelectedComponent(key)}
              >
                {icon} {label}
              </li>
            ))}
          </ul>
        </nav>

        <section className="sales_section">{renderComponent()}</section>
      </div>
    </div>
  );
};

export default SalesPage;

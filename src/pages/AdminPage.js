import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import styles from './styles/AdminPage.module.css';

// Admin Components
import ManageProducts from '../components/Admin/ManageProducts';
import ManageSales from '../components/Admin/ManageSales';
import ManageCustomers from '../components/Admin/ManageCustomers';
import EditCustomer from '../components/Admin/EditCustomer';
import EditSupplier from '../components/Admin/EditSupplier';
import DriverForm from '../components/Admin/DriverForm';
import DeliveryForm from '../components/Admin/DeliveryForm';
import MergedDeliveryForm from '../components/Admin/MergedDeliveryForm';
import ClientEntryForm from '../components/Admin/ClientEntryForm';
import ClientList from '../components/Admin/ClientList';
import CustomerEntryForm from '../components/Admin/CustomerEntryForm';
import SupplierEntryForm from '../components/Admin/SupplierEntryForm';

// Catalog Components
import ProductCatalogue from '../components/Catalog/ProductCatalogue';

// Report Components
import SalesReport from '../components/Reports/SalesReport';
import StockReport from '../components/Reports/StockReport';

// Auth Components
import UserManagement from '../components/Authentication/UserManagement';
import ManageSuppliers from '../components/Admin/ManageSuppliers';

const AdminPage = ({ branches, sales, customers, suppliers, products, onAddProduct, onUpdateProduct, onDeleteProduct, token, isAuthenticated }) => {
  const [activeSection, setActiveSection] = useState('manageProducts');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeSection) {
      case 'manageProducts':
        return (
          <ManageProducts 
            products={products} 
            onUpdateProduct={onUpdateProduct} 
            onDeleteProduct={onDeleteProduct} 
          />
        );
      case 'productCatalogue':
        return (
          <ProductCatalogue 
            products={products} 
            onAddProduct={onAddProduct} 
          />
        );
      case 'manageSales':
        return <ManageSales sales={sales} />;
      case 'addCustomers':
        return <CustomerEntryForm branches={branches} />;
      case 'manageCustomers':
        return (
          <Routes>
            <Route index element={<ManageCustomers token={token} />} />
            <Route element={<ManageCustomers token={token} />} />
            <Route path="edit/:clientId" element={<EditCustomer token={token} />} />
          </Routes>
        );

      case 'addSupplier':
        return <SupplierEntryForm branches={branches} />;
      case 'manageSuppliers':
        return (
          <Routes>
            <Route index element={<ManageSuppliers token={token} />} />
            <Route element={<ManageSuppliers token={token} />} />
            <Route path="edit/:clientId" element={<EditSupplier token={token} />} />
          </Routes>
         
        );
      case 'manageClientsList':
        return <ClientList />;
      case 'manageDrivers':
        return <DriverForm token={token} />;
      case 'manageDeliveriesWithDriver':
        return <MergedDeliveryForm sales={sales} token={token} />;
      case 'salesReport':
        return <SalesReport sales={sales} />;
      case 'stockReport':
        return <StockReport products={products} />;
      case 'userManagement':
        return <UserManagement token={token} isAuthenticated={isAuthenticated} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.layout}>
        <nav className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Navigation</h2>
          <ul className={styles.navList}>
            <li 
              className={`${styles.navItem} ${activeSection === 'manageProducts' ? styles.active : ''}`} 
              onClick={() => setActiveSection('manageProducts')}
            >
              Manage Products
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'productCatalogue' ? styles.active : ''}`} 
              onClick={() => setActiveSection('productCatalogue')}
            >
              Product Catalogue
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'manageSales' ? styles.active : ''}`} 
              onClick={() => setActiveSection('manageSales')}
            >
              Manage Sales
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'addCustomers' ? styles.active : ''}`} 
              onClick={() => setActiveSection('addCustomers')}
            >
              Add Customer
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'manageCustomers' ? styles.active : ''}`} 
              onClick={() => setActiveSection('manageCustomers')}
            >
              Manage Customers
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'addSupplier' ? styles.active : ''}`} 
              onClick={() => setActiveSection('addSupplier')}
            >
              Add Supplier
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'manageSuppliers' ? styles.active : ''}`} 
              onClick={() => setActiveSection('manageSuppliers')}
            >
              Manage Suppliers
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'manageClientsList' ? styles.active : ''}`} 
              onClick={() => setActiveSection('manageClientsList')}
            >
              
              Manage Clients
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'manageDrivers' ? styles.active : ''}`} 
              onClick={() => setActiveSection('manageDrivers')}
            >
              Manage Drivers
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'manageDeliveriesWithDriver' ? styles.active : ''}`} 
              onClick={() => setActiveSection('manageDeliveriesWithDriver')}
            >
              Manage Deliveries
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'salesReport' ? styles.active : ''}`} 
              onClick={() => setActiveSection('salesReport')}
            >
              Sales Report
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'userManagement' ? styles.active : ''}`} 
              onClick={() => setActiveSection('userManagement')}
            >
              User Management
            </li>
            <li 
              className={`${styles.navItem} ${activeSection === 'stockReport' ? styles.active : ''}`} 
              onClick={() => setActiveSection('stockReport')}
            >
              Stock Report
            </li>
          </ul>
        </nav>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
import React, { useState } from 'react';
import ManageProducts from '../components/Admin/ManageProducts';
import ManageSales from '../components/Admin/ManageSales';
import ProductCatalogue from '../components/Catalog/ProductCatalogue';
import SalesReport from '../components/Reports/SalesReport';
import StockReport from '../components/Reports/StockReport';
import styles from './styles/AdminPage.module.css';
import UserManagement from '../components/Authentication/UserManagement';
import ManageCustomers from '../components/Admin/ManageCustomers';
import DriverForm from '../components/Admin/DriverForm';
import DeliveryForm from '../components/Admin/DeliveryForm';
import MergedDeliveryForm from '../components/Admin/MergedDeliveryForm';
import ClientEntryForm from '../components/Admin/ClientEntryForm';
import ClientList from '../components/Admin/ClientList';
import CustomerEntryForm from '../components/Admin/CustomerEntryForm';
import SupplierEntryForm from '../components/Admin/SupplierEntryForm';

const AdminPage = ({branches, sales, customers, suppliers, products, onAddProduct, onUpdateProduct, onDeleteProduct, token, isAuthenticated }) => {
  const [activeSection, setActiveSection] = useState('manageProducts');
  console.log(customers);
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
        return <CustomerEntryForm branches={branches}/>;   
        
      case 'manageCustomers':
        return <ManageCustomers token={token}/>;   
      case 'addSupplier':
        return <SupplierEntryForm  branches={branches}/>;   
     // case 'manageClients':
     //   return <ClientEntryForm />;     
      case 'manageClientsList':
        return <ClientList />;        
      case 'manageDrivers':
        return <DriverForm token={token} />;        
     // case 'manageDeliveries':
     //   return <DeliveryForm sales={sales} token={token} />;   
      case 'manageDeliveriesWithDriver':
        return <MergedDeliveryForm sales={sales} token={token} />;                  
      case 'salesReport':
        return <SalesReport sales={sales} />;
      case 'stockReport':
        return <StockReport products={products} />;
      case 'userManagement':
        return <UserManagement token={token} isAuthenticated={true} />  // ✅ Correct usage
      default:
        return null;
    }
  };

  <div className={styles.section}>
 
</div>
  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.layout}>
        <nav className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Navigation</h2>
          <ul className={styles.navList}>
            <li className={styles.navItem} onClick={() => setActiveSection('manageProducts')}>Manage Products</li>
            <li className={styles.navItem} onClick={() => setActiveSection('productCatalogue')}>Product Catalogue</li>
            <li className={styles.navItem} onClick={() => setActiveSection('manageSales')}>Manage Sales</li>
            <li className={styles.navItem} onClick={() => setActiveSection('addCustomers')}>Add Customer</li>
            <li className={styles.navItem} onClick={() => setActiveSection('manageCustomers')}>Manage Customers</li>
            
            <li className={styles.navItem} onClick={() => setActiveSection('addSupplier')}>Add Supplier</li>
            {/*<li className={styles.navItem} onClick={() => setActiveSection('manageClients')}>Add Clients</li> */}
            <li className={styles.navItem} onClick={() => setActiveSection('manageClientsList')}>Manage Clients</li>                        
            <li className={styles.navItem} onClick={() => setActiveSection('manageDrivers')}>Manage Drivers</li>
           {/* <li className={styles.navItem} onClick={() => setActiveSection('manageDeliveries')}>Manage Deliveries</li>*/}
            <li className={styles.navItem} onClick={() => setActiveSection('manageDeliveriesWithDriver')}>Manage Deliveries</li>            
            <li className={styles.navItem} onClick={() => setActiveSection('salesReport')}>Sales Report</li>
            <li className={styles.navItem} onClick={() => setActiveSection('userManagement')}>User Management</li>
            <li className={styles.navItem} onClick={() => setActiveSection('stockReport')}>Stock Report</li>
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

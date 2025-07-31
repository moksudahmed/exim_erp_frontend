import React, { useEffect, useState } from 'react';
import Inventory from '../components/Inventory/Inventory';
import ProductManagement from '../components/Inventory/ProductManagement';
import InventoryLogs from '../components/Inventory/InventoryLogs';
import StockUpdate from '../components/Inventory/StockUpdate';
import './styles/InventoryPage.css';
import InventoryReport from '../components/Inventory/InventoryReport';
import ReceiveStock from '../components/Inventory/ReceiveStock';
import { getReceivedOrder, onCompletePurchaseOrders} from '../api/purchase';

const InventoryPage = ({ products, inventoryLogs, setInventoryLogs, onUpdateStock, onDeductDamaged, onAddInventory, setProducts, isAuthenticated, token }) => {
  const [selectedComponent, setSelectedComponent] = useState('products'); // Set default view to 'products'
  const [receivedPurchaseOrder, setReceivedPurchaseOrder] = useState([]);
  // Navigation handler
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated && token) {           

          const receivedOrder = await getReceivedOrder(token);
          setReceivedPurchaseOrder(receivedOrder);
        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };

    loadData();
  }, [isAuthenticated, token]); 
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'products':
        return (
          <ProductManagement
            products={products}            
          />
        );
      case 'stock':
        return (
          <StockUpdate
            products={products}
            onUpdateStock={onUpdateStock}
            onDeductDamaged={onDeductDamaged}
            onAddInventory={onAddInventory}
            setProducts={setProducts}
            isAuthenticated={isAuthenticated}
            token={token}
          />
        );
        case 'batch':
          return (                  
            <ReceiveStock products={products}   
            setProducts={setProducts} 
            receiveItems={receivedPurchaseOrder}
            isAuthenticated={isAuthenticated}
            token={token}/>
          );
        
      case 'logs':
        return (
          <InventoryLogs
            products={products}
            inventoryLogs={inventoryLogs}
          />
        );
        case 'reports':
          return (
            <InventoryReport
            products={products}
            
          />
          );
        
      default:
        return <ProductManagement products={products} />;
    }
  };

  return (
    <div className="inventory_page_container">
      <header className="inventory_page_header">
        <h1 className="inventory_page_title">Inventory Management</h1>
        <p className="inventory_page_subtitle">Manage your products, stock levels, and logs efficiently</p>
      </header>

      <div className="inventory_page_content">
        {/* Navigation Menu */}
        <nav className="inventory_nav">
          <ul>
            <li className={selectedComponent === 'products' ? 'active' : ''} onClick={() => setSelectedComponent('products')}>
              Product Management
            </li>
            <li className={selectedComponent === 'stock' ? 'active' : ''} onClick={() => setSelectedComponent('stock')}>
              Stock Update
            </li>
            <li className={selectedComponent === 'batch' ? 'active' : ''} onClick={() => setSelectedComponent('batch')}>
              Batch Stock Update
            </li>
            <li className={selectedComponent === 'logs' ? 'active' : ''} onClick={() => setSelectedComponent('logs')}>
              Inventory Logs
            </li>
            <li className={selectedComponent === 'reports' ? 'active' : ''} onClick={() => setSelectedComponent('reports')}>
              Inventory Report
            </li>
          </ul>
        </nav>

        {/* Render Selected Component */}
        <section className="inventory_section">
          {renderComponent()}
        </section>
      </div>
    </div>
  );
};

export default InventoryPage;

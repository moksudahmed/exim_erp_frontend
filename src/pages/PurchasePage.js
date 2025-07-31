import React, { useEffect, useState } from 'react';

import './styles/PurchasePage.css';

//import PurchaseOrderList from '../components/Purchase/PurchaseOrderList';
import PurchaseOrderForm from '../components/Purchase/PurchaseOrderForm';

import {addVendor, fetchVendors} from '../api/vendor';
import VendorList from '../components/Purchase/VendorList';
import PurchaseOrderList from '../components/Purchase/PurchaseOrderList';
import { addPurchaseOrders, fetchPurchaseOrders, onReceivePurchaseOrders, getPurchaseOrder, onCancelPurchaseOrders, onCompletePurchaseOrders } from '../api/purchase';
import SupplierStatement from '../components/Purchase/SupplierStatement';
import { fetchClientsByType, fetchClients } from '../api/client';
import SupplierList from '../components/Purchase/SupplierList';
import LCModule from '../components/LC/LCModule';
import { fetchLC } from '../api/lc';
import LCListTable from '../components/LC/LCListTable';
import { fetchBankAccounts } from '../api/subsidiary_account';
import LetterOfCreditPage from '../components/LC/LetterOfCreditPage';
import LcTracker from '../components/LC/LcTracker';

const PurchasePage = ({ token, products }) => {
  const [selectedComponent, setSelectedComponent] = useState('orders'); // Default view
  const [vendors, setVendors] =  useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [lc, setLC] = useState([]);
  const [banks, setBanks] = useState([]);

  const loadClients = async () => {
      try {
        const data = await fetchClientsByType('SUPPLIER', token);
        setClients(data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
const loadSupplier = async () => {
      try {
        const data = await fetchClientsByType('SUPPLIER', token);
        setSuppliers(data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
const loadLC = async () => {
      try {
        const data = await fetchLC(token);
        setLC(data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
const fetchBanks = async () => {
    try {     
      const fetchedBanks = await fetchBankAccounts(token);      
      setBanks(fetchedBanks); // Ensure data is an array
    } catch (error) {
      console.error('Error fetching banks:', error);
      setBanks([]); // fallback
    }
  };


  useEffect(() => {
   loadClients();
   loadLC();
   fetchBanks();
    const loadData = async () => {
      try {
        if (token) {
          const fetchVendor = await fetchVendors(token);
          setVendors(fetchVendor);
          console.log(fetchVendor);
          const fetchOrders = await fetchPurchaseOrders(token);
          setPurchaseOrders(fetchOrders);
          loadSupplier();

          

        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };

    loadData();
  }, [token]);
  const onEdit = ()=>{

  }
  const onDelete = ()=>{

  }
  const onAdd= async(vendorData) =>{
    try {   
    const savedVendor = await addVendor(vendorData, token);
    //setVendors((prevVendors) => [...prevVendors, savedVendor]);
      
    } catch (error) {
      console.error('Failed to add vendor:', error.message);
    }
  }
  const onSubmit= async(purchaseOrderData) =>{
    try {   
      console.log(purchaseOrderData);
    const savedOrder = await addPurchaseOrders(purchaseOrderData, token);
    setPurchaseOrders((prevOrders) => [...prevOrders, savedOrder]);
      
    } catch (error) {
      console.error('Failed to add order:', error.message);
    }
  }
  // Call this function to refresh orders after an update
  const refreshOrders = async () => {
    await fetchPurchaseOrders();
  };

  const onReceive = async (orderId) => {
    try {
      await onReceivePurchaseOrders(orderId, token);      
      console.log('Order received successfully');
      refreshOrders();  // Refresh the list after receiving
    } catch (error) {
      console.error('Failed to receive order');
    }
  };
  
  const onComplete = async (orderId) => {
    try {
      await onCompletePurchaseOrders(orderId, token);      
      console.log('Order received successfully');
      refreshOrders();  // Refresh the list after receiving
    } catch (error) {
      console.error('Failed to receive order');
    }
  };
  
  const onView = async (orderId) => {
    try {
      const fetchOrder = await getPurchaseOrder(orderId, token);
      setSelectedOrder(fetchOrder);
      refreshOrders();  // Refresh the list after receiving
    } catch (error) {
      console.error('Failed to receive order');
    }
  };

  const onCancel = async (orderId) => {
    try {
      await onCancelPurchaseOrders(orderId, token);      
      console.log('Order canceled successfully');
      refreshOrders();  // Refresh the list after receiving
    } catch (error) {
      console.error('Failed to cancel order');
    }
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'orders':
        return (
          <PurchaseOrderForm
          clients={clients} products={products} onSubmit={onSubmit} token={token}
          />
        );
      case 'summary':
        return <PurchaseOrderList purchaseOrders={purchaseOrders} onReceive={onReceive} onView={onView} 
                onCancel={onCancel} selectedOrder={selectedOrder} onComplete={onComplete}
              
        //vendors={vendors} products={products} onSubmit={onSubmit}
        />;  
      case 'lcpage':
        return <LetterOfCreditPage data={lc} suppliers={suppliers} banks ={banks} token={token}/>;  
        case 'lc':
        return <LCModule suppliers={suppliers} banks ={banks} token={token}/>;  
      case 'lclist':
        return <LCListTable data={lc} />
      case 'lctracker':
        return <LcTracker lcRecords={lc}/>
      case 'supplierstatement':
        return <SupplierStatement suppliers={suppliers}   token={token}  />;  
       case 'suppliers':
        return <SupplierList suppliers={clients}   token={token}  />;  
        
      default:
        return  <PurchaseOrderForm
        vendors={vendors} products={products} //onSubmit={onSubmit}
        />;
    }
  };

  return (
    <div className="purchase_page_container">
      <header className="purchase_page_header">
        <h1 className="purchase_page_title">Purchase Management</h1>
        <p className="purchase_page_subtitle">Manage and analyze your purchases efficiently</p>
      </header>

      <div className="purchase_page_content">
        {/* Navigation Menu */}
        <nav className="purchase_nav">
          <ul>
            <li
              className={selectedComponent === 'suppliers' ? 'active' : ''}
              onClick={() => setSelectedComponent('suppliers')}
            >
              Suppliers
            </li>
            
            <li
              className={selectedComponent === 'orders' ? 'active' : ''}
              onClick={() => setSelectedComponent('orders')}
            >
             Local Purchase Orders
            </li>
            <li
              className={selectedComponent === 'lcpage' ? 'active' : ''}
              onClick={() => setSelectedComponent('lcpage')}
            >
             LC Page
            </li>
            
             <li
              className={selectedComponent === 'lc' ? 'active' : ''}
              onClick={() => setSelectedComponent('lc')}
            >
             LC Purchase Orders
            </li>
            <li
              className={selectedComponent === 'lclist' ? 'active' : ''}
              onClick={() => setSelectedComponent('lclist')}
            >
             LC Table
            </li>
            <li
              className={selectedComponent === 'lctracker' ? 'active' : ''}
              onClick={() => setSelectedComponent('lctracker')}
            >
             LC Tracker
            </li>
             
            <li
              className={selectedComponent === 'summary' ? 'active' : ''}
              onClick={() => setSelectedComponent('summary')}
            >
              Purchase Summary
            </li>
          {/*  <li
              className={selectedComponent === 'vendors' ? 'active' : ''}
              onClick={() => setSelectedComponent('vendors')}
            >
              Vendors
            </li>*/}
             <li
              className={selectedComponent === 'supplierstatement' ? 'active' : ''}
              onClick={() => setSelectedComponent('supplierstatement')}
            >
              Supplier Statement
            </li>
            
          </ul>
        </nav>

        {/* Render Selected Component */}
        <section className="purchase_section">{renderComponent()}</section>
      </div>
    </div>
  );
};

export default PurchasePage;

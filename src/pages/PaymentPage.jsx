import React, { useEffect, useState } from 'react';
import axios from 'axios';

import PaymentForm from '../components/payment/PaymentForm';
import PaymentList from '../components/payment/PaymentList';
import PaymentDashboard from '../components/payment/PaymentDashboard';
import './styles/PaymentPage.css';
import CustomerPayments from '../components/payment/CustomerPayment';
import { fetchClientsByType, fetchClients } from '../api/client';
import ClientPayments from '../components/payment/ClientPayment';
import SupplierPayment from '../components/payment/SupplierPayment';
import ExpenseEntryForm from '../components/payment/ExpenseEntryForm';
import SubsidiaryAccountStatement from '../components/payment/SubsidiaryAccountStatement';
import ClientStatement from '../components/payment/ClientStatement';
import AllClientStatements from '../components/payment/AllClientStatements';

const PaymentPage = ({ customers, isAuthenticated, token }) => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadClients = async () => {
      try {
        const data = await fetchClientsByType('CUSTOMER', token);
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
  
  const fetchPayments = async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:8000/api/v1/payments/');
      setPayments(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    loadClients();
    loadSupplier();

    
  }, [isAuthenticated, token]);

  const addPayment = async (paymentData) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/payments/', paymentData);
      setPayments([res.data, ...payments]);
    } catch (err) {
      console.error('Error adding payment:', err);
    }
  };
  const onDeletePayment = async()=>{
    
  }
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return <PaymentDashboard payments={payments} onDeletePayment={onDeletePayment} token={token} />;
      case 'add':
        return <PaymentForm onSubmit={addPayment} />;
      case 'list':
        return <PaymentList payments={payments} loading={loading} />;
      case 'clientpayment':
        return <ClientPayments clients={clients} token={token}/>;
      case 'supplierpayment':
        return <SupplierPayment clients={suppliers} token={token}/>;
      case 'expenseform':
        return <ExpenseEntryForm isAuthenticated={isAuthenticated} token={token}/>
      case 'statement':
        return <SubsidiaryAccountStatement isAuthenticated={isAuthenticated} token={token}/>
      case 'clientstatement':
        return <ClientStatement clients={clients} isAuthenticated={isAuthenticated} token={token}/>
      
      case 'allclientstatement':
        return <AllClientStatements clients={clients} isAuthenticated={isAuthenticated} token={token}/>
      case 'customerpayment':
        return <CustomerPayments customers={customers}/>;
      default:
        return <PaymentDashboard payments={payments} />;
    }
  };

  return (
    <div className="payment_page_container">
      <header className="payment_page_header">
        <h1 className="payment_page_title">Payment Management</h1>
        <p className="payment_page_subtitle">Manage all payment transactions efficiently</p>
      </header>

      <div className="payment_page_content">
        <nav className="payment_nav">
          <ul>
            <li
              className={selectedComponent === 'dashboard' ? 'active' : ''}
              onClick={() => setSelectedComponent('dashboard')}
            >
              Dashboard
            </li>
            <li
              className={selectedComponent === 'add' ? 'active' : ''}
              onClick={() => setSelectedComponent('add')}
            >
              Add Payment
            </li>
            <li
              className={selectedComponent === 'customerpayment' ? 'active' : ''}
              onClick={() => setSelectedComponent('customerpayment')}
            >
              View Customer Payments
            </li>
            <li
              className={selectedComponent === 'clientpayment' ? 'active' : ''}
              onClick={() => setSelectedComponent('clientpayment')}
            >
              Clients Payments
            </li>
            <li
              className={selectedComponent === 'supplierpayment' ? 'active' : ''}
              onClick={() => setSelectedComponent('supplierpayment')}
            >
              Supplier Payments
            </li>
              <li
              className={selectedComponent === 'expenseform' ? 'active' : ''}
              onClick={() => setSelectedComponent('expenseform')}
            >
             Expense Form
            </li>
            
            <li
              className={selectedComponent === 'list' ? 'active' : ''}
              onClick={() => setSelectedComponent('list')}
            >
              View Payments
            </li>
            
            <li
              className={selectedComponent === 'statement' ? 'active' : ''}
              onClick={() => setSelectedComponent('statement')}
            >
              
              View Statement
            </li>
            
            <li
              className={selectedComponent === 'allclientstatement' ? 'active' : ''}
              onClick={() => setSelectedComponent('allclientstatement')}
            >
              
             All Statement
            </li>
            
            <li
              className={selectedComponent === 'clientstatement' ? 'active' : ''}
              onClick={() => setSelectedComponent('clientstatement')}
            >
              Client Statement
            </li>
             
          </ul>
        </nav>

        <section className="payment_section">{renderComponent()}</section>
      </div>
    </div>
  );
};

export default PaymentPage;

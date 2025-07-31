// pages/TransactionManagementPage.js
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionLogs from '../components/Transactions/TransactionLogs';
import TransactionReport from '../components/Transactions/TransactionReport';
import './styles/TransactionManagement.css';
import React, { useState, useEffect } from 'react';
import { fetchTransactions, addTransaction } from '../api/transaction'; // Your fetch function for transactions

const TransactionManagement = ({ token, isAuthenticated }) => {
const [selectedComponent, setSelectedComponent] = useState('transactions'); // Set default view to 'transactions'
const [transactions, setTransactions] = useState([]);
const [transactionLogs, setTransactionLogs] = useState([]);
// Navigation handler to render the appropriate component

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated && token) {        

          const fetchedTransactions = await fetchTransactions(token); // Renamed this variable
          setTransactions(fetchedTransactions);
          console.log(fetchedTransactions);

          // If you need logs specifically, adapt this if necessary
          setTransactionLogs(fetchedTransactions); 
        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };

    loadData();
  }, [isAuthenticated, token]);


  // Function to create a new transaction
  const onCreateTransaction = async (newTransaction, token) => {
    try {
        // Send the new transaction data to the backend API
        const createdTransaction = await addTransaction(newTransaction, token);
  
        // Update the state with the newly created transaction
        setTransactions((prevTransactions) => [...prevTransactions, createdTransaction]);
  
        // Log the transaction creation
        const newLog = {
          id: transactionLogs.length + 1,
          date: new Date().toISOString().split('T')[0],
          description: `Created ${createdTransaction.transaction_type} transaction`,
          amount: createdTransaction.amount,
        };
        setTransactionLogs((prevLogs) => [...prevLogs, newLog]);
  
        console.log('Transaction created successfully:', createdTransaction);
      } catch (error) {
        console.error('Failed to create transaction:', error.message);
      }
    };
  
    // Function to update an existing transaction
    const onUpdateTransaction = (updatedTransaction) => {
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      );
      setTransactions(updatedTransactions);
  
      // Log the transaction update
      const newLog = {
        id: transactionLogs.length + 1,
        date: new Date().toISOString().split('T')[0],
        description: `Updated transaction with ID: ${updatedTransaction.id}`,
        amount: updatedTransaction.amount,
      };
      setTransactionLogs([...transactionLogs, newLog]);
    };
  
    // Function to delete a transaction
    const onDeleteTransaction = (transactionId) => {
      const remainingTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
      setTransactions(remainingTransactions);
  
      // Log the transaction deletion
      const deletedTransaction = transactions.find((transaction) => transaction.id === transactionId);
      const newLog = {
        id: transactionLogs.length + 1,
        date: new Date().toISOString().split('T')[0],
        description: `Deleted ${deletedTransaction.transaction_type} transaction with ID: ${transactionId}`,
        amount: deletedTransaction.amount,
      };
      setTransactionLogs([...transactionLogs, newLog]);
    };

const renderComponent = () => {
    switch (selectedComponent) {
      case 'transactions':
        return (
          <TransactionList
            transactions={transactions}
            onDeleteTransaction={onDeleteTransaction}
            onUpdateTransaction={onUpdateTransaction}
          />
        );
      case 'create':
        return (
          <TransactionForm
            onSubmit={onCreateTransaction}
          />
        );
      case 'logs':
        return (
          <TransactionLogs
            transactionLogs={transactionLogs}
          />
        );
      case 'reports':
        return (
          <TransactionReport
            transactions={transactions}
          />
        );
      default:
        return <TransactionList transactions={transactions} />;
    }
  };

  return (
    <div className="transaction_page_container">
      <header className="transaction_page_header">
        <h1 className="transaction_page_title">Transactions</h1>
        <p className="transaction_page_subtitle">Manage your transactions, logs, and reports efficiently</p>
      </header>

      <div className="transaction_page_content">
        {/* Navigation Menu */}
        <nav className="transaction_nav">
          <ul>
            <li className={selectedComponent === 'transactions' ? 'active' : ''} onClick={() => setSelectedComponent('transactions')}>
              Transaction List
            </li>
            <li className={selectedComponent === 'create' ? 'active' : ''} onClick={() => setSelectedComponent('create')}>
              Create Transaction
            </li>
            <li className={selectedComponent === 'logs' ? 'active' : ''} onClick={() => setSelectedComponent('logs')}>
              Transaction Logs
            </li>
            <li className={selectedComponent === 'reports' ? 'active' : ''} onClick={() => setSelectedComponent('reports')}>
              Transaction Report
            </li>
          </ul>
        </nav>

        {/* Render Selected Component */}
        <section className="transaction_section">
          {renderComponent()}
        </section>
      </div>
    </div>
  );
};

export default TransactionManagement;

import React, { useState, useEffect } from 'react';
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from '../../api/transaction'; // Assume these are the API client functions
import TransactionForm from './TransactionForm'; // Form to handle creation/editing

const Transactions = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await fetchTransactions(token);
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }

    loadTransactions();
  }, [token]);

  const handleCreateTransaction = async (newTransaction) => {
    try {
      const createdTransaction = await addTransaction(newTransaction, token);
      setTransactions([...transactions, createdTransaction]);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction) => {
    try {
      const updatedData = await updateTransaction(updatedTransaction.id, updatedTransaction, token);
      setTransactions(transactions.map(t => t.id === updatedData.id ? updatedData : t));
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId, token);
      setTransactions(transactions.filter(t => t.id !== transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div>
      <h2>Transactions</h2>
      <TransactionForm
        onSubmit={selectedTransaction ? handleUpdateTransaction : handleCreateTransaction}
        transaction={selectedTransaction}
      />
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.transaction_type} - {transaction.amount} - {transaction.description}
            <button onClick={() => setSelectedTransaction(transaction)}>Edit</button>
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;

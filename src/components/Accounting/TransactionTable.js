import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from '../../api/transaction'; // Assume these are the API client functions

const transactions = [
  { id: 1, source: 'Sales', amount: '$1000', date: '2024-09-01' },
  { id: 2, source: 'Service', amount: '$500', date: '2024-09-02' },
  // Add more sample transactions
];

const TransactionTable = ({ token }) => {
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.transaction_id}>
              <TableCell>{transaction.transaction_id}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.transaction_date}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" size="small">Edit</Button>
                <Button variant="contained" color="secondary" size="small" sx={{ marginLeft: '10px' }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;

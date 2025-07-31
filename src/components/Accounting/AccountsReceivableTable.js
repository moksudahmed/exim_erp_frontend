import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const receivableData = [
  { id: 1, date: '2024-01-03', customer: 'Customer X', amount: 1200, status: 'Unpaid' },
  { id: 2, date: '2024-01-09', customer: 'Customer Y', amount: 500, status: 'Paid' },
];

const AccountsReceivableTable = () => {
  return (
    <Paper>
      <Typography variant="h6" align="center" gutterBottom>
        Accounts Receivable
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {receivableData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.customer}</TableCell>
              <TableCell>{entry.amount}</TableCell>
              <TableCell>{entry.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AccountsReceivableTable;

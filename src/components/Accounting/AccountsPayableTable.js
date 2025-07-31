import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const payableData = [
  { id: 1, date: '2024-01-02', vendor: 'Vendor A', amount: 2000, status: 'Unpaid' },
  { id: 2, date: '2024-01-08', vendor: 'Vendor B', amount: 1500, status: 'Paid' },
];

const AccountsPayableTable = () => {
  return (
    <Paper>
      <Typography variant="h6" align="center" gutterBottom>
        Accounts Payable
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payableData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.vendor}</TableCell>
              <TableCell>{entry.amount}</TableCell>
              <TableCell>{entry.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AccountsPayableTable;

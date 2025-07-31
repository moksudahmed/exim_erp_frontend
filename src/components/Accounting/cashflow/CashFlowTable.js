import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const CashFlowTable = ({ cashFlowData }) => {
  console.log("Cash Table");

  console.log(cashFlowData);
  return (
    <Paper sx={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Recent Cash Flow Activities</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Balance After</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cashFlowData.map((flow) => (
            <TableRow key={flow.id}>
              <TableCell>{new Date(flow.created_at).toLocaleString()}</TableCell>
              <TableCell>{flow.description}</TableCell>
              <TableCell>{flow.action_type}</TableCell>
              <TableCell>{flow.amount.toFixed(2)}</TableCell>
              <TableCell>{flow.register_balance_after.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default CashFlowTable;

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer,Typography, TableHead, TableRow, Paper, Button } from '@mui/material';
import {
  fetchLedger
} from '../../../api/journal_entries'; // Assume these are the API client functions

/*const ledgerData1 = [
  { id: 1, date: '2024-01-01', description: 'Opening Balance', debit: 1000, credit: 0, balance: 1000 },
  { id: 2, date: '2024-01-05', description: 'Sale Invoice 001', debit: 0, credit: 500, balance: 1500 },
  { id: 3, date: '2024-01-10', description: 'Purchase Order 002', debit: 700, credit: 0, balance: 800 },
];
*/
const JournalEntryTable = ({token}) => {
  const [ledgerData, setLedgerData] = useState([]);
  const [selectedLedgerData, setSelectedLedgerData] = useState(null);

  useEffect(() => {
    async function loadLedgerData() {
      try {
        const data = await fetchLedger(token);
        setLedgerData(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }

    loadLedgerData();
  }, [token]);


  return (
    <Paper>
      <Typography variant="h6" align="center" gutterBottom>
        General Ledger
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Debit</TableCell>
            <TableCell>Credit</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ledgerData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.created_at}</TableCell>
              <TableCell>{entry.account_name}</TableCell>
              <TableCell>{entry.debit}</TableCell>
              <TableCell>{entry.credit}</TableCell>
              <TableCell>{entry.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default JournalEntryTable;

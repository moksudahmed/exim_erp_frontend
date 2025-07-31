// LCStep2Realize.jsx
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import LCJournalEntryForm from './LCJournalEntryForm';
import { getTodayDate } from './lcUtils';

const LCStep2Realize = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <InventoryIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h5" fontWeight="600">
          Step 2: Realize Letter of Credit
        </Typography>
        <Chip 
          label="Inventory Arrival" 
          color="secondary" 
          sx={{ ml: 2, fontWeight: 500 }} 
        />
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Record inventory arrival and bank commissions payable to the supplier. This step confirms the 
        receipt of goods and establishes the payment obligations.
      </Typography>
      
      <LCJournalEntryForm
        title="L/C Realization Details"
        ref_no={`LC-REALIZE-${Date.now()}`}
        description="Inventory arrival + bank commission payable to supplier"
        transaction_date={getTodayDate()}
        lc_reference="LC2025/001"
        supplier_id={23}
        prefilledLines={[
          { account_name: 'Inventory', debitcredit: 'DEBIT', amount: 100000 },
          { account_name: 'L/C Commission', debitcredit: 'DEBIT', amount: 5000 },
          { account_name: 'Supplier', debitcredit: 'CREDIT', amount: 105000 }
        ]}
      />
    </Box>
  );
};

export default LCStep2Realize;
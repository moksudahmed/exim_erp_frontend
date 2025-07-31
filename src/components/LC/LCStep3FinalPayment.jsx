// LCStep3FinalPayment.jsx
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import LCJournalEntryForm from './LCJournalEntryForm';
import { getTodayDate } from './lcUtils';

const LCStep3FinalPayment = () => {
  const prefilledLines = [
    { account_name: 'Supplier', debitcredit: 'DEBIT', amount: 105000 },
    { account_name: 'Bank', debitcredit: 'CREDIT', amount: 105000 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <PaymentIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h5" fontWeight="600">
          Step 3: Final Payment to Supplier
        </Typography>
        <Chip 
          label="Settlement" 
          color="success" 
          sx={{ ml: 2, fontWeight: 500 }} 
        />
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Record the final payment made to the supplier under the L/C agreement. This completes the 
        Letter of Credit lifecycle and settles all financial obligations.
      </Typography>
      
      <LCJournalEntryForm
        title="Final Payment Details"
        ref_no={`LC-FINAL-${Date.now()}`}
        description="Recording final payment made to the supplier under the L/C agreement."
        transaction_date={getTodayDate()}
        account_type="LC"
        prefilledLines={prefilledLines}
      />
    </Box>
  );
};

export default LCStep3FinalPayment;
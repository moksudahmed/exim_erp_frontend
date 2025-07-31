// LCStep1Issue.jsx
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Description as LcIcon } from '@mui/icons-material';
import LCJournalEntryForm from './LCJournalEntryForm';
import { getTodayDate } from './lcUtils';

const LCStep1Issue = () => {
  const lcRef = `LC-ISSUE-${Date.now()}`;
  const today = getTodayDate();

  const prefilledLines = [
    { account_name: 'L/C Margin', debitcredit: 'DEBIT', amount: 100000 },
    { account_name: 'Bank', debitcredit: 'CREDIT', amount: 100000 }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <LcIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h5" fontWeight="600">
          Step 1: Issue Letter of Credit
        </Typography>
        <Chip 
          label="Initial Step" 
          color="primary" 
          sx={{ ml: 2, fontWeight: 500 }} 
        />
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create the initial Letter of Credit agreement with margin payment. This establishes the credit 
        arrangement between the buyer and seller under the bank's guarantee.
      </Typography>
      
      <LCJournalEntryForm
        title="L/C Issuance Details"
        ref_no={lcRef}
        description="Issuing Letter of Credit with margin payment"
        transaction_date={today}
        lc_reference={lcRef}
        prefilledLines={prefilledLines}
      />
    </Box>
  );
};

export default LCStep1Issue;
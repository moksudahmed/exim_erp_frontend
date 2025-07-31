import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const FinancialReport = () => {
  return (
    <Paper>
      <Typography variant="h6" align="center" gutterBottom>
        Financial Reports
      </Typography>
      <Box sx={{ padding: '20px' }}>
        <Typography variant="subtitle1">Profit & Loss Statement</Typography>
        <Typography variant="body2">Net Income: $5000</Typography>

        <Typography variant="subtitle1" sx={{ marginTop: '20px' }}>Balance Sheet</Typography>
        <Typography variant="body2">Assets: $20,000</Typography>
        <Typography variant="body2">Liabilities: $8,000</Typography>
        <Typography variant="body2">Equity: $12,000</Typography>

        <Typography variant="subtitle1" sx={{ marginTop: '20px' }}>Cash Flow Statement</Typography>
        <Typography variant="body2">Operating Cash Flow: $4,000</Typography>
        <Typography variant="body2">Investing Cash Flow: -$1,000</Typography>
        <Typography variant="body2">Financing Cash Flow: $1,000</Typography>
      </Box>
    </Paper>
  );
};

export default FinancialReport;

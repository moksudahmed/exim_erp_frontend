import React, { useState } from 'react';
import { Tab, Tabs, Box, Paper, Typography } from '@mui/material';

const DebtorCreditorTabs = () => {
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Paper sx={{ padding: '20px' }}>
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label="Debtors" />
          <Tab label="Creditors" />
        </Tabs>

        {value === 0 && (
          <Box sx={{ padding: '20px' }}>
            <Typography variant="h6">Debtors</Typography>
            {/* Display debtor details */}
          </Box>
        )}
        {value === 1 && (
          <Box sx={{ padding: '20px' }}>
            <Typography variant="h6">Creditors</Typography>
            {/* Display creditor details */}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DebtorCreditorTabs;

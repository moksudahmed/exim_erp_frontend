import React from 'react';
import { Paper, Typography } from '@mui/material';

const RegisterStatus = ({ registerStatus }) => {
  return (
    <Paper sx={{ padding: '20px', textAlign: 'center' }}>
      <Typography variant="h6">Register Status</Typography>
      <Typography variant="body1">
        Balance: {registerStatus.balance.toFixed(2)} USD
      </Typography>
      <Typography variant="body1">
        Status: {registerStatus.isOpen ? 'Open' : 'Closed'}
      </Typography>
    </Paper>
  );
};

export default RegisterStatus;

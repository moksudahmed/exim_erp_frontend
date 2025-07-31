import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Typography } from '@mui/material';

const CashActionForm = ({ isRegisterOpen, fetchCashFlowData, token }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [actionType, setActionType] = useState('CASH_INFLOW'); // Default to inflow

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRegisterOpen) return alert("Register is closed!");

    // Submit cash action to the backend
    const response = await fetch(`/api/cashflow/${actionType.toLowerCase()}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, description }),
    });

    if (response.ok) {
      setAmount('');
      setDescription('');
      fetchCashFlowData();
    } else {
      alert("Error recording cash action.");
    }
  };

  return (
    <Paper sx={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Record Cash Inflow/Outflow</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
              type="number"
              inputProps={{ min: "0", step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={!isRegisterOpen}
            >
              Record {actionType === 'CASH_INFLOW' ? 'Inflow' : 'Outflow'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CashActionForm;

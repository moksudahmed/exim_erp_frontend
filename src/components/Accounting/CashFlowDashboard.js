import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, Box, TextField } from '@mui/material';
import CashFlowTable from './cashflow/CashFlowTable';
import RegisterStatus from './cashflow/RegisterStatus';
import CashActionForm from './cashflow/CashActionForm';
import { fetchCashFlowData, fetchRegisterStatusData, addRegisterAction } from '../../api/cashflow';

const CashFlowDashboard = ({ token, isAuthenticated }) => {
  const [cashFlowData, setCashFlowData] = useState([]);
  const [registerStatus, setRegisterStatus] = useState({
    balance: 0,
    isOpen: false,
  });
  const [openingBalance, setOpeningBalance] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated && token) {
          fetchCashFlow();
          fetchRegisterStatus();
        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };
    loadData();
  }, [isAuthenticated, token]);

  const fetchCashFlow = async () => {
    const data = await fetchCashFlowData(token);
    setCashFlowData(data);
  };

  const fetchRegisterStatus = async () => {
    try {
      const data = await fetchRegisterStatusData(token);            
      setRegisterStatus({
        balance: data.register_balance,
        isOpen: data.status === 'open',
      });
    } catch (error) {
      console.error('Failed to fetch register status:', error.message);
    }
  };

  const handleRegisterAction = async (actionType) => {
    let requestBody = {};
    if (actionType === 'open-register') {
      requestBody = {        
        user_id: 1, // Adjust this with dynamic user ID if necessary
        amount: parseFloat(openingBalance), // Adjust this with dynamic initial amount if necessary
        description: 'Opening register for the day' // Optional description
      };
    }else{
      requestBody = {        
        user_id: 1, // Adjust this with dynamic user ID if necessary        
        description: 'Closing register for the day' // Optional description
      };
    }        
    const response = await addRegisterAction(token, actionType, requestBody);         
    if (response.ok) {
      fetchRegisterStatus();
    }
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Cash Flow Dashboard
      </Typography>

      {/* Register Status Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <RegisterStatus registerStatus={registerStatus} />
        </Grid>
        <Grid item xs={12} md={6}>
          {!registerStatus.isOpen && (
            <TextField
              label="Opening Balance"
              variant="outlined"
              fullWidth
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              sx={{ marginBottom: '10px' }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRegisterAction('open-register')}
            disabled={registerStatus.isOpen || !openingBalance}
            fullWidth
          >
            Open Register
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleRegisterAction('close-register')}
            disabled={!registerStatus.isOpen}
            fullWidth
            sx={{ marginTop: '10px' }}
          >
            Close Register
          </Button>
        </Grid>
      </Grid>

      {/* Cash Inflow/Outflow Form */}
      <CashActionForm
        isRegisterOpen={registerStatus.isOpen}
        fetchCashFlowData={fetchCashFlowData}
        token={token}
      />

      {/* Cash Flow Table */}
      <CashFlowTable cashFlowData={cashFlowData} />
    </Box>
  );
};

export default CashFlowDashboard;

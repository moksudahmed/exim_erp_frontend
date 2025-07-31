import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Tab, Tabs } from '@mui/material';
import TransactionTable from './TransactionTable';
import SummaryCards from './SummaryCards';
import CashFlowChart from './CashFlowChart';
import DebtorCreditorTabs from './DebtorCreditorTabs';
import JournalEntryTable from './JournalEntryTable';
import AccountsPayableTable from './AccountsPayableTable';
import AccountsReceivableTable from './AccountsReceivableTable';
import FinancialReport from './FinancialReport';
import CashFlowDashboard from './CashFlowDashboard';
import JournalEntryDashboard from './JournalEntryDashboard';
import JournalEntryOverview from './JournalEntryOverview';
import JournalItemsOverview from './JournalItemsOverview';

const Dashboard = ({ token, isAuthenticated }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>    

      {/* Tabs for different sections of the dashboard */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Dashboard" />
        <Tab label="General Ledger" />
        <Tab label="Journal Entries" />        
      </Tabs>

      {/* Tab Panels */}
      {activeTab === 0 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            General Ledger Dashboard
          </Typography>
          <JournalEntryDashboard token={token} />
          {/*<JournalEntryTable token={token}/>*/}
        </Paper>
      )}


      {activeTab === 1 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            General Ledger Overview
          </Typography>
          <JournalEntryOverview />
          {/*<JournalEntryTable token={token}/>*/}
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
          Journal Overview
          </Typography>
          <JournalItemsOverview />
        </Paper>
      )}
      
    </Box>
  );
};

export default Dashboard;

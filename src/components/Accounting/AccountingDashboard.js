import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Tab, Tabs } from '@mui/material';
import TransactionTable from './TransactionTable';
import SummaryCards from './SummaryCards';
import CashFlowChart from './CashFlowChart';
import DebtorCreditorTabs from './DebtorCreditorTabs';
import JournalEntryTable from './journal_entries/JournalEntryTable';
import AccountsPayableTable from './AccountsPayableTable';
import AccountsReceivableTable from './AccountsReceivableTable';
import FinancialReport from './FinancialReport';
import CashFlowDashboard from './CashFlowDashboard';
import JournalEntryDashboard from './journal_entries/JournalEntryDashboard';
import Dashboard from './Dashboard';
import AccountManagement from './AccountManagement';
import CreateJournalItemsForm from './journal/CreateJournalItemsForm';
import CreateLedgerWithItemsForm from './CreateLedgerWithItemsForm';
import { fetchAccounts, addAccount } from '../../api/account';
import { fetchAccountTypes, fetchAccountAction } from '../../api/enum_types';
import ReportsDashboard from './financial_reports/ReportsDashboard';


const AccountingDashboard = ({ token, isAuthenticated }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountNatureType, setAccountNatureType] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

    useEffect(() => {
      const loadData = async () => {
        try {
          if (token) {
            const fetchedAccountTypes = await fetchAccountTypes(token);
            setAccountTypes(fetchedAccountTypes);
  
            const fetchedAccounts = await fetchAccounts(token);
            setAccounts(fetchedAccounts);

            const fetchedAccountAction = await fetchAccountAction(token);
            setAccountNatureType(fetchedAccountAction);
          }
        } catch (error) {
          console.error('Failed to load data:', error.message);
        }
      };
  
      loadData();
    }, [token]);
  
  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Accounting Dashboard
      </Typography>

      {/* Tabs for different sections of the dashboard */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Summary" />
        <Tab label="Account Dashboard" />
        <Tab label="General Ledger Dashboard" />
        <Tab label="Accounts Payable" />
        <Tab label="Accounts Receivable" />
        <Tab label="Financial Reports" />
        <Tab label="Cash Flow" />       
      </Tabs>

      {/* Tab Panels */}
      {activeTab === 0 && (
        <>
          {/* Summary Cards */}
          <SummaryCards />

          {/* Transaction Table and Cash Flow Chart */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ padding: '20px' }}>
                <TransactionTable token={token} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: '20px' }}>
                <CashFlowChart />
              </Paper>
            </Grid>
          </Grid>

          {/* Debtors and Creditors Tabs */}
          <DebtorCreditorTabs />
        </>
      )}

      {activeTab === 1 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>         
          <AccountManagement token={token} accounts={accounts} accountTypes={accountTypes} setAccounts={setAccounts} 
          setAccountTypes={setAccountTypes} accountNatureType={accountNatureType}/>
          {/*<JournalEntryTable token={token}/>*/}
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>         
          <Dashboard token={token} isAuthenticated={isAuthenticated}/>
          {/*<JournalEntryTable token={token}/>*/}
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Accounts Payable
          </Typography>
          <AccountsPayableTable />
        </Paper>
      )}

      {activeTab === 4 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Accounts Receivable
          </Typography>
          <AccountsReceivableTable />
        </Paper>
      )}

      {activeTab === 5 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Financial Reports
          </Typography>
          <ReportsDashboard token={token}/>
        </Paper>
      )}
      {activeTab === 6 && (
        <Paper sx={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Cash Flow</Typography>
          <CashFlowDashboard token={token} isAuthenticated={isAuthenticated} />
        </Paper>
      )}
      
    </Box>
  );
};

export default AccountingDashboard;

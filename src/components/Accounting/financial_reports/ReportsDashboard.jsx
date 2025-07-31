// Dashboard.js
import React, { useState, useEffect } from 'react';
import './reports.css';
import BalanceSheet from './BalanceSheet';

import IncomeStatement from './IncomeStatement';
import CashFlowStatement from './CashFlowStatement';
import TrialBalance from './TrialBalance';
import GeneralLedger from './GeneralLedger';
import TaxReports from './TaxReports';

const ReportsDashboard = ({ token }) => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard'); // Default view
  const [selectedLedgerID, setSelectedLedgerID] = useState('');
  const [accounts, setAccounts] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        if (token) {
          
        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };

    loadData();
  }, [token]);
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'balance-sheet':
        return <BalanceSheet token={token} />;
      case 'income-statement':
        return <IncomeStatement token={token} />;
      case 'cash-flow':
        return <CashFlowStatement token={token} />;
      case 'trial-balance':
        return <TrialBalance token={token} />;
      case 'general-ledger':
        return <GeneralLedger token={token} />;
      case 'tax-reports':
        return <TaxReports token={token} />;
      
          
      default:
        return <BalanceSheet token={token} />;
    }
  };

  return (
    <div className="accounting_page_container">  
      <div className="accounting_page_content">
        {/* Navigation Menu */}
        <nav className="accounting_nav">
          <ul>
            <li
              className={selectedComponent === 'balance-sheet' ? 'active' : ''}
              onClick={() => setSelectedComponent('balance-sheet')}
            >
              BalanceSheet
            </li>
            <li
              className={selectedComponent === 'income-statement' ? 'active' : ''}
              onClick={() => setSelectedComponent('income-statement')}
            >
              Income Statement
            </li>
            <li
              className={selectedComponent === 'cash-flow' ? 'active' : ''}
              onClick={() => setSelectedComponent('cash-flow')}
            >
             cash-flow
            </li>
            <li
              className={selectedComponent === 'trial-balance' ? 'active' : ''}
              onClick={() => setSelectedComponent('trial-balance')}
            >
               trial-balance
            </li>
            <li
              className={selectedComponent === 'general-ledger' ? 'active' : ''}
              onClick={() => setSelectedComponent('general-ledger')}
            >
             general-ledger
            </li>
            <li
              className={selectedComponent === 'tax-reports' ? 'active' : ''}
              onClick={() => setSelectedComponent('tax-reports')}
            >
              tax-reports
            </li>
          </ul>
        </nav>        
        {/* Render Selected Component */}
        <section className="accounting_section">{renderComponent()}</section>
      </div>
    </div>
  );
};

export default ReportsDashboard;

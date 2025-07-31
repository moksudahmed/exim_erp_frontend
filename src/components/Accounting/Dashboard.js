// Dashboard.js
import React, { useState, useEffect } from 'react';
import './styles/dashboard.css';
import JournalEntryOverview from './journal_entries/JournalEntryOverview';
import JournalItemsOverview from './journal/JournalItemsOverview';
import CreateLedgerWithItemsForm from './CreateLedgerWithItemsForm';
import JournalItemsList from './journal/JournalItemsList';
import CreateJournalItemsForm from './journal/CreateJournalItemsForm';
import JournalEntryDashboard from './journal_entries/JournalEntryDashboard';
import { fetchAccounts } from '../../api/account';
import Ledger from './journal_entries/Ledger';
import LedgerView from './ledger/LedgerView';

const AccountingDashboard = ({ token }) => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard'); // Default view
  const [selectedLedgerID, setSelectedLedgerID] = useState('');
  const [accounts, setAccounts] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        if (token) {
          const fetchedAccounts = await fetchAccounts(token);
          setAccounts(fetchedAccounts);          
        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };

    loadData();
  }, [token]);
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'dashboard':
        return <JournalEntryDashboard token={token} />;
      case 'ledgeroverview':
        return <JournalEntryOverview token={token} setSelectedLedgerID={setSelectedLedgerID}/>;
      case 'createledger':
          return <CreateLedgerWithItemsForm token={token} accounts={accounts}/>;
      case 'journalitemsform':
        return <CreateJournalItemsForm token={token} JournalEntryId={selectedLedgerID} accounts={accounts}/>;
      case 'journalitemslist':
        return <JournalItemsList token={token} />;
      case 'journaloverview':
        return <JournalItemsOverview token={token} />;
      case 'ledger':
          return <Ledger token={token} accounts={accounts} accountId={2}/>;
      case 'ledgerview':
          return <LedgerView token={token} accounts={accounts}/>;
      
          
      default:
        return <JournalEntryDashboard token={token} />;
    }
  };

  return (
    <div className="accounting_page_container">  
      <div className="accounting_page_content">
        {/* Navigation Menu */}
        <nav className="accounting_nav">
          <ul>
            <li
              className={selectedComponent === 'dashboard' ? 'active' : ''}
              onClick={() => setSelectedComponent('dashboard')}
            >
              Dashboard
            </li>
            <li
              className={selectedComponent === 'journalitemsform' ? 'active' : ''}
              onClick={() => setSelectedComponent('journalitemsform')}
            >
              Journal Entry Form
            </li>
            <li
              className={selectedComponent === 'journalitemslist' ? 'active' : ''}
              onClick={() => setSelectedComponent('journalitemslist')}
            >
              Journal Entry List
            </li>
            <li
              className={selectedComponent === 'ledgeroverview' ? 'active' : ''}
              onClick={() => setSelectedComponent('ledgeroverview')}
            >
              Ledger Overview
            </li>
            <li
              className={selectedComponent === 'createledger' ? 'active' : ''}
              onClick={() => setSelectedComponent('createledger')}
            >
              Create Ledger
            </li>
            <li
              className={selectedComponent === 'journaloverview' ? 'active' : ''}
              onClick={() => setSelectedComponent('journaloverview')}
            >
              Journal Entry Overview
            </li>
            <li
              className={selectedComponent === 'ledger' ? 'active' : ''}
              onClick={() => setSelectedComponent('ledger')}
            >
              Ledger
            </li> 

            <li
              className={selectedComponent === 'ledgerview' ? 'active' : ''}
              onClick={() => setSelectedComponent('ledgerview')}
            >
              Ledger View
            </li> 
                
          </ul>
        </nav>        
        {/* Render Selected Component */}
        <section className="accounting_section">{renderComponent()}</section>
      </div>
    </div>
  );
};

export default AccountingDashboard;

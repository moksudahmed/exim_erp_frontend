import React, { useEffect, useState } from 'react';
//import api from '../../../api/accounting'; // Assuming you have an API service
import { fetchAccounts } from '../../../api/account';
import { fetchLedger } from '../../../api/journal_entries';
import { getLedgerEntries } from '../../../api/accounting';
import './ledger.css';

const LedgerView = ({token, accounts}) => {
  const [ledger, setLedger] = useState([]);
 // const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    account_id: '',
    start_date: '',
    end_date: ''
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setStatus('loading');
        
        // Fetch accounts
      /*  const accountsResponse = await fetchAccounts();
        console.log(accountsResponse);
        setAccounts(accountsResponse.data);*/
        
        // Fetch ledger with filters
        //const ledgerResponse = await getLedgerEntries(filters);
        //setLedger(ledgerResponse.data);

        const ledgerResponse =  await getLedgerEntries(token);
         setLedger(ledgerResponse);   
        
        setStatus('succeeded');
      } catch (err) {
        setError(err.message);
        setStatus('failed');
      }
    };

    loadData();
  }, [filters]);

  // Get account name by ID
  const getAccountName = (accountId) => {
    if (!accounts || accounts.length === 0) return accountId;
    const account = accounts.find(a => a.id === accountId);
    return account ? `${account.code} - ${account.name}` : accountId;
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Refresh data
  const refreshData = async () => {
    try {
      setStatus('loading');
      const response = await getLedgerEntries(filters);
      setLedger(response.data);
      setStatus('succeeded');
      setError(null);
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  if (status === 'loading') return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading ledger data...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h3>Error Loading Ledger</h3>
      <p>{error}</p>
      <button onClick={refreshData}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="ledger-container">
      <div className="ledger-header">
        <h2>General Ledger</h2>
        
        {/* Filters */}
        <div className="ledger-filters">
          <select 
            name="account_id" 
            value={filters.account_id}
            onChange={handleFilterChange}
          >
            <option value="">All Accounts</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.code} - {account.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            placeholder="From Date"
          />

          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            placeholder="To Date"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="table-responsive">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {ledger.length > 0 ? (
              ledger.map((entry) => (
                <tr key={entry.id} className={entry.type.toLowerCase()}>
                  <td>{new Date(entry.entry_date).toLocaleDateString()}</td>
                  <td>{getAccountName(entry.account_id)}</td>
                  <td className="entry-type">{entry.type}</td>
                  <td className="amount">{formatCurrency(entry.amount)}</td>
                  <td className="balance">{formatCurrency(entry.balance)}</td>
                  <td>{entry.journal_item?.description || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No ledger entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {ledger.length > 0 && (
        <div className="ledger-summary">
          <p>
            Showing {ledger.length} entries
            {filters.account_id && ` for account ${getAccountName(filters.account_id)}`}
            {filters.start_date && ` from ${filters.start_date}`}
            {filters.end_date && ` to ${filters.end_date}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default LedgerView;
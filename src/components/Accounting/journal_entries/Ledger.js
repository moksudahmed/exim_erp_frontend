import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../styles/ledger.css';
import { fetchJournalWithAccount } from '../../../api/journal_items';
import { Table, Button, Input, Select, message, DatePicker } from 'antd';
import Journals from './Journals';

const { Option } = Select;

const Ledger = ({ token, accounts }) => {
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const selectedAccount = accounts.find((a) => a.account_id === selectedAccountId);

  useEffect(() => {
    const loadData = async () => {
      if (token && selectedAccountId) {
        try {
          const fetchedEntries = await fetchJournalWithAccount(token, selectedAccountId);
          setJournalEntries(fetchedEntries);
        } catch (error) {
          console.error('Failed to load data:', error.message);
        }
      }
    };

    loadData();
  }, [token, selectedAccountId]);

  const handleAccountChange = (value) => {
    setSelectedAccountId(value);
  };

  return (
    <div className="ledger-container">
      <div><strong>Select an Account: </strong>
      <Select
        placeholder="Select Account"
        onChange={handleAccountChange}
        value={selectedAccountId}
        style={{ width: 200, marginBottom: 20 }}
      >
        {accounts.map((account) => (
          <Option key={account.account_id} value={account.account_id}>
            {account.account_name}
          </Option>
        ))}
      </Select></div>
        <Journals journalEntries={journalEntries} selectedAccount={selectedAccount} />
    </div>
  );
};


export default Ledger;

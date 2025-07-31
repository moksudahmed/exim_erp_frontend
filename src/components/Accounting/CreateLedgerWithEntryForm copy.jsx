import React, { useState, useEffect } from 'react';
import { Button, Select, Radio } from 'antd';
import axios from 'axios';
import './styles/CreateLedgerWithEntryForm.css';
import { fetchAccounts } from '../../api/account';

const { Option } = Select;

const CreateLedgerWithEntryForm = ({ token }) => {
  const [accounts, setAccounts] = useState([]);

  const [ledger, setLedger] = useState({
    account_name: '',
    account_type: '',
    debit: '',
    credit: '',
    user_id: ''   
  });

  const [journalItems, setJournalItems] = useState({
    entry_type: '',
    debitcredit: '', // Field for Debit or Credit
    amount: '',
    description: '',
    transaction_date: '',
    account_id: '',
  });

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

  const handleLedgerChange = (e) => {
    setLedger({ ...ledger, [e.target.name]: e.target.value });
  };

  const handleJournalItemsItemsChange = (e) => {
    setJournalItems({ ...journalItems, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e) => {
    setJournalItems({ ...journalItems, debitcredit: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/general-ledger/ledger-with-entry/', {
        journal_entries: ledger,
        journal_items: journalItems,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Success:', response.data);

      // Reset the form after successful submission
      setLedger({
        account_name: '',
        account_type: '',
        debit: '',
        credit: '',
        user_id: '',       
      });
      setJournalItems({
        entry_type: '',
        debitcredit: '',
        amount: '',
        description: '',
        transaction_date: '',
        account_id: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Create General Ledger with Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>General Ledger</h3>
          <label>
            Account Name:
            <input
              type="text"
              name="account_name"
              value={ledger.account_name}
              onChange={handleLedgerChange}
              required
            />
          </label>
          <label>
            Account Type:
            <select
              name="account_type"
              value={ledger.account_type}
              onChange={handleLedgerChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Equity">Equity</option>
              <option value="Revenue">Income/Revenue</option>
              <option value="Expense">Expense</option>
            </select>
          </label>
          <label>
            Debit:
            <input
              type="number"
              name="debit"
              value={ledger.debit}
              onChange={handleLedgerChange}
              step="0.01"
            />
          </label>
          <label>
            Credit:
            <input
              type="number"
              name="credit"
              value={ledger.credit}
              onChange={handleLedgerChange}
              step="0.01"
            />
          </label>
          <label>
            User ID:
            <input
              type="number"
              name="user_id"
              value={ledger.user_id}
              onChange={handleLedgerChange}
              required
            />
          </label>
        </div>

        <div className="form-section">
          <h3>Journal Entry</h3>
          <label>
            Entry Type:
            <input
              type="text"
              name="entry_type"
              value={journalItems.entry_type}
              onChange={handleJournalItemsChange}
              required
            />
          </label>
          <label>
            Account:
            <Select
              name="account_id"
              value={journalItems.account_id}
              onChange={(value) => setJournalItems({ ...journalItems, account_id: value })}
              placeholder="Select account"
              required
            >
              {accounts.map((item) => (
                <Option key={item.account_id} value={item.account_id}>
                  {item.account_name}
                </Option>
              ))}
            </Select>
          </label>

          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={journalItems.amount}
              onChange={handleJournalItemsChange}
              step="0.01"
              required
            />
          </label>

          <label>
            Debit or Credit:
            <Radio.Group
              name="debitcredit"
              onChange={handleRadioChange}
              value={journalItems.debitcredit}
              required
            >
              <Radio value="DEBIT">Debit</Radio>
              <Radio value="CREDIT">Credit</Radio>
            </Radio.Group>
          </label>

          <label>
            Description:
            <input
              type="text"
              name="description"
              value={journalItems.description}
              onChange={handleJournalItemsChange}
            />
          </label>
          <label>
            Transaction Date:
            <input
              type="date"
              name="transaction_date"
              value={journalItems.transaction_date}
              onChange={handleJournalItemsChange}
              required
            />
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateLedgerWithEntryForm;

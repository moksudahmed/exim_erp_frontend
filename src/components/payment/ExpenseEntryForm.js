import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchClients } from "../../api/client";
import { fetchAccounts } from '../../api/account';
import { fetchSubsidiaryAccounts } from '../../api/subsidiary_account';
import './ExpenseEntryForm.css';
import { addExpense } from '../../api/expense';


const ExpenseEntryForm = ({ isAuthenticated, token }) => {
  const [accounts, setAccounts] = useState([]);
  const [subAccounts, setSubAccounts] = useState([]);
  const [clients, setClients] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [form, setForm] = useState({
    ref_no: '',
    account_id: '',
    subsidiary_account_id: '',
    amount: '',
    description: '',
    narration: '',
    client_id: '',
    transaction_date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (token) {
          const [fetchedAccounts, fetchedClients, fetchedSubs] = await Promise.all([
            fetchAccounts(token),
            fetchClients(token),
            fetchSubsidiaryAccounts(token)
          ]);
          setAccounts(fetchedAccounts);
          setClients(fetchedClients);
          setSubAccounts(fetchedSubs);
        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };
    loadData();
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'subsidiary_account_id' && value) {
      const selected = subAccounts.find(sa => String(sa.subsidiary_account_id) === value);
      if (selected) {
        setForm(prev => ({ ...prev, account_id: selected.account_id }));
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      //await axios.post('/api/expenses', form);
      await addExpense(form, token);
      alert('✅ Expense recorded successfully!');
      setForm({
        ref_no: '',
        account_id: '',
        subsidiary_account_id: '',
        amount: '',
        description: '',
        narration: '',
        client_id: '',
        transaction_date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      console.error('Submit error:', err);
      alert('❌ Failed to record expense.');
    }
  };

  return (
    <div className="expense-form-container">
      <h2 className="expense-form-title">Expense Entry</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <label>Reference No</label>
          <input name="ref_no" value={form.ref_no} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Subsidiary Account</label>
          <select name="subsidiary_account_id" value={form.subsidiary_account_id} onChange={handleChange}>
            <option value="">Select Subsidiary Account</option>
            {subAccounts.map(sa => (
              <option key={sa.subsidiary_account_id} value={sa.subsidiary_account_id}>
                {sa.account_name} ({sa.account_holder || sa.account_no})
              </option>
            ))}
          </select>
        </div>

        {showAdvanced && (
          <div className="form-row">
            <label>Account (Override)</label>
            <select name="account_id" value={form.account_id} onChange={handleChange}>
              <option value="">Select Account</option>
              {accounts.map(acc => (
                <option key={acc.account_id} value={acc.account_id}>{acc.account_name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-row checkbox-row">
          <label>Advanced Options</label>
          <input type="checkbox" checked={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)} />
        </div>

        <div className="form-row">
          <label>Client (Optional)</label>
          <select name="client_id" value={form.client_id} onChange={handleChange}>
            <option value="">Select Client</option>
            {clients.map(cli => (
              <option key={cli.client_id} value={cli.client_id}>
                {cli.client_type} - ID {cli.client_id}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Amount</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
        </div>

        <div className="form-row full-width">
          <label>Narration</label>
          <textarea name="narration" value={form.narration} onChange={handleChange} rows="2" />
        </div>

        <div className="form-row full-width">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
        </div>

        <div className="form-row">
          <label>Transaction Date</label>
          <input type="date" name="transaction_date" value={form.transaction_date} onChange={handleChange} />
        </div>

        <div className="form-row full-width">
          <button type="submit" className="submit-btn">Submit Expense</button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseEntryForm;

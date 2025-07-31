// components/JournalEntryForm.js
import React, { useState } from 'react';
import axios from 'axios';

const accountTypes = ['asset', 'liability', 'equity', 'revenue', 'expense'];

const JournalEntryForm = ({ onLedgerAdded }) => {
  const [formData, setFormData] = useState({
    account_name: '',
    account_type: '',
    debit: '',
    credit: '',
    user_id: 1, // Example user_id, could be dynamic
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/general-ledger/', formData);
      onLedgerAdded();
    } catch (error) {
      console.error('Error adding ledger:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Account Name:</label>
      <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} required />
      
      <label>Account Type:</label>
      <select name="account_type" value={formData.account_type} onChange={handleChange} required>
        <option value="">Select Type</option>
        {accountTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
      </select>

      <label>Debit:</label>
      <input type="number" name="debit" value={formData.debit} onChange={handleChange} />

      <label>Credit:</label>
      <input type="number" name="credit" value={formData.credit} onChange={handleChange} />

      <button type="submit">Add Entry</button>
    </form>
  );
};

export default JournalEntryForm;

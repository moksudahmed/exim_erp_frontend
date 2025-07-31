// components/JournalItemsForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JournalItemsForm = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    entry_type: '',
    amount: '',
    description: '',
    journal_entries_id: ''
  });
  
  const [ledgers, setLedgers] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const API_URL = `${apiUrl}api/v1/general-ledger/`;

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const response = await axios.get(`${API_URL}`);
        setLedgers(response.data);
      } catch (error) {
        console.error('Error fetching ledgers:', error);
      }
    };
    fetchLedgers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/journal-entries/', formData);
      onEntryAdded();
    } catch (error) {
      console.error('Error adding journal entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Entry Type:</label>
      <input type="text" name="entry_type" value={formData.entry_type} onChange={handleChange} required />
      
      <label>General Ledger:</label>
      <input type="number" name="journal_entries_id" value={formData.journal_entries_id} onChange={handleChange} required />
      
      <label>Amount:</label>
      <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

      <label>Description:</label>
      <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

      <label>Linked General Ledger:</label>
      <select name="journal_entries_id" value={formData.journal_entries_id} onChange={handleChange} required>
        <option value="">Select General Ledger</option>
        {ledgers.map(ledger => <option key={ledger.id} value={ledger.id}>{ledger.account_name}</option>)}
      </select>

      <button type="submit">Add Entry</button>
    </form>
  );
};

export default JournalItemsForm;

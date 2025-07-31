import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateJournalItemsForm.css';

const CreateJournalItemsForm = ({ token, JournalEntryId }) => {
  const [entry, setEntry] = useState({
    entry_type: '',
    debit: '',
    credit: '',
    description: '',
    transaction_date: '',
  });

  const handleChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };
  const apiUrl = process.env.REACT_APP_API_URL;
  const API_URL = `${apiUrl}api/v1/general-ledger`;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/journal-entries/`, {
        ...entry,
        journal_entries_id: JournalEntryId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Journal entry created successfully:', response.data);
      setEntry({
        entry_type: '',
        debit: '',
        credit: '',
        description: '',
        transaction_date: '',
      });
    } catch (error) {
      console.error('Error creating journal entry:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Journal Entry</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Entry Type:
          <input
            type="text"
            name="entry_type"
            value={entry.entry_type}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          General Ledger ID:
          <input
            type="number"
            name="journal_entries_id"
            value={JournalEntryId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Debit:
          <input
            type="number"
            name="debit"
            value={entry.debit}
            onChange={handleChange}
            step="0.01"
            required
          />
        </label>
        <label>
          Credit:
          <input
            type="number"
            name="credit"
            value={entry.credit}
            onChange={handleChange}
            step="0.01"
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={entry.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Transaction Date:
          <input
            type="date"
            name="transaction_date"
            value={entry.transaction_date}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Create Entry</button>
      </form>
    </div>
  );
};

export default CreateJournalItemsForm;

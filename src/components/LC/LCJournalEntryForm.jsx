import React, { useState } from 'react';
import './styles/LCJournalEntryForm.css'; // Optional styling
import axios from 'axios';

const LCJournalEntryForm = ({
  title,
  ref_no,
  description,
  transaction_date,
  lc_reference, // e.g. LC2025/001
  supplier_id,  // optional for tracking
  prefilledLines = [],
  onSuccess = () => {}
}) => {
  const [lines, setLines] = useState(prefilledLines);
  const [loading, setLoading] = useState(false);

  const handleChangeAmount = (index, amount) => {
    const newLines = [...lines];
    newLines[index].amount = parseFloat(amount);
    setLines(newLines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ref_no,
        description,
        transaction_date,
        account_type: 'LC',
        lc_reference,
        supplier_id,
        journal_lines: lines
      };

      await axios.post('/api/v1/journal-entries', payload);
      onSuccess();
      alert('L/C Journal Entry Submitted Successfully');
    } catch (err) {
      console.error(err);
      alert('Error submitting L/C journal entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lc-journal-form">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        <div><strong>Ref No:</strong> {ref_no}</div>
        <div><strong>Date:</strong> {transaction_date}</div>
        <div><strong>Description:</strong> {description}</div>
        <div><strong>L/C Reference:</strong> {lc_reference}</div>
        {supplier_id && <div><strong>Supplier ID:</strong> {supplier_id}</div>}

        <table className="journal-lines-table">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Debit/Credit</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={index}>
                <td>{line.account_name}</td>
                <td>{line.debitcredit}</td>
                <td>
                  <input
                    type="number"
                    value={line.amount}
                    onChange={(e) => handleChangeAmount(index, e.target.value)}
                    step="0.01"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Entry'}
        </button>
      </form>
    </div>
  );
};

export default LCJournalEntryForm;

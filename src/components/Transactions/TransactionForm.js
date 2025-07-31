// components/Transactions/TransactionForm.js

import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, transaction }) => {
  const [formData, setFormData] = useState({
    transaction_type: transaction?.transaction_type || '',
    amount: transaction?.amount || '',
    description: transaction?.description || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Type:
        <input
          type="text"
          name="transaction_type"
          value={formData.transaction_type}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Amount:
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <button type="submit">{transaction ? 'Update' : 'Create'} Transaction</button>
    </form>
  );
};

export default TransactionForm;

// components/Transactions/TransactionList.js

import React from 'react';

const TransactionList = ({ transactions, onUpdateTransaction, onDeleteTransaction }) => {
  console.log(transactions);
  return (
    <div>
      <h2>All Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.transaction_type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.description}</td>
              <td>
                <button onClick={() => onUpdateTransaction(transaction)}>Edit</button>
                <button onClick={() => onDeleteTransaction(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;

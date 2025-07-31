// components/Transactions/TransactionReport.js

import React from 'react';

const TransactionReport = ({ transactions }) => {
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div>
      <h2>Transaction Report</h2>
      <p>Total Transactions: {transactions.length}</p>
      <p>Total Amount: ${totalAmount.toFixed(2)}</p>
    </div>
  );
};

export default TransactionReport;

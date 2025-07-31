// components/Transactions/TransactionLogs.js

import React from 'react';

const TransactionLogs = ({ transactionLogs }) => {
  return (
    <div>
      <h2>Transaction Logs</h2>
      <ul>
        {transactionLogs.map(log => (
          <li key={log.id}>
            {log.date}: {log.description} - {log.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionLogs;

import React, { useEffect, useState } from 'react';
import './../styles/ledger.css';


const Journals = ({ journalEntries, selectedAccount}) => {  
  
  return (
    <div>
        {selectedAccount && (
        <>
          <h2>General Ledger for {selectedAccount.account_name}</h2>
          <div className="ledger-header">
            <div><strong>General Ledger Sheet</strong></div>
            <div><strong>Sheet No:</strong> {selectedAccount.account_id}</div>
            <div><strong>Account:</strong> {selectedAccount.account_name}</div>
            <div><strong>Account No:</strong> {selectedAccount.account_id}</div>
          </div>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Details</th>
                <th>Ref</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {journalEntries.map((entry, index) => (
                <tr key={entry.id || `entry-${index}`}>
                  <td>{new Date(entry.created_at).toLocaleDateString()}</td>
                  <td>{entry.narration}</td>
                  <td>{entry.ref_no || '—'}</td>
                  <td>{entry.debitcredit === 'DEBIT' ? entry.amount.toFixed(2) : '—'}</td>
                  <td>{entry.debitcredit === 'CREDIT' ? entry.amount.toFixed(2) : '—'}</td>
                  <td>{calculateBalance(journalEntries, index).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

const calculateBalance = (entries, index) => {
  let balance = 0;
  for (let i = 0; i <= index; i++) {
    balance += entries[i].debitcredit === 'DEBIT' ? entries[i].amount : -entries[i].amount;
  }
  return balance;
};

export default Journals;

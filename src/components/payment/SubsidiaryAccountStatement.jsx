import React, { useState, useEffect, useRef } from 'react';
import './SubsidiaryAccountStatement.css';
import { fetchSubsidiaryAccountStatement } from '../../api/expense';
import { fetchSubsidiaryAccounts } from '../../api/subsidiary_account';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SubsidiaryAccountStatement = ({ token }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const statementRef = useRef(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetchSubsidiaryAccounts(token);
        setAccounts(res || []);
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };
    fetchAccounts();
  }, [token]);

  useEffect(() => {
    const fetchStatement = async () => {
      if (!selectedAccountId) return;
      setLoading(true);
      try {
         setTransactions([]);
        const data = await fetchSubsidiaryAccountStatement(selectedAccountId, token);
        setTransactions(data || []);
        if (data.length > 0) {
          setAccountInfo({
            name: data[0].account_name || 'N/A',
            type: data[0].subsidiary_type || 'N/A',
          });
        } else {
          setAccountInfo(null);
        }
      } catch (err) {
        console.error('Error fetching statement:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatement();
  }, [selectedAccountId, token]);

  const calculateRunningBalance = () => {
    let balance = 0;
    return transactions.map((entry) => {
      const amount = parseFloat(entry.amount) || 0;
      if (entry.debitcredit === 'DEBIT') {
        balance += amount;
      } else {
        balance -= amount;
      }
      return {
        ...entry,
        debit: entry.debitcredit === 'DEBIT' ? amount : 0,
        credit: entry.debitcredit === 'CREDIT' ? amount : 0,
        balance,
      };
    });
  };

  const totalDebit = transactions
    .filter((e) => e.debitcredit === 'DEBIT')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const totalCredit = transactions
    .filter((e) => e.debitcredit === 'CREDIT')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const balance = totalDebit - totalCredit;

  const handleExportPDF = async () => {
    const input = statementRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Subsidiary_Statement_${accountInfo?.name || 'Account'}.pdf`);
  };

  return (
    <div className="subsidiary-statement-container">
      <h2>📊 Subsidiary Account Statement</h2>

      <div className="filter-section">
        <label>Select Account: </label>
        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
        >
          <option value="">-- Select Account --</option>
          {accounts.map((acc) => (
            <option key={acc.subsidiary_account_id} value={acc.subsidiary_account_id}>
              {acc.account_name}
            </option>
          ))}
        </select>
      </div>

      {accountInfo && (
        <div className="account-card">
          <h3>Account Info</h3>
          <p><strong>Name:</strong> {accountInfo.name}</p>
          <p><strong>Type:</strong> {accountInfo.type}</p>
        </div>
      )}

      <button onClick={handleExportPDF} className="export-btn">Export as PDF</button>

      <div ref={statementRef}>
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length > 0 ? (
          <table className="statement-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {calculateRunningBalance().map((entry, index) => (
                <tr key={index}>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.description}</td>
                  <td className="amount-positive">
                    {entry.debit ? `${entry.debit.toLocaleString()} ৳` : ''}
                  </td>
                  <td className="amount-negative">
                    {entry.credit ? `${entry.credit.toLocaleString()} ৳` : ''}
                  </td>
                  <td>{entry.balance.toLocaleString()} ৳</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="2">Total</th>
                <th>{totalDebit.toLocaleString()} ৳</th>
                <th>{totalCredit.toLocaleString()} ৳</th>
                <th>{balance.toLocaleString()} ৳</th>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>No statement records found.</p>
        )}
      </div>
    </div>
  );
};

export default SubsidiaryAccountStatement;
